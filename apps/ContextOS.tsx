
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { NavItem, ContextView, AppMode, Workspace } from '../types';
import { Database, Network, Settings, Home, Activity } from '../components/icons/Icons';
import { LandingPage } from '../screens/LandingPage';
import { KnowledgeBase } from '../screens/KnowledgeBase';
import { Settings as SettingsPage } from '../screens/Settings';
import { Workspace as WorkspaceDashboard } from '../screens/Workspace';
import { generateId } from '../utils';

interface ContextOSProps {
    onExit: () => void;
    onLaunch: (appId: string) => void;
    initialView?: ContextView;
}

const MOCK_WORKSPACES: Workspace[] = [
    { id: 'ws-1', name: 'Project Titan', description: 'Global payments overhaul', visibility: 'private', health: 94, memberCount: 12, lastActive: new Date() },
    { id: 'ws-2', name: 'Marketing Launch', description: 'Q3 Brand Campaign', visibility: 'public', health: 88, memberCount: 5, lastActive: new Date(Date.now() - 86400000) },
    { id: 'ws-3', name: 'Compliance 2024', description: 'ISO 27001 Audit Prep', visibility: 'protected', health: 91, memberCount: 3, lastActive: new Date(Date.now() - 172800000) },
];

export const ContextOS: React.FC<ContextOSProps> = ({ onExit, onLaunch, initialView }) => {
    // Navigation State
    const [currentView, setCurrentView] = useState<ContextView>(initialView || 'landing');
    
    // Workspace State
    const [workspaces, setWorkspaces] = useState<Workspace[]>(MOCK_WORKSPACES);
    const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);

    const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || null;

    // Navigation Items - Dynamic based on Context
    // Removed "Atlas Home" to clean up top nav as requested
    const GLOBAL_NAV_ITEMS: NavItem[] = [];

    const WORKSPACE_NAV_ITEMS: NavItem[] = [
        { id: 'workspace', label: 'Dashboard', icon: <Activity size={16} /> },
        { id: 'knowledge', label: 'Knowledge', icon: <Database size={16} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
    ];
    
    const handleSwitchWorkspace = (id: string) => {
        if (id === 'home') {
            setActiveWorkspaceId(null);
            setCurrentView('landing');
        } else {
            setActiveWorkspaceId(id);
            setCurrentView('workspace');
        }
    };

    const handleCreateWorkspace = (name: string, visibility: 'private' | 'public' | 'protected') => {
        const newWs: Workspace = {
            id: generateId(),
            name,
            description: 'New Workspace',
            visibility,
            health: 100,
            memberCount: 1,
            lastActive: new Date()
        };
        setWorkspaces(prev => [...prev, newWs]);
        setActiveWorkspaceId(newWs.id);
        setCurrentView('workspace');
    };

    // DEMO ONLY: Reset state to empty
    const demoResetEmpty = () => {
        setWorkspaces([]);
        setActiveWorkspaceId(null);
        setCurrentView('landing');
    };

    const renderView = () => {
        switch (currentView) {
            case 'landing': 
                return (
                    <LandingPage 
                        workspaces={workspaces}
                        onSelectWorkspace={(id) => handleSwitchWorkspace(id)}
                        onCreateWorkspace={handleCreateWorkspace}
                        onDemoReset={demoResetEmpty}
                    />
                );
            case 'workspace': 
                return <WorkspaceDashboard onBack={() => handleSwitchWorkspace('home')} />;
            case 'knowledge': 
                return <KnowledgeBase />;
            case 'settings': 
                return <SettingsPage workspace={activeWorkspace} />;
            
            default: return <LandingPage workspaces={workspaces} onSelectWorkspace={handleSwitchWorkspace} onCreateWorkspace={handleCreateWorkspace} />;
        }
    };

    // Determine active nav items
    let activeNavItems = GLOBAL_NAV_ITEMS;
    if (activeWorkspaceId) {
        activeNavItems = WORKSPACE_NAV_ITEMS;
    }

    return (
        <Layout 
            appName="Atlas" 
            appIcon={<div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm">A</div>}
            navItems={activeNavItems}
            currentView={currentView} 
            onNavigate={setCurrentView}
            onExitApp={onExit}
            onLaunchApp={onLaunch}
            
            // Workspace Context Props
            currentWorkspace={activeWorkspace}
            allWorkspaces={workspaces}
            onSwitchWorkspace={handleSwitchWorkspace}
            onCreateWorkspace={handleCreateWorkspace}
        >
            {renderView()}
        </Layout>
    );
};
