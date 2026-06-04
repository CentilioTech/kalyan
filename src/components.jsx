import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV, STATUS } from "./content.js";

export const Avatar = ({ i, c = "k", lg = false }) => (
  <span className={`av ${c}${lg ? " lg" : ""}`}>{i}</span>
);

export const Pill = ({ children, kind = "p-todo" }) => (
  <span className={`pill ${kind}`}>{children}</span>
);

// Scroll-reveal wrapper: fades/rises into view once.
export const Reveal = ({ children, delay = 0, y = 14, className }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// Glass card with a mouse-following spotlight (sets --mx/--my for the CSS glow).
export const Card = ({ children, className = "", i = 0 }) => {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      className={`card ${className}`}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      {children}
    </motion.div>
  );
};

const Sun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const Moon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
);

// Light/dark theme toggle (sets the `dark` class on the root element).
export function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const toggle = () => {
    const d = !dark;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  };
  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle light or dark theme">
      <span className="thumb">{dark ? <Moon /> : <Sun />}</span>
    </button>
  );
}

// Interactive grid background canvas (mouse-reactive, HM-red glow). Sits behind everything.
export function GridBackground() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext("2d");
    let raf, W, H;
    const grid = 46;
    const mouse = { x: -999, y: -999, t: 0 };
    const isDark = () => document.documentElement.classList.contains("dark");
    const resize = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; };
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.t = Date.now(); };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = isDark() ? "rgba(255,255,255,0.05)" : "rgba(20,24,31,0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += grid) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += grid) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      if (Date.now() - mouse.t < 2600) {
        const cx = Math.floor(mouse.x / grid) * grid;
        const cy = Math.floor(mouse.y / grid) * grid;
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, grid * 3.2);
        g.addColorStop(0, isDark() ? "rgba(226,43,43,0.20)" : "rgba(192,23,24,0.13)");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(cx - grid * 3, cy - grid * 3, grid * 6, grid * 6);
        ctx.fillStyle = isDark() ? "rgba(226,43,43,0.16)" : "rgba(192,23,24,0.09)";
        ctx.fillRect(cx, cy, grid, grid);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); };
  }, []);
  return <canvas id="grid-bg" ref={ref} />;
}

// Holographic / interactive frosted-glass card: real 3D tilt toward the cursor + sheen.
// Tilt is applied to an inner element so Framer's entrance transform doesn't override it.
export const HolographicCard = ({ children, className = "", i = 0 }) => {
  const inner = useRef(null);
  const onMove = (e) => {
    const el = inner.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateX(${(py - 0.5) * -10}deg) rotateY(${(px - 0.5) * 12}deg)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => { if (inner.current) inner.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)"; };
  return (
    <motion.div
      className="holo-outer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div ref={inner} className={`card holo ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
        <span className="holo-sheen" />
        <div className="holo-inner">{children}</div>
      </div>
    </motion.div>
  );
};

// Color-palette card: stripes that expand on hover to reveal the hex (ravikatiyar162/color-palette-card).
export function ColorPaletteCard({ colors, statsText }) {
  return (
    <div className="palette-card">
      <div className="palette-strips">
        {colors.map((c) => (
          <div key={c} className="palette-strip" style={{ background: c }} onClick={() => navigator.clipboard && navigator.clipboard.writeText(c)}>
            <span>{c.toUpperCase()}</span>
          </div>
        ))}
      </div>
      <div className="palette-foot">
        <span>{statsText}</span>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true"><path d="M4 7.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5S5.5 9.83 5.5 9 4.83 7.5 4 7.5zm10 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5S9.83 7.5 9 7.5z" /></svg>
      </div>
    </div>
  );
}

// Border-glow: glow that follows the cursor along the card edges (reactbits border-glow).
export function BorderGlow({ children, className = "" }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - r.left}px`);
    el.style.setProperty("--gy", `${e.clientY - r.top}px`);
    el.style.setProperty("--go", "1");
  };
  const onLeave = () => { if (ref.current) ref.current.style.setProperty("--go", "0"); };
  return (
    <div ref={ref} className={`border-glow ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}

