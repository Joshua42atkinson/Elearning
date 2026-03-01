import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy, Target, Brain, Shield, Sparkles, ChevronRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const questions = [
    // Category 1: Privacy & Setup (Questions 1-3)
    {
        id: 1,
        category: 'Privacy & Setup',
        categoryIcon: 'shield',
        scenario: 'A middle school teacher wants to let students experiment with an AI chatbot to practice conversational Spanish. She\'s worried about student data being collected.',
        question: 'What is the BEST recommendation for this teacher?',
        options: [
            { id: 'a', text: 'Use ChatGPT with a school-wide account so it\'s "official."', correct: false },
            { id: 'b', text: 'Install LM Studio on classroom computers so the AI runs entirely offline — no student data leaves the building.', correct: true },
            { id: 'c', text: 'Have students create individual accounts on a free AI platform.', correct: false },
            { id: 'd', text: 'Avoid AI entirely until district policy catches up.', correct: false },
        ],
        correctFeedback: 'Running AI locally via LM Studio means zero data leaves the classroom. Student mistakes, questions, and explorations remain completely private — the foundation of a "Safe Failure Space."',
        incorrectFeedback: 'Cloud-based AI services send student data to external servers. The local-first approach with LM Studio ensures complete data sovereignty.',
        theory: 'Data Sovereignty',
        module: 1,
        meta: 'This quiz runs in your browser with no server-side tracking. Your answers aren\'t logged anywhere — you\'re experiencing the same data sovereignty this question tests.',
    },
    {
        id: 2,
        category: 'Privacy & Setup',
        categoryIcon: 'shield',
        scenario: 'You\'ve just downloaded LM Studio and installed a 7B parameter model. A colleague asks: "But what happens when the internet goes down during class?"',
        question: 'What is the correct answer?',
        options: [
            { id: 'a', text: 'The AI stops working — it needs the internet to process queries.', correct: false },
            { id: 'b', text: 'It switches to a limited "offline mode" with reduced capability.', correct: false },
            { id: 'c', text: 'Nothing changes — the model runs entirely on local hardware and never needs internet after the initial download.', correct: true },
            { id: 'd', text: 'You\'d need to cache responses ahead of time.', correct: false },
        ],
        correctFeedback: 'Once downloaded, the model is yours. It runs on your CPU/GPU with no internet dependency. This is the "turn off Wi-Fi" moment — proof that you own your tools.',
        incorrectFeedback: 'Local AI models run entirely on your hardware. After the initial download, internet is never required.',
        theory: 'Self-Determination Theory (Autonomy)',
        module: 1,
        meta: 'Notice you can retake this quiz anytime with no penalty. There\'s no grade server. That autonomy you feel right now? That\'s SDT in action — on you.',
    },
    {
        id: 3,
        category: 'Privacy & Setup',
        categoryIcon: 'shield',
        scenario: 'A district IT administrator is evaluating AI tools for K-12 classrooms and asks about FERPA compliance.',
        question: 'Why does local AI have an inherent advantage over cloud AI for FERPA compliance?',
        options: [
            { id: 'a', text: 'Local AI is automatically FERPA certified.', correct: false },
            { id: 'b', text: 'No student data is transmitted to or stored on third-party servers, eliminating the primary data privacy risk.', correct: true },
            { id: 'c', text: 'Local AI doesn\'t generate any student data.', correct: false },
            { id: 'd', text: 'FERPA only applies to cloud services, not local ones.', correct: false },
        ],
        correctFeedback: 'FERPA\'s core concern is protecting student education records from unauthorized access. When AI runs locally, no data crosses network boundaries — the risk surface is fundamentally smaller.',
        incorrectFeedback: 'The key FERPA advantage is that no student data is transmitted externally. Local processing eliminates third-party data exposure entirely.',
        theory: 'Safe Failure Space',
        module: 1,
        meta: 'If you got this wrong, nothing bad happened. No grade dropped. You just got feedback and kept going. This quiz IS a Safe Failure Space.',
    },

    // Category 2: Prompt Engineering (Questions 4-7)
    {
        id: 4,
        category: 'Prompt Engineering',
        categoryIcon: 'target',
        scenario: 'An educator wants the AI to generate NPC dialogue for a biology sandbox game.',
        question: 'Which prompt demonstrates the COSTAR framework most effectively?',
        options: [
            { id: 'a', text: '"Write dialogue for a biology NPC."', correct: false },
            { id: 'b', text: '"Make an NPC that teaches photosynthesis."', correct: false },
            { id: 'c', text: '"[Context] A 2D RPG set in a cell. [Objective] Create an NPC chloroplast that uses Socratic questioning to guide players toward understanding the light-dependent reactions. [Style] Dialogue screenplay. [Tone] Curious and encouraging. [Audience] 9th graders. [Response] JSON format, max 3 exchanges."', correct: true },
            { id: 'd', text: '"Generate a script where an NPC explains photosynthesis step by step with quiz questions at the end."', correct: false },
        ],
        correctFeedback: 'This prompt uses every COSTAR element: Context (the game world), Objective (Socratic questioning about light reactions), Style (screenplay), Tone (curious), Audience (9th grade), and Response constraints (JSON, 3 exchanges). Structured prompts produce structured results.',
        incorrectFeedback: 'The COSTAR framework requires all six elements: Context, Objective, Style, Tone, Audience, and Response constraints. Vague prompts produce vague output.',
        theory: 'The COSTAR Framework',
        module: 3,
        meta: 'Every question in this quiz was written using COSTAR: Context (scenario), Objective (the question), Style (multiple choice), Tone (professional), Audience (you), Response (4 constrained options). You\'re inside a COSTAR prompt right now.',
    },
    {
        id: 5,
        category: 'Prompt Engineering',
        categoryIcon: 'target',
        scenario: 'You\'re using Cursor IDE connected to your LM Studio local server. You want to generate game logic where a bee only pollinates a flower if the student correctly identifies mutualism.',
        question: 'Which approach is most aligned with the "Experience Architect" mindset?',
        options: [
            { id: 'a', text: 'Ask the AI: "Write code for a bee that flies to a flower when the player presses spacebar."', correct: false },
            { id: 'b', text: 'Ask the AI: "I\'m teaching ecosystem interdependence. Create behavior where the flower only blooms if a player correctly explains mutualism to the bee NPC, demonstrating understanding before progression."', correct: true },
            { id: 'c', text: 'Search Stack Overflow for "bee pollination game script" and copy-paste.', correct: false },
            { id: 'd', text: 'Ask the AI: "Give me the Lua code for two objects interacting in Roblox."', correct: false },
        ],
        correctFeedback: 'An Experience Architect leads with the LEARNING OUTCOME ("teaching ecosystem interdependence"), not the mechanical input ("press spacebar"). The AI becomes a pedagogical partner, not just a code generator.',
        incorrectFeedback: 'The key distinction is leading with the pedagogical goal, not the mechanical implementation. "I\'m teaching X" frames the AI as a learning design partner.',
        theory: 'Mentor-in-the-Loop',
        module: 3,
        meta: 'This quiz doesn\'t just TELL you the answer — it explains WHY, connects to theory, and links to the module. That explanatory feedback? That\'s the Mentor-in-the-Loop pattern, applied to you.',
    },
    {
        id: 6,
        category: 'Prompt Engineering',
        categoryIcon: 'target',
        scenario: 'A teacher is prompting their local AI to create a quiz NPC but gets generic, unhelpful responses.',
        question: 'What is the most likely problem with their prompt?',
        options: [
            { id: 'a', text: 'The AI model is too small and needs more parameters.', correct: false },
            { id: 'b', text: 'The prompt lacks specificity — missing context about the subject matter, student level, and desired interaction style.', correct: true },
            { id: 'c', text: 'Local AI can\'t generate good educational content.', correct: false },
            { id: 'd', text: 'They need to use a cloud-based AI for better quality.', correct: false },
        ],
        correctFeedback: '"Garbage in, garbage out" applies to prompts too. A COSTAR-structured prompt with specific context, audience, and response constraints will dramatically improve output quality — regardless of model size.',
        incorrectFeedback: 'Generic prompts produce generic output. The solution is almost always a more structured, specific prompt — not a bigger model.',
        theory: 'Cognitive Load Theory',
        module: 3,
        meta: 'Notice how this quiz shows one question at a time instead of all ten? That\'s Cognitive Load Theory — reducing extraneous load so you can focus on the germane content.',
    },
    {
        id: 7,
        category: 'Prompt Engineering',
        categoryIcon: 'target',
        scenario: 'You want to create a dialogue tree where an NPC scaffolds a student\'s understanding of fractions before giving the answer.',
        question: 'Which COSTAR element is MOST critical for this specific use case?',
        options: [
            { id: 'a', text: 'Style — specifying JSON output format.', correct: false },
            { id: 'b', text: 'Response — limiting output to 100 words.', correct: false },
            { id: 'c', text: 'Tone — making the NPC feel like a supportive mentor, not a quiz master.', correct: true },
            { id: 'd', text: 'Context — describing the game engine being used.', correct: false },
        ],
        correctFeedback: 'For scaffolding interactions, Tone is the difference between an NPC that TESTS and one that TEACHES. A "supportive mentor" tone creates the Zone of Proximal Development — the learner feels supported, not judged.',
        incorrectFeedback: 'While all COSTAR elements matter, Tone determines whether the NPC scaffolds learning (supportive mentor) or just delivers a test (quiz master). This directly connects to ZPD and the Safe Failure Space.',
        theory: 'Zone of Proximal Development',
        module: 2,
        meta: 'The feedback you received after your answer just scaffolded your understanding — adjusting based on whether you were right or wrong. This quiz is using the ZPD on you, in real-time.',
    },

    // Category 3: Pedagogical Theory (Questions 8-10)
    {
        id: 8,
        category: 'Pedagogical Theory',
        categoryIcon: 'brain',
        scenario: 'A colleague argues: "Just give students the code. Having AI write it is the same as copying from a textbook."',
        question: 'How would a Local AI Architect respond?',
        options: [
            { id: 'a', text: '"You\'re right — AI is just automated copying."', correct: false },
            { id: 'b', text: '"The difference is that prompting AI requires articulating your intent clearly. The act of writing a COSTAR prompt IS the learning — it forces you to define objectives, audience, and constraints before any code is generated."', correct: true },
            { id: 'c', text: '"AI code is always better than textbook code."', correct: false },
            { id: 'd', text: '"Students shouldn\'t use AI at all until they learn to code manually first."', correct: false },
        ],
        correctFeedback: 'This is Papert\'s Constructionism in action. The student isn\'t passively receiving code — they\'re constructing a specification. Writing a precise prompt requires deeper understanding than copying a solution, because you must articulate the WHY before the WHAT.',
        incorrectFeedback: 'The key insight is that prompt engineering IS a learning activity. Writing a COSTAR prompt forces students to articulate objectives, define audiences, and structure their thinking — a higher-order cognitive skill than copying code.',
        theory: 'Constructionism (Papert)',
        module: 3,
        meta: 'You\'re not passively reading about constructionism — you\'re actively constructing understanding by engaging with scenarios and making decisions. The quiz is constructivist by design.',
    },
    {
        id: 9,
        category: 'Pedagogical Theory',
        categoryIcon: 'brain',
        scenario: 'You\'re designing a sandbox game where students learn about the water cycle. You want the AI to adjust difficulty based on the student\'s responses.',
        question: 'Which pedagogical concept BEST describes what you\'re implementing?',
        options: [
            { id: 'a', text: 'Gamification — adding points and rewards.', correct: false },
            { id: 'b', text: 'Dynamic Scaffolding — the AI adjusts its support based on the learner\'s demonstrated understanding, keeping them in the Zone of Proximal Development.', correct: true },
            { id: 'c', text: 'Differentiated Instruction — creating separate content for each student level.', correct: false },
            { id: 'd', text: 'Formative Assessment — testing knowledge at regular intervals.', correct: false },
        ],
        correctFeedback: 'Local AI is the ultimate "More Knowledgeable Other." It never tires, never judges, and can infinitely adjust its scaffolding to meet the learner exactly where they are. This is Vygotsky\'s ZPD made scalable.',
        incorrectFeedback: 'Dynamic Scaffolding adapts in real-time to the learner\'s level — it\'s more than gamification (points) or differentiation (static tracks). The AI acts as Vygotsky\'s "More Knowledgeable Other," adjusting continuously.',
        theory: 'Dynamic Scaffolding (Vygotsky)',
        module: 2,
        meta: 'Wrong answers link you back to the relevant module for review. Right answers reinforce with theory. The quiz dynamically scaffolds YOUR learning path based on YOUR responses.',
    },
    {
        id: 10,
        category: 'Pedagogical Theory',
        categoryIcon: 'brain',
        scenario: 'Self-Determination Theory identifies three core psychological needs for intrinsic motivation: Autonomy, Competence, and Relatedness.',
        question: 'How does the Local AI Architect approach satisfy the need for AUTONOMY specifically?',
        options: [
            { id: 'a', text: 'By providing step-by-step tutorials that guide every decision.', correct: false },
            { id: 'b', text: 'By running AI on cloud servers managed by the school district.', correct: false },
            { id: 'c', text: 'By giving the educator complete ownership of their AI tools — locally hosted, no subscriptions, no vendor lock-in, no data harvesting.', correct: true },
            { id: 'd', text: 'By automating the entire game creation process.', correct: false },
        ],
        correctFeedback: 'Autonomy means genuine agency over your tools and process. When you own the model, control the server, and your data never leaves — you are sovereign. No vendor can revoke your access, change pricing, or mine your students\' data.',
        incorrectFeedback: 'SDT\'s autonomy isn\'t about automation or guided tutorials — it\'s about genuine control and ownership. Local AI gives educators sovereignty over their tools, data, and creative process.',
        theory: 'Self-Determination Theory',
        module: 1,
        meta: 'You chose to take this quiz. You can retake it. You control when to proceed. That\'s autonomy, competence-building, and relatedness (you\'re connecting to a community of architects) — all three SDT pillars, experienced firsthand.',
    },
];

