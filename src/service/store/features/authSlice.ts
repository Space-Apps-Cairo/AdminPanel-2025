import cookieService from "@/service/cookies/cookieService";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: cookieService.get('token'),
    role: cookieService.get('role')
};


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action
        ) => {
            const { user, token } = action.payload;

            const role = user?.roles;
            cookieService.set('role', user.role, { path: "/" });
            cookieService.set('token', token, { path: "/" });


            state.token = token;
            state.role = role;
        },
        logout: (state) => {

            cookieService.remove('role');
            cookieService.remove('token');


            state.token = null;
            state.role = null;
        },
        getToken: (state) => {
            return state.token;
        }
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;