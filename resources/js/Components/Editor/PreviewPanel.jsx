import React from 'react';

export default function PreviewPanel({ previewContent }) {
    return (
        <div className="h-full bg-white relative">
            <iframe 
                srcDoc={previewContent} 
                title="preview" 
                sandbox="allow-scripts" 
                className="w-full h-full border-none" 
            />
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-white/10 flex items-center space-x-2 pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-tighter">Live_Sync_OK</span>
            </div>
        </div>
    );
}