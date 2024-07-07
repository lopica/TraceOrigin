import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    isAuthenticated: false,
  },
  reducers: {
    requireLogin(state, _) {
      state.isAuthenticated = false;
      console.log('set isAuthenticate to false')
    },
    loginSuccess(state, _) {
      console.log('set isAuthenticate to true')
      state.isAuthenticated = true;
    },
  }
});

export const { requireLogin, loginSuccess } = authSlice.actions;

export default authSlice.reducer;
