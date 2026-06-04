import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Avatar, Pill, Card, Reveal, HolographicCard, Particles, MorphingText,
  Carousel3D, YieldCard, CourseCard, ShuffleCards, ActivityStream, ParticleText,
  ColorPaletteCard, BorderGlow,
} from "./components.jsx";
import { META, PEOPLE, DECISIONS, VISION, WORKFLOW, PHASES, TASKS, OPEN_ITEMS, CHECKLIST, DOCS, DG, PALETTE, ABOUT } from "./content.js";

const BarsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="3" y="13" width="4" height="8" rx="1" /><rect x="10" y="8" width="4" height="13" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" />
  </svg>
);

const SectionHead = ({ eyebrow, title, lead }) => (
  <Reveal>
    <div className="eyebrow">{eyebrow}</div>
    <h1 className="h-lg">{title}</h1>
    {lead && <p className="lead">{lead}</p>}
  </Reveal>
);

const heroGlare = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

function Overview() {
  return (
    <div>
      {/* HM Intel Project Portal -> interactive frosted-glass card */}
      <motion.div className="hero frosted" onMouseMove={heroGlare} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div className="diamond" animate={{ rotate: [45, 49, 45] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <img src="/hm-intel-logo.png" alt="HM Intel" />
        <div className="eyebrow">Isolation Distance Mapping · Developer Trial &amp; Engagement</div>
        <h1 className="h-lg shimmer">HM Intel Project Portal</h1>
        <p className="lead">A single place to follow this engagement end to end: the scope, how we will work together, milestones, who owns what, decisions, and every document in one trail. Built for Chris and Ryan to see exactly where things stand at any moment.</p>
        <div className="metarow">
          {META.map(([k, v]) => (<div key={k}><div className="k">{k}</div><div className="v">{v}</div></div>))}
        </div>
      </motion.div>

      <h2 className="sec-title">The brief, in one paragraph</h2>
      <Reveal><p className="lead">A first responder arrives at an incident involving a vehicle carrying dangerous goods. Using HM Intel they identify the product, see their location on a map, and visualise an isolation zone around the incident. The trial is a focused prototype of that flow. It is explicitly not a production system: Chris and Ryan want to see development approach, UI and workflow thinking, code organisation, communication, and how requirements and assumptions are handled.</p></Reveal>
      <Reveal><div className="note" style={{ marginTop: 16 }}><b>Why this portal exists.</b> Chris said the hardest part with past development has been visibility into progress and timelines. This portal is my answer to that: a living, always-current view of scope, milestones, owners and decisions, so CTS never has to ask where things stand. It is the technical-leadership habit, made visible from day one.</div></Reveal>

      {/* How I am approaching it -> 3D carousel */}
      <h2 className="sec-title">How I am approaching it</h2>
      <Carousel3D items={[
        ["Understand before building", "Short, real discovery first so the prototype reflects where HM Intel is going, not my assumptions."],
        ["Small steps, early check-ins", "Direction visible at each milestone so it can be corrected cheaply, never a big reveal at the end."],
        ["Write the thinking down", "Decisions, assumptions and trade-offs documented, which is half of what this trial is really testing."],
      ].map(([h, b], i) => (
        <div key={h}><div className="k">Principle {i + 1}</div><h3 style={{ marginTop: 6 }}>{h}</h3><div className="v" style={{ marginTop: 10, color: "var(--text-2)" }}>{b}</div></div>
      ))} />

      {/* Who is involved -> testimonial / shuffle cards */}
      <h2 className="sec-title">Who is involved</h2>
      <ShuffleCards cards={PEOPLE.map((p) => (
        <div key={p.name}>
          <div style={{ display: "flex", justifyContent: "center" }}><Avatar i={p.i} c={p.c} lg /></div>
          <h3>{p.name}</h3>
          <div className="v" style={{ color: "var(--text-2)" }}>{p.role}</div>
        </div>
      ))} />
    </div>
  );
}

function Roadmap() {
  return (
    <div>
      <SectionHead eyebrow="Plan" title="Roadmap & Milestones" lead="A proposed shape, not a fixed plan. The intent is to agree the steps and the check-in rhythm with Chris and Ryan so expectations are clear on both sides. Timing is honest: with no hard deadline, the core prototype is roughly one to two weeks of part-time work once scope is agreed, and the optional pieces extend that." />
      {/* particles background + vertical title-description stepper */}
      <div className="particle-host" style={{ marginTop: 24, borderRadius: 18, padding: "22px 18px 4px", overflow: "hidden" }}>
        <Particles count={40} />
        {PHASES.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05}>
            <div className={`phase ${p.cls}`}>
              <div className="node">{p.n}</div>
              <div className="body">
                <h4>{p.title} {p.pill && <Pill kind={p.pill[1]}>{p.pill[0]}</Pill>}</h4>
                <p>{p.body}</p>
                <div className="owner"><Avatar i={p.who[0] === "all" ? "ALL" : "KA"} c={p.who[0]} /> {p.who[1]} {p.who[2] && <>&nbsp;·&nbsp; <span className="tag">{p.who[2]}</span></>}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      {/* Scope for the prototype -> interactive frosted-glass cards */}
      <h2 className="sec-title">Scope for the prototype</h2>
      <div className="grid g2">
        <HolographicCard><h3>Core (in scope)</h3><ul className="clean">
          <li>Device location on a map, with permission handling</li><li>Select a dangerous-goods product</li>
          <li>Isolation zone drawn around the incident</li><li>Information panel: UN number, name, class, ERG guide, distances, emergency contact</li>
          <li>Clean mock-data structure and clear code organisation</li></ul></HolographicCard>
        <HolographicCard i={1}><h3>Candidate enhancements (to confirm)</h3><ul className="clean">
          <li>Move the incident point on the map</li><li>Metres / kilometres toggle</li>
          <li>Separate downwind protective zone + wind direction</li><li>Offline fallback messaging</li><li>Mobile-first layout</li></ul></HolographicCard>
      </div>
    </div>
  );
}

const Column = ({ title, items }) => (
  <div className="col">
    <h4>{title} <span>{items.length}</span></h4>
    {items.map((t, i) => (
      <motion.div className="task" key={t.t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}  transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }}>
        <div className="t">{t.t}</div>
        <div className="meta">
          {t.q ? <Pill kind="p-q">Question</Pill> : t.who ? <span className="owner"><Avatar i={t.who === "all" ? "ALL" : "KA"} c={t.who} /></span> : <Pill kind="p-ok">Done</Pill>}
          <span className="tag">{t.tag}</span>
        </div>
      </motion.div>
    ))}
  </div>
);

