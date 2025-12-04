
import React, { useState } from 'react';
import { PageLayout } from '../../components/ui/PageLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ListItem } from '../../components/ui/ListItem';
import { ActionCard } from '../../components/dashboard/ActionCard';
import { ResourceCard } from '../../components/dashboard/ResourceCard';
import { Modal } from '../../components/ui/Modal';
import { Plus, MessageSquare, Clock, Folder, Zap, ShieldCheck, Target, Database } from '../../components/icons/Icons';
import { BrainstormSessionModel } from '../../apps/Muse';
import { Project } from '../../types';
import { cn } from '../../utils';

interface MuseDashboardProps {
    projects: Project[];
    recentSessions: BrainstormSessionModel[];
    onOpenProject: (id: string) => void;
    onOpenSession: (id: string, projectId: string) => void;
    onCreateSession: (title: string, projectId: string, method: string) => void;
    onViewAllProjects?: () => void;
}

export const MuseDashboard: React.FC<MuseDashboardProps> = ({ 
    projects, 
    recentSessions, 
    onOpenProject, 
    onOpenSession, 
    onCreateSession,
    onViewAllProjects 
}) => {
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

    const handleStartSession = (method: string) => {
        setSelectedMethod(method);
        setIsProjectModalOpen(true);
    };

    const handleProjectSelect = (projectId: string) => {
        onCreateSession(`New ${selectedMethod || 'Brainstorm'}`, projectId, selectedMethod || 'Freeform');
        setIsProjectModalOpen(false);
        setSelectedMethod(null);
    };

    return (
        <PageLayout
            title="Muse Home"
            description="AI-Guided Ideation Engine"
            hideHeader
        >
            <div className="max-w-6xl mx-auto space-y-10 mt-8">
                
                {/* Hero / Accelerators */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ignite your creativity</h1>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ActionCard 
                            title="Freeform" 
                            description="Open canvas with AI co-pilot" 
                            icon={<Plus size={20} />} 
                            variant="general"
                            onClick={() => handleStartSession('Freeform')}
                        />
                        <ActionCard 
                            title="SCAMPER" 
                            description="Substitute, Combine, Adapt..." 
                            icon={<Zap size={20} />} 
                            variant="creative"
                            onClick={() => handleStartSession('SCAMPER')}
                        />
                        <ActionCard 
                            title="Pre-Mortem" 
                            description="Identify risks before they happen" 
                            icon={<ShieldCheck size={20} />} 
                            variant="strategy"
                            onClick={() => handleStartSession('Pre-Mortem')}
                        />
                        <ActionCard 
                            title="SWOT Analysis" 
                            description="Strengths, Weaknesses, Opportunities..." 
                            icon={<Target size={20} />} 
                            variant="technical"
                            onClick={() => handleStartSession('SWOT')}
                        />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: Recent Sessions */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Clock size={18} className="text-slate-400"/> Recent Brainstorms
                            </h2>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>
                        
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            {recentSessions.map(session => {
                                const project = projects.find(s => s.id === session.projectId);
                                return (
                                    <ListItem
                                        key={session.id}
                                        onClick={() => onOpenSession(session.id, session.projectId)}
                                        title={session.title}
                                        subtitle={
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                <span className="font-medium text-slate-600">{project?.name}</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span>{session.method}</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span>{session.ideaCount} ideas</span>
                                            </div>
                                        }
                                        leftIcon={
                                            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                                                <MessageSquare size={20}/>
                                            </div>
                                        }
                                        rightContent={
                                            <Badge 
                                                status={session.status === 'completed' ? 'success' : session.status === 'active' ? 'info' : 'neutral'}
                                                className="capitalize"
                                            >
                                                {session.status}
                                            </Badge>
                                        }
                                        className="hover:bg-slate-50"
                                    />
                                );
                            })}
                            {recentSessions.length === 0 && (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    No recent sessions. Start a new brainstorm above.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Your Projects */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Folder size={18} className="text-slate-400"/> Your Projects
                            </h2>
                            <Button variant="ghost" size="sm" onClick={onViewAllProjects}>Projects Hub</Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {projects.map(project => (
                                <ResourceCard
                                    key={project.id}
                                    title={project.name}
                                    description={project.description}
                                    initial={project.name.charAt(0)}
                                    colorTheme={project.colorTheme}
                                    statLabel={`${project.documentCount} artifacts`}
                                    statIcon={<Folder size={12}/>}
                                    onClick={() => onOpenProject(project.id)}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Project Selection Modal */}
            <Modal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                title="Select a Project"
            >
                <div className="space-y-4">
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 border border-slate-200">
                        Every brainstorm session belongs to a <strong>Project</strong>. This connects your ideas to the knowledge graph and execution tasks.
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {projects.map(p => (
                            <button
                                key={p.id}
                                onClick={() => handleProjectSelect(p.id)}
                                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm", 
                                        p.colorTheme === 'blue' ? "bg-blue-500" :
                                        p.colorTheme === 'purple' ? "bg-purple-500" :
                                        p.colorTheme === 'red' ? "bg-red-500" : "bg-slate-500"
                                    )}>
                                        {p.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900">{p.name}</div>
                                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                            <Database size={10}/> Linked to Atlas
                                        </div>
                                    </div>
                                </div>
                                <Plus size={16} className="text-slate-300 group-hover:text-sky-500"/>
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>
        </PageLayout>
    );
};
