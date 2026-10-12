export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.example.com', // replace with real domain
  showFullAddress: false, // street address hidden by default; city/country only
  showPhone: true,
  hideVerifyItems: false, // set true in production to hide items with status 'verify'
  arabicReady: process.env.ARABIC_READY === 'true', // false until the Arabic translation is complete
};
