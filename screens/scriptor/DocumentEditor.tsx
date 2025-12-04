
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ScriptorDoc, Project, DocumentSection, AgentMessage } from '../../types';
import { 
    Bot, MessageCircle, 
    ShieldCheck, Database, Activity, CheckCircle, 
    AlertCircle, Sparkles, Loader2, Globe
} from '../../components/icons/Icons';
import { cn } from '../../utils';
import { useToast } from '../../components/ui/Toast';
import { Badge } from '../../components/ui/Badge';
import { DocumentViewer, ValidationCheck } from '../../components/DocumentViewer';
import { AgentMsg } from '../../components/ui/AgentMsg';
import { AgentInput } from '../../components/ui/AgentInput';
import { EditorToolbar } from '../../components/scriptor/EditorToolbar';
import { KnowledgeReference } from '../../components/scriptor/KnowledgeReference';
import { UnifiedAgentSidebar } from '../../components/UnifiedAgentSidebar';

interface DocumentEditorProps {
    doc: ScriptorDoc;
    project?: Project;
    onBack: () => void;
    showAtlasAssistant: boolean;
    onToggleAssistant: () => void;
}

// --- Mock Data ---
const MOCK_SECTIONS: DocumentSection[] = [
    { id: '1', type: 'heading', content: 'Technical Specification', status: 'draft' },
    { id: '2', type: 'text', title: 'Context', content: 'The current payment gateway lacks support for multi-currency transactions, causing friction for EU customers.', status: 'approved' },
    { id: '3', type: 'text', title: 'Proposed Solution', content: 'We will integrate Stripe Connect to handle global payments. This requires a new microservice "Payments-Service" written in Go.', status: 'draft' },
    { id: '4', type: 'text', title: 'Risks', content: '1. Latency increase for cross-region transactions.\n2. Compliance burden for GDPR data locality.', status: 'review' },
];

