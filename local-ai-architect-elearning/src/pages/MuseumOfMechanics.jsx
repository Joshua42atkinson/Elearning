import React, { useState } from 'react';
import { Box, Sparkles, Binary, Cpu, Rocket, Globe, Palette, Zap, Info, ExternalLink, ArrowRight, Terminal, Search, MousePointer2, User, PlayCircle, X, BookOpen, BrainCircuit, Github, ShieldCheck, Clock, Target, Lightbulb, Star, Filter, ChevronDown, ChevronUp, Award, Play } from 'lucide-react';
import sandboxRegistry from '../data/sandboxRegistry.json';

export default function MuseumOfMechanics() {
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [playingDemo, setPlayingDemo] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [showTeachingNotes, setShowTeachingNotes] = useState(false);

    const categories = ['All', ...new Set(sandboxRegistry.map(game => game.category))];

    const featuredGames = sandboxRegistry.filter(game => game.featured);

    const filteredGames = sandboxRegistry.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.concept.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const selectedGame = sandboxRegistry.find(g => g.id === selectedId) || filteredGames[0];

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Beginner': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
            case 'Intermediate': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
            case 'Advanced': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
        }
    };

    return (
        <div className="w-full max-w-7xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header Section */}
            <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
                    <Terminal size={14} className="animate-pulse" /> The Forge Archive
                </div>
                <h1 className="text-6xl font-black tracking-tight leading-tight">
                    Museum of <span className="nebula-text">Mechanics</span>
                </h1>
                <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                    A curated collection of <span className="text-white border-b border-white/20 pb-0.5">Rust & Bevy</span> engines configured as pedagogical instruments. Don't teach the code—teach the intuition behind the system.
                </p>
            </div>

            {/* Educator How-To Callout */}
            <div className="glass-panel p-6 border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex-shrink-0">
                        <Lightbulb size={24} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white">How to Use This Museum</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            <span className="text-white font-medium">Browse</span> the archive by subject or search for specific concepts.
                            <span className="text-white font-medium"> Click any entry</span> to reveal its Technical Blueprint—complete with learning objectives, time estimates, and teaching notes.
                            Entries marked with <span className="text-emerald-400 font-medium">PLAYABLE</span> include live WASM demos you can run directly in your browser.
                        </p>
                        <p className="text-xs text-slate-500 font-mono uppercase tracking-widest pt-1">
                            Each engine is isomorphic to its subject—the mechanic IS the lesson.
                        </p>
                    </div>
                </div>
            </div>

            {/* Featured Exhibits */}
            {featuredGames.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Star size={20} className="text-amber-400" />
                        <h2 className="text-xl font-bold text-white">Featured Exhibits</h2>
                        <span className="text-xs text-slate-500 font-mono uppercase tracking-widest">Quick Start for Educators</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {featuredGames.map((game) => (
                            <button
                                key={game.id}
                                onClick={() => setSelectedId(game.id)}
                                className="p-6 rounded-2xl bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 border border-violet-500/30 text-left hover:border-violet-400/50 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <Star size={48} className="text-amber-400" />
                                </div>
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-violet-200 transition-colors">{game.title}</h3>
                                        <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">{game.subject} • {game.engine}</p>
                                    </div>
                                    {game.playable && (
                                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase flex items-center gap-1">
                                            <Play size={10} /> Playable
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed mb-3">{game.insight.slice(0, 120)}...</p>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${getDifficultyColor(game.difficulty)}`}>
                                        {game.difficulty}
                                    </span>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Clock size={12} /> {game.timeEstimate}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Interactive Archive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Registry List (Left) */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Category Filter Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeCategory === category
                                        ? 'bg-violet-600/30 text-violet-200 border border-violet-500/50'
                                        : 'bg-white/5 text-slate-400 border border-white/10 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="relative mb-6 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by subject, concept, or title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-12 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all font-mono text-sm"
                        />
                    </div>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredGames.map((game) => (
                            <button
                                key={game.id}
                                onClick={() => setSelectedId(game.id)}
                                className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border ${selectedId === game.id
                                    ? 'bg-violet-600/10 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                                    : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                                    } group relative overflow-hidden`}
                            >
                                {selectedId === game.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,1)]" />
                                )}
                                <div className="flex justify-between items-start mb-2">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className={`font-bold transition-colors ${selectedId === game.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                                {game.title}
                                            </h3>
                                            {game.playable && (
                                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase">PLAY</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{game.subject}</p>
                                    </div>
                                    <span className={`text-[10px] font-black transition-colors ${selectedId === game.id ? 'text-white' : 'text-white/20'}`}>{game.engine.split(' ')[0]}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${getDifficultyColor(game.difficulty)}`}>
                                        {game.difficulty}
                                    </span>
                                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                        <Clock size={10} /> {game.timeEstimate}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Technical Blueprint (Right) */}
                <div className="lg:col-span-7 sticky top-24">
                    {selectedGame ? (
                        <div className="nebula-glass p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden rounded-[2.5rem] shadow-[0_0_50px_-25px_rgba(139,92,246,0.3)] group/blueprint starry-panel">
                            {/* Glitter Layer */}
                            <div className="glitter-layer !opacity-10" />

                            {/* Nebula Glow Effects */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-600/20 rounded-full blur-[100px] group-hover/blueprint:bg-violet-600/40 transition-colors" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-fuchsia-600/20 rounded-full blur-[100px] group-hover/blueprint:bg-fuchsia-600/40 transition-colors" />

                            <div className="flex justify-between items-start border-b border-white/10 pb-6 relative">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-white/50">
                                        <Cpu size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Active Template ID: {selectedGame.id}</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white">{selectedGame.title}</h2>
                                    <div className="flex flex-wrap gap-3 pt-4">
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                            <Cpu size={12} /> {selectedGame.engine}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5">
                                            <Sparkles size={12} /> {selectedGame.concept}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${getDifficultyColor(selectedGame.difficulty)}`}>
                                            <Target size={12} /> {selectedGame.difficulty}
                                        </span>
                                        {selectedGame.playable && (
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase flex items-center gap-1.5">
                                                <Play size={12} /> Playable Demo
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                                    <Rocket size={28} className="text-white" />
                                </div>
                            </div>

                            {/* Time Estimate & Category */}
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Clock size={16} />
                                    <span className="font-medium">{selectedGame.timeEstimate}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Target size={16} />
                                    <span className="font-medium">{selectedGame.category}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <BookOpen size={16} />
                                    <span className="font-medium">{selectedGame.subject}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <MousePointer2 size={16} className="text-white/40" />
                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">The Core Mechanic</h4>
                                    </div>
                                    <p className="text-white font-bold leading-relaxed">{selectedGame.mechanic}</p>
                                    <p className="text-sm text-slate-400 leading-relaxed font-medium italic">"{selectedGame.insight}"</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={16} className="text-white/40" />
                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Pedagogical Intent</h4>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                                        <p className="text-amber-200 text-sm font-bold leading-relaxed">
                                            {selectedGame.pedagogy}
                                        </p>
                                        <p className="text-[10px] text-white/30 mt-2 font-mono uppercase tracking-widest">Archival Strategy</p>
                                    </div>
                                </div>
                            </div>

                            {/* Learning Objectives */}
                            {selectedGame.learningObjectives && selectedGame.learningObjectives.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                        <Target size={16} className="text-violet-400" />
                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Learning Objectives</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {selectedGame.learningObjectives.map((objective, idx) => (
                                            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10">
                                                <div className="flex items-start gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-violet-600/30 flex items-center justify-center text-violet-300 text-[10px] font-black flex-shrink-0 mt-0.5">
                                                        {idx + 1}
                                                    </div>
                                                    <p className="text-sm text-slate-300 leading-relaxed">{objective}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Teaching Notes (Expandable) */}
                            {selectedGame.teachingNotes && (
                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <button
                                        onClick={() => setShowTeachingNotes(!showTeachingNotes)}
                                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                                    >
                                        <BookOpen size={16} />
                                        <h4 className="text-xs font-black uppercase tracking-widest">Teaching Notes</h4>
                                        {showTeachingNotes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {showTeachingNotes && (
                                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <p className="text-emerald-200 text-sm leading-relaxed">{selectedGame.teachingNotes}</p>
                                            <p className="text-[10px] text-white/30 mt-3 font-mono uppercase tracking-widest">Practical Classroom Guidance</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="pt-6 border-t border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative">
                                <div className="text-left space-y-2 overflow-hidden flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">GitHub Repository Link</p>
                                    <a href={selectedGame.github} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors font-mono text-sm flex items-center gap-2 underline underline-offset-4 decoration-white/10 hover:decoration-white/40 break-words">
                                        {selectedGame.github} <ExternalLink size={14} className="shrink-0" />
                                    </a>
                                </div>
                                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                                    {selectedGame.playable && selectedGame.playUrl && (
                                        <button
                                            onClick={() => setPlayingDemo(true)}
                                            className="flex-1 md:flex-none px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/30 group/btn"
                                        >
                                            <PlayCircle size={20} className="group-hover/btn:animate-pulse" /> PLAY DEMO
                                        </button>
                                    )}
                                    <a
                                        href={selectedGame.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 md:flex-none px-6 py-4 rounded-2xl border border-white/20 bg-white/5 text-white font-black hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-lg hover:shadow-violet-500/10"
                                    >
                                        <Github size={20} /> VIEW SOURCE <ArrowRight size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[500px] flex items-center justify-center glass-panel border-dashed border-white/10">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto opacity-20">
                                    <Box size={32} />
                                </div>
                                <p className="text-slate-500 font-mono text-sm">SELECT AN ARTIFACT FOR ANALYSIS</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Learning Outcome Filter Section (Replaces Archetypal Matrix) */}
            <div className="space-y-8 relative pt-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-white">The <span className="text-amber-400">Pedagogical</span> Lens</h2>
                    <p className="text-slate-500 text-sm font-mono tracking-widest uppercase">Filter by Learning Outcome & Difficulty</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Difficulty Filter Cards */}
                    <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-4 hover:border-emerald-500/40 transition-all group cursor-pointer" onClick={() => setActiveCategory('All')}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                <Award size={20} />
                            </div>
                            <h4 className="font-bold text-emerald-300 uppercase tracking-tight">Beginner</h4>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {sandboxRegistry.filter(g => g.difficulty === 'Beginner').length} engines ready for first-time exploration. No prerequisites required.
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {sandboxRegistry.filter(g => g.difficulty === 'Beginner').slice(0, 3).map(g => (
                                <span key={g.id} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">{g.title}</span>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-4 hover:border-amber-500/40 transition-all group cursor-pointer" onClick={() => setActiveCategory('All')}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                                <Target size={20} />
                            </div>
                            <h4 className="font-bold text-amber-300 uppercase tracking-tight">Intermediate</h4>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {sandboxRegistry.filter(g => g.difficulty === 'Intermediate').length} engines requiring foundational knowledge. Guided discovery recommended.
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {sandboxRegistry.filter(g => g.difficulty === 'Intermediate').slice(0, 3).map(g => (
                                <span key={g.id} className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">{g.title}</span>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20 space-y-4 hover:border-rose-500/40 transition-all group cursor-pointer" onClick={() => setActiveCategory('All')}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                                <Rocket size={20} />
                            </div>
                            <h4 className="font-bold text-rose-300 uppercase tracking-tight">Advanced</h4>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {sandboxRegistry.filter(g => g.difficulty === 'Advanced').length} engines for deep exploration. Best for experienced educators.
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {sandboxRegistry.filter(g => g.difficulty === 'Advanced').slice(0, 3).map(g => (
                                <span key={g.id} className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">{g.title}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Perspective Shift: Passive vs Active */}
            <div className="grid md:grid-cols-2 gap-8 items-stretch pt-12">
                <div className="p-10 rounded-[2.5rem] bg-slate-900 border border-white/5 space-y-6 relative overflow-hidden group hover:border-red-500/20 transition-all duration-700">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <BookOpen size={64} />
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">The Old World</span>
                        <h3 className="text-3xl font-black text-white">Passive Reception</h3>
                    </div>
                    <ul className="space-y-4">
                        {[
                            "Lesson plans as static data dumps.",
                            "Students as empty vessels for 'content'.",
                            "Imagination is treated as a distraction.",
                            "The 'Textbook Trap' of memorization."
                        ].map((text, i) => (
                            <li key={i} className="flex gap-3 text-slate-500 text-sm italic">
                                <span className="text-red-500/50">•</span> {text}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-white/[0.04] border border-white/20 space-y-6 relative overflow-hidden group hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all duration-700 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <BrainCircuit size={64} className="text-white" />
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">The Sovereign Forge</span>
                        <h3 className="text-3xl font-black text-white">Active Imagination</h3>
                    </div>
                    <ul className="space-y-4">
                        {[
                            "Lesson plans as dynamic parameters.",
                            "Students as Architects of their own intent.",
                            "Imagination is the primary engine of logic.",
                            "Participation as a lived isomorphic experience."
                        ].map((text, i) => (
                            <li key={i} className="flex gap-3 text-white text-sm font-bold">
                                <ShieldCheck className="text-white/80 shrink-0" size={18} /> {text}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom Credits & Logic Note */}
            <div className="glass-panel border-fuchsia-500/10 p-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-transparent via-fuchsia-500/5 to-transparent">
                <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 flex-shrink-0">
                    <Info size={24} />
                </div>
                <p className="text-sm text-slate-400 leading-relaxed max-w-4xl">
                    <span className="text-white font-bold">Museum Note:</span> These mechanics are selected explicitly because they are <span className="text-fuchsia-400 font-bold italic">isomorphic</span> to their subjects.
                    A physics simulation written in a low-level language like Rust allows for 100% precision.
                    When a student changes the 'mass' of an object in a Bevy engine, they are not interacting with a picture—they are interacting with the math itself.
                </p>
            </div>

            {/* Demo Modal */}
            {playingDemo && selectedGame && selectedGame.playUrl && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="relative w-full max-w-6xl h-full bg-slate-900 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(139,92,246,0.2)] flex flex-col">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400">
                                    <PlayCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{selectedGame.title}</h3>
                                    <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">LIVE WASM DEMO • {selectedGame.playUrl}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPlayingDemo(false)}
                                className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 bg-black relative">
                            <iframe
                                src={selectedGame.playUrl}
                                className="w-full h-full border-0"
                                title="Game Demo"
                                allowFullScreen
                            />
                        </div>
                        <div className="p-6 bg-white/[0.02] backdrop-blur-md border-t border-white/10 flex items-center gap-4">
                            <Info size={20} className="text-white shrink-0" />
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                <span className="text-white font-bold uppercase">Pro Tip:</span> This is a WASM build running directly in your browser. In the Desktop Forge, these templates are locally compiled for 0-latency performance.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}