
import React, { useState } from 'react';
import { DocumentSection, ValidationItem } from '../types';
import { Button } from './ui/Button';
import { Check, MessageSquare, Loader2, Sparkles, AlertCircle, Wand2, CheckCircle, ShieldCheck, FilePen, Zap } from './icons/Icons';
import { cn } from '../utils';
import { Badge } from './ui/Badge';

// Extended type for internal use if ValidationItem doesn't match exactly
export interface ValidationCheck {
    id: string;
    label: string;
    type: 'ai' | 'manual';
    status: 'pending' | 'passed' | 'failed' | 'running';
    description?: string;
}

interface DocumentViewerProps {
  sections: DocumentSection[];
  loading?: boolean;
  onApproveSection?: (id: string) => void;
  onRefineSection: (id: string, instruction: 'simplify' | 'expand' | 'tone' | 'fix') => Promise<void>;
  activeSectionId: string | null;
  onSectionClick: (id: string) => void;
  validationChecks?: Record<string, ValidationCheck[]>; // Kept in interface but typically undefined/unused in V2
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  sections, 
  loading,
  onApproveSection, 
  onRefineSection,
  activeSectionId,
  onSectionClick,
}) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleRefineAction = async (id: string, action: 'simplify' | 'expand' | 'tone' | 'fix') => {
    setProcessingId(id);
    await onRefineSection(id, action);
    setProcessingId(null);
  };

  if (loading) {
    return (
       <div className="space-y-8 p-8 animate-pulse">
           <div className="h-8 bg-slate-100 rounded w-1/3 mb-8"></div>
           {[1, 2, 3].map(i => (
               <div key={i} className="space-y-4">
                   <div className="h-6 bg-slate-100 rounded w-1/4"></div>
                   <div className="h-4 bg-slate-100 rounded w-full"></div>
                   <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                   <div className="h-4 bg-slate-100 rounded w-4/6"></div>
               </div>
           ))}
       </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col">
       {/* Document Toolbar */}
       <div className="h-12 border-b border-slate-100 flex items-center px-6 justify-between bg-slate-50/50 rounded-t-xl sticky top-0 z-10 backdrop-blur-sm bg-white/80">
           <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-xs font-medium text-slate-600">Sync Active</span>
           </div>
           <div className="text-xs text-slate-400">
               Auto-saved just now
           </div>
       </div>

       {/* Document Canvas */}
       <div className="flex-1 p-8 md:p-12 space-y-8">
           {sections.map((section) => (
               <div 
                id={section.id}
                key={section.id} 
                className={cn(
                    "group relative p-6 -mx-6 rounded-xl transition-all duration-200 border border-transparent",
                    activeSectionId === section.id 
                        ? "bg-blue-50/40 border-blue-100 ring-1 ring-blue-100" 
                        : "hover:bg-slate-50",
                    processingId === section.id && "opacity-70 pointer-events-none"
                )}
                onClick={() => onSectionClick(section.id)}
               >
                   {/* Section Header */}
                   {section.type === 'heading' ? (
                       <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">{section.content}</h1>
                   ) : (
                       <>
                           {section.title && <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                               {section.title}
                               {section.status === 'approved' && <CheckCircle className="text-green-500" size={16} />}
                           </h3>}
                           
                           <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                               {section.content}
                           </div>
                       </>
                   )}

                   {/* Status / Conflict Indicator */}
                   {section.hasConflict && (
                       <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 animate-fadeIn">
                           <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                           <div>
                               <p className="text-sm font-bold text-red-800">Knowledge Conflict Detected</p>
                               <p className="text-sm text-red-700 mt-1">This content contradicts the <span className="underline cursor-pointer">Q3 Strategy Doc</span> regarding API limits.</p>
                           </div>
                       </div>
                   )}

                   {/* AI Refinement Actions (Under Active Section) */}
                   {activeSectionId === section.id && section.type !== 'heading' && !processingId && (
                       <div className="mt-6 pt-4 border-t border-blue-200/50 animate-fadeIn">
                           <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                               <Sparkles size={14} className="text-indigo-500"/>
                               AI Refinement Actions
                           </div>
                           <div className="flex flex-wrap gap-2">
                               <Button 
                                   size="sm" 
                                   variant="secondary" 
                                   className="bg-white hover:border-indigo-300 hover:text-indigo-600 text-xs h-8"
                                   onClick={(e) => { e.stopPropagation(); handleRefineAction(section.id, 'simplify'); }}
                                   leftIcon={<Wand2 size={14}/>}
                               >
                                   Simplify
                               </Button>
                               <Button 
                                   size="sm" 
                                   variant="secondary" 
                                   className="bg-white hover:border-purple-300 hover:text-purple-600 text-xs h-8"
                                   onClick={(e) => { e.stopPropagation(); handleRefineAction(section.id, 'expand'); }}
                                   leftIcon={<Zap size={14}/>}
                               >
                                   Expand
                               </Button>
                               <Button 
                                   size="sm" 
                                   variant="secondary" 
                                   className="bg-white hover:border-blue-300 hover:text-blue-600 text-xs h-8"
                                   onClick={(e) => { e.stopPropagation(); handleRefineAction(section.id, 'tone'); }}
                                   leftIcon={<MessageSquare size={14}/>}
                               >
                                   Adjust Tone
                               </Button>
                               <Button 
                                   size="sm" 
                                   variant="secondary" 
                                   className="bg-white hover:border-green-300 hover:text-green-600 text-xs h-8"
                                   onClick={(e) => { e.stopPropagation(); handleRefineAction(section.id, 'fix'); }}
                                   leftIcon={<FilePen size={14}/>}
                               >
                                   Fix Grammar
                               </Button>
                           </div>
                       </div>
                   )}

                   {/* Loading Overlay */}
                   {processingId === section.id && (
                       <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-xl z-20">
                           <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-blue-100 flex items-center gap-2">
                               <Loader2 className="text-blue-600 animate-spin" size={16} />
                               <span className="text-xs font-medium text-blue-600">AI Rewriting...</span>
                           </div>
                       </div>
                   )}
               </div>
           ))}
       </div>
    </div>
  );
};