const MOCK_CHECKS: Record<string, ValidationCheck[]> = {
    '2': [
        { id: 'c1', label: 'Fact Verification', type: 'ai', status: 'passed', description: 'Matched with "Payment Gateway Analysis" (2 weeks ago).' }
    ],
    '3': [
        { id: 'c2', label: 'Architecture Review', type: 'manual', status: 'pending', description: 'Requires sign-off from Platform Team.' },
        { id: 'c3', label: 'Tech Stack Compliance', type: 'ai', status: 'passed', description: 'Go is an approved language.' }
    ],
    '4': [
        { id: 'c4', label: 'GDPR Check', type: 'ai', status: 'failed', description: 'Data locality requirements may not be met by standard Stripe Connect setup.' },
        { id: 'c5', label: 'Risk Severity', type: 'ai', status: 'passed', description: 'Risks are correctly categorized.' }
    ]
};

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ doc, project, onBack, showAtlasAssistant, onToggleAssistant }) => {
    const { showToast } = useToast();
    
    // --- Document State ---
    const [sections, setSections] = useState<DocumentSection[]>(MOCK_SECTIONS);
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null); // Null = Whole Doc focus
    
    // --- Sidebar State ---
    const [leftTab, setLeftTab] = useState<'knowledge' | 'checks'>('knowledge');
    const [checkFilter, setCheckFilter] = useState<'all' | 'failed' | 'passed'>('all');

    // --- Chat State ---
    const [threads, setThreads] = useState<Record<string, AgentMessage[]>>({
        'main': [{ id: 'init', role: 'assistant', content: `I am ready to help you edit this document. I have loaded context from **${project?.name || 'the project'}**.`, timestamp: new Date() }]
    });
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    
    const scrollRef = useRef<HTMLDivElement>(null);

    // Derived
    const activeSection = sections.find(s => s.id === activeSectionId);
    const currentThread = activeSectionId ? (threads[activeSectionId] || []) : threads['main'];
    
    // Compute Checks (Section-specific OR Global Aggregation)
    const allChecks = useMemo(() => {
        const flatChecks: (ValidationCheck & { sectionTitle?: string; sectionId?: string })[] = [];
        Object.entries(MOCK_CHECKS).forEach(([secId, checks]) => {
            const section = sections.find(s => s.id === secId);
            if (section) {
                checks.forEach(c => {
                    flatChecks.push({ ...c, sectionTitle: section.title || 'Untitled Section', sectionId: secId });
                });
            }
        });
        return flatChecks;
    }, [sections]);

    const displayedChecks = useMemo(() => {
        let list = activeSectionId ? (MOCK_CHECKS[activeSectionId] || []) : allChecks;
        
        if (!activeSectionId && checkFilter !== 'all') {
            list = list.filter(c => c.status === checkFilter);
        }
        return list;
    }, [activeSectionId, allChecks, checkFilter]);

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [threads, activeSectionId, isThinking, showAtlasAssistant]);

    // --- Handlers ---

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        const text = input;
        setInput('');
        
        const threadId = activeSectionId || 'main';
        const userMsg: AgentMessage = { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: new Date() };
        
        setThreads(prev => ({
            ...prev,
            [threadId]: [...(prev[threadId] || []), userMsg]
        }));

        setIsThinking(true);

        setTimeout(() => {
            let responseText = "";
            
            if (activeSectionId) {
                responseText = `I've updated the **${activeSection?.title}** section.`;
                // Mock update
                setSections(prev => prev.map(s => s.id === activeSectionId ? { ...s, content: s.content + `\n\n[Refined]: ${text}` } : s));
            } else {
                responseText = "I've noted that for the overall document.";
            }

            setThreads(prev => ({
                ...prev,
                [threadId]: [...prev[threadId], { 
                    id: `a-${Date.now()}`, 
                    role: 'assistant', 
                    content: responseText, 
                    timestamp: new Date() 
                }]
            }));
            setIsThinking(false);
        }, 1000);
    };

    const handleSectionClick = (id: string) => {
        if (id === activeSectionId) return;
        setActiveSectionId(id);
        
        // Init thread if needed
        if (!threads[id]) {
            const section = sections.find(s => s.id === id);
            setThreads(prev => ({
                ...prev,
                [id]: [{
                    id: `init-${id}`,
                    role: 'assistant',
                    content: `Focusing on **${section?.title}**. How should we refine this?`,
                    timestamp: new Date()
                }]
            }));
        }
    };

    const handleRefineSection = async (id: string, action: 'simplify' | 'expand' | 'tone' | 'fix') => {
        setActiveSectionId(id);
        const prompt = `Please ${action} this section.`;
        // Directly trigger the chat interaction
        const userMsg: AgentMessage = { id: `u-${Date.now()}`, role: 'user', content: prompt, timestamp: new Date() };
        
        setThreads(prev => ({
            ...prev,
            [id]: [...(prev[id] || []), userMsg]
        }));
        
        setIsThinking(true);
        setTimeout(() => {
             setSections(prev => prev.map(s => s.id === id ? { ...s, content: s.content + `\n\n[AI Refined (${action})]: content updated...` } : s));
             setThreads(prev => ({
                ...prev,
                [id]: [...prev[id], { 
                    id: `a-${Date.now()}`, 
                    role: 'assistant', 
                    content: `I've processed the **${action}** request.`, 
                    timestamp: new Date() 
                }]
            }));
            setIsThinking(false);
        }, 1000);
    };

    return (
        <div className="flex h-full bg-white overflow-hidden font-sans text-slate-900">
            
            {/* --- LEFT PANEL: REFERENCE & CHECKS (280px) --- */}
            <div className="w-[280px] bg-slate-50 border-r border-slate-200 flex flex-col z-20 shrink-0">
                <div className="flex items-center border-b border-slate-200 bg-white">
                    <button 
                        onClick={() => setLeftTab('knowledge')}
                        className={cn(
                            "flex-1 h-14 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors",
                            leftTab === 'knowledge' ? "border-blue-500 text-blue-600 bg-blue-50/10" : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        Knowledge
                    </button>
                    <button 
                        onClick={() => setLeftTab('checks')}
                        className={cn(
                            "flex-1 h-14 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors",
                            leftTab === 'checks' ? "border-blue-500 text-blue-600 bg-blue-50/10" : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        Checks
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {leftTab === 'knowledge' ? (
                        <>
                            {/* Entity Extraction */}
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Detected Entities</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 border border-blue-100 text-xs text-blue-700">
                                        <Database size={10} className="mr-1"/> Stripe
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 rounded bg-purple-50 border border-purple-100 text-xs text-purple-700">
                                        <Activity size={10} className="mr-1"/> Latency
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 rounded bg-orange-50 border border-orange-100 text-xs text-orange-700">
                                        <ShieldCheck size={10} className="mr-1"/> GDPR
                                    </span>
                                </div>
                            </div>

                            {/* Relevant Knowledge */}
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Relevant Knowledge</h3>
                                <div className="space-y-3">
                                    <KnowledgeReference 
                                        type="decision" 
                                        content="All new services must be written in Go."
                                        source="Project Titan"
                                        date="2 weeks ago"
                                    />
                                    <KnowledgeReference 
                                        type="risk"
                                        content="GDPR Data Locality requires EU user data to stay in EU-West."
                                        source="Compliance"
                                        date="1 month ago"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        /* CHECKS TAB */
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    {activeSectionId ? `Section: ${activeSection?.title}` : 'Global Checks'}
                                </h3>
                                <Badge status="neutral" className="text-[10px]">
                                    {displayedChecks.filter((c: any) => c.status === 'passed').length}/{displayedChecks.length} Passed
                                </Badge>
                            </div>

                            {/* Filter for Global View */}
                            {!activeSectionId && (
                                <div className="flex gap-1 mb-4 bg-slate-100 p-1 rounded-lg">
                                    {(['all', 'failed', 'passed'] as const).map(filter => (
                                        <button
                                            key={filter}
                                            onClick={() => setCheckFilter(filter)}
                                            className={cn(
                                                "flex-1 py-1 text-[10px] font-medium rounded capitalize transition-all",
                                                checkFilter === filter ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                            )}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-3">
                                {displayedChecks.length === 0 ? (
                                    <div className="text-xs text-slate-500 italic text-center py-4">
                                        {activeSectionId ? "No active checks for this section." : "No checks found matching filter."}
                                    </div>
                                ) : (
                                    displayedChecks.map((check: any) => (
                                        <div 
                                            key={check.id} 
                                            className={cn(
                                                "bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex gap-3 transition-colors",
                                                !activeSectionId ? "cursor-pointer hover:border-blue-300" : ""
                                            )}
                                            onClick={() => !activeSectionId && check.sectionId && handleSectionClick(check.sectionId)}
                                        >
                                            <div className="mt-0.5 shrink-0">
                                                {check.status === 'passed' && <CheckCircle size={16} className="text-green-500"/>}
                                                {check.status === 'failed' && <AlertCircle size={16} className="text-red-500"/>}
                                                {check.status === 'running' && <Loader2 size={16} className="text-blue-500 animate-spin"/>}
                                                {check.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                                                    {check.label}
                                                    {check.type === 'ai' && <Sparkles size={10} className="text-purple-500"/>}
                                                </div>
                                                <p className="text-[11px] text-slate-500 mt-1 leading-snug">{check.description}</p>
                                                
                                                {/* Show Section Label in Global View */}
                                                {!activeSectionId && check.sectionTitle && (
                                                    <div className="mt-2 pt-2 border-t border-slate-50 flex items-center gap-1 text-[10px] text-slate-400">
                                                        <span className="font-medium text-slate-500 truncate">{check.sectionTitle}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* --- CENTER: DOCUMENT CANVAS --- */}
            <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
                
                <EditorToolbar 
                    doc={doc}
                    projectName={project?.name}
                    onBack={onBack}
                    onShare={() => showToast('Share link copied', { type: 'success' })}
                    onApprove={() => showToast('Document Approved', { type: 'success' })}
                />

                {/* Canvas */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth bg-slate-50/30">
                    <div className="max-w-3xl mx-auto min-h-[800px]">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span>Projects</span>
                                <span>/</span>
                                <span>{project?.name || 'Unknown Project'}</span>
                                <span>/</span>
                                <span>{doc.title}</span>
                            </div>
                            {activeSectionId && (
                                <button onClick={() => setActiveSectionId(null)} className="text-xs text-blue-600 hover:underline font-medium">
                                    Exit Focus Mode
                                </button>
                            )}
                        </div>
                        
                        <DocumentViewer 
                            sections={sections}
                            activeSectionId={activeSectionId}
                            onSectionClick={handleSectionClick}
                            onRefineSection={handleRefineSection}
                            onApproveSection={() => {}}
                        />
                    </div>
                </div>
            </div>

            {/* --- RIGHT PANEL: UNIFIED AGENT SIDEBAR --- */}
            <UnifiedAgentSidebar 
                appName="Scriptor" 
                appIcon={<Bot size={14} />}
                isAtlasOpen={showAtlasAssistant}
                onToggleAgent={onToggleAssistant}
                onNavigateGlobal={() => {}} // No-op inside editor
                globalViewContext="editor"
            >
                {/* Scriptor Agent View (Children) */}
                <div className="h-full flex flex-col">
                    {/* Focus Context Bar */}
                    {activeSectionId ? (
                        <div className="px-5 py-3 bg-blue-50/50 border-b border-blue-100 flex items-center gap-3 animate-fadeIn transition-all">
                            <MessageCircle size={16} className="text-blue-600 shrink-0" />
                            <div className="min-w-0 flex flex-col">
                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider leading-none mb-1">Focused On</span>
                                <span className="text-sm font-bold text-slate-900 leading-tight truncate">{activeSection?.title}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-slate-500 transition-all">
                            <Globe size={16} />
                            <span className="text-xs font-medium">Global Document Context</span>
                        </div>
                    )}

                    {/* Chat Stream */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/30" ref={scrollRef}>
                        {currentThread.map(msg => (
                            <AgentMsg key={msg.id} message={msg} />
                        ))}
                        {isThinking && (
                            <div className="flex items-center gap-2 text-slate-400 text-xs ml-4 animate-pulse">
                                <Bot size={14}/> Thinking...
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-slate-200 bg-white">
                        <AgentInput 
                            value={input}
                            onChange={setInput}
                            onSubmit={handleSendMessage}
                            placeholder={activeSectionId ? "Refine this section..." : "Instructions for whole doc..."}
                            isThinking={isThinking}
                        />
                    </div>
                </div>
            </UnifiedAgentSidebar>

        </div>
    );
};
