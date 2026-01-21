import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { 
    Crown, Settings, Save, 
    CreditCard, Users, ShieldCheck, 
    Lock, Globe, Zap, HardDrive,
    Mail, Terminal, Activity, Eye,
    AlertTriangle, Database
} from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function SubscriptionSettings({ auth, settings }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        settings: settings
    });

    const [activeSector, setActiveSector] = useState('monetization');

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.subscriptions.update'));
    };

    const updateSetting = (key, value) => {
        setData('settings', {
            ...data.settings,
            [key]: value
        });
    };

    const sectors = [
        { id: 'monetization', name: 'Monetization', icon: CreditCard, color: 'text-amber-500' },
        { id: 'quotas', name: 'Resource_Quotas', icon: HardDrive, color: 'text-cyan-500' },
        { id: 'security', name: 'Security_&_Auth', icon: ShieldCheck, color: 'text-rose-500' },
        { id: 'system', name: 'System_Config', icon: Terminal, color: 'text-purple-500' },
    ];

    const Toggle = ({ value, onToggle, label, description }) => (
        <div className="flex items-center justify-between p-5 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)] hover:border-white/10 transition-all">
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)]">{label}</p>
                <p className="text-[8px] text-[var(--text-muted)] uppercase italic">{description}</p>
            </div>
            <button 
                type="button"
                onClick={onToggle}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${value === '1' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-700'}`}
            >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${value === '1' ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 font-sans">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-500">
                            <Crown size={20} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">Global_Command</h2>
                            <p className="text-[8px] text-amber-500 uppercase tracking-[0.4em] font-bold mt-1">SaaS Deployment Protocols</p>
                        </div>
                    </div>
                }
            >
                <Head title="Advanced Settings" />
                <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                    <AnimatedGrid />
                    <div className="max-w-6xl mx-auto relative z-10">
                        
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            
                            {/* Sector Navigation */}
                            <div className="lg:col-span-1 space-y-2">
                                {sectors.map((sector) => (
                                    <button
                                        key={sector.id}
                                        onClick={() => setActiveSector(sector.id)}
                                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl border transition-all ${
                                            activeSector === sector.id 
                                            ? 'bg-white/5 border-white/10 text-[var(--text-main)] shadow-lg' 
                                            : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                                        }`}
                                    >
                                        <sector.icon size={18} className={activeSector === sector.id ? sector.color : ''} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{sector.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Options Panel */}
                            <div className="lg:col-span-3">
                                <form onSubmit={submit} className="space-y-8">
                                    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                                        
                                        {activeSector === 'monetization' && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-6 mb-8">
                                                    <CreditCard className="text-amber-500" size={20} />
                                                    <h3 className="text-sm font-black uppercase tracking-widest">Pricing_&_Revenue</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <InputLabel value="Monthly_Uplink_Price ($)" />
                                                        <TextInput type="number" step="0.01" value={data.settings.pro_monthly_price} onChange={e => updateSetting('pro_monthly_price', e.target.value)} className="bg-[var(--bg-elevated)] font-mono" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <InputLabel value="Yearly_Uplink_Price ($)" />
                                                        <TextInput type="number" step="0.01" value={data.settings.pro_yearly_price} onChange={e => updateSetting('pro_yearly_price', e.target.value)} className="bg-[var(--bg-elevated)] font-mono" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <InputLabel value="Trial_Period_Duration (Days)" />
                                                        <TextInput type="number" value={data.settings.pro_trial_days} onChange={e => updateSetting('pro_trial_days', e.target.value)} className="bg-[var(--bg-elevated)] font-mono" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeSector === 'quotas' && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-6 mb-8">
                                                    <HardDrive className="text-cyan-500" size={20} />
                                                    <h3 className="text-sm font-black uppercase tracking-widest">Resource_Constraints</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <InputLabel value="Free_Project_Quota" />
                                                        <TextInput type="number" value={data.settings.free_project_limit} onChange={e => updateSetting('free_project_limit', e.target.value)} className="bg-[var(--bg-elevated)] font-mono" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <InputLabel value="Max_Upload_Payload (MB)" />
                                                        <TextInput type="number" value={data.settings.max_upload_size_mb} onChange={e => updateSetting('max_upload_size_mb', e.target.value)} className="bg-[var(--bg-elevated)] font-mono" />
                                                    </div>
                                                </div>
                                                <Toggle 
                                                    value={data.settings.enforce_pro_privacy} 
                                                    onToggle={() => updateSetting('enforce_pro_privacy', data.settings.enforce_pro_privacy === '1' ? '0' : '1')}
                                                    label="Gated_Privacy_Shield"
                                                    description="Only allow Pro users to create restricted nodes."
                                                />
                                            </div>
                                        )}

                                        {activeSector === 'security' && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-6 mb-8">
                                                    <ShieldCheck className="text-rose-500" size={20} />
                                                    <h3 className="text-sm font-black uppercase tracking-widest">Access_Security</h3>
                                                </div>
                                                <div className="space-y-4">
                                                    <Toggle 
                                                        value={data.settings.enable_public_signups} 
                                                        onToggle={() => updateSetting('enable_public_signups', data.settings.enable_public_signups === '1' ? '0' : '1')}
                                                        label="Public_Node_Registration"
                                                        description="Allow new entities to register without invitation."
                                                    />
                                                    <Toggle 
                                                        value={data.settings.require_email_verification} 
                                                        onToggle={() => updateSetting('require_email_verification', data.settings.require_email_verification === '1' ? '0' : '1')}
                                                        label="Identity_Verification"
                                                        description="Enforce email verification for all new uplinks."
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {activeSector === 'system' && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-6 mb-8">
                                                    <Terminal className="text-purple-500" size={20} />
                                                    <h3 className="text-sm font-black uppercase tracking-widest">Core_Diagnostics</h3>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <InputLabel value="Maintenance_Bypass_Cipher" />
                                                        <div className="flex gap-2">
                                                            <TextInput value={data.settings.maintenance_bypass_key} readOnly className="bg-[var(--bg-elevated)] font-mono text-emerald-500 cursor-not-allowed" />
                                                            <button type="button" onClick={() => updateSetting('maintenance_bypass_key', 'HOA-' + Math.random().toString(36).substr(2, 8).toUpperCase())} className="px-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl hover:bg-white/5 transition-colors"><Zap size={14}/></button>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <InputLabel value="API_Burst_Limit (Requests/Min)" />
                                                        <TextInput type="number" value={data.settings.global_rate_limit} onChange={e => updateSetting('global_rate_limit', e.target.value)} className="bg-[var(--bg-elevated)] font-mono" />
                                                    </div>
                                                    <Toggle 
                                                        value={data.settings.allow_guest_preview} 
                                                        onToggle={() => updateSetting('allow_guest_preview', data.settings.allow_guest_preview === '1' ? '0' : '1')}
                                                        label="Guest_Live_Stream"
                                                        description="Allow unauthenticated users to preview public cores."
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-12 pt-8 border-t border-[var(--border)] flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-rose-500/50">
                                                <AlertTriangle size={14} />
                                                <span className="text-[8px] font-black uppercase tracking-widest">Irreversible_System_Change</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {recentlySuccessful && (
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Sync_Verified</span>
                                                )}
                                                <PrimaryButton disabled={processing} className="px-12 py-4">
                                                    <Save size={16} className="mr-2" /> Commit_Protocols
                                                </PrimaryButton>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}