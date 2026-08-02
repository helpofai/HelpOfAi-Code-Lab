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

import React from 'react';

export default function AnimatedGrid() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Perspective wrapper for 3D effect */}
            <div className="absolute inset-0 [perspective:1000px] [transform-style:preserve-3d]">
                <div 
                    className="absolute inset-x-0 -top-1/2 h-[200%] bg-grid-pattern animate-grid-flow opacity-[0.25]"
                    style={{
                        transform: 'rotateX(45deg)',
                        maskImage: 'linear-gradient(to bottom, transparent, black 40%, black 70%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40%, black 70%, transparent)',
                    }}
                />
            </div>
            
            {/* Depth vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] opacity-80" />
            
            <style dangerouslySetInnerHTML={{ __html: `
                .bg-grid-pattern {
                    background-image: 
                        linear-gradient(to right, rgba(34, 211, 238, 0.15) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(34, 211, 238, 0.15) 1px, transparent 1px);
                    background-size: 80px 80px;
                }
                
                @keyframes grid-flow {
                    from { background-position: 0 0; }
                    to { background-position: 0 80px; }
                }
                
                .animate-grid-flow {
                    animation: grid-flow 3s linear infinite;
                }
            `}} />
        </div>
    );
}