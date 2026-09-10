import Link from 'next/link';
import { BUSINESS_INFO, COPY } from '@/lib/constants';
import { getBusinessReviews } from '@/lib/reviews';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import ReviewSummary from '@/components/ReviewSummary';
import ReviewCard from '@/components/ReviewCard';

export const dynamic = 'force-dynamic';

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

function Notice({ title, detail }: { title: string; detail: string }) {
  return (
    <main style={shell}>
      <div style={{ ...column, padding: '96px 0', gap: 12, textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.02em' }}>{title}</h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', textWrap: 'pretty' }}>
          {detail}
        </p>
      </div>
    </main>
  );
}

export default async function AppleMartReviewsPage() {
  if (!isSupabaseConfigured) {
    return (
      <Notice
        title="Falta configurar Supabase"
        detail="Definí NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local y reiniciá el servidor."
      />
    );
  }

  let data;
  try {
    data = await getBusinessReviews(BUSINESS_INFO.slug);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return <Notice title="No se pudieron cargar las reseñas" detail={message} />;
  }

  if (!data.business) {
    return (
      <Notice
        title="Negocio no encontrado"
        detail={`No existe un negocio con el slug "${BUSINESS_INFO.slug}". Corré el seed en Supabase (ver SETUP.md).`}
      />
    );
  }

  const { reviews, summary } = data;

  return (
    <main style={shell}>
      <div style={column}>
        {/* Header */}
        <header
          style={{
            padding: '72px 0 56px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 22,
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/applemart-logo.png"
              alt={`Logo de ${BUSINESS_INFO.name}`}
              width={54}
              height={54}
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                objectFit: 'cover',
                background: 'var(--color-logo-bg)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
              }}
            />
            <span
              style={{
                fontSize: 27,
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'var(--color-text-primary)',
              }}
            >
              {BUSINESS_INFO.name}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h1
              style={{
                fontSize: 15,
                fontWeight: 400,
                letterSpacing: '0.01em',
                color: 'var(--color-text-secondary)',
              }}
            >
              {BUSINESS_INFO.headline}
            </h1>
            <span style={{ fontSize: 12.5, fontWeight: 400, color: 'var(--color-text-secondary)' }}>
              {BUSINESS_INFO.handle} · {BUSINESS_INFO.location}
            </span>
          </div>
        </header>

        {/* Summary */}
        <ReviewSummary summary={summary} />

        {/* List header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            padding: '52px 4px 18px',
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-secondary)',
            }}
          >
            {COPY.reviewsHeading}
          </h2>
          <span style={{ fontSize: 12.5, color: 'var(--color-text-secondary)' }}>
            {COPY.reviewsSort}
          </span>
        </div>

        {/* Reviews */}
        {reviews.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p
            style={{
              fontSize: 14,
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
              padding: '24px 0',
            }}
          >
            Todavía no hay reseñas publicadas. ¡Dejá la primera!
          </p>
        )}

        {/* Closing section */}
        <section
          style={{
            padding: '56px 0 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.02em' }}>
            {COPY.submitHeading}
          </h2>
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
        </section>

        {/* Sticky CTA */}
        <div
          style={{
            position: 'sticky',
            bottom: 20,
            padding: '26px 0 0',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 20,
          }}
        >
          <Link
            href={`/${BUSINESS_INFO.slug}/dejar-resena`}
            style={{
              background: 'var(--color-cta)',
              color: '#fff',
              padding: '17px 40px',
              borderRadius: 999,
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              textDecoration: 'none',
              minHeight: 44,
              boxShadow: '0 6px 24px rgba(0,0,0,0.22)',
            }}
          >
            {COPY.submitCta}
          </Link>
        </div>

        {/* Footer */}
        <footer
          style={{
            padding: '44px 0 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            {BUSINESS_INFO.name} · Venta de iPhones · {BUSINESS_INFO.handle}
          </span>
        </footer>
      </div>
    </main>
  );
}
