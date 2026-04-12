'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Thin scroll progress indicator at the very top of the viewport.
 * Gold-to-sea gradient that smoothly tracks page scroll.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #f4a300, #1e90ff)',
      }}
    />
  )
}
