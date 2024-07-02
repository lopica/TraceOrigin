import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CONSTANTS } from "../../services/Constants";

// DEV ONLY!!!
const pause = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};

const itemApi = createApi({
    reducerPath: 'item',
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONSTANTS.domain}/item`,
        // credentials: 'include',
        fetchFn: async (input, init, ...args) => {
            // REMOVE FOR PRODUCTION
            await pause(3000);

            // Determine the endpoint based on the URL or some other method
            const url = typeof input === 'string' ? input : input.url;
            if (url.includes('/findAllItemByProductId?ProductId')) {
                // Customize fetch options for this specific endpoint
                init = {
                    ...init,
                    credentials: 'include', // Include credentials specifically for this endpoint
                };
            }

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
            // search items by product id
            searchItemsByProductId: builder.query({
                query: (productId) => {
                    return {
                        url: `/findAllItemByProductId?ProductId=${productId}`,
                        method: 'GET',
                    }
                }
            }),
            //get itemlogs by productRecognition
            fetchItemLogsByProductRecognition: builder.query({
                query: (productRecognition) => {
                    return {
                        url: `/viewLineItem?productRecognition=${productRecognition}`,
                        method: 'GET',
                    }
                }
            }),

            // get origin
            fetchOriginByItemLogId: builder.query({
                query: (itemLogId) => {
                    return {
                        url: `/viewOrigin?itemLogId=${itemLogId}`,
                        method: 'GET',
                    }
                }
            }),
            // get itemlog detail
            fetchEventByItemLogId: builder.query({
                query: (itemLogId) => {
                    return {
                        url: `/viewOrigin?itemLogId=${itemLogId}`,
                        method: 'GET',
                    }
                }
            })
        }
    }
})

export { itemApi }
export const { useFetchItemLogsByProductRecognitionQuery, useFetchOriginByItemLogIdQuery, useSearchItemsByProductIdQuery } = itemApi