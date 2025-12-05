import { act, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import React, { useEffect } from 'react';
import { useWorkspaces } from './useWorkspaces';

const {
  MockWorkspaceServiceError,
  listWorkspaces,
  getWorkspaceDetail,
  createWorkspace,
} = vi.hoisted(() => {
  class HoistedWorkspaceServiceError extends Error {
    status?: number;
    fieldErrors?: Record<string, string>;

    constructor(message: string, options?: { status?: number; fieldErrors?: Record<string, string> }) {
      super(message);
      this.status = options?.status;
      this.fieldErrors = options?.fieldErrors;
    }
  }

  return {
    MockWorkspaceServiceError: HoistedWorkspaceServiceError,
    listWorkspaces: vi.fn(),
    getWorkspaceDetail: vi.fn(),
    createWorkspace: vi.fn(),
  };
});

vi.mock('../services/workspaceService', () => ({
  workspaceService: {
    listWorkspaces,
    getWorkspaceDetail,
    createWorkspace,
  },
  WorkspaceServiceError: MockWorkspaceServiceError,
}));

type HookState = ReturnType<typeof useWorkspaces>;

const setupHook = () => {
  const states: HookState[] = [];

  const Harness: React.FC = () => {
    const hookState = useWorkspaces();
    useEffect(() => {
      states.push(hookState);
    }, [hookState]);
    return null;
  };

  render(<Harness />);
  return states;
};

const sampleWorkspace = {
  id: 'ws-1',
  name: 'Payments',
  description: 'Demo',
  visibility: 'private' as const,
  memberCount: 4,
  health: 82,
  lastActive: '2025-02-01T10:00:00Z',
};

describe('useWorkspaces', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads workspaces on mount and exposes aggregates', async () => {
    listWorkspaces.mockResolvedValue({
      workspaces: [sampleWorkspace],
      total: 1,
      aggregates: { totalWorkspaces: 1, totalMembers: 4, avgHealth: 82 },
    });

    const states = setupHook();

    await waitFor(() => {
      const latest = states[states.length - 1];
      expect(latest.loading).toBe(false);
      expect(latest.workspaces).toHaveLength(1);
      expect(latest.aggregates?.avgHealth).toBe(82);
      expect(latest.error).toBeNull();
    });

    expect(listWorkspaces).toHaveBeenCalledTimes(1);
  });

  it('surfaces load errors and keeps loading false', async () => {
    listWorkspaces.mockRejectedValue(new Error('boom'));

    const states = setupHook();

    await waitFor(() => {
      const latest = states[states.length - 1];
      expect(latest.loading).toBe(false);
      expect(latest.error).toContain('boom');
      expect(latest.actionError).toContain('boom');
    });
  });

  it('refreshes data and toggles isRefreshing', async () => {
    listWorkspaces.mockResolvedValue({
      workspaces: [sampleWorkspace],
      total: 1,
      aggregates: null,
    });

    const states = setupHook();

    await waitFor(() => {
      expect(states[states.length - 1].loading).toBe(false);
    });

    await act(async () => {
      await states[states.length - 1].refresh();
    });

    expect(states[states.length - 1].isRefreshing).toBe(false);
    expect(listWorkspaces).toHaveBeenCalledTimes(2);
  });

  it('creates a workspace, refreshes list, and sets activeWorkspace', async () => {
    listWorkspaces.mockResolvedValue({
      workspaces: [sampleWorkspace],
      total: 1,
      aggregates: null,
    });
    createWorkspace.mockResolvedValue(sampleWorkspace);

    const states = setupHook();
    await waitFor(() => {
      expect(states[states.length - 1].loading).toBe(false);
    });

    await act(async () => {
      await states[states.length - 1].createWorkspace({
        name: 'Payments',
        visibility: 'private',
      });
    });

    const latest = states[states.length - 1];
    expect(latest.isCreating).toBe(false);
    expect(createWorkspace).toHaveBeenCalledWith({
      name: 'Payments',
      description: undefined,
      visibility: 'private',
    });
    expect(latest.activeWorkspace?.id).toBe('ws-1');
    expect(listWorkspaces).toHaveBeenCalledTimes(2);
  });

  it('captures validation errors when create fails', async () => {
    listWorkspaces.mockResolvedValue({
      workspaces: [],
      total: 0,
      aggregates: null,
    });
    createWorkspace.mockRejectedValue(
      new MockWorkspaceServiceError('invalid', { status: 422, fieldErrors: { name: 'Required' } }),
    );

    const states = setupHook();
    await waitFor(() => {
      expect(states[states.length - 1].loading).toBe(false);
    });

    await act(async () => {
      await states[states.length - 1]
        .createWorkspace({
          name: '',
          visibility: 'private',
        })
        .catch(() => {});
    });

    await waitFor(() => {
      const latest = states[states.length - 1];
      expect(latest.validationErrors.name).toBe('Required');
      expect(latest.error).toContain('invalid');
      expect(latest.actionError).toContain('invalid');
    });
  });
});
