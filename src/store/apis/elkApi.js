import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// DEV ONLY!!!
const elkApi = createApi({
  reducerPath: "elk",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://traceorigin.click/api/elk`,
    // baseUrl: "http://localhost:3001",
    credentials: 'include',
    fetchFn: async (...args) => {
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
      getNumberVisitsAllTime: builder.query({
        query: (options) => ({
          url: '/getNumberVisitsAllTime',
          method: 'GET',
        }),
      }),
      getNumberVisitsDiagram: builder.query({
        query: (type) => ({
          url: '/getNumberVisitsDiagram',
          method: 'POST',
          body: {
            "type": type || ""
          }
        }),
      }),
      getNumberVisitsDiagramByUser: builder.query({
        query: (type) => ({
          url: '/getNumberVisitsDiagramByUser',
          method: 'POST',
          body: {
            "type": type || ""
          }
        }),
      }),
      getHistoryUploadAI: builder.query({
        query: () => ({
          url: '/getHistoryUploadAI',
          method: 'GET',
        }),
      }),
    };
    
  },
});

export { elkApi };
export const { useGetNumberVisitsAllTimeQuery, useGetNumberVisitsDiagramQuery, useGetNumberVisitsDiagramByUserQuery, useGetHistoryUploadAIQuery } = elkApi;
