import { api } from "@/service/Api/api";
import {
  VipsRes,
  CreateVipRequest,
  ImportVipsRequest,
  ImportVipsResponse,
} from "@/types/crew/vips";

export const vipsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllVips: build.query<VipsRes, string>({
      query: (queryString) => `/vip${queryString}`,
      providesTags: ["Vips"],
    }),

    importVipsFile: build.mutation<ImportVipsResponse, ImportVipsRequest>({
      query: (body) => ({
        url: "/vip/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vips"],
    }),

    addVip: build.mutation<VipsRes, CreateVipRequest>({
      query: (body) => ({
        url: "/vip",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vips"],
    }),

    updateVip: build.mutation<
      VipsRes,
      { id: number | string; data: Partial<CreateVipRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/vip/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Vips"],
    }),

    deleteVip: build.mutation<VipsRes, number | string>({
      query: (id) => ({
        url: `/vip/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vips"],
    }),
  }),
});

export const {
  useGetAllVipsQuery,
  useImportVipsFileMutation,
  useAddVipMutation,
  useUpdateVipMutation,
  useDeleteVipMutation,
} = vipsApi;