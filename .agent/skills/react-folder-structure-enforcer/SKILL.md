---
name: react-folder-structure-enforcer
description: Enforces a domain-driven folder structure and strict naming conventions for React projects including redux, hooks, services, and utils.
triggers:
  - creating react components
  - organizing react project files
  - scaffolding project directories
  - refactoring react architecture
---

# React Project Folder Structure Agent Skill

## 1. Objective
Enforce a domain-driven architectural structure across the entire codebase. Never create, place, or suggest files or directories outside this predefined structure unless explicitly instructed. All React components and JavaScript files use `.js` (do NOT use `.jsx`).

---

## 2. Directory Architecture Blueprint

All generated files and path references must strictly follow this topology:

```text
src/
├── admin/
│   ├── [DomainViews].js
│   └── components/
│       └── [DomainScopedComponents].js
│
├── user/
│   ├── [DomainViews].js
│   └── components/
│       └── [DomainScopedComponents].js
│
├── general/
│   ├── [GlobalOrFallbackViews].js
│   └── components/
│       └── [GlobalOrSharedComponents].js
│
├── hooks/
│   └── use[FeatureName].js
│
├── redux/
│   ├── slices/
│   │   └── [domain]Slice.js
│   └── store.js
│
├── services/
│   └── apiClient.js
│
├── utils/
│   └── [utility].js
│
├── App.js
├── App.css
├── index.css
└── index.js
```
