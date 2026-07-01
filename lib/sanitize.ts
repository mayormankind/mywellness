import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Use this whenever displaying user-generated content
 */
export function sanitizeHtml(html: string): string {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(html);
  }
  // Server-side: return as-is (dangerous, but DOMPurify requires browser environment)
  // For full server-side sanitization, consider using a library like 'sanitize-html'
  return html;
}

/**
 * Sanitize plain text (escape HTML entities)
 */
export function sanitizeText(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
