with open('resources/js/Pages/CloudSync.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old = """                                    <div className="flex items-center gap-3 text-purple-500 font-black text-[10px] uppercase tracking-widest italic">
                                        <LinkIcon size={14} /> Connection Settings
                                    </div>
                                    <form onSubmit={submitConfig} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 space-y-6 shadow-xl relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/20 group-hover:bg-purple-500 transition-all" />
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <InputLabel value="Client_ID" />
                                                <TextInput value={data.google_client_id} onChange={e => setData('google_client_id', e.target.value)} className="bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                            </div>
                                            <div className="space-y-2">
                                                <InputLabel value="Client_Secret" />
                                                <TextInput type="password" value={data.google_client_secret} onChange={e => setData('google_client_secret', e.target.value)} className="bg-[var(--bg-elevated)] font-mono text-[10px]" />
                                            </div>
                                        </div>
                                        <PrimaryButton disabled={processing} className="w-full justify-center py-4 text-[10px] tracking-[0.2em]">Save Settings</PrimaryButton>
                                    </form>"""

new = """                                    <div className="flex items-center gap-3 text-purple-500 font-black text-[10px] uppercase tracking-widest italic">
                                        <LinkIcon size={14} /> Connection Link
                                    </div>
                                    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 space-y-6 shadow-xl relative overflow-hidden group text-left">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/20 group-hover:bg-purple-500 transition-all" />
                                        <div className="text-[11px] font-bold uppercase tracking-widest leading-loose text-[var(--text-muted)]">
                                            Everything is ready for your satellite connection. No manual configuration required.
                                        </div>
                                    </div>"""

if old in content:
    content = content.replace(old, new)
    with open('resources/js/Pages/CloudSync.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS')
else:
    # Try with \r\n
    old_rn = old.replace('\n', '\r\n')
    if old_rn in content:
        content = content.replace(old_rn, new.replace('\n', '\r\n'))
        with open('resources/js/Pages/CloudSync.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print('SUCCESS_RN')
    else:
        print('NOT_FOUND')
