import React, { useState, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Store, Github, DollarSign, Activity, CheckCircle2, Shield, 
    Code2, Plus, Trash2, RefreshCw, ShoppingCart, Briefcase, 
    ChevronRight, CreditCard, LayoutDashboard, ArrowUpRight 
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/Components/Toast/ToastProvider';

export default function VendorsDashboard({ totalEarnings = 0, totalSales = 0, projectCount = 0, recentSales = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const toast = useToast();

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

    const isHealthy = connections.some(c => c.is_valid);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20">
                        <Store className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[var(--text-main)] tracking-tight leading-none">Vendors Command Center</h2>
                        <p className="text-xs text-purple-500 font-bold uppercase tracking-widest mt-1">Advanced Analytics & Operations</p>
                    </div>
                </div>
            }
        >
            <Head title="Vendors Dashboard" />
            
            <div className="p-6 md:p-8 lg:p-12 overflow-y-auto min-h-screen pb-32">
                <div className="max-w-7xl mx-auto space-y-8">
                    
                    {/* Welcome Banner */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 md:p-12 shadow-2xl shadow-indigo-500/20 group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:rotate-12 transition-transform duration-700">
                            <Store size={200} />
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
                                Welcome back, {user.name.split(' ')[0]}
                            </h1>
                            <p className="text-indigo-100 font-medium max-w-xl text-lg leading-relaxed">
                                You are currently viewing your advanced Vendors Dashboard. Manage your integrations, track your revenue, and deploy new products to the marketplace.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <Link 
                                    href={route('vendors.sell')} 
                                    className="px-6 py-3 bg-white text-indigo-600 font-black uppercase tracking-widest text-xs rounded-full hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl flex items-center gap-2"
                                >
                                    <Plus size={16} /> Deploy New Product
                                </Link>
                                <Link 
                                    href={route('vendors.payments')} 
                                    className="px-6 py-3 bg-indigo-500/30 border border-indigo-400/30 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-indigo-500/50 hover:scale-105 transition-all flex items-center gap-2 backdrop-blur-sm"
                                >
                                    <DollarSign size={16} /> View Payouts
                                </Link>
                                <Link 
                                    href={route('vendors.projects')} 
                                    className="px-6 py-3 bg-purple-500/30 border border-purple-400/30 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-purple-500/50 hover:scale-105 transition-all flex items-center gap-2 backdrop-blur-sm"
                                >
                                    <Briefcase size={16} /> Manage Projects
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bento Grid Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* Revenue Card */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-emerald-500/30 transition-all group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                    <DollarSign className="text-emerald-500" size={24} />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                                    <ArrowUpRight size={14} /> 70% Cut
                                </span>
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1">Total Earnings</h3>
                            <div className="text-4xl font-black text-[var(--text-main)] tracking-tighter group-hover:text-emerald-500 transition-colors">
                                ${Number(totalEarnings).toFixed(2)}
                            </div>
                        </div>

                        {/* Sales Card */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-blue-500/10 rounded-2xl">
                                    <ShoppingCart className="text-blue-500" size={24} />
                                </div>
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1">Total Sales</h3>
                            <div className="text-4xl font-black text-[var(--text-main)] tracking-tighter group-hover:text-blue-500 transition-colors">
                                {totalSales}
                            </div>
                        </div>

                        {/* Products Card */}
                        <Link href={route('vendors.projects')} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-purple-500/30 transition-all group block">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-purple-500/10 rounded-2xl">
                                    <Briefcase className="text-purple-500" size={24} />
                                </div>
                                <span className="text-[10px] font-bold text-[var(--text-muted)] group-hover:text-purple-500 transition-colors uppercase tracking-widest">View All</span>
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1">Active Products</h3>
                            <div className="text-4xl font-black text-[var(--text-main)] tracking-tighter group-hover:text-purple-500 transition-colors">
                                {projectCount}
                            </div>
                        </Link>

                        {/* Health Status Card */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                            <div className={`absolute inset-0 opacity-5 ${isHealthy ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <div className={`p-3 rounded-2xl ${isHealthy ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    <Activity size={24} />
                                </div>
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1 relative z-10">Pipeline Status</h3>
                            <div className={`text-2xl font-black tracking-tighter mt-2 relative z-10 ${isHealthy ? 'text-emerald-500' : 'text-red-500'}`}>
                                {isHealthy ? 'Operational' : 'Action Required'}
                            </div>
                            <p className="text-xs text-[var(--text-muted)] font-medium mt-2 relative z-10">
                                {isHealthy ? 'Source control linked.' : 'Link a repository.'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Main Operations Area */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Source Code Integrations */}
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                                
                                <div className="flex items-start justify-between mb-8">
                                    <div>
                                        <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tighter flex items-center gap-3">
                                            <Code2 size={28} className="text-cyan-500" /> Source Code Integrations
                                        </h3>
                                        <p className="text-sm font-medium text-[var(--text-muted)] mt-2 max-w-md">
                                            Connect your repository providers. This allows our asset server to securely fetch your source code and compile license keys for your buyers automatically.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {connections.length === 0 && (
                                        <div className="p-8 border border-dashed border-[var(--border)] rounded-2xl text-center space-y-4">
                                            <div className="w-16 h-16 bg-[var(--bg-main)] rounded-full flex items-center justify-center mx-auto text-[var(--text-muted)]">
                                                <Github size={32} />
                                            </div>
                                            <h4 className="text-lg font-black text-[var(--text-main)]">No integrations yet</h4>
                                            <p className="text-sm text-[var(--text-muted)] font-medium max-w-sm mx-auto">
                                                You need to link at least one repository provider to sell digital products on the marketplace.
                                            </p>
                                        </div>
                                    )}

                                    {connections.map(conn => (
                                        <div key={conn.id} className="flex items-center justify-between p-5 bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-cyan-500/50 rounded-2xl transition-all group">
                                            <div className="flex items-center gap-5">
                                                <div className={`p-3 rounded-xl shadow-inner ${conn.provider === 'github' ? 'bg-[#24292e] text-white' : conn.provider === 'gitlab' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                                    <Github size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-black text-[var(--text-main)]">{conn.name}</h4>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] bg-[var(--bg-main)] px-2 py-1 rounded-md">{conn.provider}</span>
                                                        {conn.is_valid ? (
                                                            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-md"><CheckCircle2 size={12}/> Verified</span>
                                                        ) : (
                                                            <span className="text-[10px] text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded-md">Failed Connection</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleVerifyConnection(conn.id)} className="p-2.5 text-cyan-500 hover:bg-cyan-500/10 rounded-xl transition-all" title="Verify Connection">
                                                    <RefreshCw size={18} />
                                                </button>
                                                <button onClick={() => handleDeleteConnection(conn.id)} className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all" title="Remove Connection">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <form onSubmit={handleAddConnection} className="mt-8 p-6 border border-[var(--border)] rounded-2xl bg-[var(--bg-main)]/30 space-y-5">
                                        <h5 className="text-xs font-black uppercase tracking-widest text-[var(--text-main)] flex items-center gap-2">
                                            <Plus size={16} className="text-cyan-500" /> Add New Provider
                                        </h5>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Provider</label>
                                                <select 
                                                    value={newConnection.provider}
                                                    onChange={e => setNewConnection({...newConnection, provider: e.target.value})}
                                                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--text-main)] py-3 px-4 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                                                >
                                                    <option value="github">GitHub</option>
                                                    <option value="gitlab">GitLab</option>
                                                    <option value="bitbucket">Bitbucket</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Label Name</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. Work Account" 
                                                    value={newConnection.name}
                                                    onChange={e => setNewConnection({...newConnection, name: e.target.value})}
                                                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--text-main)] py-3 px-4 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Access Token</label>
                                                <input 
                                                    type="password" 
                                                    placeholder="Token (ghp_...)" 
                                                    value={newConnection.token}
                                                    onChange={e => setNewConnection({...newConnection, token: e.target.value})}
                                                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm font-mono text-[var(--text-main)] py-3 px-4 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={isAddingConnection}
                                            className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-black uppercase text-xs tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                                        >
                                            {isAddingConnection ? <Activity className="animate-spin" size={18} /> : 'Establish Connection'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                            
                            {/* Setup Documentation */}
                            <div className="p-8 bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gray-500 to-gray-700"></div>
                                <h4 className="text-lg font-black text-[var(--text-main)] uppercase tracking-tighter flex items-center gap-3">
                                    <Shield size={24} className="text-gray-400" /> Access Token Guide
                                </h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h5 className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest">
                                            GitHub Token Generation
                                        </h5>
                                        <ol className="text-sm text-[var(--text-muted)] font-medium space-y-3 list-decimal list-inside">
                                            <li>Go to GitHub <strong>Account Settings</strong> &gt; <strong>Developer Settings</strong>.</li>
                                            <li>Select <strong>Tokens (classic)</strong>.</li>
                                            <li>Click <strong>Generate new token</strong>.</li>
                                            <li>Under scopes, check the <strong className="text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">repo</strong> box.</li>
                                            <li>Generate, copy, and paste it above.</li>
                                        </ol>
                                    </div>
                                    <div className="space-y-4 md:border-l border-[var(--border)] md:pl-8">
                                        <h5 className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest">
                                            Security Architecture
                                        </h5>
                                        <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">
                                            Your source code remains entirely in your private repository. 
                                            Our asset server only uses this token to fetch a zipball of your code at the exact moment of a successful purchase, which is then securely routed to the buyer with an RSA digital signature.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            
                            {/* Quick Links */}
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 shadow-xl space-y-2">
                                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 px-2">Quick Actions</h3>
                                
                                <Link href={route('vendors.sell')} className="flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--bg-main)] group transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl group-hover:scale-110 transition-transform"><Store size={20}/></div>
                                        <span className="font-bold text-[var(--text-main)]">Sell a Product</span>
                                    </div>
                                    <ChevronRight size={18} className="text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" />
                                </Link>

                                <Link href={route('vendors.payments')} className="flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--bg-main)] group transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:scale-110 transition-transform"><DollarSign size={20}/></div>
                                        <span className="font-bold text-[var(--text-main)]">Payments & Payouts</span>
                                    </div>
                                    <ChevronRight size={18} className="text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" />
                                </Link>
                                
                                <Link href={route('my-account')} className="flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--bg-main)] group transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform"><CreditCard size={20}/></div>
                                        <span className="font-bold text-[var(--text-main)]">Payout Accounts</span>
                                    </div>
                                    <ChevronRight size={18} className="text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" />
                                </Link>

                                <Link href={route('support.index')} className="flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--bg-main)] group transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-orange-500/10 text-orange-500 rounded-xl group-hover:scale-110 transition-transform"><Shield size={20}/></div>
                                        <span className="font-bold text-[var(--text-main)]">Vendor Support</span>
                                    </div>
                                    <ChevronRight size={18} className="text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" />
                                </Link>
                            </div>

                            {/* Recent Sales Activity */}
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-6 shadow-xl">
                                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-6 px-2 flex items-center justify-between">
                                    Recent Sales 
                                    <Link href={route('vendors.payments')} className="text-indigo-500 hover:underline">View All</Link>
                                </h3>
                                
                                <div className="space-y-4">
                                    {recentSales && recentSales.length > 0 ? (
                                        recentSales.map(sale => (
                                            <div key={sale.id} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-main)]/50 border border-[var(--border)]">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[var(--text-main)] truncate max-w-[120px]">{sale.project?.name || 'Product'}</span>
                                                    <span className="text-[10px] font-medium text-[var(--text-muted)]">{new Date(sale.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <div className="text-right flex flex-col">
                                                    <span className="text-sm font-black text-emerald-500">+${(sale.amount * 0.70).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center p-6 text-[var(--text-muted)]">
                                            <ShoppingCart className="mx-auto mb-2 opacity-50" size={24} />
                                            <p className="text-xs font-medium">No recent sales.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
