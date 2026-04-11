import { Github, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const FOOTER_LINKS = [
  { label: 'Arc\'lar',    href: '/arcs' },
  { label: 'Karakterler', href: '/characters' },
  { label: 'Hakkında',    href: '/about' },
] as const

export default function Footer() {
  return (
    <footer className="relative border-t border-pirate-border">
      {/* Wave decoration */}
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="One Piece Hub" width={240} height={96} className="h-20 w-auto sm:h-24" />
            </div>
            <p className="text-xs text-pirate-muted">
              Denizlerin Kralı olmaya hazır mısın?
            </p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-pirate-muted transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-pirate-border" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-pirate-muted">
            &copy; {new Date().getFullYear()} One Piece Hub &mdash; Fan projesi. One Piece, Eiichiro Oda&apos;ya aittir.
          </p>
          <p className="text-xs text-pirate-muted">
            Macera ruhuyla yapıldı
          </p>
        </div>
      </div>
    </footer>
  )
}
