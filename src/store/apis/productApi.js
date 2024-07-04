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
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      await pause(3000);
      return fetch(...args);
    },
  }),
  endpoints(builder) {
    return {
      addProduct: builder.mutation({
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
        // providesTags: ['Products'],
        query: (request) => {
          return {
            url: "/findAllProductByManufacturerId",
            method: "POST",
            body: {
              pageNumber: request.pageNumber || 0, //trang dau la 0
              pageSize: request.pageSize || 2, //so product 1 trang
              type: request.type || "asc", //asc vs desc
              startDate: request.startDate || 0, //epoch
              endDate: request.endDate || 0, //epoch
              name: request.searchTerm || "", //contain
            },
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
    };
  },
});

export { productApi };
export const {
  useAddProductMutation,
  useSearchProductQuery,
  useViewProductDetailQuery,
} = productApi;
