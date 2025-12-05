# Workspace Landing UI → Backend Coverage

Findings from mapping the Atlas landing screen (workspace overview) to `docs/backend/openapi.json`.

## Summary
- The current API surface is ontology/knowledge-source/graph centric (`/api/v1/ontology/*`, `/api/v1/knowledge-sources`, `/api/v1/entities`, `/api/v1/knowledge-base/insights`, `/api/v1/share`, `/api/v1/views/features/{feature_id}/delivery`).
- No workspace, membership, or health/statistics endpoints exist. All UI elements on the landing screen are currently unsupported by the backend as specified.

## Capability Mapping
| UI feature | Required backend capability | Endpoint exists? | Gap / required addition |
| --- | --- | --- | --- |
| Overview counts (“3 active workspaces”) | List workspaces scoped to caller; expose status/active flag to derive counts | No | Add `/api/v1/workspaces` (GET) with filters (status/visibility/ownership); include pagination and active flag |
| System health (“94% across all knowledge domains”) | Global/system health metric aggregated from graph ingestion/governance | No | Add `/api/v1/health/system` returning overall score plus sub-metrics; define methodology and time window |
| Total members (20) | Aggregate unique member/user count across accessible workspaces | No | Add `/api/v1/workspaces/members/summary` or include memberCount aggregates in list response; clarify org vs per-workspace scope |
| Avg health (94%) | Aggregate workspace health values | No | Add aggregate field to `/api/v1/workspaces/summary` or compute server-side in list response |
| Workspaces grid (name, description, visibility, memberCount, health, lastActive) | Workspace listing with those fields per record | No | Add `Workspace` resource with fields: `id`, `name`, `description`, `visibility` (private/protected/public), `memberCount`, `health`, `lastActive`, `status`, `createdAt`, `ownerId`; include sort/filter (by activity, health, name) |
| Visibility badges (Private/Protected/Public) | Workspace-level ACL/visibility model surfaced in API | No | Define visibility semantics and enforcement; surface in workspace schema; ensure endpoints respect caller access |
| Member count icon per card | Per-workspace membership roster or count | No | Add `/api/v1/workspaces/{id}/members` (list) and include `memberCount` on workspace summary |
| Health per workspace (“94% Health”) | Computed health metric per workspace | No | Add `health` field with definition (e.g., aggregation of ingestion success/conflicts/governance signals) and timestamp; possibly `/health` subresource |
| Last active date per workspace | Activity timestamp (last ingestion/governance event) | No | Add `lastActive` in workspace summary, derived from latest knowledge-source/insight activity within workspace |
| Create New Workspace CTA + modal (name + visibility selection) | Create workspace mutation | No | Add `/api/v1/workspaces` (POST) accepting `name`, `description`, `visibility`, optional `ownerId`; enforce validation/uniqueness and return created workspace |
| “Create New Workspace” empty-card action | Same as above; needs optimistic create + refreshed list | No | Provide create endpoint plus immediate list refresh support (ETag/updatedAt) |
| Workspace selection (card click) | Fetch workspace detail to drive downstream dashboard | No | Add `/api/v1/workspaces/{id}` returning detail, permissions, connectors, health metrics to power the dashboard view |
| Refresh icon (top-right) | Idempotent list reload or “sync” trigger | No | Support standard GET list pagination and optional `/sync` trigger if re-ingestion is intended; currently absent |

## Edge Cases & Clarifications Needed
- **Access model**: How “private/protected/public” maps to ACLs (org-wide vs invite-only vs request-access). Current `POST /api/v1/share` works only for entity-level sharing, not workspace containers.
- **Health computation**: Inputs (ingestion pipeline stages, governance risks, conflicts) and update cadence. No endpoints surface these metrics at workspace or system level.
- **Membership authority**: Who can create, invite, or change visibility? No membership endpoints exist to back the UI counts or gate access.
- **Activity timestamp**: Definition of `lastActive` (last knowledge source ingestion, last insight change, last user activity?). Must be provided to render the card footer.
- **Pagination/sorting**: UI shows a small set, but scalable list needs sort/filter (by recency, health, visibility) to avoid client-side hacks.
- **Empty state initialization**: The first-time “Initialize First Workspace” flow requires the same create endpoint plus possibly starter content/connectors; not supported.

