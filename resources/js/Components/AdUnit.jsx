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

import React, { useEffect } from 'react';
import axios from 'axios';

export default function AdUnit({ ad, onAdLoaded }) {
    if (!ad || !ad.is_active) return null;

    useEffect(() => {
        // Log Impression Analytics once per session per ad unit
        const sessionKey = `ad_impression_${ad.id}`;
        if (!sessionStorage.getItem(sessionKey)) {
            axios.post(`/ads/${ad.id}/impression`)
                .then(() => sessionStorage.setItem(sessionKey, 'true'))
                .catch(e => console.error('Ad tracking blocked:', e));
        }

        if (ad.provider === 'adsense' && ad.client_id && ad.slot_id) {
            const initAd = () => {
                try {
                    // Initialize the array if not already present
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    if (onAdLoaded) onAdLoaded();
                } catch (e) {
                    console.error('AdSense initialization error:', e);
                }
            };

            // Attempt immediate initialization
            initAd();

            // Retry initialization after a short delay
            const timer = setTimeout(initAd, 1000);
            return () => clearTimeout(timer);
        } else if (onAdLoaded) {
            onAdLoaded();
        }
    }, [ad, onAdLoaded]);


    if (ad.provider === 'custom' && ad.custom_code) {
        // If the custom code contains the adsbygoogle script and ins tag, 
        // we need to ensure the script execution is triggered or is already present globally.
        return <div className="custom-ad-container" dangerouslySetInnerHTML={{ __html: ad.custom_code }} />;
    }

    if (ad.provider === 'facebook' && ad.slot_id) {
        // Facebook Audience Network Web is deprecated mostly, but if using standard placement:
        return (
            <div 
                className="fb-ad" 
                data-placementid={ad.slot_id} 
                data-format={ad.format === 'auto' ? 'native' : ad.format} 
                data-nativeadid={ad.client_id}
            />
        );
    }

    if (ad.provider === 'adsense') {
        return (
            <div className="w-full overflow-hidden text-center my-4">
                <ins 
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client={ad.client_id}
                    data-ad-slot={ad.slot_id}
                    data-ad-format={ad.format}
                    data-full-width-responsive="true"
                />
            </div>
        );
    }

    return null;
}
