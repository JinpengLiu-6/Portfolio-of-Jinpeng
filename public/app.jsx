/* ============================================================
   Jinpeng OS — Root application
   ============================================================ */
const { useState: uSA2, useEffect: uEA2, useRef: uRA2, useCallback: uCA2 } = React;
const MOBILE_BREAKPOINT = 900;

function App() {
  const { modules, profile } = window.JP;
  const { Boot, OSWindow, Palette, WIN_DEFAULTS } = window.JP_SHELL;

  const [booted, setBooted] = uSA2(() => sessionStorage.getItem("jp-booted") === "1");
  const [wins, setWins] = uSA2([]);
  const [focusId, setFocusId] = uSA2(null);
  const [palette, setPalette] = uSA2(false);
  const [isMobile, setIsMobile] = uSA2(window.innerWidth <= MOBILE_BREAKPOINT);
  const zRef = uRA2(20);
  const offRef = uRA2(0);
  const now = useClock();

  uEA2(() => {
    const r = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  // open Mission Control on first boot
  uEA2(() => {
    if (booted && wins.length === 0) openModule("mission");
    // eslint-disable-next-line
  }, [booted]);

  // global keyboard
  uEA2(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((p) => !p); }
      else if (e.key === "Escape") setPalette(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const focus = uCA2((id) => {
    zRef.current += 1;
    const z = zRef.current;
    setWins((w) => w.map((x) => x.id === id ? { ...x, z, minimized: false } : x));
    setFocusId(id);
  }, []);

  function openModule(id) {
    setWins((w) => {
      const ex = w.find((x) => x.id === id);
      zRef.current += 1;
      if (isMobile && ex) return [{ ...ex, z: zRef.current, minimized: false, closing: false }];
      if (ex) return w.map((x) => x.id === id ? { ...x, z: zRef.current, minimized: false } : x);
      const d = WIN_DEFAULTS[id] || { w: 800, h: 600 };
      const off = (offRef.current % 5) * 28; offRef.current += 1;
      const x = Math.max(20, (window.innerWidth - d.w) / 2 + off - 40);
      const y = Math.max(54, (window.innerHeight - d.h) / 2 + off - 30);
      const next = { id, z: zRef.current, geo: { x, y, w: d.w, h: d.h }, minimized: false, maximized: false };
      return isMobile ? [next] : [...w, next];
    });
    setFocusId(id);
  }

  function closeWin(id) {
    setWins((w) => w.map((x) => x.id === id ? { ...x, closing: true } : x));
    setTimeout(() => setWins((w) => w.filter((x) => x.id !== id)), 210);
  }
  function minWin(id) { setWins((w) => w.map((x) => x.id === id ? { ...x, minimized: true } : x)); }
  function maxWin(id) { setWins((w) => w.map((x) => x.id === id ? { ...x, maximized: !x.maximized } : x)); }
  function setGeo(id, geo) { setWins((w) => w.map((x) => x.id === id ? { ...x, geo } : x)); }

  function finishBoot() { sessionStorage.setItem("jp-booted", "1"); setBooted(true); }

  const openIds = wins.filter((w) => !w.minimized).map((w) => w.id);
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const t = (key, fallback) => window.JP_I18N ? window.JP_I18N.t(key, fallback) : (fallback || key);

  return (
    <div className="jp-desktop">
      <div className="jp-wall-grid" />
      <div className="jp-wall-noise" />
      <div className="jp-wall-orb" style={{ width: 420, height: 420, top: -120, right: -60, background: "var(--ac)" }} />
      <div className="jp-wall-orb" style={{ width: 360, height: 360, bottom: -140, left: -80, background: "var(--info)", animationDelay: "-7s" }} />

      {/* Menu bar */}
      <div className="jp-menubar">
        <div className="jp-mb-logo"><span className="jp-mb-mark" /> Jinpeng OS</div>
        {!isMobile && modules.slice(0, 3).map((m) => (
          <div key={m.id} className="jp-mb-item" onClick={() => openModule(m.id)}>{m.short}</div>
        ))}
        <div className="jp-mb-spacer" />
        <div className="jp-mb-right">
          <div className="jp-mb-kbd" onClick={() => setPalette(true)}><Icon name="cmd" size={12} /> K</div>
          {!isMobile && <div className="jp-mb-stat"><span className="jp-mb-live" /> {profile.status.state}</div>}
          {!isMobile && <div className="jp-mb-stat">{date}</div>}
          <div className="jp-mb-stat mono">{time}</div>
        </div>
      </div>

      {/* Windows */}
      {wins.filter((w) => !w.minimized).map((w) => {
        const mod = modules.find((m) => m.id === w.id);
        return (
          <OSWindow key={w.id} win={w} mod={mod} focused={focusId === w.id && !isMobile}
            isMobile={isMobile} onFocus={focus} onClose={closeWin} onMin={minWin} onMax={maxWin}
            onGeo={setGeo} openModule={openModule} />
        );
      })}

      {/* empty-state hint */}
      {openIds.length === 0 && (
        <div className="jp-empty">
          <div className="jp-empty-mark"><span className="jp-mb-mark" style={{ width: 40, height: 40, borderRadius: 12 }} /></div>
          <div className="jp-empty-h disp">{t("ui.empty.title", "Welcome to Jinpeng OS")}</div>
          <div className="jp-empty-s">{t("ui.empty.subtitle", "Open a module from the dock - or press")} <kbd>⌘K</kbd></div>
        </div>
      )}

      {/* Dock */}
      <div className="jp-dock-wrap">
        <div className="jp-dock">
          {modules.map((m, i) => (
            <React.Fragment key={m.id}>
              {m.id === "console" && <div className="jp-dock-sep" />}
              <button className={"jp-dock-item" + (wins.some((w) => w.id === m.id) ? " open" : "")}
                onClick={() => openModule(m.id)} style={{ "--d-ac": m.accent }}>
                <Icon name={m.icon} size={22} />
                <span className="jp-dock-tip">{m.name}</span>
                <span className="jp-dock-dot" />
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Command palette */}
      {palette && <Palette onClose={() => setPalette(false)} openModule={openModule} openWins={openIds} />}

      {/* Boot */}
      {!booted && <Boot onDone={finishBoot} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