## Minimal Backend Additions to Unblock UI
1) Workspace resource: `GET /api/v1/workspaces`, `POST /api/v1/workspaces`, `GET /api/v1/workspaces/{id}` with fields above, pagination, filters, and caller-scoped visibility enforcement.  
2) Membership: `GET /api/v1/workspaces/{id}/members` (and `POST/DELETE` for invites/removals if needed) to drive member counts.  
3) Health and aggregates: `/api/v1/health/system` + workspace-level `health`/`lastActive` fields (or `/api/v1/workspaces/{id}/health`) and aggregated stats (total workspaces, total members, avg health).  
4) Optional sync trigger: `/api/v1/workspaces/{id}/sync` if the refresh icon is intended to re-run ingestion/governance for that workspace.  

Without these, the landing screen cannot render real data or perform creation actions against the current backend contract.

## Status
- Backend team is implementing the needed workspace/membership/health endpoints (tracking: https://github.com/matborn/contextos/issues/56). Keep this doc in sync with that issue as the contract firms up.

# System of Record / Knowledge Base UI → Backend Coverage

Mapping the System of Record screen (Inbox/Staging Area, Manual Ingestion modal, Entity View, Sources tab) to `docs/backend/openapi.json`.

## Capability Mapping
| UI feature | Required backend capability | Endpoint exists? | Gap / required addition |
| --- | --- | --- | --- |
| Manual text ingestion (paste + “Analyze & Extract”) | Register ad-hoc text as a knowledge source and stream/poll per-stage progress (extracting → embedding → clustering → conflict checks) back to the UI | Partial (`POST /api/v1/knowledge-sources` accepts `title`, `sourceType`, `content`, `metadata` incl. mime type; `GET /api/v1/knowledge-sources/{id}/status` returns per-stage breakdown) | Job-level polling exists; need SSE stream for low-latency updates plus clearer validation errors and optional auto-generated `title`/`sourceType` when not provided |
| File uploads (pdf/docx/md/txt) for ingestion | Accept binary uploads or pre-signed URLs with MIME metadata so Atlas can read arbitrary documents | No | Add multipart upload or pre-signed URL flow (e.g., `POST /api/v1/knowledge-sources/upload` → URL + token, then `POST /api/v1/knowledge-sources` referencing the blob); support MIME detection, size limits, and OCR/text extraction flags |
| Staging Area cluster listing (cards with counts + item rows) | Fetch staging insights grouped by cluster with item type, content, confidence, conflict flags | No | Add `GET /api/v1/staging/clusters` (filters: knowledgeSourceId, status) returning clusters `{id,title,summary,items[],risksCount,conflictStatus}`; include per-item `aiActionTaken`/conflict metadata |
| Promote / Reject cluster actions | Commit a cluster to System of Record or discard it | No | Add `POST /api/v1/staging/clusters/{id}/promote` and `/reject` (or a `decision` endpoint) that materializes or deletes associated insights, emits conflicts/merges, and returns updated counts |
| Conflict badge on items (“Conflict Detected”) | Surface conflict detection results for staged items (targets, severity) | No | Extend staging item payload with conflict detail (`conflictsWith`, severity, resolution hint) and ensure conflict checks run before the staging fetch |
| Ingestion pipeline banner (live stage updates) | Real-time stage transitions to drive the progress bar | Partial (polling status endpoint with stage schema exists) | Extend with SSE/webhook events (heartbeats, timestamps, retries/failover guidance) to reduce latency and request volume |
| Sources tab (connector list with status, last sync, items found, “Sync now”) | Manage and monitor connectors/integrations (Slack, Confluence, Drive) separately from knowledge-source jobs | No | Add connector resource: `GET /api/v1/connectors` with type, status, lastSync, itemsFound, error reason; `POST /api/v1/connectors/{id}/sync` to trigger re-sync; include auth/installation URLs for “Manage Integrations” |
| Entity View (lineage map, health badges, upstream/downstream counts) | Entity detail with relationships and health signals to render graph/metrics | Partial (`GET /api/v1/entities`, `/api/v1/entities/{id}` for basics) | Add lineage endpoint or expand entity detail to include incoming/outgoing relations (typed), rollups (upstream/downstream counts), and health/alerts to drive badges and graph nodes |

## Streaming vs Polling for ingestion progress (need both)
- **Must provide SSE**: `GET /api/v1/knowledge-sources/{id}/events` streaming stage transitions and progress payloads; include heartbeat/keepalive and latest full state in each event for cheap reconnection.
- **Must provide polling**: `GET /api/v1/knowledge-sources/{id}/status` with adaptive cadence (faster while processing, slower after completion) and jitter/retry guidance to avoid thundering herds.
- Client behavior: attempt SSE first for low-latency, low-chatter updates; automatically fall back to polling when SSE is unavailable (proxy timeouts, network limits). Document both so UI can reliably fail over.

# Explore Tab (Canonical Insights) → Backend Coverage

| UI feature | Required backend capability | Endpoint exists? | Gap / required addition |
| --- | --- | --- | --- |
| Canonical insights table (type, content, source, status) with search | Paginated search of canonical insights, filtered by type/status/q, returning normalized status labels and source title for display | Missing in current spec (needs `/api/v1/knowledge-base/insights`) | Add the insights endpoint plus workspace/context and explicit `layer` filter (`canonical | staging | exploratory`) to guarantee canonical-only results; standardize status vocabulary per insight type (e.g., Decision→decided/open, Requirement→verified/rejected) so UI badges map reliably; guarantee `source.title` is populated when available or provide fallback string |

# Recommended Scope to Close Current Gaps

- **Ingestion progress (additive)**: Keep `GET /api/v1/knowledge-sources/{id}/status`; add `GET /api/v1/knowledge-sources/{id}/events` (SSE) reusing existing stage names, with heartbeats, timestamps, and retry/failover guidance.
- **Validation clarity**: Enhance `POST /api/v1/knowledge-sources` errors to return `{field, code, message}` and optionally auto-generate `title`/`sourceType` when omitted.
- **File ingestion**: Add upload/presigned flow (`POST /api/v1/knowledge-sources/upload` -> `{uploadUrl, token, mimeType, expiresAt, maxSizeBytes, allowedMimeTypes}`; or multipart) and allow ingesting via blob token + metadata (mimeType, size, ocrEnabled/textExtraction flags). Enforce allowed MIME types (pdf/docx/md/txt) and size caps; OCR opt-in flag.
- **Staging area**: Add `GET /api/v1/staging/clusters` (filters: knowledgeSourceId, status; respects caller visibility) returning clusters with items and conflict detail (`conflictsWith`, severity, hint); add `POST /api/v1/staging/clusters/{id}/promote` and `/reject` to materialize or discard and return updated counts/status; ensure conflict checks run before staging fetches.
- **Conflicts**: Ensure staging item payloads include conflict detail and that conflict checks run before staging fetches.
- **Canonical insights**: Add `GET /api/v1/knowledge-base/insights` (canonical by default) with `q`, `type`, `status`, `workspaceId`, `layer` (`canonical|staging|exploratory`), pagination; normalize statuses per type; guarantee `source.title` or provide fallback; scope results to caller visibility/auth.
- **Connectors**: Add `GET /api/v1/connectors` returning `{id,type,status,lastSync,itemsFound,error,authUrl,manageUrl}` with clear status enum (e.g., synced|syncing|error) and `POST /api/v1/connectors/{id}/sync` plus rate limit/backoff hints (e.g., retryAfterSeconds).
- **Entity lineage/health**: Extend entity detail or add a lineage endpoint to include typed incoming/outgoing relations, upstream/downstream counts, and health/alerts for badges/graph (e.g., `{lineage:{incoming:[],outgoing:[]},counts:{upstream,downstream},health:{status,alerts[]}}`).

## Remaining gaps after latest backend spec (docs/backend/openapi.json)
- **SSE response shape/media type**: `/api/v1/knowledge-sources/{knowledge_source_id}/events` still returns `application/json {}` with no event schema and no `text/event-stream`. Define `IngestionEvent` payload and surface it under `text/event-stream` with `id`/`event` fields and keepalive cadence (status, stages with timestamps/progressPct, heartbeat, retryAfterSeconds).
- **Validation error format**: `HTTPValidationError` remains `{loc,msg,type}`; no structured `{field, code, message}` envelope yet for ingestion create failures. Add a structured error schema and codes (e.g., `missing_field`, `invalid_mime_type`, `size_exceeded`), retaining HTTPValidationError for compatibility.
- **Staging clusters filters**: `GET /api/v1/staging/clusters` still lacks optional status filter/pagination to avoid client-side slicing on large sets; add filters and document visibility scoping.
