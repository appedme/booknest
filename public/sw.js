// Empty service worker to prevent 404 errors
// This file exists only to prevent browsers from requesting a non-existent service worker

self.addEventListener('install', () => {
  // Skip waiting and activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Take control of all pages immediately
  return self.clients.claim();
});
