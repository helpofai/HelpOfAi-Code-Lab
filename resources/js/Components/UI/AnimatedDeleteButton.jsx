import React, { useRef, useState } from 'react';

export default function AnimatedDeleteButton({
    children = 'Delete',
    onDelete,
    disabled = false,
    className = ''
}) {
    const [state, setState] = useState('idle'); // idle | animating | done

    const handleClick = (e) => {
        if (disabled || state !== 'idle') return;
        e.preventDefault();
        setState('animating');

        // Trigger deletion after short delay
        setTimeout(() => {
            if (onDelete) onDelete();
            setState('done');
        }, 300);

        // Reset
        setTimeout(() => setState('idle'), 800);
    };

    return (
        <button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 
                bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 
                ${state === 'animating' && 'animate-pulse scale-95'} 
                ${state === 'done' && 'bg-green-500/10 text-green-500 border-green-500/30'} 
                ${disabled && 'opacity-50 cursor-not-allowed'} 
                ${className}`}
            onClick={handleClick}
            disabled={disabled || state !== 'idle'}
            title={state === 'animating' ? 'Deleting...' : 'Delete'}
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {state === 'done' ? (
                    <polyline points="20 6 9 17 4 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                )}
            </svg>
            <span>{state === 'done' ? 'Deleted' : children}</span>
        </button>
    );
}