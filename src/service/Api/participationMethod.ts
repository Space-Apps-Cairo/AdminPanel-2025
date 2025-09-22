import { ParticipationMethod, ParticipationMethodResponse } from "@/types/participationMethod";
import { api } from "./api";

export const ParticipationMethodApi=api.injectEndpoints({
endpoints:(build)=>({
getParticipationMethod:build.query<ParticipationMethodResponse ,void>({
    query:()=>"/participation-methods",
    providesTags:["ParticipationMethod"],
    }),

addParticipationMethod:build.mutation<ParticipationMethod , Partial<ParticipationMethod>>({
    query:(method)=>({
        url:"/participation-methods",
        method:"POST",
        body:method
    }),
    invalidatesTags:["ParticipationMethod"]
}),


deleteParticipationMethod:build.mutation<void, string | number>({
query:(id)=>({
    url: `/participation-methods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags:["ParticipationMethod"],
    }),

    updateParticipationMethod: build.mutation<
         ParticipationMethod,
          { id: string | number; data: Partial<ParticipationMethod> }
        >({
          query: ({ id, data }) => ({
            url: `/participation-methods/${id}`,
            method: "PUT",
            body: data,
          }),
          invalidatesTags:["ParticipationMethod"],
        }),
      }),
    });
export const {
    useGetParticipationMethodQuery,
    useAddParticipationMethodMutation,
    useDeleteParticipationMethodMutation,
    useUpdateParticipationMethodMutation,
}=ParticipationMethodApi;