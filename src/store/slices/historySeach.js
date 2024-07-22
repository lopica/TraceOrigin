import { createSlice } from "@reduxjs/toolkit";

const MAX_HISTORY = 3;

const historySearchSlice = createSlice({
  name: 'historySearchSlice',
  initialState: {
    qrList: [],
    aiList: [],
  },
  reducers: {
    updateQRList(state, action) {
      const newItem = action.payload;
      const exists = state.qrList.some(item => item.id === newItem.id);
      if (!exists) {
        if (state.qrList.length >= MAX_HISTORY) {
          state.qrList.shift();
        }
        state.qrList.push(newItem);
      }
    },
    updateAIList(state, action) {
      const newItem = action.payload;
      const exists = state.aiList.some(item => item.id === newItem.id);
      if (!exists) {
        if (state.aiList.length >= MAX_HISTORY) {
          state.aiList.shift();
        }
        state.aiList.push(newItem);
      }
    },
  }
});

export const { updateQRList, updateAIList } = historySearchSlice.actions;
export const historySearchSliceReducer = historySearchSlice.reducer;
