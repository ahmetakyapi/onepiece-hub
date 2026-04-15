import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Tarihi formatla: "15 Mart 2026" */
export function formatDate(date: Date | string, locale = 'tr-TR'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

/** Metni kısalt */
export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str
}

/** Bounty string'ini sayıya çevir: "3,000,000,000" → 3000000000 */
export function parseBounty(bounty?: string): number {
  if (!bounty) return 0
  return parseInt(bounty.replace(/,/g, ''), 10)
}

/** Bounty sayısını kısa formata çevir: 3000000000 → "3B" */
export function formatBounty(value: number): string {
  if (value >= 1_000_000_000) {
    const b = value / 1_000_000_000
    return b % 1 === 0 ? `${b.toFixed(0)}B` : `${b.toFixed(1)}B`
  }
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return value.toLocaleString()
}

/** Göreceli zaman: "3 dk önce", "2 saat önce" */
export function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'az önce'
  if (mins < 60) return `${mins} dk önce`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} saat önce`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} gün önce`
  return `${Math.floor(days / 7)} hafta önce`
}
