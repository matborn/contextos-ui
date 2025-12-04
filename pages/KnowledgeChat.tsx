
import React, { useState, useRef, useEffect } from 'react';
import { AgentMessage } from '../types';
import { Bot, Sparkles, Database, Search } from '../components/icons/Icons';
import { cn } from '../utils';
import { getAgentResponse } from '../services/geminiService';
import { MarkdownRenderer } from '../components/ui/MarkdownRenderer';
import { AgentInput } from '../components/ui/AgentInput';

export const KnowledgeChat: React.FC = () => {
    const [messages, setMessages] = useState<AgentMessage[]>([
        { 
            id: 'welcome', 
            role: 'assistant', 
            content: 'Hello. I have access to the entire **Project Titan** knowledge graph. You can ask me to summarize facts, list risks, or explain decisions.', 
            timestamp: new Date() 
        }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: AgentMessage = { id: `u-${Date.now()}`, role: 'user', content: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        try {
            // Simulate network/graph query delay
            await new Promise(resolve => setTimeout(resolve, 800));
            const responseText = await getAgentResponse(userMsg.content);
            
            const agentMsg: AgentMessage = { 
                id: `a-${Date.now()}`, 
                role: 'assistant', 
                content: responseText, 
                timestamp: new Date() 
            };
            setMessages(prev => [...prev, agentMsg]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsThinking(false);
        }
    };

    const handleQuickPrompt = (prompt: string) => {
        setInput(prompt);
        // Optional: auto-send if desired, but user might want to edit
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative">
            
            {/* Header */}
            <header className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                        <Sparkles size={16} />
                    </div>
                    <div>
                        <h1 className="font-semibold text-slate-900">Knowledge Query</h1>
                        <p className="text-xs text-slate-500">Search the graph using natural language</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-hidden flex flex-col max-w-3xl mx-auto w-full">
                
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth" ref={scrollRef}>
                    {messages.map(msg => (
                        <div key={msg.id} className="animate-fadeIn">
                            <div className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                                    msg.role === 'assistant' ? "bg-slate-200 text-slate-600" : "bg-primary-100 text-primary-600"
                                )}>
                                    {msg.role === 'assistant' ? <Bot size={18} /> : <div className="text-xs font-bold">You</div>}
                                </div>
                                <div className="space-y-2 max-w-[85%]">
                                    <div className={cn(
                                        "p-4 text-sm leading-relaxed shadow-sm",
                                        msg.role === 'assistant' 
                                            ? "bg-white text-slate-800 rounded-2xl rounded-tl-none border border-slate-200" 
                                            : "bg-primary-600 text-white rounded-2xl rounded-tr-none"
                                    )}>
                                        <MarkdownRenderer content={msg.content} />
                                    </div>
                                    {msg.role === 'assistant' && (
                                        <div className="flex gap-2 text-xs text-slate-400 pl-1">
                                            <span className="flex items-center gap-1"><Database size={10}/> Checked 142 atoms</span>
                                            <span>•</span>
                                            <span>85% confidence</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isThinking && (
                        <div className="flex gap-4 animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                <Bot size={18} className="text-slate-500" />
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                                <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                                    <Search size={12} className="animate-spin"/> Traversing Graph...
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-slate-50">
                    
                    {messages.length < 3 && (
                        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
                            <button onClick={() => handleQuickPrompt("What are the key risks for the Payment Gateway?")} className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-colors">
                                ⚠️ Payment Gateway Risks
                            </button>
                            <button onClick={() => handleQuickPrompt("Summarize the architectural decisions made last week.")} className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-colors">
                                🏛️ Recent Decisions
                            </button>
                            <button onClick={() => handleQuickPrompt("Who is the approver for Security protocols?")} className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-colors">
                                👤 Security Approver
                            </button>
                        </div>
                    )}

                    <AgentInput 
                        value={input}
                        onChange={setInput}
                        onSubmit={handleSend}
                        placeholder="Ask a question about your knowledge base..."
                        isThinking={isThinking}
                        autoFocus
                    />
                    
                    <div className="text-[10px] text-center text-slate-400 mt-2">
                        ContextOS can make mistakes. Verify critical info.
                    </div>
                </div>
            </div>
        </div>
    );
};
