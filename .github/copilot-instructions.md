# Chitonitose Next.js Project Setup Instructions

## Project Overview
Migration of chitonitose.com educational website from PHP/MySQL to Next.js static site.

## Technology Stack
- Next.js 15+ with App Router
- TypeScript
- Tailwind CSS
- MDX for content
- SQLite for data source (to be implemented)
- GitHub Pages deployment

## Project Status

✅ **Phase 1: Foundation Setup - COMPLETED**

### Completed Tasks
- [x] Created project structure
- [x] Set up Next.js with TypeScript
- [x] Configured Tailwind CSS
- [x] Set up ESLint
- [x] Created basic app structure (layout, page)
- [x] Set up GitHub Actions workflow for deployment
- [x] Created data conversion scripts
- [x] Successfully built and tested development server

### Project Structure Created
```
chitonitose-next/
├── app/              # Next.js App Router
├── components/       # React components
├── content/          # MDX content (geo, jh, wh)
├── data/            # JSON data and SQLite
├── scripts/         # Build and conversion scripts
├── public/          # Static assets
└── .github/         # GitHub Actions workflows
```

### Next Steps
1. Convert MySQL dump to SQLite database
2. Implement data conversion (SQLite → JSON)
3. Create shared components (Header, Footer, Navigation)
4. Migrate content pages (HTML → MDX)
5. Implement chart functionality

## Development Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run db:convert` - Convert MySQL to SQLite
- `npm run data:convert` - Extract data from SQLite to JSON

## Notes

- better-sqlite3 installation deferred due to build issues (certificate problem)
- Will implement alternative JSON-based data storage initially
- Development server running successfully on port 3000

