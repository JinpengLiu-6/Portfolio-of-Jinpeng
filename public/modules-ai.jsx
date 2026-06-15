/* ============================================================
   Modules: Recruiter AI Assistant + Developer Console
   ============================================================ */
const { useState: uSA, useEffect: uEA, useRef: uRA } = React;

/* ---- Build grounded context about Jinpeng ---- */
function buildContext() {
  const { profile, experience, projects, skills } = window.JP;
  const exp = experience.map((e) => `- ${e.company} - ${e.title} (${e.period}, ${e.location}; ${e.kind}). ${e.summary} Stack: ${e.stack.join(", ")}.`).join("\n");
  const prj = projects.map((p) => `- ${p.name} (${p.kind}, ${p.year}): ${p.oneliner} Tech: ${p.tags.join(", ")}. Problem: ${p.problem} Solution: ${p.solution}`).join("\n");
  const sk = skills.map((s) => s.name).join(", ");
  return `You are the Recruiter Assistant inside "Jinpeng OS", the interactive portfolio of Jinpeng Liu.
Answer questions from recruiters, hiring managers and founders about Jinpeng. Be warm, concise, confident and specific. Use 2-4 short sentences or tight bullet points. Never invent facts beyond what's given; if unknown, say so and point to contacting him. Speak about Jinpeng in third person.

PROFILE
Name: ${profile.name}
Role focus: ${profile.role}
Tagline: ${profile.tagline}
Core identity: ${profile.identity}
Status: ${profile.status.state}, available from 12 September 2026. Seeking ${profile.status.seeking}. Based in ${profile.status.location}. ${profile.status.relocation}.
Education: ${profile.education.map((e) => e.degree + " (" + e.school + ")").join("; ")}.
Languages: ${profile.languages.map((l) => `${l.name} / ${l.nativeName} (${l.level})`).join("; ")}.
Contact: ${profile.contact.email}, ${profile.contact.phone}, GitHub ${profile.contact.github}, LinkedIn ${profile.contact.linkedin}.

EXPERIENCE
${exp}

PROJECTS
${prj}

SKILLS: ${sk}`;
}

