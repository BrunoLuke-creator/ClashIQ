import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type AvatarKey = 'fox' | 'cat' | 'panda' | 'owl' | 'lion' | 'koala';
export type ColorKey = 'cyan' | 'rose' | 'amber' | 'emerald' | 'violet' | 'sky';

export type GameMode = 'solo' | 'ranked' | 'friends' | '1v1';

export type Mission = {
  id: string;
  title: string;
  description: string;
  reward: number;
  target: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
};

export type GameState = {
  onboarded: boolean;
  playerName: string;
  avatar: AvatarKey;
  avatarColor: ColorKey;
  coins: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  xp: number;
  level: number;
  streak: number;
  lastLogin: string;
  lastSpin: number; // timestamp
  missions: Mission[];
  bestScores: Record<string, number>;
  gamesPlayed: number;
  totalCorrect: number;
  achievements: string[];
  theme: 'light' | 'dark';
  deviceId: string;
  premium: boolean;
  powerUps: {
    hint: number;
    fiftyFifty: number;
    extraTime: number;
  };
};

const DEFAULT_STATE: GameState = {
  onboarded: false,
  playerName: '',
  avatar: 'fox',
  avatarColor: 'cyan',
  coins: 500,
  gems: 10,
  energy: 5,
  maxEnergy: 5,
  xp: 0,
  level: 1,
  streak: 0,
  lastLogin: '',
  lastSpin: 0,
  missions: [],
  bestScores: {},
  gamesPlayed: 0,
  totalCorrect: 0,
  achievements: [],
  theme: 'dark',
  deviceId: '',
  premium: false,
  powerUps: { hint: 3, fiftyFifty: 2, extraTime: 2 },
};

const STORAGE_KEY = 'clashiq-state-v1';

const DAILY_MISSIONS: Mission[] = [
  { id: 'play-3', title: 'Warm-Up', description: 'Play 3 games', reward: 100, target: 3, progress: 0, completed: false, claimed: false },
  { id: 'correct-15', title: 'Sharp Mind', description: 'Answer 15 questions correctly', reward: 150, target: 15, progress: 0, completed: false, claimed: false },
  { id: 'perfect', title: 'Flawless', description: 'Get a perfect score in any game', reward: 200, target: 1, progress: 0, completed: false, claimed: false },
  { id: 'streak-3', title: 'On Fire', description: 'Reach a 3-day login streak', reward: 250, target: 3, progress: 0, completed: false, claimed: false },
];

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

function genDeviceId(): string {
  return 'dev-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function xpForLevel(level: number): number {
  return 100 + (level - 1) * 50;
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE, deviceId: genDeviceId(), missions: DAILY_MISSIONS.map((m) => ({ ...m })) };
    const parsed = JSON.parse(raw) as GameState;
    return { ...DEFAULT_STATE, ...parsed, powerUps: { ...DEFAULT_STATE.powerUps, ...parsed.powerUps } };
  } catch {
    return { ...DEFAULT_STATE, deviceId: genDeviceId(), missions: DAILY_MISSIONS.map((m) => ({ ...m })) };
  }
}

