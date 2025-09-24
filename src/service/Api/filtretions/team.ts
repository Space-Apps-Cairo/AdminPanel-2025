import { Team } from "@/types/teams";
import { api } from "../api";
import { TeamResponse } from "@/types/filtertion/team";
export const teamsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getFilteredTeams: build.query<
      TeamResponse,
      {status: string; type: string; }
    >({
      query: ({ status, type }) =>
        `/team-filtration?status=${status}&type=${type}`,
      providesTags:["TEAMFILTRETION"]
    }),
  }),
  
});

export const { useGetFilteredTeamsQuery } = teamsApi;
