import { Role, Status } from '@prisma/client';
import { z } from 'zod';

export const updateUserByAdminSchema = z.object({
  fullname: z.string().trim().min(3).optional(),
  role: z.nativeEnum(Role).optional(),
  status: z.nativeEnum(Status).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: 'At least one field is required',
  },
);

export type UpdateUserByAdminDto = z.infer<typeof updateUserByAdminSchema>;
