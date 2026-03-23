import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  username: string
  avatarUrl?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
}

export default function Avatar({ username, avatarUrl, size = 'md', className }: AvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className={cn('rounded-full object-cover ring-2 ring-white shadow-sm', sizes[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold',
        'gradient-brand text-white ring-2 ring-white shadow-sm',
        sizes[size],
        className
      )}
    >
      {getInitials(username)}
    </div>
  )
}