import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "itemSlice",
  initialState: {
    list: [],
    itemDetail: {},
  },
  reducers: {
    updateItemDetail(state, action) {
      state.itemDetail = action.payload;
    },
    updateItemList(state, action) {
      state.list = action.payload;
    },
  },
});

export const { updateItemDetail, updateItemList } = itemSlice.actions;
export const itemSliceReducer = itemSlice.reducer;
