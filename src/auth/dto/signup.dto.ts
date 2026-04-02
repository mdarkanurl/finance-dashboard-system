import { z } from "zod";
import { Role, Status } from "@prisma/client";

export const signupZodSchema = z.object({
    fullname: z.string().min(3),
    email: z.email(),
    password: z.string().min(8).max(128),
    role: z.nativeEnum(Role),
    status: z.nativeEnum(Status)
});

export type signupZodSchemaDto = z.infer<typeof signupZodSchema>;
