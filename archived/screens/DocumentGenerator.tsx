

import React, { useState, useRef, useEffect } from 'react';
import { AgentMsg } from '@/components/ui/AgentMsg';
import { Button } from '@/components/ui/Button';
import { DocumentViewer } from '@/components/DocumentViewer';
import { DocumentSection, AgentMessage } from '@/types';
import { Bot, ArrowRight, Sparkles, FilePen, ChevronRight } from '@/components/icons/Icons';
import { cn, generateId } from '@/utils';
import { useToast } from '@/components/ui/Toast';

// Mock Templates
const LOAN_TEMPLATE: DocumentSection[] = [
    { id: '1', type: 'heading', content: 'Loan Agreement', status: 'draft' },
    { id: '2', type: 'text', title: 'Parties', content: 'This Loan Agreement ("Agreement") is made effective as of [Date], by and between [Lender Name] ("Lender") and [Borrower Name] ("Borrower").', status: 'draft' },
    { id: '3', type: 'text', title: 'Loan Amount', content: 'The Lender promises to loan the Borrower the principal sum of $[Amount] (the "Loan").', status: 'draft' },
    { id: '4', type: 'text', title: 'Repayment Terms', content: 'The Borrower agrees to repay the Loan in full, including interest, by [Repayment Date].', status: 'draft' },
];

const PRD_TEMPLATE: DocumentSection[] = [
    { id: '1', type: 'heading', content: 'Product Requirements Document', status: 'draft' },
    { id: '2', type: 'text', title: 'Problem Statement', content: 'Clearly define the problem we are solving for the user. What is the pain point?', status: 'draft' },
    { id: '3', type: 'text', title: 'Goals & Success Metrics', content: '1. Increase user engagement by X%\n2. Reduce churn by Y%', status: 'draft' },
    { id: '4', type: 'text', title: 'User Stories', content: '- As a user, I want to [feature] so that I can [benefit].\n- As an admin, I want to...', status: 'draft' },
];

const ARCH_DOC_TEMPLATE: DocumentSection[] = [
    { id: '1', type: 'heading', content: 'Architecture Decision Record', status: 'draft' },
    { id: '2', type: 'text', title: 'Context', content: 'What is the issue that we are seeing that motivates this decision?', status: 'draft' },
    { id: '3', type: 'text', title: 'Decision', content: 'We will use [Technology/Pattern] because...', status: 'draft' },
    { id: '4', type: 'text', title: 'Consequences', content: 'Positive: Faster development.\nNegative: Learning curve.', status: 'draft' },
];

