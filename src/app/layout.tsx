import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Do\'kon Tizimi - Boshqaruv Paneli',
  description: 'Professional do\'kon boshqaruv tizimi - mahsulotlar, xodimlar, davomat va hisobotlar',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
