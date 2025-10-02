import { useRef } from 'react';
import { useAppStore } from '../store';
import { DataSchema } from '../types';
import { Download, Upload, RefreshCcw } from 'lucide-react';
import AnimatedIcon from '../components/AnimatedIcon';

export default function Settings() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { transactions, goals, replaceAll, resetAll } = useAppStore();

  function exportData() {
    const data = JSON.stringify({ transactions, goals }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anifinance-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importData(file: File) {
    const text = await file.text();
    const json = JSON.parse(text);
    const parsed = DataSchema.safeParse(json);
    if (!parsed.success) {
      alert('Invalid data file.');
      return;
    }
    replaceAll(parsed.data);
  }

  return (
    <div className="space-y-4">
      <div className="glass p-5 rounded-xl">
        <div className="text-white/80 mb-3">Data management</div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportData}
            className="glass px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-emerald-500 hover:opacity-90 transition"
          >
            <div className="flex items-center gap-2">
              <AnimatedIcon>
                <Download className="w-5 h-5" />
              </AnimatedIcon>
              Export JSON
            </div>
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            className="glass px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            <div className="flex items-center gap-2">
              <AnimatedIcon>
                <Upload className="w-5 h-5" />
              </AnimatedIcon>
              Import JSON
            </div>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importData(f);
              e.currentTarget.value = '';
            }}
          />
          <button
            onClick={resetAll}
            className="glass px-4 py-2 rounded-lg hover:bg-white/10 transition"
            title="Clear all local data"
          >
            <div className="flex items-center gap-2">
              <AnimatedIcon>
                <RefreshCcw className="w-5 h-5" />
              </AnimatedIcon>
              Reset data
            </div>
          </button>
        </div>
      </div>
      <div className="glass p-5 rounded-xl text-white/70">
        Your data is stored locally in your browser using localStorage. No cloud sync in this build.
      </div>
    </div>
  );
}

