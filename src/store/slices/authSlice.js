import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CONSTANTS } from "../../services/Constants";
import { updateUser } from "./userSlice";
import { updateAvatar, updateImages } from "./productFormSlice";

const TIMEOUT_DURATION = 60 * 60 * 1000 * CONSTANTS.key_expire;
// const TIMEOUT_DURATION = 20 * 1000 * CONSTANTS.key_expire;
// Create an async thunk to handle the timeout
export const requireLoginAfterTimeout = createAsyncThunk(
  "auth/requireLoginAfterTimeout",
  async (_, { dispatch, getState }) => {
    return new Promise((resolve) => {
      const state = getState();
      const lastActivityTime = state.authSlice.lastActivityTime;
      const currentTime = Date.now();
      const elapsed = currentTime - lastActivityTime;
      console.log("da set clock");
      console.log(lastActivityTime)
      console.log(elapsed);
      console.log(TIMEOUT_DURATION);
      if (elapsed >= TIMEOUT_DURATION) {
        console.log("logout ngay");
        dispatch(requireLogin());
        dispatch(updateUser({}));
        resolve();
      } else {
        setTimeout(() => {
          console.log("vo timeout");
          console.log(TIMEOUT_DURATION - elapsed);
          dispatch(requireLogin());
          dispatch(updateUser({}));
          dispatch(updateImages([]))
          dispatch(updateAvatar(''))
          resolve();
        }, TIMEOUT_DURATION - elapsed);
      }
    });
  }
);

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    isAuthenticated: false,
    lastActivityTime: 0,
  },
  reducers: {
    requireLogin(state) {
      state.isAuthenticated = false;
      console.log("set isAuthenticated to false");
    },
    loginSuccess(state) {
      state.isAuthenticated = true;
      state.lastActivityTime = Date.now();
      console.log("set isAuthenticated to true");
      // console.log(state.lastActivityTime)
    },
    updateLastActivityTime(state) {
      state.lastActivityTime = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(requireLoginAfterTimeout.fulfilled, (state, action) => {
      // Handle the case if needed when the timeout action is fulfilled
    });
  },
});

export const { requireLogin, loginSuccess, updateLastActivityTime } =
  authSlice.actions;

export default authSlice.reducer;
