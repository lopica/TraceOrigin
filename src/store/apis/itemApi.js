import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const itemApi = createApi({
  reducerPath: "item",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}/item`,
    // credentials: 'include',
    fetchFn: async (input, init, ...args) => {
      // REMOVE FOR PRODUCTION
      await pause(3000);

      // Determine the endpoint based on the URL or some other method
      const url = typeof input === "string" ? input : input.url;
      if (url.includes("/findAllItemByProductId?ProductId") || url.includes("/addItem")) {
        // Customize fetch options for this specific endpoint
        init = {
          ...init,
          credentials: "include", // Include credentials specifically for this endpoint
        };
      }

      return fetch(input, init, ...args);
    },
  }),
  endpoints(builder) {
    return {
      // search items by product id
      searchItemsByProductId: builder.query({
        query: (productId) => {
          return {
            url: `/findAllItemByProductId?ProductId=${productId}`,
            method: "GET",
          };
        },
      }),
      //get itemlogs by productRecognition
      fetchItemLogsByProductRecognition: builder.query({
        query: (productRecognition) => {
          return {
            url: `/viewLineItem?productRecognition=${productRecognition}`,
            method: "GET",
          };
        },
      }),

      // get origin
      fetchOriginByItemLogId: builder.query({
        query: (itemLogId) => {
          return {
            url: `/viewOrigin?itemLogId=${itemLogId}`,
            method: "GET",
          };
        },
      }),
      // get itemlog detail
      fetchEventByItemLogId: builder.query({
        query: (itemLogId) => {
          return {
            url: `/viewOrigin?itemLogId=${itemLogId}`,
            method: "GET",
          };
        },
      }),

      addItem: builder.mutation({
        query: (request) => {
          return {
            url: "addItem",
            method: "POST",
            body: request,
            responseHandler: res => res.text()
          };
        },
      }),
    };
  },
});

export { itemApi };
export const {
  useFetchItemLogsByProductRecognitionQuery,
  useFetchOriginByItemLogIdQuery,
  useSearchItemsByProductIdQuery,
  useAddItemMutation,
} = itemApi;
