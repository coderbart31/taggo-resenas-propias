/**
 * Formatting helpers (locale es-AR).
 */

/** "Martina G." -> "MG" ; "juan" -> "J" ; "" -> "?" */
export function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return '?';
  return parts.map((p) => p[0]!.toUpperCase()).join('');
}

/** ISO string -> "28 de agosto de 2026" */
export function formatDateLong(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'long' }).format(d);
}

/** 4.9 -> "4,9" (one decimal, comma) ; 5 -> "5,0" */
export function formatRating(value: number): string {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

/**
 * Star string with filled (★) then empty (☆-as-★ tinted) characters.
 * Returns { filled, empty } counts so the component can colour them.
 */
export function starParts(rating: number): { filled: number; empty: number } {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return { filled, empty: 5 - filled };
}
