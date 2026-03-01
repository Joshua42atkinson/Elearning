import { ArrowRight, BookOpen, Shield, Code, Play, Wand2, X, ChevronRight, Layers, Server, Hammer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const moduleData = [
    {
        id: 1,
        title: '1. Setup',
        subtitle: 'Starting Your Private Assistant',
        description: 'Set up your private AI assistant using LM Studio to protect student privacy.',
        color: 'emerald',
        borderClass: 'border-t-emerald-500',
        bgClass: 'bg-emerald-500/20',
        textClass: 'text-emerald-400',
        glowClass: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
        popupBorderClass: 'border-emerald-500/40',
        popupGlowClass: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]',
        icon: <Layers className="text-emerald-400" />,
        link: '/module-1',
        objectives: [
            { label: 'Explain why running AI locally protects student data privacy.', theory: 'Data Sovereignty', detail: 'When AI runs on your own hardware, student questions, mistakes, and explorations never leave the building. No corporate server logs their curiosity. This is the foundation of a true "Safe Failure Space."' },
            { label: 'Download and configure LM Studio on your own computer.', theory: 'Reducing Cognitive Load', detail: 'LM Studio provides a visual, GUI-based interface to download and manage AI models — removing the intimidation of terminal commands and making the setup accessible to non-technical educators.' },
            { label: 'Demonstrate that the AI works offline — without internet.', theory: 'Self-Determination Theory (Autonomy)', detail: 'The "Wi-Fi off" moment proves you are in control. The AI belongs to you. This sense of ownership and autonomy is a core driver of intrinsic motivation.' },
        ]
    },
    {
        id: 2,
        title: '2. Logic',
        subtitle: 'Connecting AI to Your Workspace',
        description: 'Connect LM Studio\'s local server to professional AI IDEs like Cursor or Zed.',
        color: 'fuchsia',
        borderClass: 'border-t-fuchsia-500',
        bgClass: 'bg-fuchsia-500/20',
        textClass: 'text-fuchsia-400',
        glowClass: 'shadow-[0_0_20px_rgba(217,70,239,0.15)]',
        popupBorderClass: 'border-fuchsia-500/40',
        popupGlowClass: 'shadow-[0_0_30px_rgba(217,70,239,0.3)]',
        icon: <Server className="text-fuchsia-400" />,
        link: '/module-2',
        objectives: [
            { label: 'Start LM Studio\'s local API server and understand what localhost means.', theory: 'Scaffolding (Vygotsky)', detail: '"Localhost" is just your computer talking to itself. By starting LM Studio\'s server, you create a private API — identical to OpenAI\'s, but nothing leaves your machine. The AI becomes a More Knowledgeable Other sitting beside you.' },
            { label: 'Connect a code editor (Cursor or Zed) to your private AI server.', theory: 'Zone of Proximal Development', detail: 'AI-native editors like Cursor provide autocompletion and inline suggestions powered by your local model. This creates dynamic scaffolding — the AI adjusts to your skill level in real-time, keeping you in the ZPD.' },
            { label: 'Describe how AI scaffolding relates to Vygotsky\'s ZPD.', theory: 'Constructivism in Practice', detail: 'The AI doesn\'t replace your thinking — it extends it. Like a skilled mentor, it provides just enough structure to bridge the gap between what you know and what you\'re building toward.' },
        ]
    },
    {
        id: 3,
        title: '3. Implement',
        subtitle: 'Bringing Your World to Life',
        description: 'Build your logic directly in your editor and create playable games without manual coding.',
        color: 'amber',
        borderClass: 'border-t-amber-500',
        bgClass: 'bg-amber-500/20',
        textClass: 'text-amber-400',
        glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
        popupBorderClass: 'border-amber-500/40',
        popupGlowClass: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
        icon: <Hammer className="text-amber-400" />,
        link: '/module-3',
        objectives: [
            { label: 'Write a structured COSTAR prompt to generate game logic.', theory: 'The COSTAR Framework', detail: 'Context, Objective, Style, Tone, Audience, Response — this structured prompt protocol transforms chaotic AI output into precise, usable educational architecture. It\'s the difference between asking "write code" and engineering a system.' },
            { label: 'Explain how Constructivism applies to prompt-driven creation.', theory: 'Papertian Constructionism', detail: 'Seymour Papert argued we learn best by building public artifacts. When you prompt an AI to generate a game world from your lesson plan, you aren\'t consuming content — you are constructing a living, interactive experience.' },
            { label: 'Use AI to translate a lesson plan into interactive sandbox behavior.', theory: 'The Sandbox Bridge', detail: 'The "technical wall" between imagination and implementation has collapsed. If you can describe a learning experience in natural language, the AI can manifest it as playable logic. The lesson plan becomes the game.' },
        ]
    }
];

