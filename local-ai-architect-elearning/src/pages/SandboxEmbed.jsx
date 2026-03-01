/**
 * SandboxEmbed - Main sandbox learning page
 * 
 * This page provides a 3-step learning experience:
 * 1. WATCH - Educational videos about AI and game development
 * 2. PLAY - Interactive WASM-based sandbox game assessment
 * 3. READ - Downloadable blueprint materials
 * 
 * The page features a Bevy/Rust WASM game that runs entirely in the browser
 * for a hands-on learning assessment experience.
 */
import { ArrowLeft, ArrowRight, Loader2, Keyboard, Info, FileText, Wand2, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function SandboxEmbed() {
    // Loading state for the WASM iframe - shows spinner while game loads
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="w-full max-w-7xl space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">

            {/* Hero Section - Restored from static site */}
            <header className="text-center space-y-6 pt-12 pb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-2 border border-indigo-500/20">
                    <Info size={16} />
                    Estimated Completion: 20 Minutes
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
                    Building Educational Sandboxes <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Without Code</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    Welcome to the Sovereign Sandbox. This self-paced module teaches you how to use <span className="text-indigo-400 font-semibold">local AI</span> to translate your <span className="text-violet-400 font-semibold">pedagogy</span> into interactive game logic.
                </p>
            </header>

            {/* STEP 1: WATCH - Restored from static site */}
            <section id="watch" className="space-y-10">
                <div className="border-l-4 border-indigo-500 pl-6">
                    <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Step 1 • 45 Minutes</h2>
                    <h3 className="text-4xl font-bold text-white">Shaping Your Perspective</h3>
                    <p className="text-slate-400 mt-2 max-w-3xl">Before diving into code, we must shape how we think about Artificial Intelligence. Watch these three curated <span className="text-indigo-300 italic">"Visionary Broadcasts"</span> from leading edutainment creators to understand the underlying architecture and future potential of the systems you will be building.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 text-left">
                    {/* Video 1: Kurzgesagt */}
                    <div className="glass-panel group hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                        <div className="aspect-video bg-slate-900 relative overflow-hidden rounded-t-2xl">
                            <iframe
                                src="https://www.youtube.com/embed/fa8k8IQ1_X0"
                                title="Kurzgesagt - AI Explained"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full absolute inset-0"
                            ></iframe>
                        </div>
                        <div className="p-6">
                            <h4 className="font-bold text-lg text-white mb-2">1. The Mind of the Machine</h4>
                            <p className="text-slate-400 text-sm mb-4">By Kurzgesagt. Understanding the architecture of Large Language Models. A visual perspective on how neural networks "think" and learn from vast datasets.</p>
                        </div>
                    </div>

                    {/* Video 2: AI NPCs */}
                    <div className="glass-panel group hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                        <div className="aspect-video bg-slate-900 relative overflow-hidden rounded-t-2xl">
                            <iframe
                                src="https://www.youtube.com/embed/a91EPM7TBX4"
                                title="Simulating AI NPCs"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full absolute inset-0"
                            ></iframe>
                        </div>
                        <div className="p-6">
                            <h4 className="font-bold text-lg text-white mb-2">2. Simulating Sentience</h4>
                            <p className="text-slate-400 text-sm mb-4">By Answer in Progress. Exploring Generative Agents and the future of Non-Player Characters mapping complex social behaviors into virtual environments.</p>
                        </div>
                    </div>

                    {/* Video 3: Future of Coding */}
                    <div className="glass-panel group hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <div className="aspect-video bg-slate-900 relative overflow-hidden rounded-t-2xl">
                            <iframe
                                src="https://www.youtube.com/embed/w4rG5GY9IlA"
                                title="The Future of Programming"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full absolute inset-0"
                            ></iframe>
                        </div>
                        <div className="p-6">
                            <h4 className="font-bold text-lg text-white mb-2">3. The End of Syntax?</h4>
                            <p className="text-slate-400 text-sm mb-4">By Tina Huang. The future of programming is evolving from writing raw code to directing artificial intelligence. A look at how this reshapes software engineering.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* STEP 2: PLAY - The Game Assessment */}
            <section id="play" className="space-y-10">
                <div className="border-l-4 border-violet-500 pl-6">
                    <h2 className="text-sm font-bold text-violet-400 uppercase tracking-widest mb-2">Step 2 • 8 Minutes</h2>
                    <h3 className="text-4xl font-bold text-white">Knowledge Assessment: The Sovereign Sandbox</h3>
                    <p className="text-slate-400 mt-2 max-w-3xl">Apply what you've learned. Interact with the high-performance <span className="text-violet-300 italic">Bevy engine demo</span> below. Reach the certification level to pass.</p>
                </div>

                <div className="glass-panel w-full aspect-[16/9] rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(99,102,241,0.15)] bg-black/40 border-indigo-500/10">
                    <div className={`absolute inset-0 bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-1000 z-10 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div className="flex flex-col items-center space-y-4">
                            <Loader2 size={48} className="text-indigo-500 animate-spin drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]" />
                            <div className="font-mono text-indigo-300 text-sm tracking-widest uppercase animate-pulse">Initializing WASM Engine...</div>
                        </div>
                    </div>

                    <iframe
                        src="/sandbox/game.html"
                        title="Bevy WASM Game - Interactive Sandbox Assessment"
                        className="w-full h-full border-0 absolute inset-0 z-0 bg-slate-950"
                        allowFullScreen
                        onLoad={() => setIsLoading(false)}
                        onError={(error) => {
                            console.error('Sandbox iframe failed to load:', error);
                            setIsLoading(false);
                        }}
                    ></iframe>
                </div>

                {/* Controls Grid */}
                <div className="grid md:grid-cols-2 gap-8 text-left">
                    <div className="glass-panel p-8 border-indigo-500/20">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                            <Keyboard size={24} className="text-indigo-400" /> Control Protocol
                        </h3>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                            <div className="text-slate-400">Movement</div><div className="text-white font-mono bg-white/5 px-2 py-1 rounded">WASD / ARROWS</div>
                            <div className="text-slate-400">Interact / Advance</div><div className="text-white font-mono bg-white/5 px-2 py-1 rounded">T</div>
                            <div className="text-slate-400">Trigger AI NPC</div><div className="text-white font-mono bg-white/5 px-2 py-1 rounded">SPACE</div>
                            <div className="text-slate-400">Quiz Selection</div><div className="text-white font-mono bg-white/5 px-2 py-1 rounded">1, 2, 3</div>
                            <div className="text-slate-400">Toggle Subsystems</div><div className="text-white font-mono bg-white/5 px-2 py-1 rounded">C / L / M</div>
                        </div>
                    </div>
                    <div className="glass-panel p-8 border-emerald-500/20">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                            <Wand2 size={24} className="text-emerald-400" /> Architect Objectives
                        </h3>
                        <ul className="text-sm text-slate-300 space-y-4">
                            <li className="flex gap-3"><span className="text-emerald-400 shrink-0">01</span> Walk to <strong>The Architect</strong> NPC to start your orientation.</li>
                            <li className="flex gap-3"><span className="text-emerald-400 shrink-0">02</span> Collect glowing <strong>Knowledge Fragments</strong> (+50 XP).</li>
                            <li className="flex gap-3"><span className="text-emerald-400 shrink-0">03</span> Use the <strong>Terminal</strong> to verify your local logic script.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* STEP 3: READ - Restored Blueprint Section */}
            <section id="read" className="scroll-mt-24">
                <div className="glass-panel p-12 md:p-16 relative overflow-hidden text-center border-indigo-500/30 group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/20 via-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <div className="w-20 h-20 bg-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto border border-indigo-400/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                            <FileText size={40} className="text-indigo-300" />
                        </div>
                        <h3 className="text-4xl font-bold text-white tracking-tight">The Natural Language Blueprint</h3>
                        <p className="text-slate-300 text-lg">Download the supplementary instructional materials. This guide provides the exact COSTAR prompt structures needed to build your own social scaffolding.</p>

                        <div className="pt-4">
                            <a href="/sandbox/assets/Blueprint_Infographic.png" download className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-900 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-xl hover:-translate-y-1">
                                <ArrowRight size={20} className="text-indigo-600 rotate-90" />
                                Download Blueprint Poster
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW: THE MUSEUM LINK */}
            <section id="museum" className="space-y-10">
                <div className="flex flex-col md:flex-row items-center gap-10 p-10 rounded-[2.5rem] bg-gradient-to-br from-violet-600/10 via-fuchsia-600/10 to-amber-600/10 border border-violet-500/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[center_top_-1px]" />
                    <div className="w-24 h-24 rounded-3xl bg-violet-600/20 border border-violet-400/30 flex items-center justify-center text-violet-300 shadow-[0_0_30px_rgba(139,92,246,0.2)] shrink-0">
                        <Box size={48} />
                    </div>
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <h3 className="text-3xl font-black text-white">The Museum of Mechanics</h3>
                        <p className="text-slate-400 leading-relaxed max-w-2xl">
                            Ready for true inspiration? Explore our curated archive of open-source educational engines. From physics labs to historical sequences, see how other architects are shaping the future of play.
                        </p>
                    </div>
                    <Link to="/museum" className="px-8 py-4 bg-violet-600 text-white font-black rounded-2xl hover:bg-violet-500 transition-all shadow-xl shadow-violet-600/20 hover:scale-105 flex items-center gap-2">
                        VISIT THE GALLERY <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            <div className="flex justify-between pt-12">
                <Link to="/module-3" className="glass-button text-slate-400 hover:text-white group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Module 3
                </Link>
                <div className="flex gap-4">
                    <Link to="/museum" className="glass-button text-violet-300 hover:text-white border-violet-500/20 group">
                        Museum of Mechanics <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/knowledge-check" className="glass-button glass-button-primary shadow-[0_0_20px_rgba(139,92,246,0.3)] border-indigo-400/50 bg-indigo-600/80 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]">
                        Final Quiz <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

        </div>
    );
}

