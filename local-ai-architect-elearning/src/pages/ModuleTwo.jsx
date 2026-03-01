import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Server, HelpCircle, Code2, Gamepad2, Wand2, PlayCircle, ArrowLeft, ArrowRight, MessageSquareQuote, ShieldCheck, BookOpen } from 'lucide-react';
import ChunkedVideoPlayer from '../components/ChunkedVideoPlayer';
import { videos } from '../data/moduleData.jsx';

export default function ModuleTwo() {
    const [isHovered, setIsHovered] = useState(false);
    const module2Data = videos[1];

    return (
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* ... (keep headers) ... */}
            <div className="flex items-center justify-between border-b border-fuchsia-500/20 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Module 2: IDE Integration</h1>
                    <p className="text-fuchsia-300">Connecting LM Studio's Local Server to Cursor & Zed.</p>
                </div>
                <div className="px-4 py-2 glass-panel border-fuchsia-500/30 text-fuchsia-300 rounded-full text-sm font-semibold shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                    Step 2 of 3
                </div>
            </div>

            {/* Learning Objectives */}
            <div className="glass-panel p-6 space-y-4 border-fuchsia-500/20 bg-fuchsia-950/20 mb-8">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="text-fuchsia-400" size={20} /> Learning Objectives
                </h3>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">By the end of this module, you will be able to:</p>
                <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex items-start gap-2"><span className="text-fuchsia-400 font-bold">1.</span> Start LM Studio's local API server and understand what <strong>localhost</strong> means.</li>
                    <li className="flex items-start gap-2"><span className="text-fuchsia-400 font-bold">2.</span> Connect a code editor (Cursor or Zed) to your private AI server.</li>
                    <li className="flex items-start gap-2"><span className="text-fuchsia-400 font-bold">3.</span> Describe how AI scaffolding relates to Vygotsky's Zone of Proximal Development.</li>
                </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="glass-panel p-6 space-y-4 border-fuchsia-500/10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Server className="text-fuchsia-400" /> The Local Server
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        <a href="https://lmstudio.ai/" target="_blank" rel="noopener noreferrer" className="text-fuchsia-400 hover:text-fuchsia-300 underline underline-offset-2">LM Studio</a> isn't just a chat interface. It acts as an API server (just like OpenAI), but running locally on your machine.
                    </p>
                    <div className="mt-3 p-3 bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-lg">
                        <p className="text-xs text-fuchsia-200 flex items-start gap-2">
                            <HelpCircle size={14} className="text-fuchsia-400 mt-0.5 flex-shrink-0" />
                            <span><strong className="text-fuchsia-300">What is "localhost"?</strong> It's just your own computer talking to itself. When you see <code className="bg-fuchsia-500/20 text-fuchsia-300 px-1 rounded">localhost:1234</code>, it means "this computer, port 1234." Nothing goes to the internet — it's a private conversation between two programs on YOUR machine.</span>
                        </p>
                    </div>
                </div>

                <div className="glass-panel p-6 space-y-4 border-fuchsia-500/10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Code2 className="text-fuchsia-300" /> Plugging into IDEs
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Editors like <strong>Cursor</strong> and <strong>Zed</strong> are built for AI. By connecting our LM Studio local server, we get world-class autocompletion without cloud fees. But syntax isn't the goal—intent is.
                    </p>
                </div>

                <div className="glass-panel p-6 space-y-4 border-fuchsia-500/20 bg-fuchsia-950/20">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="text-fuchsia-400" /> The Technical Bible
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        The most important skill isn't coding—it's <strong className="text-fuchsia-300">delegation</strong>. We use a <strong>Technical Bible</strong>: a master document that defines the lore, mechanics, and pedagogy of our world. Because AI see your whole documentation at once, you just need to be specific with your intent.
                    </p>
                </div>

                <div className="glass-panel p-6 space-y-4 border-fuchsia-500/20 bg-fuchsia-950/20">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Gamepad2 className="text-fuchsia-400" /> The Evaluative Loop
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        You are the start and end of the loop. We test our logic in <strong>Roblox Studio</strong>—collecting items and evaluating how the code impacts the goal. If you can't evaluate the output, the middle is meaningless. Be the architect who closes the loop.
                    </p>
                </div>

                <div className="glass-panel p-6 space-y-4 md:col-span-2 border-fuchsia-500/20 shadow-[0_0_30px_rgba(217,70,239,0.05)]">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white">Scaffolding & The Zone of Proximal Development</h3>
                            <p className="text-slate-300 text-sm leading-relaxed mt-2">
                                In educational theory, Vygotsky's <strong>Zone of Proximal Development (ZPD)</strong> is the space between what a learner can do independently and what they can do with guidance. Integrating a local LLM into your IDE provides dynamic <strong>Scaffolding</strong>.
                            </p>
                            <ul className="list-disc list-outside ml-5 text-slate-300 text-sm space-y-2 mt-4">
                                <li><strong>Flow State:</strong> Just like a well-balanced game adjusts difficulty, the AI provides just enough code completion to keep you progressing without overwhelming frustration.</li>
                                <li><strong>Contextual Help:</strong> The AI sees your entire codebase, offering highly specific, "in-the-moment" explanations instead of generic answers.</li>
                            </ul>
                        </div>

                        {/* Sandbox Sidebar */}
                        <div className="w-full md:w-80 space-y-4">
                            <div className="bg-slate-900/50 border border-fuchsia-500/30 rounded-xl p-4 shadow-[0_0_20px_rgba(217,70,239,0.1)]">
                                <h4 className="text-fuchsia-300 font-bold text-sm mb-3 flex items-center gap-2">
                                    <Gamepad2 size={16} className="text-fuchsia-400" /> SANDBOX OBJECTIVES
                                </h4>
                                <ul className="space-y-2">
                                    <li className="flex gap-2 text-xs text-slate-300 group">
                                        <div className="w-4 h-4 rounded border border-fuchsia-500/50 flex-shrink-0 flex items-center justify-center text-[10px] group-hover:bg-fuchsia-500/20 transition-colors">1</div>
                                        <span>Locate the <strong>Archive</strong> in the Sovereign Sandbox.</span>
                                    </li>
                                    <li className="flex gap-2 text-xs text-slate-300 group">
                                        <div className="w-4 h-4 rounded border border-fuchsia-500/50 flex-shrink-0 flex items-center justify-center text-[10px] group-hover:bg-fuchsia-500/20 transition-colors">2</div>
                                        <span>Unlock the <strong>Logic Lens</strong> through interactive dialogue.</span>
                                    </li>
                                    <li className="flex gap-2 text-xs text-slate-300 group">
                                        <div className="w-4 h-4 rounded border border-fuchsia-500/50 flex-shrink-0 flex items-center justify-center text-[10px] group-hover:bg-fuchsia-500/20 transition-colors">3</div>
                                        <span>Identify the AI's role in the <strong>Synthesis Quiz</strong>.</span>
                                    </li>
                                </ul>
                                <div className="mt-4 pt-3 border-t border-fuchsia-500/10">
                                    <p className="text-[10px] text-slate-500 italic">
                                        Tip: Use [WASD] to navigate and [T] to interact with the environment.
                                    </p>
                                </div>
                            </div>

                            {/* Isomorphism Element */}
                            <div
                                className="bg-slate-950 rounded-xl border border-slate-700 p-4 cursor-default shadow-inner relative group"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <div className="absolute -top-3 left-4 bg-fuchsia-900 border border-fuchsia-500 text-fuchsia-100 text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                    <Wand2 size={10} /> Hover to Scaffolding
                                </div>
                                <pre className="font-mono text-[10px] leading-relaxed overflow-hidden">
                                    <span className="text-blue-400">fn</span> <span className="text-yellow-200">spawn_world</span>() {'{'}
                                    <br />    commands.<span className="text-yellow-200">spawn</span>((
                                    <div className={`transition-all duration-[1000ms] ${isHovered ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <span className="text-fuchsia-400/80 italic">{'  '}// AI Scaffolding...</span><br />
                                        <span className="text-fuchsia-300/80 italic">{'  '}println!("Sovereign world initiated.");</span>
                                    </div>
                                    <br />{'}'}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teacher Toolkit: Admin Talking Points */}
            <div className="glass-panel p-8 border-fuchsia-500/20 bg-fuchsia-950/20">
                <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                    <ShieldCheck size={24} className="text-fuchsia-400" /> Teacher Toolkit: Administrative Talking Points
                </h3>
                <p className="text-sm text-slate-300 mb-6 italic">
                    Use these specific talking points when discussing local AI with your school's Technology Director or Principal.
                </p>
                <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-fuchsia-500/20">
                        <h4 className="font-bold text-fuchsia-300 text-sm mb-2 flex items-center gap-2">
                            <MessageSquareQuote size={16} /> Privacy & FERPA Compliance
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            "Unlike cloud models (ChatGPT/Claude), LM Studio is a <strong className="text-white">Local-First</strong> application. Student data never leaves the device. There are no training logs, no remote servers, and no third-party data collection, making it inherently compliant with data privacy standards."
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-fuchsia-500/20">
                        <h4 className="font-bold text-fuchsia-300 text-sm mb-2 flex items-center gap-2">
                            <MessageSquareQuote size={16} /> Digital Sovereignty
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            "We are moving from being passive consumers of SaaS subscriptions to <strong className="text-white">Experience Architects</strong>. By owning the 'brain' (the model weights) and the 'forge' (the local hardware), the school retains complete sovereignty over its instructional tools."
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <PlayCircle className="text-fuchsia-400" /> Interactive Learning Session
                </h3>
                <ChunkedVideoPlayer videoData={module2Data} />
            </div>

            <div className="flex justify-between pt-8">
                <Link to="/module-1" className="glass-button text-slate-400 hover:text-white">
                    <ArrowLeft size={20} /> Back to Setup
                </Link>
                <Link to="/module-3" className="glass-button glass-button-primary shadow-[0_0_20px_rgba(217,70,239,0.3)] border-fuchsia-400/50 bg-fuchsia-600/80 hover:bg-fuchsia-500 hover:shadow-[0_0_20px_rgba(217,70,239,0.6)] text-white">
                    Continue to Sandbox <ArrowRight size={20} />
                </Link>
            </div>

        </div>
    );
}
