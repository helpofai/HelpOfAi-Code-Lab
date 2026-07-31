import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Store, Github, DollarSign, Activity, CheckCircle2, Shield, Code2, Plus, Trash2, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/Components/Toast/ToastProvider';

export default function VendorDashboard() {
    const { auth } = usePage().props;
    const user = auth.user;
    const toast = useToast();

    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        stripe_account_id: user.stripe_account_id || '',
        razorpay_account_id: user.razorpay_account_id || '',
    });

    const [connections, setConnections] = useState([]);
    const [newConnection, setNewConnection] = useState({ provider: 'github', name: '', token: '' });
    const [isAddingConnection, setIsAddingConnection] = useState(false);

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            const { data } = await axios.get('/api/vendors/connections');
            setConnections(data);
        } catch (e) {
            console.error("Failed to load connections");
        }
    };

    const handleSavePayouts = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await axios.post('/api/vendors/payout-accounts', formData);
            toast.success("Vendor settings saved successfully.");
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to save settings.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddConnection = async (e) => {
        e.preventDefault();
        setIsAddingConnection(true);
        try {
            await axios.post('/api/vendors/connections', newConnection);
            toast.success("Connection added and verified!");
            setNewConnection({ provider: 'github', name: '', token: '' });
            fetchConnections();
        } catch (e) {
            toast.error(e.response?.data?.message || "Verification failed. Check token.");
        } finally {
            setIsAddingConnection(false);
        }
    };

    const handleVerifyConnection = async (id) => {
        try {
            const { data } = await axios.post(`/api/vendors/connections/${id}/verify`);
            if (data.is_valid) toast.success("Connection verified successfully!");
            else toast.error("Connection failed.");
            fetchConnections();
        } catch (e) {
            toast.error("Connection verification failed.");
            fetchConnections();
        }
    };

    const handleDeleteConnection = async (id) => {
        if (!confirm("Remove this integration?")) return;
        try {
            await axios.delete(`/api/vendors/connections/${id}`);
            toast.success("Connection removed.");
            fetchConnections();
        } catch (e) {
            toast.error("Failed to remove connection.");
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded">
                        <Store className="text-purple-500" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-[var(--text-main)] uppercase italic leading-none">Vendor Command</h2>
                        <p className="text-[8px] text-purple-500 font-bold uppercase tracking-[0.4em] mt-1">Marketplace Settings & Analytics</p>
                    </div>
                </div>
            }
        >
            <Head title="Vendor Dashboard" />
            
            <div className="p-6 md:p-12 overflow-y-auto min-h-screen">
                <div className="max-w-5xl mx-auto space-y-8">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Integrations Module */}
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                
                                <div>
                                    <h3 className="text-xl font-black text-[var(--text-main)] uppercase italic tracking-tighter flex items-center gap-2">
                                        <Code2 size={24} className="text-cyan-500" /> Source Code Integrations
                                    </h3>
                                    <p className="text-sm font-bold text-[var(--text-muted)] mt-2">
                                        Connect your GitHub, GitLab, or Bitbucket accounts to sync private repositories.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {connections.map(conn => (
                                        <div key={conn.id} className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${conn.provider === 'github' ? 'bg-gray-800 text-white' : conn.provider === 'gitlab' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                                    <Github size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-[var(--text-main)]">{conn.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">{conn.provider}</span>
                                                        {conn.is_valid ? (
                                                            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Verified</span>
                                                        ) : (
                                                            <span className="text-[10px] text-red-500 font-bold">Failed</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleVerifyConnection(conn.id)} className="p-2 text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-all" title="Verify Connection">
                                                    <RefreshCw size={16} />
                                                </button>
                                                <button onClick={() => handleDeleteConnection(conn.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Remove Connection">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <form onSubmit={handleAddConnection} className="mt-6 p-4 border border-[var(--border)] border-dashed rounded-xl bg-[var(--bg-main)]/50 space-y-4">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Add New Connection</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <select 
                                                value={newConnection.provider}
                                                onChange={e => setNewConnection({...newConnection, provider: e.target.value})}
                                                className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-main)]"
                                            >
                                                <option value="github">GitHub</option>
                                                <option value="gitlab">GitLab</option>
                                                <option value="bitbucket">Bitbucket</option>
                                            </select>
                                            <input 
                                                type="text" 
                                                placeholder="Connection Name (e.g. Work GitHub)" 
                                                value={newConnection.name}
                                                onChange={e => setNewConnection({...newConnection, name: e.target.value})}
                                                className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-main)]"
                                                required
                                            />
                                            <input 
                                                type="password" 
                                                placeholder="Personal Access Token" 
                                                value={newConnection.token}
                                                onChange={e => setNewConnection({...newConnection, token: e.target.value})}
                                                className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-main)] font-mono"
                                                required
                                            />
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={isAddingConnection}
                                            className="w-full py-3 bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-cyan-500 hover:text-cyan-500 text-[var(--text-main)] font-black uppercase text-xs tracking-widest rounded-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            {isAddingConnection ? <Activity className="animate-spin" size={16} /> : <Plus size={16} />}
                                            Add & Verify Connection
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className={`bg-purple-500/5 border border-purple-500/20 rounded-2xl p-6 text-center space-y-4 shadow-xl mt-8`}>
                                <Store className="text-purple-500 mx-auto" size={32} />
                                <h4 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic">Vendor Status</h4>
                                
                                {connections.some(c => c.is_valid) ? (
                                    <>
                                        <div className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            Active & Verified
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed mt-4">
                                            Your vendor account is currently active and your integrations are healthy.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="inline-block px-4 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            Action Required
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed mt-4">
                                            Your account is inactive. Please add and verify at least one Source Code Integration to activate your vendor status and allow buyers to download your products.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 text-center space-y-4 shadow-xl">
                                <Shield className="text-cyan-500 mx-auto" size={32} />
                                <h4 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] italic">Security Checks</h4>
                                <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed mt-4">
                                    Integration tokens are heavily encrypted at rest. We run routine health checks to ensure your delivery pipelines remain operational.
                                </p>
                            </div>
                        </div>

                        {/* Setup Documentation Block at the Bottom */}
                        <div className="lg:col-span-3 mt-4">
                            <div className="p-8 bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl space-y-6 shadow-xl">
                                <h4 className="text-sm font-black text-[var(--text-main)] uppercase tracking-[0.2em] flex items-center gap-2 border-b border-[var(--border)] pb-4">
                                    <Github size={20} className="text-purple-500" /> Access Token Setup Guide
                                </h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h5 className="text-[11px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                                            GitHub Token Generation
                                        </h5>
                                        <ol className="text-xs text-[var(--text-muted)] font-medium space-y-3 list-decimal list-inside marker:text-purple-500/50">
                                            <li>Go to your GitHub <strong>Account Settings</strong> &gt; <strong>Developer Settings</strong>.</li>
                                            <li>Select <strong>Personal Access Tokens</strong> &gt; <strong>Tokens (classic)</strong>.</li>
                                            <li>Click <strong>Generate new token</strong>.</li>
                                            <li>Give it a descriptive name (e.g., "Marketplace Sales").</li>
                                            <li>Under scopes, check the <strong>`repo`</strong> box (Full control of private repositories).</li>
                                            <li>Generate the token, copy it, and add it above.</li>
                                        </ol>
                                    </div>
                                    <div className="space-y-4 border-t md:border-t-0 md:border-l border-[var(--border)] pt-6 md:pt-0 md:pl-8">
                                        <h5 className="text-[11px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                            Why do we need this?
                                        </h5>
                                        <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                                            To sell software on our platform, your source code must remain secure in your own private repositories. 
                                            When a customer purchases your product, our asset server uses this token to download a zipball of your code and deliver it directly to the buyer's dashboard along with an RSA-signed license key.
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed mt-2">
                                            This guarantees your code is never exposed publicly, while providing a seamless, automated delivery experience for your customers.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
