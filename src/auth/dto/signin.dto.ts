import { z } from "zod";

export const signinZodSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).max(128),
});

export type SigninZodSchemaDto = z.infer<typeof signinZodSchema>;
