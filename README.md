# HM Intel — Project Portal (React)

A premium, animated project portal for the HM Intel developer trial and engagement with Commercial Transport Solutions (CTS). Built by Kalyan.

It tracks the engagement end to end: overview, roadmap and milestones, tasks and owners, meeting notes, discovery research, a document trail, the HM Intel brand system, and an about page.

## Stack
- React 18 + Vite
- Framer Motion for section transitions, scroll reveals, and micro-interactions
- No UI framework: a small original design system in `src/brand.css`

## Structure
```
src/
  main.jsx        app entry
  App.jsx         shell: sidebar + topbar + animated section switching
  components.jsx  primitives: Avatar, Pill, Card, Reveal, Sidebar, TopBar
  sections.jsx    the eight sections
  content.js      all content in one place (data-driven)
  brand.css       HM Intel design tokens + styles
public/
  hm-intel-logo.png
```

## Run
```bash
npm install
npm run dev      # local dev
npm run build    # production build to dist/
npm run preview  # preview the build
```

## Design notes
The identity is derived from the HM Intel logo (red hazard-diamond shield). It is deliberately light, precise and authoritative; red is used sparingly because in this domain red means alert. The system is original and shares nothing with other brands in colour, type, or layout.
