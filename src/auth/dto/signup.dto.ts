import { z } from "zod";

export const signupZodSchema = z.object({
    fullname: z.string().trim().min(3),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).max(128),
});

export type SignupZodSchemaDto = z.infer<typeof signupZodSchema>;
