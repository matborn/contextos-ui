

import React, { useState, useRef, useEffect } from 'react';
import { Home, LayoutTemplate, Grip, ChevronLeft, ChevronDown, Check, Plus, Folder, LogOut, PanelLeft, Bot, Layers, FileText, MessageSquare, Activity, Zap, Network, Sparkles } from './icons/Icons';
import { NavItem, AppMode, User, Workspace } from '../types';
import { cn } from '../utils';
import { Avatar } from './ui/Avatar';
import { GlobalAssistant } from './GlobalAssistant';

interface LayoutProps {
  appName: string;
  appIcon?: React.ReactNode;
  navItems: NavItem[];
  currentView: string;
  onNavigate: (view: any) => void;
  onExitApp: () => void;
  onLaunchApp?: (appId: string) => void; // New prop for switching apps
  children: React.ReactNode;
  
  // Dev props
  appMode?: AppMode;
  onToggleDev?: () => void;
  
  // Auth props
  user?: User | null;

  // Workspace Props
  currentWorkspace?: Workspace | null;
  allWorkspaces?: Workspace[];
  onSwitchWorkspace?: (id: string) => void;
  onCreateWorkspace?: (name: string, visibility: 'private' | 'public' | 'protected') => void;

  // Assistant Props (New: Controlled Mode)
  isAssistantOpen?: boolean;
  onToggleAssistant?: () => void;
  hideGlobalAssistant?: boolean; // If true, the Layout won't render the overlay (app renders it internally)
}

