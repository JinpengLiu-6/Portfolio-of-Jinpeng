/* ============================================================
   Module: Project Laboratory + Case Study
   ============================================================ */
const { useState: uSW } = React;

function ProjectHero({ project, accent, big }) {
  const hero = project.images && project.images[0];
  return (
    <div className={"pl-hero-art" + (big ? " big" : "")} style={{ "--p-ac": accent }}>
      {hero ? (
        <img className="pl-hero-img" src={hero.src} alt={hero.label || project.name} />
      ) : (
        <>
          <div className="pl-hero-grid" />
          <div className="pl-hero-orb" />
          <div className="pl-hero-rings"><span /><span /><span /></div>
        </>
      )}
    </div>
  );
}

function ProjectLab() {
  const { projects } = window.JP;
  const [openId, setOpenId] = uSW(null);
  const proj = projects.find((p) => p.id === openId);

  if (proj) return <CaseStudy proj={proj} onBack={() => setOpenId(null)} />;

  return (
    <div className="jp-mod pl">
      <div className="jp-mod-head">
        <div className="jp-eyebrow"><Icon name="lab" size={13} /> PROJECT LABORATORY</div>
        <h1 className="jp-h1">Product & Engineering Projects</h1>
        <p className="jp-sub">A collection of product ideas, enterprise UX work, frontend experiments and archive projects. Open any one for the full case study.</p>
      </div>
      <div className="pl-gallery">
        {projects.map((p) => (
          <button key={p.id} className="pl-item" onClick={() => setOpenId(p.id)} style={{ "--p-ac": p.accent }}>
            <ProjectHero project={p} accent={p.accent} />
            <div className="pl-item-body">
              <div className="pl-item-top">
                <span className="pl-item-kind mono">{p.kind}</span>
                <span className="pl-item-year mono">{p.year}</span>
              </div>
              <h3 className="pl-item-name disp">{p.name}</h3>
              <p className="pl-item-one">{p.oneliner}</p>
              <div className="pl-item-tags">
                {p.tags.slice(0, 4).map((t) => <span key={t} className="pl-tag">{t}</span>)}
              </div>
              <span className="pl-item-open">Open case study <Icon name="arrow" size={14} /></span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function CaseStudy({ proj, onBack }) {
  const sections = [
    { id: "problem", label: "Problem" },
    { id: "solution", label: "Solution" },
    { id: "architecture", label: "Architecture" },
    { id: "challenges", label: "Challenges" },
    { id: "screens", label: "Screens" },
    { id: "lessons", label: "Lessons" },
  ];
  return (
    <div className="jp-mod cs" style={{ "--p-ac": proj.accent }}>
      <div className="cs-bar">
        <button className="cs-back" onClick={onBack}><Icon name="arrowL" size={16} /> Laboratory</button>
        <div className="cs-bar-tags">
          {proj.tags.map((t) => <span key={t} className="pl-tag">{t}</span>)}
        </div>
      </div>

      <div className="cs-hero">
        <ProjectHero project={proj} accent={proj.accent} big />
        <div className="cs-hero-meta">
          <span className="pl-item-kind mono">{proj.kind} · {proj.year}</span>
          <h1 className="cs-title disp">{proj.name}</h1>
          <p className="cs-one">{proj.oneliner}</p>
        </div>
      </div>

      <div className="cs-flow">
        <section className="cs-sec">
          <div className="cs-sec-h"><span className="cs-sec-n mono">01</span> Problem</div>
          <p className="cs-text">{proj.problem}</p>
        </section>

        <section className="cs-sec">
          <div className="cs-sec-h"><span className="cs-sec-n mono">02</span> Solution</div>
          <p className="cs-text accent">{proj.solution}</p>
        </section>

        <section className="cs-sec">
          <div className="cs-sec-h"><span className="cs-sec-n mono">03</span> Architecture</div>
          <div className="cs-arch">
            {proj.architecture.map((a, i) => (
              <div key={a.label} className="cs-arch-node">
                <div className="cs-arch-i mono">{String(i + 1).padStart(2, "0")}</div>
                <div className="cs-arch-label">{a.label}</div>
                <div className="cs-arch-desc">{a.desc}</div>
                {i < proj.architecture.length - 1 && <span className="cs-arch-conn" />}
              </div>
            ))}
          </div>
        </section>

        <section className="cs-sec">
          <div className="cs-sec-h"><span className="cs-sec-n mono">04</span> Technical challenges</div>
          <div className="cs-chal">
            {proj.challenges.map((c, i) => (
              <div key={i} className="cs-chal-row">
                <Icon name="bolt" size={15} style={{ color: "var(--p-ac)", flex: "none", marginTop: 2 }} />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="cs-sec">
          <div className="cs-sec-h"><span className="cs-sec-n mono">05</span> Screens</div>
          <div className="cs-screens">
            {(proj.images && proj.images.length ? proj.images.slice(1) : proj.screens.map((s) => ({ label: s }))).map((s) => (
              s.src ? (
                <figure key={s.src} className="cs-screen">
                  <img src={s.src} alt={s.label} />
                  <figcaption>{s.label}</figcaption>
                </figure>
              ) : (
                <Placeholder key={s.label} label={s.label} tone={proj.accent} ratio="4/3" />
              )
            ))}
          </div>
          <p className="cs-screens-note mono">selected product screens from the project</p>
        </section>

        <section className="cs-sec">
          <div className="cs-sec-h"><span className="cs-sec-n mono">06</span> Lessons learned</div>
          <div className="cs-lesson">
            <Icon name="spark" size={18} style={{ color: "var(--p-ac)", flex: "none" }} />
            <p className="cs-text">{proj.lessons}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

window.JP_MODULES = window.JP_MODULES || {};
window.JP_MODULES.projects = ProjectLab;
