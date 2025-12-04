

import React from 'react';
import { Network, Activity, ShieldCheck, Layers, FileText, MessageSquare, Zap, LayoutTemplate, Folder } from '../components/icons/Icons';
import { AppId, User } from '../types';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { cn } from '../utils';

interface LauncherProps {
    onLaunch: (appId: AppId, viewId?: string) => void;
    user: User | null;
    onOpenProfile: () => void;
}

interface ModuleCardProps {
    id: AppId;
    name: string;
    description: string;
    iconChar: string;
    color: string;
    bgIcon: React.ReactNode;
    actionLabel: string;
    onClick: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ name, description, iconChar, color, bgIcon, actionLabel, onClick }) => (
    <div 
        onClick={onClick}
        className="group relative bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all cursor-pointer overflow-hidden flex flex-col h-full"
    >
        {/* Background Watermark */}
        <div className={cn("absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none", color.replace('bg-', 'text-'))}>
            {bgIcon}
        </div>

        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform relative z-10", color)}>
            <span className="text-xl font-bold">{iconChar}</span>
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-2 relative z-10">{name}</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-6 relative z-10 flex-1">
            {description}
        </p>
        
        <div className={cn("flex items-center text-xs font-bold group-hover:underline relative z-10 uppercase tracking-wide", color.replace('bg-', 'text-'))}>
            {actionLabel} →
        </div>
    </div>
);

export const Launcher: React.FC<LauncherProps> = ({ onLaunch, user, onOpenProfile }) => {
    const { showToast } = useToast();

    const handleModuleClick = (id: AppId) => {
        // Enabled: Scriptor, Muse, Projects. Blocked: Forge/Pilot.
        if (['forge', 'pilot'].includes(id)) {
            showToast(`${id.charAt(0).toUpperCase() + id.slice(1)} is currently in private beta.`, { type: 'info' });
            return;
        }
        onLaunch(id);
    };

    const modules = [
        {
            id: 'context-os' as AppId,
            name: 'Atlas',
            description: 'Knowledge engine for ingestion, ontology, validation, and exploration.',
            iconChar: 'A',
            color: 'bg-slate-900',
            bgIcon: <Layers size={120} />,
            actionLabel: 'Open Atlas'
        },
        {
            id: 'projects' as AppId,
            name: 'Projects',
            description: 'Central hub for all work initiatives, permissions, and knowledge binding.',
            iconChar: 'P',
            color: 'bg-indigo-600',
            bgIcon: <Folder size={120} />,
            actionLabel: 'Manage Projects'
        },
        {
            id: 'scriptor' as AppId,
            name: 'Scriptor',
            description: 'AI-powered document generation and editing workspace.',
            iconChar: 'S',
            color: 'bg-blue-600',
            bgIcon: <FileText size={120} />,
            actionLabel: 'Open Scriptor'
        },
        {
            id: 'muse' as AppId,
            name: 'Muse',
            description: 'Creative studio for brainstorming, ideation, and conversation.',
            iconChar: 'M',
            color: 'bg-sky-500',
            bgIcon: <MessageSquare size={120} />,
            actionLabel: 'Open Muse'
        },
        {
            id: 'life-os' as AppId,
            name: 'Horizon',
            description: 'Life planning and financial modeling with privacy-first controls.',
            iconChar: 'H',
            color: 'bg-emerald-500',
            bgIcon: <Activity size={120} />,
            actionLabel: 'Open Horizon'
        },
        {
            id: 'forge' as AppId,
            name: 'Forge',
            description: 'Product intelligence for features, risks, metrics, and decisions.',
            iconChar: 'F',
            color: 'bg-amber-600',
            bgIcon: <Zap size={120} />,
            actionLabel: 'Open Forge'
        },
        {
            id: 'pilot' as AppId,
            name: 'Pilot',
            description: 'Project execution cockpit for tasks, blockers, and dependencies.',
            iconChar: 'P',
            color: 'bg-blue-600',
            bgIcon: <Network size={120} />,
            actionLabel: 'Open Pilot'
        }
    ];

    const appBuilder = {
        id: 'ai-builder' as AppId,
        name: 'App Builder',
        description: 'Construct custom apps on top of the Elori knowledge engine.',
        iconChar: 'A',
        color: 'bg-blue-700',
        bgIcon: <LayoutTemplate size={120} />,
        actionLabel: 'Open App Builder'
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative font-sans">
            
            {/* Top Header */}
            <div className="absolute top-6 right-6 z-10 flex items-center gap-6">
                {user ? (
                    <button 
                        onClick={onOpenProfile}
                        className="flex items-center gap-3 pl-4 pr-1 py-1 bg-white rounded-full shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all group"
                    >
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{user.name}</span>
                        <Avatar name={user.name} size="sm" />
                    </button>
                ) : (
                    <Button variant="secondary" size="sm">Sign In</Button>
                )}
            </div>

            <div className="flex-1 flex flex-col items-center py-16 px-8 overflow-y-auto">
                <div className="max-w-6xl w-full space-y-12 animate-fadeIn">
                    
                    {/* Hero Section */}
                    <div className="text-center space-y-3">
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Elori Platform</h1>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                            Your personal operating system for work, life, and knowledge.
                            <br/>Select a module to begin.
                        </p>
                    </div>

                    {/* Main Module Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map(mod => (
                            <ModuleCard 
                                key={mod.id}
                                {...mod}
                                onClick={() => handleModuleClick(mod.id)}
                            />
                        ))}
                    </div>

                    {/* App Builder Feature Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                             <ModuleCard 
                                {...appBuilder}
                                onClick={() => handleModuleClick(appBuilder.id)}
                            />
                        </div>
                        {/* Placeholder for future expansion or marketing content if needed */}
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-8 border-t border-slate-200">
                        <p className="text-xs text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                            <ShieldCheck size={14} /> Secured by Elori Identity
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};