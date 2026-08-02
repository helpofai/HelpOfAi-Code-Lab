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
