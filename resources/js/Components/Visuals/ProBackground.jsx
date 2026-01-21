import React from 'react';

export default function ProBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[var(--bg-main)] transition-colors duration-300">
            {/* Ultra-lite Grid Pattern */}
            <div 
                className="absolute inset-0 opacity-[0.15]" 
                style={{ 
                    backgroundImage: `linear-gradient(to right, var(--accent) 1px, transparent 1px), linear-gradient(to bottom, var(--accent) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} 
            />
            
            {/* Subtle Gradient Radial */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bg-main) 80%)]" />
            
            {/* Subtle Vignette */}
            <div className="absolute inset-0 dark:shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] shadow-[inset_0_0_150px_rgba(255,255,255,0.2)]" />
        </div>
    );
}