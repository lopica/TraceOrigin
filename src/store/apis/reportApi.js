import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const reportApi = createApi({
  reducerPath: "report",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}/report`,
    // baseUrl: "http://localhost:3001",
    credentials: 'include',
    fetchFn: async (...args) => {
      await pause(1000); // Add a pause for dev purposes
      return fetch(...args);
    },
    responseHandler: async (response) => {
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        return await response.json(); // Parse as JSON if content-type is json
      } else {
        return response.text(); // Otherwise, return as text
      }
    },
  }),
  endpoints(builder) {
    return {
      getListReports: builder.query({
        query: (options) => ({
          url: '/getListReports',
          method: 'POST',
          body: {
            code: options.code || "",
            title: options.title || "",
            reportTo: options.reportTo || 22,
            type: options.type || -1,
            dateFrom: options.dateFrom || 0,
            dateTo: options.dateTo || 0,
            status: options.status || -1,
            orderBy: options.orderBy || "reportId",
            isAsc: options.isAsc || false,
            page: options.page || 0,
            size: options.size || 10,
            emailReport: options.emailReport || "",
            productId: options.productId || -1
          }
        }),
      }),
      addNewReports: builder.mutation({
        query: (options) => ({
          url: '/createReport',
          method: 'POST',
          body: {
            ...options,
          },
          responseHandler: (response) => {
            return response.text();
          },
        }),
      }),
      replyReport: builder.mutation({
        query: (options) => ({
          url: '/replyReport',
          method: 'POST',
          body: {
            ...options,
          },
          responseHandler: (response) => {
            return response.text();
          },
        }),
      })
    };
  },
});

export { reportApi };
export const { useGetListReportsQuery, useAddNewReportsMutation, useReplyReportMutation } = reportApi;
