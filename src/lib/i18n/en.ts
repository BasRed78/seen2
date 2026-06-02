import type { Dictionary } from './types'

// English source-of-truth dictionary.
//
// Convention: keys are dotted paths grouped by feature (e.g. `tester.welcome.title`,
// `practice.intention.edit`). When a new feature is added, add its keys here first,
// then translate into each other locale's file.
//
// Interpolation: use `{name}` style placeholders. The `t()` helper substitutes them.

const en: Dictionary = {
  // Tester invite + admin
  'tester.admin.title': 'Testers',
  'tester.admin.subtitle': 'Invite testers and track their progress.',
  'tester.admin.signInTitle': 'Tester admin',
  'tester.admin.passwordPlaceholder': 'Admin password',
  'tester.admin.signIn': 'Sign in',
  'tester.admin.signingIn': 'Loading...',
  'tester.admin.wrongPassword': 'Wrong password',
  'tester.admin.createTitle': 'Invite a tester',
  'tester.admin.namePlaceholder': 'Name (required)',
  'tester.admin.emailPlaceholder': 'Email (optional)',
  'tester.admin.notesPlaceholder': 'Notes (optional)',
  'tester.admin.createButton': 'Create invite',
  'tester.admin.creating': 'Creating...',
  'tester.admin.listTitle': 'Invited testers',
  'tester.admin.listEmpty': 'No testers yet. Invite one above.',
  'tester.admin.statusInvited': 'Invited',
  'tester.admin.statusAcceptedNda': 'NDA accepted',
  'tester.admin.statusOnboarded': 'Onboarded',
  'tester.admin.statusActive': 'Active',
  'tester.admin.copyLink': 'Copy invite link',
  'tester.admin.linkCopied': 'Copied',
  'tester.admin.lastActive': 'Last active {when}',
  'tester.admin.invitedAt': 'Invited {when}',

  // Tester login (invite code entry)
  'tester.login.title': 'Welcome',
  'tester.login.subtitle': 'Enter your invite code to get started.',
  'tester.login.codePlaceholder': 'Invite code',
  'tester.login.submit': 'Continue',
  'tester.login.submitting': 'One moment...',
  'tester.login.invalidCode': 'That code doesn\'t look right. Check it and try again, or contact Bas.',
  'tester.login.revoked': 'This invite has been revoked. Contact Bas if this is unexpected.',

  // Tester NDA
  'tester.nda.eyebrow': 'Confidential · for {name}',
  'tester.nda.title': 'Before you start.',
  'tester.nda.intro': 'You\'re about to try Seen, a product that\'s still in development and not yet public. Some of what you see is rough, some is unfinished, and your feedback is what shapes the next version.',
  'tester.nda.confirmIntro': 'By tapping ‘I agree’ you confirm that:',
  'tester.nda.point1': 'You\'ll treat what you see here as confidential.',
  'tester.nda.point2': 'You won\'t share screenshots, quotes, or text without Bas\'s permission.',
  'tester.nda.point3': 'You\'ll send feedback and questions directly to Bas.',
  'tester.nda.outro': 'This is a closed test, not a public launch. Thanks for being part of it.',
  'tester.nda.button': 'I agree, continue',
  'tester.nda.submitting': 'One moment...',
  'tester.nda.error': 'Something went wrong. Try again or reach out to Bas.',
  'tester.nda.privacyNote': 'This link is personal to you. Visits are recorded for Bas to see.',

  // Tester onboarding wizard
  'tester.onboarding.welcome.title': 'Welcome to Seen.',
  'tester.onboarding.welcome.body': 'Seen is a companion app for people in therapy. It helps you reflect after sessions, practice between them, and walk into the next one prepared.',
  'tester.onboarding.welcome.cta': 'Start',

  'tester.onboarding.what.title': 'What you\'re testing.',
  'tester.onboarding.what.body': 'You\'ll use the app as if you were a real Phase 2 user. Daily check-ins, post-session reflections, exercises, and session prep. There\'s a quick guide inside that walks you through the key flows.',
  'tester.onboarding.what.cta': 'Next',

  'tester.onboarding.install.title': 'Install it on your phone.',
  'tester.onboarding.install.bodyIos': 'On iPhone: open this page in Safari, tap the Share button, then “Add to Home Screen”. That gives you the app icon and full-screen experience.',
  'tester.onboarding.install.bodyAndroid': 'On Android: open this page in Chrome, tap the menu (⋮) and choose “Install app” or “Add to Home Screen”.',
  'tester.onboarding.install.bodyDesktop': 'On desktop: in Chrome look for the install icon in the address bar. Optional but recommended.',
  'tester.onboarding.install.cta': 'Done, next',

  'tester.onboarding.name.title': 'What should we call you?',
  'tester.onboarding.name.placeholder': 'Your first name',
  'tester.onboarding.name.cta': 'Save and start',
  'tester.onboarding.name.saving': 'One moment...',

  'tester.onboarding.finishingTitle': 'Setting you up...',
  'tester.onboarding.errorTitle': 'Something went wrong.',
  'tester.onboarding.errorRetry': 'Try again',

  // Generic actions
  'common.back': 'Back',
  'common.next': 'Next',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.close': 'Close',
  'common.continue': 'Continue',
  'common.copy': 'Copy',
  'common.copied': 'Copied',
  'common.unknown': '—',
}

export default en
