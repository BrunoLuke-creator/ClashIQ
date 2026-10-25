import { Flame, Coins, Gem, ChevronRight, Gift, Target, Play, CalendarCheck, Users, Sparkles, Cpu, Stethoscope, CircleDot, Music, Clapperboard, TrendingUp, Globe2, Star, Eye, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { categories, type CategoryId } from '@/data/questions';
import { Avatar } from '@/components/Avatar';
import { isDailyChallengeCompleted, getDailyChallengeResult, challengeDate, DAILY_CHALLENGE_COUNT } from '@/data/dailyChallenge';

const iconMap: Record<string, LucideIcon> = {
  Cpu, Stethoscope, CircleDot, Music, Clapperboard, TrendingUp, Globe2, Sparkles, Star, Eye,
};

function CategoryIcon({ name }: { name: string }) {
  const Icon = iconMap[name] ?? Star;
  return <Icon className="w-6 h-6 text-white" strokeWidth={2} />;
}

export function HomeScreen({
  onPlay,
  onDailyChallenge,
  onSpin,
  onMissions,
  onLeaderboard,
  onShop,
  onProfile,
}: {
  onPlay: (category: CategoryId | 'mixed') => void;
  onDailyChallenge: () => void;
  onSpin: () => void;
  onMissions: () => void;
  onLeaderboard: () => void;
  onShop: () => void;
  onProfile: () => void;
}) {
  const { state, levelProgress, level } = useGame();
  const canSpin = Date.now() - state.lastSpin >= 24 * 60 * 60 * 1000;
  const completedMissions = state.missions.filter((m) => m.completed && !m.claimed).length;
  const today = challengeDate();
  const dailyDone = isDailyChallengeCompleted(today);
  const dailyResult = getDailyChallengeResult(today);

  const friendChallengeUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareFriendChallenge = () => {
    const text = `Challenge me on ClashIQ! Play and see if you can beat my score. ${friendChallengeUrl}`;
    if (navigator.share) {
      navigator.share({ title: 'ClashIQ Challenge', text, url: friendChallengeUrl }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 text-white pb-24">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative px-5 pt-6 max-w-md mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={onProfile} className="flex items-center gap-3 active:scale-95 transition">
            <Avatar avatar={state.avatar} color={state.avatarColor} size="sm" />
            <div className="text-left">
              <p className="font-bold text-sm">{state.playerName}</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-ink-400">Lv {level}</span>
                <div className="w-16 h-1 bg-white/10 rounded-full ml-1 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${levelProgress * 100}%` }} />
                </div>
              </div>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <Currency icon={<Coins className="w-4 h-4" />} value={state.coins} />
            <Currency icon={<Gem className="w-4 h-4" />} value={state.gems} color="text-fuchsia-400" />
          </div>
        </div>

        {/* Compact progress section */}
        <div className="glass-card p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">{state.streak} day streak</p>
              <p className="text-[10px] text-ink-400">{state.gamesPlayed} games · {state.totalCorrect} correct</p>
            </div>
          </div>
          {completedMissions > 0 && (
            <button onClick={onMissions} className="flex items-center gap-1 text-xs font-semibold text-amber-400 active:scale-95 transition">
              <Gift className="w-4 h-4" /> {completedMissions} reward{completedMissions !== 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* PLAY NOW — primary action */}
        <button
          onClick={() => onPlay('mixed')}
          className="w-full mb-4 rounded-3xl bg-gradient-to-r from-cyan-400 to-blue-500 p-5 flex items-center justify-between shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition"
        >
          <div className="text-left">
            <p className="text-lg font-extrabold">Play Now</p>
            <p className="text-xs text-white/80">8 mixed questions · any category</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </button>

        {/* Daily Challenge card */}
        <button
          onClick={onDailyChallenge}
          disabled={dailyDone}
          className={`w-full mb-4 rounded-3xl p-5 flex items-center justify-between transition active:scale-[0.98] ${
            dailyDone
              ? 'bg-white/5 border border-white/10 opacity-70'
              : 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border border-violet-400/25'
          }`}
        >
          <div className="flex items-center gap-3 text-left">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${dailyDone ? 'bg-emerald-500/20' : 'bg-gradient-to-br from-violet-400 to-fuchsia-500'}`}>
              {dailyDone ? <Check className="w-6 h-6 text-emerald-400" /> : <CalendarCheck className="w-6 h-6 text-white" />}
            </div>
            <div>
              <p className="font-bold text-sm">Daily Challenge</p>
              <p className="text-xs text-ink-400">
                {dailyDone && dailyResult
                  ? `Completed · ${dailyResult.correct}/${dailyResult.total} correct`
                  : `${DAILY_CHALLENGE_COUNT} questions · same for everyone today`}
              </p>
            </div>
          </div>
          {!dailyDone && <ChevronRight className="w-5 h-5 text-ink-400" />}
        </button>

        {/* Secondary actions: Friends & Spin */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={shareFriendChallenge}
            className="glass-card p-4 flex flex-col items-center gap-1.5 active:scale-95 transition"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="font-semibold text-sm">Play with Friends</p>
            <p className="text-xs text-ink-400">Send a challenge link</p>
          </button>
          <button
            onClick={onSpin}
            className={`glass-card p-4 flex flex-col items-center gap-1.5 active:scale-95 transition relative ${
              canSpin ? 'border-cyan-400/40' : 'opacity-60'
            }`}
          >
            {canSpin && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" />}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <p className="font-semibold text-sm">Lucky Spin</p>
            <p className="text-xs text-ink-400">{canSpin ? 'Ready!' : '24h cooldown'}</p>
          </button>
        </div>

        {/* Explore Categories */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Explore Categories</h2>
          <button onClick={onLeaderboard} className="text-xs text-cyan-400 font-semibold flex items-center gap-0.5">
            Leaderboard <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onPlay(cat.id)}
              className="glass-card p-3 flex flex-col items-center gap-2 active:scale-95 transition group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg group-active:scale-90 transition`}>
                <CategoryIcon name={cat.icon} />
              </div>
              <span className="text-xs font-semibold text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Shop teaser */}
        <button onClick={onShop} className="w-full glass-card p-4 mt-5 flex items-center justify-between active:scale-[0.98] transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Shop & Power-Ups</p>
              <p className="text-xs text-ink-400">Buy hints, 50/50, and extra time</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-400" />
        </button>

        {/* Missions teaser */}
        <button onClick={onMissions} className="w-full glass-card p-4 mt-3 flex items-center justify-between active:scale-[0.98] transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Daily Missions</p>
              <p className="text-xs text-ink-400">{state.missions.filter((m) => !m.completed).length} active · {completedMissions} ready to claim</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-400" />
        </button>
      </div>
    </div>
  );
}

function Currency({ icon, value, color = 'text-amber-400' }: { icon: React.ReactNode; value: number; color?: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
      <span className={color}>{icon}</span>
      <span className="text-sm font-bold">{value.toLocaleString()}</span>
    </div>
  );
}
