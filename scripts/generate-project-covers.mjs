import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const covers = [
  {
    id: "followjob",
    title: "FollowJob",
    eyebrow: "PERSONAL PRODUCT / 2026",
    subtitle: "Application Pipeline OS",
    note: "Track roles, follow-ups, notes, and hiring status",
    accent: "#16b87f",
    bright: "#3ee0a0",
    motif: "pipeline",
  },
  {
    id: "airbus",
    title: "ACS Notification Center",
    eyebrow: "ENTERPRISE UX / 2026",
    subtitle: "Airbus Workflow Redesign",
    note: "Contextual interviews, notification flows, and Figma prototypes",
    accent: "#54a8ff",
    bright: "#83c4ff",
    motif: "radar",
  },
  {
    id: "ai-quota",
    title: "QuotaClock",
    eyebrow: "AI TOOLING / 2025",
    subtitle: "Usage Visibility Deck",
    note: "A command-panel concept for AI limits and consumption",
    accent: "#16b87f",
    bright: "#3ee0a0",
    motif: "gauge",
  },
  {
    id: "dapp-feed",
    title: "DApp Social Feed",
    eyebrow: "WEB3 PROTOTYPE / 2025",
    subtitle: "Wallet-First Social Flow",
    note: "Decentralized identity, posting, and feed interactions",
    accent: "#54a8ff",
    bright: "#9ed0ff",
    motif: "nodes",
  },
  {
    id: "real-china",
    title: "Real China",
    eyebrow: "TRAVEL WEBSITE / 2022",
    subtitle: "Content & Visual System",
    note: "Early entrepreneurial web design for travel storytelling",
    accent: "#f6b34d",
    bright: "#ffd28a",
    motif: "route",
  },
  {
    id: "furever",
    title: "FurEver",
    eyebrow: "MOBILE PRODUCT / 2025",
    subtitle: "Pet Care Companion",
    note: "Tracking, safety zones, documents, reminders, and community",
    accent: "#3ecf8e",
    bright: "#76f2b8",
    motif: "pet",
  },
  {
    id: "sixyao",
    title: "SixYao Coin Toss",
    eyebrow: "LOCAL UTILITY / 2026",
    subtitle: "Private Hexagram Recorder",
    note: "Local-first toss records, history, statistics, and copy flow",
    accent: "#f36d25",
    bright: "#ff9d52",
    motif: "coins",
  },
  {
    id: "mindbug",
    title: "Mindbug Online",
    eyebrow: "REALTIME GAME / 2024",
    subtitle: "Card Game Client",
    note: "Vue, Spring Boot, WebSocket, and agile teamwork",
    accent: "#16b87f",
    bright: "#3ee0a0",
    motif: "cards",
  },
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function motif(name, color, bright) {
  if (name === "pipeline") {
    return `
      <g transform="translate(970 226)">
        <rect x="0" y="0" width="360" height="92" rx="22" class="panel"/>
        <rect x="0" y="150" width="360" height="92" rx="22" class="panel"/>
        <rect x="0" y="300" width="360" height="92" rx="22" class="panel"/>
        <path d="M64 92v58M64 242v58M312 92v58M312 242v58" class="line"/>
        <circle cx="64" cy="46" r="14" fill="${bright}"/>
        <circle cx="312" cy="196" r="14" fill="${color}"/>
        <circle cx="64" cy="346" r="14" fill="${bright}"/>
      </g>`;
  }
  if (name === "radar") {
    return `
      <g transform="translate(1005 205)">
        <circle cx="185" cy="185" r="172" class="panel"/>
        <circle cx="185" cy="185" r="112" class="thin"/>
        <circle cx="185" cy="185" r="52" class="thin"/>
        <path d="M185 185L316 76" class="beam"/>
        <circle cx="275" cy="108" r="12" fill="${bright}"/>
        <circle cx="111" cy="258" r="9" fill="${color}"/>
        <circle cx="214" cy="287" r="7" fill="${bright}"/>
      </g>`;
  }
  if (name === "gauge") {
    return `
      <g transform="translate(980 245)">
        <path d="M50 250a190 190 0 0 1 380 0" class="arc"/>
        <path d="M92 250a148 148 0 0 1 296 0" class="thin"/>
        <path d="M240 250L338 132" class="beam"/>
        <circle cx="240" cy="250" r="26" fill="${bright}"/>
        <rect x="74" y="314" width="332" height="76" rx="20" class="panel"/>
        <rect x="105" y="345" width="172" height="14" rx="7" fill="${color}" opacity=".78"/>
      </g>`;
  }
  if (name === "nodes") {
    return `
      <g transform="translate(990 205)">
        <path d="M90 98L250 62L372 172L314 334L128 318L58 186Z" class="line"/>
        <circle cx="90" cy="98" r="38" class="node"/>
        <circle cx="250" cy="62" r="30" class="node"/>
        <circle cx="372" cy="172" r="44" class="node"/>
        <circle cx="314" cy="334" r="34" class="node"/>
        <circle cx="128" cy="318" r="30" class="node"/>
        <circle cx="58" cy="186" r="26" class="node"/>
      </g>`;
  }
  if (name === "route") {
    return `
      <g transform="translate(982 220)">
        <path d="M62 318C128 120 266 448 398 114" class="route"/>
        <circle cx="62" cy="318" r="20" fill="${bright}"/>
        <circle cx="205" cy="244" r="14" fill="${color}"/>
        <circle cx="398" cy="114" r="26" fill="${bright}"/>
        <rect x="92" y="84" width="114" height="74" rx="18" class="panel"/>
        <rect x="256" y="284" width="136" height="78" rx="18" class="panel"/>
      </g>`;
  }
  if (name === "pet") {
    return `
      <g transform="translate(1010 220)">
        <circle cx="198" cy="220" r="76" fill="${color}" opacity=".22"/>
        <circle cx="132" cy="146" r="34" fill="${bright}" opacity=".86"/>
        <circle cx="200" cy="115" r="38" fill="${bright}" opacity=".74"/>
        <circle cx="268" cy="146" r="34" fill="${bright}" opacity=".86"/>
        <circle cx="106" cy="218" r="32" fill="${color}" opacity=".76"/>
        <circle cx="294" cy="218" r="32" fill="${color}" opacity=".76"/>
        <path d="M142 246c28-55 88-55 116 0 22 42-7 83-58 83s-80-41-58-83Z" fill="${bright}" opacity=".92"/>
      </g>`;
  }
  if (name === "coins") {
    return `
      <g transform="translate(982 185)">
        <circle cx="150" cy="110" r="74" class="coin"/>
        <circle cx="292" cy="160" r="74" class="coin"/>
        <circle cx="166" cy="292" r="74" class="coin"/>
        <text x="150" y="129" text-anchor="middle" class="coinText">6</text>
        <text x="292" y="179" text-anchor="middle" class="coinText">Y</text>
        <text x="166" y="311" text-anchor="middle" class="coinText">爻</text>
        <path d="M56 414h350" class="line"/>
      </g>`;
  }
  return `
    <g transform="translate(985 210)">
      <rect x="40" y="70" width="160" height="230" rx="22" class="card"/>
      <rect x="142" y="30" width="160" height="230" rx="22" class="card mid"/>
      <rect x="244" y="110" width="160" height="230" rx="22" class="card"/>
      <circle cx="222" cy="146" r="26" fill="${bright}"/>
      <path d="M96 356h300" class="line"/>
    </g>`;
}

function svg(config) {
  const { title, eyebrow, subtitle, note, accent, bright } = config;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="${esc(title)} project cover">
  <defs>
    <radialGradient id="glow" cx="72%" cy="30%" r="62%">
      <stop offset="0" stop-color="${bright}" stop-opacity=".28"/>
      <stop offset=".42" stop-color="${accent}" stop-opacity=".12"/>
      <stop offset="1" stop-color="#08090f" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#14151f"/>
      <stop offset=".54" stop-color="#0b1012"/>
      <stop offset="1" stop-color="#050608"/>
    </linearGradient>
    <pattern id="grid" width="54" height="54" patternUnits="userSpaceOnUse">
      <path d="M54 0H0v54" fill="none" stroke="rgba(255,255,255,.055)" stroke-width="1"/>
    </pattern>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="28" stdDeviation="28" flood-color="#000" flood-opacity=".46"/>
    </filter>
    <style>
      .bg{fill:url(#wash)}
      .grid{fill:url(#grid);opacity:.72}
      .panel,.card{fill:rgba(255,255,255,.052);stroke:rgba(255,255,255,.14);stroke-width:2;filter:url(#softShadow)}
      .thin{fill:none;stroke:rgba(255,255,255,.18);stroke-width:2}
      .line{fill:none;stroke:${accent};stroke-width:4;stroke-linecap:round;stroke-linejoin:round;opacity:.82}
      .beam{fill:none;stroke:${bright};stroke-width:7;stroke-linecap:round;opacity:.88}
      .arc{fill:none;stroke:${accent};stroke-width:24;stroke-linecap:round;opacity:.72}
      .route{fill:none;stroke:${bright};stroke-width:9;stroke-linecap:round;stroke-linejoin:round;opacity:.88}
      .node{fill:rgba(255,255,255,.06);stroke:${bright};stroke-width:3}
      .coin{fill:${accent};opacity:.9;filter:url(#softShadow)}
      .coinText{font:800 54px "Space Grotesk","Hanken Grotesk",Arial,sans-serif;fill:#fff}
      .mid{transform:translateY(-18px)}
      .eyebrow{font:700 26px "JetBrains Mono","SFMono-Regular",monospace;letter-spacing:7px;fill:${bright}}
      .title{font:800 94px "Space Grotesk","Hanken Grotesk",Arial,sans-serif;letter-spacing:-2px;fill:#f7f8ff}
      .subtitle{font:650 38px "Hanken Grotesk","Inter",Arial,sans-serif;fill:rgba(247,248,255,.78)}
      .note{font:500 24px "JetBrains Mono","SFMono-Regular",monospace;fill:rgba(247,248,255,.54)}
      .chipText{font:700 20px "JetBrains Mono","SFMono-Regular",monospace;letter-spacing:3px;fill:#06110d}
    </style>
  </defs>
  <rect class="bg" width="1600" height="900"/>
  <rect class="grid" width="1600" height="900"/>
  <rect width="1600" height="900" fill="url(#glow)"/>
  <circle cx="1325" cy="150" r="315" fill="${accent}" opacity=".12"/>
  <circle cx="1280" cy="690" r="220" fill="${bright}" opacity=".08"/>
  <g transform="translate(96 90)">
    <rect x="0" y="0" width="1408" height="720" rx="44" fill="rgba(255,255,255,.035)" stroke="rgba(255,255,255,.11)" stroke-width="2"/>
    <g transform="translate(52 48)">
      <circle cx="0" cy="0" r="12" fill="#ff5f57"/>
      <circle cx="34" cy="0" r="12" fill="#febc2e"/>
      <circle cx="68" cy="0" r="12" fill="#28c840"/>
    </g>
    <g transform="translate(70 190)">
      <text class="eyebrow">${esc(eyebrow)}</text>
      <text class="title" y="126">${esc(title)}</text>
      <text class="subtitle" y="194">${esc(subtitle)}</text>
      <text class="note" y="282">${esc(note)}</text>
      <g transform="translate(0 360)">
        <rect width="208" height="54" rx="27" fill="${bright}"/>
        <text class="chipText" x="104" y="35" text-anchor="middle">CASE STUDY</text>
      </g>
    </g>
    ${motif(config.motif, accent, bright)}
  </g>
</svg>
`;
}

for (const cover of covers) {
  const out = `public/projects/${cover.id}/cover-designed.svg`;
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, svg(cover));
  console.log(out);
}
