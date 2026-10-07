---
name: react-antd-ui
description: Build the React application's UI with Ant Design (AntD) as the primary component library, using a restrained, professional, human-designed look (not a generic AI-generated style). Use when building UI, using antd, creating React components, pages, forms, tables, or layouts.
triggers:
  - building UI
  - using antd
  - creating react components
  - designing pages, forms, tables, dashboards or layouts
---

# React Ant Design UI Skill

## Objective

Build the React application's UI with **Ant Design (AntD)** as the primary component library, and make it look like it was designed by a professional product designer at an established company: calm, consistent, readable, and purposeful.

Use AntD for standard UI elements instead of recreating common components with raw HTML/CSS. Visual decisions (color, spacing, radius, typography) come from one theme, never from per-component styling.

---

## 1. Ant Design Requirement

Use an Ant Design component whenever an equivalent exists.

| Need | AntD component |
|---|---|
| Button | `Button` |
| Text input | `Input`, `Input.Password`, `Input.TextArea`, `InputNumber` |
| Select | `Select` |
| Checkbox / Radio / Switch | `Checkbox`, `Radio`, `Switch` |
| Date and time | `DatePicker`, `TimePicker` |
| Forms and validation | `Form`, `Form.Item` |
| Data tables | `Table` |
| Dialogs | `Modal`, `Drawer`, `Popconfirm` |
| Menus | `Dropdown`, `Menu` |
| Navigation | `Tabs`, `Breadcrumb`, `Pagination`, `Layout` |
| Content containers | `Card`, `Descriptions`, `List`, `Collapse` |
| Status | `Tag`, `Badge`, `Alert`, `Result`, `Empty`, `Skeleton`, `Spin` |
| Feedback | `message`, `notification`, `Tooltip` |
| People and files | `Avatar`, `Upload` |

Installation (only if missing):

```bash
npm install antd @ant-design/icons
```

Rules:
- Do not rebuild a component that AntD already provides.
- Do not mix in a second UI library for the same job.
- Wrap custom components around AntD ones only when the project needs a reusable variant (see `centralized-ui-system`).

---

## 2. Design Direction: Human, Professional, Industry Standard

The UI must look like a real product built by a human design team, not like auto-generated output.

### Color

