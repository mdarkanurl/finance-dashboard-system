import { RecordType } from '@prisma/client';
import { z } from 'zod';

export const getDashboardSummaryQuerySchema = z
  .object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    category: z.string().trim().min(1).optional()
  })
  .refine((data) => !data.from || !data.to || data.from <= data.to, {
    message: 'from date must be less than or equal to to date',
    path: ['from'],
  });

export type GetDashboardSummaryQueryDto = z.infer<typeof getDashboardSummaryQuerySchema>;