// Drifting particle field for a section background (HM-red tinted). Fills its parent.
export function Particles({ count = 42 }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext("2d");
    let raf, W, H;
    const parent = cv.parentElement;
    const resize = () => { const r = parent.getBoundingClientRect(); W = cv.width = r.width; H = cv.height = Math.max(r.height, 200); };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(parent);
    const isDark = () => document.documentElement.classList.contains("dark");
    const ps = Array.from({ length: count }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.0007, vy: (Math.random() - 0.5) * 0.0007, r: Math.random() * 2 + 0.6 }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, 6.2832);
        ctx.fillStyle = isDark() ? "rgba(226,43,43,0.5)" : "rgba(192,23,24,0.32)";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [count]);
  return <canvas ref={ref} className="particles" />;
}

// Morphing text: cycles through the given words with a blur/morph transition.
export function MorphingText({ words, className = "" }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((x) => (x + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span className={`morph ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(8px)", y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {words[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// 3D coverflow carousel (rotateY by distance from active, autoplay + controls).
export function Carousel3D({ items }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % items.length), 4200);
    return () => clearInterval(t);
  }, [items.length]);
  const go = (d) => setActive((a) => (a + d + items.length) % items.length);
  return (
    <div className="carousel3d">
      <div className="c3d-stage">
        {items.map((node, i) => {
          let off = i - active;
          if (off > items.length / 2) off -= items.length;
          if (off < -items.length / 2) off += items.length;
          const abs = Math.abs(off);
          return (
            <div
              key={i}
              className={`c3d-card ${off === 0 ? "active" : ""}`}
              style={{ transform: `translateX(${off * 56}%) translateZ(${-abs * 190}px) rotateY(${off * -30}deg)`, opacity: abs > 2 ? 0 : 1, zIndex: 10 - abs, pointerEvents: off === 0 ? "auto" : "none" }}
              onClick={() => setActive(i)}
            >
              {node}
            </div>
          );
        })}
      </div>
      <div className="c3d-nav">
        <button onClick={() => go(-1)} aria-label="Previous">‹</button>
        <div className="c3d-dots">{items.map((_, i) => <span key={i} className={i === active ? "on" : ""} onClick={() => setActive(i)} />)}</div>
        <button onClick={() => go(1)} aria-label="Next">›</button>
      </div>
    </div>
  );
}

// Yield-style highlight card: gradient HM-red border, icon, title, description.
export function YieldCard({ icon, title, desc }) {
  return (
    <div className="yield-card">
      <div className="yield-inner">
        <div className="yield-icon">{icon}</div>
        <div className="yield-title">{title}</div>
        <div className="yield-desc">{desc}</div>
      </div>
    </div>
  );
}

// Course-style card: gradient header band, icon, title, meta, status.
export function CourseCard({ ic, title, sub, status, statusKind, i = 0 }) {
  return (
    <motion.div className="course-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -5 }}>
      <div className="course-top"><span className="course-ic">{ic}</span></div>
      <div className="course-body">
        <b>{title}</b>
        <p>{sub}</p>
        <Pill kind={statusKind}>{status}</Pill>
      </div>
    </motion.div>
  );
}

// Testimonial / quote card.
export function TestimonialCard({ quote, who, avatar, avc = "all", i = 0 }) {
  return (
    <motion.div className="testi-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
      <div className="testi-mark">&ldquo;</div>
      <p className="testi-text">{quote}</p>
      <div className="testi-by"><Avatar i={avatar} c={avc} /><span>{who}</span></div>
    </motion.div>
  );
}

// Cursor-driven particle typography: text rendered as particles that scatter near the cursor.
export function ParticleText({ text = "HM INTEL" }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext("2d");
    let raf, pts = [];
    const mouse = { x: -999, y: -999 };
    const build = () => {
      const W = (cv.width = cv.offsetWidth || 800);
      const H = (cv.height = 150);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `800 ${Math.min(96, W / (text.length * 0.62))}px Sora, sans-serif`;
      ctx.fillText(text, W / 2, H / 2);
      const data = ctx.getImageData(0, 0, W, H).data;
      pts = [];
      for (let y = 0; y < H; y += 4) for (let x = 0; x < W; x += 4) {
        if (data[(y * W + x) * 4 + 3] > 130) pts.push({ x, y, bx: x, by: y, vx: 0, vy: 0 });
      }
    };
    const onMove = (e) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const onLeave = () => { mouse.x = -999; mouse.y = -999; };
    cv.addEventListener("mousemove", onMove);
    cv.addEventListener("mouseleave", onLeave);
    const start = () => {
      build();
      const draw = () => {
        const W = cv.width, H = cv.height;
        ctx.clearRect(0, 0, W, H);
        const dark = document.documentElement.classList.contains("dark");
        for (const p of pts) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy) || 1;
          if (d < 64) { const f = (64 - d) / 64; p.vx += (dx / d) * f * 4; p.vy += (dy / d) * f * 4; }
          p.vx += (p.bx - p.x) * 0.045; p.vy += (p.by - p.y) * 0.045; p.vx *= 0.9; p.vy *= 0.9;
          p.x += p.vx; p.y += p.vy;
          ctx.fillStyle = d < 80 ? "rgba(226,43,43,0.95)" : dark ? "rgba(234,237,243,0.85)" : "rgba(20,24,31,0.82)";
          ctx.fillRect(p.x, p.y, 2.2, 2.2);
        }
        raf = requestAnimationFrame(draw);
      };
      draw();
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
    const onResize = () => build();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); cv.removeEventListener("mousemove", onMove); cv.removeEventListener("mouseleave", onLeave); window.removeEventListener("resize", onResize); };
  }, [text]);
  return <canvas ref={ref} className="particle-text" />;
}

// Shuffle / testimonial card stack (drag the front card left to cycle).
export function ShuffleCards({ cards }) {
  const [order, setOrder] = useState(cards.map((_, i) => i));
  const shuffle = () => setOrder((o) => { const n = [...o]; n.push(n.shift()); return n; });
  const pos = (rank) => (rank === 0 ? "front" : rank === 1 ? "middle" : "back");
  return (
    <div className="shuffle-wrap">
      <div className="shuffle-stage">
        {cards.map((c, i) => {
          const rank = order.indexOf(i);
          const position = pos(rank);
          const isFront = position === "front";
          return (
            <motion.div
              key={i}
              className={`shuffle-card ${position}`}
              style={{ zIndex: position === "front" ? 3 : position === "middle" ? 2 : 1, cursor: isFront ? "grab" : "default" }}
              animate={{ rotate: position === "front" ? "-6deg" : position === "middle" ? "0deg" : "6deg", x: position === "front" ? "0%" : position === "middle" ? "30%" : "60%" }}
              drag={isFront ? "x" : false}
              dragElastic={0.35}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => { if (info.offset.x < -120) shuffle(); }}
              whileTap={{ cursor: "grabbing" }}
              transition={{ duration: 0.35 }}
            >
              {c}
            </motion.div>
          );
        })}
      </div>
      <div className="shuffle-hint">Drag the top card left to shuffle ›</div>
    </div>
  );
}

// Activity stream / timeline (avatar-or-icon node, title, meta, status).
export function ActivityStream({ items }) {
  return (
    <div className="activity">
      {items.map((it, i) => (
        <motion.div className="activity-item" key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
          <div className="activity-node">{it.ic}</div>
          <div className="activity-body">
            <div className="activity-row"><b>{it.title}</b>{it.status && <Pill kind={it.statusKind}>{it.status}</Pill>}</div>
            <p>{it.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function Sidebar({ active, onPick, open }) {
  return (
    <aside className={`side${open ? " open" : ""}`}>
      <div className="brandbar">
        <img src="./hm-intel-logo.png" alt="HM Intel" />
      </div>
      <nav className="nav">
        {NAV.map(([id, label]) => (
          <button key={id} className={active === id ? "active" : ""} onClick={() => onPick(id)}>
            <span className="dot" />
            {label}
          </button>
        ))}
      </nav>
      <div className="foot">
        HM Intel Project Portal<br />
        Prepared by Kalyan for CTS<br />
        Working copy · v1 · Jun 2026
      </div>
    </aside>
  );
}

export function TopBar({ label, onMenu }) {
  return (
    <div className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className="menu-btn" onClick={onMenu}>☰</div>
        <div className="crumb">HM Intel · <b>{label}</b></div>
      </div>
      <div className="topbar-right">
        <span className="statuschip"><span className="pulse" />{STATUS}</span>
        <ThemeToggle />
      </div>
    </div>
  );
}
