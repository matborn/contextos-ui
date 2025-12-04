
import React, { useState } from 'react';
import { PageLayout } from '../../components/ui/PageLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { SlideOver } from '../../components/ui/SlideOver';
import { Modal } from '../../components/ui/Modal';
import { 
    Search, Filter, Plus, LayoutTemplate, 
    FileText, ShieldCheck, Zap, Database, 
    GitMerge, Target, MessageSquare, Code,
    CheckCircle, Bot, Star, Eye, Users, FilePen, Sparkles, ArrowRight
} from '../../components/icons/Icons';
import { cn } from '../../utils';
import { useToast } from '../../components/ui/Toast';
import { Project } from '../../types';

interface SectionDef {
    title: string;
    description: string;
    isOptional?: boolean;
}

interface GovernanceDef {
    approvers: string[];
    electronicSignature: boolean;
    aiChecks: string[];
}

interface Template {
    id: string;
    title: string;
    description: string;
    category: 'Engineering' | 'Product' | 'Strategy' | 'General' | 'Legal';
    icon: React.ReactNode;
    color: string;
    aiRulesCount: number;
    usageCount: number;
    isVerified?: boolean;
    isPopular?: boolean;
    // Detailed Config
    sections: SectionDef[];
    governance: GovernanceDef;
}

