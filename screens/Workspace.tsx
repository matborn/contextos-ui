import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageLayout } from '../components/ui/PageLayout';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
  UploadCloud,
} from '../components/icons/Icons';
import { cn } from '../utils';
import { useToast } from '../components/ui/Toast';
import { knowledgeSourcesService } from '../services/knowledgeSourcesService';
import { stagingService } from '../services/stagingService';
import {
  KnowledgeSourceStatusResponse,
  KnowledgeSourceSummary,
  StagingCluster,
  StageProgress,
  StageStatus,
} from '../types';

interface WorkspaceProps {
  onBack?: () => void;
}

const stageOrder: (keyof KnowledgeSourceStatusResponse['stages'])[] = [
  'extraction',
  'embedding',
  'clustering',
  'conflictChecks',
];

const stageLabel: Record<string, string> = {
  extraction: 'Extracting',
  embedding: 'Embedding',
  clustering: 'Clustering',
  conflictChecks: 'Conflict checks',
};

const badgeForStage = (state?: StageStatus) => {
  if (state === 'done') return <Badge status="success" dot>Done</Badge>;
  if (state === 'processing') return <Badge status="info" dot>Processing</Badge>;
  if (state === 'error') return <Badge status="error" dot>Error</Badge>;
  return <Badge status="neutral">Pending</Badge>;
};

const badgeForStatus = (status: KnowledgeSourceSummary['status']) => {
  if (status === 'done') return <Badge status="success" dot>Complete</Badge>;
  if (status === 'processing' || status === 'queued') return <Badge status="info" dot>In Progress</Badge>;
  if (status === 'error') return <Badge status="error" dot>Error</Badge>;
  return <Badge status="neutral">Unknown</Badge>;
};

const getStageState = (stage?: StageProgress): StageStatus => stage?.state ?? 'pending';

