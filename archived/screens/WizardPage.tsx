
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { AgentMsg } from '@/components/ui/AgentMsg';
import { LayoutTemplate, FileText, ShieldCheck, ArrowRight, CheckCircle, Sparkles, Bot, Zap, Target, HelpCircle, MessageSquare } from '@/components/icons/Icons';
import { cn } from '@/utils';
import { simulateAgentInterview, fetchElicitationMethods } from '@/services/geminiService';
import { AgentMessage, ElicitationMethod } from '@/types';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { AgentInput } from '@/components/ui/AgentInput';

interface WizardPageProps {
  onOpenDocument: (id: string, context: any) => void;
  onCancel: () => void;
}

const TEMPLATES = [
    { id: 'rfc', name: 'Technical RFC', icon: <LayoutTemplate size={24}/>, desc: 'Architecture decision record & specs' },
    { id: 'brief', name: 'Product Brief', icon: <FileText size={24}/>, desc: 'Goals, scope, and timeline' },
    { id: 'audit', name: 'Security Audit', icon: <ShieldCheck size={24}/>, desc: 'Compliance and safety check' },
];

const getIcon = (name: string) => {
    switch (name) {
        case 'Zap': return <Zap size={24}/>;
        case 'Target': return <Target size={24}/>;
        case 'HelpCircle': return <HelpCircle size={24}/>;
        case 'ShieldCheck': return <ShieldCheck size={24}/>;
        case 'MessageSquare': return <MessageSquare size={24}/>;
        default: return <Sparkles size={24}/>;
    }
}

