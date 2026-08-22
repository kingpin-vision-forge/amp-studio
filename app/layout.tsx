import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://ampstudio.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AMP Studio: Wedding & Event Photographer in Bijapur, Karnataka",
    template: "%s | AMP Studio, Bijapur",
  },
  description:
    "AMP Studio is a wedding and event photography & videography studio in Bijapur (Vijayapura), Karnataka. We cover weddings, engagements, maternity, family, and portrait sessions across North Karnataka.",
  keywords: [
    "wedding photographer Bijapur",
    "wedding photography Vijayapura",
    "videographer Bijapur",
    "best photographer in Bijapur",
    "engagement photography Bijapur",
    "maternity photography Bijapur",
    "family portrait photographer Bijapur",
    "candid wedding photography Karnataka",
  ],
  authors: [{ name: "AMP Studio" }],
  openGraph: {
    title: "AMP Studio: Wedding & Event Photographer in Bijapur, Karnataka",
    description:
      "Wedding and event photography & videography studio in Bijapur, Karnataka, covering weddings, engagements, maternity, family, and portrait sessions.",
    url: siteUrl,
    siteName: "AMP Studio",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/logo.png", width: 433, height: 433, alt: "AMP Studio logo" }],
  },
  twitter: {
    card: "summary",
    title: "AMP Studio: Wedding & Event Photographer in Bijapur, Karnataka",
    description:
      "Wedding and event photography & videography studio in Bijapur, Karnataka.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}/#business`,
  name: "AMP Studio",
  description:
    "Wedding and event photography & videography studio in Bijapur (Vijayapura), Karnataka, covering weddings, engagements, maternity, family, and portrait sessions across North Karnataka.",
  image: `${siteUrl}/logo.png`,
  url: siteUrl,
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bijapur (Vijayapura)",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "City", name: "Bijapur" },
    { "@type": "AdministrativeArea", name: "Vijayapura District" },
    { "@type": "State", name: "Karnataka" },
  ],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wedding & Elopement Photography" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Couples & Engagement Photography" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Family Portrait Photography" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Maternity Photography" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Portrait Sessions" } },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
