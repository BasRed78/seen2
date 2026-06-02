// i18n type plumbing.
//
// As we add new languages, extend `SUPPORTED_LOCALES` and create a matching
// dictionary file (e.g. `nl.ts`) keyed identically to `en.ts`. The `t()`
// helper in `index.ts` will pick the right dictionary at call time.
//
// Right now Seen is English-only by design — Dutch and other languages come
// later. The structure is in place so adding them is additive, not a refactor.

export const SUPPORTED_LOCALES = ['en'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

/**
 * Type of a single dictionary, derived from the English source of truth.
 * Other locale files must satisfy `Dictionary` to keep the keys in sync.
 */
export type Dictionary = Record<string, string>

export function isSupportedLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}
