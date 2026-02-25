import { FileText, ArrowLeft, Copyright, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Documentation() {
    const [activeTab, setActiveTab] = useState('design');

    const tabs = [
        { id: 'design', name: 'Design Document', icon: <FileText size={18} /> },
        { id: 'plan', name: 'Project Plan', icon: <CheckSquare size={18} /> },
        { id: 'copyright', name: 'Copyright & Permissions', icon: <Copyright size={18} /> }
    ];

    return (
        <div className="w-full max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">

            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-white">Project Documentation</h1>
                <p className="text-slate-300 max-w-2xl mx-auto">
                    EDCI 56900 Final Project Requirements and Reflections.
                </p>
            </div>

            <div className="flex border-b border-white/10 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === tab.id
                                ? 'text-violet-400 border-b-2 border-violet-400'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        {tab.icon} {tab.name}
                    </button>
                ))}
            </div>

            <div className="glass-panel p-8 min-h-[500px] overflow-auto prose prose-invert prose-violet max-w-none">

                {activeTab === 'design' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">ATKINSON EDCI 569 Design Document</h2>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-violet-300">Gap Analysis</h3>
                            <p><strong>Current Status:</strong> Educators often rely on "closed" software that limits students to passive consumption. While teachers have creative ideas for interactive learning, they are often stopped by the "technical wall" of coding. Additionally, the cost and privacy risks of cloud-based AI tools prevent many schools from adopting these technologies.</p>
                            <p><strong>Desired Status:</strong> Educators function as "Experience Architects." They use local AI (LM Studio) and AI-Native IDEs (Cursor/Zed) to translate their teaching goals into game logic in real-time. The focus shifts from "how to code" to "what to build."</p>

                            <h3 className="text-xl font-semibold text-violet-300">Learner Analysis & Theory</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Constructionism (Papert):</strong> We don't just talk about AI; we build with it. Learning happens through the act of creating a sandbox.</li>
                                <li><strong>Cognitive Load Theory (Sweller):</strong> We use AI to handle the coding syntax (extraneous load), allowing the educator to focus on the teaching design (germane load).</li>
                                <li><strong>Self-Determination Theory (Deci & Ryan):</strong> We focus on Autonomy. Local tools give educators control over their own digital environment without corporate subscriptions.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeTab === 'plan' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Revised Project Plan</h2>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-violet-300">Project Goal</h3>
                            <p>By the end of this module, learners will be able to:</p>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li><strong>Configure</strong> a private, local AI environment (LM Studio) to serve as a creative partner.</li>
                                <li><strong>Orchestrate</strong> "Mentor-in-the-Loop" interactions by connecting LM Studio to IDEs like Cursor or Zed.</li>
                                <li><strong>Validate</strong> the efficacy of "Sovereign Ed-Tech" by building high-performance game demos via natural language.</li>
                            </ol>

                            <h3 className="text-xl font-semibold text-violet-300">ID Reflection</h3>
                            <p>I am exploring how Instructional Design can thrive through "Sovereign Computing." My background in narrative helps me see "coding" as a form of storytelling. By putting the tools of creation directly into the hands of teachers, I hope to help build a future where technology is accessible, private, and driven by the educator's imagination rather than corporate software constraints.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'copyright' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Copyright & Permissions</h2>
                        <div className="space-y-4">
                            <p>All assets used in the development of this eLearning module have been sourced, created, or licensed appropriately.</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Web Framework:</strong> React and Vite.js (MIT License)</li>
                                <li><strong>Styling:</strong> TailwindCSS (MIT License)</li>
                                <li><strong>Icons:</strong> Lucide React (ISC License)</li>
                                <li><strong>Visual Aesthetic:</strong> Custom Glassmorphism CSS developed entirely by Joshua Atkinson for EDCI 569.</li>
                                <li><strong>Text Content & Curated Media:</strong> Authored by Joshua Atkinson.</li>
                                <li><strong>AI Models:</strong> Open-source weights (e.g., Llama 3) running locally via LM Studio, ensuring no proprietary data is transmitted.</li>
                            </ul>
                        </div>
                    </div>
                )}

            </div>

            <div className="flex justify-start pt-8 border-t border-white/10">
                <Link to="/knowledge-check" className="glass-button text-slate-400 hover:text-white">
                    <ArrowLeft size={20} /> Back to Knowledge Check
                </Link>
            </div>

        </div>
    );
}
