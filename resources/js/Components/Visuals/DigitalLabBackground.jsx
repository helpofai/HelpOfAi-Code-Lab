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

export default function DigitalLabBackground() {
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

        // Animation state
        const particles = [];
        const scanLines = [];
        const gridSize = 50;

        // Initialize particles (data packets)
        for (let i = 0; i < 30; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        // Initialize scanning lines
        for (let i = 0; i < 3; i++) {
            scanLines.push({
                y: Math.random() * canvas.height,
                speed: Math.random() * 1 + 0.5,
                opacity: Math.random() * 0.1
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#020617'; // Deep navy background
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 1. Draw Static Grid
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.03)';
            ctx.lineWidth = 1;
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // 2. Draw "+" Intersections (Blueprint Style)
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)';
            const plusSize = 3;
            for (let x = gridSize; x < canvas.width; x += gridSize * 2) {
                for (let y = gridSize; y < canvas.height; y += gridSize * 2) {
                    if (Math.random() > 0.98) continue; // Random flickering
                    ctx.beginPath();
                    ctx.moveTo(x - plusSize, y); ctx.lineTo(x + plusSize, y);
                    ctx.moveTo(x, y - plusSize); ctx.lineTo(x, y + plusSize);
                    ctx.stroke();
                }
            }

            // 3. Draw Scan Lines
            scanLines.forEach(line => {
                ctx.beginPath();
                const gradient = ctx.createLinearGradient(0, line.y, 0, line.y + 100);
                gradient.addColorStop(0, `rgba(34, 211, 238, 0)`);
                gradient.addColorStop(0.5, `rgba(34, 211, 238, ${line.opacity})`);
                gradient.addColorStop(1, `rgba(34, 211, 238, 0)`);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, line.y, canvas.width, 100);
                
                line.y += line.speed;
                if (line.y > canvas.height) {
                    line.y = -100;
                    line.speed = Math.random() * 1 + 0.5;
                }
            });

            // 4. Draw Floating Data Packets
            particles.forEach(p => {
                ctx.fillStyle = `rgba(34, 211, 238, ${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Add subtle glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#22d3ee';
                
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
                
                ctx.shadowBlur = 0; // Reset shadow
            });

            // 5. Digital Noise / Grain
            if (Math.random() > 0.5) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
                for (let i = 0; i < 50; i++) {
                    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
                }
            }

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
        />
    );
}