
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PageLayout } from '../components/ui/PageLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Database, Activity, ShieldCheck, Plus, Users, Lock, Globe, Eye, Network, Layers, RefreshCw } from '../components/icons/Icons';
import { Workspace, WorkspaceVisibility } from '../types';
import { cn } from '../utils';

interface LandingPageProps {
  workspaces: Workspace[];
  onSelectWorkspace: (id: string) => void;
  onCreateWorkspace: (name: string, visibility: WorkspaceVisibility) => void;
  onDemoReset?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ workspaces, onSelectWorkspace, onCreateWorkspace, onDemoReset }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newVisibility, setNewVisibility] = useState<WorkspaceVisibility>('private');

  const handleCreate = () => {
      if (!newWorkspaceName) return;
      onCreateWorkspace(newWorkspaceName, newVisibility);
      setIsCreateModalOpen(false);
      setNewWorkspaceName('');
      setNewVisibility('private');
  };

  const getVisibilityIcon = (v: WorkspaceVisibility) => {
      switch(v) {
          case 'private': return <Lock size={12}/>;
          case 'protected': return <Eye size={12}/>;
          case 'public': return <Globe size={12}/>;
      }
  };

  const isEmptyState = workspaces.length === 0;

  return (
    <PageLayout hideHeader> 
      <div className="absolute top-4 right-6 z-30">
          {onDemoReset && (
              <Button variant="ghost" size="sm" onClick={onDemoReset} className="text-slate-400 hover:text-slate-600">
                  <RefreshCw size={14}/>
              </Button>
          )}
      </div>
      
      {isEmptyState ? (
          // --- EMPTY STATE (First-Time User) ---
          <div className="animate-fadeIn max-w-4xl mx-auto mt-6">
              <div className="text-center space-y-6 py-12">
                  <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white mb-6">
                      <Network size={40} />
                  </div>
                  <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Welcome to Atlas</h1>
                  <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                      Atlas is your unified operating system for organizational knowledge.
                      <br/>Break down silos, govern data, and generate insights.
                  </p>
                  <div className="pt-4">
                      <Button size="lg" onClick={() => setIsCreateModalOpen(true)} leftIcon={<Plus size={18} />} className="shadow-xl shadow-blue-500/20 px-8">
                          Initialize First Workspace
                      </Button>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center space-y-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                          <Database size={24} />
                      </div>
                      <div>
                          <h3 className="font-bold text-slate-900">1. Ingest</h3>
                          <p className="text-sm text-slate-500 mt-2">Connect Google Drive, Slack, and Wikis to build your graph.</p>
                      </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center space-y-4">
                      <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
                          <Layers size={24} />
                      </div>
                      <div>
                          <h3 className="font-bold text-slate-900">2. Structure</h3>
                          <p className="text-sm text-slate-500 mt-2">Define your ontology. Atlas maps entities and relationships automatically.</p>
                      </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center space-y-4">
                      <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                          <ShieldCheck size={24} />
                      </div>
                      <div>
                          <h3 className="font-bold text-slate-900">3. Govern</h3>
                          <p className="text-sm text-slate-500 mt-2">Monitor knowledge health, resolve conflicts, and track decisions.</p>
                      </div>
                  </div>
              </div>
          </div>
      ) : (
          // --- DASHBOARD STATE (Returning User) ---
          <div className="mt-6">
            {/* Welcome / Stats Header */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
                        You are managing <span className="font-semibold text-slate-900">{workspaces.length} active workspaces</span>.
                        <br/>System health is at 94% across all knowledge domains.
                    </p>
                    <Button onClick={() => setIsCreateModalOpen(true)} leftIcon={<Plus size={16}/>} className="mt-2">
                        Create New Workspace
                    </Button>
                </div>
                
                {/* Aggregated Stats */}
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 w-36 text-center">
                        <div className="text-2xl font-bold text-slate-900">{workspaces.reduce((acc, w) => acc + w.memberCount, 0)}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">Total Members</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl border border-green-100 w-36 text-center">
                        <div className="text-2xl font-bold text-green-600">94%</div>
                        <div className="text-[10px] text-green-800/70 font-bold uppercase mt-1">Avg Health</div>
                    </div>
                </div>
            </div>

            {/* Workspaces Grid */}
            <div className="mt-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    Your Workspaces
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {workspaces.map(ws => (
                        <div 
                            key={ws.id}
                            onClick={() => onSelectWorkspace(ws.id)}
                            className="group bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden"
                        >
                            {/* Top Bar */}
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm",
                                    "bg-gradient-to-br from-slate-700 to-slate-900"
                                )}>
                                    {ws.name.charAt(0)}
                                </div>
                                <Badge status="neutral" className="flex items-center gap-1 capitalize">
                                    {getVisibilityIcon(ws.visibility)} {ws.visibility}
                                </Badge>
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{ws.name}</h3>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{ws.description}</p>

                            {/* Metrics Footer */}
                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1"><Users size={12}/> {ws.memberCount}</span>
                                    <span className="flex items-center gap-1"><Activity size={12}/> {ws.health}% Health</span>
                                </div>
                                <span className="text-slate-400">
                                    {new Date(ws.lastActive).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Create New Card (Visual) */}
                    <div 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="rounded-xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 transition-all cursor-pointer min-h-[200px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                            <Plus size={24} />
                        </div>
                        <span className="font-medium">Create New Workspace</span>
                    </div>

                </div>
            </div>
          </div>
      )}

      {/* Create Workspace Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Workspace"
        footer={
            <div className="flex justify-end gap-2 w-full">
                <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Create Workspace</Button>
            </div>
        }
      >
          <div className="space-y-4">
              <Input 
                label="Workspace Name" 
                placeholder="e.g. Engineering, Q3 Launch, Compliance" 
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                autoFocus
              />
              
              <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Visibility</label>
                  <div className="grid grid-cols-1 gap-2">
                      {['private', 'protected', 'public'].map((vis) => (
                          <button
                            key={vis}
                            onClick={() => setNewVisibility(vis as WorkspaceVisibility)}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                                newVisibility === vis ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-slate-200 hover:border-slate-300"
                            )}
                          >
                              <div className={cn(
                                  "w-8 h-8 rounded flex items-center justify-center shrink-0",
                                  newVisibility === vis ? "bg-white text-blue-600 shadow-sm" : "bg-slate-100 text-slate-500"
                              )}>
                                  {getVisibilityIcon(vis as WorkspaceVisibility)}
                              </div>
                              <div>
                                  <div className="text-sm font-medium text-slate-900 capitalize">{vis}</div>
                                  <div className="text-xs text-slate-500">
                                      {vis === 'private' && "Only invited members can access."}
                                      {vis === 'protected' && "Visible to organization, access by request."}
                                      {vis === 'public' && "Open to everyone in the organization."}
                                  </div>
                              </div>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      </Modal>

    </PageLayout>
  );
};
