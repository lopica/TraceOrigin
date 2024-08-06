import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const itemLogApi = createApi({
  reducerPath: "itemLog",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}/itemlog`,
    // credentials: 'include',
    fetchFn: async (input, init, ...args) => {
      // REMOVE FOR PRODUCTION
      // await pause(3000);

      // Determine the endpoint based on the URL or some other method
      // const url = typeof input === 'string' ? input : input.url;
      // if (url.includes('/findAllItemByProductId?ProductId')) {
      //     // Customize fetch options for this specific endpoint
      //     init = {
      //         ...init,
      //         credentials: 'include', // Include credentials specifically for this endpoint
      //     };
      // }

      return fetch(input, init, ...args);
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
      // get itemlog detail
      fetchEventByItemLogId: builder.query({
        query: (itemLogId) => {
          return {
            url: `/getItemLogDetail?itemLogId=${itemLogId}`,
            method: "GET",
          };
        },
      }),
      createTransportEvent: builder.mutation({
        invalidatesTags: ["consign"],
        query: (request) => {
          return {
            url: "addItemLogTransport",
            method: "POST",
            body: request,
          };
        },
      }),
      addReceiveLocation: builder.mutation({
        invalidatesTags: ["consign"],
        query: (request) => {
          return {
            url: "updateItemLog",
            method: "POST",
            body: request,
          };
        },
      }),
      updateReceiveLocation: builder.mutation({
        query: (request) => {
          return {
            url: "editItemLogByParty",
            method: "POST",
            body: request
          }
        }
      })
    };
  },
});

export { itemLogApi };
export const {
  useFetchEventByItemLogIdQuery,
  useCreateTransportEventMutation,
  useAddReceiveLocationMutation,
  useUpdateReceiveLocationMutation,
} = itemLogApi;
