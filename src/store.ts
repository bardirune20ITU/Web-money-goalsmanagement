import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Transaction, Goal, AppData } from './types';

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // @ts-expect-error safe in modern browsers
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

interface AppState {
  transactions: Transaction[];
  goals: Goal[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  addGoal: (goal: Omit<Goal, 'id' | 'savedAmount'> & { savedAmount?: number }) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (id: string, amount: number) => void;

  replaceAll: (data: AppData) => void;
  resetAll: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      transactions: [],
      goals: [],

      addTransaction: (tx) =>
        set((s) => ({
          transactions: [{ id: newId(), ...tx }, ...s.transactions]
        })),

      updateTransaction: (id, tx) =>
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...tx } : t))
        })),

      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id)
        })),

      addGoal: (goal) =>
        set((s) => ({
          goals: [
            {
              id: newId(),
              name: goal.name,
              targetAmount: goal.targetAmount,
              targetDate: goal.targetDate,
              savedAmount: goal.savedAmount ?? 0
            },
            ...s.goals
          ]
        })),

      updateGoal: (id, goal) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...goal } : g))
        })),

      deleteGoal: (id) =>
        set((s) => ({
          goals: s.goals.filter((g) => g.id !== id)
        })),

      contributeToGoal: (id, amount) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id
              ? { ...g, savedAmount: Math.max(0, Math.min(g.targetAmount, g.savedAmount + Math.max(0, amount))) }
              : g
          )
        })),

      replaceAll: (data) => set(() => ({ transactions: data.transactions, goals: data.goals })),
      resetAll: () => set(() => ({ transactions: [], goals: [] }))
    }),
    {
      name: 'anifinance-store',
      version: 1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

