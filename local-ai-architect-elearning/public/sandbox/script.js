
// Matrix-Rust State Management
const STATE = {
    airGap: false,
    rentVsOwn: false,
    terminalActive: true,
    missions: {
        airGap: false,
        compare: false,
        boot: false
    }
};

// DOM Elements
const elements = {
    // Shared
    airGapToggle: document.getElementById('air-gap-toggle'),
    networkStatus: document.getElementById('network-status'),
    compareBtn: document.getElementById('compare-btn'),

    // Module 1
    leftPane: document.getElementById('cloud-pane'),
    rightPane: document.getElementById('local-pane'),
    terminalInput: document.getElementById('terminal-input'),
    terminalOutput: document.getElementById('terminal-output'),
    missionList: document.getElementById('mission-list'),

    // Module 2
    navButtons: document.querySelectorAll('.nav-btn'),
    moduleContainers: document.querySelectorAll('.module-container'),
    translateBtn: document.getElementById('translate-btn'),
    promptInput: document.getElementById('prompt-input'),
    generatedCode: document.getElementById('generated-code'),
    matrixStream: document.getElementById('matrix-stream'),
    missionIntent: document.getElementById('mission-intent'),
    missionTranslate: document.getElementById('mission-translate'),
    missionVisualize: document.getElementById('mission-visualize'),

    // Gamification
    xpBar: document.getElementById('xp-bar'),
    xpText: document.getElementById('player-xp'),
    levelText: document.getElementById('player-level'),
    questButtons: document.querySelectorAll('.quest-btn'),
    questContainers: document.querySelectorAll('.quest-container')
};

// --- Game Master (Gamification Engine) ---
class GameMaster {
    static init() {
        this.xp = 0;
        this.level = 1;
        this.xpToNextLevel = 100;

        // DOM Elements
        this.xpBar = elements.xpBar;
        this.xpText = elements.xpText;
        this.levelText = elements.levelText;

        this.updateUI();
    }

    static awardXP(amount) {
        this.xp += amount;

        // Level Up Logic (Simple: Every 100 XP)
        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }

        this.updateUI();
    }

    static levelUp() {
        this.level++;
        this.xpToNextLevel += 100; // Curve? Nah, linear for now.

        // Unlock Quests
        QuestManager.unlockQuest(`quest-${this.level}`);

        // Visual Notification (Console for now)
        alert(`LEVEL UP! WELCOME TO LEVEL ${this.level}`);
    }

    static updateUI() {
        if (this.xpBar) {
            const percentage = (this.xp / this.xpToNextLevel) * 100;
            this.xpBar.style.width = `${percentage}%`;
        }
        if (this.xpText) this.xpText.textContent = this.xp;
        if (this.levelText) this.levelText.textContent = this.level;
    }
}

// --- Mission Manager (Pedagogy: Gagné Event 2 - Inform Objectives) ---
class MissionManager {
    static complete(missionId) {
        if (!STATE.missions[missionId]) {
            STATE.missions[missionId] = true;

            // UI Update
            const el = document.getElementById(`mission-${missionId}`);
            if (el) {
                el.classList.add('completed');
                el.textContent = el.textContent.replace('[ ]', '[x]');
            }

            // Gamification: Award XP
            GameMaster.awardXP(20); // 5 missions = 100 XP -> Level Up
        }
    }
}

