import { ArrowRight, ArrowLeft, PlayCircle, Blocks, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ModuleThree() {
    return (
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">

            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Module 3: The Sandbox Bridge</h1>
                    <p className="text-violet-300">Using your local IDE setup to build playable spaces without manual coding.</p>
                </div>
                <div className="px-4 py-2 glass-panel border-violet-500/30 text-violet-300 rounded-full text-sm font-semibold">
                    Step 3 of 3
                </div>
            </div>

            <div className="glass-panel p-1 rounded-2xl aspect-video relative group overflow-hidden bg-black/40">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                    <PlayCircle size={64} className="text-indigo-400 mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer" />
                    <h3 className="text-xl font-bold text-white mb-2">Video 3: Creation (08:20)</h3>
                    <p className="text-slate-400 max-w-md">
                        Click to play. Includes closed captions and downloadable transcript for ADA 508 compliance.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Blocks className="text-indigo-400" /> Building with AI
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Now that Cursor is connected to LM Studio, you can highlight a block of code (or an empty file) and press Cmd+K. Simply describe what you want the game element to do in natural language.
                    </p>
                </div>

                <div className="glass-panel p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Zap className="text-amber-400" /> Instant Compilation
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        The AI generates the exact syntax required for your game engine (like Rust for Bevy, or Luau for Roblox). You simply accept the changes and immediately test the interactions in your sandbox.
                    </p>
                </div>
            </div>

            <div className="flex justify-between pt-8">
                <Link to="/module-2" className="glass-button text-slate-400 hover:text-white">
                    <ArrowLeft size={20} /> Back to IDE Integration
                </Link>
                <Link to="/knowledge-check" className="glass-button glass-button-primary shadow-[0_0_20px_rgba(139,92,246,0.3)] border-indigo-400/50 bg-indigo-600/80 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]">
                    Take Knowledge Check <ArrowRight size={20} />
                </Link>
            </div>

        </div>
    );
}
