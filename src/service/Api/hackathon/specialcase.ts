import { Member } from "@/types/hackthon/specialMember";
import { api } from "../api"

export const HackathonSpecialCasesApi = api.injectEndpoints({
  endpoints: (build) => ({
    
    getSpecialCases: build.query<Member, void>({
      query: () => "/hackathon-special-cases",
      providesTags: ["SpecialCases"],
    }),

   
    addSpecialCase: build.mutation<Member, Partial<Member>>({
      query: (data) => ({
        url: "/hackathon-special-cases",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SpecialCases"],
    }),

    deleteSpecialCase: build.mutation<void, string | number>({
      query: (id) => ({
        url: `/hackathon-special-cases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SpecialCases"],
    }),

  }),
});

export const {
  useGetSpecialCasesQuery,
  useAddSpecialCaseMutation,
  useDeleteSpecialCaseMutation,
} = HackathonSpecialCasesApi;
