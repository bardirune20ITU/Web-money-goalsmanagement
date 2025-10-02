import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PiggyBank, Wallet, Target, Settings } from 'lucide-react';
import AnimatedIcon from './components/AnimatedIcon';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Goals from './pages/Goals';
import SettingsPage from './pages/Settings';

type Route = 'dashboard' | 'transactions' | 'goals' | 'settings';

const tabs: { key: Route; label: string; icon: React.ComponentType<any> }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: PiggyBank },
  { key: 'transactions', label: 'Transactions', icon: Wallet },
  { key: 'goals', label: 'Goals', icon: Target },
  { key: 'settings', label: 'Settings', icon: Settings }
];

export default function App() {
  const [route, setRoute] = useState<Route>('dashboard');

  return (
    <div className="bg-animated-gradient min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
        <header className="glass rounded-2xl p-5 sm:p-6 flex items-center justify-between shadow-glass">
          <div className="flex items-center gap-3">
            <AnimatedIcon>
              <PiggyBank className="w-7 h-7 text-brand-400" />
            </AnimatedIcon>
            <div>
              <div className="text-lg font-semibold tracking-tight">AniFinance</div>
              <div className="text-white/60 text-sm">Animated money manager</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {tabs.map((t) => {
              const ActiveIcon = t.icon;
              const active = route === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setRoute(t.key)}
                  className={`px-3 py-2 rounded-lg transition ${
                    active ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AnimatedIcon>
                      <ActiveIcon className={`w-5 h-5 ${active ? 'text-brand-400' : 'text-white/70'}`} />
                    </AnimatedIcon>
                    <span className={`text-sm ${active ? 'text-white' : 'text-white/80'}`}>{t.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </header>

        <main className="min-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={route}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            >
              {route === 'dashboard' && <Dashboard />}
              {route === 'transactions' && <Transactions />}
              {route === 'goals' && <Goals />}
              {route === 'settings' && <SettingsPage />}
            </motion.div>
          </AnimatePresence>
        </main>

        <nav className="sm:hidden fixed bottom-4 left-0 right-0 px-4">
          <div className="max-w-4xl mx-auto glass rounded-2xl p-2 flex items-center justify-around">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = route === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setRoute(t.key)}
                  className={`p-3 rounded-xl transition ${active ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  title={t.label}
                >
                  <AnimatedIcon>
                    <Icon className={`w-6 h-6 ${active ? 'text-brand-400' : 'text-white/70'}`} />
                  </AnimatedIcon>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

