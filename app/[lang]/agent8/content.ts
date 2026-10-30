import type { Locale } from "@/lib/i18n";

/*
 * All user-visible copy for the AGENT8 page. Thai is the original mockup text;
 * English is a translation. Strings wrapped in backticks (`like this`) are
 * rendered as <code> by the page.
 *
 * Comparison-table cells use "y" for a check mark and "x" for a dash; any other
 * value is rendered as text.
 */

export type PlanKey = "Gateway" | "Agent" | "Dedicated";

const en = {
  meta: {
    title: "AGENT8",
    description: "AGENT8: build, test and release AI agents. One gateway controls models and budgets, and every request is logged.",
  },
  aria: {
    mainNav: "Main menu",
    subnav: "Page sections",
    dock: "Selected plan",
  },
  nav: { features: "Product", uses: "Use cases", plans: "Plans", help: "Help" },
  bookDemo: "Book a demo",
  hero: {
    h1Lead: "AI agents for your business,",
    h1Em: "tested before launch, with a log of every run",
    lede: "Describe an agent in a chat and test it on a set of tasks before release. Your apps then call it through one gateway that controls models, budgets and personal data. Each request is logged with its cost.",
    ctaPrimary: "See what it does",
    ctaSecondary: "View plans",
    ticks: [
      "Apps on the OpenAI SDK switch over by changing one address (base_url)",
      "Use your organization's own OpenAI, Anthropic, Gemini or OpenRouter keys",
    ],
    screenAria: "Sample request log for one agent request",
    traceTitle: "Check a customer's claim status",
    tiles: [
      { v: "5.92 s", l: "Total time" },
      { v: "3 rounds", l: "Rounds of work" },
      { v: "$0.031", l: "Cost of this request" },
    ],
    floatAria: "Sample API key with budget and permissions",
    floatBudget: "This month's budget: $412 of $1,000",
    floatTeam: "Team",
  },
  trust: {
    items: [
      { b: "Versioned agents", s: "Draft, tested, then published" },
      { b: "Tested before release", s: "New versions must reach a set pass rate" },
      { b: "Works with your current apps", s: "Set models, budgets and limits per key" },
      { b: "No lost logs", s: "If log storage goes down, logs are held and resent" },
    ],
    note: "Screens on this page are simulated from the AGENT8 console using sample data.",
  },
  subnav: {
    how: "How it works",
    features: "Features",
    uses: "Use cases",
    plans: "Plans",
    specs: "Specs",
    faq: "FAQ",
  },
  how: {
    eyebrow: "How it works",
    h2: "From requirements to a tested agent",
    tablistAria: "Workflow steps",
    tabs: ["Build", "Test", "Call", "Review"],
    build: {
      h3: "Describe the job, and Agent Builder drafts the agent",
      sub: "The AI asks about your requirements, writes the instructions, picks the tools and creates test tasks. Then it saves a new version and runs the tests.",
      ticks: [
        "Start fresh, or open an existing agent to improve it",
        "See the draft and test tasks as you talk",
        "A person always does the publishing",
      ],
      aria: "Sample Agent Builder screen",
      userAv: "NP",
      userName: "Napa",
      userText:
        "I want an agent that answers customers about claim status. It can use our claims system, but must never change claim data itself.",
      aiBefore: 'Uses 2 read-only tools from the "claims" MCP server and sets',
      aiAfter: "to require approval, with 12 test tasks",
      logs: [
        "Saved support-assistant version 4 (draft)",
        "Added 12 tasks to the regression suite",
        "Running the test suite…",
      ],
    },
    test: {
      h3: "New versions must meet the bar before going live",
      sub: "Set a minimum pass rate for each test suite. A version that fails cannot be published. If a release is urgent, an org_admin can override it by giving a reason.",
      ticks: [
        "11 kinds of checks, including scoring by an AI",
        "Simulated chats where an AI plays the customer over several turns",
        "Only org_admin can edit required test suites",
      ],
      aria: "Sample test results against thresholds",
      title: "Checks before publishing",
      chip: "Ready to publish",
      suites: [
        { name: "regression · 12 tasks", line: "pass rate 92% · threshold 85%" },
        { name: "safety · 6 tasks", line: "pass rate 100% · threshold 100%" },
      ],
    },
    call: {
      h3: "Apps call an agent the same way they call a model",
      sub: "Give your app an API key, point it at the OpenAI-style address and set the model name to `agent:<slug>`. For long jobs, run the agent in the background and get the result sent back to your app.",
      ticks: [
        "Each key can only call the agents you allow",
        "Results sent back to your app are signed (HMAC-SHA256) so you can verify them",
        "The end user's identity can be passed on to tools",
      ],
      codeAria: "Sample code for calling an agent",
      codeUser: "Where is claim C-20931 now?",
      codeCost: "cost of this request",
    },
    review: {
      h3: "Open any past run",
      sub: "Each run includes the transcript, tools called, iteration count, tokens and cost, with a link to that request's request log.",
      ticks: [
        "Runs grouped by source: live apps, test page and test runs",
        "See runs paused for approval",
        "Cancel runs that are still in progress",
      ],
      aria: "Sample run list",
      heads: ["Agent", "mode", "Status", "Cost"],
    },
  },
  agent: {
    h2: "Build, test and release agents step by step",
    p: "Each agent has versions and a test suite. You choose which tools need a person's approval.",
    versions: {
      ey: "Agent versions",
      h3: "Roll back to any earlier version",
      p: "Every edit creates a new version. Earlier versions are kept, and apps only see published versions.",
      aria: "Sample list of agent versions",
      heads: ["Version", "Note", "Tests", "Status"],
      notes: [
        "Require approval for update_status",
        "Made the tone more polite",
        "Added the get_documents tool",
        "Created with Agent Builder",
      ],
    },
    approval: {
      ey: "Approvals",
      h3: "A person approves risky actions",
      p: "For risky tools, the agent stops and waits for approval.",
      aria: "Sample pending approval card",
      expires: "Expires in 14 minutes",
      approve: "Approve",
      reject: "Reject",
    },
    small: [
      {
        h4: "Tools from MCP",
        p: "Add your organization's MCP servers and AGENT8 finds their tools. Connect them to an agent one at a time, and mark each as read-only or able to change data.",
      },
      {
        h4: "Background runs and callbacks",
        p: "Run long jobs in the background and get the signed result (HMAC-SHA256) sent back to your app. Check status or cancel a run at any time.",
      },
      {
        h4: "Agent Builder",
        p: "A chat where the AI asks about your requirements, drafts the agent, creates test tasks, saves a new version and runs the tests. A person does the publishing.",
      },
    ],
    eval: {
      ey: "Tests and simulated chats",
      h3: "Run the same tests after every edit",
      p: "Each agent's test suite covers single-question tasks and simulated chats where an AI plays a user with a set role and goal.",
      aria: "Sample test results per task",
      heads: ["Task", "Checks", "Result"],
      rows: [
        "Ask about an existing claim's status",
        "Frustrated customer · 6-turn simulation",
        "Asks the agent to change claim status itself",
        "Respond in JSON for another system",
      ],
      pass: "Pass",
      fail: "Fail",
    },
    checks: {
      ey: "Check types",
      h3: "11 types",
      ticks: [
        "contains, equals, regex, json_valid",
        "Tool called or not called",
        "Scoring by an AI against a checklist",
        "Cost and latency within set limits",
        "Automatic test task generation",
      ],
    },
  },
  gateway: {
    h2: "One gateway for every model and agent",
    p: "Before a request reaches a model, the gateway checks the key, permissions, budget, rate limit and content filters.",
    keys: {
      ey: "Teams and API keys",
      h3: "One key per app, one budget per team",
      p: "Set limits at three levels: organization, team and key. Each level can restrict models and agents, set daily, monthly or lifetime budgets, and cap requests and tokens per minute (RPM/TPM).",
      aria: "Sample list of API keys",
      heads: ["Key", "Team", "This month's budget", "RPM"],
    },
    guard: {
      ey: "Content filters",
      h3: "Mask personal data",
      p: "Applies to text going in and coming out. Try it on sample text before going live.",
      aria: "Sample content filter test",
      inLabel: "Incoming text",
      outLabel: "Sent to the model",
      intro: "This is",
      name: "Somchai",
      idLabel: "· ID",
      phoneLabel: "· phone",
      count: "2 items",
    },
    small: [
      {
        h4: "OpenAI-compatible API",
        p: "Chat completions, embeddings and models, with streaming. Every response includes the log ID, the model used and the cost.",
      },
      {
        h4: "Providers and backup models",
        p: "Add keys for OpenAI, Anthropic, Gemini, OpenRouter or any OpenAI-compatible service, name your own models, press Test to check that tool calling works, and set backup models.",
      },
      {
        h4: "Encrypted keys, accurate counts",
        p: "Provider keys are encrypted before they are stored. API keys are shown only once. Budget and request-limit counts stay accurate even when you run more than one server.",
      },
    ],
  },
  observation: {
    h2: "A log behind every answer",
    p: "See who called which agent version, which model it used, which tools it called and what it cost.",
    trace: {
      ey: "Request log",
      h3: "Search and open any request",
      p: "Each request is split into steps: request, agent, model reply, tool, content filter and test. Filter by time range, agent, key, status and source.",
      aria: "Sample list of request logs",
      segAll: "All",
      count: "1,284 requests",
      heads: ["Time", "Agent / model", "source", "Status", "Cost"],
    },
    cost: {
      ey: "Cost",
      h3: "See where the money goes",
      p: "Break down by day, model, key, team, agent or source.",
      aria: "Sample cost by model",
      seg: ["Day", "Model", "Team", "Agent"],
    },
    small: [
      {
        h4: "No lost logs",
        p: "If log storage is unavailable, logs are held in the database and resent once it recovers.",
      },
      {
        h4: "See the end user",
        p: "When an app passes along the user's token, the log shows who made the request.",
      },
      {
        h4: "Audit log",
        p: "Every change in the organization, such as keys, models and publishing, records who made it and when.",
      },
    ],
  },
  uses: {
    eyebrow: "Use cases",
    h2: "For work where you need to show what the AI did",
    items: [
      {
        h4: "Many apps, one gateway",
        p: "Route every app through one gateway, give each team its own keys and budgets, and see cost per app.",
      },
      {
        h4: "Customer service agents",
        p: "Read data from internal systems via MCP, answer customers, and request approval before changing real data.",
      },
      {
        h4: "Work that needs an audit trail",
        p: "Every change to instructions or model must pass the existing tests, with a record of who released it.",
      },
      {
        h4: "Personal data",
        p: "Mask national ID numbers, phone numbers and email addresses before they reach the model, and check afterwards in the request log.",
      },
    ],
  },
  plans: {
    eyebrow: "Plans",
    h2: "Choose the plan that fits your organization",
    p: "Every plan uses your organization's own model provider keys. Model usage is paid directly to the provider.",
    gateway: {
      big: "Control model usage",
      for: "For organizations already running AI apps",
      btn: "Choose Gateway",
      inc: "Included",
      ticks: [
        "OpenAI-compatible API and streaming",
        "Teams, API keys, budgets and RPM/TPM",
        "Backup models",
        "Content filters and personal data masking",
        "Request logs and cost",
      ],
    },
    agent: {
      badge: "Recommended · Everything included",
      big: "Build and release agents",
      for: "For teams putting agents into real work",
      inc: "Everything in Gateway, plus",
      ticks: [
        "Versioned agents with a test page",
        "Agent Builder",
        "MCP tools and approvals",
        "Background runs with callbacks",
        "Tests, simulated chats and checks before publishing",
      ],
    },
    dedicated: {
      big: "Contact sales",
      for: "For organizations that need a private deployment",
      btn: "Contact sales",
      inc: "Everything in Agent, plus",
      ticks: [
        "Runs in your own cloud project",
        "Log retention to your requirements",
        "Dedicated support team",
      ],
    },
    desc: {
      Gateway: "AI Gateway · Content filters · Monitoring",
      Agent: "Agent · Gateway · Monitoring",
      Dedicated: "Private deployment · Scope per contract",
    } as Record<PlanKey, string>,
    note: "Pricing is estimated by number of teams and usage volume · Excludes 7% VAT · Plan scope is a draft for discussion",
    cmpH: "Compare plans",
    cmpHead: {
      gatewayPp: "Contact sales",
      gatewayBtn: "Choose",
      agentPp: "Recommended",
      dedicatedPp: "Per contract",
      dedicatedBtn: "Contact sales",
    },
    cmpRows: [
      { label: "AI Gateway", group: true },
      { label: "OpenAI-compatible API and streaming", cells: ["y", "y", "y"] },
      { label: "Teams, API keys, budgets, RPM/TPM", cells: ["y", "y", "y"] },
      { label: "Backup models", cells: ["y", "y", "y"] },
      { label: "Content filters", cells: ["y", "y", "y"] },
      { label: "AI Agent", group: true },
      { label: "Versioned agents with a test page", cells: ["x", "y", "y"] },
      { label: "Agent Builder", cells: ["x", "y", "y"] },
      { label: "MCP tools and approvals", cells: ["x", "y", "y"] },
      { label: "Background runs with callbacks", cells: ["x", "y", "y"] },
      { label: "Tests, simulated chats, checks before publishing", cells: ["x", "y", "y"] },
      { label: "Monitoring", group: true },
      { label: "Request logs, cost, usage", cells: ["y", "y", "y"] },
      { label: "Runs, transcripts and approvals", cells: ["x", "y", "y"] },
      { label: "Log retention", cells: ["Standard", "Standard", "Per your requirements"] },
      { label: "Organization and deployment", group: true },
      { label: "Multiple teams, roles and audit log", cells: ["y", "y", "y"] },
      { label: "Deployment model", cells: ["SaaS", "SaaS", "Private deployment"] },
      { label: "Dedicated support team", cells: ["x", "x", "y"] },
    ] as { label: string; group?: boolean; cells?: string[] }[],
  },
  security: {
    eyebrow: "Security",
    h2: "Each organization's data is kept separate, down to the database",
    seals: [
      {
        h4: "Two layers keep organizations apart",
        p: "The application filters by organization, and the database enforces it again with Row-Level Security",
      },
      { h4: "Encrypted keys", p: "Provider keys are encrypted before they are stored. Apps only ever use API keys" },
      { h4: "Signed results", p: "Apps can check that results really came from AGENT8" },
      { h4: "Three permission levels", p: "org_admin, builder and viewer, with a change history" },
    ],
  },
  specs: {
    h2: "Specifications",
    items: [
      { dt: "Gateway API", dd: "`/v1/chat/completions` `/v1/embeddings` `/v1/models` `/v1/agents/{slug}/runs`" },
      { dt: "Budgets and limits", dd: "Daily, monthly or lifetime · RPM/TPM · at organization, team and key level" },
      { dt: "Providers", dd: "OpenAI, Anthropic, Gemini, OpenRouter and any service with an OpenAI-compatible API" },
      { dt: "Content filters", dd: "Personal data masking, word blocking, regex blocking, length limits · input and output" },
      { dt: "Agent", dd: "1 to 50 rounds per request (default 10) · draft / published / retired" },
      { dt: "Callback", dd: "HMAC-SHA256 in `X-Agent8-Signature`" },
      { dt: "Testing", dd: "11 check types · simulations default to 6 turns" },
      { dt: "Monitoring", dd: "6 step types · summaries by day, model, key, team, agent and source" },
      { dt: "Sign-in", dd: "OIDC · multiple organizations per user" },
      { dt: "Console", dd: "Thai and English · light and dark themes" },
    ],
  },
  faq: {
    h2: "Frequently asked questions",
    items: [
      {
        q: "How much do I need to change in my existing app?",
        a: "Apps on the OpenAI SDK change base_url to point at the gateway and use the API key AGENT8 issues in place of the provider key. To call an agent, set the model name to agent:<slug>.",
      },
      {
        q: "How are model costs charged?",
        a: "Each organization adds its own model provider keys, so model usage is paid directly to the provider. AGENT8 works out cost from the per-token prices you enter and shows it in Monitoring.",
      },
      {
        q: "What happens when a budget runs out or requests come in too fast?",
        a: "The request is rejected straight away with budget_exceeded or rate_limit_exceeded, along with when to try again. Counts are shared across servers, so limits still hold when you add more.",
      },
      {
        q: "How do I stop an agent from doing something it shouldn't?",
        a: "An agent can only use the tools you connect to it. Risky tools can need a person's approval, content filters check text going in and coming out, and new versions must pass the tests before they are published.",
      },
      {
        q: "Can Agent Builder publish an agent itself?",
        a: "No. Agent Builder can only save draft versions and run test suites. Publishing must be done by a person.",
      },
      {
        q: "Do I lose logs if log storage goes down?",
        a: "No. They are held in the database and resent once log storage is back online.",
      },
    ],
  },
  demo: {
    h2: "See an agent from first draft to final log",
    p: "Book a demo with our sales team. We use a task from your own department as the example.",
    steps: [
      "Describe the task and Agent Builder drafts the agent",
      "Run the tests and compare results with the pass rate you set",
      "Call the agent with the OpenAI SDK",
      "Open the log and cost of that same request",
    ],
  },
  footer: {
    copy: "© 2026 Beryl8 · AGENT8",
    note: "Prices reflect scope of work and exclude VAT.",
  },
  dock: {
    priceLabel: "Price",
    price: "Contact sales",
  },
};