// --- Quest Manager (Replaces ModuleManager) ---
class QuestManager {
    static init() {
        this.questButtons = elements.questButtons;
        this.questContainers = elements.questContainers;

        this.questButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('locked')) return;
                const targetId = btn.getAttribute('data-target');
                this.switchQuest(targetId);
            });
        });
    }

    static unlockQuest(questId) {
        const btn = document.getElementById(`btn-${questId}`);
        if (btn) {
            btn.classList.remove('locked');
            // Change lock icon to open? CSS filter handles visual.
        }
    }

    static switchQuest(questId) {
        // Toggle Nav Buttons
        this.questButtons.forEach(btn => {
            if (btn.id === `btn-${questId}`) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Toggle Container Visibility
        this.questContainers.forEach(container => {
            if (container.id === questId) {
                container.classList.remove('hidden');
                container.classList.add('active');
            } else {
                container.classList.remove('active');
                container.classList.add('hidden'); // Use CSS hidden
                container.style.display = 'none'; // Force hide
            }
        });

        // Un-hide the active one via style (override loop)
        const activeContainer = document.getElementById(questId);
        if (activeContainer) activeContainer.style.display = 'flex';
    }
}

// --- Simulation Engine (Module 3) ---
class SimulationEngine {
    static init() {
        this.canvas = document.getElementById('sim-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container = document.getElementById('sim-container');
        this.statusEl = document.querySelector('.sim-status');

        this.entities = [];
        this.player = null;
        this.isRunning = false;
        this.animationId = null;
        this.activeBehavior = null; // 'kill' | 'score' | null

        document.getElementById('run-sim-btn').addEventListener('click', () => this.start());
        document.getElementById('reset-sim-btn').addEventListener('click', () => this.reset());

        // Initial Draw
        this.reset();
    }

    static setBehavior(behavior) {
        this.activeBehavior = behavior;
        this.container.classList.remove('hidden'); // Reveal canvas on valid translation
    }

    static reset() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);

        // Setup Scene
        this.player = { x: 50, y: 180, w: 30, h: 30, color: '#40FF00', speed: 3, dead: false }; // Green Player
        this.entities = [
            { type: 'lava', x: 300, y: 150, w: 50, h: 100, color: '#C9462A' }, // Red Lava
            { type: 'gold', x: 600, y: 180, w: 30, h: 30, color: '#FFBF00' }   // Amber Gold
        ];

        this.statusEl.innerHTML = "STATUS: READY <span style='color:#555'>(WAITING FOR INPUT)</span>";
        this.draw();
    }

    static start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.statusEl.textContent = "STATUS: RUNNING...";
        MissionManager.complete('run');
        this.loop();
    }

    static loop() {
        if (!this.isRunning) return;

        this.update();
        this.draw();

        this.animationId = requestAnimationFrame(() => this.loop());
    }

    static update() {
        if (this.player.dead) return;

        // Auto-Move Player for demo purposes (simple runner)
        this.player.x += this.player.speed;

        // Loop bounds
        if (this.player.x > this.canvas.width) {
            this.player.x = 0;
        }

        // Collision Detection
        this.entities.forEach(entity => {
            if (this.checkCollision(this.player, entity)) {
                this.handleCollision(entity);
            }
        });
    }

    static checkCollision(rect1, rect2) {
        return (rect1.x < rect2.x + rect2.w &&
            rect1.x + rect1.w > rect2.x &&
            rect1.y < rect2.y + rect2.h &&
            rect1.y + rect1.h > rect2.y);
    }

    static handleCollision(entity) {
        if (entity.type === 'lava') {
            if (this.activeBehavior === 'kill') {
                this.player.dead = true;
                this.player.color = '#333'; // Burnt
                this.statusEl.innerHTML = "STATUS: <span style='color:var(--alert-red)'>WASTED (LOGIC VERIFIED)</span>";
                MissionManager.complete('kill');
            } else {
                // No logic defined for lava yet
                this.statusEl.textContent = "STATUS: COLLISION (NO LOGIC DEFINED)";
            }
        }

        if (entity.type === 'gold') {
            if (this.activeBehavior === 'score') {
                // Collect
                entity.x = -100; // Remove from screen
                this.statusEl.innerHTML = "STATUS: <span style='color:var(--phosphor-amber)'>SCORE: +10 (LOGIC VERIFIED)</span>";
                MissionManager.complete('score');
            }
        }
    }

    static draw() {
        // Clear
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Player
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.w, this.player.h);

        // Draw Entities
        this.entities.forEach(e => {
            this.ctx.fillStyle = e.color;
            this.ctx.fillRect(e.x, e.y, e.w, e.h);

            // Label
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '10px monospace';
            this.ctx.fillText(e.type.toUpperCase(), e.x, e.y - 5);
        });
    }
}

// --- Prompt Engine (Module 2) ---
class PromptEngine {
    static init() {
        if (elements.translateBtn) {
            elements.translateBtn.addEventListener('click', () => this.translate());
        }
    }

