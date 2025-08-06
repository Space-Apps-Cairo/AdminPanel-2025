export type Schedule = {
    id: number
    date: string
    start_time: string
    end_time: string
    capacity: number
    available_slots: number
    available_slots_on_site: number
}

export type Workshop = {
    id: number
    title: string
    description: string
    start_date: string
    end_date: string
    created_at: string
    schedules: Schedule[]
}

export type WorkshopRes = {
    success: boolean
    message: string
    status: number
    data: Workshop[]
}