export type Agent8Content = typeof en;

const th: Agent8Content = {
  meta: {
    title: "AGENT8",
    description: "AGENT8: สร้าง ทดสอบ และปล่อย AI Agent มี Gateway เดียวคุมโมเดลและงบ พร้อมเก็บ log ทุกคำขอ",
  },
  aria: {
    mainNav: "เมนูหลัก",
    subnav: "ส่วนของหน้า",
    dock: "แพ็กเกจที่เลือก",
  },
  nav: { features: "ผลิตภัณฑ์", uses: "การใช้งาน", plans: "แพ็กเกจ", help: "ช่วยเหลือ" },
  bookDemo: "นัดเดโม",
  hero: {
    h1Lead: "AI Agent สำหรับธุรกิจของคุณ",
    h1Em: "ที่ทดสอบก่อนใช้ และมี log ให้ย้อนดู",
    lede: "คุยเพื่อสร้าง Agent แล้วทดสอบด้วยชุดโจทย์ก่อนปล่อย จากนั้นให้แอปเรียกผ่าน Gateway เดียวที่คุมโมเดล งบ และข้อมูลส่วนบุคคล ทุกคำขอมี log พร้อมต้นทุน",
    ctaPrimary: "ดูว่าทำอะไรได้บ้าง",
    ctaSecondary: "ดูแพ็กเกจ",
    ticks: [
      "แอปที่ใช้ OpenAI SDK ย้ายมาได้โดยเปลี่ยนที่อยู่เดียว (base_url)",
      "ใช้คีย์ OpenAI, Anthropic, Gemini หรือ OpenRouter ขององค์กรเอง",
    ],
    screenAria: "ตัวอย่างบันทึกของคำขอ Agent หนึ่งรายการ",
    traceTitle: "ตรวจสถานะเคลมของลูกค้า",
    tiles: [
      { v: "5.92 s", l: "เวลารวม" },
      { v: "3 รอบ", l: "รอบ" },
      { v: "$0.031", l: "ต้นทุนคำขอนี้" },
    ],
    floatAria: "ตัวอย่าง API key พร้อมงบและสิทธิ์",
    floatBudget: "งบเดือนนี้ $412 จาก $1,000",
    floatTeam: "ทีม",
  },
  trust: {
    items: [
      { b: "Agent มีรุ่น", s: "ฉบับร่าง ผ่านการทดสอบ แล้วจึงเผยแพร่" },
      { b: "ทดสอบก่อนปล่อย", s: "รุ่นใหม่ต้องได้ผลผ่านตามเกณฑ์ที่ตั้งไว้" },
      { b: "ใช้กับแอปเดิมได้", s: "ตั้งโมเดล งบ และขีดจำกัดแยกตามคีย์" },
      { b: "บันทึกไม่หาย", s: "ที่เก็บ log ล่ม ระบบพักไว้แล้วส่งซ้ำ" },
    ],
    note: "ภาพหน้าจอในหน้านี้จำลองจาก console ของ AGENT8 ใช้ข้อมูลตัวอย่าง",
  },
  subnav: {
    how: "การทำงาน",
    features: "ฟีเจอร์",
    uses: "การใช้งาน",
    plans: "แพ็กเกจ",
    specs: "สเปก",
    faq: "คำถามที่พบบ่อย",
  },
  how: {
    eyebrow: "ทำงานอย่างไร",
    h2: "จากความต้องการ ถึง Agent ที่ผ่านการทดสอบ",
    tablistAria: "ขั้นตอนการทำงาน",
    tabs: ["สร้าง", "ทดสอบ", "เรียกใช้", "ตรวจสอบ"],
    build: {
      h3: "เล่างานที่อยากให้ทำ แล้ว Agent Builder ร่างให้",
      sub: "AI ถามความต้องการ เขียนคำสั่ง เลือกเครื่องมือ และสร้างโจทย์ทดสอบ จากนั้นบันทึกเป็นรุ่นใหม่และรันชุดทดสอบให้",
      ticks: [
        "เริ่มใหม่ หรือเปิดจาก Agent เดิมเพื่อปรับปรุง",
        "เห็นร่างและโจทย์ทดสอบระหว่างคุย",
        "คนต้องเป็นผู้กดเผยแพร่เสมอ",
      ],
      aria: "ตัวอย่างหน้า Agent Builder",
      userAv: "นภ",
      userName: "นภา",
      userText: "อยากได้ Agent ตอบลูกค้าเรื่องสถานะเคลม ใช้ระบบเคลมของเราได้ แต่ห้ามแก้ข้อมูลเคลมเอง",
      aiBefore: 'ใช้เครื่องมืออ่านอย่างเดียว 2 ตัวจาก MCP server "claims" และตั้ง',
      aiAfter: "ให้ต้องมีคนอนุมัติ พร้อมโจทย์ทดสอบ 12 ข้อ",
      logs: [
        "บันทึก support-assistant รุ่น 4 (ฉบับร่าง)",
        "เพิ่มโจทย์ 12 ข้อในชุด regression",
        "กำลังรันชุดทดสอบ…",
      ],
    },
    test: {
      h3: "รุ่นใหม่ต้องผ่านเกณฑ์ก่อนใช้งานจริง",
      sub: "ตั้งอัตราผ่านขั้นต่ำให้ชุดทดสอบ รุ่นที่ไม่ผ่านจะเผยแพร่ไม่ได้ ถ้าจำเป็นต้องปล่อย org_admin ข้ามได้โดยต้องระบุเหตุผล",
      ticks: [
        "ตรวจได้ 11 แบบ รวมถึงให้ AI ให้คะแนน",
        "บทสนทนาจำลองที่ AI รับบทลูกค้าคุยหลายรอบ",
        "ชุดทดสอบบังคับ แก้ได้เฉพาะ org_admin",
      ],
      aria: "ตัวอย่างผลทดสอบเทียบเกณฑ์",
      title: "เกณฑ์ก่อนเผยแพร่",
      chip: "เผยแพร่ได้",
      suites: [
        { name: "regression · 12 ข้อ", line: "pass rate 92% · เกณฑ์ 85%" },
        { name: "safety · 6 ข้อ", line: "pass rate 100% · เกณฑ์ 100%" },
      ],
    },
    call: {
      h3: "แอปเรียก Agent เหมือนเรียกโมเดล",
      sub: "ให้แอปใช้ API key เรียกที่อยู่แบบ OpenAI แล้วใส่ชื่อโมเดลเป็น `agent:<slug>` ถ้าเป็นงานยาว สั่งรันเบื้องหลังแล้วให้ส่งผลกลับมาที่แอปได้",
      ticks: [
        "แต่ละคีย์เรียกได้เฉพาะ Agent ที่อนุญาต",
        "ผลที่ส่งกลับมาที่แอปมีลายเซ็น (HMAC-SHA256) ให้ตรวจสอบได้",
        "ส่งตัวตนผู้ใช้ปลายทางไปถึงเครื่องมือได้",
      ],
      codeAria: "ตัวอย่างโค้ดเรียก Agent",
      codeUser: "เคลม C-20931 ถึงไหนแล้ว",
      codeCost: "ต้นทุนของคำขอนี้",
    },
    review: {
      h3: "เปิดดูทุก run ย้อนหลังได้",
      sub: "แต่ละ run มี transcript เครื่องมือที่ถูกเรียก จำนวนรอบ token และต้นทุน พร้อมลิงก์ไปที่ log ของคำขอนั้น",
      ticks: [
        "แยก run ตามที่มา: แอปจริง หน้าทดสอบ และชุดทดสอบ",
        "เห็น run ที่หยุดรออนุมัติ",
        "ยกเลิก run ที่ยังทำงานอยู่ได้",
      ],
      aria: "ตัวอย่างรายการ run",
      heads: ["Agent", "mode", "สถานะ", "ต้นทุน"],
    },
  },
  agent: {
    h2: "สร้าง ทดสอบ และปล่อย Agent ทีละขั้น",
    p: "ทุก Agent มีรุ่น มีชุดทดสอบ และกำหนดได้ว่าเครื่องมือไหนต้องให้คนอนุมัติ",
    versions: {
      ey: "รุ่นของ Agent",
      h3: "แก้กี่ครั้งก็ย้อนกลับได้",
      p: "แก้ทุกครั้งจะได้รุ่นใหม่ รุ่นเดิมยังอยู่ และแอปใช้ได้เฉพาะรุ่นที่เผยแพร่แล้ว",
      aria: "ตัวอย่างรายการรุ่นของ Agent",
      heads: ["รุ่น", "บันทึก", "ทดสอบ", "สถานะ"],
      notes: [
        "ตั้ง update_status ให้ต้องอนุมัติ",
        "ปรับน้ำเสียงให้สุภาพขึ้น",
        "เพิ่มเครื่องมือ get_documents",
        "สร้างจาก Agent Builder",
      ],
    },
    approval: {
      ey: "การอนุมัติ",
      h3: "คนอนุมัติก่อนทำงานเสี่ยง",
      p: "ถ้าเป็นเครื่องมือที่เสี่ยง Agent จะหยุดรอการอนุมัติ",
      aria: "ตัวอย่างการ์ดรออนุมัติ",
      expires: "หมดอายุใน 14 นาที",
      approve: "อนุมัติ",
      reject: "ปฏิเสธ",
    },
    small: [
      {
        h4: "เครื่องมือจาก MCP",
        p: "เพิ่ม MCP server ขององค์กร แล้ว AGENT8 จะหาเครื่องมือให้ เลือกเชื่อมกับ Agent ทีละตัว และระบุได้ว่าตัวไหนอ่านอย่างเดียว ตัวไหนแก้ข้อมูลได้",
      },
      {
        h4: "รันเบื้องหลังและ callback",
        p: "งานยาวสั่งรันเบื้องหลังได้ ผลจะส่งกลับมาที่แอปพร้อมลายเซ็น HMAC-SHA256 ดูสถานะหรือยกเลิก run ได้ทุกเมื่อ",
      },
      {
        h4: "Agent Builder",
        p: "แชตที่ AI ถามความต้องการ ร่าง Agent สร้างโจทย์ทดสอบ บันทึกรุ่นใหม่ และรันชุดทดสอบให้ ส่วนการเผยแพร่คนเป็นผู้ทำ",
      },
    ],
    eval: {
      ey: "การทดสอบและบทสนทนาจำลอง",
      h3: "แก้ทุกครั้ง ทดสอบด้วยโจทย์เดิม",
      p: "ชุดทดสอบของแต่ละ Agent มีทั้งโจทย์ถามครั้งเดียว และบทสนทนาจำลองที่ AI รับบทผู้ใช้ตามบทบาทและเป้าหมายที่ตั้งไว้",
      aria: "ตัวอย่างผลทดสอบรายข้อ",
      heads: ["โจทย์", "เงื่อนไข", "ผล"],
      rows: [
        "ถามสถานะเคลมที่มีอยู่",
        "ลูกค้าหงุดหงิด · บทสนทนาจำลอง 6 รอบ",
        "ขอให้แก้สถานะเคลมเอง",
        "ตอบเป็น JSON ให้ระบบอื่น",
      ],
      pass: "ผ่าน",
      fail: "ไม่ผ่าน",
    },
    checks: {
      ey: "แบบการตรวจ",
      h3: "11 แบบ",
      ticks: [
        "contains, equals, regex, json_valid",
        "เรียกหรือไม่เรียกเครื่องมือ",
        "ให้ AI ให้คะแนนตามเกณฑ์",
        "ต้นทุนและเวลาไม่เกินที่กำหนด",
        "สร้างโจทย์ทดสอบอัตโนมัติ",
      ],
    },
  },
  gateway: {
    h2: "Gateway เดียวสำหรับทุกโมเดลและทุก Agent",
    p: "ก่อนถึงโมเดล Gateway จะตรวจคีย์ สิทธิ์ งบ ขีดจำกัดการเรียก และตัวกรองข้อความทุกคำขอ",
    keys: {
      ey: "ทีมและ API key",
      h3: "แจกคีย์ให้แต่ละแอป คุมงบได้รายทีม",
      p: "ตั้งขีดจำกัดได้สามระดับ คือองค์กร ทีม และคีย์ แต่ละระดับกำหนดโมเดลและ Agent ที่ใช้ได้ ตั้งงบรายวัน รายเดือน หรือรวม และจำกัดคำขอกับ token ต่อนาที (RPM/TPM)",
      aria: "ตัวอย่างรายการ API key",
      heads: ["คีย์", "ทีม", "งบเดือนนี้", "RPM"],
    },
    guard: {
      ey: "ตัวกรองข้อความ",
      h3: "ซ่อนข้อมูลส่วนบุคคล",
      p: "ตรวจทั้งข้อความที่เข้าและที่ออก ลองกับข้อความตัวอย่างก่อนใช้จริง",
      aria: "ตัวอย่างการลองตัวกรองข้อความ",
      inLabel: "ข้อความเข้า",
      outLabel: "ส่งต่อให้โมเดล",
      intro: "ผม",
      name: "สมชาย",
      idLabel: "เลขบัตร",
      phoneLabel: "โทร",
      count: "2 รายการ",
    },
    small: [
      {
        h4: "API แบบ OpenAI",
        p: "chat completions, embeddings และ models รองรับ streaming ทุก response ระบุรหัส log โมเดลที่ใช้ และต้นทุน",
      },
      {
        h4: "ผู้ให้บริการและโมเดลสำรอง",
        p: "เพิ่มคีย์ OpenAI, Anthropic, Gemini, OpenRouter หรือบริการแบบ OpenAI ตั้งชื่อโมเดลเอง กด Test ตรวจว่าเรียกเครื่องมือได้ และตั้งโมเดลสำรอง",
      },
      {
        h4: "คีย์เข้ารหัส นับแม่นยำ",
        p: "คีย์ผู้ให้บริการเข้ารหัสก่อนเก็บ API key แสดงครั้งเดียว ตัวนับงบและขีดจำกัดการเรียกใช้ร่วมกันทุกเครื่อง",
      },
    ],
  },
  observation: {
    h2: "ทุกคำตอบมี log ย้อนดูได้",
    p: "ดูได้ว่าใครเรียก Agent รุ่นไหน ใช้โมเดลอะไร เรียกเครื่องมืออะไร และเสียเงินเท่าไร",
    trace: {
      ey: "log คำขอ",
      h3: "ค้นและเปิดดูทุกคำขอ",
      p: "แต่ละคำขอแยกเป็นขั้น คือ request, agent, คำตอบของโมเดล, เครื่องมือ, ตัวกรองข้อความ และการทดสอบ กรองตามช่วงเวลา Agent คีย์ สถานะ และแหล่งที่มา",
      aria: "ตัวอย่างรายการlog คำขอ",
      segAll: "ทั้งหมด",
      count: "1,284 รายการ",
      heads: ["เวลา", "Agent / โมเดล", "source", "สถานะ", "ต้นทุน"],
    },
    cost: {
      ey: "ต้นทุน",
      h3: "ดูว่าเงินหมดไปกับอะไร",
      p: "แยกตามวัน โมเดล คีย์ ทีม Agent หรือแหล่งที่มา",
      aria: "ตัวอย่างต้นทุนแยกตามโมเดล",
      seg: ["วัน", "โมเดล", "ทีม", "Agent"],
    },
    small: [
      {
        h4: "log ไม่หาย",
        p: "ถ้าที่เก็บ log ใช้งานไม่ได้ ระบบจะพักไว้ในฐานข้อมูล แล้วส่งซ้ำเมื่อกลับมา",
      },
      {
        h4: "รู้ว่าผู้ใช้ปลายทางคือใคร",
        p: "เมื่อแอปส่ง token ของผู้ใช้มาด้วย log จะระบุว่าคำขอนั้นมาจากใคร",
      },
      {
        h4: "Audit log",
        p: "ทุกการเปลี่ยนแปลงในองค์กร เช่น คีย์ โมเดล และการเผยแพร่ มีบันทึกว่าใครทำ เมื่อไร",
      },
    ],
  },
  uses: {
    eyebrow: "การใช้งาน",
    h2: "สำหรับงานที่ต้องแสดงได้ว่า AI ทำอะไรไป",
    items: [
      { h4: "หลายแอป Gateway เดียว", p: "ให้ทุกแอปเรียกผ่าน Gateway เดียว แยกคีย์และงบรายทีม แล้วดูต้นทุนรายแอป" },
      { h4: "Agent บริการลูกค้า", p: "อ่านข้อมูลจากระบบภายในผ่าน MCP ตอบลูกค้า และขออนุมัติก่อนแก้ข้อมูลจริง" },
      { h4: "งานที่ต้องมีหลักฐาน", p: "ทุกการแก้คำสั่งหรือเปลี่ยนโมเดลต้องผ่านชุดทดสอบเดิม และมีบันทึกว่าใครปล่อย" },
      { h4: "ข้อมูลส่วนบุคคล", p: "ซ่อนเลขบัตรประชาชน เบอร์โทร และอีเมลก่อนส่งไปโมเดล และตรวจย้อนหลังได้จาก log ของคำขอ" },
    ],
  },
  plans: {
    eyebrow: "แพ็กเกจ",
    h2: "เลือกแพ็กเกจที่เหมาะกับองค์กร",
    p: "ทุกแพ็กเกจใช้คีย์ผู้ให้บริการโมเดลขององค์กรเอง ค่าโมเดลจ่ายตรงกับผู้ให้บริการ",
    gateway: {
      big: "คุมการใช้โมเดลทั้งองค์กร",
      for: "สำหรับองค์กรที่มีแอป AI ใช้งานอยู่แล้ว",
      btn: "เลือก Gateway",
      inc: "รวมในแพ็กเกจ",
      ticks: [
        "API แบบ OpenAI และ streaming",
        "ทีม API key งบ และ RPM/TPM",
        "โมเดลสำรอง",
        "ตัวกรองข้อความและซ่อนข้อมูลส่วนบุคคล",
        "log คำขอและต้นทุน",
      ],
    },
    agent: {
      badge: "แนะนำ · รวมทุกอย่าง",
      big: "สร้างและปล่อย Agent",
      for: "สำหรับทีมที่จะใช้ Agent กับงานจริง",
      inc: "ทุกอย่างใน Gateway และ",
      ticks: [
        "Agent ที่มีรุ่นและหน้าทดสอบ",
        "Agent Builder",
        "เครื่องมือจาก MCP และการอนุมัติ",
        "รันเบื้องหลังพร้อม callback",
        "การทดสอบ บทสนทนาจำลอง และเกณฑ์ก่อนเผยแพร่",
      ],
    },
    dedicated: {
      big: "กรุณาติดต่อทีมขาย",
      for: "สำหรับองค์กรที่ต้องการระบบแยกของตัวเอง",
      btn: "ติดต่อทีมขาย",
      inc: "ทุกอย่างใน Agent และ",
      ticks: ["ติดตั้งแยกบน cloud project ของคุณเอง", "ระยะเก็บ log ตามข้อกำหนด", "ทีมซัพพอร์ตเฉพาะ"],
    },
    desc: {
      Gateway: "AI Gateway · ตัวกรองข้อความ · Monitoring",
      Agent: "Agent · Gateway · Monitoring",
      Dedicated: "ระบบแยกเฉพาะองค์กร · ขอบเขตตามสัญญา",
    },
    note: "ราคาประเมินตามจำนวนทีมและปริมาณการใช้งาน · ยังไม่รวม VAT 7% · ขอบเขตแพ็กเกจเป็นร่างเพื่อหารือ",
    cmpH: "เปรียบเทียบแพ็กเกจ",
    cmpHead: {
      gatewayPp: "ติดต่อทีมขาย",
      gatewayBtn: "เลือก",
      agentPp: "แนะนำ",
      dedicatedPp: "ตามสัญญา",
      dedicatedBtn: "ติดต่อทีมขาย",
    },
    cmpRows: [
      { label: "AI Gateway", group: true },
      { label: "API แบบ OpenAI และ streaming", cells: ["y", "y", "y"] },
      { label: "ทีม, API key, งบ, RPM/TPM", cells: ["y", "y", "y"] },
      { label: "โมเดลสำรอง", cells: ["y", "y", "y"] },
      { label: "ตัวกรองข้อความ", cells: ["y", "y", "y"] },
      { label: "AI Agent", group: true },
      { label: "Agent ที่มีรุ่นและหน้าทดสอบ", cells: ["x", "y", "y"] },
      { label: "Agent Builder", cells: ["x", "y", "y"] },
      { label: "เครื่องมือจาก MCP และการอนุมัติ", cells: ["x", "y", "y"] },
      { label: "รันเบื้องหลังพร้อม callback", cells: ["x", "y", "y"] },
      { label: "การทดสอบ, บทสนทนาจำลอง, เกณฑ์ก่อนเผยแพร่", cells: ["x", "y", "y"] },
      { label: "Monitoring", group: true },
      { label: "log คำขอ, ต้นทุน, การใช้งาน", cells: ["y", "y", "y"] },
      { label: "Run, transcript และการอนุมัติ", cells: ["x", "y", "y"] },
      { label: "ระยะเก็บ log", cells: ["มาตรฐาน", "มาตรฐาน", "ตามข้อกำหนด"] },
      { label: "องค์กรและการติดตั้ง", group: true },
      { label: "หลายทีม role และ audit log", cells: ["y", "y", "y"] },
      { label: "รูปแบบการติดตั้ง", cells: ["SaaS", "SaaS", "แยกเฉพาะองค์กร"] },
      { label: "ทีมซัพพอร์ตเฉพาะ", cells: ["x", "x", "y"] },
    ],
  },
  security: {
    eyebrow: "ความปลอดภัย",
    h2: "ข้อมูลแต่ละองค์กรแยกกันตั้งแต่ระดับฐานข้อมูล",
    seals: [
      { h4: "แยกองค์กรสองชั้น", p: "โค้ดกรองตามองค์กร และฐานข้อมูลบังคับซ้ำด้วย Row-Level Security" },
      { h4: "คีย์เข้ารหัส", p: "คีย์ผู้ให้บริการเข้ารหัสก่อนเก็บ แอปใช้เพียง API key" },
      { h4: "ผลมีลายเซ็น", p: "แอปตรวจได้ว่าผลที่ได้รับมาจาก AGENT8 จริง" },
      { h4: "สิทธิ์ 3 ระดับ", p: "org_admin, builder และ viewer พร้อมประวัติการเปลี่ยนแปลง" },
    ],
  },
  specs: {
    h2: "สเปก",
    items: [
      { dt: "Gateway API", dd: "`/v1/chat/completions` `/v1/embeddings` `/v1/models` `/v1/agents/{slug}/runs`" },
      { dt: "งบและ limit", dd: "รายวัน รายเดือน หรือรวม · RPM/TPM · ระดับองค์กร ทีม และคีย์" },
      { dt: "ผู้ให้บริการ", dd: "OpenAI, Anthropic, Gemini, OpenRouter และบริการที่ใช้ API แบบ OpenAI" },
      { dt: "ตัวกรองข้อความ", dd: "ซ่อนข้อมูลส่วนบุคคล, บล็อกคำ, บล็อกตาม regex, จำกัดความยาว · ขาเข้าและขาออก" },
      { dt: "Agent", dd: "1 ถึง 50 รอบต่อคำขอ (ค่าเริ่มต้น 10) · draft / published / retired" },
      { dt: "Callback", dd: "HMAC-SHA256 ใน `X-Agent8-Signature`" },
      { dt: "Testing", dd: "เงื่อนไขตรวจ 11 แบบ · การจำลองค่าเริ่มต้น 6 รอบ" },
      { dt: "Monitoring", dd: "ขั้นตอน 6 ชนิด · สรุปตามวัน โมเดล คีย์ ทีม Agent แหล่งที่มา" },
      { dt: "การเข้าสู่ระบบ", dd: "OIDC · หลายองค์กรต่อผู้ใช้หนึ่งคน" },
      { dt: "Console", dd: "ภาษาไทยและอังกฤษ · ธีมสว่างและมืด" },
    ],
  },
  faq: {
    h2: "คำถามที่พบบ่อย",
    items: [
      {
        q: "แอปเดิมต้องแก้โค้ดมากไหม",
        a: "แอปที่ใช้ OpenAI SDK เปลี่ยน base_url ให้ชี้มาที่ Gateway และใช้ API key ที่ AGENT8 ออกให้แทนคีย์ของผู้ให้บริการ ถ้าจะเรียก Agent ให้ใส่ชื่อโมเดลเป็น agent:<slug>",
      },
      {
        q: "ค่าโมเดลคิดอย่างไร",
        a: "แต่ละองค์กรใส่คีย์ผู้ให้บริการโมเดลของตัวเอง ค่าโมเดลจึงจ่ายตรงกับผู้ให้บริการ AGENT8 คำนวณต้นทุนจากราคาต่อ token ที่คุณตั้งไว้ และแสดงในหน้า Monitoring",
      },
      {
        q: "ใช้งบหมดหรือเรียกถี่เกินจะเกิดอะไรขึ้น",
        a: "ระบบปฏิเสธคำขอทันทีพร้อมรหัส budget_exceeded หรือ rate_limit_exceeded และบอกเวลาที่ลองใหม่ได้ ตัวนับใช้ร่วมกันทุกเครื่อง จึงไม่เกินเพดานแม้เพิ่มจำนวนเครื่อง",
      },
      {
        q: "ป้องกันไม่ให้ Agent ทำสิ่งที่ไม่ควรทำได้อย่างไร",
        a: "Agent ใช้ได้เฉพาะเครื่องมือที่คุณเชื่อมให้ เครื่องมือที่เสี่ยงตั้งให้ต้องมีคนอนุมัติได้ ตัวกรองข้อความตรวจทั้งข้อความที่เข้าและที่ออก และรุ่นใหม่ต้องผ่านชุดทดสอบก่อนเผยแพร่",
      },
      {
        q: "Agent Builder เผยแพร่ Agent เองได้ไหม",
        a: "ไม่ได้ Agent Builder บันทึกได้แค่รุ่นฉบับร่างและสั่งรันชุดทดสอบ การเผยแพร่ต้องทำโดยคน",
      },
      {
        q: "ถ้าที่เก็บบันทึกล่ม log จะหายไหม",
        a: "ไม่หาย ระบบจะพักไว้ในฐานข้อมูลแล้วส่งซ้ำเมื่อที่เก็บบันทึกกลับมาทำงาน",
      },
    ],
  },
  demo: {
    h2: "ดู Agent ตั้งแต่ฉบับร่างจนถึง log ของคำขอจริง",
    p: "นัดเดโมกับทีมขาย เราใช้โจทย์งานของหน่วยงานคุณเป็นตัวอย่าง",
    steps: [
      "เล่างานให้ Agent Builder ร่าง Agent ให้",
      "รันชุดทดสอบและดูผลเทียบเกณฑ์",
      "เรียก Agent ด้วย OpenAI SDK",
      "เปิด log และต้นทุนของคำขอเดียวกัน",
    ],
  },
  footer: {
    copy: "© 2026 Beryl8 · AGENT8",
    note: "ราคาแสดงตามขอบเขตงาน ยังไม่รวมภาษีมูลค่าเพิ่ม",
  },
  dock: {
    priceLabel: "ราคา",
    price: "ติดต่อทีมขาย",
  },
};

const content: Record<Locale, Agent8Content> = { en, th };

export const getAgent8Content = (lang: Locale): Agent8Content => content[lang];
