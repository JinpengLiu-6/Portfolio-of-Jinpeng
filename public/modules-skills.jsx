/* ============================================================
   Module: Skill Stack - grouped master/detail layout
   ============================================================ */
const { useState: uSS, useMemo: uMS } = React;

function SkillStack() {
  const { skills, skillCats, projects, experience } = window.JP;
  const t = window.JP_I18N ? window.JP_I18N.t : (key, fallback) => fallback || key;
  const [sel, setSel] = uSS(skills[0]?.id);
  const cur = skills.find((s) => s.id === sel) || skills[0];
  const curCat = skillCats[cur.cat];

  const groups = uMS(() => {
    return Object.entries(skillCats).map(([id, cat]) => ({
      id,
      ...cat,
      skills: skills.filter((s) => s.cat === id),
    }));
  }, [skills, skillCats]);

  const projectNames = cur.projects.map((pid) => projects.find((p) => p.id === pid)?.name || pid);
  const expNames = cur.exp.map((eid) => experience.find((e) => e.id === eid)?.company || eid);
  const MotionDiv = window.Motion && window.Motion.motion && window.Motion.motion.div;
  const DetailWrapper = MotionDiv || "div";
  const detailProps = MotionDiv
    ? {
        key: cur.id,
        className: "ss-detail-in",
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.22, ease: "easeOut" },
      }
    : { key: cur.id, className: "ss-detail-in" };

  return (
    <div className="jp-mod ss">
      <div className="ss-head">
        <div className="jp-eyebrow"><Icon name="skills" size={13} /> {t("skills.eyebrow", "SKILL STACK")}</div>
        <h1 className="jp-h1">{t("skills.title", "The stack.")}</h1>
        <p className="jp-sub">{t("skills.subtitle", "A cleaner scan of the tools, product skills, and AI workflows Jinpeng uses to turn ideas into working products.")}</p>
      </div>

      <div className="ss-shell">
        <aside className="ss-master">
          {groups.map((group) => (
            <section key={group.id} className="ss-group" style={{ "--cat": group.color }}>
              <div className="ss-group-head">
                <span className="ss-dot" />
                <span>{group.name.toUpperCase()}</span>
                <span className="ss-count mono">{group.skills.length}</span>
              </div>
              <div className="ss-tiles">
                {group.skills.map((skill) => (
                  <button
                    key={skill.id}
                    className={"ss-tile" + (cur.id === skill.id ? " active" : "")}
                    style={{ "--cat": group.color }}
                    onClick={() => setSel(skill.id)}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </aside>

        <section className="ss-detail" style={{ "--cat": curCat.color }}>
          <DetailWrapper {...detailProps}>
            <div className="ss-badge">
              <span className="ss-dot" />
              {curCat.name}
            </div>
            <h2 className="ss-name disp">{cur.name}</h2>
            <p className="ss-blurb">{cur.blurb}</p>

            <DetailRow
              label={t("skills.used", "USED IN")}
              values={projectNames.length ? projectNames : [t("skills.cross", "Cross-cutting - applied across work rather than one project.")]}
              tone="accent"
            />
            <DetailRow
              label={t("skills.proven", "PROVEN AT")}
              values={expNames.length ? expNames : [t("skills.self", "Self-driven / personal projects.")]}
              tone="solid"
            />
            <DetailRow label={t("skills.pairs", "PAIRS WITH")} values={cur.tech.length ? cur.tech : [t("skills.judgment", "Product judgment")]} tone="ghost" />
          </DetailWrapper>
        </section>
      </div>
    </div>
  );
}

function DetailRow({ label, values, tone }) {
  return (
    <div className="ss-row">
      <div className="ss-row-k mono">{label}</div>
      <div className="ss-pills">
        {values.map((v) => <span key={v} className={"ss-pill " + tone}>{v}</span>)}
      </div>
    </div>
  );
}

window.JP_MODULES = window.JP_MODULES || {};
window.JP_MODULES.skills = SkillStack;
