---
name: react-antd-ui
description: Build the React application's UI using Ant Design (AntD) as the primary UI component library.
triggers:
  - building UI
  - using antd
  - creating react components
---

# React Ant Design UI Skill

## Objective

Build the React application's UI using **Ant Design (AntD)** as the primary UI component library.

Ant Design must be used for standard UI elements instead of manually recreating common components with HTML/CSS.

---

## Ant Design Requirement

Use Ant Design components whenever an equivalent Ant Design component exists.

Examples:

- Button → `Button`
- Input → `Input`
- Select → `Select`
- Checkbox → `Checkbox`
- Radio → `Radio`
- Switch → `Switch`
- Date input → `DatePicker`
- Forms → `Form`
- Tables → `Table`
- Modal → `Modal`
- Drawer → `Drawer`
- Dropdown → `Dropdown`
- Tabs → `Tabs`
- Pagination → `Pagination`
- Cards → `Card`
- Tags → `Tag`
- Badge → `Badge`
- Notifications → `notification`
- Messages → `message`
- Loading → `Spin`
- Tooltips → `Tooltip`
- Breadcrumbs → `Breadcrumb`
- Layout → `Layout`
- Menu → `Menu`
- Avatar → `Avatar`
- Upload → `Upload`

---

## Installation

If Ant Design is not already installed, use:

```bash
npm install antd
```

## Layout System — Flex, Grid, Row, Col and Gutter

Use Ant Design's layout components before writing custom CSS for layout.

### Flex

Use Ant Design `Flex` for one-dimensional layouts:

- Horizontal alignment
- Vertical alignment
- Button groups
- Header actions
- Small component groups
- Spacing between elements

Example:

```jsx
import { Flex, Button } from 'antd';

<Flex gap="middle" align="center" justify="space-between">
  <h2>Users</h2>

  <Button type="primary">
    Add User
  </Button>
</Flex>
```
