import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

const utilApi = createApi({
  reducerPath: "util",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}`,
    fetchFn: async (input, init, ...args) => {

      const url = typeof input === "string" ? input : input.url;
      if (url.includes("/eventtype/getListEventType")) {
        init = {
          ...init,
          credentials: "include",
        };
      }

      return fetch(input, init, ...args);
    },
  }),
  endpoints(builder) {
    return {
      getAllTransports: builder.query({
        query: () => "/transport/getAllTransport",
      }),
      getAllEventType: builder.query({
        query: () => '/eventtype/getListEventType' 
      })
    };
  },
});

export { utilApi };
export const { useGetAllTransportsQuery, useGetAllEventTypeQuery } = utilApi;
