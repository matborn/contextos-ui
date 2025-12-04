
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Connectors } from '../components/ui/Connectors';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { PageLayout } from '../components/ui/PageLayout';
import { TabBar, TabItem } from '../components/ui/TabBar';
import { Workspace } from '../types';
import { 
    Bell, 
    Database, 
    LayoutTemplate, 
    Plus, 
    Bot, 
    Users,
    ShieldCheck,
    Wand2,
    ListChecks,
    Zap,
    Target,
    HelpCircle,
    Lock,
    Globe,
    Eye
} from '../components/icons/Icons';
import { fetchDataSources, generateValidationRule, fetchElicitationMethods } from '../services/geminiService';
import { useToast } from '../components/ui/Toast';
import { cn } from '../utils';
import { ValidationRule, ElicitationMethod } from '../types';

type SettingsTab = 'general' | 'workspace_privacy' | 'integrations' | 'notifications' | 'members' | 'templates';

// Predefined Rules Library
const PREDEFINED_RULES: ValidationRule[] = [
    { id: 'pr-1', label: 'Tone Check', type: 'ai', severity: 'warning', description: 'Ensure professional, objective tone.', isActive: true },
    { id: 'pr-2', label: 'PII Detection', type: 'ai', severity: 'blocking', description: 'Detect emails, phone numbers, or SSNs.', isActive: true },
    { id: 'pr-3', label: 'Security Review', type: 'manual', severity: 'blocking', description: 'Must be approved by InfoSec team member.', isActive: true },
    { id: 'pr-4', label: 'Spelling & Grammar', type: 'ai', severity: 'warning', description: 'Standard language validation.', isActive: true },
    { id: 'pr-5', label: 'Legal Sign-off', type: 'manual', severity: 'blocking', description: 'Required for external-facing docs.', isActive: true },
];

interface SettingsProps {
    workspace?: Workspace | null;
}

