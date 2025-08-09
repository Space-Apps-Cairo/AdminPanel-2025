// Need to use the React-specific entry point to import createApi

import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => {
        return {
          url: "/login",
          method: "POST",
          body: {
            ...data,
          },
        };
      },
      invalidatesTags: [{ type: "Login", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = authApi;