const MOCK_TEMPLATES: Template[] = [
    { 
        id: 't1', 
        title: 'Technical Specification', 
        description: 'Standard engineering RFC format with "Context", "Proposed Solution", and "Risks".', 
        category: 'Engineering',
        icon: <Code size={24}/>,
        color: 'bg-blue-100 text-blue-600',
        aiRulesCount: 3,
        usageCount: 1240,
        isVerified: true,
        isPopular: true,
        sections: [
            { title: 'Context & Problem', description: 'Why are we doing this? Link to Product Requirement.' },
            { title: 'Proposed Solution', description: 'Technical architecture, data models, and API changes.' },
            { title: 'Alternative Approaches', description: 'What else did we consider and why was it rejected?', isOptional: true },
            { title: 'Risks & Mitigations', description: 'Security, scalability, and operational risks.' },
            { title: 'Rollout Plan', description: 'Phased deployment strategy and feature flags.' }
        ],
        governance: {
            approvers: ['Engineering Lead', 'Security Team'],
            electronicSignature: false,
            aiChecks: ['Architecture Decision Linkage', 'Security Risk Detection', 'Database Schema Validation']
        }
    },
    { 
        id: 't2', 
        title: 'Product Requirements (PRD)', 
        description: 'Define problem, scope, and success metrics for new features. Includes user stories structure.', 
        category: 'Product',
        icon: <Target size={24}/>,
        color: 'bg-purple-100 text-purple-600',
        aiRulesCount: 5,
        usageCount: 856,
        isVerified: true,
        isPopular: true,
        sections: [
            { title: 'Executive Summary', description: 'High-level overview for stakeholders.' },
            { title: 'User Stories', description: 'As a [user], I want [feature] so that [benefit].' },
            { title: 'Success Metrics', description: 'KPIs and OKRs tracked.' },
            { title: 'Design & UX', description: 'Links to Figma and interaction flows.' }
        ],
        governance: {
            approvers: ['Product Director', 'Engineering Lead'],
            electronicSignature: false,
            aiChecks: ['Ambiguity Detection', 'Completeness Check', 'Customer Persona Alignment']
        }
    },
    { 
        id: 't3', 
        title: 'Architecture Decision Record', 
        description: 'Log important structural decisions and their consequences (ADR).', 
        category: 'Engineering',
        icon: <GitMerge size={24}/>,
        color: 'bg-orange-100 text-orange-600',
        aiRulesCount: 2,
        usageCount: 432,
        sections: [
            { title: 'Decision Context', description: 'The issue motivating this decision.' },
            { title: 'Decision', description: 'The change that we are proposing or have agreed to.' },
            { title: 'Consequences', description: 'Positive and negative impact of this decision.' }
        ],
        governance: {
            approvers: ['Principal Architect'],
            electronicSignature: false,
            aiChecks: ['Tech Radar Compliance', 'Legacy Impact Analysis']
        }
    },
    { 
        id: 't4', 
        title: 'Strategy Memo', 
        description: 'Six-page narrative structure for strategic proposals and vision setting.', 
        category: 'Strategy',
        icon: <Zap size={24}/>,
        color: 'bg-green-100 text-green-600',
        aiRulesCount: 4,
        usageCount: 210,
        isVerified: true,
        sections: [
            { title: 'Introduction', description: 'The hook and the summary.' },
            { title: 'Strategic Context', description: 'Market analysis and competitive landscape.' },
            { title: 'The Opportunity', description: 'What we can capture.' },
            { title: 'Execution Strategy', description: 'How we get there.' }
        ],
        governance: {
            approvers: ['Executive Team'],
            electronicSignature: false,
            aiChecks: ['Tone & Clarity', 'Strategic Alignment', 'Data Fact Checking']
        }
    },
    { 
        id: 't5', 
        title: 'Legal Contract (MSA)', 
        description: 'Master Services Agreement with standard liability clauses and definitions.', 
        category: 'Legal',
        icon: <ShieldCheck size={24}/>,
        color: 'bg-slate-100 text-slate-600',
        aiRulesCount: 8,
        usageCount: 56,
        sections: [
            { title: 'Definitions', description: 'Key terms and entities.' },
            { title: 'Services & Scope', description: 'What is being delivered.' },
            { title: 'Liability & Indemnity', description: 'Standard clauses.' },
            { title: 'Termination', description: 'Exit clauses.' }
        ],
        governance: {
            approvers: ['General Counsel', 'CFO'],
            electronicSignature: true,
            aiChecks: ['Clause Deviation Detection', 'Risk Exposure Analysis', 'PII Protection']
        }
    },
    { 
        id: 't6', 
        title: 'Weekly Team Update', 
        description: 'Status reporting on goals, blockers, and wins for the week.', 
        category: 'General',
        icon: <MessageSquare size={24}/>,
        color: 'bg-pink-100 text-pink-600',
        aiRulesCount: 0,
        usageCount: 3400,
        isPopular: true,
        sections: [
            { title: 'Wins', description: 'What went well?' },
            { title: 'Blockers', description: 'What needs help?' },
            { title: 'Next Week', description: 'Priorities for upcoming sprint.' }
        ],
        governance: {
            approvers: [],
            electronicSignature: false,
            aiChecks: []
        }
    },
    { 
        id: 't7', 
        title: 'Post-Mortem / Incident Report', 
        description: 'Root cause analysis template with timeline and remediation steps.', 
        category: 'Engineering',
        icon: <Database size={24}/>,
        color: 'bg-red-100 text-red-600',
        aiRulesCount: 3,
        usageCount: 180,
        sections: [
            { title: 'Incident Summary', description: 'Impact, duration, and severity.' },
            { title: 'Timeline', description: 'Minute-by-minute breakdown.' },
            { title: 'Root Cause (5 Whys)', description: 'Deep analysis of failure.' },
            { title: 'Remediation Items', description: 'Jira tickets to prevent recurrence.' }
        ],
        governance: {
            approvers: ['Engineering Director', 'SRE Lead'],
            electronicSignature: false,
            aiChecks: ['Blameless Language Check', 'Timeline Consistency']
        }
    },
    { 
        id: 't8', 
        title: 'Launch Plan', 
        description: 'Go-to-market checklist, marketing channels, and rollout phases.', 
        category: 'Product',
        icon: <LayoutTemplate size={24}/>,
        color: 'bg-teal-100 text-teal-600',
        aiRulesCount: 2,
        usageCount: 320,
        sections: [
            { title: 'Target Audience', description: 'Who are we selling to?' },
            { title: 'Marketing Channels', description: 'Email, Social, Ads.' },
            { title: 'Success Metrics', description: 'Conversion targets.' }
        ],
        governance: {
            approvers: ['Marketing Lead'],
            electronicSignature: false,
            aiChecks: ['Consistency with PRD']
        }
    }
];

interface ScriptorTemplatesProps {
    projects?: Project[];
    onCreateDoc?: (templateTitle: string, projectId: string) => void;
}