export const DocumentGenerator: React.FC = () => {
    const { showToast } = useToast();
    
    // --- Chat State ---
    const [messages, setMessages] = useState<AgentMessage[]>([
        { 
            id: 'init', 
            role: 'assistant', 
            content: 'I am your Documentation Co-pilot. I can help you draft Loan Agreements, PRDs, Architecture Specs, and more. \n\nWhat would you like to create today?', 
            timestamp: new Date() 
        }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // --- Document State ---
    const [sections, setSections] = useState<DocumentSection[]>([]);
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [docTitle, setDocTitle] = useState('Untitled Document');

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: AgentMessage = { id: `u-${Date.now()}`, role: 'user', content: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        // Simple Keyword-based Mock Logic
        setTimeout(() => {
            const lowerInput = userMsg.content.toLowerCase();
            let botResponse = "I'm not sure how to generate that type of document yet. Try 'Loan Agreement', 'PRD', or 'Architecture Doc'.";
            
            // 1. Generate New Document
            if (lowerInput.includes('loan') || lowerInput.includes('agreement')) {
                setSections(LOAN_TEMPLATE);
                setDocTitle('Loan Agreement');
                botResponse = "I've drafted a standard Loan Agreement structure for you. \n\nPlease tell me the **Borrower Name** and **Loan Amount** to fill in the details.";
            } 
            else if (lowerInput.includes('prd') || lowerInput.includes('product')) {
                setSections(PRD_TEMPLATE);
                setDocTitle('Product Requirements Document');
                botResponse = "Started a new PRD. What is the core **Problem Statement** we are addressing?";
            }
            else if (lowerInput.includes('arch') || lowerInput.includes('decision')) {
                setSections(ARCH_DOC_TEMPLATE);
                setDocTitle('Architecture Decision Record');
                botResponse = "Drafted an ADR template. What is the key **Technical Decision** being made?";
            }
            // 2. Refine Existing Document (Mock)
            else if (sections.length > 0) {
                if (lowerInput.includes('late fee') || lowerInput.includes('interest')) {
                    const newSection: DocumentSection = { 
                        id: generateId(), 
                        type: 'text', 
                        title: 'Late Fees', 
                        content: 'If a payment is more than 5 days late, a fee of 5% of the outstanding amount will be charged.', 
                        status: 'draft' 
                    };
                    setSections(prev => [...prev, newSection]);
                    botResponse = "I've added a **Late Fees** clause to the agreement.";
                } else if (lowerInput.includes('john doe') || lowerInput.includes('$')) {
                    // Very simple find/replace mock
                    const newSections = sections.map(s => ({
                        ...s,
                        content: s.content.replace('[Borrower Name]', 'John Doe').replace('[Amount]', '5,000')
                    }));
                    setSections(newSections);
                    botResponse = "Updated the document with the borrower details and loan amount.";
                } else {
                    botResponse = "I've noted that context. Is there a specific section you'd like me to draft or modify?";
                }
            }

            setMessages(prev => [...prev, { 
                id: `a-${Date.now()}`, 
                role: 'assistant', 
                content: botResponse, 
                timestamp: new Date() 
            }]);
            setIsThinking(false);
        }, 1200);
    };

    // Refinement Handler (from DocumentViewer)
    const handleRefineSection = async (id: string, action: 'simplify' | 'expand' | 'tone' | 'fix') => {
        // Mock AI refinement
        await new Promise(r => setTimeout(r, 1000));
        setSections(prev => prev.map(s => {
            if (s.id === id) {
                return { 
                    ...s, 
                    content: s.content + (action === 'expand' ? ' [Expanded details added by AI...]' : ' [Refined by AI]') 
                };
            }
            return s;
        }));
        showToast('Section Refined', { type: 'success' });
    };

    const handleQuickAction = (action: string) => {
        setInput(action);
        handleSendMessage(); // Auto-send isn't strictly React-safe with setInput async, but works for mock
        // Better to extract the logic into a separate function that takes the string directly, 
        // but for this demo trigger, we'll just let the user click send or hit enter if it populates.
        // Actually, let's just bypass input state for the trigger:
        /* 
           Ideally we'd call a function `processInput(action)` directly. 
           But since `handleSendMessage` reads from state `input`, 
           we will just simulate the user typing for now or just manually call logic.
           Let's just populate input for UX clarity.
        */
    };

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden">
            
            {/* --- LEFT PANEL: CHAT CO-PILOT --- */}
            <div className="w-[400px] flex flex-col border-r border-slate-200 bg-white z-10 shadow-xl">
                
                {/* Header */}
                <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100 shrink-0 bg-slate-50/50">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                        <FilePen size={16}/>
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-900 leading-tight">Doc Gen</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-slate-500">AI Co-pilot Active</span>
                        </div>
                    </div>
                </div>

                {/* Chat Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white" ref={scrollRef}>
                    {messages.map(msg => (
                        <div key={msg.id} className={cn("flex gap-3 animate-fadeIn", msg.role === 'user' ? "flex-row-reverse" : "")}>
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                                msg.role === 'assistant' ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-600"
                            )}>
                                {msg.role === 'assistant' ? <Bot size={16} /> : <div className="text-xs font-bold">You</div>}
                            </div>
                            <div className={cn("flex-1 max-w-[85%]", msg.role === 'user' ? "text-right" : "")}>
                                <div className={cn(
                                    "p-3 rounded-2xl shadow-sm text-sm leading-relaxed inline-block text-left",
                                    msg.role === 'assistant' 
                                        ? "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100" 
                                        : "bg-indigo-600 text-white rounded-tr-none"
                                )}>
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex items-center gap-2 text-slate-400 text-xs ml-11 animate-pulse">
                            <Bot size={14} /> Drafting...
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                    {messages.length === 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
                            <button onClick={() => setInput("Draft a Loan Agreement")} className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm">
                                📝 Loan Agreement
                            </button>
                            <button onClick={() => setInput("Create a PRD")} className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm">
                                🚀 Product Brief
                            </button>
                            <button onClick={() => setInput("Write an Architecture Spec")} className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm">
                                🏗️ Tech Spec
                            </button>
                        </div>
                    )}
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
                            placeholder="Describe what you want to write..." 
                            className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm resize-none h-[52px] max-h-32 overflow-hidden"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isThinking}
                            className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- RIGHT PANEL: LIVE DOCUMENT --- */}
            <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col">
                
                {sections.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-200">
                            <Sparkles size={48} className="text-slate-300"/>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900">Ready to Draft</h2>
                        <p className="text-slate-500 max-w-sm mt-2">
                            Select a document type in the chat to begin. The AI will generate a live preview here.
                        </p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth">
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span className="font-semibold text-slate-900">{docTitle}</span>
                                    <ChevronRight size={14}/>
                                    <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Draft</span>
                                </div>
                                <div className="text-xs text-slate-400">Last saved just now</div>
                            </div>
                            
                            <DocumentViewer 
                                sections={sections}
                                activeSectionId={activeSectionId}
                                onSectionClick={setActiveSectionId}
                                onRefineSection={handleRefineSection}
                                onApproveSection={() => {}}
                            />
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};