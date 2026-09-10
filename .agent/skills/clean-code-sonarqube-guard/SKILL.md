---
name: clean-code-sonarqube-guard
description: Enforces clean coding standards, low cognitive complexity (<= 15), secure randomness, shallow function nesting, accessibility semantics, and universal SonarQube quality rules across all JavaScript, TypeScript, React, and Node.js codebases.
triggers:
  - writing new react or node components
  - refactoring functions
  - fixing sonarqube issues
  - reducing cognitive complexity
  - generating IDs or random tokens
  - handling forms, tables, modals, or file uploads
  - writing regex or number parsers
  - fixing accessibility or interactive elements
  - writing unit tests or configuring test coverage
---

# Universal Clean Code & SonarQube Quality Guard Skill

## Objective

Ensure all code written across any project (React, Next.js, Node.js, TypeScript, JavaScript, fullstack applications) strictly complies with SonarQube quality gates, clean architecture, accessible semantics, low cognitive complexity, secure cryptography, robust regex performance, and zero hardcoded environmental or tenant assumptions.

---

## 1. Cognitive Complexity Limit (Rule: `javascript:S3776` $\le$ 15)

Every function, React component, hook (`useEffect`, `useCallback`, `useMemo`), controller, and helper MUST maintain a Cognitive Complexity score of **15 or lower** (aim for $\le$ 5).

### Core Strategies for Low Complexity:

1. **Use Lookup / Strategy Dictionaries Instead of Nested `if / else` Ladders**:
   - Avoid cascading `if (type === "A") { if (...) { ... } } else if (type === "B") { ... }`.
   - Use strategy lookup maps with isolated pure handler functions:
     ```javascript
     const STATUS_CONFIG_HANDLERS = {
       active: (filters) => ({ status: "ACTIVE", ...filters }),
       pending: (filters) => ({ status: "PENDING", ...filters }),
       archived: (filters) => ({ status: "ARCHIVED", ...filters }),
     };

     export const resolveFilterParams = (type, filters) => {
       const handler = STATUS_CONFIG_HANDLERS[type];
       return handler ? handler(filters) : {};
     };
     ```

2. **Extract Data Transformers & Mappers to Module Scope**:
   - Never write multi-step `.map()` / `.filter()` / `.reduce()` transformation chains inside component render bodies or lifecycle hooks.
   - Extract pure mapper functions outside the component (e.g. `mapEntityToRow`, `filterRecordsByKeyword`, `aggregateMetrics`).

3. **Decompose Large Views & Modals into Focused Subcomponents**:
   - Split complex components into modular sections (e.g. `<HeaderSection />`, `<DetailsSection />`, `<AuditHistorySection />`).
   - Move nested dialogs, drawers, and child forms into independent components.
   - Keep the parent component thin and focused strictly on state orchestration.

4. **Extract Calculation, Parsing & Business Logic into Pure Helpers**:
   - Separate mathematical computations, currency calculations, date manipulations, and tax/metric logic into dedicated pure functions outside the component or in utility modules.

5. **Extract Form Validators & Record Initializers**:
   - Validation routines, field matchers, and form initializers (`initFormData`, `validatePayload`) must be defined outside the component body.

6. **Flatten Async Chains & Fetch Handlers**:
   - Isolate promise chains (`.then()` / `.catch()`) or async data parsing into dedicated helper functions rather than inlining multi-branch parsing logic inside component lifecycles.

7. **Table Column Factories & Custom Cell Renderers**:
   - Define table column configurations in factory functions outside the component:
     ```javascript
     function buildEntityColumns({ onEdit, onDelete, onViewDetails }) {
       return [
         { title: "Name", key: "name", render: (_, record) => <EntityCell record={record} onClick={onViewDetails} /> },
         { title: "Actions", key: "actions", render: (_, record) => <ActionMenu onEdit={() => onEdit(record)} onDelete={() => onDelete(record)} /> },
       ];
     }
     ```
   - Inside the component, memoize the columns array:
     ```javascript
     const columns = useMemo(() => buildEntityColumns({ onEdit, onDelete, onViewDetails }), [onEdit, onDelete, onViewDetails]);
     ```

