import { RecordType } from '@prisma/client';
import { z } from 'zod';

export const getRecordsQuerySchema = z.object({
  type: z.nativeEnum(RecordType).optional(),
  category: z.string().trim().min(1).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
}).refine(
  (data) => !data.from || !data.to || data.from <= data.to,
  {
    message: 'from date must be less than or equal to to date',
    path: ['from'],
  },
);

export type GetRecordsQueryDto = z.infer<typeof getRecordsQuerySchema>;
