import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const supportSystemApi = createApi({
  reducerPath: "supportSystem",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}/supportSystem`,
    credentials: "include",
    // fetchFn: async (...args) => {
    //   // REMOVE FOR PRODUCTION
    //   await pause(3000);
    //   return fetch(...args);
    // },
  }),
  endpoints(builder) {
    return {
      replyBySupporter: builder.mutation({
        query: (data) => {
          return {
            url: "/replyBySupporter",
            method: "POST",
            body: {
              id : data.id  ,
              content : data.content,
              images : data.images,
            },
            responseHandler: (response) => {
              return response.text();
            },
          };
        },
      }),

      replyByUser: builder.mutation({
        query: (data) => {
          return {
            url: "/replyByUser",
            method: "POST",
            body: {
              id : data.id  ,
              content : data.content,
              images : data.images,
            },
            responseHandler: (response) => {
              return response.text();
            },
          };
        },
      }),

      addSupport: builder.mutation({
        query: (data) => {
          return {
            url: "/addSupport",
            method: "POST",
            body: {
              title : data.title,
              content : data.content,
              images : data.images,
            },
            responseHandler: (response) => {
              return response.text();
            },
          };
        },
      }),

      listAllBySupporter: builder.query({
        query: (data) => {
          return {
            url: "/listAllBySupporter",
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

      listAllByUser: builder.query({
        query: (data) => {
          return {
            url: "/listAllByUser",
            method: "POST",
            body: {
              status: data.status,
              pageNumber : data.pageNumber,
              pageSize : data.pageSize,
              type : data.type,
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
    };
  },
});

export { supportSystemApi };
export const {

  useReplyBySupporterMutation,
  useReplyByUserMutation,
  useAddSupportMutation,
  useListAllBySupporterQuery,
  useListAllByUserQuery,
  useCountStatusQuery

} = supportSystemApi;
