'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { MessageCircle, Send, User, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { fadeUp } from '@/lib/variants'

type Comment = {
  id: string
  username: string
  content: string
  createdAt: string
}

type Props = {
  targetType: string
  targetSlug: string
}

function timeAgo(dateStr: string): string {
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

export default function CommentSection({ targetType, targetSlug }: Props) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchComments = useCallback(() => {
    fetch(`/api/comments?targetType=${targetType}&targetSlug=${targetSlug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.data?.comments) setComments(data.data.comments)
      })
      .finally(() => setLoading(false))
  }, [targetType, targetSlug])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, targetSlug, content: content.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Bir hata oluştu')
        return
      }

      setContent('')
      fetchComments()
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mb-16">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-pirate-text">
        <MessageCircle className="h-5 w-5 text-gold" />
        Yorumlar
        {comments.length > 0 && (
          <span className="ml-1 rounded-full bg-gold/[0.06] px-2.5 py-0.5 text-[11px] font-semibold text-gold/70">
            {comments.length}
          </span>
        )}
      </h2>

      {/* Comment form */}
      {user ? (
        <div className="bento-card mb-5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
              <User className="h-4 w-4 text-gold" />
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Düşüncelerini paylaş..."
                maxLength={500}
                rows={3}
                className="w-full resize-none rounded-xl border border-pirate-border/20 bg-ocean-surface/50 px-4 py-3 text-sm text-pirate-text placeholder-pirate-muted/40 outline-none transition-all focus:border-gold/30 focus:ring-2 focus:ring-gold/10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
                }}
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-pirate-muted/40">
                  {content.length}/500
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || submitting}
                  className="btn-gold text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  Gönder
                </button>
              </div>
              {error && (
                <p className="mt-2 text-xs text-luffy">{error}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bento-card mb-5 p-6 text-center">
          <MessageCircle className="mx-auto mb-2 h-6 w-6 text-pirate-muted/30" />
          <p className="text-sm text-pirate-muted/60">
            Yorum yapabilmek için{' '}
            <Link href="/login" className="text-gold transition-colors hover:text-gold-bright">
              giriş yapın
            </Link>
          </p>
        </div>
      )}

      {/* Comment list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-pirate-muted/30" />
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-pirate-muted/40">Henüz yorum yok — ilk yorumu sen yap!</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="bento-card px-4 py-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sea/10">
                    <User className="h-3.5 w-3.5 text-sea" />
                  </div>
                  <span className="text-xs font-semibold text-pirate-text">
                    @{comment.username}
                  </span>
                  <span className="text-[10px] text-pirate-muted/40">
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-pirate-muted/80 pl-9">
                  {comment.content}
                </p>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </section>
  )
}
