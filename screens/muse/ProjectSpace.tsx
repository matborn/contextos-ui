
import React, { useState } from 'react';
import { PageLayout } from '../../components/ui/PageLayout';
import { BrainstormSessionModel } from '../../apps/Muse';
import { Project } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Plus, Search, Database, ShieldCheck, Filter, MessageSquare, Zap, Target } from '../../components/icons/Icons';
import { SpaceInfoCard } from '../../components/scriptor/SpaceInfoCard';
import { ListItem } from '../../components/ui/ListItem';
import { cn } from '../../utils';

interface ProjectSpaceProps {
    project: Project;
    sessions: BrainstormSessionModel[];
    onOpenSession: (id: string) => void;
    onCreateSession: (title: string, method: string) => void;
    onBack: () => void;
}

type Tab = 'brainstorms' | 'ideas' | 'scenarios';

export const ProjectSpace: React.FC<ProjectSpaceProps> = ({ project, sessions, onOpenSession, onCreateSession, onBack }) => {
    const [activeTab, setActiveTab] = useState<Tab>('brainstorms');
    const [search, setSearch] = useState('');

    const filteredSessions = sessions.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <PageLayout
            title={project.name}
            description={project.description}
            onBack={onBack}
            backLabel="Back to Overview"
            badge={<Badge status="neutral" className="ml-2 bg-slate-100 text-slate-600">Ideation Space</Badge>}
            headerActions={
                <Button onClick={() => onCreateSession('New Session', 'Freeform')} leftIcon={<Plus size={16}/>}>Start Brainstorm</Button>
            }
        >
            <div className="flex flex-col lg:flex-row gap-8 h-full">
                
                {/* Left Sidebar Navigation */}
                <div className="w-full lg:w-64 shrink-0 space-y-2">
                    <button 
                        onClick={() => setActiveTab('brainstorms')}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            activeTab === 'brainstorms' ? "bg-sky-50 text-sky-700" : "text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        <MessageSquare size={18}/> Brainstorms
                        <Badge status="neutral" className="ml-auto text-[10px] bg-white">{sessions.length}</Badge>
                    </button>
                    <button 
                        onClick={() => setActiveTab('ideas')}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            activeTab === 'ideas' ? "bg-sky-50 text-sky-700" : "text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        <Zap size={18}/> Idea Backlog
                        <Badge status="neutral" className="ml-auto text-[10px] bg-white">42</Badge>
                    </button>
                    <button 
                        onClick={() => setActiveTab('scenarios')}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            activeTab === 'scenarios' ? "bg-sky-50 text-sky-700" : "text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        <Target size={18}/> Scenarios
                    </button>

                    <div className="pt-6 border-t border-slate-200 mt-6">
                        <SpaceInfoCard 
                            title="Knowledge Context" 
                            icon={<Database size={16}/>}
                            className="bg-slate-50 border-slate-200"
                        >
                            <p className="text-xs text-slate-500 mb-2">
                                Brainstorms in this project are grounded in:
                            </p>
                            <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                Project Titan
                            </div>
                        </SpaceInfoCard>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    
                    {activeTab === 'brainstorms' && (
                        <>
                            {/* Filter Bar */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <Input 
                                        leftIcon={<Search size={16} />}
                                        placeholder="Search sessions..." 
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="py-2.5"
                                    />
                                </div>
                                <Button variant="secondary" size="sm" leftIcon={<Filter size={14}/>}>Filter</Button>
                            </div>

                            {/* Sessions Grid */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                {filteredSessions.map(session => (
                                    <ListItem
                                        key={session.id}
                                        onClick={() => onOpenSession(session.id)}
                                        title={session.title}
                                        subtitle={
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                <span>Method: {session.method}</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span>Updated {new Date(session.lastActive).toLocaleDateString()}</span>
                                            </div>
                                        }
                                        leftIcon={
                                            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                                                <MessageSquare size={20}/>
                                            </div>
                                        }
                                        rightContent={
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-slate-500">{session.ideaCount} Ideas</span>
                                                <Badge 
                                                    status={session.status === 'completed' ? 'success' : session.status === 'active' ? 'info' : 'neutral'}
                                                    className="capitalize"
                                                >
                                                    {session.status}
                                                </Badge>
                                            </div>
                                        }
                                        className="hover:bg-slate-50"
                                    />
                                ))}
                                {filteredSessions.length === 0 && (
                                    <div className="p-12 text-center text-slate-400">
                                        <MessageSquare size={32} className="mx-auto mb-3 opacity-50"/>
                                        <p>No brainstorms found.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'ideas' && (
                        <div className="text-center py-20 bg-white border border-slate-200 border-dashed rounded-xl text-slate-400">
                            <Zap size={32} className="mx-auto mb-4 opacity-50"/>
                            <h3 className="text-slate-900 font-medium">Idea Backlog</h3>
                            <p className="text-sm mt-1">Cross-session idea aggregation coming soon.</p>
                        </div>
                    )}

                    {activeTab === 'scenarios' && (
                        <div className="text-center py-20 bg-white border border-slate-200 border-dashed rounded-xl text-slate-400">
                            <Target size={32} className="mx-auto mb-4 opacity-50"/>
                            <h3 className="text-slate-900 font-medium">Scenario Planner</h3>
                            <p className="text-sm mt-1">Modeling tools coming soon.</p>
                        </div>
                    )}

                </div>
            </div>
        </PageLayout>
    );
};
