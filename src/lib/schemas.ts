import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(100, 'Title must be 100 characters or less.'),
  description: z.string().min(1, 'Description is required.').max(500, 'Description must be 500 characters or less.'),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
