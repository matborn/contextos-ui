
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { NavItem, Project, Workspace } from '../types';
import { MessageSquare, Settings, Home, LayoutTemplate } from '../components/icons/Icons';
import { MuseDashboard } from '../screens/muse/MuseDashboard';
import { ProjectSpace } from '../screens/muse/ProjectSpace';
import { BrainstormSession } from '../screens/muse/BrainstormSession';
import { ProjectsHub } from '../screens/ProjectsHub';
import { generateId } from '../utils';

interface MuseProps {
    onExit: () => void;
    onLaunch: (appId: string) => void;
}

// --- Types for Muse ---
export type MuseView = 'dashboard' | 'projects_hub' | 'project' | 'session' | 'settings' | 'methods';

export interface BrainstormSessionModel {
    id: string;
    projectId: string;
    title: string;
    method: 'Freeform' | 'SCAMPER' | 'SWOT' | 'Pre-Mortem';
    status: 'active' | 'paused' | 'completed';
    lastActive: Date;
    ideaCount: number;
}

// --- Mock Data ---

const MOCK_WORKSPACES: Workspace[] = [
    { id: 'ws-1', name: 'Project Titan', description: 'Titan Core Knowledge', visibility: 'private', health: 94, memberCount: 12, lastActive: new Date() },
    { id: 'ws-2', name: 'Sales & CRM', description: 'Sales processes', visibility: 'public', health: 88, memberCount: 5, lastActive: new Date() },
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
    }
];

const MOCK_SESSIONS: BrainstormSessionModel[] = [
    { id: 'sess-1', projectId: 'proj-1', title: 'Titan Q3 Roadmap', method: 'Freeform', status: 'active', lastActive: new Date(), ideaCount: 12 },
    { id: 'sess-2', projectId: 'proj-1', title: 'Risk Analysis: Payment Gateway', method: 'Pre-Mortem', status: 'completed', lastActive: new Date(Date.now() - 100000000), ideaCount: 8 },
    { id: 'sess-3', projectId: 'proj-2', title: 'EU Market Entry', method: 'SWOT', status: 'paused', lastActive: new Date(Date.now() - 200000000), ideaCount: 24 },
];

export const Muse: React.FC<MuseProps> = ({ onExit, onLaunch }) => {
    // Navigation State
    const [currentView, setCurrentView] = useState<MuseView>('dashboard');
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

    // Global Assistant
    const [assistantState, setAssistantState] = useState(false);

    // Data State
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [sessions, setSessions] = useState<BrainstormSessionModel[]>(MOCK_SESSIONS);

    // Derived
    const activeProject = projects.find(p => p.id === activeProjectId);
    const activeSession = sessions.find(s => s.id === activeSessionId);
    const isSessionActive = currentView === 'session';

    // --- Actions ---

    const handleNavigate = (view: string) => {
        if (view === 'dashboard' || view === 'projects_hub') {
            setActiveProjectId(null);
            setActiveSessionId(null);
            setCurrentView(view as MuseView);
        } else {
            setCurrentView(view as MuseView);
        }
    };

    const handleOpenProject = (projectId: string) => {
        setActiveProjectId(projectId);
        setActiveSessionId(null);
        setCurrentView('project');
    };

    const handleOpenSession = (sessionId: string, projectId?: string) => {
        if (projectId) setActiveProjectId(projectId);
        setActiveSessionId(sessionId);
        setCurrentView('session');
        setAssistantState(false); // Hide global assistant when entering deep work
    };

    const handleCreateSession = (title: string, projectId: string, method: any) => {
        const newSession: BrainstormSessionModel = {
            id: generateId(),
            projectId,
            title,
            method,
            status: 'active',
            lastActive: new Date(),
            ideaCount: 0
        };
        setSessions(prev => [newSession, ...prev]);
        handleOpenSession(newSession.id, projectId);
    };

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

    // --- Navigation Config ---
    const NAV_ITEMS: NavItem[] = [
        { id: 'dashboard', label: 'Overview', icon: <Home size={16}/> },
        { id: 'methods', label: 'Methods', icon: <LayoutTemplate size={16}/> }, // Placeholder for method library
        { id: 'settings', label: 'Settings', icon: <Settings size={16}/> },
    ];

    return (
        <Layout
            appName="Muse"
            appIcon={<div className="w-6 h-6 bg-sky-500 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm">M</div>}
            navItems={NAV_ITEMS}
            currentView={currentView}
            onNavigate={handleNavigate}
            onExitApp={onExit}
            onLaunchApp={onLaunch}
            
            // Integrate with Global Assistant Toggle
            hideGlobalAssistant={isSessionActive}
            isAssistantOpen={assistantState}
            onToggleAssistant={() => setAssistantState(prev => !prev)}
        >
            {currentView === 'dashboard' && (
                <MuseDashboard 
                    projects={projects}
                    recentSessions={sessions.slice(0, 5)}
                    onOpenProject={handleOpenProject}
                    onOpenSession={handleOpenSession}
                    onCreateSession={handleCreateSession}
                    onViewAllProjects={() => handleNavigate('projects_hub')}
                />
            )}

            {currentView === 'projects_hub' && (
                <ProjectsHub 
                    projects={projects}
                    availableWorkspaces={MOCK_WORKSPACES}
                    onOpenProject={handleOpenProject}
                    onCreateProject={handleCreateProject}
                    onUpdateProject={handleUpdateProject}
                />
            )}

            {currentView === 'project' && activeProject && (
                <ProjectSpace 
                    project={activeProject}
                    sessions={sessions.filter(s => s.projectId === activeProject.id)}
                    onOpenSession={handleOpenSession}
                    onCreateSession={(title, method) => handleCreateSession(title, activeProject.id, method)}
                    onBack={() => handleNavigate('dashboard')}
                />
            )}

            {currentView === 'session' && activeSession && (
                <BrainstormSession 
                    session={activeSession}
                    project={activeProject}
                    onBack={() => handleOpenProject(activeSession.projectId)}
                    showAtlasAssistant={assistantState}
                    onToggleAssistant={() => setAssistantState(prev => !prev)}
                />
            )}

            {/* Fallbacks */}
            {(currentView === 'methods' || currentView === 'settings') && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Settings size={32}/>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-700">Under Construction</h2>
                    <p className="text-sm">This module is coming soon.</p>
                </div>
            )}
        </Layout>
    );
};
