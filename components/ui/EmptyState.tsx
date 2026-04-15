'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/variants'

type Theme =
  | 'luffy-sleeping'
  | 'zoro-lost'
  | 'chopper-searching'
  | 'brook-lonely'
  | 'nami-angry'

interface EmptyStateProps {
  theme?: Theme
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

const THEMES: Record<Theme, { emoji: string; defaultTitle: string; defaultDesc: string }> = {
  'luffy-sleeping': {
    emoji: '(-_-)zzZ',
    defaultTitle: 'Burada bir şey yok...',
    defaultDesc: 'Luffy gibi bir şekerleme mi yapıyorsun? Başka bir yere bakmaya ne dersin?',
  },
  'zoro-lost': {
    emoji: '(o_O)?',
    defaultTitle: 'Kaybolmuş gibisin!',
    defaultDesc: 'Zoro bile burada kaybolurdu. Yanlış yere mi geldin?',
  },
  'chopper-searching': {
    emoji: '(>_<)',
    defaultTitle: 'Aradığın şey bulunamadı',
    defaultDesc: 'Chopper her yere baktı ama bir şey bulamadı. Arama terimini değiştirmeyi dene!',
  },
  'brook-lonely': {
    emoji: '(T_T)',
    defaultTitle: 'Burası çok sessiz...',
    defaultDesc: 'Brook 50 yıl yalnız kaldı ama burası ondan bile daha sessiz. Henüz içerik eklenmemiş.',
  },
  'nami-angry': {
    emoji: '(#`O´)',
    defaultTitle: 'Bir hata oluştu!',
    defaultDesc: 'Nami sinirli! Bir şeyler ters gitti. Tekrar denemeni öneririz.',
  },
}

export default function EmptyState({
  theme = 'chopper-searching',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const config = THEMES[theme]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center',
        className,
      )}
    >
      {/* Manga-style emoji face */}
      <motion.div
        initial={{ scale: 0.5, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="mb-6 select-none"
      >
        <span
          className="block font-mono text-5xl text-pirate-muted/40"
          style={{ textShadow: '0 4px 24px rgba(244,163,0,0.1)' }}
        >
          {config.emoji}
        </span>
      </motion.div>

      {/* Decorative dots */}
      <div className="mb-6 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 400 }}
            className="h-1.5 w-1.5 rounded-full bg-gold/30"
          />
        ))}
      </div>

      <h3 className="mb-2 text-lg font-bold text-pirate-text">
        {title ?? config.defaultTitle}
      </h3>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-pirate-muted">
        {description ?? config.defaultDesc}
      </p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  )
}
