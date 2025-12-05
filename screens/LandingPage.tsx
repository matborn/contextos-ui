
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PageLayout } from '../components/ui/PageLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';
import { AlertBanner } from '../components/ui/AlertBanner';
import { Activity, AlertCircle, Globe, Eye, Lock, Network, Layers, RefreshCw, ShieldCheck, Users, Database, Plus } from '../components/icons/Icons';
import { Workspace, WorkspaceAggregates, WorkspaceVisibility } from '../types';
import { cn } from '../utils';
import { CreateWorkspaceInput } from '../hooks/useWorkspaces';

interface LandingPageProps {
  workspaces: Workspace[];
  aggregates?: WorkspaceAggregates | null;
  loading?: boolean;
  isRefreshing?: boolean;
  error?: string | null;
  isCreating?: boolean;
  actionError?: string | null;
  validationErrors?: Record<string, string>;
  onSelectWorkspace: (id: string) => void;
  onCreateWorkspace: (input: CreateWorkspaceInput) => Promise<void> | void;
  onRefresh?: () => Promise<void> | void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  workspaces,
  aggregates,
  loading = false,
  isRefreshing = false,
  error,
  isCreating = false,
  actionError,
  validationErrors = {},
  onSelectWorkspace,
  onCreateWorkspace,
  onRefresh,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');
  const [newVisibility, setNewVisibility] = useState<WorkspaceVisibility>('private');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const mergedErrors = useMemo(
    () => ({ ...formErrors, ...validationErrors }),
    [formErrors, validationErrors]
  );

  const handleCreate = async () => {
    const trimmedName = newWorkspaceName.trim();
    if (!trimmedName) {
      setFormErrors({ name: 'Workspace name is required' });
      return;
    }

    setFormErrors({});

    try {
      await onCreateWorkspace({
        name: trimmedName,
        description: newWorkspaceDescription.trim() || undefined,
        visibility: newVisibility,
      });

      setIsCreateModalOpen(false);
      setNewWorkspaceName('');
      setNewWorkspaceDescription('');
      setNewVisibility('private');
    } catch (err) {
      // Keep the modal open to show validation errors
    }
  };

  const getVisibilityIcon = (v: WorkspaceVisibility) => {
    switch (v) {
      case 'private':
        return <Lock size={12} />;
      case 'protected':
        return <Eye size={12} />;
      case 'public':
      default:
        return <Globe size={12} />;
    }
  };

  const healthMeta = (health: number | null) => {
    if (health === null || health === undefined) return { status: 'neutral' as const, label: '—' };
    if (health >= 90) return { status: 'success' as const, label: `${health}%` };
    if (health >= 75) return { status: 'info' as const, label: `${health}%` };
    return { status: 'warning' as const, label: `${health}%` };
  };

  const formatDate = (value?: string | Date | null) => {
    if (!value) return '—';
    const date = value instanceof Date ? value : new Date(value);
    return date.toLocaleDateString();
  };

  const totalMembers = aggregates?.totalMembers ?? workspaces.reduce((acc, w) => acc + w.memberCount, 0);
  const avgHealth = useMemo(() => {
    if (aggregates && aggregates.avgHealth !== undefined) return aggregates.avgHealth;
    const healthValues = workspaces.map((w) => w.health).filter((value): value is number => value !== null && value !== undefined);
    if (!healthValues.length) return null;
    return Math.round(healthValues.reduce((acc, value) => acc + value, 0) / healthValues.length);
  }, [aggregates, workspaces]);

