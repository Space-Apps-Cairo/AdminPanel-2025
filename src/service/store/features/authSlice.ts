import cookieService from "@/service/cookies/cookieService";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: cookieService.get("token"),
  user: cookieService.get("user"),
  role: cookieService.get("role"),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access_token } = action.payload;

      const role = user.role;

      cookieService.set("role", role, { path: "/" });
      cookieService.set("token", access_token, { path: "/" });
      cookieService.set("user", user, { path: "/" });

      state.token = access_token;
      state.role = role;
      state.user = user;
    },
    logout: (state) => {
      cookieService.remove("role");
      cookieService.remove("token");

      state.token = null;
      state.role = null;
      state.user = null;
    },
    getToken: (state) => {
      return state.token;
    },
    getUser: (state) => {
      return state.user;
    },
  },
});
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRole = (state) => state.auth.role;

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
