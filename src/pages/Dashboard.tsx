import { PiggyBank, TrendingUp, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedIcon from '../components/AnimatedIcon';
import AnimatedNumber from '../components/AnimatedNumber';
import GoalProgress from '../components/GoalProgress';
import { useAppStore } from '../store';
import { computeRequiredSavingsThisMonth, monthlyCashFlow, formatCurrency } from '../utils';

export default function Dashboard() {
  const transactions = useAppStore((s) => s.transactions);
  const goals = useAppStore((s) => s.goals);

  const { totalRequired, perGoal } = computeRequiredSavingsThisMonth(goals);
  const flow = monthlyCashFlow(transactions);

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 shadow-glass bg-[radial-gradient(1200px_circle_at_0%_0%,rgba(30,138,255,.12),transparent_40%),radial-gradient(1000px_circle_at_100%_0%,rgba(255,64,129,.12),transparent_40%)]">
        <div className="flex items-center gap-3 mb-3">
          <AnimatedIcon>
            <PiggyBank className="w-7 h-7 text-brand-400" />
          </AnimatedIcon>
          <div className="text-white/70">Required savings this month</div>
        </div>
        <div className="text-4xl sm:text-5xl font-semibold tracking-tight">
          <AnimatedNumber value={formatCurrency(totalRequired)} />
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div className="glass p-4 rounded-xl flex items-center gap-3">
            <AnimatedIcon>
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </AnimatedIcon>
            <div>
              <div className="text-white/70 text-sm">Net cash flow this month</div>
              <div className="font-medium">{formatCurrency(flow.net)}</div>
            </div>
          </div>
          <div className="glass p-4 rounded-xl flex items-center gap-3">
            <AnimatedIcon>
              <Wallet className="w-6 h-6 text-pink-400" />
            </AnimatedIcon>
            <div>
              <div className="text-white/70 text-sm">Income / Expense</div>
              <div className="font-medium">
                {formatCurrency(flow.income)} / {formatCurrency(flow.expense)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 18 }}
        className="space-y-3"
      >
        <div className="text-white/70 text-sm">Goals progress</div>
        {goals.length === 0 && (
          <div className="glass p-6 rounded-xl text-white/70">
            No goals yet. Add one in the Goals tab to start planning.
          </div>
        )}
        {goals.map((g) => (
          <GoalProgress key={g.id} goal={g} />
        ))}
      </motion.div>
    </div>
  );
}

