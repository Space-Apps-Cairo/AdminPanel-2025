import { z } from 'zod';

export const workshopValidationSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must not exceed 100 characters')
        .trim(),

    description: z.string()
        .min(1, 'Description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must not exceed 500 characters')
        .trim(),

    start_date: z.coerce.date()
        .refine((date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
        }, "Start date must be today or in the future"),

    end_date: z.coerce.date(),

}).refine((data) => {
    return data.end_date >= data.start_date;
}, {
    message: "End date must be after or equal to start date",
    path: ["end_date"],
});