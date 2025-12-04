
import React, { useState, useRef, useEffect } from 'react';
import { BrainstormSessionModel } from '../../apps/Muse';
import { Project, AgentMessage } from '../../types';
import { 
    Bot, ArrowRight, ChevronLeft, Sparkles, Plus, 
    MessageSquare, Layers, Database, MoreHorizontal,
    Maximize2, ShieldCheck, Zap
} from '../../components/icons/Icons';
import { cn } from '../../utils';
import { AgentMsg } from '../../components/ui/AgentMsg';
import { AgentInput } from '../../components/ui/AgentInput';
import { IdeaCard, Idea } from '../../components/muse/IdeaCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { UnifiedAgentSidebar } from '../../components/UnifiedAgentSidebar';

interface BrainstormSessionProps {
    session: BrainstormSessionModel;
    project?: Project;
    onBack: () => void;
    showAtlasAssistant?: boolean;
    onToggleAssistant?: () => void;
}

// Mock Idea Data
const MOCK_IDEAS: Idea[] = [
    { id: '1', content: 'Use WebSockets for real-time updates', type: 'solution', votes: 3, status: 'draft' },
    { id: '2', content: 'Latency might exceed 200ms in Asia', type: 'risk', votes: 5, status: 'promoted' },
    { id: '3', content: 'Integrate with legacy billing system?', type: 'question', votes: 1, status: 'parked' },
    { id: '4', content: 'Cache aggressively at the edge', type: 'solution', votes: 2, status: 'draft' },
];

