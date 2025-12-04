/**
 * Simple utility to merge class names conditionally.
 * Replaces the need for 'clsx' or 'classnames' dependency for this demo.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
