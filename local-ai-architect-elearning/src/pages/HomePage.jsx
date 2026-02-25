import { ArrowRight, BookOpen, Shield, Code, Play, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="w-full max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Hero Section */}
            <div className="text-center space-y-6 py-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-violet-500/30 text-violet-300 mb-4">
                    <BookOpen size={16} />
                    <span className="text-sm font-medium tracking-wide uppercase">EDCI 56900 Final Project</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.3)]">
                    The Local AI Architect
                </h1>

                <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    Building Educational Sandboxes Without Code. Transform from a passive consumer of software into an active <span className="text-violet-400 font-semibold">Experience Architect</span>.
                </p>

                <div className="flex justify-center pt-8">
                    <Link to="/module-1" className="glass-button glass-button-primary shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                        Start Learning Module <ArrowRight size={20} />
                    </Link>
                </div>
            </div>

            {/* Icebreaker Image Section */}
            <div className="flex justify-center mb-16 px-4 animate-in zoom-in-95 duration-700 delay-200">
                <div className="relative group max-w-4xl w-full">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-violet-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-700"></div>
                    <div className="relative glass-panel p-2 rounded-3xl border-violet-500/20 shadow-2xl overflow-hidden">
                        <img
                            src="/assets/intro_hero.png"
                            alt="A classic book emitting glowing holographic digital architecture"
                            className="w-full h-auto rounded-2xl object-cover hover:scale-[1.02] transition-transform duration-700"
                        />
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="glass-panel bg-black/60 backdrop-blur-md border-violet-500/30 p-4 rounded-xl inline-block max-w-xl shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                    <Wand2 className="text-violet-400" size={18} /> Gamifying Education
                                </h3>
                                <p className="text-slate-300 text-sm">
                                    Turn passive reading into active world-building. What if your lesson plan could generate a living, breathing sandbox?
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gap Analysis & Theory Section */}
            <div className="grid md:grid-cols-2 gap-8">
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
                            Use <strong className="text-white">LM Studio</strong> as a local API bridge to turn your natural language vision into playable reality, keeping student data entirely private.
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                            This module applies <strong className="text-violet-300">Constructionism</strong> (learning by building), <strong className="text-violet-300">Cognitive Load Theory</strong> (offloading syntax to AI), and <strong className="text-violet-300">Self-Determination Theory</strong> (giving you autonomy).
                        </p>
                    </div>
                </div>
            </div>

            {/* Module Overview */}
            <div className="glass-panel p-10 mt-12">
                <h2 className="text-3xl font-bold text-center mb-10 text-white">Course Overview</h2>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 border-t-4 border-t-violet-500 bg-black/20 hover:bg-black/30 transition-all">
                        <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mb-4">
                            <Play className="text-violet-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">1. The Local Forge</h3>
                        <p className="text-slate-400 text-sm">Set up your private AI assistant in under 5 minutes to protect student privacy.</p>
                    </div>

                    <div className="glass-panel p-6 border-t-4 border-t-fuchsia-500 bg-black/20 hover:bg-black/30 transition-all">
                        <div className="w-12 h-12 rounded-full bg-fuchsia-500/20 flex items-center justify-center mb-4">
                            <Play className="text-fuchsia-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">2. IDE Integration</h3>
                        <p className="text-slate-400 text-sm">Connect LM Studio's server to professional AI IDEs like Cursor or Zed.</p>
                    </div>

                    <div className="glass-panel p-6 border-t-4 border-t-indigo-500 bg-black/20 hover:bg-black/30 transition-all">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                            <Play className="text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">3. The Sandbox</h3>
                        <p className="text-slate-400 text-sm">Build your logic directly in your editor and create playable games without manual coding.</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
