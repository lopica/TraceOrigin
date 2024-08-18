import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";
import { requireLogin } from "../slices/authSlice";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const categoryApi = createApi({
  reducerPath: "category",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}/category`,
    // credentials: "include",
    fetchFn: async (input, init, ...args) => {
      // REMOVE FOR PRODUCTION
      // await pause(3000);

      // Determine the endpoint based on the URL or some other method
      const url = typeof input === "string" ? input : input.url;
      if (
        url.includes("/addListCategory") ||
        url.includes("/findCategoryByManufacturer") ||
        url.includes("/getCategoryForAdmin")
      ) {
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
      getAllCategories: builder.query({
        query: () => {
          return {
            url: "/findAll",
            method: "GET",
          };
        },
      }),
      getCategoryForAdmin: builder.query({
        query: () => {
          return {
            url: "/getCategoryForAdmin",
            method: "GET",
          };
        },
      }),
      addListCategory: builder.mutation({
        query: (categories) => ({
          url: "/addListCategory",
          method: "POST",
          body: categories,
        }),
      }),
      getNextId: builder.query({
        query: () => {
          return {
            url: "/getNextId",
            method: "GET",
          };
        },
      }),
      findCategoryByManufacturer: builder.query({
        query: (id) => ({
          url: "/findCategoryByManufacturer",
          method: "POST",
          body: {
            id: id,
          },
        }),
      }),
    };
  },
});

export { categoryApi };
export const {
  useGetAllCategoriesQuery,
  useGetCategoryForAdminQuery,
  useAddListCategoryMutation,
  useGetNextIdQuery,
  useFindCategoryByManufacturerQuery,
} = categoryApi;
