/* ============================================================
   Module: Skill Universe — interactive constellation
   ============================================================ */
const { useState: uSS, useMemo: uMS, useRef: uRS, useEffect: uES } = React;

const SKILL_W = 1000, SKILL_H = 720;

function computeLayout(skills, cats) {
  const catIds = Object.keys(cats);
  const anchorR = 215, center = { x: SKILL_W / 2, y: SKILL_H / 2 };
  const anchors = {};
  catIds.forEach((id, i) => {
    const a = (-90 + (360 / catIds.length) * i) * (Math.PI / 180);
    anchors[id] = { x: center.x + Math.cos(a) * anchorR, y: center.y + Math.sin(a) * anchorR, a };
  });
  const pos = {};
  catIds.forEach((cid) => {
    const group = skills.filter((s) => s.cat === cid);
    const an = anchors[cid];
    group.forEach((s, i) => {
      if (group.length === 1) { pos[s.id] = { x: an.x, y: an.y }; return; }
      const spread = 92;
      const ang = an.a + (i - (group.length - 1) / 2) * 0.62;
      const rr = spread * (0.5 + (i % 2) * 0.7);
      pos[s.id] = { x: an.x + Math.cos(ang + Math.PI / 2) * rr, y: an.y + Math.sin(ang + Math.PI / 2) * rr };
    });
  });
  return { pos, anchors, center };
}

function SkillUniverse() {
  const { skills, skillCats, projects, experience } = window.JP;
  const { pos } = uMS(() => computeLayout(skills, skillCats), [skills, skillCats]);
  const [sel, setSel] = uSS(null);
  const [hover, setHover] = uSS(null);

  const edges = uMS(() => {
    const list = [];
    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        const a = skills[i], b = skills[j];
        const shared = a.projects.filter((p) => b.projects.includes(p)).length
          + a.exp.filter((e) => b.exp.includes(e)).length;
        if (shared > 0 || a.cat === b.cat) list.push({ a: a.id, b: b.id, w: shared, same: a.cat === b.cat });
      }
    }
    return list;
  }, [skills]);

  const active = sel || hover;
  const isLit = (id) => {
    if (!active) return true;
    if (id === active) return true;
    return edges.some((e) => (e.a === active && e.b === id) || (e.b === active && e.a === id));
  };
  const cur = sel ? skills.find((s) => s.id === sel) : null;
  const catColor = (cid) => skillCats[cid].color;

  return (
    <div className="jp-mod su">
      <div className="su-head">
        <div className="jp-eyebrow"><Icon name="skills" size={13} /> SKILL UNIVERSE</div>
        <h1 className="jp-h1">Everything connects.</h1>
        <p className="jp-sub">Skills clustered by domain, linked where they meet in real work. Tap any node to trace its projects, experience and tooling.</p>
        <div className="su-legend">
          {Object.entries(skillCats).map(([id, c]) => (
            <span key={id} className="su-leg"><span className="su-leg-dot" style={{ background: c.color }} /> {c.name}</span>
          ))}
        </div>
      </div>

      <div className="su-stage" onClick={() => setSel(null)}>
        <svg className="su-svg" viewBox={`0 0 ${SKILL_W} ${SKILL_H}`} preserveAspectRatio="xMidYMid meet">
          {edges.map((e, i) => {
            const A = pos[e.a], B = pos[e.b];
            const lit = active && (e.a === active || e.b === active);
            return (
              <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke={lit ? "var(--ac-bright)" : "rgba(255,255,255,0.07)"}
                strokeWidth={lit ? 1.6 : (e.w ? 1 : 0.6)}
                opacity={active ? (lit ? 0.85 : 0.12) : (e.same ? 0.5 : 0.8)} />
            );
          })}
        </svg>
        <div className="su-nodes">
          {skills.map((s) => {
            const p = pos[s.id];
            const lit = isLit(s.id);
            const d = 46 + s.size * 34;
            return (
              <button key={s.id} className={"su-node" + (sel === s.id ? " sel" : "") + (lit ? "" : " dim")}
                style={{ left: (p.x / SKILL_W) * 100 + "%", top: (p.y / SKILL_H) * 100 + "%",
                  "--n-ac": catColor(s.cat), "--n-d": d + "px",
                  animationDelay: (s.id.length * 0.13) + "s" }}
                onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)}
                onClick={(e) => { e.stopPropagation(); setSel(sel === s.id ? null : s.id); }}>
                <span className="su-node-bub"><span className="su-node-name">{s.name}</span></span>
              </button>
            );
          })}
        </div>
        <div className="su-hint mono">{sel ? "" : "click a node"}</div>
      </div>

      <div className={"su-panel" + (cur ? " open" : "")}>
        {cur && (
          <div className="su-panel-in" key={cur.id}>
            <div className="su-p-head">
              <span className="su-p-cat jp-chip" style={{ borderColor: "var(--line-2)" }}>
                <span className="su-leg-dot" style={{ background: catColor(cur.cat) }} /> {skillCats[cur.cat].name}
              </span>
              <button className="su-p-x" onClick={() => setSel(null)}><Icon name="close" size={15} /></button>
            </div>
            <h2 className="su-p-name disp">{cur.name}</h2>
            <p className="su-p-blurb">{cur.blurb}</p>
            <div className="su-p-cols">
              {cur.projects.length > 0 && (
                <div className="su-p-col">
                  <div className="su-p-k mono">PROJECTS</div>
                  {cur.projects.map((pid) => {
                    const pr = projects.find((p) => p.id === pid);
                    return <div key={pid} className="su-p-tag">{pr ? pr.name : pid}</div>;
                  })}
                </div>
              )}
              {cur.exp.length > 0 && (
                <div className="su-p-col">
                  <div className="su-p-k mono">EXPERIENCE</div>
                  {cur.exp.map((eid) => {
                    const ex = experience.find((e) => e.id === eid);
                    return <div key={eid} className="su-p-tag">{ex ? ex.company : eid}</div>;
                  })}
                </div>
              )}
              {cur.tech.length > 0 && (
                <div className="su-p-col">
                  <div className="su-p-k mono">PAIRS WITH</div>
                  {cur.tech.map((t) => <div key={t} className="su-p-tag">{t}</div>)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.JP_MODULES = window.JP_MODULES || {};
window.JP_MODULES.skills = SkillUniverse;
