import Link from 'next/link';
import { pages } from '@/content/pages';

export default function NotFound() {
  return (
    <div className="shell py-24">
      <p className="font-serif text-3xl">404</p>
      <Link href="/en" className="mt-4 inline-block underline decoration-accent underline-offset-4">{pages.home.crumb.en}</Link>
    </div>
  );
}
