import React, { useEffect, useMemo, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { PageLayout } from '../components/ui/PageLayout';
import { TabBar, TabItem } from '../components/ui/TabBar';
import { Loader2, RefreshCw, Search, AlertCircle, Network } from '../components/icons/Icons';
import { insightsService } from '../services/insightsService';
import { entitiesService } from '../services/entitiesService';
import { Insight, InsightCounts, EntityDetail, EntitySummary } from '../types';
import { cn } from '../utils';
import { useToast } from '../components/ui/Toast';

type KnowledgeTab = 'insights' | 'entities';

const statusBadge = (status: string) => {
  if (status === 'verified' || status === 'canonical') return <Badge status="success">Verified</Badge>;
  if (status === 'decided' || status === 'review') return <Badge status="warning">In Review</Badge>;
  if (status === 'error') return <Badge status="error">Error</Badge>;
  return <Badge status="neutral">{status || 'Unknown'}</Badge>;
};

const healthBadge = (health?: EntityDetail['health']) => {
  if (!health) return <Badge status="neutral">Health N/A</Badge>;
  if (health.status === 'healthy') return <Badge status="success" dot>Healthy</Badge>;
  if (health.status === 'warning') return <Badge status="warning" dot>Warning</Badge>;
  if (health.status === 'critical') return <Badge status="error" dot>Critical</Badge>;
  return <Badge status="neutral">{health.status}</Badge>;
};

export const KnowledgeBase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<KnowledgeTab>('insights');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [counts, setCounts] = useState<InsightCounts[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalInsights, setTotalInsights] = useState(0);

  const [entities, setEntities] = useState<EntitySummary[]>([]);
  const [entitiesLoading, setEntitiesLoading] = useState(false);
  const [entityQuery, setEntityQuery] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<EntityDetail | null>(null);

  const { showToast } = useToast();

  const loadInsights = async () => {
    setInsightsLoading(true);
    try {
      const data = await insightsService.list({
        q: query || null,
        status: statusFilter,
        offset: page * 20,
        limit: 20,
        layer: 'canonical',
      });
      setInsights(data.insights || []);
      setCounts(data.counts || []);
      setTotalInsights(data.total || 0);
    } catch (error) {
      showToast('Failed to load insights', { type: 'error' });
    } finally {
      setInsightsLoading(false);
    }
  };

  const loadEntities = async () => {
    setEntitiesLoading(true);
    try {
      const data = await entitiesService.list({
        q: entityQuery || null,
        limit: 25,
        offset: 0,
      });
      setEntities(data.entities || []);
      if (!selectedEntityId && data.entities?.[0]) {
        setSelectedEntityId(data.entities[0].id);
      }
    } catch (error) {
      showToast('Failed to load entities', { type: 'error' });
    } finally {
      setEntitiesLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [statusFilter, page]);

  useEffect(() => {
    loadEntities();
  }, []);

  useEffect(() => {
    if (!selectedEntityId) return;
    entitiesService
      .getDetail(selectedEntityId)
      .then(setSelectedEntity)
      .catch(() => showToast('Unable to load entity detail', { type: 'error' }));
  }, [selectedEntityId, showToast]);

  const statusNav = useMemo<TabItem[]>(() => {
    const base: TabItem[] = [{ id: 'insights', label: 'Insights' }, { id: 'entities', label: 'Entities' }];
    return base;
  }, []);

  return (
    <PageLayout
      title="Knowledge Base"
      description="Canonical insights and entities backed by live endpoints."
      headerTabs={
        <TabBar
          items={statusNav}
          activeId={activeTab}
          onSelect={(id) => setActiveTab(id as KnowledgeTab)}
        />
      }
      headerActions={
        <Button variant="secondary" size="sm" onClick={() => { loadInsights(); loadEntities(); }} leftIcon={<RefreshCw size={14} />}>
          Refresh
        </Button>
      }
    >
      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Input
              leftIcon={<Search size={14} />}
              placeholder="Search insights..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => {
                setPage(0);
                loadInsights();
              }}
            />
            <Button size="sm" onClick={() => { setPage(0); loadInsights(); }} leftIcon={<Search size={14} />}>
              Apply
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => { setStatusFilter(null); setPage(0); }}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors',
                !statusFilter ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
              )}
            >
              All statuses
            </button>
            {counts.map((c) => (
              <button
                key={c.status}
                onClick={() => { setStatusFilter(c.status); setPage(0); }}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors',
                  statusFilter === c.status ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
                )}
              >
                {c.status} ({c.count})
              </button>
            ))}
          </div>

          <Card className="overflow-hidden border-slate-200">
            <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Insights</p>
              {insightsLoading && <Loader2 size={16} className="animate-spin text-primary-500" />}
            </div>
            <div className="overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 w-32">Type</th>
                    <th className="px-4 py-3">Content</th>
                    <th className="px-4 py-3 w-48">Source</th>
                    <th className="px-4 py-3 w-28 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {insights.map((insight) => (
                    <tr key={insight.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-700">{insight.typeName}</td>
                      <td className="px-4 py-3 text-slate-900">{insight.content}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {insight.source ? insight.source.title : 'Unknown source'}
                      </td>
                      <td className="px-4 py-3 text-right">{statusBadge(insight.status)}</td>
                    </tr>
                  ))}
                  {!insightsLoading && insights.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                        No insights found for your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-600">
              <span>
                Page {page + 1} • {totalInsights} total
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={page === 0}
                  onClick={() => { setPage((prev) => Math.max(0, prev - 1)); }}
                >
                  Prev
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={(page + 1) * 20 >= totalInsights}
                  onClick={() => { setPage((prev) => prev + 1); }}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'entities' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1 p-4 border-slate-200 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Input
                leftIcon={<Search size={14} />}
                placeholder="Search entities..."
                value={entityQuery}
                onChange={(e) => setEntityQuery(e.target.value)}
                onBlur={() => loadEntities()}
              />
              <Button size="sm" variant="secondary" onClick={() => loadEntities()}>
                <Search size={14} />
              </Button>
            </div>
            <div className="border rounded-lg border-slate-200 overflow-hidden">
              {entitiesLoading && (
                <div className="p-4 text-center text-slate-500 text-sm">
                  <Loader2 size={16} className="animate-spin mx-auto mb-2 text-primary-500" />
                  Loading entities...
                </div>
              )}
              {!entitiesLoading && entities.length === 0 && (
                <div className="p-4 text-center text-slate-500 text-sm">No entities found.</div>
              )}
              <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
                {entities.map((entity) => (
                  <button
                    key={entity.id}
                    onClick={() => setSelectedEntityId(entity.id)}
                    className={cn(
                      'w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors',
                      selectedEntityId === entity.id && 'bg-primary-50/60',
                    )}
                  >
                    <p className="text-sm font-semibold text-slate-900">{entity.name}</p>
                    <p className="text-xs text-slate-500">{entity.type}</p>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2 p-5 border-slate-200">
            {!selectedEntity ? (
              <div className="h-full flex items-center justify-center text-slate-500 gap-2">
                <Network size={20} className="text-slate-400" />
                Select an entity to view lineage and health.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-500">Entity</p>
                    <h3 className="text-xl font-semibold text-slate-900">{selectedEntity.name}</h3>
                    <p className="text-sm text-slate-600">{selectedEntity.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {healthBadge(selectedEntity.health)}
                    <Badge status="neutral">{selectedEntity.visibility}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Owner</p>
                    <p className="text-sm text-slate-900 font-medium">{selectedEntity.ownerUserId}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Sensitivity</p>
                    <p className="text-sm text-slate-900 font-medium">{selectedEntity.sensitivity}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Domains</p>
                    <p className="text-sm text-slate-900 font-medium">
                      {selectedEntity.domains?.join(', ') || 'n/a'}
                    </p>
                  </div>
                </div>

                {selectedEntity.health?.alerts?.length ? (
                  <div className="p-3 rounded-lg border border-amber-200 bg-amber-50">
                    <div className="flex items-center gap-2 text-amber-700 text-sm font-semibold mb-2">
                      <AlertCircle size={16} />
                      Alerts
                    </div>
                    <ul className="space-y-1">
                      {selectedEntity.health.alerts.map((alert) => (
                        <li key={alert.id} className="text-sm text-amber-800">
                          {alert.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Lineage</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-2">Incoming</p>
                      {selectedEntity.lineage?.incoming?.length ? (
                        <ul className="space-y-1">
                          {selectedEntity.lineage.incoming.map((edge) => (
                            <li key={`${edge.id}-in`} className="text-sm text-slate-800 flex items-center justify-between">
                              <span>{edge.id}</span>
                              <Badge status="neutral">{edge.relation}</Badge>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-slate-500">No incoming relations.</p>
                      )}
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-2">Outgoing</p>
                      {selectedEntity.lineage?.outgoing?.length ? (
                        <ul className="space-y-1">
                          {selectedEntity.lineage.outgoing.map((edge) => (
                            <li key={`${edge.id}-out`} className="text-sm text-slate-800 flex items-center justify-between">
                              <span>{edge.id}</span>
                              <Badge status="neutral">{edge.relation}</Badge>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-slate-500">No outgoing relations.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </PageLayout>
  );
};
