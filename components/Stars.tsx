import { starParts } from '@/lib/utils/format';

type StarsProps = {
  rating: number;
  /** font-size in px */
  size?: number;
  /** letter-spacing, e.g. '0.12em' */
  spacing?: string;
  className?: string;
};

/**
 * Rating rendered with Unicode ★ (U+2605). Filled stars use text-primary,
 * empty stars are tinted (#d2d2d7) within the same run.
 */
export default function Stars({
  rating,
  size = 12.5,
  spacing = '0.12em',
  className,
}: StarsProps) {
  const { filled, empty } = starParts(rating);
  const label = `${starParts(rating).filled} de 5 estrellas`;
  return (
    <span
      className={className}
      role="img"
      aria-label={label}
      style={{
        fontSize: `${size}px`,
        letterSpacing: spacing,
        color: 'var(--color-text-primary)',
        whiteSpace: 'nowrap',
        lineHeight: 1,
      }}
    >
      {'★'.repeat(filled)}
      {empty > 0 && (
        <span style={{ color: 'var(--color-star-empty)' }}>{'★'.repeat(empty)}</span>
      )}
    </span>
  );
}
