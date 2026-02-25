import { Gamepad2, ArrowLeft, ArrowRight, Loader2, Keyboard, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function SandboxEmbed() {
    const [isLoading, setIsLoading] = useState(true);
    return (
        <div className="w-full max-w-6xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">The Sovereign Sandbox</h1>
                    <p className="text-violet-300">Explore the AI Academy — a 2D RPG built with Rust & Bevy, running in your browser via WebAssembly.</p>
                </div>
            </div>

            {/* The iframe container holding the isolated game canvas */}
            <div className="glass-panel w-full aspect-[16/9] rounded-2xl overflow-hidden relative shadow-[0_0_30px_rgba(99,102,241,0.2)] bg-black/40">

                {/* Loading Protocol Overlay */}
                <div
                    className={`absolute inset-0 bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-1000 z-10 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 size={48} className="text-indigo-500 animate-spin drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]" />
                        <div className="font-mono text-indigo-300 text-sm tracking-widest uppercase animate-pulse">
                            Initializing WASM Engine...
                        </div>
                        <div className="font-mono text-slate-500 text-xs">
                            Fetching Game Assets (This may take a moment)
                        </div>
                    </div>
                </div>

                <iframe
                    src="/sandbox/game.html"
                    title="Bevy WASM Game"
                    className="w-full h-full border-0 absolute inset-0 z-0"
                    allowFullScreen
                    onLoad={() => setIsLoading(false)}
                ></iframe>
            </div>

            {/* How to Play Section */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-panel p-5 border-indigo-500/20 rounded-xl">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                        <Keyboard size={20} className="text-indigo-400" /> Controls
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-slate-400">WASD / Arrow Keys</div><div className="text-white">Move</div>
                        <div className="text-slate-400">T</div><div className="text-white">Interact / Advance</div>
                        <div className="text-slate-400">SPACE</div><div className="text-white">Trigger AI Dialogue</div>
                        <div className="text-slate-400">1, 2, 3</div><div className="text-white">Answer Choices</div>
                        <div className="text-slate-400">C / L / M</div><div className="text-white">Toggle Tools</div>
                        <div className="text-slate-400">ESC</div><div className="text-white">Close Menus</div>
                    </div>
                </div>
                <div className="glass-panel p-5 border-violet-500/20 rounded-xl">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                        <Info size={20} className="text-violet-400" /> How to Play
                    </h3>
                    <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
                        <li>Press any key to skip the boot cinematic</li>
                        <li>Walk to <strong className="text-cyan-300">The Architect</strong> (your Teacher NPC) to begin</li>
                        <li>Follow the <strong className="text-amber-300">Quest Log</strong> (top-left) for objectives</li>
                        <li>Collect golden <strong className="text-yellow-300">Knowledge Fragments</strong> for bonus XP</li>
                        <li>Visit the <strong className="text-green-300">Terminal Lab</strong> to solve the command puzzle</li>
                        <li>Complete all 3 modules to reach Grandmaster rank!</li>
                    </ul>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Link to="/module-3" className="glass-button text-slate-400 hover:text-white">
                    <ArrowLeft size={20} /> Back to Module 3
                </Link>
                <Link to="/knowledge-check" className="glass-button glass-button-primary shadow-[0_0_20px_rgba(139,92,246,0.3)] border-indigo-400/50 bg-indigo-600/80 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]">
                    Take Knowledge Check <ArrowRight size={20} />
                </Link>
            </div>

        </div>
    );
}

