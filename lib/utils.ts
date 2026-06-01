import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str
}
