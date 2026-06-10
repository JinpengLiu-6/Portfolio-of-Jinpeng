/* ============================================================
   Jinpeng OS — Shell: boot, window manager, dock, palette
   ============================================================ */
const { useState: uSh, useEffect: uEh, useRef: uRh, useCallback: uCh } = React;

const WIN_DEFAULTS = {
  mission:    { w: 880, h: 620 },
  experience: { w: 900, h: 600 },
  projects:   { w: 940, h: 660 },
  skills:     { w: 900, h: 680 },
  assistant:  { w: 560, h: 620 },
  console:    { w: 720, h: 480 },
};

/* ---------------- BOOT SEQUENCE ---------------- */
function Boot({ onDone }) {
  const steps = [
    "Initializing kernel",
    "Mounting Experience Database",
    "Loading Project Laboratory",
    "Calibrating Skill Universe",
    "Waking AI modules",
    "Compositing interface",
  ];
  const [i, setI] = uSh(0);
  const [prog, setProg] = uSh(0);
  const [leaving, setLeaving] = uSh(false);

  uEh(() => {
    if (i >= steps.length) {
      const t = setTimeout(() => finish(), 420);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setI((x) => x + 1), 300 + Math.random() * 220);
    return () => clearTimeout(t);
  }, [i]);

  uEh(() => {
    let raf;
    const tick = () => { setProg((p) => Math.min(100, p + (100 - p) * 0.06 + 0.4)); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function finish() {
    setLeaving(true);
    setTimeout(onDone, 620);
  }

  return (
    <div className={"jp-boot" + (leaving ? " leaving" : "")}>
      <div className="jp-boot-center">
        <div className="jp-boot-mark">
          <div className="jp-boot-logo" />
          <div className="jp-boot-ring" />
        </div>
        <div className="jp-boot-name disp">Jinpeng OS</div>
        <div className="jp-boot-ver mono">v1.0.0 · booting</div>

        <div className="jp-boot-log mono">
          {steps.slice(0, i).map((s, k) => (
            <div key={k} className="jp-boot-line done"><span className="jp-boot-ok">✓</span> {s}</div>
          ))}
          {i < steps.length && (
            <div className="jp-boot-line cur"><span className="jp-boot-spin" /> {steps[i]}…</div>
          )}
        </div>

        <div className="jp-boot-bar"><div className="jp-boot-fill" style={{ width: prog + "%" }} /></div>
      </div>
      <button className="jp-boot-skip mono" onClick={finish}>skip →</button>
    </div>
  );
}

/* ---------------- WINDOW ---------------- */
function OSWindow({ win, mod, focused, isMobile, onFocus, onClose, onMin, onMax, onGeo, openModule }) {
  const Content = window.JP_MODULES[win.id];
  const barRef = uRh(null);
  const winRef = uRh(null);
  const geo = win.geo;

  function startDrag(e) {
    if (isMobile || win.maximized) return;
    if (e.target.closest("[data-no-drag]")) return;
    onFocus(win.id);
    const sx = e.clientX, sy = e.clientY;
    const o = { ...geo };
    const move = (ev) => {
      let nx = o.x + (ev.clientX - sx);
      let ny = Math.max(34, o.y + (ev.clientY - sy));
      nx = Math.min(Math.max(nx, -(geo.w - 140)), window.innerWidth - 140);
      ny = Math.min(ny, window.innerHeight - 70);
      onGeo(win.id, { ...o, x: nx, y: ny });
    };
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); document.body.style.userSelect = ""; };
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  }

  function startResize(e) {
    if (isMobile || win.maximized) return;
    e.stopPropagation();
    const sx = e.clientX, sy = e.clientY; const o = { ...geo };
    const move = (ev) => {
      const w = Math.max(420, Math.min(o.w + (ev.clientX - sx), window.innerWidth - o.x - 8));
      const h = Math.max(320, Math.min(o.h + (ev.clientY - sy), window.innerHeight - o.y - 8));
      onGeo(win.id, { ...o, w, h });
    };
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); document.body.style.userSelect = ""; };
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  }

  const style = isMobile
    ? { left: 0, top: 34, width: "100vw", height: "calc(100dvh - 34px)", zIndex: win.z, borderRadius: 0 }
    : win.maximized
      ? { left: 10, top: 42, width: "calc(100vw - 20px)", height: "calc(100dvh - 130px)", zIndex: win.z }
      : { left: geo.x, top: geo.y, width: geo.w, height: geo.h, zIndex: win.z };

  return (
    <div ref={winRef} className={"jp-win" + (focused ? " focused" : "") + (win.closing ? " closing" : "")}
      style={style} onMouseDown={() => onFocus(win.id)}>
      <div ref={barRef} className="jp-win-bar" onPointerDown={startDrag} onDoubleClick={() => !isMobile && onMax(win.id)}>
        <div className="jp-lights" data-no-drag>
          <button className="jp-light r" onClick={() => onClose(win.id)} title="Close"><Icon name="close" size={8} /></button>
          <button className="jp-light y" onClick={() => onMin(win.id)} title="Minimize"><Icon name="min" size={8} /></button>
          <button className="jp-light g" onClick={() => onMax(win.id)} title="Zoom"><Icon name="max" size={8} /></button>
        </div>
        <div className="jp-win-title">
          <span className="jp-wt-ico"><Icon name={mod.icon} size={15} /></span>
          {mod.name}
          <span className="jp-win-sub">— {mod.desc}</span>
        </div>
      </div>
      <div className="jp-win-body">
        {Content ? <Content openModule={openModule} /> : <div style={{ padding: 30 }}>Module not found.</div>}
      </div>
      {!isMobile && !win.maximized && <div className="jp-resize" onPointerDown={startResize} data-no-drag />}
    </div>
  );
}

