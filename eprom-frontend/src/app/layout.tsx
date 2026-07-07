import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'E-ProM',
  description: 'Engineering Project Monitoring',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}