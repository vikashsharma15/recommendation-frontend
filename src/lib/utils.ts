import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function scoreToLabel(score: number): string {
  if (score >= 0.7) return 'Highly relevant'
  if (score >= 0.5) return 'Relevant'
  if (score >= 0.3) return 'Somewhat relevant'
  return 'General'
}

export function scoreToColor(score: number): string {
  if (score >= 0.7) return 'text-emerald-600 bg-emerald-50'
  if (score >= 0.5) return 'text-brand-600 bg-brand-50'
  if (score >= 0.3) return 'text-amber-600 bg-amber-50'
  return 'text-surface-500 bg-surface-100'
}

export function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase()
}