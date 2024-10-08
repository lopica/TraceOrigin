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
    hasCertificate: false,
    cancelForm: {},
    consignForm: {},
    receiveForm: {},
    updatedConsignForm: {},
    totalPages: 0,
    currentPage: 0,
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
    updateCertificate(state, action) {
      state.hasCertificate = action.payload;
    },
    updateCancelForm(state, action) {
      state.cancelForm = { ...action.payload };
    },
    updateConsignForm(state, action) {
      state.consignForm = { ...action.payload };
    },
    updateReceiveForm(state, action) {
      state.receiveForm = { ...action.payload };
    },
    updateUpdateConsignForm(state, action) {
      state.updatedConsignForm = { ...action.payload };
    },
    setTotalPages(state, action) {
      state.totalPages = action.payload
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload
    }
  },
});

export const {
  updateItemDetail,
  updateItemList,
  updateItemLine,
  updateCertificate,
  updateCancelForm,
  updateConsignForm,
  updateReceiveForm,
  updateUpdateConsignForm,
  setTotalPages,
  setCurrentPage,
} = itemSlice.actions;
export const itemSliceReducer = itemSlice.reducer;
