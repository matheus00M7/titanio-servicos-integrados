import type { Metadata } from 'next';
import './globals.css';
import './portfolio.css';

export const metadata: Metadata = {
  title: 'Titanium Serviços Integrados | Serralheria e Estruturas Metálicas',
  description:
    'Portões basculantes, gradis, corrimãos, escadas, coberturas, estruturas metálicas e reformas em toda a Grande São Paulo.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
