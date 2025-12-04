
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { PageLayout } from '../components/ui/PageLayout';
import { TabBar, TabItem } from '../components/ui/TabBar';
import { DataSource, KnowledgeItem, KnowledgeType, IngestionStage } from '../types';
import { fetchKnowledgeGraph, fetchDataSources, ingestText } from '../services/geminiService';
import { useToast } from '../components/ui/Toast';
import { 
    CheckCircle, 
    AlertCircle, 
    ShieldCheck, 
    Database, 
    Search,
    Loader2,
    Sparkles,
    FileText,
    ChevronRight,
    MessageSquare,
    LinkIcon,
    FilePlus,
    Check,
    ArrowRight,
    Activity,
    Clock,
    GitMerge,
    Filter,
    RefreshCw,
    Settings,
    MoreHorizontal,
    Network
} from '../components/icons/Icons';
import { cn } from '../utils';

// --- Types & Config ---

type AtlasTab = 'inbox' | 'explore' | 'entity' | 'sources';

// --- Icons & Helpers ---

const TypeIcon: React.FC<{ type: KnowledgeType, className?: string }> = ({ type, className }) => {
    switch (type) {
        case 'fact': return <Database size={14} className={cn("text-primary-500", className)} />;
        case 'decision': return <ShieldCheck size={14} className={cn("text-green-500", className)} />;
        case 'risk': return <AlertCircle size={14} className={cn("text-red-500", className)} />;
        case 'assumption': return <Sparkles size={14} className={cn("text-brand-ai-500", className)} />;
        case 'requirement': return <FileText size={14} className={cn("text-orange-500", className)} />;
        default: return null;
    }
};

const SourceIcon: React.FC<{ type: DataSource['type'], className?: string }> = ({ type, className }) => {
    switch(type) {
      case 'confluence': return <FileText size={18} className={cn("text-primary-600", className)} />;
      case 'slack': return <MessageSquare size={18} className={cn("text-brand-ai-600", className)} />;
      case 'gdrive': return <Database size={18} className={cn("text-green-600", className)} />;
      case 'web': return <LinkIcon size={18} className={cn("text-slate-500", className)} />;
      default: return <FileText size={18} className={className} />;
    }
};

const getItemStatusDisplay = (item: KnowledgeItem) => {
    if (item.status === 'staging') return { label: 'Pending', variant: 'warning' as const };
    if (item.type === 'decision') {
        if (item.status === 'canonical') return { label: 'Decided', variant: 'success' as const };
        if (item.status === 'exploratory') return { label: 'Open', variant: 'warning' as const };
        return { label: 'Archived', variant: 'neutral' as const };
    }
    if (item.status === 'canonical') return { label: 'Verified', variant: 'success' as const };
    if (item.status === 'exploratory') return { label: 'Insight', variant: 'info' as const };
    return { label: 'Archived', variant: 'neutral' as const };
};

// --- Sub-components ---