const categoryConfig = {
    'Privacy & Setup': { icon: Shield, color: 'emerald', gradient: 'from-emerald-500 to-teal-500' },
    'Prompt Engineering': { icon: Target, color: 'fuchsia', gradient: 'from-fuchsia-500 to-violet-500' },
    'Pedagogical Theory': { icon: Brain, color: 'violet', gradient: 'from-violet-500 to-indigo-500' },
};

const gradeTiers = [
    { min: 9, label: 'Architect Master', emoji: '🏛️', message: 'You\'ve mastered the blueprint. You are ready to build worlds.' },
    { min: 7, label: 'Builder', emoji: '🔨', message: 'Strong foundation. A few more reps and you\'ll be architecting with confidence.' },
    { min: 5, label: 'Apprentice', emoji: '📐', message: 'You\'re on the path. Revisit the modules to solidify your understanding.' },
    { min: 0, label: 'Novice', emoji: '🌱', message: 'Every architect starts here. Review the modules and come back stronger.' },
];

export default function KnowledgeCheck() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [answers, setAnswers] = useState([]); // Array of { questionId, selectedId, correct }
    const [quizComplete, setQuizComplete] = useState(false);
    const [animatedScore, setAnimatedScore] = useState(0);

    const question = questions[currentQuestion];
    const progress = ((currentQuestion) / questions.length) * 100;
    const progressWithCurrent = ((currentQuestion + 1) / questions.length) * 100;

    const handleSelect = (optionId) => {
        if (showFeedback) return;
        setSelectedAnswer(optionId);
    };

    const handleConfirm = () => {
        if (!selectedAnswer || showFeedback) return;
        const isCorrect = question.options.find(o => o.id === selectedAnswer)?.correct;
        setAnswers(prev => [...prev, { questionId: question.id, selectedId: selectedAnswer, correct: isCorrect }]);
        setShowFeedback(true);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
            setShowFeedback(false);
        } else {
            setQuizComplete(true);
        }
    };

    const handleRetake = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setAnswers([]);
        setQuizComplete(false);
        setAnimatedScore(0);
    };

    // Animated score counter
    const totalCorrect = answers.filter(a => a.correct).length;
    useEffect(() => {
        if (!quizComplete) return;
        let current = 0;
        const interval = setInterval(() => {
            current += 1;
            setAnimatedScore(current);
            if (current >= totalCorrect) clearInterval(interval);
        }, 150);
        return () => clearInterval(interval);
    }, [quizComplete, totalCorrect]);

    const grade = gradeTiers.find(g => totalCorrect >= g.min);

    // Category breakdown
    const categoryScores = Object.keys(categoryConfig).map(cat => {
        const catQuestions = questions.filter(q => q.category === cat);
        const catCorrect = answers.filter(a => {
            const q = questions.find(qu => qu.id === a.questionId);
            return q.category === cat && a.correct;
        }).length;
        return { category: cat, correct: catCorrect, total: catQuestions.length };
    });

    // ─── RESULTS DASHBOARD ─────────────────────────
    if (quizComplete) {
        const percentage = Math.round((totalCorrect / questions.length) * 100);
        return (
            <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Score Hero */}
                <div className="glass-panel p-10 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10"></div>
                    <div className="relative">
                        <div className="text-7xl mb-4">{grade.emoji}</div>
                        <h1 className="text-4xl font-extrabold text-white mb-2">{grade.label}</h1>
                        <p className="text-slate-400 text-lg mb-8">{grade.message}</p>

                        {/* Score Ring */}
                        <div className="flex justify-center mb-6">
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                    <circle
                                        cx="60" cy="60" r="52" fill="none"
                                        stroke="url(#scoreGradient)" strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(animatedScore / questions.length) * 327} 327`}
                                        className="transition-all duration-500 ease-out"
                                    />
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#d946ef" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-extrabold text-white">{animatedScore}</span>
                                    <span className="text-sm text-slate-400">/ {questions.length}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-violet-300">{percentage}% Accuracy</p>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="grid md:grid-cols-3 gap-4">
                    {categoryScores.map(({ category, correct, total }) => {
                        const config = categoryConfig[category];
                        const Icon = config.icon;
                        const pct = Math.round((correct / total) * 100);
                        return (
                            <div key={category} className="glass-panel p-5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Icon size={18} className={`text-${config.color}-400`} />
                                    <h3 className="text-sm font-bold text-white">{category}</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-1000 ease-out`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-slate-300">{correct}/{total}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Missed Questions Review */}
                {answers.some(a => !a.correct) && (
                    <div className="glass-panel p-6 space-y-4 border-red-500/10">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <XCircle size={20} className="text-red-400" /> Review Missed Questions
                        </h3>
                        <div className="space-y-3">
                            {answers.filter(a => !a.correct).map(a => {
                                const q = questions.find(qu => qu.id === a.questionId);
                                return (
                                    <div key={a.questionId} className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                                        <p className="text-sm text-slate-300 mb-2">{q.question}</p>
                                        <p className="text-xs text-red-300 mb-1">Your answer: {q.options.find(o => o.id === a.selectedId)?.text}</p>
                                        <p className="text-xs text-emerald-300">Correct: {q.options.find(o => o.correct)?.text}</p>
                                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-2">
                                            <span className="text-[10px] uppercase tracking-wider text-violet-400 font-bold">{q.theory}</span>
                                            <span className="text-[10px] text-slate-500">→</span>
                                            <Link to={`/module-${q.module}`} className="text-[10px] text-violet-400 hover:text-violet-300 underline underline-offset-2">
                                                Review in Module {q.module}
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <button onClick={handleRetake} className="glass-button text-slate-400 hover:text-white">
                        <RotateCcw size={18} /> Retake Quiz
                    </button>
                    <Link to="/documentation" className="glass-button glass-button-primary bg-emerald-600/80 hover:bg-emerald-500 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        View Project Documents <ArrowRight size={20} />
                    </Link>
                </div>

                {/* The Meta Layer — Isomorphic Reveal */}
                <div className="glass-panel p-8 space-y-5 border-violet-500/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500" />
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/30">
                            <Eye size={20} className="text-violet-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">The Meta Layer</h3>
                            <p className="text-xs text-violet-300/70 uppercase tracking-wider">Isomorphic Design Reveal</p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">
                        You just completed a quiz about educational design principles. But here's the thing:
                        <strong className="text-white"> this quiz was designed using every principle it tested.</strong>
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                            <p className="text-xs font-bold text-fuchsia-400 mb-1">🎯 COSTAR Structure</p>
                            <p className="text-xs text-slate-400">Every question followed the framework: Context (scenario), Objective (question), Style (multiple choice), Tone (professional), Audience (you), Response (4 options).</p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                            <p className="text-xs font-bold text-emerald-400 mb-1">🧱 Constructionism</p>
                            <p className="text-xs text-slate-400">You weren't passively reading — you actively constructed understanding by making decisions and receiving feedback. The quiz was constructivist by design.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                            <p className="text-xs font-bold text-violet-400 mb-1">📐 Dynamic Scaffolding</p>
                            <p className="text-xs text-slate-400">Wrong answers linked to modules for review. Right answers reinforced theory. The feedback adapted to YOUR responses — ZPD in action.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                            <p className="text-xs font-bold text-amber-400 mb-1">🔒 Safe Failure Space</p>
                            <p className="text-xs text-slate-400">No grade server. No consequences for wrong answers. You could retake anytime. Your data never left the browser. Sovereignty, experienced firsthand.</p>
                        </div>
                    </div>

                    <blockquote className="border-l-4 border-violet-500 pl-4 mt-4">
                        <p className="text-sm text-slate-300 italic leading-relaxed">
                            "The medium is the message." This quiz didn't just TEST your knowledge of these principles — it DEMONSTRATED them. If you can recognize that, you're ready to build the same kind of experience for your own students.
                        </p>
                        <p className="text-xs text-violet-400 mt-2 not-italic">— The Architect's Principle</p>
                    </blockquote>
                </div>

            </div>
        );
    }

    // ─── QUIZ FLOW ─────────────────────────────────
    const catConfig = categoryConfig[question.category];
    const CatIcon = catConfig.icon;

    return (
        <div className="w-full max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">

            {/* Header */}
            <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-violet-500/30 text-violet-300">
                    <Sparkles size={16} />
                    <span className="text-sm font-medium tracking-wide uppercase">Knowledge Check</span>
                </div>
                <h1 className="text-3xl font-bold text-white">The Architect's Exam</h1>
                <p className="text-slate-400 text-sm max-w-lg mx-auto">
                    10 scenarios that test your understanding of local AI, prompt engineering, and learning theory.
                </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span className="flex items-center gap-1.5">
                        <CatIcon size={12} className={`text-${catConfig.color}-400`} />
                        {question.category}
                    </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                        className={`h-full rounded-full bg-gradient-to-r ${catConfig.gradient} transition-all duration-500 ease-out shadow-[0_0_10px_rgba(139,92,246,0.4)]`}
                        style={{ width: `${showFeedback ? progressWithCurrent : progress}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="glass-panel p-8 space-y-6 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${catConfig.gradient}`} />

                {/* Scenario */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">Scenario</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{question.scenario}</p>
                </div>

                {/* Question */}
                <h2 className="text-lg font-bold text-white">{question.question}</h2>

                {/* Options */}
                <div className="space-y-3">
                    {question.options.map((option) => {
                        let borderClass = 'border-white/5 hover:border-white/15';
                        let bgClass = 'hover:bg-white/[0.03]';
                        let ringClass = '';

                        if (selectedAnswer === option.id && !showFeedback) {
                            borderClass = `border-${catConfig.color}-500/50`;
                            bgClass = `bg-${catConfig.color}-500/5`;
                            ringClass = `shadow-[0_0_15px_rgba(139,92,246,0.15)]`;
                        }

                        if (showFeedback) {
                            if (option.correct) {
                                borderClass = 'border-emerald-500/50';
                                bgClass = 'bg-emerald-500/10';
                                ringClass = 'shadow-[0_0_15px_rgba(16,185,129,0.2)]';
                            } else if (selectedAnswer === option.id && !option.correct) {
                                borderClass = 'border-red-500/50';
                                bgClass = 'bg-red-500/10';
                                ringClass = 'shadow-[0_0_15px_rgba(239,68,68,0.15)]';
                            } else {
                                borderClass = 'border-white/5';
                                bgClass = 'opacity-40';
                            }
                        }

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleSelect(option.id)}
                                disabled={showFeedback}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 ${borderClass} ${bgClass} ${ringClass} ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 border transition-all ${selectedAnswer === option.id && !showFeedback
                                    ? `bg-${catConfig.color}-500/20 border-${catConfig.color}-500/50 text-${catConfig.color}-300`
                                    : showFeedback && option.correct
                                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                        : showFeedback && selectedAnswer === option.id && !option.correct
                                            ? 'bg-red-500/20 border-red-500/50 text-red-300'
                                            : 'bg-white/5 border-white/10 text-slate-500'
                                    }`}>
                                    {option.id.toUpperCase()}
                                </span>
                                <span className="text-sm text-slate-200 leading-relaxed pt-0.5">{option.text}</span>
                                {showFeedback && option.correct && (
                                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 ml-auto mt-0.5" />
                                )}
                                {showFeedback && selectedAnswer === option.id && !option.correct && (
                                    <XCircle size={18} className="text-red-400 flex-shrink-0 ml-auto mt-0.5" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Feedback Panel */}
                {showFeedback && (
                    <div className={`animate-in slide-in-from-bottom-4 fade-in duration-300 p-5 rounded-xl border ${answers[answers.length - 1]?.correct
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-red-500/30 bg-red-500/5'
                        }`}>
                        <div className="flex items-start gap-3">
                            {answers[answers.length - 1]?.correct
                                ? <CheckCircle2 size={20} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                                : <XCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                            }
                            <div>
                                <p className={`text-sm font-bold mb-1 ${answers[answers.length - 1]?.correct ? 'text-emerald-300' : 'text-red-300'}`}>
                                    {answers[answers.length - 1]?.correct ? 'Correct!' : 'Not quite.'}
                                </p>
                                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                                    {answers[answers.length - 1]?.correct ? question.correctFeedback : question.incorrectFeedback}
                                </p>
                                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                    <span className={`text-[10px] uppercase tracking-wider font-bold text-${catConfig.color}-400`}>
                                        {question.theory}
                                    </span>
                                    <span className="text-[10px] text-slate-500">•</span>
                                    <Link to={`/module-${question.module}`} className={`text-[10px] text-${catConfig.color}-400 hover:underline underline-offset-2`}>
                                        Module {question.module}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Meta Moment — isomorphic callout */}
                {showFeedback && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 p-4 rounded-xl border border-violet-500/20 bg-violet-500/[0.03] backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                            <Eye size={16} className="text-violet-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-[11px] uppercase tracking-wider font-bold text-violet-400 mb-1">Meta Moment</p>
                                <p className="text-xs text-slate-400 leading-relaxed italic">
                                    {question.meta}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
                <Link to="/sandbox" className="glass-button text-slate-400 hover:text-white">
                    <ArrowLeft size={18} /> Back to Sandbox
                </Link>
                <div className="flex gap-3">
                    {!showFeedback ? (
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedAnswer}
                            className="glass-button glass-button-primary shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            Confirm Answer <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="glass-button glass-button-primary shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                        >
                            {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight size={18} />
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
}
