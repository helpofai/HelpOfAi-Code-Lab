import React from 'react';

function Pulse({ className }) {
    return <div className={`animate-pulse rounded bg-[var(--border)] ${className}`} />;
}

export function ProjectCardSkeleton() {
    return (
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg overflow-hidden">
            <Pulse className="h-36 w-full rounded-none" />
            <div className="p-4 space-y-3">
                <Pulse className="h-4 w-3/4" />
                <Pulse className="h-3 w-1/2" />
                <div className="flex gap-2 pt-2">
                    <Pulse className="h-3 w-16" />
                    <Pulse className="h-3 w-12" />
                </div>
            </div>
        </div>
    );
}

export function EditorSkeleton() {
    return (
        <div className="flex flex-col h-screen bg-[var(--bg-main)]">
            {/* Header */}
            <div className="h-16 bg-[var(--bg-surface)] border-b border-[var(--border)] flex items-center px-4 gap-4">
                <Pulse className="h-8 w-8 rounded" />
                <Pulse className="h-5 w-40" />
                <div className="flex-1" />
                <Pulse className="h-8 w-8 rounded" />
                <Pulse className="h-8 w-8 rounded" />
                <Pulse className="h-8 w-20 rounded" />
            </div>
            {/* Panels */}
            <div className="flex-1 flex">
                <div className="flex-1 p-4 space-y-3">
                    <Pulse className="h-4 w-full" />
                    <Pulse className="h-4 w-5/6" />
                    <Pulse className="h-4 w-3/4" />
                    <Pulse className="h-4 w-full" />
                    <Pulse className="h-4 w-2/3" />
                </div>
                <div className="w-px bg-[var(--border)]" />
                <div className="flex-1 bg-white" />
            </div>
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-6 space-y-3">
            <Pulse className="h-3 w-16" />
            <Pulse className="h-8 w-12" />
        </div>
    );
}

export function ListRowSkeleton({ rows = 5 }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg">
                    <Pulse className="h-8 w-8 rounded" />
                    <div className="flex-1 space-y-2">
                        <Pulse className="h-3 w-1/3" />
                        <Pulse className="h-3 w-1/2" />
                    </div>
                    <Pulse className="h-3 w-16" />
                </div>
            ))}
        </div>
    );
}
