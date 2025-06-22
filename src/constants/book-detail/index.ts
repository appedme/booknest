/**
 * Animation configuration for book detail page
 */
export const ANIMATIONS = {
  HERO_INITIAL: { opacity: 0, y: 30 },
  HERO_ANIMATE: { opacity: 1, y: 0 },
  HERO_TRANSITION: { duration: 0.8, delay: 0.2 },
  
  CONTENT_INITIAL: { opacity: 0, y: 30 },
  CONTENT_ANIMATE: { opacity: 1, y: 0 },
  CONTENT_TRANSITION: { duration: 0.6 },
  
  SIDEBAR_INITIAL: { opacity: 0, x: 30 },
  SIDEBAR_ANIMATE: { opacity: 1, x: 0 },
  SIDEBAR_TRANSITION: { duration: 0.6, delay: 0.2 },
  
  STATS_INITIAL: { opacity: 0, y: 20 },
  STATS_ANIMATE: { opacity: 1, y: 0 },
  STATS_TRANSITION: { duration: 0.6, delay: 1.0 },
} as const;

/**
 * CSS class constants for consistent styling
 */
export const STYLES = {
  GRADIENT_BG: "min-h-screen bg-gray-50 dark:bg-gray-900",
  HERO_BG: "relative bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700",
  CARD_BG: "border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800",
  BUTTON_PRIMARY: "bg-blue-600 hover:bg-blue-700 text-white",
  GLASS_EFFECT: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
} as const;

/**
 * Share platform options
 */
export const SHARE_PLATFORMS = [
  { id: 'twitter', label: 'Twitter', icon: 'Twitter' },
  { id: 'facebook', label: 'Facebook', icon: 'Facebook' },
  { id: 'copy', label: 'Copy Link', icon: 'Copy' },
] as const;
