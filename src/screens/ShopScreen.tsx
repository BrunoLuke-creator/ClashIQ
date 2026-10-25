import { useState } from 'react';
import { ArrowLeft, Coins, Gem, Zap, Lightbulb, SplitSquareHorizontal, Clock, Crown, Check } from 'lucide-react';
import { useGame } from '@/context/GameContext';

type Tab = 'powerups' | 'premium' | 'coins' | 'gems';

export function ShopScreen({ onBack }: { onBack: () => void }) {
  const { state, addCoins, spendCoins, spendGems, buyPowerUp } = useGame();
  const [tab, setTab] = useState<Tab>('powerups');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const coinPacks = [
    { id: 'c1', coins: 500, price: '$0.99' },
    { id: 'c2', coins: 1500, price: '$2.99', best: true },
    { id: 'c3', coins: 5000, price: '$7.99' },
  ];
  const gemPacks = [
    { id: 'g1', gems: 20, price: '$0.99' },
    { id: 'g2', gems: 60, price: '$2.99', best: true },
    { id: 'g3', gems: 200, price: '$7.99' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 text-white pb-24">
      <div className="px-5 pt-6 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Shop</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/10 rounded-full px-2.5 py-1">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold">{state.coins}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/10 rounded-full px-2.5 py-1">
              <Gem className="w-4 h-4 text-fuchsia-400" />
              <span className="text-sm font-bold">{state.gems}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
          {([
            { id: 'powerups', label: 'Power-Ups', icon: <Zap className="w-4 h-4" /> },
            { id: 'premium', label: 'Premium', icon: <Crown className="w-4 h-4" /> },
            { id: 'coins', label: 'Coins', icon: <Coins className="w-4 h-4" /> },
            { id: 'gems', label: 'Gems', icon: <Gem className="w-4 h-4" /> },
          ] as { id: Tab; label: string; icon: React.ReactNode }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition ${
                tab === t.id ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white' : 'bg-white/5 text-ink-400'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'powerups' && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-xs text-ink-400 mb-1">Buy power-ups with coins you earn by playing.</p>
            <PowerUpRow icon={<Lightbulb className="w-5 h-5" />} label="Hint" desc="Reveal the first letter and word count of the answer" count={state.powerUps.hint} onBuy={() => { if (spendCoins(100)) { buyPowerUp('hint'); showToast('+1 Hint purchased!'); } else showToast('Not enough coins'); }} />
            <PowerUpRow icon={<SplitSquareHorizontal className="w-5 h-5" />} label="50/50" desc="Remove two wrong answers" count={state.powerUps.fiftyFifty} onBuy={() => { if (spendCoins(100)) { buyPowerUp('fiftyFifty'); showToast('+1 50/50 purchased!'); } else showToast('Not enough coins'); }} />
            <PowerUpRow icon={<Clock className="w-5 h-5" />} label="+10s" desc="Add 10 seconds to the timer" count={state.powerUps.extraTime} onBuy={() => { if (spendCoins(100)) { buyPowerUp('extraTime'); showToast('+1 Extra Time purchased!'); } else showToast('Not enough coins'); }} />
            <div className="glass-card p-4 mt-4">
              <h4 className="font-bold text-sm mb-2">Gem Exchange</h4>
              <p className="text-xs text-ink-400 mb-3">Convert gems to coins (1 gem = 50 coins)</p>
              <button
                onClick={() => { if (spendGems(1)) { addCoins(50); showToast('+50 coins from 1 gem'); } else showToast('Not enough gems'); }}
                className="btn-ghost w-full py-3 text-sm font-semibold"
              >
                Exchange 1 Gem → 50 Coins
              </button>
            </div>
          </div>
        )}

        {tab === 'premium' && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card p-5 bg-gradient-to-br from-amber-500/15 to-orange-500/10 border-amber-400/20">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-6 h-6 text-amber-400" />
                <h3 className="text-lg font-bold">ClashIQ Premium</h3>
                {state.premium && <span className="ml-auto text-xs bg-amber-400 text-ink-950 px-2 py-0.5 rounded-full font-bold">Active</span>}
              </div>
              <ul className="space-y-2 mb-5">
                {['Unlimited energy', 'Premium avatars', 'Double XP', 'No ads'].map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-ink-200">
                    <Check className="w-4 h-4 text-emerald-400" /> {b}
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-center">
                <p className="text-sm font-semibold text-ink-200 mb-1">Coming Soon</p>
                <p className="text-xs text-ink-400">
                  Real purchases are not yet available. Premium and coin/gem packs will be unlocked once payment verification is configured.
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === 'coins' && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-xs text-ink-400 mb-1">Coin packs require a verified purchase and are not yet available.</p>
            {coinPacks.map((p) => (
              <div key={p.id} className="glass-card p-4 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold">{p.coins.toLocaleString()} Coins</p>
                    {p.best && <span className="text-xs text-emerald-400 font-semibold">Best Value</span>}
                  </div>
                </div>
                <span className="text-sm font-semibold text-ink-400 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10">
                  {p.price} · Soon
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'gems' && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-xs text-ink-400 mb-1">Gem packs require a verified purchase and are not yet available.</p>
            {gemPacks.map((p) => (
              <div key={p.id} className="glass-card p-4 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-purple-500 flex items-center justify-center">
                    <Gem className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold">{p.gems} Gems</p>
                    {p.best && <span className="text-xs text-emerald-400 font-semibold">Best Value</span>}
                  </div>
                </div>
                <span className="text-sm font-semibold text-ink-400 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10">
                  {p.price} · Soon
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-ink-800 border border-white/15 text-sm font-semibold animate-slide-up shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

function PowerUpRow({ icon, label, desc, count, onBuy }: { icon: React.ReactNode; label: string; desc: string; count: number; onBuy: () => void }) {
  return (
    <div className="glass-card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white">
          {icon}
        </div>
        <div>
          <p className="font-bold text-sm">{label} <span className="text-xs text-ink-400 font-normal">×{count}</span></p>
          <p className="text-xs text-ink-400">{desc}</p>
        </div>
      </div>
      <button onClick={onBuy} className="flex items-center gap-1 bg-white/10 border border-white/15 rounded-2xl px-4 py-2.5 text-sm font-semibold active:scale-95 transition">
        <Coins className="w-4 h-4 text-amber-400" /> 100
      </button>
    </div>
  );
}
