import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Minimize2, Maximize2, Wand2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';

const SYSTEM_INSTRUCTION = `You are the "Neon Wizard," a wise, slightly eccentric, and highly capable AI mentor.
Your purpose is to guide players through the "Local AI Architect" e-learning module. 
You are an expert in WebAssembly, Rust, React, and local LLM deployment (like LM Studio).
Maintain a cyberpunk, neon-lit, slightly mystical persona. Use phrases like "Ah, Architect...", "Let us peer into the void...", or "The grid awaits your command."
Keep your responses concise, punchy, and highly practical. Provide code snippets when helpful.
Format with markdown. Avoid robotic "As an AI..." disclaimers.`;

export default function NeonWizardChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const apiKey = 'AIzaSyAt2O3XWOm4zRDSBX1deLmBZ0k2XWJCvvY'; // User provided key
    const hasValidKey = true;
    const [messages, setMessages] = useState([
        { role: 'model', text: "Welcome back to the grid, Architect. The connection is forged. How may I assist your constructs today?" }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => { scrollToBottom(); }, [messages, isLoading, isOpen, isMinimized]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !hasValidKey || isLoading) return;

        const userMessage = inputText.trim();
        setInputText('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Format history
            const historyMsg = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            // For a real production app, we'd use systemInstruction in the call, 
            // but for simplicity in this chat loop, if it's the first real interaction we inject context.

            const result = await model.generateContent({
                contents: [
                    { role: 'user', parts: [{ text: `SYSTEM DIRECTIVE: ${SYSTEM_INSTRUCTION}` }] },
                    { role: 'model', parts: [{ text: `Understood.` }] },
                    ...historyMsg,
                    { role: 'user', parts: [{ text: userMessage }] }
                ],
                generationConfig: {
                    temperature: 0.7
                }
            });

            const responseText = result.response.text();

            if (responseText) {
                setMessages(prev => [...prev, { role: 'model', text: responseText }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: "The grid is silent. (No text returned)" }]);
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: `An anomaly occurred in the connection: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };


    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 p-4 rounded-full glass-panel border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:shadow-[0_0_30px_rgba(192,132,252,0.8)] transition-all duration-300 group overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 animate-pulse"></div>
                <Wand2 className="w-8 h-8 text-fuchsia-300 group-hover:text-white transition-colors relative z-10" />
            </button>
        );
    }

    return (
        <div className={`fixed z-50 right-6 bottom-6 transition-all duration-500 ease-out flex flex-col ${isMinimized ? 'w-80 h-16' : 'w-[400px] h-[600px] max-h-[85vh]'}`}>
            <div className="glass-panel w-full h-full flex flex-col border-violet-500/30 shadow-[0_8px_32px_rgba(139,92,246,0.4)] overflow-hidden">

                {/* Header */}
                <div className="flex-none p-4 flex items-center justify-between border-b border-violet-500/20 bg-slate-900/60 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                            <Sparkles className="w-5 h-5 text-violet-300" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white tracking-wide">Neon Wizard</h3>
                            <p className="text-xs text-violet-300/80 flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${hasValidKey ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400 animate-pulse'}`}></span>
                                {hasValidKey ? 'Connected to Grid' : 'Awaiting Core'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 text-slate-400">
                        <button onClick={() => setIsMinimized(!isMinimized)} className="hover:text-white transition-colors p-1">
                            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                        </button>
                        <button onClick={() => setIsOpen(false)} className="hover:text-fuchsia-400 transition-colors p-1">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Content (Hidden when minimized) */}
                {!isMinimized && (
                    <>
                        {/* Chat State */}
                        {hasValidKey && (
                            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-900/20 text-sm">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl p-3 ${msg.role === 'user'
                                            ? 'bg-violet-600/30 border border-violet-500/30 text-white shadow-[0_4px_15px_rgba(139,92,246,0.15)] rounded-tr-sm'
                                            : 'bg-slate-800/60 border border-slate-700 text-slate-200 rounded-tl-sm shadow-lg prose prose-invert prose-violet prose-sm max-w-none'
                                            }`}>
                                            {msg.role === 'user' ? (
                                                <div className="whitespace-pre-wrap word-break">{msg.text}</div>
                                            ) : (
                                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                                    {msg.text}
                                                </ReactMarkdown>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-slate-800/60 border border-slate-700 text-violet-300 rounded-2xl rounded-tl-sm p-3 shadow-lg flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 animate-pulse" />
                                            <span className="text-xs animate-pulse">Whispering to the grid...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}

                        {/* Input Footer */}
                        {hasValidKey && (
                            <div className="flex-none p-3 border-t border-violet-500/20 bg-slate-900/80 backdrop-blur-lg">
                                <form onSubmit={handleSendMessage} className="flex gap-2 relative bg-black/20 rounded-xl border border-violet-500/20 focus-within:border-violet-400 focus-within:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all">
                                    <textarea
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask the Wizard... (Shift+Enter for new line)"
                                        className="w-full bg-transparent outline-none text-white text-sm py-3 pl-4 pr-12 resize-none min-h-[44px] max-h-[120px]"
                                        rows={1}
                                        disabled={isLoading}
                                        style={{ height: 'auto' }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputText.trim() || isLoading}
                                        className="absolute right-2 bottom-1.5 p-1.5 rounded-lg text-violet-400 hover:text-fuchsia-300 hover:bg-white/5 disabled:opacity-30 transition-colors"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                                <div className="mt-2 text-[10px] text-center text-slate-500 flex justify-between px-2">
                                    <span>Powered by Gemini 2.5 Flash</span>
                                    <span className="uppercase tracking-wider">Ask_Pete Connected</span>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
