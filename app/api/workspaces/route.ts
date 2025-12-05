import { NextRequest, NextResponse } from 'next/server';
import { CoreApiError, createWorkspace, listWorkspaces } from '../../../lib/workspaces';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const pageSize = url.searchParams.get('pageSize');
  const includeAggregates = url.searchParams.get('include_aggregates');

  try {
    const data = await listWorkspaces({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      includeAggregates: includeAggregates ? includeAggregates === 'true' : undefined,
    });
    return NextResponse.json(data, { status: 200 });
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
      { message: 'Failed to load workspaces' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const created = await createWorkspace({
      name: body.name,
      description: body.description ?? null,
      visibility: body.visibility,
      ownerUserId: body.ownerUserId ?? null,
    });

    return NextResponse.json(created, { status: 201 });
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

    const message = error instanceof Error ? error.message : 'Failed to create workspace';
    return NextResponse.json(
      { message },
      { status: 500 },
    );
  }
}
