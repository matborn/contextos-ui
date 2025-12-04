
import React, { useEffect, useState, useMemo } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { 
    Network, 
    Database, 
    Code, 
    GitBranch, 
    ChevronRight, 
    Loader2, 
    FileText, 
    ShieldCheck, 
    Wand2, 
    Check, 
    Plus,
    GitMerge,
    ArrowRight,
    Sparkles,
    Search
} from '../components/icons/Icons';
import { EntityType, OntologyGraph, RelationType, OntologySuggestion } from '../types';
import { fetchOntologyGraph, fetchOntologySuggestions, generateOntologyFromContext } from '../services/geminiService';
import { cn } from '../utils';

// --- Graph Visualization Logic ---

const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
    'et_feature': { x: 400, y: 300 },
    'et_requirement': { x: 700, y: 300 },
    'et_person': { x: 400, y: 100 },
    'evt_decision': { x: 100, y: 300 },
    'et_risk': { x: 100, y: 500 },
    'et_team': { x: 700, y: 100 },
};

export const OntologyViewer: React.FC = () => {
    const { showToast } = useToast();
    
    // View State
    const [viewMode, setViewMode] = useState<'visual' | 'dictionary' | 'staging'>('visual');
    
    // Data State
    const [graph, setGraph] = useState<OntologyGraph | null>(null);
    const [suggestions, setSuggestions] = useState<OntologySuggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
    const [entitySearch, setEntitySearch] = useState('');
    const [entityFilterType, setEntityFilterType] = useState<string>('all');
    
    // Wizard State
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [wizardContext, setWizardContext] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        Promise.all([
            fetchOntologyGraph(),
            fetchOntologySuggestions()
        ]).then(([gData, sData]) => {
            setGraph(gData);
            setSuggestions(sData);
            setLoading(false);
        });
    }, []);

    const selectedEntity = useMemo(() => 
        graph?.entities.find(e => e.id === selectedEntityId), 
    [graph, selectedEntityId]);

    const relatedLinks = useMemo(() => {
        if (!graph || !selectedEntityId) return [];
        return graph.relations.filter(r => r.fromEntityId === selectedEntityId || r.toEntityId === selectedEntityId);
    }, [graph, selectedEntityId]);

    const pendingSuggestionsCount = suggestions.filter(s => s.status === 'pending').length;

    // --- Handlers ---

    const handleGenerate = async () => {
        if (!wizardContext.trim()) return;
        setIsGenerating(true);
        try {
            const newSuggestions = await generateOntologyFromContext(wizardContext);
            setSuggestions(prev => [...prev, ...newSuggestions]);
            setIsWizardOpen(false);
            setWizardContext('');
            setViewMode('staging'); // Switch to staging to see results
            showToast(`${newSuggestions.length} schema suggestions generated`, { type: 'success' });
        } catch (e) {
            showToast('Generation failed', { type: 'error' });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSuggestionAction = (id: string, action: 'approve' | 'reject') => {
        setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: action === 'approve' ? 'approved' : 'rejected' } : s));
        showToast(action === 'approve' ? 'Schema updated' : 'Suggestion discarded', { type: action === 'approve' ? 'success' : 'info' });
        // In a real app, this would also trigger an update to the actual graph state
    };

    // --- Renderers ---

    const renderNode = (entity: EntityType) => {
        const pos = NODE_POSITIONS[entity.id] || { x: 50, y: 50 };
        const isSelected = entity.id === selectedEntityId;
        const colorClass = entity.kind === 'event' ? 'stroke-orange-500 fill-orange-50' : 'stroke-primary-500 fill-primary-50';
        
        return (
            <g 
                key={entity.id} 
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedEntityId(entity.id)}
                className="cursor-pointer transition-all duration-300"
                style={{ opacity: selectedEntityId && !isSelected ? 0.4 : 1 }}
            >
                <circle 
                    r="40" 
                    className={cn(
                        "stroke-2 transition-all duration-300",
                        colorClass,
                        isSelected ? "stroke-4 fill-white filter drop-shadow-lg" : ""
                    )}
                />
                <foreignObject x="-12" y="-12" width="24" height="24" className="pointer-events-none text-slate-600">
                    {entity.kind === 'event' ? <ShieldCheck size={24} className="text-orange-500"/> : <Database size={24} className="text-primary-500"/>}
                </foreignObject>
                <text y="60" textAnchor="middle" className="text-xs font-bold fill-slate-700 uppercase tracking-wide pointer-events-none">
                    {entity.name}
                </text>
                <rect x="25" y="-35" width="24" height="16" rx="8" className="fill-slate-200" />
                <text x="37" y="-23" textAnchor="middle" className="text-[10px] font-bold fill-slate-600">{entity.stats.instanceCount}</text>
            </g>
        );
    };

    const renderEdges = () => {
        if (!graph) return null;
        return graph.relations.map(rel => {
            const start = NODE_POSITIONS[rel.fromEntityId];
            const end = NODE_POSITIONS[rel.toEntityId];
            if (!start || !end) return null;

            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            const isHorizontal = Math.abs(start.y - end.y) < 50;
            const controlX = isHorizontal ? midX : midX + 50;
            const controlY = isHorizontal ? midY - 50 : midY;

            const pathData = `M${start.x},${start.y} Q${controlX},${controlY} ${end.x},${end.y}`;
            const isRelated = selectedEntityId && (rel.fromEntityId === selectedEntityId || rel.toEntityId === selectedEntityId);

            return (
                <g key={rel.id} className={cn("transition-opacity duration-300", selectedEntityId && !isRelated ? "opacity-10" : "opacity-100")}>
                    <path d={pathData} fill="none" stroke="#cbd5e1" strokeWidth="2" />
                    <text x={midX} y={midY} textAnchor="middle" className="text-[10px] fill-slate-400 bg-white">
                        {rel.name}
                    </text>
                </g>
            );
        });
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
            <PageHeader 
                title="Ontology Schema" 
                description="The blueprint of your knowledge graph. Definitions, types, and allowed relationships."
                badge={<Badge status="info">v1.2 Active</Badge>}
            >
                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setViewMode('visual')}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                                viewMode === 'visual' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <Network size={14} /> Map
                        </button>
                        <button 
                            onClick={() => setViewMode('dictionary')}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                                viewMode === 'dictionary' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <FileText size={14} /> Dictionary
                        </button>
                        <button 
                            onClick={() => setViewMode('staging')}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 relative",
                                viewMode === 'staging' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <GitMerge size={14} /> Staging
                            {pendingSuggestionsCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[9px] text-white font-bold ring-2 ring-white">
                                    {pendingSuggestionsCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {(viewMode === 'visual' || viewMode === 'dictionary') && (
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            leftIcon={<Wand2 size={16}/>} 
                            onClick={() => setIsWizardOpen(true)}
                        >
                            Generate Schema
                        </Button>
                    )}
                </div>
            </PageHeader>

            <div className="flex-1 overflow-hidden flex relative">
                
                {/* --- Main Content Area --- */}
                <div className={cn("flex-1 bg-slate-50/50 overflow-hidden relative transition-all duration-300", (selectedEntity && viewMode !== 'staging') ? "mr-[400px]" : "")}>
                    
                    {loading ? (
                         <div className="absolute inset-0 flex items-center justify-center">
                             <Loader2 className="animate-spin text-primary-500" size={32} />
                         </div>
                    ) : viewMode === 'staging' ? (
                        
                        /* --- STAGING / EVOLUTION VIEW --- */
                        <div className="p-8 max-w-4xl mx-auto overflow-y-auto h-full animate-fadeIn">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Schema Evolution Staging</h2>
                                    <p className="text-sm text-slate-500">Review new entities and relations discovered by AI or generated via wizard.</p>
                                </div>
                                <Button size="sm" onClick={() => setIsWizardOpen(true)} leftIcon={<Wand2 size={16}/>}>
                                    Generate from Content
                                </Button>
                            </div>

                            {pendingSuggestionsCount === 0 && (
                                <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <Check size={32} />
                                    </div>
                                    <h3 className="text-slate-900 font-medium">Schema is up to date</h3>
                                    <p className="text-slate-500 text-sm mt-1">No pending suggestions found.</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {suggestions.filter(s => s.status === 'pending').map(suggestion => (
                                    <div key={suggestion.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-primary-300 transition-colors">
                                        
                                        {/* Icon */}
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                            suggestion.type === 'new-entity' ? "bg-purple-100 text-purple-600" : 
                                            suggestion.type === 'new-relation' ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
                                        )}>
                                            {suggestion.type === 'new-entity' && <Database size={20}/>}
                                            {suggestion.type === 'new-relation' && <GitMerge size={20}/>}
                                            {suggestion.type === 'update-property' && <Code size={20}/>}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge status={
                                                    suggestion.type === 'new-entity' ? 'info' : 
                                                    suggestion.type === 'new-relation' ? 'neutral' : 'warning'
                                                } className="capitalize">
                                                    {suggestion.type.replace('-', ' ')}
                                                </Badge>
                                                <span className="text-xs text-slate-400">• Detected {new Date(suggestion.detectedAt).toLocaleTimeString()}</span>
                                            </div>
                                            
                                            <h3 className="font-semibold text-slate-900 text-lg flex items-center gap-2">
                                                {suggestion.content.name}
                                                {suggestion.type === 'new-relation' && (
                                                    <span className="text-sm font-normal text-slate-500 flex items-center gap-1">
                                                        ({suggestion.content.fromEntity} <ArrowRight size={12}/> {suggestion.content.toEntity})
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-slate-600 mt-1">{suggestion.content.description}</p>
                                            
                                            {/* AI Reasoning */}
                                            <div className="mt-3 p-2 bg-slate-50 rounded text-xs text-slate-500 border border-slate-100 flex items-start gap-2">
                                                <Sparkles size={14} className="text-brand-ai-500 mt-0.5 shrink-0"/>
                                                {suggestion.reasoning}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2">
                                            <Button 
                                                size="sm" 
                                                className="w-full bg-green-600 hover:bg-green-700 text-white" 
                                                onClick={() => handleSuggestionAction(suggestion.id, 'approve')}
                                                leftIcon={<Check size={14}/>}
                                            >
                                                Approve
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="secondary"
                                                onClick={() => handleSuggestionAction(suggestion.id, 'reject')}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    ) : viewMode === 'visual' ? (
                        /* SVG Graph Surface */
                        <div className="w-full h-full overflow-auto bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
                            <svg width="100%" height="100%" viewBox="0 0 800 600" className="w-full h-full min-w-[800px] min-h-[600px]">
                                {renderEdges()}
                                {graph?.entities.map(renderNode)}
                            </svg>
                        </div>
                    ) : (
                        /* Dictionary List View */
                        <div className="p-8 max-w-4xl mx-auto overflow-y-auto h-full">
                            <div className="grid grid-cols-1 gap-4">
                                {graph?.entities.map(entity => (
                                    <div 
                                        key={entity.id}
                                        onClick={() => setSelectedEntityId(entity.id)}
                                        className={cn(
                                            "bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-primary-300 hover:shadow-md transition-all flex items-start justify-between group",
                                            selectedEntityId === entity.id ? "ring-2 ring-primary-500 border-primary-500" : ""
                                        )}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={cn("p-3 rounded-lg", entity.kind === 'event' ? "bg-orange-50 text-orange-600" : "bg-primary-50 text-primary-600")}>
                                                {entity.kind === 'event' ? <ShieldCheck size={20}/> : <Database size={20}/>}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                                    {entity.name}
                                                    <Badge status="neutral" className="text-[10px] py-0">{entity.namespace}</Badge>
                                                </h3>
                                                <p className="text-sm text-slate-500 mt-1">{entity.shortDescription}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-slate-300 group-hover:text-primary-500" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Inspector Panel (Only in Visual/Dict Mode) */}
                {viewMode !== 'staging' && (
                    <div className={cn(
                        "fixed inset-y-0 right-0 w-[400px] bg-white border-l border-slate-200 shadow-2xl transform transition-transform duration-300 z-30 pt-16 flex flex-col",
                        selectedEntityId ? "translate-x-0" : "translate-x-full"
                    )}>
                        {selectedEntity && (
                            <>
                                {/* Panel Header */}
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                                    <div>
                                        <Badge status={selectedEntity.kind === 'event' ? 'warning' : 'info'} className="mb-2 uppercase tracking-wider text-[10px]">
                                            {selectedEntity.kind === 'entity' ? 'Core Entity' : 'Event Type'}
                                        </Badge>
                                        <h2 className="text-2xl font-bold text-slate-900">{selectedEntity.name}</h2>
                                        <p className="text-sm font-mono text-slate-400 mt-1">{selectedEntity.id}</p>
                                    </div>
                                    <button onClick={() => setSelectedEntityId(null)} className="text-slate-400 hover:text-slate-600">
                                        <span className="sr-only">Close</span>
                                        <ChevronRight size={24} />
                                    </button>
                                </div>

                                {/* Panel Content */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                    
                                    {/* Description */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Definition</h4>
                                        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            {selectedEntity.shortDescription}
                                        </p>
                                        {selectedEntity.synonyms.length > 0 && (
                                            <div className="flex gap-2 mt-3 flex-wrap">
                                                {selectedEntity.synonyms.map(syn => (
                                                    <span key={syn} className="text-xs px-2 py-1 bg-white border border-slate-200 rounded text-slate-500">
                                                        AKA: {syn}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Properties Schema */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Properties Schema</h4>
                                            <Code size={14} className="text-slate-300"/>
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                                                    <tr>
                                                        <th className="px-3 py-2">Field</th>
                                                        <th className="px-3 py-2">Type</th>
                                                        <th className="px-3 py-2 text-right">Required</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {selectedEntity.properties.map(prop => (
                                                        <tr key={prop.name}>
                                                            <td className="px-3 py-2 font-mono text-blue-600">{prop.name}</td>
                                                            <td className="px-3 py-2 text-slate-500">{prop.type}</td>
                                                            <td className="px-3 py-2 text-right">
                                                                {prop.required ? (
                                                                    <span className="text-red-500 font-bold">•</span>
                                                                ) : (
                                                                    <span className="text-slate-300">-</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Relationships */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Allowed Relations</h4>
                                            <GitBranch size={14} className="text-slate-300"/>
                                        </div>
                                        <div className="space-y-2">
                                            {relatedLinks.length === 0 ? (
                                                <p className="text-sm text-slate-400 italic">No relations defined.</p>
                                            ) : relatedLinks.map(rel => {
                                                const isOutgoing = rel.fromEntityId === selectedEntityId;
                                                const otherId = isOutgoing ? rel.toEntityId : rel.fromEntityId;
                                                const otherName = graph?.entities.find(e => e.id === otherId)?.name;

                                                return (
                                                    <div key={rel.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50 text-sm">
                                                        <div className={cn(
                                                            "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider w-12 text-center shrink-0",
                                                            isOutgoing ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                                                        )}>
                                                            {isOutgoing ? 'OUT' : 'IN'}
                                                        </div>
                                                        <div className="flex-1 font-mono text-xs text-slate-600">
                                                            {rel.name}
                                                        </div>
                                                        <div className="text-slate-900 font-semibold flex items-center gap-1">
                                                            {otherName}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
                
                {/* Search & Filter Header */}
                <div className="w-80 border-r border-slate-200 bg-slate-50 overflow-hidden flex flex-col fixed left-0 top-[64px] bottom-0 z-10">
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
                    {/* ... rest of sidebar ... */}
                </div>

            </div>

            {/* --- Wizard Modal --- */}
            <Modal
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                title="Generate Ontology Schema"
                footer={
                    <div className="flex justify-end gap-2 w-full">
                        <Button variant="ghost" onClick={() => setIsWizardOpen(false)}>Cancel</Button>
                        <Button 
                            onClick={handleGenerate} 
                            isLoading={isGenerating}
                            leftIcon={<Wand2 size={16}/>}
                        >
                            Analyze & Generate
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Paste any context about your domain (e.g. "We are a logistics company handling Shipments, Drivers, and Vehicles"). 
                        The AI will extract proposed Entities and Relations for your schema.
                    </p>
                    <textarea 
                        className="w-full h-48 p-3 text-sm border border-slate-300 bg-white text-slate-900 placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none transition-all duration-200"
                        placeholder="Describe your domain concepts here..."
                        value={wizardContext}
                        onChange={(e) => setWizardContext(e.target.value)}
                        autoFocus
                    />
                </div>
            </Modal>

        </div>
    );
};
