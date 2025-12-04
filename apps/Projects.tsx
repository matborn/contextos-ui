
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { NavItem, Project, Workspace } from '../types';
import { Home, Folder, Settings } from '../components/icons/Icons';
import { ProjectsHub } from '../screens/ProjectsHub';
import { generateId } from '../utils';

interface ProjectsAppProps {
    onExit: () => void;
    onLaunch: (appId: string) => void;
}

// --- Mock Data (Shared with Scriptor for now) ---

const MOCK_WORKSPACES: Workspace[] = [
    { id: 'ws-1', name: 'Project Titan', description: 'Titan Core Knowledge', visibility: 'private', health: 94, memberCount: 12, lastActive: new Date() },
    { id: 'ws-2', name: 'Sales & CRM', description: 'Sales processes', visibility: 'public', health: 88, memberCount: 5, lastActive: new Date() },
    { id: 'ws-3', name: 'Engineering Standards', description: 'Code guidelines', visibility: 'protected', health: 91, memberCount: 20, lastActive: new Date() },
];

const MOCK_PROJECTS: Project[] = [
    { 
        id: 'proj-1', 
        name: 'Project Titan', 
        description: 'Technical specs and architectural decisions for Titan.', 
        primaryAtlasWorkspaceId: 'ws-1', 
        secondaryAtlasWorkspaceIds: [],
        documentCount: 8,
        lastActive: new Date(),
        colorTheme: 'blue'
    },
    { 
        id: 'proj-2', 
        name: 'Sales Proposals EU', 
        description: 'Customer-facing proposals for the European market.', 
        primaryAtlasWorkspaceId: 'ws-2', 
        secondaryAtlasWorkspaceIds: ['ws-1'],
        documentCount: 14,
        lastActive: new Date(Date.now() - 86400000),
        colorTheme: 'purple'
    },
    { 
        id: 'proj-3', 
        name: 'Security Audits', 
        description: 'Internal compliance reports.', 
        primaryAtlasWorkspaceId: 'ws-3', 
        secondaryAtlasWorkspaceIds: [],
        documentCount: 3,
        lastActive: new Date(Date.now() - 172800000),
        colorTheme: 'red'
    }
];

export const Projects: React.FC<ProjectsAppProps> = ({ onExit, onLaunch }) => {
    const [currentView, setCurrentView] = useState('hub');
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

    const handleCreateProject = (projectData: Partial<Project>) => {
        const newProject: Project = {
            id: generateId(),
            name: projectData.name || 'New Project',
            description: projectData.description || '',
            primaryAtlasWorkspaceId: projectData.primaryAtlasWorkspaceId || '',
            secondaryAtlasWorkspaceIds: projectData.secondaryAtlasWorkspaceIds || [],
            documentCount: 0,
            lastActive: new Date(),
            colorTheme: projectData.colorTheme || 'blue'
        };
        setProjects(prev => [...prev, newProject]);
    };

    const handleUpdateProject = (id: string, updates: Partial<Project>) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const NAV_ITEMS: NavItem[] = [
        { id: 'hub', label: 'All Projects', icon: <Folder size={16}/> },
        { id: 'settings', label: 'Settings', icon: <Settings size={16}/> },
    ];

    return (
        <Layout 
            appName="Projects" 
            appIcon={<div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm">P</div>}
            navItems={NAV_ITEMS}
            currentView={currentView}
            onNavigate={setCurrentView}
            onExitApp={onExit}
            onLaunchApp={onLaunch}
        >
            {currentView === 'hub' ? (
                <ProjectsHub 
                    projects={projects}
                    availableWorkspaces={MOCK_WORKSPACES}
                    onOpenProject={(id) => {
                        // In a real app this would navigate to a detailed project view
                        console.log("Open project", id);
                    }}
                    onCreateProject={handleCreateProject}
                    onUpdateProject={handleUpdateProject}
                    onBack={onExit}
                />
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Settings size={32} className="mb-4"/>
                    <p>Global Project Settings</p>
                </div>
            )}
        </Layout>
    );
};
