import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { IBM_Plex_Sans_Arabic, Inter, Source_Serif_4 } from 'next/font/google';
import { siteConfig } from '@/site.config';
import { ui } from '@/content/ui';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { dirOf, isLocale, locales, tx } from '@/lib/i18n';
import '../globals.css';

const serif = Source_Serif_4({ subsets: ['latin'], weight: ['400', '600'], display: 'swap', variable: '--font-serif-face' });
const sans = Inter({ subsets: ['latin'], weight: ['400', '600'], display: 'swap', variable: '--font-sans-face' });
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '600'],
  display: 'swap',
  preload: false,
  variable: '--font-arabic-face',
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfaf7' },
    { media: '(prefers-color-scheme: dark)', color: '#121413' },
  ],
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} dir={dirOf(locale)} className={`${serif.variable} ${sans.variable} ${arabic.variable}`}>
      <body className="min-h-screen antialiased">
        <a href="#main" className="skip-link">{tx(ui.skipToContent, locale)}</a>
        <Header locale={locale} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
