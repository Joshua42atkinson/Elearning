
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
    airGapToggle: document.getElementById('air-gap-toggle'),
    networkStatus: document.getElementById('network-status'),
    compareBtn: document.getElementById('compare-btn'),
    leftPane: document.getElementById('cloud-pane'),
    rightPane: document.getElementById('local-pane'),
    terminalInput: document.getElementById('terminal-input'),
    terminalOutput: document.getElementById('terminal-output'),
    missionList: document.getElementById('mission-list')
};

// --- Mission Manager (Pedagogy: Gagné Event 2 - Inform Objectives) ---
class MissionManager {
    static complete(missionId) {
        if (!STATE.missions[missionId]) {
            STATE.missions[missionId] = true;
            const el = document.getElementById(`mission-${missionId}`);
            if (el) {
                el.classList.add('completed');
                el.textContent = el.textContent.replace('[ ]', '[x]');
            }
        }
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

            // Always keep focus
            document.addEventListener('click', () => {
                if (STATE.terminalActive) elements.terminalInput.focus();
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
});
