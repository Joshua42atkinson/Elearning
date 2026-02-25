import { ArrowRight, ArrowLeft, PlayCircle, HardHat, Hammer, TerminalSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ModuleThree() {
    const [inputValue, setInputValue] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        if (value.toLowerCase().trim() === 'generate sandbox') {
            setIsUnlocked(true);
        }
    };

    return (
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">

            <div className="flex items-center justify-between border-b border-amber-500/20 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Module 3: Entering The Forge</h1>
                    <p className="text-amber-300">Prompting the AI to generate a functional game world.</p>
                </div>
                <div className="px-4 py-2 glass-panel border-amber-500/30 text-amber-300 rounded-full text-sm font-semibold shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    Step 3 of 3
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="glass-panel p-6 space-y-4 border-amber-500/10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <HardHat className="text-amber-400" /> Engineering with Words
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        We are no longer "writing code" line by line. We are writing <strong>specifications</strong>. By providing our local assistant with a clear "System Prompt" and a "Task Document," we instruct the AI to build the architecture for us.
                    </p>
                </div>

                <div className="glass-panel p-6 space-y-4 border-amber-500/10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Hammer className="text-amber-300" /> The Sovereign Sandbox
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        In this final module, we use the AI to compile a WebAssembly (WASM) game built in <a href="https://www.rust-lang.org/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">Rust</a> (the <a href="https://bevyengine.org/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">Bevy engine</a>). This isn't just a toy; it's a high-performance, memory-safe virtual environment running directly in the browser—all generated offline.
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
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        In educational theory, <strong>Constructivism</strong> posits that learners construct knowledge rather than just passively taking it in. Prompt engineering maps perfectly to this.
                                    </p>
                                    <ul className="list-disc list-outside ml-5 text-slate-300 text-sm space-y-2">
                                        <li><strong>The Builder's Mindset:</strong> The student is no longer asking a search engine for an answer; they are commanding an engine to build a tool.</li>
                                        <li><strong>Bridging Imagination and Implementation:</strong> The "technical wall" of syntax is removed. If a teacher or student can imagine the logic, the AI can manifest it.</li>
                                        <li><strong>Ownership:</strong> Because this is generated locally, the creator truly owns the output. There is no cloud service that can shut it off or monetize the data.</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-1 rounded-2xl aspect-video relative group overflow-hidden bg-black/40 border-amber-500/10">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                    <PlayCircle size={64} className="text-amber-400 mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                    <h3 className="text-xl font-bold text-white mb-2">Video 3: Creation (08:20)</h3>
                    <p className="text-slate-400 max-w-md">
                        Click to play. Includes closed captions and downloadable transcript for ADA 508 compliance.
                    </p>
                </div>
            </div>

            <div className="flex justify-between pt-8">
                <Link to="/module-2" className="glass-button text-slate-400 hover:text-white">
                    <ArrowLeft size={20} /> Back to Logic
                </Link>
                <Link to="/sandbox" className="glass-button glass-button-primary shadow-[0_0_20px_rgba(245,158,11,0.3)] border-amber-400/50 bg-amber-600/80 hover:bg-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] text-white">
                    Enter Sandbox <ArrowRight size={20} />
                </Link>
            </div>

        </div>
    );
}
