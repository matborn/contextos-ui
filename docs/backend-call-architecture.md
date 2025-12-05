# Backend Call Architecture – Core Graph API

This doc captures how the UI talks to the Core Graph API (`docs/backend/openapi.json`), why we made these choices, and how to extend the pattern safely.

## Goals

- Keep **all Core Graph API calls server-side** (no direct browser → Core calls).
- Centralize **auth headers**, **error handling**, and **observability** in one place.
- Present a **simple, typed API** to React components (`useWorkspaces`, etc.).
- Avoid premature complexity (extra libraries/codegen) while the surface area is small.

## High-level Architecture

### 1) Next app as Backend-for-Frontend (BFF)

- The Next.js app is the **only** caller of the Core Graph API.
- The browser talks only to:
  - React server components (for initial data)
  - Internal Next routes / server actions (for interactive updates: refresh, create, etc.).

### 2) Server-only Core client

- A module (e.g. `lib/coreClient.ts`) that:
  - Imports `'server-only'` to prevent accidental use in client components.
  - Knows `CORE_API_BASE_URL` and any secrets (API keys / auth tokens).
  - Attaches required headers like `X-User-Id`, `X-User-Domains` using server-side auth/session.
  - Uses native `fetch` with sensible defaults (timeout, no-store vs revalidate).
  - Normalizes HTTP and validation errors into a consistent error type.

### 3) Domain services

- Per-domain modules, e.g. `lib/workspaces.ts`, that:
  - Call the core client and map OpenAPI models into our **UI/domain types**:
    - `Workspace`, `WorkspaceAggregates`, `WorkspaceListResponse`, etc.
  - Hide backend details (pagination fields, nullable shapes, internal enums).
  - Provide stable functions:
    - `listWorkspaces(params)`
    - `getWorkspace(id)`
    - `createWorkspace(input)`

### 4) Next API routes / server actions

- Internal endpoints (BFF) that the browser can call:
  - `app/api/workspaces/route.ts` → list + aggregates.
  - `app/api/workspaces/[id]/route.ts` → detail.
  - `app/api/workspaces` (POST) → create workspace.
- These routes:
  - Run on the server only.
  - Call `lib/workspaces.ts`.
  - Return JSON in a **UI-friendly** shape (aligned with `types.ts`).
  - Never trust `X-User-Id`/`X-User-Domains` coming from the browser; derive them from server auth instead.

### 5) UI consumption

- **Initial load**:
  - Use server components / route loaders to call domain services directly.
  - Pass data down as props to client components (e.g. workspace landing).
- **Interactive actions** (refresh, create):
  - Hooks like `useWorkspaces` call internal Next API routes (e.g. `/api/workspaces`), not the Core API.
  - Hooks manage local UI state (loading, error, validation errors) based on BFF responses.

## Libraries – what we use and why

### Use now

- **Native `fetch` (server-side)**
  - Integrates with Next 16 caching (`cache`, `next: { revalidate }`).
  - No extra dependency; works well in BFF-style layers.

- **Hand-written TypeScript types**
  - We define only the pieces we need from `openapi.json` (e.g. `Workspace`, `WorkspaceAggregates`, `WorkspaceListResponse`).
  - Keeps the codebase understandable while the API surface we use is small.

### Maybe later (with a planning ticket)

- **OpenAPI-driven codegen** (e.g. `openapi-typescript`)
  - Pros: strong type alignment with the spec across many endpoints.
  - Cons: adds a generator, scripts, and CI wiring; more moving parts.
  - When to adopt: once multiple features use large portions of the Core API.

- **Client-side data libraries (SWR / React Query)**
  - Great for client caching / stale-while-revalidate *against the BFF*, not Core directly.
  - When to adopt: when many client components share the same internal API resources and we need richer client caching patterns.

### Avoid for now

- **Direct Core API calls from the browser**
  - Exposes internal base URLs and any secrets.
  - Makes `X-User-Id` / `X-User-Domains` spoofable if honored from the client.
  - Scatters header/error logic across components and makes contract changes painful.

- **Heavy HTTP clients (axios, etc.)**
  - `fetch` already covers our needs in the BFF.
  - Adding axios is extra complexity without a clear benefit right now.

## Security & Trust Boundaries

- The browser is **untrusted**:
  - It must not talk to the Core Graph API directly for authenticated operations.
  - Any “user identifiers” from the browser must be treated as hints, not authoritative.

- The Next app is **trusted**:
  - It holds secrets and Core API configuration.
  - It is responsible for:
    - Deriving `X-User-Id` / `X-User-Domains` from the real auth context.
    - Enforcing access rules (e.g. denying workspace access if the user is not allowed).
    - Logging and monitoring calls to Core.

## Workspace example (current ticket)

For the workspace landing / create flow:

- **Domain types** (`types.ts`):
  - `WorkspaceVisibility`, `WorkspaceStatus`.
  - `Workspace` (UI-focused shape, with nullable health/lastActive).
  - `WorkspaceAggregates`, `WorkspaceListResponse`.

- **Service layer** (`lib/workspaces.ts` + `app/api/workspaces`):
  - Server-only domain service calls `/api/v1/workspaces` and maps Core shapes into UI types.
  - Internal Next routes `/api/workspaces` and `/api/workspaces/[id]` are the **only** interfaces the browser can call.
  - Client code (hooks like `useWorkspaces`) must never call Core directly; they call the BFF routes which attach auth headers server-side.

- **Hook** (`hooks/useWorkspaces.ts`):
  - Handles loading/refresh/create/validation error state.
  - Talks exclusively to internal Next routes, not the Core API.

- **UI** (`apps/ContextOS.tsx`, `screens/LandingPage.tsx`):
  - Uses the hook for interactive behavior.
  - Renders loading/error/empty/health badge states based on BFF data.

## Practical Guidelines

- Do **not**:
  - Call `https://<core-api>/api/v1/...` from client components or browser fetch.
  - Read Core API keys in client code.
  - Trust `X-User-*` headers from the browser for authorization.

- Do:
  - Add new backend calls in a server-only client or domain service.
  - Expose internal Next routes/server actions for client interactions.
  - Model UI-level types in `types.ts` and keep them decoupled from raw OpenAPI models.
  - Share error-handling patterns (validation errors, 403, 5xx) across domain services.

## Future Extensions

- Add runtime validation (e.g. `zod`) for Core responses in the domain layer.
- Introduce OpenAPI codegen once the number of endpoints we use justifies it.
- Layer SWR/React Query on top of our internal BFF routes if we see repeated client data needs.
- Add structured logging/metrics around domain services to observe Core API behavior (latency, error rates) centrally.
