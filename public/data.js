/* ============================================================
   Jinpeng OS - Profile data model
   Single source of truth. Attached to window.JP.
   ============================================================ */
(function () {
  const profile = {
    name: "Jinpeng Liu",
    handle: "jinpeng",
    role: "Product-Oriented Front-End Engineer",
    avatar: "/jinpeng-portrait.png",
    tagline: "Product-minded front-end engineer who turns complex problems into clear, usable digital products.",
    identity:
      "Not just a developer. A product-minded engineer who can understand users, design solutions, and build them into working products.",
    status: {
      state: "Open to 2026 opportunities",
      availableFrom: "2026-09-12",
      seeking: "Front-End Engineering, Software Engineering, Full-Stack Development, and Product Engineering roles",
      location: "Paris, France",
      relocation: "Open to relocation",
    },
    contact: {
      email: "jp.liu87@gmail.com",
      phone: "+33 (0)6 67 36 88 17",
      linkedin: "https://www.linkedin.com/in/jinpeng-liu-619249237/",
      github: "https://github.com/JinpengLiu-6",
    },
    about: {
      title: "About Jinpeng",
      short:
        "Product-minded front-end engineer who turns complex problems into clear, usable digital products.",
      paragraphs: [
        "I am a product-oriented Front-End Engineer with a background in Computer Science and Human-Computer Interaction.",
        "My strength is not only writing code, but understanding why a product should exist, who it serves, and how to make it easier to use. Through my projects and internships, I have worked across front-end development, full-stack development, UX research, UI design, automation, and product thinking.",
        "I enjoy building products that solve real problems. I like transforming complex workflows into intuitive digital experiences, especially when I can see the final product being used by real people.",
        "My current focus is front-end engineering, especially React-based product development. In the long term, I want to grow toward product engineering and product management, where I can connect users, business needs, and technical teams.",
      ],
      tags: [
        "Frontend-focused",
        "Product-minded",
        "UX-aware",
        "Problem solver",
        "AI-assisted builder",
        "Multicultural background",
        "Builder of useful products",
      ],
    },
    resume: {
      title: "Resume Preview",
      summary:
        "Product-Oriented Front-End Engineer with experience in UX/UI design and full-stack development.",
      body:
        "I have built production-ready web applications, redesigned enterprise interfaces, automated internal workflows, and created personal products from real user pain points.",
      focus: [
        "Front-End Engineering",
        "Product Engineering",
        "Full-Stack Web Development",
        "UX/UI-Driven Product Development",
      ],
      strength:
        "I can understand a problem from both the user side and the developer side, then propose practical solutions and implement them.",
      quickSummary: [
        { k: "Frontend", v: "React, Vue.js, JavaScript, TypeScript" },
        { k: "Backend", v: "Java, Spring Boot, Python, FastAPI" },
        { k: "Design", v: "Figma, UX Research, UI Design, Prototyping" },
        { k: "Tools", v: "Git, Docker, Jira, AI-assisted development" },
      ],
      downloadLabel: "Download CV",
    },
    education: [
      {
        degree: "Master's Degree in Human-Computer Interaction",
        school: "Universite Toulouse III - Paul Sabatier & ENAC",
        period: "2024 - 2026",
        note: "Dual degree focused on Human-Computer Interaction, UX research, user-centered design, prototyping, usability evaluation, and front-end development.",
      },
      {
        degree: "Bachelor's Degree in Computer Science",
        school: "Universite de Strasbourg",
        period: "2019 - 2024",
        note: "Computer science fundamentals, software development, web development, databases, algorithms, and programming.",
      },
      {
        degree: "A-Level & IGCSE",
        school: "El Kalimat School, Algeria",
        period: "2015 - 2019",
        note: "International academic background in a multicultural, English-based education environment.",
      },
    ],
    languages: [
      {
        code: "ZH",
        name: "Chinese",
        nativeName: "中文",
        level: "Native",
        blurb: "My mother tongue - complete fluency across speaking, reading and writing.",
        contexts: ["Native speaker", "Family & culture", "Reading / writing"],
      },
      {
        code: "EN",
        name: "English",
        nativeName: "English",
        level: "Professional",
        blurb:
          "The language I build, document and collaborate in - technical reading and writing, and day-to-day work with international teams.",
        contexts: ["Technical writing", "Documentation", "Global teams"],
      },
      {
        code: "FR",
        name: "French",
        nativeName: "Français",
        level: "Professional",
        blurb:
          "Studied and lived in France through both degrees - Strasbourg, then Toulouse - with daily academic and professional use.",
        contexts: ["Academic", "Professional", "Daily life"],
      },
    ],
  };

  const experience = [
    {
      id: "hxd",
      company: "HXD Expertise",
      title: "Front-End Developer Intern",
      kind: "Product + Frontend",
      period: "Apr 2026 - Sep 2026",
      location: "Paris, France",
      summary:
        "Designed and developed a production-ready business profitability simulator for entrepreneurs, transforming a complex Excel-based financial analysis process into an intuitive web application.",
      points: [
        "Conducted contextual interviews with users who had used the original Excel workflow.",
        "Designed multiple UX/UI iterations to simplify a complex financial process.",
        "Developed the front-end interface, including the landing page, multi-step form workflow, and results presentation.",
        "Collaborated with the backend developer on API integration and data flow.",
        "Helped turn a manual 2-3 hour analysis process into a 5-10 minute digital workflow.",
        "Built a Python automation tool converting Skello attendance exports into Silae-compatible payroll templates.",
        "Reduced payroll processing time from around 3 hours to 10 minutes per company.",
      ],
      impact:
        "Created a new digital business tool for the company and improved internal operational efficiency.",
      stack: [
        "React",
        "UX/UI",
        "Product Thinking",
        "Business Workflow",
        "Python Automation",
        "API Integration",
        "HubSpot",
      ],
      accent: "var(--ac)",
    },
    {
      id: "bunsik",
      company: "Bunsik Dragon",
      title: "Full-Stack Developer Intern",
      kind: "Full-stack Product",
      period: "May 2025 - Aug 2025",
      location: "Strasbourg, France",
      summary:
        "Independently designed and developed a full-stack restaurant website using Vue.js, Spring Boot, and MySQL, including customer-facing pages and an admin dashboard.",
      points: [
        "Designed and developed the website interface.",
        "Built Home, Menu, Contact, and Reservation pages.",
        "Created a responsive and multilingual experience.",
        "Developed an admin dashboard with CRUD menu management.",
        "Implemented dish image upload.",
        "Built a reservation workflow that sends customer booking requests to the administrator by email.",
        "Managed the full development process from UI/UX design to backend implementation and testing.",
      ],
      stack: [
        "Vue.js",
        "Spring Boot",
        "MySQL",
        "Full-Stack Development",
        "Admin Dashboard",
        "Responsive Design",
        "Multilingual Website",
      ],
      accent: "var(--info)",
    },
    {
      id: "yosful",
      company: "Yosful",
      title: "Back-End & Cloud Developer",
      kind: "Entrepreneurial Project",
      period: "Jul 2022 - Dec 2022",
      location: "Strasbourg, France",
      summary:
        "Collaborated on an early-stage entrepreneurial web project within a four-person team, focusing on backend collaboration, cloud deployment, CI/CD workflow, and AWS environment configuration.",
      points: [
        "Worked in a team composed of two front-end developers and two back-end developers.",
        "Supported cloud deployment and CI/CD setup.",
        "Helped connect backend services with frontend requirements.",
        "Collaborated in a startup-like environment to translate business needs into technical solutions.",
      ],
      stack: ["AWS", "Cloud Deployment", "CI/CD", "Backend Collaboration", "Entrepreneurial Project"],
      accent: "var(--ok)",
    },
    {
      id: "jingneng",
      company: "Jingneng Info Tech",
      title: "Python Development Assistant Intern",
      kind: "Backend / Data",
      period: "Aug 2020 - Oct 2020",
      location: "Beijing, China",
      summary:
        "Completed my first development internship during my academic gap period, working mainly on web scraping and data extraction.",
      points: [
        "Developed Python scripts to collect data from targeted websites.",
        "Cleaned and organized extracted data.",
        "Collaborated with the development team to troubleshoot scraping issues.",
        "Improved data collection accuracy.",
      ],
      stack: ["Python", "Web Scraping", "Data Extraction", "Early Development Experience"],
      accent: "var(--warn)",
    },
  ];

  const projects = [
    {
          id: "followjob",
          name: "FollowJob",
          kind: "Personal Product",
          year: "2026",
          oneliner:
            "A job application tracking product built from a real personal pain point.",
          accent: "var(--ok)",
          tags: ["Product Design", "Frontend", "Job Search", "UX Flow", "MVP Thinking"],
          hero: "followjob",
          images: [
            { src: "/projects/followjob/cover.png", label: "FollowJob cover" },
            { src: "/projects/followjob/status.png", label: "Application status flow" },
            { src: "/projects/followjob/detail.png", label: "Application detail" },
            { src: "/projects/followjob/notes.png", label: "Follow-up notes" },
            { src: "/projects/followjob/settings.png", label: "Tracking settings" },
          ],
          problem:
            "When applying to many jobs, it becomes difficult to remember which company called, which position was discussed, what the application status is, and what the next step should be.",
          solution:
            "A structured application tracking product that helps users manage company names, job titles, statuses, notes, follow-ups, and recruitment progress.",
          architecture: [
            { label: "Pain point", desc: "Started from spreadsheet overload during real job-search tracking." },
            { label: "Product flow", desc: "Defined statuses, notes, reminders, and follow-up checkpoints." },
            { label: "Frontend", desc: "Designed a clear interface for scanning applications and next actions." },
            { label: "MVP thinking", desc: "Focused on practical workflows before adding complexity." },
          ],
          challenges: [
            "Turning a messy personal workflow into a structured product model.",
            "Making application status and follow-up actions easy to scan.",
            "Balancing useful reminders with a calm user experience.",
          ],
          lessons:
            "FollowJob shows that Jinpeng can identify a real user pain point, define a product concept, design the user flow, and turn the idea into a practical product.",
          screens: ["Application tracker", "Status pipeline", "Follow-up notes"],
        },
    {
          id: "airbus",
          name: "Airbus ACS Notification Center",
          kind: "Academic UX/Product Project",
          year: "2026",
          oneliner:
            "A 6-month enterprise UX redesign project for the ACS notification center.",
          accent: "var(--info)",
          tags: ["Airbus", "UX Research", "Figma", "Enterprise UX", "Contextual Interviews"],
          hero: "airbus",
          images: [
            { src: "/projects/airbus/cover.png", label: "Airbus ACS cover" },
            { src: "/projects/airbus/dashboard.png", label: "Notification dashboard" },
            { src: "/projects/airbus/dashboard-2.png", label: "Dashboard state" },
            { src: "/projects/airbus/cr-detail.png", label: "Notification detail" },
            { src: "/projects/airbus/team-settings.png", label: "Team settings" },
          ],
          problem:
            "Different Airbus organizations use notifications in different workflows, creating usability and prioritization challenges inside the existing ACS notification experience.",
          solution:
            "A redesigned notification center informed by contextual interviews, stakeholder needs, usability analysis, interactive Figma prototypes, UX recommendations, and a user guide.",
          architecture: [
            { label: "Research", desc: "Interviewed Engineering, Manufacturing, Program Management, and Customer Services stakeholders." },
            { label: "Synthesis", desc: "Collected and analyzed user needs across enterprise contexts." },
            { label: "Prototype", desc: "Designed interactive Figma prototypes for improved notification workflows." },
            { label: "Delivery", desc: "Delivered UX recommendations and a user guide." },
          ],
          challenges: [
            "Understanding notification needs across different Airbus organizations.",
            "Translating stakeholder interviews into concrete interface improvements.",
            "Balancing enterprise workflow complexity with usability.",
          ],
          lessons:
            "This project shows that Jinpeng can work on a real enterprise product, communicate with different stakeholder groups, and translate user research into interface improvements.",
          screens: ["Notification center", "Figma prototype", "User guide"],
        },
    {
          id: "sixyao",
          name: "SixYao Coin Toss",
          kind: "Local Utility Tool",
          year: "2026",
          oneliner:
            "A privacy-first local tool for simulating six-yao coin toss records across macOS and iPhone.",
          accent: "var(--warn)",
          tags: ["Local-First", "Mobile UX", "Chinese Interface", "Utility Tool", "Cross-Device"],
          hero: "sixyao",
          images: [
            { src: "/projects/sixyao/cover.png", label: "SixYao cover" },
            { src: "/projects/sixyao/reading.png", label: "Coin toss recording" },
            { src: "/projects/sixyao/result.png", label: "Saved reading result" },
          ],
          problem:
            "Manual six-yao coin toss records are easy to lose, difficult to review, and often mix the act of recording with interpretation.",
          solution:
            "A local-first utility that simulates coin toss input, records each yao step by step, automatically archives history, and supports one-click copy without sending data to a remote service.",
          architecture: [
            { label: "Local-first model", desc: "Keeps records on the device instead of relying on remote storage." },
            { label: "Step flow", desc: "Guides users from the first toss to the sixth yao with clear progress feedback." },
            { label: "History", desc: "Archives complete readings for later review." },
            { label: "Cross-device", desc: "Designed for macOS and iPhone usage patterns." },
          ],
          challenges: [
            "Turning a traditional recording process into a simple digital workflow.",
            "Keeping the interface focused on recording and statistics rather than over-explaining interpretation.",
            "Supporting Chinese-language utility UX with clear progress and history states.",
          ],
          lessons:
            "SixYao shows the ability to turn a niche personal workflow into a focused local tool with privacy, history, and cross-device usability in mind.",
          screens: ["Intro screen", "Recording flow", "History result"],
        },
    {
          id: "ai-quota",
          name: "AI Quota / QuotaClock",
          kind: "Browser Extension / AI Tooling",
          year: "2025",
          oneliner:
            "A browser extension concept for monitoring AI tool usage and quota consumption.",
          accent: "var(--ac)",
          tags: ["Chrome Extension", "AI Tools", "Quota Tracking", "Developer Experience", "UI Design"],
          hero: "ai-quota",
          images: [
            { src: "/projects/ai-quota/cover.png", label: "QuotaClock cover" },
            { src: "/projects/ai-quota/meter.png", label: "Usage meter" },
            { src: "/projects/ai-quota/provider.png", label: "Provider breakdown" },
          ],
          problem:
            "As AI coding and productivity tools become part of daily work, users need a clearer way to understand limits, usage, and remaining capacity.",
          solution:
            "A sci-fi inspired usage tracking interface that explores Chrome Extension development, dynamic UI concepts, and real-time quota visualization.",
          architecture: [
            { label: "Extension UI", desc: "Designed a focused interface for quota and usage visibility." },
            { label: "Usage model", desc: "Explored how quota states could be represented clearly." },
            { label: "Dynamic visuals", desc: "Built visual concepts for real-time consumption feedback." },
            { label: "AI workflow", desc: "Used AI-assisted development to accelerate implementation." },
          ],
          challenges: [
            "Making AI quota information visually legible.",
            "Exploring Chrome Extension constraints.",
            "Designing a developer-focused product with a strong visual identity.",
          ],
          lessons:
            "AI Quota shows Jinpeng's interest in the AI tooling ecosystem and his ability to design developer-focused products with a strong interface identity.",
          screens: ["Quota dashboard", "Usage meter", "Provider breakdown"],
        },
    {
          id: "dapp-feed",
          name: "DApp Social Feed",
          kind: "Archive Experiment",
          year: "2025",
          oneliner:
            "A Web3 social prototype exploring decentralized interaction and wallet onboarding.",
          accent: "var(--info)",
          tags: ["Web3", "DApp", "Wallet Connection", "Social Product", "Frontend Experiment"],
          hero: "dapp",
          images: [
            { src: "/projects/dapp-feed/cover.png", label: "DApp Social Feed cover" },
            { src: "/projects/dapp-feed/feed.png", label: "Social feed" },
            { src: "/projects/dapp-feed/profile.png", label: "Profile view" },
            { src: "/projects/dapp-feed/create.png", label: "Post creation" },
            { src: "/projects/dapp-feed/mobile.png", label: "Mobile layout" },
          ],
          problem:
            "Web3 social products often create friction at the onboarding step, especially around wallet connection and identity.",
          solution:
            "A prototype exploring decentralized social interaction, wallet connection, and Web3 onboarding experience.",
          architecture: [
            { label: "Wallet", desc: "Explored wallet connection as the entry point." },
            { label: "Social flow", desc: "Modeled feed-style interaction for a decentralized product." },
            { label: "Frontend", desc: "Focused on interaction clarity and onboarding." },
          ],
          challenges: [
            "Making wallet-based onboarding easier to understand.",
            "Exploring social-product patterns in a decentralized context.",
          ],
          lessons:
            "This archive project shows curiosity around emerging product categories and the ability to test new interaction models.",
          screens: ["Wallet connect", "Social feed", "Post flow"],
        },
    {
          id: "furever",
          name: "FurEver",
          kind: "Mobile Product Concept",
          year: "2025",
          oneliner:
            "A pet-care mobile product concept for tracking, safety, health documents, and owner community.",
          accent: "var(--ok)",
          tags: ["Mobile UX", "Pet Care", "Figma", "Product Concept", "Community"],
          hero: "furever",
          images: [
            { src: "/projects/furever/cover.png", label: "FurEver cover" },
            { src: "/projects/furever/home.png", label: "Pet home dashboard" },
            { src: "/projects/furever/pet-id.png", label: "Pet identity record" },
            { src: "/projects/furever/safety.png", label: "Safety and location flow" },
          ],
          problem:
            "Pet owners often split safety tracking, health documents, reminders, and community sharing across different tools, making daily pet care harder to manage.",
          solution:
            "A mobile product concept that brings pet location, safety zones, vaccination reminders, health records, and social sharing into one warm companion experience.",
          architecture: [
            { label: "Concept", desc: "Defined a pet-care platform around safety, documents, reminders, and community." },
            { label: "Mobile flow", desc: "Designed app screens for onboarding, pet identity, home status, and key actions." },
            { label: "Visual system", desc: "Used a soft, friendly interface direction to match the emotional relationship between owners and pets." },
            { label: "Prototype", desc: "Prepared the product direction and screens as a Figma-led mobile concept." },
          ],
          challenges: [
            "Combining emotional pet-owner needs with practical tracking and document workflows.",
            "Designing a friendly product without losing clarity around safety and health information.",
            "Structuring multiple features into a simple mobile information architecture.",
          ],
          lessons:
            "FurEver shows product thinking beyond pure implementation: identifying a lifestyle need, structuring features, and shaping a mobile experience around trust, care, and daily use.",
          screens: ["Landing", "Home dashboard", "Pet identity", "Safety flow"],
        },
    {
          id: "mystic",
          name: "Mystic Journey",
          kind: "Original Game Project",
          year: "2024",
          oneliner:
            "An original game project designed from concept to implementation.",
          accent: "var(--rose)",
          tags: ["Game Design", "UX Design", "Frontend", "Product Creation", "Interaction Design"],
          hero: "mystic",
          images: [
            { src: "/projects/mystic/cover.png", label: "Game cover" },
            { src: "/projects/mystic/gameplay.png", label: "Gameplay interface" },
            { src: "/projects/mystic/map.png", label: "World map" },
          ],
          problem:
            "Creating an original game requires defining mechanics, interaction flows, interface structure, and technical direction from zero.",
          solution:
            "A self-directed game project exploring gameplay mechanics, user interaction, interface design, and product structure from concept to implementation.",
          architecture: [
            { label: "Concept", desc: "Defined the core game idea and player experience." },
            { label: "Mechanics", desc: "Worked through gameplay rules and interaction flows." },
            { label: "Interface", desc: "Explored how game state and user choices should be represented." },
            { label: "Plan", desc: "Created the product structure and development direction." },
          ],
          challenges: [
            "Designing from a blank page instead of extending an existing product.",
            "Connecting game logic with user engagement.",
            "Thinking through both experience design and implementation.",
          ],
          lessons:
            "Mystic Journey shows that Jinpeng can create a product from zero, define its logic, design its experience, and think about both user engagement and technical implementation.",
          screens: ["Game flow", "Interaction map", "Product structure"],
        },
    {
          id: "mindbug",
          name: "Mindbug Online Card Game",
          kind: "Archive Experiment",
          year: "2024",
          oneliner:
            "A collaborative online card game project built with Vue.js, Spring Boot, and WebSocket.",
          accent: "var(--ok)",
          tags: ["Vue.js", "Spring Boot", "WebSocket", "Agile", "Online Game"],
          hero: "mindbug",
          images: [
            { src: "/projects/mindbug/cover.png", label: "Mindbug cover" },
            { src: "/projects/mindbug/card-interaction.png", label: "Card interaction" },
            { src: "/projects/mindbug/game-room.png", label: "Game room state" },
          ],
          problem:
            "Online card games require synchronized state, responsive interfaces, and clear team coordination.",
          solution:
            "A team project built with Vue.js and Spring Boot, following Agile methodology and using WebSocket communication for real-time gameplay.",
          architecture: [
            { label: "Frontend", desc: "Vue.js interface for the online card-game experience." },
            { label: "Backend", desc: "Spring Boot services supporting game logic." },
            { label: "Realtime", desc: "WebSocket communication for live gameplay." },
            { label: "Team", desc: "Agile workflow in a four-person team." },
          ],
          challenges: [
            "Coordinating real-time gameplay across multiple clients.",
            "Working in a four-person Agile team.",
            "Connecting frontend interaction with backend game state.",
          ],
          lessons:
            "Mindbug shows collaborative full-stack development experience and real-time application exposure.",
          screens: ["Game room", "Card interaction", "Realtime state"],
        },
    {
          id: "real-china",
          name: "Real China",
          kind: "Archive Experiment",
          year: "2022",
          oneliner:
            "A travel website project from an early-stage entrepreneurial collaboration.",
          accent: "var(--warn)",
          tags: ["Travel Website", "Web Design", "Entrepreneurial Project", "Content Structure", "Wix"],
          hero: "real-china",
          images: [
            { src: "/projects/real-china/cover.png", label: "Real China cover" },
            { src: "/projects/real-china/cover.jpg", label: "Travel homepage" },
          ],
          problem:
            "Early-stage travel products need clear content organization and visual trust before they can communicate their offer.",
          solution:
            "A travel website project focused on web design, structure, content organization, and visual layout using Wix.",
          architecture: [
            { label: "Structure", desc: "Organized pages and information around the travel offer." },
            { label: "Content", desc: "Shaped content hierarchy and visual presentation." },
            { label: "Website", desc: "Built the visual layout using Wix." },
          ],
          challenges: [
            "Turning a business idea into a navigable website structure.",
            "Balancing content, visuals, and entrepreneurial positioning.",
          ],
          lessons:
            "Real China shows early product and web-design thinking in an entrepreneurial setting.",
          screens: ["Homepage", "Travel content", "Visual layout"],
        },
  ];

  const skillCats = {
    frontend: { name: "Frontend", color: "#16b87f" },
    backend: { name: "Backend", color: "#54a8ff" },
    ux: { name: "UX", color: "#3ecf8e" },
    ai: { name: "AI", color: "#ff6a8a" },
  };

  const skills = [
    { id: "react", name: "React", cat: "frontend", blurb: "Primary framework for product-focused frontend development.", projects: ["followjob", "ai-quota"], exp: ["hxd"], tech: ["TypeScript", "JavaScript", "Vite"] },
    { id: "vue", name: "Vue.js", cat: "frontend", blurb: "Reactive frontend framework used in full-stack product work and interactive interfaces.", projects: ["mindbug"], exp: ["bunsik"], tech: ["JavaScript", "Spring Boot"] },
    { id: "js", name: "JavaScript", cat: "frontend", blurb: "Core browser language for building responsive product interfaces and interaction logic.", projects: ["ai-quota"], exp: ["hxd", "bunsik"], tech: ["React", "Vue.js", "HTML5"] },
    { id: "ts", name: "TypeScript", cat: "frontend", blurb: "Typed JavaScript for maintainable frontend products and safer component logic.", projects: ["followjob", "ai-quota"], exp: ["hxd"], tech: ["React", "Vite"] },
    { id: "html", name: "HTML5", cat: "frontend", blurb: "Semantic page structure for accessible web interfaces.", projects: [], exp: ["hxd", "bunsik"], tech: ["CSS3", "JavaScript"] },
    { id: "css", name: "CSS3", cat: "frontend", blurb: "Responsive UI styling, layout systems, visual polish, and interaction states.", projects: ["ai-quota"], exp: ["hxd", "bunsik"], tech: ["HTML5", "Figma"] },
    { id: "chrome", name: "Chrome Extension Development", cat: "frontend", blurb: "Browser extension exploration for developer-focused AI tooling concepts.", projects: ["ai-quota"], exp: [], tech: ["JavaScript", "React"] },
    { id: "java", name: "Java", cat: "backend", blurb: "Backend programming for web services, application logic, and team full-stack projects.", projects: ["mindbug"], exp: ["bunsik"], tech: ["Spring Boot"] },
    { id: "spring", name: "Spring Boot", cat: "backend", blurb: "Java backend framework for APIs, admin workflows, and full-stack applications.", projects: ["mindbug"], exp: ["bunsik"], tech: ["Java", "REST APIs", "MySQL"] },
    { id: "python", name: "Python", cat: "backend", blurb: "Automation, scripting, backend services, and data extraction.", projects: [], exp: ["hxd", "jingneng"], tech: ["FastAPI", "Web Scraping"] },
    { id: "fastapi", name: "FastAPI", cat: "backend", blurb: "Python API development for lightweight backend services and product prototypes.", projects: ["followjob"], exp: [], tech: ["Python", "REST APIs"] },
    { id: "rest", name: "REST APIs", cat: "backend", blurb: "API integration and frontend-backend data flow for production web apps.", projects: [], exp: ["hxd", "bunsik"], tech: ["Spring Boot", "FastAPI"] },
    { id: "sql", name: "SQL", cat: "backend", blurb: "Relational data modeling and querying fundamentals for product backends.", projects: [], exp: ["bunsik"], tech: ["MySQL", "PostgreSQL"] },
    { id: "mysql", name: "MySQL", cat: "backend", blurb: "Database used in full-stack restaurant website and admin dashboard development.", projects: [], exp: ["bunsik"], tech: ["SQL", "Spring Boot"] },
    { id: "aws", name: "AWS / Cloud Deployment", cat: "backend", blurb: "Cloud deployment exposure in an early-stage entrepreneurial backend environment.", projects: [], exp: ["yosful"], tech: ["CI/CD", "Backend Collaboration"] },
    { id: "ux-research", name: "UX Research", cat: "ux", blurb: "Contextual interviews and user-centered research that turn observation into product decisions.", projects: ["airbus"], exp: ["hxd"], tech: ["Figma", "Prototyping"] },
    { id: "ui", name: "UI Design", cat: "ux", blurb: "Designing clear, usable interfaces for real workflows and business tools.", projects: ["airbus", "ai-quota"], exp: ["hxd", "bunsik"], tech: ["Figma", "CSS3"] },
    { id: "figma", name: "Figma", cat: "ux", blurb: "Wireframes, prototypes, interface iterations, and stakeholder communication.", projects: ["airbus"], exp: ["hxd"], tech: ["Prototyping", "UX Research"] },
    { id: "proto", name: "Prototyping", cat: "ux", blurb: "Testing interaction flows before implementation to reduce product uncertainty.", projects: ["airbus", "followjob"], exp: ["hxd"], tech: ["Figma", "UX Research"] },
    { id: "ia", name: "Information Architecture", cat: "ux", blurb: "Structuring complex workflows into understandable product flows and screens.", projects: ["followjob", "real-china"], exp: ["hxd"], tech: ["UX Research", "UI Design"] },
    { id: "product-thinking", name: "Product Thinking", cat: "ux", blurb: "Connecting user needs, business workflows, and implementation trade-offs.", projects: ["followjob", "airbus"], exp: ["hxd"], tech: ["UX Research", "Frontend"] },
    { id: "ai-dev", name: "AI-Assisted Development", cat: "ai", blurb: "Using AI tools to accelerate implementation while keeping product judgment central.", projects: ["ai-quota"], exp: [], tech: ["React", "UI Design"] },
    { id: "ai-tooling", name: "AI Tooling", cat: "ai", blurb: "Exploring tools that make AI usage more visible, understandable, and practical for builders.", projects: ["ai-quota"], exp: [], tech: ["Chrome Extension Development", "Developer Experience"] },
    { id: "quota-tracking", name: "Quota Tracking", cat: "ai", blurb: "Designing ways to visualize AI usage, limits, and remaining capacity without adding workflow noise.", projects: ["ai-quota"], exp: [], tech: ["UI Design", "JavaScript"] },
  ];

  const terminal = {
    prompt: "jinpeng@portfolio:~$",
    mission:
      "I build products that solve real problems. My goal is to connect users, design, business needs, and technical implementation.",
    strengths: [
      "frontend-development",
      "ui-design",
      "product-thinking",
      "ux-research",
      "full-stack-understanding",
      "ai-assisted-development",
      "problem-solving",
    ],
    focus: [
      "Front-End Engineering",
      "Product-Oriented Development",
      "React-based Web Applications",
      "AI-assisted Development",
      "Interactive Portfolio Design",
    ],
    why:
      "Because I do not only identify problems. I analyze them, propose several possible solutions, compare trade-offs, and build the most practical one.",
  };

  const modules = [
    { id: "mission", name: "Mission Control", short: "Status", icon: "mission", desc: "Current status & overview", accent: "var(--ac)" },
    { id: "about", name: "About Me", short: "About", icon: "book", desc: "Personal profile", accent: "var(--info)" },
    { id: "resume", name: "Resume Preview", short: "Resume", icon: "layers", desc: "Recruiter-ready summary", accent: "var(--ok)" },
    { id: "experience", name: "Experience Database", short: "Career", icon: "exp", desc: "Interactive career timeline", accent: "var(--info)" },
    { id: "projects", name: "Project Laboratory", short: "Work", icon: "lab", desc: "Product case studies", accent: "var(--ok)" },
    { id: "skills", name: "Skill Stack", short: "Skills", icon: "skills", desc: "Grouped technical stack", accent: "var(--warn)" },
    { id: "languages", name: "Languages", short: "Languages", icon: "globe", desc: "Language proficiency", accent: "var(--ok)" },
    { id: "education", name: "Education", short: "Education", icon: "book", desc: "Academic background", accent: "var(--ac)" },
    { id: "assistant", name: "Recruiter Assistant", short: "Ask AI", icon: "ai", desc: "Ask anything about Jinpeng", accent: "var(--rose)" },
    { id: "contact", name: "Contact", short: "Contact", icon: "mail", desc: "Email, GitHub, LinkedIn", accent: "var(--ac-bright)" },
    { id: "console", name: "Command Center", short: "Terminal", icon: "term", desc: "Terminal mode", accent: "var(--tx-1)" },
  ];

  window.JP = { profile, experience, projects, skills, skillCats, modules, terminal };
})();
