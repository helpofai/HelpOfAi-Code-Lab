import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

const AdsenseLoader = () => {
    const { props } = usePage();
    const siteSettings = props.siteSettings || {};
    const adsenseHeaderCode = siteSettings.adsense_header_code || '';

    useEffect(() => {
        // Check if we already have the script loaded
        const existingScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
        if (existingScript) return;

        if (!adsenseHeaderCode) return;

        // Parse the client ID from the header code if possible
        const clientMatch = adsenseHeaderCode.match(/client=([ca-pub-\d]+)/);
        const clientId = clientMatch ? clientMatch[1] : null;

        // Create and inject the script
        const script = document.createElement('script');
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.src = clientId 
            ? `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
            : 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        
        document.head.appendChild(script);

        // Cleanup
        return () => {
            // Don't remove script on unmount as it's global
        };
    }, [adsenseHeaderCode]);

    // Also inject the raw header code if it contains additional meta/tags
    useEffect(() => {
        if (!adsenseHeaderCode) return;

        // Check if raw code was already injected
        const existingRaw = document.querySelector('#adsense-raw-header');
        if (existingRaw) return;

        // Create a container for any additional raw header code (meta tags, etc)
        const container = document.createElement('div');
        container.id = 'adsense-raw-header';
        container.style.display = 'none';
        container.innerHTML = adsenseHeaderCode;
        document.head.appendChild(container);
    }, [adsenseHeaderCode]);

    return null; // This component doesn't render anything visible
};

export default AdsenseLoader;