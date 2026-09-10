---
name: react-project-architecture
description: Enforces the React project architecture strictly, using .js files for components, Redux Toolkit for centralized state management, clean custom/built-in hooks, and Ant Design as the UI library.
triggers:
  - creating react components
  - organizing react project files
  - scaffolding project directories
  - refactoring react architecture
  - setting up redux or state management
  - writing custom hooks or useEffect/useCallback/useMemo logic
---

# React Project Architecture, Redux Toolkit & Clean Hooks Skill

## Objective

Follow the existing React project architecture strictly:
1. **File Extension**: The project uses `.js` files for React components, pages, hooks, services, and Redux slices. Do NOT rename `.js` React files to `.jsx`.
2. **Component Flow**: Application flows cleanly from `index.js` → `App.js` → `Pages` → `Components`.
3. **UI System**: Use Ant Design (AntD) as the primary UI component library.
4. **State Management**: Use Redux Toolkit (`@reduxjs/toolkit` and `react-redux`) for global state management with well-structured slices and async thunks.
5. **Hooks & Side-Effects**: Use React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`, custom hooks) following clean, proper patterns with explicit dependencies and cleanup functions.

---

# Project Structure

The required project directory structure:

```text
src/
├── admin/
│   ├── AdminDashboard.js
│   ├── AdminUsers.js
│   └── components/
│       └── UserTable.js
│
├── user/
│   ├── UserDashboard.js
│   ├── Profile.js
│   └── components/
│
├── general/
│   ├── Login.js
│   ├── NotFound.js
│   └── components/
│       ├── Header.js
│       └── Sidebar.js
│
├── hooks/
│   ├── useAuthSession.js
│   ├── useKeyboardShortcuts.js
│   └── use[FeatureName].js
│
├── redux/
│   ├── slices/
│   │   ├── sessionSlice.js
│   │   ├── authSlice.js
│   │   └── [feature]Slice.js
│   └── store.js
│
├── services/
│   └── apiClient.js
│
├── utils/
│   ├── cookieUtils.js
│   └── formatters.js
│
├── App.js
├── App.css
├── index.css
├── index.js
└── reportWebVitals.js
```

---

# File Naming & Conventions

- **React Components / Pages**: PascalCase with `.js` extension (e.g., `AdminDashboard.js`, `UserTable.js`, `Header.js`, `Login.js`).
- **Custom Hooks**: camelCase starting with `use` with `.js` extension (e.g., `useAuthSession.js`, `useKeyboardShortcuts.js`).
- **Redux Slices**: camelCase ending in `Slice.js` (e.g., `sessionSlice.js`, `userSlice.js`).
- **Utilities & Services**: camelCase with `.js` extension (e.g., `apiClient.js`, `cookieUtils.js`).
- **Do NOT create `.jsx` files**: Keep all React files as `.js`.

---

# Redux Toolkit (RTK) Standards

### 1. Store Configuration (`src/redux/store.js`)
- Use `configureStore` from `@reduxjs/toolkit`.
- Combine domain slices cleanly.

```javascript
import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./slices/sessionSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    user: userReducer,
  },
});

export default store;
```

### 2. Root Provider Integration (`index.js` or `App.js`)
Wrap the application root with `<Provider store={store}>` from `react-redux`.

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

### 3. Slice Architecture (`src/redux/slices/[name]Slice.js`)
- **Initial State**: Clearly define state shape with `loading` and `error` states.
- **Reducers**: Synchronous state mutations using Immer-powered RTK reducers.
- **Async Thunks**: Use `createAsyncThunk` for asynchronous operations, server requests, and side effects. Always handle `.pending`, `.fulfilled`, and `.rejected` states in `extraReducers`.

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}`);
      if (response?.success) {
        return response.data;
      }
      return rejectWithValue(response?.message || "Failed to fetch user");
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
    setLocalProfileUpdate: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserProfile, setLocalProfileUpdate } = userSlice.actions;
export default userSlice.reducer;
```

### 4. Selector & Dispatch Hygiene in Components
- **Granular Selectors**: Extract only the specific state properties needed by the component to prevent unnecessary re-renders:
  ```javascript
  // PREFERRED: Select only what is needed
  const profile = useSelector((state) => state.user.profile);
  const isLoading = useSelector((state) => state.user.loading);
  
  // AVOID: Selecting the entire root state
  const state = useSelector((state) => state);
  ```
- **Clean Dispatching**: Use `useDispatch` to trigger actions and async thunks:
  ```javascript
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserData(userId));
    }
  }, [dispatch, userId]);
  ```

---

# React Hooks Best Practices

### 1. Custom Hooks in `src/hooks/`
Extract reusable logic, subscriptions, keyboard listeners, event handlers, and data orchestration into custom hooks.
- Prefix with `use` (e.g., `useAuthSession.js`, `useKeyboardShortcuts.js`).
- Return clean, predictable data structures (objects or tuples).

```javascript
// src/hooks/useAuthSession.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkSession } from "../redux/slices/sessionSlice";

export const useAuthSession = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.session);

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  return { isAuthenticated, user, loading };
};
```

### 2. `useEffect` Hygiene & Cleanup
- **Always provide a complete dependency array**: Never omit dependencies used inside the effect.
- **Always clean up subscriptions, timers, and listeners**: Return a cleanup function when setting up `setInterval`, `setTimeout`, event listeners, or abort controllers.

```javascript
// Proper listener and cleanup
useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [onClose]);
```

### 3. `useCallback` & `useMemo` Optimization
- Wrap event handlers and callback functions passed down to child components or memoized tables in `useCallback`.
- Wrap computationally expensive calculations or derived transformed arrays in `useMemo`.

```javascript
// Event handler memoization
const handleDeleteUser = useCallback((userId) => {
  dispatch(deleteUser(userId));
}, [dispatch]);

// Derived data memoization
const activeUsers = useMemo(() => {
  return users.filter((u) => u.status === "ACTIVE");
}, [users]);
```

### 4. `useRef` for Mutable Values without Re-renders
- Use `useRef` for storing DOM references, timer IDs, or previous values that do not require re-rendering when modified.

```javascript
const timerRef = useRef(null);

const startTimer = useCallback(() => {
  if (timerRef.current) clearInterval(timerRef.current);
  timerRef.current = setInterval(() => {
    // timer work
  }, 1000);
}, []);

useEffect(() => {
  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, []);
```

---

# Authentication & API Client Token Architecture

### 1. Token Storage Exclusively in Cookies
- Store the authentication token (`authToken`) **ONLY in cookies** using `src/utils/cookieUtils.js`.
- **FORBIDDEN**: Never store JWTs or session tokens in `localStorage` or `sessionStorage`.

### 2. API Client Bearer Token Interceptor (`src/services/apiClient.js`)
- Every HTTP request dispatched through `apiClient` must automatically read the token from cookies and inject the `Authorization: Bearer <token>` header:

```javascript
// src/services/apiClient.js
import axios from "axios";
import { getCookie } from "../utils/cookieUtils";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getCookie("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

---

# Application Flow Summary

1. `index.js`: Wraps `<App />` with `<Provider store={store}>` and mounts to DOM.
2. `App.js`: Configures top-level routing, layouts, and global authentication checks.
3. `Pages` (`src/admin/`, `src/user/`, `src/general/`): Connects Redux state, invokes custom hooks, and coordinates subcomponents.
4. `Components`: Modular, reusable Ant Design components receiving explicit props and callbacks.
