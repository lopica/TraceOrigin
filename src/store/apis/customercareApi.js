import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const customercareApi = createApi({
  reducerPath: "customercare",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}/customercare`,
    credentials: "include",
    // fetchFn: async (...args) => {
    //   // REMOVE FOR PRODUCTION
    //   await pause(3000);
    //   return fetch(...args);
    // },
  }),
  endpoints(builder) {
    return {
      add: builder.mutation({
        query: (data) => {
          return {
            url: "/add",
            method: "POST",
            body: {
              customerName : data.customerName,
              customerEmail : data.customerEmail,
              customerPhone : data.customerPhone,
              content : data.content,
            },
            responseHandler: (response) => {
              return response.text();
            },
          };
        },
      }),
      updateStatus: builder.mutation({
        query: (data) => {
          return {
            url: "/updateStatus",
            method: "POST",
            body: {
              careId : data.careId,
              status : data.status,
              note : data.note,
            },
            responseHandler: (response) => {
              return response.text();
            },
          };
        },
      }),
      countStatus: builder.query({
        query: () => {
          return {
            url: "/countStatus",
            method: "GET",
          };
        },
      }),
      searchCustomerCare: builder.query({
        query: (data) => {
          return {
            url: "/searchCustomerCare",
            method: "POST",
            body: {
              keyword : data.keyword,
              startDate : data.startDate,
              endDate : data.endDate,
              status: data.status,
              pageNumber : data.pageNumber,
              pageSize : data.pageSize,
              type : data.type,
            },
          };
        },
      }),
    };
  },
});

export { customercareApi };
export const {

  useAddMutation,
  useUpdateStatusMutation,
  useCountStatusQuery,
  useSearchCustomerCareQuery,

} = customercareApi;
