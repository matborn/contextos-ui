
import React from 'react';
import { Bot, Sparkles } from './icons/Icons';
import { GlobalAssistant } from './GlobalAssistant';
import { cn } from '../utils';

interface UnifiedAgentSidebarProps {
    appName: string;
    appIcon?: React.ReactNode;
    isAtlasOpen: boolean;
    onToggleAgent: () => void;
    children: React.ReactNode;
    onNavigateGlobal?: (viewId: string) => void;
    globalViewContext?: string;
    className?: string;
}

export const UnifiedAgentSidebar: React.FC<UnifiedAgentSidebarProps> = ({
    appName,
    appIcon = <Bot size={14} />,
    isAtlasOpen,
    onToggleAgent,
    children,
    onNavigateGlobal = () => {},
    globalViewContext,
    className
}) => {
    return (
        <div className={cn("w-[350px] bg-slate-50 border-l border-slate-200 flex flex-col z-20 shrink-0 relative transition-all", className)}>
            {/* Agent Header / Toggle */}
            <div className="h-14 px-4 border-b border-slate-100 flex items-center gap-2 bg-white shrink-0">
                {/* Toggle Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-lg w-full">
                    <button 
                        onClick={() => isAtlasOpen && onToggleAgent()} 
                        className={cn(
                            "flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-2",
                            !isAtlasOpen ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {appIcon} {appName}
                    </button>
                    <button 
                        onClick={() => !isAtlasOpen && onToggleAgent()}
                        className={cn(
                            "flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-2",
                            isAtlasOpen ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <Sparkles size={14} /> Atlas
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative bg-white">
                {isAtlasOpen ? (
                    <GlobalAssistant 
                        embedded 
                        onNavigate={onNavigateGlobal}
                        appName={appName}
                        currentView={globalViewContext}
                    />
                ) : (
                    <div className="h-full flex flex-col">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};
