import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
    name: 'toast',
    initialState: {
        show: false,
        content: "",
    },
    reducers: {
        showToast(state, action) {
            state.show = true,
                state.content = action.payload.message || 'Lỗi Không xác định'
        },
        hideToast(state) {
            state.show = false
        }
    }
})

export const { showToast, hideToast } = toastSlice.actions
export const toastReducer = toastSlice.reducer