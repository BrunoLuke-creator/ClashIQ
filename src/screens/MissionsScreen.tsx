import { ArrowLeft, Target, Check, Coins, ChevronRight } from 'lucide-react';
import { useGame } from '@/context/GameContext';

export function MissionsScreen({ onBack }: { onBack: () => void }) {
  const { state, claimMission } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 text-white pb-24">
      <div className="px-5 pt-6 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" /> Daily Missions
          </h1>
        </div>

        <p className="text-sm text-ink-400 mb-5">Complete missions to earn coins. New missions refresh every day!</p>

        <div className="space-y-3">
          {state.missions.map((m) => {
            const pct = Math.min(100, (m.progress / m.target) * 100);
            return (
              <div key={m.id} className="glass-card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm">{m.title}</p>
                    <p className="text-xs text-ink-400">{m.description}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-400/15 px-2.5 py-1 rounded-full">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400">{m.reward}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${m.completed ? 'bg-emerald-400' : 'bg-gradient-to-r from-cyan-400 to-blue-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-ink-400 font-medium whitespace-nowrap">
                    {Math.min(m.progress, m.target)}/{m.target}
                  </span>
                </div>
                {m.completed && (
                  <button
                    onClick={() => claimMission(m.id)}
                    disabled={m.claimed}
                    className={`w-full mt-3 py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 ${
                      m.claimed ? 'bg-white/5 text-ink-500' : 'bg-gradient-to-r from-emerald-400 to-green-500 text-white'
                    }`}
                  >
                    {m.claimed ? (
                      <><Check className="w-4 h-4" /> Claimed</>
                    ) : (
                      <>Claim Reward <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>


      </div>
    </div>
  );
}
