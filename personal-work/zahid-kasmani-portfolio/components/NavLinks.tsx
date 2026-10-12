'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavItem { href: string; label: string; }

export default function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <ul className="flex gap-x-5 gap-y-1 overflow-x-auto whitespace-nowrap py-1 text-sm lg:flex-wrap lg:overflow-visible">
      {items.map((item) => {
        const current = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? 'page' : undefined}
              className="text-muted underline-offset-[6px] hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-accent aria-[current=page]:decoration-2"
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