export const Layout: React.FC<LayoutProps> = ({ 
    appName, 
    appIcon,
    navItems, 
    currentView, 
    onNavigate, 
    onExitApp,
    onLaunchApp,
    children,
    appMode,
    onToggleDev,
    user,
    currentWorkspace,
    allWorkspaces = [],
    onSwitchWorkspace,
    onCreateWorkspace,
    isAssistantOpen,
    onToggleAssistant,
    hideGlobalAssistant = false
}) => {
  const [internalAssistantOpen, setInternalAssistantOpen] = useState(false);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isModuleMenuOpen, setIsModuleMenuOpen] = useState(false);
  const workspaceMenuRef = useRef<HTMLDivElement>(null);
  const moduleMenuRef = useRef<HTMLDivElement>(null);

  // Resolve controlled vs uncontrolled state
  const showAssistant = isAssistantOpen !== undefined ? isAssistantOpen : internalAssistantOpen;
  
  const handleAssistantToggle = () => {
      if (onToggleAssistant) {
          onToggleAssistant();
      } else {
          setInternalAssistantOpen(prev => !prev);
      }
  };

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (workspaceMenuRef.current && !workspaceMenuRef.current.contains(event.target as Node)) {
        setIsWorkspaceMenuOpen(false);
      }
      if (moduleMenuRef.current && !moduleMenuRef.current.contains(event.target as Node)) {
        setIsModuleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDevView = currentView === 'design-system' || currentView === 'ai-playground';

  const navItemClass = (viewId: string) => cn(
    "px-3 py-1.5 rounded-full transition-colors text-sm font-medium flex items-center gap-2",
    currentView === viewId ? "text-slate-900 bg-slate-100 shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
  );

  const modules = [
      { id: 'context-os', name: 'Atlas', icon: <Layers size={20}/>, color: 'text-slate-700' },
      { id: 'projects', name: 'Projects', icon: <Folder size={20}/>, color: 'text-indigo-600' },
      { id: 'scriptor', name: 'Scriptor', icon: <FileText size={20}/>, color: 'text-blue-600' },
      { id: 'muse', name: 'Muse', icon: <MessageSquare size={20}/>, color: 'text-sky-500' },
      { id: 'life-os', name: 'Horizon', icon: <Activity size={20}/>, color: 'text-emerald-500' },
      { id: 'forge', name: 'Forge', icon: <Zap size={20}/>, color: 'text-amber-600' },
      { id: 'pilot', name: 'Pilot', icon: <Network size={20}/>, color: 'text-blue-600' },
      { id: 'ai-builder', name: 'App Builder', icon: <LayoutTemplate size={20}/>, color: 'text-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-900 flex flex-col overflow-hidden h-screen">
      
      {/* Universal Minimal Header */}
      <header className="h-14 border-b border-slate-100 flex items-center justify-between px-6 bg-white sticky top-0 z-40 shrink-0">
         <div className="flex items-center gap-4">
             {/* Module Switcher (Google Style Popover) */}
             <div className="relative" ref={moduleMenuRef}>
                 <button 
                    onClick={() => setIsModuleMenuOpen(!isModuleMenuOpen)}
                    className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        isModuleMenuOpen ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                    )}
                    title="Switch Module"
                 >
                     <Grip size={20} />
                 </button>

                 {isModuleMenuOpen && (
                     <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 animate-fadeIn grid grid-cols-3 gap-2">
                         {modules.map(mod => (
                             <button
                                key={mod.id}
                                onClick={() => {
                                    if (onLaunchApp) {
                                        onLaunchApp(mod.id);
                                    } else if (mod.id === 'context-os') {
                                        onExitApp(); 
                                    } else {
                                        // Fallback if no launch handler
                                    }
                                    setIsModuleMenuOpen(false);
                                }}
                                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-slate-50 transition-colors gap-2 group"
                             >
                                 <div className={cn("p-2 rounded-xl bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all", mod.color)}>
                                     {mod.icon}
                                 </div>
                                 <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">{mod.name}</span>
                             </button>
                         ))}
                     </div>
                 )}
             </div>

             <div className="h-4 w-px bg-slate-200"></div>

             {/* App Identity & Workspace Switcher */}
             {currentWorkspace ? (
                 <div className="relative" ref={workspaceMenuRef}>
                     <button 
                        onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
                        className="flex items-center gap-3 hover:bg-slate-50 py-1 px-2 -ml-2 rounded-lg transition-colors"
                     >
                         {appIcon || (
                            <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                {appName.charAt(0)}
                            </div>
                         )}
                         <div className="flex flex-col items-start">
                             <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900 tracking-tight text-sm">{currentWorkspace.name}</span>
                                <ChevronDown size={14} className="text-slate-400"/>
                             </div>
                         </div>
                     </button>

                     {/* Workspace Dropdown */}
                     {isWorkspaceMenuOpen && (
                         <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-fadeIn">
                             <div className="text-xs font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">Switch Workspace</div>
                             <div className="space-y-1 mb-2">
                                 {allWorkspaces.map(ws => (
                                     <button
                                        key={ws.id}
                                        onClick={() => { onSwitchWorkspace?.(ws.id); setIsWorkspaceMenuOpen(false); }}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                                            currentWorkspace.id === ws.id ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                     >
                                         <div className="flex items-center gap-2">
                                             <div className="w-5 h-5 rounded bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold">
                                                 {ws.name.slice(0, 1)}
                                             </div>
                                             {ws.name}
                                         </div>
                                         {currentWorkspace.id === ws.id && <Check size={14} className="text-slate-500"/>}
                                     </button>
                                 ))}
                             </div>
                             
                             <div className="h-px bg-slate-100 my-1"></div>
                             
                             <button 
                                onClick={() => { onSwitchWorkspace?.('home'); setIsWorkspaceMenuOpen(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
                             >
                                 <Grip size={16} /> All Workspaces
                             </button>
                         </div>
                     )}
                 </div>
             ) : (
                 // Fallback for Global View (No workspace selected)
                 <div 
                    className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                    onClick={() => navItems.length > 0 && onNavigate(navItems[0].id)}
                 >
                     {appIcon || (
                        <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            {appName.charAt(0)}
                        </div>
                     )}
                     <span className="font-semibold text-slate-900 tracking-tight">{appName}</span>
                 </div>
             )}
         </div>

         {/* Navigation Center */}
         <div className="flex items-center">
             <nav className="flex items-center gap-1">
                {navItems.map(item => (
                    <button 
                        key={item.id} 
                        onClick={() => onNavigate(item.id)} 
                        className={navItemClass(item.id)}
                    >
                        {item.icon}
                        <span className="hidden md:inline">{item.label}</span>
                    </button>
                ))}
             </nav>
         </div>

         {/* Right Actions */}
         <div className="flex items-center gap-4">
             {/* Global Assistant Toggle - Moved to Right */}
             <button 
                onClick={handleAssistantToggle}
                className={cn(
                    "p-1.5 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium",
                    showAssistant ? "text-blue-600 bg-blue-50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )}
                title="Toggle AI Assistant"
             >
                 <Sparkles size={18} />
             </button>

             <div className="h-4 w-px bg-slate-200"></div>

             {onToggleDev && (
                 <>
                    <button 
                        onClick={onToggleDev} 
                        className={cn(
                            "text-slate-400 hover:text-primary-600 transition-colors flex items-center gap-2 text-xs font-medium",
                            isDevView && "text-primary-600"
                        )}
                        title="Toggle Developer Mode"
                    >
                        {isDevView ? (
                            <>Back <Home size={16}/></>
                        ) : (
                            <>Dev <LayoutTemplate size={16}/></>
                        )}
                    </button>
                    <div className="h-4 w-px bg-slate-200"></div>
                 </>
             )}
             
             {user && (
                 <div className="flex items-center gap-2 pl-2">
                     <Avatar name={user.name} size="sm" />
                 </div>
             )}
         </div>
      </header>

      <main className="flex-1 overflow-hidden relative bg-slate-50 flex">
          {/* Main Content Area */}
          <div className={cn(
              "flex-1 overflow-hidden relative flex flex-col transition-all duration-300 ease-in-out",
              // Only apply margin if we are NOT hiding the global assistant (i.e. standard overlay mode)
              !hideGlobalAssistant && showAssistant ? "mr-[400px]" : ""
          )}>
            {children}
          </div>

          {/* Global Assistant - Rendered here ONLY if not hidden by app */}
          {!hideGlobalAssistant && (
              <GlobalAssistant 
                isOpen={showAssistant} 
                onClose={() => handleAssistantToggle()}
                onNavigate={onNavigate}
                onCreateWorkspace={onCreateWorkspace}
                appName={appName}
                currentView={currentView}
              />
          )}
      </main>

    </div>
  );
};