/* ============================================================
   Jinpeng OS — Shared UI primitives
   Icons, hooks, placeholders. Exported to window.
   ============================================================ */
const { useState, useEffect, useRef, useCallback, useLayoutEffect, createContext, useContext } = React;

/* ---------- Icons (minimal geometric line set) ---------- */
function Icon({ name, size = 18, stroke = 1.6, style }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round",
    strokeLinejoin: "round", style };
  switch (name) {
    case "mission": return (<svg {...p}><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>);
    case "exp": return (<svg {...p}><path d="M4 5v14M4 7h10M4 12h14M4 17h7"/><circle cx="18" cy="7" r="1.6"/><circle cx="20" cy="12" r="1.6"/><circle cx="13" cy="17" r="1.6"/></svg>);
    case "lab": return (<svg {...p}><path d="M9 3h6M10 3v6l-5 8a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 17l-5-8V3"/><path d="M7.5 14h9"/></svg>);
    case "skills": return (<svg {...p}><circle cx="12" cy="6" r="2"/><circle cx="6" cy="17" r="2"/><circle cx="18" cy="17" r="2"/><path d="M12 8v3M11 12l-3.5 3.5M13 12l3.5 3.5"/></svg>);
    case "ai": return (<svg {...p}><rect x="5" y="6" width="14" height="12" rx="3"/><path d="M9 2v4M15 2v4M2 11h2M2 14h2M20 11h2M20 14h2"/><circle cx="9.5" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="12" r="1.1" fill="currentColor" stroke="none"/></svg>);
    case "term": return (<svg {...p}><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7 9l3 3-3 3M13 15h4"/></svg>);
    case "close": return (<svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>);
    case "min": return (<svg {...p}><path d="M6 12h12"/></svg>);
    case "max": return (<svg {...p}><path d="M8 8h8v8"/><path d="M8 8l8 8"/></svg>);
    case "arrow": return (<svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>);
    case "arrowL": return (<svg {...p}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>);
    case "search": return (<svg {...p}><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>);
    case "cmd": return (<svg {...p}><path d="M9 6a3 3 0 1 0 3 3V6a3 3 0 1 1 3 3h-3m-3 6a3 3 0 1 0 3-3v3a3 3 0 1 1-3-3"/></svg>);
    case "mail": return (<svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/></svg>);
    case "github": return (<svg {...p}><path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.3 2.3 5.3 2.6 5.3 2.6a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>);
    case "linkedin": return (<svg {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 12v5"/></svg>);
    case "dot": return (<svg {...p}><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/></svg>);
    case "globe": return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></svg>);
    case "spark": return (<svg {...p}><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/><path d="M7 7l3 3M17 7l-3 3M7 17l3-3M17 17l-3-3"/></svg>);
    case "copy": return (<svg {...p}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>);
    case "check": return (<svg {...p}><path d="M5 13l4 4L19 7"/></svg>);
    case "pin": return (<svg {...p}><path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2"/></svg>);
    case "send": return (<svg {...p}><path d="M4 12l16-7-7 16-2-7-7-2z"/></svg>);
    case "layers": return (<svg {...p}><path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"/></svg>);
    case "bolt": return (<svg {...p}><path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z"/></svg>);
    case "book": return (<svg {...p}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5z"/><path d="M18 17H6"/></svg>);
    default: return (<svg {...p}><circle cx="12" cy="12" r="8"/></svg>);
  }
}

/* ---------- Draggable window hook ---------- */
function useDraggable(initial, bounds) {
  const [pos, setPos] = useState(initial);
  const dragRef = useRef(null);
  const onPointerDown = useCallback((e) => {
    if (e.target.closest("[data-no-drag]")) return;
    const startX = e.clientX, startY = e.clientY;
    const origin = { ...pos };
    const move = (ev) => {
      let nx = origin.x + (ev.clientX - startX);
      let ny = origin.y + (ev.clientY - startY);
      const m = 8;
      ny = Math.max(34, ny);
      nx = Math.min(Math.max(nx, -((bounds?.w || 600) - 120)), window.innerWidth - 120);
      ny = Math.min(ny, window.innerHeight - 80);
      setPos({ x: nx, y: ny });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      document.body.style.userSelect = "";
    };
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }, [pos, bounds]);
  return { pos, setPos, onPointerDown, dragRef };
}

/* ---------- Image placeholder (striped, labeled) ---------- */
function Placeholder({ label, ratio = "16/9", tone = "var(--ac)", style, kind }) {
  return (
    <div className="jp-ph" style={{ aspectRatio: ratio, ...style }}>
      <div className="jp-ph-grid" />
      <div className="jp-ph-glow" style={{ background: `radial-gradient(circle at 50% 40%, ${tone}22, transparent 70%)` }} />
      <div className="jp-ph-label mono">
        <span className="jp-ph-dot" style={{ background: tone }} />
        {label}
      </div>
    </div>
  );
}

/* ---------- Typewriter ---------- */
function useTypewriter(text, speed = 28, start = true) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!start) return;
    setOut(""); setDone(false);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) { clearInterval(t); setDone(true); }
    }, speed);
    return () => clearInterval(t);
  }, [text, speed, start]);
  return { out, done };
}

/* ---------- Count-up number ---------- */
function CountUp({ to, dur = 900, suffix = "" }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf, t0;
    const step = (t) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, dur]);
  return <span>{n}{suffix}</span>;
}

/* ---------- Live clock ---------- */
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

Object.assign(window, {
  Icon, useDraggable, Placeholder, useTypewriter, CountUp, useClock,
  React_hooks: { useState, useEffect, useRef, useCallback, useLayoutEffect, createContext, useContext },
});
