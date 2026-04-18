'use client'

import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const ScrollProgress = dynamic(() => import('@/components/layout/ScrollProgress'), { ssr: false })
const CommandPalette = dynamic(() => import('@/components/search/CommandPalette'), { ssr: false })
const RippleEffect = dynamic(() => import('@/components/ui/RippleEffect'), { ssr: false })
const ToastContainer = dynamic(() => import('@/components/ui/ToastContainer'), { ssr: false })
const MobileBottomNav = dynamic(() => import('@/components/layout/MobileBottomNav'), { ssr: false })

interface Props {
  children: React.ReactNode
}

export function ClientLayout({ children }: Props) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ocean-deep"
      >
        İçeriğe atla
      </a>
      <ScrollProgress />
      <CommandPalette />
      <RippleEffect />
      <ToastContainer />
      <Header />
      <main id="main-content">{children}</main>
      <div style={{ paddingBottom: 'calc(max(env(safe-area-inset-bottom), 0px) + 72px)' }} className="md:!pb-0">
        <Footer />
      </div>
      <MobileBottomNav />
    </>
  )
}