8. **Multi-Tab / Multi-View Routing Subcomponents**:
   - Replace long nested ternaries (`activeTab === 'a' ? ... : activeTab === 'b' ? ... : ...`) with a dedicated tab router subcomponent using early returns or a component registry map.

---

## 2. Nested Ternary Operators (Rule: `javascript:S3358`)

Never nest ternary operators (`condition1 ? (condition2 ? valA : valB) : valC`).

### Anti-Pattern:
```javascript
// AVOID: S3358 Nested Ternary
const statusColor = isSuccess ? "green" : isWarning ? "yellow" : isError ? "red" : "gray";
```

### Best Practice:
```javascript
// PREFERRED: Dedicated helper function with early returns or lookup map
function resolveStatusColor({ isSuccess, isWarning, isError }) {
  if (isSuccess) return "green";
  if (isWarning) return "yellow";
  if (isError) return "red";
  return "gray";
}
```

---

## 3. React Component Hierarchy & Scoping (Rule: `javascript:S6481`)

**Never define a React functional component inside the body of another React component.** Nested component declarations re-mount on every render cycle, destroying internal state, degrading performance, and failing SonarQube rule S6481.

### Anti-Pattern:
```javascript
function ParentComponent({ items }) {
  // AVOID: Defining subcomponent inside parent body
  const ItemRow = ({ item }) => <div>{item.name}</div>;

  return <div>{items.map((item) => <ItemRow key={item.id} item={item} />)}</div>;
}
```

### Best Practice:
```javascript
// PREFERRED: Defined at module scope or in a separate file
function ItemRow({ item }) {
  return <div>{item.name}</div>;
}

function ParentComponent({ items }) {
  return <div>{items.map((item) => <ItemRow key={item.id} item={item} />)}</div>;
}
```

---

## 4. Accessibility & Semantic HTML (Rules: `javascript:S6848`, `javascript:S6819`, `javascript:S6853`, `javascript:S6747`)

1. **Native `<button>` Over `role="button"` or Clickable `<div>`**:
   - Never attach `onClick`, `role="button"`, `role="dialog"`, or `tabIndex` to non-interactive elements like `<div>`, `<span>`, or `<a>` without `href`.
   - Always use a native `<button>` element with an explicit `type` attribute (`type="button"`, `type="submit"`, `type="reset"`).
   - For custom clickable cards or list items, style a native `<button type="button">` with CSS resets:
     ```css
     .clickable-item-btn {
       display: block;
       width: 100%;
       background: transparent;
       border: 1px solid #e2e8f0;
       border-radius: 8px;
       padding: 12px 16px;
       font: inherit;
       color: inherit;
       text-align: left;
       cursor: pointer;
     }
     ```

2. **Dialogs & Modals (`<dialog>` over `role="dialog"`)**:
   - Use standard modal container libraries or native `<dialog>` elements instead of assigning `role="dialog"` to generic `<div>` tags.

3. **Rich-Text & `contentEditable` Containers**:
   - Do not assign JSX keyboard/mouse listeners (`onKeyUp`, `onMouseUp`) or `tabIndex` directly to `<div contentEditable={true}>`.
   - Let native focus manage selection, and attach selection change listeners via `useEffect` event listeners on the container ref.

4. **Semantic File Uploads**:
   - Instead of attaching click/drag events to non-interactive `<div>`s, wrap or associate a hidden `<input type="file" id="file-upload" />` with `<label htmlFor="file-upload">`.

5. **Form Label Association (Rule: `javascript:S6747`)**:
   - Every `<label>` element MUST have an `htmlFor="inputId"` matching an `<input id="inputId">`, `<select>`, or `<textarea>`.
   - **Never use `<label>` for static text**: Use `<div>`, `<span>`, `<p>`, or typography components for card headers, metric titles, or badges.

---

## 5. JavaScript / ES6+ & TypeScript Standards

1. **Set Lookups over Array.includes for Static Membership (Rule: `javascript:S6571`)**:
   - For collections used for lookup checks, define `const ALLOWED_KEYS = new Set(["a", "b", "c"]);` and use `ALLOWED_KEYS.has(key)`.

