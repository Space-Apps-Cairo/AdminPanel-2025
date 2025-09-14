import { api } from "./api";  
import { BootcampType, BootcampRequest } from "@/types/bootcamp";

export const bootcampApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBootcamps: builder.query<BootcampType[], void>({
      query: () => "/Bootcamps",
      providesTags: ["Bootcamps"],
    }),

    addBootcamp: builder.mutation<BootcampType, BootcampRequest>({
      query: (newBootcamp) => ({
        url: "/Bootcamps",
        method: "POST",
        body: newBootcamp,
      }),
      invalidatesTags: ["Bootcamps"],
    }),

    deleteBootcamp: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/Bootcamps/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bootcamps"],
    }),

    updateBootcamp: builder.mutation<BootcampType, BootcampType>({
      query: ({ id, ...rest }) => ({
        url: `/Bootcamps/${id}`,
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
