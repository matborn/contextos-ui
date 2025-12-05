import { useCallback, useEffect, useMemo, useState } from 'react';
import { Workspace, WorkspaceAggregates, WorkspaceVisibility } from '../types';
import { WorkspaceServiceError, workspaceService } from '../services/workspaceService';

export interface CreateWorkspaceInput {
  name: string;
  description?: string;
  visibility: WorkspaceVisibility;
}

export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [aggregates, setAggregates] = useState<WorkspaceAggregates | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const toMessage = (err: unknown) => (err instanceof Error ? err.message : 'Unable to complete workspace request');

  const loadWorkspaces = useCallback(async () => {
    const data = await workspaceService.listWorkspaces({ includeAggregates: true, page: 1, pageSize: 12 });
    setWorkspaces(data.workspaces);
    setAggregates(data.aggregates ?? null);
    setTotal(data.total);
    setError(null);
    setActionError(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
    try {
      await loadWorkspaces();
    } catch (err) {
      if (!cancelled) {
        setError(toMessage(err));
        setActionError(toMessage(err));
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadWorkspaces]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadWorkspaces();
      setError(null);
      setActionError(null);
    } catch (err) {
      setError(toMessage(err));
      throw err;
    } finally {
      setIsRefreshing(false);
    }
  }, [loadWorkspaces]);

  const fetchWorkspaceDetail = useCallback(
    async (id: string) => {
      try {
        const detail = await workspaceService.getWorkspaceDetail(id);
        setActiveWorkspace(detail);
        return detail;
      } catch (err) {
        setError(toMessage(err));
        throw err;
      }
    },
    []
  );

  const createWorkspace = useCallback(
    async (input: CreateWorkspaceInput) => {
      setIsCreating(true);
      setValidationErrors({});
      try {
        const created = await workspaceService.createWorkspace({
          name: input.name,
          description: input.description,
          visibility: input.visibility,
        });

        await refresh();
        if (created) {
          setActiveWorkspace(created);
        }
        setError(null);
        return created;
      } catch (err) {
        if (err instanceof WorkspaceServiceError && err.fieldErrors) {
          setValidationErrors(err.fieldErrors);
        }
      const message = toMessage(err);
      setError(message);
      setActionError(message);
      throw err;
    } finally {
      setIsCreating(false);
    }
  },
  [refresh]
);

  const isEmpty = useMemo(() => !loading && workspaces.length === 0, [loading, workspaces.length]);

  return {
    workspaces,
    aggregates,
    total,
    activeWorkspace,
    loading,
    isRefreshing,
    isEmpty,
    error,
    validationErrors,
    isCreating,
    actionError,
    refresh,
    fetchWorkspaceDetail,
    createWorkspace,
  };
};
