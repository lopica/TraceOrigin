import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const productApi = createApi({
  reducerPath: "product",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}/product`,
    credentials: "include",
    // fetchFn: async (...args) => {
    //   // REMOVE FOR PRODUCTION
    //   await pause(3000);
    //   return fetch(...args);
    // },
  }),
  endpoints(builder) {
    return {
      addProduct: builder.mutation({
        invalidatesTags: ['Product'],
        query: (newProduct) => {
          return {
            url: "/addProduct",
            method: "POST",
            body: {
              ...newProduct,
            },
            responseHandler: (response) => {
              return response.text();
            },
          };
        },
      }),
      searchProduct: builder.query({
        providesTags: ['Product'],
        query: (request) => {
          return {
            url: "/findAllProductByManufacturerId",
            method: "POST",
            body: request
          };
        },
      }),
      viewProductDetail: builder.query({
        query: (productId) => {
          return {
            url: "/findProductDetailById",
            method: "POST",
            body: {
              id: productId,
            },
          };
        },
      }),
      deleteProductById: builder.mutation({
        query: (productId) => {
          return {
            url: "/deleteProductById",
            method: "POST",
            body: {
              id: productId,
            },
          };
        },
      }),
      countRegisteredProduct: builder.query({
        query: () => {
          return {
            url: "/countRegisteredProduct",
            method: "GET",
          };
        },
      }),
      ViewProductByManufacturerId: builder.query({
        query: (id, category) => {
          return {
            url: "/ViewProductByManufacturerId",
            method: "POST",
            body: {
              id: id,
              category: category || "", 
            },
          };
        },
      }),
    };
  },
});

export { productApi };
export const {
  useAddProductMutation,
  useSearchProductQuery,
  useViewProductDetailQuery,
  useDeleteProductByIdMutation,
  useCountRegisteredProductQuery,
  useViewProductByManufacturerIdQuery
} = productApi;
