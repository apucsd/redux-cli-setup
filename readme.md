# Redux Setup CLI 🚀

A powerful CLI tool to instantly scaffold a production-ready Redux setup with Redux Toolkit, React-Redux, and Redux Persist integration.

## Features ✨

- 🛠️ Complete Redux folder structure generation
- 🔐 Built-in authentication slice and API setup
- 📦 Redux Persist integration
- 🎯 TypeScript support
- 🔄 RTK Query setup with base API configuration
- 🎨 Organized feature-based architecture

## Prerequisites 📋

- @reduxjs/toolkit
- react-redux
- redux-persist

## Installation 📥

```bash
npm install -g redux-cli-setup
```

Or use directly with npx:

```bash
npx redux-cli-setup
```

### These must be installed in your project after running the CLI. If not, use:

```bash
npm install @reduxjs/toolkit react-redux redux-persist
```

## Generated Structure 📁

```
src/
└── redux/
    ├── base/
    │   ├── baseApi.ts
    │   └── baseReducer.ts
    ├── features/
    │   └── auth/
    │       ├── authSlice.ts
    │       └── authApi.ts
    ├── lib/
    │   └── ReduxProvider.tsx
    ├── store.ts
    └── hooks.ts
```

## File Breakdown 📝

### 1. Base Configuration

#### `baseApi.ts`

- Centralized API configuration
- Token refresh mechanism
- Authentication header setup
- Base URL configuration

#### `baseReducer.ts`

- Combines reducers
- Configures Redux Persist
- Handles authentication state persistence

### 2. Authentication Feature

#### `authSlice.ts`

- Manages authentication state
- Provides `setUser` and `logout` actions
- Defines user type with role-based access

#### `authApi.ts`

- Authentication-related RTK Query endpoints
- Supports:
  - User login
  - Email verification
  - Password management
  - Token handling

### 3. Store Configuration

#### `store.ts`

- Configures Redux store
- Sets up middleware
- Integrates Redux Persist
- Defines TypeScript types for store

#### `hooks.ts`

- Provides typed Redux hooks
- `useAppDispatch` and `useAppSelector`

### 4. Redux Provider

#### `ReduxProvider.tsx`

- Wraps application with Redux Provider
- Implements Redux Persist Gate

## Usage Example 💻

1. Generate Redux structure:

```bash
npx redux-cli-setup
```

2. Wrap your app with `ReduxProvider`:

```typescript
import ReduxProvider from "@/redux/lib/ReduxProvider";

function App() {
  return (
    <ReduxProvider>
      <YourApp />
    </ReduxProvider>
  );
}
```

3. Use in components:

```typescript
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLoginUserMutation } from "@/redux/features/auth/authApi";

function LoginComponent() {
  const dispatch = useAppDispatch();
  const [loginUser] = useLoginUserMutation();
  // Authentication logic
}
```

## Authentication Endpoints 🔐

- `loginUser`: User authentication
- `verifyEmail`: Email verification
- `forgetPassword`: Initiate password recovery
- `resetPassword`: Complete password reset
- `changePassword`: Update password

## Best Practices 🌟

1. **State Management**

   - Use RTK Query for API calls
   - Implement comprehensive error handling
   - Leverage TypeScript for type safety

2. **Authentication**

   - Secure token storage
   - Implement clean logout
   - Handle token expiration gracefully

3. **Performance Optimization**
   - Minimize state updates
   - Implement efficient caching
   - Optimize component re-renders

## Contributing 🤝

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License 📄

MIT © [Apu Sutra Dhar]

## Support 💬

- Issues: [GitHub Issues](https://github.com/apucsd/redux-cli-setup/issues)
- Docs: [NPM Package](https://www.npmjs.com/package/redux-cli-setup)

---

Made with ❤️ by Apu Sutra Dhar
