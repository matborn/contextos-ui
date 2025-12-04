import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageLayout } from '../components/ui/PageLayout';
import { 
    Activity, 
    AlertCircle, 
    ShieldCheck, 
    GitMerge, 
    Loader2, 
    RefreshCw,
    Database,
} from '../components/icons/Icons';
import { cn } from '../utils';
import { useToast } from '../components/ui/Toast';
import { MetricCard } from '../components/dashboard/MetricCard';
import { GovernanceItem } from '../components/dashboard/GovernanceItem';
import { QuickAction } from '../components/dashboard/QuickAction';
import { EntityItem } from '../components/dashboard/EntityItem';

interface WorkspaceProps {
  onBack: () => void;
  docId?: string; 
  initialContext?: any;
}

export const Workspace: React.FC<WorkspaceProps> = () => {
  const { showToast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
      setIsRefreshing(true);
      setTimeout(() => {
          setIsRefreshing(false);
          showToast('Dashboard metrics updated', { type: 'success' });
      }, 1000);
  };

  return (
    <PageLayout 
        title="Dashboard"
        badge={<Badge status="success" dot>Active</Badge>}
        description="Last synced: 2 minutes ago"
        headerActions={
            <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleRefresh}
                leftIcon={<RefreshCw size={14} className={cn(isRefreshing && "animate-spin")} />}
            >
                Refresh Data
            </Button>
        }
    >
        {/* 1. Operational Cockpit (Health & Pipeline) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Knowledge Health */}
            <MetricCard
                title="Knowledge Health"
                mainValue="94%"
                subValue="+2% this week"
                icon={<ShieldCheck size={20}/>}
                colorTheme="green"
            >
                <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Consistency</span>
                        <span className="font-medium text-slate-700">98%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[98%]"></div>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Completeness</span>
                        <span className="font-medium text-slate-700">85%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[85%]"></div>
                    </div>
                </div>
            </MetricCard>

            {/* Active Ingestion */}
            <MetricCard
                title="Ingestion Pipeline"
                mainValue="Active"
                subValue={
                    <span className="flex items-center gap-1">
                        <Loader2 size={10} className="animate-spin"/> Processing
                    </span>
                }
                icon={<Activity size={20}/>}
                colorTheme="blue"
            >
                <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-slate-700">Google Drive</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Syncing...</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                            <span className="text-xs font-medium text-slate-700">Slack</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Idle (10m ago)</span>
                    </div>
                </div>
            </MetricCard>

            {/* Conflicts & Risks */}
            <MetricCard
                title="Governance Risks"
                mainValue="3"
                subValue="Requires Attention"
                icon={<AlertCircle size={20}/>}
                colorTheme="orange"
            >
                <div className="space-y-2">
                    <div className="text-xs text-slate-600 flex justify-between">
                        <span>Contradictions</span>
                        <span className="font-bold text-slate-900">1</span>
                    </div>
                    <div className="text-xs text-slate-600 flex justify-between">
                        <span>Stale Decisions</span>
                        <span className="font-bold text-slate-900">2</span>
                    </div>
                    <div className="pt-2">
                        <Button size="sm" variant="secondary" className="w-full text-xs h-7">View Risks</Button>
                    </div>
                </div>
            </MetricCard>
        </div>

        {/* 2. Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Governance Queue */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Governance Queue</h2>
                    <div className="flex gap-2">
                        <Badge status="warning">3 Open</Badge>
                        <Badge status="neutral">12 Resolved</Badge>
                    </div>
                </div>

                <div className="space-y-4">
                    <GovernanceItem 
                        type="Contradiction"
                        typeColor="error"
                        date="Detected 2 hours ago"
                        title="Conflict: API Rate Limiting Thresholds"
                        description='Source A (Engineering Spec) states "10k req/sec", while Source B (SLA Contract) states "25k req/sec".'
                        actions={[
                            { label: "Review Sources", variant: "secondary" },
                            { label: "Resolve", variant: "danger" }
                        ]}
                    />

                    <GovernanceItem 
                        type="Anomaly"
                        typeColor="warning"
                        date="Detected 5 hours ago"
                        title="Stale Decision: Database Selection"
                        description='The decision record "Use PostgreSQL" is 18 months old and may conflict with recent "DynamoDB Migration" architecture notes.'
                        actions={[
                            { label: "Mark Verified", variant: "secondary" },
                            { label: "Re-evaluate", variant: "warning" }
                        ]}
                    />
                </div>
            </div>

            {/* Right: Quick Actions & Key Entities */}
            <div className="space-y-6">
                
                {/* Quick Actions */}
                <div className="bg-slate-100 rounded-xl p-5 border border-slate-200">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <QuickAction 
                            icon={<GitMerge size={16}/>}
                            variant="blue"
                            label="Review Inbox Clusters"
                        />
                        <QuickAction 
                            icon={<Database size={16}/>}
                            variant="purple"
                            label="Explore Key Entities"
                        />
                        <QuickAction 
                            icon={<Activity size={16}/>}
                            variant="green"
                            label="Reprocess Sources"
                        />
                    </div>
                </div>

                {/* Top Entities */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Key Entities</h3>
                    <div className="space-y-3">
                        <EntityItem 
                            initial="P"
                            name="Payment Gateway"
                            detail="Service • Critical"
                            status="healthy"
                        />
                        <EntityItem 
                            initial="A"
                            name="Auth Module"
                            detail="System • Stable"
                            status="healthy"
                        />
                         <EntityItem 
                            initial="L"
                            name="Legacy API"
                            detail="Deprecated • Risk"
                            status="warning"
                        />
                    </div>
                </div>

            </div>
        </div>
    </PageLayout>
  );
};