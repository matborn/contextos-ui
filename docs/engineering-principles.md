# Engineering Principles (Repo-Specific)
Concise, front-end–focused guardrails that harmonize with our design system and naming ADR. Use these in reviews and when adding new code.

## Architecture & Dependencies
- Prefer explicit dependencies (props/hooks/params); avoid hidden singletons. Scoped React context is fine; justify any new global store.
- Keep business/interaction logic decoupled from I/O (fetch/SDK calls). Pass data/clients in; do not create them deep in components.
- Use stable technical names in code (per ADR); keep marketing names in copy/mapping tables.

## Components & Layout
- One component, one purpose; if you need “and” to describe it, split it.
- Build UI from `components/ui/` primitives first. If a needed primitive is missing, add it there before using raw HTML.
- Enforce the Layout Grail: `h-screen` shell, fixed header/sidebar (`shrink-0`), scrolling content panes (`overflow-y-auto`), no double scrollbars.

## Styling & Tokens
- Tailwind v4 tokens only—no inline styles, no arbitrary hex, no ad-hoc spacing/radius. Extend tokens in `app/globals.css` if something is missing.
- Shared interaction polish: `transition-all duration-200`, hover/active states, focus-visible rings using tokens.

## Accessibility
- All interactive components must support keyboard and focus-visible outlines; modals/slideovers trap focus and close on Escape.
- Provide ARIA labels/roles for controls; pair labels with inputs; ensure color contrast meets WCAG.

## Error Handling & Data Flow
- Validate at boundaries (API inputs, form submissions); fail fast with actionable messages. Don’t swallow errors you can’t handle.
- Keep mock data realistic (rich names/status enums) to surface edge cases early.

## Testing & Quality
- Design for testability: small, focused components; avoid tight coupling to I/O. New shared logic gets a unit/interaction test where non-trivial.
- Aim for readability over strict line counts; if JSX grows deep, extract subcomponents.
- No commented-out code, TODOs, or debug logs in committed code; never hardcode secrets.

## When to add new patterns
- Before inventing a pattern, check `components/ui/` and existing layouts. If truly new, add it to the DS (plus docs/test) or file a “promote to DS” follow-up with a clear timeline.
