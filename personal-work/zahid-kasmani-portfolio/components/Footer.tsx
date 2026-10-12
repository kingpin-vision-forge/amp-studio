import { contact } from '@/content/contact';
import { profile } from '@/content/profile';
import { ui } from '@/content/ui';
import { tx, type Locale } from '@/lib/i18n';
import T, { Latin } from './T';

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="shell flex flex-col gap-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="text-ink"><T field={profile.name} locale={locale} /></span>
          <span aria-hidden="true" className="mx-2">/</span>
          <T field={profile.credentials} locale={locale} />
        </p>
        <ul className="flex gap-5">
          <li>
            <a href={`mailto:${contact.email}`} className="underline-offset-4 hover:text-ink hover:underline">
              {tx(ui.footer.email, locale)}
            </a>
          </li>
          <li>
            <a href={contact.linkedin} rel="me noopener" className="underline-offset-4 hover:text-ink hover:underline">
              <Latin text={tx(ui.footer.linkedin, locale)} locale={locale} />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
