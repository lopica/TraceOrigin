import { update } from "@react-spring/three";
import { createSlice } from "@reduxjs/toolkit";
import { updateCategories } from "./productForm";

const productSlice = createSlice({
  name: "productSlice",
  initialState: {
    nameSearch: "",
    categorySearch: "",
    list: [],
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
  },
});

export const { updateNameSearch, updateCategorySearch, updateList } =
  productSlice.actions;
export const productSliceReducer = productSlice.reducer;
