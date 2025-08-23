import { CollectionsRes, CreateCollectionRequest, CreateMaterialRequest, CreateVolunteerRequest, MaterialsRes, VolunteersRes, AssignCollectionRequest, AssignCollectionResponse, SingleCollectionRes, UpdateCollectionRequest } from "@/types/materials";
import { api } from "./api";

export const materialsApi = api.injectEndpoints({

	endpoints: (build) => ({

		// ====== volunteers ====== //

		getAllVolunteers: build.query<VolunteersRes, void>({
			query: () => '/volunteers',
			providesTags: ['Volunteers'],
		}),

		importVolunteersFile: build.mutation<VolunteersRes, { volunteers: CreateVolunteerRequest[] }>({
			query: (volunteersData) => ({
				url: '/volunteers/bulk',
				method: 'POST',
				body: volunteersData,
			}),
			invalidatesTags: ['Volunteers'],
		}),

		addVolunteer: build.mutation<VolunteersRes, CreateVolunteerRequest>({
			query: (volunteerData) => ({
				url: '/volunteers',
				method: 'POST',
				body: volunteerData,
			}),
			invalidatesTags: ['Volunteers'],
		}),

		updateVolunteer: build.mutation<VolunteersRes, { id: number | string; data: Partial<CreateVolunteerRequest> }>({
			query: ({ id, data }) => ({
				url: `/volunteers/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Volunteers'],
		}),

		deleteVolunteer: build.mutation<VolunteersRes, number | string>({
			query: (id) => ({
				url: `/volunteers/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Volunteers'],
		}),

		// ====== materials ====== //

		getAllMaterials: build.query<MaterialsRes, void>({
			query: () => '/materials',
			providesTags: ['Materials']
		}),

		addMaterial: build.mutation<MaterialsRes, CreateMaterialRequest>({
			query: (materialsData) => ({
				url: '/materials',
				method: 'POST',
				body: materialsData,
			}),
			invalidatesTags: ['Materials'],
		}),

		updateMaterial: build.mutation<MaterialsRes, { id: number | string; data: Partial<CreateMaterialRequest> }>({
			query: ({ id, data }) => ({
				url: `/materials/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Materials'],
		}),

		deleteMaterial: build.mutation<MaterialsRes, number | string>({
			query: (id) => ({
				url: `/materials/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Materials'],
		}),

		// ====== collections ====== //

		getAllCollections: build.query<CollectionsRes, void>({
			query: () => '/collections',
			providesTags: ['Collections']
		}),

		addCollection: build.mutation<SingleCollectionRes, CreateCollectionRequest>({
			query: (collectionData) => ({
				url: '/collections',
				method: 'POST',
				body: collectionData,
			}),
			invalidatesTags: ['Collections'],
		}),

		updateCollection: build.mutation<SingleCollectionRes, { id: number | string; data: UpdateCollectionRequest }>({
			query: ({ id, data }) => ({
				url: `/collections/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Collections'],
		}),

		deleteCollection: build.mutation<SingleCollectionRes, number | string>({
			query: (id) => ({
				url: `/collections/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Collections'],
		}),

		// ====== QR assign collection ====== //

		assignCollection: build.mutation<AssignCollectionResponse, AssignCollectionRequest>({
			query: (body) => ({
				url: '/qrcode-scanner/assign-collection',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Collections'],
		}),
	})

});

export const {

	useGetAllVolunteersQuery, 
	useImportVolunteersFileMutation,
	useAddVolunteerMutation,
	useUpdateVolunteerMutation,
	useDeleteVolunteerMutation,

	useGetAllMaterialsQuery,
	useAddMaterialMutation,
	useUpdateMaterialMutation,
	useDeleteMaterialMutation,

	useGetAllCollectionsQuery,
	useAddCollectionMutation,
	useUpdateCollectionMutation,
	useDeleteCollectionMutation,

	useAssignCollectionMutation,

} = materialsApi;