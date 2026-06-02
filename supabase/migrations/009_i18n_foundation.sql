-- i18n foundation: add a locale column to users.
--
-- Today only 'en' is allowed. To add a language later:
--   1. Drop and recreate the CHECK constraint with the new locale included,
--      e.g. CHECK (locale IN ('en', 'nl'))
--   2. Create the matching dictionary in src/lib/i18n/<code>.ts
--   3. Add the locale code to SUPPORTED_LOCALES in src/lib/i18n/types.ts
--
-- This column exists now so future translation work doesn't require backfilling
-- user records — every existing and new user has a locale from day one.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'en';

ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_locale_check;

ALTER TABLE users
  ADD CONSTRAINT users_locale_check
  CHECK (locale IN ('en'));
