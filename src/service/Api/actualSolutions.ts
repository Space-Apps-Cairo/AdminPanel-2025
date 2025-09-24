import { api } from "./api";
import {
  ActualSolution,
  ActualSolutionsResponse,
} from "@/types/hackthon/form-options/actualSolution";

export const ActualSolutionsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getActualSolutions: build.query<ActualSolutionsResponse, void>({
      query: () => "/actual-solutions",
      providesTags: ["ActualSolutions"],
    }),

    addActualSolution: build.mutation<ActualSolution, Partial<ActualSolution>>({
      query: (solution) => ({
        url: "/actual-solutions",
        method: "POST",
        body: solution,
      }),
      invalidatesTags: ["ActualSolutions"],
    }),

    deleteActualSolution: build.mutation<void, string | number>({
      query: (id) => ({
        url: `/actual-solutions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ActualSolutions"],
    }),

    updateActualSolution: build.mutation<
      ActualSolution,
      { id: string | number; data: Partial<ActualSolution> }
    >({
      query: ({ id, data }) => ({
        url: `/actual-solutions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ActualSolutions"],
    }),
  }),
});

export const {
  useGetActualSolutionsQuery,
  useAddActualSolutionMutation,
  useDeleteActualSolutionMutation,
  useUpdateActualSolutionMutation,
} = ActualSolutionsApi;
