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
                    'w-full bg-black/40 border border-white/10 text-white font-mono text-sm rounded-2xl px-6 py-4 outline-none focus:border-cyan-500/50 focus:ring-0 focus:bg-black/60 transition-all duration-500 placeholder-slate-700 ' +
                    className
                }
                ref={localRef}
            />
            {/* Liquid light focus animation */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-cyan-400 group-focus-within:w-[80%] transition-all duration-700 blur-[1px] shadow-[0_0_10px_#22d3ee]" />
        </div>
    );
});