function localAssistantAnswer(question) {
  const { profile, experience, projects, skills } = window.JP;
  const lang = window.JP_LANG === "zh" ? "zh" : "en";
  const q = question.toLowerCase();
  const has = (...words) => words.some((w) => q.includes(w));
  const topProjects = projects.slice(0, 4).map((p) => p.name).join(", ");
  const frontSkills = skills.filter((s) => s.cat === "frontend").slice(0, 6).map((s) => s.name).join(", ");
  const backSkills = skills.filter((s) => s.cat === "backend").slice(0, 5).map((s) => s.name).join(", ");
  const latestExp = experience[0];

  if (lang === "zh") {
    if (has("available", "availability", "when", "date", "开始", "时间", "可用", "入职")) {
      return `${profile.name} ${profile.status.state}，可从 2026年9月12日开始。地点是${profile.status.location}，${profile.status.relocation}。求职方向是${profile.status.seeking}。`;
    }
    if (has("contact", "email", "linkedin", "github", "联系", "邮箱", "电话")) {
      return `可以通过邮箱 ${profile.contact.email} 联系他，也可以查看 GitHub：${profile.contact.github} 或 LinkedIn：${profile.contact.linkedin}。`;
    }
    if (has("frontend", "front-end", "react", "前端", "fit", "适合")) {
      return `适合。${profile.name} 的核心方向是${profile.role}，前端技术包括 ${frontSkills}。他的项目不是只做界面，而是把 UX、产品流程和实现连接起来，例如 FollowJob、Airbus ACS 和 AI Quota。`;
    }
    if (has("full-stack", "backend", "后端", "全栈", "spring", "java", "python")) {
      return `他有全栈经验：前端以 React/Vue 为主，后端接触 Java、Spring Boot、Python、FastAPI 和数据库。Bunsik 与 Mindbug 展示了前后端协作和完整应用开发经验。`;
    }
    if (has("product", "产品", "oriented", "why", "为什么")) {
      return `他的产品导向体现在：先理解真实问题，再设计流程和界面，最后实现可用版本。FollowJob 来自真实求职痛点，Airbus ACS 来自企业 UX 研究，HXD 实习则把复杂 Excel 流程转成 Web 工具。`;
    }
    if (has("ux", "hci", "design", "figma", "用户", "设计", "人机交互")) {
      return `HCI/UX 背景让他不只是实现需求，还会判断需求是否清晰、流程是否好用。Airbus ACS 项目里，他做过情境访谈、Figma 原型和企业 UX 建议，这些能力能直接帮助前端产品开发。`;
    }
    if (has("project", "work", "case", "portfolio", "项目", "作品", "案例")) {
      return `他的代表项目包括 ${topProjects}。这些项目覆盖个人产品、企业 UX、前端工具、移动产品概念和全栈实时应用，可以在 Project Laboratory 里打开查看完整案例。`;
    }
    if (has("experience", "intern", "经历", "实习", "工作")) {
      return `最近的经历是 ${latestExp.company} 的${latestExp.title}，主要做产品化前端和业务工具。除此之外，他还有 Bunsik 的全栈实习、Yosful 的后端/云协作，以及早期 Python 数据实习经验。`;
    }
    if (has("language", "语言", "english", "french", "中文", "法语", "英语")) {
      return `他可以在中文、英文和法语环境中工作。中文是母语，英语和法语都具备职业工作能力，法国本科和硕士经历也支持跨文化协作。`;
    }
    if (has("education", "school", "degree", "教育", "学校", "学历", "硕士", "本科")) {
      return `他的教育背景是计算机科学本科和人机交互硕士。硕士阶段来自图卢兹第三大学和法国国立民航大学，方向聚焦 HCI、UX 研究、原型和前端开发。`;
    }
    return `${profile.name} 是一名${profile.role}。他的优势是把 UX、产品判断和前端实现结合起来，能从真实问题出发做出清晰可用的产品。你也可以问我他的项目、技术栈、可用时间或联系方式。`;
  }

  if (has("available", "availability", "when", "date", "start")) {
    return `${profile.name} is ${profile.status.state} and available from 12 Sep 2026. He is based in ${profile.status.location}, ${profile.status.relocation.toLowerCase()}, and is seeking ${profile.status.seeking}.`;
  }
  if (has("contact", "email", "linkedin", "github", "phone")) {
    return `You can reach him at ${profile.contact.email}. His GitHub is ${profile.contact.github}, and LinkedIn is ${profile.contact.linkedin}.`;
  }
  if (has("frontend", "front-end", "react", "fit")) {
    return `Yes. ${profile.name}'s core focus is ${profile.role}, with frontend skills including ${frontSkills}. His projects connect UI implementation with UX and product flow, especially FollowJob, Airbus ACS, and AI Quota.`;
  }
  if (has("full-stack", "backend", "spring", "java", "python")) {
    return `He has full-stack exposure across React/Vue frontends and Java, Spring Boot, Python, FastAPI, and database work. Bunsik and Mindbug are good examples of his frontend-backend collaboration and application-building experience.`;
  }
  if (has("product", "oriented", "why")) {
    return `His product orientation comes from starting with real user or business problems, shaping the workflow, and then building the usable version. FollowJob, Airbus ACS, and the HXD simulator work all show that pattern clearly.`;
  }
  if (has("ux", "hci", "design", "figma", "user")) {
    return `His HCI/UX background helps him question whether a workflow is clear before he implements it. In the Airbus ACS project, he used interviews, Figma prototypes, and UX recommendations to turn research into interface decisions.`;
  }
  if (has("project", "work", "case", "portfolio")) {
    return `Representative projects include ${topProjects}. They cover personal products, enterprise UX, frontend tooling, mobile product concepts, and real-time full-stack work.`;
  }
  if (has("experience", "intern", "role", "work")) {
    return `His latest experience is ${latestExp.title} at ${latestExp.company}, focused on productized frontend and business tools. He also has full-stack, backend/cloud, and Python data internship experience.`;
  }
  if (has("language", "english", "french", "chinese")) {
    return `He works across Chinese, English, and French. Chinese is his native language, while English and French are professional working languages shaped by international education and daily life in France.`;
  }
  if (has("education", "school", "degree", "master", "bachelor")) {
    return `His background combines a Computer Science bachelor's degree with a master's degree in Human-Computer Interaction, focused on UX research, prototyping, usability, and frontend development.`;
  }
  return `${profile.name} is a ${profile.role}. His main strength is combining UX thinking, product judgment, and frontend implementation to turn complex workflows into clear digital products. You can ask me about his projects, stack, availability, or contact details.`;
}

