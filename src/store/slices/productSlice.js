import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "productSlice",
  initialState: {
    nameSearch: "",
    categorySearch: "",
    list: [],
    productDetail: {}
  },
  reducers: {
    updateList(state, action) {
      state.list = action.payload;
    },
    updateNameSearch(state, action) {
      state.nameSearch = action.payload;
    },
    updateCategorySearch(state, action) {
      state.categorySearch = action.payload;
    },
    updateProductDetail(state, action) {
      state.productDetail = action.payload;
    }
  },
});

export const { updateNameSearch, updateCategorySearch, updateList, updateProductDetail } =
  productSlice.actions;
export const productSliceReducer = productSlice.reducer;
