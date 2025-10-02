import { endOfMonth, startOfMonth, differenceInCalendarMonths, isAfter, parseISO, isBefore } from 'date-fns';
import type { Transaction, Goal } from './types';

export function formatCurrency(value: number, currency: string = 'USD', locale = 'en-US'): string {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

export function getMonthRange(date = new Date()): { start: Date; end: Date } {
  return { start: startOfMonth(date), end: endOfMonth(date) };
}

export function isInMonth(dateISO: string, date = new Date()): boolean {
  const { start, end } = getMonthRange(date);
  const d = parseISO(dateISO);
  return !isBefore(d, start) && !isAfter(d, end);
}

export function monthlyCashFlow(transactions: Transaction[], date = new Date()): {
  income: number;
  expense: number;
  net: number;
} {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (!isInMonth(t.date, date)) continue;
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, net: income - expense };
}

export type GoalPlan = {
  goalId: string;
  name: string;
  remaining: number;
  monthsRemaining: number;
  requiredThisMonth: number;
  overdue: boolean;
  completed: boolean;
};

export function computeRequiredSavingsThisMonth(goals: Goal[], today = new Date()): {
  perGoal: GoalPlan[];
  totalRequired: number;
} {
  const perGoal: GoalPlan[] = goals.map((g) => {
    const remaining = Math.max(0, g.targetAmount - g.savedAmount);
    const monthsRemaining =
      differenceInCalendarMonths(endOfMonth(parseISO(g.targetDate)), endOfMonth(today)) + 1;
    const overdue = monthsRemaining <= 0 && remaining > 0;
    const completed = remaining === 0;
    const requiredThisMonth =
      !completed && monthsRemaining > 0 ? remaining / monthsRemaining : 0;
    return {
      goalId: g.id,
      name: g.name,
      remaining,
      monthsRemaining: Math.max(0, monthsRemaining),
      requiredThisMonth,
      overdue,
      completed
    };
  });
  const totalRequired = perGoal.reduce((s, p) => s + p.requiredThisMonth, 0);
  return { perGoal, totalRequired };
}

