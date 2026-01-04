import React from 'react';
import { cn } from '../../lib/utils';

// ===== TABS COMPONENT =====
interface NeoTabsProps {
    tabs: { id: string; label: string; icon?: React.ReactNode }[];
    activeTab: string;
    onChange: (tabId: string) => void;
    className?: string;
}

export const NeoTabs: React.FC<NeoTabsProps> = ({ tabs, activeTab, onChange, className }) => {
    return (
        <div className={cn("flex bg-neo-bg rounded-neo shadow-neo-in p-1 gap-2", className)}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-neo font-medium transition-all duration-200",
                            isActive
                                ? "bg-neo-bg shadow-neo-out text-neo-accent"
                                : "text-neo-text-secondary hover:text-neo-text hover:bg-white/40"
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};
NeoTabs.displayName = 'NeoTabs';
