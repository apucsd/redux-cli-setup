# Redux Setup CLI 🚀

A powerful CLI tool to instantly scaffold a production-ready Redux setup with Redux Toolkit, React-Redux, and Redux Persist integration.

![Redux Setup Banner](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000&h=400)

> **Important Note**: Currently, this CLI tool is optimized for Next.js projects with `@` absolute imports configured. Support for other project structures will be added in future releases.

## Features ✨

- 🛠️ Complete Redux folder structure generation
- 🔐 Built-in authentication slice and API setup
- 📦 Redux Persist integration
- 🎯 TypeScript support
- 🔄 RTK Query setup with base API configuration
- 🎨 Organized feature-based architecture

## Installation 📥

```bash
npm install -g redux-cli-setup
```

Or use directly with npx:

```bash
npx redux-cli-setup setup-redux
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

## File Overview 📝

### 1. Base Configuration

#### `baseApi.ts`

- RTK Query base configuration
- Centralized API setup with authentication headers
- Base URL configuration
- Tag types definition

```typescript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// ... (see generated file for full implementation)
```

#### `baseReducer.ts`

- Combined reducer setup
- Redux Persist configuration
- Authentication persistence setup

### 2. Authentication Feature

#### `authSlice.ts`

- User authentication state management
- Login/logout actions
- TypeScript interfaces for user data

#### `authApi.ts`

- Authentication-related API endpoints
- Login, registration, password management
- Email verification endpoints

### 3. Store Configuration

#### `store.ts`

- Redux store configuration
- Middleware setup
- Redux Persist store enhancement
- TypeScript types for store and dispatch

```typescript
import { configureStore } from "@reduxjs/toolkit";
// ... (see generated file for full implementation)
```

#### `hooks.ts`

- Typed hooks for Redux usage
- `useAppDispatch` and `useAppSelector` utilities

### 4. Provider Setup

#### `ReduxProvider.tsx`

- Redux Provider configuration
- Redux Persist gate integration
- Client-side wrapper component

## Usage 💻

1. Install the package:

```bash
npm install redux-setup-cli
```

2. Run the setup command:

```bash
npx setup-redux
```

3. Import the provider in your app's root:

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

4. Use Redux in your components:

```typescript
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { useLoginUserMutation } from "@/redux/features/auth/authApi";

function LoginComponent() {
  const dispatch = useAppDispatch();
  const [loginUser] = useLoginUserMutation();

  // Use Redux functionality
}
```

## Authentication API Endpoints 🔑

The generated setup includes the following authentication endpoints:

- `loginUser` - User login
- `verifyEmail` - Email verification
- `forgetPassword` - Password recovery initiation
- `resetPassword` - Password reset
- `changePassword` - Password change for authenticated users

## Best Practices 🎯

1. **State Management**

   - Use RTK Query for API calls
   - Implement proper error handling
   - Utilize TypeScript for type safety

2. **Authentication**

   - Store tokens securely
   - Implement proper logout cleanup
   - Handle token expiration

3. **Performance**
   - Use selective state updates
   - Implement proper caching strategies
   - Optimize re-renders with proper selector usage

## Contributing 🤝

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License 📄

MIT © [Apu Sutra Dhar]

## Support 💪

- GitHub Issues: [Report Issues](https://github.com/apucsd/redux-setup-cli/issues)
- Documentation: [Full Documentation](https://www.npmjs.com/package/redux-setup-cli)

---

Made with ❤️ by Apu Sutra Dhar