export const Workspace: React.FC<WorkspaceProps> = () => {
  const { showToast } = useToast();
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSourceSummary[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<KnowledgeSourceStatusResponse | null>(null);
  const [stagingClusters, setStagingClusters] = useState<StagingCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stagingLoading, setStagingLoading] = useState(false);

  const selectedSource = useMemo(
    () => knowledgeSources.find((source) => source.knowledgeSourceId === selectedSourceId) ?? null,
    [knowledgeSources, selectedSourceId],
  );

  const loadSources = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await knowledgeSourcesService.list({ limit: 5 });
      setKnowledgeSources(data.knowledgeSources ?? []);
      if (!selectedSourceId && data.knowledgeSources?.[0]) {
        setSelectedSourceId(data.knowledgeSources[0].knowledgeSourceId);
      }
    } catch (error) {
      showToast('Failed to load ingestion jobs', { type: 'error' });
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [selectedSourceId, showToast]);

  const loadStaging = useCallback(
    async (knowledgeSourceId?: string | null) => {
      setStagingLoading(true);
      try {
        const data = await stagingService.list({ knowledgeSourceId: knowledgeSourceId ?? undefined });
        setStagingClusters(data.clusters ?? []);
      } catch (error) {
        showToast('Unable to load staging inbox', { type: 'error' });
      } finally {
        setStagingLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  useEffect(() => {
    if (!selectedSourceId) return undefined;

    let cancelled = false;
    knowledgeSourcesService
      .getStatus(selectedSourceId)
      .then((status) => {
        if (!cancelled) setActiveStatus(status);
      })
      .catch(() => {
        if (!cancelled) showToast('Unable to fetch ingestion status', { type: 'error' });
      });

    const sub = knowledgeSourcesService.subscribeToEvents(selectedSourceId, {
      onUpdate: (status) => setActiveStatus(status),
      onError: () => {
        if (!cancelled) showToast('Realtime ingestion updates paused. Retrying...', { type: 'warning' });
      },
    });

    loadStaging(selectedSourceId);

    return () => {
      cancelled = true;
      sub.unsubscribe();
    };
  }, [selectedSourceId, showToast, loadStaging]);

  const handlePromote = async (clusterId: string) => {
    try {
      await stagingService.promote(clusterId);
      showToast('Cluster promoted', { type: 'success' });
      loadStaging(selectedSourceId);
    } catch (error) {
      showToast('Failed to promote cluster', { type: 'error' });
    }
  };

  const handleReject = async (clusterId: string) => {
    try {
      await stagingService.reject(clusterId);
      showToast('Cluster rejected', { type: 'info' });
      loadStaging(selectedSourceId);
    } catch (error) {
      showToast('Failed to reject cluster', { type: 'error' });
    }
  };

  const pipelineCompletion = useMemo(() => {
    if (!activeStatus?.stages) return 0;
    const stages = stageOrder.map((stage) => getStageState(activeStatus.stages?.[stage]));
    const doneCount = stages.filter((state) => state === 'done').length;
    return Math.round((doneCount / stageOrder.length) * 100);
  }, [activeStatus]);

  return (
    <PageLayout
      title="Ingestion & Staging"
      badge={<Badge status="success" dot>Live</Badge>}
      description="Uploads, ingestion progress, and staging inbox wired to the Core API."
      headerActions={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            loadSources();
            loadStaging(selectedSourceId);
          }}
          leftIcon={<RefreshCw size={14} className={cn(refreshing && 'animate-spin')} />}
          disabled={refreshing}
        >
          Refresh
        </Button>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 p-5 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active ingestion</p>
              <h2 className="text-lg font-semibold text-slate-900">Knowledge sources</h2>
            </div>
            {loading && <Loader2 size={16} className="text-primary-500 animate-spin" />}
          </div>

          {knowledgeSources.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50">
              <UploadCloud className="mx-auto mb-3 text-slate-300" size={28} />
              <p className="text-slate-700 font-medium">No ingestions yet</p>
              <p className="text-slate-500 text-sm mt-1">Kick off an upload to start tracking ingestion progress.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden bg-white">
              {knowledgeSources.map((source) => (
                <div
                  key={source.knowledgeSourceId}
                  className={cn(
                    'px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer',
                    selectedSourceId === source.knowledgeSourceId && 'bg-primary-50/50',
                  )}
                  onClick={() => setSelectedSourceId(source.knowledgeSourceId)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 truncate">{source.title}</p>
                      {badgeForStatus(source.status)}
                    </div>
                    <p className="text-xs text-slate-500">
                      Source: <span className="font-mono text-slate-700">{source.sourceType}</span>
                      {source.createdAt ? ` • Created ${new Date(source.createdAt).toLocaleString()}` : ''}
                    </p>
                  </div>
                  <Button size="sm" variant="secondary">
                    Track
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pipeline</p>
              <h3 className="text-base font-semibold text-slate-900">
                {selectedSource?.title || 'Select an ingestion'}
              </h3>
            </div>
            {selectedSource && badgeForStatus(selectedSource.status)}
          </div>

          {!selectedSource ? (
            <div className="text-slate-500 text-sm">Pick a knowledge source to view progress.</div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary-500 transition-all duration-300"
                    style={{ width: `${pipelineCompletion}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-700 w-12 text-right">{pipelineCompletion}%</span>
              </div>

              <div className="space-y-2">
                {stageOrder.map((stage) => (
                  <div key={stage} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary-500" />
                      <p className="text-sm font-medium text-slate-900">{stageLabel[stage]}</p>
                    </div>
                    {badgeForStage(getStageState(activeStatus?.stages?.[stage]))}
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Staging inbox</p>
            <h3 className="text-lg font-semibold text-slate-900">Clusters awaiting decision</h3>
          </div>
          {stagingLoading && <Loader2 size={16} className="text-primary-500 animate-spin" />}
        </div>

        {stagingClusters.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50">
            <AlertTriangle className="mx-auto mb-3 text-slate-300" size={28} />
            <p className="text-slate-700 font-medium">No staging clusters</p>
            <p className="text-slate-500 text-sm mt-1">
              New extractions will appear here for promotion or rejection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {stagingClusters.map((cluster) => (
              <Card key={cluster.id} className="p-4 border-slate-200 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{cluster.title}</h4>
                      {cluster.promoted && <Badge status="success">Promoted</Badge>}
                      {cluster.rejected && <Badge status="neutral">Rejected</Badge>}
                    </div>
                    <p className="text-xs text-slate-500">{cluster.summary || 'Cluster ready for review.'}</p>
                  </div>
                  <Badge status="neutral" className="text-[10px] uppercase">
                    {cluster.items.length} items
                  </Badge>
                </div>

                <div className="space-y-2">
                  {cluster.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{item.type}</p>
                      <p className="text-sm text-slate-900">{item.content}</p>
                      {item.aiActionTaken && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                          <AlertCircle size={12} className="text-amber-500" />
                          <span>{item.aiActionTaken}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {cluster.items.length > 3 && (
                    <p className="text-xs text-slate-500">+{cluster.items.length - 3} more</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleReject(cluster.id)}
                    leftIcon={<AlertTriangle size={14} />}
                  >
                    Reject
                  </Button>
                  <Button size="sm" onClick={() => handlePromote(cluster.id)} leftIcon={<CheckCircle size={14} />}>
                    Promote
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
