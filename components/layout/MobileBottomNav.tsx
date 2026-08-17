'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Users, Globe, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const TABS = [
  { href: '/', icon: Home, label: 'Ana Sayfa' },
  { href: '/arcs', icon: Compass, label: "Arc'lar" },
  { href: '/characters', icon: Users, label: 'Karakter' },
  { href: '/world', icon: Globe, label: 'Dünya' },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const profileHref = user ? '/profile' : '/login'
  const profileActive = isActive(pathname, profileHref)

  return (
    <nav
      aria-label="Mobil gezinme"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-pirate-border/25 bg-ocean-deep/85 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.25rem)' }}
    >
      <div className="pointer-events-none absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

      <div className="flex items-center justify-around px-1 py-1.5">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.href)
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={`group relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-3 py-2.5 transition-colors ${
                active ? 'bg-gold/[0.06]' : ''
              }`}
            >
              {active && (
                <span
                  className="absolute inset-x-3 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-gold to-transparent"
                  aria-hidden
                />
              )}
              <Icon
                className={`h-5 w-5 transition-all ${
                  active ? 'text-gold' : 'text-pirate-muted/60 group-active:scale-90'
                }`}
              />
              <span
                className={`text-[10.5px] font-semibold tracking-wide transition-colors ${
                  active ? 'text-gold' : 'text-pirate-muted/60'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}

        <Link
          href={profileHref}
          aria-current={profileActive ? 'page' : undefined}
          className={`group relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors ${
            profileActive ? 'bg-gold/[0.06]' : ''
          }`}
        >
          {profileActive && (
            <span
              className="absolute inset-x-3 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-gold to-transparent"
              aria-hidden
            />
          )}
          <User
            className={`h-5 w-5 transition-all ${
              profileActive ? 'text-gold' : 'text-pirate-muted/60 group-active:scale-90'
            }`}
          />
          <span
            className={`text-[10.5px] font-semibold tracking-wide transition-colors ${
              profileActive ? 'text-gold' : 'text-pirate-muted/60'
            }`}
          >
            {user ? 'Profil' : 'Giriş'}
          </span>
        </Link>
      </div>
    </nav>
  )
}
