import { BUSINESS_INFO } from '@/lib/constants';
import type { ReviewSummary as Summary } from '@/lib/types';
import { formatRating } from '@/lib/utils/format';
import Stars from '@/components/Stars';

const ROWS = [5, 4, 3, 2, 1] as const;

export default function ReviewSummary({ summary }: { summary: Summary }) {
  const { average, total, distribution } = summary;

  return (
    <section
      aria-label="Resumen de calificaciones"
      style={{
        background: 'var(--color-surface-bg)',
        borderRadius: 22,
        padding: '44px 32px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.05)',
      }}
    >
      {total === 0 ? (
        <>
          <div
            style={{
              fontSize: 22,
              fontWeight: 300,
              letterSpacing: '-0.02em',
              textAlign: 'center',
            }}
          >
            Todavía no hay reseñas publicadas
          </div>
          <p
            style={{
              fontSize: 14,
              color: 'var(--color-text-secondary)',
              maxWidth: 360,
              textAlign: 'center',
              textWrap: 'pretty',
            }}
          >
            Sé la primera persona en contar su experiencia comprando en{' '}
            {BUSINESS_INFO.name}.
          </p>
        </>
      ) : (
        <>
          <div
            style={{
              fontSize: 84,
              fontWeight: 200,
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              color: 'var(--color-text-primary)',
            }}
          >
            {formatRating(average)}
          </div>

          <Stars rating={average} size={19} spacing="0.14em" />

          <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
            Basado en {total} {total === 1 ? 'reseña' : 'reseñas'}
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: 300,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginTop: 16,
            }}
          >
            {ROWS.map((star) => {
              const count = distribution[star];
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div
                  key={star}
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <span
                    style={{
                      fontSize: 11.5,
                      color: 'var(--color-text-secondary)',
                      width: 24,
                      textAlign: 'right',
                    }}
                  >
                    {star} ★
                  </span>
                  <span
                    aria-hidden
                    style={{
                      flex: 1,
                      height: 4,
                      borderRadius: 999,
                      background: 'var(--color-border)',
                      overflow: 'hidden',
                    }}
                  >
                    {count > 0 && (
                      <span
                        style={{
                          display: 'block',
                          height: '100%',
                          width: `${pct}%`,
                          background: 'var(--color-accent)',
                          borderRadius: 999,
                        }}
                      />
                    )}
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      color: 'var(--color-text-secondary)',
                      width: 16,
                      textAlign: 'right',
                    }}
                  >
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Guarantee row */}
      <div
        style={{
          marginTop: 22,
          paddingTop: 20,
          borderTop: '1px solid var(--color-divisor)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {BUSINESS_INFO.guaranteeItems.map((item, i) => (
          <span
            key={item}
            style={{
              fontSize: 11.5,
              color: 'var(--color-text-secondary)',
              padding: '2px 16px',
              borderLeft:
                i === 1 ? '1px solid var(--color-border)' : undefined,
              borderRight:
                i === 1 ? '1px solid var(--color-border)' : undefined,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
