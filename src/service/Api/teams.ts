import {
	TeamsRes,
	SingleTeamRes,
  TeamMutationRes,      
  CreateTeamRequest,   
  UpdateTeamRequest,    
} from "@/types/teams";
import { api } from "./api";

export const teamsApi = api.injectEndpoints({
	endpoints: (build) => ({
		// ====== teams ====== //

		getAllTeams: build.query<TeamsRes, void>({
			query: () => '/teams',
			providesTags: ['Teams'],
		}),

		getTeam: build.query<SingleTeamRes, string>({
			query: (id) => `/teams/${id}`,
			providesTags: (result, error, id) => [{ type: 'Teams', id }],
		}),

		deleteTeam: build.mutation<TeamsRes, number | string>({
			query: (id) => ({
				url: `/teams/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Teams'],
		}),
 addTeam: build.mutation<TeamMutationRes, CreateTeamRequest>({
  query: (newTeam) => ({
    url: `/teams`,
    method: "POST",
    body: newTeam,
  }),
  invalidatesTags: ["Teams"],
}),
  updateTeam: build.mutation<TeamMutationRes, { id: number | string; data: UpdateTeamRequest }>({
  query: ({ id, data }) => ({
    url: `/teams/${id}`,
    method: "PUT",
    body: data,
  }),
  invalidatesTags: (result, error, { id }) => [{ type: "Teams", id }],
}),


 
	}),
});

export const {
	useGetAllTeamsQuery,
	useGetTeamQuery,
	useDeleteTeamMutation,
	useAddTeamMutation,      
    useUpdateTeamMutation,   
} = teamsApi;
