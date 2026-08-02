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

import { useEffect, useCallback } from 'react';

/**
 * Register global keyboard shortcuts.
 * Usage: useHotkeys({ 'ctrl+s': handleSave, 'ctrl+shift+f': formatCode })
 * Keys use lowercase, modifiers: ctrl, shift, alt, meta
 */
export default function useHotkeys(hotkeys, deps = []) {
    const handler = useCallback((e) => {
        const key = e.key.toLowerCase();
        const mods = [];
        if (e.ctrlKey || e.metaKey) mods.push('ctrl');
        if (e.shiftKey) mods.push('shift');
        if (e.altKey) mods.push('alt');

        const combo = mods.length ? `${mods.join('+')}+${key}` : key;

        if (hotkeys[combo]) {
            e.preventDefault();
            e.stopPropagation();
            hotkeys[combo](e);
            return;
        }

        // Also try meta variant (Mac: Cmd = metaKey)
        if (e.metaKey && !e.ctrlKey) {
            const metaCombo = `ctrl+${mods.filter(m => m !== 'ctrl').join('+')}+${key}`.replace(/^ctrl\+$/, '');
            if (hotkeys[metaCombo]) {
                e.preventDefault();
                e.stopPropagation();
                hotkeys[metaCombo](e);
            }
        }
    }, [hotkeys, ...deps]);

    useEffect(() => {
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handler]);
}
