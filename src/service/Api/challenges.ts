import {
	ChallengesRes,
	SingleChallengeRes,
	CreateChallengeRequest,
	CreateChallengeResponse,
	UpdateChallengeRequest,
	UpdateChallengeResponse,
} from "@/types/challenges";
import { api } from "./api";

export const challengesApi = api.injectEndpoints({
	endpoints: (build) => ({
		// ====== challenges ====== //

		getAllChallenges: build.query<ChallengesRes, void>({
			query: () => '/challenges',
			providesTags: ['Challenges'],
		}),

		getChallenge: build.query<SingleChallengeRes, string>({
			query: (id) => `/challenges/${id}`,
			providesTags: (result, error, id) => [{ type: 'Challenges', id }],
		}),

		addChallenge: build.mutation<CreateChallengeResponse, CreateChallengeRequest>({
			query: (challengeData) => ({
				url: '/challenges',
				method: 'POST',
				body: challengeData,
			}),
			invalidatesTags: ['Challenges'],
		}),

		updateChallenge: build.mutation<UpdateChallengeResponse, { id: number | string; data: UpdateChallengeRequest }>({
			query: ({ id, data }) => ({
				url: `/challenges/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Challenges'],
		}),

		deleteChallenge: build.mutation<ChallengesRes, number | string>({
			query: (id) => ({
				url: `/challenges/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Challenges'],
		}),
	}),
});

export const {
	useGetAllChallengesQuery,
	useGetChallengeQuery,
	useAddChallengeMutation,
	useUpdateChallengeMutation,
	useDeleteChallengeMutation,
} = challengesApi;