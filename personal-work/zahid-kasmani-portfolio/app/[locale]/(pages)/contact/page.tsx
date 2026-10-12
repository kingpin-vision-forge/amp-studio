import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { contact } from '@/content/contact';
import { pages } from '@/content/pages';
import { ui } from '@/content/ui';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageIntro from '@/components/PageIntro';
import T, { Latin } from '@/components/T';
import { resolveLocale, type LocaleParams } from '@/lib/page';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return buildMetadata('contact', await resolveLocale(params));
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const link = 'underline decoration-rule underline-offset-4 hover:decoration-accent';
  const rows = [
    { label: ui.contact.location, value: <Latin text={siteConfig.showFullAddress ? contact.address : contact.addressShort} locale={locale} /> },
    ...(siteConfig.showPhone
      ? [{ label: ui.contact.phone, value: <a className={`${link} tabular`} href={`tel:${contact.phone.replace(/-/g, '')}`}><bdi>{contact.phone}</bdi></a> }]
      : []),
    { label: ui.contact.email, value: <a className={link} href={`mailto:${contact.email}`}><bdi>{contact.email}</bdi></a> },
    { label: ui.contact.linkedin, value: <a className={link} href={contact.linkedin} rel="me noopener"><bdi>{contact.linkedin.replace('https://', '')}</bdi></a> },
  ];

  return (
    <div className="shell">
      <Breadcrumbs page="contact" locale={locale} />
      <PageIntro copy={pages.contact} locale={locale} />
      <dl className="measure border-t border-rule">
        {rows.map((r) => (
          <div key={r.label.en} className="grid gap-x-8 border-b border-rule py-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <dt className="text-sm text-muted"><T field={r.label} locale={locale} /></dt>
            <dd className="break-words">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
