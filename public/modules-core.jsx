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
  const parisTimeZone = "Europe/Paris";
  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: parisTimeZone,
  });
  const parisTz = new Intl.DateTimeFormat("en-GB", {
    timeZone: parisTimeZone,
    timeZoneName: "short",
  }).formatToParts(now).find((p) => p.type === "timeZoneName")?.value || "Paris time";

  const stats = [
    { k: experience.length, label: "Roles", mod: "experience" },
    { k: projects.length, label: "Products", mod: "projects" },
    { k: skills.length, label: "Skills", mod: "skills" },
    { k: profile.languages.length, label: "Languages", mod: "languages" },
  ];

  return (
    <div className="jp-mod mc">
      <div className="mc-hero">
        <div className="mc-hero-glow" />
        <div className="mc-id">
          <div className="mc-avatar" aria-label="Portrait of Jinpeng Liu" />
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
            <span className="mc-count-l">days until available<br /><b>12 Sep 2026</b></span>
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
          <div className="mc-clock-tz">{profile.status.location} · {parisTz}</div>
          <div className="mc-now">
            <span className="mc-k">Now</span>
            <span>Building user-centered digital products by combining interface design, business understanding, and technical implementation.</span>
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

/* ---------------- LANGUAGES ---------------- */
function LanguagesModule() {
  const { profile } = window.JP;
  return (
    <div className="jp-mod lang">
      <div className="lang-head">
        <div className="jp-eyebrow"><Icon name="globe" size={13} /> LANGUAGES</div>
        <h1 className="jp-h1">Three languages, one builder.</h1>
        <p className="jp-sub">A multilingual working profile shaped by Chinese roots, international education, and daily life in France.</p>
      </div>

      <div className="lang-list">
        {profile.languages.map((lang) => (
          <article key={lang.code} className="jp-card lang-card">
            <div className="lang-glyph mono">{lang.code}</div>
            <div className="lang-main">
              <div className="lang-title-row">
                <h2 className="lang-name disp">{lang.name} <em>{lang.nativeName}</em></h2>
                <span className={"lang-level " + (lang.level === "Native" ? "native" : "pro")}>{lang.level}</span>
              </div>
              <p>{lang.blurb}</p>
              <div className="lang-contexts">
                {lang.contexts.map((c) => <span key={c} className="jp-chip">{c}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="lang-footer">
        <Icon name="globe" size={18} />
        <span>Comfortable working across Chinese, English and French-speaking teams.</span>
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

/* ---------------- ABOUT ME ---------------- */
function AboutModule() {
  const { profile } = window.JP;
  return (
    <div className="jp-mod about">
      <div className="about-hero">
        <div className="jp-eyebrow"><Icon name="book" size={13} /> ABOUT ME.APP</div>
        <h1 className="about-title disp">{profile.about.title}</h1>
        <p className="about-short">{profile.about.short}</p>
      </div>

      <div className="about-grid">
        <div className="jp-card about-card about-main">
          {profile.about.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </div>
        <div className="jp-card about-card">
          <div className="about-card-h">Core identity</div>
          <p>{profile.identity}</p>
        </div>
        <div className="jp-card about-card">
          <div className="about-card-h">Personality tags</div>
          <div className="about-tags">
            {profile.about.tags.map((t) => <span key={t} className="jp-chip">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- RESUME PREVIEW ---------------- */
function ResumeModule() {
  const { profile } = window.JP;
  return (
    <div className="jp-mod resume">
      <div className="resume-head">
        <div className="jp-eyebrow"><Icon name="layers" size={13} /> RESUME.APP</div>
        <h1 className="jp-h1">{profile.resume.title}</h1>
        <p className="jp-sub">{profile.resume.summary}</p>
      </div>

      <div className="resume-grid">
        <div className="jp-card resume-panel resume-main">
          <p>{profile.resume.body}</p>
          <div className="resume-k">Key strength</div>
          <p className="resume-strength">{profile.resume.strength}</p>
          <a className="resume-download" href="/ljpCV.pdf" target="_blank" rel="noreferrer">
            <Icon name="arrow" size={15} /> {profile.resume.downloadLabel}
          </a>
        </div>

        <div className="jp-card resume-panel">
          <div className="resume-k">Main focus</div>
          <div className="resume-focus">
            {profile.resume.focus.map((f) => <span key={f}>{f}</span>)}
          </div>
        </div>

        <div className="jp-card resume-panel resume-summary">
          <div className="resume-k">Quick summary</div>
          {profile.resume.quickSummary.map((row) => (
            <div key={row.k} className="resume-row">
              <span>{row.k}</span>
              <strong>{row.v}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- EDUCATION ---------------- */
function EducationModule() {
  const { profile } = window.JP;
  return (
    <div className="jp-mod edu">
      <div className="jp-mod-head">
        <div className="jp-eyebrow"><Icon name="book" size={13} /> EDUCATION.APP</div>
        <h1 className="jp-h1">Education</h1>
        <p className="jp-sub">Computer Science foundation, Human-Computer Interaction specialization, and an international academic background.</p>
      </div>
      <div className="edu-list">
        {profile.education.map((e, i) => (
          <div key={e.degree} className="jp-card edu-item" style={{ "--edu-i": i + 1 }}>
            <div className="edu-index mono">{String(i + 1).padStart(2, "0")}</div>
            <div>
              <h2 className="edu-degree disp">{e.degree}</h2>
              <div className="edu-school">{e.school}</div>
              <div className="edu-period mono">{e.period}</div>
              <p>{e.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- CONTACT ---------------- */
function ContactModule() {
  const { profile } = window.JP;
  const targets = [
    "Front-End Engineering",
    "Software Engineering",
    "Full-Stack Development",
    "Product Engineering",
  ];
  return (
    <div className="jp-mod contact">
      <div className="contact-hero">
        <div className="jp-eyebrow"><Icon name="mail" size={13} /> CONTACT.APP</div>
        <h1 className="contact-title disp">Let's build useful products.</h1>
        <p className="contact-sub">I am open to 2026 opportunities in:</p>
        <div className="contact-targets">
          {targets.map((t) => <span key={t} className="jp-chip">{t}</span>)}
        </div>
      </div>
      <div className="contact-grid">
        <a className="jp-card contact-link" href={"mailto:" + profile.contact.email}>
          <Icon name="mail" size={18} />
          <span>Email</span>
          <strong>{profile.contact.email}</strong>
        </a>
        <a className="jp-card contact-link" href={profile.contact.github} target="_blank" rel="noreferrer">
          <Icon name="github" size={18} />
          <span>GitHub</span>
          <strong>github.com/JinpengLiu-6</strong>
        </a>
        <a className="jp-card contact-link" href={profile.contact.linkedin} target="_blank" rel="noreferrer">
          <Icon name="linkedin" size={18} />
          <span>LinkedIn</span>
          <strong>in/jinpeng-liu</strong>
        </a>
        <div className="jp-card contact-link">
          <Icon name="pin" size={18} />
          <span>Location</span>
          <strong>{profile.status.location}</strong>
        </div>
        <div className="jp-card contact-link">
          <Icon name="dot" size={18} />
          <span>Phone</span>
          <strong>{profile.contact.phone}</strong>
        </div>
      </div>
    </div>
  );
}

window.JP_MODULES = window.JP_MODULES || {};
window.JP_MODULES.mission = MissionControl;
window.JP_MODULES.about = AboutModule;
window.JP_MODULES.resume = ResumeModule;
window.JP_MODULES.experience = ExperienceDB;
window.JP_MODULES.languages = LanguagesModule;
window.JP_MODULES.education = EducationModule;
window.JP_MODULES.contact = ContactModule;
