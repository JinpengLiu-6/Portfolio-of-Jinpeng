/* ============================================================
   Jinpeng OS — Profile data model
   Single source of truth. Attached to window.JP.
   ============================================================ */
(function () {
  const profile = {
    name: "Jinpeng Liu",
    handle: "jinpeng",
    role: "Software Engineer · HCI",
    tagline: "Product-minded engineer bridging human-computer interaction and modern software.",
    status: {
      state: "Available",
      availableFrom: "2026-11-20",
      seeking: "Software Engineer roles",
      location: "Toulouse, France",
      relocation: "Open to relocation",
    },
    contact: {
      email: "jp.liu87@gmail.com",
      linkedin: "https://www.linkedin.com/in/jinpeng-liu-619249237/",
      github: "https://github.com/JinpengLiu-6",
    },
    education: [
      {
        degree: "M.Sc. — Human-Computer Interaction",
        school: "ENAC & Université Toulouse III",
        note: "Interaction design, user research, prototyping, cognitive ergonomics.",
      },
      {
        degree: "B.Sc. — Computer Science",
        school: "Université de Strasbourg",
        note: "Algorithms, systems, software engineering fundamentals.",
      },
    ],
    languages: [
      { name: "Chinese", level: "Native", code: "ZH" },
      { name: "English", level: "Professional", code: "EN" },
      { name: "French", level: "Professional", code: "FR" },
    ],
  };

  // ---- Experience (career timeline) ----
  const experience = [
    {
      id: "hxd",
      company: "HXD Expertise",
      title: "Frontend Developer & UX Designer",
      kind: "Design + Engineering",
      period: "Recent",
      summary:
        "Owned interface work end-to-end — from user research and wireframes to production frontend.",
      points: [
        "Translated user research into wireframes, prototypes and shipped UI.",
        "Built responsive, accessible frontends in close loop with design.",
        "Bridged the design↔engineering gap as a single fluent contributor.",
      ],
      stack: ["React", "TypeScript", "Figma", "UX Research"],
      accent: "var(--ac)",
    },
    {
      id: "bunsik",
      company: "Bunsik Dragon",
      title: "Full-Stack Developer & UI/UX Designer",
      kind: "Full-stack + Design",
      period: "—",
      summary:
        "Designed and built the product across the stack — interface, API, and data.",
      points: [
        "Shaped the product UI and the system behind it as one person.",
        "Delivered features from Figma mockups through to backend endpoints.",
        "Iterated quickly on real user feedback.",
      ],
      stack: ["Vue", "Spring Boot", "Java", "Figma"],
      accent: "var(--info)",
    },
    {
      id: "yosful",
      company: "YOSFUL",
      title: "Part-Time Full-Stack Developer",
      kind: "Startup collaboration",
      period: "—",
      summary:
        "Collaborated with an early-stage startup, contributing across frontend and backend.",
      points: [
        "Shipped features in a fast, ambiguous startup environment.",
        "Worked directly with founders to scope and prioritise.",
        "Balanced part-time delivery with study commitments.",
      ],
      stack: ["React", "FastAPI", "Python", "TypeScript"],
      accent: "var(--ok)",
    },
    {
      id: "jingneng",
      company: "Jingneng Info Tech",
      title: "Python Development Assistant",
      kind: "Backend / data",
      period: "Earlier",
      summary:
        "Supported Python development work — scripting, data handling, and tooling.",
      points: [
        "Built and maintained Python scripts and internal tooling.",
        "Handled data processing and automation tasks.",
        "First professional exposure to production codebases.",
      ],
      stack: ["Python", "Automation"],
      accent: "var(--warn)",
    },
  ];

  // ---- Projects (product case studies) ----
  const projects = [
    {
      id: "ai-quota",
      name: "AI Quota",
      kind: "Browser Extension",
      year: "2025",
      oneliner: "AI usage monitoring across every assistant you use.",
      accent: "var(--ac)",
      tags: ["TypeScript", "React", "Chrome MV3", "Vite"],
      hero: "ai-quota",
      links: [],
      problem:
        "Power users juggle several AI assistants at once — and have no unified sense of how much they're using, how close they are to plan limits, or what it costs. Usage is invisible until you suddenly hit a wall.",
      solution:
        "A privacy-first browser extension that quietly tracks AI usage across providers, visualises quota consumption in real time, and warns you before you run out — all processed locally, nothing leaves the device.",
      architecture: [
        { label: "Popup UI", desc: "React + TypeScript dashboard rendered in the extension popup." },
        { label: "Service worker", desc: "MV3 background worker aggregates usage events and manages quota state." },
        { label: "Content scripts", desc: "Lightweight observers per provider, no page interference." },
        { label: "Local store", desc: "All data stays on-device; sync only across the user's own browsers." },
      ],
      challenges: [
        "Tracking usage across heterogeneous providers without breaking their pages.",
        "Surviving the MV3 service-worker lifecycle (sleep / wake) without losing state.",
        "Detecting quota reset windows reliably across different billing models.",
      ],
      lessons:
        "Designing under a hard privacy constraint forces sharper engineering — every feature had to work with local-only data. Shipping a real Manifest V3 extension taught me the discipline of an ephemeral background context.",
      screens: ["Dashboard popup", "Quota timeline", "Provider breakdown"],
    },
    {
      id: "dapp-feed",
      name: "DApp Social Feed",
      kind: "Web3 Application",
      year: "2025",
      oneliner: "A social feed you actually own — wallet identity, IPFS content.",
      accent: "var(--info)",
      tags: ["React", "ethers.js", "Sepolia", "IPFS"],
      hero: "dapp",
      links: [],
      problem:
        "On centralised social platforms, your identity and your content belong to the platform. Accounts vanish, content is mutable, and there's no portable proof of authorship.",
      solution:
        "A decentralised social feed where you authenticate with your wallet, post content stored on IPFS, and anchor references on the Ethereum Sepolia testnet — verifiable authorship without a central server.",
      architecture: [
        { label: "Wallet auth", desc: "Sign-in-with-Ethereum; the wallet is the identity, no passwords." },
        { label: "Smart contract", desc: "Sepolia contract stores content hashes + authorship references." },
        { label: "IPFS layer", desc: "Post content pinned to IPFS; only the hash touches the chain." },
        { label: "React client", desc: "ethers.js bridges UI ↔ contract ↔ IPFS gateway." },
      ],
      challenges: [
        "Keeping gas costs sane — store hashes on-chain, never the content itself.",
        "Making wallet UX legible to non-crypto users.",
        "Smoothing IPFS retrieval latency with optimistic UI.",
      ],
      lessons:
        "Web3 is a constant negotiation between decentralisation and UX. I learned where the chain genuinely adds value (verifiable authorship) and where it just adds friction — and to put the user, not the ideology, first.",
      screens: ["Feed view", "Wallet connect", "Post composer"],
    },
    {
      id: "followjob",
      name: "FollowJob",
      kind: "iOS App",
      year: "2025",
      oneliner: "An AI-assisted job-application tracker that nudges you to follow up.",
      accent: "var(--ok)",
      tags: ["Swift", "SwiftUI", "FastAPI", "Python"],
      hero: "followjob",
      links: [],
      problem:
        "Job hunting means tracking dozens of applications scattered across emails and portals. People lose track of where they applied, what stage they're at, and when to follow up.",
      solution:
        "A native iOS app that centralises every application, uses AI to parse job descriptions and status emails, and proactively suggests the right follow-up at the right time.",
      architecture: [
        { label: "iOS client", desc: "SwiftUI app with local-first application tracking." },
        { label: "FastAPI backend", desc: "Python service handling parsing and AI orchestration." },
        { label: "AI parsing", desc: "Extracts structure from messy job posts and emails." },
        { label: "Notifications", desc: "Timed nudges for follow-ups and stage changes." },
      ],
      challenges: [
        "Parsing wildly unstructured emails into a reliable application state.",
        "Deciding what runs on-device vs. server for privacy and speed.",
        "Designing nudges that help without nagging.",
      ],
      lessons:
        "My first end-to-end native + AI product. I learned how much of 'AI features' is actually careful product design — the model is easy, the trustworthy UX around it is the real work.",
      screens: ["Application board", "AI follow-up", "Job detail"],
    },
    {
      id: "mystic",
      name: "Mystic Journey",
      kind: "Realtime Platform",
      year: "2024",
      oneliner: "A real-time multiplayer social-deduction platform.",
      accent: "var(--rose)",
      tags: ["React", "Spring Boot", "WebSocket", "Java"],
      hero: "mystic",
      links: [],
      problem:
        "Online social-deduction games (Mafia / Werewolf style) often feel clunky — fragile real-time state, awkward reconnection, and hidden-role leaks that ruin the game.",
      solution:
        "A polished real-time platform with rooms, secret roles, phase-based voting and chat — built on a robust server-authoritative state machine so the game never desyncs.",
      architecture: [
        { label: "React client", desc: "Phase-aware UI for night / day / voting stages." },
        { label: "Spring Boot server", desc: "Server-authoritative game engine in Java." },
        { label: "WebSocket layer", desc: "Low-latency sync for every player action." },
        { label: "State machine", desc: "Deterministic phase transitions, reconnection-safe." },
      ],
      challenges: [
        "Keeping every client in sync in real time, with graceful reconnection.",
        "Preventing hidden-role information leaks on the wire.",
        "Modelling the game as a clean, testable state machine.",
      ],
      lessons:
        "Real-time multiplayer is unforgiving — it taught me to treat the server as the single source of truth and to think in explicit state machines rather than scattered event handlers.",
      screens: ["Lobby", "Night phase", "Voting"],
    },
  ];

  // ---- Skills (constellation) ----
  // categories drive clustering & color
  const skillCats = {
    frontend: { name: "Frontend", color: "var(--ac)" },
    backend: { name: "Backend", color: "var(--info)" },
    ux: { name: "UX", color: "var(--ok)" },
    lang: { name: "Languages", color: "var(--warn)" },
    ai: { name: "AI", color: "var(--rose)" },
  };

  const skills = [
    { id: "react", name: "React", cat: "frontend", size: 1.0,
      blurb: "My primary frontend tool — component architecture, hooks, state.",
      projects: ["ai-quota", "dapp-feed", "mystic"], exp: ["hxd", "yosful"],
      tech: ["TypeScript", "Vite", "ethers.js"] },
    { id: "vue", name: "Vue", cat: "frontend", size: 0.8,
      blurb: "Reactive frontend framework used in full-stack product work.",
      projects: [], exp: ["bunsik"], tech: ["JavaScript"] },
    { id: "ts", name: "TypeScript", cat: "frontend", size: 0.95,
      blurb: "Type-safe JavaScript across every serious frontend I build.",
      projects: ["ai-quota", "dapp-feed"], exp: ["hxd", "yosful"], tech: ["React"] },
    { id: "spring", name: "Spring Boot", cat: "backend", size: 0.85,
      blurb: "Java backend framework — APIs, real-time servers, game engines.",
      projects: ["mystic"], exp: ["bunsik"], tech: ["Java", "WebSocket"] },
    { id: "fastapi", name: "FastAPI", cat: "backend", size: 0.85,
      blurb: "Fast Python backend for AI-powered services.",
      projects: ["followjob"], exp: ["yosful"], tech: ["Python"] },
    { id: "java", name: "Java", cat: "backend", size: 0.8,
      blurb: "Backend systems and server-authoritative real-time logic.",
      projects: ["mystic"], exp: ["bunsik"], tech: ["Spring Boot"] },
    { id: "python", name: "Python", cat: "backend", size: 0.9,
      blurb: "Backends, AI orchestration, automation and tooling.",
      projects: ["followjob"], exp: ["yosful", "jingneng"], tech: ["FastAPI"] },
    { id: "research", name: "User Research", cat: "ux", size: 0.9,
      blurb: "Turning observation and interviews into product decisions.",
      projects: [], exp: ["hxd", "bunsik"], tech: ["Interviews", "Synthesis"] },
    { id: "wireframe", name: "Wireframing", cat: "ux", size: 0.85,
      blurb: "Low-fidelity structure before pixels — fast, cheap iteration.",
      projects: [], exp: ["hxd", "bunsik"], tech: ["Figma"] },
    { id: "proto", name: "Prototyping", cat: "ux", size: 0.85,
      blurb: "Interactive prototypes to test flows before building.",
      projects: ["followjob"], exp: ["hxd"], tech: ["Figma"] },
    { id: "figma", name: "Figma", cat: "ux", size: 0.9,
      blurb: "My design canvas — wireframes through high-fidelity systems.",
      projects: [], exp: ["hxd", "bunsik"], tech: ["Prototyping"] },
    { id: "ai", name: "AI", cat: "ai", size: 0.9,
      blurb: "Integrating AI as a genuine product capability, not a gimmick.",
      projects: ["ai-quota", "followjob"], exp: [], tech: ["LLMs", "Parsing"] },
    { id: "zh", name: "Chinese", cat: "lang", size: 0.7,
      blurb: "Native fluency.", projects: [], exp: [], tech: [] },
    { id: "en", name: "English", cat: "lang", size: 0.7,
      blurb: "Professional working proficiency.", projects: [], exp: [], tech: [] },
    { id: "fr", name: "French", cat: "lang", size: 0.7,
      blurb: "Professional working proficiency.", projects: [], exp: [], tech: [] },
  ];

  // ---- Module registry (dock / launcher) ----
  const modules = [
    { id: "mission", name: "Mission Control", short: "Status", icon: "mission",
      desc: "Current status & overview", accent: "var(--ac)" },
    { id: "experience", name: "Experience Database", short: "Career", icon: "exp",
      desc: "Interactive career timeline", accent: "var(--info)" },
    { id: "projects", name: "Project Laboratory", short: "Work", icon: "lab",
      desc: "Product case studies", accent: "var(--ok)" },
    { id: "skills", name: "Skill Universe", short: "Skills", icon: "skills",
      desc: "Interactive skill constellation", accent: "var(--warn)" },
    { id: "assistant", name: "Recruiter Assistant", short: "Ask AI", icon: "ai",
      desc: "Ask anything about Jinpeng", accent: "var(--rose)" },
    { id: "console", name: "Developer Console", short: "Terminal", icon: "term",
      desc: "Terminal mode", accent: "var(--tx-1)" },
  ];

  window.JP = { profile, experience, projects, skills, skillCats, modules };
})();
