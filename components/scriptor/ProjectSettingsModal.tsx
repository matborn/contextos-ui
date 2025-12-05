
import React, { useState } from 'react';
import { Project, Workspace } from '../../types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Database, ShieldCheck, Users, Settings, Check, LayoutTemplate } from '../icons/Icons';
import { cn } from '../../utils';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project; // If undefined, we are creating a new project
  availableWorkspaces: Workspace[];
  onSave: (projectData: Partial<Project>) => void;
}

type Tab = 'general' | 'knowledge' | 'permissions' | 'rules';

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
      <div className="flex flex-col h-[450px]">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6 space-x-6">
          <button 
            onClick={() => setActiveTab('general')}
            className={cn("pb-2 text-sm font-medium border-b-2 transition-colors", activeTab === 'general' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
          >
            General
          </button>
          <button 
            onClick={() => setActiveTab('knowledge')}
            className={cn("pb-2 text-sm font-medium border-b-2 transition-colors", activeTab === 'knowledge' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
          >
            Knowledge Context
          </button>
          <button 
            onClick={() => setActiveTab('permissions')}
            className={cn("pb-2 text-sm font-medium border-b-2 transition-colors", activeTab === 'permissions' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
          >
            Permissions
          </button>
          <button 
            onClick={() => setActiveTab('rules')}
            className={cn("pb-2 text-sm font-medium border-b-2 transition-colors", activeTab === 'rules' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
          >
            Rules & Governance
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
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea 
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm min-h-[80px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this project about?"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Color Theme</label>
                <div className="flex gap-3">
                  {['blue', 'purple', 'green', 'orange', 'red', 'slate'].map(c => (
                    <button
                      key={c}
                      onClick={() => setColorTheme(c)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center",
                        colorTheme === c ? "border-slate-600 scale-110" : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: `var(--color-${c}-500)` }} // Simplified mock for colors, relying on Tailwind classes in real implementation
                    >
                      {/* Detailed implementation would map color names to tailwind classes */}
                      <div className={cn("w-6 h-6 rounded-full", `bg-${c}-500`)}></div>
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
                    AI agents will use facts, decisions, and risks from this workspace to validate your documents.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Primary Atlas Workspace</label>
                <select 
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                  value={primaryWorkspaceId}
                  onChange={(e) => setPrimaryWorkspaceId(e.target.value)}
                >
                  <option value="" disabled>Select a workspace...</option>
                  {availableWorkspaces.map(ws => (
                    <option key={ws.id} value={ws.id}>{ws.name} (Health: {ws.health ?? '—'}{typeof ws.health === 'number' ? '%' : ''})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Additional Context (Optional)</label>
                <div className="space-y-2 border border-slate-200 rounded-lg p-2 max-h-32 overflow-y-auto">
                  {availableWorkspaces.filter(ws => ws.id !== primaryWorkspaceId).map(ws => (
                    <label key={ws.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={secondaryWorkspaceIds.includes(ws.id)}
                        onChange={() => toggleSecondaryWorkspace(ws.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">{ws.name}</span>
                    </label>
                  ))}
                  {availableWorkspaces.filter(ws => ws.id !== primaryWorkspaceId).length === 0 && (
                    <p className="text-xs text-slate-400 p-2">No other workspaces available.</p>
                  )}
                </div>
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

          {/* RULES TAB */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-slate-500"/>
                  Governance & Compliance
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Rules defined here are enforced by Scriptor AI agents across all documents in this project.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg">
                  <input type="checkbox" defaultChecked className="mt-1" />
                  <div>
                    <h5 className="text-sm font-medium text-slate-900">Require Peer Review</h5>
                    <p className="text-xs text-slate-500">Documents cannot be marked "Approved" without at least one human review.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg">
                  <input type="checkbox" defaultChecked className="mt-1" />
                  <div>
                    <h5 className="text-sm font-medium text-slate-900">Enforce Knowledge Check</h5>
                    <p className="text-xs text-slate-500">AI must verify key claims against the Primary Atlas Workspace before publishing.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg">
                  <input type="checkbox" className="mt-1" />
                  <div>
                    <h5 className="text-sm font-medium text-slate-900">Strict Template Adherence</h5>
                    <p className="text-xs text-slate-500">Users cannot delete mandatory sections from Project Templates.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </Modal>
  );
};
