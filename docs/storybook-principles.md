# Storybook Principles
How we structure, write, and maintain stories so the catalog is useful for humans and agents.

## Information architecture (titles)
Use this hierarchy in `title` fields:
- **Foundations/** (tokens, utilities)
- **Components/** (primitives from `components/ui/`)
- **Layouts/** (scaffolds/shells like PageLayout, Modal, SlideOver)
- **Patterns/** (composed reusable chunks: AgentInput, ListItem, Connectors, PageSection)
- **Domain/** (context-specific composites: Ontology viewer shell, AppBuilder widgets, LifeOS cards)
- **Examples/** (optional thin slices of screens)

Example titles: `Components/Card`, `Layouts/PageLayout`, `Patterns/AgentInput`.

## What every story must include
- **Description:** what the component does, its primary use cases, and when *not* to use it.
- **Variants:** all supported visual/behavioral variants (size, tone, state) as separate stories or args controls.
- **States:** loading, error, empty, disabled, focus/hover/active if applicable.
- **Controls/Args:** surfaced props that are safe to tweak; sensible defaults. Use Storybook Controls (Args) to make interactive knobs for safe, documented props, and to demonstrate how tokens/theme variants respond. Do not expose controls that break layout, violate a11y, or bypass design tokens.
- **A11y:** ensure focus-visible rings show in stories; include label/aria examples for form controls.
- **Theming/tokens:** demonstrate token usage (e.g., brand vs primary) where relevant.
- **Composition notes:** if the component is meant to be composed (e.g., CardHeader + CardContent), show correct usage.

## Writing principles
- Prefer CSF stories with `layout: 'centered'` or `padded` as appropriate; avoid bespoke wrappers unless part of the example.
- Keep stories minimal but realistic—use rich mock data, not lorem ipsum.
- Name stories by scenario, not by prop: `WithActions`, `EmptyState`, `Error`, `Loading`, `Hoverable`.
- One component per file unless variants are tightly related.
- Co-locate docs with the story via description text and `parameters.docs` where needed; avoid duplicating design system docs elsewhere.

## Quality bar
- No visual regressions: import `app/globals.css` in `.storybook/preview.ts` so tokens apply.
- No ad-hoc styling inside stories beyond layout helpers; use component props/tokens instead.
- Stories should render without external data or side effects; mock or stub inside the story.
- If a prop is required, provide a default in the story args; keep stories copy-pastable.

## Maintenance
- When adding a new component: add at least one story per variant/state, plus a short description.
- When changing a component API: update stories and descriptions in the same PR.
- Remove deprecated stories promptly; keep the tree clean (no boilerplate placeholders).
