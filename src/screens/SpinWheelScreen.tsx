import { useState, useRef } from 'react';
import { ArrowLeft, Coins, Gem } from 'lucide-react';
import { useGame } from '@/context/GameContext';

const SEGMENTS = [
  { label: '100 Coins', coins: 100, gems: 0, color: '#22d3ee' },
  { label: '5 Gems', coins: 0, gems: 5, color: '#e879f9' },
  { label: '50 Coins', coins: 50, gems: 0, color: '#34d399' },
  { label: '200 Coins', coins: 200, gems: 0, color: '#fbbf24' },
  { label: '10 Gems', coins: 0, gems: 10, color: '#f472b6' },
  { label: '500 Coins', coins: 500, gems: 0, color: '#60a5fa' },
  { label: '20 Gems', coins: 0, gems: 20, color: '#a78bfa' },
  { label: '150 Coins', coins: 150, gems: 0, color: '#fb923c' },
];

export function SpinWheelScreen({ onBack }: { onBack: () => void }) {
  const { state, doSpin } = useGame();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<(typeof SEGMENTS)[number] | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const canSpin = Date.now() - state.lastSpin >= 24 * 60 * 60 * 1000;
  const hoursLeft = Math.ceil((24 * 60 * 60 * 1000 - (Date.now() - state.lastSpin)) / (60 * 60 * 1000));

  const spin = () => {
    if (spinning || !canSpin) return;
    setSpinning(true);
    setResult(null);
    const winnerIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length;
    const targetAngle = 360 * 6 + (360 - winnerIndex * segmentAngle - segmentAngle / 2);
    setRotation(targetAngle);

    setTimeout(() => {
      setSpinning(false);
      const won = SEGMENTS[winnerIndex];
      setResult(won);
      doSpin({ coins: won.coins, gems: won.gems });
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 text-white flex flex-col">
      <div className="px-5 pt-6 max-w-md mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Lucky Spin</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Pointer */}
        <div className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-cyan-400 drop-shadow-lg" />

          {/* Wheel */}
          <div
            ref={wheelRef}
            className="relative w-72 h-72 rounded-full shadow-2xl shadow-cyan-500/20 transition-transform"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: spinning ? '4.5s' : '0s',
              transitionTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)',
              background: `conic-gradient(${SEGMENTS.map((s, i) => {
                const start = (i * 360) / SEGMENTS.length;
                const end = ((i + 1) * 360) / SEGMENTS.length;
                return `${s.color} ${start}deg ${end}deg`;
              }).join(', ')})`,
            }}
          >
            {SEGMENTS.map((s, i) => {
              const angle = (i * 360) / SEGMENTS.length + (360 / SEGMENTS.length) / 2;
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 origin-left"
                  style={{ transform: `rotate(${angle}deg) translateX(50%)` }}
                >
                  <span className="text-xs font-bold text-white drop-shadow block w-20 text-center" style={{ transform: 'translateX(-50%) rotate(90deg)' }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
            {/* Center hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-ink-950 border-4 border-white/20 flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>

        {/* Result */}
        {result && !spinning && (
          <div className="mt-8 glass-card p-5 w-full max-w-xs text-center animate-pop bg-gradient-to-br from-cyan-500/15 to-blue-500/10 border-cyan-400/25">
            <p className="text-sm text-ink-300 mb-1">You won!</p>
            <div className="flex items-center justify-center gap-3">
              {result.coins > 0 && (
                <span className="flex items-center gap-1 text-xl font-bold text-amber-400">
                  <Coins className="w-5 h-5" /> {result.coins}
                </span>
              )}
              {result.gems > 0 && (
                <span className="flex items-center gap-1 text-xl font-bold text-fuchsia-400">
                  <Gem className="w-5 h-5" /> {result.gems}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Spin button */}
        <button
          onClick={spin}
          disabled={spinning || !canSpin}
          className="btn-primary mt-8 px-12 py-4 text-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {spinning ? 'Spinning...' : canSpin ? 'SPIN!' : `Wait ${hoursLeft}h`}
        </button>

        {!canSpin && !spinning && (
          <p className="text-xs text-ink-500 mt-3">Come back in {hoursLeft} hour{hoursLeft !== 1 ? 's' : ''} for your next free spin</p>
        )}
      </div>
    </div>
  );
}
