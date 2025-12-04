
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { NavItem, ScriptorView, Project, ScriptorDoc, Workspace } from '../types';
import { FileText, Settings, LayoutTemplate, Home, Folder } from '../components/icons/Icons';
import { ScriptorDashboard } from '../pages/scriptor/ScriptorDashboard';
import { SpaceExplorer } from '../pages/scriptor/SpaceExplorer'; // This file will be reused but logically represents Project Documents
import { DocumentEditor } from '../pages/scriptor/DocumentEditor';
import { ScriptorTemplates } from '../pages/scriptor/ScriptorTemplates';
import { ScriptorSettings } from '../pages/scriptor/ScriptorSettings'; // Import the new page
import { ProjectsHub } from '../pages/ProjectsHub';
import { generateId } from '../utils';

interface ScriptorProps {
    onExit: () => void;
    onLaunch: (appId: string) => void;
}

// --- Mock Data ---

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
        primaryAtlasWorkspaceId: 'ws-1', // Project Titan in Atlas
        secondaryAtlasWorkspaceIds: [],
        documentCount: 8,
        lastActive: new Date(),
        colorTheme: 'blue'
    },
    { 
        id: 'proj-2', 
        name: 'Sales Proposals EU', 
        description: 'Customer-facing proposals for the European market.', 
        primaryAtlasWorkspaceId: 'ws-2', // CRM in Atlas
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

const MOCK_DOCS: ScriptorDoc[] = [
    { id: 'doc-1', projectId: 'proj-1', title: 'Titan API Specs v2', status: 'draft', lastModified: new Date(), authorId: 'user-1', collaborators: ['ai'] },
    { id: 'doc-2', projectId: 'proj-1', title: 'Authentication RFC', status: 'review', lastModified: new Date(Date.now() - 3600000), authorId: 'ai', collaborators: ['user-1'] },
    { id: 'doc-3', projectId: 'proj-1', title: 'Database Migration Plan', status: 'approved', lastModified: new Date(Date.now() - 86400000 * 2), authorId: 'ai', collaborators: [] },
    { id: 'doc-4', projectId: 'proj-2', title: 'Acme Corp Proposal', status: 'draft', lastModified: new Date(), authorId: 'user-1', collaborators: ['ai'] },
];

export const Scriptor: React.FC<ScriptorProps> = ({ onExit, onLaunch }) => {
    // Navigation State
    const [currentView, setCurrentView] = useState<ScriptorView>('dashboard');
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [activeDocId, setActiveDocId] = useState<string | null>(null);

    // Global Assistant State Integration
    const [assistantState, setAssistantState] = useState(false);

    // Data State
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [docs, setDocs] = useState<ScriptorDoc[]>(MOCK_DOCS);

    // Derived
    const activeProject = projects.find(s => s.id === activeProjectId);
    const activeDoc = docs.find(d => d.id === activeDocId);
    const isEditor = currentView === 'editor';

    // --- Actions ---

    const handleNavigate = (view: string) => {
        if (view === 'dashboard' || view === 'projects_hub' || view === 'templates') {
            setActiveProjectId(null);
            setActiveDocId(null);
            setCurrentView(view as ScriptorView);
        } else {
            setCurrentView(view as ScriptorView);
        }
    };

    const handleOpenProject = (projectId: string) => {
        setActiveProjectId(projectId);
        setActiveDocId(null);
        setCurrentView('project');
    };

    const handleOpenDoc = (docId: string, projectId?: string) => {
        if (projectId) setActiveProjectId(projectId);
        setActiveDocId(docId);
        setCurrentView('editor');
        setAssistantState(false);
    };

    const handleCreateDoc = (title: string, projectId: string, templateId?: string) => {
        const newDoc: ScriptorDoc = {
            id: generateId(),
            projectId,
            title,
            status: 'draft',
            lastModified: new Date(),
            authorId: 'user-1',
            collaborators: ['ai'],
            templateId
        };
        setDocs(prev => [newDoc, ...prev]);
        handleOpenDoc(newDoc.id, projectId);
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

    // Unified Navigation - Consistent across all screens
    const NAV_ITEMS: NavItem[] = [
        { id: 'dashboard', label: 'Overview', icon: <Home size={16}/> },
        { id: 'projects_hub', label: 'Projects', icon: <Folder size={16}/> },
        { id: 'templates', label: 'Templates', icon: <LayoutTemplate size={16}/> },
        { id: 'settings', label: 'Settings', icon: <Settings size={16}/> },
    ];

    return (
        <Layout
            appName="Scriptor"
            appIcon={<div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm">S</div>}
            navItems={NAV_ITEMS}
            currentView={currentView}
            onNavigate={handleNavigate}
            onExitApp={onExit}
            onLaunchApp={onLaunch}
            
            // Integrate with Global Assistant Toggle
            hideGlobalAssistant={isEditor}
            isAssistantOpen={assistantState}
            onToggleAssistant={() => setAssistantState(prev => !prev)}
        >
            {currentView === 'dashboard' && (
                <ScriptorDashboard 
                    projects={projects}
                    recentDocs={docs.slice(0, 5)} 
                    onOpenProject={handleOpenProject}
                    onOpenDoc={handleOpenDoc}
                    onCreateDoc={handleCreateDoc}
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
                    onBack={() => handleNavigate('dashboard')}
                />
            )}

            {currentView === 'templates' && (
                <ScriptorTemplates 
                    projects={projects}
                    onCreateDoc={(title, projectId) => handleCreateDoc(title, projectId)}
                />
            )}

            {currentView === 'project' && activeProject && (
                <SpaceExplorer 
                    project={activeProject}
                    docs={docs.filter(d => d.projectId === activeProject.id)}
                    onOpenDoc={handleOpenDoc}
                    onCreateDoc={(title, templateId) => handleCreateDoc(title, activeProject.id, templateId)}
                    onBack={() => handleNavigate('dashboard')}
                />
            )}

            {currentView === 'editor' && activeDoc && (
                <DocumentEditor 
                    doc={activeDoc}
                    project={projects.find(p => p.id === activeDoc.projectId)}
                    onBack={() => {
                        if (activeDoc.projectId) {
                            handleOpenProject(activeDoc.projectId);
                        } else {
                            handleNavigate('dashboard');
                        }
                    }}
                    showAtlasAssistant={assistantState}
                    onToggleAssistant={() => setAssistantState(prev => !prev)}
                />
            )}

            {currentView === 'settings' && (
                <ScriptorSettings />
            )}
        </Layout>
    );
};
