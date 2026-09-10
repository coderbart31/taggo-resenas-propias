'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { BUSINESS_INFO, COPY } from '@/lib/constants';

const MAX_COMMENT = 500;
const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const fieldStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'inherit',
  fontSize: 15,
  color: 'var(--color-text-primary)',
  background: 'var(--color-surface-bg)',
  border: '1px solid var(--color-border)',
  borderRadius: 12,
  padding: '12px 14px',
  outlineColor: 'var(--color-accent)',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 500,
  color: 'var(--color-text-secondary)',
  letterSpacing: '0.01em',
};

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [model, setModel] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(list: FileList | null) {
    if (!list) return;
    const next: File[] = [...photos];
    for (const file of Array.from(list)) {
      if (next.length >= MAX_PHOTOS) break;
      if (!ACCEPTED.includes(file.type)) {
        setError('Formato de imagen no permitido (jpg, png, heic o webp).');
        continue;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        setError('Cada foto debe pesar menos de 5 MB.');
        continue;
      }
      next.push(file);
    }
    setPhotos(next.slice(0, MAX_PHOTOS));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removePhoto(idx: number) {
    setPhotos((p) => p.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError('Ingresá tu nombre.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Elegí una calificación de 1 a 5 estrellas.');
      return;
    }
    if (comment.trim().length < 1) {
      setError('Contanos brevemente tu experiencia.');
      return;
    }

    const body = new FormData();
    body.set('slug', BUSINESS_INFO.slug);
    body.set('customer_name', name.trim());
    body.set('rating', String(rating));
    body.set('comment', comment.trim());
    if (model.trim()) body.set('product_model', model.trim());
    photos.forEach((file) => body.append('photos', file));

    setState('submitting');
    try {
      const res = await fetch('/api/reviews', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setState('error');
        setError(data.error ?? 'No se pudo enviar la reseña. Probá de nuevo.');
        return;
      }
      setState('success');
    } catch {
      setState('error');
      setError('Hubo un problema de conexión. Probá de nuevo.');
    }
  }

  if (state === 'success') {
    return (
      <div
        style={{
          background: 'var(--color-surface-bg)',
          borderRadius: 22,
          padding: '40px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          alignItems: 'center',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'var(--color-chip-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M4 12.5l5 5L20 6.5"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 style={{ fontSize: 19, fontWeight: 400 }}>{COPY.successMessage}</h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', maxWidth: 360, textWrap: 'pretty' }}>
          Revisamos cada reseña antes de publicarla. ¡Gracias por tu tiempo!
        </p>
        <Link
          href={`/${BUSINESS_INFO.slug}`}
          style={{
            marginTop: 8,
            display: 'inline-block',
            background: 'var(--color-cta)',
            color: '#fff',
            padding: '14px 32px',
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Volver a las reseñas
        </Link>
      </div>
    );
  }

  const submitting = state === 'submitting';

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'var(--color-surface-bg)',
        borderRadius: 22,
        padding: '32px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.05)',
      }}
    >
      {/* Rating */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={labelStyle}>Tu calificación *</span>
        <div
          role="radiogroup"
          aria-label="Calificación en estrellas"
          style={{ display: 'flex', gap: 6 }}
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const active = (hover || rating) >= n;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
                onMouseEnter={() => setHover(n)}
                onClick={() => setRating(n)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: 32,
                  lineHeight: 1,
                  padding: 2,
                  color: active ? 'var(--color-accent)' : 'var(--color-star-empty)',
                  transition: 'color 120ms ease, transform 120ms ease',
                  transform: active ? 'scale(1.05)' : 'none',
                }}
              >
                ★
              </button>
            );
          })}
        </div>
      </div>

      {/* Name */}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={labelStyle}>Nombre *</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          autoComplete="name"
          placeholder="Cómo querés que aparezca"
          style={fieldStyle}
          required
        />
      </label>

      {/* Comment */}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={labelStyle}>Tu experiencia *</span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
          rows={5}
          placeholder="¿Cómo fue la compra? ¿Cómo llegó el equipo?"
          style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.5 }}
          required
        />
        <span style={{ fontSize: 11.5, color: 'var(--color-text-secondary)', alignSelf: 'flex-end' }}>
          {comment.length}/{MAX_COMMENT}
        </span>
      </label>

      {/* Model */}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={labelStyle}>Modelo comprado</span>
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          maxLength={60}
          placeholder="Ej. iPhone 15 · 128 GB"
          style={fieldStyle}
        />
      </label>

      {/* Photos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={labelStyle}>Fotos (opcional, hasta {MAX_PHOTOS})</span>
        {photos.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {photos.map((file, i) => (
              <span key={`${file.name}-${i}`} style={{ position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Foto ${i + 1}`}
                  style={{ width: 96, height: 96, borderRadius: 12, objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  aria-label={`Quitar foto ${i + 1}`}
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'var(--color-cta)',
                    color: '#fff',
                    fontSize: 13,
                    lineHeight: 1,
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {photos.length < MAX_PHOTOS && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/heic,image/heif,image/webp"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}
          />
        )}
      </div>

      {error && (
        <p role="alert" style={{ fontSize: 13, color: '#c0392b' }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          background: 'var(--color-cta)',
          color: '#fff',
          border: 'none',
          padding: '16px 40px',
          borderRadius: 999,
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: '-0.01em',
          cursor: submitting ? 'default' : 'pointer',
          opacity: submitting ? 0.6 : 1,
          boxShadow: '0 6px 24px rgba(0,0,0,0.22)',
        }}
      >
        {submitting ? 'Enviando…' : 'Enviar reseña'}
      </button>
    </form>
  );
}
