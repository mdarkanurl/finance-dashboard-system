import { z } from "zod";
import { Role, Status } from "@prisma/client";

export const signupZodSchema = z.object({
    fullname: z.string().trim().min(3),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).max(128),
    role: z.nativeEnum(Role),
    status: z.nativeEnum(Status).default(Status.active)
});

export type SignupZodSchemaDto = z.infer<typeof signupZodSchema>;
