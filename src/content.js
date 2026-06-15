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

export const STATUS = "Prototype built · iOS + Android · in review";

export const META = [
  ["Client", "Commercial Transport Solutions"],
  ["Product", "HM Intel — companion to DG Vault"],
  ["Stage", "Prototype built → review"],
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
  { n: "✓", cls: "done", title: "Step 2 · A scoped plan you sign off", pill: ["Done", "p-ok"],
    body: "Scope confirmed from the discovery answers: a single circular isolation zone, Google Maps, GPS, and the five sample dangerous goods. The build proceeded against this slice.",
    who: ["k", "Kalyan · Chris & Ryan", "done"] },
  { n: "✓", cls: "done", title: "Step 3 · Build the prototype", pill: ["Done", "p-ok"],
    body: "Built as a real native app for BOTH iOS and Android with React Native (Expo): GPS and permission handling, product selection, the isolation circle, and the full information panel — plus the optional enhancements (move the incident on the map, metres/kilometres, multiple distance zones) and a live in-zone safety alert. Verified on a real Android emulator and an iPhone simulator. A live in-browser preview and the Android APK are linked under Documents.",
    who: ["k", "Kalyan", "built · iOS + Android"] },
  { n: "4", cls: "now", title: "Step 4 · Live demo, code review & technical summary", pill: ["In progress", "p-prog"],
    body: "The app is delivered and installable, and the live demo and source-code review are ready. The short technical summary of decisions and what production would need next is the remaining piece.",
    who: ["all", "Review together", "ready"] },
];

export const TASKS = {
  todo: [
    { t: "Write the brief technical summary for the demo", who: "k", tag: "Deliverable" },
    { t: "Optional: Google Maps on iOS (currently native Apple Maps on iOS)", who: "k", tag: "Optional" },
    { t: "Optional: wind-direction placeholder & offline messaging", who: "k", tag: "Optional" },
  ],
  prog: [
    { t: "Live demo, code review & handoff to Chris and Ryan", who: "k", tag: "Deliverable" },
  ],
  done: [
    { t: "Build the prototype: GPS → product select → isolation circle → info panel", tag: "Built" },
    { t: "Ship as a real native app for iOS AND Android (React Native / Expo)", tag: "iOS + Android" },
    { t: "Optional enhancements: move incident, metres/kilometres, multiple zones", tag: "Done" },
    { t: "In-zone safety alert — warn when responder is inside a hazard zone", tag: "Bonus" },
    { t: "On-device testing: Android emulator + iPhone simulator, all flows", tag: "Verified" },
    { t: "Android APK built & provided for install", tag: "Delivered" },
    { t: "Apply HM Intel brand to the prototype", tag: "Done" },
    { t: "Confirm trial scope: single circle + Google Maps + GPS", tag: "Resolved" },
    { t: "Brand system, portal & React build", tag: "v1" },
    { t: "Discovery call with Chris & Ryan", tag: "Jun 1" },
    { t: "Receive & read Chris's answer document", tag: "CW" },
    { t: "Send discovery agenda to Chris", tag: "KA" },
    { t: "Receive logo & branding materials", tag: "CW" },
  ],
};

export const OPEN_ITEMS = [
  ["Review the working prototype — live in-browser preview and the Android APK are linked under Documents", "KA", "Chris · Ryan", ["Ready to review", "p-ok"]],
  ["Feedback on the wireframes and confirm next milestones (meeting to be scheduled)", "CW", "Chris · Kalyan", ["Next steps", "p-q"]],
  ["Decide iOS map: native Apple Maps (current) vs Google Maps on iOS to match the brief literally", "CW", "Chris · Kalyan", ["Decision", "p-q"]],
];

