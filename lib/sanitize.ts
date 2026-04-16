import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize user-generated content (comments, etc)
 * Removes potentially harmful scripts while preserving safe HTML
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p'],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
    KEEP_CONTENT: true,
  })
}

/**
 * Strip all HTML tags — safer for user display
 */
export function stripHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  })
}
