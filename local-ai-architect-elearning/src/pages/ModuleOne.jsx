import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Laptop, CheckCircle2, ShieldCheck, AlertTriangle, PlayCircle, ArrowLeft, ArrowRight, CheckSquare, Sparkles } from 'lucide-react';
import ChunkedVideoPlayer from '../components/ChunkedVideoPlayer';
import { videos } from '../data/moduleData.jsx';

export default function ModuleOne() {
    const [showError, setShowError] = useState(false);
    const module1Data = videos[0];

    return (
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* ... (keep headers) ... */}
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Module 1: Starting Your Private Assistant</h1>
                    <p className="text-emerald-300">Simple steps to own your AI tools locally.</p>
                </div>
                <div className="px-4 py-2 glass-panel border-emerald-500/30 text-emerald-300 rounded-full text-sm font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    Step 1 of 3
                </div>
            </div>

            {/* Prerequisites & Learning Objectives */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="glass-panel p-6 space-y-4 border-emerald-500/20 bg-emerald-950/20">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Laptop className="text-emerald-400" size={20} /> What You'll Need
                    </h3>
                    <ul className="text-sm text-slate-300 space-y-2">
                        <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" /> A laptop or desktop (Windows, Mac, or Linux)</li>
                        <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" /> ~8 GB of free disk space for the AI model</li>
                        <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" /> Internet connection (for initial download only)</li>
                        <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" /> ~20 minutes of focused time</li>
                    </ul>
                </div>

                <div className="glass-panel p-6 space-y-4 border-emerald-500/20 bg-emerald-950/20">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-400" size={20} /> Learning Objectives
                    </h3>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">By the end of this module, you will be able to:</p>
                    <ul className="text-sm text-slate-300 space-y-2">
                        <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold">1.</span> Explain why running AI locally protects student data privacy.</li>
                        <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold">2.</span> Download and configure <strong>LM Studio</strong> on your own computer.</li>
                        <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold">3.</span> Demonstrate that the AI works offline — without internet.</li>
                    </ul>
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
                        "Set up a private assistant that helps you build active experiences. You can turn off your internet, <strong className="text-emerald-400">sit under a tree</strong>, and build a video game — all from your own computer."
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

                    <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                        <h4 className="text-sm font-bold text-emerald-300 mb-2 flex items-center gap-2">
                            <Sparkles size={16} /> The JS Sandbox
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Inside LM Studio, you'll find a <strong className="text-white">JavaScript Sandbox</strong>. This isn't just for chatting; it's a living workbench where you can build and test logic instantly. You can search Hugging Face for models, load an 8B brain, and start creating logic without a single line of traditional setup.
                        </p>
                    </div>

                    <ul className="list-disc list-outside ml-5 text-slate-300 text-sm space-y-2 mt-4">
                        <li>You create a private sandbox where students are never punished for being silly or making mistakes.</li>
                        <li>Students can confidently explore complex topics they might be embarrassed or uncomfortable navigating in a public setting.</li>
                        <li>As the saying goes, "don't do math in public"—local AI removes the anxiety of judgment, replacing it with low-stakes, creative experimentation.</li>
                    </ul>
                </div>
            </div>

            <div className="glass-panel p-8 border-indigo-500/20 bg-indigo-950/20">
                <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                    <CheckSquare size={24} className="text-indigo-400" /> Teacher Toolkit: Hardware Readiness
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="font-bold text-indigo-300 text-sm uppercase tracking-wider">Minimum Specs (Small Models)</h4>
                        <ul className="text-sm text-slate-300 space-y-2">
                            <li className="flex items-start gap-2"><span className="text-indigo-500">•</span> 8GB Unified RAM (Mac M1) / 16GB RAM (PC)</li>
                            <li className="flex items-start gap-2"><span className="text-indigo-500">•</span> Integrated Graphics (Iris Xe / Apple M-series)</li>
                            <li className="flex items-start gap-2"><span className="text-indigo-500">•</span> 4GB VRAM for 3B parameter models</li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-bold text-emerald-300 text-sm uppercase tracking-wider">Architect Specs (8B+ Models)</h4>
                        <ul className="text-sm text-slate-300 space-y-2">
                            <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> 32GB+ RAM / 16GB+ VRAM (NVIDIA RTX)</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> Dedicated GPU for instant "JS Sandbox" logic</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-500">•</span> High-speed NVMe SSD for fast model loading</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <PlayCircle className="text-emerald-400" /> Interactive Learning Session
                </h3>
                <ChunkedVideoPlayer videoData={module1Data} />
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
