import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function getDeviceId(): string {
  try {
    const raw = localStorage.getItem('clashiq-state-v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.deviceId) return parsed.deviceId;
    }
  } catch {
    // ignore parse errors
  }
  return '';
}

const globalHeaders: Record<string, string> = {};
const deviceId = getDeviceId();
if (deviceId) globalHeaders['x-device-id'] = deviceId;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: globalHeaders,
  },
});

export type LeaderboardEntry = {
  id: string;
  player_name: string;
  avatar: string;
  avatar_color: string;
  category: string;
  mode: string;
  score: number;
  xp_earned: number;
  correct_count: number;
  total_questions: number;
  device_id: string;
  created_at: string;
};
