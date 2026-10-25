import { useState } from 'react';
import { GameProvider, useGame, type GameMode } from '@/context/GameContext';
import { Onboarding } from '@/screens/Onboarding';
import { HomeScreen } from '@/screens/HomeScreen';
import { GameScreen } from '@/screens/GameScreen';
import { ResultsScreen } from '@/screens/ResultsScreen';
import { LeaderboardScreen } from '@/screens/LeaderboardScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { ShopScreen } from '@/screens/ShopScreen';
import { SpinWheelScreen } from '@/screens/SpinWheelScreen';
import { MissionsScreen } from '@/screens/MissionsScreen';
import { BottomNav, type Tab } from '@/components/BottomNav';
import { supabase } from '@/lib/supabase';
import type { CategoryId } from '@/data/questions';
import { saveDailyChallengeResult, isDailyChallengeCompleted, challengeDate } from '@/data/dailyChallenge';

type Screen =
  | { name: 'home' }
  | { name: 'game'; category: CategoryId | 'mixed' | 'daily'; mode: GameMode }
  | { name: 'results'; result: { score: number; correct: number; total: number; xp: number }; category: string; mode: GameMode; isDaily?: boolean }
  | { name: 'leaderboard' }
  | { name: 'profile' }
  | { name: 'shop' }
  | { name: 'spin' }
  | { name: 'missions' };

function AppInner() {
  const { state } = useGame();
  const [tab, setTab] = useState<Tab>('home');
  const [screen, setScreen] = useState<Screen>({ name: 'home' });

  if (!state.onboarded) return <Onboarding />;

  // Game flow
  if (screen.name === 'game') {
    const isDaily = screen.category === 'daily';
    return (
      <GameScreen
        category={screen.category}
        mode={screen.mode}
        onExit={() => setScreen({ name: 'home' })}
        onFinish={(result) => {
          const categoryLabel = isDaily ? 'Daily Challenge' : screen.category;

          if (isDaily) {
            saveDailyChallengeResult({
              score: result.score,
              correct: result.correct,
              total: result.total,
              completed: true,
            });
          } else {
            // Client-side validation mirrors the database CHECK constraints.
            // The database is the authoritative gate; this avoids an obvious
            // round-trip for garbage values and logs failures instead of
            // silently reporting success.
            const validCategories = ['mixed','technology','medicine','football','music','movies','finance','geography','anime','popculture','visualiq'];
            const validModes = ['solo','ranked','friends','1v1'];
            const isValid =
              result.score >= 0 && result.score <= 5000 &&
              result.correct >= 0 && result.correct <= result.total &&
              result.total > 0 &&
              result.xp >= 0 &&
              state.playerName.length >= 1 && state.playerName.length <= 16 &&
              validCategories.includes(screen.category as string) &&
              validModes.includes(screen.mode);

            if (!isValid) {
              console.warn('Leaderboard submission rejected: failed client-side validation.');
            } else {
              (async () => {
                const { error } = await supabase.from('leaderboard_entries').insert({
                  player_name: state.playerName,
                  avatar: state.avatar,
                  avatar_color: state.avatarColor,
                  category: screen.category,
                  mode: screen.mode,
                  score: result.score,
                  xp_earned: result.xp,
                  correct_count: result.correct,
                  total_questions: result.total,
                  device_id: state.deviceId,
                });
                if (error) {
                  console.warn('Leaderboard submission rejected by server:', error.message);
                }
              })();
            }
          }

          setScreen({ name: 'results', result, category: categoryLabel, mode: screen.mode, isDaily });
        }}
      />
    );
  }

  if (screen.name === 'results') {
    return (
      <ResultsScreen
        result={screen.result}
        category={screen.category}
        mode={screen.mode}
        isDaily={screen.isDaily}
        onPlayAgain={() => {
          if (screen.isDaily) {
            setScreen({ name: 'home' });
          } else {
            setScreen({ name: 'game', category: screen.category as CategoryId | 'mixed', mode: screen.mode });
          }
        }}
        onHome={() => { setTab('home'); setScreen({ name: 'home' }); }}
      />
    );
  }

  // Fullscreen sub-screens
  if (screen.name === 'leaderboard') {
    return <LeaderboardScreen onBack={() => { setTab('home'); setScreen({ name: 'home' }); }} />;
  }
  if (screen.name === 'profile') {
    return <ProfileScreen onBack={() => { setTab('home'); setScreen({ name: 'home' }); }} />;
  }
  if (screen.name === 'shop') {
    return <ShopScreen onBack={() => { setTab('home'); setScreen({ name: 'home' }); }} />;
  }
  if (screen.name === 'spin') {
    return <SpinWheelScreen onBack={() => { setTab('home'); setScreen({ name: 'home' }); }} />;
  }
  if (screen.name === 'missions') {
    return <MissionsScreen onBack={() => { setTab('home'); setScreen({ name: 'home' }); }} />;
  }

  // Tab-based screens
  const startGame = (category: CategoryId | 'mixed', mode: GameMode = 'solo') => {
    if (state.energy < 1) {
      setScreen({ name: 'shop' });
      return;
    }
    setScreen({ name: 'game', category, mode });
  };

  const startDailyChallenge = () => {
    if (isDailyChallengeCompleted(challengeDate())) return;
    if (state.energy < 1) {
      setScreen({ name: 'shop' });
      return;
    }
    setScreen({ name: 'game', category: 'daily', mode: 'solo' });
  };

  return (
    <>
      <HomeScreen
        onPlay={(c) => startGame(c, 'solo')}
        onDailyChallenge={startDailyChallenge}
        onSpin={() => setScreen({ name: 'spin' })}
        onMissions={() => setScreen({ name: 'missions' })}
        onLeaderboard={() => setScreen({ name: 'leaderboard' })}
        onShop={() => setScreen({ name: 'shop' })}
        onProfile={() => setScreen({ name: 'profile' })}
      />
      <BottomNav
        active={tab}
        onChange={(t) => {
          setTab(t);
          if (t === 'home') setScreen({ name: 'home' });
          else if (t === 'leaderboard') setScreen({ name: 'leaderboard' });
          else if (t === 'shop') setScreen({ name: 'shop' });
          else if (t === 'profile') setScreen({ name: 'profile' });
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppInner />
    </GameProvider>
  );
}