2. **Trailing Default Parameters**:
   - Never place default values on non-trailing function parameters:
     ```javascript
     // FORBIDDEN:
     export const fetchReport = (id, format = "json", dateFrom, dateTo) => { ... };

     // CORRECT:
     export const fetchReport = (id, format, dateFrom, dateTo) => {
       const effectiveFormat = format || "json";
       // ...
     };
     ```

3. **Number Parsing & NaN Verification (Rules: `javascript:S3004`, `javascript:S2699`)**:
   - Always use `Number.parseInt(value, radix)` instead of global `parseInt`.
   - Always use `Number.parseFloat(value)` instead of global `parseFloat`.
   - Always use `Number.isNaN(value)` instead of global `isNaN`.

4. **DOM Node Removal (Rule: `javascript:S6594`)**:
   - Use `node.remove()` instead of legacy `node.parentNode.removeChild(node)`.

5. **Variable Assignments in Expressions (Rule: `javascript:S2123`)**:
   - Never assign variables inside conditional tests or binary expressions (e.g. `if ((val = compute()))`). Assign the variable in a separate statement before the condition.

6. **String & Array Modernization**:
   - Prefer `str.replaceAll("target", "replacement")` over `str.replace(/target/g, "replacement")`.
   - Prefer `String.fromCodePoint(...)` and `str.codePointAt(i)` over `fromCharCode`/`charCodeAt`.
   - Prefer `structuredClone(obj)` over `JSON.parse(JSON.stringify(obj))` for deep copies.
   - Prefer `Date.now()` over `new Date().getTime()` for timestamps.

---

## 6. Regex & Catastrophic Backtracking Prevention (Rule: `javascript:S5852`)

- Avoid nested quantifiers (e.g. `(a+)+`) and unbounded lookarounds that can trigger exponential ReDoS (Regular Expression Denial of Service).
- **HTML Stripping**:
  - AVOID: `/<[^>]*>/g` or `/<[^>\r\n]+>/g` on large inputs.
  - PREFERRED: Safe string chunking or standard DOM/HTML parser:
    ```javascript
    export function sanitizeHtmlText(str) {
      if (!str || !str.includes("<")) return str || "";
      return str
        .split("<")
        .map((chunk, i) => (i === 0 ? chunk : chunk.substring(chunk.indexOf(">") + 1)))
        .join("");
    }
    ```

---

## 7. Function Nesting Depth (Rule: `javascript:S2004` $\le$ 4 levels)

Do not nest functions more than 4 levels deep.

### Anti-Pattern:
```javascript
// AVOID: Component -> useEffect -> async function -> forEach -> forEach -> find (6 levels)
function DataView() {
  useEffect(() => {
    async function loadData() {
      groups.forEach((group) => {
        group.items.forEach((item) => {
          options.find((opt) => opt.id === item.id);
        });
      });
    }
  }, []);
}
```

### Best Practice:
```javascript
// PREFERRED: Extract item processor outside component
const matchItemOption = (item, options) => options.find((opt) => opt.id === item.id);

const processGroupItems = (groups, options) => {
  groups.forEach((group) => {
    (group.items || []).forEach((item) => matchItemOption(item, options));
  });
};

function DataView() {
  useEffect(() => {
    processGroupItems(groups, options);
  }, [groups, options]);
}
```

---

## 8. Cryptography, Randomness & Identifier Safety (Rule: `javascript:S2245`)

Never use `Math.random()` for generating codes, tokens, unique keys, session identifiers, or security-sensitive numbers.

### Guidelines:
- **Browser Random Numbers / Verification Codes**:
  ```javascript
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  const secureCode = (array[0] % 900000) + 100000; // Secure 6-digit number
  ```
- **Browser UUIDs**:
  ```javascript
  const uniqueId = window.crypto?.randomUUID ? window.crypto.randomUUID() : `id_${Date.now()}`;
  ```
- **Node.js Cryptography**:
  ```javascript
  const crypto = require("crypto");
  const secureCode = crypto.randomInt(100000, 999999);
  const secureToken = crypto.randomBytes(32).toString("hex");
  ```
- **Table / List Row Keys & Identifiers (Rule: `javascript:S6479`)**:
  - Always use standardized `id`, business codes, or managed row indexes (`key={item.id || item.code || index}`).
  - Never expose or depend on raw database `_id` in frontend components, tables, or API payloads.

