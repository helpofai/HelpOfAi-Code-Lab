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

import { useState, useCallback } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import useProjectStore from '@/Stores/useProjectStore';

export const useEditorActions = (projectData, setProjectData, setLogs) => {
    const { auth } = usePage().props;
    const { 
        html, css, js, title, isPrivate, isForSale, price, externalLibraries, 
        setHtml, setCss, setJs, google_drive_file_id, setGoogleDriveFileId,
        theme, preprocessors
    } = useProjectStore();

    const [isSaving, setIsSaving] = useState(false);
    const [isFormatting, setIsFormatting] = useState(false);

    const formatCode = useCallback(() => {
        setIsFormatting(true);
        setLogs(prev => [...prev, { type: 'LOG', content: 'Formatting code via Web Worker...', id: Date.now() }]);
        
        try {
            const worker = new Worker(new URL('../Workers/prettier.worker.js', import.meta.url), { type: 'module' });
            
            worker.postMessage({
                html, css, js,
                options: { printWidth: 80, tabWidth: 2, useTabs: false, semi: true, singleQuote: false }
            });

            worker.onmessage = (e) => {
                if (e.data.success) {
                    setHtml(e.data.formatted.html);
                    setCss(e.data.formatted.css);
                    setJs(e.data.formatted.js);
                    setLogs(prev => [...prev, { type: 'LOG', content: 'Neural Optimization Complete.', id: Date.now() }]);
                } else {
                    setLogs(prev => [...prev, { type: 'ERR', content: `Format Error: ${e.data.error}`, id: Date.now() }]);
                }
                setIsFormatting(false);
                worker.terminate();
            };

            worker.onerror = (err) => {
                setLogs(prev => [...prev, { type: 'ERR', content: 'Worker Thread Error.', id: Date.now() }]);
                setIsFormatting(false);
                worker.terminate();
            };
        } catch (err) {
            setLogs(prev => [...prev, { type: 'ERR', content: 'Failed to spawn worker.', id: Date.now() }]);
            setIsFormatting(false);
        }
    }, [html, css, js, setHtml, setCss, setJs, setLogs]);

    const handleFork = useCallback(async () => {
        if (!projectData?.id) return alert('Initialize module before forking.');
        try {
            const data = { 
                title: `${title} (Fork)`, 
                code: { html, css, js }, 
                settings: { externalLibraries, theme, preprocessors }, 
                is_public: !isPrivate, 
                is_private: isPrivate,
                is_for_sale: false, // Fork is always free by default
                price: 0
            };
            const res = await axios.post('/api/projects', data);
            window.location.href = `/editor/${res.data.slug}`;
        } catch(e) {
            setLogs(prev => [...prev, { type: 'ERR', content: 'Fork operation failed.', id: Date.now() }]);
        }
    }, [projectData, title, html, css, js, externalLibraries, isPrivate, theme, preprocessors, setLogs]);

    const handleSave = useCallback(async () => {
        if (!auth.user) {
            if (confirm('Authentication required. Redirect to login?')) {
                window.location.href = route('login');
            }
            return;
        }

        const isOwner = !projectData || projectData.user_id === auth.user.id;

        if (!isOwner && projectData?.id) {
            return handleFork();
        }

        setIsSaving(true);
        try {
            const data = { 
                title, 
                code: { html, css, js }, 
                settings: { externalLibraries, theme, preprocessors }, 
                is_public: !isPrivate, 
                is_private: isPrivate,
                is_for_sale: isForSale,
                price: price
            };
            const endpoint = projectData?.id ? `/api/projects/${projectData.id}` : '/api/projects';
            const method = projectData?.id ? 'put' : 'post';
            const res = await axios[method](endpoint, data);
            
            setProjectData(res.data);
            if (!projectData?.id) window.history.pushState({}, '', `/editor/${res.data.slug}`);
            
            setLogs(prev => [...prev, { type: 'LOG', content: 'Cloud sync successful.', id: Date.now() }]);
        } catch (e) {
            setLogs(prev => [...prev, { type: 'ERR', content: 'Sync failed. Verify connection.', id: Date.now() }]);
        } finally {
            setIsSaving(false);
        }
    }, [auth.user, projectData, title, html, css, js, externalLibraries, isPrivate, isForSale, price, theme, preprocessors, handleFork, setProjectData, setLogs]);

    const handleCloudSave = useCallback(async () => {
        if (!auth.user?.google_drive_token) return alert('Cloud Link Inactive. Connect via Cloud Sync page.');
        
        setIsSaving(true);
        setLogs(prev => [...prev, { type: 'LOG', content: 'Initiating Cloud Uplink...', id: Date.now() }]);
        
        try {
            const res = await axios.post('/api/google-drive/save', {
                title,
                code: { html, css, js },
                settings: { externalLibraries, theme, preprocessors },
                drive_file_id: google_drive_file_id
            });
            
            if (res.data.id) {
                setGoogleDriveFileId(res.data.id);
                setLogs(prev => [...prev, { type: 'LOG', content: 'Cloud Node Synced: ' + res.data.id, id: Date.now() }]);
            }
        } catch (e) {
            setLogs(prev => [...prev, { type: 'ERR', content: 'Cloud Uplink Failed.', id: Date.now() }]);
        } finally {
            setIsSaving(false);
        }
    }, [auth.user, title, html, css, js, google_drive_file_id, setGoogleDriveFileId, setLogs]);

    return {
        isSaving,
        isFormatting,
        formatCode,
        handleSave,
        handleFork,
        handleCloudSave
    };
};
