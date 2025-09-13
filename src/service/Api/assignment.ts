import { api } from "./api";
import { Assignment } from "@/types/preference";

export const assignmentsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAssignmentsByParticipant: build.query<Assignment[], number>({
      query: (participantId) =>
        `/participant-workshop-assignments/participant/${participantId}`,
      transformResponse: (response: any) => response.data ?? [],
      providesTags:["Assignment"],
    }),

    addNewAssignment: build.mutation<
      Assignment,
      {
        participant_id: number;
        workshop_schedule_id: number;
        attendance_status: string;
        check_in_time?: string;
      }
    >({
      query: (assignmentData) => ({
        url: "/participant-workshop-assignments",
        method: "POST",
        body: assignmentData,
      }),
      invalidatesTags: ["Assignment"],
    }),

    updateAssignment: build.mutation<
      Assignment,
      { id: number; data: Partial<Omit<Assignment, "id">> }
    >({
      query: ({ id, data }) => ({
        url: `/participant-workshop-assignments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags:["Assignment"],
    }),

    deleteAssignment: build.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/participant-workshop-assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags:["Assignment"],
    }),
  }),
});

export const {
  useGetAssignmentsByParticipantQuery,
  useAddNewAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = assignmentsApi;