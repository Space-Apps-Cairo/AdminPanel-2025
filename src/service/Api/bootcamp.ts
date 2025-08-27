import { api } from "./api";
import {
  BootcampType,
  BootcampRequest,
  BootcampResponse,
} from "@/types/bootcamp";

export const bootcampApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBootcamps: builder.query<BootcampResponse, void>({
      query: () => "/BootcampDetails",
      providesTags: ["Bootcamps"],
    }),

    addBootcamp: builder.mutation<BootcampResponse, BootcampRequest>({
      query: (newBootcamp) => ({
        url: "/BootcampDetails",
        method: "POST",
        body: newBootcamp,
      }),
      invalidatesTags: ["Bootcamps"],
    }),

    deleteBootcamp: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/BootcampDetails/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bootcamps"],
    }),

    updateBootcamp: builder.mutation<
      BootcampResponse,
      { id: string; data: BootcampType }
    >({
      query: ({ id, data }) => ({
        url: `/BootcampDetails/${id}`,
        method: "PUT",
        body: data,
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
