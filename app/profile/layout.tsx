import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profil',
  description: 'İzleme geçmişiniz, quiz skorlarınız ve tamamlanan arc istatistikleriniz.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
