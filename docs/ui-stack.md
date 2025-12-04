# ContextOS UI Stack (Current vs Target)
Single reference for this repo. Reflects what’s in place today and what we’re moving toward, without blocking ongoing work.

## Versions (update as we upgrade)
- Node.js: 20+ (current: 20.x available locally)
- React: **19.x** (current)
- Next.js: **16.x** App Router (current)
- TypeScript: 5.8/5.9 (current 5.8.x)
- Tailwind CSS: **4.x** (current)
- Package manager: pnpm 10 (current)

## Core stance (enforced now)
- Framework: Next.js App Router with React 19.
- Styling: Tailwind v4 with theme tokens in `app/globals.css`; no arbitrary hex/inline styles for new code.
- Design system locus: `components/ui/` is the DS; new primitives/patterns land here first, then are consumed.
- Layout: use the Layout Grail (fixed header/sidebar, scrolling panes) and `PageLayout`/shared shells instead of bespoke containers.
- Naming: technical, stable identifiers in code; marketing names only in copy/mapping tables (per ADR).

## Target stack (phased adoption)
- **Storybook 10 (Vite builder)**: planned. Will become the source of truth for DS docs once added.
- **Radix primitives (internal only)**: planned for accessible overlays/menus inside `components/ui/`. App code will not import Radix directly.
- **Shared Tailwind preset (@contextos/tailwind-config)**: planned; for now we rely on `globals.css`.
- **Data/state**: TanStack Query for server state; React Hook Form + Zod for forms; a small, well-scoped store (Zustand or Context) for UI coordination. Today: plain hooks/local state.
- **Graphs/Charts**: React Flow (graph UIs) and Recharts (dashboards) as preferred libs when those concerns arise. Not yet included.

## Rules (practical)
- Use DS primitives before raw HTML. If a primitive is missing, add it to `components/ui/` (or file a “promote to DS” follow-up) before widespread use.
- Tailwind tokens only; extend tokens instead of adding inline styles/arbitrary values.
- Accessibility is non-negotiable: focus-visible rings, ARIA labels/roles, modals/slideovers trap focus and close on Escape.
- No alternative UI frameworks/libraries (MUI/Chakra/AntD) in app code.
- Keep state local/small-context first; justify any new global store. Introduce TanStack Query/Zod/RHF as we adopt the target stack.

## Current gaps to close
- Missing DS wrappers for select/textarea/checkbox/radio/range/table; raw controls still exist.
- No Storybook yet; add it and backfill stories for DS components.
- Radix not installed; plan migration for overlays (Modal/SlideOver) to Radix-backed primitives.
- Strict TS not yet enabled; clear `any` hotspots before flipping `strict`.
- No shared Tailwind preset package; tokens live in `globals.css`.

## Rollout order (suggested)
1) Add DS primitives (select/textarea/checkbox/radio/range/table) and migrate raw controls.  
2) Add Storybook + docs for DS; enforce token-only styling.  
3) Introduce Radix internally in DS for a11y overlays/menus.  
4) Adopt TanStack Query + RHF/Zod where server state/forms appear; add light Zustand/context where coordination benefits.  
5) Flip TS `strict` once `any` hotspots are resolved.  
6) Extract shared Tailwind preset when tokens stabilize.  
