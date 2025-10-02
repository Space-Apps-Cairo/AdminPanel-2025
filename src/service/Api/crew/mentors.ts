import { api } from "@/service/Api/api";
import {
  MentorsRes,
  CreateMentorRequest,
  ImportMentorsRequest,
  ImportMentorsResponse,
} from "@/types/crew/mentors";

export const mentorsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllMentors: build.query<MentorsRes, string>({
      query: (queryString) => `/mentor${queryString}`,
      providesTags: ["Mentors"],
    }),

    importMentorsFile: build.mutation<ImportMentorsResponse, ImportMentorsRequest>({
      query: (body) => ({
        url: "/mentor/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Mentors"],
    }),

    addMentor: build.mutation<MentorsRes, CreateMentorRequest>({
      query: (body) => ({
        url: "/mentor",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Mentors"],
    }),

    updateMentor: build.mutation<
      MentorsRes,
      { id: number | string; data: Partial<CreateMentorRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/mentor/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Mentors"],
    }),

    deleteMentor: build.mutation<MentorsRes, number | string>({
      query: (id) => ({
        url: `/mentor/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Mentors"],
    }),
  }),
});

export const {
  useGetAllMentorsQuery,
  useImportMentorsFileMutation,
  useAddMentorMutation,
  useUpdateMentorMutation,
  useDeleteMentorMutation,
} = mentorsApi;