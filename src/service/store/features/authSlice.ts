import cookieService from "@/service/cookies/cookieService";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: cookieService.get("token"),
  role: cookieService.get("role") || null,
  user: cookieService.get("user"),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access_token, role } = action.payload;

      cookieService.set("role", role, { path: "/" });
      cookieService.set("token", access_token, { path: "/" });
      cookieService.set("user", user, { path: "/" });

      state.token = access_token;
      state.role = role || null;
      state.user = user;
    },
    logout: (state) => {
      cookieService.remove("role");
      cookieService.remove("token");
      cookieService.remove("user");

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

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
