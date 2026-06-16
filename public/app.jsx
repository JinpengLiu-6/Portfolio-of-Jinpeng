/* ============================================================
   Jinpeng OS — Root application
   ============================================================ */
const { useState: uSA2, useEffect: uEA2, useRef: uRA2, useCallback: uCA2 } = React;
const MOBILE_BREAKPOINT = 900;

const MOBILE_ICON_TONES = {
  mission: ["#16b87f", "#0c5e44", "rgba(22,184,127,0.48)"],
  about: ["#20c997", "#0f6f56", "rgba(32,201,151,0.42)"],
  resume: ["#54a8ff", "#145f99", "rgba(84,168,255,0.34)"],
  experience: ["#3ee0a0", "#116b54", "rgba(62,224,160,0.42)"],
  projects: ["#16b87f", "#083d31", "rgba(22,184,127,0.5)"],
  skills: ["#34d399", "#0f5f49", "rgba(52,211,153,0.4)"],
  languages: ["#4cc9f0", "#176280", "rgba(76,201,240,0.34)"],
  education: ["#8bd450", "#2f6b38", "rgba(139,212,80,0.34)"],
  assistant: ["#3ee0a0", "#12665c", "rgba(62,224,160,0.44)"],
  contact: ["#2dd4bf", "#0f766e", "rgba(45,212,191,0.38)"],
  console: ["#111b17", "#050807", "rgba(22,184,127,0.45)", "#3ee0a0"],
};

function mobileIconStyle(id) {
  const tone = MOBILE_ICON_TONES[id] || MOBILE_ICON_TONES.mission;
  return { "--m-a": tone[0], "--m-b": tone[1], "--m-glow": tone[2], "--m-fg": tone[3] || "#fff" };
}

function MobileOS({ modules, profile, win, now, openModule, closeWin, openPalette }) {
  const Content = win ? window.JP_MODULES[win.id] : null;
  const mod = win ? modules.find((m) => m.id === win.id) : null;
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const dockIds = ["mission", "projects", "assistant", "contact"];
  const mobileHiddenIds = ["console"];
  const dockModules = dockIds.map((id) => modules.find((m) => m.id === id)).filter(Boolean);
  const appModules = modules.filter((m) => !dockIds.includes(m.id) && !mobileHiddenIds.includes(m.id));
  const t = (key, fallback) => window.JP_I18N ? window.JP_I18N.t(key, fallback) : (fallback || key);

  if (win && mod) {
    return (
      <div className="jp-ios-app">
        <div className="jp-ios-status">
          <span>{time}</span>
          <span className="jp-ios-status-mark" />
        </div>
        <div className="jp-ios-nav">
          <button className="jp-ios-back" onClick={() => closeWin(win.id)} aria-label={t("ui.mobile.home", "Home")}>
            <Icon name="arrowL" size={18} />
            <span>{t("ui.mobile.home", "Home")}</span>
          </button>
          <div className="jp-ios-title">
            <span className="jp-ios-title-icon" style={mobileIconStyle(mod.id)}><Icon name={mod.icon} size={15} /></span>
            <span>{mod.name}</span>
          </div>
          <button className="jp-ios-tool" onClick={openPalette} aria-label={t("ui.mobile.search", "Search")}>
            <Icon name="search" size={17} />
          </button>
        </div>
        <div className="jp-ios-app-body">
          {Content ? <Content openModule={openModule} /> : <div style={{ padding: 24 }}>Module not found.</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="jp-ios-home">
      <div className="jp-ios-status">
        <span>{time}</span>
        <span className="jp-ios-status-mark" />
      </div>
      <div className="jp-ios-home-scroll">
        <button className="jp-ios-hero" onClick={() => openModule("about")}>
          <img className="jp-ios-avatar" src={profile.avatar} alt="" />
          <div className="jp-ios-hero-copy">
            <div className="jp-ios-kicker mono">Jinpeng OS</div>
            <div className="jp-ios-name disp">{profile.name}</div>
            <div className="jp-ios-role">{profile.role}</div>
          </div>
          <div className="jp-ios-date mono">{date}</div>
        </button>

        <div className="jp-ios-widget" onClick={() => openModule("mission")}>
          <div>
            <div className="jp-ios-widget-k mono">{t("ui.mobile.status", "STATUS")}</div>
            <div className="jp-ios-widget-v">{profile.status.state}</div>
          </div>
          <Icon name="arrow" size={18} />
        </div>

        <div className="jp-ios-grid">
          {appModules.map((m) => (
            <button key={m.id} className="jp-ios-icon-btn" onClick={() => openModule(m.id)}>
              <span className="jp-ios-icon" style={mobileIconStyle(m.id)}><Icon name={m.icon} size={24} /></span>
              <span>{m.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="jp-ios-dock">
        {dockModules.map((m) => (
          <button key={m.id} className="jp-ios-dock-btn" onClick={() => openModule(m.id)} aria-label={m.name}>
            <span className="jp-ios-icon" style={mobileIconStyle(m.id)}><Icon name={m.icon} size={24} /></span>
          </button>
        ))}
      </div>
    </div>
  );
}

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
    if (booted && wins.length === 0 && !isMobile) openModule("mission");
    // eslint-disable-next-line
  }, [booted, isMobile]);

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
  const activeMobileWin = isMobile ? wins.find((w) => !w.minimized && w.id !== "console") : null;
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const t = (key, fallback) => window.JP_I18N ? window.JP_I18N.t(key, fallback) : (fallback || key);

  return (
    <div className="jp-desktop">
      <div className="jp-wall-grid" />
      <div className="jp-wall-noise" />
      <div className="jp-wall-orb" style={{ width: 420, height: 420, top: -120, right: -60, background: "var(--ac)" }} />
      <div className="jp-wall-orb" style={{ width: 360, height: 360, bottom: -140, left: -80, background: "var(--info)", animationDelay: "-7s" }} />

      {isMobile ? (
        <MobileOS modules={modules} profile={profile} win={activeMobileWin} now={now}
          openModule={openModule} closeWin={closeWin} openPalette={() => setPalette(true)} />
      ) : (
        <>
          {/* Menu bar */}
          <div className="jp-menubar">
            <div className="jp-mb-logo"><span className="jp-mb-mark" /> Jinpeng OS</div>
            {modules.slice(0, 3).map((m) => (
              <div key={m.id} className="jp-mb-item" onClick={() => openModule(m.id)}>{m.short}</div>
            ))}
            <div className="jp-mb-spacer" />
            <div className="jp-mb-right">
              <div className="jp-mb-kbd" onClick={() => setPalette(true)}><Icon name="cmd" size={12} /> K</div>
              <div className="jp-mb-stat"><span className="jp-mb-live" /> {profile.status.state}</div>
              <div className="jp-mb-stat">{date}</div>
              <div className="jp-mb-stat mono">{time}</div>
            </div>
          </div>

          {/* Windows */}
          {wins.filter((w) => !w.minimized).map((w) => {
            const mod = modules.find((m) => m.id === w.id);
            return (
              <OSWindow key={w.id} win={w} mod={mod} focused={focusId === w.id}
                isMobile={false} onFocus={focus} onClose={closeWin} onMin={minWin} onMax={maxWin}
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
              {modules.map((m) => (
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
        </>
      )}

      {/* Command palette */}
      {palette && <Palette onClose={() => setPalette(false)} openModule={openModule} openWins={openIds}
        excludeModuleIds={isMobile ? ["console"] : []} />}

      {/* Boot */}
      {!booted && <Boot onDone={finishBoot} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
