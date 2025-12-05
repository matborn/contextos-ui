
import React, { useState } from 'react';
import { Project, Workspace } from '../../types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { Button } from '../ui/Button';
import { Database, ShieldCheck, Users, Settings, Check, LayoutTemplate, Zap, Network, FileText, MessageSquare } from '../icons/Icons';
import { cn } from '../../utils';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project; // If undefined, we are creating a new project
  availableWorkspaces: Workspace[];
  onSave: (projectData: Partial<Project>) => void;
}

type Tab = 'general' | 'knowledge' | 'modules' | 'permissions';

export const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  project, 
  availableWorkspaces,
  onSave 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  
  // Form State
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [primaryWorkspaceId, setPrimaryWorkspaceId] = useState(project?.primaryAtlasWorkspaceId || availableWorkspaces[0]?.id || '');
  const [secondaryWorkspaceIds, setSecondaryWorkspaceIds] = useState<string[]>(project?.secondaryAtlasWorkspaceIds || []);
  const [colorTheme, setColorTheme] = useState(project?.colorTheme || 'blue');

  const handleSave = () => {
    onSave({
      ...(project || {}),
      name,
      description,
      primaryAtlasWorkspaceId: primaryWorkspaceId,
      secondaryAtlasWorkspaceIds: secondaryWorkspaceIds,
      colorTheme,
    });
    onClose();
  };

  const toggleSecondaryWorkspace = (id: string) => {
    if (secondaryWorkspaceIds.includes(id)) {
      setSecondaryWorkspaceIds(prev => prev.filter(wId => wId !== id));
    } else {
      setSecondaryWorkspaceIds(prev => [...prev, id]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? `Edit Project: ${project.name}` : "Create New Project"}
      footer={
        <div className="flex justify-end gap-2 w-full">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{project ? 'Save Changes' : 'Create Project'}</Button>
        </div>
      }
    >
      <div className="flex flex-col h-[500px]">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6 space-x-6 overflow-x-auto no-scrollbar shrink-0">
          <button 
            onClick={() => setActiveTab('general')}
            className={cn("pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'general' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
          >
            General
          </button>
          <button 
            onClick={() => setActiveTab('knowledge')}
            className={cn("pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'knowledge' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
          >
            Knowledge Context
          </button>
          <button 
            onClick={() => setActiveTab('modules')}
            className={cn("pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'modules' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
          >
            Module Rules
          </button>
          <button 
            onClick={() => setActiveTab('permissions')}
            className={cn("pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'permissions' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
          >
            Permissions
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-2">
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <Input 
                label="Project Name" 
                placeholder="e.g. Project Titan" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this project about?"
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Color Theme</label>
                <div className="flex gap-3">
                  {['blue', 'purple', 'green', 'orange', 'red', 'slate'].map(c => (
                    <button
                      key={c}
                      onClick={() => setColorTheme(c)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center relative",
                        colorTheme === c ? "border-slate-600 scale-110" : "border-transparent hover:scale-105"
                      )}
                    >
                      <div className={cn(
                          "w-6 h-6 rounded-full", 
                          c === 'blue' ? "bg-blue-500" :
                          c === 'purple' ? "bg-purple-500" :
                          c === 'green' ? "bg-green-500" :
                          c === 'orange' ? "bg-orange-500" :
                          c === 'red' ? "bg-red-500" : "bg-slate-500"
                      )}></div>
                      {colorTheme === c && <Check size={12} className="text-white absolute"/>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* KNOWLEDGE TAB */}
          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                <Database className="text-blue-600 shrink-0" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-blue-900">Knowledge Context</h4>
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                    Select the <strong>Atlas Workspace</strong> that serves as the "Brain" for this project. 
                    AI agents across Scriptor, Muse, and Forge will use facts from this workspace.
                  </p>
                </div>
              </div>

              <Select
                label="Primary Atlas Workspace"
                value={primaryWorkspaceId}
                onChange={(e) => setPrimaryWorkspaceId(e.target.value)}
                helperText="Defines the canonical truth for this project."
                placeholder="Select a workspace..."
                options={availableWorkspaces.map((ws) => ({
                  value: ws.id,
                  label: `${ws.name} (Health: ${ws.health ?? '—'}${typeof ws.health === 'number' ? '%' : ''})`,
                }))}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Additional Context (Optional)</label>
                <div className="space-y-2 border border-slate-200 rounded-lg p-2 max-h-32 overflow-y-auto">
                  {availableWorkspaces.filter(ws => ws.id !== primaryWorkspaceId).map(ws => (
                    <Checkbox
                      key={ws.id}
                      label={ws.name}
                      checked={secondaryWorkspaceIds.includes(ws.id)}
                      onChange={() => toggleSecondaryWorkspace(ws.id)}
                    />
                  ))}
                  {availableWorkspaces.filter(ws => ws.id !== primaryWorkspaceId).length === 0 && (
                    <p className="text-xs text-slate-400 p-2">No other workspaces available.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MODULES TAB */}
          {activeTab === 'modules' && (
            <div className="space-y-6">
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enabled Modules</h4>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded"><FileText size={16}/></div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">Scriptor</div>
                                    <div className="text-xs text-slate-500">AI Documents</div>
                                </div>
                            </div>
                            <Checkbox label="Enabled" checked disabled />
                        </div>
                        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-sky-50 text-sky-600 rounded"><MessageSquare size={16}/></div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">Muse</div>
                                    <div className="text-xs text-slate-500">Brainstorming</div>
                                </div>
                            </div>
                            <Checkbox label="Enabled" checked disabled />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Governance Rules</h4>
                    
                    <Checkbox
                      label="Enforce Atlas Validation"
                      description="AI must cite facts from the Primary Workspace."
                      defaultChecked
                      className="p-3 border border-slate-200 rounded-lg bg-white"
                    />
                    <Checkbox
                      label="Require Peer Review"
                      description="Documents cannot be approved without human review."
                      defaultChecked
                      className="p-3 border border-slate-200 rounded-lg bg-white"
                    />
                </div>
            </div>
          )}

          {/* PERMISSIONS TAB */}
          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-slate-700">Team Members</h4>
                <Button size="sm" variant="secondary" leftIcon={<Users size={14}/>}>Add Member</Button>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
                {/* Mock List */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">You</div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Alex Johnson</div>
                      <div className="text-xs text-slate-500">Project Owner</div>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">Admin</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">SC</div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Sarah Chen</div>
                      <div className="text-xs text-slate-500">Editor</div>
                    </div>
                  </div>
                  <button className="text-xs text-blue-600 hover:underline">Edit</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </Modal>
  );
};
