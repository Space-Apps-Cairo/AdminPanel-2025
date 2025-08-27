// ====== volunteers-types ====== //

export type Volunteer = {
	id: number | string
	full_name: string
	email: string
	phone?: string
	team: string
	volunteering_year: number
}

export type VolunteersRes = {
	success: boolean
	msg: string
	data: Volunteer[]
}

export type CreateVolunteerRequest = Omit<Volunteer, 'id' | 'created_at'>

export type ImportVolunteersRes = {
	success: boolean
	msg: string
	data: {
		volunteers: Volunteer[]
	}
}

// ====== materials-types ====== //

export type Material = {
	id: number | string 
	material_name: string
	total_quantity: number
	used_quantity?: number
}

export type MaterialsRes = {
	success: boolean
	msg: string
	data: Material[]
}

export type CreateMaterialRequest = Omit<Material, 'id' | 'created_at'>

// ====== collections-types ====== //

export type MaterialsForCollections = {
	id: number,
	quantity_used: number
}

// نوع البيانات المرسلة للـ API
export type CreateCollectionRequest = {
	collection_name: string
	total_quantity: number
	max_per_user: number
	materials: MaterialsForCollections[]
}

// نوع البيانات المرسلة للـ API في التحديث (مع used_quantity اختياري)
export type UpdateCollectionRequest = {
	collection_name: string
	total_quantity: number
	max_per_user: number
	materials: MaterialsForCollections[]
	used_quantity?: number
}

// نوع البيانات المستلمة من الـ API (مع pivot)
export type MaterialWithPivot = {
	id: number
	material_name: string
	total_quantity: number
	used_quantity: number
	created_at: string
	updated_at: string
	pivot: {
		collection_id: number
		material_id: number
		quantity_used: number
		created_at: string
		updated_at: string
	}
}

export type Collection = {
	id: number
	collection_name: string
	total_quantity: number
	used_quantity: number
	max_per_user: number
	created_at: string
	updated_at: string
	materials: MaterialWithPivot[]
}

export type CollectionsRes = {
	success: boolean
	status: number
	msg: string
	data: Collection[]
}

export type SingleCollectionRes = {
	success: boolean
	status: number
	msg: string
	data: Collection
}

// ====== assign-collection (QR) ====== //

export type AssignCollectionRequest = {
	user_id: string
	collection_id: number | string
}

export type AssignCollectionResponse = {
	success: boolean
	status: number
	data: {
		current_quantity: string
		allowed: number
	}
	msg: string
}