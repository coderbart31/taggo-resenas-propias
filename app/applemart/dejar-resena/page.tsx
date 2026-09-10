import type { Metadata } from 'next';
import Link from 'next/link';
import { BUSINESS_INFO, COPY } from '@/lib/constants';
import ReviewForm from '@/components/ReviewForm';

export const metadata: Metadata = {
  title: `Dejá tu reseña · ${BUSINESS_INFO.name}`,
};

const shell: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '0 20px',
};

const column: React.CSSProperties = {
  width: '100%',
  maxWidth: 640,
  display: 'flex',
  flexDirection: 'column',
};

export default function DejarResenaPage() {
  return (
    <main style={shell}>
      <div style={{ ...column, paddingBottom: 56 }}>
        <header
          style={{
            padding: '56px 0 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/applemart-logo.png"
              alt={`Logo de ${BUSINESS_INFO.name}`}
              width={44}
              height={44}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                objectFit: 'cover',
                background: 'var(--color-logo-bg)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
              }}
            />
            <span style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.02em' }}>
              {BUSINESS_INFO.name}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h1 style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.02em' }}>
              {COPY.submitCta}
            </h1>
            <p
              style={{
                fontSize: 14,
                color: 'var(--color-text-secondary)',
                maxWidth: 400,
                textWrap: 'pretty',
              }}
            >
              {COPY.submitSubheading}
            </p>
          </div>
        </header>

        <ReviewForm />

        <div style={{ textAlign: 'center', padding: '24px 0 0' }}>
          <Link
            href={`/${BUSINESS_INFO.slug}`}
            style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}
          >
            ← Volver a las reseñas
          </Link>
        </div>
      </div>
    </main>
  );
}