export const Settings: React.FC<SettingsProps> = ({ workspace }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [dataSources, setDataSources] = React.useState<any[]>([]);
  const { showToast } = useToast();

  // Template Editor State
  const [configView, setConfigView] = useState<'templates' | 'ideation'>('templates');
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [elicitationMethods, setElicitationMethods] = useState<ElicitationMethod[]>([]);
  
  const [templateRules, setTemplateRules] = useState<ValidationRule[]>([
      { id: 'r1', label: 'Tone & Complexity', type: 'ai', severity: 'warning', description: 'Ensure content is readable by non-technical stakeholders.', isActive: true },
      { id: 'r2', label: 'Security Team Approval', type: 'manual', severity: 'blocking', description: 'Required for any architecture changes.', isActive: true }
  ]);
  
  // Rule Builder State
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [rulePrompt, setRulePrompt] = useState('');
  const [isGeneratingRule, setIsGeneratingRule] = useState(false);

  React.useEffect(() => {
    fetchDataSources().then(setDataSources);
    fetchElicitationMethods().then(setElicitationMethods);
  }, []);

  const handleGenerateRule = async () => {
      if (!rulePrompt) return;
      setIsGeneratingRule(true);
      try {
          const newRule = await generateValidationRule(rulePrompt);
          setTemplateRules(prev => [...prev, newRule]);
          setIsRuleModalOpen(false);
          setRulePrompt('');
          showToast('New AI Rule Created', { type: 'success' });
      } catch (error) {
          showToast('Failed to generate rule', { type: 'error' });
      } finally {
          setIsGeneratingRule(false);
      }
  };

  const handleAddPredefined = (rule: ValidationRule) => {
      setTemplateRules(prev => [...prev, { ...rule, id: `new-${Date.now()}` }]);
      setIsRuleModalOpen(false);
      showToast('Rule Added', { type: 'success' });
  };

  const handleDeleteRule = (id: string) => {
      setTemplateRules(prev => prev.filter(r => r.id !== id));
      showToast('Rule Removed', { type: 'info' });
  };

  // If editing template, we take over the whole view, otherwise standard settings page
  if (editingTemplate) {
      return (
        <PageLayout 
            title={editingTemplate} 
            description="Edit structure and validation policies."
            onBack={() => setEditingTemplate(null)}
        >
            <Button variant="secondary" onClick={() => setEditingTemplate(null)}>Cancel</Button>
            <Button onClick={() => { setEditingTemplate(null); showToast('Template updated', {type: 'success'}); }}>Save Template</Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left: Structure Editor (Simplified) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">Document Structure</h3>
                        <button className="text-xs text-primary-600 font-medium hover:underline">+ Add Section</button>
                    </div>
                    <div className="space-y-2">
                        {['Title & Metadata', 'Overview', 'Goals & Non-Goals', 'Risks', 'Architecture', 'Rollout Plan'].map((sec, i) => (
                            <div key={i} className="p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 flex items-center justify-between group">
                                <span>{sec}</span>
                                <div className="opacity-0 group-hover:opacity-100 text-slate-400 cursor-grab">:::</div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Template Context</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            This template is used for all Tier-1 engineering changes. It enforces a "Risks" section to ensure compliance with SOC2.
                        </p>
                    </div>
                </div>

                {/* Right: Policy & Validation Engine */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Policies & Checklist</h3>
                            <p className="text-xs text-slate-500 mt-1">Define what makes a document "Complete".</p>
                        </div>
                        <Button size="sm" onClick={() => setIsRuleModalOpen(true)} leftIcon={<Plus size={16}/>}>Add Rule</Button>
                    </div>

                    <div className="space-y-4">
                        {templateRules.map(rule => (
                            <div key={rule.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-4 hover:shadow-sm transition-shadow">
                                {/* Icon Indicator */}
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                    rule.type === 'ai' ? "bg-brand-ai-50 text-brand-ai-600" : "bg-orange-50 text-orange-600"
                                )}>
                                    {rule.type === 'ai' ? <Bot size={20}/> : <Users size={20}/>}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-semibold text-slate-900">{rule.label}</h4>
                                        <Badge status={rule.type === 'ai' ? 'info' : 'warning'} className="px-1.5 py-0 text-[10px]">
                                            {rule.type === 'ai' ? 'AI Automated' : 'Manual Check'}
                                        </Badge>
                                        {rule.severity === 'blocking' && (
                                            <Badge status="error" className="px-1.5 py-0 text-[10px]">Blocking</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{rule.description}</p>
                                </div>

                                {/* Actions */}
                                <button 
                                    onClick={() => handleDeleteRule(rule.id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {templateRules.length === 0 && (
                            <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl">
                                <ShieldCheck className="mx-auto text-slate-300 mb-2" size={32} />
                                <p className="text-slate-500 text-sm">No validation rules defined yet.</p>
                                <button onClick={() => setIsRuleModalOpen(true)} className="text-primary-600 text-sm font-medium hover:underline mt-1">Add your first rule</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Modals reused */}
            <AddRuleModal 
                isOpen={isRuleModalOpen} 
                onClose={() => setIsRuleModalOpen(false)} 
                onAdd={handleAddPredefined} 
                onGenerate={handleGenerateRule}
                isGenerating={isGeneratingRule}
                rulePrompt={rulePrompt}
                setRulePrompt={setRulePrompt}
            />
        </PageLayout>
      );
  }

  const navItems: TabItem[] = [
    { id: 'general', label: 'General' },
    { id: 'workspace_privacy', label: 'Visibility & Access' },
    { id: 'templates', label: 'Configuration Studio' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'members', label: 'Members' }
  ];

  return (
    <PageLayout 
        title="Workspace Settings" 
        description={workspace ? `Managing settings for ${workspace.name}` : ''}
        maxWidth="5xl"
        headerTabs={
            <TabBar 
                items={navItems}
                activeId={activeTab}
                onSelect={(id) => { setActiveTab(id as SettingsTab); setEditingTemplate(null); }}
            />
        }
    >
        <div className="space-y-6">
            
            {/* --- TEMPLATES / CONFIGURATION STUDIO --- */}
            {activeTab === 'templates' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Configuration Studio</h2>
                            <p className="text-sm text-slate-500">Manage templates and agent strategies.</p>
                        </div>
                    </div>

                    {/* Sub-Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
                        <button 
                            onClick={() => setConfigView('templates')}
                            className={cn(
                                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                                configView === 'templates' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            Document Templates
                        </button>
                        <button 
                            onClick={() => setConfigView('ideation')}
                            className={cn(
                                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                                configView === 'ideation' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            Ideation Strategies
                        </button>
                    </div>

                    {configView === 'templates' && (
                        <div className="grid grid-cols-1 gap-4 animate-fadeIn">
                            {['Technical RFC', 'Product Brief', 'Decision Record'].map((name, i) => (
                                <Card 
                                    key={i} 
                                    className="group hover:border-primary-300 transition-colors cursor-pointer"
                                    onClick={() => setEditingTemplate(name)}
                                >
                                    <div className="p-4 flex items-start gap-4">
                                        <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                                            <LayoutTemplate size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-slate-900">{name}</h3>
                                                <Badge status="success">Active</Badge>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1">Standard engineering template for architectural decisions.</p>
                                            
                                            {/* Sections Preview */}
                                            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                                                {['Overview', 'Goals', 'Risks', 'Architecture'].map(sec => (
                                                    <span key={sec} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 whitespace-nowrap">
                                                        {sec}
                                                    </span>
                                                ))}
                                                <span className="text-xs bg-slate-50 text-slate-400 px-2 py-1 rounded border border-dashed border-slate-200">+ Add Section</span>
                                            </div>
                                            
                                            {/* Validation Rules Summary */}
                                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                    <Bot size={12} className="text-brand-ai-500" />
                                                    <span>1 AI Check</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                    <Users size={12} className="text-orange-500" />
                                                    <span>1 Manual Approval</span>
                                                </div>
                                                <div className="ml-auto text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Configure →
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {configView === 'ideation' && (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="p-4 bg-brand-ai-50 border border-brand-ai-100 rounded-xl flex items-start gap-3">
                                <Zap className="text-brand-ai-600 shrink-0 mt-1" size={20} />
                                <div>
                                    <h3 className="text-sm font-bold text-brand-ai-900">Advanced Elicitation Methods</h3>
                                    <p className="text-xs text-brand-ai-700 mt-1">
                                        These strategies guide the AI Agent during the Wizard interview phase. 
                                        Enable or disable specific methods based on your team's needs.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {elicitationMethods.map((method) => (
                                    <div key={method.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                            {method.icon === 'Zap' && <Zap size={20} />}
                                            {method.icon === 'Target' && <Target size={20} />}
                                            {method.icon === 'HelpCircle' && <HelpCircle size={20} />}
                                            {method.icon === 'ShieldCheck' && <ShieldCheck size={20} />}
                                            {method.icon === 'MessageSquare' && <LayoutTemplate size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold text-slate-900">{method.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    {method.complexity === 'high' && <Badge status="neutral">Advanced</Badge>}
                                                    <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out bg-primary-600 rounded-full cursor-pointer border-2 border-transparent">
                                                        <span className="translate-x-4 inline-block w-5 h-5 bg-white rounded-full shadow transform transition duration-200 ease-in-out"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-500">{method.description}</p>
                                            <div className="mt-3 p-2 bg-slate-50 rounded text-xs font-mono text-slate-600 border border-slate-200 truncate">
                                                Prompt: {method.systemPrompt}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="secondary" className="border-dashed" leftIcon={<Plus size={16}/>}>Add Custom Strategy</Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- GENERAL SETTINGS --- */}
            {activeTab === 'general' && (
                <Card className="animate-fadeIn">
                    <CardHeader>
                        <CardTitle>Workspace Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input label="Workspace Name" defaultValue={workspace?.name || "Project Titan"} />
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-700">Description</label>
                            <textarea 
                                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-200 text-sm min-h-[100px]"
                                defaultValue={workspace?.description || "Global payment gateway integration and rollout strategy."}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                        <Button onClick={() => showToast('Settings Saved', { type: 'success' })}>Save Changes</Button>
                    </CardFooter>
                </Card>
            )}

            {/* --- WORKSPACE PRIVACY & VISIBILITY --- */}
            {activeTab === 'workspace_privacy' && (
                <div className="space-y-6 animate-fadeIn">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock size={18} className="text-slate-400"/>
                                Visibility & Access Control
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="text-sm text-slate-600 mb-4">
                                    Control who can see and join this workspace. This affects all knowledge and documents contained within.
                                </p>
                                
                                <div className="space-y-3">
                                    <label className={cn(
                                        "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                                        workspace?.visibility === 'private' ? "bg-blue-50 border-blue-200 ring-1 ring-blue-200" : "bg-white border-slate-200 hover:border-slate-300"
                                    )}>
                                        <input type="radio" name="vis" defaultChecked={workspace?.visibility === 'private'} className="mt-1" />
                                        <div>
                                            <div className="flex items-center gap-2 font-semibold text-slate-900">
                                                <Lock size={16} /> Private
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Only invited members can access. Not visible in the organization directory.
                                            </p>
                                        </div>
                                    </label>

                                    <label className={cn(
                                        "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                                        workspace?.visibility === 'protected' ? "bg-blue-50 border-blue-200 ring-1 ring-blue-200" : "bg-white border-slate-200 hover:border-slate-300"
                                    )}>
                                        <input type="radio" name="vis" defaultChecked={workspace?.visibility === 'protected'} className="mt-1" />
                                        <div>
                                            <div className="flex items-center gap-2 font-semibold text-slate-900">
                                                <Eye size={16} /> Protected
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Visible to the organization. Access must be requested and approved.
                                            </p>
                                        </div>
                                    </label>

                                    <label className={cn(
                                        "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                                        workspace?.visibility === 'public' ? "bg-blue-50 border-blue-200 ring-1 ring-blue-200" : "bg-white border-slate-200 hover:border-slate-300"
                                    )}>
                                        <input type="radio" name="vis" defaultChecked={workspace?.visibility === 'public'} className="mt-1" />
                                        <div>
                                            <div className="flex items-center gap-2 font-semibold text-slate-900">
                                                <Globe size={16} /> Public (Internal)
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Open to everyone in your organization to join and view.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100"></div>

                            <div>
                                <h4 className="font-semibold text-slate-900 mb-2">Knowledge Sharing</h4>
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">Allow Global Search</p>
                                        <p className="text-xs text-slate-500">Allow validated facts from this workspace to appear in global Atlas queries.</p>
                                    </div>
                                    <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out bg-primary-600 rounded-full cursor-pointer border-2 border-transparent">
                                        <span className="translate-x-4 inline-block w-5 h-5 bg-white rounded-full shadow transform transition duration-200 ease-in-out"></span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end">
                            <Button onClick={() => showToast('Visibility settings updated', { type: 'success' })}>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </div>
            )}

            {/* --- INTEGRATIONS --- */}
            {activeTab === 'integrations' && (
                <Card className="animate-fadeIn">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database size={18} className="text-slate-400"/>
                            Active Data Sources
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-500 mb-4">ContextOS is currently syncing with the following sources to build your knowledge base.</p>
                        <Connectors 
                            dataSources={dataSources} 
                            onAddSource={() => showToast('Opening integration wizard...', { type: 'info' })} 
                        />
                    </CardContent>
                </Card>
            )}

            {/* --- NOTIFICATIONS --- */}
            {activeTab === 'notifications' && (
                <Card className="animate-fadeIn">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell size={18} className="text-slate-400"/>
                            Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-slate-900">Knowledge Conflicts</h4>
                                <p className="text-xs text-slate-500">Alert me when new docs contradict established facts.</p>
                            </div>
                            <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out bg-primary-600 rounded-full cursor-pointer border-2 border-transparent">
                                <span className="translate-x-4 inline-block w-5 h-5 bg-white rounded-full shadow transform transition duration-200 ease-in-out"></span>
                            </div>
                        </div>
                        <div className="h-px bg-slate-100"></div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-slate-900">Weekly Digest</h4>
                                <p className="text-xs text-slate-500">Summary of new risks and decisions.</p>
                            </div>
                            <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out bg-slate-200 rounded-full cursor-pointer border-2 border-transparent">
                                <span className="translate-x-0 inline-block w-5 h-5 bg-white rounded-full shadow transform transition duration-200 ease-in-out"></span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

                {/* --- MEMBERS --- */}
                {activeTab === 'members' && (
                <Card className="animate-fadeIn">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users size={18} className="text-slate-400"/>
                            Team Access
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500 text-sm">Please manage team members in the "Team" tab on the main dashboard.</p>
                        <Button className="mt-4" variant="secondary" onClick={() => showToast('Redirecting...', { type: 'info' })}>Go to Team Management</Button>
                    </CardContent>
                </Card>
            )}

        </div>

        <AddRuleModal 
            isOpen={isRuleModalOpen} 
            onClose={() => setIsRuleModalOpen(false)} 
            onAdd={handleAddPredefined} 
            onGenerate={handleGenerateRule}
            isGenerating={isGeneratingRule}
            rulePrompt={rulePrompt}
            setRulePrompt={setRulePrompt}
        />
    </PageLayout>
  );
};

// Extracted Modal for cleanliness
const AddRuleModal = ({ isOpen, onClose, onAdd, onGenerate, isGenerating, rulePrompt, setRulePrompt }: any) => (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Add Validation Rule"
    >
        <div className="space-y-6">
            
            {/* AI Generator */}
            <div className="bg-brand-ai-50 p-4 rounded-xl border border-brand-ai-100">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-white text-brand-ai-600 flex items-center justify-center shadow-sm">
                        <Wand2 size={16} />
                    </div>
                    <h3 className="font-semibold text-brand-ai-900 text-sm">Create with AI</h3>
                </div>
                <div className="space-y-3">
                    <p className="text-xs text-brand-ai-800">Describe what you want to check, and I'll configure the rule for you.</p>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="e.g. Ensure no competitor names are mentioned..." 
                            className="bg-white border-brand-ai-200 focus:border-brand-ai-400 focus:ring-brand-ai-200"
                            value={rulePrompt}
                            onChange={(e) => setRulePrompt(e.target.value)}
                        />
                        <Button 
                            onClick={onGenerate} 
                            isLoading={isGenerating}
                            className="bg-brand-ai-600 hover:bg-brand-ai-700 shrink-0"
                        >
                            Generate
                        </Button>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-xs text-slate-500 uppercase tracking-wider">Or select from library</span>
                </div>
            </div>

            {/* Library List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {PREDEFINED_RULES.map(rule => (
                    <div 
                        key={rule.id}
                        onClick={() => onAdd(rule)}
                        className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-primary-400 hover:bg-primary-50 cursor-pointer group transition-all"
                    >
                        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 bg-brand-ai-100 text-brand-ai-600">
                            {rule.type === 'ai' ? <Bot size={16}/> : <ListChecks size={16}/>}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-slate-900">{rule.label}</h4>
                            <p className="text-xs text-slate-500 truncate">{rule.description}</p>
                        </div>
                        <Plus size={16} className="text-slate-300 group-hover:text-primary-500" />
                    </div>
                ))}
            </div>

        </div>
    </Modal>
);
