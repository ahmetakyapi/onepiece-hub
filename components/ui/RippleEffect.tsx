'use client'

import { useEffect } from 'react'

const TARGET_SELECTOR = '.btn-gold, .btn-luffy, .btn-ghost'

export default function RippleEffect() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(TARGET_SELECTOR) as HTMLElement | null
      if (!target) return
      const rect = target.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2
      const ripple = document.createElement('span')
      ripple.className = 'btn-ripple'
      ripple.style.width = `${size}px`
      ripple.style.height = `${size}px`
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`

      const prevPosition = getComputedStyle(target).position
      if (prevPosition === 'static') target.style.position = 'relative'
      const prevOverflow = getComputedStyle(target).overflow
      if (prevOverflow === 'visible') target.style.overflow = 'hidden'

      target.appendChild(ripple)
      window.setTimeout(() => {
        ripple.remove()
      }, 700)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
