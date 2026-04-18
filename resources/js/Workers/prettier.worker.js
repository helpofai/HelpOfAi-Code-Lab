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
