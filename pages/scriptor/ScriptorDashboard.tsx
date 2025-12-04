
import React, { useState } from 'react';
import { PageLayout } from '../../components/ui/PageLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ListItem } from '../../components/ui/ListItem';
import { ActionCard } from '../../components/dashboard/ActionCard';
import { ResourceCard } from '../../components/dashboard/ResourceCard';
import { Modal } from '../../components/ui/Modal';
import { Plus, FileText, Clock, Folder, FilePen, ShieldCheck, Target, Database } from '../../components/icons/Icons';
import { Project, ScriptorDoc } from '../../types';
import { cn } from '../../utils';

interface ScriptorDashboardProps {
    projects: Project[];
    recentDocs: ScriptorDoc[];
    onOpenProject: (id: string) => void;
    onOpenDoc: (id: string, projectId: string) => void;
    onCreateDoc: (title: string, projectId: string, templateId?: string) => void;
    onViewAllProjects?: () => void;
}

export const ScriptorDashboard: React.FC<ScriptorDashboardProps> = ({ 
    projects, 
    recentDocs, 
    onOpenProject, 
    onOpenDoc, 
    onCreateDoc,
    onViewAllProjects 
}) => {
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const handleStartDoc = (template: string) => {
        setSelectedTemplate(template);
        setIsProjectModalOpen(true);
    };

    const handleProjectSelect = (projectId: string) => {
        onCreateDoc(`New ${selectedTemplate || 'Document'}`, projectId, selectedTemplate || undefined);
        setIsProjectModalOpen(false);
        setSelectedTemplate(null);
    };

    return (
        <PageLayout
            title="Scriptor Home"
            description="AI-First Document Engine"
            hideHeader
        >
            <div className="max-w-6xl mx-auto space-y-10 mt-8">
                
                {/* Hero / Quick Start */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Start a new document</h1>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ActionCard 
                            title="Blank Draft" 
                            description="Start from scratch with AI assistance" 
                            icon={<Plus size={20} />} 
                            variant="general"
                            onClick={() => handleStartDoc('Blank Draft')}
                        />
                        <ActionCard 
                            title="Technical Spec" 
                            description="RFCs, API docs, and architecture" 
                            icon={<FilePen size={20} />} 
                            variant="technical"
                            onClick={() => handleStartDoc('Technical Spec')}
                        />
                        <ActionCard 
                            title="Strategy Memo" 
                            description="Proposals, briefs, and roadmaps" 
                            icon={<Target size={20} />} 
                            variant="strategy"
                            onClick={() => handleStartDoc('Strategy Memo')}
                        />
                        <ActionCard 
                            title="Legal Contract" 
                            description="Agreements, MSAs, and policies" 
                            icon={<ShieldCheck size={20} />} 
                            variant="legal"
                            onClick={() => handleStartDoc('Legal Contract')}
                        />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: Recent Documents */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Clock size={18} className="text-slate-400"/> Recent Documents
                            </h2>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>
                        
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            {recentDocs.map(doc => {
                                const project = projects.find(s => s.id === doc.projectId);
                                return (
                                    <ListItem
                                        key={doc.id}
                                        onClick={() => onOpenDoc(doc.id, doc.projectId)}
                                        title={doc.title}
                                        subtitle={
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                <span className="font-medium text-slate-600">{project?.name}</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span>Edited {new Date(doc.lastModified).toLocaleDateString()}</span>
                                            </div>
                                        }
                                        leftIcon={
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                <FileText size={20}/>
                                            </div>
                                        }
                                        rightContent={
                                            <Badge 
                                                status={doc.status === 'approved' ? 'success' : doc.status === 'review' ? 'info' : 'neutral'}
                                                className="capitalize"
                                            >
                                                {doc.status}
                                            </Badge>
                                        }
                                        className="hover:bg-slate-50"
                                    />
                                );
                            })}
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
                                    statLabel={`${project.documentCount} docs`}
                                    statIcon={<FileText size={12}/>}
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
                        Every document must belong to a <strong>Project</strong>. Projects define the knowledge context (Atlas) and governance rules for your work.
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {projects.map(p => (
                            <button
                                key={p.id}
                                onClick={() => handleProjectSelect(p.id)}
                                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-between group"
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
                                <Plus size={16} className="text-slate-300 group-hover:text-blue-500"/>
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>
        </PageLayout>
    );
};