    static async translate() {
        const intent = elements.promptInput.value.trim();

        if (!intent) {
            elements.generatedCode.textContent = "-- Please define intent first.";
            elements.generatedCode.style.color = "var(--alert-red)";
            return;
        }

        MissionManager.complete('intent');

        // Visual Feedback - Stream Active
        elements.matrixStream.classList.add('active');
        elements.generatedCode.style.color = "var(--phosphor-amber)";
        elements.generatedCode.textContent = ""; // Clear existing

        // Simulate "Thinking"/Context Loading
        await this.typeText("-- Loading Context: Game State...", 20);
        await this.delay(500);
        await this.typeText("\n-- Parsing Natural Language Intent...", 20);
        await this.delay(500);

        MissionManager.complete('visualize');

        // Generate Pseudo-Logic based on input keywords
        let code = "\n";
        let behavior = null;

        if (intent.toLowerCase().includes("kill") || intent.toLowerCase().includes("die") || intent.toLowerCase().includes("lava")) {
            code += "function onTouch(player, object)\n  if object.type == 'LAVA' then\n    player.health = 0\n    Game.notify('WASTED')\n  end\nend";
            behavior = 'kill';
        } else if (intent.toLowerCase().includes("point") || intent.toLowerCase().includes("score") || intent.toLowerCase().includes("gold")) {
            code += "function onCollect(player, item)\n  if item.isGold then\n    player.score = player.score + 10\n    UI.updateScore(player.score)\n  end\nend";
            behavior = 'score';
        } else {
            code += `function processIntent()\n  -- AI Interpretation:\n  -- "${intent}"\n  Log.info("Action registered")\nend`;
        }

        await this.typeText(code, 40);

        elements.matrixStream.classList.remove('active');
        MissionManager.complete('translate');

        // Pass behavior to Simulation
        SimulationEngine.setBehavior(behavior);
        SimulationEngine.statusEl.innerHTML = "STATUS: <span style='color:var(--status-green)'>LOGIC COMPILED. READY TO RUN.</span>";
    }

    static async typeText(text, speed = 30) {
        for (let i = 0; i < text.length; i++) {
            elements.generatedCode.textContent += text.charAt(i);
            // Auto-scroll
            elements.generatedCode.parentElement.scrollTop = elements.generatedCode.parentElement.scrollHeight;
            await this.delay(speed);
        }
    }

    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// --- Terminal Logic ---

class Terminal {
    constructor() {
        this.history = [];
        this.isProcessing = false;
        this.inputTimer = null;
        this.hintShown = false;
        this.init();
    }

    init() {
        if (elements.terminalInput) {
            elements.terminalInput.addEventListener('keydown', (e) => {
                this.resetHintTimer();
                if (e.key === 'Enter' && !this.isProcessing) {
                    const command = elements.terminalInput.value.trim();
                    this.handleCommand(command);
                    elements.terminalInput.value = '';
                }
            });

            elements.terminalInput.addEventListener('focus', () => this.resetHintTimer());

            // Always keep focus ONLY if Quest 1 is active (ID changed due to refactor)
            document.addEventListener('click', (e) => {
                const quest1 = document.getElementById('quest-1');
                if (quest1 && quest1.classList.contains('active') && !e.target.closest('button') && !e.target.closest('input')) {
                    // elements.terminalInput.focus();
                }
            });
        }
    }

    resetHintTimer() {
        clearTimeout(this.inputTimer);
        this.hintShown = false;
        this.inputTimer = setTimeout(() => this.showHint(), 10000); // 10s idle
    }

    // Pedagogy: Gagné Event 5 - Provide Guidance
    showHint() {
        if (!this.hintShown && !this.isProcessing && !STATE.missions.boot) {
            this.print('(HINT: Try typing "ollama run llama3")', 'warning');
            this.hintShown = true;
        }
    }

