type ToastKind = 'info' | 'success' | 'error'

type ToastOptions = {
  kind?: ToastKind
  title: string
  message?: string
  duration?: number
}

export function toast(options: ToastOptions) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('show-toast', { detail: options }))
}
