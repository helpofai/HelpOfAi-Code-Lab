import React, { useState, useEffect } from 'react';

export default function TextDecode({ text, delay = 0 }) {
    const [displayText, setDisplayText] = useState('');
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+';

    useEffect(() => {
        let iteration = 0;
        let interval = null;

        const startTimeout = setTimeout(() => {
            interval = setInterval(() => {
                setDisplayText(text.split('').map((char, index) => {
                    if (index < iteration) return text[index];
                    return characters[Math.floor(Math.random() * characters.length)];
                }).join(''));

                if (iteration >= text.length) {
                    clearInterval(interval);
                }
                iteration += 1 / 3;
            }, 30);
        }, delay);

        return () => {
            clearTimeout(startTimeout);
            clearInterval(interval);
        };
    }, [text, delay]);

    return <span>{displayText}</span>;
}
