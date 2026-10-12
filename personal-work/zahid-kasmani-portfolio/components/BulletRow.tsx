import type { ReactNode } from 'react';
import type { Bullet } from '@/content/types';
import type { Locale } from '@/lib/i18n';
import Figure from './Figure';
import MarginNote from './MarginNote';
import T from './T';

interface Props {
  bullet: Bullet;
  locale: Locale;
  /** Key figure shown beside the paragraph that explains it. */
  figure?: string;
  /** Small line above the text, e.g. the employer on Achievements. */
  meta?: ReactNode;
  /** Era filter attributes, when this row is filterable on its own. */
  era?: string;
}

export default function BulletRow({ bullet, locale, figure, meta, era }: Props) {
  return (
    <li
      data-reveal-trigger
      {...(era !== undefined ? { 'data-era-item': '', 'data-era': era } : {})}
      className="row-with-margin py-4"
    >
      <div className="measure">
        {figure ? <div className="mb-3"><Figure value={figure} locale={locale} /></div> : null}
        {meta ? <p className="mb-1 text-sm text-muted">{meta}</p> : null}
        <p><T field={bullet.text} locale={locale} /></p>
      </div>
      <div className="mt-2 lg:mt-1">
        <MarginNote callout={<T field={bullet.callout} locale={locale} />}>
          <T field={bullet.text} locale={locale} />
        </MarginNote>
      </div>
    </li>
  );
}
