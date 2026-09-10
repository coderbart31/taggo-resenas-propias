import type { Review } from '@/lib/types';
import { COPY } from '@/lib/constants';
import { formatDateLong, getInitials } from '@/lib/utils/format';
import Stars from '@/components/Stars';

function VerifiedCheck() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden focusable="false">
      <path
        d="M2 6.4l2.6 2.6L10 3.4"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ReviewCard({ review }: { review: Review }) {
  const photos = review.photo_urls ?? [];

  return (
    <article
      style={{
        background: 'var(--color-surface-bg)',
        borderRadius: 20,
        padding: '26px 26px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.04)',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <span
          aria-hidden
          style={{
            width: 40,
            height: 40,
            flex: '0 0 auto',
            borderRadius: '50%',
            background: 'var(--color-avatar-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: 'var(--color-text-secondary)',
          }}
        >
          {getInitials(review.customer_name)}
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              color: 'var(--color-text-primary)',
            }}
          >
            {review.customer_name}
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            {formatDateLong(review.created_at)}
          </span>
        </div>

        <span style={{ marginLeft: 'auto' }}>
          <Stars rating={review.rating} size={12.5} spacing="0.12em" />
        </span>
      </div>

      {/* Body */}
      <p
        style={{
          fontSize: 15.5,
          lineHeight: 1.55,
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          textWrap: 'pretty',
          margin: 0,
        }}
      >
        {review.comment}
      </p>

      {/* Chips */}
      {(review.product_model || review.verified_purchase) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          {review.product_model && (
            <span
              style={{
                fontSize: 11.5,
                color: 'var(--color-text-primary)',
                background: 'var(--color-chip-neutral)',
                borderRadius: 999,
                padding: '5px 11px',
              }}
            >
              {review.product_model}
            </span>
          )}
          {review.verified_purchase && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11.5,
                color: 'var(--color-text-accent-dark)',
                background: 'var(--color-chip-accent)',
                borderRadius: 999,
                padding: '5px 11px',
              }}
            >
              <VerifiedCheck />
              {COPY.verifiedPurchase}
            </span>
          )}
        </div>
      )}

      {/* Photos */}
      {photos.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {photos.slice(0, 3).map((url, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={url}
              src={url}
              alt={`Foto ${i + 1} de la reseña de ${review.customer_name}`}
              loading="lazy"
              style={{
                width: 120,
                height: 120,
                borderRadius: 12,
                objectFit: 'cover',
                background: 'var(--color-avatar-bg)',
              }}
            />
          ))}
        </div>
      )}
    </article>
  );
}
