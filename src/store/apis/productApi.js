import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// DEV ONLY!!!
const pause = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};

const productApi = createApi({
    reducerPath: 'product',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/product',
        fetchFn: async (...args) => {
            // REMOVE FOR PRODUCTION
            await pause(3000);
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
            addProduct: builder.mutation({
                query: (newProduct) => {
                    return {
                        url: '/addProduct',
                        method: 'POST',
                        body: {
                            ...newProduct
                        }
                    }
                }
            })
        }
    }
})

export {productApi}
export const { useAddProductMutation } = productApi