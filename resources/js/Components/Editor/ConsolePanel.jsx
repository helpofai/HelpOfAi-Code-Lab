import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

export default function ConsolePanel({ logs, setLogs }) {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="h-full bg-[#131417] flex flex-col border-t border-white/5 font-mono">
            <div className="px-4 py-2 bg-[#010101] border-b border-white/5 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-2">
                    <Terminal size={12} className="text-cyan-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Console</span>
                </div>
                <button onClick={() => setLogs([])} className="text-[8px] font-bold text-slate-600 hover:text-white uppercase">Clear</button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 text-[11px] space-y-2 selection:bg-cyan-500/20 font-mono">
                {logs.length === 0 && (
                    <div className="text-gray-600 italic text-xs">Console is empty...</div>
                )}
                {logs.map((log, i) => (
                    <div key={i} className={`flex space-x-2 ${log.type === 'ERR' ? 'text-rose-400' : 'text-cyan-400'} border-b border-white/5 pb-1 last:border-0`}>
                        <span className="opacity-20 flex-shrink-0 select-none">
                            [{new Date(log.id).toLocaleTimeString([], {hour12: false, minute:'2-digit', second: '2-digit'})}]
                        </span>
                        <pre className="break-all whitespace-pre-wrap font-inherit">{log.content}</pre>
                    </div>
                ))}
            </div>
        </div>
    );
}