export default function HomePage() {
    const [activePopup, setActivePopup] = useState(null); // { moduleId, objectiveIdx }

    const handleObjectiveClick = (moduleId, objectiveIdx) => {
        if (activePopup?.moduleId === moduleId && activePopup?.objectiveIdx === objectiveIdx) {
            setActivePopup(null);
        } else {
            setActivePopup({ moduleId, objectiveIdx });
        }
    };

    return (
        <div className="w-full max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Hero Section */}
            <div className="text-center space-y-6 py-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-emerald-500/30 text-emerald-300 mb-4">
                    <BookOpen size={16} />
                    <span className="text-sm font-medium tracking-wide uppercase">EDCI 56900 Final Project</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-fuchsia-400 to-amber-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    The Local AI Forge
                </h1>

                <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    Building Educational Sandboxes Without Code. Transform from a passive consumer of software into an empowered <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-amber-400 font-bold">Experience Architect</span>.
                </p>

                <div className="flex justify-center pt-8">
                    <Link to="/module-1" className="glass-button glass-button-primary shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                        Start Learning Module <ArrowRight size={20} />
                    </Link>
                </div>
            </div>

            {/* The Architect's Roadmap - MOVED TO TOP AND IMPROVED */}
            <div className="glass-panel p-10 relative overflow-hidden group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/10 via-fuchsia-600/10 to-amber-600/10 rounded-[2rem] blur-xl opacity-50"></div>

                <div className="relative text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-2">The Architect's Roadmap</h2>
                    <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                        A three-stage journey from absolute privacy to creative sovereignty. Click any objective to reveal the <span className="text-violet-400 italic">Experience Architecture</span> principles behind it.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 relative">
                    {/* Visual Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-20 right-20 h-0.5 bg-gradient-to-r from-emerald-500/20 via-fuchsia-500/20 to-amber-500/20 -z-0"></div>

                    {moduleData.map((mod, mIdx) => (
                        <div key={mod.id} className={`glass-panel p-6 ${mod.borderClass} border-t-4 bg-black/40 hover:bg-black/50 transition-all relative z-10 shadow-xl`}>
                            <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-bold ${mod.textClass} uppercase tracking-tighter`}>
                                Stage {mIdx + 1}
                            </div>

                            <div className={`w-12 h-12 rounded-xl ${mod.bgClass} flex items-center justify-center mb-4 border ${mod.popupBorderClass}`}>
                                {mod.icon}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{mod.title}</h3>
                            <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">{mod.subtitle}</p>

                            {/* Clickable Learning Objectives */}
                            <div className="space-y-2 mb-6">
                                {mod.objectives.map((obj, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleObjectiveClick(mod.id, idx)}
                                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all duration-300 flex items-start gap-3 group cursor-pointer ${activePopup?.moduleId === mod.id && activePopup?.objectiveIdx === idx
                                            ? `${mod.popupBorderClass} bg-white/5 ${mod.glowClass}`
                                            : 'border-white/5 hover:border-white/10 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`mt-0.5 w-4 h-4 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 transition-all ${activePopup?.moduleId === mod.id && activePopup?.objectiveIdx === idx ? 'bg-emerald-500/20 border-emerald-500/50' : 'group-hover:border-white/30'}`}>
                                            <ChevronRight size={10} className={`${mod.textClass} transition-transform ${activePopup?.moduleId === mod.id && activePopup?.objectiveIdx === idx ? 'rotate-90 text-emerald-400' : ''}`} />
                                        </div>
                                        <span className={`leading-relaxed transition-colors ${activePopup?.moduleId === mod.id && activePopup?.objectiveIdx === idx ? 'text-white font-medium' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                            {obj.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Inline Popup for active objective */}
                            {activePopup?.moduleId === mod.id && (
                                <div className={`animate-in slide-in-from-top-2 fade-in duration-300 mb-6 p-4 rounded-2xl border ${mod.popupBorderClass} bg-slate-950/90 backdrop-blur-xl ${mod.popupGlowClass} relative`}>
                                    <button onClick={() => setActivePopup(null)} className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors">
                                        <X size={14} />
                                    </button>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-1 h-3 rounded-full bg-gradient-to-b ${mod.color === 'emerald' ? 'from-emerald-500 to-teal-600' : mod.color === 'fuchsia' ? 'from-fuchsia-500 to-pink-600' : 'from-amber-500 to-orange-600'}`}></div>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${mod.textClass}`}>
                                            Design Principle
                                        </p>
                                    </div>
                                    <h4 className="text-white text-sm font-bold mb-2">{mod.objectives[activePopup.objectiveIdx].theory}</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed">
                                        {mod.objectives[activePopup.objectiveIdx].detail}
                                    </p>
                                </div>
                            )}

                            <Link to={mod.link} className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold ${mod.textClass} hover:bg-white/10 transition-all group/link`}>
                                Start Learning Stage <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hero Image */}
            <div className="flex justify-center mb-16 px-4 animate-in zoom-in-95 duration-700 delay-200">
                <div className="relative group max-w-4xl w-full">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-700"></div>
                    <div className="relative glass-panel p-2 rounded-3xl border-violet-500/20 shadow-2xl overflow-hidden">
                        <img
                            src="/assets/hero_architect.png"
                            alt="A futuristic workspace where natural language transforms into holographic 3D architecture — representing the Local AI Architect workflow"
                            className="w-full h-auto rounded-2xl object-cover hover:scale-[1.02] transition-transform duration-700"
                        />
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="glass-panel bg-black/60 backdrop-blur-md border-emerald-500/30 p-4 rounded-xl inline-block max-w-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                    <Wand2 className="text-emerald-400" size={18} /> From Words to Worlds
                                </h3>
                                <p className="text-slate-300 text-sm">
                                    Your natural language vision becomes a living, interactive sandbox. No code required — just clear intent and a local AI partner.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gap Analysis & Theory Section */}
            <div className="grid md:grid-cols-2 gap-8 pb-12">
                <div className="glass-panel p-8 space-y-4 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-[1.2rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-white mb-4">
                            <Shield className="text-violet-400" /> The Problem
                        </h2>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            Modern education is stuck in the <strong className="text-white">"Textbook Trap"</strong>—standardized, passive content that fails to engage student curiosity.
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                            Educators are limited by the <strong className="text-white">"Creative Wall"</strong> of traditional coding required to build interactive worlds, forcing them to rely on "closed" vendor-locked software.
                        </p>
                    </div>
                </div>

                <div className="glass-panel p-8 space-y-4 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600 to-indigo-600 rounded-[1.2rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-white mb-4">
                            <Code className="text-fuchsia-400" /> The Solution
                        </h2>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            Use <strong className="text-white">LM Studio</strong> as your local forge to turn natural language into playable reality, keeping student data entirely private.
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                            This journey applies <strong className="text-violet-300">Constructionism</strong> (building public artifacts), <strong className="text-violet-300">Cognitive Load Theory</strong> (offloading syntax), and <strong className="text-violet-300">Self-Determination Theory</strong> (sovereignty and autonomy).
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
