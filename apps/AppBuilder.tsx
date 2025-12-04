
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import { NavItem, ViewSpec, DashboardSpec, AgentMessage } from '../types';
import { LayoutTemplate, Clock, Wand2, Sparkles, Bot, Plus, Pin, Layers, ChevronLeft } from '../components/icons/Icons';
import { ViewRenderer } from '../components/app-builder/ViewRenderer';
import { generateViewFromIntent, generateInitialDashboard } from '../services/appBuilderService';
import { useToast } from '../components/ui/Toast';
import { AgentMsg } from '../components/ui/AgentMsg';
import { DesignSystem } from '../screens/DesignSystem';
import { AiPlayground } from '../screens/AiPlayground';
import { AgentInput } from '../components/ui/AgentInput';
import { Button } from '../components/ui/Button';

interface AppBuilderProps {
    onExit: () => void;
    onLaunch: (appId: string) => void;
}

export const AppBuilder: React.FC<AppBuilderProps> = ({ onExit, onLaunch }) => {
    const { showToast } = useToast();
    const [currentView, setCurrentView] = useState('builder');
    const [dashboardSpec, setDashboardSpec] = useState<DashboardSpec | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Chat State
    const [messages, setMessages] = useState<AgentMessage[]>([
        { id: '1', role: 'assistant', content: 'I have prepared your morning dashboard based on recent activity. You can pin widgets to keep them, or ask me to change the view.', timestamp: new Date() }
    ]);
    const [chatInput, setChatInput] = useState('');
    const chatScrollRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        const loadInitial = async () => {
            const spec = await generateInitialDashboard();
            setDashboardSpec(spec);
        };
        loadInitial();
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [messages, isGenerating]);

    const handleFreezeToggle = (componentId: string) => {
        if (!dashboardSpec) return;

        const toggleInComponents = (components: ViewSpec[]): ViewSpec[] => {
            return components.map(c => {
                if (c.id === componentId) {
                    const newStatus = !c.isFrozen;
                    if (newStatus) showToast('Widget Frozen', { type: 'info', duration: 1500 });
                    return { ...c, isFrozen: newStatus };
                }
                if (c.type === 'dashboard') {
                    return { ...c, components: toggleInComponents((c as DashboardSpec).components) } as DashboardSpec;
                }
                return c;
            });
        };

        setDashboardSpec(prev => prev ? { ...prev, components: toggleInComponents(prev.components) } as DashboardSpec : null);
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;

        const userText = chatInput;
        setChatInput('');
        
        // Add User Message
        const userMsg: AgentMessage = { id: `u-${Date.now()}`, role: 'user', content: userText, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setIsGenerating(true);

        try {
            // 1. Get new AI spec based on intent
            const newSpecRoot = await generateViewFromIntent(userText);
            
            // 2. Merge Logic: Preserve frozen widgets
            setDashboardSpec(prevSpec => {
                if (!prevSpec) return newSpecRoot as DashboardSpec;

                // Flatten current frozen components
                const frozenComponents: ViewSpec[] = [];
                const extractFrozen = (comps: ViewSpec[]) => {
                    comps.forEach(c => {
                        if (c.isFrozen) frozenComponents.push(c);
                        if (c.type === 'dashboard') extractFrozen((c as DashboardSpec).components);
                    });
                };
                extractFrozen(prevSpec.components);

                // If new spec is dashboard, prepend frozen items. 
                // If new spec is single component, wrap in dashboard with frozen items.
                let mergedSpec: DashboardSpec;
                if (newSpecRoot.type === 'dashboard') {
                    mergedSpec = {
                        ...newSpecRoot as DashboardSpec,
                        components: [...frozenComponents, ...(newSpecRoot as DashboardSpec).components]
                    };
                } else {
                    mergedSpec = {
                        ...prevSpec, // Keep layout settings of previous dashboard
                        components: [...frozenComponents, newSpecRoot]
                    };
                }
                return mergedSpec;
            });

            // 3. Add AI Response
            const aiMsg: AgentMessage = { 
                id: `a-${Date.now()}`, 
                role: 'assistant', 
                content: `I've updated the dashboard. I kept your ${dashboardSpec?.components.filter(c => c.isFrozen).length || 0} pinned widgets and added new views for context.`, 
                timestamp: new Date() 
            };
            setMessages(prev => [...prev, aiMsg]);

        } catch (e) {
            showToast('Failed to update dashboard', { type: 'error' });
        } finally {
            setIsGenerating(false);
        }
    };

    const NAV_ITEMS: NavItem[] = [
        { id: 'builder', label: 'Dynamic Dashboard', icon: <LayoutTemplate size={16} /> },
        { id: 'history', label: 'History', icon: <Clock size={16} /> },
        { id: 'design-system', label: 'Design System', icon: <Layers size={16} /> },
        { id: 'ai-playground', label: 'AI Generator', icon: <Wand2 size={16} /> },
    ];

    const renderContent = () => {
        if (currentView === 'design-system') return <DesignSystem />;
        if (currentView === 'ai-playground') return <AiPlayground />;
        
        // Default Builder View
        return (
            <div className="flex h-full bg-slate-100 overflow-hidden">
                
                {/* LEFT: Dynamic Dashboard (Canvas) */}
                <div className="flex-1 flex flex-col relative overflow-hidden">
                    
                    {/* Inner Navigation Header */}
                    <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-10">
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={onExit} 
                                className="text-slate-500 hover:text-slate-900 -ml-2 gap-1 pl-1 pr-3"
                            >
                                <ChevronLeft size={16}/> Back
                            </Button>
                            <div className="h-4 w-px bg-slate-200"></div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-500 font-medium">App Builder</span>
                                <span className="text-slate-300">/</span>
                                <span className="font-bold text-slate-900">{dashboardSpec?.title || 'Untitled Dashboard'}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="sm" variant="secondary">Preview</Button>
                            <Button size="sm" variant="primary">Publish App</Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 relative">
                        {dashboardSpec ? (
                            <div className="max-w-6xl mx-auto animate-fadeIn">
                                <div className="mb-6 flex justify-between items-end">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-2xl font-bold text-slate-900">{dashboardSpec.title}</h2>
                                            {isGenerating && <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full"><Sparkles size={12}/> Updating...</div>}
                                        </div>
                                        <p className="text-slate-500 text-sm">{dashboardSpec.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="text-xs font-medium text-slate-400 flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
                                            <Pin size={12} className="text-blue-500"/>
                                            {dashboardSpec.components.filter(c => c.isFrozen).length} Pinned
                                        </div>
                                    </div>
                                </div>
                                
                                <ViewRenderer spec={dashboardSpec} onToggleFreeze={handleFreezeToggle} />
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6">
                                <div className="w-10 h-10 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                <p>Initializing Context...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Conversational Copilot (Sidebar) */}
                <div className="w-[400px] bg-white border-l border-slate-200 flex flex-col shadow-xl z-20">
                    {/* Copilot Header */}
                    <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50/50">
                        <div className="flex items-center gap-2 font-semibold text-slate-900">
                            <Bot size={18} className="text-indigo-600"/>
                            Copilot
                        </div>
                        <button className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">
                            <Plus size={12}/> New Chat
                        </button>
                    </div>

                    {/* Chat Stream */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30" ref={chatScrollRef}>
                        {messages.map(msg => (
                            <AgentMsg key={msg.id} message={msg} />
                        ))}
                        {isGenerating && (
                            <div className="flex gap-2 items-center text-xs text-slate-400 ml-10 animate-pulse">
                                <Sparkles size={12} /> Generating UI...
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-slate-200 bg-white">
                        <AgentInput 
                            value={chatInput}
                            onChange={setChatInput}
                            onSubmit={handleSendMessage}
                            placeholder="Ask to change the dashboard..."
                            isThinking={isGenerating}
                        />
                        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            <button onClick={() => setChatInput("Show me recent spending")} className="whitespace-nowrap px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 rounded text-xs transition-colors border border-slate-200">
                                📊 Recent Spending
                            </button>
                            <button onClick={() => setChatInput("Add a loan calculator")} className="whitespace-nowrap px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 rounded text-xs transition-colors border border-slate-200">
                                🧮 Loan Calc
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        );
    };

    return (
        <Layout
            appName="App Builder"
            appIcon={<div className="w-6 h-6 bg-blue-700 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm">AB</div>}
            navItems={NAV_ITEMS}
            currentView={currentView}
            onNavigate={setCurrentView}
            onExitApp={onExit}
            onLaunchApp={onLaunch}
            hideGlobalAssistant={true}
        >
            {renderContent()}
        </Layout>
    );
};