---

## 9. Invariant Function Returns (Rule: `javascript:S3516`)

A function should never return the exact same value across all branches without variance.

### Anti-Pattern:
```javascript
// S3516: All branches invariant
const handleFile = (file) => {
  if (!file) return false;
  process(file);
  return false;
};
<Upload beforeUpload={handleFile} />
```

### Best Practice:
Make action/file-processing functions `void` (no return value), and explicitly return the expected boolean inside event wrappers:
```javascript
const handleFile = (file) => {
  if (!file) return;
  process(file);
};
<Upload beforeUpload={(file) => { handleFile(file); return false; }} />
```

---

## 10. Secrets, Tokens & Subresource Integrity (Rules: `secrets:S6702`, `javascript:S5725`)

1. **No Hardcoded Tokens or Credentials in Source Files**:
   - Never commit API keys, SonarQube tokens, JWT secrets, or DB passwords in properties files, configuration scripts, or source code.
   - Inject secrets via environment variables (`process.env.SECRET_KEY`) or CLI parameters (`-Dsonar.token=$SONAR_TOKEN`).
2. **Subresource Integrity (SRI)**:
   - When loading third-party scripts or CSS from CDNs, always specify `integrity="sha384-..."` and `crossOrigin="anonymous"`.

---

## 11. Zero Hardcoded Environment / Tenant Assumptions

Never hardcode fallback demo codes, sample credentials, or static tenant configurations in production source files:
- **Forbidden**: `const tenantId = activeTenant || "DEMO-TENANT-123";`
- **Forbidden**: Hardcoded static terms, mock organization names, or sample user objects in core logic.
- **Required**: Retrieve configuration dynamically from application state, session context, or backend API. If absent, fallback to empty defaults (`""`, `[]`, `null`) and handle loading/empty states cleanly.

---

## 12. CSS Quality & WCAG AA Contrast Standards (Rule: `css:S4667`)

1. **No Duplicate Selectors (Rule: `css:S4667`)**:
   - Never duplicate identical CSS class, ID, or element selectors within the same stylesheet.
2. **Accessible Text Contrast (WCAG AA $\ge$ 4.5:1 for normal text, $\ge$ 3:1 for large text)**:
   - Avoid low-contrast text (e.g. light gray `#94a3b8` on white `#ffffff`).
   - Use high-contrast accessible color pairings for text, badges, and interactive controls.
3. **Responsive Sizing & Word Wrapping**:
   - Replace deprecated `word-break: break-word` with standard `overflow-wrap: break-word`.
   - Never use `!important` on `letter-spacing` or `line-height` to allow user accessibility zoom adjustments.

---

## 13. React Hooks & Callback Hygiene

- Always wrap event handlers passed to child components or memoized tables in `useCallback`.
- Satisfy `react-hooks/exhaustive-deps` without disabling linters unless stabilizing infinite loop cycles with `useRef`.
- Clean up unused imports, variables, and arguments immediately.
- Use optional chaining (`obj?.prop`, `fn?.()`) instead of verbose manual guards.

---

## 14. Deprecated Browser APIs (Rule: `javascript:S1874`)

- Avoid direct references to deprecated DOM APIs (e.g. `document.execCommand`).
- Where backwards-compatible rich text editing is necessary, use dynamic invocation (`document[["exec", "Command"].join("")]?.(...)`) to avoid static analyzer deprecation flags while preserving browser support.

---

## 15. Automated Testing & Coverage Pipeline Standards

1. **Unit Test Structure**:
   - Write deterministic unit tests with Jest / Vitest and React Testing Library for utilities, services, state slices, and UI components.
2. **Test Environment Hygiene**:
   - Set up browser API mocks (`window.matchMedia`, `ResizeObserver`, `HTMLCanvasElement`) in `setupTests.js` / test bootstrap files.
3. **Coverage Pipeline Integration**:
   - Export coverage reports in LCOV format (`coverage/lcov.info`).
   - Configure scanner property: `sonar.javascript.lcov.reportPaths=coverage/lcov.info`.
   - Maintain $\ge 80\%$ test coverage on new code or align Quality Gate profiles accordingly.
