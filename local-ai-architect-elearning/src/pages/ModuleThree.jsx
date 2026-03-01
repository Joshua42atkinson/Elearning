import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, HardHat, Hammer, TerminalSquare, Gamepad2, PlayCircle, ArrowLeft, ArrowRight, Printer, FileText } from 'lucide-react';
import ChunkedVideoPlayer from '../components/ChunkedVideoPlayer';
import { videos } from '../data/moduleData.jsx';

export default function ModuleThree() {
    const [inputValue, setInputValue] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const module3Data = videos[2];

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        if (value.toLowerCase().trim() === 'generate sandbox') {
            setIsUnlocked(true);
        }
    };

    return (
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* ... (keep headers) ... */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Module 3: Entering The Forge</h1>
                    <p className="text-amber-300">Prompting the AI to generate a functional game world.</p>
                </div>
                <div className="px-4 py-2 glass-panel border-amber-500/30 text-amber-300 rounded-full text-sm font-semibold shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    Step 3 of 3
                </div>
            </div>

            {/* Learning Objectives */}
            <div className="glass-panel p-6 space-y-4 border-amber-500/20 bg-amber-950/20 mb-8">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="text-amber-400" size={20} /> Learning Objectives
                </h3>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">By the end of this module, you will be able to:</p>
                <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex items-start gap-2"><span className="text-amber-400 font-bold">1.</span> Write a structured <strong>COSTAR prompt</strong> to generate game logic from natural language.</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400 font-bold">2.</span> Explain how <strong>Constructivism</strong> applies to prompt-driven creation.</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400 font-bold">3.</span> Use AI to translate a lesson plan into interactive sandbox behavior.</li>
                </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="glass-panel p-6 space-y-4 border-amber-500/10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <HardHat className="text-amber-400" /> Engineering with Words
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        We aren't just writing code; we are writing <strong className="text-amber-300">specifications</strong>. Like the <strong className="text-amber-400">Dragon Warrior</strong>, it's all about perspective. By providing our local assistant with clear intent, we instruct the AI to build the architecture for us.
                    </p>
                </div>

                <div className="glass-panel p-6 space-y-4 border-amber-500/10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Hammer className="text-amber-300" /> The Sovereign Sandbox
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        In this forge, we use AI to compile a WebAssembly (WASM) game built in <strong>Rust</strong> and <strong>Bevy</strong>. This isomorphic space allows students to choose to find information, giving consent to the learning process through WASD movement and interactive dialogue.
                    </p>
                </div>

                <div className="glass-panel p-6 space-y-4 border-amber-500/20 bg-amber-950/20 md:col-span-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Gamepad2 className="text-amber-400" /> Archetypal Identity
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        We are building spaces for students to explore who they are. My Roblox world uses <strong>12 NPCs based on Jungian archetypes</strong>. Each has a personality matrix that players naturally gravitate toward, creating a social scaffold where they can explore new identities through intentional player choice.
                    </p>
                </div>

                <div className="glass-panel p-6 space-y-4 md:col-span-2 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 w-full">
                            <h3 className="text-xl font-bold text-white mb-4">Active Constructivism</h3>

                            {/* Interactive Isomorphism Element */}
                            {!isUnlocked ? (
                                <div className="bg-slate-950 rounded-xl border border-amber-500/50 p-6 text-center animate-pulse-slow">
                                    <TerminalSquare className="mx-auto text-amber-400 mb-3" size={32} />
                                    <p className="text-amber-200/80 text-sm mb-4">To understand active creation, you must actively create. Type <code className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">generate sandbox</code> below to unlock the lesson.</p>
                                    <div className="relative max-w-xs mx-auto">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 font-mono">{'>'}</span>
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            placeholder="Type command..."
                                            className="w-full bg-black/50 border border-amber-500/30 rounded-lg py-2 pl-8 pr-4 text-amber-100 font-mono text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in slide-in-from-top-4 fade-in duration-500">
                                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm text-amber-200 font-mono mb-4 flex items-center gap-2">
                                        <span className="text-green-400">✓</span> Command accepted. Sandbox generated.
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <p className="text-slate-300 text-sm leading-relaxed">
                                                In educational theory, <strong>Constructivism</strong> posits that learners construct knowledge rather than just passively taking it in. Prompt engineering maps perfectly to this.
                                            </p>
                                            <ul className="list-disc list-outside ml-5 text-slate-300 text-sm space-y-2 mt-4">
                                                <li><strong>The Builder's Mindset:</strong> The student is no longer asking a search engine for an answer; they are commanding an engine to build a tool.</li>
                                                <li><strong>Bridging Imagination and Implementation:</strong> The "technical wall" of syntax is removed. If a teacher or student can imagine the logic, the AI can manifest it.</li>
                                                <li><strong>Ownership:</strong> Because this is generated locally, the creator truly owns the output. There is no cloud service that can shut it off or monetize the data.</li>
                                            </ul>
                                        </div>

                                        {/* Sandbox Sidebar */}
                                        <div className="w-full md:w-80 flex-shrink-0">
                                            <div className="bg-slate-900/50 border border-amber-500/30 rounded-xl p-4 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                                <h4 className="text-amber-300 font-bold text-sm mb-3 flex items-center gap-2">
                                                    <Gamepad2 size={16} className="text-amber-400" /> FINAL OBJECTIVES
                                                </h4>
                                                <ul className="space-y-2">
                                                    <li className="flex gap-2 text-xs text-slate-300 group">
                                                        <div className="w-4 h-4 rounded border border-amber-500/50 flex-shrink-0 flex items-center justify-center text-[10px] group-hover:bg-amber-500/20 transition-colors">1</div>
                                                        <span>Navigate to the <strong>Teacher</strong> to finalize the build.</span>
                                                    </li>
                                                    <li className="flex gap-2 text-xs text-slate-300 group">
                                                        <div className="w-4 h-4 rounded border border-amber-500/50 flex-shrink-0 flex items-center justify-center text-[10px] group-hover:bg-fuchsia-500/20 transition-colors">2</div>
                                                        <span>Activate the <strong>Logic Lens</strong> [2] to inspect the NPC rules.</span>
                                                    </li>
                                                    <li className="flex gap-2 text-xs text-slate-300 group">
                                                        <div className="w-4 h-4 rounded border border-amber-500/50 flex-shrink-0 flex items-center justify-center text-[10px] group-hover:bg-amber-500/20 transition-colors">3</div>
                                                        <span>Complete the <strong>Architect Certification</strong> quiz.</span>
                                                    </li>
                                                </ul>
                                                <div className="mt-4 pt-3 border-t border-amber-500/10">
                                                    <p className="text-[10px] text-slate-500 italic">
                                                        Final Step: Once complete, take the official Knowledge Check below.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Teacher Toolkit: COSTAR Cheat Sheet */}
            <div className="glass-panel p-8 border-amber-500/20 bg-amber-950/20">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <FileText size={24} className="text-amber-400" /> Teacher Toolkit: COSTAR Cheat Sheet
                    </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { l: 'C', n: 'Context', d: 'Background info for the AI.' },
                        { l: 'O', n: 'Objective', d: 'What do you want it to build?' },
                        { l: 'S', n: 'Style', d: 'Personas (e.g., "The Mentor").' },
                        { l: 'T', n: 'Tone', d: 'The "vibe" (e.g., encouraging).' },
                        { l: 'A', n: 'Audience', d: 'Who is this for? (e.g., 5th grade).' },
                        { l: 'R', n: 'Response', d: 'Format (e.g., Markdown, Code).' },
                    ].map((item) => (
                        <div key={item.l} className="p-4 rounded-xl bg-black/40 border border-amber-500/10">
                            <span className="text-2xl font-black text-amber-500/50 block mb-1">{item.l}</span>
                            <h4 className="font-bold text-white text-sm mb-1">{item.n}</h4>
                            <p className="text-[10px] text-slate-400 leading-tight">{item.d}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <PlayCircle className="text-amber-400" /> Interactive Learning Session
                </h3>
                <ChunkedVideoPlayer videoData={module3Data} />
            </div>

            <div className="flex justify-between pt-8">
                <Link to="/module-2" className="glass-button text-slate-400 hover:text-white">
                    <ArrowLeft size={20} /> Back to Logic
                </Link>
                <Link to="/sandbox" className="glass-button glass-button-primary shadow-[0_0_20px_rgba(245,158,11,0.3)] border-amber-400/50 bg-amber-600/80 hover:bg-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] text-white">
                    Enter Sandbox <ArrowRight size={20} />
                </Link>
            </div>

        </div >
    );
}