const PipelineProgress: React.FC<{ stage: IngestionStage }> = ({ stage }) => {
    if (stage === 'idle' || stage === 'complete') return null;

    const steps = [
        { id: 'extracting', label: 'Extracting' },
        { id: 'embedding', label: 'Embedding' },
        { id: 'clustering', label: 'Clustering' },
        { id: 'correlating', label: 'Checking Conflicts' }
    ];

    const currentIndex = steps.findIndex(s => s.id === stage);

    return (
        <div className="bg-white border border-primary-100 rounded-xl p-6 shadow-sm mb-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Loader2 size={18} className="text-primary-600 animate-spin" />
                    <h3 className="font-semibold text-slate-900">Ingestion Pipeline Active</h3>
                </div>
                <Badge status="info">Processing...</Badge>
            </div>
            
            <div className="relative flex items-center justify-between">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 rounded-full"></div>
                <div className="absolute top-1/2 left-0 h-1 bg-primary-500 -z-10 rounded-full transition-all duration-500" style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}></div>

                {steps.map((step, idx) => {
                    const isCompleted = idx < currentIndex;
                    const isCurrent = idx === currentIndex;
                    
                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2",
                                isCompleted ? "bg-primary-600 border-primary-600 text-white" : 
                                isCurrent ? "bg-white border-primary-500 text-primary-600 scale-110 shadow-md" : 
                                "bg-white border-slate-200 text-slate-300"
                            )}>
                                {isCompleted ? <Check size={14} /> : idx + 1}
                            </div>
                            <span className={cn(
                                "text-xs font-medium transition-colors duration-300",
                                isCurrent ? "text-primary-700" : isCompleted ? "text-slate-600" : "text-slate-400"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

// --- Mock Entities for Entity View ---
const MOCK_ENTITIES = [
    { id: 'ent-1', name: 'Payment Gateway', type: 'Service', health: 'Risk', updated: '2h ago', owner: 'Platform Team' },
    { id: 'ent-2', name: 'User Authentication', type: 'Module', health: 'Healthy', updated: '1d ago', owner: 'Identity Squad' },
    { id: 'ent-3', name: 'Order Processing', type: 'Service', health: 'Healthy', updated: '3d ago', owner: 'Commerce Team' },
    { id: 'ent-4', name: 'Mobile App', type: 'Client', health: 'Warning', updated: '5h ago', owner: 'Mobile Team' },
    { id: 'ent-5', name: 'Stripe API', type: 'External', health: 'Healthy', updated: '1w ago', owner: '3rd Party' },
    { id: 'ent-6', name: 'PostgreSQL Cluster', type: 'Infrastructure', health: 'Healthy', updated: '2d ago', owner: 'DevOps' },
    { id: 'ent-7', name: 'Redis Cache', type: 'Infrastructure', health: 'Warning', updated: '4h ago', owner: 'DevOps' },
];

const EntityGraph: React.FC<{ entity: any }> = ({ entity }) => {
    // Simple mock layout for visualization
    const centerX = 400;
    const centerY = 300;
    
    return (
        <div className="w-full h-[500px] bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center">
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 shadow-sm z-10">
                Visualizing relationships for {entity.name}
            </div>
            
            <svg className="w-full h-full" viewBox="0 0 800 600">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                    </marker>
                </defs>

                {/* Edges */}
                <line x1="200" y1="200" x2={centerX} y2={centerY} stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow)" />
                <line x1="200" y1="400" x2={centerX} y2={centerY} stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow)" />
                <line x1={centerX} y1={centerY} x2="600" y2={200} stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow)" />
                <line x1={centerX} y1={centerY} x2="600" y2={400} stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow)" />

                {/* Upstream Nodes */}
                <g transform="translate(200, 200)">
                    <circle r="30" fill="white" stroke="#3b82f6" strokeWidth="2" />
                    <text y="5" textAnchor="middle" fontSize="10" className="fill-slate-600 font-bold">Checkout</text>
                    <text y="-40" textAnchor="middle" fontSize="10" className="fill-slate-400 font-bold uppercase tracking-wider">Upstream</text>
                </g>
                <g transform="translate(200, 400)">
                    <circle r="30" fill="white" stroke="#3b82f6" strokeWidth="2" />
                    <text y="5" textAnchor="middle" fontSize="10" className="fill-slate-600 font-bold">Subs</text>
                </g>

                {/* Center Node (Selected) */}
                <g transform={`translate(${centerX}, ${centerY})`}>
                    <circle r="45" fill="white" stroke="#6366f1" strokeWidth="4" className="drop-shadow-lg" />
                    <foreignObject x="-20" y="-20" width="40" height="40">
                        <div className="flex items-center justify-center h-full text-indigo-600">
                            <Database size={24} />
                        </div>
                    </foreignObject>
                    <text y="65" textAnchor="middle" fontSize="12" className="fill-slate-900 font-bold">{entity.name}</text>
                    <rect x="-30" y="75" width="60" height="16" rx="8" fill="#f1f5f9" />
                    <text y="86" textAnchor="middle" fontSize="9" className="fill-slate-500 font-mono">SERVICE</text>
                </g>

                {/* Downstream Nodes */}
                <g transform="translate(600, 200)">
                    <circle r="30" fill="white" stroke="#10b981" strokeWidth="2" />
                    <text y="5" textAnchor="middle" fontSize="10" className="fill-slate-600 font-bold">Stripe</text>
                    <text y="-40" textAnchor="middle" fontSize="10" className="fill-slate-400 font-bold uppercase tracking-wider">Downstream</text>
                </g>
                <g transform="translate(600, 400)">
                    <circle r="30" fill="white" stroke="#10b981" strokeWidth="2" />
                    <text y="5" textAnchor="middle" fontSize="10" className="fill-slate-600 font-bold">Ledger</text>
                </g>
            </svg>
        </div>
    );
}

