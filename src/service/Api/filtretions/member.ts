import { api } from "../api";
import { MembersResponse } from "@/types/filtertion/member";
export const teamsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getFilteredMember: build.query<
      MembersResponse,
      {status: string; type: string; }
    >({
      query: ({ status, type }) =>
        `/member-filtration?status=${status}&type=${type}`,
      providesTags:["MEMBERFILTRETION"]
    }),
  }),
  
});

export const { useGetFilteredMemberQuery } = teamsApi;