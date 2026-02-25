import { ArrowRight, ArrowLeft, PlayCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ModuleOne() {
    return (
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">

            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Module 1: Starting Your Private Assistant</h1>
                    <p className="text-violet-300">Simple steps to own your AI tools locally.</p>
                </div>
                <div className="px-4 py-2 glass-panel border-violet-500/30 text-violet-300 rounded-full text-sm font-semibold">
                    Step 1 of 3
                </div>
            </div>

            <div className="glass-panel p-1 rounded-2xl aspect-video relative group overflow-hidden bg-black/40">
                {/* Placeholder for ADA 508 Compliant Video */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                    <PlayCircle size={64} className="text-violet-400 mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer" />
                    <h3 className="text-xl font-bold text-white mb-2">Video 1: The Setup (04:12)</h3>
                    <p className="text-slate-400 max-w-md">
                        Click to play. Includes closed captions and downloadable transcript for ADA 508 compliance.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="text-green-400" /> Privacy First
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        By using a local host (like LM Studio), you download AI models directly to your machine. The internal "brain" runs securely offline, meaning your ideas and students' data never leave your sight.
                    </p>
                </div>

                <div className="glass-panel p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white">The Goal</h3>
                    <blockquote className="border-l-4 border-violet-500 pl-4 text-slate-300 italic text-sm">
                        "We all want our students to be active participants in their learning, not just passive readers. Today, we’re going to set up a private assistant that helps you build those active experiences right from your own computer."
                    </blockquote>
                </div>
            </div>

            <div className="flex justify-between pt-8">
                <Link to="/" className="glass-button text-slate-400 hover:text-white">
                    <ArrowLeft size={20} /> Back to Intro
                </Link>
                <Link to="/module-2" className="glass-button glass-button-primary shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                    Continue to Logic <ArrowRight size={20} />
                </Link>
            </div>

        </div>
    );
}
