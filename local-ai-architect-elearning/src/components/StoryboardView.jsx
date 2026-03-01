import { Film, Play, Monitor, Wifi, WifiOff, Server, Code2, Hammer, Gamepad2, BookOpen, Sparkles, Eye, ArrowRight, BrainCircuit, Shield, Wand2, Target, Layers, TerminalSquare, GraduationCap } from 'lucide-react';

import { videos, systemScreens, colorMap } from '../data/moduleData.jsx';

// ─── Component ───────────────────────────────────────────────────

export default function StoryboardView() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">

            {/* ── Header ────────────────────────────────── */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-300 text-sm font-medium border border-violet-500/20">
                    <Film size={16} /> E-Learning Storyboard
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">The Local AI Forge</h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
                    <strong className="text-slate-200">Architect:</strong> Joshua Atkinson &nbsp;·&nbsp;
                    <strong className="text-slate-200">Module:</strong> EDCI 56900 Final &nbsp;·&nbsp;
                    <strong className="text-slate-200">Date:</strong> February 2026
                </p>
            </div>

            {/* ── Part 1: Video Storyboards ──────────────── */}
            <section className="space-y-4">
                <SectionHeader number="1" title="The Architect's Collection" subtitle="A 'Show, Don't Tell' broadcast series demonstrating the Forge → Loop → Archetype workflow" />

                {videos.map((video) => (
                    <VideoStoryboard key={video.id} video={video} />
                ))}
            </section>

            {/* ── Part 2: System Storyboard ───────────────── */}
            <section className="space-y-6">
                <SectionHeader number="2" title="The Forge System Storyboard" subtitle="Screen-by-screen architectural flow of the unified React/Bevy platform" />

                {/* Flow Diagram */}
                <div className="glass-panel p-6 border-violet-500/10">
                    <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">The Secure Loop Flow</h4>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
                        {['Forge Intro', 'Hardware Setup', 'IDE Logic', 'NPC Archetypes', 'Sovereign Sandbox', 'Knowledge Check', 'Architectural Docs'].map((step, i) => (
                            <span key={step} className="flex items-center gap-2">
                                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300">{step}</span>
                                {i < 6 && <ArrowRight size={12} className="text-violet-500/50" />}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Screen Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                    {systemScreens.map((screen) => {
                        const c = colorMap[screen.color];
                        return (
                            <div key={screen.name} className={`glass-panel p-5 space-y-3 ${c.card} ${c.glow}`}>
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-white text-sm">{screen.name}</h4>
                                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${c.badge}`}>
                                        {screen.purpose}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">{screen.elements}</p>
                                <div className="flex items-start gap-2 pt-2 border-t border-white/5">
                                    <Eye size={12} className="text-violet-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-[11px] text-violet-300/70 italic leading-relaxed">{screen.isomorphic}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── Part 3: Interaction Blueprint ───────────── */}
            <section className="space-y-6">
                <SectionHeader number="3" title="The Interaction Blueprint" subtitle="The Natural Language Architect's reusable workflow" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { step: '1', label: 'Describe the Goal', instruction: '"I want my students to understand [Topic]."', example: '"…understand how photosynthesis converts sunlight into energy."' },
                        { step: '2', label: 'Define the Interaction', instruction: '"When the player does [Action], the world should [Result]."', example: '"When the player waters the plant, it grows and shows the equation."' },
                        { step: '3', label: 'Ask for Translation', instruction: '"Help me turn this into a step-by-step logic set for a game character."', example: 'AI generates If/Then rules ready for implementation.' },
                        { step: '4', label: 'Apply COSTAR', instruction: 'Refine with: Context, Objective, Style, Tone, Audience, Response.', example: 'Structured prompt → precise, implementable output.' },
                    ].map((item) => (
                        <div key={item.step} className="glass-panel p-5 space-y-3 border-indigo-500/10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-violet-500" />
                            <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">{item.step}</span>
                                <h4 className="font-bold text-white text-sm">{item.label}</h4>
                            </div>
                            <p className="text-xs text-slate-300 italic leading-relaxed">{item.instruction}</p>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{item.example}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Part 4: ID Reflection ───────────────────── */}
            <section className="space-y-6">
                <SectionHeader number="4" title="ID Reflection" subtitle="Professional application and isomorphic design philosophy" />
                <div className="glass-panel p-8 border-violet-500/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500" />
                    <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                        <p>
                            Learning to storyboard complex technical processes using simple, natural language is a core skill for my professional growth. It bridges the gap between advanced technology — local AI, game engines — and the practical needs of educators.
                        </p>
                        <p>
                            The <strong className="text-violet-300">isomorphic design philosophy</strong> applied throughout this project — where the learning experience itself embodies the principles it teaches — represents the kind of instructional design I want to create professionally. When a learner experiences scaffolding through a hover effect, or understands constructivism by being forced to type a command before content unlocks, the lesson becomes unforgettable because they <em>felt</em> it.
                        </p>
                        <blockquote className="border-l-4 border-violet-500 pl-4 text-violet-200/80 italic mt-4">
                            "Effective instructional design is creating the environment that allows intentional perspective to drive instruction."
                        </blockquote>
                    </div>
                </div>
            </section>

        </div>
    );
}

// ─── Sub-Components ──────────────────────────────────────────────

function SectionHeader({ number, title, subtitle }) {
    return (
        <div className="flex items-start gap-4 pb-4 border-b border-white/10">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-extrabold text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)] flex-shrink-0">
                {number}
            </span>
            <div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="text-sm text-slate-400">{subtitle}</p>
            </div>
        </div>
    );
}

function VideoStoryboard({ video }) {
    const c = colorMap[video.color];

    return (
        <div className={`glass-panel p-0 overflow-hidden ${c.glow}`}>
            {/* Video Header */}
            <div className={`px-6 py-5 border-b ${c.headerBorder} bg-gradient-to-r ${video.bg} to-transparent`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${video.gradient} flex items-center justify-center text-white font-extrabold shadow-lg`}>
                            {video.id}
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white">Video {video.id}: {video.title}</h4>
                            <p className="text-xs text-slate-400">{video.subtitle}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] font-medium">
                        <span className={`px-2.5 py-1 rounded-full border ${c.badge}`}>{video.duration}</span>
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">{video.tone}</span>
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">{video.tools}</span>
                    </div>
                </div>

                {/* Objectives */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {video.objectives.map((obj, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2">
                            <span className={`font-bold ${c.accent}`}>{i + 1}.</span>
                            <span>{obj}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scene Timeline */}
            <div className="p-6 space-y-0">
                {video.scenes.map((scene, i) => (
                    <div key={scene.num} className="flex gap-4 group">

                        {/* Timeline spine */}
                        <div className="flex flex-col items-center flex-shrink-0 w-8">
                            <div className={`w-8 h-8 rounded-full ${c.badge} border flex items-center justify-center z-10`}>
                                {scene.icon}
                            </div>
                            {i < video.scenes.length - 1 && (
                                <div className={`w-0.5 flex-1 ${c.line} my-1`} />
                            )}
                        </div>

                        {/* Scene Card */}
                        <div className={`flex-1 mb-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]`}>
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="font-bold text-white text-sm">
                                    <span className={`${c.accent} font-mono mr-2`}>{scene.num}</span>
                                    {scene.name}
                                </h5>
                                <span className="text-[10px] text-slate-500 font-mono">{scene.time}</span>
                            </div>

                            {/* Visual */}
                            <p className="text-xs text-slate-400 mb-2 flex items-start gap-2">
                                <Monitor size={12} className="text-slate-500 mt-0.5 flex-shrink-0" />
                                {scene.visual}
                            </p>

                            {/* Script */}
                            <blockquote className={`border-l-2 ${c.line} pl-3 text-xs text-slate-300/80 italic mb-3`}>
                                {scene.script}
                            </blockquote>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                                    <Layers size={10} /> {scene.gagne}
                                </span>
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${c.badge}`}>
                                    <BrainCircuit size={10} /> {scene.theory}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
