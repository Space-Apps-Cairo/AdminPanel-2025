// src/services/majors.ts
import {
  Major,
  MajorRequest,
  MajorsResponse,
  MajorResponse,
} from "@/types/hackthon/form-options/majors";
import { api } from "../../api";

export const majorsApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Fetch all majors
    getMajors: build.query<Major[], void>({
      query: () => "/majors",
      transformResponse: (response: MajorsResponse) => response.data ?? [],
      providesTags: ["Major"],
    }),

    // Fetch single major by ID
    getMajorById: build.query<Major, number>({
      query: (id) => `/majors/${id}`,
      transformResponse: (response: MajorResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Major", id }],
    }),

    // Add new major
    addMajor: build.mutation<Major, MajorRequest>({
      query: (majorData) => ({
        url: "/majors",
        method: "POST",
        body: majorData,
      }),
      invalidatesTags: ["Major"],
    }),

    // Update major
    updateMajor: build.mutation<
      Major,
      { id: number; data: Partial<MajorRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/majors/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Major", id }],
    }),

    // Delete major
    deleteMajor: build.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/majors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Major"],
    }),
  }),
});

export const {
  useGetMajorsQuery,
  useGetMajorByIdQuery,
  useAddMajorMutation,
  useUpdateMajorMutation,
  useDeleteMajorMutation,
} = majorsApi;
