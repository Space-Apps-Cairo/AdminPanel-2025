import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EmailState {
  emailAudience: string | null;
}

const initialState: EmailState = {
  emailAudience: null,
};

export const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    setEmailAudience: (state, action: PayloadAction<string>) => {
      state.emailAudience = action.payload;
    },
    clearEmailAudience: (state) => {
      state.emailAudience = null;
    },
  },
});

export const { setEmailAudience, clearEmailAudience } = emailSlice.actions;

export const selectEmailAudience = (state: any) => state.email.emailAudience;

export default emailSlice.reducer;
