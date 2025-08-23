import { api } from "./api";

export interface Skill {
  id: number;
  name: string;
  type: string; 
}

export const skillApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all skills
    getAllSkills: builder.query<{ data: Skill[] }, void>({
      query: () => "/bootcamp-participant-skills",
      providesTags: ["Skill"],
    }),

    // Get skill by id
    getSkillById: builder.query<{ data: Skill }, number>({
      query: (id) => `/bootcamp-participant-skills/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Skill", id }],
    }),

    // Add new skill
    addNewSkill: builder.mutation<{ data: Skill }, Partial<Skill>>({
      query: (body) => ({
        url: "/bootcamp-participant-skills",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Skill"],
    }),

    // Update skill
    updateSkill: builder.mutation<
      { data: Skill },
      { id: number; body: Partial<Skill> }
    >({
      query: ({ id, body }) => ({
        url: `/bootcamp-participant-skills/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Skill", id },
        "Skill",
      ],
    }),

    // Delete skill
    deleteSkill: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/bootcamp-participant-skills/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Skill", id },
        "Skill",
      ],
    }),
  }),
});

export const {
  useGetAllSkillsQuery,
  useGetSkillByIdQuery,
  useAddNewSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} = skillApi;
