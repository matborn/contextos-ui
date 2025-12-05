import { afterEach, describe, expect, it, vi } from 'vitest';
import { workspaceService, WorkspaceServiceError } from './workspaceService';

const mockFetch = (response: Partial<Response>) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response as Response));
};

describe('workspaceService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it('maps workspace list responses and applies headers', async () => {
    mockFetch({
      ok: true,
      status: 200,
      text: () =>
        Promise.resolve(
          JSON.stringify({
            workspaces: [
              {
                id: 'ws-1',
                name: 'Payments',
                description: 'Demo',
                visibility: 'private',
                memberCount: 4,
                health: 82,
                lastActive: '2025-02-01T10:00:00Z',
              },
            ],
            total: 1,
            aggregates: { totalWorkspaces: 1, totalMembers: 4, avgHealth: 82 },
          })
        ),
    });

    const result = await workspaceService.listWorkspaces({ includeAggregates: true });

    expect(result.workspaces[0]).toEqual(
      expect.objectContaining({
        id: 'ws-1',
        health: 82,
        lastActive: '2025-02-01T10:00:00Z',
      })
    );
    expect(result.aggregates?.avgHealth).toBe(82);

    const call = (vi.mocked(global.fetch)).mock.calls[0];
    expect(call?.[0]).toContain('/api/workspaces');
  });

  it('exposes validation errors when create workspace fails', async () => {
    mockFetch({
      ok: false,
      status: 422,
      json: () =>
        Promise.resolve({
          fieldErrors: { name: 'Field required' },
        }),
    });

    await expect(
      workspaceService.createWorkspace({ name: '', visibility: 'private', description: '' })
    ).rejects.toBeInstanceOf(WorkspaceServiceError);

    try {
      await workspaceService.createWorkspace({ name: '', visibility: 'private', description: '' });
    } catch (err) {
      const error = err as WorkspaceServiceError;
      expect(error.status).toBe(422);
      expect(error.fieldErrors?.name).toBe('Field required');
    }
  });
});
