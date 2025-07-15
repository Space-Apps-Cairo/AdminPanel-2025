import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authApi } from '../Api/login';

const RootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer
})

export const store = configureStore({
    
    reducer: RootReducer ,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),

});