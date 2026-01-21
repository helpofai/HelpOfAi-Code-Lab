import React from 'react';

export default function ProBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
            {/* Ultra-lite Grid Pattern */}
            <div 
                className="absolute inset-0 opacity-[0.15]" 
                style={{ 
                    backgroundImage: `linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} 
            />
            
            {/* Subtle Gradient Radial */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_80%)]" />
            
            {/* Subtle Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
        </div>
    );
}