export const WizardPage: React.FC<WizardPageProps> = ({ onOpenDocument, onCancel }) => {
    const [step, setStep] = useState<'template' | 'strategy' | 'chat'>('template');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [selectedStrategy, setSelectedStrategy] = useState<string>('strat-1'); // Default to Standard
    const [strategies, setStrategies] = useState<ElicitationMethod[]>([]);
    
    // Chat State
    const [messages, setMessages] = useState<AgentMessage[]>([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [thinkingStep, setThinkingStep] = useState<string>('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch Strategies
    useEffect(() => {
        fetchElicitationMethods().then(setStrategies);
    }, []);

    // Initial Greeting when entering chat
    useEffect(() => {
        if (step === 'chat' && messages.length === 0) {
            const templateName = TEMPLATES.find(t => t.id === selectedTemplate)?.name;
            const strategyName = strategies.find(s => s.id === selectedStrategy)?.name;
            setMessages([{
                id: 'init',
                role: 'assistant',
                content: `Great choice. I'm ready to draft a **${templateName}** using the **${strategyName}** approach. To start, what is the main goal or key focus of this document?`,
                timestamp: new Date()
            }]);
        }
    }, [step, selectedTemplate, selectedStrategy, strategies, messages.length]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, thinkingStep]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: AgentMessage = { id: `u-${Date.now()}`, role: 'user', content: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        // Simulation of ContextOS "Thinking"
        const thinkSteps = ["Reading intent...", "Checking Knowledge Base...", "Applying Strategy Rules...", "Retrieving Template..."];
        
        for (const s of thinkSteps) {
            setThinkingStep(s);
            await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
        }

        try {
            const templateName = TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Document';
            const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
            
            const response = await simulateAgentInterview(history, templateName, selectedStrategy);
            
            // Add Findings as a system/intermediate message if any
            if (response.findings && response.findings.length > 0) {
                 setMessages(prev => [...prev, {
                     id: `sys-${Date.now()}`,
                     role: 'system',
                     content: `Agent Reasoning:\n${response.findings?.map(f => `• ${f}`).join('\n')}`,
                     timestamp: new Date()
                 }]);
            }

            // Agent Reply
            const agentMsg: AgentMessage = { 
                id: `a-${Date.now()}`, 
                role: 'assistant', 
                content: response.text, 
                timestamp: new Date(),
                actions: response.text.includes("Shall I proceed") ? [
                    { label: "Generate Draft", actionId: "generate", variant: "primary" }
                ] : undefined
            };
            setMessages(prev => [...prev, agentMsg]);

        } catch (e) {
            console.error(e);
        } finally {
            setIsThinking(false);
            setThinkingStep('');
        }
    };

    const handleAction = (actionId: string) => {
        if (actionId === 'generate') {
            // Handoff to Workspace
            onOpenDocument('new', {
                templateId: selectedTemplate,
                userIntent: messages.map(m => m.content).join('\n'), // Pass full context
                title: `New ${TEMPLATES.find(t => t.id === selectedTemplate)?.name}`
            });
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 animate-fadeIn relative">
            
            {/* Header */}
            <header className="h-16 px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                        <Sparkles size={16} />
                    </div>
                    <h1 className="font-semibold text-slate-900">New Document Wizard</h1>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                         <div className={cn("w-2 h-2 rounded-full", step === 'template' ? "bg-primary-600" : "bg-primary-200")}></div>
                         <div className={cn("w-2 h-2 rounded-full", step === 'strategy' ? "bg-primary-600" : (step === 'chat' ? "bg-primary-200" : "bg-slate-200"))}></div>
                         <div className={cn("w-2 h-2 rounded-full", step === 'chat' ? "bg-primary-600" : "bg-slate-200")}></div>
                    </div>
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                </div>
            </header>

            <div className="flex-1 overflow-hidden flex flex-col items-center justify-center p-6">
                
                {/* STEP 1: Template Selection */}
                {step === 'template' && (
                    <div className="max-w-4xl w-full space-y-8 animate-slideInRight">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900">What are we building today?</h2>
                            <p className="text-slate-500">Select a template to configure the AI's validation rules and structure.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {TEMPLATES.map(t => (
                                <div 
                                    key={t.id}
                                    onClick={() => setSelectedTemplate(t.id)}
                                    className={cn(
                                        "p-6 border rounded-xl cursor-pointer transition-all flex flex-col items-center text-center gap-4 group hover:shadow-lg",
                                        selectedTemplate === t.id 
                                            ? "border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/20" 
                                            : "border-slate-200 bg-white hover:border-primary-300"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                                        selectedTemplate === t.id ? "bg-primary-100 text-primary-600" : "bg-slate-100 text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600"
                                    )}>
                                        {t.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{t.name}</h3>
                                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{t.desc}</p>
                                    </div>
                                    <div className={cn(
                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center mt-auto",
                                        selectedTemplate === t.id ? "border-primary-500 bg-primary-500 text-white" : "border-slate-200"
                                    )}>
                                        {selectedTemplate === t.id && <CheckCircle size={14} />}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center pt-8">
                            <Button 
                                size="lg" 
                                disabled={!selectedTemplate}
                                onClick={() => setStep('strategy')}
                                rightIcon={<ArrowRight size={18} />}
                                className="px-8"
                            >
                                Next Step
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Strategy Selection */}
                {step === 'strategy' && (
                    <div className="max-w-4xl w-full space-y-8 animate-slideInRight">
                        <div className="text-center space-y-2">
                            <button onClick={() => setStep('template')} className="text-sm text-primary-600 hover:underline mb-2">← Back to Templates</button>
                            <h2 className="text-2xl font-bold text-slate-900">How should we brainstorm?</h2>
                            <p className="text-slate-500">Choose an elicitation method to guide the AI's questioning style.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {strategies.map(s => (
                                <div 
                                    key={s.id}
                                    onClick={() => setSelectedStrategy(s.id)}
                                    className={cn(
                                        "p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-3 group hover:shadow-md",
                                        selectedStrategy === s.id 
                                            ? "border-brand-ai-500 bg-brand-ai-50/50 ring-2 ring-brand-ai-500/20" 
                                            : "border-slate-200 bg-white hover:border-brand-ai-300"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                        selectedStrategy === s.id ? "bg-brand-ai-100 text-brand-ai-600" : "bg-slate-100 text-slate-500"
                                    )}>
                                        {getIcon(s.icon)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
                                            {s.complexity === 'high' && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Advanced</span>}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center pt-8">
                            <Button 
                                size="lg" 
                                disabled={!selectedStrategy}
                                onClick={() => setStep('chat')}
                                rightIcon={<ArrowRight size={18} />}
                                className="px-8 bg-brand-ai-600 hover:bg-brand-ai-700"
                            >
                                Start Interview
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Context Chat */}
                {step === 'chat' && (
                    <div className="max-w-2xl w-full h-full flex flex-col animate-slideInRight">
                        
                        {/* Selected Context Pill */}
                        <div className="flex justify-center mb-6 shrink-0 gap-2">
                            <div className="bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 text-sm text-slate-600">
                                <LayoutTemplate size={14} className="text-primary-500"/>
                                <span className="font-semibold text-slate-900">{TEMPLATES.find(t => t.id === selectedTemplate)?.name}</span>
                            </div>
                            <div className="bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 text-sm text-slate-600">
                                <Zap size={14} className="text-brand-ai-500"/>
                                <span className="font-semibold text-slate-900">{strategies.find(s => s.id === selectedStrategy)?.name}</span>
                            </div>
                        </div>

                        {/* Chat Window */}
                        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                                {messages.map(msg => (
                                    <div key={msg.id} className="animate-fadeIn">
                                        {/* Render Agent/User Message */}
                                        {msg.role !== 'system' && (
                                            <div className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                                                    msg.role === 'assistant' ? "bg-brand-ai-100 text-brand-ai-600" : "bg-slate-100 text-slate-600"
                                                )}>
                                                    {msg.role === 'assistant' ? <Bot size={18} /> : <div className="text-xs font-bold">You</div>}
                                                </div>
                                                <div className="space-y-3 max-w-[85%]">
                                                    <div className={cn(
                                                        "p-4 text-sm leading-relaxed shadow-sm",
                                                        msg.role === 'assistant' 
                                                            ? "bg-slate-50 text-slate-800 rounded-2xl rounded-tl-none border border-slate-100" 
                                                            : "bg-primary-600 text-white rounded-2xl rounded-tr-none"
                                                    )}>
                                                        <MarkdownRenderer content={msg.content} />
                                                    </div>
                                                    {msg.actions && (
                                                        <div className="flex gap-2">
                                                            {msg.actions.map(action => (
                                                                <Button 
                                                                    key={action.actionId} 
                                                                    onClick={() => handleAction(action.actionId)}
                                                                    variant={action.variant}
                                                                    size="sm"
                                                                >
                                                                    {action.label}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Render System Message (Findings) */}
                                        {msg.role === 'system' && (
                                            <div className="flex justify-center my-2">
                                                <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg flex items-start gap-2 max-w-md">
                                                     <Sparkles size={14} className="text-brand-ai-500 mt-0.5 shrink-0" />
                                                     <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans">{msg.content}</pre>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {isThinking && (
                                    <div className="flex gap-4 animate-pulse">
                                         <div className="w-8 h-8 rounded-full bg-brand-ai-100 flex items-center justify-center shrink-0">
                                            <Bot size={18} className="text-brand-ai-600" />
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1.5">
                                            <span className="w-2 h-2 rounded-full bg-brand-ai-500 animate-bounce"></span>
                                            {thinkingStep || "Thinking..."}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50">
                                <AgentInput 
                                    value={input}
                                    onChange={setInput}
                                    onSubmit={handleSend}
                                    placeholder="Type your answer..."
                                    isThinking={isThinking}
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
