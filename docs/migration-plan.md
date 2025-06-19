# 🚀 BookNest Migration Plan

## Phase 1: Auth.js v5 Migration ✅
- [x] Research Auth.js v5 configuration structure
- [ ] Upgrade to Auth.js v5 (NextAuth.js v5)
- [ ] Create root `auth.ts` configuration file
- [ ] Update NextAuth handlers to use new v5 structure
- [ ] Update auth imports across the application
- [ ] Test Google OAuth integration with v5

## Phase 2: Remove Node.js Core Modules ✅
- [x] Identify usage of crypto module in `/api/votes/route.ts`
- [ ] Replace Node.js crypto with Web Crypto API
- [ ] Ensure all API routes are Edge Runtime compatible
- [ ] Test IP hashing functionality with Web Crypto

## Phase 3: Implement SWR Data Fetching ✅
- [ ] Install SWR library
- [ ] Create SWR hooks for books data
- [ ] Create SWR hooks for user data
- [ ] Create SWR hooks for votes data
- [ ] Create SWR hooks for comments data
- [ ] Update all components to use SWR instead of direct fetch
- [ ] Add loading states and error handling with SWR

## Phase 4: Follow Instructions Compliance ✅
- [ ] Ensure no hardcoded values in page.tsx files
- [ ] Move all constants to /constants folder
- [ ] Extract complex logic from components to /utils
- [ ] Ensure all components use shadcn UI only
- [ ] Verify mobile-first design
- [ ] Add proper TypeScript types
- [ ] Test all functionality

## Phase 5: Final Polish ✅
- [ ] Add proper error boundaries
- [ ] Implement loading states everywhere
- [ ] Add form validation with Zod
- [ ] Test authentication flow end-to-end
- [ ] Test book CRUD operations
- [ ] Test voting system
- [ ] Test responsive design
- [ ] Performance optimization check

## ✅ Completed Tasks
- Database integration (no more mocks)
- Drizzle Studio and config setup
- Dashboard and book pages creation
- Shadcn UI implementation
- Custom CSS removal
- Basic authentication setup
