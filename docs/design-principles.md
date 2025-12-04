# Design System Principles & Mental Models

This captures the visual, UX, and engineering guardrails we’re using (the “Enterprise Clean” aesthetic). Use it as a blueprint for prompts, reviews, and implementation.

## 1) Visual Principles – “Enterprise Clean”
- **Slate hierarchy, no pure black:** text-slate-900 for primary, text-slate-500/600 for secondary, border-slate-200, backgrounds: bg-slate-50 (canvas) vs bg-white (cards). Elevation comes from tone, not heavy shadows.
- **Micro‑typography for labels/metadata:** `text-[10px] uppercase tracking-wider font-bold text-slate-400` to separate structure from data.
- **Subtle interaction states:** `hover:bg-slate-50`, `transition-all duration-200`; light scale/translate on cards (`active:scale-95`, `hover:-translate-y-1`) for tactility.

## 2) UX Mental Models
- **Progressive disclosure:** SlideOvers for detail, Modals for distinct actions; keep user in context.
- **Empty states teach:** dashed containers + muted icon + “Create New” CTA instead of blank lists.
- **3-second rule:** every page declares title, description, and back/breadcrumb via `PageLayout`.
- **Tight feedback loops:** toasts for async actions; buttons show `isLoading` to prevent double-submits.

## 3) Component Architecture
- **Atom-first:** never hand-roll repeated UI; use `Button`, `Card`, etc. Changing tokens updates the whole app.
- **Layout as slots:** `PageLayout` owns scrolling/padding/header to avoid double scrollbars and enforce consistency.

## System guardrails (working agreements)
- Treat `components/ui/` as the design system. If a primitive is missing, add it there before reaching for raw HTML; temporary use of raw controls should carry a follow-up to promote them.
- Styling stays on Tailwind v4 tokens only (theme colors, radii, spacing); avoid inline styles and arbitrary values.
- Use shared layouts (`PageLayout`, the Layout Grail pattern) instead of bespoke scrolling containers.
- New/shared components should get lightweight docs (Storybook once set up) and tests when logic exists; keep TypeScript strictness in mind—no new `any` in shared code.

## 4) AI Prompt Persona (engineering stance)
“Senior Product Engineer at a top-tier SaaS: polish matters; broken-looking UI implies broken logic. Favor type safety. Prototype with Tailwind utilities but keep them disciplined.”

## 5) Concrete Patterns
- **Navigation hierarchy:** global app switcher (ContextOS, Scriptor, Muse, etc.) + local sidebar per app to reduce cognitive load.
- **Magic input:** `AgentInput` auto-resizes, supports Enter-to-send, shows loading, lives inline (feels like a colleague, not a popup).
- **Visualizing complexity:** prefer structural visuals (e.g., Ontology graph) over flat lists to convey relationships quickly.

## Known gaps / add next
- **Accessibility:** define focus rings, color-contrast minimums, ARIA patterns for toasts/slideovers/modals.
- **Responsive rules:** breakpoints and density guidelines (mobile nav collapse, table reflow/stack).
- **Motion limits:** durations/easings and “reduce motion” support; where to avoid parallax/overshoot.
- **Data density & spacing scale:** spacing/radius/blur tokens and when to use each (dense vs. comfy modes).
- **Internationalization & truncation:** patterns for ellipsis, tooltips, and locale-ready date/number formatting.
- **Error & empty patterns:** standard copy/tone, inline vs. page-level errors, retry affordances.

Adopt these as acceptance criteria for new components/pages; extend the “gaps” list into concrete tokens and checklists.

## Tactical Pro Tips (for a polished AI UX)
- **Layout Grail (app vs. site):** fix the viewport and let panels scroll to avoid double scrollbars. Template (Tailwind v4-ready):
  ```tsx
  <div className="h-screen flex flex-col overflow-hidden">
    <Header className="shrink-0" />
    <div className="flex-1 flex overflow-hidden">
      <Sidebar className="w-64 shrink-0 overflow-y-auto" />
      <main className="flex-1 overflow-y-auto">{/* content */}</main>
    </div>
  </div>
  ```
  Add `shrink-0` on header/sidebar so async content doesn’t collapse them.
- **Rich mock data:** avoid Lorem Ipsum. Use named people (e.g., “Sarah Chen, Product Lead”) and constrained enums (`active | pending | archived`) to surface edge cases and make the UI feel lived-in.
- **State locality rule:** favor local state and small, well-scoped contexts; reach for a global/store only when coordination, debugging, and consistency clearly benefit.
- **Ghost interactions everywhere:** every clickable element gets feedback (`hover:bg-slate-50`, `hover:shadow-md`, `active:scale-95`, `focus:ring-2 focus:ring-primary-500/20`, `transition-all duration-200`).
- **Defensive UI:** design empty/loading states first—dashed borders, muted icon, explicit “Create new” CTA. Never leave blank panels.
- **Tailwind tokens, not hex:** standardize on Tailwind **v4** tokens (`bg-primary-500`, `text-slate-900`, `bg-brand-ai-500`). Avoid random hex so rebranding is a token change, not a rewrite.
- **Prompt in visual vernacular:** describe requested changes with concrete utilities (“sidebar bg-slate-50 + border-r; active item bg-primary-50 text-primary-600”) instead of vague “make it nicer.”
