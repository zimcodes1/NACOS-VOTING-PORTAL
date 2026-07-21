/**
 * Simple classname joiner utility.
 * Filters out falsy values and joins class strings cleanly.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
