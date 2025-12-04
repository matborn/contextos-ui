
import React, { useState } from 'react';
import { PageLayout } from '../../components/ui/PageLayout';
import { Project, ScriptorDoc } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Plus, Search, Database, ShieldCheck, Filter } from '../../components/icons/Icons';
import { DocCard } from '../../components/scriptor/DocCard';
import { SpaceInfoCard } from '../../components/scriptor/SpaceInfoCard';

interface ProjectDocumentsProps {
    project: Project;
    docs: ScriptorDoc[];
    onOpenDoc: (id: string) => void;
    onCreateDoc: (title: string, templateId?: string) => void;
    onBack: () => void;
}

export const SpaceExplorer: React.FC<ProjectDocumentsProps> = ({ project, docs, onOpenDoc, onCreateDoc, onBack }) => {
    const [search, setSearch] = useState('');

    const filteredDocs = docs.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <PageLayout
            title={project.name}
            description={project.description}
            onBack={onBack}
            backLabel="Back to Overview"
            badge={<Badge status="neutral" className="ml-2 bg-slate-100 text-slate-600">Documents</Badge>}
            headerActions={
                <Button onClick={() => onCreateDoc('New Document')} leftIcon={<Plus size={16}/>}>New Document</Button>
            }
        >
            <div className="flex flex-col lg:flex-row gap-8 h-full">
                
                {/* Main Content: Doc List */}
                <div className="flex-1 space-y-6">
                    {/* Filter Bar */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <Input 
                                leftIcon={<Search size={16} />}
                                placeholder="Search project documents..." 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="py-2.5"
                            />
                        </div>
                        <Button variant="secondary" size="sm" leftIcon={<Filter size={14}/>}>Filter</Button>
                    </div>

                    {/* Docs Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {filteredDocs.map(doc => (
                            <DocCard 
                                key={doc.id}
                                doc={doc}
                                onClick={() => onOpenDoc(doc.id)}
                            />
                        ))}
                        {filteredDocs.length === 0 && (
                            <div className="text-center py-20 bg-white border border-slate-200 border-dashed rounded-xl text-slate-400">
                                <Plus size={32} className="mx-auto mb-4 opacity-50"/>
                                <p>No documents found in this project.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Project Context */}
                <div className="w-full lg:w-80 shrink-0 space-y-6">
                    
                    {/* Knowledge Connection */}
                    <SpaceInfoCard 
                        title="Project Knowledge Context" 
                        icon={<Database size={18}/>}
                    >
                        <p className="text-xs text-slate-500 mb-3">
                            AI agents in this project use knowledge from the following Atlas workspaces:
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-sm font-medium text-blue-900">Project Titan</span>
                                <Badge status="neutral" className="ml-auto text-[10px]">Primary</Badge>
                            </div>
                            {project.secondaryAtlasWorkspaceIds.map(id => (
                                <div key={id} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-lg">
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                    <span className="text-sm font-medium text-slate-700">{id === 'ws-1' ? 'Project Titan' : 'Atlas Core'}</span>
                                    <Badge status="neutral" className="ml-auto text-[10px]">Ref</Badge>
                                </div>
                            ))}
                        </div>
                    </SpaceInfoCard>

                    {/* Governance Rules */}
                    <SpaceInfoCard
                        title="Project Document Rules"
                        icon={<ShieldCheck size={18}/>}
                    >
                        <ul className="space-y-3">
                            <li className="text-xs text-slate-600 flex items-start gap-2">
                                <div className="mt-0.5"><ShieldCheck size={12} className="text-green-500"/></div>
                                All PRDs must have "Security Risks" section.
                            </li>
                            <li className="text-xs text-slate-600 flex items-start gap-2">
                                <div className="mt-0.5"><ShieldCheck size={12} className="text-green-500"/></div>
                                Approval required from "Engineering Lead".
                            </li>
                        </ul>
                    </SpaceInfoCard>

                </div>
            </div>
        </PageLayout>
    );
};
