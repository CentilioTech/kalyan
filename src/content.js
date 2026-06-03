// Single source of content for the HM Intel portal.
// Updated after the June 1 discovery call with Chris (CTS).
export const NAV = [
  ["overview", "Overview"],
  ["roadmap", "Roadmap & Milestones"],
  ["tasks", "Tasks & Owners"],
  ["meetings", "Meeting Notes"],
  ["research", "Discovery & Research"],
  ["docs", "Documents"],
  ["brand", "Brand System"],
  ["about", "About Kalyan"],
];

export const STATUS = "Discovery complete · scoping";

export const META = [
  ["Client", "Commercial Transport Solutions"],
  ["Product", "HM Intel — companion to DG Vault"],
  ["Stage", "Discovery complete → scoping"],
  ["Engagement", "Freelance → technical leadership"],
  ["Introduced by", "Referral (Daryl → Chris)"],
];

export const PEOPLE = [
  { i: "CW", c: "c", name: "Chris Wells", role: "Founder, CTS. Sets vision and scope, primary point of contact." },
  { i: "RY", c: "r", name: "Ryan", role: "CTS. Joint reviewer on the trial and the approach." },
  { i: "KA", c: "k", name: "Kalyan", role: "Developer and designer on the trial. London, Ontario. Freelance, open to long-term." },
];

// Decisions captured in the June 1 discovery call.
export const DECISIONS = [
  "Trial scope is deliberately simple: a single circular isolation zone, Google Maps integration, GPS location, and product selection from sample dangerous goods.",
  "The sample isolation/protective distances are placeholders only — not authoritative data for this exercise.",
  "Protective-action zones, wind direction, day/night and spill-size calculations are future scope, not part of the trial.",
  "The trial is a standalone prototype to show technical approach, communication and product thinking — not a production feature.",
  "Stack aligns with the live MVP: React, React Native, Next.js, PostgreSQL.",
  "Deliverable format: a live demonstration, a source-code review, and a brief technical summary.",
  "The role is an initial freelance engagement that can grow into a longer-term technical leadership and oversight role.",
];

// What CTS told us about the product and the why behind the role.
export const VISION = {
  what: "HM Intel is becoming a hazardous-materials intelligence platform for emergency responders, evolving from a first-responder DG-information app into a companion platform to DG Vault. Its UX design phase is complete.",
  initial: ["Shipping document access", "SDS access", "ERG guidance", "Emergency contacts", "Isolation distance tools"],
  longterm: ["Incident intelligence", "Responder tools", "Cleanup coordination", "Integration with electronic shipping documents"],
  users: "Firefighters and hazmat responders, working a live incident scene.",
  why: "CTS anticipates significant development beyond the MVP and wants internal technical leadership and oversight. The pain so far has been limited visibility into progress, difficulty getting timelines, and dependence on external developers.",
};

export const WORKFLOW = [
  "Arrive on scene",
  "Identify HAZMAT placards or vehicle markings",
  "Determine the product involved",
  "Access shipping documents and emergency information",
  "Assess isolation distance, PPE, evacuation and response actions",
];

export const PHASES = [
  { n: "✓", cls: "done", title: "Step 1 · Discovery", pill: ["Done", "p-ok"],
    body: "Intro call held June 1. Scope, product vision and success criteria confirmed with Chris and Ryan, and written up below.",
    who: ["all", "Kalyan · Chris · Ryan", "Jun 1 — done"] },
  { n: "2", cls: "now", title: "Step 2 · A scoped plan you sign off", pill: ["In progress", "p-prog"],
    body: "A one-page plan from the answers: exactly what the prototype covers (single circle, Google Maps, GPS, sample data), the mock-data shape, and the milestones. Sent for sign-off before build.",
    who: ["k", "Kalyan drafts · Chris & Ryan approve", ""] },
  { n: "3", cls: "", title: "Step 3 · Build the prototype, with a mid-point check-in", pill: null,
    body: "Core flow first: location, product selection, isolation circle, info panel — in React. Progress shared at a milestone so direction is visible early.",
    who: ["k", "Kalyan", "~1–2 weeks part-time"] },
  { n: "4", cls: "", title: "Step 4 · Live demo, code review & technical summary", pill: null,
    body: "The agreed deliverable: a live demonstration, a walkthrough of the source, and a brief technical summary of decisions and what production would need next.",
    who: ["all", "Review together", ""] },
];

