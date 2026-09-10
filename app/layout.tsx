import type { Metadata, Viewport } from 'next';
import { BUSINESS_INFO } from '@/lib/constants';
import './globals.css';

export const metadata: Metadata = {
  title: `${BUSINESS_INFO.name} - Reseñas de clientes`,
  description:
    'Reseñas verificadas de compradores de iPhones. Entrega en mano, garantía escrita y envíos a todo el país.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
