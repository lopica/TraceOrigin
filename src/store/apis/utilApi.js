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
        query: () => "/eventtype/getListEventType",
      }),
      checkEmail: builder.mutation({
        query: (email) => ({
          url: `https://melink.vn/checkmail/checkemail.php`,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ email }).toString(),
          responseHandler: res => res.text()
        }),
      }),
    };
  },
});

export { utilApi };
export const {
  useGetAllTransportsQuery,
  useGetAllEventTypeQuery,
  useCheckEmailMutation,
} = utilApi;
