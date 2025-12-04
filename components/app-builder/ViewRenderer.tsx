

import React from 'react';
import { ViewSpec, ChartSpec, TableSpec, DashboardSpec, SmartFormSpec, InsightCardSpec, ObjectCardSpec } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Zap, ArrowRight, TrendingUp, TrendingDown, Minus, Filter, MoreHorizontal, MapPin, Calendar, DollarSign, ShieldAlert, Pin, PinOff } from '../icons/Icons';
import { cn } from '../../utils';

interface ViewRendererProps {
  spec: ViewSpec;
  className?: string;
  onToggleFreeze?: (id: string) => void;
}

// Helper for the header action
const CardActionHeader: React.FC<{ 
    title?: string; 
    specId: string; 
    isFrozen?: boolean; 
    onToggleFreeze?: (id: string) => void;
    children?: React.ReactNode;
}> = ({ title, specId, isFrozen, onToggleFreeze, children }) => (
    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/30">
        <div className="flex items-center gap-2">
            {isFrozen && <Pin size={12} className="text-blue-500 fill-blue-100" />}
            {title && <CardTitle className={isFrozen ? "text-blue-800" : ""}>{title}</CardTitle>}
        </div>
        <div className="flex items-center gap-1">
            {children}
            {onToggleFreeze && (
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn("h-7 w-7 p-0 transition-colors", isFrozen ? "text-blue-500 hover:text-blue-600 bg-blue-50" : "text-slate-400 hover:text-slate-600")}
                    onClick={() => onToggleFreeze(specId)}
                    title={isFrozen ? "Unfreeze widget" : "Freeze widget to prevent updates"}
                >
                    {isFrozen ? <PinOff size={14}/> : <Pin size={14}/>}
                </Button>
            )}
        </div>
    </CardHeader>
);

// --- Specific Component Renderers ---

