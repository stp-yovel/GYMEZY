---
name: single-source-of-truth
description: Enforces Single Source of Truth (SSOT) across any MERN stack app (MongoDB, Express, React, Node). Use whenever defining or changing constants, enums, validation rules, API contracts, error codes, roles/permissions, config/env, UI tokens, or user-facing messages, so every fact is defined exactly once and reused everywhere else.
---

# Single Source of Truth (SSOT) - MERN Stack

## Core Principle
Every piece of knowledge (a rule, a value, a shape, a message) is defined in exactly ONE place.
Everything else imports, derives, or generates from it. Never copy, retype, or "mirror" it.

If you change a fact and have to edit more than one file, SSOT is broken.

## Before Writing Any Code, Ask
1. Does this value/rule/shape already exist? Search first, reuse if yes.
2. If new: which layer owns it (see ownership map)? Define it there only.
3. Can the other layers derive it (types, validators, docs) instead of redefining it?

## Ownership Map (what lives where, once)

| Fact | Single owner | Consumers derive from it |
|---|---|---|
| Data shape and validation rules | Shared schema (Zod/Joi) in `shared/schemas` | Express validators, Mongoose schema hints, React forms, TS types (`z.infer`) |
| Enums and constants (status, roles, limits) | `shared/constants` | DB models, API, UI dropdowns, tests |
| API routes and endpoint paths | `shared/api-routes` (or backend route registry) | Express routers, frontend API client, tests |
| API request/response contract | Shared schemas + OpenAPI generated from them | Frontend client, docs, mocks |
| Error codes and messages | `shared/errors` (code to message/HTTP status map) | Backend throw sites, frontend toasts, i18n |
| Roles and permissions | `shared/permissions` (role to capability matrix) | Backend middleware, frontend route guards, UI visibility |
| Environment and config | One validated `config` module per app (parsed once at boot) | Entire app; never read `process.env` / `import.meta.env` elsewhere |
| Database structure | Mongoose models (one per collection) | Services/repositories only; no ad-hoc queries on raw collections elsewhere |
| Server state in the UI | Data-fetching cache (React Query/RTK Query) | All components; never duplicate API data into local state |
| Global client state | One store slice per domain | Components via selectors |
| Design tokens (colors, spacing, typography) | One theme/tokens file | Ant Design theme config, CSS, components |
| UI text and labels | One i18n/messages catalog | All components |
| Business rules (pricing, eligibility, etc.) | One domain service/module in backend | Controllers, jobs, scripts; frontend only displays results |

## Recommended Structure

Monorepo (preferred):
```
/shared            <- the SSOT package (pure TS/JS, no framework imports)
  /constants
  /schemas
  /errors
  /permissions
  /api-routes
/server            <- imports from shared
/client            <- imports from shared
```

Separate repos: publish `shared` as a private npm package (or git submodule), versioned and consumed by both. Do not copy files between repos.

## Rules

1. Derive, don't duplicate. Types come from schemas (`z.infer`), not hand-written interfaces beside them.
2. Validate at the edges with the shared schema: Express middleware on the server, form resolver on the client. Same rule, same source.
3. No magic strings or numbers. `"ADMIN"`, `"pending"`, `10`, `"/api/users"` must come from a named constant.
4. One config module. Parse and validate env vars at startup; fail fast if invalid. Export a typed config object.
5. One API client in the frontend. All calls go through it; paths come from shared routes.
6. One place for error mapping. Backend throws coded errors; a single handler maps code to HTTP status and message; frontend maps code to display text from the same catalog.
7. Permissions are data, not scattered `if (role === ...)` checks. Check capabilities via the shared matrix.
8. Mongoose model owns persistence shape; derived DTOs (what leaves the API) come from shared schemas, never from returning raw documents.
9. Server data is not copied into client state. Cache it, invalidate it, select from it.
10. Generated artifacts (OpenAPI, types, mocks) are never edited by hand; regenerate from the source.

## Anti-Patterns (flag and fix on sight)
- Same enum or status list typed in model, validator, and React dropdown.
- Hand-written TS interface duplicating a Zod/Mongoose shape.
- Hardcoded URLs, ports, role names, or limits in components or controllers.
- `process.env.X` or `import.meta.env.X` read in many files.
- Validation rules differing between frontend and backend.
- Same error text hardcoded in several places.
- Copying API data into `useState` and keeping it "in sync" manually.
- Colors/spacing hardcoded in components instead of theme tokens.
- Business logic duplicated in React and Express.

## Workflow When Changing a Fact
1. Find the owner in the ownership map.
2. Change it there only.
3. Let types, validators, docs, and UI follow automatically; fix compile errors, not copies.
4. Add or update a test at the source (schema/constant/rule), not at every consumer.

## Review Checklist
- [ ] Is every new constant/enum/rule defined once, in the correct owner location?
- [ ] Are types derived rather than re-declared?
- [ ] Do frontend and backend validate with the same schema?
- [ ] Is there any hardcoded string, number, URL, role, or color that should be a named export?
- [ ] Is env/config accessed only through the config module?
- [ ] Are errors, permissions, and messages looked up from their catalogs?
- [ ] Is any server data duplicated into client state?
- [ ] Were generated files regenerated instead of hand-edited?

## Works Together With
`api-standardization`, `centralized-ui-system`, `react-project-architecture`, `react-folder-structure-enforcer`, `mongodb-architecture`, `jwt-auth-lifecycle`, `clean-code-sonarqube-guard`. When these skills conflict with SSOT on where something lives, SSOT ownership wins, and the other skill decides only the style within that location.