const EntityDetailView: React.FC<{ entityId: string; onClose: () => void }> = ({ entityId, onClose }) => {
    const entity = MOCK_ENTITIES.find(e => e.id === entityId) || MOCK_ENTITIES[0];
    const [view, setView] = useState<'overview' | 'graph' | 'risks'>('overview');

    return (
        <div className="h-full flex flex-col bg-white border-l border-slate-200 animate-slideInRight shadow-xl w-full max-w-4xl absolute right-0 inset-y-0 z-20">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white border border-slate-200 rounded-lg text-blue-600 shadow-sm">
                            <Database size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight">{entity.name}</h2>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="font-mono">ID: {entity.id}</span>
                                <span>•</span>
                                <span>{entity.type}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Badge status={entity.health === 'Risk' ? 'error' : entity.health === 'Warning' ? 'warning' : 'success'}>
                            {entity.health}
                        </Badge>
                        <span className="text-xs text-slate-400 px-2 border-l border-slate-200">Last updated {entity.updated}</span>
                        <span className="text-xs text-slate-400 px-2 border-l border-slate-200">Owner: {entity.owner}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={onClose}><ChevronRight size={20} /></Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 border-b border-slate-100 flex gap-6">
                <button onClick={() => setView('overview')} className={cn("py-3 text-sm font-medium border-b-2 transition-colors", view === 'overview' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800")}>Overview</button>
                <button onClick={() => setView('graph')} className={cn("py-3 text-sm font-medium border-b-2 transition-colors", view === 'graph' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800")}>Lineage Map</button>
                <button onClick={() => setView('risks')} className={cn("py-3 text-sm font-medium border-b-2 transition-colors", view === 'risks' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800")}>Risks & Signals</button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                {view === 'overview' && (
                    <div className="space-y-8 max-w-2xl">
                        {/* Properties */}
                        <section>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Properties & Metadata</h3>
                            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                <table className="w-full text-sm">
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="flex p-3"><td className="w-32 text-slate-500">Owner</td><td className="font-medium">{entity.owner}</td></tr>
                                        <tr className="flex p-3"><td className="w-32 text-slate-500">Tier</td><td className="font-medium">Critical (Tier 1)</td></tr>
                                        <tr className="flex p-3"><td className="w-32 text-slate-500">Language</td><td className="font-medium">Go / Node.js</td></tr>
                                        <tr className="flex p-3"><td className="w-32 text-slate-500">Region</td><td className="font-medium">us-east-1, eu-west-1</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Quick Actions */}
                        <section>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Button size="sm" variant="secondary" className="bg-white" leftIcon={<Sparkles size={14}/>}>Summarize Status</Button>
                                <Button size="sm" variant="secondary" className="bg-white" leftIcon={<Activity size={14}/>}>Show Impact Analysis</Button>
                                <Button size="sm" variant="secondary" className="bg-white" leftIcon={<Clock size={14}/>}>Trace History</Button>
                                <Button size="sm" variant="secondary" className="bg-white" leftIcon={<GitMerge size={14}/>}>Compare Versions</Button>
                            </div>
                        </section>
                    </div>
                )}

                {view === 'graph' && (
                    <div className="h-full flex flex-col">
                        <EntityGraph entity={entity} />
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                <div className="text-xs font-bold text-slate-400 uppercase">Upstream</div>
                                <div className="mt-1 text-lg font-bold text-slate-900">2</div>
                                <div className="text-xs text-slate-500">Direct dependencies</div>
                            </div>
                            <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                <div className="text-xs font-bold text-slate-400 uppercase">Downstream</div>
                                <div className="mt-1 text-lg font-bold text-slate-900">14</div>
                                <div className="text-xs text-slate-500">Impacted consumers</div>
                            </div>
                            <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                <div className="text-xs font-bold text-slate-400 uppercase">Graph Depth</div>
                                <div className="mt-1 text-lg font-bold text-slate-900">3</div>
                                <div className="text-xs text-slate-500">Levels analyzed</div>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'risks' && (
                    <div className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-4">
                            <div className="p-2 bg-red-100 text-red-600 rounded-full shrink-0"><AlertCircle size={20}/></div>
                            <div>
                                <h4 className="text-sm font-bold text-red-900">Latency Spike Correlation</h4>
                                <p className="text-sm text-red-700 mt-1 leading-relaxed">
                                    Detected anomaly in latency during peak load matching new deployment. 
                                    This contradicts the SLA defined in the "Performance Spec".
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white h-7 text-xs">Investigate</Button>
                                    <Button size="sm" variant="ghost" className="h-7 text-xs text-red-700 hover:bg-red-100">Dismiss</Button>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg flex items-start gap-4">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-full shrink-0"><GitMerge size={20}/></div>
                            <div>
                                <h4 className="text-sm font-bold text-orange-900">Pending Decision: Rate Limiting</h4>
                                <p className="text-sm text-orange-700 mt-1 leading-relaxed">
                                    Open debate on changing throughput limits for this service. 
                                    Currently blocked by Security review.
                                </p>
                                <div className="mt-3">
                                    <Button size="sm" variant="secondary" className="bg-white border-orange-200 text-orange-800 hover:bg-orange-50 h-7 text-xs">View Debate</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Component ---

export const KnowledgeBase: React.FC = () => {
  const { showToast } = useToast();
  
  // View State
  const [activeTab, setActiveTab] = useState<AtlasTab>('inbox');
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  
  // Data State
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  
  // Entity State
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [entityFilterType, setEntityFilterType] = useState<string>('all');
  const [entitySearch, setEntitySearch] = useState('');
  
  // Sources Filter State
  const [sourceSearchQuery, setSourceSearchQuery] = useState('');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<'all' | DataSource['type']>('all');

  // Ingestion State
  const [ingestTextValue, setIngestTextValue] = useState('');
  const [ingestionStage, setIngestionStage] = useState<IngestionStage>('idle');
  
  // Filter & Selection State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
        const [graph, sources] = await Promise.all([
            fetchKnowledgeGraph('Project Titan'),
            fetchDataSources()
        ]);
        setItems(graph);
        setDataSources(sources);
    } catch (e) {
        showToast('Failed to load knowledge graph', { type: 'error' });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
      loadData();
  }, []);

  // Filter Logic for Items
  const filteredItems = useMemo(() => {
      return items.filter(item => {
          if (item.status === 'staging') return false; 
          const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                item.sourceName.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesSearch;
      });
  }, [items, searchQuery]);

  // Filter Logic for Sources
  const filteredSources = useMemo(() => {
      return dataSources.filter(source => {
          const matchesSearch = source.name.toLowerCase().includes(sourceSearchQuery.toLowerCase());
          const matchesType = sourceTypeFilter === 'all' || source.type === sourceTypeFilter;
          return matchesSearch && matchesType;
      });
  }, [dataSources, sourceSearchQuery, sourceTypeFilter]);

  // Filter Logic for Entities
  const filteredEntities = useMemo(() => {
      return MOCK_ENTITIES.filter(e => {
          const matchesSearch = e.name.toLowerCase().includes(entitySearch.toLowerCase());
          const matchesType = entityFilterType === 'all' || e.type === entityFilterType;
          return matchesSearch && matchesType;
      });
  }, [entitySearch, entityFilterType]);

  // Source Stats
  const sourceStats = useMemo(() => ({
      total: dataSources.length,
      healthy: dataSources.filter(s => s.status === 'synced').length,
      errors: dataSources.filter(s => s.status === 'error').length,
      syncing: dataSources.filter(s => s.status === 'syncing').length
  }), [dataSources]);

  const stagingClusters = useMemo(() => {
      const stagingItems = items.filter(i => i.status === 'staging');
      if (stagingItems.length === 0) return [];

      const groups: Record<string, KnowledgeItem[]> = {};
      stagingItems.forEach(item => {
          const cId = item.clusterId || 'unclustered';
          if (!groups[cId]) groups[cId] = [];
          groups[cId].push(item);
      });

      return Object.keys(groups).map(cId => {
          let title = "Miscellaneous Insights";
          if (cId.includes('1')) title = "System Architecture Specs";
          else if (cId.includes('2')) title = "Security & Compliance";
          
          return {
              id: cId,
              title,
              summary: `Contains ${groups[cId].length} items (${groups[cId].filter(i => i.type === 'risk').length} Risks).`,
              items: groups[cId],
              status: 'pending' as const,
              confidence: 85
          };
      });
  }, [items]);

  const stats = {
      staging: items.filter(i => i.status === 'staging').length,
  };

  // Handlers
  const handleIngest = async () => {
      if(!ingestTextValue) return;
      setIsIngestModalOpen(false);
      setActiveTab('inbox'); 
      try {
          await ingestText(ingestTextValue, 'cap-default', (stage: any) => {
             setIngestionStage(stage);
          });
          await loadData();
          setIngestTextValue('');
          showToast('Ingestion complete. Items in Inbox.', { type: 'success' });
      } catch(e) {
          showToast('Ingestion failed', { type: 'error' });
          setIngestionStage('idle');
      }
  };

  const handlePromoteCluster = (clusterId: string) => {
      setItems(prev => prev.map(i => i.clusterId === clusterId ? { ...i, status: 'canonical' } : i));
      showToast('Cluster promoted to System of Record', { type: 'success' });
  };

  const handleRejectCluster = (clusterId: string) => {
      setItems(prev => prev.filter(i => i.clusterId !== clusterId));
      showToast('Cluster discarded', { type: 'info' });
  };

  const navItems: TabItem[] = [
    { id: 'inbox', label: 'Inbox', count: stats.staging },
    { id: 'explore', label: 'Explore' },
    { id: 'entity', label: 'Entity View' },
    { id: 'sources', label: 'Sources' }
  ];

  return (
    <PageLayout 
        title="System of Record" 
        description="Atlas Single Source of Truth"
        isScrollable={false} // Internal tabs manage scrolling
        headerActions={
            <Button size="sm" onClick={() => setIsIngestModalOpen(true)} leftIcon={<FilePlus size={16}/>}>Add Knowledge</Button>
        }
        headerTabs={
            <TabBar 
                items={navItems}
                activeId={activeTab}
                onSelect={(id) => setActiveTab(id as AtlasTab)}
            />
        }
    >
        {/* Content Area - Flex-1 to fill remaining space in fixed layout */}
        <div className="flex-1 overflow-hidden relative flex flex-col h-full">
            
            {/* 1. INBOX */}
            {activeTab === 'inbox' && (
                 <div className="h-full overflow-y-auto bg-slate-50/50 p-6">
                    <div className="max-w-5xl mx-auto">
                        <PipelineProgress stage={ingestionStage} />
                        
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            Staging Area
                            <Badge status="neutral">Trust Layer</Badge>
                        </h2>

                        {stagingClusters.length === 0 && ingestionStage === 'idle' ? (
                             <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
                                 <CheckCircle size={32} className="text-slate-300 mx-auto mb-4"/>
                                 <h3 className="text-slate-900 font-medium">Inbox Empty</h3>
                                 <p className="text-slate-500 text-sm mt-1">All knowledge has been processed.</p>
                             </div>
                        ) : (
                             <div className="space-y-6">
                                 {stagingClusters.map(cluster => (
                                     <Card key={cluster.id} className="overflow-hidden">
                                         <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                             <div>
                                                 <h3 className="font-semibold text-slate-900">{cluster.title}</h3>
                                                 <p className="text-xs text-slate-500 mt-0.5">{cluster.summary}</p>
                                             </div>
                                             <div className="flex gap-2">
                                                 <Button size="sm" variant="secondary" onClick={() => handleRejectCluster(cluster.id)} className="text-red-600 hover:bg-red-50">Reject</Button>
                                                 <Button size="sm" onClick={() => handlePromoteCluster(cluster.id)} leftIcon={<CheckCircle size={14}/>}>Promote</Button>
                                             </div>
                                         </div>
                                         <div className="p-4 space-y-3">
                                             {cluster.items.map(item => (
                                                 <div key={item.id} className="flex gap-3 text-sm p-2 hover:bg-slate-50 rounded">
                                                     <div className="mt-0.5"><TypeIcon type={item.type}/></div>
                                                     <div className="flex-1">
                                                         <p className="text-slate-900">{item.content}</p>
                                                         {item.aiActionTaken === 'conflict-detected' && (
                                                             <Badge status="error" className="mt-1 flex items-center w-fit">
                                                                 <AlertCircle size={10} className="mr-1"/> Conflict Detected
                                                             </Badge>
                                                         )}
                                                     </div>
                                                 </div>
                                             ))}
                                         </div>
                                     </Card>
                                 ))}
                             </div>
                        )}
                    </div>
                 </div>
            )}

            {/* 2. EXPLORE */}
            {activeTab === 'explore' && (
                <div className="h-full flex flex-col">
                    <div className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0">
                        <div className="flex-1 max-w-md">
                            <Input 
                                leftIcon={<Search size={14} />}
                                placeholder="Search canonical knowledge..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 w-32">Type</th>
                                    <th className="px-6 py-3">Content</th>
                                    <th className="px-6 py-3 w-48">Source</th>
                                    <th className="px-6 py-3 w-32 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredItems.map(item => {
                                    const statusDisplay = getItemStatusDisplay(item);
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-3 text-slate-600 capitalize">
                                                <div className="flex items-center gap-2"><TypeIcon type={item.type}/> {item.type}</div>
                                            </td>
                                            <td className="px-6 py-3 text-slate-900 font-medium">{item.content}</td>
                                            <td className="px-6 py-3 text-slate-500 text-xs">{item.sourceName}</td>
                                            <td className="px-6 py-3 text-right">
                                                <Badge status={statusDisplay.variant}>{statusDisplay.label}</Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 3. ENTITY VIEW */}
            {activeTab === 'entity' && (
                <div className="h-full flex">
                    {/* Entity Sidebar */}
                    <div className="w-80 border-r border-slate-200 bg-slate-50 overflow-hidden flex flex-col">
                        
                        {/* Search & Filter Header */}
                        <div className="p-4 border-b border-slate-200 bg-white shrink-0 space-y-3">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Domain Explorer</h3>
                            <Input 
                                leftIcon={<Search size={14} />}
                                placeholder="Find service, team, or API..." 
                                value={entitySearch}
                                onChange={e => setEntitySearch(e.target.value)}
                            />
                            
                            {/* Type Facets */}
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                {['all', 'Service', 'Module', 'Infrastructure', 'External'].map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => setEntityFilterType(type)}
                                        className={cn(
                                            "px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors border",
                                            entityFilterType === type 
                                                ? "bg-slate-800 text-white border-slate-800" 
                                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        {type === 'all' ? 'All' : type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="divide-y divide-slate-100">
                                {filteredEntities.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400">
                                        <Filter size={24} className="mx-auto mb-2 opacity-50"/>
                                        <p className="text-xs">No entities found.</p>
                                    </div>
                                ) : (
                                    filteredEntities.map(e => (
                                        <button 
                                            key={e.id}
                                            onClick={() => setSelectedEntityId(e.id)}
                                            className={cn(
                                                "w-full text-left p-4 hover:bg-slate-100 transition-all flex items-center justify-between group border-l-4",
                                                selectedEntityId === e.id 
                                                    ? "bg-white border-l-blue-500 shadow-sm" 
                                                    : "bg-transparent border-l-transparent"
                                            )}
                                        >
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-slate-900 truncate">{e.name}</span>
                                                    {e.health !== 'Healthy' && (
                                                        <span className={cn(
                                                            "w-2 h-2 rounded-full",
                                                            e.health === 'Risk' ? "bg-red-500" : "bg-orange-500"
                                                        )}></span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Badge status="neutral" className="px-1 py-0 text-[10px] uppercase bg-slate-100 text-slate-500 border-slate-200">{e.type}</Badge>
                                                    <span className="truncate">{e.owner}</span>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className={cn("text-slate-300 group-hover:text-slate-400 transition-colors", selectedEntityId === e.id && "text-blue-500")} />
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                        
                        <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs text-center text-slate-400">
                            Showing {filteredEntities.length} entities
                        </div>
                    </div>

                    {/* Entity Detail */}
                    <div className="flex-1 bg-slate-100 relative overflow-hidden">
                        {selectedEntityId ? (
                            <EntityDetailView entityId={selectedEntityId} onClose={() => setSelectedEntityId(null)} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-200">
                                    <Network size={40} className="text-slate-300"/>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-700">Select an Entity</h3>
                                <p className="text-sm max-w-sm mt-2 leading-relaxed">
                                    Choose an entity from the explorer to view its relationships, health signals, and lineage map.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 4. SOURCES */}
            {activeTab === 'sources' && (
                <div className="flex flex-col h-full bg-slate-50">
                    
                    {/* Stats Header */}
                    <div className="p-6 pb-0 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="p-4 flex items-center justify-between border-slate-200">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sources</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{sourceStats.total}</p>
                            </div>
                            <div className="p-2 bg-slate-100 text-slate-500 rounded-lg"><Database size={20}/></div>
                        </Card>
                        <Card className="p-4 flex items-center justify-between border-slate-200">
                            <div>
                                <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Active & Synced</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{sourceStats.healthy}</p>
                            </div>
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={20}/></div>
                        </Card>
                        <Card className="p-4 flex items-center justify-between border-slate-200">
                            <div>
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Syncing Now</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{sourceStats.syncing}</p>
                            </div>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Loader2 size={20} className="animate-spin"/></div>
                        </Card>
                        <Card className="p-4 flex items-center justify-between border-slate-200">
                            <div>
                                <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Errors</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{sourceStats.errors}</p>
                            </div>
                            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertCircle size={20}/></div>
                        </Card>
                    </div>

                    {/* Toolbar */}
                    <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="flex-1 max-w-sm">
                                <Input 
                                    leftIcon={<Search size={14} />}
                                    placeholder="Search sources..."
                                    value={sourceSearchQuery}
                                    onChange={e => setSourceSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-1 bg-slate-200/50 p-1 rounded-lg">
                                <button 
                                    onClick={() => setSourceTypeFilter('all')}
                                    className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-colors", sourceTypeFilter === 'all' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700")}
                                >
                                    All
                                </button>
                                <button 
                                    onClick={() => setSourceTypeFilter('gdrive')}
                                    className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-colors", sourceTypeFilter === 'gdrive' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700")}
                                >
                                    Drive
                                </button>
                                <button 
                                    onClick={() => setSourceTypeFilter('slack')}
                                    className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-colors", sourceTypeFilter === 'slack' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700")}
                                >
                                    Slack
                                </button>
                                <button 
                                    onClick={() => setSourceTypeFilter('confluence')}
                                    className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-colors", sourceTypeFilter === 'confluence' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700")}
                                >
                                    Confluence
                                </button>
                            </div>
                        </div>
                        <Button size="sm" onClick={() => showToast('Opening integration settings...', {type: 'info'})} variant="secondary" leftIcon={<Settings size={14}/>}>
                            Manage Integrations
                        </Button>
                    </div>

                    {/* Table View */}
                    <div className="flex-1 overflow-auto px-6 pb-6">
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Source</th>
                                        <th className="px-6 py-3 font-medium">Type</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium">Last Sync</th>
                                        <th className="px-6 py-3 font-medium text-right">Extracted</th>
                                        <th className="px-6 py-3 font-medium w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredSources.map((source) => (
                                        <tr key={source.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                                                        source.type === 'slack' ? "bg-[#4A154B]/10 border-[#4A154B]/20 text-[#4A154B]" : 
                                                        source.type === 'confluence' ? "bg-[#0052CC]/10 border-[#0052CC]/20 text-[#0052CC]" : 
                                                        "bg-green-50 border-green-200 text-green-700"
                                                    )}>
                                                        <SourceIcon type={source.type} className="" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">{source.name}</div>
                                                        <div className="text-xs text-slate-500 font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">id: {source.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge status="neutral" className="capitalize text-xs font-medium bg-slate-100 text-slate-600 border-slate-200">
                                                    {source.type}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                {source.status === 'synced' && <Badge status="success" dot>Synced</Badge>}
                                                {source.status === 'syncing' && <Badge status="info" className="animate-pulse"><Loader2 size={10} className="mr-1 animate-spin"/> Syncing</Badge>}
                                                {source.status === 'error' && <Badge status="error" dot>Error</Badge>}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">
                                                {source.lastSync}
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-700">
                                                {source.itemsFound || 0}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors" title="Sync Now">
                                                        <RefreshCw size={14}/>
                                                    </button>
                                                    <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors">
                                                        <MoreHorizontal size={14}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredSources.length === 0 && (
                                <div className="p-12 text-center text-slate-400">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <Filter size={24} className="opacity-50"/>
                                    </div>
                                    <p className="text-sm font-medium">No sources found matching your filters.</p>
                                    <button 
                                        onClick={() => { setSourceSearchQuery(''); setSourceTypeFilter('all'); }} 
                                        className="text-xs text-primary-600 hover:underline mt-2"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Ingestion Modal */}
            <Modal
                isOpen={isIngestModalOpen}
                onClose={() => setIsIngestModalOpen(false)}
                title="Manual Ingestion"
                footer={
                    <div className="flex justify-end gap-2 w-full">
                        <Button variant="ghost" onClick={() => setIsIngestModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleIngest} leftIcon={<Sparkles size={16}/>}>Analyze & Extract</Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Paste text below. Atlas will extract Facts, Decisions, and Risks.
                    </p>
                    <textarea 
                        className="w-full h-48 p-3 text-sm border border-slate-300 bg-white text-slate-900 placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none font-mono transition-all duration-200"
                        placeholder="Paste text here..."
                        value={ingestTextValue}
                        onChange={(e) => setIngestTextValue(e.target.value)}
                    />
                </div>
            </Modal>
        </div>
    </PageLayout>
  );
};
