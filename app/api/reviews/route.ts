import { NextResponse, type NextRequest } from 'next/server';
import { getSupabase } from '@/lib/supabase/client';
import { getBusinessReviews } from '@/lib/reviews';
import { BUSINESS_INFO } from '@/lib/constants';
import { checkRateLimit, getRateLimitKey } from '@/lib/utils/rate-limit';
import type { ApiResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

const PHOTO_BUCKET = 'review-photos';
const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp',
]);

const RATE_LIMIT = Number(process.env.RATE_LIMIT_REQUESTS_PER_HOUR ?? '3') || 3;

function json<T>(body: ApiResponse<T>, status = 200) {
  return NextResponse.json(body, { status });
}

function extFromType(type: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/heic': 'heic',
    'image/heif': 'heif',
    'image/webp': 'webp',
  };
  return map[type] ?? 'jpg';
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug') ?? BUSINESS_INFO.slug;
  try {
    const result = await getBusinessReviews(slug);
    return json({ success: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return json({ success: false, error: message }, 500);
  }
}

export async function POST(request: NextRequest) {
  // Rate limit per IP
  const ip = getRateLimitKey(request);
  const rl = checkRateLimit(ip, RATE_LIMIT);
  if (!rl.allowed) {
    return json(
      {
        success: false,
        error: `Alcanzaste el límite de ${RATE_LIMIT} reseñas por hora. Probá más tarde.`,
      },
      429,
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ success: false, error: 'Formato de envío inválido.' }, 400);
  }

  const slug = String(form.get('slug') ?? BUSINESS_INFO.slug).trim();
  const customerName = String(form.get('customer_name') ?? '').trim();
  const ratingRaw = Number(form.get('rating'));
  const comment = String(form.get('comment') ?? '').trim();
  const productModel = String(form.get('product_model') ?? '').trim();

  // Validation
  if (customerName.length < 2 || customerName.length > 80) {
    return json({ success: false, error: 'Ingresá tu nombre (2 a 80 caracteres).' }, 400);
  }
  if (!Number.isInteger(ratingRaw) || ratingRaw < 1 || ratingRaw > 5) {
    return json({ success: false, error: 'Elegí una calificación de 1 a 5 estrellas.' }, 400);
  }
  if (comment.length < 1 || comment.length > 500) {
    return json({ success: false, error: 'El comentario debe tener entre 1 y 500 caracteres.' }, 400);
  }
  if (productModel.length > 60) {
    return json({ success: false, error: 'El modelo es demasiado largo.' }, 400);
  }

  let supabase;
  try {
    supabase = getSupabase();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Supabase no configurado';
    return json({ success: false, error: message }, 500);
  }

  // Resolve business
  const { data: business, error: bizError } = await supabase
    .from('businesses')
    .select('id, slug')
    .eq('slug', slug)
    .maybeSingle<{ id: string; slug: string }>();

  if (bizError) {
    return json({ success: false, error: `Error al buscar el negocio: ${bizError.message}` }, 500);
  }
  if (!business) {
    return json({ success: false, error: `No existe el negocio "${slug}".` }, 404);
  }

  // Photos (optional)
  const files = form
    .getAll('photos')
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_PHOTOS);

  const photoUrls: string[] = [];
  for (const file of files) {
    if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
      return json({ success: false, error: 'Formato de imagen no permitido (jpg, png, heic o webp).' }, 400);
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return json({ success: false, error: 'Cada foto debe pesar menos de 5 MB.' }, 400);
    }
    const path = `${slug}/${crypto.randomUUID()}.${extFromType(file.type)}`;
    const { error: upErr } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) {
      return json({ success: false, error: `No se pudo subir la foto: ${upErr.message}` }, 500);
    }
    const { data: pub } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);
    photoUrls.push(pub.publicUrl);
  }

  // Insert (approved = true -> published immediately, no manual moderation).
  // No .select() here on purpose: keeps working the same way regardless of
  // the SELECT policy, and we don't need the row back — a success flag is enough.
  const { error: insErr } = await supabase.from('reviews').insert({
    business_id: business.id,
    customer_name: customerName,
    rating: ratingRaw,
    comment,
    product_model: productModel || null,
    verified_purchase: false,
    photo_urls: photoUrls,
    approved: true,
  });

  if (insErr) {
    return json({ success: false, error: `No se pudo guardar la reseña: ${insErr.message}` }, 500);
  }

  return json({ success: true }, 201);
}
