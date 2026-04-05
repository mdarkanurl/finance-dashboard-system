import { z } from 'zod';

export const getDashboardRecentQuerySchema = z.object({
  limit: z.coerce.number().int().min(5).max(20).default(5),
});

export type GetDashboardRecentQueryDto = z.infer<typeof getDashboardRecentQuerySchema>;
