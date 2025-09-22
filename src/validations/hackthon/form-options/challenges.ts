import { z } from 'zod';

export const challengeValidationSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title must not exceed 200 characters')
        .trim(),

    description: z.string()
        .min(1, 'Description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must not exceed 1000 characters')
        .trim(),

    difficulty_level_id: z.coerce.number()
        .int('Difficulty level must be selected')
        .min(1, 'Please select a difficulty level')
        .optional(),
});