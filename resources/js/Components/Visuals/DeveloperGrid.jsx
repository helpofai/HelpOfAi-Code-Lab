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

import React, { useEffect, useRef } from 'react';

export default function DeveloperGrid() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const characters = '01<>/{}[]#()!+=-*&^%;:';
        const fontSize = 10;
        const columns = Math.ceil(canvas.width / 30);
        const rows = Math.ceil(canvas.height / 30);
        
        const dataPoints = [];
        for (let i = 0; i < 40; i++) {
            dataPoints.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                char: characters[Math.floor(Math.random() * characters.length)]
            });
        }

        const render = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; // Subtle trail
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Blueprint Grid
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.03)'; // Cyan grid
            ctx.lineWidth = 1;
            
            for (let x = 0; x < canvas.width; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Render Drifting Code Symbols
            ctx.font = `${fontSize}px "JetBrains Mono", "Fira Code", monospace`;
            dataPoints.forEach(p => {
                ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
                ctx.fillText(p.char, p.x, p.y);

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ filter: 'blur(0.5px)' }}
        />
    );
}