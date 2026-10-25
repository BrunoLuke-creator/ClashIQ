import { useState } from 'react';
import { Brain, ChevronRight, Sparkles } from 'lucide-react';
import { useGame, avatars, colors, type AvatarKey, type ColorKey } from '@/context/GameContext';
import { Avatar } from '@/components/Avatar';

export function Onboarding() {
  const { completeOnboarding } = useGame();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<AvatarKey>('fox');
  const [color, setColor] = useState<ColorKey>('cyan');

  const next = () => {
    if (step < 2) setStep(step + 1);
    else if (name.trim()) completeOnboarding(name.trim(), avatar, color);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 text-white flex flex-col">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-20 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-fuchsia-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative flex-1 flex flex-col px-6 py-10 max-w-md mx-auto w-full">
        {/* Progress dots */}
        <div className="flex gap-2 mb-10">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-cyan-400' : i < step ? 'w-4 bg-cyan-400/50' : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-8 shadow-2xl shadow-cyan-500/30 animate-float">
              <Brain className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-extrabold mb-3 tracking-tight">ClashIQ</h1>
            <p className="text-lg text-ink-300 mb-2">Where brains clash and legends rise</p>
            <p className="text-sm text-ink-400 max-w-xs">
              Test your knowledge across 9 categories, climb the leaderboards, and build your streak.
            </p>
            <div className="grid grid-cols-3 gap-3 mt-10 w-full">
              {[
                { icon: '🏆', label: 'Compete' },
                { icon: '🔥', label: 'Streaks' },
                { icon: '🧠', label: '9 Topics' },
              ].map((f) => (
                <div key={f.label} className="glass-card p-4 flex flex-col items-center gap-1">
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-xs text-ink-300">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex-1 flex flex-col justify-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">What should we call you?</h2>
            <p className="text-ink-400 mb-8 text-sm">Pick your player name. You can change it later.</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={16}
              className="w-full bg-white/10 border border-white/15 rounded-2xl px-5 py-4 text-lg text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              autoFocus
            />
            <p className="text-xs text-ink-500 mt-3">{name.length}/16 characters</p>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Choose your avatar</h2>
            <p className="text-ink-400 mb-6 text-sm">Pick an animal and a color combo.</p>

            <div className="flex justify-center mb-8">
              <Avatar avatar={avatar} color={color} size="xl" />
            </div>

            <p className="text-xs uppercase tracking-wider text-ink-400 mb-3 font-semibold">Animal</p>
            <div className="grid grid-cols-6 gap-2 mb-6">
              {avatars.map((a) => (
                <button
                  key={a.key}
                  onClick={() => setAvatar(a.key)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${
                    avatar === a.key ? 'bg-cyan-400/30 ring-2 ring-cyan-400 scale-105' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <AvatarEmoji avatar={a.key} />
                </button>
              ))}
            </div>

            <p className="text-xs uppercase tracking-wider text-ink-400 mb-3 font-semibold">Color</p>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setColor(c.key)}
                  className={`aspect-square rounded-xl bg-gradient-to-br ${c.class} transition-all ${
                    color === c.key ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer button */}
        <div className="pt-8">
          <button
            onClick={next}
            disabled={step === 2 && !name.trim()}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === 2 ? (
              <>
                <Sparkles className="w-5 h-5" /> Start Playing
              </>
            ) : (
              <>
                Continue <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function AvatarEmoji({ avatar }: { avatar: AvatarKey }) {
  const map: Record<AvatarKey, string> = { fox: '🦊', cat: '🐱', panda: '🐼', owl: '🦉', lion: '🦁', koala: '🐨' };
  return <span>{map[avatar]}</span>;
}
