import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React from 'react';
import { Mail, Save } from 'lucide-react';
import ProBackground from '@/Components/Visuals/ProBackground';
import AnimatedGrid from '@/Components/Visuals/AnimatedGrid';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TipTapEditor from '@/Components/Editor/TipTapEditor';

export default function EmailCreateEdit({ template }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: template?.name || '',
        subject: template?.subject || '',
        content: template?.content || '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (template) {
            put(route('admin.email.update', template.id));
        } else {
            post(route('admin.email.store'));
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
            <ProBackground />
            <AuthenticatedLayout
                header={
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-500">
                            <Mail size={20} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">{template ? 'Edit_Template' : 'New_Template'}</h2>
                            <p className="text-[8px] text-purple-500 uppercase tracking-[0.4em] font-bold mt-1">Email Protocol</p>
                        </div>
                    </div>
                }
            >
                <Head title={template ? 'Edit Template' : 'New Template'} />
                <div className="relative min-h-full p-8 lg:p-12 overflow-y-auto">
                    <AnimatedGrid />
                    <div className="max-w-4xl mx-auto relative z-10">
                        <form onSubmit={submit} className="space-y-8 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <InputLabel value="Template Name (Internal)" />
                                    <TextInput value={data.name} onChange={e => setData('name', e.target.value)} className="bg-[var(--bg-elevated)]" placeholder="e.g. Welcome Email" />
                                    {errors.name && <p className="text-rose-500 text-xs">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <InputLabel value="Email Subject" />
                                    <TextInput value={data.subject} onChange={e => setData('subject', e.target.value)} className="bg-[var(--bg-elevated)]" placeholder="e.g. Welcome to HOACodeLab" />
                                    {errors.subject && <p className="text-rose-500 text-xs">{errors.subject}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <InputLabel value="Content" />
                                    <div className="text-[9px] font-mono text-[var(--text-muted)]">Variables: {'{{name}}'}, {'{{email}}'}</div>
                                </div>
                                <TipTapEditor value={data.content} onChange={(val) => setData('content', val)} />
                                {errors.content && <p className="text-rose-500 text-xs">{errors.content}</p>}
                            </div>

                            <div className="flex justify-end pt-4 border-t border-[var(--border)]">
                                <PrimaryButton className="bg-purple-500 hover:bg-purple-600 border-purple-500 px-8 py-3" disabled={processing}>
                                    <Save size={16} className="mr-2" /> Save_Template
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