function Tasks() {
  return (
    <div>
      <SectionHead eyebrow="Execution" title="Tasks & Owners" lead="Everything in motion, grouped by state. Tasks cover the engagement, the project itself, and the open questions for HM Intel." />
      {/* To do / In progress / Done -> cards-grid */}
      <div className="board" style={{ marginTop: 22 }}>
        <Column title="To do" items={TASKS.todo} />
        <Column title="In progress" items={TASKS.prog} />
        <Column title="Done" items={TASKS.done} />
      </div>
      <h2 className="sec-title">Open items waiting on CTS</h2>
      <table className="data-grid">
        <tbody>
          <tr><th>Item</th><th>Owner</th><th>Status</th></tr>
          {OPEN_ITEMS.map(([item, av, who, st]) => (
            <tr key={item}><td>{item}</td><td><span className="owner"><Avatar i={av} c="c" /> {who}</span></td><td><Pill kind={st[1]}>{st[0]}</Pill></td></tr>
          ))}
        </tbody>
      </table>

      <h2 className="sec-title">Next steps &amp; working agreement</h2>
      <Reveal><p className="lead" style={{ marginBottom: 6 }}>The context to align on so this trial moves cleanly into the build. Each card is a small checklist; the status reflects what is already confirmed versus what we still need to agree with Chris and Ryan.</p></Reveal>
      <div className="grid g3" style={{ marginTop: 14 }}>
        {CHECKLIST.map((c, i) => (
          <Card key={c.title} i={i}>
            <div className="k">{c.label}</div>
            <h3 style={{ marginTop: 4, marginBottom: 10 }}>{c.title}</h3>
            <ul className="clean" style={{ marginTop: 0 }}>{c.points.map((p) => <li key={p}>{p}</li>)}</ul>
            <div style={{ marginTop: 12 }}><Pill kind={c.status[1]}>{c.status[0]}</Pill></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Meetings() {
  return (
    <div>
      <SectionHead eyebrow="Record" title="Meeting Notes" />
      {/* Meeting Notes -> spotlight card */}
      <Card className="hl" i={0}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}><h3>Discovery call</h3><Pill kind="p-ok">Completed</Pill></div>
        <div className="metarow">
          {[["When", "Monday, Jun 1 · 2:00 PM"], ["Where", "Google Meet"], ["Attendees", "Kalyan · Chris · Ryan"]].map(([k, v]) => (
            <div key={k}><div className="k">{k}</div><div className="v">{v}</div></div>
          ))}
        </div>
        <h4 style={{ marginTop: 16, fontSize: 14 }}>What we covered</h4>
        <ul className="clean">
          <li>Background: HM Intel, its relationship to DG Vault, and why the role exists</li>
          <li>Product vision, primary users, and the on-scene workflow</li>
          <li>Trial scope for the isolation-distance tool</li>
          <li>Stack, deliverable format, and what success looks like</li>
          <li>How the freelance and longer-term pieces could unfold</li>
        </ul>
        <h4 style={{ marginTop: 14, fontSize: 14 }}>Decisions &amp; outcomes</h4>
        <ul className="clean">{DECISIONS.map((d, i) => (<li key={i}>{d}</li>))}</ul>
      </Card>
    </div>
  );
}

function Research() {
  return (
    <div>
      <SectionHead eyebrow="Context" title="Discovery & Research" lead="Confirmed with Chris on June 1. This is the shared understanding the build runs on." />
      {/* What HM Intel is -> yield card */}
      <h2 className="sec-title">What HM Intel is</h2>
      <Reveal><YieldCard icon={<BarsIcon />} title="A hazardous-materials intelligence platform" desc={VISION.what} /></Reveal>
      <div className="grid g2" style={{ marginTop: 16 }}>
        <Card><h3>Initial functionality</h3><ul className="clean">{VISION.initial.map((x) => <li key={x}>{x}</li>)}</ul></Card>
        <Card i={1}><h3>Long-term vision</h3><ul className="clean">{VISION.longterm.map((x) => <li key={x}>{x}</li>)}</ul></Card>
      </div>
      <h2 className="sec-title">Trial scope — confirmed</h2>
      <Reveal><div className="note"><b>Resolved on the call.</b> v1 is a single circular isolation zone with Google Maps, GPS location, and product selection from the sample data. The distances are placeholders only. Protective-action (downwind) zones, wind direction, day/night and spill-size are future scope, not part of the trial. The point of v1 is a clean, honest, well-built slice, not a feature pile.</div></Reveal>
      {/* Sample dangerous-goods data -> data-grid table */}
      <h2 className="sec-title">Sample dangerous-goods data</h2>
      <Reveal>
        <table className="data-grid"><tbody>
          <tr><th>UN</th><th>Name</th><th>Class</th><th>ERG</th><th>Isolation</th><th>Protective</th></tr>
          {DG.map((r) => (<tr key={r[0]}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>))}
        </tbody></table>
      </Reveal>
      {/* What people use today -> course-design cards */}
      <h2 className="sec-title">What people use today</h2>
      <div className="grid g2">
        <CourseCard ic="ERG" title="The alternatives" sub="The printed Emergency Response Guidebook · PHMSA's ERG app · CANUTEC (Canada) and CHEMTREC · WISER, CAMEO / ALOHA." status="In use today" statusKind="p-wait" />
        <CourseCard ic="HM" title="HM Intel's possible wedge" sub="Speed and clarity on scene, identification straight from the load rather than thumbing a book, and a map you can act on. The discovery call is where we confirm which of these matters most." status="Opportunity" statusKind="p-q" i={1} />
      </div>
    </div>
  );
}

function DocViewer({ doc, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <motion.div className="doc-overlay" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
      <motion.div className="doc-sheet" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 26, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
        <button className="doc-close" onClick={onClose} aria-label="Close document">×</button>
        <div className="doc-sheet-head">
          <div className="eyebrow">{doc.type}</div>
          <h2>{doc.title}</h2>
          {doc.meta && <div className="doc-sheet-meta">{doc.meta}</div>}
        </div>
        <div className="doc-sheet-body">
          {doc.img && <img className="doc-sheet-img" src="/hm-intel-logo.png" alt="HM Intel logo" />}
          {doc.body.map((blk, i) =>
            blk[0] === "h" ? <h3 key={i}>{blk[1]}</h3>
              : blk[0] === "list" ? <ul key={i} className="clean">{blk[1].map((it, j) => <li key={j}>{it}</li>)}</ul>
                : <p key={i}>{blk[1]}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Docs() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <SectionHead eyebrow="Trail" title="Documents" lead="Every artifact for this engagement, in one index and version-controlled under the project. Click any document to open it." />
      <div className="doc-list">
        {DOCS.map((d, i) => (
          <motion.button type="button" className="doc-card" key={d.title} onClick={() => setOpen(d)} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -2 }}>
            <div className="doc-content">
              <div className="doc-head"><b>{d.title}</b><Pill kind={d.status[1]}>{d.status[0]}</Pill></div>
              <div className="doc-type">{d.type}</div>
              <p className="doc-summary">{d.summary}</p>
              <span className="doc-open">Open document <span aria-hidden="true">→</span></span>
            </div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>{open && <DocViewer doc={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  );
}

function Brand() {
  return (
    <div>
      {/* Brand heading -> cursor-driven particle typography, at the top of the page */}
      <Reveal><ParticleText text="HM INTEL" /></Reveal>
      <div className="eyebrow" style={{ marginTop: 2 }}>Identity · Brand System</div>
      <p className="lead" style={{ marginTop: 8 }}>Built from the supplied logo: a red hazard-diamond shield carrying an &quot;i&quot; for intelligence. The system is intentionally light, precise and authoritative, the way emergency-response tooling should feel. Red is used with purpose, not everywhere, because in this domain red means alert.</p>

      {/* Core palette -> color-palette card */}
      <h2 className="sec-title">Core palette</h2>
      <Reveal><ColorPaletteCard colors={PALETTE.map(([, hex]) => hex)} statsText={`${PALETTE.length} brand colours · click a stripe to copy`} /></Reveal>

      {/* Typography -> morphing text */}
      <h2 className="sec-title">Typography</h2>
      <Reveal><div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 30, marginBottom: 12 }}><MorphingText words={["Light.", "Precise.", "Authoritative."]} /></div></Reveal>
      <div className="grid g2">
        <Card><div className="k">Display · Sora</div><div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 30, margin: "6px 0" }}>HM Intel</div><div className="v">Headings, numbers, anything that should feel engineered and confident.</div></Card>
        <Card i={1}><div className="k">Text · Inter</div><div style={{ fontFamily: "Inter", fontSize: 16, margin: "6px 0" }}>Clear, neutral, highly legible at small sizes and on mobile in the field.</div><div className="v">Body, labels, data tables.</div></Card>
      </div>

      {/* Principles & usage -> border glow */}
      <h2 className="sec-title">Principles &amp; usage</h2>
      <div className="grid g2">
        <BorderGlow><h3>Do</h3><ul className="clean"><li>Lead with light surfaces and ink text; let red mark what matters</li><li>Use the diamond/shield motif sparingly as a quiet nod to placards</li><li>Keep data dense but calm: clear hierarchy, generous spacing</li><li>Reserve the status colours strictly for state, never decoration</li></ul></BorderGlow>
        <BorderGlow><h3>Don't</h3><ul className="clean"><li>No dark-mode-plus-orange look; this identity is its own, not anyone else's</li><li>Don't flood the screen with red; it loses its meaning</li><li>No clip-art hazard icons; the shield mark carries the signal</li><li>Don't crowd the logo; give it clear space equal to the shield height</li></ul></BorderGlow>
      </div>
      <Reveal><div className="note" style={{ marginTop: 16 }}><b>Origin &amp; ownership.</b> This system is an original build for HM Intel, derived only from the logo CTS provided. It deliberately shares nothing with other portfolios or clients in colour, type, or layout.</div></Reveal>
    </div>
  );
}

function About() {
  const a = ABOUT;
  return (
    <div>
      <SectionHead eyebrow="Background" title="About Kalyan" />
      <Card className="hl" i={0}>
        <div className="owner" style={{ fontSize: 17 }}><Avatar i="KA" c="k" lg /> &nbsp;{a.name}</div>
        <div className="v" style={{ color: "var(--hm-red)", fontWeight: 600, marginTop: 8 }}>{a.tagline}</div>
        <p className="lead" style={{ marginTop: 10 }}>{a.intro}</p>
        <div className="grid g3" style={{ marginTop: 8 }}>
          {a.pillars.map(([k, v]) => (<div key={k}><div className="k">{k}</div><div className="v">{v}</div></div>))}
        </div>
      </Card>

      <h2 className="sec-title">Experience</h2>
      {a.experience.map(([role, when, body], i) => (
        <Reveal key={role} delay={i * 0.05}>
          <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
              <h3>{role}</h3><span className="tag" style={{ color: "var(--muted)", fontWeight: 600 }}>{when}</span>
            </div>
            <div className="v" style={{ marginTop: 6, color: "var(--slate)" }}>{body}</div>
          </div>
        </Reveal>
      ))}

      <h2 className="sec-title">Skills</h2>
      <Reveal><div className="chips">{a.skills.map((s) => <span key={s}>{s}</span>)}</div></Reveal>

      <h2 className="sec-title">Education</h2>
      <div className="grid g2">
        {a.education.map(([d, w], i) => (<Card key={d} i={i}><h3 style={{ fontSize: 15 }}>{d}</h3><div className="v" style={{ color: "var(--muted)" }}>{w}</div></Card>))}
      </div>

      <Reveal><div className="note" style={{ marginTop: 18 }}>CTS has worked with developers before and is looking for the right long-term fit. My intent is to earn that by being clear, communicative, and dependable at every step, which is exactly what this portal is meant to demonstrate.</div></Reveal>
    </div>
  );
}

export const SECTIONS = { overview: Overview, roadmap: Roadmap, tasks: Tasks, meetings: Meetings, research: Research, docs: Docs, brand: Brand, about: About };
