import { ArrowRight, ArrowLeft, PlayCircle, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ModuleOne() {
    const [showError, setShowError] = useState(false);

    return (
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">

            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Module 1: Starting Your Private Assistant</h1>
                    <p className="text-emerald-300">Simple steps to own your AI tools locally.</p>
                </div>
                <div className="px-4 py-2 glass-panel border-emerald-500/30 text-emerald-300 rounded-full text-sm font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    Step 1 of 3
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="glass-panel p-6 space-y-4 border-emerald-500/10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="text-emerald-400" /> Privacy First
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        By using a local host (like <a href="https://lmstudio.ai/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">LM Studio</a>), you download AI models directly to your machine. The internal "brain" runs securely offline, meaning your ideas and students' data never leave your sight.
                    </p>
                </div>

                <div className="glass-panel p-6 space-y-4 border-emerald-500/10">
                    <h3 className="text-xl font-bold text-emerald-50">The Goal</h3>
                    <blockquote className="border-l-4 border-emerald-500 pl-4 text-emerald-100/70 italic text-sm">
                        "We all want our students to be active participants in their learning, not just passive readers. Today, we’re going to set up a private assistant that helps you build those active experiences right from your own computer."
                    </blockquote>
                </div>

                <div className="glass-panel p-6 space-y-4 md:col-span-2 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-white">The Safe Failure Space</h3>
                            <p className="text-slate-300 text-sm leading-relaxed mt-2 max-w-2xl">
                                In game design, a <strong>Safe Failure Space</strong> is an environment where players can experiment, fail, and try again without permanent, punishing consequences.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowError(true)}
                            className="px-4 py-2 text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
                        >
                            <AlertTriangle size={16} /> Trigger Local Error
                        </button>
                    </div>

                    {showError && (
                        <div className="mt-4 p-4 bg-slate-900 border border-red-500/50 rounded-xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                            <h4 className="text-red-400 font-mono font-bold flex items-center gap-2 mb-2">
                                <AlertTriangle size={18} /> FATAL_SYNTAX_ERROR: Server Disconnect
                            </h4>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                See? You crashed the local app instance. But nothing actually broke. The beauty of local AI is that your identity and actions are absolutely protected. There is no remote server logging your attempt. You just click restart. <strong>This is the Safe Failure Space.</strong>
                            </p>
                        </div>
                    )}

                    <ul className="list-disc list-outside ml-5 text-slate-300 text-sm space-y-2 mt-4">
                        <li>You create a private sandbox where students are never punished for being silly or making mistakes.</li>
                        <li>Students can confidently explore complex topics they might be embarrassed or uncomfortable navigating in a public setting.</li>
                        <li>As the saying goes, "don't do math in public"—local AI removes the anxiety of judgment, replacing it with low-stakes, creative experimentation.</li>
                    </ul>
                </div>
            </div>

            <div className="glass-panel p-1 rounded-2xl aspect-video relative group overflow-hidden bg-black/40 border-emerald-500/10">
                {/* Placeholder for ADA 508 Compliant Video */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                    <PlayCircle size={64} className="text-emerald-400 mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    <h3 className="text-xl font-bold text-white mb-2">Video 1: The Setup (04:12)</h3>
                    <p className="text-slate-400 max-w-md">
                        Click to play. Includes closed captions and downloadable transcript for ADA 508 compliance.
                    </p>
                </div>
            </div>

            <div className="flex justify-between pt-8">
                <Link to="/" className="glass-button text-slate-400 hover:text-white">
                    <ArrowLeft size={20} /> Back to Intro
                </Link>
                <Link to="/module-2" className="glass-button glass-button-primary shadow-[0_0_20px_rgba(16,185,129,0.3)] border-emerald-400/50 bg-emerald-600/80 hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] text-white">
                    Continue to Logic <ArrowRight size={20} />
                </Link>
            </div>

        </div>
    );
}
