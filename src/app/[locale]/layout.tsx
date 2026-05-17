import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

const locales = ['uz', 'en', 'ru'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function getMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__LOCALE__ = ${JSON.stringify(locale)}; 
              window.__MESSAGES__ = ${JSON.stringify(messages)};
              
              // Confirm va alert funksiyalarini override qilish
              window.confirm = function() { return true; };
              window.alert = function() {};
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
