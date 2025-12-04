
import React, { useState } from 'react';
import { PageLayout } from '../components/ui/PageLayout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { ProjectSettingsModal } from '../components/scriptor/ProjectSettingsModal';
import { Plus, Search, Settings, FileText, Database, Folder, Users, Filter, Zap, Network, MessageSquare, LayoutTemplate } from '../components/icons/Icons';
import { Project, Workspace } from '../types';
import { cn } from '../utils';

interface ProjectsHubProps {
  projects: Project[];
  availableWorkspaces: Workspace[];
  onOpenProject: (projectId: string) => void;
  onCreateProject: (project: Partial<Project>) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onBack?: () => void;
}

export const ProjectsHub: React.FC<ProjectsHubProps> = ({ 
    projects, 
    availableWorkspaces,
    onOpenProject,
    onCreateProject,
    onUpdateProject,
    onBack
}) => {
  const [search, setSearch] = useState('');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  const handleEditProject = (e: React.MouseEvent, project: Project) => {
      e.stopPropagation();
      setEditingProject(project);
      setIsSettingsModalOpen(true);
  };

  const handleCreateNew = () => {
      setEditingProject(undefined);
      setIsSettingsModalOpen(true);
  };

  const handleSaveProject = (data: Partial<Project>) => {
      if (editingProject) {
          onUpdateProject(editingProject.id, data);
      } else {
          onCreateProject(data);
      }
  };

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageLayout
        title="Projects Hub"
        description="Manage all your work initiatives, knowledge bindings, and permissions."
        maxWidth="7xl"
        onBack={onBack}
        backLabel="Back to Dashboard"
        headerActions={
            <Button onClick={handleCreateNew} leftIcon={<Plus size={16}/>}>New Project</Button>
        }
    >
        <div className="space-y-8">
            
            {/* Search & Filter */}
            <div className="flex items-center gap-4">
                <div className="flex-1 max-w-lg">
                    <Input 
                        leftIcon={<Search size={16} />} 
                        placeholder="Search projects..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="py-2.5"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" leftIcon={<Filter size={14}/>}>Filter</Button>
                    <Button variant="secondary" size="sm" leftIcon={<Settings size={14}/>}>Global Rules</Button>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => {
                    const workspace = availableWorkspaces.find(w => w.id === project.primaryAtlasWorkspaceId);
                    
                    return (
                        <div 
                            key={project.id}
                            onClick={() => onOpenProject(project.id)}
                            className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col h-[280px]"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105",
                                    project.colorTheme === 'blue' ? "bg-blue-500" :
                                    project.colorTheme === 'purple' ? "bg-purple-500" :
                                    project.colorTheme === 'green' ? "bg-green-500" : 
                                    project.colorTheme === 'orange' ? "bg-orange-500" : "bg-red-500"
                                )}>
                                    {project.name.charAt(0)}
                                </div>
                                <button 
                                    onClick={(e) => handleEditProject(e, project)}
                                    className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                                >
                                    <Settings size={16}/>
                                </button>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{project.name}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
                                    {project.description}
                                </p>
                                
                                {/* Knowledge Context Pill */}
                                <div className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600 mb-4">
                                    <Database size={12} className="text-blue-500"/>
                                    <span className="truncate max-w-[150px]">
                                        Linked: <span className="font-medium text-slate-800">{workspace?.name || 'Unlinked'}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Footer Stats */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1 hover:text-blue-600" title="Documents"><FileText size={14}/> {project.documentCount}</span>
                                    <span className="flex items-center gap-1 hover:text-sky-600" title="Brainstorms"><MessageSquare size={14}/> 2</span>
                                    <span className="flex items-center gap-1 hover:text-amber-600" title="Features"><Zap size={14}/> 5</span>
                                </div>
                                <span>{new Date(project.lastActive).toLocaleDateString()}</span>
                            </div>
                        </div>
                    );
                })}

                {/* Create New Card */}
                <button 
                    onClick={handleCreateNew}
                    className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-blue-400 hover:bg-blue-50/30 hover:text-blue-600 transition-all min-h-[280px]"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-blue-100">
                        <Plus size={24}/>
                    </div>
                    <span className="font-medium">Create Project</span>
                </button>
            </div>
        </div>

        <ProjectSettingsModal 
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            project={editingProject}
            availableWorkspaces={availableWorkspaces}
            onSave={handleSaveProject}
        />
    </PageLayout>
  );
};
