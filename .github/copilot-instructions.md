# Copilot Instruction for fin-track

## Purpose

- Provide consistent guidance for contributions across the monorepo (api, web, shared).
- Favor clarity, safety, and UX quality; follow existing patterns before inventing new ones.

## Architecture and Project Conventions

- Monorepo layout: `packages/api` (Node/Express, Vercel), `packages/web` (Next.js/React/TypeScript), `shared` utilities/types.
- Reuse shared types from `shared/types` and backend types to keep API and UI aligned. Avoid ad-hoc shapes.
- Keep feature code colocated (e.g., `app/{feature}` with nearby components/hooks); keep generic UI in `components/ui`, domain UI in `components/shared`.
- Prefer server components in Next.js; add `"use client"` only when browser-only state or effects are required.
- In Express, keep controllers thin: validate, delegate to services, return typed responses. Keep business logic in services/utilities.
- Do not introduce new dependencies without need; prefer existing helpers and tokens.

## UX and UI Best Practices

- Visual hierarchy: use existing font tokens, spacing scale, and color variables; avoid arbitrary sizes or colors.
- State coverage: always handle loading, empty, error, and success states. Prefer skeletons/shimmers to spinners for data-heavy views.
- Forms: inline validation, concise errors, stable layout; disable primary action during submit; keep primary action obvious.
- Navigation: align with `constants/menuItems.ts`; highlight active routes; no dead ends—offer a way back or a clear next step.
- Charts/tables: ensure tooltips, legends, accessible labels, and keyboard focus states. Make time filters and currencies explicit.
- Responsiveness: design mobile-first; avoid horizontal scroll on mobile; test common breakpoints used by the layout.
- Accessibility: semantic HTML, labeled form controls, visible focus, ARIA where needed, trap/focus management for dialogs/drawers.
- Localization: use the i18n message files; no hardcoded copy. Keep strings concise and translatable; avoid concatenation that breaks grammar.
- Motion: purposeful and minimal; avoid gratuitous animations and layout shifts.

## Frontend Engineering (Next.js/React)

- TypeScript strictness: avoid `any`; narrow types; use discriminated unions for state. Reuse schemas/validators in `lib/schemas` where possible.
- Data fetching: use `services/api.ts` and `services/auth.ts`; handle errors centrally and show user-friendly messages.
- State: prefer local state and hooks; use Redux slices only when global state is required; avoid duplicating sources of truth.
- Components: keep pure/composable; avoid prop drilling—lift state or use context sparingly. Memoize expensive UI; lazy-load non-critical charts.
- Assets: prefer `next/image`; optimize and reuse assets; respect existing `public/` structure.
- Testing mindset: add or adjust tests when changing logic, especially date ranges, currency handling, and category filtering.

## Backend Engineering (Express)

- Validate all inputs; reuse schemas/types from `src/types` or shared definitions. Reject early on auth/permission failures.
- Routes/controllers: keep routing declarative in `routes/index.ts` and `routes/v1/*`; return consistent shapes (`data`, `message`, `error`).
- Services: encapsulate business rules (transactions, categories, payments). Keep database/payment upserts idempotent and logged.
- Error handling: rely on centralized `errorHandler`; avoid leaking sensitive details; log with context but not secrets.
- Auth: keep `authMiddleware` in place; never trust client-side data; prefer HTTP-only/session mechanisms already in use.

## Coding Style

- Naming: domain-oriented and explicit; avoid unclear abbreviations.
- Comments: add only when intent is non-obvious; prefer self-explanatory code.
- Formatting: follow existing lint/Prettier config; keep imports ordered and minimal.
- Avoid magic numbers/strings; use shared constants and tokens.
- Keep diffs small and coherent; match adjacent patterns before introducing new ones.

## When in Doubt

- Mirror adjacent files and established patterns.
- Document assumptions briefly when behavior is non-obvious.
- Favor clarity over cleverness; prioritize user impact, stability, and accessibility.

## Agent Instructions

- Don't create documentation or instructional files if not specifically requested.
- Use en.json for all texts to be translated.
- Don't update other translations unless explicitly asked.
- When implementing a solution, always look out for typescript errors and fix them.
- Never use "any" type in typescript files.
