import { motion } from "framer-motion";
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

// Hover-lift card with optional stagger index.
export const Card = ({ children, className = "", i = 0, lift = true }) => (
  <motion.div
    className={`card ${className}`}
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
    whileHover={lift ? { y: -4, boxShadow: "0 2px 4px rgba(20,24,31,.05),0 22px 50px rgba(20,24,31,.12)" } : undefined}
  >
    {children}
  </motion.div>
);

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
      <span className="statuschip"><span className="pulse" />{STATUS}</span>
    </div>
  );
}
