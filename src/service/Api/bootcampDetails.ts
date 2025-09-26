import { api } from "./api";
import {
  BootcampDetailsRequest,
  BootcampDetailsResponse,
  SingleBootcampDetailsResponse,
} from "@/types/bootcampDetails";

export const bootcampDetailsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllBootcampDetails: builder.query<BootcampDetailsResponse, void>({
      query: () => "/BootcampDetails",
      providesTags: ["BootcampDetails"],
    }),

    addBootcampDetails: builder.mutation<
      SingleBootcampDetailsResponse,
      BootcampDetailsRequest
    >({
      query: (newBootcamp) => ({
        url: "/BootcampDetails",
        method: "POST",
        body: newBootcamp,
      }),
      invalidatesTags: ["BootcampDetails"],
    }),

    updateBootcampDetails: builder.mutation<
      SingleBootcampDetailsResponse,
      { id: string | number; data: BootcampDetailsRequest }
    >({
      query: ({ id, data }) => ({
        url: `/BootcampDetails/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["BootcampDetails"],
    }),

    deleteBootcampDetails: builder.mutation<
      SingleBootcampDetailsResponse,
      string | number
    >({
      query: (id) => ({
        url: `/BootcampDetails/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BootcampDetails"],
    }),
  }),
});

export const {
  useGetAllBootcampDetailsQuery,
  useAddBootcampDetailsMutation,
  useUpdateBootcampDetailsMutation,
  useDeleteBootcampDetailsMutation,
} = bootcampDetailsApi;
