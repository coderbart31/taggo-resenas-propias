/**
 * Design tokens from AppleMart landing de reseñas mockup
 * All values are exact matches from the design spec
 */

export const DESIGN_TOKENS = {
  colors: {
    // Backgrounds
    pageBg: '#f5f5f7',
    surfaceBg: '#ffffff',
    logoBg: '#fffdf2',
    avatarBg: '#f0f0f3',
    chipBgNeutral: '#f5f5f7',
    chipBgAccent: '#fbf1ec',
    divisorBg: '#f0f0f3',

    // Text
    textPrimary: '#1d1d1f',
    textSecondary: '#6e6e73',
    textTertiary: '#515154',
    textStarEmpty: '#d2d2d7',
    textAccentDark: '#a05233',

    // Accents
    accentCoral: '#db6a46',
    ctaNormal: '#1d1d1f',
    ctaHover: '#000000',

    // Borders
    borderSuble: '#eaeaee',
  },

  // Font stack (Apple system fonts)
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, sans-serif',

  // Font sizes (in px)
  fontSize: {
    xs: '10.5px',
    sm: '11.5px',
    base: '12px',
    md: '12.5px',
    lg: '13px',
    xl: '14px',
    '2xl': '15px',
    '3xl': '15.5px',
    '4xl': '16px',
    '5xl': '19px',
    '6xl': '22px',
    '7xl': '27px',
    '8xl': '84px',
  },

  // Font weights
  fontWeight: {
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
  },

  // Letter spacing
  letterSpacing: {
    tightest: '-0.04em',
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0em',
    wide: '0.01em',
    wider: '0.06em',
    widest: '0.08em',
    star: '0.12em',
    starBig: '0.14em',
  },

  // Line heights
  lineHeight: {
    title: '0.9',
    body: '1.55',
    default: '1.06',
  },

  // Border radius
  borderRadius: {
    sm: '12px',
    md: '20px',
    lg: '22px',
    full: '999px',
  },

  // Shadows
  shadow: {
    reviewCard: '0 1px 2px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.04)',
    summaryCard: '0 1px 2px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.05)',
    logo: '0 1px 3px rgba(0,0,0,0.07)',
    cta: '0 6px 24px rgba(0,0,0,0.22)',
  },

  // Spacing scale
  spacing: {
    3: '3px',
    5: '5px',
    6: '6px',
    8: '8px',
    10: '10px',
    13: '13px',
    14: '14px',
    16: '16px',
    18: '18px',
    20: '20px',
    22: '22px',
    26: '26px',
    32: '32px',
    40: '40px',
    44: '44px',
    52: '52px',
    56: '56px',
    72: '72px',
  },

  // Breakpoints
  maxWidth: {
    content: '640px',
    distribution: '300px',
    cta: '400px',
    legal: '420px',
  },
};

// Formatted text constants
export const BUSINESS_INFO = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'AppleMart',
  slug: process.env.NEXT_PUBLIC_BUSINESS_SLUG || 'applemart',
  handle: process.env.NEXT_PUBLIC_BUSINESS_HANDLE || '@applemart.cba',
  location: process.env.NEXT_PUBLIC_BUSINESS_LOCATION || 'Córdoba, Argentina',
  headline: 'Lo que dicen nuestros clientes',
  guaranteeItems: ['Entrega en mano', 'Garantía escrita', 'Envíos a todo el país'],
};

export const COPY = {
  submitHeading: '¿Ya compraste tu iPhone?',
  submitSubheading: 'Contanos cómo fue tu experiencia. Toma menos de un minuto y ayuda a los próximos compradores.',
  submitCta: 'Dejá tu reseña',
  successMessage: '¡Gracias por tu reseña! La vamos a publicar en breve',
  reviewsHeading: 'Reseñas',
  reviewsSort: 'Más recientes',
  verifiedPurchase: 'Compra verificada',
  sectionHeading: 'Reseñas',
};

export const RATING_SCALE = [
  { stars: 5, label: '5 ★' },
  { stars: 4, label: '4 ★' },
  { stars: 3, label: '3 ★' },
  { stars: 2, label: '2 ★' },
  { stars: 1, label: '1 ★' },
] as const;
