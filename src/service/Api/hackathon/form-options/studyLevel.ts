
import { StudyLevel, StudyLevelResponse } from "@/types/hackthon/form-options/studyLevels";
import { api } from "../../api";

export const StudyLevelApi=api.injectEndpoints({
    endpoints:(build)=>({
getstudylevel:build.query<StudyLevelResponse , void>({
    query:()=>"/study-levelsses",
    providesTags:["StudyLevel"]
}),
addStudtyLevel:build.mutation<StudyLevel, Partial<StudyLevel>>({
query:(level)=>({
    url:"/study-levelsses",
    method:"POST",
    body:level,
}),
invalidatesTags:["StudyLevel"],
}),

deleteStudtyLevel:build.mutation<void, string | number>({
query:(id)=>({
    url: `/study-levelsses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags:["StudyLevel"],
    }),

    updateStudyLevel: build.mutation<
          StudyLevel,
          { id: string | number; data: Partial<StudyLevel> }
        >({
          query: ({ id, data }) => ({
            url: `/study-levelsses/${id}`,
            method: "PUT",
            body: data,
          }),
          invalidatesTags:["StudyLevel"],
        }),
      }),
    });

export const {
 useGetstudylevelQuery,
 useAddStudtyLevelMutation,
 useDeleteStudtyLevelMutation,
  useUpdateStudyLevelMutation,
} = StudyLevelApi;
