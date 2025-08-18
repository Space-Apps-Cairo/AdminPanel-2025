

import { api } from "./api";
import {
  BootcampType,
  BootcampRequest,
  BootcampResponse,
} from "@/types/bootcamp";

export const bootcampApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all bootcamps
    getBootcamps: builder.query<BootcampResponse, void>({
      query: () => "/BootcampDetails",
      providesTags: ["Bootcamps"],
    }),

    //  Add new bootcamp
    addBootcamp: builder.mutation<BootcampResponse, BootcampRequest>({
      query: (newBootcamp) => ({
        url: "/BootcampDetails",
        method: "POST",
        body: newBootcamp,
      }),
      invalidatesTags: ["Bootcamps"],
    }),

    //  Delete bootcamp by ID
    deleteBootcamp: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/BootcampDetails/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bootcamps"],
    }),

    //  Update bootcamp
    updateBootcamp: builder.mutation<BootcampResponse, BootcampType>({
      query: ({ id, ...rest }) => ({
        url: `/BootcampDetails/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Bootcamps"],
    }),
  }),
});

export const {
  useGetBootcampsQuery,
  useAddBootcampMutation,
  useDeleteBootcampMutation,
  useUpdateBootcampMutation,
} = bootcampApi;
