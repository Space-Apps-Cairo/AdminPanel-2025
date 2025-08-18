// src/services/userApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@/types/user";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://staging.spaceappscairo.com/api/v1/",  
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Authorization", `Bearer token`);  
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: "secure-handle",
        method: "POST",
        body: {
          route: "api.User.index", 
        },
      }),
      providesTags: ["User"],
    }),
    addUser: builder.mutation<void, Partial<User>>({
      query: (body) => ({
        url: "secure-handle",
        method: "POST",
        body: {
          route: "api.User.store",
          data: body,
        },
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<void, Partial<User>>({
      query: (body) => ({
        url: "secure-handle",
        method: "POST",
        body: {
          route: "api.User.update",
          data: body,
        },
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: "secure-handle",
        method: "POST",
        body: {
          route: "api.User.delete",
          data: { id },
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