    async handleCommand(cmd) {
        this.print(`> ${cmd}`);
        this.isProcessing = true;
        clearTimeout(this.inputTimer); // Stop hints while processing

        if (cmd === 'ollama run llama3') {
            if (!STATE.airGap) {
                // Pedagogy: Safe Failure
                this.print('WARNING: NETWORK CONNECTION DETECTED. FOR MAXIMUM SOVEREIGNTY, ENABLE AIR-GAP.', 'warning');
                await this.delay(1000);
            }
            await this.simulateLLMBoot();
        } else if (cmd === 'help') {
            this.print('AVAILABLE COMMANDS: ollama run llama3, clear, help');
            this.isProcessing = false;
        } else if (cmd === 'clear') {
            // Clear visual only for now
            this.print('--- CLEARED ---');
            this.isProcessing = false;
        } else {
            this.print(`COMMAND NOT RECOGNIZED: ${cmd}`, 'error');
            this.isProcessing = false;
            this.resetHintTimer();
        }
    }

    print(text, type = 'normal') {
        const p = document.createElement('p');
        p.textContent = text;

        if (type === 'error') p.style.color = 'var(--alert-red)';
        if (type === 'warning') p.style.color = 'var(--industrial-rust)';
        if (type === 'success') p.style.color = 'var(--status-green)';
        if (type === 'info') p.style.color = 'var(--phosphor-amber)';

        elements.terminalOutput.insertBefore(p, elements.terminalOutput.lastElementChild);
        elements.terminalOutput.parentElement.scrollTop = elements.terminalOutput.parentElement.scrollHeight;
    }

    // Pedagogy: Gagné Event 7 - Provide Feedback (Elaboration)
    async simulateLLMBoot() {
        this.print('initiating local inference engine...', 'info');
        await this.delay(800);

        await this.typeText('ALLOCATING VRAM [8GB]...', 30);
        await this.delay(500);

        await this.typeText('LOADING TENSORS (GGUF FORMAT)...', 30);
        await this.delay(600);

        await this.typeText('VERIFYING SHASUM INTEGRITY...', 20);
        await this.delay(400);

        this.print('SUCCESS', 'success');
        this.print('>>> LLAMA-3 8B READY. (SEND A MESSAGE)', 'success');

        MissionManager.complete('boot'); // Complete Mission
        this.isProcessing = false;
    }

    async typeText(text, speed = 50) {
        const p = document.createElement('p');
        elements.terminalOutput.insertBefore(p, elements.terminalOutput.lastElementChild);

        for (let i = 0; i < text.length; i++) {
            p.textContent += text.charAt(i);
            await this.delay(speed);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// --- UI Logic ---

function toggleAirGap() {
    STATE.airGap = !STATE.airGap;

    if (STATE.airGap) {
        elements.networkStatus.textContent = 'NETWORK: DISCONNECTED (SECURE)';
        elements.networkStatus.classList.add('status-text');
        elements.networkStatus.style.color = 'var(--status-green)';
        document.body.style.boxShadow = 'inset 0 0 50px var(--industrial-rust)';
        MissionManager.complete('airgap'); // Complete Mission
    } else {
        elements.networkStatus.textContent = 'NETWORK: ONLINE';
        elements.networkStatus.style.color = 'var(--industrial-rust)';
        document.body.style.boxShadow = 'none';
    }
}

function toggleRentVsOwn() {
    STATE.rentVsOwn = !STATE.rentVsOwn;

    if (STATE.rentVsOwn) {
        elements.leftPane.style.flex = '1';
        elements.leftPane.style.opacity = '1';
        elements.leftPane.style.padding = '1rem';
        elements.leftPane.style.border = '1px solid var(--industrial-rust)';

        elements.compareBtn.textContent = 'HIDE COMPARISON';
        MissionManager.complete('compare'); // Complete Mission
    } else {
        elements.leftPane.style.flex = '0 0 0';
        elements.leftPane.style.opacity = '0';
        elements.leftPane.style.padding = '0';
        elements.leftPane.style.border = 'none';

        elements.compareBtn.textContent = 'COMPARE MODELS';
    }
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // Air Gap Switch
    if (elements.airGapToggle) {
        elements.airGapToggle.addEventListener('change', toggleAirGap);
    }

    // Compare Button
    if (elements.compareBtn) {
        elements.compareBtn.addEventListener('click', toggleRentVsOwn);
    }

    // Init Terminal
    new Terminal();

    // Init Game Systems
    GameMaster.init();
    QuestManager.init();

    // Init Modules
    PromptEngine.init();

    // Init Simulation Engine
    SimulationEngine.init();
});
