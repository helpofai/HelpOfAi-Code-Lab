import React, { useState, useEffect, useRef } from 'react';
import { Zap, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdUnit from '@/Components/AdUnit';

const AdLockOverlay = ({ lockAd, lockType, onAdViewed, onUnlock, isVisible }) => {
    const [phase, setPhase] = useState('idle'); // idle, loading, verifying, completed, failed
    const [progress, setProgress] = useState(0);
    const progressInterval = useRef(null);

    // Simplified progression
    useEffect(() => {
        if (isVisible && phase === 'idle') {
            startAdFlow();
        }
    }, [isVisible, phase]);

    const startAdFlow = () => {
        setPhase('loading');
        setProgress(0);
        
        // Advance progress
        progressInterval.current = setInterval(() => {
            setProgress(prev => Math.min(prev + 1, 95));
        }, 100);
    };

    const handleAdLoaded = () => {
        // When ad unit signals load success
        setPhase('verifying');
    };

    const completeValidation = () => {
        clearInterval(progressInterval.current);
        setProgress(100);
        setPhase('completed');
        setTimeout(() => {
            onAdViewed();
            onUnlock();
        }, 1000);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-6"
                >
                    <div className="bg-black border border-gray-800 p-8 rounded-3xl max-w-md w-full text-center space-y-6">
                        <h4 className="text-xl font-black text-white uppercase tracking-widest flex items-center justify-center gap-2">
                            <Zap size={20} className="text-cyan-500" /> Unlock Protocol
                        </h4>

                        {/* Ad Container */}
                        <div className="min-h-[200px] flex items-center justify-center bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                            {phase === 'idle' ? (
                                <button onClick={startAdFlow} className="py-3 px-6 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400">
                                    Watch Ad to Unlock
                                </button>
                            ) : (
                                <AdUnit ad={lockAd} onAdLoaded={handleAdLoaded} />
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div className="h-full bg-cyan-500" style={{ width: `${progress}%` }} />
                            </div>
                            <p className="text-xs text-gray-400 font-mono uppercase">
                                {phase === 'loading' ? 'Loading Sponsor...' : phase === 'verifying' ? 'Validating...' : 'Access Granted'}
                            </p>
                        </div>
                        
                        {phase === 'verifying' && (
                             <button onClick={completeValidation} className="w-full py-2 bg-emerald-600 text-white rounded-lg font-bold">
                                Verify Engagement
                             </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AdLockOverlay;