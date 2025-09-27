import {
	CriteriaCategoriesRes,
	CriteriaRatingRequest,
	CriteriaRatingResponse,
} from "@/types/filtertion/criteriaCategories";
import { api } from "@/service/Api/api";

export const criteriaCategoriesApi = api.injectEndpoints({
	endpoints: (build) => ({
		// ====== criteria categories ====== //

		getAllCriteriaCategories: build.query<CriteriaCategoriesRes, void>({
			query: () => '/criteriacategory',
			providesTags: ['CriteriaCategories'],
		}),

		// ====== criteria rating ====== //
		submitCriteriaRating: build.mutation<CriteriaRatingResponse, CriteriaRatingRequest>({
			query: (ratingData) => ({
				url: '/criteriarating',
				method: 'POST',
				body: ratingData,
			}),
			invalidatesTags: ['Teams'], // Invalidate teams cache after rating
		}),
	}),
});

export const {
	useGetAllCriteriaCategoriesQuery,
	useSubmitCriteriaRatingMutation,
} = criteriaCategoriesApi;
