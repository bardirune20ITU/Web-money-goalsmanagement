import { useState } from 'react';
import { useAppStore } from '../store';
import { TransactionSchema } from '../types';
import { formatCurrency, monthlyCashFlow } from '../utils';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import AnimatedIcon from '../components/AnimatedIcon';
import { Plus, Trash2 } from 'lucide-react';

type FormState = {
  type: 'income' | 'expense';
  amount: string;
  date: string;
  category: string;
  note?: string;
};

const todayISO = new Date().toISOString().slice(0, 10);

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction } = useAppStore();
  const [form, setForm] = useState<FormState>({
    type: 'income',
    amount: '',
    date: todayISO,
    category: '',
    note: ''
  });

  const flow = monthlyCashFlow(transactions);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = TransactionSchema.safeParse({
      id: 'temp',
      type: form.type,
      amount: Number(form.amount),
      date: form.date,
      category: form.category.trim(),
      note: form.note?.trim() || undefined
    });
    if (!parsed.success) return;
    const { id: _omit, ...tx } = parsed.data;
    addTransaction(tx);
    setForm((f) => ({ ...f, amount: '', category: '', note: '' }));
  }

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="glass p-5 rounded-xl grid sm:grid-cols-5 gap-3 items-end">
        <div className="sm:col-span-1">
          <label className="text-sm text-white/70">Type</label>
          <select
            className="mt-1 w-full glass p-2 rounded-lg bg-white/5"
            value={form.type}
            onChange={(e) => setForm((s) => ({ ...s, type: e.target.value as FormState['type'] }))}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="sm:col-span-1">
          <label className="text-sm text-white/70">Amount</label>
          <input
            type="number"
            step="0.01"
            className="mt-1 w-full glass p-2 rounded-lg bg-white/5"
            value={form.amount}
            onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))}
            required
            min={0.01}
          />
        </div>
        <div className="sm:col-span-1">
          <label className="text-sm text-white/70">Date</label>
          <input
            type="date"
            className="mt-1 w-full glass p-2 rounded-lg bg-white/5"
            value={form.date}
            onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
            required
          />
        </div>
        <div className="sm:col-span-1">
          <label className="text-sm text-white/70">Category</label>
          <input
            className="mt-1 w-full glass p-2 rounded-lg bg-white/5"
            value={form.category}
            onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
            placeholder="Salary, Rent, Food..."
            required
          />
        </div>
        <div className="sm:col-span-1">
          <button
            type="submit"
            className="w-full glass p-2 rounded-lg bg-gradient-to-r from-brand-500 to-emerald-500 hover:opacity-90 transition"
          >
            <div className="flex items-center justify-center gap-2">
              <AnimatedIcon>
                <Plus className="w-5 h-5" />
              </AnimatedIcon>
              Add
            </div>
          </button>
        </div>
        <div className="sm:col-span-5">
          <input
            className="mt-1 w-full glass p-2 rounded-lg bg-white/5"
            value={form.note}
            onChange={(e) => setForm((s) => ({ ...s, note: e.target.value }))}
            placeholder="Note (optional)"
          />
        </div>
      </form>

      <div className="glass p-5 rounded-xl">
        <div className="flex flex-wrap gap-6 text-sm text-white/80 mb-4">
          <div>Income: <span className="font-medium">{formatCurrency(flow.income)}</span></div>
          <div>Expense: <span className="font-medium">{formatCurrency(flow.expense)}</span></div>
          <div>Net: <span className="font-medium">{formatCurrency(flow.net)}</span></div>
        </div>
        {transactions.length === 0 ? (
          <div className="text-white/70">No transactions yet.</div>
        ) : (
          <div className="space-y-2">
            {transactions.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                className="glass p-3 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      t.type === 'income' ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <div className="font-medium">{t.category}</div>
                  <div className="text-white/60 text-sm">{format(parseISO(t.date), 'MMM d')}</div>
                  {t.note && <div className="text-white/60 text-sm">• {t.note}</div>}
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`font-semibold ${
                      t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </div>
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="p-2 rounded-lg hover:bg-white/10"
                    aria-label="Delete"
                    title="Delete"
                  >
                    <AnimatedIcon>
                      <Trash2 className="w-5 h-5 text-white/70" />
                    </AnimatedIcon>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