function AssistantModule() {
  const t = window.JP_I18N ? window.JP_I18N.t : (key, fallback) => fallback || key;
  const hasLiveModel = !!(window.claude && window.claude.complete);
  const suggested = [
    t("assistant.suggest.0", "Is Jinpeng a good fit for a front-end role?"),
    t("assistant.suggest.1", "What makes him product-oriented?"),
    t("assistant.suggest.2", "Does he have full-stack experience?"),
    t("assistant.suggest.3", "When is he available, and where?"),
    t("assistant.suggest.4", "How does UX/HCI make him a better engineer?"),
  ];
  const [msgs, setMsgs] = uSA(() => [
    { role: "assistant", text: t("assistant.hello", "Hi - I'm Jinpeng's Recruiter Assistant. Ask me anything about his experience, projects, stack, or availability.") },
  ]);
  const [input, setInput] = uSA("");
  const [busy, setBusy] = uSA(false);
  const scrollRef = uRA(null);
  const ctx = uRA(buildContext());

  uEA(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, busy]);

  async function ask(q) {
    const question = (q ?? input).trim();
    if (!question || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: question }]);
    setBusy(true);
    try {
      const prompt = `${ctx.current}\n\nRecruiter question: ${question}\n\nAnswer:`;
      let text = "";
      if (window.claude && window.claude.complete) {
        text = await window.claude.complete(prompt);
      } else {
        text = localAssistantAnswer(question);
      }
      setMsgs((m) => [...m, { role: "assistant", text: (text || "").trim() || localAssistantAnswer(question) }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: "assistant", text: localAssistantAnswer(question) }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="jp-mod ai">
      <div className="ai-head">
        <div className="ai-head-id">
          <div className="ai-orb"><Icon name="ai" size={18} /></div>
          <div>
            <div className="ai-title disp">{t("assistant.title", "Recruiter Assistant")}</div>
            <div className="ai-status"><span className="jp-mb-live" /> {hasLiveModel ? t("assistant.status.live", "Live AI") : t("assistant.status.local", "Portfolio knowledge base")}</div>
          </div>
        </div>
      </div>

      <div className="ai-scroll" ref={scrollRef}>
        {msgs.map((m, i) => (
          <div key={i} className={"ai-msg " + m.role}>
            {m.role === "assistant" && <div className="ai-msg-av"><Icon name="ai" size={14} /></div>}
            <div className="ai-bubble">{m.text}</div>
          </div>
        ))}
        {busy && (
          <div className="ai-msg assistant">
            <div className="ai-msg-av"><Icon name="ai" size={14} /></div>
            <div className="ai-bubble ai-think"><span /><span /><span /></div>
          </div>
        )}
        {msgs.length <= 1 && !busy && (
          <div className="ai-suggest">
            {suggested.map((s) => (
              <button key={s} className="ai-sug" onClick={() => ask(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <div className="ai-input">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder={t("assistant.placeholder", "Ask about Jinpeng...")} disabled={busy} />
        <button className="ai-send" onClick={() => ask()} disabled={busy || !input.trim()}>
          <Icon name="send" size={16} />
        </button>
      </div>
    </div>
  );
}

/* ---------------- DEVELOPER CONSOLE ---------------- */
function ConsoleModule({ openModule }) {
  const { profile, experience, projects, skills, modules, terminal } = window.JP;
  const tr = window.JP_I18N ? window.JP_I18N.t : (key, fallback) => fallback || key;
  const moduleAliases = {
    ai: "assistant",
    ask: "assistant",
    assistant: "assistant",
    career: "experience",
    cv: "resume",
    resume: "resume",
    work: "projects",
    project: "projects",
    projects: "projects",
    skill: "skills",
    skills: "skills",
    lang: "languages",
    language: "languages",
    languages: "languages",
    terminal: "console",
    console: "console",
  };
  const [lines, setLines] = uSA(() => [
    { t: "sys", c: tr("terminal.sys", "Jinpeng OS - Command Center  v1.0.0") },
    { t: "sys", c: tr("terminal.helpHint", "Type 'help' for a list of commands.") },
  ]);
  const [val, setVal] = uSA("");
  const [hist, setHist] = uSA([]);
  const [hi, setHi] = uSA(-1);
  const [termBusy, setTermBusy] = uSA(false);
  const endRef = uRA(null);
  const inRef = uRA(null);
  const jobRef = uRA(0);

  uEA(() => { if (endRef.current) endRef.current.scrollTop = endRef.current.scrollHeight; }, [lines]);

  function findModule(name) {
    const key = name.toLowerCase();
    const alias = moduleAliases[key];
    return modules.find((m) => m.id === key || m.short.toLowerCase() === key || m.name.toLowerCase() === key || m.id === alias);
  }

  function commandResult(c, a) {
    switch (c.toLowerCase()) {
      case "help": return { lines: [{ t: "out", c: tr("terminal.helpTitle", "Available commands:") },
        { t: "kv", k: "whoami", v: tr("terminal.help.whoami", "who is Jinpeng") },
        { t: "kv", k: "ls", v: tr("terminal.help.ls", "list modules") },
        { t: "kv", k: "open <module>", v: tr("terminal.help.open", "launch a module, e.g. open projects or open ai") },
        { t: "kv", k: "experience", v: tr("terminal.help.experience", "career history") },
        { t: "kv", k: "projects", v: tr("terminal.help.projects", "product case studies") },
        { t: "kv", k: "skills", v: tr("terminal.help.skills", "technical skills") },
        { t: "kv", k: "cat mission.txt", v: tr("terminal.help.mission", "product mission") },
        { t: "kv", k: "ls strengths/", v: tr("terminal.help.strengths", "core strengths") },
        { t: "kv", k: "open current-focus.md", v: tr("terminal.help.focus", "current focus") },
        { t: "kv", k: "cat why-me.txt", v: tr("terminal.help.why", "why Jinpeng") },
        { t: "kv", k: "contact", v: tr("terminal.help.contact", "how to reach him") },
        { t: "kv", k: "status", v: tr("terminal.help.status", "availability") },
        { t: "kv", k: "clear", v: tr("terminal.help.clear", "clear the console") }] };
      case "whoami": return { lines: [
        { t: "out", c: `${profile.name} - ${profile.role}` },
        { t: "dim", c: profile.tagline },
        { t: "kv", k: tr("terminal.whoami.identity", "identity"), v: profile.identity },
        { t: "kv", k: tr("terminal.whoami.focus", "focus"), v: profile.resume.focus.slice(0, 3).join(" / ") },
        { t: "kv", k: tr("terminal.whoami.latest", "latest"), v: `${experience[0].title} @ ${experience[0].company}` },
        { t: "kv", k: tr("terminal.whoami.stack", "stack"), v: skills.slice(0, 8).map((s) => s.name).join(" / ") },
        { t: "kv", k: tr("terminal.whoami.available", "available"), v: `12 Sep 2026 · ${profile.status.location}` },
      ] };
      case "experience": case "exp": return { lines: experience.map((e) => ({ t: "kv", k: e.company, v: e.title })) };
      case "projects": case "proj": return { lines: projects.map((p) => ({ t: "kv", k: p.name, v: p.oneliner })) };
      case "skills": return { lines: [{ t: "out", c: skills.map((s) => s.name).join("  /  ") }] };
      case "cat": {
        if (a === "mission.txt") return { lines: [{ t: "out", c: terminal.mission }] };
        if (a === "why-me.txt") return { lines: [{ t: "out", c: terminal.why }] };
        return { lines: [{ t: "err", c: tr("terminal.notFound", "file not found:") + ` ${a}` }] };
      }
      case "ls": {
        if (a === "strengths/" || a === "strengths") return { lines: terminal.strengths.map((s) => ({ t: "out", c: s })) };
        return { lines: modules.map((m) => ({ t: "kv", k: m.id, v: m.desc })) };
      }
      case "open": {
        if (a === "current-focus.md") {
          return { lines: [{ t: "out", c: tr("terminal.focusTitle", "Current focus:") }, ...terminal.focus.map((f) => ({ t: "out", c: `* ${f}` }))] };
        }
        const target = findModule(a);
        if (target) return { lines: [{ t: "ok", c: `${tr("terminal.launching", "launching")} ${target.name}...` }], action: () => openModule(target.id) };
        return { lines: [{ t: "err", c: `${tr("terminal.noModule", "no module")} '${a}'. ${tr("terminal.try", "try:")} ${modules.map((m) => m.id).join(", ")}` }] };
      }
      case "contact": return { lines: [{ t: "kv", k: "email", v: profile.contact.email },
        { t: "kv", k: "phone", v: profile.contact.phone },
        { t: "kv", k: "github", v: profile.contact.github },
        { t: "kv", k: "linkedin", v: profile.contact.linkedin }] };
      case "status": return { lines: [{ t: "ok", c: `${profile.status.state} · ${tr("terminal.availableFrom", "available from")} 12 Sep 2026 · ${profile.status.location} · ${profile.status.relocation}` }] };
      case "clear": return { clear: true };
      case "sudo": return { lines: [{ t: "dim", c: tr("terminal.sudo", "Nice try. Jinpeng has root; recruiters get read access.") }] };
      case "echo": return { lines: [{ t: "out", c: a }] };
      case "hello": case "hi": return { lines: [{ t: "ok", c: tr("terminal.hello", "Hey there. Type 'whoami', 'open projects', or 'open ai'.") }] };
      default: return { lines: [{ t: "err", c: `${tr("terminal.commandNotFound", "command not found:")} ${c}. ${tr("terminal.typeHelp", "type 'help'.")}` }] };
    }
  }

  function run(raw) {
    const cmd = raw.trim();
    if (!cmd || termBusy) return false;
    const [c, ...args] = cmd.split(/\s+/);
    const a = args.join(" ");
    const thinkingId = ++jobRef.current;
    const result = commandResult(c, a);
    setHist((h) => [cmd, ...h]);
    setHi(-1);
    setTermBusy(true);
    setLines((l) => [...l, { t: "in", c: cmd }, { t: "thinking", id: thinkingId }]);
    window.setTimeout(() => {
      if (result.clear) {
        setLines([]);
      } else {
        setLines((l) => [...l.filter((line) => line.id !== thinkingId), ...(result.lines || [])]);
      }
      if (result.action) result.action();
      setTermBusy(false);
      window.setTimeout(() => inRef.current && inRef.current.focus(), 0);
    }, 420 + Math.random() * 220);
    return true;
  }

  function onKey(e) {
    if (e.key === "Enter") { if (run(val)) setVal(""); }
    else if (e.key === "ArrowUp") { e.preventDefault(); const n = Math.min(hi + 1, hist.length - 1); if (n >= 0) { setHi(n); setVal(hist[n]); } }
    else if (e.key === "ArrowDown") { e.preventDefault(); const n = hi - 1; if (n < 0) { setHi(-1); setVal(""); } else { setHi(n); setVal(hist[n]); } }
  }

  return (
    <div className="jp-mod term" onClick={() => inRef.current && inRef.current.focus()}>
      <div className="term-scroll" ref={endRef}>
        {lines.map((l, i) => {
          if (l.t === "in") return <div key={i} className="term-line"><span className="term-prompt">jinpeng@os</span><span className="term-tilde">~</span><span className="term-arrow">❯</span> {l.c}</div>;
          if (l.t === "kv") return <div key={i} className="term-kv"><span className="term-k">{l.k}</span><span className="term-v">{l.v}</span></div>;
          if (l.t === "err") return <div key={i} className="term-out err">{l.c}</div>;
          if (l.t === "ok") return <div key={i} className="term-out ok">{l.c}</div>;
          if (l.t === "dim") return <div key={i} className="term-out dim">{l.c}</div>;
          if (l.t === "sys") return <div key={i} className="term-out sys">{l.c}</div>;
          if (l.t === "thinking") return <div key={l.id} className="term-out thinking"><span /><span /><span /></div>;
          return <div key={i} className="term-out">{l.c}</div>;
        })}
        <div className="term-line live">
          <span className="term-prompt">jinpeng@os</span><span className="term-tilde">~</span><span className="term-arrow">❯</span>
          <input ref={inRef} className="term-input" value={val} autoFocus spellCheck="false"
            readOnly={termBusy} onChange={(e) => setVal(e.target.value)} onKeyDown={onKey} />
          <span className="term-caret" />
        </div>
      </div>
    </div>
  );
}

window.JP_MODULES = window.JP_MODULES || {};
window.JP_MODULES.assistant = AssistantModule;
window.JP_MODULES.console = ConsoleModule;
