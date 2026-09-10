# Taggo Reseñas Propias - Setup Guide

Sistema de reseñas propias para negocios sin local físico (MVP con AppleMart).

## 📋 Requisitos previos

- Node.js 18+ y npm
- Cuenta de Supabase (crear nueva bajo tu usuario personal)
- Cuenta de GitHub (para el repo personal)
- Cuenta de Vercel (para deploy)

## 🚀 Instalación local

### 1. Clonar el repo
```bash
git clone https://github.com/TU_USUARIO/taggo-resenas-propias.git
cd taggo-resenas-propias
npm install
```

### 2. Configurar Supabase

**IMPORTANTE**: Crea un proyecto Supabase NUEVO bajo tu cuenta personal en https://supabase.com

#### Crear tablas en Supabase SQL Editor:

```sql
-- Tabla businesses
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  product_model TEXT,
  verified_purchase BOOLEAN DEFAULT false,
  photo_urls TEXT[] DEFAULT '{}',
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear índices
CREATE INDEX idx_reviews_business_id ON reviews(business_id);
CREATE INDEX idx_reviews_approved ON reviews(approved);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Habilitar RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies: cualquiera puede leer businesses y reviews aprobadas
CREATE POLICY "Anyone can read businesses"
  ON businesses FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read approved reviews"
  ON reviews FOR SELECT
  USING (approved = true);

CREATE POLICY "Anyone can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- Para moderación manual desde dashboard de Supabase: permite updates en approved
CREATE POLICY "Update reviews (admin only - manual update)"
  ON reviews FOR UPDATE
  USING (true)
  WITH CHECK (true);
```

#### Crear Storage bucket:
1. Ir a Storage en Supabase
2. Crear nuevo bucket: `review-photos`
3. Hacer **público** (Set public)
4. Actualizar políticas:
   - Permitir lectura pública
   - Permitir upload desde app con validación

#### Obtener credenciales:
- Copiar `URL` del proyecto (ej: `https://xxxxx.supabase.co`)
- Copiar `anon key` (la pública, no la secreta)

### 3. Configurar variables de entorno

Crear `.env.local` con:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# Business Config
NEXT_PUBLIC_BUSINESS_SLUG=applemart
NEXT_PUBLIC_BUSINESS_NAME=AppleMart
NEXT_PUBLIC_BUSINESS_HANDLE=@applemart.cba
NEXT_PUBLIC_BUSINESS_LOCATION=Córdoba, Argentina

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_HOUR=3
```

### 4. Seed inicial (insertar primer business)

En Supabase SQL Editor:
```sql
INSERT INTO businesses (slug, name, logo_url)
VALUES ('applemart', 'AppleMart', '/logos/applemart-logo.png')
ON CONFLICT (slug) DO NOTHING;
```

### 5. Correr localmente

```bash
npm run dev
```

Visitar: http://localhost:3000/applemart

## 📁 Estructura del proyecto

```
taggo-resenas-propias/
├── app/
│   ├── layout.tsx           # Root layout con variables de diseño
│   ├── page.tsx             # Redirect a /applemart
│   ├── globals.css          # Estilos globales
│   ├── applemart/
│   │   ├── page.tsx         # Página pública de reseñas
│   │   └── dejar-resena/
│   │       └── page.tsx     # Formulario de carga
│   └── api/
│       └── reviews/
│           ├── route.ts     # POST crear reseña, GET sumario
│           └── [slug]/
│               └── route.ts # GET reseñas por business
├── components/
│   ├── ReviewCard/          # Tarjeta individual de reseña
│   ├── ReviewForm/          # Formulario de carga
│   └── ReviewSummary/       # Bloque de resumen + estrellas
├── lib/
│   ├── supabase/
│   │   └── client.ts        # Cliente Supabase
│   ├── utils/
│   │   └── rate-limit.ts    # Rate limiter por IP
│   ├── types.ts             # Types TypeScript
│   └── constants.ts         # Tokens de diseño, copy, etc.
├── public/
│   └── logos/
│       └── applemart-logo.png
├── .env.local               # Variables de entorno (NO COMMITEAR)
└── package.json
```

## 🎨 Design System

Todos los colores, tipografía y espaciados están definidos en `lib/constants.ts` siguiendo el mockup de Claude Design (AppleMart_landing_de_resenas).

### Paleta de colores
- **Acento coral**: `#db6a46` (del logo)
- **Fondo neutral**: `#f5f5f7` (Apple-like)
- **Texto oscuro**: `#1d1d1f`
- **Texto secundario**: `#6e6e73`

