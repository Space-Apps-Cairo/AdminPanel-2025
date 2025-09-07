import { z } from 'zod';

export const bootcampDetailsValidationSchema = z.object({
    
    name: z.string()
        .min(3, 'Bootcamp Name must be at least 3 characters')
        .max(200, 'Bootcamp Name must not exceed 200 characters')
        .trim(),

    date: z.coerce.string()
        .min(1, 'Date is required'),

    total_capacity: z.coerce.number()
        .int('Capacity must be a whole number')
        .min(1, 'Capacity must be 1 or more')
        .max(10000, 'Capacity must be less than 10000'),

});