import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
}

const initialState: AuthState = {
  access_token: localStorage.getItem("access_token"),
  refresh_token: localStorage.getItem("refresh_token"),
};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    setTokens(state, action: PayloadAction<AuthState>) {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
    },
    logout(state) {
      state.access_token = null;
      localStorage.setItem("access_token", "");
      localStorage.setItem("refresh_token", "");
    },
  },
});

export const { setTokens, logout } = authSlice.actions;
export default authSlice.reducer;
