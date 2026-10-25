import { useState } from 'react';
import { ArrowLeft, Coins, Gem, Zap, Flame, Trophy, Target, Star, Settings, Moon, Sun, Crown, Edit3 } from 'lucide-react';
import { useGame, avatars, colors, type AvatarKey, type ColorKey } from '@/context/GameContext';
import { Avatar } from '@/components/Avatar';

export function ProfileScreen({ onBack }: { onBack: () => void }) {
  const { state, toggleTheme, setState, level, xpInLevel, xpNeeded } = useGame();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(state.playerName);
  const [avatar, setAvatar] = useState<AvatarKey>(state.avatar);
  const [color, setColor] = useState<ColorKey>(state.avatarColor);

  const saveProfile = () => {
    setState((prev) => ({ ...prev, playerName: name.trim() || prev.playerName, avatar, avatarColor: color }));
    setEditing(false);
  };

  const categoriesPlayed = Object.keys(state.bestScores).length;
  const achievements = [
    { id: 'first-game', name: 'First Steps', desc: 'Play your first game', icon: '🎯', unlocked: state.gamesPlayed >= 1 },
    { id: 'streak-3', name: 'On Fire', desc: '3-day streak', icon: '🔥', unlocked: state.streak >= 3 },
    { id: 'level-5', name: 'Rising Star', desc: 'Reach level 5', icon: '⭐', unlocked: state.level >= 5 },
    { id: 'games-10', name: 'Dedicated', desc: 'Play 10 games', icon: '🎮', unlocked: state.gamesPlayed >= 10 },
    { id: 'correct-50', name: 'Know-It-All', desc: '50 correct answers', icon: '🧠', unlocked: state.totalCorrect >= 50 },
    { id: 'explorer', name: 'Explorer', desc: 'Try 3 categories', icon: '🧭', unlocked: categoriesPlayed >= 3 },
    { id: 'visual', name: 'Visual Thinker', desc: 'Play a Visual IQ game', icon: '👁️', unlocked: 'visualiq' in state.bestScores },
    { id: 'sharp', name: 'Sharpshooter', desc: '100 correct answers', icon: '🏹', unlocked: state.totalCorrect >= 100 },
    { id: 'premium', name: 'VIP', desc: 'Get Premium', icon: '👑', unlocked: state.premium },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 text-white pb-24">
      <div className="px-5 pt-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Profile</h1>
          </div>
          <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition">
            {state.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Profile header */}
        <div className="glass-card p-5 mb-5 flex flex-col items-center text-center">
          <div className="relative">
            <Avatar avatar={state.avatar} color={state.avatarColor} size="xl" />
            <button
              onClick={() => setEditing(true)}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center shadow-lg"
            >
              <Edit3 className="w-4 h-4 text-ink-950" />
            </button>
          </div>
          <h2 className="text-xl font-bold mt-3">{state.playerName}</h2>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-sm text-ink-400">Level {level}</span>
            {state.premium && <Crown className="w-4 h-4 text-amber-400" />}
          </div>
          <div className="w-full mt-3">
            <div className="flex justify-between text-xs text-ink-400 mb-1">
              <span>{xpInLevel} XP</span>
              <span>{xpNeeded} XP</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all" style={{ width: `${(xpInLevel / xpNeeded) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Edit panel */}
        {editing && (
          <div className="glass-card p-5 mb-5 animate-slide-up">
            <h3 className="font-bold mb-3">Edit Profile</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={16}
              className="w-full bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-4"
              placeholder="Player name"
            />
            <p className="text-xs text-ink-400 mb-2 font-semibold uppercase">Avatar</p>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {avatars.map((a) => (
                <button
                  key={a.key}
                  onClick={() => setAvatar(a.key)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-xl transition ${avatar === a.key ? 'bg-cyan-400/30 ring-2 ring-cyan-400' : 'bg-white/5'}`}
                >
                  <AvatarEmoji avatar={a.key} />
                </button>
              ))}
            </div>
            <p className="text-xs text-ink-400 mb-2 font-semibold uppercase">Color</p>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {colors.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setColor(c.key)}
                  className={`aspect-square rounded-xl bg-gradient-to-br ${c.class} transition ${color === c.key ? 'ring-2 ring-white' : 'opacity-70'}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setEditing(false)} className="btn-ghost py-3 text-sm font-semibold">Cancel</button>
              <button onClick={saveProfile} className="btn-primary py-3 text-sm">Save</button>
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatBox icon={<Flame className="w-5 h-5" />} label="Streak" value={state.streak} color="text-orange-400" />
          <StatBox icon={<Trophy className="w-5 h-5" />} label="Games" value={state.gamesPlayed} color="text-amber-400" />
          <StatBox icon={<Target className="w-5 h-5" />} label="Correct" value={state.totalCorrect} color="text-emerald-400" />
          <StatBox icon={<Star className="w-5 h-5" />} label="Level" value={level} color="text-cyan-400" />
        </div>

        {/* Currency */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <CurrencyBox icon={<Coins className="w-5 h-5" />} label="Coins" value={state.coins} color="text-amber-400" />
          <CurrencyBox icon={<Gem className="w-5 h-5" />} label="Gems" value={state.gems} color="text-fuchsia-400" />
          <CurrencyBox icon={<Zap className="w-5 h-5" />} label="Energy" value={`${state.energy}/${state.maxEnergy}`} color="text-cyan-400" />
        </div>

        {/* Achievements */}
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> Achievements
        </h3>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`glass-card p-3 flex flex-col items-center text-center gap-1 ${a.unlocked ? '' : 'opacity-40 grayscale'}`}
            >
              <span className="text-2xl">{a.icon}</span>
              <p className="text-xs font-semibold">{a.name}</p>
              <p className="text-[10px] text-ink-400 leading-tight">{a.desc}</p>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-ink-400" />
            <span className="text-sm font-semibold">Dark Mode</span>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-12 h-7 rounded-full transition relative ${state.theme === 'dark' ? 'bg-cyan-400' : 'bg-white/20'}`}
          >
            <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${state.theme === 'dark' ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  return (
    <div className="glass-card p-4 flex items-center gap-3">
      <div className={color}>{icon}</div>
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-xs text-ink-400">{label}</p>
      </div>
    </div>
  );
}

function CurrencyBox({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  return (
    <div className="glass-card p-3 flex flex-col items-center gap-1">
      <div className={color}>{icon}</div>
      <p className="text-sm font-bold">{value}</p>
      <p className="text-xs text-ink-400">{label}</p>
    </div>
  );
}

function AvatarEmoji({ avatar }: { avatar: AvatarKey }) {
  const map: Record<AvatarKey, string> = { fox: '🦊', cat: '🐱', panda: '🐼', owl: '🦉', lion: '🦁', koala: '🐨' };
  return <span>{map[avatar]}</span>;
}
