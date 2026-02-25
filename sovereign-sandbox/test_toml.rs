use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Syllabus {
    pub title: String,
    pub description: String,
    pub modules: Vec<Quest>,
}

#[derive(Debug, Deserialize)]
pub struct Quest {
    pub id: String,
    pub title: String,
    pub description: String,
    pub objective: String,
    pub events: GagneEvents,
    pub phases: Option<Vec<PhaseConfig>>,
}

#[derive(Debug, Deserialize)]
pub struct GagneEvents {
    pub gain_attention: String,
    pub inform_objectives: String,
    pub recall_prior_knowledge: String,
    pub present_content: String,
    pub provide_guidance: String,
    pub elicit_performance: String,
    pub provide_feedback: String,
    pub assess_performance: String,
    pub enhance_retention: String,
}

#[derive(Debug, Deserialize)]
pub struct PhaseConfig {
    #[serde(rename = "type")]
    pub phase_type: String,
    pub target: Option<String>,
    pub gagne_step: Option<usize>,
    pub description: Option<String>,
    pub question: Option<String>,
    pub rewards: Option<Vec<String>>,
}

fn main() {
    let contents = std::fs::read_to_string("assets/syllabus/module_1.toml").unwrap();
    match toml::from_str::<Syllabus>(&contents) {
        Ok(_) => println!("OK"),
        Err(e) => println!("ERROR: {}", e),
    }
}
