import 'server-only';

type CoreFetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | null | undefined>;
};

const CORE_API_BASE_URL =
  process.env.CORE_API_BASE_URL ||
  process.env.API_BASE_URL ||
  'http://localhost:8000';

const buildUrl = (path: string, searchParams?: CoreFetchOptions['searchParams']) => {
  const url = new URL(path, CORE_API_BASE_URL);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
};

const defaultHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // For now we derive user context from env; once real auth lands,
  // this should read from the authenticated request/session.
  headers['X-User-Id'] =
    process.env.CORE_API_USER_ID ||
    process.env.USER_ID ||
    'demo-user';
  headers['X-User-Domains'] =
    process.env.CORE_API_USER_DOMAINS ||
    process.env.USER_DOMAINS ||
    'demo';

  return headers;
};

export class CoreApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;
  rawBody?: unknown;

  constructor(message: string, options: { status: number; fieldErrors?: Record<string, string>; rawBody?: unknown }) {
    super(message);
    this.status = options.status;
    this.fieldErrors = options.fieldErrors;
    this.rawBody = options.rawBody;
  }
}

const parseFieldErrorsFromBody = (body: any): Record<string, string> | undefined => {
  if (!body) return undefined;

  // Pydantic / FastAPI validation errors: { detail: [{ loc: [...], msg, type }, ...] }
  if (Array.isArray(body.detail)) {
    const result: Record<string, string> = {};
    body.detail.forEach((entry: any) => {
      const field = Array.isArray(entry.loc) ? entry.loc[entry.loc.length - 1] : entry.loc;
      if (field) {
        result[String(field)] = entry.msg || 'Invalid value';
      }
    });
    return Object.keys(result).length ? result : undefined;
  }

  // Custom error shape: { errors: [{ field, message, code }, ...] }
  if (Array.isArray(body.errors)) {
    const result: Record<string, string> = {};
    body.errors.forEach((entry: any) => {
      if (entry.field) {
        result[String(entry.field)] = entry.message || entry.code || 'Invalid value';
      }
    });
    return Object.keys(result).length ? result : undefined;
  }

  return undefined;
};

export async function coreFetch<T>(
  path: string,
  options: CoreFetchOptions = {},
): Promise<T> {
  const url = buildUrl(path, options.searchParams);

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        ...defaultHeaders(),
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: 'no-store',
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unable to reach Core API';
    throw new CoreApiError(message, {
      status: 503,
      rawBody: err,
    });
  }

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

  let errorBody: unknown;
  try {
    errorBody = await response.json();
  } catch {
    // ignore parse errors
  }

  const fieldErrors = parseFieldErrorsFromBody(errorBody);
  const message =
    (errorBody as any)?.message ||
    (errorBody as any)?.detail ||
    `Core API error (${response.status})`;

  throw new CoreApiError(
    typeof message === 'string' ? message : 'Core API error',
    {
      status: response.status,
      fieldErrors,
      rawBody: errorBody,
    },
  );
}
