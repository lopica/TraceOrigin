import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    isAuthenticated: false,
  },
  reducers: {
    requireLogin(state, action) {
      state.isAuthenticated = false;
      console.log('set isAuthenticate')
    },
    loginSuccess(state, action) {
      console.log('login true')
      state.isAuthenticated = true;
    },
    logout(state, action) {
      state.isAuthenticated = false;
    }
  }
});

export const { requireLogin, loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