// Next steps & working agreement — a sub-checklist documenting how the engagement proceeds.
export const CHECKLIST = [
  {
    label: "Engagement",
    title: "Working terms",
    points: ["Weekly hours and availability", "Rate for the initial freelance engagement", "Check-in rhythm: a short call at each milestone or twice weekly"],
    status: ["To confirm", "p-wait"],
  },
  {
    label: "Technical",
    title: "Stack & front-end model",
    points: ["Web: React + Vite; Next.js if it must match the live MVP", "Mobile: React Native + Expo — one codebase for iOS and Android", "Services & data: Node + PostgreSQL, aligned to the existing MVP", "TypeScript, clean component architecture, shared design tokens"],
    status: ["Proposed · to confirm", "p-q"],
  },
  {
    label: "Build",
    title: "Prototype — built & tested",
    points: ["Built for iOS and Android (React Native / Expo): GPS, product select, isolation circle, info panel", "Optional enhancements done: move incident, metres/kilometres, multiple zones, in-zone safety alert", "Tested on-device; distances remain placeholders as agreed; ERG / wind / day-night still future scope"],
    status: ["Built ✓", "p-ok"],
  },
  {
    label: "Process",
    title: "Design → wireframe → working app",
    points: ["Low- and high-fidelity wireframes delivered (in Documents)", "UI copy and content aligned with the confirmed scope", "The interactive prototype is now a real installable app, shared for review"],
    status: ["Delivered", "p-ok"],
  },
  {
    label: "Milestones",
    title: "What each milestone solves",
    points: ["Start — scoped plan signed off: a shared understanding on record", "Mid-point — core flow demoed: direction corrected early and cheaply", "End — working prototype + source-code review + short technical summary"],
    status: ["To agree", "p-wait"],
  },
  {
    label: "Documentation",
    title: "Single source of truth",
    points: ["This portal holds scope, milestones, owners, decisions and every document", "Each artifact indexed and version-controlled under the project", "It is the moving-forward record CTS can check at any time"],
    status: ["In place", "p-ok"],
  },
];

