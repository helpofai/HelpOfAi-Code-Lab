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

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <div className="relative w-full group">
            <input
                {...props}
                type={type}
                className={
                    'w-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-main)] font-mono text-sm rounded-2xl px-6 py-4 outline-none focus:border-cyan-500/50 focus:ring-0 focus:bg-[var(--bg-main)] transition-all duration-500 placeholder-slate-500/50 ' +
                    className
                }
                ref={localRef}
            />
            {/* Liquid light focus animation */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-cyan-400 group-focus-within:w-[80%] transition-all duration-700 blur-[1px] shadow-[0_0_10px_#22d3ee]" />
        </div>
    );
});
