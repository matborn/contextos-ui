
import React, { useState, useRef, useEffect } from 'react';
import { AgentMessage, DocumentSection } from '@/types';
import { Bot, ArrowRight, FilePen, ChevronRight, MessageCircle, GitPullRequest, ShieldCheck, Database, Target, ChevronLeft, Sparkles, ListChecks, CheckCircle, AlertCircle, Loader2, Check } from '@/components/icons/Icons';
import { cn, generateId } from '@/utils';
import { useToast } from '@/components/ui/Toast';
import { DocumentViewer } from '@/components/DocumentViewer';
import { Badge } from '@/components/ui/Badge';

// --- Persona Definitions ---
interface Persona {
    id: string;
    name: string;
    role: string;
    color: string;
    icon: React.ReactNode;
}

const ORCHESTRATOR_PERSONA: Persona = {
    id: 'orchestrator',
    name: 'Lead Editor',
    role: 'Document Orchestrator',
    color: 'bg-indigo-600',
    icon: <Bot size={16} />
};

const getPersonaForSection = (sectionTitle: string): Persona => {
    const lowerTitle = sectionTitle.toLowerCase();
    if (lowerTitle.includes('risk') || lowerTitle.includes('security')) {
        return { id: 'security', name: 'Security Auditor', role: 'Risk Expert', color: 'bg-red-600', icon: <ShieldCheck size={16} /> };
    }
    if (lowerTitle.includes('tech') || lowerTitle.includes('arch') || lowerTitle.includes('data')) {
        return { id: 'tech', name: 'System Architect', role: 'Technical Lead', color: 'bg-blue-600', icon: <Database size={16} /> };
    }
    if (lowerTitle.includes('goal') || lowerTitle.includes('business') || lowerTitle.includes('problem')) {
        return { id: 'product', name: 'Product Strategist', role: 'PM Lead', color: 'bg-green-600', icon: <Target size={16} /> };
    }
    return { id: 'writer', name: 'Staff Writer', role: 'Content Specialist', color: 'bg-purple-600', icon: <FilePen size={16} /> };
};

// --- Mock Initial Template ---
const INITIAL_DOC: DocumentSection[] = [
    { id: '1', type: 'heading', content: 'Product Requirements: ContextOS V2', status: 'draft' },
    { id: '2', type: 'text', title: 'Problem Statement', content: 'Users struggle to maintain context across multiple chat threads when building complex documents. The current single-thread model is insufficient for deep-dives.', status: 'draft' },
    { id: '3', type: 'text', title: 'Solution Architecture', content: 'We propose a multi-agent system where specialized sub-agents handle specific document sections.', status: 'draft' },
    { id: '4', type: 'text', title: 'Security Risks', content: 'Data leakage between threads must be prevented. Role-based access control (RBAC) should apply to sub-threads.', status: 'draft' },
];

// --- Checklist Types & Mock Data ---
interface ChecklistItem {
    id: string;
    label: string;
    type: 'ai' | 'manual';
    status: 'pending' | 'passed' | 'failed' | 'running';
    description?: string;
}

const MOCK_CHECKLISTS: Record<string, ChecklistItem[]> = {
    'main': [
        { id: 'c1', label: 'Completeness Check', type: 'ai', status: 'passed', description: 'Ensure all mandatory sections (Problem, Solution) are present.' },
        { id: 'c2', label: 'Tone Consistency', type: 'ai', status: 'pending', description: 'Verify professional tone across all sections.' },
        { id: 'c3', label: 'Executive Approval', type: 'manual', status: 'pending', description: 'Sign-off from VP of Product.' },
    ],
    'security': [ // For Security Risks section
        { id: 's1', label: 'PII Scan', type: 'ai', status: 'pending', description: 'Detect potential leakage of personally identifiable information.' },
        { id: 's2', label: 'Threat Model Review', type: 'manual', status: 'pending', description: 'Confirm STRIDE analysis is attached.' },
        { id: 's3', label: 'Compliance Tagging', type: 'ai', status: 'passed', description: 'Ensure GDPR/SOC2 tags are applied.' },
    ],
    'tech': [ // For Architecture section
        { id: 't1', label: 'Feasibility Score', type: 'ai', status: 'failed', description: 'Assess technical complexity vs timeline.' },
        { id: 't2', label: 'Dependency Graph', type: 'ai', status: 'passed', description: 'Validate no circular dependencies.' },
    ],
    'default': [
        { id: 'd1', label: 'Spelling & Grammar', type: 'ai', status: 'pending', description: 'Standard language validation.' },
        { id: 'd2', label: 'Clarity Review', type: 'manual', status: 'pending', description: 'Manual read-through for readability.' },
    ]
};

