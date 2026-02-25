import { ArrowRight, ArrowLeft, PlayCircle, Code2, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ModuleTwo() {
    return (
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">

            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Module 2: IDE Integration</h1>
                    <p className="text-violet-300">Connecting LM Studio's Local Server to Cursor & Zed.</p>
                </div>
                <div className="px-4 py-2 glass-panel border-violet-500/30 text-violet-300 rounded-full text-sm font-semibold">
                    Step 2 of 3
                </div>
            </div>

            <div className="glass-panel p-1 rounded-2xl aspect-video relative group overflow-hidden bg-black/40">
                {/* Placeholder for ADA 508 Compliant Video */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                    <PlayCircle size={64} className="text-fuchsia-400 mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer" />
                    <h3 className="text-xl font-bold text-white mb-2">Video 2: The Connection (06:45)</h3>
                    <p className="text-slate-400 max-w-md">
                        Click to play. Includes closed captions and downloadable transcript for ADA 508 compliance.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Server className="text-fuchsia-400" /> The Local Server
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        LM Studio isn't just a chat interface. It acts as an API server (just like OpenAI), but running locally on your `localhost`. This allows professional developer tools to plug right into it.
                    </p>
                </div>

                <div className="glass-panel p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Code2 className="text-blue-400" /> Plugging into IDEs
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Code editors like <strong>Cursor</strong> and <strong>Zed</strong> are built for AI. By overriding their default API endpoint with our LM Studio local server URL, we get world-class autocompletion and code generation without paying subscription fees or sending code to the cloud.
                    </p>
                </div>
            </div>

            <div className="flex justify-between pt-8">
                <Link to="/module-1" className="glass-button text-slate-400 hover:text-white">
                    <ArrowLeft size={20} /> Back to Setup
                </Link>
                <Link to="/module-3" className="glass-button glass-button-primary shadow-[0_0_20px_rgba(139,92,246,0.3)] border-fuchsia-400/50 bg-fuchsia-600/80 hover:bg-fuchsia-500 hover:shadow-[0_0_20px_rgba(217,70,239,0.6)]">
                    Continue to Sandbox <ArrowRight size={20} />
                </Link>
            </div>

        </div>
    );
}
