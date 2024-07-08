import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const certificateApi = createApi({
  reducerPath: "certificate",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}/certificate`,
    // baseUrl: "http://localhost:3001",
    credentials: 'include',
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      await pause(1);
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
      getListManuToVerify: builder.query({
        query: (options) => ({
          url: '/getListManuToVerify',
          method: 'POST',
          body:{
            phone: options.phone || "",
            type : options.type || "asc",
            pageNumber: options.pageNumber || 0,
            pageSize: options.pageSize || 10
          }
        }),
      }),
      getListCertificateByManuId: builder.query({
        query: (userId) => ({
          url: '/getListCertificateByManuId',
          method: 'POST',
          body:{
            "id" : userId
          }
        }),
      }),
      addCertificate: builder.mutation({
        query: (newCer) => {
          return {
            url: "/createCertificate",
            method: "POST",
            body: {
              ...newCer,
            },
            responseHandler: (response) => {
              return response.text();
            },
          };
        },
      }),
    };
  },
});

export { certificateApi };
export const { useGetListManuToVerifyQuery, useGetListCertificateByManuIdQuery, useAddCertificateMutation} = certificateApi;
