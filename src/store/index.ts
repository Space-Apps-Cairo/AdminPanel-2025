import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { participantsApi } from "@/store/api/participantsApi";  

export const store = configureStore({
  reducer: {
    [participantsApi.reducerPath]: participantsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(participantsApi.middleware),
});

setupListeners(store.dispatch);

// نوع الـ RootState و AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
