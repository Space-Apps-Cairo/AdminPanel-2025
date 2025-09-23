import { z } from 'zod';

export const collectionValidationSchema = z.object({
    
    collection_name: z.string()
        .min(1, 'Collection name is required')
        .min(3, 'Collection name must be at least 3 characters')
        .max(200, 'Collection name must not exceed 200 characters')
        .trim(),

    total_quantity: z.coerce.number()
        .int('Total quantity must be a whole number')
        .min(1, 'Total quantity must be 1 or more')
        .max(100000, 'Total quantity must be less than 100000'),

    // إضافة used_quantity كحقل اختياري
    used_quantity: z.coerce.number()
        .int('Used quantity must be a whole number')
        .min(0, 'Used quantity cannot be negative')
        .optional(),

    max_per_user: z.coerce.number()
        .int('Max per user must be a whole number')
        .min(1, 'Max per user must be 1 or more')
        .max(1000, 'Max per user must be less than 1000'),

    materials: z.array(z.object({
        id: z.coerce.number()
            .int('Material ID must be a whole number')
            .min(1, 'No material selected'),
        
        quantity_used: z.coerce.number()
            .int('Quantity used must be a whole number')
            .min(1, 'Quantity used must be 1 or more')
            .max(10000, 'Quantity used must be less than 10000')
    }))
    .min(1, 'At least one material is required')
    .max(100, 'Cannot add more than 100 materials')

}).refine((data) => {
    return data.used_quantity === undefined || data.used_quantity <= data.total_quantity;
}, {
    message: "Used quantity cannot exceed total quantity",
    path: ["used_quantity"],
}).refine((data) => {
    return data.max_per_user <= data.total_quantity;
}, {
    message: "Max per user cannot exceed total quantity",
    path: ["max_per_user"],
}).refine((data) => {
    const totalUsedInMaterials = data.materials.reduce((sum, material) => {
        return sum + material.quantity_used;
    }, 0);
    
    return totalUsedInMaterials <= data.total_quantity;
}, {
    message: "Total quantity used in materials cannot exceed collection total quantity",
    path: ["materials"],
});