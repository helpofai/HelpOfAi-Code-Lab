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
        <div className="h-full bg-[#050505] flex flex-col border-t border-white/5 font-mono">
            <div className="px-4 py-2 bg-[#0a0a0a] border-b border-white/5 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-cyan-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">System_Console</span>
                </div>
                <button onClick={() => setLogs([])} className="text-[8px] font-bold text-slate-600 hover:text-white uppercase tracking-widest">Flush_Log</button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 text-[10px] space-y-1.5 custom-scrollbar font-mono">
                {logs.length === 0 && (
                    <div className="text-slate-700 italic opacity-40">Awaiting stream...</div>
                )}
                {logs.map((log, i) => (
                    <div key={i} className={`flex gap-3 ${log.type === 'ERR' ? 'text-rose-400' : 'text-cyan-400'} opacity-80`}>
                        <span className="opacity-30 shrink-0 select-none text-[8px]">
                            [{new Date(log.id).toLocaleTimeString([], {hour12: false, minute:'2-digit', second: '2-digit'})}]
                        </span>
                        <pre className="break-all whitespace-pre-wrap font-inherit leading-relaxed">{log.content}</pre>
                    </div>
                ))}
            </div>
        </div>
    );
}