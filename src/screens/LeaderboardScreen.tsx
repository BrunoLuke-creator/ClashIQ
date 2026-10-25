import { useState, useEffect } from 'react';
import { Trophy, ArrowLeft, Crown } from 'lucide-react';
import { supabase, type LeaderboardEntry } from '@/lib/supabase';
import { useGame } from '@/context/GameContext';
import { Avatar } from '@/components/Avatar';

type Period = 'daily' | 'weekly' | 'alltime';

export function LeaderboardScreen({ onBack }: { onBack: () => void }) {
  const { state } = useGame();
  const [period, setPeriod] = useState<Period>('daily');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      const now = new Date();
      let since = new Date(now);
      if (period === 'daily') since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      else if (period === 'weekly') since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      else since = new Date(0);

      const { data } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .gte('created_at', since.toISOString())
        .order('score', { ascending: false })
        .limit(50);

      if (mounted) {
        setEntries(data ?? []);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [period]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 text-white pb-24">
      <div className="px-5 pt-6 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Leaderboard
          </h1>
        </div>

        {/* Period tabs */}
        <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-2xl">
          {(['daily', 'weekly', 'alltime'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
                period === p ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white' : 'text-ink-400'
              }`}
            >
              {p === 'alltime' ? 'All-Time' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-ink-400 mt-3">Loading rankings...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Trophy className="w-12 h-12 text-ink-600 mb-3" />
            <p className="text-sm text-ink-400">No scores yet for this period.</p>
            <p className="text-xs text-ink-500 mt-1">Play a game to claim the top spot!</p>
          </div>
        ) : (
          <>
            {/* Podium */}
            {top3.length >= 3 && (
              <div className="grid grid-cols-3 gap-2 mb-6 items-end">
                <PodiumCard entry={top3[1]} rank={2} height="h-24" />
                <PodiumCard entry={top3[0]} rank={1} height="h-32" />
                <PodiumCard entry={top3[2]} rank={3} height="h-20" />
              </div>
            )}

            {/* Rest of list */}
            <div className="space-y-2">
              {(top3.length < 3 ? entries : rest).map((entry, i) => {
                const rank = top3.length >= 3 ? i + 4 : i + 1;
                const isMe = entry.device_id === state.deviceId;
                return (
                  <div
                    key={entry.id}
                    className={`glass-card p-3 flex items-center gap-3 ${isMe ? 'border-cyan-400/40 bg-cyan-500/10' : ''}`}
                  >
                    <span className="w-6 text-center font-bold text-ink-400 text-sm">{rank}</span>
                    <Avatar avatar={entry.avatar as never} color={entry.avatar_color as never} size="sm" ring={false} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{entry.player_name}{isMe && ' (You)'}</p>
                      <p className="text-xs text-ink-400">{entry.category} · {entry.mode}</p>
                    </div>
                    <span className="font-bold text-cyan-400 text-sm">{entry.score}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PodiumCard({ entry, rank, height }: { entry: LeaderboardEntry; rank: number; height: string }) {
  const colors = {
    1: 'from-amber-400 to-orange-500',
    2: 'from-slate-300 to-slate-400',
    3: 'from-orange-400 to-amber-600',
  };
  return (
    <div className="flex flex-col items-center">
      <Avatar avatar={entry.avatar as never} color={entry.avatar_color as never} size="md" />
      <p className="text-xs font-semibold mt-1 truncate max-w-full">{entry.player_name}</p>
      <p className="text-xs text-cyan-400 font-bold">{entry.score}</p>
      <div className={`w-full ${height} mt-2 rounded-t-2xl bg-gradient-to-b ${colors[rank as 1 | 2 | 3]} flex items-start justify-center pt-2`}>
        {rank === 1 ? (
          <Crown className="w-5 h-5 text-white" />
        ) : (
          <span className="text-lg font-bold text-white">{rank}</span>
        )}
      </div>
    </div>
  );
}
