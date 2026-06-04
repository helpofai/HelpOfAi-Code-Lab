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
