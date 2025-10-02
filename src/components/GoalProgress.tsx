import { motion } from 'framer-motion';
import type { Goal } from '../types';
import { formatCurrency } from '../utils';

type Props = {
  goal: Goal;
};

export default function GoalProgress({ goal }: Props) {
  const pct = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100 || 0));
  return (
    <div className="glass p-4 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{goal.name}</div>
        <div className="text-sm text-white/70">
          {formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}
        </div>
      </div>
      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 140, damping: 18 }}
          className="h-full bg-gradient-to-r from-brand-400 to-emerald-400"
        />
      </div>
    </div>
  );
}

