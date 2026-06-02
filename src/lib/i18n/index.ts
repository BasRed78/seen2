// Tiny hand-rolled i18n. Intentionally NOT a library.
//
// Usage in components:
//   import { t } from '@/lib/i18n'
//   t('tester.welcome.title')
//   t('tester.admin.lastActive', { when: '2 days ago' })
//
// Usage from server (API routes, AI prompts) — pass locale explicitly:
//   t('tester.welcome.title', undefined, user.locale)
//
// Adding a language:
//   1. Add the locale code to SUPPORTED_LOCALES in types.ts
//   2. Create src/lib/i18n/<code>.ts exporting a `Dictionary` with the same keys
//   3. Import it below and add it to the `dictionaries` map
//   4. Extend the migration's CHECK constraint on users.locale
//
// We deliberately avoid runtime nesting, ICU MessageFormat, pluralisation
// libraries etc. for now — the surface area we need is small. When a translator
// asks for plural rules or gender, we'll swap this for next-intl or similar.

import en from './en'
import {
  DEFAULT_LOCALE,
  type Dictionary,
  type Locale,
  isSupportedLocale,
} from './types'

export { DEFAULT_LOCALE, SUPPORTED_LOCALES, isSupportedLocale } from './types'
export type { Locale, Dictionary } from './types'

const dictionaries: Record<Locale, Dictionary> = {
  en,
}

/**
 * Look up a translation. Falls back to the default locale, then to the raw
 * key, so a missing translation is loud-ish in the UI rather than crashing.
 */
export function t(
  key: string,
  vars?: Record<string, string | number>,
  locale: Locale = DEFAULT_LOCALE,
): string {
  const dict = dictionaries[locale] || dictionaries[DEFAULT_LOCALE]
  const fallback = dictionaries[DEFAULT_LOCALE]
  const template = dict[key] ?? fallback[key] ?? key
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, name) => {
    const v = vars[name]
    return v === undefined ? `{${name}}` : String(v)
  })
}

/**
 * Resolve a locale from arbitrary input (e.g. a header, a URL param, a stored
 * user record). Unknown or undefined inputs fall back to the default.
 */
export function resolveLocale(value: unknown): Locale {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE
}

/**
 * Best-effort browser-language detection for new signups, used to seed a
 * user's `locale` column. Call from client code only. Returns DEFAULT_LOCALE
 * when the browser language doesn't match a supported one.
 */
export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const raw of langs) {
    if (!raw) continue
    const short = raw.toLowerCase().split('-')[0]
    if (isSupportedLocale(short)) return short
  }
  return DEFAULT_LOCALE
}
