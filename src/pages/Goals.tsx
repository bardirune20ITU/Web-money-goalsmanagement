import { useState } from 'react';
import { useAppStore } from '../store';
import { GoalSchema } from '../types';
import { computeRequiredSavingsThisMonth, formatCurrency } from '../utils';
import GoalProgress from '../components/GoalProgress';
import AnimatedIcon from '../components/AnimatedIcon';
import { Plus, Coins, Trash2 } from 'lucide-react';
import { parseISO } from 'date-fns';

type FormState = {
  name: string;
  targetAmount: string;
  targetDate: string;
};

const nextMonthISO = (() => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
})();

export default function Goals() {
  const { goals, addGoal, contributeToGoal, deleteGoal } = useAppStore();
  const [form, setForm] = useState<FormState>({ name: '', targetAmount: '', targetDate: nextMonthISO });
  const [contrib, setContrib] = useState<Record<string, string>>({});

  const { totalRequired } = computeRequiredSavingsThisMonth(goals);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = GoalSchema.safeParse({
      id: 'temp',
      name: form.name.trim(),
      targetAmount: Number(form.targetAmount),
      targetDate: form.targetDate,
      savedAmount: 0
    });
    if (!parsed.success) return;
    addGoal({ name: parsed.data.name, targetAmount: parsed.data.targetAmount, targetDate: parsed.data.targetDate });
    setForm({ name: '', targetAmount: '', targetDate: nextMonthISO });
  }

  function onContribute(id: string) {
    const amount = Number(contrib[id] || 0);
    if (amount > 0) {
      contributeToGoal(id, amount);
      setContrib((c) => ({ ...c, [id]: '' }));
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass p-5 rounded-xl">
        <div className="text-white/70 text-sm mb-2">Required savings this month</div>
        <div className="text-3xl font-semibold">{formatCurrency(totalRequired)}</div>
      </div>

      <form onSubmit={submit} className="glass p-5 rounded-xl grid sm:grid-cols-5 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="text-sm text-white/70">Goal name</label>
          <input
            className="mt-1 w-full glass p-2 rounded-lg bg-white/5"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            placeholder="New laptop, Vacation…"
            required
          />
        </div>
        <div className="sm:col-span-1">
          <label className="text-sm text-white/70">Target amount</label>
          <input
            type="number"
            step="0.01"
            className="mt-1 w-full glass p-2 rounded-lg bg-white/5"
            value={form.targetAmount}
            onChange={(e) => setForm((s) => ({ ...s, targetAmount: e.target.value }))}
            required
            min={0.01}
          />
        </div>
        <div className="sm:col-span-1">
          <label className="text-sm text-white/70">Target date</label>
          <input
            type="date"
            className="mt-1 w-full glass p-2 rounded-lg bg-white/5"
            value={form.targetDate}
            onChange={(e) => setForm((s) => ({ ...s, targetDate: e.target.value }))}
            required
          />
        </div>
        <div className="sm:col-span-1">
          <button
            type="submit"
            className="w-full glass p-2 rounded-lg bg-gradient-to-r from-brand-500 to-pink-500 hover:opacity-90 transition"
          >
            <div className="flex items-center justify-center gap-2">
              <AnimatedIcon>
                <Plus className="w-5 h-5" />
              </AnimatedIcon>
              Add Goal
            </div>
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {goals.length === 0 ? (
          <div className="glass p-6 rounded-xl text-white/70">No goals yet.</div>
        ) : (
          goals.map((g) => {
            const remaining = Math.max(0, g.targetAmount - g.savedAmount);
            const overdue = parseISO(g.targetDate) < new Date() && remaining > 0;
            return (
              <div key={g.id} className="glass p-5 rounded-xl space-y-3">
                <GoalProgress goal={g} />
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div className="text-sm text-white/70">
                    Remaining: <span className="font-medium text-white">{formatCurrency(remaining)}</span>
                    {overdue && <span className="ml-2 text-rose-400">Overdue</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      className="glass p-2 rounded-lg bg-white/5 w-40"
                      placeholder="Add contribution"
                      value={contrib[g.id] ?? ''}
                      onChange={(e) => setContrib((c) => ({ ...c, [g.id]: e.target.value }))}
                    />
                    <button
                      onClick={() => onContribute(g.id)}
                      className="glass p-2 rounded-lg bg-emerald-500/90 hover:bg-emerald-500 transition"
                      type="button"
                    >
                      <div className="flex items-center gap-2">
                        <AnimatedIcon>
                          <Coins className="w-5 h-5" />
                        </AnimatedIcon>
                        Contribute
                      </div>
                    </button>
                    <button
                      onClick={() => deleteGoal(g.id)}
                      className="glass p-2 rounded-lg hover:bg-white/10 transition"
                      title="Delete goal"
                    >
                      <AnimatedIcon>
                        <Trash2 className="w-5 h-5 text-white/70" />
                      </AnimatedIcon>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

