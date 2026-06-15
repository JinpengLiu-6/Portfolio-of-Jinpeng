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

function AssistantModule() {
  const t = window.JP_I18N ? window.JP_I18N.t : (key, fallback) => fallback || key;
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
        throw new Error("offline");
      }
      setMsgs((m) => [...m, { role: "assistant", text: (text || "").trim() || t("assistant.unsure", "I'm not sure about that one - best to ask Jinpeng directly at jp.liu87@gmail.com.") }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: "assistant", text: t("assistant.fallback", "I can't reach the live model right now, but here's what I can tell you: Jinpeng is an HCI-trained software engineer fluent across React/TypeScript frontends and Java/Python backends, available from 12 Sep 2026. Reach him at jp.liu87@gmail.com.") }]);
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
            <div className="ai-status"><span className="jp-mb-live" /> {t("assistant.status", "Live · powered by AI")}</div>
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
  const [lines, setLines] = uSA(() => [
    { t: "sys", c: tr("terminal.sys", "Jinpeng OS - Command Center  v1.0.0") },
    { t: "sys", c: tr("terminal.helpHint", "Type 'help' for a list of commands.") },
  ]);
  const [val, setVal] = uSA("");
  const [hist, setHist] = uSA([]);
  const [hi, setHi] = uSA(-1);
  const endRef = uRA(null);
  const inRef = uRA(null);

  uEA(() => { if (endRef.current) endRef.current.scrollTop = endRef.current.scrollHeight; }, [lines]);

  function out(arr) { setLines((l) => [...l, ...arr]); }

  function run(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    setHist((h) => [cmd, ...h]); setHi(-1);
    out([{ t: "in", c: cmd }]);
    const [c, ...args] = cmd.split(/\s+/);
    const a = args.join(" ");
    switch (c.toLowerCase()) {
      case "help": out([{ t: "out", c: "Available commands:" },
        { t: "kv", k: "whoami", v: "who is Jinpeng" },
        { t: "kv", k: "ls", v: "list modules" },
        { t: "kv", k: "open <module>", v: "launch a module (e.g. open projects)" },
        { t: "kv", k: "experience", v: "career history" },
        { t: "kv", k: "projects", v: "shipped products" },
        { t: "kv", k: "skills", v: "technical skills" },
        { t: "kv", k: "cat mission.txt", v: "product mission" },
        { t: "kv", k: "ls strengths/", v: "core strengths" },
        { t: "kv", k: "open current-focus.md", v: "current focus" },
        { t: "kv", k: "cat why-me.txt", v: "why Jinpeng" },
        { t: "kv", k: "contact", v: "how to reach him" },
        { t: "kv", k: "status", v: "availability" },
        { t: "kv", k: "clear", v: "clear the console" }]); break;
      case "whoami": out([{ t: "out", c: `${profile.name} - ${profile.role}` }, { t: "dim", c: profile.tagline }]); break;
      case "experience": case "exp": out(experience.map((e) => ({ t: "kv", k: e.company, v: e.title }))); break;
      case "projects": case "proj": out(projects.map((p) => ({ t: "kv", k: p.name, v: p.oneliner }))); break;
      case "skills": out([{ t: "out", c: skills.map((s) => s.name).join("  /  ") }]); break;
      case "cat": {
        if (a === "mission.txt") out([{ t: "out", c: terminal.mission }]);
        else if (a === "why-me.txt") out([{ t: "out", c: terminal.why }]);
        else out([{ t: "err", c: `file not found: ${a}` }]);
        break;
      }
      case "ls": {
        if (a === "strengths/" || a === "strengths") out(terminal.strengths.map((s) => ({ t: "out", c: s })));
        else out(modules.map((m) => ({ t: "kv", k: m.id, v: m.desc })));
        break;
      }
      case "open": {
        if (a === "current-focus.md") {
          out([{ t: "out", c: "Current focus:" }, ...terminal.focus.map((f) => ({ t: "out", c: `* ${f}` }))]);
          break;
        }
        const t = modules.find((m) => m.id === a.toLowerCase() || m.short.toLowerCase() === a.toLowerCase());
        if (t) { out([{ t: "ok", c: `launching ${t.name}...` }]); openModule(t.id); }
        else out([{ t: "err", c: `no module '${a}'. try: ${modules.map((m) => m.id).join(", ")}` }]);
        break; }
      case "contact": out([{ t: "kv", k: "email", v: profile.contact.email },
        { t: "kv", k: "phone", v: profile.contact.phone },
        { t: "kv", k: "github", v: profile.contact.github },
        { t: "kv", k: "linkedin", v: profile.contact.linkedin }]); break;
      case "status": out([{ t: "ok", c: `${profile.status.state} from 12 Sep 2026 - ${profile.status.location} - ${profile.status.relocation}` }]); break;
      case "clear": setLines([]); break;
      case "sudo": out([{ t: "dim", c: "nice try - Jinpeng has root, you have read access." }]); break;
      case "echo": out([{ t: "out", c: a }]); break;
      case "hello": case "hi": out([{ t: "ok", c: "hey there, recruiter - type 'whoami' or 'open projects'." }]); break;
      default: out([{ t: "err", c: `command not found: ${c}. type 'help'.` }]);
    }
  }

  function onKey(e) {
    if (e.key === "Enter") { run(val); setVal(""); }
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
          return <div key={i} className="term-out">{l.c}</div>;
        })}
        <div className="term-line live">
          <span className="term-prompt">jinpeng@os</span><span className="term-tilde">~</span><span className="term-arrow">❯</span>
          <input ref={inRef} className="term-input" value={val} autoFocus spellCheck="false"
            onChange={(e) => setVal(e.target.value)} onKeyDown={onKey} />
          <span className="term-caret" />
        </div>
      </div>
    </div>
  );
}

window.JP_MODULES = window.JP_MODULES || {};
window.JP_MODULES.assistant = AssistantModule;
window.JP_MODULES.console = ConsoleModule;
