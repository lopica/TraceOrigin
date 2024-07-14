import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CONSTANTS } from '../../services/Constants';
import { updateUser } from './userSlice';

// Create an async thunk to handle the timeout
export const requireLoginAfterTimeout = createAsyncThunk(
  'auth/requireLoginAfterTimeout',
  async (_, { dispatch }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch(requireLogin());
        dispatch(updateUser({}))
        resolve();
      }, 3600000 * CONSTANTS.key_expire);
    });
  }
);

const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    isAuthenticated: false,
  },
  reducers: {
    requireLogin(state) {
      state.isAuthenticated = false;
      console.log('set isAuthenticate to false');
    },
    loginSuccess(state) {
      console.log('set isAuthenticate to true');
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(requireLoginAfterTimeout.fulfilled, (state, action) => {
      // Handle the case if needed when the timeout action is fulfilled
      
    });
  },
});

export const { requireLogin, loginSuccess } = authSlice.actions;

export default authSlice.reducer;
