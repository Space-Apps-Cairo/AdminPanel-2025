import { api } from "./api";

export interface EducationalLevel {
  id: number;
  name: string;
}

export const educationalLevelsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all educational levels
    getAllEducationalLevels: builder.query<{ data: EducationalLevel[] }, void>({
      query: () => "/education-levels",
      providesTags: ["EducationalLevel"],
    }),

    // Get educational level by id
    getEducationalLevelById: builder.query<{ data: EducationalLevel }, number>({
      query: (id) => `/education-levels/${id}`,
      providesTags: (_result, _error, id) => [{ type: "EducationalLevel", id }],
    }),

    // Add new educational level
    addNewEducationalLevel: builder.mutation<
      { data: EducationalLevel },
      Partial<EducationalLevel>
    >({
      query: (body) => ({
        url: "/education-levels",
        method: "POST",
        body,
      }),
      invalidatesTags: ["EducationalLevel"],
    }),

    // Update educational level
    updateEducationalLevel: builder.mutation<
      { data: EducationalLevel },
      { id: number; body: Partial<EducationalLevel> }
    >({
      query: ({ id, body }) => ({
        url: `/education-levels/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "EducationalLevel", id },
        "EducationalLevel",
      ],
    }),

    // Delete educational level
    deleteEducationalLevel: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/education-levels/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "EducationalLevel", id },
        "EducationalLevel",
      ],
    }),
  }),
});

export const {
  useGetAllEducationalLevelsQuery,
  useGetEducationalLevelByIdQuery,
  useAddNewEducationalLevelMutation,
  useUpdateEducationalLevelMutation,
  useDeleteEducationalLevelMutation,
} = educationalLevelsApi;
