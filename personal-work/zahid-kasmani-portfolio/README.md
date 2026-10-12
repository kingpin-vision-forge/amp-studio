# Zahid Kasmani, CFO Portfolio

Standalone Next.js 15 (App Router) site: an editorial, storytelling portfolio with GCC-focused SEO.
Independent of the parent repository; it has its own `package.json` and lockfile.

```bash
pnpm install
pnpm dev            # http://localhost:3000 (redirects / to /en)
pnpm build          # static generation for every route, both locales
pnpm check:copy     # after build: em-dash/emoji/banned-phrase scan, title/description lengths, one H1
```

## Configuration

`site.config.ts`

| Flag | Default | Effect |
|---|---|---|
| `siteUrl` | `NEXT_PUBLIC_SITE_URL` or example.com | Canonicals, hreflang, sitemap, JSON-LD. Set before launch. |
| `showFullAddress` | `false` | Contact shows "Kuwait" only. The street address is never in JSON-LD. |
| `showPhone` | `true` | Phone row on Contact. |
| `hideVerifyItems` | `false` | Hides `status: 'verify'` items everywhere, including key figures and story sentences that depend on them. |
| `arabicReady` | `ARABIC_READY=true` env | Enables the Arabic toggle, `ar-KW` hreflang, indexing of `/ar`, and `/ar` in the sitemap. |

## Where things live

- `content/` holds all copy. `types.ts`, `eras.ts`, `profile.ts`, `roles.ts`, `highlights.ts`, `education.ts`, `training.ts`, `expertise.ts`, and `contact.ts` are the source content verbatim. `pages.ts` (titles, descriptions, H1s, summaries), `story.ts` (chapter intros), `links.ts`, and `ui.ts` (labels) are written from those facts only.
- `components/` has `Timeline`, `RoleCard`, `MarginNote`, `EraScope` (era filter), `StoryShell` (progress rail and pinned timeline), `Figure` and `FigureReveal`, `LocaleToggle`, and `JsonLd`.
- `lib/animations/` has GSAP registration (`gsap.ts`, `flip.ts`) and shared `matchMedia` queries (`media.ts`).
- `lib/seo.ts` builds the metadata, hreflang, and JSON-LD.

## Notes

- To translate, add `ar` to any `Localized` field. Missing fields fall back to English, isolated with `<bdi>`.
- `expertiseLenses` in `content/expertise.ts` maps each expertise group to lenses. The era filter uses it to dim tags. It is never rendered.
- Achievements are grouped under their first lens, so no item is listed twice.