/* ---------------- COMMAND PALETTE ---------------- */
function Palette({ onClose, openModule, openWins }) {
  const { modules, profile } = window.JP;
  const [q, setQ] = uSh("");
  const [sel, setSel] = uSh(0);
  const inRef = uRh(null);
  uEh(() => { inRef.current && inRef.current.focus(); }, []);

  const actions = [
    ...modules.map((m) => ({ type: "mod", id: m.id, name: m.name, desc: m.desc, icon: m.icon })),
    { type: "link", id: "email", name: "Copy email", desc: profile.contact.email, icon: "mail", href: "mailto:" + profile.contact.email },
    { type: "link", id: "github", name: "Open GitHub", desc: "JinpengLiu-6", icon: "github", href: profile.contact.github },
    { type: "link", id: "linkedin", name: "Open LinkedIn", desc: "in/jinpeng-liu", icon: "linkedin", href: profile.contact.linkedin },
  ];
  const filtered = actions.filter((a) => (a.name + a.desc).toLowerCase().includes(q.toLowerCase()));
  uEh(() => setSel(0), [q]);

  function exec(a) {
    if (!a) return;
    if (a.type === "mod") { openModule(a.id); onClose(); }
    else { window.open(a.href, a.href.startsWith("mailto") ? "_self" : "_blank"); onClose(); }
  }
  function key(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); exec(filtered[sel]); }
    else if (e.key === "Escape") onClose();
  }

  return (
    <div className="jp-palette-scrim" onMouseDown={onClose}>
      <div className="jp-palette" onMouseDown={(e) => e.stopPropagation()}>
        <div className="jp-pal-input">
          <Icon name="search" size={18} style={{ color: "var(--tx-2)" }} />
          <input ref={inRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={key}
            placeholder="Search modules, actions, contact…" />
          <span className="jp-chip mono" style={{ fontSize: 10 }}>ESC</span>
        </div>
        <div className="jp-pal-list">
          <div className="jp-pal-sec">{q ? "Results" : "Modules & actions"}</div>
          {filtered.map((a, i) => (
            <div key={a.id} className={"jp-pal-row" + (i === sel ? " sel" : "")}
              onMouseEnter={() => setSel(i)} onClick={() => exec(a)}>
              <span className="jp-pal-ico"><Icon name={a.icon} size={16} /></span>
              <span className="jp-pal-meta">
                <span className="jp-pal-name">{a.name}</span>
                <span className="jp-pal-desc">{a.desc}</span>
              </span>
              <span className="jp-pal-enter mono">↵</span>
            </div>
          ))}
          {filtered.length === 0 && <div className="jp-pal-row" style={{ color: "var(--tx-2)" }}>No matches</div>}
        </div>
        <div className="jp-pal-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

window.JP_SHELL = { Boot, OSWindow, Palette, WIN_DEFAULTS };
