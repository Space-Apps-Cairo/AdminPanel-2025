import { api } from "@/service/Api/api";
import { ParticipantFormValues } from "@/validations/participantSchema";

export const participantsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getParticipants: builder.query<any[], void>({
      query: () => ({
        url: "/secure-handle",
        method: "POST",
        body: { route: "participants.index" },
      }),
      transformResponse: (response: any) => response?.data ?? [],
    }),

    addParticipant: builder.mutation<any, ParticipantFormValues>({
      query: (data) => ({
        url: "/secure-handle",
        method: "POST",
        body: { route: "participants.store", ...data },
      }),
    }),

    updateParticipant: builder.mutation<
      any,
      { id: number | string } & ParticipantFormValues
    >({
      query: ({ id, ...rest }) => ({
        url: "/secure-handle",
        method: "POST",
        body: { route: "participants.update", id, ...rest },
      }),
    }),

    deleteParticipant: builder.mutation<any, number | string>({
      query: (id) => ({
        url: "/secure-handle",
        method: "POST",
        body: { route: "participants.destroy", id },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetParticipantsQuery,
  useAddParticipantMutation,
  useUpdateParticipantMutation,
  useDeleteParticipantMutation,
} = participantsApi;
