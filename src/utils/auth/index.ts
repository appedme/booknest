/**
 * Auth utilities for handling authentication logic
 */

/**
 * Checks if user is authenticated and redirects if not
 */
export function requireAuth(isAuthenticated: boolean, redirectFn: () => void) {
  if (!isAuthenticated) {
    redirectFn();
    return false;
  }
  return true;
}

/**
 * Handles authentication error messages
 */
export function getAuthErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message?: string }).message || 'An unknown error occurred.';
  }
  return 'An unknown error occurred.';
}

/**
 * Formats user display name
 */
export function formatUserDisplayName(user: { name?: string | null; email?: string | null }): string {
  return user?.name || user?.email || 'Anonymous';
}

/**
 * Checks if user has permission to perform action
 */
export function hasPermission(userId?: string, resourceUserId?: string): boolean {
  return !!userId && userId === resourceUserId;
}
