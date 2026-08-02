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

import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';

export default function CursorGlow() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const springConfig = { damping: 40, stiffness: 120 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    // Expanded Futuristic Palette (12 Colors)
    const colors = [
        "rgba(34, 211, 238, 0.25)", // Cyan
        "rgba(59, 130, 246, 0.25)", // Blue
        "rgba(99, 102, 241, 0.25)", // Indigo
        "rgba(139, 92, 246, 0.25)", // Violet
        "rgba(168, 85, 247, 0.25)", // Purple
        "rgba(217, 70, 239, 0.25)", // Fuchsia
        "rgba(236, 72, 153, 0.25)", // Pink
        "rgba(244, 63, 94, 0.25)",  // Rose
        "rgba(245, 158, 11, 0.25)", // Amber
        "rgba(132, 204, 22, 0.25)", // Lime
        "rgba(16, 185, 129, 0.25)", // Emerald
        "rgba(14, 165, 233, 0.25)", // Sky
        "rgba(34, 211, 238, 0.25)"  // Loop back
    ];
    
    const colorProgress = useMotionValue(0);
    // Map progress 0-12 to the colors array indices
    const currentColor = useTransform(colorProgress, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], colors);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const controls = animate(colorProgress, 12, {
            duration: 30, // Slower cycle for more colors
            repeat: Infinity,
            ease: "linear"
        });

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            controls.stop();
        };
    }, [mouseX, mouseY, colorProgress]);

    return (
        <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
            <motion.div
                className="absolute w-[1000px] h-[1000px] rounded-full"
                style={{
                    left: x,
                    top: y,
                    translateX: '-50%',
                    translateY: '-50%',
                    background: useTransform(currentColor, (c) => `radial-gradient(circle, \${c} 0%, transparent 70%)`),
                }}
            />
            
            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full blur-[120px]"
                style={{
                    left: x,
                    top: y,
                    translateX: '-50%',
                    translateY: '-50%',
                    backgroundColor: useTransform(currentColor, (c) => c ? c.replace('0.25', '0.4') : "rgba(34, 211, 238, 0.4)"),
                }}
            />
        </div>
    );
}
