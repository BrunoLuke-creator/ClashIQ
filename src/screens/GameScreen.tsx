import { useState, useEffect, useCallback, useRef } from 'react';
import { Lightbulb, SplitSquareHorizontal, Clock, X, Check, ImageOff } from 'lucide-react';
import { getQuestions, categoryById, type Question, type CategoryId } from '@/data/questions';
import { getDailyChallengeQuestions, challengeDate } from '@/data/dailyChallenge';
import { useGame, type GameMode } from '@/context/GameContext';

const QUESTION_TIME = 15;

export function GameScreen({
  category,
  mode,
  onExit,
  onFinish,
}: {
  category: CategoryId | 'mixed' | 'daily';
  mode: GameMode;
  onExit: () => void;
  onFinish: (result: { score: number; correct: number; total: number; xp: number }) => void;
}) {
  const { state, usePowerUp: applyPowerUp, recordGame } = useGame();
  const isDaily = category === 'daily';
  const cat = isDaily || category === 'mixed' ? null : categoryById(category);
  const [questions] = useState<Question[]>(() =>
    isDaily ? getDailyChallengeQuestions(challengeDate()) : getQuestions(category, 8)
  );
  const headerTitle = isDaily ? 'Daily Challenge' : cat ? cat.name : 'Mixed';
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [eliminated, setEliminated] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [extraTimeUsed, setExtraTimeUsed] = useState(false);
  const [streak, setStreak] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = questions[index];

  const finishGame = useCallback(
    (finalScore: number, finalCorrect: number) => {
      const xp = finalScore;
      recordGame({ score: finalScore, correct: finalCorrect, total: questions.length, category: isDaily ? 'mixed' : category, mode, xp });
      onFinish({ score: finalScore, correct: finalCorrect, total: questions.length, xp });
    },
    [recordGame, questions.length, category, isDaily, mode, onFinish]
  );

  const handleAnswer = useCallback(
    (choice: number) => {
      if (locked) return;
      setSelected(choice);
      setLocked(true);
      if (timerRef.current) clearInterval(timerRef.current);

      const isCorrect = choice === current.correctIndex;
      if (isCorrect) {
        const timeBonus = Math.max(0, timeLeft) * 5;
        const streakBonus = streak * 10;
        const gained = 50 + timeBonus + streakBonus;
        setScore((s) => s + gained);
        setCorrectCount((c) => c + 1);
        setStreak((s) => s + 1);
      } else {
        setStreak(0);
      }

      setTimeout(() => {
        if (index + 1 < questions.length) {
          setIndex((i) => i + 1);
          setSelected(null);
          setLocked(false);
          setEliminated([]);
          setShowHint(false);
          setExtraTimeUsed(false);
          setTimeLeft(QUESTION_TIME);
        } else {
          const finalScore = isCorrect
            ? score + 50 + Math.max(0, timeLeft) * 5 + streak * 10
            : score;
          const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
          finishGame(finalScore, finalCorrect);
        }
      }, 1400);
    },
    [locked, current, timeLeft, streak, index, questions.length, score, correctCount, finishGame]
  );

  useEffect(() => {
    if (locked) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setLocked(true);
          setStreak(0);
          setTimeout(() => {
            if (index + 1 < questions.length) {
              setIndex((i) => i + 1);
              setSelected(null);
              setLocked(false);
              setEliminated([]);
              setShowHint(false);
              setExtraTimeUsed(false);
              setTimeLeft(QUESTION_TIME);
            } else {
              finishGame(score, correctCount);
            }
          }, 1400);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, locked]);

  const handleHint = () => {
    if (applyPowerUp('hint')) setShowHint(true);
  };
  const handleFiftyFifty = () => {
    if (applyPowerUp('fiftyFifty')) {
      const wrong = current.options
        .map((_, i) => i)
        .filter((i) => i !== current.correctIndex);
      const toEliminate = wrong.sort(() => Math.random() - 0.5).slice(0, 2);
      setEliminated(toEliminate);
    }
  };
  const handleExtraTime = () => {
    if (!extraTimeUsed && applyPowerUp('extraTime')) {
      setTimeLeft((t) => t + 10);
      setExtraTimeUsed(true);
    }
  };

  const timePct = (timeLeft / QUESTION_TIME) * 100;
  const isLow = timeLeft <= 5;

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 text-white flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <button onClick={onExit} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-xs text-ink-400 uppercase tracking-wider font-semibold">{mode} mode</p>
          <p className="text-sm font-bold">{headerTitle}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-400">Score</p>
          <p className="text-lg font-bold text-cyan-400">{score}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-400 font-medium">{index + 1}/{questions.length}</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${((index) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="flex justify-center mb-6">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 timer-ring" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
            <circle
              cx="32" cy="32" r="28" fill="none"
              stroke={isLow ? '#ef4444' : '#22d3ee'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 28}
              strokeDashoffset={2 * Math.PI * 28 * (1 - timePct / 100)}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${isLow ? 'text-red-400 animate-pulse' : 'text-white'}`}>{timeLeft}</span>
          </div>
        </div>
      </div>

      {/* Streak indicator */}
      {streak >= 2 && (
        <div className="flex justify-center mb-4">
          <div className="px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 flex items-center gap-1.5 animate-pop">
            <span className="text-sm">🔥</span>
            <span className="text-sm font-bold text-orange-400">{streak}x Streak!</span>
          </div>
        </div>
      )}

      {/* Question */}
      <div className="flex-1 px-5 flex flex-col">
        <div className="glass-card p-6 mb-6 animate-slide-up" key={index}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
              current.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
              current.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' :
              'bg-rose-500/20 text-rose-400'
            }`}>
              {current.difficulty}
            </span>
          </div>
          <p className="text-xl font-bold leading-snug">{current.question}</p>
        </div>

        {/* Image (Visual IQ) — rendered above the options when present */}
        {current.questionType === 'image' && current.imageUrl && (
          <QuestionImage
            key={current.id}
            url={current.imageUrl}
            alt={current.imageAlt ?? ''}
            credit={current.imageCredit}
          />
        )}

        {/* Options */}
        <div className="space-y-3">
          {current.options.map((opt, i) => {
            const isEliminated = eliminated.includes(i);
            const isSelected = selected === i;
            const isCorrect = i === current.correctIndex;
            let cls = 'glass-card p-4 text-left active:scale-[0.98] transition-all';
            if (locked) {
              if (isCorrect) cls = 'glass-card p-4 text-left bg-emerald-500/25 border-emerald-400/50';
              else if (isSelected) cls = 'glass-card p-4 text-left bg-rose-500/25 border-rose-400/50 animate-shake';
              else cls = 'glass-card p-4 text-left opacity-40';
            }
            if (isEliminated) cls = 'glass-card p-4 text-left opacity-20 line-through';
            return (
              <button
                key={i}
                disabled={locked || isEliminated}
                onClick={() => handleAnswer(i)}
                className={cls}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{opt}</span>
                  {locked && isCorrect && <Check className="w-5 h-5 text-emerald-400" />}
                  {locked && isSelected && !isCorrect && <X className="w-5 h-5 text-rose-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Hint */}
        {showHint && (
          <div className="mt-4 p-3 rounded-2xl bg-cyan-500/15 border border-cyan-400/25 animate-slide-up">
            <p className="text-sm text-cyan-200">
              The correct answer starts with "{current.options[current.correctIndex][0]?.toUpperCase()}" and has {current.options[current.correctIndex].split(/\s+/).length} word{current.options[current.correctIndex].split(/\s+/).length !== 1 ? 's' : ''}.
            </p>
          </div>
        )}
      </div>

      {/* Power-ups */}
      <div className="px-5 py-4 flex justify-center gap-3">
        <PowerUpBtn icon={<Lightbulb className="w-5 h-5" />} label="Hint" count={state.powerUps.hint} onClick={handleHint} disabled={locked || showHint} />
        <PowerUpBtn icon={<SplitSquareHorizontal className="w-5 h-5" />} label="50/50" count={state.powerUps.fiftyFifty} onClick={handleFiftyFifty} disabled={locked || eliminated.length > 0} />
        <PowerUpBtn icon={<Clock className="w-5 h-5" />} label="+10s" count={state.powerUps.extraTime} onClick={handleExtraTime} disabled={locked || extraTimeUsed} />
      </div>
    </div>
  );
}

function PowerUpBtn({
  icon,
  label,
  count,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || count <= 0}
      className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl bg-white/10 border border-white/15 active:scale-95 transition-all disabled:opacity-30"
    >
      <div className="relative">
        {icon}
        <span className="absolute -top-2 -right-3 text-xs font-bold bg-cyan-400 text-ink-950 rounded-full px-1.5 min-w-[18px] text-center">
          {count}
        </span>
      </div>
      <span className="text-xs text-ink-300">{label}</span>
    </button>
  );
}

function QuestionImage({ url, alt, credit }: { url: string; alt: string; credit?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="mb-5 rounded-2xl overflow-hidden border border-white/15 bg-white/5">
      {/* Fixed aspect-ratio container prevents layout shift while loading */}
      <div className="relative w-full aspect-video bg-ink-800">
        {!loaded && !failed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {failed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-400">
            <ImageOff className="w-8 h-8" />
            <span className="text-xs">Image could not be loaded</span>
          </div>
        ) : (
          <img
            src={url}
            alt={alt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>
      {credit && (
        <p className="px-3 py-1.5 text-[10px] text-ink-500 leading-tight">Photo: {credit}</p>
      )}
    </div>
  );
}
