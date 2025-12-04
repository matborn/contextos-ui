
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ListItem } from '@/components/ui/ListItem';
import { 
    Users, 
    Settings, 
    Folder, 
    FileText, 
    Plus, 
    ShieldCheck, 
    AlertCircle, 
    Sparkles,
    CheckCircle,
} from '@/components/icons/Icons';
import { ContextView } from '@/types';
import { cn } from '@/utils';

interface WorkspaceExplorerProps {
  onNavigate: (view: ContextView) => void;
  onOpenDocument?: (id: string, context?: any) => void;
}

export const WorkspaceExplorer: React.FC<WorkspaceExplorerProps> = ({ onNavigate, onOpenDocument }) => {

  const handleOpenDoc = (id: string) => {
    if (onOpenDocument) {
      onOpenDocument(id);
    } else {
      onNavigate('workspace');
    }
  };

  const startNewDoc = () => {
      onNavigate('wizard');
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            T
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Titan</h1>
                        <Badge status="success" dot className="ml-2">Active</Badge>
                    </div>
                    <p className="text-slate-500 pl-[52px]">Global payment gateway integration and rollout strategy.</p>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 mr-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                            +4
                        </div>
                    </div>
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        leftIcon={<Users size={14}/>}
                        onClick={() => onNavigate('team')}
                    >
                        Team
                    </Button>
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        leftIcon={<Settings size={14}/>}
                        onClick={() => onNavigate('settings')}
                    >
                        Settings
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 flex flex-col justify-between h-28 border-l-4 border-l-blue-500">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Health Score</div>
                    <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-slate-900">92%</div>
                        <div className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">+4% this week</div>
                    </div>
                </Card>
                <Card className="p-4 flex flex-col justify-between h-28">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Open Risks</div>
                    <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-slate-900">3</div>
                        <AlertCircle className="text-orange-500 opacity-80" size={24} />
                    </div>
                </Card>
                <Card className="p-4 flex flex-col justify-between h-28">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Documents</div>
                    <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-slate-900">12</div>
                        <Folder className="text-blue-500 opacity-80" size={24} />
                    </div>
                </Card>
                <Card className="p-4 flex flex-col justify-between h-28">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Decisions Made</div>
                    <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-slate-900">24</div>
                        <ShieldCheck className="text-green-500 opacity-80" size={24} />
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Documents */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                         <h2 className="text-lg font-semibold text-slate-900">Active Documents</h2>
                         <Button 
                            size="sm" 
                            leftIcon={<Plus size={16}/>}
                            onClick={startNewDoc}
                         >
                            New Doc
                         </Button>
                    </div>

                    <Card className="divide-y divide-slate-50">
                        <ListItem 
                            title="Technical RFC: Payment Gateway"
                            subtitle="Last edited 2h ago by Alex"
                            leftIcon={<FileText size={20} className="text-blue-600"/>}
                            rightContent={<Badge status="warning">Draft</Badge>}
                            onClick={() => handleOpenDoc('doc-1')}
                        />
                        <ListItem 
                            title="Q3 Product Roadmap"
                            subtitle="Last edited 1d ago by Sarah"
                            leftIcon={<FileText size={20} className="text-purple-600"/>}
                            rightContent={<Badge status="success">Approved</Badge>}
                            onClick={() => handleOpenDoc('doc-2')}
                        />
                         <ListItem 
                            title="Security Audit 2024"
                            subtitle="Last edited 3d ago by System"
                            leftIcon={<ShieldCheck size={20} className="text-green-600"/>}
                            rightContent={<Badge status="info">Review</Badge>}
                            onClick={() => handleOpenDoc('doc-3')}
                        />
                         <ListItem 
                            title="User Persona Research"
                            subtitle="Last edited 1w ago"
                            leftIcon={<FileText size={20} className="text-slate-400"/>}
                            rightContent={<Badge status="neutral">Draft</Badge>}
                            onClick={() => handleOpenDoc('doc-4')}
                        />
                    </Card>

                    {/* Collections */}
                    <div className="pt-4">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Collections</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div 
                                onClick={() => handleOpenDoc('doc-5')}
                                className="p-4 bg-white border border-slate-200 rounded-xl flex items-center gap-3 hover:border-blue-300 cursor-pointer transition-colors group"
                            >
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100">
                                    <Folder size={20} />
                                </div>
                                <div>
                                    <div className="font-medium text-slate-900">Engineering</div>
                                    <div className="text-xs text-slate-500">8 items</div>
                                </div>
                            </div>
                            <div 
                                onClick={() => handleOpenDoc('doc-6')}
                                className="p-4 bg-white border border-slate-200 rounded-xl flex items-center gap-3 hover:border-blue-300 cursor-pointer transition-colors group"
                            >
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100">
                                    <Folder size={20} />
                                </div>
                                <div>
                                    <div className="font-medium text-slate-900">Product</div>
                                    <div className="text-xs text-slate-500">14 items</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Knowledge Stream */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                         <h2 className="text-lg font-semibold text-slate-900">Knowledge Stream</h2>
                         <button 
                            className="text-xs font-medium text-blue-600 hover:underline"
                            onClick={() => onNavigate('knowledge')}
                         >
                            View Base
                        </button>
                    </div>

                    <div className="bg-slate-100/50 rounded-xl p-4 space-y-4 border border-slate-200/60 h-full max-h-[600px] overflow-y-auto">
                        <div className="flex gap-3">
                             <div className="mt-1"><Sparkles size={14} className="text-blue-500"/></div>
                             <div className="text-sm">
                                 <p className="text-slate-900 font-medium">New Fact Extracted</p>
                                 <p className="text-slate-500 leading-snug mt-1">"System latency benchmark confirmed at 25ms."</p>
                                 <p className="text-[10px] text-slate-400 mt-2">Source: Engineering Specs • 10m ago</p>
                             </div>
                        </div>
                        <div className="h-px bg-slate-200 w-full"></div>
                         <div className="flex gap-3">
                             <div className="mt-1"><AlertCircle size={14} className="text-orange-500"/></div>
                             <div className="text-sm">
                                 <p className="text-slate-900 font-medium">Risk Detected</p>
                                 <p className="text-slate-500 leading-snug mt-1">Compliance conflict in Module B regarding data retention.</p>
                                 <p className="text-[10px] text-slate-400 mt-2">Source: Slack • 1h ago</p>
                             </div>
                        </div>
                        <div className="h-px bg-slate-200 w-full"></div>
                        <div className="flex gap-3">
                             <div className="mt-1"><CheckCircle size={14} className="text-green-500"/></div>
                             <div className="text-sm">
                                 <p className="text-slate-900 font-medium">Decision Recorded</p>
                                 <p className="text-slate-500 leading-snug mt-1">Approved usage of Stripe as primary processor.</p>
                                 <p className="text-[10px] text-slate-400 mt-2">Source: Meeting Notes • 3h ago</p>
                             </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};
