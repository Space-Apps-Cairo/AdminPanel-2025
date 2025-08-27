import { z } from 'zod';

export const materialValidationSchema = z.object({
    
    material_name: z.string()
        .min(3, 'Material Name must be at least 3 characters')
        .max(200, 'Material Name must not exceed 200 characters')
        .trim(),

    total_quantity: z.coerce.number()
        .int('Quantity must be a whole number')
        .min(1, 'Quantity must be 1 or more')
        .max(10000, 'Quantity must be less than 10000'),

    used_quantity: z.coerce.number()
        .int('Used Quantity must be a whole number')
        .min(0, 'Used Quantity cannot be negative')
        .max(10000, 'Quantity must be less than 10000')
        .optional(),

}).refine((data) => {
    if (data.used_quantity !== undefined) {
        return data.used_quantity <= data.total_quantity;
    }
    return true;
}, {
    message: 'Used quantity cannot be greater than total quantity',
    path: ['used_quantity'],
});