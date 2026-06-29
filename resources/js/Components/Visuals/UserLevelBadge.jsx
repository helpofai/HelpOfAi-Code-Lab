import React from 'react';
import { 
    Shield, 
    ShieldAlert, 
    ShieldCheck, 
    Sword, 
    Swords, 
    Zap, 
    Star, 
    Crown, 
    Flame, 
    Sparkles 
} from 'lucide-react';

export default function UserLevelBadge({ level = 1, className = '', size = 'md', showText = true }) {
    const getLevelConfig = (lvl) => {
        switch (true) {
            case (lvl >= 10): return { 
                name: 'Cosmic', 
                style: 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 text-white border-transparent shadow-[0_0_20px_rgba(217,70,239,0.6)] animate-pulse', 
                icon: Sparkles 
            };
            case (lvl === 9): return { 
                name: 'Mythic', 
                style: 'bg-gradient-to-br from-rose-600 to-orange-500 text-white border-transparent shadow-[0_0_15px_rgba(225,29,72,0.5)]', 
                icon: Flame 
            };
            case (lvl === 8): return { 
                name: 'Legend', 
                style: 'bg-gradient-to-br from-yellow-400 to-amber-600 text-yellow-950 border-yellow-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]', 
                icon: Crown 
            };
            case (lvl === 7): return { 
                name: 'Grandmaster', 
                style: 'bg-gradient-to-br from-fuchsia-500 to-purple-700 text-white border-fuchsia-400 shadow-[0_0_15px_rgba(192,38,211,0.5)]', 
                icon: Star 
            };
            case (lvl === 6): return { 
                name: 'Master', 
                style: 'bg-gradient-to-br from-indigo-500 to-blue-700 text-white border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]', 
                icon: Zap 
            };
            case (lvl === 5): return { 
                name: 'Elite', 
                style: 'bg-gradient-to-br from-cyan-400 to-teal-600 text-white border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]', 
                icon: Swords 
            };
            case (lvl === 4): return { 
                name: 'Veteran', 
                style: 'bg-gradient-to-br from-emerald-500 to-green-700 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]', 
                icon: Sword 
            };
            case (lvl === 3): return { 
                name: 'Adept', 
                style: 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 border-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.4)]', 
                icon: ShieldCheck 
            };
            case (lvl === 2): return { 
                name: 'Apprentice', 
                style: 'bg-gradient-to-br from-amber-700 to-orange-900 text-amber-100 border-amber-600 shadow-[0_0_8px_rgba(180,83,9,0.4)]', 
                icon: ShieldAlert 
            };
            default: return { 
                name: 'Novice', 
                style: 'bg-gradient-to-br from-slate-700 to-slate-900 text-slate-300 border-slate-600 shadow-[0_0_5px_rgba(71,85,105,0.3)]', 
                icon: Shield 
            };
        }
    };

    const config = getLevelConfig(level);
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'px-1.5 py-0.5 text-[8px] gap-1',
        md: 'px-2 py-1 text-[10px] gap-1.5',
        lg: 'px-3 py-1.5 text-xs gap-2',
    };

    const iconSizes = { sm: 10, md: 12, lg: 16 };

    return (
        <div 
            className={`inline-flex items-center font-black uppercase tracking-widest rounded-full border ${config.style} ${sizeClasses[size]} ${className}`}
            title={`Level ${level} - ${config.name}`}
        >
            <Icon size={iconSizes[size]} strokeWidth={2.5} />
            {showText && <span>Lvl {level}</span>}
        </div>
    );
}
