import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./productsSlice";
import { authApi } from "./apis/authApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from "./apis/userApi";

const store = configureStore({
  reducer: {
    products: productReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(authApi.middleware, userApi.middleware)
  },
});

setupListeners(store.dispatch);

export { store };
export { useCreateUserMutation, useLoginMutation } from "./apis/authApi";
export { useFetchUserQuery } from "./apis/userApi";
