# Repository Guidelines

## Project Structure & Module Organization
- React + TypeScript app bootstrapped with Vite. Entry is `index.tsx`, with root UI in `App.tsx` and HTML scaffold in `index.html`.
- Feature flows live under `pages/` (e.g., `pages/Workspace.tsx`, `pages/ContextDashboard.tsx`) and application-specific shells under `apps/` (e.g., `apps/ContextOS.tsx`).
- Shared building blocks sit in `components/` (navigation, panels, document viewers) and cross-cutting helpers in `utils.ts` and `types.ts`. Remote integrations are grouped in `services/` (Gemini, auth, builders, life). Reference docs and IA notes live in `docs/`.

## Build, Test, and Development Commands
- `npm install` — install dependencies.
- `npm run dev` — start the Vite dev server with hot reload.
- `npm run build` — production bundle; ensure it stays warning-free.
- `npm run preview` — serve the production build locally for smoke-testing.
- Set `GEMINI_API_KEY` in `.env.local` before running features that call Gemini.

## Coding Style & Naming Conventions
- TypeScript + React 19, JSX via Vite. Prefer functional components and hooks; keep props typed explicitly.
- Use 2-space indentation, trailing commas, and single quotes where practical for consistency. Align imports by grouping external, internal (`@/` alias to repo root), then relative.
- Component files use `PascalCase.tsx`; hooks/utility modules use `camelCase.ts` and export named functions. Keep state local to pages/apps and pass down via props; elevate shared logic into `components/` or `services/`.

## Testing Guidelines
- No automated test harness is configured yet. When adding tests, prefer Vitest + React Testing Library to match Vite/React; colocate spec files next to modules (`ComponentName.spec.tsx`).
- Add smoke coverage for critical flows (workspace navigation, Gemini calls mocked) and keep tests deterministic by stubbing network/service calls.

## Commit & Pull Request Guidelines
- History is light; default to Conventional Commits (`feat:`, `fix:`, `chore:`) with imperative, concise subjects. Scope by feature or area (`feat(workspace): ...`).
- PRs should include a short summary, screenshots or GIFs for UI changes, and notes on testing performed (`npm run dev` smoke, preview check). Link to any relevant docs in `docs/` when altering IA/architecture.

## Security & Configuration Tips
- Never commit `.env.local` or API keys; rotate `GEMINI_API_KEY` if exposed. Keep service clients thin and isolate secrets to environment variables.
- Review `services/` for network access changes and document expected payloads. Avoid adding new scopes without describing rationale in the PR.
