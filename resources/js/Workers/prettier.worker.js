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

import prettier from 'prettier/standalone';
import parserHtml from 'prettier/plugins/html';
import parserCss from 'prettier/plugins/postcss';
import parserBabel from 'prettier/plugins/babel';
import * as estree from "prettier/plugins/estree";

self.onmessage = async (e) => {
    const { html, css, js, options } = e.data;
    try {
        const formattedHtml = await prettier.format(html, { 
            ...options, 
            parser: 'html', 
            plugins: [parserHtml] 
        });
        
        const formattedCss = await prettier.format(css, { 
            ...options, 
            parser: 'css', 
            plugins: [parserCss] 
        });
        
        const formattedJs = await prettier.format(js, { 
            ...options, 
            parser: 'babel', 
            plugins: [parserBabel, estree] 
        });
        
        self.postMessage({ 
            success: true, 
            formatted: { html: formattedHtml, css: formattedCss, js: formattedJs } 
        });
    } catch (err) {
        self.postMessage({ success: false, error: err.message });
    }
};
