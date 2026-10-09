'use client'

import { useSyncExternalStore } from 'react'
import { isIntroDone, subscribeIntro } from '@/lib/motion'

/** Açılış sekansı (preloader) bitti mi? Hero giriş animasyonları bunu
 *  bekler — yoksa perdenin arkasında oynayıp biter, kullanıcı hiç görmez.
 *  SSR ve hydration'da `false`: animasyonlar `initial` durumunda başlar. */
export function useIntroReady(): boolean {
  return useSyncExternalStore(subscribeIntro, isIntroDone, () => false)
}
