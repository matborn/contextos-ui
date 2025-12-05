<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1NM8xppGi0zEbqs7-rIvyzsNO0Jc1N6v8

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Backend Calls & Core Graph API

This app treats the Next.js layer as a **Backend-for-Frontend (BFF)** for the Core Graph API defined in `docs/backend/openapi.json`:

- All Core API calls happen **server-side only**, via `lib/coreClient.ts` and domain services like `lib/workspaces.ts`.
- Client code must call **internal Next API routes** (e.g. `/api/workspaces`) or server components, never the Core API directly.
- Headers such as `X-User-Id` / `X-User-Domains` are attached on the server, not in the browser.

For details and extension guidelines, see `docs/backend-call-architecture.md`.
