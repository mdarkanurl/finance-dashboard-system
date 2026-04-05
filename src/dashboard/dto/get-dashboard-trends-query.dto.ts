import { z } from 'zod';

export const getDashboardTrendsQuerySchema = z.object({
  range: z.enum(['weekly', 'monthly']),
});

export type GetDashboardTrendsQueryDto = z.infer<typeof getDashboardTrendsQuerySchema>;
