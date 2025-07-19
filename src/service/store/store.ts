import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authApi } from '../Api/login';
import authReducer from './features/authSlice';

const RootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer
})

export const store = configureStore({
    
    reducer: RootReducer ,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),

});