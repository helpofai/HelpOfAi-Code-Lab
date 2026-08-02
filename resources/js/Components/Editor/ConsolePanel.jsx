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

import React, { useEffect, useRef, useState } from 'react';
import { Terminal, ChevronRight } from 'lucide-react';

export default function ConsolePanel({ logs, setLogs }) {
    const scrollRef = useRef(null);
    const [command, setCommand] = useState('');

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const handleExecute = (e) => {
        if (e.key === 'Enter' && command.trim()) {
            const iframe = document.querySelector('iframe[title="preview"]');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type: 'REPL_EXEC', code: command }, '*');
                setCommand('');
            }
        }
    };

    return (
        <div className="h-full bg-[var(--bg-main)] flex flex-col border-t border-[var(--border)] font-mono transition-colors duration-300">
            <div className="px-4 py-2 bg-[var(--bg-surface)] border-b border-[var(--border)] flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 text-left">
                    <Terminal size={12} className="text-cyan-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] italic">System_Console</span>
                </div>
                <button onClick={() => setLogs([])} className="text-[8px] font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] uppercase tracking-widest">Flush_Log</button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 text-[10px] space-y-1.5 custom-scrollbar font-mono text-left">
                {logs.length === 0 && (
                    <div className="text-[var(--text-muted)] italic opacity-40">Awaiting stream...</div>
                )}
                {logs.map((log, i) => (
                    <div key={i} className={`flex gap-3 ${log.type === 'ERR' ? 'text-rose-500' : 'text-cyan-500'} opacity-80`}>
                        <span className="opacity-30 shrink-0 select-none text-[8px]">
                            [{new Date(log.id).toLocaleTimeString([], {hour12: false, minute:'2-digit', second: '2-digit'})}]
                        </span>
                        <pre className="break-all whitespace-pre-wrap font-inherit leading-relaxed">{log.content}</pre>
                    </div>
                ))}
            </div>

            {/* REPL Input */}
            <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--bg-surface)] flex items-center gap-2">
                <ChevronRight size={14} className="text-cyan-500 shrink-0" />
                <input 
                    type="text" 
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={handleExecute}
                    placeholder="Enter command..."
                    className="w-full bg-transparent border-none outline-none text-[10px] text-cyan-500 placeholder:text-cyan-500/20 lowercase tracking-widest"
                />
            </div>
        </div>
    );
}