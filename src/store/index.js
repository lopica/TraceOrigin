import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./productsSlice";
import { usersApi } from "./apis/usersApi";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    products: productReducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(usersApi.middleware);
  },
});

setupListeners(store.dispatch);

export { store };
export { useCreateUserMutation, useLoginMutation } from "./apis/usersApi";
