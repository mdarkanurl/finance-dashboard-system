import { z } from "zod";
import { Role, Status } from '@prisma/client';

export const getUsersQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),
  search: z.string().trim().optional(),
  role: z.nativeEnum(Role).optional(),
  status: z.nativeEnum(Status).optional(),
});

export type GetUsersQueryDto = z.infer<typeof getUsersQuerySchema>;
