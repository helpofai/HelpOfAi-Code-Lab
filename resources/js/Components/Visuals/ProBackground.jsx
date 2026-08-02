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

export default function ProBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[var(--bg-main)] transition-colors duration-300">
            {/* Ultra-lite Grid Pattern */}
            <div 
                className="absolute inset-0 opacity-[0.15]" 
                style={{ 
                    backgroundImage: `linear-gradient(to right, var(--accent) 1px, transparent 1px), linear-gradient(to bottom, var(--accent) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} 
            />
            
            {/* Subtle Gradient Radial */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bg-main) 80%)]" />
            
            {/* Subtle Vignette */}
            <div className="absolute inset-0 dark:shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] shadow-[inset_0_0_150px_rgba(255,255,255,0.2)]" />
        </div>
    );
}