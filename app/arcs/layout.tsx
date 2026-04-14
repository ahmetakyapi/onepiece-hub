import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Arc'lar",
  description: 'One Piece arc listesi — saga bazlı gruplandırılmış tüm hikaye yayları ve bölümleri.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
