<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HOACodeLab | Production Setup</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #050505; color: #e2e8f0; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .terminal { background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.1); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-6">
    <div class="max-w-4xl w-full space-y-8">
        <!-- Header -->
        <div class="text-center space-y-4">
            <h1 class="text-4xl font-black tracking-tighter text-white italic uppercase">
                Production_<span class="text-purple-500">Installer</span>
            </h1>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">HOACodeLab Deployment Protocol</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Sidebar: Requirements -->
            <div class="space-y-6">
                <div class="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                    <div>
                        <h2 class="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-4">System Requirements</h2>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center text-xs">
                                <span class="text-slate-400">PHP Version</span>
                                <span class="{{ version_compare($phpVersion, '8.2', '>=') ? 'text-green-400' : 'text-rose-400' }} font-bold">{{ $phpVersion }}</span>
                            </div>
                            @foreach($extensions as $name => $loaded)
                            <div class="flex justify-between items-center text-xs">
                                <span class="text-slate-400">{{ $name }}</span>
                                <span class="{{ $loaded ? 'text-green-500' : 'text-rose-500' }} font-black">{{ $loaded ? 'OK' : 'MISSING' }}</span>
                            </div>
                            @endforeach
                        </div>
                    </div>
                    <div class="pt-4 border-t border-white/5">
                        <h2 class="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-4">Environment</h2>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center text-xs">
                                <span class="text-slate-400">.env File</span>
                                <span class="{{ $envExists ? 'text-green-500' : 'text-amber-500' }} font-black">{{ $envExists ? 'EXISTS' : 'NOT FOUND' }}</span>
                            </div>
                            <div class="flex justify-between items-center text-xs">
                                <span class="text-slate-400">App Key</span>
                                <span class="{{ $appKeySet ? 'text-green-500' : 'text-amber-500' }} font-black">{{ $appKeySet ? 'CONFIGURED' : 'PENDING' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main: Terminal & Controls -->
            <div class="md:col-span-2 space-y-6">
                <!-- Terminal -->
                <div class="terminal rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[400px]">
                    <div class="px-6 py-3 bg-white/5 border-b border-white/10 flex justify-between items-center">
                        <div class="flex space-x-2">
                            <div class="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
                            <div class="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                            <div class="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                        </div>
                        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">setup_terminal.exe</span>
                    </div>
                    <div id="terminal-output" class="p-6 mono text-[11px] overflow-y-auto custom-scrollbar flex-grow space-y-1">
                        <div class="text-purple-400">>> HOACodeLab v{{ config('app.version') }} installer initialized.</div>
                        <div class="text-slate-500">>> Kernel ready for deployment protocols.</div>
                        <div class="text-slate-600 italic">>> Waiting for command input...</div>
                    </div>
                </div>

                <!-- Controls -->
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <button onclick="runCommand('key:generate')" id="btn-key" class="group p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-purple-500/50 transition-all text-left space-y-2">
                        <div class="text-[9px] font-black text-purple-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">01_Security</div>
                        <div class="text-xs font-bold text-white uppercase">Generate Key</div>
                    </button>
                    <button onclick="runCommand('migrate')" id="btn-migrate" class="group p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/50 transition-all text-left space-y-2">
                        <div class="text-[9px] font-black text-cyan-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">02_Database</div>
                        <div class="text-xs font-bold text-white uppercase">Run Migrations</div>
                    </button>
                    <button onclick="runCommand('storage:link')" id="btn-storage" class="group p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-500/50 transition-all text-left space-y-2">
                        <div class="text-[9px] font-black text-amber-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">03_Storage</div>
                        <div class="text-xs font-bold text-white uppercase">Link Assets</div>
                    </button>
                    <button onclick="runCommand('optimize:clear')" id="btn-cache" class="group p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-slate-500/50 transition-all text-left space-y-2">
                        <div class="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:translate-x-1 transition-transform">04_Optimization</div>
                        <div class="text-xs font-bold text-white uppercase">Flush Caches</div>
                    </button>
                    <button onclick="runCommand('db:seed')" id="btn-seed" class="group p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-rose-500/50 transition-all text-left space-y-2">
                        <div class="text-[9px] font-black text-rose-500 uppercase tracking-widest group-hover:translate-x-1 transition-transform">05_Seed</div>
                        <div class="text-xs font-bold text-white uppercase">Seed Defaults</div>
                    </button>
                    <button onclick="runProductionOptimize()" id="btn-optimize" class="group p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl hover:bg-purple-500 transition-all text-left space-y-2">
                        <div class="text-[9px] font-black text-purple-400 group-hover:text-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">06_Optimize</div>
                        <div class="text-xs font-bold text-purple-400 group-hover:text-black uppercase">Prod Optimize</div>
                    </button>
                    <a href="/" class="group p-4 bg-green-500/10 border border-green-500/20 rounded-2xl hover:bg-green-500 transition-all text-left space-y-2">
                        <div class="text-[9px] font-black text-green-400 group-hover:text-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">07_Ready</div>
                        <div class="text-xs font-bold text-green-400 group-hover:text-black uppercase">Launch App</div>
                    </a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <p class="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest animate-pulse-slow">
            Security Warning: Delete this controller and view after successful installation.
        </p>
    </div>

    <script>
        const output = document.getElementById('terminal-output');
        let isRunning = false;

        async function runProductionOptimize() {
            if (isRunning) return;
            const commands = ['config:cache', 'route:cache', 'view:cache'];
            for (const cmd of commands) {
                await runCommand(cmd);
                // Brief pause between commands
                await new Promise(r => setTimeout(r, 500));
            }
            appendLog('--- PRODUCTION OPTIMIZATION COMPLETE ---', 'done');
        }
        
        function appendLog(message, status = 'info', timestamp = '') {
            const line = document.createElement('div');
            line.className = 'flex items-start space-x-3 opacity-0 translate-y-2 transition-all duration-300';
            
            let textColor = 'text-slate-300';
            if (status === 'error') textColor = 'text-rose-400 font-bold';
            if (status === 'success') textColor = 'text-green-400';
            if (status === 'done') textColor = 'text-cyan-400 font-black';
            if (status === 'info') textColor = 'text-purple-400/80';
            if (status === 'command') textColor = 'text-white font-bold bg-white/5 px-2 py-0.5 rounded';

            const timeStr = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            line.innerHTML = `
                <span class="text-slate-600 shrink-0 select-none">[${timeStr}]</span>
                <span class="${textColor} break-all whitespace-pre-wrap">${message}</span>
            `;
            
            output.appendChild(line);
            
            // Trigger animation
            setTimeout(() => {
                line.classList.remove('opacity-0', 'translate-y-2');
            }, 10);

            output.scrollTop = output.scrollHeight;
        }

        async function runCommand(command) {
            if (isRunning) return;
            isRunning = true;
            
            // Disable buttons
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => btn.disabled = true);
            
            appendLog(`php artisan ${command}`, 'command');

            try {
                const response = await fetch('/setup/run', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify({ command })
                });

                if (!response.ok) throw new Error(`Server responded with ${response.status}`);

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let partial = '';

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = (partial + chunk).split('\n\n');
                    partial = lines.pop();

                    for (const l of lines) {
                        if (l.trim().startsWith('data: ')) {
                            try {
                                const data = JSON.parse(l.replace('data: ', '').trim());
                                appendLog(data.message, data.status, data.timestamp);
                            } catch (e) {
                                console.error('Parse error:', e, l);
                            }
                        }
                    }
                }
            } catch (error) {
                appendLog(`SYSTEM_HALT: ${error.message}`, 'error');
            } finally {
                isRunning = false;
                buttons.forEach(btn => btn.disabled = false);
                appendLog('--- SYSTEM IDLE ---', 'info');
            }
        }
    </script>
</body>
</html>
