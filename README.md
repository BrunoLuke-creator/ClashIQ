# ClashIQ 🧠

**Where brains clash and legends rise.**

ClashIQ is a polished, mobile-first trivia game built with React, TypeScript, Vite, and Tailwind CSS. Players test their knowledge across 10 categories, complete daily challenges, build streaks, and climb the leaderboard.

![ClashIQ](https://img.shields.io/badge/ClashIQ-Trivia%20Game-cyan)

---

## Features

### Game Modes
- **Play Now** — Quick mixed-category match of 8 questions
- **Daily Challenge** — Same deterministic question set for all players each day, with completion tracking and shareable results
- **Category Play** — Choose from 10 topics: Technology, Medicine, Football, Music, Movies, Finance, Geography, Anime, Pop Culture, and **Visual IQ**
- **Visual IQ** — Image-based trivia questions using legally licensed stock photography (landmarks, animals, science, geography)

### Gameplay
- 15-second timer per question with a visual countdown ring
- Streak bonuses for consecutive correct answers
- Three power-ups: **Hint** (reveals first letter + word count), **50/50** (removes two wrong answers), **+10s** (adds extra time)
- Educational explanations after each question
- Satisfying animations for correct answers, streaks, and victories

### Progression & Economy
- XP and level system with visual progress bars
- Daily login streaks
- Coins (earned by playing) and Gems (premium currency)
- Daily missions with coin rewards
- Lucky Spin wheel (one free spin per 24 hours)
- Achievements (First Steps, On Fire, Explorer, Visual Thinker, Sharpshooter, and more)

### Social
- Score sharing via Web Share API, WhatsApp, and copy-link fallback
- Friend challenge links
- Public leaderboard with daily, weekly, and all-time rankings

### Design
- Dark, modern competitive gaming aesthetic with cyan and blue accents
- Glassmorphism cards, smooth transitions, and micro-interactions
- Responsive layout from small phones to desktop
- Reduced-motion friendly
- Touch-optimized controls

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | lucide-react |
| Backend | Supabase (PostgreSQL, RLS, leaderboard) |
| Images | Pexels (free-to-use stock photography) |

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

---

## Project Structure

```
src/
├── components/          # Reusable UI components (Avatar, BottomNav)
├── context/             # GameContext — global game state via React Context
├── data/                # Question bank, categories, daily challenge logic
│   ├── questions.ts     # All trivia questions (text + image-based)
│   └── dailyChallenge.ts # Deterministic daily challenge generator
├── lib/                 # Supabase client setup
├── screens/             # App screens (Home, Game, Results, Shop, etc.)
└── App.tsx              # Main app — routing and screen management

supabase/
└── migrations/          # Database schema and RLS policies
```

---

## Database

The app uses Supabase for the public leaderboard. The `leaderboard_entries` table stores player scores with:

- **Row Level Security** scoped to each player's device ID (writes limited to own rows, reads are public)
- **CHECK constraints** that validate score ranges, category/mode values, and prevent impossible submissions (negative scores, correct count exceeding total, etc.)

### Migrations

| Migration | Description |
|-----------|-------------|
| `create_leaderboard_table` | Creates the leaderboard table with RLS |
| `tighten_leaderboard_rls` | Scopes INSERT/UPDATE/DELETE to the caller's device ID |
| `validate_leaderboard_scores` | Adds server-side CHECK constraints for score validation |
| `add_visualiq_category_constraint` | Adds Visual IQ as a valid leaderboard category |

---

## Visual IQ — Image-Based Trivia

The Visual IQ category extends the standard `Question` type with optional image fields:

```typescript
type Question = {
  // ...standard fields
  questionType?: 'text' | 'image';
  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: string;
  imageLicense?: string;
};
```

Key design decisions:
- **Alt text is deliberately generic** ("A tall iron lattice tower") so it never reveals the answer before the player responds
- Images use a fixed aspect-ratio container to prevent layout shift during loading
- A loading spinner and broken-image fallback ensure gameplay never freezes
- All images are sourced from Pexels under the Pexels License (free to use)
- Text-only questions remain fully functional alongside image questions

---

## Daily Challenge

The Daily Challenge uses a deterministic seeded PRNG (mulberry32) so every player receives the same question set on a given date (based on UTC). Completion status is stored in `localStorage` so refreshing the page doesn't reset the attempt.

**Limitation:** Completion tracking is client-side. True one-attempt-per-day enforcement at the server level requires user authentication.

---

## Shop & Monetization

The shop currently offers:
- **Power-ups** purchasable with earned coins (in-game economy, not real money)
- **Gem exchange** (convert gems to coins)

Real-money purchases (Premium subscription, coin packs, gem packs) are displayed but **clearly labeled "Coming Soon"** with disabled buttons. No purchase is presented as complete, and no paid currency is granted without a verified transaction. Payment provider integration (Stripe, etc.) must be configured before these can be activated.

---

## Security

- No service-role keys or secrets are exposed in frontend code
- Supabase RLS policies scope all writes to the player's device ID
- Database CHECK constraints validate all incoming leaderboard data server-side
- Client-side validation mirrors the database constraints and logs failures rather than silently reporting success
- The `.env` file (containing Supabase keys) is gitignored

**Known limitation:** The device ID is not a secure identity boundary. A determined user could manipulate scores by crafting requests directly. Full cheat prevention requires server-side scoring with an authoritative question set and user authentication.

---

## Privacy & Analytics

No analytics provider is currently configured. The codebase is designed to support privacy-conscious event tracking (game started, category selected, daily challenge completed, score shared, etc.) without recording personal information, but no tracking is active until a provider is connected.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

Image assets used in Visual IQ questions are sourced from [Pexels](https://www.pexels.com/) under the [Pexels License](https://www.pexels.com/license/), which permits free use without attribution (attribution is provided voluntarily in the image credits).

---

## Acknowledgments

- Question content written and curated for ClashIQ
- Stock photography by Pexels contributors (see individual image credits in `src/data/questions.ts`)
- Built with [Bolt](https://bolt.new)
