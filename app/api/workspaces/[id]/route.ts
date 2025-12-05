import { NextRequest, NextResponse } from 'next/server';
import { CoreApiError, getWorkspaceDetail } from '../../../../lib/workspaces';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { id } = resolvedParams;

  try {
    const workspace = await getWorkspaceDetail(id);
    return NextResponse.json(workspace, { status: 200 });
  } catch (error) {
    if (error instanceof CoreApiError) {
      return NextResponse.json(
        {
          message: error.message,
          fieldErrors: error.fieldErrors,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: 'Failed to load workspace' },
      { status: 500 },
    );
  }
}
