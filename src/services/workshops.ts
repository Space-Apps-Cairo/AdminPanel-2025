import { api } from "@/service/Api/api";
import { WorkshopRes } from "@/types/workshop";

const workshopsApi = api.injectEndpoints({
    endpoints: (build) => ({
        getAllWorkshops: build.query<WorkshopRes, void>({
            query: () => '/workshop-mangment',
            providesTags: ['Workshop'],
        })
    })
});

export const { useGetAllWorkshopsQuery } = workshopsApi;