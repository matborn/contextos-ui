import { Workspace, WorkspaceListResponse, WorkspaceVisibility } from '../types';

interface WorkspaceCreateRequest {
  name: string;
  description?: string | null;
  visibility: WorkspaceVisibility;
  ownerUserId?: string | null;
}

const buildUrl = (path: string, query?: Record<string, string | number | boolean | null | undefined>) => {
  if (!query || Object.keys(query).length === 0) return path;
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `${path}?${qs}` : path;
};

const defaultHeaders = () => ({
  'Content-Type': 'application/json',
});

export class WorkspaceServiceError extends Error {
  status?: number;
  fieldErrors?: Record<string, string>;

  constructor(message: string, options?: { status?: number; fieldErrors?: Record<string, string> }) {
    super(message);
    this.status = options?.status;
    this.fieldErrors = options?.fieldErrors;
  }
}

const parseValidationErrors = (errorBody: any): Record<string, string> | undefined => {
  if (!errorBody) return undefined;

  if (Array.isArray(errorBody?.detail)) {
    const fieldErrors: Record<string, string> = {};
    errorBody.detail.forEach((entry: any) => {
      const field = Array.isArray(entry.loc) ? entry.loc[entry.loc.length - 1] : entry.loc;
      if (field) {
        fieldErrors[String(field)] = entry.msg || 'Invalid value';
      }
    });
    return Object.keys(fieldErrors).length ? fieldErrors : undefined;
  }

  if (Array.isArray(errorBody?.errors)) {
    const fieldErrors: Record<string, string> = {};
    errorBody.errors.forEach((entry: any) => {
      if (entry.field) {
        fieldErrors[entry.field] = entry.message || entry.code || 'Invalid value';
      }
    });
    return Object.keys(fieldErrors).length ? fieldErrors : undefined;
  }

  // Newer BFF error shape: { fieldErrors: { name: 'msg', ... } }
  if (errorBody?.fieldErrors && typeof errorBody.fieldErrors === 'object') {
    const result: Record<string, string> = {};
    Object.entries(errorBody.fieldErrors as Record<string, unknown>).forEach(([field, message]) => {
      if (message) {
        result[field] = String(message);
      }
    });
    return Object.keys(result).length ? result : undefined;
  }

  return undefined;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (response.ok) {
    if (response.status === 204) {
      return null as unknown as T;
    }

    const text = await response.text();
    if (!text) {
      return null as unknown as T;
    }
    return JSON.parse(text) as T;
  }

  let errorBody: any = null;
  try {
    errorBody = await response.json();
  } catch (err) {
    // ignore parse errors
  }

  const fieldErrors = parseValidationErrors(errorBody);
  const message =
    errorBody?.message ||
    errorBody?.detail ||
    `Workspace API error (${response.status})`;

  throw new WorkspaceServiceError(typeof message === 'string' ? message : 'Workspace API error', {
    status: response.status,
    fieldErrors,
  });
};

export const workspaceService = {
  async listWorkspaces(params: { page?: number; pageSize?: number; includeAggregates?: boolean } = {}): Promise<WorkspaceListResponse> {
    const url = buildUrl('/api/workspaces', {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      include_aggregates: params.includeAggregates ?? true,
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: defaultHeaders(),
      cache: 'no-store',
    });

    const data = await handleResponse<WorkspaceListResponse>(response);
    return data;
  },

  async getWorkspaceDetail(id: string): Promise<Workspace> {
    const url = buildUrl(`/api/workspaces/${id}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: defaultHeaders(),
      cache: 'no-store',
    });
    const data = await handleResponse<Workspace>(response);
    return data;
  },

  async createWorkspace(payload: WorkspaceCreateRequest): Promise<Workspace | null> {
    const url = buildUrl('/api/workspaces');
    const response = await fetch(url, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await handleResponse<Workspace | null>(response);
    return data ?? null;
  },
};
