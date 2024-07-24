import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

const utilApi = createApi({
  reducerPath: "util",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}`,
  }),
  endpoints(builder) {
    return {
      getAllTransports: builder.query({
        query: () => "/transport/getAllTransport",
      }),
    };
  },
});

export { utilApi };
export const { useGetAllTransportsQuery } = utilApi;
