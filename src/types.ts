import { z } from 'zod';

export const TransactionType = z.enum(['income', 'expense']);

export const TransactionSchema = z.object({
  id: z.string(),
  type: TransactionType,
  amount: z.number().positive(),
  date: z.string(),
  category: z.string().min(1),
  note: z.string().optional()
});
export type Transaction = z.infer<typeof TransactionSchema>;

export const GoalSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  targetDate: z.string(),
  savedAmount: z.number().min(0)
});
export type Goal = z.infer<typeof GoalSchema>;

export const DataSchema = z.object({
  transactions: z.array(TransactionSchema),
  goals: z.array(GoalSchema)
});
export type AppData = z.infer<typeof DataSchema>;