const InsightCard: React.FC<{ spec: InsightCardSpec, onToggleFreeze?: (id: string) => void }> = ({ spec, onToggleFreeze }) => {
    return (
        <Card className={cn("h-full border-l-4 transition-all", spec.isFrozen ? "border-l-blue-500 ring-1 ring-blue-500/20 shadow-md" : "border-l-purple-500")}>
            <div className="p-4 pb-0 flex justify-between items-start">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Zap size={14} className={spec.isFrozen ? "text-blue-500" : "text-purple-500"} />
                    AI Insight
                </div>
                <div className="flex items-center gap-2">
                    <Badge status="info" className="text-[10px]">{Math.round(spec.confidence * 100)}% conf</Badge>
                    {onToggleFreeze && (
                        <button 
                            onClick={() => onToggleFreeze(spec.id)}
                            className={cn("p-1 rounded hover:bg-slate-100 transition-colors", spec.isFrozen ? "text-blue-500" : "text-slate-300")}
                        >
                            {spec.isFrozen ? <PinOff size={14}/> : <Pin size={14}/>}
                        </button>
                    )}
                </div>
            </div>
            <CardContent className="p-6 pt-4 space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{spec.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-3xl font-bold text-slate-900">{spec.value}</span>
                        {spec.trend && (
                            <span className={cn(
                                "flex items-center text-sm font-medium px-2 py-0.5 rounded-full",
                                spec.trend === 'up' ? "text-green-700 bg-green-50" : 
                                spec.trend === 'down' ? "text-red-700 bg-red-50" : "text-slate-600 bg-slate-100"
                            )}>
                                {spec.trend === 'up' && <TrendingUp size={14} className="mr-1"/>}
                                {spec.trend === 'down' && <TrendingDown size={14} className="mr-1"/>}
                                {spec.trend === 'neutral' && <Minus size={14} className="mr-1"/>}
                                YoY
                            </span>
                        )}
                    </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {spec.summary}
                </p>
                
                {spec.actions && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {spec.actions.map(action => (
                            <Button key={action} size="sm" variant="secondary" className="text-xs h-8">
                                {action}
                            </Button>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const SimpleChart: React.FC<{ spec: ChartSpec, onToggleFreeze?: (id: string) => void }> = ({ spec, onToggleFreeze }) => {
    const maxVal = Math.max(...(spec.data?.map((d: any) => Math.max(d.spend || 0, d.budget || 0)) || [100]));
    
    return (
        <Card className={cn("h-full flex flex-col transition-all", spec.isFrozen ? "ring-1 ring-blue-500/20 shadow-md" : "")}>
            <CardActionHeader title={spec.title} specId={spec.id} isFrozen={spec.isFrozen} onToggleFreeze={onToggleFreeze}>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Filter size={14}/></Button>
            </CardActionHeader>
            <CardContent className="flex-1 flex flex-col justify-end min-h-[200px] p-6">
                <div className="w-full flex items-end justify-between gap-2 h-40">
                    {spec.data?.map((item: any, i: number) => (
                        <div key={i} className="flex-1 flex flex-col justify-end gap-1 group relative">
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                ${item.spend}
                            </div>
                            
                            {/* Bar Group */}
                            <div className="w-full flex gap-0.5 items-end justify-center h-full">
                                <div 
                                    className="w-full bg-blue-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                                    style={{ height: `${(item.spend / maxVal) * 100}%` }}
                                ></div>
                                <div 
                                    className="w-full bg-slate-200 rounded-t-sm"
                                    style={{ height: `${(item.budget / maxVal) * 100}%` }}
                                ></div>
                            </div>
                            
                            <span className="text-[10px] text-slate-500 text-center font-medium mt-1 truncate w-full block">
                                {item[spec.x_axis]}
                            </span>
                        </div>
                    ))}
                </div>
                
                <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></div>Spend</div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-slate-200 rounded-sm"></div>Budget</div>
                </div>
            </CardContent>
        </Card>
    );
};

const SmartTable: React.FC<{ spec: TableSpec, onToggleFreeze?: (id: string) => void }> = ({ spec, onToggleFreeze }) => {
    return (
        <Card className={cn("h-full overflow-hidden flex flex-col transition-all", spec.isFrozen ? "ring-1 ring-blue-500/20 shadow-md" : "")}>
            <CardActionHeader title={spec.title} specId={spec.id} isFrozen={spec.isFrozen} onToggleFreeze={onToggleFreeze}>
                <Button variant="secondary" size="sm" className="h-7 text-xs">Export</Button>
            </CardActionHeader>
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                        <tr>
                            {spec.columns.map(col => (
                                <th key={col.key} className="px-6 py-3">{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {spec.data?.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                {spec.columns.map(col => (
                                    <td key={col.key} className="px-6 py-3 text-slate-700">
                                        {col.type === 'badge' ? (
                                            <Badge status="neutral" className="text-xs">{row[col.key]}</Badge>
                                        ) : col.type === 'currency' ? (
                                            <span className="font-mono">${row[col.key]}</span>
                                        ) : (
                                            row[col.key]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const SmartForm: React.FC<{ spec: SmartFormSpec, onToggleFreeze?: (id: string) => void }> = ({ spec, onToggleFreeze }) => {
    return (
        <Card className={cn("max-w-2xl mx-auto border-t-4 transition-all", spec.isFrozen ? "border-t-blue-500 ring-1 ring-blue-500/20 shadow-md" : "border-t-teal-500")}>
            <CardActionHeader title={spec.title} specId={spec.id} isFrozen={spec.isFrozen} onToggleFreeze={onToggleFreeze} />
            {spec.description && <div className="px-6 pb-2 text-sm text-slate-500">{spec.description}</div>}
            <CardContent className="space-y-6 pt-4">
                {spec.fields.map(field => (
                    <div key={field.id}>
                        {field.type === 'select' ? (
                          <Select
                            label={field.label}
                            placeholder="Select an option"
                            options={
                              field.options?.map((opt: any) => ({ value: opt.value ?? opt, label: opt.label ?? opt })) ?? [
                                { value: 'investment', label: 'Investment' },
                                { value: 'owner', label: 'Owner Occupier' },
                              ]
                            }
                          />
                        ) : field.type === 'textarea' ? (
                          <Textarea label={field.label} placeholder={field.placeholder} className="min-h-[96px]" />
                        ) : (
                          <Input
                            label={field.label}
                            placeholder={field.placeholder}
                            required={field.required}
                            className="focus:border-teal-500 focus:ring-teal-500/20"
                          />
                        )}
                    </div>
                ))}
            </CardContent>
            <CardFooter className="bg-slate-50 justify-between items-center">
                <span className="text-xs text-slate-400 flex items-center gap-1"><ShieldAlert size={12}/> Secure 256-bit encryption</span>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white" rightIcon={<ArrowRight size={16}/>}>
                    {spec.submitLabel}
                </Button>
            </CardFooter>
        </Card>
    );
};

const ObjectCard: React.FC<{ spec: ObjectCardSpec, onToggleFreeze?: (id: string) => void }> = ({ spec, onToggleFreeze }) => {
    return (
        <Card className={cn("max-w-md mx-auto overflow-hidden transition-all", spec.isFrozen ? "ring-1 ring-blue-500/20 shadow-md" : "")}>
            <div className="absolute top-2 right-2 z-10">
                {onToggleFreeze && (
                    <button 
                        onClick={() => onToggleFreeze(spec.id)}
                        className={cn("p-1.5 rounded-full bg-white/20 backdrop-blur-sm transition-colors", spec.isFrozen ? "text-white" : "text-white/70 hover:text-white")}
                    >
                        {spec.isFrozen ? <PinOff size={14}/> : <Pin size={14}/>}
                    </button>
                )}
            </div>
            <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-700 p-6 flex items-end">
                <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-2xl font-bold text-slate-800 transform translate-y-6">
                    {spec.data.name.charAt(0)}
                </div>
            </div>
            <CardContent className="pt-10 pb-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{spec.data.name}</h3>
                        <Badge status="neutral" className="mt-1">{spec.data.category}</Badge>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-400 font-bold uppercase">Risk Score</div>
                        <div className="text-green-600 font-bold flex items-center justify-end gap-1">
                            <ShieldAlert size={14}/> {spec.data.riskScore}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-100">
                     <div>
                         <div className="text-xs text-slate-400 flex items-center gap-1 mb-1"><DollarSign size={12}/> Avg Spend</div>
                         <div className="font-mono text-slate-900 font-medium">{spec.data.avgSpend}</div>
                     </div>
                     <div>
                         <div className="text-xs text-slate-400 flex items-center gap-1 mb-1"><Calendar size={12}/> Last Visit</div>
                         <div className="text-slate-900 font-medium">{spec.data.lastVisit}</div>
                     </div>
                </div>

                {spec.actions && (
                    <div className="flex flex-col gap-2">
                        {spec.actions.map(action => (
                            <Button key={action} variant="secondary" className="w-full justify-between group">
                                {action}
                                <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-600"/>
                            </Button>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export const ViewRenderer: React.FC<ViewRendererProps> = ({ spec, className, onToggleFreeze }) => {
  if (!spec) return null;

  switch (spec.type) {
    case 'dashboard':
      return (
        <div className={cn(
            "w-full h-full", 
            spec.layout === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-6",
            className
        )}>
            {(spec as DashboardSpec).components.map(comp => (
                <ViewRenderer key={comp.id} spec={comp} className={spec.layout === 'stack' ? 'w-full' : ''} onToggleFreeze={onToggleFreeze} />
            ))}
        </div>
      );
    case 'insight_card':
        return <InsightCard spec={spec as InsightCardSpec} onToggleFreeze={onToggleFreeze} />;
    case 'line_chart':
    case 'bar_chart':
        return <SimpleChart spec={spec as ChartSpec} onToggleFreeze={onToggleFreeze} />;
    case 'table':
        return <SmartTable spec={spec as TableSpec} onToggleFreeze={onToggleFreeze} />;
    case 'form':
        return <SmartForm spec={spec as SmartFormSpec} onToggleFreeze={onToggleFreeze} />;
    case 'object_card':
        return <ObjectCard spec={spec as ObjectCardSpec} onToggleFreeze={onToggleFreeze} />;
    default:
        return <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded">Unknown Component: {(spec as any).type}</div>;
  }
};
