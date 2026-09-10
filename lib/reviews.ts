import { getSupabase } from '@/lib/supabase/client';
import type { Business, Review, ReviewSummary } from '@/lib/types';

export function computeSummary(reviews: Pick<Review, 'rating'>[]): ReviewSummary {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as ReviewSummary['distribution'];
  let sum = 0;
  for (const r of reviews) {
    const rating = r.rating as 1 | 2 | 3 | 4 | 5;
    if (rating >= 1 && rating <= 5) {
      distribution[rating] += 1;
      sum += rating;
    }
  }
  const total = reviews.length;
  const average = total > 0 ? sum / total : 0;
  return { average, total, distribution };
}

export type BusinessReviewsResult = {
  business: Business | null;
  reviews: Review[];
  summary: ReviewSummary;
};

/**
 * Fetches the business by slug plus its APPROVED reviews (newest first),
 * and the computed rating summary. Runs server-side with the anon key
 * (RLS: anyone can read businesses and approved reviews).
 */
export async function getBusinessReviews(slug: string): Promise<BusinessReviewsResult> {
  const supabase = getSupabase();

  const { data: business, error: bizError } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .maybeSingle<Business>();

  if (bizError) throw new Error(`No se pudo cargar el negocio: ${bizError.message}`);
  if (!business) return { business: null, reviews: [], summary: computeSummary([]) };

  const { data: reviews, error: revError } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', business.id)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .returns<Review[]>();

  if (revError) throw new Error(`No se pudieron cargar las reseñas: ${revError.message}`);

  const list = reviews ?? [];
  return { business, reviews: list, summary: computeSummary(list) };
}
