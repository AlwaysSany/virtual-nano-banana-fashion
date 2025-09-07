# Security Policy

Thank you for helping keep Virtual Nano Banana secure.

## Supported Versions

This project is under active development. Security fixes will generally be applied to the default branch and released as soon as practical. If you are running a fork or a pinned older commit, please rebase regularly.

## Reporting a Vulnerability

- Please do not file public GitHub issues for security vulnerabilities.
- Instead, use GitHub Security Advisories (preferred) or contact the maintainer privately if advisories are not available.
  - GitHub: Security > Advisories > Report a vulnerability
  - Alternatively, open a security disclosure via a private email channel if you have one for this repo.
- Provide as much detail as possible:
  - Affected files and components (e.g., `services/geminiService.ts`, `components/MicButton.tsx`)
  - Steps to reproduce and impact assessment
  - Any proof-of-concept code or screenshots
  - Suggested remediation if you have one

We will acknowledge receipt within 72 hours, investigate, and provide a timeline for remediation when possible. Coordinated disclosure is appreciated.

## Scope and Threat Model

This is a client-heavy React + Vite application that calls third‑party AI APIs.

- Frontend: React (Vite) in `virtual-nano-banana-fashion/`
- AI Services: Google Gemini (via `@google/genai`) and ElevenLabs Speech‑to‑Text
- No server is included in this repository; network calls are made from the browser.

Threats to consider:
- Exposure of API keys or secrets
- Abuse of client‑side API credentials
- XSS/DOM injection via prompt fields
- CSRF is not applicable without a backend, but consider SSRF or open redirect if introducing a server
- Supply‑chain risks (malicious packages)

## Handling Secrets

- Vite exposes variables prefixed with `VITE_` to client code. Keys present in `env.local` with `VITE_` are sent to the browser.
- Current variables:
  - `VITE_GEMINI_API_KEY`
  - `VITE_ELEVENLABS_API_KEY`
- For production deployments, consider proxying AI requests through a minimal backend so keys are not exposed to end users. The README notes FastAPI as a preferred backend option.

## Dependency Security

- Use trusted sources for packages. Prefer exact versions or vetted ranges.
- Review `package.json` for new dependencies and periodically run a vulnerability audit:
  - `npm audit --production`
- When bumping dependencies, prefer non‑breaking updates and review changelogs. Test locally before merging.

## Secure Development Guidelines

- Validate and sanitize user input. Prompts and filenames should not be interpreted as HTML/JS.
- Avoid `dangerouslySetInnerHTML`. Keep UI rendering purely declarative.
- Do not log secrets or full API responses if they could contain sensitive metadata.
- Handle microphone permissions carefully. The `MicButton` component must fail gracefully if permissions are denied.
- Use HTTPS in production to enable secure microphone access and protect API calls.
- Limit the scope of CORS if adding a backend.

## Third‑Party Services

- Google Gemini: `services/geminiService.ts`
  - Model: `gemini-2.5-flash-image-preview`
  - Reads key from `VITE_GEMINI_API_KEY`
- ElevenLabs STT: `services/elevenlabsSTT.ts`
  - Endpoint: `POST https://api.elevenlabs.io/v1/speech-to-text`
  - Model: `scribe_v1`
  - Reads key from `VITE_ELEVENLABS_API_KEY`

If replacing or adding providers, review their auth, rate limiting, and data retention policies.

## Responsible Use of AI

- Explain to users that generated/edited images are AI‑assisted and may contain artifacts.
- Avoid generating harmful or infringing content. Do not upload logos or third‑party imagery without permission.

## Incident Response

If a security incident is suspected:
- Revoke exposed API keys immediately and rotate credentials.
- Remove compromised artifacts, create a fresh release, and notify users of potential impact.
- Document the root cause and mitigation in a post‑mortem.