export const DOCS = [
  {
    title: "HM Intel Mobile App — iOS & Android prototype", type: "Working app · live in-browser preview", status: ["Live", "p-prog"],
    link: "https://hm-intel-app.pavanaravelli690.workers.dev", linkLabel: "Open live app ↗",
    summary: "The working HM Intel Isolation Distance Tool, built as a real native app for both iOS and Android with React Native (Expo) and matched to the approved high-fidelity design. Every core requirement is implemented — GPS with permission handling, current location on a map, dangerous-goods selection, the circular isolation zone, and the full information panel — alongside the optional enhancements (move the incident on the map, metres/kilometres, multiple distance zones) and a bonus live safety alert that warns the responder when their own position falls inside the isolation or protective zone — now extended with a live wind & downwind-hazard model that reads the wind at the incident (Open-Meteo) and draws a downwind plume cone over the always-shown isolation and protective zones, flagging a responder who is downwind even while outside the circles. This link opens a live, in-browser preview of the running app; for a real on-device install, use the Android APK below.",
    meta: "React Native · Expo · iOS + Android · tested on-device",
    body: [
      ["h", "What is built"],
      ["list", [
        "Device GPS with clean permission handling and live location on the map (Google Maps on Android, native Apple Maps on iOS).",
        "Dangerous-goods selection from the five sample products, with search.",
        "Circular isolation zone around the incident, plus a concentric protective-action zone.",
        "Live wind & downwind hazard: the wind read at the incident (Open-Meteo) draws a downwind plume cone over the isolation and protective zones, with a wind compass badge and a danger / protective / downwind / clear status.",
        "Full information panel: UN number, shipping name, hazard class, ERG guide, isolation and protective distances, and emergency contact (Call CANUTEC).",
        "All four controls: Use Current Location, Set Incident (drag the map and confirm), Toggle Zone, and Reset.",
      ]],
      ["h", "Optional enhancements included"],
      ["list", [
        "Move the incident location on the map.",
        "Toggle between metres and kilometres.",
        "Multiple distance zones (isolation and protective).",
        "Bonus: a real-time alert when the responder is inside a hazard zone, with leave-the-area guidance.",
      ]],
      ["h", "How it was verified"],
      ["p", "Built and tested on a real Android emulator and an iPhone simulator, driving every flow end to end — including the new wind / downwind-hazard states. Distances remain placeholders, as agreed for the trial."],
      ["h", "Try it"],
      ["p", "Open the live preview in this browser, or install the Android APK (next document) on a phone for the real on-device experience."],
    ],
  },
  {
    title: "HM Intel Android App — install on a device (APK)", type: "Android install file · .apk", status: ["Download", "p-ok"],
    link: "/downloads/HM-Intel.apk", linkLabel: "Download APK ↓",
    summary: "The Android build of the HM Intel app, packaged as an installable APK so it runs as a real app on an Android phone rather than in a browser. Download the file, open it on an Android device, and allow installation from your browser or Files app when prompted. (A real iOS install needs Apple TestFlight or a developer account; the live in-browser preview above covers iOS in the meantime.) This build includes the live wind & downwind-hazard feature.",
    meta: "Signed release APK · sideload install",
  },
  {
    title: "High-Fidelity Wireframes — Isolation Distance Tool", type: "Mobile app design · interactive walkthrough", status: ["New", "p-prog"],
    link: "/hifi.html",
    summary: "An interactive, guided walkthrough of the HM Intel mobile design in the full brand. Step through every screen — location permission, current location, product selection, the circular isolation zone, the information panel, set-incident, GPS-unavailable and reset, then the optional enhancements (move incident, metres/kilometres, multiple zones, offline), plus a new Wind & downwind hazard section that shows the isolation zone, the protective zone and a live downwind cone together — with danger, protective, downwind, clear and calm states — each with a short explanation of what it is, how it works, what it means to the responder, and what it solves. Opens as a separate full page; use Next / Back or the arrow keys.",
  },
  {
    title: "Low-Fidelity Wireframes — Isolation Distance Tool", type: "Mobile app design · interactive page", status: ["New", "p-prog"],
    link: "/wireframes.html",
    hidden: true,
    summary: "The first design pass for the HM Intel mobile prototype. Low-fidelity wireframes for every core screen — location permission, current location, product selection, the circular isolation zone, the information panel, set-incident, GPS-unavailable and reset — followed by the optional enhancements (move incident, metres/kilometres, multiple zones, wind placeholder, offline fallback). Structure and flow first, in the HM Intel brand, with the assumptions noted under each screen. Opens as a separate full page.",
  },
  {
    title: "HM Intel Developer Trial Project", type: "Brief from CTS · .docx", status: ["Received", "p-ok"],
    summary: "The trial brief from Chris and Ryan. It sets the scenario — a first responder arriving at a dangerous-goods incident — and the core requirements: device GPS on a Google Map, dangerous-goods product selection, an isolation-distance overlay, and an information panel. It includes a mock wireframe, five sample DG entries, the expectations, optional enhancements, and the five things the trial is judged on: development approach, code organisation, UI/UX thinking, communication, and how requirements and assumptions are handled.",
    meta: "Commercial Transport Solutions · Developer trial",
    body: [
      ["h", "The scenario"],
      ["p", "A first responder arrives at the scene of an incident involving a vehicle carrying dangerous goods. Using HM Intel they need to quickly identify the product involved, see their own location on a map, and understand the area that should be isolated around the incident."],
      ["h", "Core requirements"],
      ["list", [
        "Show the device's current location on a Google Map, handling location permissions cleanly.",
        "Let the responder select a dangerous-goods product from sample data.",
        "Draw an isolation zone around the incident based on the selected product.",
        "Show an information panel: UN number, proper name, hazard class, ERG guide, isolation / protective distances, and an emergency contact.",
        "Use a clean mock-data structure and clear, well-organised code.",
      ]],
      ["h", "Sample data"],
      ["p", "Five representative dangerous-goods entries are provided (for example Gasoline UN1203 and Chlorine UN1017) with their hazard class, ERG guide number, and isolation and protective-action distances, to be used as placeholders."],
      ["h", "What is being evaluated"],
      ["p", "This is explicitly a prototype, not a production system. The trial is judged on five things: development approach, code organisation, UI and UX thinking, communication, and how requirements and assumptions are handled."],
      ["h", "Optional enhancements"],
      ["list", [
        "Move the incident point on the map.",
        "Toggle between metres and kilometres.",
        "A separate downwind protective zone with wind direction.",
        "Offline fallback messaging and a mobile-first layout.",
      ]],
    ],
  },
  {
    title: "Discovery & Ways-of-Working Agenda", type: "Sent by Kalyan · .docx", status: ["Sent", "p-ok"],
    summary: "A discovery agenda of 48 questions across nine themes — background, product, users, the isolation feature, data, regulatory, technical, the trial itself, and the working relationship — written in Kalyan's own voice for the June 1 call. The highest-leverage questions are starred, and a short research summary on CTS, HM Intel and the ERG opens the document so the meeting is spent on decisions rather than basics.",
    meta: "Prepared for the June 1 discovery call",
    body: [
      ["h", "Purpose"],
      ["p", "To agree scope, assumptions and the working rhythm before any code is written, so the prototype reflects where HM Intel is actually going rather than my guesses. The aim is for the call to be spent on decisions, not basics."],
      ["h", "Pre-read research"],
      ["p", "A short summary opens the document covering Commercial Transport Solutions, what HM Intel appears to be, and how the Emergency Response Guidebook (ERG) defines isolation and protective-action distances — so everyone starts from the same baseline."],
      ["h", "The nine themes"],
      ["list", [
        "Background & context for HM Intel and the trial.",
        "The product and where it is heading.",
        "Users and their real on-scene workflow.",
        "The isolation-distance feature specifically.",
        "Data — sources, shape, and source of truth.",
        "Regulatory and standards considerations.",
        "Technical stack, architecture and constraints.",
        "The trial — scope, deliverables and how it is judged.",
        "The working relationship and what good looks like.",
      ]],
      ["h", "Highest-leverage questions (starred)"],
      ["p", "A subset is marked as the questions that most change the build: the exact isolation model expected for the trial, whether distances are placeholders or must be accurate, the confirmed stack, and the deliverable format for review."],
    ],
  },
  {
    title: "Chris's answers to the discovery questions", type: "From CTS · .docx", status: ["Received", "p-ok"],
    summary: "CTS's written responses that lock in the shared understanding: HM Intel as a hazardous-materials intelligence platform and companion to DG Vault; the primary users (firefighters and hazmat responders) and their on-scene workflow; the trial scope (a single circular isolation zone with Google Maps, GPS and sample data, with distances as placeholders); the MVP stack (React, React Native, Next.js, PostgreSQL); the deliverable format (live demo, code review, technical summary); and the role direction, an initial freelance engagement that can grow into technical leadership.",
    meta: "Written responses from Chris, CTS",
    body: [
      ["h", "What HM Intel is"],
      ["p", "A hazardous-materials intelligence platform and a companion to DG Vault, aimed at giving emergency responders fast, reliable information at the scene of a dangerous-goods incident."],
      ["h", "Users and workflow"],
      ["p", "The primary users are firefighters and hazmat responders. On scene they need to identify the product, understand the hazard, and establish a safe perimeter quickly, often under pressure and in poor conditions."],
      ["h", "Trial scope"],
      ["p", "A single circular isolation zone, using Google Maps, device GPS and the provided sample data. Distances can be treated as placeholders for the trial — the thinking and structure matter more than regulatory precision at this stage."],
      ["h", "Stack"],
      ["p", "The MVP direction is React, React Native, Next.js and PostgreSQL — a single ecosystem across web and mobile."],
      ["h", "Deliverables"],
      ["p", "A live demo, a code review walkthrough, and a short technical summary of approach, assumptions and trade-offs."],
      ["h", "The role"],
      ["p", "An initial freelance engagement that, if it goes well, can grow into a technical-leadership position."],
    ],
  },
  {
    title: "HM Intel Brand System", type: "Built by Kalyan · live", status: ["v1", "p-prog"],
    summary: "An original brand system derived only from the supplied logo, the red hazard-diamond shield. It defines the palette (HM Red, Deep Maroon, Signal Red, Ink, Slate, Steel, Canvas and Red Wash), the type pairing of Sora for display and Inter for text, component patterns, and the usage do's and don'ts. The system is deliberately light and authoritative, with red used sparingly because in this domain red means alert. It is shown live in the Brand System tab.",
    meta: "Original system · derived from the supplied logo",
    body: [
      ["h", "Origin"],
      ["p", "The system is built outward from a single input — the supplied logo, a red hazard-diamond shield carrying an “i” for intelligence. Nothing is borrowed; the palette, type and patterns all trace back to that mark."],
      ["h", "Palette"],
      ["p", "HM Red and Deep Maroon anchor the brand, with Signal Red for emphasis, Ink and Slate for text, Steel for secondary detail, and Canvas and Red Wash for surfaces. Red is used sparingly — in this domain, red means alert."],
      ["h", "Typography"],
      ["p", "Sora for display and headings, Inter for body text and UI. The pairing reads as authoritative and calm rather than loud."],
      ["h", "Components & usage"],
      ["p", "Defines glass surfaces, pills, cards and data tables, with clear do's and don'ts so the look stays consistent across the portal and the mobile prototype. The full system is shown live in the Brand System tab."],
    ],
  },
  {
    title: "Project portal (React)", type: "Built by Kalyan · this site", status: ["v1", "p-prog"],
    summary: "This portal itself — a React, Vite and Framer Motion application that tracks the engagement end to end: overview, roadmap and milestones, tasks and owners, meeting notes, discovery research, this document trail, the brand system, and an about page. It is version-controlled under the project and deployed for review, built as the always-current single source of truth Chris asked for so CTS never has to ask where things stand.",
    meta: "React · Vite · Framer Motion",
    body: [
      ["h", "What it is"],
      ["p", "This site — a single place to follow the HM Intel engagement end to end, built so Chris and Ryan can see exactly where things stand at any moment."],
      ["h", "Sections"],
      ["list", [
        "Overview — the brief and the approach in one screen.",
        "Roadmap & milestones — the proposed steps and check-in rhythm.",
        "Tasks & owners — everything in motion, grouped by state.",
        "Meeting notes — what was agreed and when.",
        "Discovery — the research behind the questions.",
        "Documents — this trail of artifacts.",
        "Brand system — the live HM Intel look and feel.",
        "About — background and fit.",
      ]],
      ["h", "Stack"],
      ["p", "React, Vite and Framer Motion, version-controlled under the project and deployed for review."],
      ["h", "Why it exists"],
      ["p", "Chris said the hardest part with past development was visibility into progress and timelines. This portal is the answer: an always-current single source of truth, so CTS never has to ask where things stand."],
    ],
  },
  {
    title: "Logo & branding materials", type: "From CTS · .png", status: ["Received", "p-ok"],
    summary: "The HM Intel logo and branding materials supplied by Chris — the red hazard-diamond shield carrying an “i” for intelligence. They were used to derive the brand system and to style both this portal and the mobile prototype, so every surface carries a consistent HM Intel look and feel.",
    meta: "Supplied by CTS · source mark",
    img: true,
    body: [
      ["p", "The HM Intel logo supplied by Chris — a red hazard-diamond shield carrying an “i” for intelligence."],
      ["p", "This single mark is the source for the entire brand system, and is used to style both this portal and the mobile prototype so every surface carries a consistent HM Intel look and feel."],
    ],
  },
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
