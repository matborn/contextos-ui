

import React, { useState, useRef, useEffect } from 'react';
import { AgentMessage, DocumentSection } from '../types';
import { 
    Bot, ArrowRight, FilePen, ChevronRight, MessageCircle, 
    GitPullRequest, ShieldCheck, Database, Target, ChevronLeft, 
    Sparkles, ListChecks, CheckCircle, AlertCircle, Loader2, 
    Check, Users, Clock, Zap, Activity, Filter, Lock, Plus
} from '../components/icons/Icons';
import { cn, generateId } from '../utils';
import { useToast } from '../components/ui/Toast';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MarkdownRenderer } from '../components/ui/MarkdownRenderer';

// --- Domain Models ---

interface Participant {
    id: string;
    name: string;
    role: string;
    isAi: boolean;
    color: string;
    bg: string;
    icon?: React.ReactNode;
}

interface SectionMeta {
    ownerId: string;
    status: 'draft' | 'review' | 'resolution' | 'approved';
    debateId?: string;
}

interface Debate {
    id: string;
    topic: string;
    messages: { authorId: string; text: string; sentiment: 'neutral' | 'concern' | 'support' }[];
    compromise?: string;
}

interface ChecklistItem {
    id: string;
    label: string;
    type: 'ai' | 'manual';
    status: 'pending' | 'passed' | 'failed' | 'running';
    description?: string;
}

// --- Mock Data & Config ---

const PARTICIPANTS: Participant[] = [
    { id: 'user', name: 'You', role: 'Editor', isAi: false, color: 'text-slate-700', bg: 'bg-slate-100' },
    { id: 'sarah', name: 'Sarah', role: 'Product Manager', isAi: false, color: 'text-indigo-700', bg: 'bg-indigo-100' },
    { id: 'architect', name: 'Architect', role: 'System Design', isAi: true, color: 'text-blue-600', bg: 'bg-blue-100', icon: <Database size={12}/> },
    { id: 'sentinel', name: 'Sentinel', role: 'Security Ops', isAi: true, color: 'text-red-600', bg: 'bg-red-100', icon: <ShieldCheck size={12}/> },
];

const INITIAL_DOC: DocumentSection[] = [
    { id: '1', type: 'heading', content: 'System Architecture Strategy', status: 'draft' },
    { id: '2', type: 'text', title: 'Executive Summary', content: 'This document outlines the transition to a microservices architecture to improve scalability and fault tolerance.', status: 'approved' },
    { id: '3', type: 'text', title: 'API Rate Limiting', content: 'We will enforce a global limit of 10,000 requests per second per tenant to ensure platform stability during peak load.', status: 'draft' },
    { id: '4', type: 'text', title: 'Data Retention', content: 'Audit logs will be retained for 30 days in hot storage and moved to cold storage for 1 year.', status: 'review' },
];

const INITIAL_META: Record<string, SectionMeta> = {
    '2': { ownerId: 'sarah', status: 'approved' },
    '3': { ownerId: 'architect', status: 'review' }, 
    '4': { ownerId: 'sentinel', status: 'review' },
};

const INITIAL_THREADS: Record<string, AgentMessage[]> = {
    'main': [{ id: 'init', role: 'assistant', content: 'Welcome to the co-authoring space. I am tracking changes from **Sarah**, **Architect**, and **Sentinel**.', timestamp: new Date() }],
    '3': [{ id: 't3-1', role: 'assistant', content: 'I have drafted the initial rate limiting thresholds based on current infrastructure capacity.', timestamp: new Date() }]
};

const MOCK_CHECKLISTS: Record<string, ChecklistItem[]> = {
    'main': [
        { id: 'c1', label: 'Completeness Check', type: 'ai', status: 'passed', description: 'Ensure all mandatory sections are present.' },
        { id: 'c2', label: 'Tone Consistency', type: 'ai', status: 'pending', description: 'Verify professional tone across all sections.' },
    ],
    '3': [
        { id: 't1', label: 'Capacity Analysis', type: 'ai', status: 'passed', description: 'Verify thresholds against current load test data.' },
        { id: 't2', label: 'DDoS Vulnerability', type: 'ai', status: 'failed', description: 'Check for potential abuse vectors.' },
    ],
    '4': [
        { id: 's1', label: 'GDPR Compliance', type: 'ai', status: 'passed', description: 'Ensure retention periods meet legal requirements.' },
        { id: 's2', label: 'Cost Estimation', type: 'manual', status: 'pending', description: 'Verify cold storage pricing model.' },
    ]
};