### Tipografía
- Font stack: Sistema Apple (-apple-system, BlinkMacSystemFont, etc.)
- Pesos: 200 (thin), 300 (light), 400 (normal), 500 (medium)

## 🔄 Flujo de funcionamiento

### Usuario deja reseña
1. Click en "Dejá tu reseña" en `/applemart`
2. Rellena formulario en `/applemart/dejar-resena`
3. Sube fotos (hasta 3, validadas)
4. Envía → POST `/api/reviews`
5. API valida rate limit, guarda en DB con `approved: false`
6. Mostrar mensaje de agradecimiento

### Moderador aprueba
1. Ir a Supabase Dashboard → Table Editor → `reviews`
2. Editar registro, cambiar `approved` de `false` a `true`
3. Click en "Update" (update automático del timestamp)

### Mostrar en página pública
- Página `/applemart` trae reviews con `approved: true`
- Calcula promedio y desglose dinámico
- Render de tarjetas con nombre, fecha, estrellas, fotos

## 📱 Mobile-first

El diseño es responsive y pensado para mobile (max-width 640px). Testear en:
- iPhone 12/13/14/15
- Link compartido en Instagram stories/bio
- Link compartido en WhatsApp

## 🚢 Deploy en Vercel

### 1. Crear repo en GitHub
```bash
git remote add origin https://github.com/TU_USUARIO/taggo-resenas-propias.git
git branch -M main
git push -u origin main
```

### 2. Conectar Vercel
- Ir a https://vercel.com/new
- Seleccionar el repo `taggo-resenas-propias`
- Framework: Next.js (detectado automático)
- Environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_BUSINESS_SLUG`
  - `NEXT_PUBLIC_BUSINESS_NAME`
  - `NEXT_PUBLIC_BUSINESS_HANDLE`
  - `NEXT_PUBLIC_BUSINESS_LOCATION`
  - `RATE_LIMIT_REQUESTS_PER_HOUR=3`
- Click "Deploy"

### 3. Confirmar
- Vercel te genera un dominio gratuito (ej: `taggo-resenas.vercel.app`)
- URL pública: `https://taggo-resenas.vercel.app/applemart`
- Copiar link a Instagram/WhatsApp

## 🔐 Seguridad

- **Rate Limiting**: máx 3 reseñas por IP por hora
- **Validación de fotos**: tipo (jpg/png/heic), tamaño (<5MB)
- **Moderación manual**: reseñas aparecen solo con `approved: true`
- **RLS en Supabase**: cualquiera puede leer/crear, pero cambios de moderación requieren dashboard

## 📝 Roadmap futuro

- [ ] Panel de admin personalizado (no es requerimiento MVP)
- [ ] Cambiar dominio (`resenas.applemart.cba` o similar)
- [ ] Agregar más businesses (escalabilidad multi-tenant)
- [ ] Ordenamiento por "mejor puntuadas" / "con fotos"
- [ ] Lightbox de fotos
- [ ] Paginación infinita

## ❓ FAQ

**P: ¿Dónde veo las reseñas pendientes?**
R: En Supabase Dashboard → Table Editor → `reviews` → filtro por `approved = false`

**P: ¿Qué pasó si alguien hace spam?**
R: Rate limiting por IP limita a 3 por hora. Para más protección, cambiar `RATE_LIMIT_REQUESTS_PER_HOUR` en .env

**P: ¿Cómo cambio el logo?**
R: Reemplazar `/public/logos/applemart-logo.png` y actualizar en Supabase (`businesses.logo_url`)

**P: ¿Puedo editar una reseña ya publicada?**
R: Por ahora no (por diseño). Solo puedes cambiar `approved` en Supabase.

## 🆘 Soporte

Para preguntas sobre Supabase: https://supabase.com/docs
Para preguntas sobre Next.js: https://nextjs.org/docs
Para preguntas sobre Vercel: https://vercel.com/docs
