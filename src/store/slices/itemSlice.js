import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "itemSlice",
  initialState: {
    list: [],
    itemDetail: {},
    itemLine: [],
    itemOrigin: {},
    event: {},

  },
  reducers: {
    updateItemDetail(state, action) {
      state.itemDetail = action.payload;
    },
    updateItemList(state, action) {
      state.list = action.payload;
    },
    updateItemLine(state, action) {
      state.itemLine = [...action.payload]
    }
  },
});

export const { updateItemDetail, updateItemList, updateItemLine } = itemSlice.actions;
export const itemSliceReducer = itemSlice.reducer;
