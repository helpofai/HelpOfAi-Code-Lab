with open('resources/js/Pages/CloudSync.jsx', 'r') as f:
    content = f.read()

replaced = 0

# --- STEP 2: Replace the p paragraph with beginner-friendly ordered list ---
old2 = '''<p className="text-[10px] font-bold uppercase tracking-widest leading-loose text-[var(--text-muted)] italic">
                                                    Create an <span className="text-white font-black">OAuth_2.0_Client_ID</span> (Web Application). Inject the following URI into the <span className="text-white">Authorized Redirect URIs</span> field:
                                                </p>'''

new2 = '''<div className="text-[11px] font-medium tracking-wide leading-relaxed text-[var(--text-muted)]">
                                                    <ol className="list-decimal list-inside space-y-2">
                                                        <li>In the left sidebar, click <span className="text-white font-bold">"APIs & Services"</span> then <span className="text-white font-bold">"Credentials"</span>.</li>
                                                        <li>Click <span className="text-white font-bold">"+ CREATE CREDENTIALS"</span> and select <span className="text-white font-bold">"OAuth client ID"</span>.</li>
                                                        <li>For Application type, select <span className="text-white font-bold">"Web application"</span>.</li>
                                                        <li>Paste this Callback URL into the <span className="text-white font-bold">Authorized Redirect URIs</span> field:</li>
                                                    </ol>
                                                </div>'''

if old2 in content:
    content = content.replace(old2, new2)
    print("STEP 2 paragraph REPLACED")
    replaced += 1
else:
    print("STEP 2 paragraph NOT FOUND")

# --- STEP 2b: Add "click CREATE, copy ID & Secret" after the code block ---
old2b = '''                                                    <div className="absolute top-1/2 -right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="bg-emerald-500 text-black text-[8px] font-black px-2 py-1 rounded shadow-xl uppercase">Callback URL</span>
                                                    </div>
                                                </div>'''

new2b = '''                                                    <div className="absolute top-1/2 -right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="bg-emerald-500 text-black text-[8px] font-black px-2 py-1 rounded shadow-xl uppercase">Callback URL</span>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-medium tracking-wide leading-relaxed text-[var(--text-muted)]">
                                                    <ol className="list-decimal list-inside" start="5">
                                                        <li>Click <span className="text-white font-bold">CREATE</span>. Copy the <span className="text-white font-bold">Client ID</span> and <span className="text-white font-bold">Client Secret</span>.</li>
                                                    </ol>
                                                </div>'''

if old2b in content:
    content = content.replace(old2b, new2b, 1)
    print("STEP 2b (after code block) REPLACED")
    replaced += 1
else:
    print("STEP 2b NOT FOUND")

# --- STEP 3: Replace final step content with beginner-friendly instructions ---
old3 = '''                                            <div className="bg-black border border-white/5 rounded-2xl p-8 space-y-6 text-left">
                                                <div className="flex items-start gap-4">
                                                    <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] leading-relaxed text-slate-400 italic">
                                                        Commit your Client ID and Secret in the <span className="text-white">Connection Settings</span> panel. Click <span className="text-cyan-500">'Connect Google Drive'</span> to perform the handshake. 
                                                        The platform will autonomousely create a <span className="text-white">/HOACodeLab_Nodes</span> directory in your Drive root.
                                                    </p>
                                                </div>
                                            </div>'''

new3 = '''                                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 text-[11px] font-medium tracking-wide leading-relaxed text-[var(--text-muted)]">
                                                <ol className="list-decimal list-inside space-y-2">
                                                    <li>Return to this page and paste the <span className="text-white font-bold">Client ID</span> and <span className="text-white font-bold">Client Secret</span> you copied in Step 2 into the <span className="text-white font-bold">Connection Settings</span> panel above.</li>
                                                    <li>Click the <span className="text-cyan-500 font-bold">CONNECT</span> button.</li>
                                                    <li>A Google popup will appear. Sign in with your Google account and click <span className="text-white font-bold">Continue</span> (ignore any "unverified app" warning — this is normal).</li>
                                                    <li>Click <span className="text-white font-bold">Allow</span> to give HOACodeLab access.</li>
                                                    <li>Done! The platform will create a <span className="text-white font-bold">/HOACodeLab_Nodes</span> folder in your Drive automatically.</li>
                                                </ol>
                                            </div>'''

if old3 in content:
    content = content.replace(old3, new3)
    print("STEP 3 REPLACED")
    replaced += 1
else:
    print("STEP 3 NOT FOUND")

with open('resources/js/Pages/CloudSync.jsx', 'w') as f:
    f.write(content)

print(f"Total replacements: {replaced}")
