import { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, XCircle, GripVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

const prompts = [
    {
        id: 1,
        text: "Write a game script that makes the bee fly to the flower when the player presses spacebar.",
        isGood: false,
        feedback: "Too focused on mechanics. An architect focuses on learning outcomes, not just input mapping."
    },
    {
        id: 2,
        text: "I'm teaching ecosystem interdependence. Create behavior where the flower only blooms if players successfully guide a bee to it first, showing mutualism.",
        isGood: true,
        feedback: "Excellent! This prompt focuses on the pedagogical goal (mutualism) and how the interaction supports it."
    },
    {
        id: 3,
        text: "Give me the code for a Roblox NPC.",
        isGood: false,
        feedback: "Too vague. A good prompt provides context, subject matter, and the specific interaction desired."
    },
    {
        id: 4,
        text: "Design a dialogue tree where the NPC asks questions that scaffold the student's understanding of fractions before giving the answer.",
        isGood: true,
        feedback: "Perfect. This uses 'Mentor-in-the-Loop' logic to create a supportive learning environment."
    }
];

export default function KnowledgeCheck() {
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleDragStart = (e, promptId) => {
        e.dataTransfer.setData("promptId", promptId);
    };

    const handleDrop = (e, category) => {
        e.preventDefault();
        const promptId = parseInt(e.dataTransfer.getData("promptId"));
        setAnswers(prev => ({ ...prev, [promptId]: category }));
    };

    const allowDrop = (e) => {
        e.preventDefault();
    };

    const checkAnswers = () => {
        setShowResults(true);
    };

    const score = Object.keys(answers).reduce((acc, currentId) => {
        const prompt = prompts.find(p => p.id === parseInt(currentId));
        const isCorrect = (prompt.isGood && answers[currentId] === 'good') || (!prompt.isGood && answers[currentId] === 'bad');
        return isCorrect ? acc + 1 : acc;
    }, 0);

    return (
        <div className="w-full max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">

            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-white">Knowledge Check: The Logic Sort</h1>
                <p className="text-slate-300 max-w-2xl mx-auto">
                    Drag and drop the prompts below into the correct category to see if you can identify good "Experience Architect" prompts versus poor mechanical prompts.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 pt-8">

                {/* Bank */}
                <div className="md:col-span-1 space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Prompt Bank</h3>
                    {prompts.filter(p => !answers[p.id]).map(prompt => (
                        <div
                            key={prompt.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, prompt.id)}
                            className="glass-panel p-4 cursor-grab active:cursor-grabbing hover:border-violet-400 transition-colors flex items-start gap-3 bg-black/20"
                        >
                            <GripVertical className="text-slate-500 mt-1 flex-shrink-0" size={18} />
                            <p className="text-sm text-slate-200">{prompt.text}</p>
                        </div>
                    ))}
                    {Object.keys(answers).length === prompts.length && (
                        <div className="p-4 border border-dashed border-slate-600 rounded-xl text-center text-slate-500 text-sm">
                            All prompts sorted!
                        </div>
                    )}
                </div>

                {/* Drop Zones */}
                <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">

                    {/* Good Prompts Zone */}
                    <div
                        className="glass-panel p-6 min-h-[300px] border-2 border-dashed border-violet-500/30 bg-violet-900/10"
                        onDrop={(e) => handleDrop(e, 'good')}
                        onDragOver={allowDrop}
                    >
                        <h3 className="text-lg font-semibold text-violet-300 mb-4 flex items-center gap-2">
                            <CheckCircle size={20} /> High-Quality Prompts
                        </h3>
                        <div className="space-y-3">
                            {prompts.filter(p => answers[p.id] === 'good').map(prompt => (
                                <div key={prompt.id} className="glass-panel p-4 bg-black/40 text-sm text-slate-200 relative">
                                    {prompt.text}
                                    {showResults && (
                                        <div className={`mt-3 pt-3 border-t text-xs ${prompt.isGood ? 'text-green-400 border-green-500/20' : 'text-red-400 border-red-500/20'}`}>
                                            {prompt.isGood ? '✅ Correct! ' : '❌ Incorrect. '}{prompt.feedback}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bad Prompts Zone */}
                    <div
                        className="glass-panel p-6 min-h-[300px] border-2 border-dashed border-slate-500/30 bg-slate-900/10"
                        onDrop={(e) => handleDrop(e, 'bad')}
                        onDragOver={allowDrop}
                    >
                        <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                            <XCircle size={20} /> Poor Prompts
                        </h3>
                        <div className="space-y-3">
                            {prompts.filter(p => answers[p.id] === 'bad').map(prompt => (
                                <div key={prompt.id} className="glass-panel p-4 bg-black/40 text-sm text-slate-200 relative">
                                    {prompt.text}
                                    {showResults && (
                                        <div className={`mt-3 pt-3 border-t text-xs ${!prompt.isGood ? 'text-green-400 border-green-500/20' : 'text-red-400 border-red-500/20'}`}>
                                            {!prompt.isGood ? '✅ Correct! ' : '❌ Incorrect. '}{prompt.feedback}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <Link to="/module-3" className="glass-button text-slate-400 hover:text-white">
                    <ArrowLeft size={20} /> Back to Module 3
                </Link>
                <div className="flex gap-4">
                    {Object.keys(answers).length === prompts.length && !showResults && (
                        <button onClick={checkAnswers} className="glass-button glass-button-primary shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                            Check Answers
                        </button>
                    )}
                    {showResults && (
                        <Link to="/documentation" className="glass-button glass-button-primary bg-green-600/80 hover:bg-green-500 border-green-400/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                            View Project Documents <ArrowRight size={20} />
                        </Link>
                    )}
                </div>
            </div>

        </div>
    );
}
