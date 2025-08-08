import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "@/features/auth/authApi";
import authReducer from "@/features/auth/authSlice";
import { userApi } from "@/service/Api/userApi";
import { bootcampApi } from "@/service/Api/bootcamp";  

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [bootcampApi.reducerPath]: bootcampApi.reducer,  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      bootcampApi.middleware  
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
