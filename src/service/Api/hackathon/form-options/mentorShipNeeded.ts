import {
  MentorShipNeeded,
  MentorShipNeededResponse,
} from "@/types/hackthon/form-options/mentorShipNeeded";
import { api } from "../../api";

export const MentorShipNeededApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMentorShip: build.query<MentorShipNeededResponse, void>({
      query: () => "/mentorship-neededs",
      providesTags: ["MentorShipNeeded"],
    }),
    addMentorShip: build.mutation<MentorShipNeeded, Partial<MentorShipNeeded>>({
      query: (m) => ({
        url: "/mentorship-neededs",
        method: "POST",
        body: m,
      }),
      invalidatesTags: ["MentorShipNeeded"],
    }),

    deleteMentorShip: build.mutation<void, string | number>({
      query: (id) => ({
        url: `/mentorship-neededs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MentorShipNeeded"],
    }),

    updateMentorShip: build.mutation<
      MentorShipNeeded,
      { id: string | number; data: Partial<MentorShipNeeded> }
    >({
      query: ({ id, data }) => ({
        url: `/mentorship-neededs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["MentorShipNeeded"],
    }),
  }),
});
export const {
  useAddMentorShipMutation,
  useGetMentorShipQuery,
  useDeleteMentorShipMutation,
  useUpdateMentorShipMutation,
} = MentorShipNeededApi;