export const DocGenV2: React.FC = () => {
    const { showToast } = useToast();
    
    // --- State ---
    const [activeThreadId, setActiveThreadId] = useState<string>('main');
    const [viewMode, setViewMode] = useState<'chat' | 'checklist'>('chat');
    
    // Registry of all chat histories
    const [threads, setThreads] = useState<Record<string, AgentMessage[]>>({
        'main': [{ 
            id: 'init', 
            role: 'assistant', 
            content: 'I am the **Lead Editor**. I have set up the initial PRD structure. Click on any section to open a **focused sub-thread** with a specialist agent.', 
            timestamp: new Date() 
        }]
    });

    // Registry of checklists
    const [checklists, setChecklists] = useState<Record<string, ChecklistItem[]>>({});

    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Document State
    const [sections, setSections] = useState<DocumentSection[]>(INITIAL_DOC);
    const [docTitle] = useState('PRD: ContextOS V2');

    // Derived State
    const activeSection = sections.find(s => s.id === activeThreadId);
    const currentPersona = activeThreadId === 'main' ? ORCHESTRATOR_PERSONA : getPersonaForSection(activeSection?.title || 'Section');

    // Auto-scroll chat
    useEffect(() => {
        if (viewMode === 'chat' && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [threads, activeThreadId, isThinking, viewMode]);

    // Initialize Checklist for new threads
    useEffect(() => {
        if (!checklists[activeThreadId]) {
            let items: ChecklistItem[] = [];
            if (activeThreadId === 'main') items = [...MOCK_CHECKLISTS['main']];
            else if (currentPersona.id === 'security') items = [...MOCK_CHECKLISTS['security']];
            else if (currentPersona.id === 'tech') items = [...MOCK_CHECKLISTS['tech']];
            else items = [...MOCK_CHECKLISTS['default']];
            
            setChecklists(prev => ({ ...prev, [activeThreadId]: items }));
        }
    }, [activeThreadId, currentPersona.id, checklists]);

    // --- Actions ---

    const processMessage = async (text: string, targetThreadId: string) => {
        const userMsg: AgentMessage = { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: new Date() };
        
        // Ensure thread exists if jumping from doc view
        if (!threads[targetThreadId]) {
            const section = sections.find(s => s.id === targetThreadId);
            const persona = getPersonaForSection(section?.title || '');
            setThreads(prev => ({
                ...prev,
                [targetThreadId]: [{
                    id: `init-${targetThreadId}`,
                    role: 'assistant',
                    content: `Hello. I am the **${persona.name}**. I'm here to help you refine the **${section?.title}**.`,
                    timestamp: new Date()
                }]
            }));
        }

        setThreads(prev => ({
            ...prev,
            [targetThreadId]: [...(prev[targetThreadId] || []), userMsg]
        }));
        
        setIsThinking(true);

        setTimeout(() => {
            let responseContent = "";
            let newSectionContent = "";
            
            // Re-calculate persona based on the target thread being processed
            const targetSection = sections.find(s => s.id === targetThreadId);
            const targetPersona = targetThreadId === 'main' ? ORCHESTRATOR_PERSONA : getPersonaForSection(targetSection?.title || 'Section');

            if (targetThreadId === 'main') {
                responseContent = "I've noted that for the overall document strategy. Please select a section if you want to dive deeper.";
            } else {
                if (text.includes('simplify')) {
                    responseContent = `I have simplified the text to be more concise while retaining the key technical requirements.`;
                    newSectionContent = (targetSection?.content || "") + `\n\n[Simplified]: The system uses specialized sub-agents for modular document handling.`;
                } else if (text.includes('expand')) {
                    responseContent = `I have expanded the section with additional context and examples.`;
                    newSectionContent = (targetSection?.content || "") + `\n\n[Expanded]: This includes dedicated memory management per agent, ensuring localized context windows do not bleed into global state.`;
                } else if (text.includes('tone')) {
                    responseContent = `I have adjusted the tone to be more formal and objective.`;
                    newSectionContent = (targetSection?.content || "").replace('struggle', 'encounter challenges').replace('insufficient', 'sub-optimal');
                } else {
                    responseContent = `As the **${targetPersona.name}**, I've updated the **${targetSection?.title}** section based on your input.`;
                    newSectionContent = (targetSection?.content || "") + `\n\n[Update]: ${text} (Refined by ${targetPersona.role})`;
                }
            }

            setThreads(prev => ({
                ...prev,
                [targetThreadId]: [...prev[targetThreadId], { 
                    id: `a-${Date.now()}`, 
                    role: 'assistant', 
                    content: responseContent, 
                    timestamp: new Date() 
                }]
            }));

            if (targetThreadId !== 'main' && newSectionContent) {
                setSections(prev => prev.map(s => s.id === targetThreadId ? { ...s, content: newSectionContent } : s));
            }

            setIsThinking(false);
        }, 1200);
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        const text = input;
        setInput('');
        await processMessage(text, activeThreadId);
    };

    const handleSectionClick = (sectionId: string) => {
        if (sectionId === activeThreadId) return;
        setActiveThreadId(sectionId);
        
        // Ensure thread is initialized
        if (!threads[sectionId]) {
            const section = sections.find(s => s.id === sectionId);
            const persona = getPersonaForSection(section?.title || '');
            
            setThreads(prev => ({
                ...prev,
                [sectionId]: [{
                    id: `init-${sectionId}`,
                    role: 'assistant',
                    content: `Hello. I am the **${persona.name}**. I'm here to help you refine the **${section?.title}**. What details should we add or clarify?`,
                    timestamp: new Date()
                }]
            }));
        }
    };

    const handleRefineSection = async (id: string, action: 'simplify' | 'expand' | 'tone' | 'fix') => {
        setActiveThreadId(id);
        setViewMode('chat');
        
        let prompt = "";
        switch(action) {
            case 'simplify': prompt = "Please simplify this section to make it easier to read."; break;
            case 'expand': prompt = "Please expand on this section with more detail and examples."; break;
            case 'tone': prompt = "Please adjust the tone of this section to be more professional."; break;
            case 'fix': prompt = "Please fix any grammar or spelling errors."; break;
        }
        
        await processMessage(prompt, id);
    };

    const handleReturnToMain = () => {
        const subThread = threads[activeThreadId];
        const lastMsg = subThread[subThread.length - 1];
        const sectionTitle = sections.find(s => s.id === activeThreadId)?.title;
        
        if (subThread.length > 1) { 
            const summaryMsg: AgentMessage = {
                id: `sum-${Date.now()}`,
                role: 'system',
                content: `**Updates from ${sectionTitle}**: \nRecent activity with the ${currentPersona.name} resulted in content updates. The user focused on: "${lastMsg.content.slice(0, 50)}..."`,
                timestamp: new Date()
            };

            setThreads(prev => ({
                ...prev,
                'main': [...prev['main'], summaryMsg]
            }));
            
            showToast('Insights merged to Main Chat', { type: 'success' });
        }

        setActiveThreadId('main');
    };

    const handleRunCheck = (itemId: string) => {
        // Set to running
        setChecklists(prev => ({
            ...prev,
            [activeThreadId]: prev[activeThreadId].map(i => i.id === itemId ? { ...i, status: 'running' } : i)
        }));

        setTimeout(() => {
            // Random pass/fail for demo
            const passed = Math.random() > 0.2;
            setChecklists(prev => ({
                ...prev,
                [activeThreadId]: prev[activeThreadId].map(i => i.id === itemId ? { ...i, status: passed ? 'passed' : 'failed' } : i)
            }));
            showToast(passed ? 'Validation Passed' : 'Validation Failed', { type: passed ? 'success' : 'error' });
        }, 1500);
    };

    const handleToggleManual = (itemId: string) => {
        setChecklists(prev => ({
            ...prev,
            [activeThreadId]: prev[activeThreadId].map(i => {
                if (i.id === itemId) {
                    const newStatus = i.status === 'passed' ? 'pending' : 'passed';
                    return { ...i, status: newStatus };
                }
                return i;
            })
        }));
    };

    const handleQuickAction = (text: string) => {
        setInput(text);
    };

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden">
            
            {/* --- LEFT PANEL: MULTI-AGENT CHAT & CHECKLIST --- */}
            <div className="w-[450px] flex flex-col border-r border-slate-200 bg-white z-10 shadow-xl transition-all duration-300">
                
                {/* Dynamic Header */}
                <div className={cn(
                    "h-16 px-6 flex items-center justify-between border-b border-slate-100 shrink-0 transition-colors duration-300",
                    activeThreadId !== 'main' ? "bg-slate-50" : "bg-white"
                )}>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition-colors",
                            currentPersona.color
                        )}>
                            {currentPersona.icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold text-slate-900 leading-tight">{currentPersona.name}</h2>
                                {activeThreadId !== 'main' && <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">Sub-Agent</span>}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">{currentPersona.role}</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {activeThreadId !== 'main' && (
                            <button 
                                onClick={handleReturnToMain}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-200 rounded-full transition-all"
                                title="Back to Lead"
                            >
                                <ChevronLeft size={16} />
                            </button>
                        )}
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setViewMode('chat')} 
                                className={cn(
                                    "p-1.5 rounded-md transition-all", 
                                    viewMode === 'chat' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
                                )}
                                title="Chat"
                            >
                                <MessageCircle size={16} />
                            </button>
                            <button 
                                onClick={() => setViewMode('checklist')} 
                                className={cn(
                                    "p-1.5 rounded-md transition-all flex items-center gap-1", 
                                    viewMode === 'checklist' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
                                )}
                                title="Validation Checklist"
                            >
                                <ListChecks size={16} />
                                {checklists[activeThreadId]?.some(i => i.status === 'failed') && (
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Thread Indicator / Context Bar */}
                {activeThreadId !== 'main' && (
                    <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center gap-2 text-xs text-slate-600">
                        <MessageCircle size={12} />
                        <span>Focused on: </span>
                        <span className="font-bold text-slate-900">{activeSection?.title}</span>
                    </div>
                )}

                {/* --- VIEW MODE: CHAT STREAM --- */}
                {viewMode === 'chat' && (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30" ref={scrollRef}>
                            {(threads[activeThreadId] || []).map(msg => (
                                <div key={msg.id} className={cn("flex gap-3 animate-fadeIn", msg.role === 'user' ? "flex-row-reverse" : "")}>
                                    {msg.role !== 'system' && (
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm",
                                            msg.role === 'assistant' 
                                                ? cn("text-white", currentPersona.color)
                                                : "bg-white border border-slate-200 text-slate-600"
                                        )}>
                                            {msg.role === 'assistant' ? currentPersona.icon : <div className="text-xs font-bold">You</div>}
                                        </div>
                                    )}
                                    
                                    <div className={cn("flex-1 max-w-[85%]", msg.role === 'system' ? "mx-auto w-full" : (msg.role === 'user' ? "text-right" : ""))}>
                                        {msg.role === 'system' ? (
                                            <div className="flex justify-center my-4">
                                                <div className="bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-lg flex items-start gap-3 w-full max-w-sm shadow-sm">
                                                    <div className="mt-0.5 text-indigo-500 bg-white p-1 rounded-full"><GitPullRequest size={14}/></div>
                                                    <div className="text-xs text-indigo-900 leading-relaxed">
                                                        <MarkdownRenderer content={msg.content} />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={cn(
                                                "p-3 rounded-2xl shadow-sm text-sm leading-relaxed inline-block text-left",
                                                msg.role === 'assistant' 
                                                    ? "bg-white text-slate-700 rounded-tl-none border border-slate-100" 
                                                    : cn("text-white rounded-tr-none", currentPersona.color)
                                            )}>
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isThinking && (
                                <div className="flex items-center gap-2 text-slate-400 text-xs ml-11 animate-pulse">
                                    {currentPersona.icon} {currentPersona.name} is typing...
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-slate-200 bg-white">
                            <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
                                {activeThreadId === 'main' ? (
                                    <>
                                        <button onClick={() => handleQuickAction("Review the Problem Statement")} className="whitespace-nowrap px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                                            🔍 Review Problem
                                        </button>
                                        <button onClick={() => handleQuickAction("Identify Security Risks")} className="whitespace-nowrap px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                                            🛡️ Security Check
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleQuickAction("Expand on this point")} className="whitespace-nowrap px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                                            ➕ Expand
                                        </button>
                                        <button onClick={() => handleQuickAction("Make it more concise")} className="whitespace-nowrap px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                                            ✂️ Shorten
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="relative">
                                <textarea 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if(e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder={activeThreadId === 'main' ? "Give instructions to the Lead Editor..." : `Discuss ${activeSection?.title} with the ${currentPersona.role}...`}
                                    className="w-full pl-4 pr-12 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all shadow-inner resize-none h-[52px] max-h-32 overflow-hidden focus:border-transparent focus:ring-indigo-500"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || isThinking}
                                    className={cn(
                                        "absolute right-2 top-2 p-1.5 rounded-lg text-white transition-colors disabled:opacity-50 disabled:bg-slate-300",
                                        currentPersona.color
                                    )}
                                >
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* --- VIEW MODE: CHECKLIST --- */}
                {viewMode === 'checklist' && (
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 animate-fadeIn">
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Validation Policies</h3>
                            <p className="text-xs text-slate-500">
                                {activeThreadId === 'main' 
                                    ? "Global checks required before final approval." 
                                    : `Specific compliance checks for ${activeSection?.title}.`}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {(checklists[activeThreadId] || []).map(item => (
                                <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-indigo-300 transition-all group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            {/* Status Icon */}
                                            <div className="mt-0.5">
                                                {item.status === 'passed' && <CheckCircle size={18} className="text-green-500"/>}
                                                {item.status === 'failed' && <AlertCircle size={18} className="text-red-500"/>}
                                                {item.status === 'running' && <Loader2 size={18} className="text-indigo-500 animate-spin"/>}
                                                {item.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>}
                                            </div>
                                            
                                            <div>
                                                <h4 className={cn("text-sm font-semibold", item.status === 'passed' ? "text-slate-900" : "text-slate-700")}>{item.label}</h4>
                                                <p className="text-xs text-slate-500 mt-1 leading-snug">{item.description}</p>
                                                <Badge 
                                                    status={item.type === 'ai' ? 'info' : 'warning'} 
                                                    className="mt-2 text-[10px] px-1.5 py-0"
                                                >
                                                    {item.type === 'ai' ? 'AI Automated' : 'Manual Check'}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                                            {item.type === 'ai' ? (
                                                <button 
                                                    onClick={() => handleRunCheck(item.id)}
                                                    disabled={item.status === 'running'}
                                                    className="text-xs font-medium text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded border border-transparent hover:border-indigo-100 transition-colors disabled:opacity-50"
                                                >
                                                    {item.status === 'running' ? 'Checking...' : 'Run Check'}
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleToggleManual(item.id)}
                                                    className={cn(
                                                        "text-xs font-medium px-2 py-1 rounded border transition-colors",
                                                        item.status === 'passed' 
                                                            ? "text-slate-500 hover:bg-slate-50 border-transparent" 
                                                            : "text-green-600 hover:bg-green-50 border-transparent hover:border-green-100"
                                                    )}
                                                >
                                                    {item.status === 'passed' ? 'Undo' : 'Mark Done'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* --- RIGHT PANEL: LIVE DOCUMENT --- */}
            <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="font-semibold text-slate-900 text-lg">{docTitle}</span>
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">v2.0</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Sparkles size={12} className="text-indigo-400"/>
                                Multi-Agent Mode Active
                            </div>
                        </div>
                        
                        <DocumentViewer 
                            sections={sections}
                            activeSectionId={activeThreadId === 'main' ? null : activeThreadId}
                            onSectionClick={handleSectionClick}
                            onRefineSection={handleRefineSection}
                            onApproveSection={() => {}}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

// Helper for rendering system message content
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Simple bold renderer for system messages
    const parts = content.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
    return <span>{parts}</span>;
}
