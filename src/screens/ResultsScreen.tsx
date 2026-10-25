import { useState } from 'react';
import { Trophy, Zap, Target, Home, RefreshCw, Share2, MessageCircle, Link2, Check, Users, ChevronRight } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { Avatar } from '@/components/Avatar';

export function ResultsScreen({
  result,
  category,
  mode,
  isDaily,
  onPlayAgain,
  onHome,
}: {
  result: { score: number; correct: number; total: number; xp: number };
  category: string;
  mode: string;
  isDaily?: boolean;
  onPlayAgain: () => void;
  onHome: () => void;
}) {
  const { state } = useGame();
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const accuracy = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
  const isPerfect = result.correct === result.total;
  const isGood = accuracy >= 60;

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://clashiq.app';
  const shareText = `I just scored ${result.score} points in ClashIQ ${isDaily ? 'Daily Challenge' : `${mode} mode (${category})`}! ${result.correct}/${result.total} correct (${accuracy}% accuracy). Can you beat me? ${shareUrl}`;

  const rank = isPerfect ? 'Legendary!' : isGood ? 'Great job!' : 'Keep practicing!';
  const rankColor = isPerfect ? 'text-amber-400' : isGood ? 'text-cyan-400' : 'text-ink-400';

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'ClashIQ Score', text: shareText, url: shareUrl }).catch(() => {});
    } else {
      setShowShare((s) => !s);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 text-white flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isPerfect && (
          <>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-glow" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-glow" />
          </>
        )}
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full pb-8">
        {/* Trophy */}
        <div className="mb-6 animate-pop">
          <div className={`w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl ${
            isPerfect ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30' :
            isGood ? 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-cyan-500/30' :
            'bg-gradient-to-br from-ink-600 to-ink-700'
          }`}>
            <Trophy className="w-14 h-14 text-white" strokeWidth={2} />
          </div>
        </div>

        <h1 className={`text-3xl font-extrabold mb-1 ${rankColor}`}>{rank}</h1>
        <p className="text-ink-400 mb-8 text-sm">{isDaily ? 'Daily Challenge' : `${mode} mode · ${category}`}</p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          <StatCard icon={<Target className="w-5 h-5" />} label="Correct" value={`${result.correct}/${result.total}`} color="text-emerald-400" />
          <StatCard icon={<Zap className="w-5 h-5" />} label="Score" value={result.score} color="text-cyan-400" />
          <StatCard icon={<Trophy className="w-5 h-5" />} label="XP" value={`+${result.xp}`} color="text-amber-400" />
        </div>

        {/* Accuracy bar */}
        <div className="w-full glass-card p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-ink-300">Accuracy</span>
            <span className="text-sm font-bold">{accuracy}%</span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isPerfect ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                isGood ? 'bg-gradient-to-r from-cyan-400 to-blue-500' :
                'bg-gradient-to-r from-rose-400 to-red-500'
              }`}
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        {/* Player card */}
        <div className="w-full glass-card p-4 mb-6 flex items-center gap-3">
          <Avatar avatar={state.avatar} color={state.avatarColor} size="sm" />
          <div className="flex-1">
            <p className="font-bold text-sm">{state.playerName}</p>
            <p className="text-xs text-ink-400">Level {state.level} · {state.xp} XP</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-400">Streak</p>
            <p className="font-bold text-orange-400">{state.streak} day{state.streak !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Challenge a Friend */}
        <button
          onClick={() => {
            const text = `Challenge me on ClashIQ! ${shareUrl}`;
            if (navigator.share) {
              navigator.share({ title: 'ClashIQ Challenge', text, url: shareUrl }).catch(() => {});
            } else {
              navigator.clipboard?.writeText(text).catch(() => {});
            }
          }}
          className="btn-ghost w-full py-3.5 mb-3 flex items-center justify-center gap-2 text-sm font-semibold"
        >
          <Users className="w-4 h-4" /> Challenge a Friend
        </button>

        {/* Share Score */}
        <button
          onClick={handleNativeShare}
          className="btn-ghost w-full py-3.5 mb-3 flex items-center justify-center gap-2 text-sm font-semibold"
        >
          <Share2 className="w-4 h-4" /> Share Score
        </button>

        {showShare && !hasNativeShare && (
          <div className="grid grid-cols-2 gap-3 w-full mb-3 animate-slide-up">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-green-500 text-white text-sm font-semibold active:scale-95 transition"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </a>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white text-sm font-semibold active:scale-95 transition"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Link2 className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button onClick={onHome} className="btn-ghost py-3.5 flex items-center justify-center gap-2 text-sm font-semibold">
            <Home className="w-4 h-4" /> Home
          </button>
          {isDaily ? (
            <button onClick={onPlayAgain} className="btn-primary py-3.5 flex items-center justify-center gap-2 text-sm">
              <ChevronRight className="w-4 h-4" /> Back Home
            </button>
          ) : (
            <button onClick={onPlayAgain} className="btn-primary py-3.5 flex items-center justify-center gap-2 text-sm">
              <RefreshCw className="w-4 h-4" /> Play Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="glass-card p-3 flex flex-col items-center gap-1">
      <div className={color}>{icon}</div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-ink-400">{label}</p>
    </div>
  );
}
