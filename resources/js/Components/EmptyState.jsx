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
import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';

/**
 * Consistent empty state with icon, message, optional description, and CTA.
 * Usage: <EmptyState icon={FolderOpen} title="No collections" description="Create your first collection" action={{ label: "New Collection", onClick: () => {} }} />
 */
export default function EmptyState({ icon: Icon = PackageOpen, title, description, action, size = 'md' }) {
    const sizes = {
        sm: { container: 'py-8 px-4', icon: 28, titleClass: 'text-xs', descClass: 'text-[10px]' },
        md: { container: 'py-16 px-6', icon: 40, titleClass: 'text-sm', descClass: 'text-[10px]' },
        lg: { container: 'py-24 px-8', icon: 56, titleClass: 'text-base', descClass: 'text-xs' },
    };
    const s = sizes[size];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-surface)] ${s.container}`}
        >
            <div className="p-3 rounded-full bg-[var(--accent-dim)] mb-4">
                <Icon size={s.icon} className="text-[var(--accent)]" strokeWidth={1.5} />
            </div>
            <h3 className={`font-bold uppercase tracking-widest text-[var(--text-main)] mb-1 ${s.titleClass}`}>
                {title}
            </h3>
            {description && (
                <p className={`text-[var(--text-muted)] font-medium mb-4 max-w-xs ${s.descClass}`}>
                    {description}
                </p>
            )}
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase text-[10px] tracking-widest rounded transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
                >
                    {action.label}
                </button>
            )}
        </motion.div>
    );
}