- Use **one primary color** plus neutrals. Status colors (success, warning, error, info) are used only for status meaning.
- Define the primary color once in the AntD theme (`ConfigProvider` token `colorPrimary`). Never hardcode hex values inside components.
- Pick a restrained, business-appropriate primary (for example deep blue, teal, slate, or the client's brand color). Keep it consistent across the whole app.
- Backgrounds are neutral: white surfaces on a light grey page background (or the dark equivalent). Text uses AntD's text tokens for proper contrast (WCAG AA minimum).
- Do NOT use:
  - Purple-to-blue or pink-to-orange gradients
  - Rainbow or multi-color accents on one screen
  - Neon, glowing, or glassmorphism effects
  - Gradient text, gradient buttons, or decorative blobs
  - Colored shadows or heavy drop shadows
  - Emoji as UI elements

### Icons

- Use icons from `@ant-design/icons` only, with one style family (Outlined) across the whole app.
- An icon must have a function: an action (edit, delete, download), a status, or navigation. No decorative icons beside every heading, card, or label.
- Do not put an icon on every button. Primary text actions stay text-only; use icon-only buttons only for common actions with a `Tooltip` and `aria-label`.
- Keep icon size and color consistent: inherit text color, standard size per context.
- Never use emoji, illustrated sparkles, robot, magic-wand, or "AI" style icons as decoration.

### Typography

- One font family for the whole app (system stack or the brand font), set in the theme token `fontFamily`.
- Use AntD `Typography` (`Title`, `Text`, `Paragraph`) with a clear hierarchy: page title, section title, body, caption. Avoid more than three or four sizes on one screen.
- Sentence case for labels and buttons ("Add user", not "ADD USER" or "Add User Now!").

### Copy

- Write plain, specific, professional text. "Save changes", "No users found", "Could not load orders. Try again."
- No hype, filler, or exclamation marks. No placeholder text such as "Lorem ipsum" or "Welcome to the future of...".
- Messages come from one catalog (see `single-source-of-truth`).

### Shape, spacing, and density

- Use the AntD spacing scale (multiples of 4/8 px). Keep consistent gaps and page padding.
- Use one border-radius token for the whole app (`borderRadius`, typically 6 to 8 px). Do not mix sharp and pill shapes.
- Prefer subtle borders and AntD's default light shadows over heavy elevation.
- Content-first layouts with generous whitespace; avoid dense, cluttered screens and avoid giant hero-style decoration in business apps.
- Cards are for grouping related content. Do not wrap everything in a card or nest cards inside cards.

### Motion

- Use AntD's built-in transitions only. No bouncing, parallax, or looping decorative animation.

---

## 3. Theming (single place for all visual decisions)

All look-and-feel is configured once at the app root with `ConfigProvider`. Components never override these values locally.

```jsx
import { ConfigProvider } from 'antd';
import { appTheme } from './theme/appTheme';

<ConfigProvider theme={appTheme}>
  <App />
</ConfigProvider>
```

```js
// theme/appTheme.js
export const appTheme = {
  token: {
    colorPrimary: '#1F4E79',   // one brand color, defined only here
    borderRadius: 6,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    colorBgLayout: '#F5F7FA',
  },
  components: {
    Button: { controlHeight: 36, fontWeight: 500 },
    Table: { headerBg: '#FAFAFA' },
  },
};
```

Rules:
- Change appearance through theme tokens, not CSS overrides on `.ant-*` classes.
- Avoid `!important` and deep selectors into AntD internals.
- Support light and dark through `theme.algorithm` if the app needs it, not through duplicated styles.
- Inline `style={{ color: '#xxxxxx' }}` for brand colors is not allowed; use tokens (`theme.useToken()`) when a value is needed in code.

---

## 4. Layout System: Flex, Grid, Row, Col, Gutter

Use AntD layout components before writing custom CSS for layout.

### Flex (one-dimensional layouts)

Use for horizontal or vertical alignment, button groups, header actions, small groups, and spacing between elements.

```jsx
import { Flex, Button, Typography } from 'antd';

<Flex gap="middle" align="center" justify="space-between">
  <Typography.Title level={4} style={{ margin: 0 }}>
    Users
  </Typography.Title>
  <Button type="primary">Add user</Button>
</Flex>
```

### Row, Col and Gutter (grid layouts)

Use the 24-column grid for page sections, dashboards, and form layouts. Always set `gutter` for spacing and responsive spans for breakpoints.

```jsx
import { Row, Col, Card } from 'antd';

<Row gutter={[16, 16]}>
  <Col xs={24} md={12} xl={8}>
    <Card title="Open orders">...</Card>
  </Col>
  <Col xs={24} md={12} xl={8}>
    <Card title="Revenue">...</Card>
  </Col>
</Row>
```

### Space

Use `Space` for simple inline groups with equal gaps (tags, small action rows).

### Layout rules
- Use `Layout` (`Sider`, `Header`, `Content`) for the app shell.
- Use `gutter={[16, 16]}` (horizontal, vertical) for consistent grid spacing.
- Use responsive props (`xs`, `sm`, `md`, `lg`, `xl`) so every page works on mobile, tablet, and desktop.
- Avoid fixed pixel widths and hand-written flex/grid CSS when `Flex`, `Row`, `Col`, or `Space` can do the job.

---

## 5. Component Patterns

### Forms
- Use `Form` with `Form.Item`, `layout="vertical"` by default, and validation rules from the shared schemas (see `single-source-of-truth`).
- Labels above inputs, helper or error text below. Required fields marked by AntD's default indicator.
- One primary action per form, right-aligned or at the end; secondary action as default or text button.
- Disable or show `loading` on the submit button while submitting.

### Tables
- Use `Table` with fixed `rowKey`, server-side pagination for large data, and sensible column widths.
- Right-align numbers, left-align text, format dates and currency consistently.
- Row actions: a small set of text links or an overflow `Dropdown`, not a wall of colored buttons.

### Modals, Drawers, confirmations
- `Modal` for short focused tasks, `Drawer` for longer forms or detail views.
- Destructive actions require `Popconfirm` or a confirm `Modal` with explicit wording ("Delete user").

### Buttons
- One `type="primary"` button per view area. Use `default`, `text`, or `link` for the rest.
- `danger` only for destructive actions.

### Status
- Use `Tag` and `Badge` with semantic colors only for real status (Active, Pending, Failed). Keep the label text in the tag.

---

## 6. States Every Screen Must Handle

- **Loading:** `Skeleton` for page/list content, `Spin` for small areas, `loading` prop on buttons and tables.
- **Empty:** `Empty` with a short, specific message and, when useful, one clear action.
- **Error:** `Alert` or `Result` with a plain explanation and a retry action.
- **Success feedback:** `message.success` for lightweight confirmation, `notification` only for important or long messages.

---

## 7. Accessibility and Responsiveness

- Sufficient color contrast; never rely on color alone to convey status.
- All icon-only buttons have `aria-label` and a `Tooltip`.
- Keyboard navigable forms, modals, menus, and tables (use AntD defaults; do not break focus styles).
- Test layouts at mobile, tablet, and desktop widths.

---

## 8. Anti-Patterns (fix on sight)

- Hardcoded hex colors, font sizes, or radii inside components.
- Gradient backgrounds, gradient buttons, glow effects, glassmorphism.
- Emoji or decorative icons in headings, buttons, cards, or empty states.
- Multiple accent colors competing on one screen.
- Overriding `.ant-*` classes or using `!important` to restyle components.
- Recreating Button, Modal, Select, Table, or Form with raw `div`/`input` markup.
- Everything wrapped in nested cards with heavy shadows.
- ALL CAPS buttons, exclamation-heavy copy, or placeholder text.
- Custom flex/grid CSS where `Flex`, `Row`/`Col`, or `Space` would work.

---

## 9. Review Checklist

- [ ] Every standard element uses an Ant Design component.
- [ ] Colors, radius, and fonts come from the `ConfigProvider` theme tokens only.
- [ ] One primary color; neutral backgrounds; no gradients or decorative effects.
- [ ] Icons are from `@ant-design/icons` (Outlined), functional, and consistent; no emoji.
- [ ] Layout uses `Flex`, `Row`/`Col` with `gutter`, `Space`, and responsive breakpoints.
- [ ] Forms, tables, and modals follow the patterns above.
- [ ] Loading, empty, and error states are handled.
- [ ] Copy is plain, specific, and sentence case.
- [ ] Accessible (contrast, labels, keyboard) and responsive.

## Works Together With
`centralized-ui-system` (shared wrapper components), `flutter-ui-theming` (keep brand tokens aligned across web and mobile), `single-source-of-truth` (tokens, messages, validation rules defined once), `react-project-architecture` and `react-folder-structure-enforcer` (where UI files live).