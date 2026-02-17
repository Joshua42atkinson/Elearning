use anyhow::Result;
use bevy::prelude::*;
use chrono::{DateTime, Utc};
use hnsw_rs::prelude::*;
use serde::{Deserialize, Serialize};
use sled::Db;
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::sync::{Arc, RwLock};
use uuid::Uuid;

// ============================================================================
// Internal Types
// ============================================================================

#[derive(Debug, Serialize, Deserialize, Clone)]
struct StoredMemory {
    id: Uuid,
    content: String,
    source: String,
    embedding: Vec<f32>,
    session_id: Option<Uuid>,
    metadata: Option<serde_json::Value>,
    created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MemoryFragment {
    pub id: Uuid,
    pub content: String,
    pub source: String,
    pub timestamp: DateTime<Utc>,
    pub similarity: f32,
}

#[derive(Debug, Serialize)]
pub struct StatsResponse {
    pub total_memories: usize,
    pub storage_bytes: u64,
    pub sessions: usize,
}

// ============================================================================
// Memory Store
// ============================================================================

#[derive(Resource, Clone)]
pub struct MemoryStoreResource(pub Arc<MemoryStore>);

pub struct MemoryStore {
    db: Db,
    // In-memory HNSW index
    index: Arc<RwLock<Hnsw<'static, f32, DistCosine>>>,
    // Mapping from HNSW integer ID to UUID
    id_map: Arc<RwLock<HashMap<usize, Uuid>>>,
    // Reverse mapping for updates (optional, skipped for simplicity)
    next_id: Arc<RwLock<usize>>,
}

impl MemoryStore {
    /// Create a new memory store
    pub fn new(data_dir: &Path) -> Result<Self> {
        let db_path = data_dir.join("memories.sled");
        let db = sled::open(&db_path)?;
        info!("📦 Opened sled database at {}", db_path.display());

        // Initialize HNSW index
        let max_elements = 100_000;
        let m = 24;
        let ef_construction = 400;
        let index = Hnsw::new(m, max_elements, 16, ef_construction, DistCosine);
        
        let store = Self {
            db,
            index: Arc::new(RwLock::new(index)),
            id_map: Arc::new(RwLock::new(HashMap::new())),
            next_id: Arc::new(RwLock::new(0)),
        };

        // Rebuild index from disk
        store.rebuild_index()?;

        Ok(store)
    }

    fn rebuild_index(&self) -> Result<()> {
        info!("🔄 Rebuilding in-memory HNSW index from disk...");
        let mut index = self.index.write().unwrap();
        let mut id_map = self.id_map.write().unwrap();
        let mut next_id = self.next_id.write().unwrap();

        let mut count = 0;
        for result in self.db.iter() {
            let (_, value) = result?;
            let memory: StoredMemory = serde_json::from_slice(&value)?;
            
            // Only add if it has an embedding
            if !memory.embedding.is_empty() {
                let hnsw_id = *next_id;
                index.insert((&memory.embedding, hnsw_id));
                id_map.insert(hnsw_id, memory.id);
                *next_id += 1;
                count += 1;
            }
        }
        
        info!("✅ Indexed {} memories in RAM", count);
        Ok(())
    }

    /// Store a memory
    pub fn store(
        &self,
        content: &str,
        source: Option<&str>,
        session_id: Option<Uuid>,
        metadata: Option<serde_json::Value>,
    ) -> Result<Uuid> {
        // Embed the content (using simple hash fallback for now)
        let embedding = self.hash_embed(content);

        let id = Uuid::new_v4();
        let memory = StoredMemory {
            id,
            content: content.to_string(),
            source: source.unwrap_or("user").to_string(),
            embedding: embedding.clone(),
            session_id,
            metadata,
            created_at: Utc::now(),
        };

        // Save to disk
        let key = id.as_bytes().to_vec();
        let value = serde_json::to_vec(&memory)?;
        self.db.insert(key, value)?;
        self.db.flush()?;

        // Add to in-memory index
        {
            let mut index = self.index.write().unwrap();
            let mut id_map = self.id_map.write().unwrap();
            let mut next_id = self.next_id.write().unwrap();

            let hnsw_id = *next_id;
            index.insert((&embedding, hnsw_id));
            id_map.insert(hnsw_id, id);
            *next_id += 1;
        }

        debug!("Stored memory {}", id);
        Ok(id)
    }

    /// Recall memories similar to query
    pub fn recall(
        &self,
        query: &str,
        limit: usize,
        session_filter: Option<Uuid>,
    ) -> Result<Vec<MemoryFragment>> {
        let query_embedding = self.hash_embed(query);

        let ef_search = 30;
        let results = {
            let index = self.index.read().unwrap();
            index.search(&query_embedding, limit.min(100), ef_search)
        };

        let id_map = self.id_map.read().unwrap();
        let mut fragments = Vec::new();

        for neighbor in results {
            if fragments.len() >= limit {
                break;
            }

            let hnsw_id = neighbor.d_id;
            let similarity = 1.0 - neighbor.distance; // Convert distance to similarity

            if let Some(uuid) = id_map.get(&hnsw_id) {
                // Fetch full content from sled
                if let Some(data) = self.db.get(uuid.as_bytes())? {
                    let memory: StoredMemory = serde_json::from_slice(&data)?;

                    // Apply filter
                    if let Some(sid) = session_filter {
                        if memory.session_id != Some(sid) {
                            continue;
                        }
                    }

                    fragments.push(MemoryFragment {
                        id: memory.id,
                        content: memory.content,
                        source: memory.source,
                        timestamp: memory.created_at,
                        similarity,
                    });
                }
            }
        }

        Ok(fragments)
    }

    /// Get memory statistics
    pub fn stats(&self) -> Result<StatsResponse> {
        let total = self.db.len();
        let size = self.db.size_on_disk().unwrap_or(0);

        // Count unique sessions (scan needed)
        let mut sessions = std::collections::HashSet::new();
        for result in self.db.iter() {
            if let Ok((_, value)) = result {
                if let Ok(memory) = serde_json::from_slice::<StoredMemory>(&value) {
                    if let Some(sid) = memory.session_id {
                        sessions.insert(sid);
                    }
                }
            }
        }

        Ok(StatsResponse {
            total_memories: total,
            storage_bytes: size,
            sessions: sessions.len(),
        })
    }

    // ========================================================================
    // Embedding Functions
    // ========================================================================

    /// Simple hash-based embedding (placeholder for real embeddings)
    fn hash_embed(&self, text: &str) -> Vec<f32> {
        use std::collections::hash_map::DefaultHasher;
        use std::hash::{Hash, Hasher};

        let dim = 128; // Smaller dim for hash
        let mut embedding = vec![0.0f32; dim];
        let words: Vec<&str> = text.split_whitespace().collect();

        for (i, word) in words.iter().enumerate() {
            let mut hasher = DefaultHasher::new();
            word.to_lowercase().hash(&mut hasher);
            let hash = hasher.finish();

            for j in 0..8 {
                let idx = ((hash >> (j * 8)) as usize + i) % dim;
                let val = ((hash >> (j * 4)) & 0xFF) as f32 / 255.0;
                embedding[idx] += val;
            }
        }

        // Normalize
        let norm: f32 = embedding.iter().map(|x| x * x).sum::<f32>().sqrt();
        if norm > 0.0 {
            for x in &mut embedding {
                *x /= norm;
            }
        }
        embedding
    }
}
