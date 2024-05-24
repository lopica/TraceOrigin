import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "product",
  initialState: {
    searchTerm: '',
    products: []
  },
  reducers: {
    changeSearchTerm(state, action){
      state.searchTerm = action.payload;
    }
    
  }
});

export const productReducer = productsSlice.reducer;
