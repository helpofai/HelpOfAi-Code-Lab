<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HOACodeLab | Advanced Deployment Suite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #050505; color: #e2e8f0; overflow-x: hidden; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .terminal { background: rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .step-active { color: #a855f7; border-color: #a855f7; }
        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.05); }
        input { background: rgba(0,0,0,0.4) !important; border: 1px solid rgba(255,255,255,0.1) !important; color: white !important; }
        input:focus { border-color: #a855f7 !important; outline: none !important; box-shadow: 0 0 10px rgba(168,85,247,0.2) !important; }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-4 md:p-12">
    
    <div class="max-w-5xl w-full space-y-12">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="space-y-1">
                <h1 class="text-3xl font-black tracking-tighter text-white italic uppercase flex items-center gap-3">
                    Deploy_<span class="text-purple-500">Suite</span>
                    <span class="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full not-italic text-slate-500 font-mono tracking-widest">v1.7.0</span>
                </h1>
                <p class="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">HOACodeLab Enterprise Installation Matrix</p>
            </div>
            
            <!-- Progress Tracker -->
            <div class="flex items-center space-x-4">
                @for($i = 1; $i <= 6; $i++)
                <div id="step-dot-{{ $i }}" class="w-8 h-1 rounded-full bg-white/5 transition-all duration-500"></div>
                @endfor
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <!-- Left: Sidebar Info -->
            <div class="lg:col-span-4 space-y-8">
                <div class="glass rounded-3xl p-8 space-y-8">
                    <div id="step-info">
                        <h2 id="step-title" class="text-lg font-black text-white uppercase tracking-tighter mb-2 italic">Phase_01</h2>
                        <p id="step-desc" class="text-xs text-slate-400 leading-relaxed font-medium">Initializing core system diagnostics and verification protocols.</p>
                    </div>

                    <div id="requirements-list" class="space-y-3">
                        @foreach($requirements as $name => $passed)
                        <div class="flex justify-between items-center text-[11px]">
                            <span class="text-slate-500 font-bold uppercase tracking-wider">{{ $name }}</span>
                            <span class="{{ $passed ? 'text-green-500' : 'text-rose-500' }} font-black uppercase">{{ $passed ? 'Optimal' : 'Fault' }}</span>
                        </div>
                        @endforeach
                    </div>

                    <div class="pt-6 border-t border-white/5 space-y-4">
                        <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-600">
                            <span>Connection Status</span>
                            <span id="db-status-badge" class="{{ $dbConnected ? 'text-green-500' : 'text-amber-500' }}">{{ $dbConnected ? 'Uplink_Established' : 'Offline' }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right: Content Area -->
            <div class="lg:col-span-8">
                <div id="wizard-container" class="glass rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden min-h-[500px] flex flex-col justify-center">
                    
                    <!-- STEP 1: WELCOME / REQUIREMENTS -->
                    <div id="step-1" class="step-content space-y-10">
                        <div class="space-y-4">
                            <h3 class="text-4xl font-black text-white tracking-tighter leading-tight italic">Systems_Check <br/> <span class="text-purple-500">Protocol.</span></h3>
                            <p class="text-slate-400 text-sm max-w-md">Before we initiate the deployment, we must ensure the hosting environment meets the HOACodeLab high-performance standards.</p>
                        </div>
                        <button onclick="nextStep(2)" class="px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-purple-500/20">Initialize Setup</button>
                    </div>

                    <!-- STEP 2: ENVIRONMENT CONFIG -->
                    <div id="step-2" class="step-content hidden space-y-8">
                        <h3 class="text-2xl font-black text-white tracking-tighter italic uppercase">Kernel_Config</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">App Name</label>
                                <input type="text" id="app_name" value="{{ $currentEnv['app_name'] }}" class="w-full px-5 py-3 rounded-xl font-medium text-sm">
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">App URL</label>
                                <input type="text" id="app_url" value="{{ $currentEnv['app_url'] }}" class="w-full px-5 py-3 rounded-xl font-medium text-sm">
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">DB Host</label>
                                <input type="text" id="db_host" value="{{ $currentEnv['db_host'] }}" class="w-full px-5 py-3 rounded-xl font-medium text-sm">
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">DB Name</label>
                                <input type="text" id="db_name" value="{{ $currentEnv['db_name'] }}" class="w-full px-5 py-3 rounded-xl font-medium text-sm">
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">DB User</label>
                                <input type="text" id="db_user" value="{{ $currentEnv['db_user'] }}" class="w-full px-5 py-3 rounded-xl font-medium text-sm">
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">DB Password</label>
                                <input type="password" id="db_pass" placeholder="••••••••" class="w-full px-5 py-3 rounded-xl font-medium text-sm">
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <button onclick="saveEnv()" id="btn-save-env" class="px-8 py-3 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/10 transition-all">Save Config</button>
                            <button onclick="testDb()" id="btn-test-db" class="px-8 py-3 bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-cyan-600 hover:text-white transition-all">Verify Uplink</button>
                            <button onclick="nextStep(3)" id="next-to-3" class="hidden px-8 py-3 bg-purple-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-purple-500 transition-all">Next Phase</button>
                        </div>
                    </div>

                    <!-- STEP 3: ARTISAN PROTOCOLS -->
                    <div id="step-3" class="step-content hidden space-y-8">
                        <h3 class="text-2xl font-black text-white tracking-tighter italic uppercase">Execution_Matrix</h3>
                        
                        <!-- Terminal -->
                        <div class="terminal rounded-3xl overflow-hidden flex flex-col h-[300px] border border-white/5 shadow-2xl">
                            <div class="px-6 py-2 bg-white/5 border-b border-white/5 flex justify-between items-center">
                                <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live_Terminal.exe</span>
                                <div id="term-status" class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            </div>
                            <div id="terminal-output" class="p-6 mono text-[11px] overflow-y-auto custom-scrollbar flex-grow space-y-1">
                                <div class="text-purple-400">>> Ready for deployment protocols.</div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <button onclick="runCommand('key:generate')" class="p-3 bg-white/5 border border-white/5 rounded-xl hover:border-purple-500/50 transition-all text-[10px] font-bold uppercase tracking-wider text-white">Gen Key</button>
                            <button onclick="runCommand('migrate')" class="p-3 bg-white/5 border border-white/5 rounded-xl hover:border-cyan-500/50 transition-all text-[10px] font-bold uppercase tracking-wider text-white">Migrate</button>
                            <button onclick="runCommand('db:seed')" class="p-3 bg-white/5 border border-white/5 rounded-xl hover:border-rose-500/50 transition-all text-[10px] font-bold uppercase tracking-wider text-white">Seed DB</button>
                            <button onclick="nextStep(4)" class="p-3 bg-purple-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest">Next Phase</button>
                        </div>
                    </div>

                    <!-- STEP 4: ADMIN CREATION -->
                    <div id="step-4" class="step-content hidden space-y-8">
                        <h3 class="text-2xl font-black text-white tracking-tighter italic uppercase">Admin_Provisioning</h3>
                        <div class="space-y-6 max-w-md">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Name</label>
                                <input type="text" id="admin_name" placeholder="John Doe" class="w-full px-5 py-3 rounded-xl font-medium text-sm">
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Address</label>
                                <input type="email" id="admin_email" placeholder="admin@example.com" class="w-full px-5 py-3 rounded-xl font-medium text-sm">
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Password</label>
                                <input type="password" id="admin_pass" placeholder="••••••••" class="w-full px-5 py-3 rounded-xl font-medium text-sm">
                            </div>
                        </div>
                        <button onclick="createAdmin()" id="btn-create-admin" class="px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all">Create Identity</button>
                    </div>

                    <!-- STEP 5: SITE SETTINGS -->
                    <div id="step-5" class="step-content hidden space-y-8">
                        <h3 class="text-2xl font-black text-white tracking-tighter italic uppercase">Website_Meta</h3>
                        <div class="space-y-6 max-w-md">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Website Name</label>
                                <input type="text" id="site_name" value="HOACodeLab" class="w-full px-5 py-3 rounded-xl font-medium text-sm">
                            </div>
                            <p class="text-[10px] text-slate-500 font-medium italic">You can configure more detailed branding from the Admin Dashboard after launch.</p>
                        </div>
                        <button onclick="finishSetup()" id="btn-finish" class="px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all">Finalize & Deploy</button>
                    </div>

                    <!-- STEP 6: FINISH -->
                    <div id="step-6" class="step-content hidden text-center space-y-10">
                        <div class="inline-flex p-6 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 mb-4 animate-bounce">
                            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <div class="space-y-4">
                            <h3 class="text-4xl font-black text-white tracking-tighter italic uppercase">Mission_Accomplished.</h3>
                            <p class="text-slate-400 text-sm max-w-sm mx-auto">HOACodeLab has been successfully integrated and deployed to your server.</p>
                        </div>
                        <a href="/" class="inline-block px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl hover:scale-105 transition-all">Launch Laboratory</a>
                    </div>

                </div>
            </div>
        </div>

        <!-- Footer Warnings -->
        <p class="text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em] animate-pulse">
            Security Alert: Remove 'SetupController.php' after handshake completion.
        </p>
    </div>

    <script>
        let currentStep = 1;
        const output = document.getElementById('terminal-output');

        function nextStep(step) {
            document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));
            document.getElementById(`step-${step}`).classList.remove('hidden');
            
            // Update Dots
            for(let i = 1; i <= 6; i++) {
                const dot = document.getElementById(`step-dot-${i}`);
                if (i <= step) dot.style.backgroundColor = '#a855f7';
                else dot.style.backgroundColor = 'rgba(255,255,255,0.05)';
            }

            // Update Info
            const titles = {
                1: 'Phase_01', 2: 'Phase_02', 3: 'Phase_03', 4: 'Phase_04', 5: 'Phase_05', 6: 'Phase_06'
            };
            const descs = {
                1: 'Initializing core system diagnostics and verification protocols.',
                2: 'Configuring the application kernel and database handshakes.',
                3: 'Executing artisan protocols and schema synchronization.',
                4: 'Provisioning the master administrative identity.',
                5: 'Setting global website metadata and branding constants.',
                6: 'Uplink finalized. HOACodeLab is now operational.'
            };
            
            document.getElementById('step-title').innerText = titles[step];
            document.getElementById('step-desc').innerText = descs[step];
            currentStep = step;
        }

        async function saveEnv() {
            const btn = document.getElementById('btn-save-env');
            btn.innerText = 'Saving...';
            
            const data = {
                app_name: document.getElementById('app_name').value,
                app_url: document.getElementById('app_url').value,
                db_host: document.getElementById('db_host').value,
                db_name: document.getElementById('db_name').value,
                db_user: document.getElementById('db_user').value,
                db_pass: document.getElementById('db_pass').value,
            };

            try {
                const response = await fetch('/setup/save-env', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
                    body: JSON.stringify(data)
                });
                const res = await response.json();
                if (res.success) {
                    btn.innerText = 'Saved OK';
                    btn.classList.add('bg-green-500/20', 'text-green-400');
                } else throw new Error(res.error);
            } catch (e) {
                alert('Save Failed: ' + e.message);
                btn.innerText = 'Retry Save';
            }
        }

        async function testDb() {
            const btn = document.getElementById('btn-test-db');
            btn.innerText = 'Probing...';
            
            const data = {
                db_host: document.getElementById('db_host').value,
                db_name: document.getElementById('db_name').value,
                db_user: document.getElementById('db_user').value,
                db_pass: document.getElementById('db_pass').value,
            };

            try {
                const response = await fetch('/setup/check-db', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
                    body: JSON.stringify(data)
                });
                const res = await response.json();
                if (res.success) {
                    btn.innerText = 'Connection Valid';
                    btn.classList.add('bg-green-500', 'text-white');
                    document.getElementById('next-to-3').classList.remove('hidden');
                    document.getElementById('db-status-badge').innerText = 'Uplink_Established';
                    document.getElementById('db-status-badge').className = 'text-green-500';
                } else throw new Error(res.error);
            } catch (e) {
                alert('Connection Failed: ' + e.message);
                btn.innerText = 'Verify Uplink';
            }
        }

        async function createAdmin() {
            const btn = document.getElementById('btn-create-admin');
            btn.innerText = 'Provisioning...';
            
            const data = {
                name: document.getElementById('admin_name').value,
                email: document.getElementById('admin_email').value,
                password: document.getElementById('admin_pass').value,
            };

            try {
                const response = await fetch('/setup/create-admin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
                    body: JSON.stringify(data)
                });
                const res = await response.json();
                if (res.success) nextStep(5);
                else throw new Error(res.error);
            } catch (e) {
                alert('Creation Failed: ' + e.message);
                btn.innerText = 'Create Identity';
            }
        }

        async function finishSetup() {
            const btn = document.getElementById('btn-finish');
            btn.innerText = 'Finalizing...';
            
            try {
                const response = await fetch('/setup/finish', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
                    body: JSON.stringify({ site_name: document.getElementById('site_name').value })
                });
                const res = await response.json();
                if (res.success) nextStep(6);
                else throw new Error(res.error);
            } catch (e) {
                alert('Finish Failed: ' + e.message);
                btn.innerText = 'Finalize & Deploy';
            }
        }

        function appendLog(message, status = 'info') {
            const line = document.createElement('div');
            let color = 'text-slate-300';
            if (status === 'error') color = 'text-rose-400 font-bold';
            if (status === 'success') color = 'text-green-400';
            if (status === 'done') color = 'text-cyan-400 font-black';
            
            line.className = `${color} break-all`;
            line.innerText = `>> [${new Date().toLocaleTimeString()}] ${message}`;
            output.appendChild(line);
            output.scrollTop = output.scrollHeight;
        }

        async function runCommand(command) {
            appendLog(`Executing: php artisan ${command}`, 'info');
            try {
                const response = await fetch('/setup/run', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
                    body: JSON.stringify({ command })
                });
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let partial = '';
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    const lines = (partial + decoder.decode(value)).split('\n\n');
                    partial = lines.pop();
                    lines.forEach(l => {
                        if (l.trim().startsWith('data: ')) {
                            const data = JSON.parse(l.replace('data: ', '').trim());
                            appendLog(data.message, data.status);
                        }
                    });
                }
            } catch (e) {
                appendLog(`Command Failed: ${e.message}`, 'error');
            }
        }
    </script>
</body>
</html>
