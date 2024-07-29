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
    };
  },
});

export { customercareApi };
export const {

  useAddMutation,

} = customercareApi;