export const DocGenV3: React.FC = () => {
    const { showToast } = useToast();
    
    // --- Layout State ---
    const [leftTab, setLeftTab] = useState<'chat' | 'checklist'>('chat');
    const [rightTab, setRightTab] = useState<'refine' | 'debates' | 'activity'>('refine');
    
    // --- Document State ---
    const [sections, setSections] = useState<DocumentSection[]>(INITIAL_DOC);
    const [sectionMeta, setSectionMeta] = useState<Record<string, SectionMeta>>(INITIAL_META);
    const [activeSectionId, setActiveSectionId] = useState<string>('main');
    
    // --- Chat/Collaboration State ---
    const [threads, setThreads] = useState<Record<string, AgentMessage[]>>(INITIAL_THREADS);
    const [checklists, setChecklists] = useState<Record<string, ChecklistItem[]>>(MOCK_CHECKLISTS);
    const [activeParticipants, setActiveParticipants] = useState<string[]>(PARTICIPANTS.map(p => p.id));
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    
    // --- Simulation State ---
    const [debates, setDebates] = useState<Record<string, Debate>>({});
    const [hasSimulatedConflict, setHasSimulatedConflict] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Derived
    const activeSection = sections.find(s => s.id === activeSectionId);
    const currentMeta = sectionMeta[activeSectionId];
    const currentOwner = PARTICIPANTS.find(p => p.id === currentMeta?.ownerId);
    const currentChecklist = checklists[activeSectionId] || [];

    // --- Effects ---

    // Auto-scroll chat
    useEffect(() => {
        if (leftTab === 'chat' && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [threads, activeSectionId, isThinking, leftTab]);

    // Simulation: Trigger Conflict
    useEffect(() => {
        if (hasSimulatedConflict) return;

        const timer = setTimeout(() => {
            setHasSimulatedConflict(true);
            
            // 1. Update Metadata (Status -> Resolution)
            setSectionMeta(prev => ({
                ...prev,
                '3': { ...prev['3'], status: 'resolution', debateId: 'd1' }
            }));

            // 2. Create Debate Data
            setDebates(prev => ({
                ...prev,
                'd1': {
                    id: 'd1',
                    topic: 'Throughput Risk',
                    messages: [
                        { authorId: 'architect', text: '10k is conservative. Enterprise clients need 50k.', sentiment: 'neutral' },
                        { authorId: 'sentinel', text: '50k allows brute-force attacks. We need WAF upgrades first.', sentiment: 'concern' }
                    ],
                    compromise: 'Set 25k limit for Enterprise tier with Token Bucket throttling.'
                }
            }));

            // 3. Notify
            showToast('New conflict detected in "API Rate Limiting"', { type: 'warning' });

        }, 4000);

        return () => clearTimeout(timer);
    }, [hasSimulatedConflict, showToast]);

    // --- Actions ---

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        const text = input;
        setInput('');

        // Add User Message
        const userMsg: AgentMessage = { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: new Date() };
        setThreads(prev => ({
            ...prev,
            [activeSectionId]: [...(prev[activeSectionId] || []), userMsg]
        }));

        setIsThinking(true);

        // Simulate Response
        setTimeout(() => {
            const responseText = activeSectionId === 'main' 
                ? "I've broadcasted that to the team. Checking for consensus..." 
                : `I've updated the **${activeSection?.title}** section based on your feedback.`;

            setThreads(prev => ({
                ...prev,
                [activeSectionId]: [...(prev[activeSectionId] || []), { 
                    id: `a-${Date.now()}`, 
                    role: 'assistant', 
                    content: responseText, 
                    timestamp: new Date() 
                }]
            }));
            setIsThinking(false);
        }, 1000);
    };

    const handleResolveDebate = () => {
        const debate = debates['d1'];
        if (!debate) return;

        // Apply compromise
        setSections(prev => prev.map(s => {
            if (s.id === '3') {
                return { ...s, content: s.content.replace('10,000 requests', '25,000 requests (Token Bucket)') };
            }
            return s;
        }));

        // Update status
        setSectionMeta(prev => ({
            ...prev,
            '3': { ...prev['3'], status: 'approved' }
        }));

        // Log in chat
        setThreads(prev => ({
            ...prev,
            '3': [...(prev['3'] || []), { 
                id: `sys-${Date.now()}`, 
                role: 'system', 
                content: '**Debate Resolved**: Applied compromise (25k Limit). Approved by Sentinel & Architect.', 
                timestamp: new Date() 
            }]
        }));

        setRightTab('activity');
        showToast('Conflict Resolved', { type: 'success' });
    };

    const handleSectionSelect = (id: string) => {
        setActiveSectionId(id);
        
        // Ensure thread exists
        if (!threads[id]) {
            const section = sections.find(s => s.id === id);
            const owner = PARTICIPANTS.find(p => p.id === sectionMeta[id]?.ownerId);
            setThreads(prev => ({
                ...prev,
                [id]: [{
                    id: `init-${id}`,
                    role: 'assistant',
                    content: `Joined discussion for **${section?.title}**. ${owner ? `${owner.name} is the owner.` : ''}`,
                    timestamp: new Date()
                }]
            }));
        }

        // Auto-switch tab if conflict
        if (sectionMeta[id]?.status === 'resolution') {
            setRightTab('debates');
        } else {
            setRightTab('refine');
        }
    };

    const handleRunCheck = (itemId: string) => {
        setChecklists(prev => ({
            ...prev,
            [activeSectionId]: prev[activeSectionId]?.map(i => i.id === itemId ? { ...i, status: 'running' } : i) || []
        }));

        setTimeout(() => {
            const passed = Math.random() > 0.3;
            setChecklists(prev => ({
                ...prev,
                [activeSectionId]: prev[activeSectionId]?.map(i => i.id === itemId ? { ...i, status: passed ? 'passed' : 'failed' } : i) || []
            }));
            showToast(passed ? 'Check passed' : 'Check failed', { type: passed ? 'success' : 'error' });
        }, 1500);
    };

    return (
        <div className="flex h-full bg-white overflow-hidden font-sans text-slate-900">
            
            {/* --- COLUMN 1: PARTICIPANTS & CHAT/CHECKLIST (320px) --- */}
            <div className="w-[400px] bg-slate-50 border-r border-slate-200 flex flex-col z-20 shrink-0 transition-all duration-300">
                
                {/* 1. Participants Strip */}
                <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Participants</span>
                        <div className="flex -space-x-1">
                            {PARTICIPANTS.map(p => (
                                <div 
                                    key={p.id}
                                    title={`${p.name} (${p.role})`}
                                    className={cn(
                                        "w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm transition-transform hover:scale-110 hover:z-10 cursor-pointer relative",
                                        activeParticipants.includes(p.id) ? "" : "opacity-40 grayscale",
                                        p.bg, p.color
                                    )}
                                    onClick={() => {
                                        if (activeParticipants.includes(p.id)) {
                                            setActiveParticipants(prev => prev.filter(id => id !== p.id));
                                        } else {
                                            setActiveParticipants(prev => [...prev, p.id]);
                                        }
                                    }}
                                >
                                    {p.isAi ? p.icon : p.name.slice(0,2).toUpperCase()}
                                    {activeParticipants.includes(p.id) && <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border border-white rounded-full"></span>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Plus size={14}/></Button>
                </div>

                {/* 2. Thread Header & Context */}
                <div className="px-4 py-3 bg-slate-100 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            {activeSectionId !== 'main' && (
                                <button onClick={() => setActiveSectionId('main')} className="text-slate-400 hover:text-slate-600">
                                    <ChevronLeft size={14}/>
                                </button>
                            )}
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                {activeSectionId === 'main' ? 'Global Thread' : 'Section Chat'}
                            </span>
                        </div>
                        {activeSectionId !== 'main' && (
                            <Badge status={currentMeta?.status === 'resolution' ? 'error' : 'neutral'} className="text-[10px] px-1.5 py-0">
                                {currentMeta?.status}
                            </Badge>
                        )}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 truncate">
                        {activeSection?.title || 'General Discussion'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex gap-1 items-center">
                        <span>With:</span> 
                        <span className="text-slate-700 font-medium">You</span>
                        {currentOwner && <span className="text-slate-400">,</span>}
                        {currentOwner && <span className={cn("font-medium", currentOwner.color)}>{currentOwner.name}</span>}
                    </div>
                </div>

                {/* 3. View Toggle (Chat / Checklist) */}
                <div className="flex border-b border-slate-200 bg-white">
                    <button 
                        onClick={() => setLeftTab('chat')}
                        className={cn(
                            "flex-1 py-2 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-2",
                            leftTab === 'chat' ? "border-indigo-600 text-indigo-700 bg-indigo-50/30" : "border-transparent text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <MessageCircle size={14}/> Chat
                    </button>
                    <button 
                        onClick={() => setLeftTab('checklist')}
                        className={cn(
                            "flex-1 py-2 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-2",
                            leftTab === 'checklist' ? "border-indigo-600 text-indigo-700 bg-indigo-50/30" : "border-transparent text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <ListChecks size={14}/> 
                        Checklist
                        {currentChecklist.some(c => c.status === 'failed') && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        )}
                    </button>
                </div>

                {/* 4. Content Area */}
                <div className="flex-1 overflow-y-auto bg-slate-50/30 relative">
                    
                    {leftTab === 'chat' && (
                        <div className="p-4 space-y-4" ref={scrollRef}>
                            {(threads[activeSectionId] || []).map(msg => (
                                <div key={msg.id} className={cn("flex gap-2 animate-fadeIn", msg.role === 'user' ? "flex-row-reverse" : "")}>
                                    <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 text-[10px]",
                                        msg.role === 'user' ? "bg-slate-200 text-slate-600" : "bg-blue-100 text-blue-600"
                                    )}>
                                        {msg.role === 'user' ? 'ME' : <Bot size={12}/>}
                                    </div>
                                    <div className={cn(
                                        "p-2.5 rounded-2xl text-sm leading-relaxed max-w-[85%] shadow-sm",
                                        msg.role === 'user' ? "bg-white text-slate-700 rounded-tr-none border border-slate-100" : "bg-blue-600 text-white rounded-tl-none"
                                    )}>
                                        <MarkdownRenderer content={msg.content} />
                                    </div>
                                </div>
                            ))}
                            {isThinking && (
                                <div className="flex items-center gap-2 text-slate-400 text-xs ml-8 animate-pulse">
                                    <Bot size={12}/> Thinking...
                                </div>
                            )}
                        </div>
                    )}

                    {leftTab === 'checklist' && (
                        <div className="p-4 space-y-3">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Validation Rules</div>
                            {currentChecklist.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 text-sm italic">No rules defined for this section.</div>
                            ) : (
                                currentChecklist.map(item => (
                                    <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:border-indigo-300 transition-all group">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="mt-0.5 shrink-0">
                                                {item.status === 'passed' && <CheckCircle size={16} className="text-green-500"/>}
                                                {item.status === 'failed' && <AlertCircle size={16} className="text-red-500"/>}
                                                {item.status === 'running' && <Loader2 size={16} className="text-indigo-500 animate-spin"/>}
                                                {item.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={cn("text-sm font-medium truncate", item.status === 'passed' ? "text-slate-900" : "text-slate-700")}>{item.label}</h4>
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.description}</p>
                                                {item.type === 'ai' && (
                                                    <div className="mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleRunCheck(item.id)}
                                                            disabled={item.status === 'running'}
                                                            className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-colors disabled:opacity-50"
                                                        >
                                                            {item.status === 'running' ? 'Running...' : 'Run Auto-Check'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* 5. Input (Only for Chat) */}
                {leftTab === 'chat' && (
                    <div className="p-3 border-t border-slate-200 bg-white">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                placeholder={`Message ${activeSectionId === 'main' ? 'everyone' : 'thread'}...`}
                                className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                            <button onClick={handleSendMessage} className="absolute right-2 top-2 text-slate-400 hover:text-blue-600">
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- COLUMN 2: DOCUMENT (Flex) --- */}
            <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
                
                {/* Toolbar */}
                <div className="h-14 border-b border-slate-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        {activeSectionId !== 'main' && (
                            <button onClick={() => setActiveSectionId('main')} className="text-slate-400 hover:text-slate-600 mr-2">
                                <ChevronLeft size={16}/>
                            </button>
                        )}
                        <h1 className="text-sm font-semibold text-slate-900">Project Titan: Technical Strategy</h1>
                        <span className="text-slate-300">/</span>
                        <Badge status="neutral" className="text-[10px]">Draft v0.9</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">Autosaved just now</span>
                        <div className="h-4 w-px bg-slate-200 mx-2"></div>
                        <Button size="sm" variant="secondary" leftIcon={<Lock size={14}/>}>Share</Button>
                        <Button size="sm" variant="primary">Publish</Button>
                    </div>
                </div>

                {/* Document Canvas */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth">
                    <div className="max-w-3xl mx-auto min-h-[800px] space-y-8">
                        {sections.map(section => {
                            const meta = sectionMeta[section.id];
                            const owner = PARTICIPANTS.find(p => p.id === meta?.ownerId);
                            const isActive = activeSectionId === section.id;
                            const isResolution = meta?.status === 'resolution';

                            return (
                                <div 
                                    key={section.id}
                                    onClick={() => handleSectionSelect(section.id)}
                                    className={cn(
                                        "group relative pl-6 pr-4 py-4 rounded-lg transition-all duration-200 border-l-2 cursor-pointer",
                                        isActive 
                                            ? "border-blue-400 bg-blue-50/30" 
                                            : "border-transparent hover:bg-slate-50",
                                        isResolution && "border-amber-400 bg-amber-50/30"
                                    )}
                                >
                                    {/* Header Row */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {/* Margin Indicator (Resolution/Comment) */}
                                            {isResolution && (
                                                <div className="absolute -left-[5px] top-6 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white animate-pulse"></div>
                                            )}
                                            
                                            {section.type === 'heading' ? (
                                                <h1 className="text-2xl font-bold text-slate-900">{section.content}</h1>
                                            ) : (
                                                <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
                                            )}
                                        </div>

                                        {/* Status & Owner Chips (Visible on Hover or Active or Issue) */}
                                        {section.type !== 'heading' && (
                                            <div className={cn(
                                                "flex items-center gap-2 transition-opacity duration-200",
                                                isActive || isResolution ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                            )}>
                                                {owner && (
                                                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1", owner.bg, owner.color)}>
                                                        {owner.isAi && <Bot size={10}/>} Owner: {owner.name}
                                                    </span>
                                                )}
                                                
                                                <span className={cn(
                                                    "text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide",
                                                    meta?.status === 'draft' && "bg-slate-100 text-slate-500",
                                                    meta?.status === 'review' && "bg-blue-100 text-blue-700",
                                                    meta?.status === 'resolution' && "bg-amber-100 text-amber-700",
                                                    meta?.status === 'approved' && "bg-green-100 text-green-700",
                                                )}>
                                                    {meta?.status === 'resolution' ? 'Needs Resolution' : meta?.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    {section.type !== 'heading' && (
                                        <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {section.content}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* --- COLUMN 3: TOOLS & DEBATES (300px) --- */}
            <div className="w-[300px] bg-white border-l border-slate-200 flex flex-col z-20 shrink-0">
                
                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                    <button 
                        onClick={() => setRightTab('refine')}
                        className={cn("flex-1 py-3 text-xs font-medium transition-colors border-b-2", rightTab === 'refine' ? "text-blue-600 border-blue-600 bg-blue-50/50" : "text-slate-500 border-transparent hover:text-slate-700")}
                    >
                        Refine
                    </button>
                    <button 
                        onClick={() => setRightTab('debates')}
                        className={cn(
                            "flex-1 py-3 text-xs font-medium transition-colors border-b-2 relative", 
                            rightTab === 'debates' ? "text-blue-600 border-blue-600 bg-blue-50/50" : "text-slate-500 border-transparent hover:text-slate-700"
                        )}
                    >
                        Debates
                        {hasSimulatedConflict && activeSectionId === '3' && sectionMeta['3']?.status === 'resolution' && (
                            <span className="absolute top-2 right-4 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        )}
                    </button>
                    <button 
                        onClick={() => setRightTab('activity')}
                        className={cn("flex-1 py-3 text-xs font-medium transition-colors border-b-2", rightTab === 'activity' ? "text-blue-600 border-blue-600 bg-blue-50/50" : "text-slate-500 border-transparent hover:text-slate-700")}
                    >
                        Activity
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50">
                    
                    {/* VIEW: REFINE */}
                    {rightTab === 'refine' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="text-center space-y-2">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-purple-500">
                                    <Sparkles size={20}/>
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900">AI Assistant</h3>
                                <p className="text-xs text-slate-500">Select text or use quick actions to refine the content.</p>
                            </div>

                            <div className="space-y-2">
                                <Button variant="secondary" className="w-full justify-start text-xs h-9 bg-white" leftIcon={<Zap size={14}/>}>Simplify Language</Button>
                                <Button variant="secondary" className="w-full justify-start text-xs h-9 bg-white" leftIcon={<FilePen size={14}/>}>Fix Grammar & Tone</Button>
                                <Button variant="secondary" className="w-full justify-start text-xs h-9 bg-white" leftIcon={<ListChecks size={14}/>}>Expand with Examples</Button>
                            </div>
                        </div>
                    )}

                    {/* VIEW: DEBATES */}
                    {rightTab === 'debates' && (
                        <div className="space-y-4 animate-fadeIn">
                            {sectionMeta[activeSectionId]?.status === 'resolution' && debates['d1'] ? (
                                <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
                                    <div className="p-3 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
                                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                                            <AlertCircle size={12}/> Open Conflict
                                        </span>
                                        <Badge status="warning" className="text-[10px] px-1.5 py-0">High Priority</Badge>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <h4 className="text-sm font-bold text-slate-900">{debates['d1'].topic}</h4>
                                        
                                        <div className="space-y-3">
                                            {debates['d1'].messages.map((m, i) => {
                                                const author = PARTICIPANTS.find(p => p.id === m.authorId);
                                                return (
                                                    <div key={i} className="flex gap-2">
                                                        <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 mt-0.5", author?.bg, author?.color)}>
                                                            {author?.name.slice(0,1)}
                                                        </div>
                                                        <div className="text-xs text-slate-600 leading-snug">
                                                            <span className="font-semibold text-slate-900 mr-1">{author?.name}:</span>
                                                            {m.text}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <div className="flex items-center gap-1 text-xs font-bold text-purple-600 mb-1">
                                                <Sparkles size={10}/> Suggested Compromise
                                            </div>
                                            <p className="text-xs text-slate-600 leading-relaxed">
                                                {debates['d1'].compromise}
                                            </p>
                                        </div>

                                        <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white" onClick={handleResolveDebate}>
                                            Accept Compromise
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 opacity-50">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 shadow-sm">
                                        <CheckCircle size={20}/>
                                    </div>
                                    <p className="text-xs text-slate-400">No active debates for this section.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW: ACTIVITY */}
                    {rightTab === 'activity' && (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="relative pl-4 border-l border-slate-200 space-y-6">
                                {sectionMeta['3'].status === 'approved' && (
                                    <div className="relative">
                                        <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white"></div>
                                        <div className="text-xs text-slate-500 mb-0.5">Just now</div>
                                        <div className="text-sm font-medium text-slate-900">Conflict Resolved</div>
                                        <div className="text-xs text-slate-500">API Rate Limiting updated to 25k.</div>
                                    </div>
                                )}
                                {hasSimulatedConflict && (
                                    <div className="relative">
                                        <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white"></div>
                                        <div className="text-xs text-slate-500 mb-0.5">2 mins ago</div>
                                        <div className="text-sm font-medium text-slate-900">Flagged Risk</div>
                                        <div className="text-xs text-slate-500">Sentinel blocked approval on Section 3.</div>
                                    </div>
                                )}
                                <div className="relative">
                                    <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white"></div>
                                    <div className="text-xs text-slate-500 mb-0.5">10 mins ago</div>
                                    <div className="text-sm font-medium text-slate-900">Draft Created</div>
                                    <div className="text-xs text-slate-500">Initial scaffolding generated by Architect.</div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
};