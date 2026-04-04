import { Role, Status } from '@prisma/client';
import { z } from 'zod';

export const createUserByAdminSchema = z.object({
  fullname: z.string({ message: "Name is required" }).trim().min(3),
  email: z.string({ message: "Email is required" }).trim().toLowerCase().email(),
  password: z.string({ message: "Password is required" }).min(8).max(128),
  role: z.nativeEnum(Role, { message: "Role is required" }),
  status: z.nativeEnum(Status, { message: "Status is required" }),
});

export type CreateUserByAdminDto = z.infer<typeof createUserByAdminSchema>;
