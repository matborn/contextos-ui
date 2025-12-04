
import React, { useState, useRef, useEffect } from 'react';
import { AgentMessage } from '../types';
import { Bot, X, Sparkles, Plus } from './icons/Icons';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { AgentMsg } from './ui/AgentMsg';
import { AgentInput } from './ui/AgentInput';
import { cn } from '../utils';

interface GlobalAssistantProps {
    isOpen?: boolean; // Optional if embedded
    onClose?: () => void;
    onNavigate: (viewId: string) => void;
    onCreateWorkspace?: (name: string, visibility: 'private' | 'public' | 'protected') => void;
    embedded?: boolean; // New prop to enable embedded mode
    className?: string; // Allow custom classes
    appName?: string;
    currentView?: string;
}

export const GlobalAssistant: React.FC<GlobalAssistantProps> = ({ 
    isOpen, onClose, onNavigate, onCreateWorkspace, embedded = false, className,
    appName = 'Atlas', currentView 
}) => {
    
    const getGreeting = (name: string, view?: string): string => {
        if (name === 'Scriptor') {
            if (view === 'editor') {
                return "I'm ready to assist with this document. I can check for conflicts, suggest revisions, or pull data from Atlas.";
            }
            return "Hi, I am Atlas. In Scriptor, I can help you draft new documents, find templates, or summarize your spaces.";
        }
        if (name === 'LifeOS') {
            return "Hi, I am Atlas. I can help you model financial scenarios, track assets, or analyze your cashflow.";
        }
        if (name === 'App Builder') {
            return "Hi, I am Atlas. I can help you generate dashboards, configure widgets, or build custom views.";
        }
        // Default (Atlas / ContextOS)
        return "Hi, I am Atlas. I can help you navigate, find knowledge, or create workspaces. How can I help?";
    };

    const [messages, setMessages] = useState<AgentMessage[]>([
        { id: 'init', role: 'assistant', content: getGreeting(appName, currentView), timestamp: new Date() }
    ]);
    
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Widget State for "Create Workspace" flow
    const [workspaceDraft, setWorkspaceDraft] = useState<{name: string, visibility: 'private' | 'public' | 'protected'} | null>(null);

    // Update greeting when context changes, but only if the user hasn't started chatting yet
    useEffect(() => {
        if (messages.length === 1 && messages[0].role === 'assistant') {
            setMessages([{ 
                id: 'init', 
                role: 'assistant', 
                content: getGreeting(appName, currentView), 
                timestamp: new Date() 
            }]);
        }
    }, [appName, currentView]);

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

        // Process Intent
        setTimeout(() => {
            const lower = userMsg.content.toLowerCase();
            let botMsg: AgentMessage;

            if (lower.includes('create') && lower.includes('workspace')) {
                setWorkspaceDraft({ name: '', visibility: 'private' });
                botMsg = { 
                    id: `a-${Date.now()}`, 
                    role: 'assistant', 
                    content: 'I can help with that. Please fill out the details below to initialize a new knowledge domain.', 
                    timestamp: new Date() 
                };
            } else if (lower.includes('setting')) {
                botMsg = { id: `a-${Date.now()}`, role: 'assistant', content: 'Navigating to Settings...', timestamp: new Date() };
                onNavigate('settings');
            } else if (lower.includes('home')) {
                botMsg = { id: `a-${Date.now()}`, role: 'assistant', content: 'Taking you to Atlas Home.', timestamp: new Date() };
                onNavigate('landing');
            } else {
                botMsg = { 
                    id: `a-${Date.now()}`, 
                    role: 'assistant', 
                    content: 'I can search the knowledge base for that, or help you manage workspaces. Try asking to "Create a workspace".', 
                    timestamp: new Date() 
                };
            }

            setMessages(prev => [...prev, botMsg]);
            setIsThinking(false);
        }, 800);
    };

    const confirmCreateWorkspace = () => {
        if (workspaceDraft && workspaceDraft.name && onCreateWorkspace) {
            onCreateWorkspace(workspaceDraft.name, workspaceDraft.visibility);
            setWorkspaceDraft(null);
            setMessages(prev => [...prev, {
                id: `sys-${Date.now()}`,
                role: 'system',
                content: `Workspace "${workspaceDraft.name}" created successfully.`,
                timestamp: new Date()
            }]);
        }
    };

    return (
        <div className={cn(
            embedded ? "h-full flex flex-col bg-white" : "fixed inset-y-0 right-0 w-[400px] bg-white border-l border-slate-200 z-30 transform transition-transform duration-300 shadow-2xl flex flex-col top-[56px]",
            !embedded && (isOpen ? "translate-x-0" : "translate-x-full"),
            className
        )}>
            {/* Header (Only show if NOT embedded, or if we want a specific header for embedded) */}
            {!embedded && (
                <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 bg-white shrink-0">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-blue-600" size={18} />
                        <span className="font-semibold text-slate-900">Atlas Assistant</span>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors">
                            <X size={18} />
                        </button>
                    )}
                </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50" ref={scrollRef}>
                {messages.map(msg => (
                    <div key={msg.id} className="animate-fadeIn">
                        <AgentMsg message={msg} />
                        
                        {/* Interactive Widget Injection */}
                        {msg.content.includes('fill out the details') && workspaceDraft && (
                            <div className="ml-11 mt-3 p-4 bg-white border border-blue-100 rounded-xl shadow-sm space-y-4 animate-slideInRight">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Plus size={12}/> New Workspace
                                </h4>
                                <Input 
                                    label="Name" 
                                    placeholder="e.g. Engineering Q4" 
                                    value={workspaceDraft.name}
                                    onChange={(e) => setWorkspaceDraft({...workspaceDraft, name: e.target.value})}
                                />
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Visibility</label>
                                    <div className="flex gap-2">
                                        {(['private', 'protected', 'public'] as const).map(vis => (
                                            <button
                                                key={vis}
                                                onClick={() => setWorkspaceDraft({...workspaceDraft, visibility: vis})}
                                                className={cn(
                                                    "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors capitalize",
                                                    workspaceDraft.visibility === vis 
                                                        ? "bg-blue-600 text-white border-blue-600" 
                                                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                                )}
                                            >
                                                {vis}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Button 
                                    className="w-full" 
                                    onClick={confirmCreateWorkspace}
                                    disabled={!workspaceDraft.name}
                                >
                                    Create Workspace
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
                {isThinking && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs ml-11 animate-pulse">
                        <Bot size={14} /> Processing...
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 bg-white">
                <AgentInput 
                    value={input}
                    onChange={setInput}
                    onSubmit={handleSendMessage}
                    placeholder="Ask Atlas..."
                    isThinking={isThinking}
                    autoFocus={!embedded} // Don't autofocus if embedded to avoid jumping
                />
            </div>
        </div>
    );
};
