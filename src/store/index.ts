import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { participantsApi } from "@/store/api/participantsApi";  

import { authApi } from "../Api/login";
import authSlice from "./features/authSlice";

export const store = configureStore({
  reducer: {
<<<<<<<< HEAD:src/service/store/store.ts
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
========
    [participantsApi.reducerPath]: participantsApi.reducer,
>>>>>>>> 5b0490d00324e886d65979efd1577e3af36f4623:src/store/index.ts
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(participantsApi.middleware),
});

setupListeners(store.dispatch);

// نوع الـ RootState و AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
