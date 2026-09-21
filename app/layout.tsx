import type { Metadata } from 'next';
import './globals.css';
import './portfolio.css';

export const metadata: Metadata = {
  title: 'Titânio Serviços Integrados | Serralheria e Estruturas Metálicas',
  description:
    'Serralheria, corrimãos, escadas, coberturas, estruturas metálicas e reformas em toda a Grande São Paulo.',
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
