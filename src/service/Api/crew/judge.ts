import { api } from "../api";
import { Judge, JudgeRequest, JudgeResponse } from "@/types/crew/judge";

export const judgeApi = api.injectEndpoints({
  endpoints: (build) => ({

    // ====== get all judge ====== //
    getAllJudge: build.query<JudgeResponse, string>({
      query: (queryString) => `/judge${queryString}`,
      providesTags: ["Judge"],
    }),

    // ====== import judge file ====== //
    importJudgeFile: build.mutation<JudgeResponse, { judge: JudgeRequest[] }>({
      query: (judgeData) => ({
        url: '/judge/bulk',
        method: 'POST',
        body: judgeData,
      }),
      invalidatesTags: ["Judge"],
    }),

    // ====== add judge ====== //
    addJudge: build.mutation<JudgeResponse, JudgeRequest>({
      query: (judgeData) => ({
        url: '/judge',
        method: 'POST',
        body: judgeData,
      }),
      invalidatesTags: ["Judge"],
    }),

    // ====== update judge ====== //
    updateJudge: build.mutation<
      JudgeResponse,
      { uuid: string; data: Partial<JudgeRequest> }
    >({
      query: ({ uuid, data }) => ({
        url: `/judge/${uuid}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ["Judge"],
    }),

    // ====== delete judge ====== //
    deleteJudge: build.mutation<JudgeResponse, string>({
      query: (uuid) => ({
        url: `/judge/${uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Judge"],
    }),

  }),
});

export const {
  useGetAllJudgeQuery,
  useImportJudgeFileMutation,
  useAddJudgeMutation,
  useUpdateJudgeMutation,
  useDeleteJudgeMutation,
} = judgeApi;
