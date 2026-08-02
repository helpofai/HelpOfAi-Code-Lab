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

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `relative inline-flex items-center justify-center px-10 py-4 bg-cyan-500 text-black dark:text-black border border-transparent rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-500 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] active:scale-95 disabled:opacity-50 overflow-hidden group ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            <span className="relative z-10 flex items-center">
                {children}
            </span>
            {/* Action reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
    );
}
