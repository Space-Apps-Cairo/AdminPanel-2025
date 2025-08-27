import { z } from 'zod';

export const volunteerValidationSchema = z.object({
    
    full_name: z.string()
        .min(1, 'Full name is required')
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must not exceed 100 characters')
        .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, 'Full name can only contain letters and spaces')
        .trim(),

    email: z.email('Please enter a valid email address').trim(),

    phone: z.string()
        .min(1, 'Phone number is required')
        .regex(/^01[0125]\d{8}$/, 'Please enter a valid Egyptian phone number (e.g., 01121145178)')
        .length(11, 'Phone number must be exactly 11 digits')
        .trim(),

    team: z.string()
        .min(1, 'Team is required')
        .min(2, 'Team name must be at least 2 characters')
        .max(50, 'Team name must not exceed 50 characters')
        .trim(),

    volunteering_year: z.coerce.number()
        .int('Volunteering year must be a whole number')
        .min(2015, 'Volunteering year must be 2015 or later')
        .max(new Date().getFullYear() + 1, `Volunteering year cannot exceed ${new Date().getFullYear() + 1}`)
        .refine((year) => year <= new Date().getFullYear() + 1, "Volunteering year cannot be more than one year in the future"),

});