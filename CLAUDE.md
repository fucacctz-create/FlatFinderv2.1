# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
**FlatFinder v2.1** is an AI-powered rental matchmaking service MVP built as a monorepo. The platform helps renters find quality housing while avoiding scams, serving the "99%" - individuals priced out of expensive rental markets.

## Technology Stack
- **Frontend**: Next.js 15.5.2 with React 19.1.0 and TypeScript 5.9.2
- **Backend**: Express.js API with TypeScript
- **Styling**: Tailwind CSS 4.1.13
- **Linting**: ESLint 9.35.0 with Next.js config
- **Package Management**: npm with workspaces
- **Build Tools**: TypeScript compiler, Next.js build system

## Repository Architecture

This is a monorepo using npm workspaces with the following structure:

### Workspace Organization
- **Root**: `package.json` with workspace configuration and shared scripts
- **apps/web**: Next.js frontend application (`@flatfinder/web`)
- **services/api**: Express.js backend API (`@flatfinder/api`) 
- **packages/shared**: Shared TypeScript types and utilities (`@flatfinder/shared`)
- **docs/**: Project documentation and requirements
- **infra/**: Infrastructure configuration

### Key Files
- `tsconfig.base.json`: Base TypeScript configuration with workspace path mapping
- `apps/web/app/page.tsx`: Main listings page with server-side rendering
- `services/api/index.ts`: Express API server with CORS, health checks, and mock data
- `packages/shared/src/types.ts`: Shared TypeScript interfaces for listings, users, and entitlements

## Development Commands

### Start Development
```bash
npm run dev              # Start both frontend and API concurrently
npm run dev:web          # Start frontend only (port 3000)
npm run dev:api          # Start API only (port 3001)
```

### Build & Production
```bash
npm run build            # Build all workspaces
npm run lint             # Run ESLint across all workspaces
```

### Workspace-specific Commands
```bash
npm run dev --prefix apps/web        # Frontend dev server
npm run build --prefix apps/web      # Build Next.js app
npm run start --prefix apps/web      # Start production server

npm run dev --prefix services/api    # API dev server with tsx watch
npm run build --prefix services/api  # Compile TypeScript to dist/
npm run start --prefix services/api  # Start compiled API server
```

## Architecture Patterns

### Data Flow
1. **Frontend → API**: Next.js pages make server-side fetch calls to Express API
2. **Shared Types**: `@flatfinder/shared` package provides type safety across frontend/backend
3. **Path Mapping**: TypeScript paths configured for clean imports (`@flatfinder/shared`)

### API Design
- **REST Endpoints**: `/matches`, `/listings/:id`, `/listings/:id/contact`
- **Middleware Pattern**: CORS, request ID generation, mock entitlement resolution
- **Error Handling**: Centralized error handler with structured responses
- **Health Checks**: `/health` endpoint for monitoring

### Frontend Patterns
- **Server Components**: Using Next.js App Router with async server components
- **Error Boundaries**: Graceful error handling with fallback UI
- **Type Safety**: Full TypeScript integration with shared types

### Current Mock Implementation
The codebase currently uses mock data and simulated entitlements. Key areas marked for future implementation:
- Real authentication integration (Clerk mentioned in docs)
- Database integration (Convex planned)
- Payment processing (Stripe integration)
- Property scraping and vetting systems

## Type System

### Core Interfaces (`packages/shared/src/types.ts`)
- `Tier`: User subscription levels (free, searchBlitz, casual, premium)
- `Entitlements`: Feature access control (contact viewing, outreach requests)
- `User` & `Profile`: User account and preference data structures
- `Listing`: Property data with vetting status and risk scoring
- `MatchCard` & `MatchesResponse`: API response formats

### API Contracts
- **GET /matches**: Returns `MatchesResponse` with listings and user entitlements
- **GET /listings/:id**: Returns `ListingResponse` with conditional contact info
- **GET /listings/:id/contact**: Protected endpoint requiring premium entitlements

## Development Guidelines

### Code Organization
- Keep shared interfaces in `packages/shared/src/types.ts`
- Frontend pages in `apps/web/app/` following Next.js 13+ App Router
- API routes in `services/api/` with clear separation of concerns
- Use absolute imports via TypeScript path mapping

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Frontend API endpoint (defaults to localhost:3001)
- `CORS_ORIGIN`: API CORS configuration (defaults to *)
- `PORT`: API server port (defaults to 3001)

### Testing & Quality
- Run `npm run lint` before commits to ensure code quality
- Frontend uses Next.js ESLint configuration
- API uses Express with TypeScript strict mode
- No test framework currently configured (consider adding)

## AI Agent Integration

### Rental Form Chatbot (`systemprompt.md`)
The project includes an AI chatbot system prompt for handling rental form interactions:

**Purpose**: Friendly rental chatbot to help users complete rental questionnaires
**Behavior**: Ask questions one at a time, supportive manner, no platform references
**Key Features**:
- 19 structured questions covering location, property specs, utilities, and preferences
- Dropdown/checkbox/calendar inputs for consistent data collection
- Income-to-rent ratio analysis (highlighting options within 1/3 of monthly income)
- Apartment matching based on user responses
- Refinement capabilities for search results

**Supported Locations**: Toronto, Vancouver, Edinburgh, Paris
**Property Types**: Rooms to 3-bedroom+ options with den variations
**Utility Coverage**: Heat, hydro, internet, cable inclusion tracking
**Special Features**: Transit proximity, parking, laundry, separate entrance preferences

This system prompt guides the conversational onboarding flow mentioned in the project documentation and should inform any chatbot implementation work.