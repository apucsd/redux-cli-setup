#!/usr/bin/env node
const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const program = new Command();

program
  .description(
    "Generate Redux folder structure, files, and install necessary packages"
  )
  .action(() => {
    try {
      // Install necessary packages
      console.log("Installing necessary packages...");
      execSync("npm install @reduxjs/toolkit react-redux redux-persist", {
        stdio: "inherit",
      });
      console.log("Packages installed successfully.");

      const reduxPath = path.join(process.cwd(), "src", "redux");

      if (!fs.existsSync(reduxPath)) {
        fs.mkdirSync(reduxPath, { recursive: true });
        console.log("Created 'redux' folder in 'src'");
      }

      const foldersAndFiles = [
        { folder: "base", files: ["baseApi.ts", "baseReducer.ts"] },
        { folder: "features/auth", files: ["authSlice.ts", "authApi.ts"] },
        { folder: "lib", files: ["ReduxProvider.tsx"] },
      ];

      foldersAndFiles.forEach((folderObj) => {
        const folderPath = path.join(reduxPath, folderObj.folder);

        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
          console.log(`Created folder: ${folderPath}`);
        }

        folderObj.files.forEach((file) => {
          const filePath = path.join(folderPath, file);
          let content = "";

          switch (file) {
            case "baseApi.ts":
              content = `import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  DefinitionType,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, setUser } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("Authorization", \`Bearer \${token}\`);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log("Sending refresh token");

    const res = await fetch("http://localhost:5000/api/v1/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;
      api.dispatch(setUser({ user, token: data.data.accessToken }));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      console.log("Session expired. Please log in again.");
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["Auth"],
  endpoints: () => ({}),
});`;
              break;

            case "baseReducer.ts":
              content = `import { baseApi } from "./baseApi";
import authReducer from "../features/auth/authSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistAuthConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer);

export const baseReducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  auth: persistedAuthReducer,
};`;
              break;

            case "authSlice.ts":
              content = `import { createSlice } from "@reduxjs/toolkit";

type TUser = {
  id: string;
  email: string;
  role: "ADMIN" | "USER" | "PROVIDER";
  iat: number;
  exp: number;
};

type TInitialState = {
  user: null | TUser;
  token: null | string;
};

const initialState: TInitialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;`;
              break;

            case "authApi.ts":
              content = `import { baseApi } from "../../base/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: build.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),
    forgetPassword: build.mutation({
      query: (data) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: build.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: \`Bearer \${localStorage.getItem("oneTimeToken")}\`,
        },
      }),
    }),
    changePassword: build.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useChangePasswordMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
} = authApi;`;
              break;

            case "ReduxProvider.tsx":
              content = `import { persistor, store } from "../store";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const ReduxProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
};

export default ReduxProvider;`;
              break;
          }

          fs.writeFileSync(filePath, content.trim());
          console.log(`File created: ${filePath}`);
        });
      });

      const directFiles = [
        {
          name: "store.ts",
          content: `import { configureStore } from "@reduxjs/toolkit";
import { baseReducer } from "./base/baseReducer";
import { baseApi } from "./base/baseApi";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from "redux-persist";

export const store = configureStore({
  reducer: baseReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`,
        },
        {
          name: "hooks.ts",
          content: `import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();`,
        },
      ];

      directFiles.forEach((file) => {
        const filePath = path.join(reduxPath, file.name);
        fs.writeFileSync(filePath, file.content.trim());
        console.log(`File created: ${filePath}`);
      });

      console.log("Redux setup complete with all dependencies installed.");
    } catch (error) {
      console.error("Error setting up Redux:", error.message);
    }
  });

program.parse(process.argv);
