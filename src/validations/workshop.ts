import z from "zod";

export const workshopValidationSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be at most 100 characters")
        .trim(),
    
    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must be at most 500 characters")
        .trim(),
    
    start_date: z
        .string()
        .min(1, "Start date is required")
        .refine((date) => {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        }, "Start date must be today or in the future"),
    
    end_date: z
        .string()
        .min(1, "End date is required")
}).refine((data) => {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    return endDate >= startDate;
}, {
    message: "End date must be after or equal to start date",
    path: ["end_date"]
});