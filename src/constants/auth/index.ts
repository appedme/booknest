// Authentication provider configuration
export const AUTH_PROVIDERS = {
  GOOGLE: 'google',
} as const;

// OAuth scopes for Google
export const GOOGLE_SCOPES = [
  'openid',
  'email',
  'profile',
] as const;

// Auth pages configuration
export const AUTH_PAGES = {
  SIGN_IN: '/auth/signin',
  SIGN_OUT: '/auth/signout',
  ERROR: '/auth/error',
  VERIFY_REQUEST: '/auth/verify-request',
} as const;

// Session configuration
export const SESSION_CONFIG = {
  MAX_AGE: 30 * 24 * 60 * 60, // 30 days
  UPDATE_AGE: 24 * 60 * 60, // 24 hours
} as const;

// Auth cookies
export const AUTH_COOKIES = {
  SESSION_TOKEN: 'next-auth.session-token',
  CALLBACK_URL: 'next-auth.callback-url',
  CSRF_TOKEN: 'next-auth.csrf-token',
} as const;
