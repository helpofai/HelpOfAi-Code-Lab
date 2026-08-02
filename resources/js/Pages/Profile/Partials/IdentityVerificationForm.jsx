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

import React, { useState, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Upload, FileImage, FileText, Loader2, Info } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import axios from 'axios';
import { useToast } from '@/Components/Toast/ToastProvider';

export default function IdentityVerificationForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const toast = useToast();
    const [status, setStatus] = useState(user.identity_status || 'unverified');
    const [rejectedReason, setRejectedReason] = useState(user.identity_rejected_reason);
    
    const [selfieFile, setSelfieFile] = useState(null);
    const [documentFile, setDocumentFile] = useState(null);
    const [selfiePreview, setSelfiePreview] = useState(null);
    const [documentPreview, setDocumentPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const selfieInputRef = useRef(null);
    const documentInputRef = useRef(null);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === 'selfie') {
            setSelfieFile(file);
            setSelfiePreview(URL.createObjectURL(file));
        } else {
            setDocumentFile(file);
            if (file.type.startsWith('image/')) {
                setDocumentPreview(URL.createObjectURL(file));
            } else {
                setDocumentPreview(null);
            }
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        
        if (!selfieFile || !documentFile) {
            toast.error('Both selfie and national ID document are required.');
            return;
        }

        const formData = new FormData();
        formData.append('selfie', selfieFile);
        formData.append('document', documentFile);

        setIsUploading(true);
        try {
            const res = await axios.post('/api/profile/identity', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus('pending');
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload documents.');
        } finally {
            setIsUploading(false);
        }
    };

    if (status === 'verified') {
        return (
            <section className={className}>
                <header>
                    <h2 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] flex items-center gap-2">
                        <ShieldCheck className="text-emerald-500" /> Identity Verified
                    </h2>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                        Your identity has been securely verified by the administration.
                    </p>
                </header>
                <div className="mt-6 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-4 text-emerald-500">
                    <ShieldCheck size={24} className="shrink-0 mt-1" />
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest">Verification Complete</h4>
                        <p className="text-xs mt-1 text-emerald-500/80">Your profile now displays a verified badge. You have access to all high-clearance sectors of the platform.</p>
                    </div>
                </div>
            </section>
        );
    }

    if (status === 'pending') {
        return (
            <section className={className}>
                <header>
                    <h2 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] flex items-center gap-2">
                        <Loader2 className="text-amber-500 animate-spin" /> Verification Pending
                    </h2>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                        Your documents have been submitted and are currently being reviewed.
                    </p>
                </header>
                <div className="mt-6 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-4 text-amber-500">
                    <Info size={24} className="shrink-0 mt-1" />
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest">Review in Progress</h4>
                        <p className="text-xs mt-1 text-amber-500/80">Administration is analyzing your identity documents. This process usually takes up to 24-48 hours. You will be notified upon completion.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-black uppercase tracking-widest text-[var(--text-main)] flex items-center gap-2">
                    <ShieldAlert className="text-cyan-500" /> Advance Identity Verification
                </h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Verify your identity to get the verified badge and secure your account.
                </p>
            </header>

            {status === 'rejected' && (
                <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-500 mb-6">
                    <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest">Verification Rejected</h4>
                        <p className="text-xs mt-1 text-rose-500/80">Reason: {rejectedReason || 'Documents were invalid or unclear.'}</p>
                        <p className="text-xs mt-1 text-rose-500/80">Please upload new, clear documents.</p>
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Selfie Upload */}
                    <div className="space-y-2">
                        <InputLabel value="1. Selfie / Live Photo" />
                        <div 
                            onClick={() => selfieInputRef.current?.click()}
                            className="relative group cursor-pointer h-48 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-cyan-500/50 bg-[var(--bg-elevated)] flex flex-col items-center justify-center overflow-hidden transition-all"
                        >
                            {selfiePreview ? (
                                <>
                                    <img src={selfiePreview} alt="Selfie preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs font-bold uppercase tracking-widest text-white bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Change Photo</span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-cyan-500/10 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <FileImage size={24} />
                                    </div>
                                    <span className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]">Upload Selfie</span>
                                    <span className="block text-[10px] text-[var(--text-muted)] mt-1">Clear face, good lighting. JPG/PNG</span>
                                </div>
                            )}
                        </div>
                        <input type="file" accept="image/*" ref={selfieInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'selfie')} />
                    </div>

                    {/* Document Upload */}
                    <div className="space-y-2">
                        <InputLabel value="2. National ID Document" />
                        <div 
                            onClick={() => documentInputRef.current?.click()}
                            className="relative group cursor-pointer h-48 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-cyan-500/50 bg-[var(--bg-elevated)] flex flex-col items-center justify-center overflow-hidden transition-all"
                        >
                            {documentPreview ? (
                                <>
                                    <img src={documentPreview} alt="Document preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs font-bold uppercase tracking-widest text-white bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Change Document</span>
                                    </div>
                                </>
                            ) : documentFile ? (
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-cyan-500/10 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FileText size={24} />
                                    </div>
                                    <span className="block text-xs font-bold uppercase tracking-widest text-cyan-500">{documentFile.name}</span>
                                </div>
                            ) : (
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-cyan-500/10 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <Upload size={24} />
                                    </div>
                                    <span className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]">Upload ID Card</span>
                                    <span className="block text-[10px] text-[var(--text-muted)] mt-1">Front and back (if applicable). JPG/PNG/PDF</span>
                                </div>
                            )}
                        </div>
                        <input type="file" accept="image/*,.pdf" ref={documentInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'document')} />
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <PrimaryButton disabled={isUploading || !selfieFile || !documentFile} className="py-4 px-8 group relative overflow-hidden">
                        {isUploading ? (
                            <><Loader2 className="animate-spin mr-2" size={16} /> Transmitting_Data...</>
                        ) : (
                            <>Submit_For_Verification <ShieldAlert className="ml-2 group-hover:rotate-12 transition-transform" size={16} /></>
                        )}
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}
