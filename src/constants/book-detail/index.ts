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
  GRADIENT_BG: "min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30",
  HERO_BG: "relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden",
  CARD_BG: "border-0 shadow-lg bg-white/70 backdrop-blur-sm",
  BUTTON_PRIMARY: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white",
  GLASS_EFFECT: "bg-white/10 backdrop-blur-sm border border-white/20",
} as const;

/**
 * Share platform options
 */
export const SHARE_PLATFORMS = [
  { id: 'twitter', label: 'Twitter', icon: 'Twitter' },
  { id: 'facebook', label: 'Facebook', icon: 'Facebook' },
  { id: 'copy', label: 'Copy Link', icon: 'Copy' },
] as const;
