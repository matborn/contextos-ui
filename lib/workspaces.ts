import 'server-only';

import { Workspace, WorkspaceAggregates, WorkspaceListResponse, WorkspaceStatus, WorkspaceVisibility } from '../types';
import { coreFetch, CoreApiError } from './coreClient';

type WorkspaceHealthApi = {
  score: number | null;
  updatedAt?: string | null;
} | null;

interface WorkspaceSummaryApi {
  id: string;
  name: string;
  description?: string | null;
  visibility: WorkspaceVisibility;
  status: WorkspaceStatus;
  memberCount: number;
  health?: WorkspaceHealthApi;
  lastActive?: string | null;
  createdAt?: string | null;
  ownerId: string;
}

interface WorkspaceListApiResponse {
  workspaces?: WorkspaceSummaryApi[];
  total: number;
  aggregates?: WorkspaceAggregates | null;
}

interface WorkspaceCreateRequest {
  name: string;
  description?: string | null;
  visibility: WorkspaceVisibility;
  ownerUserId?: string | null;
}

const mapWorkspace = (workspace: WorkspaceSummaryApi): Workspace => ({
  id: workspace.id,
  name: workspace.name,
  description: workspace.description ?? '',
  visibility: workspace.visibility,
  status: workspace.status,
  memberCount: workspace.memberCount,
  health: workspace.health?.score ?? null,
  lastActive: workspace.lastActive ?? null,
  createdAt: workspace.createdAt ?? null,
  ownerId: workspace.ownerId,
});

export const listWorkspaces = async (
  params: { page?: number; pageSize?: number; includeAggregates?: boolean } = {},
): Promise<WorkspaceListResponse> => {
  const data = await coreFetch<WorkspaceListApiResponse>('/api/v1/workspaces', {
    method: 'GET',
    searchParams: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      include_aggregates: params.includeAggregates ?? true,
    },
  });

  return {
    workspaces: (data.workspaces || []).map(mapWorkspace),
    total: data.total,
    aggregates: data.aggregates ?? null,
  };
};

export const getWorkspaceDetail = async (id: string): Promise<Workspace> => {
  const data = await coreFetch<WorkspaceSummaryApi>(`/api/v1/workspaces/${id}`, {
    method: 'GET',
  });
  return mapWorkspace(data);
};

export const createWorkspace = async (
  payload: WorkspaceCreateRequest,
): Promise<Workspace | null> => {
  // NOTE: OpenAPI response is currently loosely defined; we optimistically
  // expect a WorkspaceSummary back. If the backend returns an empty body,
  // callers will receive null and should re-list.
  const data = await coreFetch<WorkspaceSummaryApi | null>('/api/v1/workspaces', {
    method: 'POST',
    body: payload,
  });

  if (!data) return null;
  return mapWorkspace(data);
};

export { CoreApiError };

