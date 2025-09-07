# Contributing to Virtual Nano Banana

Thanks for your interest in contributing! This document outlines how to build, test, and submit changes.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Commit Style](#commit-style)
- [Pull Requests](#pull-requests)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Security](#security)
- [Areas Where Help Is Needed](#areas-where-help-is-needed)

## Code of Conduct
Please be respectful and constructive. Harassment, discrimination, and abusive behavior are not tolerated.

## Getting Started
1. Fork the repo and clone your fork.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a local environment file `env.local` (or `.env.local`) in the repo root:
   ```bash
   VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   VITE_ELEVENLABS_API_KEY=YOUR_ELEVENLABS_API_KEY
   ```
   Restart the dev server when env values change.
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:5173

## Project Structure
- `components/` — UI components such as `AddProductModal.tsx`, `TryOnModal.tsx`, `MicButton.tsx`
- `services/` — API wrappers, e.g. `geminiService.ts`, `elevenlabsSTT.ts`
- `assets/` — Catalog images referenced by `constants.ts`
- `App.tsx` — App shell and modal routing
- `constants.ts` — In-memory catalog + categories
- `types.ts` — Shared TypeScript types
- `README.md` — Overview and setup
- `SECURITY.md` — Security policy
- `CONTRIBUTING.md` — This file

## Development Workflow
- Branch naming: `feature/<short-name>`, `fix/<short-name>`, or `docs/<short-name>`
- Keep changes focused and small; prefer multiple small PRs over one large one.
- For UI work, include screenshots/GIFs in your PR when possible.
- For API/service changes, describe request/response and any env updates.

### Running and Testing
- Development:
  ```bash
  npm run dev
  ```
- Build:
  ```bash
  npm run build
  ```
- Preview production build:
  ```bash
  npm run preview
  ```
- Automated tests are not yet set up. If you add tests, please include instructions and tooling (e.g., Vitest/Jest) in your PR.

### Code Style
- Use TypeScript for new code.
- Prefer functional React components with hooks.
- Keep imports at the top of files. Avoid side‑effects in module scope.
- Avoid `any` where practical; define and reuse types in `types.ts`.
- Keep components small and composable. Extract helpers into `services/` when they touch external APIs.
- Accessibility: ensure focus states and keyboard navigation are preserved.

### Working With Services
- `services/geminiService.ts` uses `@google/genai` and reads `VITE_GEMINI_API_KEY`.
- `services/elevenlabsSTT.ts` posts to `https://api.elevenlabs.io/v1/speech-to-text` and reads `VITE_ELEVENLABS_API_KEY`.
- Avoid logging secrets. Handle errors gracefully and surface actionable messages to the UI.

### Assets & Catalog
- Add images to `assets/` and reference them from `constants.ts` using the exact filename.
- Use clear product names and categories: `outerwear`, `hats`, `eyewear`, `shoes`, `shirts`, `pants`.

## Commit Style
Use descriptive commit messages. Conventional commits are encouraged but not enforced, e.g.:
- `feat: add ElevenLabs mic button to AddProductModal`
- `fix: handle microphone permission denied state`
- `docs: update README with STT setup`

## Pull Requests
- Merge target: the repository's default branch (or the branch requested by maintainers).
- Ensure PRs are rebased on the latest main to reduce merge conflicts.
- Fill out the PR description with context, testing notes, and screenshots when relevant.
- Link related issues ("Closes #123").

## Issue Reporting
- Use the GitHub Issue templates if available.
- Include steps to reproduce, expected vs. actual behavior, console logs, and environment info.
- For visual issues, attach screenshots.

## Feature Requests
- Explain the user problem and proposed solution.
- Describe alternatives considered.
- Note any API or UI implications (new buttons, routes, env variables).

## Security
- Do not include secrets in PRs or logs.
- For vulnerability reports, follow `SECURITY.md`.
- Consider a backend proxy for AI requests in production to avoid exposing keys to clients.

## Areas Where Help Is Needed
- Accessibility improvements (keyboard navigation, ARIA labels)
- Automated testing setup (unit/integration) and CI
- Backend proxy (FastAPI) for secure AI calls and persistence
- Performance optimizations for image processing and data URLs
- Documentation polish and additional examples
