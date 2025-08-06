import { WorkshopRes } from "@/types/workshop";
import { api } from "./api";

const workshopsApi = api.injectEndpoints({
    endpoints: (build) => ({
        getAllWorkshops: build.query<WorkshopRes, void>({
            query: () => '/secure-handle',
        })
    })
});

export const { useGetAllWorkshopsQuery } = workshopsApi;