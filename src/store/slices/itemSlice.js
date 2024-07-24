import { createSlice } from "@reduxjs/toolkit";

const getLastConsignItemLogId = (items) => {
  // Iterate from the end of the array to the beginning
  for (let i = items.length - 1; i >= 0; i--) {
    // Check if the current item has eventType "CONSIGN"
    if (items[i].eventType === "CONSIGN") {
      // Return the itemLogId of the found item
      return items[i].itemLogId;
    }
  }
  // Return null if no item with eventType "CONSIGN" is found
  return null;
};

const itemSlice = createSlice({
  name: "itemSlice",
  initialState: {
    list: [],
    itemDetail: {},
    itemLine: [],
    itemOrigin: {},
    event: {},
    lastConsignEventId: "",
  },
  reducers: {
    updateItemDetail(state, action) {
      state.itemDetail = action.payload;
    },
    updateItemList(state, action) {
      state.list = action.payload;
    },
    updateItemLine(state, action) {
      state.itemLine = [...action.payload];
      state.lastConsignEventId = getLastConsignItemLogId([...action.payload]);
    },
  },
});

export const { updateItemDetail, updateItemList, updateItemLine } =
  itemSlice.actions;
export const itemSliceReducer = itemSlice.reducer;