export const TASKS = {
  todo: [
    { t: "Build the prototype: GPS → product select → isolation circle → info panel", who: "k", tag: "Core" },
    { t: "Apply HM Intel brand to the prototype shell", who: "k", tag: "Design" },
    { t: "Write the brief technical summary for the demo", who: "k", tag: "Deliverable" },
  ],
  prog: [
    { t: "One-page scoped plan from Chris's answers", who: "k", tag: "For sign-off" },
    { t: "Brand system, portal & React build", who: "k", tag: "v1" },
  ],
  done: [
    { t: "Discovery call with Chris & Ryan", tag: "Jun 1" },
    { t: "Receive & read Chris's answer document", tag: "CW" },
    { t: "Confirm trial scope: single circle + Google Maps + GPS", tag: "Resolved" },
    { t: "Send discovery agenda to Chris", tag: "KA" },
    { t: "Receive logo & branding materials", tag: "CW" },
  ],
};

export const OPEN_ITEMS = [
  ["Confirm rate and weekly hours for the initial freelance engagement", "CW", "Chris", ["To confirm", "p-wait"]],
  ["Share the live demo link / handoff method for review", "KA", "Kalyan", ["After build", "p-wait"]],
];

export const DOCS = [
  ["SPEC", "HM Intel Developer Trial Project", "The brief from CTS: scenario, requirements, sample data, evaluation focus", ["Received", "p-ok"]],
  ["Q", "Discovery & Ways-of-Working Agenda", "48 questions across 9 themes, in Kalyan's voice, for the Jun 1 call", ["Sent", "p-ok"]],
  ["ANS", "Chris's answers to the discovery questions", "CTS responses on background, vision, workflow, scope and success criteria", ["Received", "p-ok"]],
  ["BR", "HM Intel Brand System", "Palette, type and components derived from the logo (see Brand System)", ["v1", "p-prog"]],
  ["APP", "Project portal (React)", "This portal — React + Vite + Framer Motion; versioned under Kalyan", ["v1", "p-prog"]],
  ["IMG", "Logo & branding materials", "Provided by Chris, used for the brand system and this portal", ["Received", "p-ok"]],
];

export const DG = [
  ["UN1203", "Gasoline", "3", "128", "50 m", "300 m"],
  ["UN1075", "Liquefied Petroleum Gas", "2.1", "115", "100 m", "800 m"],
  ["UN1789", "Hydrochloric Acid", "8", "157", "50 m", "250 m"],
  ["UN1017", "Chlorine", "2.3/5.1/8", "124", "300 m", "1,500 m"],
  ["UN1824", "Sodium Hydroxide Solution", "8", "154", "30 m", "150 m"],
];

export const PALETTE = [
  ["HM Red", "#C01718"], ["Deep Maroon", "#8E0000"], ["Signal Red", "#E22B2B"], ["Ink", "#14181F"],
  ["Slate", "#3A4756"], ["Steel", "#5B6B7B"], ["Canvas", "#F6F7F9"], ["Red Wash", "#FBE9E9"],
];

// About — grounded in Kalyan's resume
export const ABOUT = {
  name: "Kalyan Pavan Aravelli",
  tagline: "Full-Stack Developer · 5+ years · React, React Native, TypeScript, Node",
  location: "London, Ontario",
  intro:
    "A full-stack developer and designer based in London, Ontario, with 5+ years building scalable web and mobile applications. CTS's stack (React, React Native, Next.js, PostgreSQL) is exactly what I work in daily. I came to this through a referral rather than a job board, and I treat that trust seriously: the goal is to be the developer who actually fits, and the technical lead CTS is looking for.",
  pillars: [
    ["Builds with", "React, React Native, Expo, TypeScript, Next.js, Node.js, PostgreSQL, Prisma"],
    ["Strengths", "Clean UI component architecture, design systems, Figma-to-code, accessibility, performance"],
    ["How I work", "Discovery first, small increments, regular check-ins, decisions written down"],
  ],
  experience: [
    ["Full-Stack Developer · Self-employed", "Jun 2025 – Present", "Responsive web and cross-platform mobile prototypes (React, React Native, Expo, Next.js); Node + PostgreSQL + Prisma APIs with auth, product data and admin features; e-commerce-style flows for client-facing projects."],
    ["Frontend Developer · Zoho Corporation", "May 2019 – Mar 2022", "Built complex React UI for a CRM SaaS used by thousands of business users; rich email interfaces; cut UI code duplication ~35% with component-based architecture; performance and re-render optimization on data-heavy views."],
    ["Project Trainee · Zoho Corporation", "Dec 2018 – Feb 2019", "Early full-stack exposure: payroll tool in HTML/CSS/JS, JSPs and Java servlets on Tomcat."],
  ],
  education: [
    ["Post Graduate, Mobile Applications Development", "Fanshawe College, London, ON · 2023–2024"],
    ["B.E., Computer Science & Engineering", "Pondicherry Engineering College · 2015–2019"],
  ],
  skills: ["React", "React Native", "Expo", "TypeScript", "Next.js", "Redux", "Node.js", "PostgreSQL", "Prisma",
    "Tailwind CSS", "Design Systems", "Figma to Code", "REST APIs", "Accessibility", "Git", "Agile"],
};
