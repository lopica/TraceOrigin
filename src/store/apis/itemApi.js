import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const itemApi = createApi({
  reducerPath: "item",
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONSTANTS.domain}/item`,
    // credentials: 'include',
    fetchFn: async (input, init, ...args) => {
      // REMOVE FOR PRODUCTION
      // await pause(3000);

      // Determine the endpoint based on the URL or some other method
      const url = typeof input === "string" ? input : input.url;
      if (url.includes("/search") || url.includes("/addItem") ) {
        // Customize fetch options for this specific endpoint
        init = {
          ...init,
          credentials: "include", // Include credentials specifically for this endpoint
        };
      }

      return fetch(input, init, ...args);
    },
  }),
  endpoints(builder) {
    return {
      // search items by product id
      searchItems: builder.query({
        providesTags: ['addItem'],
        query: (request) => {
          return {
            url: '/search',
            method: "POST",
            body: request,
          };
        },
      }),
      //get itemlogs by productRecognition
      fetchItemLogsByProductRecognition: builder.query({
        providesTags: ['consign'],
        query: (productRecognition) => {
          return {
            url: `/viewLineItem?productRecognition=${productRecognition}`,
            method: "GET",
          };
        },
      }),

      // get origin
      fetchOriginByItemLogId: builder.query({
        query: (itemLogId) => {
          return {
            url: `/viewOrigin?itemLogId=${itemLogId}`,
            method: "GET",
          };
        },
      }),

      addItem: builder.mutation({
        invalidatesTags: ['addItem'],
        query: (request) => {
          return {
            url: "addItem",
            method: "POST",
            body: request,
            responseHandler: res => res.text()
          };
        },
      }),
      sendOtpReceiver: builder.mutation({
        query: (request) => {
          return {
            url: 'sendOTP',
            method: 'POST',
            body: request,
          }
        }
      }),
      sendOtpOwner: builder.mutation({
        query: (request) => {
          return {
            url: 'sendCurrentOwnerOTP',
            method: 'POST',
            body: {...request},
          }
        }
      }),
      checkOTP: builder.mutation({
        query: (request) => {
          return {
            url: `confirmOTP?productRecognition=${request.productRecognition}`,
            method: 'POST',
            body: {
              email: request.email,
              otp: request.otp,
            },
          }
        }
      }),
      checkCurrentOwnerOTP: builder.mutation({
        query: (request) => {
          return {
            url: `confirmCurrentOwner?productRecognition=${request.productRecognition}`,
            method: 'POST',
            body: {
              email: request.email,
              otp: request.otp,
            },
          }
        }
      }),
      checkConsignRole: builder.query({
        query: (request) => {
          return {
            url: 'check',
            method: 'POST',
            body: request,
          }
        }
      }),
      consign: builder.mutation({
        invalidatesTags: ['consign'],
        query: (request) => {
          return {
            url: 'authorized',
            method: 'POST',
            body: request,
            responseHandler: res => res.text()
          }
        }
      }),
      isPendingConsign: builder.query({
        query: (request) => {
          return {
            url: `checkEventAuthorized?productRecognition=${request}`,
            method: 'POST',
          }
        }
      }),
    };
  },
});

export { itemApi };
export const {
  useFetchItemLogsByProductRecognitionQuery,
  useFetchOriginByItemLogIdQuery,
  useSearchItemsQuery,
  useAddItemMutation,
  useCheckConsignRoleQuery,
  useSendOtpOwnerMutation,
  useSendOtpReceiverMutation,
  useCheckCurrentOwnerOTPMutation,
  useCheckOTPMutation,
  useConsignMutation,
  useIsPendingConsignQuery,
} = itemApi;
