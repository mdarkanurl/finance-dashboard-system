import { z } from 'zod';

export const updateRecordSchema = z.object({
  amount: z.coerce.number().int().positive().optional(),
  category: z.string().trim().min(1).optional(),
  note: z.string().trim().min(1).max(255).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: 'At least one field is required',
  },
);

export type UpdateRecordDto = z.infer<typeof updateRecordSchema>;
