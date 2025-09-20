import {
	TeamsRes,
	SingleTeamRes,
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
	}),
});

export const {
	useGetAllTeamsQuery,
	useGetTeamQuery,
	useDeleteTeamMutation,
} = teamsApi;
