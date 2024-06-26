import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    show: false,
    content: "",
  },
  reducers: {
    showToast(state, action) {
      (state.show = true),
        (state.content = action.payload || "Lỗi Không xác định");
    },
    hideToast(state) {
      state.show = false;
      (state.content = "");
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export const toastReducer = toastSlice.reducer;
