/* ============================================================
   Modules: Mission Control + Experience Database
   ============================================================ */
const { useState: uS1, useEffect: uE1, useRef: uR1 } = React;

/* ---------------- MISSION CONTROL ---------------- */
function MissionControl({ openModule }) {
  const { profile, experience, projects, skills } = window.JP;
  const now = useClock();
  const avail = new Date(profile.status.availableFrom + "T00:00:00");
  const days = Math.max(0, Math.ceil((avail - now) / 86400000));
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const stats = [
    { k: experience.length, label: "Roles", mod: "experience" },
    { k: projects.length, label: "Products", mod: "projects" },
    { k: skills.length, label: "Skills", mod: "skills" },
    { k: 3, label: "Languages", mod: "skills" },
  ];

  return (
    <div className="jp-mod mc">
      <div className="mc-hero">
        <div className="mc-hero-glow" />
        <div className="mc-id">
          <div className="mc-avatar"><span>JL</span></div>
          <div>
            <div className="jp-eyebrow"><Icon name="dot" size={12} /> MISSION CONTROL</div>
            <h1 className="mc-name disp">{profile.name}</h1>
            <p className="mc-role">{profile.role}</p>
          </div>
        </div>
        <p className="mc-tag">{profile.tagline}</p>
        <div className="mc-links">
          <a className="mc-link" href={"mailto:" + profile.contact.email}><Icon name="mail" size={15} /> Email</a>
          <a className="mc-link" href={profile.contact.github} target="_blank" rel="noreferrer"><Icon name="github" size={15} /> GitHub</a>
          <a className="mc-link" href={profile.contact.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" size={15} /> LinkedIn</a>
        </div>
      </div>

      <div className="mc-grid">
        <div className="jp-card mc-status">
          <div className="mc-status-top">
            <span className="mc-live"><span className="jp-mb-live" /> {profile.status.state}</span>
            <span className="jp-chip"><Icon name="pin" size={12} /> {profile.status.location}</span>
          </div>
          <div className="mc-count">
            <span className="mc-count-n disp"><CountUp to={days} /></span>
            <span className="mc-count-l">days until available<br /><b>20 Nov 2026</b></span>
          </div>
          <div className="mc-status-meta">
            <div><span className="mc-k">Seeking</span><span>{profile.status.seeking}</span></div>
            <div><span className="mc-k">Mobility</span><span>{profile.status.relocation}</span></div>
          </div>
        </div>

        <div className="mc-stats">
          {stats.map((s) => (
            <button key={s.label} className="jp-card mc-stat" onClick={() => openModule(s.mod)}>
              <span className="mc-stat-n disp"><CountUp to={s.k} /></span>
              <span className="mc-stat-l">{s.label}</span>
              <Icon name="arrow" size={14} style={{ position: "absolute", top: 14, right: 14, opacity: 0.35 }} />
            </button>
          ))}
        </div>

        <div className="jp-card mc-clock">
          <div className="mc-clock-time mono">{time}</div>
          <div className="mc-clock-tz">{profile.status.location} · CET</div>
          <div className="mc-now">
            <span className="mc-k">Now</span>
            <span>Finishing M.Sc. in Human-Computer Interaction — building products at the seam of design & engineering.</span>
          </div>
        </div>

        <div className="jp-card mc-edu">
          <div className="mc-card-h"><Icon name="book" size={15} /> Education</div>
          {profile.education.map((e) => (
            <div key={e.degree} className="mc-edu-row">
              <div className="mc-edu-deg">{e.degree}</div>
              <div className="mc-edu-sch">{e.school}</div>
            </div>
          ))}
        </div>

        <button className="jp-card mc-cta" onClick={() => openModule("assistant")}>
          <div className="mc-cta-ico"><Icon name="ai" size={20} /></div>
          <div>
            <div className="mc-cta-h">Ask the Recruiter Assistant</div>
            <div className="mc-cta-s">Get instant answers about Jinpeng's fit, stack & experience.</div>
          </div>
          <Icon name="arrow" size={18} />
        </button>
      </div>
    </div>
  );
}

/* ---------------- EXPERIENCE DATABASE ---------------- */
function ExperienceDB() {
  const { experience } = window.JP;
  const [sel, setSel] = uS1(experience[0].id);
  const cur = experience.find((e) => e.id === sel);

  return (
    <div className="jp-mod exp">
      <div className="exp-head">
        <div className="jp-eyebrow"><Icon name="exp" size={13} /> EXPERIENCE DATABASE</div>
        <div className="exp-query mono">
          <span className="exp-q-prompt">SELECT</span> * <span className="exp-q-prompt">FROM</span> career
          <span className="exp-q-dim"> ORDER BY recency DESC</span>
          <span className="exp-q-count">{experience.length} rows</span>
        </div>
      </div>
      <div className="exp-body">
        <div className="exp-rail">
          {experience.map((e, i) => (
            <button key={e.id} className={"exp-row" + (sel === e.id ? " active" : "")}
              onClick={() => setSel(e.id)} style={{ "--row-ac": e.accent }}>
              <span className="exp-row-line"><span className="exp-row-node" /></span>
              <span className="exp-row-main">
                <span className="exp-row-co">{e.company}</span>
                <span className="exp-row-ti">{e.title}</span>
              </span>
              <span className="exp-row-idx mono">{String(i + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <div className="exp-detail" key={cur.id}>
          <div className="exp-d-kind jp-chip" style={{ borderColor: "var(--line-2)" }}>{cur.kind}</div>
          <h2 className="exp-d-co disp">{cur.company}</h2>
          <div className="exp-d-ti">{cur.title}</div>
          <p className="exp-d-sum">{cur.summary}</p>
          <div className="exp-d-points">
            {cur.points.map((p, i) => (
              <div key={i} className="exp-d-point">
                <span className="exp-d-bullet" style={{ background: cur.accent }} />
                <span>{p}</span>
              </div>
            ))}
          </div>
          <div className="exp-d-stack">
            {cur.stack.map((s) => <span key={s} className="jp-chip">{s}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

window.JP_MODULES = window.JP_MODULES || {};
window.JP_MODULES.mission = MissionControl;
window.JP_MODULES.experience = ExperienceDB;
