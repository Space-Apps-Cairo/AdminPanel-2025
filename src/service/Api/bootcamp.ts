import { api } from "./api";
import {
  BootcampType,
  BootcampRequest,
  BootcampResponse,
  BootcampAttendeeRequest,
  BootcampAttendeeResponse,
  BootcampAttendeesResponse,
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

    // Bootcamp Attendees
    registerBootcampAttendee: builder.mutation<
      BootcampAttendeeResponse,
      BootcampAttendeeRequest
    >({
      query: (attendeeData) => ({
        url: "/bootcamp-attendees",
        method: "POST",
        body: attendeeData,
      }),
      invalidatesTags: ["Bootcamps"],
    }),

    // Add this new endpoint for getting bootcamp attendees
    getBootcampAttendees: builder.query<BootcampAttendeesResponse, string>({
      query: (bootcampId) => `/bootcamp-attendees/attended/${bootcampId}`,
      providesTags: (result, error, bootcampId) => [
        { type: "Bootcamps", id: bootcampId },
      ],
    }),
  }),
});

export const {
  useGetBootcampsQuery,
  useAddBootcampMutation,
  useDeleteBootcampMutation,
  useUpdateBootcampMutation,
  useRegisterBootcampAttendeeMutation,
  useGetBootcampAttendeesQuery, // Add this export
} = bootcampApi;