export const ScriptorTemplates: React.FC<ScriptorTemplatesProps> = ({ projects = [], onCreateDoc }) => {
    const { showToast } = useToast();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<string>('All');
    
    // Config Drawer State
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [templateToUse, setTemplateToUse] = useState<Template | null>(null);

    const categories = ['All', 'Engineering', 'Product', 'Strategy', 'Legal', 'General'];

    const filteredTemplates = MOCK_TEMPLATES.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filter === 'All' || t.category === filter;
        return matchesSearch && matchesCategory;
    });

    const handleUseTemplate = (template: Template) => {
        setTemplateToUse(template);
        setIsProjectModalOpen(true);
    };

    const handleProjectSelect = (projectId: string) => {
        if (templateToUse && onCreateDoc) {
            onCreateDoc(templateToUse.title, projectId);
            showToast(`Creating new "${templateToUse.title}"...`, { type: 'info' });
        }
        setIsProjectModalOpen(false);
        setTemplateToUse(null);
        setSelectedTemplate(null);
    };

    return (
        <PageLayout
            title="Document Templates"
            description="Standardize your team's documentation with AI-powered blueprints."
            headerActions={
                <Button leftIcon={<Plus size={16}/>} onClick={() => showToast('Create Template wizard opening...', {type: 'info'})}>
                    New Template
                </Button>
            }
        >
            <div className="space-y-8">
                
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 max-w-md">
                        <Input 
                            leftIcon={<Search size={16} />}
                            placeholder="Search templates..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="py-2.5"
                        />
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={cn(
                                    "px-3 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap border",
                                    filter === cat 
                                        ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map(template => {
                        const isSelected = selectedTemplate?.id === template.id;
                        return (
                            <div 
                                key={template.id}
                                className={cn(
                                    "group bg-white border rounded-xl p-5 transition-all flex flex-col h-full relative overflow-hidden",
                                    isSelected 
                                        ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg" 
                                        : "border-slate-200 hover:border-blue-300 hover:shadow-lg"
                                )}
                            >
                                {/* Popular Ribbon */}
                                {template.isPopular && (
                                    <div className="absolute top-0 right-0">
                                        <div className="bg-gradient-to-l from-orange-400 to-amber-400 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                                            <Star size={10} fill="currentColor" /> Popular
                                        </div>
                                    </div>
                                )}

                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className={cn(
                                        "w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm",
                                        template.color
                                    )}>
                                        {template.icon}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-3 cursor-pointer" onClick={() => setSelectedTemplate(template)}>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                            {template.title}
                                            {template.isVerified && (
                                                <span title="Verified by Admins">
                                                    <CheckCircle size={14} className="text-blue-500" />
                                                </span>
                                            )}
                                        </h3>
                                        <Badge status="neutral" className="mt-2 text-[10px] uppercase tracking-wider">{template.category}</Badge>
                                    </div>
                                    
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        {template.description}
                                    </p>
                                </div>

                                {/* Footer / Actions */}
                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        {template.aiRulesCount > 0 && (
                                            <span className="flex items-center gap-1.5" title={`${template.aiRulesCount} AI governance rules`}>
                                                <Bot size={14} className="text-purple-500"/>
                                                {template.aiRulesCount} Rules
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className={cn("text-xs h-8 px-2 text-slate-500 hover:text-slate-800", isSelected && "bg-slate-100 text-slate-900")}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedTemplate(template);
                                            }}
                                            leftIcon={<Eye size={14}/>}
                                            title="View details without leaving"
                                        >
                                            View
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            className="text-xs h-8 px-3 shadow-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUseTemplate(template);
                                            }}
                                            rightIcon={<ArrowRight size={14}/>}
                                            title="Create new document from this template"
                                        >
                                            Use
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredTemplates.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <LayoutTemplate size={40} className="mx-auto text-slate-300 mb-4"/>
                        <h3 className="text-slate-900 font-medium text-lg">No templates found</h3>
                        <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters.</p>
                        <Button 
                            variant="secondary" 
                            className="mt-4"
                            onClick={() => { setSearch(''); setFilter('All'); }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}

            </div>

            {/* Template Detail SlideOver */}
            <TemplateConfigDrawer 
                template={selectedTemplate}
                onClose={() => setSelectedTemplate(null)}
                onUse={() => {
                    if (selectedTemplate) handleUseTemplate(selectedTemplate);
                }}
            />

            {/* Project Selection Modal */}
            <Modal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                title={`Create new "${templateToUse?.title || 'Document'}"`}
            >
                <div className="space-y-4">
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 border border-slate-200">
                        Please select which <strong>Project</strong> this document belongs to. This ensures the correct knowledge context and permissions are applied.
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {projects.length > 0 ? projects.map(p => (
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
                        )) : (
                            <div className="text-center py-4 text-slate-500 text-sm">
                                No projects found. Please create a project first.
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </PageLayout>
    );
};

// --- Sub-Component: Detail Drawer ---

const TemplateConfigDrawer: React.FC<{ 
    template: Template | null; 
    onClose: () => void;
    onUse: () => void;
}> = ({ template, onClose, onUse }) => {
    return (
        <SlideOver
            isOpen={!!template}
            onClose={onClose}
            title={
                <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", template?.color)}>
                        {template?.icon}
                    </div>
                    <span>{template?.title}</span>
                </div>
            }
            footer={
                <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Last Updated</span>
                        <span className="text-xs text-slate-600">3 days ago by Platform Team</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={onClose}>Close</Button>
                        <Button onClick={onUse} rightIcon={<ArrowRight size={16}/>}>Use Template</Button>
                    </div>
                </div>
            }
            width="xl"
        >
            {template && (
                <>
                    {/* Description Block */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            {template.description}
                        </p>
                        <div className="flex gap-4 mt-4 pt-4 border-t border-slate-200">
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-slate-900">{template.usageCount}</span>
                                <span className="text-[10px] text-slate-500 uppercase">Uses</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-slate-900">{template.aiRulesCount}</span>
                                <span className="text-[10px] text-slate-500 uppercase">AI Rules</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-slate-900">{template.governance.approvers.length}</span>
                                <span className="text-[10px] text-slate-500 uppercase">Approvers</span>
                            </div>
                        </div>
                    </div>

                    {/* 1. Structure */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <LayoutTemplate size={16} className="text-slate-500"/> Document Structure
                            </h4>
                            <span className="text-xs text-slate-500">{template.sections.length} Sections</span>
                        </div>
                        
                        <div className="space-y-3">
                            {template.sections.map((sec, idx) => (
                                <div key={idx} className="group flex gap-4 p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                                    <div className="flex flex-col items-center gap-1 min-w-[24px] pt-1">
                                        <div className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 w-6 h-6 rounded flex items-center justify-center">
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>
                                        {idx !== template.sections.length - 1 && <div className="w-px h-full bg-slate-100 group-hover:bg-blue-100"></div>}
                                    </div>
                                    <div className="flex-1 pb-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h5 className="font-semibold text-slate-900 text-sm">{sec.title}</h5>
                                            {sec.isOptional && <Badge status="neutral" className="text-[9px] py-0 px-1.5">Optional</Badge>}
                                        </div>
                                        <p className="text-xs text-slate-500 leading-snug">{sec.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 2. Governance & Rules */}
                    <div className="grid grid-cols-1 gap-6">
                        
                        {/* Governance */}
                        <section>
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                                <ShieldCheck size={16} className="text-slate-500"/> Governance
                            </h4>
                            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={16}/></div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">Required Approvers</div>
                                        {template.governance.approvers.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 mt-1.5">
                                                {template.governance.approvers.map(role => (
                                                    <span key={role} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 mt-1">None defined.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 w-full"></div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FilePen size={16}/></div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">Sign-off Requirement</div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {template.governance.electronicSignature 
                                                ? "Formal Electronic Signature (eSig) required." 
                                                : "Standard 'Approve' button is sufficient."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* AI Policies */}
                        <section>
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                                <Bot size={16} className="text-slate-500"/> AI Policies
                            </h4>
                            {template.governance.aiChecks.length > 0 ? (
                                <div className="bg-purple-50 border border-purple-100 rounded-xl overflow-hidden">
                                    <div className="px-4 py-3 bg-purple-100/50 border-b border-purple-100 flex items-center justify-between">
                                        <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">Automated Checks</span>
                                        <Sparkles size={14} className="text-purple-600"/>
                                    </div>
                                    <ul className="divide-y divide-purple-100">
                                        {template.governance.aiChecks.map((check, i) => (
                                            <li key={i} className="px-4 py-3 flex items-start gap-3 text-sm text-purple-900">
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"></div>
                                                <span className="leading-snug">{check}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="px-4 py-2 bg-purple-100/30 text-[10px] text-purple-600 font-medium text-center">
                                        Runs automatically before approval request
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 border border-slate-200 rounded-xl text-center text-xs text-slate-400 italic">
                                    No automated AI checks configured.
                                </div>
                            )}
                        </section>

                    </div>
                </>
            )}
        </SlideOver>
    );
};
