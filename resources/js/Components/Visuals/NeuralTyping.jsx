/*
|--------------------------------------------------------------------------
| HelpOfAi (HOA) Professional Software
|--------------------------------------------------------------------------
|
| Copyright (c) 2026 Rajib Adhikary. All Rights Reserved.
|
| This file is part of the HelpOfAi Professional Software Suite.
| Unauthorized copying, modification, redistribution, reverse engineering,
| decompilation, or commercial use of this source code, in whole or in part,
| is strictly prohibited without prior written permission from the copyright owner.
|
| Author      : Rajib Adhikary
| Organization: HelpOfAi (HOA)
| Website     : https://helpofai.com
| Location    : Basta Purba Para, Aranghata, Nadia, West Bengal, India
|
| This source code contains proprietary and confidential information.
| Any unauthorized access or distribution may violate applicable copyright laws.
|
|--------------------------------------------------------------------------
*/

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
