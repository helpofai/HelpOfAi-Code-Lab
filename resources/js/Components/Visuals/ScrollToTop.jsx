import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            // Show button after 300px
            const scrolled = window.scrollY;
            setIsVisible(scrolled > 300);

            // Calculate progress
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / height) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    className="fixed bottom-10 right-10 z-[100]"
                >
                    <button
                        onClick={scrollToTop}
                        className="relative group p-4 bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-full hover:border-cyan-500 transition-all shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] active:scale-90"
                    >
                        {/* Circular Progress Path */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="48"
                                fill="none"
                                stroke="rgba(34, 211, 238, 0.1)"
                                strokeWidth="4"
                            />
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="48"
                                fill="none"
                                stroke="#22d3ee"
                                strokeWidth="4"
                                strokeLinecap="round"
                                style={{
                                    pathLength: scrollProgress / 100
                                }}
                            />
                        </svg>
                        
                        <ChevronUp className="text-cyan-400 group-hover:text-white transition-colors" size={20} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}