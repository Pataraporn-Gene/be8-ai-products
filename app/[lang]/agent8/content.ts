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
    description: "AGENT8: build, test and release AI agents through an AI Gateway, with full observation.",
  },
  aria: {
    mainNav: "Main menu",
    subnav: "Page sections",
    dock: "Selected plan",
  },
  nav: { features: "Product", uses: "Use cases", plans: "Plans", help: "Help" },
  bookDemo: "Book a demo",
  hero: {
    h1Lead: "Enterprise AI agents,",
    h1Em: "tested before release and traceable at every step",
    lede: "Describe an agent in conversation, test it against a task suite before release, then let apps call it through an AI Gateway that governs models, budgets and personal data. Every step is recorded as a trace, with cost.",
    ctaPrimary: "See what it does",
    ctaSecondary: "View plans",
    ticks: [
      "Apps built on the OpenAI SDK migrate by changing base_url",
      "Use your organization's own OpenAI, Anthropic, Gemini or OpenRouter keys",
    ],
    screenAria: "Sample trace for a single agent request",
    traceTitle: "Check a customer's claim status",
    tiles: [
      { v: "5.92 s", l: "Total time" },
      { v: "3 rounds", l: "iterations" },
      { v: "$0.031", l: "Cost of this request" },
    ],
    floatAria: "Sample virtual key with budget and permissions",
    floatBudget: "This month's budget: $412 of $1,000",
    floatTeam: "Team",
  },
  trust: {
    items: [
      { b: "Versioned agents", s: "draft → tested → publish" },
      { b: "Tested before release", s: "A pass-rate threshold every new version must clear" },
      { b: "OpenAI-compatible gateway", s: "Models, budgets and guardrails controlled per key" },
      { b: "No lost logs", s: "If trace storage goes down, spans are held and resent" },
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
      sub: "The AI interviews you on requirements, writes the system prompt, selects tools and generates test tasks, then saves a new version and runs the test suite.",
      ticks: [
        "Start fresh, or open an existing agent to improve it",
        "See the draft and test tasks as you talk",
        "Publishing always requires a person",
      ],
      aria: "Sample Agent Builder screen",
      userAv: "NP",
      userName: "Napa",
      userText:
        "I want an agent that answers customers about claim status. It can use our claims system, but must never change claim data itself.",
      aiBefore: 'Uses 2 read-only tools from the "claims" MCP server and sets',
      aiAfter: "to require approval, with 12 test tasks",
      logs: [
        "✓ Saved support-assistant version 4 (draft)",
        "✓ Added 12 tasks to the regression suite",
        "→ Running the test suite…",
      ],
    },
    test: {
      h3: "New versions must meet the bar before going live",
      sub: "Set a minimum pass rate for each test suite. The system will not publish a version that fails. When a release is essential, an org_admin can override it with a stated reason.",
      ticks: [
        "11 check types, including LLM-graded scoring",
        "Simulations where an LLM plays the user over multiple turns",
        "Gating test suites can only be edited by org_admin",
      ],
      aria: "Sample test results against thresholds",
      title: "Pre-publish gates",
      chip: "Ready to publish",
      suites: [
        { name: "regression · 12 tasks", line: "pass rate 92% · threshold 85%" },
        { name: "safety · 6 tasks", line: "pass rate 100% · threshold 100%" },
      ],
    },
    call: {
      h3: "Apps call an agent just like a model",
      sub: "Use a virtual key with the OpenAI-compatible endpoint and set the model name to `agent:<slug>`, or run it in the background and receive the result via callback.",
      ticks: [
        "Keys can only call the agents they are allowed to",
        "Callbacks are signed with HMAC-SHA256",
        "End-user identity can be passed through to tools",
      ],
      codeAria: "Sample code for calling an agent",
      codeUser: "Where is claim C-20931 now?",
      codeCost: "cost of this request",
    },
    review: {
      h3: "Open any past run",
      sub: "Each run includes the transcript, tools called, iteration count, tokens and cost, with a link to that request's trace.",
      ticks: [
        "Runs separated by source: production apps, test page, eval and simulation",
        "See runs paused for approval",
        "Cancel runs that are still in progress",
      ],
      aria: "Sample run list",
      heads: ["Agent", "mode", "Status", "Cost"],
    },
  },
  agent: {
    h2: "Build, test and release agents with a defined process",
    p: "Every agent is versioned, has a test suite, and lets you specify which tools require human approval.",
    versions: {
      ey: "Agent versions",
      h3: "Roll back after any number of edits",
      p: "Every edit creates a new version, earlier versions are kept, and apps only see published versions.",
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
      h3: "A person decides before it acts",
      p: "For risky tools, the agent must pause and wait for human approval.",
      aria: "Sample pending approval card",
      expires: "Expires in 14 minutes",
      approve: "Approve",
      reject: "Reject",
    },
    small: [
      {
        h4: "Tools from MCP",
        p: "Register your organization's MCP servers, let the system discover their tools, then bind them to an agent one at a time, each marked as read-only or write.",
      },
      {
        h4: "Background runs and callbacks",
        p: "Submit long-running jobs and receive results via a callback signed with HMAC-SHA256. Check status and cancel runs at any time.",
      },
      {
        h4: "Agent Builder",
        p: "A chat in which the AI interviews you on requirements, drafts the agent, generates test tasks, saves a new version and runs the test suite. Publishing is left to a person.",
      },
    ],
    eval: {
      ey: "Eval and simulation",
      h3: "Measure every change against the same tasks",
      p: "Each agent's test suite supports both single-question tasks and simulations in which an LLM plays a user with a defined role and goal.",
      aria: "Sample per-task eval results",
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
        "LLM scoring against a rubric",
        "Cost and latency within set limits",
        "Automatic test task generation",
      ],
    },
  },
  gateway: {
    h2: "One gateway for every model and every agent",
    p: "Every request is checked for key, permissions, budget, rate limit and guardrails before it reaches a model.",
    keys: {
      ey: "Teams and virtual keys",
      h3: "Issue a key per app, control budgets per team",
      p: "Organization → team → key. Each level can restrict models, agents, daily, monthly or lifetime budgets, and RPM/TPM.",
      aria: "Sample list of virtual keys",
      heads: ["Key", "Team", "This month's budget", "RPM"],
    },
    guard: {
      ey: "Guardrails",
      h3: "Mask personal data",
      p: "Checks both input and output. Try it on sample text before going live.",
      aria: "Sample guardrail test",
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
        p: "Chat completions, embeddings and models, with streaming support. Every response reports the trace ID, the model used and the cost.",
      },
      {
        h4: "Providers and fallback models",
        p: "Add keys for OpenAI, Anthropic, Gemini, OpenRouter or any OpenAI-compatible service, name your own models, press Test to verify tool calling, and set fallback models.",
      },
      {
        h4: "Secure keys, accurate counts",
        p: "Provider keys are encrypted before storage, virtual keys are shown only once, and budget and rate-limit counters are shared across every instance.",
      },
    ],
  },
  observation: {
    h2: "Evidence behind every answer",
    p: "Know who called which agent version, which model it used, which tools it called and what it cost.",
    trace: {
      ey: "Trace",
      h3: "Search and open any request",
      p: "Spans are split into request, agent, generation, tool, guardrail and eval. Filter by time range, agent, key, status and source.",
      aria: "Sample trace list",
      segAll: "All",
      count: "1,284 records",
      heads: ["Time", "Agent / model", "source", "Status", "Cost"],
    },
    cost: {
      ey: "Cost",
      h3: "Viewed from every angle",
      p: "Break down by day, model, key, team, agent or source.",
      aria: "Sample cost by model",
      seg: ["Day", "Model", "Team", "Agent"],
    },
    small: [
      {
        h4: "No lost logs",
        p: "If trace storage is unavailable, spans are held in the database and resent once it recovers.",
      },
      {
        h4: "Know the end user",
        p: "When an app passes along the user's token, the trace records who made the request.",
      },
      {
        h4: "Audit log",
        p: "Every change in the organization, such as keys, models and publishing, records who made it and when.",
      },
    ],
  },
  uses: {
    eyebrow: "Use cases",
    h2: "For work where you must account for what the AI did",
    items: [
      {
        h4: "Many LLM-powered apps",
        p: "Route every app through one gateway, separate keys and budgets by team, and see cost per app.",
      },
      {
        h4: "Customer service agents",
        p: "Read data from internal systems via MCP, answer customers, and request approval before changing real data.",
      },
      {
        h4: "Work that needs an audit trail",
        p: "Every prompt edit or model change must pass the existing test suite, with a record of who released it.",
      },
      {
        h4: "Personal data",
        p: "Mask national ID numbers, phone numbers and email addresses before they reach the model, and review afterwards from the trace.",
      },
    ],
  },
  plans: {
    eyebrow: "Plans",
    h2: "Choose the plan that fits your organization",
    p: "Every plan uses your organization's own model provider keys. Model usage is paid directly to the provider.",
    gateway: {
      big: "Control every model call",
      for: "For organizations already running LLM apps",
      btn: "Choose Gateway",
      inc: "Included",
      ticks: [
        "OpenAI-compatible API and streaming",
        "Teams, virtual keys, budgets and RPM/TPM",
        "Fallback models",
        "Guardrails and personal data masking",
        "Traces and cost",
      ],
    },
    agent: {
      badge: "Recommended · Complete platform",
      big: "Build and release agents",
      for: "For teams putting agents into real work",
      inc: "Everything in Gateway, plus",
      ticks: [
        "Versioned agents with a test page",
        "Agent Builder",
        "MCP tools and approvals",
        "Background runs with callbacks",
        "Eval, simulation and pre-publish gates",
      ],
    },
    dedicated: {
      big: "Contact sales",
      for: "For organizations that need their own isolated deployment",
      btn: "Contact sales",
      inc: "Everything in Agent, plus",
      ticks: [
        "Isolated deployment in the customer's cloud project",
        "Trace retention to your requirements",
        "Dedicated support team",
      ],
    },
    desc: {
      Gateway: "AI Gateway · Guardrails · Observation",
      Agent: "Agent · Gateway · Observation, the complete platform",
      Dedicated: "Dedicated deployment · Scope per contract",
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
      { label: "Teams, virtual keys, budgets, RPM/TPM", cells: ["y", "y", "y"] },
      { label: "Fallback models", cells: ["y", "y", "y"] },
      { label: "Guardrails", cells: ["y", "y", "y"] },
      { label: "AI Agent", group: true },
      { label: "Versioned agents with a test page", cells: ["x", "y", "y"] },
      { label: "Agent Builder", cells: ["x", "y", "y"] },
      { label: "MCP tools and approvals", cells: ["x", "y", "y"] },
      { label: "Background runs with callbacks", cells: ["x", "y", "y"] },
      { label: "Eval, simulation, pre-publish gates", cells: ["x", "y", "y"] },
      { label: "Observation", group: true },
      { label: "Traces, cost, usage", cells: ["y", "y", "y"] },
      { label: "Runs, transcripts and approvals", cells: ["x", "y", "y"] },
      { label: "Trace retention", cells: ["Standard", "Standard", "Per your requirements"] },
      { label: "Organization and deployment", group: true },
      { label: "Multiple teams, roles and audit log", cells: ["y", "y", "y"] },
      { label: "Deployment model", cells: ["SaaS", "SaaS", "Dedicated to your organization"] },
      { label: "Dedicated support team", cells: ["x", "x", "y"] },
    ] as { label: string; group?: boolean; cells?: string[] }[],
  },
  security: {
    eyebrow: "Security",
    h2: "Each organization's data is isolated down to the database",
    seals: [
      {
        h4: "Two layers of tenant isolation",
        p: "Application code filters by organization, and the database enforces it again with Row-Level Security",
      },
      { h4: "Encrypted keys", p: "Provider keys are encrypted before storage. Apps only ever use virtual keys" },
      { h4: "Signed callbacks", p: "Apps can verify that results genuinely came from AGENT8" },
      { h4: "Three permission levels", p: "org_admin, builder and viewer, with an audit log" },
    ],
  },
  specs: {
    h2: "Specifications",
    items: [
      { dt: "Gateway API", dd: "`/v1/chat/completions` `/v1/embeddings` `/v1/models` `/v1/agents/{slug}/runs`" },
      { dt: "Budgets and limits", dd: "Daily, monthly or lifetime · RPM/TPM · at organization, team and key level" },
      { dt: "Providers", dd: "OpenAI, Anthropic, Gemini, OpenRouter and any service with an OpenAI-compatible API" },
      { dt: "Guardrails", dd: "PII masking, word blocking, regex blocking, length limits · input and output" },
      { dt: "Agent", dd: "1–50 iterations per request (default 10) · draft / published / retired" },
      { dt: "Callback", dd: "HMAC-SHA256 in `X-Agent8-Signature`" },
      { dt: "Eval", dd: "11 check types · simulations default to 6 turns" },
      { dt: "Observation", dd: "6 span types · summaries by day, model, key, team, agent and source" },
      { dt: "Sign-in", dd: "OIDC · multiple organizations per user" },
      { dt: "Console", dd: "Thai and English · light and dark themes" },
    ],
  },
  faq: {
    h2: "Frequently asked questions",
    items: [
      {
        q: "How much code do existing apps need to change?",
        a: "Apps on the OpenAI SDK change base_url to point at the gateway and swap the existing API key for a virtual key. To call an agent, set the model name to agent:<slug>.",
      },
      {
        q: "How are model costs charged?",
        a: "Each organization adds its own model provider keys, so model usage is paid directly to the provider. AGENT8 calculates cost from the per-token prices you configure and shows it in Observation.",
      },
      {
        q: "What happens when a budget runs out or requests come in too fast?",
        a: "The gateway rejects the request immediately with budget_exceeded or rate_limit_exceeded and indicates when to retry. Counters are shared across every instance, so limits hold as the system scales out.",
      },
      {
        q: "How do you stop an agent from doing what it shouldn't?",
        a: "An agent can only use tools bound to it one by one. Risky tools can be set to require human approval, guardrails check both input and output, and new versions must pass the test suite before publish.",
      },
      {
        q: "Can Agent Builder publish an agent itself?",
        a: "No. Agent Builder can only save draft versions and run test suites. Publishing must be done by a person.",
      },
      {
        q: "If trace storage goes down, are logs lost?",
        a: "No. Spans are held in the database and resent once trace storage is back online.",
      },
    ],
  },
  demo: {
    h2: "See your agent from first draft to trace",
    p: "Book a demo with our sales team. We use a task from your own department as the example.",
    steps: [
      "Describe the task so Agent Builder can draft the agent",
      "Run the test suite and compare results against thresholds",
      "Call the agent through the gateway with the OpenAI SDK",
      "Open the trace and cost of that same request",
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
    description: "AGENT8: สร้าง ทดสอบ และปล่อย AI Agent ผ่าน AI Gateway พร้อม Observation",
  },
  aria: {
    mainNav: "เมนูหลัก",
    subnav: "ส่วนของหน้า",
    dock: "แพ็กเกจที่เลือก",
  },
  nav: { features: "ผลิตภัณฑ์", uses: "การใช้งาน", plans: "แพ็กเกจ", help: "ช่วยเหลือ" },
  bookDemo: "นัดเดโม",
  hero: {
    h1Lead: "AI Agent ขององค์กร",
    h1Em: "ที่ทดสอบก่อนใช้ และตรวจสอบได้ทุกขั้น",
    lede: "คุยเพื่อสร้าง Agent ทดสอบด้วยชุดโจทย์ก่อนปล่อย แล้วให้แอปเรียกผ่าน AI Gateway ที่คุมโมเดล งบ และข้อมูลส่วนบุคคล ทุกขั้นถูกบันทึกเป็น trace พร้อมต้นทุน",
    ctaPrimary: "ดูว่าทำอะไรได้บ้าง",
    ctaSecondary: "ดูแพ็กเกจ",
    ticks: [
      "แอปที่ใช้ OpenAI SDK ย้ายมาได้ด้วยการเปลี่ยน base_url",
      "ใช้คีย์ OpenAI, Anthropic, Gemini หรือ OpenRouter ขององค์กรเอง",
    ],
    screenAria: "ตัวอย่าง trace ของ Agent หนึ่งคำขอ",
    traceTitle: "ตรวจสถานะเคลมของลูกค้า",
    tiles: [
      { v: "5.92 s", l: "เวลารวม" },
      { v: "3 รอบ", l: "iterations" },
      { v: "$0.031", l: "ต้นทุนคำขอนี้" },
    ],
    floatAria: "ตัวอย่าง virtual key พร้อมงบและสิทธิ์",
    floatBudget: "งบเดือนนี้ $412 จาก $1,000",
    floatTeam: "ทีม",
  },
  trust: {
    items: [
      { b: "Agent มีรุ่น", s: "draft → ผ่านการทดสอบ → publish" },
      { b: "ทดสอบก่อนปล่อย", s: "เกณฑ์ pass rate ที่รุ่นใหม่ต้องผ่าน" },
      { b: "Gateway แบบ OpenAI", s: "คุมโมเดล งบ และ guardrail ต่อคีย์" },
      { b: "Log ไม่หาย", s: "ที่เก็บ trace ล่ม ระบบพักไว้แล้วส่งซ้ำ" },
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
      sub: "AI สัมภาษณ์ความต้องการ เขียน system prompt เลือกเครื่องมือ และสร้างโจทย์ทดสอบ จากนั้นบันทึกเป็นรุ่นใหม่และสั่งรันชุดทดสอบให้",
      ticks: [
        "เริ่มใหม่ หรือเปิดจาก Agent เดิมเพื่อปรับปรุง",
        "เห็นร่างและโจทย์ทดสอบระหว่างคุย",
        "การ publish ต้องทำโดยคนเสมอ",
      ],
      aria: "ตัวอย่างหน้า Agent Builder",
      userAv: "นภ",
      userName: "นภา",
      userText: "อยากได้ Agent ตอบลูกค้าเรื่องสถานะเคลม ใช้ระบบเคลมของเราได้ แต่ห้ามแก้ข้อมูลเคลมเอง",
      aiBefore: 'ใช้เครื่องมืออ่านอย่างเดียว 2 ตัวจาก MCP server "claims" และตั้ง',
      aiAfter: "ให้ต้องมีคนอนุมัติ พร้อมโจทย์ทดสอบ 12 ข้อ",
      logs: [
        "✓ บันทึก support-assistant รุ่น 4 (draft)",
        "✓ เพิ่มโจทย์ 12 ข้อในชุด regression",
        "→ กำลังรันชุดทดสอบ…",
      ],
    },
    test: {
      h3: "รุ่นใหม่ต้องผ่านเกณฑ์ก่อนใช้งานจริง",
      sub: "ตั้ง pass rate ขั้นต่ำให้ชุดทดสอบ ระบบไม่ยอม publish รุ่นที่ไม่ผ่าน ถ้าจำเป็นต้องปล่อย org_admin ข้ามได้โดยต้องระบุเหตุผล",
      ticks: [
        "เงื่อนไขตรวจ 11 แบบ รวมถึงให้ LLM ให้คะแนน",
        "simulation ให้ LLM สวมบทผู้ใช้คุยหลายรอบ",
        "ชุดทดสอบที่เป็นเกณฑ์ แก้ได้เฉพาะ org_admin",
      ],
      aria: "ตัวอย่างผลทดสอบเทียบเกณฑ์",
      title: "เกณฑ์ก่อน publish",
      chip: "publish ได้",
      suites: [
        { name: "regression · 12 ข้อ", line: "pass rate 92% · เกณฑ์ 85%" },
        { name: "safety · 6 ข้อ", line: "pass rate 100% · เกณฑ์ 100%" },
      ],
    },
    call: {
      h3: "แอปเรียก Agent เหมือนเรียกโมเดล",
      sub: "ใช้ virtual key กับ endpoint แบบ OpenAI แล้วใส่ชื่อโมเดลเป็น `agent:<slug>` หรือสั่งรันเบื้องหลังแล้วรับผลทาง callback",
      ticks: [
        "คีย์เรียกได้เฉพาะ Agent ที่อนุญาตไว้",
        "callback ลงลายเซ็น HMAC-SHA256",
        "ส่งตัวตนผู้ใช้ปลายทางไปถึงเครื่องมือได้",
      ],
      codeAria: "ตัวอย่างโค้ดเรียก Agent",
      codeUser: "เคลม C-20931 ถึงไหนแล้ว",
      codeCost: "ต้นทุนของคำขอนี้",
    },
    review: {
      h3: "เปิดดูทุก run ย้อนหลังได้",
      sub: "แต่ละ run มี transcript เครื่องมือที่ถูกเรียก จำนวนรอบ token และต้นทุน พร้อมลิงก์ไปยัง trace ของคำขอนั้น",
      ticks: [
        "แยก run จากแอปจริง หน้าทดสอบ eval และ simulation",
        "เห็น run ที่หยุดรออนุมัติ",
        "ยกเลิก run ที่ยังทำงานอยู่ได้",
      ],
      aria: "ตัวอย่างรายการ run",
      heads: ["Agent", "mode", "สถานะ", "ต้นทุน"],
    },
  },
  agent: {
    h2: "สร้าง ทดสอบ และปล่อย Agent อย่างมีขั้นตอน",
    p: "ทุก Agent มีรุ่น มีชุดทดสอบ และกำหนดได้ว่าเครื่องมือไหนต้องให้คนอนุมัติ",
    versions: {
      ey: "รุ่นของ Agent",
      h3: "แก้กี่ครั้งก็ย้อนกลับได้",
      p: "ทุกการแก้ได้รุ่นใหม่ รุ่นเดิมยังอยู่ และแอปเห็นเฉพาะรุ่นที่ publish แล้ว",
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
      h3: "คนตัดสินก่อนลงมือ",
      p: "เครื่องมือที่เสี่ยง Agent ต้องหยุดรอคนอนุมัติ",
      aria: "ตัวอย่างการ์ดรออนุมัติ",
      expires: "หมดอายุใน 14 นาที",
      approve: "อนุมัติ",
      reject: "ปฏิเสธ",
    },
    small: [
      {
        h4: "เครื่องมือจาก MCP",
        p: "ลงทะเบียน MCP server ขององค์กร ระบบค้นเครื่องมือให้ แล้วเลือกผูกกับ Agent ทีละตัว พร้อมบอกว่าตัวไหนอ่านอย่างเดียวหรือแก้ข้อมูล",
      },
      {
        h4: "รันเบื้องหลังและ callback",
        p: "ส่งงานยาวแล้วรับผลทาง callback ที่ลงลายเซ็น HMAC-SHA256 ดูสถานะและยกเลิก run ได้",
      },
      {
        h4: "Agent Builder",
        p: "แชตที่ AI สัมภาษณ์ความต้องการ ร่าง Agent สร้างโจทย์ทดสอบ บันทึกรุ่นใหม่ และสั่งรันชุดทดสอบ ส่วนการ publish ให้คนทำ",
      },
    ],
    eval: {
      ey: "Eval และ Simulation",
      h3: "วัดผลด้วยโจทย์เดิมทุกครั้งที่แก้",
      p: "ชุดทดสอบต่อ Agent ใช้ได้ทั้งโจทย์คำถามเดียว และ simulation ที่ LLM สวมบทผู้ใช้ตามบทบาทและเป้าหมาย",
      aria: "ตัวอย่างผล eval รายข้อ",
      heads: ["โจทย์", "เงื่อนไข", "ผล"],
      rows: [
        "ถามสถานะเคลมที่มีอยู่",
        "ลูกค้าหงุดหงิด · simulation 6 รอบ",
        "ขอให้แก้สถานะเคลมเอง",
        "ตอบเป็น JSON ให้ระบบอื่น",
      ],
      pass: "ผ่าน",
      fail: "ไม่ผ่าน",
    },
    checks: {
      ey: "เงื่อนไขตรวจ",
      h3: "11 แบบ",
      ticks: [
        "contains, equals, regex, json_valid",
        "เรียกหรือไม่เรียกเครื่องมือ",
        "LLM ให้คะแนนตาม rubric",
        "ต้นทุนและเวลาไม่เกินที่กำหนด",
        "สร้างโจทย์ทดสอบให้อัตโนมัติ",
      ],
    },
  },
  gateway: {
    h2: "ประตูเดียวสำหรับทุกโมเดลและทุก Agent",
    p: "ทุกคำขอผ่านการตรวจคีย์ สิทธิ์ งบ rate limit และ guardrail ก่อนถึงโมเดล",
    keys: {
      ey: "ทีมและ virtual key",
      h3: "แจกคีย์ให้แต่ละแอป คุมงบได้รายทีม",
      p: "องค์กร → ทีม → คีย์ แต่ละระดับจำกัดโมเดล Agent งบรายวัน รายเดือน หรือรวม และ RPM/TPM ได้",
      aria: "ตัวอย่างรายการ virtual key",
      heads: ["คีย์", "ทีม", "งบเดือนนี้", "RPM"],
    },
    guard: {
      ey: "Guardrails",
      h3: "ปิดข้อมูลส่วนบุคคล",
      p: "ตรวจทั้งขาเข้าและขาออก ลองกับข้อความตัวอย่างก่อนใช้จริง",
      aria: "ตัวอย่างการลอง guardrail",
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
        p: "chat completions, embeddings และ models รองรับ streaming ทุก response บอก trace id โมเดลที่ใช้ และต้นทุน",
      },
      {
        h4: "ผู้ให้บริการและโมเดลสำรอง",
        p: "เพิ่มคีย์ OpenAI, Anthropic, Gemini, OpenRouter หรือบริการแบบ OpenAI ตั้งชื่อโมเดลเอง กด Test ตรวจการเรียก tool และตั้งโมเดลสำรอง",
      },
      {
        h4: "คีย์ปลอดภัย นับถูกต้อง",
        p: "คีย์ผู้ให้บริการเข้ารหัสก่อนเก็บ virtual key แสดงครั้งเดียว ตัวนับงบและ rate limit ใช้ร่วมกันทุกเครื่อง",
      },
    ],
  },
  observation: {
    h2: "หลักฐานของทุกคำตอบ",
    p: "รู้ว่าใครเรียก Agent รุ่นไหน ใช้โมเดลอะไร เรียกเครื่องมืออะไร และเสียเงินเท่าไร",
    trace: {
      ey: "Trace",
      h3: "ค้นและเปิดดูทุกคำขอ",
      p: "span แยกเป็น request, agent, generation, tool, guardrail และ eval กรองตามช่วงเวลา Agent คีย์ สถานะ และแหล่งที่มา",
      aria: "ตัวอย่างรายการ trace",
      segAll: "ทั้งหมด",
      count: "1,284 รายการ",
      heads: ["เวลา", "Agent / โมเดล", "source", "สถานะ", "ต้นทุน"],
    },
    cost: {
      ey: "ต้นทุน",
      h3: "ดูได้หลายมุม",
      p: "แยกตามวัน โมเดล คีย์ ทีม Agent หรือแหล่งที่มา",
      aria: "ตัวอย่างต้นทุนแยกตามโมเดล",
      seg: ["วัน", "โมเดล", "ทีม", "Agent"],
    },
    small: [
      {
        h4: "Log ไม่หาย",
        p: "ถ้าที่เก็บ trace ใช้งานไม่ได้ span จะถูกพักไว้ในฐานข้อมูล แล้วส่งซ้ำเมื่อกลับมา",
      },
      {
        h4: "รู้ตัวผู้ใช้ปลายทาง",
        p: "เมื่อแอปส่ง token ของผู้ใช้มาด้วย trace จะบันทึกว่าคำขอนั้นมาจากใคร",
      },
      {
        h4: "Audit log",
        p: "ทุกการเปลี่ยนแปลงในองค์กร เช่น คีย์ โมเดล และการ publish มีบันทึกว่าใครทำ เมื่อไร",
      },
    ],
  },
  uses: {
    eyebrow: "การใช้งาน",
    h2: "ใช้กับงานที่ต้องตอบได้ว่า AI ทำอะไรไป",
    items: [
      { h4: "หลายแอปที่ใช้ LLM", p: "ย้ายทุกแอปมาเรียกผ่าน Gateway เดียว แยกคีย์และงบรายทีม แล้วดูต้นทุนรายแอป" },
      { h4: "Agent บริการลูกค้า", p: "อ่านข้อมูลจากระบบภายในผ่าน MCP ตอบลูกค้า และขออนุมัติก่อนแก้ข้อมูลจริง" },
      { h4: "งานที่ต้องมีหลักฐาน", p: "ทุกการแก้ prompt หรือเปลี่ยนโมเดลต้องผ่านชุดทดสอบเดิม และมีบันทึกว่าใครปล่อย" },
      { h4: "ข้อมูลส่วนบุคคล", p: "ปิดเลขบัตรประชาชน เบอร์โทร และอีเมลก่อนส่งไปโมเดล และตรวจย้อนหลังได้จาก trace" },
    ],
  },
  plans: {
    eyebrow: "แพ็กเกจ",
    h2: "เลือกแพ็กเกจที่เหมาะกับองค์กร",
    p: "ทุกแพ็กเกจใช้คีย์ผู้ให้บริการโมเดลขององค์กรเอง ค่าโมเดลจ่ายตรงกับผู้ให้บริการ",
    gateway: {
      big: "คุมทุกการเรียกโมเดล",
      for: "สำหรับองค์กรที่มีแอปใช้ LLM อยู่แล้ว",
      btn: "เลือก Gateway",
      inc: "รวมในแพ็กเกจ",
      ticks: [
        "API แบบ OpenAI และ streaming",
        "ทีม virtual key งบ และ RPM/TPM",
        "โมเดลสำรอง",
        "Guardrails และปิดข้อมูลส่วนบุคคล",
        "Trace และต้นทุน",
      ],
    },
    agent: {
      badge: "แนะนำ · ครบทุกส่วน",
      big: "สร้างและปล่อย Agent",
      for: "สำหรับทีมที่จะใช้ Agent กับงานจริง",
      inc: "ทุกอย่างใน Gateway และ",
      ticks: [
        "Agent ที่มีรุ่นและหน้าทดสอบ",
        "Agent Builder",
        "เครื่องมือจาก MCP และการอนุมัติ",
        "รันเบื้องหลังพร้อม callback",
        "Eval, simulation และเกณฑ์ก่อน publish",
      ],
    },
    dedicated: {
      big: "กรุณาติดต่อทีมขาย",
      for: "สำหรับองค์กรที่ต้องการระบบแยกของตัวเอง",
      btn: "ติดต่อทีมขาย",
      inc: "ทุกอย่างใน Agent และ",
      ticks: ["ติดตั้งแยกบน cloud project ของลูกค้า", "ระยะเก็บ trace ตามข้อกำหนด", "ทีมดูแลเฉพาะ"],
    },
    desc: {
      Gateway: "AI Gateway · Guardrails · Observation",
      Agent: "Agent · Gateway · Observation ครบทุกส่วน",
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
      { label: "ทีม, virtual key, งบ, RPM/TPM", cells: ["y", "y", "y"] },
      { label: "โมเดลสำรอง", cells: ["y", "y", "y"] },
      { label: "Guardrails", cells: ["y", "y", "y"] },
      { label: "AI Agent", group: true },
      { label: "Agent ที่มีรุ่นและหน้าทดสอบ", cells: ["x", "y", "y"] },
      { label: "Agent Builder", cells: ["x", "y", "y"] },
      { label: "เครื่องมือจาก MCP และการอนุมัติ", cells: ["x", "y", "y"] },
      { label: "รันเบื้องหลังพร้อม callback", cells: ["x", "y", "y"] },
      { label: "Eval, simulation, เกณฑ์ก่อน publish", cells: ["x", "y", "y"] },
      { label: "Observation", group: true },
      { label: "Trace, ต้นทุน, การใช้งาน", cells: ["y", "y", "y"] },
      { label: "Run, transcript และการอนุมัติ", cells: ["x", "y", "y"] },
      { label: "ระยะเก็บ trace", cells: ["มาตรฐาน", "มาตรฐาน", "ตามข้อกำหนด"] },
      { label: "องค์กรและการติดตั้ง", group: true },
      { label: "หลายทีม role และ audit log", cells: ["y", "y", "y"] },
      { label: "รูปแบบการติดตั้ง", cells: ["SaaS", "SaaS", "แยกเฉพาะองค์กร"] },
      { label: "ทีมดูแลเฉพาะ", cells: ["x", "x", "y"] },
    ],
  },
  security: {
    eyebrow: "ความปลอดภัย",
    h2: "ข้อมูลแต่ละองค์กรแยกกันตั้งแต่ฐานข้อมูล",
    seals: [
      { h4: "แยกองค์กรสองชั้น", p: "โค้ดกรองตามองค์กร และฐานข้อมูลบังคับซ้ำด้วย Row-Level Security" },
      { h4: "คีย์เข้ารหัส", p: "คีย์ผู้ให้บริการเข้ารหัสก่อนเก็บ แอปใช้เพียง virtual key" },
      { h4: "callback มีลายเซ็น", p: "แอปตรวจได้ว่าผลที่ได้รับมาจาก AGENT8 จริง" },
      { h4: "สิทธิ์ 3 ระดับ", p: "org_admin, builder และ viewer พร้อม audit log" },
    ],
  },
  specs: {
    h2: "สเปก",
    items: [
      { dt: "Gateway API", dd: "`/v1/chat/completions` `/v1/embeddings` `/v1/models` `/v1/agents/{slug}/runs`" },
      { dt: "งบและ limit", dd: "รายวัน รายเดือน หรือรวม · RPM/TPM · ระดับองค์กร ทีม และคีย์" },
      { dt: "ผู้ให้บริการ", dd: "OpenAI, Anthropic, Gemini, OpenRouter และบริการที่ใช้ API แบบ OpenAI" },
      { dt: "Guardrails", dd: "ปิด PII, บล็อกคำ, บล็อกตาม regex, จำกัดความยาว · ขาเข้าและขาออก" },
      { dt: "Agent", dd: "1–50 รอบต่อคำขอ (ค่าเริ่มต้น 10) · draft / published / retired" },
      { dt: "Callback", dd: "HMAC-SHA256 ใน `X-Agent8-Signature`" },
      { dt: "Eval", dd: "เงื่อนไขตรวจ 11 แบบ · simulation ค่าเริ่มต้น 6 รอบ" },
      { dt: "Observation", dd: "span 6 ชนิด · สรุปตามวัน โมเดล คีย์ ทีม Agent แหล่งที่มา" },
      { dt: "การเข้าสู่ระบบ", dd: "OIDC · หลายองค์กรต่อผู้ใช้หนึ่งคน" },
      { dt: "Console", dd: "ภาษาไทยและอังกฤษ · ธีมสว่างและมืด" },
    ],
  },
  faq: {
    h2: "คำถามที่พบบ่อย",
    items: [
      {
        q: "แอปเดิมต้องแก้โค้ดมากไหม",
        a: "แอปที่ใช้ OpenAI SDK เปลี่ยน base_url ให้ชี้มาที่ Gateway และใช้ virtual key แทน API key เดิม ถ้าจะเรียก Agent ให้ใส่ชื่อโมเดลเป็น agent:<slug>",
      },
      {
        q: "ค่าโมเดลคิดอย่างไร",
        a: "แต่ละองค์กรใส่คีย์ผู้ให้บริการโมเดลของตัวเอง ค่าโมเดลจึงจ่ายตรงกับผู้ให้บริการ AGENT8 คำนวณต้นทุนจากราคาต่อ token ที่ตั้งไว้ให้ดูในหน้า Observation",
      },
      {
        q: "ใช้งบหมดหรือเรียกถี่เกินจะเกิดอะไรขึ้น",
        a: "Gateway ปฏิเสธคำขอทันทีพร้อมรหัส budget_exceeded หรือ rate_limit_exceeded และบอกเวลาที่ลองใหม่ได้ ตัวนับใช้ร่วมกันทุกเครื่อง จึงไม่เกินเพดานเมื่อระบบขยายหลายเครื่อง",
      },
      {
        q: "จะกัน Agent ทำสิ่งที่ไม่ควรทำได้อย่างไร",
        a: "Agent ใช้ได้เฉพาะเครื่องมือที่ผูกไว้ทีละตัว เครื่องมือที่เสี่ยงตั้งให้ต้องมีคนอนุมัติได้ guardrail ตรวจข้อความทั้งขาเข้าและขาออก และรุ่นใหม่ต้องผ่านชุดทดสอบก่อน publish",
      },
      {
        q: "Agent Builder publish Agent เองได้ไหม",
        a: "ไม่ได้ Agent Builder บันทึกได้แค่รุ่น draft และสั่งรันชุดทดสอบ การ publish ต้องทำโดยคน",
      },
      {
        q: "ถ้าที่เก็บ trace ล่ม log จะหายไหม",
        a: "ไม่หาย span จะถูกพักไว้ในฐานข้อมูลแล้วส่งซ้ำเมื่อที่เก็บ trace กลับมาทำงาน",
      },
    ],
  },
  demo: {
    h2: "ดู Agent ของคุณตั้งแต่ร่างจนถึง trace",
    p: "นัดเดโมกับทีมขาย เราใช้โจทย์งานของหน่วยงานคุณเป็นตัวอย่าง",
    steps: [
      "เล่าโจทย์ให้ Agent Builder ร่าง Agent",
      "รันชุดทดสอบและดูผลเทียบเกณฑ์",
      "เรียก Agent ผ่าน Gateway ด้วย OpenAI SDK",
      "เปิด trace และต้นทุนของคำขอเดียวกัน",
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
