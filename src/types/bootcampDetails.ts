export type BootcampDetailsType = {
    id: string | number
    name: string
    date: string
    total_capacity: number
    bootcamp_details_bootcamp_attendees?: any
    created_at?: string
    updated_at?: string
}

export type BootcampDetailsResponse = {
    success: boolean
    message: string
    status: number
    data: BootcampDetailsType[]
}

export type SingleBootcampDetailsResponse = {
    success: boolean
    message: string
    status: number
    data: BootcampDetailsType
}

export type BootcampDetailsRequest = Omit<BootcampDetailsType, "id" | "created_at" | "updated_at" | "bootcamp_details_bootcamp_attendees">
