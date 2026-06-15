/* ============================================================
   Jinpeng OS - Lightweight front-end i18n
   ============================================================ */
(function () {
  const detected = (navigator.language || navigator.userLanguage || "en").toLowerCase().startsWith("zh") ? "zh" : "en";
  const lang = detected;

  const dict = {
    en: {},
    zh: {
      "ui.lang": "ZH",
      "ui.palette": "搜索模块、操作、联系方式...",
      "ui.palette.esc": "ESC",
      "ui.palette.results": "结果",
      "ui.palette.modules": "模块与操作",
      "ui.palette.noMatches": "没有匹配项",
      "ui.palette.nav": "导航",
      "ui.palette.open": "打开",
      "ui.palette.close": "关闭",
      "palette.copyEmail": "复制邮箱",
      "palette.github": "打开 GitHub",
      "palette.linkedin": "打开 LinkedIn",
      "ui.empty.title": "欢迎来到 Jinpeng OS",
      "ui.empty.subtitle": "从 Dock 打开一个模块，或按",
      "ui.boot.version": "v1.0.0 · 启动中",
      "ui.boot.skip": "跳过 →",
      "ui.boot.steps.0": "初始化内核",
      "ui.boot.steps.1": "加载关于我",
      "ui.boot.steps.2": "挂载简历预览",
      "ui.boot.steps.3": "挂载经历数据库",
      "ui.boot.steps.4": "加载项目实验室",
      "ui.boot.steps.5": "校准技能栈",
      "ui.boot.steps.6": "唤醒 AI 模块",
      "ui.boot.steps.7": "合成界面",
      "ui.win.close": "关闭",
      "ui.win.minimize": "最小化",
      "ui.win.zoom": "缩放",
      "mission.eyebrow": "任务控制台",
      "mission.days": "天后可开始工作",
      "mission.date": "2026年9月12日",
      "mission.roles": "经历",
      "mission.products": "项目",
      "mission.skills": "技能",
      "mission.languages": "语言",
      "mission.seeking": "求职方向",
      "mission.mobility": "流动性",
      "mission.now": "当前",
      "mission.nowText": "正在通过界面设计、业务理解和技术实现，构建以用户为中心的数字产品。",
      "mission.education": "教育",
      "mission.askTitle": "询问招聘助手",
      "mission.askSub": "快速了解 Jinpeng 的匹配度、技术栈与项目经历。",
      "about.eyebrow": "关于我.app",
      "about.identity": "核心身份",
      "about.tags": "个人标签",
      "resume.eyebrow": "简历.app",
      "resume.strength": "核心优势",
      "resume.focus": "主要方向",
      "resume.summary": "快速概览",
      "experience.eyebrow": "经历数据库",
      "experience.rows": "行",
      "projects.eyebrow": "项目实验室",
      "projects.title": "产品与工程项目",
      "projects.subtitle": "这里展示产品想法、企业 UX、前端实验和早期项目。打开任意项目即可查看完整案例。",
      "projects.open": "打开案例",
      "case.back": "实验室",
      "case.problem": "问题",
      "case.solution": "解决方案",
      "case.architecture": "结构",
      "case.challenges": "技术挑战",
      "case.screens": "界面",
      "case.lessons": "收获",
      "case.note": "项目中的精选界面截图",
      "skills.eyebrow": "技能栈",
      "skills.title": "我的技术栈。",
      "skills.subtitle": "更清晰地浏览 Jinpeng 用来把想法做成产品的工具、产品能力与 AI 工作流。",
      "skills.used": "用于",
      "skills.proven": "实践于",
      "skills.pairs": "搭配",
      "skills.cross": "跨项目能力 - 应用于多种工作场景。",
      "skills.self": "自驱项目 / 个人项目。",
      "skills.judgment": "产品判断",
      "languages.eyebrow": "语言",
      "languages.title": "三种语言，一个建造者。",
      "languages.subtitle": "中文背景、国际教育和在法国的生活共同塑造了我的多语言工作方式。",
      "languages.footer": "可以在中文、英文和法语团队中顺畅协作。",
      "education.eyebrow": "教育.app",
      "education.title": "教育背景",
      "education.subtitle": "计算机科学基础、人机交互方向，以及国际化的学术背景。",
      "assistant.title": "招聘助手",
      "assistant.status": "在线 · AI 驱动",
      "assistant.hello": "你好，我是 Jinpeng 的招聘助手。你可以询问他的经历、项目、技术栈或可用时间。",
      "assistant.placeholder": "询问 Jinpeng...",
      "assistant.fallback": "我现在无法连接实时模型，但可以先告诉你：Jinpeng 是一名具备 HCI 背景的软件开发工程师，熟悉 React/TypeScript 前端和 Java/Python 后端，2026年9月12日起可开始工作。可通过 jp.liu87@gmail.com 联系他。",
      "assistant.unsure": "这个问题我不确定，最好直接通过 jp.liu87@gmail.com 联系 Jinpeng。",
      "assistant.suggest.0": "Jinpeng 适合前端岗位吗？",
      "assistant.suggest.1": "他为什么是产品型工程师？",
      "assistant.suggest.2": "他有全栈经验吗？",
      "assistant.suggest.3": "他什么时候可以开始工作？在哪里？",
      "assistant.suggest.4": "UX/HCI 背景如何帮助他成为更好的工程师？",
      "terminal.sys": "Jinpeng OS - 命令中心  v1.0.0",
      "terminal.helpHint": "输入 'help' 查看命令列表。",
      "contact.eyebrow": "联系方式",
      "contact.title": "一起做有用的产品。",
      "contact.subtitle": "我正在寻找 2026 年以下方向的机会：",
      "contact.targets": "前端工程|软件工程|全栈开发|产品工程",
      "contact.location": "所在地",
      "contact.phone": "电话",
    },
  };

  function t(key, fallback) {
    return (dict[lang] && dict[lang][key]) || fallback || key;
  }

  function merge(target, patch) {
    if (!target || !patch) return;
    Object.keys(patch).forEach((key) => {
      if (patch[key] && typeof patch[key] === "object" && !Array.isArray(patch[key])) {
        merge(target[key], patch[key]);
      } else {
        target[key] = patch[key];
      }
    });
  }

  function byId(items) {
    return Object.fromEntries(items.map((item) => [item.id, item]));
  }

  function applyZh() {
    const jp = window.JP;
    if (!jp) return;

    merge(jp.profile, {
      role: "产品型前端工程师",
      tagline: "将复杂问题转化为清晰、可用数字产品的产品型前端工程师。",
      identity: "不只是写代码的开发者，而是能理解产品为什么存在、服务谁、以及如何让它更好用的工程师。",
      status: {
        state: "开放 2026 年机会",
        seeking: "前端工程、软件工程、全栈开发与产品工程岗位",
        location: "法国巴黎",
        relocation: "可接受异地工作 / 搬迁",
      },
      about: {
        title: "关于 Jinpeng",
        short: "将复杂问题转化为清晰、可用数字产品的产品型前端工程师。",
        paragraphs: [
          "我是一名产品导向的前端工程师，拥有计算机科学和人机交互背景。",
          "我的优势不只是写代码，而是理解一个产品为什么存在、服务谁、以及怎样让它更好用。通过项目和实习，我实践过前端开发、全栈开发、UX 研究、UI 设计、自动化工具和产品思考。",
          "我喜欢构建真正解决问题的产品，尤其是把复杂流程转化为直观数字体验，并看到真实用户使用它们。",
          "我目前专注于前端工程，尤其是 React 产品开发。长期来看，我希望成长为能连接用户、业务需求和技术团队的产品工程师。",
        ],
        tags: ["前端导向", "产品思维", "理解 UX", "问题解决者", "AI 辅助开发", "多文化背景", "构建有用产品"],
      },
      resume: {
        title: "简历预览",
        summary: "具备 UX/UI 设计和全栈开发经验的产品型前端工程师。",
        body: "我做过可上线的 Web 应用、企业界面重设计、内部流程自动化，也从真实痛点出发构建个人产品。",
        focus: ["前端工程", "产品工程", "全栈 Web 开发", "UX/UI 驱动的产品开发"],
        strength: "我能同时从用户和开发者视角理解问题，提出可落地方案，并把它实现出来。",
        quickSummary: [
          { k: "前端", v: "React, Vue.js, JavaScript, TypeScript" },
          { k: "后端", v: "Java, Spring Boot, Python, FastAPI" },
          { k: "设计", v: "Figma, UX Research, UI Design, Prototyping" },
          { k: "工具", v: "Git, Docker, Jira, AI-assisted development" },
        ],
        downloadLabel: "下载简历",
      },
    });

    [
      {
        degree: "人机交互硕士",
        school: "图卢兹第三大学和法国国立民航大学",
        note: "双学位项目，聚焦 HCI、UX 研究、以用户为中心的设计、原型、可用性评估与前端开发。",
      },
      {
        degree: "计算机科学学士",
        school: "斯特拉斯堡大学",
        note: "学习计算机基础、软件开发、Web 开发、数据库、算法与编程。",
      },
      {
        degree: "A-Level & IGCSE",
        school: "El Kalimat School, Algeria",
        note: "多文化、英语体系下的国际教育背景。",
      },
    ].forEach((patch, i) => merge(jp.profile.education[i], patch));

    [
      { name: "中文", level: "母语", blurb: "我的母语，听说读写完全流利。", contexts: ["母语者", "家庭与文化", "阅读 / 写作"] },
      { name: "英语", level: "职业工作能力", blurb: "我用英语构建、写文档和协作，包括技术阅读写作以及与国际团队的日常工作。", contexts: ["技术写作", "文档", "国际团队"] },
      { name: "法语", level: "职业工作能力", blurb: "在法国完成本科和硕士阶段学习，先后生活在斯特拉斯堡和图卢兹，具备日常学术和职业使用经验。", contexts: ["学术", "职业", "日常生活"] },
    ].forEach((patch, i) => merge(jp.profile.languages[i], patch));

    const exp = byId(jp.experience);
    merge(exp.hxd, {
      title: "前端开发实习生",
      kind: "产品 + 前端",
      period: "2026年4月 - 2026年9月",
      location: "法国巴黎",
      summary: "设计并开发面向创业者的业务盈利能力模拟器，将复杂的 Excel 财务分析流程转化为直观的 Web 应用。",
      points: [
        "对使用过原 Excel 流程的用户进行情境访谈。",
        "通过多轮 UX/UI 迭代简化复杂财务流程。",
        "开发前端界面，包括落地页、多步骤表单和结果展示。",
        "与后端开发者协作完成 API 集成和数据流设计。",
        "帮助将原本 2-3 小时的人工分析流程缩短为 5-10 分钟的数字流程。",
        "构建 Python 自动化工具，将 Skello 出勤导出转换为 Silae 兼容薪资模板。",
        "将每家公司约 3 小时的薪资处理时间减少到约 10 分钟。",
      ],
      impact: "为公司创建新的数字业务工具，并提升内部运营效率。",
    });
    merge(exp.bunsik, {
      title: "全栈开发实习生",
      kind: "全栈产品",
      period: "2025年5月 - 2025年8月",
      location: "法国斯特拉斯堡",
      summary: "独立设计并开发餐厅全栈网站，使用 Vue.js、Spring Boot 和 MySQL，包含顾客端页面与后台管理系统。",
      points: ["设计并开发网站界面。", "构建首页、菜单、联系和预订页面。", "实现响应式和多语言体验。", "开发支持菜单 CRUD 的后台管理面板。", "实现菜品图片上传。", "构建预订流程，通过邮件将客户请求发送给管理员。", "从 UI/UX 设计到后端实现和测试，独立推进完整开发流程。"],
    });
    merge(exp.yosful, {
      title: "后端与云开发",
      kind: "创业项目",
      period: "2022年7月 - 2022年12月",
      location: "法国斯特拉斯堡",
      summary: "在四人早期创业团队中协作开发 Web 项目，负责后端协作、云部署、CI/CD 流程和 AWS 环境配置。",
      points: ["与两名前端、两名后端组成团队协作。", "支持云部署和 CI/CD 搭建。", "帮助连接后端服务与前端需求。", "在类创业环境中将业务需求转化为技术方案。"],
    });
    merge(exp.jingneng, {
      company: "京能信息技术",
      title: "Python 开发助理实习生",
      kind: "后端 / 数据",
      period: "2020年8月 - 2020年10月",
      location: "中国北京",
      summary: "在学业间隔期完成第一段开发实习，主要参与网页爬虫和数据提取工作。",
      points: ["编写 Python 脚本采集目标网站数据。", "清洗并整理提取数据。", "与开发团队协作排查爬虫问题。", "提升数据采集准确性。"],
    });

    const projects = byId(jp.projects);
    merge(projects.followjob, {
      kind: "个人产品",
      oneliner: "一个从真实求职痛点出发构建的职位申请追踪产品。",
      tags: ["产品设计", "前端", "求职", "UX 流程", "MVP 思维"],
      problem: "当同时申请很多岗位时，很难记住哪个公司联系过、沟通过什么职位、当前状态是什么，以及下一步该做什么。",
      solution: "一个结构化的申请追踪产品，帮助用户管理公司、职位、状态、备注、跟进事项和招聘进度。",
      architecture: [
        { label: "痛点", desc: "从真实求职过程中的表格混乱问题出发。" },
        { label: "产品流程", desc: "定义状态、备注、提醒和跟进检查点。" },
        { label: "前端", desc: "设计清晰界面，便于扫描申请和下一步行动。" },
        { label: "MVP 思维", desc: "优先解决真实流程，再逐步扩展复杂功能。" },
      ],
      challenges: ["将混乱的个人流程转化为结构化产品模型。", "让申请状态和跟进动作容易扫读。", "在有用提醒和安静体验之间取得平衡。"],
      lessons: "FollowJob 展示了 Jinpeng 识别真实痛点、定义产品概念、设计用户流程并将想法落地为实用产品的能力。",
    });
    merge(projects.airbus, {
      kind: "学术 UX / 产品项目",
      oneliner: "为 Airbus ACS 通知中心进行 6 个月企业 UX 重设计。",
      tags: ["Airbus", "UX 研究", "Figma", "企业 UX", "情境访谈"],
      problem: "不同 Airbus 组织在不同工作流中使用通知，导致现有 ACS 通知体验存在可用性和优先级问题。",
      solution: "基于情境访谈、利益相关者需求、可用性分析、Figma 原型、UX 建议和用户指南，重新设计通知中心。",
      architecture: [
        { label: "研究", desc: "访谈工程、制造、项目管理和客户服务等利益相关者。" },
        { label: "综合分析", desc: "整理并分析不同企业场景下的用户需求。" },
        { label: "原型", desc: "用 Figma 设计交互原型改善通知工作流。" },
        { label: "交付", desc: "交付 UX 建议和用户指南。" },
      ],
      challenges: ["理解不同 Airbus 组织对通知的需求。", "将访谈结果转化为具体界面改进。", "在企业流程复杂度和可用性之间找到平衡。"],
      lessons: "这个项目展示了 Jinpeng 参与真实企业产品、与不同利益相关者沟通，并把用户研究转化为界面改进的能力。",
    });
    merge(projects.sixyao, {
      name: "六爻硬币投掷",
      kind: "本地工具",
      oneliner: "一个隐私优先的本地工具，用于在 macOS 和 iPhone 上模拟六爻硬币投掷记录。",
      tags: ["本地优先", "移动端 UX", "中文界面", "工具产品", "跨设备"],
      problem: "手动记录六爻投掷容易丢失、难以回看，也容易把记录和解释混在一起。",
      solution: "一个本地优先工具，模拟硬币输入、逐爻记录、自动归档历史，并支持一键复制，不把数据发送到远程服务。",
      architecture: [
        { label: "本地优先", desc: "记录保存在设备本地，而不是依赖远程存储。" },
        { label: "步骤流程", desc: "从第一爻到第六爻提供清晰进度反馈。" },
        { label: "历史", desc: "完整归档记录，方便之后回看。" },
        { label: "跨设备", desc: "面向 macOS 和 iPhone 使用场景设计。" },
      ],
      challenges: ["把传统记录流程转化为简单数字工作流。", "让界面专注于记录与统计，而不是过度解释。", "在中文工具 UX 中保持清晰进度和历史状态。"],
      lessons: "SixYao 展示了把小众个人流程转化为聚焦本地隐私、历史记录和跨设备可用性的工具能力。",
    });
    merge(projects["ai-quota"], {
      kind: "浏览器扩展 / AI 工具",
      oneliner: "一个用于监控 AI 工具使用量和额度消耗的浏览器扩展概念。",
      tags: ["Chrome 扩展", "AI 工具", "额度追踪", "开发者体验", "UI 设计"],
      problem: "随着 AI 编程和效率工具进入日常工作，用户需要更清晰地理解限制、使用量和剩余额度。",
      solution: "一个科幻风格的用量追踪界面，探索 Chrome Extension、动态 UI 和实时额度可视化。",
      challenges: ["让 AI 额度信息更直观。", "探索 Chrome Extension 的限制。", "设计具有强视觉身份的开发者产品。"],
      lessons: "AI Quota 展示了 Jinpeng 对 AI 工具体系的兴趣，以及为开发者设计清晰产品界面的能力。",
    });
    merge(projects["dapp-feed"], {
      kind: "Web3 原型",
      oneliner: "一个探索去中心化互动和钱包登录的 Web3 社交原型。",
      tags: ["Web3", "DApp", "钱包连接", "社交产品", "前端实验"],
      problem: "Web3 社交产品常在钱包连接和身份建立阶段产生上手摩擦。",
      solution: "一个探索去中心化社交互动、钱包连接和 Web3 onboarding 的原型。",
      lessons: "这个早期项目展示了对新兴产品类别的好奇心，以及测试新交互模型的能力。",
    });
    merge(projects.furever, {
      kind: "移动产品概念",
      oneliner: "一个集宠物定位、安全、健康文档与主人社区于一体的移动产品概念。",
      tags: ["移动 UX", "宠物护理", "Figma", "产品概念", "社区"],
      problem: "宠物主人经常把安全追踪、健康文档、提醒和社区分享分散在不同工具中，日常管理变得复杂。",
      solution: "一个移动端宠物陪伴产品，将定位、安全区域、疫苗提醒、健康记录和社交分享整合进温暖的体验中。",
      challenges: ["将情感型需求和实用追踪/文档流程结合。", "在保持友好感的同时确保安全和健康信息清晰。", "把多个功能组织成简单的移动端信息架构。"],
      lessons: "FurEver 展示了产品思考能力：识别生活方式需求，组织功能，并围绕信任、陪伴和日常使用塑造移动体验。",
    });
    merge(projects.mystic, {
      name: "午夜列车",
      kind: "原创游戏项目",
      oneliner: "一个从概念到实现推进的原创游戏项目。",
      tags: ["游戏设计", "UX 设计", "前端", "产品创造", "交互设计"],
      problem: "从零创建原创游戏需要定义机制、交互流程、界面结构和技术方向。",
      solution: "一个自驱游戏项目，探索玩法机制、用户互动、界面设计和产品结构。",
      lessons: "午夜列车展示了 Jinpeng 从零创造产品、定义逻辑、设计体验，并同时思考用户参与和技术实现的能力。",
    });
    merge(projects.mindbug, {
      kind: "实时游戏",
      oneliner: "一个使用 Vue.js、Spring Boot 和 WebSocket 构建的多人在线卡牌游戏项目。",
      tags: ["Vue.js", "Spring Boot", "WebSocket", "敏捷", "在线游戏"],
      problem: "在线卡牌游戏需要同步状态、响应式界面和清晰的团队协作。",
      solution: "团队项目，使用 Vue.js 和 Spring Boot，采用敏捷方法，并通过 WebSocket 实现实时游戏通信。",
      lessons: "Mindbug 展示了协作式全栈开发和实时应用经验。",
    });
    merge(projects["real-china"], {
      kind: "早期项目",
      oneliner: "一个来自早期创业协作的旅行网站项目。",
      tags: ["旅行网站", "网页设计", "创业项目", "内容结构", "Wix"],
      problem: "早期旅行产品需要清晰的信息组织和视觉信任感，才能有效表达服务内容。",
      solution: "一个使用 Wix 构建的旅行网站项目，聚焦网页设计、结构、内容组织和视觉排版。",
      lessons: "Real China 展示了早期创业场景中的产品和网页设计思考。",
    });

    merge(jp.skillCats.frontend, { name: "前端" });
    merge(jp.skillCats.backend, { name: "后端" });
    merge(jp.skillCats.ux, { name: "UX" });
    merge(jp.skillCats.ai, { name: "AI" });
    byId(jp.skills).react.blurb = "用于产品型前端开发的主要框架。";
    byId(jp.skills).vue.blurb = "用于全栈产品和交互界面的响应式前端框架。";
    byId(jp.skills).js.blurb = "构建响应式产品界面和交互逻辑的浏览器核心语言。";
    byId(jp.skills).ts.blurb = "为可维护前端产品和更安全组件逻辑提供类型支持。";
    byId(jp.skills).css.blurb = "负责响应式 UI、布局系统、视觉打磨和交互状态。";
    byId(jp.skills)["ux-research"].blurb = "通过情境访谈和用户研究，把观察转化为产品决策。";
    byId(jp.skills)["product-thinking"].blurb = "连接用户需求、业务流程和实现取舍。";
    byId(jp.skills)["ai-dev"].blurb = "使用 AI 工具加速实现，同时保持产品判断。";

    merge(jp.terminal, {
      mission: "我构建解决真实问题的产品。目标是连接用户、设计、业务需求和技术实现。",
      strengths: ["前端开发", "UI 设计", "产品思维", "UX 研究", "全栈理解", "AI 辅助开发", "问题解决"],
      focus: ["前端工程", "产品导向开发", "React Web 应用", "AI 辅助开发", "交互式作品集设计"],
      why: "因为我不只是发现问题。我会分析问题，提出多种方案，比较取舍，并构建最实用的版本。",
    });

    const modules = byId(jp.modules);
    merge(modules.mission, { name: "任务控制台", short: "状态", desc: "当前状态与总览" });
    merge(modules.about, { name: "关于我", short: "关于", desc: "个人简介" });
    merge(modules.resume, { name: "简历预览", short: "简历", desc: "面向招聘者的概览" });
    merge(modules.experience, { name: "经历数据库", short: "经历", desc: "交互式职业时间线" });
    merge(modules.projects, { name: "项目实验室", short: "项目", desc: "产品案例研究" });
    merge(modules.skills, { name: "技能栈", short: "技能", desc: "分组技术栈" });
    merge(modules.languages, { name: "语言", short: "语言", desc: "语言能力" });
    merge(modules.education, { name: "教育", short: "教育", desc: "教育背景" });
    merge(modules.assistant, { name: "招聘助手", short: "问 AI", desc: "询问 Jinpeng 的任何信息" });
    merge(modules.contact, { name: "联系", short: "联系", desc: "邮箱、GitHub、LinkedIn" });
    merge(modules.console, { name: "命令中心", short: "终端", desc: "终端模式" });
  }

  if (lang === "zh") applyZh();

  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  window.JP_LANG = lang;
  window.JP_I18N = {
    lang,
    t,
  };
})();
