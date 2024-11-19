#!/usr/bin/env node
const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

const program = new Command();

// Define the "setup-redux" command
program
  .command("setup-redux")
  .description("Generate Redux folder structure and files")
  .action(() => {
    const reduxPath = path.join(process.cwd(), "src", "redux");

    // Ensure the redux folder exists
    if (!fs.existsSync(reduxPath)) {
      fs.mkdirSync(reduxPath, { recursive: true });
      console.log("Created 'redux' folder in 'src'");
    }

    // Define the folder structure and files to create
    const foldersAndFiles = [
      { folder: "base", files: ["baseApi.ts", "baseReducer.ts"] },
      { folder: "features/auth", files: ["authSlice.ts", "authApi.ts"] },
      { folder: "lib", files: ["ReduxProvider.tsx"] },
    ];

    // Loop through each folder and create them along with files
    foldersAndFiles.forEach((folderObj) => {
      const folderPath = path.join(reduxPath, folderObj.folder);

      // Create the folder if it doesn't exist
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Created folder: ${folderPath}`);
      }

      // Loop through the files and create them in the respective folder
      folderObj.files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        // Write file content based on its name
        let content = "";
        switch (file) {
          case "baseApi.ts":
            content = `
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/redux/store";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    credentials: "include",
    prepareHeaders: (header, { getState }) => {
      const { token } = (getState() as RootState).auth;
      if (token) {
        header.set("Authorization", \`Bearer \${token}\`);
      }
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["Auth"],
});

export const imageUrl = "http://localhost:5000";
            `;
            break;
          case "baseReducer.ts":
            content = `
import { baseApi } from "@/redux/base/baseApi";
import authReducer from "@/redux/features/auth/authSlice";

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
};
            `;
            break;
          case "authSlice.ts":
            content = `
import { createSlice } from "@reduxjs/toolkit";

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
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
            `;
            break;
          case "authApi.ts":
            content = `
import { baseApi } from "@/redux/base/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation({
      query: (data) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: data,
        };
      },
    }),
    verifyEmail: build.mutation({
      query: (data) => {
        return {
          url: "/auth/verify-email",
          method: "POST",
          body: data,
        };
      },
    }),
    forgetPassword: build.mutation({
      query: (data) => {
        return {
          url: "/auth/forget-password",
          method: "POST",
          body: data,
        };
      },
    }),
    resetPassword: build.mutation({
      query: (data) => {
        return {
          url: "/auth/reset-password",
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "application/json",
            Authorization: \`Bearer \${localStorage.getItem("oneTimeToken")}\`,
          },
        };
      },
    }),
    changePassword: build.mutation({
      query: (data) => {
        return {
          url: "/auth/change-password",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useChangePasswordMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
} = authApi;
            `;
            break;
          case "ReduxProvider.tsx":
            content = `
"use client";

import { persistor, store } from "@/redux/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
};

export default Providers;
            `;
            break;
          default:
            content = `/* Content for ${file} */`;
        }
        fs.writeFileSync(filePath, content);
        console.log(`File created: ${filePath}`);
      });
    });

    // Create store.ts and hooks.ts directly in src/redux
    const directFiles = [
      {
        name: "store.ts",
        content: `
import { configureStore } from "@reduxjs/toolkit";
import { baseReducer } from "@/redux/base/baseReducer";
import { baseApi } from "@/redux/base/baseApi";
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
export type AppDispatch = typeof store.dispatch;
        `,
      },
      {
        name: "hooks.ts",
        content: `
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
        `,
      },
    ];

    directFiles.forEach((file) => {
      const filePath = path.join(reduxPath, file.name);
      // Create the file with content
      fs.writeFileSync(filePath, file.content);
      console.log(`File created: ${filePath}`);
    });

    console.log("Redux setup complete.");
  });

// Parse the command line arguments
program.parse(process.argv);
