import { type AvatarKey, type ColorKey, colors } from '@/context/GameContext';

const avatarEmoji: Record<AvatarKey, string> = {
  fox: '🦊',
  cat: '🐱',
  panda: '🐼',
  owl: '🦉',
  lion: '🦁',
  koala: '🐨',
};

export function Avatar({
  avatar,
  color,
  size = 'md',
  ring = true,
}: {
  avatar: AvatarKey;
  color: ColorKey;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  ring?: boolean;
}) {
  const sizes = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl',
    xl: 'w-28 h-28 text-6xl',
  };
  const colorClass = colors.find((c) => c.key === color)?.class ?? 'from-cyan-400 to-blue-500';
  return (
    <div
      className={`${sizes[size]} rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center ${
        ring ? 'ring-2 ring-white/30' : ''
      } shadow-lg`}
    >
      <span className="drop-shadow">{avatarEmoji[avatar]}</span>
    </div>
  );
}