export const BrainstormSession: React.FC<BrainstormSessionProps> = ({ session, project, onBack, showAtlasAssistant = false, onToggleAssistant = () => {} }) => {
    
    // --- State ---
    const [messages, setMessages] = useState<AgentMessage[]>([
        { 
            id: 'init', 
            role: 'assistant', 
            content: `Welcome to the **${session.method}** session for **${session.title}**. \n\nI have loaded the context from **${project?.name}**. Shall we start by defining the core problem?`, 
            timestamp: new Date() 
        }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    
    // Canvas State
    const [ideas, setIdeas] = useState<Idea[]>(MOCK_IDEAS);
    const [viewMode, setViewMode] = useState<'split' | 'canvas'>('split');

    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking, showAtlasAssistant]);

    const handleSendMessage = () => {
        if (!input.trim()) return;
        const text = input;
        setInput('');

        setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: new Date() }]);
        setIsThinking(true);

        setTimeout(() => {
            // Mock AI creating an idea from chat
            if (text.length > 20) {
                const newIdea: Idea = {
                    id: `new-${Date.now()}`,
                    content: text,
                    type: 'insight',
                    votes: 0,
                    status: 'draft'
                };
                setIdeas(prev => [...prev, newIdea]);
            }

            setMessages(prev => [...prev, { 
                id: `a-${Date.now()}`, 
                role: 'assistant', 
                content: `That's a great point. I've added it to the board as an insight. What else comes to mind regarding ${session.title}?`, 
                timestamp: new Date() 
            }]);
            setIsThinking(false);
        }, 1000);
    };

    const handlePromoteIdea = (id: string) => {
        setIdeas(prev => prev.map(i => i.id === id ? { ...i, status: 'promoted' } : i));
    };

    return (
        <div className="flex h-full bg-slate-100 overflow-hidden font-sans">
            
            {/* --- LEFT PANEL: KNOWLEDGE TOOLS (280px) --- */}
            <div className="w-[280px] bg-slate-50 border-r border-slate-200 flex flex-col z-20 shrink-0">
                <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Context & Tools</span>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreHorizontal size={16}/></Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Project Facts */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1">
                            <Database size={12}/> Project Constraints
                        </h4>
                        <div className="space-y-2">
                            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-600 shadow-sm">
                                <span className="font-bold text-slate-800 block mb-1">Budget Cap</span>
                                Total initiative budget is $50k.
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-600 shadow-sm">
                                <span className="font-bold text-slate-800 block mb-1">Timeline</span>
                                Must launch by Q3 2024.
                            </div>
                        </div>
                    </div>

                    {/* Method Tools */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1">
                            <Sparkles size={12}/> {session.method} Tools
                        </h4>
                        <div className="space-y-2">
                            <button className="w-full text-left px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium hover:border-sky-300 hover:text-sky-700 transition-colors shadow-sm">
                                🎲 Generate "What If" Scenario
                            </button>
                            <button className="w-full text-left px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium hover:border-sky-300 hover:text-sky-700 transition-colors shadow-sm">
                                🔄 Challenge Assumptions
                            </button>
                            <button className="w-full text-left px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium hover:border-sky-300 hover:text-sky-700 transition-colors shadow-sm">
                                🗳️ Auto-Cluster Ideas
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CENTER PANEL: IDEA CANVAS --- */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                
                {/* Toolbar */}
                <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 mr-2">
                            <ChevronLeft size={18}/>
                        </button>
                        
                        <h1 className="text-lg font-bold text-slate-900">{session.title}</h1>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Database size={12}/>
                            <span>{project?.name || 'Project'}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setViewMode('split')}
                                className={cn("p-1.5 rounded transition-all", viewMode === 'split' ? "bg-white shadow text-sky-600" : "text-slate-400 hover:text-slate-600")}
                                title="Split View"
                            >
                                <Layers size={16}/>
                            </button>
                            <button 
                                onClick={() => setViewMode('canvas')}
                                className={cn("p-1.5 rounded transition-all", viewMode === 'canvas' ? "bg-white shadow text-sky-600" : "text-slate-400 hover:text-slate-600")}
                                title="Canvas Only"
                            >
                                <Maximize2 size={16}/>
                            </button>
                        </div>
                        <Button size="sm" variant="primary" leftIcon={<Zap size={14}/>}>Summarize</Button>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 overflow-auto p-8 bg-slate-100 relative">
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                         style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {/* New Idea Card (Input) */}
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-sky-400 hover:bg-sky-50/20 transition-all cursor-pointer min-h-[160px] group">
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-3 group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors">
                                <Plus size={24}/>
                            </div>
                            <span className="font-medium group-hover:text-sky-700">Add New Idea</span>
                        </div>

                        {ideas.map((idea) => (
                            <IdeaCard 
                                key={idea.id} 
                                idea={idea} 
                                onPromote={() => handlePromoteIdea(idea.id)} 
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* --- RIGHT PANEL: UNIFIED AGENT SIDEBAR --- */}
            <UnifiedAgentSidebar 
                appName="Muse"
                appIcon={<Bot size={14} />}
                isAtlasOpen={showAtlasAssistant}
                onToggleAgent={onToggleAssistant}
                onNavigateGlobal={() => {}} // No-op inside session
                globalViewContext="session"
                className={cn(viewMode === 'canvas' && !showAtlasAssistant ? "w-0 overflow-hidden border-none" : "")}
            >
                {/* Internal Muse Chat Content */}
                <div className="h-full flex flex-col">
                    
                    {/* Context Bar */}
                    <div className="px-5 py-3 bg-sky-50/50 border-b border-sky-100 flex items-center gap-3 transition-all">
                        <Sparkles size={16} className="text-sky-600 shrink-0" />
                        <div className="min-w-0 flex flex-col">
                            <span className="text-[10px] font-bold text-sky-500 uppercase tracking-wider leading-none mb-1">Active Method</span>
                            <span className="text-sm font-bold text-slate-900 leading-tight truncate">{session.method}</span>
                        </div>
                    </div>

                    {/* Chat Stream */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30" ref={scrollRef}>
                        {messages.map(msg => (
                            <AgentMsg key={msg.id} message={msg} />
                        ))}
                        {isThinking && (
                            <div className="flex items-center gap-2 text-slate-400 text-xs ml-4 animate-pulse">
                                <Bot size={14}/> Thinking...
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-slate-200 bg-white">
                        <AgentInput 
                            value={input}
                            onChange={setInput}
                            onSubmit={handleSendMessage}
                            placeholder="Discuss ideas..."
                            isThinking={isThinking}
                        />
                    </div>
                </div>
            </UnifiedAgentSidebar>

        </div>
    );
};
