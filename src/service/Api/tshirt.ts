import { api } from "./api";
import { TShirtSize, TShirtSizesResponse } from "@/types/tshritSize";

export const TShirtApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTshirts: build.query<TShirtSizesResponse, void>({
      query: () => "/tshirt-sizes",
      providesTags: ["Tshirts"],
    }),

    addTshirt: build.mutation<TShirtSize, Partial<TShirtSize>>({
      query: (size) => ({
        url: "/tshirt-sizes",
        method: "POST",
        body: size,
      }),
      invalidatesTags: ["Tshirts"],
    }),

  
    deleteTShirt: build.mutation<void, string | number>({
      query: (id) => ({
        url: `/tshirt-sizes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tshirts"]
    }),

  
    updateTShirtSize: build.mutation<
      TShirtSize,
      { id: string | number; data: Partial<TShirtSize> }
    >({
      query: ({ id, data }) => ({
        url: `/tshirt-sizes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Tshirts"],
    }),
  }),
});

export const {
  useGetTshirtsQuery,
  useAddTshirtMutation,
  useDeleteTShirtMutation,
  useUpdateTShirtSizeMutation,
} = TShirtApi;

