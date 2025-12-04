# UI Modernization Plan (Next + Tailwind v4)  
> Comprehensive, actionable checklist to align this repo with our design-system + naming ADR. All boxes start unchecked.

## 0. Guardrails for any change
- [ ] Capture before/after screenshots for touched views to confirm no visual regressions.
- [ ] Preserve existing spacing/typography tokens; if a wrapper is introduced, mirror current classes in the DS component first, then replace usages.

## 1. Design system consolidation (`components/ui/` as source of truth)
- [ ] **Add missing primitives:** build `Slider`, `Select`, `Textarea`, `Checkbox`, `Radio`, `Table`, and `InputGroup` in `components/ui/` using Tailwind v4 tokens and focus-visible rings.
- [ ] **Migrate raw controls:** replace ad-hoc `<input>/<select>/<textarea>` across `apps/` and `screens/` with the new primitives (start with high-usage files: `apps/LifeOS.tsx`, `components/projects/ProjectSettingsModal.tsx`, `components/app-builder/ViewRenderer.tsx`, `screens/DocGenV2.tsx`, `screens/Settings.tsx`).
- [ ] **Document variants:** once Storybook is added (see Tooling), create stories for each primitive (default, error, disabled, loading).

## 2. Styling & tokens (Tailwind v4 only)
- [ ] **Purge arbitrary values/hex:** scan for arbitrary classes (e.g., `bg-[radial-gradient...]`, hex fills in SVGs). Replace with tokens or DS utility classes; where gradients are essential, wrap as tokenized utilities in `globals.css`.
- [ ] **Unify colors:** ensure all primary/brand usage maps to `primary-*` or `brand-ai-*` tokens in `app/globals.css`; remove stray accent classes (`accent-blue-600`, etc.) by routing through DS props.
- [ ] **Spacing/radius scale:** define and reference spacing/radius tokens in `globals.css`; update components using bespoke padding/margin to tokenized equivalents.

## 3. Accessibility & interaction
- [ ] Add focus-visible rings and ARIA labels/roles to new form primitives and interactive DS components (`Button`, `Card` clickable variants, `AgentInput`, `SlideOver`, `Modal`).
- [ ] Standardize keyboard support for overlays: `Modal` and `SlideOver` must trap focus, close on Escape, and restore focus.
- [ ] Add “ghost interactions” defaults to DS components (hover, active, disabled states) using tokens.

## 4. Layout adherence
- [ ] Enforce the Layout Grail in top-level shells: `App.tsx` main wrapper, `AppBuilder`, `ContextOS`, `LifeOS`, `Scriptor`, `Projects`, `Muse` screens. Ensure `h-screen`, `overflow-hidden`, `shrink-0` on header/sidebar, `overflow-y-auto` on content panes.
- [ ] Create a `PageScaffold` helper (wrapper over `PageLayout`) that bakes the grail pattern to prevent bespoke containers.

## 5. Naming & domain alignment (per ADR “Technical Naming vs Product Branding”)
- [ ] Introduce a mapping file `modules.ts` (technical id → marketing label). Use technical ids in routes, folders, and state.
- [ ] Rename marketing-coded files/folders to stable technical names (e.g., `apps/Scriptor` → `apps/documents`, `apps/Muse` → `apps/ideation`, `apps/LifeOS` → `apps/wealth` or chosen domain). Add re-export stubs to avoid breakage during migration.
- [ ] Update imports/usages to technical names; keep display copy via mapping to retain current branding in UI.
- [ ] Align types: replace `AppId` string union with technical ids; keep marketing labels in a lookup.

## 6. State management hygiene
- [ ] Replace lingering `any` in navigation/state props (e.g., `screens/WizardPage.tsx`, `screens/ContextDashboard.tsx`, `screens/ContextDetail.tsx`, `screens/Settings.tsx`) with explicit types.
- [ ] Keep state local or via small contexts; justify any new global store with a coordination/consistency note in code review.

## 7. Tooling & docs
- [ ] Add Storybook (Next + Tailwind v4) with MDX docs for DS components; ensure tokens are visible.
- [ ] Add lint rules for Tailwind class ordering and banning arbitrary values/inline styles.
- [ ] Add a11y CI check (eslint-plugin-jsx-a11y or Storybook a11y addon).

## 8. Testing
- [ ] Add Vitest + React Testing Library for DS logic (focus trapping, disabled states, toast queue).
- [ ] Add one Playwright smoke for the main app shell (nav switch + open modal) after DS primitives stabilize.

## 9. TypeScript strictness plan
- [ ] Address existing `any` hotspots (see state hygiene) and implicit anys in DS.
- [ ] Flip `tsconfig` to `strict: true` after hotspots are resolved; keep `noImplicitAny` clean in CI.

## 10. Mock data quality
- [ ] Replace lorem/generic items with rich domain data across samples (`screens/DocGenV2.tsx`, `screens/KnowledgeBase.tsx`, `screens/Settings.tsx`), ensuring enum-based statuses and realistic names.

## 11. Build & repo hygiene
- [ ] Remove remaining Vite-only remnants from docs/scripts; ensure README references Next/Tailwind v4.
- [ ] Keep `.next` and Storybook artifacts gitignored; add recommended dev commands to README.

## Rollout order (suggested)
1) Add DS primitives (Slider/Select/Textarea/Checkbox/Radio) mirroring existing styles → migrate highest-traffic screens.  
2) Enforce layout grail via `PageScaffold`.  
3) Token/aria pass on DS components.  
4) Naming refactor to technical ids with mapping.  
5) Add Storybook + a11y/lint rules.  
6) Strict TS & tests; Playwright smoke.  
7) Mock-data uplift.  
