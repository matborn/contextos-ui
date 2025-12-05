
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { NavItem, ContextView, AppMode } from '../types';
import { Database, Settings, Activity } from '../components/icons/Icons';
import { LandingPage } from '../screens/LandingPage';
import { KnowledgeBase } from '../screens/KnowledgeBase';
import { Settings as SettingsPage } from '../screens/Settings';
import { Workspace as WorkspaceDashboard } from '../screens/Workspace';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { useToast } from '../components/ui/Toast';

interface ContextOSProps {
    onExit: () => void;
    onLaunch: (appId: string) => void;
    initialView?: ContextView;
}

export const ContextOS: React.FC<ContextOSProps> = ({ onExit, onLaunch, initialView }) => {
    // Navigation State
    const [currentView, setCurrentView] = useState<ContextView>(initialView || 'landing');
    const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
    const { showToast } = useToast();
    const {
        workspaces,
        aggregates,
        activeWorkspace,
        loading,
        isRefreshing,
        isEmpty,
        error,
        validationErrors,
        isCreating,
        actionError,
        refresh,
        fetchWorkspaceDetail,
        createWorkspace,
    } = useWorkspaces();

    // Navigation Items - Dynamic based on Context
    // Removed "Atlas Home" to clean up top nav as requested
    const GLOBAL_NAV_ITEMS: NavItem[] = [];

    const WORKSPACE_NAV_ITEMS: NavItem[] = [
        { id: 'workspace', label: 'Dashboard', icon: <Activity size={16} /> },
        { id: 'knowledge', label: 'Knowledge', icon: <Database size={16} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
    ];
    
    const handleSwitchWorkspace = async (id: string) => {
        if (id === 'home') {
            setActiveWorkspaceId(null);
            setCurrentView('landing');
        } else {
            try {
                await fetchWorkspaceDetail(id);
                setActiveWorkspaceId(id);
                setCurrentView('workspace');
            } catch (err) {
                showToast('Unable to open workspace', { type: 'error' });
            }
        }
    };

    const handleCreateWorkspace = async (input: { name: string; description?: string; visibility: 'private' | 'public' | 'protected' }) => {
        try {
            const created = await createWorkspace(input);
            if (created?.id) {
                setActiveWorkspaceId(created.id);
                setCurrentView('workspace');
                showToast('Workspace created', { type: 'success' });
            }
        } catch (err) {
            showToast('Create workspace failed', { type: 'error', message: err instanceof Error ? err.message : undefined });
            throw err;
        }
    };

    const renderView = () => {
        switch (currentView) {
            case 'landing': 
                return (
                    <LandingPage 
                        workspaces={workspaces}
                        aggregates={aggregates}
                        loading={loading}
                        isRefreshing={isRefreshing}
        validationErrors={validationErrors}
        isCreating={isCreating}
        actionError={actionError}
        error={error}
                        onSelectWorkspace={(id) => handleSwitchWorkspace(id)}
                        onCreateWorkspace={handleCreateWorkspace}
                        onRefresh={refresh}
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
            onCreateWorkspace={(name, visibility) => handleCreateWorkspace({ name, visibility })}
        >
            {renderView()}
        </Layout>
    );
};