type GameContextType = {
  state: GameState;
  setState: (updater: (prev: GameState) => GameState) => void;
  completeOnboarding: (name: string, avatar: AvatarKey, color: ColorKey) => void;
  recordGame: (result: { score: number; correct: number; total: number; category: string; mode: GameMode; xp: number }) => void;
  spendEnergy: (amount: number) => boolean;
  addCoins: (n: number) => void;
  addGems: (n: number) => void;
  spendCoins: (n: number) => boolean;
  spendGems: (n: number) => boolean;
  usePowerUp: (type: 'hint' | 'fiftyFifty' | 'extraTime') => boolean;
  buyPowerUp: (type: 'hint' | 'fiftyFifty' | 'extraTime') => void;
  claimMission: (id: string) => void;
  doSpin: (reward: { coins: number; gems: number }) => void;
  toggleTheme: () => void;
  setPremium: (v: boolean) => void;
  level: number;
  xpInLevel: number;
  xpNeeded: number;
  levelProgress: number;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<GameState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  // Daily login + streak handling
  useEffect(() => {
    if (!state.onboarded) return;
    const today = todayStr();
    if (state.lastLogin === today) return;
    setStateRaw((prev) => {
      let streak = prev.streak;
      if (prev.lastLogin) {
        const diff = daysBetween(prev.lastLogin, today);
        if (diff === 1) streak = prev.streak + 1;
        else if (diff > 1) streak = 1;
      } else {
        streak = 1;
      }
      const energyRefill = Math.min(prev.maxEnergy, prev.energy + 1);
      return {
        ...prev,
        streak,
        lastLogin: today,
        energy: energyRefill,
        missions: DAILY_MISSIONS.map((m) => ({ ...m })),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setState = (updater: (prev: GameState) => GameState) => setStateRaw(updater);

  const completeOnboarding = (name: string, avatar: AvatarKey, color: ColorKey) => {
    setStateRaw((prev) => ({
      ...prev,
      onboarded: true,
      playerName: name,
      avatar,
      avatarColor: color,
      streak: 1,
      lastLogin: todayStr(),
    }));
  };

  const recordGame: GameContextType['recordGame'] = (result) => {
    setStateRaw((prev) => {
      const newXP = prev.xp + result.xp;
      let level = prev.level;
      let xpRemaining = newXP;
      while (xpRemaining >= xpForLevel(level)) {
        xpRemaining -= xpForLevel(level);
        level += 1;
      }
      const bestKey = `${result.category}`;
      const prevBest = prev.bestScores[bestKey] ?? 0;
      const isPerfect = result.correct === result.total && result.total > 0;
      const missions = prev.missions.map((m) => {
        let progress = m.progress;
        let completed = m.completed;
        if (m.id === 'play-3') progress = m.progress + 1;
        if (m.id === 'correct-15') progress = m.progress + result.correct;
        if (m.id === 'perfect' && isPerfect) progress = 1;
        if (m.id === 'streak-3') progress = prev.streak;
        if (progress >= m.target) completed = true;
        return { ...m, progress, completed };
      });
      return {
        ...prev,
        xp: xpRemaining,
        level,
        gamesPlayed: prev.gamesPlayed + 1,
        totalCorrect: prev.totalCorrect + result.correct,
        bestScores: { ...prev.bestScores, [bestKey]: Math.max(prevBest, result.score) },
        missions,
      };
    });
  };

  const spendEnergy = (amount: number): boolean => {
    if (state.energy < amount) return false;
    setStateRaw((prev) => ({ ...prev, energy: prev.energy - amount }));
    return true;
  };

  const addCoins = (n: number) => setStateRaw((prev) => ({ ...prev, coins: prev.coins + n }));
  const addGems = (n: number) => setStateRaw((prev) => ({ ...prev, gems: prev.gems + n }));

  const spendCoins = (n: number): boolean => {
    if (state.coins < n) return false;
    setStateRaw((prev) => ({ ...prev, coins: prev.coins - n }));
    return true;
  };
  const spendGems = (n: number): boolean => {
    if (state.gems < n) return false;
    setStateRaw((prev) => ({ ...prev, gems: prev.gems - n }));
    return true;
  };

  const usePowerUp: GameContextType['usePowerUp'] = (type) => {
    if (state.powerUps[type] <= 0) return false;
    setStateRaw((prev) => ({ ...prev, powerUps: { ...prev.powerUps, [type]: prev.powerUps[type] - 1 } }));
    return true;
  };

  const buyPowerUp: GameContextType['buyPowerUp'] = (type) => {
    const cost = 100;
    if (state.coins < cost) return;
    setStateRaw((prev) => ({ ...prev, coins: prev.coins - cost, powerUps: { ...prev.powerUps, [type]: prev.powerUps[type] + 1 } }));
  };

  const claimMission = (id: string) => {
    setStateRaw((prev) => {
      const mission = prev.missions.find((m) => m.id === id);
      if (!mission || !mission.completed || mission.claimed) return prev;
      return {
        ...prev,
        coins: prev.coins + mission.reward,
        missions: prev.missions.map((m) => (m.id === id ? { ...m, claimed: true } : m)),
      };
    });
  };

  const doSpin: GameContextType['doSpin'] = (reward) => {
    setStateRaw((prev) => ({ ...prev, coins: prev.coins + reward.coins, gems: prev.gems + reward.gems, lastSpin: Date.now() }));
  };

  const toggleTheme = () => setStateRaw((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));

  const setPremium = (v: boolean) => setStateRaw((prev) => ({ ...prev, premium: v }));

  const xpNeeded = xpForLevel(state.level);
  const xpInLevel = state.xp;
  const levelProgress = xpInLevel / xpNeeded;

  return (
    <GameContext.Provider
      value={{
        state,
        setState,
        completeOnboarding,
        recordGame,
        spendEnergy,
        addCoins,
        addGems,
        spendCoins,
        spendGems,
        usePowerUp,
        buyPowerUp,
        claimMission,
        doSpin,
        toggleTheme,
        setPremium,
        level: state.level,
        xpInLevel,
        xpNeeded,
        levelProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

export const avatars: { key: AvatarKey; name: string }[] = [
  { key: 'fox', name: 'Fox' },
  { key: 'cat', name: 'Cat' },
  { key: 'panda', name: 'Panda' },
  { key: 'owl', name: 'Owl' },
  { key: 'lion', name: 'Lion' },
  { key: 'koala', name: 'Koala' },
];

export const colors: { key: ColorKey; name: string; class: string }[] = [
  { key: 'cyan', name: 'Cyan', class: 'from-cyan-400 to-blue-500' },
  { key: 'rose', name: 'Rose', class: 'from-rose-400 to-pink-500' },
  { key: 'amber', name: 'Amber', class: 'from-amber-400 to-orange-500' },
  { key: 'emerald', name: 'Emerald', class: 'from-emerald-400 to-green-500' },
  { key: 'violet', name: 'Violet', class: 'from-violet-400 to-purple-500' },
  { key: 'sky', name: 'Sky', class: 'from-sky-400 to-indigo-500' },
];
