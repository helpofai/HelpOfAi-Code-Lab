import React, { useState, useEffect } from 'react';

export default function NeuralTyping({ text, speed = 50, delay = 0 }) {
    const [displayedText, setDisplayText] = useState('');

    useEffect(() => {
        let i = 0;
        let interval = null;

        const startTimeout = setTimeout(() => {
            interval = setInterval(() => {
                setDisplayText(text.slice(0, i + 1));
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                }
            }, speed);
        }, delay);

        return () => {
            clearTimeout(startTimeout);
            clearInterval(interval);
        };
    }, [text, speed, delay]);

    return (
        <span className="relative">
            {displayedText}
            <span className="inline-block w-1 h-4 bg-cyan-400 ml-1 animate-pulse" />
        </span>
    );
}
