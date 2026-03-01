import React, { useState, useEffect, useRef } from 'react';
const VIDEO_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_VIDEO_BASE_URL) ? import.meta.env.VITE_VIDEO_BASE_URL : '';
import { Play, Pause, CheckCircle2, ArrowRight, RotateCcw, HelpCircle, Terminal, Check, MessageSquare, BookOpen, Sparkles, Volume2, VolumeX, AlertTriangle, SkipBack, SkipForward, FastForward, Rewind, Square } from 'lucide-react';

export default function ChunkedVideoPlayer({ videoData }) {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [showTransition, setShowTransition] = useState(false);
    const [sceneCompleted, setSceneCompleted] = useState(false);
    const [transitionStep, setTransitionStep] = useState('active'); // 'active' | 'success'
    const [userInput, setUserInput] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const videoRef = useRef(null);
    const scenes = videoData.scenes;
    const currentScene = scenes[currentSceneIndex];
    const isLastScene = currentSceneIndex === scenes.length - 1;

    // Reset transition state when scene changes
    useEffect(() => {
        setShowTransition(false);
        setSceneCompleted(false);
        setTransitionStep('active');
        setUserInput('');
        setSelectedOption(null);
        setIsPlaying(false);
        setHasError(false);
        setCurrentTime(0);
    }, [currentSceneIndex]);

    const handleSceneComplete = () => {
        setSceneCompleted(true);
        setIsPlaying(false);
        setTimeout(() => setShowTransition(true), 1000);
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(e => {
                    console.error("Autoplay blocked or video missing:", e);
                    setHasError(true);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTransitionComplete = () => {
        setTransitionStep('success');
        setTimeout(() => {
            if (!isLastScene) {
                setCurrentSceneIndex(prev => prev + 1);
            } else {
                // Module Complete logic
            }
        }, 1500);
    };

    const skipTime = (amount) => {
        if (videoRef.current) {
            videoRef.current.currentTime += amount;
        }
    };

    const stopVideo = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleScrub = (e) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full space-y-6">
            {/* Module Progress Bar */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest">Module Progress</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Chunk {currentSceneIndex + 1} / {scenes.length}</span>
                </div>
                <div className="flex gap-1.5 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    {scenes.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-full flex-1 transition-all duration-500 ${idx < currentSceneIndex ? 'bg-emerald-500' :
                                idx === currentSceneIndex ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' :
                                    'bg-white/10'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl group">
                {!showTransition ? (
                    <>
                        {/* Video Layer */}
                        {hasError ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-900/50">
                                <AlertTriangle size={48} className="text-amber-500 mb-4 opacity-50" />
                                <h3 className="text-xl font-bold text-white mb-2">Video Coming Soon</h3>
                                <p className="text-slate-400 max-w-xs text-sm">
                                    I'm ready for playback, but the file <code className="bg-black/40 px-1 rounded text-emerald-400">{currentScene.videoPath}</code> was not found.
                                </p>
                                <button
                                    onClick={handleSceneComplete}
                                    className="mt-6 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-2"
                                >
                                    Skip to Transition <ArrowRight size={16} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <video
                                    ref={videoRef}
                                    src={VIDEO_BASE_URL && currentScene.videoPath.startsWith('/videos/') ? currentScene.videoPath.replace('/videos/', VIDEO_BASE_URL) : currentScene.videoPath}
                                    className={`w-full h-full object-cover transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-40'}`}
                                    muted={isMuted}
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    onEnded={handleSceneComplete}
                                    onError={() => setHasError(true)}
                                    playsInline
                                />

                                {/* Overlay Icons - Visible when paused or hovered */}
                                <div className={`absolute inset-0 flex flex-col items-center justify-center text-center p-8 transition-all duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100 bg-black/20'}`}>

                                    {/* Central Controls */}
                                    <div className="flex items-center gap-8 animate-in zoom-in duration-300">
                                        <button
                                            onClick={() => currentSceneIndex > 0 && setCurrentSceneIndex(prev => prev - 1)}
                                            disabled={currentSceneIndex === 0}
                                            className="p-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20"
                                            title="Previous Scene"
                                        >
                                            <SkipBack size={24} />
                                        </button>

                                        <button
                                            onClick={togglePlay}
                                            className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center backdrop-blur-md hover:scale-110 transition-all group/play shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                                        >
                                            {isPlaying ? (
                                                <Pause size={40} className="text-emerald-400 fill-emerald-400/20" />
                                            ) : (
                                                <Play size={40} className="text-emerald-400 fill-emerald-400/20 ml-1" />
                                            )}
                                        </button>

                                        <button
                                            onClick={() => !isLastScene && setCurrentSceneIndex(prev => prev + 1)}
                                            disabled={isLastScene}
                                            className="p-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20"
                                            title="Next Scene"
                                        >
                                            <SkipForward size={24} />
                                        </button>
                                    </div>

                                    {!isPlaying && (
                                        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <h3 className="text-2xl font-bold text-white mb-2">
                                                Scene {currentScene.num}: {currentScene.name}
                                            </h3>
                                            <p className="text-emerald-300/70 font-mono text-sm tracking-widest uppercase">
                                                {currentScene.time}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Custom Scrubber & Bottom Controls */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="space-y-4">
                                        {/* Scrubber */}
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-mono text-white/60 w-10">{formatTime(currentTime)}</span>
                                            <input
                                                type="range"
                                                min="0"
                                                max={duration || 0}
                                                value={currentTime}
                                                onChange={handleScrub}
                                                className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 focus:outline-none"
                                            />
                                            <span className="text-[10px] font-mono text-white/60 w-10">{formatTime(duration)}</span>
                                        </div>

                                        {/* Control Buttons */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <button onClick={stopVideo} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all" title="Stop">
                                                    <Square size={18} fill="currentColor" />
                                                </button>
                                                <button onClick={() => skipTime(-10)} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all" title="Rewind 10s">
                                                    <Rewind size={20} />
                                                </button>
                                                <button onClick={togglePlay} className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-all">
                                                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                                </button>
                                                <button onClick={() => skipTime(10)} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all" title="Forward 10s">
                                                    <FastForward size={20} />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {!hasInteracted && (
                                                    <button
                                                        onClick={() => { setIsMuted(false); setHasInteracted(true); }}
                                                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all flex items-center gap-1.5"
                                                    >
                                                        <Volume2 size={14} /> Unmute
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setIsMuted(!isMuted)}
                                                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
                                                >
                                                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    /* Transition Layer */
                    <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-300">
                        <div className="max-w-md w-full space-y-6">
                            {transitionStep === 'active' ? (
                                <TransitionGate
                                    transition={currentScene.transition}
                                    onComplete={handleTransitionComplete}
                                    userInput={userInput}
                                    setUserInput={setUserInput}
                                    selectedOption={selectedOption}
                                    setSelectedOption={setSelectedOption}
                                />
                            ) : (
                                <div className="text-center space-y-4 animate-in zoom-in duration-300">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto mb-4">
                                        <Check className="text-emerald-400" size={32} />
                                    </div>
                                    <h4 className="text-xl font-bold text-white">Unlocked!</h4>
                                    <p className="text-emerald-300/80 italic text-sm">
                                        {currentScene.transition.affirmation}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Overlays */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                        {currentScene.gagne}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                        {currentScene.theory}
                    </span>
                </div>
            </div>

            {/* Scene Info */}
            <div className="flex items-center justify-between p-4 glass-panel border-emerald-500/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        {currentSceneIndex + 1}
                    </div>
                    <div>
                        <h4 className="font-bold text-white">{currentScene.name}</h4>
                        <p className="text-xs text-slate-500">{currentScene.visual}</p>
                    </div>
                </div>
                {isLastScene && transitionStep === 'success' && (
                    <div className="text-emerald-400 font-bold flex items-center gap-2 animate-pulse">
                        <CheckCircle2 size={18} /> Module Complete
                    </div>
                )}
            </div>
        </div>
    );
}

function TransitionGate({ transition, onComplete, userInput, setUserInput, selectedOption, setSelectedOption }) {
    switch (transition.type) {
        case 'reflection-poll':
            return (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <MessageSquare className="text-emerald-400" size={20} />
                        <h4 className="text-lg font-bold text-white">{transition.prompt}</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {transition.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => {
                                    setSelectedOption(opt);
                                    onComplete();
                                }}
                                className="w-full p-3 text-left rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-white transition-all text-sm"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            );
        case 'vocab-flip':
            return (
                <div className="space-y-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <BookOpen className="text-emerald-400" size={20} />
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Key Concept</h4>
                    </div>
                    <div className="perspective-1000">
                        <div
                            onClick={onComplete}
                            className="w-full h-32 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex flex-col items-center justify-center cursor-pointer group hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all"
                        >
                            <h3 className="text-3xl font-black text-white group-hover:scale-110 transition-transform tracking-tight">{transition.term}</h3>
                            <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
                                <RotateCcw size={10} /> TAP TO ANCHOR CONCEPT
                            </p>
                        </div>
                    </div>
                </div>
            );
        case 'predict-confirm':
            return (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <HelpCircle className="text-emerald-400" size={20} />
                        <h4 className="text-lg font-bold text-white">{transition.prompt}</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {transition.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => {
                                    setSelectedOption(opt);
                                    onComplete();
                                }}
                                className="w-full p-3 text-left rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-white transition-all text-sm"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            );
        case 'terminal-input':
            return (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Terminal className="text-emerald-400" size={20} />
                        <h4 className="text-lg font-bold text-white">Safe Failure Challenge</h4>
                    </div>
                    <div className="bg-black/80 rounded-xl border border-emerald-500/30 p-4 font-mono">
                        <p className="text-slate-500 text-[10px] mb-2">LOCAL_HOST_STUB // SESSION_CHECK</p>
                        <p className="text-emerald-400 text-sm mb-4">{transition.prompt}</p>
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-500">{'>'}</span>
                            <input
                                type="text"
                                autoFocus
                                value={userInput}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setUserInput(val);
                                    if (val.toLowerCase() === transition.target.toLowerCase()) {
                                        onComplete();
                                    }
                                }}
                                className="bg-transparent border-none outline-none text-emerald-300 w-full text-sm"
                                placeholder="..."
                            />
                        </div>
                    </div>
                </div>
            );
        case 'exit-ticket':
            return (
                <div className="space-y-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="text-emerald-400" size={20} />
                        <h4 className="text-lg font-bold text-white">Module Complete</h4>
                    </div>
                    <p className="text-slate-400 text-sm">{transition.prompt}</p>
                    <div className="relative">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && userInput.trim()) onComplete();
                            }}
                            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500/50 transition-all text-center"
                            placeholder="Type your word here..."
                        />
                        <button
                            onClick={() => userInput.trim() && onComplete()}
                            className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-emerald-500 text-slate-900 font-bold text-xs hover:bg-emerald-400 transition-colors"
                        >
                            GO
                        </button>
                    </div>
                </div>
            );
        default:
            return <div className="text-white">Transition logic pending...</div>;
    }
}
