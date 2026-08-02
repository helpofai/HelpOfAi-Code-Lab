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

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ToggleRight, Save, CheckCircle, 
    ShieldCheck, Loader2, ChevronDown, UserCheck
} from 'lucide-react';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';

const Section = ({ title, icon: Icon, children, defaultOpen = true, color = "indigo" }) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    const colors = {
        indigo: "text-indigo-500 border-indigo-500/30",
        emerald: "text-emerald-500 border-emerald-500/30",
        cyan: "text-cyan-500 border-cyan-500/30",
        rose: "text-rose-500 border-rose-500/30",
    };

    const textColor = colors[color].split(" ")[0];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden"
        >
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-8 hover:bg-white/5 transition-colors"
            >
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/60 flex items-center">
                    <Icon size={16} className={`mr-3 ${textColor}`} /> {title}
                </h3>
                <ChevronDown className={`text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-8 pt-0 space-y-6 border-t border-white/5 mt-2">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function FeatureManagement({ settings }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        settings: settings
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.features.update'), {
            preserveScroll: true,
        });
    };

    const handleToggle = (key) => {
        setData('settings', {
            ...data.settings,
            [key]: data.settings[key] === '1' ? '0' : '1'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-emerald-500/10 border border-emerald-400/30 rounded-lg">
                            <ToggleRight className="text-emerald-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white tracking-tighter uppercase leading-tight italic">Feature_Management</h2>
                            <p className="text-[8px] text-emerald-500/60 uppercase tracking-[0.4em] font-bold">System Capabilities Control</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Feature Management" />
            
            <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                <AnimatedGrid />
                
                <div className="max-w-4xl mx-auto relative z-10">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <Section title="Authentication & Security" icon={ShieldCheck} color="emerald">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between bg-white/5 p-6 rounded-xl border border-white/10">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg mt-1">
                                            <UserCheck className="text-emerald-500" size={16} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white uppercase tracking-tight">Require Email Verification</h4>
                                            <p className="text-xs text-white/50 mt-1">When enabled, users must verify their email address before accessing the dashboard or protected areas.</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => handleToggle('feature_user_verification')}
                                        className={`relative w-14 h-7 rounded-full transition-colors duration-200 ease-in-out focus:outline-none shrink-0 ${data.settings.feature_user_verification === '1' ? 'bg-emerald-500' : 'bg-white/20'}`}
                                    >
                                        <span 
                                            className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${data.settings.feature_user_verification === '1' ? 'translate-x-7' : 'translate-x-0'}`} 
                                        />
                                    </button>
                                </div>
                            </div>
                        </Section>

                        <div className="flex justify-end pt-8">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="group flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            >
                                {processing ? (
                                    <Loader2 className="mr-2 animate-spin" size={18} />
                                ) : recentlySuccessful ? (
                                    <>
                                        <CheckCircle className="mr-2" size={18} />
                                        Saved
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 group-hover:rotate-12 transition-transform" size={18} />
                                        Save_Configuration
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
