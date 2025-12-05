import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useWorkspaces } from './useWorkspaces';
import { workspaceService, WorkspaceServiceError } from '../services/workspaceService';

vi.mock('../services/workspaceService', async () => {
  const actual = await vi.importActual<typeof import('../services/workspaceService')>('../services/workspaceService');
  return {
    ...actual,
    workspaceService: {
      listWorkspaces: vi.fn(),
      getWorkspaceDetail: vi.fn(),
      createWorkspace: vi.fn(),
    },
  };
});

const mockedService = workspaceService as unknown as {
  listWorkspaces: ReturnType<typeof vi.fn>;
  getWorkspaceDetail: ReturnType<typeof vi.fn>;
  createWorkspace: ReturnType<typeof vi.fn>;
};

describe('useWorkspaces', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedService.listWorkspaces.mockResolvedValue({
      workspaces: [
        {
          id: 'ws-1',
          name: 'Demo Workspace',
          description: 'Testing',
          visibility: 'private',
          status: 'active',
          memberCount: 10,
          health: 90,
          lastActive: '2025-02-01T00:00:00Z',
        },
      ],
      total: 1,
      aggregates: { totalWorkspaces: 1, totalMembers: 10, avgHealth: 90 },
    });
    mockedService.createWorkspace.mockResolvedValue(null);
  });

  it('loads workspaces and aggregates on mount', async () => {
    const { result } = renderHook(() => useWorkspaces());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.workspaces).toHaveLength(1);
    expect(result.current.aggregates?.totalMembers).toBe(10);
  });

  it('captures validation errors from createWorkspace', async () => {
    mockedService.createWorkspace.mockRejectedValue(
      new WorkspaceServiceError('Invalid', { status: 422, fieldErrors: { name: 'Required' } })
    );

    const { result } = renderHook(() => useWorkspaces());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      try {
        await result.current.createWorkspace({ name: '', visibility: 'private' });
      } catch {}
    });

    expect(result.current.validationErrors.name).toBe('Required');
  });
});
