import { ArrowRight, ArrowLeft, PlayCircle, Code2, Server, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ModuleTwo() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">

            <div className="flex items-center justify-between border-b border-fuchsia-500/20 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Module 2: IDE Integration</h1>
                    <p className="text-fuchsia-300">Connecting LM Studio's Local Server to Cursor & Zed.</p>
                </div>
                <div className="px-4 py-2 glass-panel border-fuchsia-500/30 text-fuchsia-300 rounded-full text-sm font-semibold shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                    Step 2 of 3
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="glass-panel p-6 space-y-4 border-fuchsia-500/10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Server className="text-fuchsia-400" /> The Local Server
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        <a href="https://lmstudio.ai/" target="_blank" rel="noopener noreferrer" className="text-fuchsia-400 hover:text-fuchsia-300 underline underline-offset-2">LM Studio</a> isn't just a chat interface. It acts as an API server (just like OpenAI), but running locally on your `localhost`. This allows professional developer tools to plug right into it.
                    </p>
                </div>

                <div className="glass-panel p-6 space-y-4 border-fuchsia-500/10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Code2 className="text-fuchsia-300" /> Plugging into IDEs
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Code editors like <strong><a href="https://cursor.com/" target="_blank" rel="noopener noreferrer" className="text-fuchsia-400 hover:text-fuchsia-300 underline underline-offset-2">Cursor</a></strong> and <strong><a href="https://zed.dev/" target="_blank" rel="noopener noreferrer" className="text-fuchsia-400 hover:text-fuchsia-300 underline underline-offset-2">Zed</a></strong> are built for AI. By overriding their default API endpoint with our LM Studio local server URL, we get world-class autocompletion and code generation without paying subscription fees or sending code to the cloud.
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

            <div className="glass-panel p-1 rounded-2xl aspect-video relative group overflow-hidden bg-black/40 border-fuchsia-500/10">
                {/* Placeholder for ADA 508 Compliant Video */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                    <PlayCircle size={64} className="text-fuchsia-400 mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]" />
                    <h3 className="text-xl font-bold text-white mb-2">Video 2: The Connection (06:45)</h3>
                    <p className="text-slate-400 max-w-md">
                        Click to play. Includes closed captions and downloadable transcript for ADA 508 compliance.
                    </p>
                </div>
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
