# be8-ai-products

A bilingual (English / Thai) catalog of Beryl8 AI solutions, built with Next.js (App Router) and Tailwind CSS.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000. It redirects to `/en` or `/th` based on your browser language.

## Editing products

All product content lives in `lib/products.ts`. Each product has `en` and `th` text for its category, tagline, description and features. UI labels are in `lib/i18n.ts`.
