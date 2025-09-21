import { api } from "@/service/api";
import { ActualSolution } from "@/types/hackathon/actualSolutions";

export const actualSolutionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getActualSolutions: builder.query<ActualSolution[], void>({
      query: () => "/actual-solutions",
      providesTags: ["ActualSolutions"],
    }),

    addActualSolution: builder.mutation<ActualSolution, Partial<ActualSolution>>({
      query: (body) => ({
        url: "/actual-solutions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ActualSolutions"],
    }),

    updateActualSolution: builder.mutation<
      ActualSolution,
      { id: number; data: Partial<ActualSolution> }
    >({
      query: ({ id, data }) => ({
        url: `/actual-solutions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ActualSolutions"],
    }),

    deleteActualSolution: builder.mutation<void, number>({
      query: (id) => ({
        url: `/actual-solutions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ActualSolutions"],
    }),
  }),
});

export const {
  useGetActualSolutionsQuery,
  useAddActualSolutionMutation,
  useUpdateActualSolutionMutation,
  useDeleteActualSolutionMutation,
} = actualSolutionsApi;
