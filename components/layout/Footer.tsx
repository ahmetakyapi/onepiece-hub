import { Anchor, Compass, Users, BookOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const FOOTER_LINKS = [
  { label: 'Arc\'lar',    href: '/arcs',       icon: Compass },
  { label: 'Karakterler', href: '/characters', icon: Users },
  { label: 'Hakkında',    href: '/about',      icon: BookOpen },
] as const

export default function Footer() {
  return (
    <footer className="relative border-t border-pirate-border/50">
      {/* Gradient top line */}
      <div className="absolute -top-px left-0 right-0 divider-glow" />

      {/* Decorative background */}
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-gold/3 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-sea/3 blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col items-center gap-10 md:flex-row md:justify-between">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <Link href="/" className="group">
              <Image
                src="/logo.png"
                alt="One Piece Hub"
                width={240}
                height={96}
                className="h-20 w-auto transition-all group-hover:drop-shadow-[0_0_20px_rgba(244,163,0,0.3)] sm:h-24"
              />
            </Link>
            <p className="text-xs text-pirate-muted">
              Denizlerin Kralı olmaya hazır mısın?
            </p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-glow group flex items-center gap-1.5 text-sm text-pirate-muted transition-colors hover:text-gold"
              >
                <link.icon className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="my-10 divider-glow" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-pirate-muted">
            &copy; {new Date().getFullYear()} One Piece Hub &mdash; Fan projesi. One Piece, Eiichiro Oda&apos;ya aittir.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-pirate-muted">
            <Anchor className="h-3 w-3 text-gold/50" />
            Macera ruhuyla yapıldı
          </p>
        </div>
      </div>
    </footer>
  )
}
