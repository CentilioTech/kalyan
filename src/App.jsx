import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar, TopBar, GridBackground } from "./components.jsx";
import { SECTIONS, } from "./sections.jsx";
import { NAV } from "./content.js";

export default function App() {
  const [active, setActive] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const label = NAV.find(([id]) => id === active)?.[1] || "";
  const Active = SECTIONS[active];

  const pick = (id) => { setActive(id); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="layout">
      <GridBackground />
      <Sidebar active={active} onPick={pick} open={menuOpen} />
      <div className="main">
        <TopBar label={label} onMenu={() => setMenuOpen((o) => !o)} />
        <div className="wrap">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <Active />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
