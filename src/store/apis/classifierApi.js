import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// DEV ONLY!!!
const pause = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};

const classifierApi = createApi({
    reducerPath: 'classifier',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8081/api',
        // credentials: 'include',
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
            predict: builder.mutation({
                query: ({ model, image }) => {
                    return {
                        url: '/predict',
                        method: 'POST',
                        body: {
                            model, image
                        }
                    }
                }
            })
        }
    }
})

export { classifierApi }
export const { usePredictMutation } = classifierApi