  const isEmptyState = !loading && workspaces.length === 0;

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };

  const renderLoading = () => (
    <div className="mt-6 space-y-6">
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-32" />
        <div className="h-4 bg-slate-100 rounded w-64 mt-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-pulse space-y-3">
            <div className="h-10 bg-slate-100 rounded w-10" />
            <div className="h-5 bg-slate-100 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-full" />
            <div className="h-4 bg-slate-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmpty = () => (
    <div className="animate-fadeIn max-w-4xl mx-auto mt-6">
      <div className="text-center space-y-6 py-12">
        <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white mb-6">
          <Network size={40} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Welcome to Atlas</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Atlas is your unified operating system for organizational knowledge.
          <br />
          Break down silos, govern data, and generate insights.
        </p>
        <div className="pt-4">
          <Button size="lg" onClick={() => setIsCreateModalOpen(true)} leftIcon={<Plus size={18} />} className="shadow-xl shadow-primary-500/10 px-8">
            Initialize First Workspace
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Database size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">1. Ingest</h3>
            <p className="text-sm text-slate-500 mt-2">Connect Google Drive, Slack, and Wikis to build your graph.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
            <Layers size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">2. Structure</h3>
            <p className="text-sm text-slate-500 mt-2">Define your ontology. Atlas maps entities and relationships automatically.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">3. Govern</h3>
            <p className="text-sm text-slate-500 mt-2">Monitor knowledge health, resolve conflicts, and track decisions.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="mt-6">
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
            You are managing <span className="font-semibold text-slate-900">{workspaces.length} workspaces</span>. Keep visibility, members, and health in view as Atlas evolves.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={() => setIsCreateModalOpen(true)} leftIcon={<Plus size={16} />} isLoading={isRefreshing}>
              Create New Workspace
            </Button>
            <Button variant="secondary" onClick={handleRefresh} leftIcon={<RefreshCw size={14} className={cn(isRefreshing && 'animate-spin')} />} isLoading={isRefreshing}>
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 w-36 text-center">
            <div className="text-2xl font-bold text-slate-900">{totalMembers}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">Total Members</div>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-100 w-36 text-center">
            <div className="text-2xl font-bold text-green-600">{avgHealth ?? '—'}{typeof avgHealth === 'number' ? '%' : ''}</div>
            <div className="text-[10px] text-green-800/70 font-bold uppercase mt-1">Avg Health</div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          Your Workspaces
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((ws) => {
            const health = healthMeta(ws.health ?? null);
            const statusLabel = (ws.status || 'active').toUpperCase();
            return (
              <Card key={ws.id} onClick={() => onSelectWorkspace(ws.id)} className="p-0 group">
                <CardHeader className="flex items-start justify-between">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm',
                    'bg-gradient-to-br from-slate-700 to-slate-900'
                  )}>
                    {ws.name.charAt(0)}
                  </div>
                  <div className="flex gap-2">
                    <Badge status="neutral" className="flex items-center gap-1 capitalize">
                      {getVisibilityIcon(ws.visibility)} {ws.visibility}
                    </Badge>
                    <Badge status={statusLabel === 'ACTIVE' ? 'success' : 'warning'} className="capitalize">
                      {statusLabel.toLowerCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-700 transition-colors">{ws.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{ws.description || 'No description provided yet.'}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Users size={12} /> {ws.memberCount}</span>
                      <Badge status={health.status} className="flex items-center gap-1">
                        <Activity size={12} /> {health.label} Health
                      </Badge>
                    </div>
                    <span className="text-slate-400">{formatDate(ws.lastActive)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-slate-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/40 transition-all cursor-pointer min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
              <Plus size={24} />
            </div>
            <span className="font-medium">Create New Workspace</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout hideHeader>
      <div className="absolute top-4 right-6 z-30">
        {onRefresh && (
          <Button variant="ghost" size="sm" onClick={handleRefresh} isLoading={isRefreshing} className="text-slate-400 hover:text-slate-600">
            <RefreshCw size={14} className={cn(isRefreshing && 'animate-spin')} />
          </Button>
        )}
      </div>

      {error && (
        <AlertBanner
          tone="error"
          layout="bar"
          title="Workspace data failed to load"
          description={error}
          actionLabel={onRefresh ? 'Retry' : undefined}
          onAction={onRefresh ? handleRefresh : undefined}
          isActionLoading={isRefreshing}
          className="-mx-6 md:-mx-8"
        />
      )}

      {loading && workspaces.length === 0 ? renderLoading() : isEmptyState ? renderEmpty() : renderDashboard()}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormErrors({});
        }}
        title="Create New Workspace"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} isLoading={isCreating}>
              Create Workspace
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Workspace Name"
            placeholder="e.g. Engineering, Q3 Launch, Compliance"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            autoFocus
            error={mergedErrors.name}
          />

          <Textarea
            label="Description"
            placeholder="What will this workspace manage?"
            value={newWorkspaceDescription}
            onChange={(e) => setNewWorkspaceDescription(e.target.value)}
            rows={3}
            error={mergedErrors.description}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Visibility</label>
            <div className="grid grid-cols-1 gap-2">
              {(['private', 'protected', 'public'] as WorkspaceVisibility[]).map((vis) => (
                <button
                  key={vis}
                  onClick={() => setNewVisibility(vis)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border text-left transition-all',
                    newVisibility === vis ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'
                  )}
                  type="button"
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded flex items-center justify-center shrink-0',
                      newVisibility === vis ? 'bg-white text-primary-600 shadow-sm' : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {getVisibilityIcon(vis)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900 capitalize">{vis}</div>
                    <div className="text-xs text-slate-500">
                      {vis === 'private' && 'Only invited members can access.'}
                      {vis === 'protected' && 'Visible to organization, access by request.'}
                      {vis === 'public' && 'Open to everyone in the organization.'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {mergedErrors.visibility && <p className="text-xs text-red-600">{mergedErrors.visibility}</p>}
          </div>
          {actionError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
              {actionError}
            </p>
          )}
        </div>
      </Modal>
    </PageLayout>
  );
};
