import { Home, Trophy, Store, User } from 'lucide-react';

export type Tab = 'home' | 'leaderboard' | 'shop' | 'profile';

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { id: 'leaderboard', icon: <Trophy className="w-5 h-5" />, label: 'Ranks' },
    { id: 'shop', icon: <Store className="w-5 h-5" />, label: 'Shop' },
    { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-md mx-auto px-4 pb-4">
        <div className="glass-card flex items-center justify-around p-2 rounded-3xl bg-ink-900/80">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all ${
                active === t.id ? 'bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-400' : 'text-ink-400'
              }`}
            >
              {t.icon}
              <span className="text-[10px] font-semibold">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
