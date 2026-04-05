import { RecordType } from '@prisma/client';
import { z } from 'zod';

export const createRecordSchema = z.object({
  amount: z.coerce.number().int().positive(),
  type: z.nativeEnum(RecordType, { message: 'Type is required' }),
  category: z.string({ message: 'Category is required' }).trim().min(1),
  note: z.string({ message: 'Note is required' }).trim().min(1).max(255).optional(),
});

export type CreateRecordDto = z.infer<typeof createRecordSchema>;
