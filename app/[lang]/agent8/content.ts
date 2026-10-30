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
    description: "AGENT8: build, test and release AI agents. One connection point controls models and budgets, and every request is recorded.",
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
    h1Em: "tested before release and recorded at every step",
    lede: "Describe an agent in a chat, test it on a set of tasks before release, then let your apps call it through one connection point that controls models, budgets and personal data. Every step is recorded, with its cost.",
    ctaPrimary: "See what it does",
    ctaSecondary: "View plans",
    ticks: [
      "Apps that use the OpenAI SDK switch over by changing one address (base_url)",
      "Use your organization's own OpenAI, Anthropic, Gemini or OpenRouter keys",
    ],
    screenAria: "Sample step-by-step record for a single agent request",
    traceTitle: "Check a customer's claim status",
    tiles: [
      { v: "5.92 s", l: "Total time" },
      { v: "3 rounds", l: "Rounds of work" },
      { v: "$0.031", l: "Cost of this request" },
    ],
    floatAria: "Sample access key with budget and permissions",
    floatBudget: "This month's budget: $412 of $1,000",
    floatTeam: "Team",
  },
  trust: {
    items: [
      { b: "Versioned agents", s: "Draft, tested, then published" },
      { b: "Tested before release", s: "Every new version must reach a set pass rate" },
      { b: "Works with your current apps", s: "Models, budgets and safety rules set per key" },
      { b: "No lost logs", s: "If record storage goes down, steps are held and resent" },
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
        "Practice conversations where an AI plays the customer over several turns",
        "Gating test suites can only be edited by org_admin",
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
      sub: "Give your app an access key, point it at the OpenAI-style address and set the model name to `agent:<slug>`. Or run it in the background and have the result sent back to your app.",
      ticks: [
        "Keys can only call the agents they are allowed to",
        "Results sent back to your app are signed (HMAC-SHA256) so you can verify them",
        "The end user's identity can be passed on to tools",
      ],
      codeAria: "Sample code for calling an agent",
      codeUser: "Where is claim C-20931 now?",
      codeCost: "cost of this request",
    },
    review: {
      h3: "Open any past run",
      sub: "Each run includes the transcript, tools called, iteration count, tokens and cost, with a link to that request's step-by-step record.",
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
    h2: "Build, test and release agents with a defined process",
    p: "Every agent is versioned, has a test suite, and lets you specify which tools require human approval.",
    versions: {
      ey: "Agent versions",
      h3: "Roll back after any number of edits",
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
      h3: "A person decides before it acts",
      p: "For risky tools, the agent stops and waits for a person to approve.",
      aria: "Sample pending approval card",
      expires: "Expires in 14 minutes",
      approve: "Approve",
      reject: "Reject",
    },
    small: [
      {
        h4: "Tools from MCP",
        p: "Add your organization's MCP servers and the system finds their tools. Then connect them to an agent one at a time, each marked as read-only or able to change data.",
      },
      {
        h4: "Background runs and callbacks",
        p: "Send long jobs to run in the background and get the result sent back to your app with a signature (HMAC-SHA256). Check status or cancel a run at any time.",
      },
      {
        h4: "Agent Builder",
        p: "A chat where the AI asks about your requirements, drafts the agent, creates test tasks, saves a new version and runs the tests. A person does the publishing.",
      },
    ],
    eval: {
      ey: "Tests and practice conversations",
      h3: "Measure every change against the same tasks",
      p: "Each agent's test suite covers single-question tasks and practice conversations where an AI plays a user with a set role and goal.",
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
    h2: "One connection point for every model and every agent",
    p: "Every request is checked for key, permissions, budget, request limit and safety rules before it reaches a model.",
    keys: {
      ey: "Teams and access keys",
      h3: "One key per app, one budget per team",
      p: "Set limits at three levels: organization, team and key. Each level can restrict models and agents, set daily, monthly or lifetime budgets, and cap requests and tokens per minute (RPM/TPM).",
      aria: "Sample list of access keys",
      heads: ["Key", "Team", "This month's budget", "RPM"],
    },
    guard: {
      ey: "Safety rules",
      h3: "Hide personal data",
      p: "Checks both input and output. Try it on sample text before going live.",
      aria: "Sample safety rule test",
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
        p: "Chat completions, embeddings and models, with streaming. Every response reports the record ID, the model used and the cost.",
      },
      {
        h4: "Providers and backup models",
        p: "Add keys for OpenAI, Anthropic, Gemini, OpenRouter or any OpenAI-compatible service, name your own models, press Test to check that tool calling works, and set backup models.",
      },
      {
        h4: "Safe keys, accurate counts",
        p: "Provider keys are encrypted before they are stored. Access keys are shown only once. Budget and request-limit counts stay accurate even when you run more than one server.",
      },
    ],
  },
  observation: {
    h2: "A record behind every answer",
    p: "Know who called which agent version, which model it used, which tools it called and what it cost.",
    trace: {
      ey: "Step-by-step record",
      h3: "Search and open any request",
      p: "Each request is split into steps: request, agent, model reply, tool, safety rule and test. Filter by time range, agent, key, status and source.",
      aria: "Sample list of step-by-step records",
      segAll: "All",
      count: "1,284 records",
      heads: ["Time", "Agent / model", "source", "Status", "Cost"],
    },
    cost: {
      ey: "Cost",
      h3: "Cost, broken down",
      p: "Break down by day, model, key, team, agent or source.",
      aria: "Sample cost by model",
      seg: ["Day", "Model", "Team", "Agent"],
    },
    small: [
      {
        h4: "No lost logs",
        p: "If record storage is unavailable, steps are held in the database and resent once it recovers.",
      },
      {
        h4: "Know the end user",
        p: "When an app passes along the user's token, the record shows who made the request.",
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
        h4: "Several apps that use AI models",
        p: "Send every app through one connection point, give each team its own keys and budgets, and see cost per app.",
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
        p: "Mask national ID numbers, phone numbers and email addresses before they reach the model, and check afterwards in the step-by-step record.",
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
        "Teams, access keys, budgets and RPM/TPM",
        "Backup models",
        "Safety rules and personal data masking",
        "Step-by-step records and cost",
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
        "Tests, practice conversations and checks before publishing",
      ],
    },
    dedicated: {
      big: "Contact sales",
      for: "For organizations that need their own separate setup",
      btn: "Contact sales",
      inc: "Everything in Agent, plus",
      ticks: [
        "Separate setup in the customer's own cloud project",
        "Record retention to your requirements",
        "Dedicated support team",
      ],
    },
    desc: {
      Gateway: "AI Gateway · Safety rules · Observation",
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
      { label: "Teams, access keys, budgets, RPM/TPM", cells: ["y", "y", "y"] },
      { label: "Backup models", cells: ["y", "y", "y"] },
      { label: "Safety rules", cells: ["y", "y", "y"] },
      { label: "AI Agent", group: true },
      { label: "Versioned agents with a test page", cells: ["x", "y", "y"] },
      { label: "Agent Builder", cells: ["x", "y", "y"] },
      { label: "MCP tools and approvals", cells: ["x", "y", "y"] },
      { label: "Background runs with callbacks", cells: ["x", "y", "y"] },
      { label: "Tests, practice conversations, checks before publishing", cells: ["x", "y", "y"] },
      { label: "Observation", group: true },
      { label: "Step-by-step records, cost, usage", cells: ["y", "y", "y"] },
      { label: "Runs, transcripts and approvals", cells: ["x", "y", "y"] },
      { label: "Record retention", cells: ["Standard", "Standard", "Per your requirements"] },
      { label: "Organization and deployment", group: true },
      { label: "Multiple teams, roles and audit log", cells: ["y", "y", "y"] },
      { label: "Deployment model", cells: ["SaaS", "SaaS", "Separate setup for your organization"] },
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
      { h4: "Encrypted keys", p: "Provider keys are encrypted before they are stored. Apps only ever use access keys" },
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
      { dt: "Safety rules", dd: "Personal data masking, word blocking, regex blocking, length limits · input and output" },
      { dt: "Agent", dd: "1 to 50 rounds per request (default 10) · draft / published / retired" },
      { dt: "Callback", dd: "HMAC-SHA256 in `X-Agent8-Signature`" },
      { dt: "Eval", dd: "11 check types · simulations default to 6 turns" },
      { dt: "Observation", dd: "6 span types · summaries by day, model, key, team, agent and source" },
      { dt: "Sign-in", dd: "OIDC · multiple organizations per user" },
      { dt: "Console", dd: "Thai and English · light and dark themes" },
    ],
  },
  faq: {
    h2: "Common questions",
    items: [
      {
        q: "How much code do existing apps need to change?",
        a: "Apps on the OpenAI SDK change base_url to point at the gateway and swap the existing API key for an access key. To call an agent, set the model name to agent:<slug>.",
      },
      {
        q: "How are model costs charged?",
        a: "Each organization adds its own model provider keys, so model usage is paid directly to the provider. AGENT8 works out cost from the per-token prices you enter and shows it in Observation.",
      },
      {
        q: "What happens when a budget runs out or requests come in too fast?",
        a: "The request is rejected straight away with budget_exceeded or rate_limit_exceeded, along with when to try again. Counts are shared across servers, so limits still hold when you add more.",
      },
      {
        q: "How do you stop an agent from doing what it shouldn't?",
        a: "An agent can only use tools bound to it one by one. Risky tools can be set to need a person's approval, safety rules check both input and output, and new versions must pass the tests before they are published.",
      },
      {
        q: "Can Agent Builder publish an agent itself?",
        a: "No. Agent Builder can only save draft versions and run test suites. Publishing must be done by a person.",
      },
      {
        q: "If record storage goes down, are logs lost?",
        a: "No. The steps are held in the database and resent once record storage is back online.",
      },
    ],
  },
  demo: {
    h2: "See your agent from first draft to full record",
    p: "Book a demo with our sales team. We use a task from your own department as the example.",
    steps: [
      "Describe the task so Agent Builder can draft the agent",
      "Run the tests and compare results with the pass rate you set",
      "Call the agent with the OpenAI SDK",
      "Open the record and cost of that same request",
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
    description: "AGENT8: สร้าง ทดสอบ และปล่อย AI Agent มีจุดเชื่อมต่อเดียวที่คุมโมเดลและงบ พร้อมบันทึกทุกคำขอ",
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
    h1Em: "ที่ทดสอบก่อนใช้ และมีบันทึกทุกขั้น",
    lede: "คุยเพื่อสร้าง Agent ทดสอบด้วยชุดโจทย์ก่อนปล่อย แล้วให้แอปเรียกผ่านจุดเชื่อมต่อเดียวที่คุมโมเดล งบ และข้อมูลส่วนบุคคล ทุกขั้นถูกบันทึกไว้พร้อมต้นทุน",
    ctaPrimary: "ดูว่าทำอะไรได้บ้าง",
    ctaSecondary: "ดูแพ็กเกจ",
    ticks: [
      "แอปที่ใช้ OpenAI SDK ย้ายมาได้โดยเปลี่ยนที่อยู่เดียว (base_url)",
      "ใช้คีย์ OpenAI, Anthropic, Gemini หรือ OpenRouter ขององค์กรเอง",
    ],
    screenAria: "ตัวอย่างบันทึกทีละขั้นของ Agent หนึ่งคำขอ",
    traceTitle: "ตรวจสถานะเคลมของลูกค้า",
    tiles: [
      { v: "5.92 s", l: "เวลารวม" },
      { v: "3 รอบ", l: "รอบการทำงาน" },
      { v: "$0.031", l: "ต้นทุนคำขอนี้" },
    ],
    floatAria: "ตัวอย่างคีย์ของแอปพร้อมงบและสิทธิ์",
    floatBudget: "งบเดือนนี้ $412 จาก $1,000",
    floatTeam: "ทีม",
  },
  trust: {
    items: [
      { b: "Agent มีรุ่น", s: "ฉบับร่าง ผ่านการทดสอบ แล้วจึงเผยแพร่" },
      { b: "ทดสอบก่อนปล่อย", s: "รุ่นใหม่ต้องได้ผลผ่านตามเกณฑ์ที่ตั้งไว้" },
      { b: "ใช้กับแอปเดิมได้", s: "คุมโมเดล งบ และกฎความปลอดภัยแยกตามคีย์" },
      { b: "บันทึกไม่หาย", s: "ที่เก็บบันทึกล่ม ระบบพักไว้แล้วส่งซ้ำ" },
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
      sub: "AI สัมภาษณ์ความต้องการ เขียนคำสั่ง เลือกเครื่องมือ และสร้างโจทย์ทดสอบ จากนั้นบันทึกเป็นรุ่นใหม่และสั่งรันชุดทดสอบให้",
      ticks: [
        "เริ่มใหม่ หรือเปิดจาก Agent เดิมเพื่อปรับปรุง",
        "เห็นร่างและโจทย์ทดสอบระหว่างคุย",
        "การเผยแพร่ต้องทำโดยคนเสมอ",
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
        "บทสนทนาจำลองที่ให้ AI สวมบทลูกค้าคุยหลายรอบ",
        "ชุดทดสอบที่เป็นเกณฑ์ แก้ได้เฉพาะ org_admin",
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
      sub: "ให้แอปใช้คีย์ของแอป เรียกที่อยู่แบบ OpenAI แล้วใส่ชื่อโมเดลเป็น `agent:<slug>` หรือสั่งรันเบื้องหลังแล้วให้ส่งผลกลับมาที่แอป",
      ticks: [
        "คีย์เรียกได้เฉพาะ Agent ที่อนุญาตไว้",
        "ผลที่ส่งกลับมาที่แอปมีลายเซ็น (HMAC-SHA256) ให้ตรวจสอบได้",
        "ส่งตัวตนผู้ใช้ปลายทางไปถึงเครื่องมือได้",
      ],
      codeAria: "ตัวอย่างโค้ดเรียก Agent",
      codeUser: "เคลม C-20931 ถึงไหนแล้ว",
      codeCost: "ต้นทุนของคำขอนี้",
    },
    review: {
      h3: "เปิดดูทุก run ย้อนหลังได้",
      sub: "แต่ละ run มี transcript เครื่องมือที่ถูกเรียก จำนวนรอบ token และต้นทุน พร้อมลิงก์ไปยังบันทึกทีละขั้นของคำขอนั้น",
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
    h2: "สร้าง ทดสอบ และปล่อย Agent อย่างมีขั้นตอน",
    p: "ทุก Agent มีรุ่น มีชุดทดสอบ และกำหนดได้ว่าเครื่องมือไหนต้องให้คนอนุมัติ",
    versions: {
      ey: "รุ่นของ Agent",
      h3: "แก้กี่ครั้งก็ย้อนกลับได้",
      p: "ทุกการแก้ได้รุ่นใหม่ รุ่นเดิมยังอยู่ และแอปเห็นเฉพาะรุ่นที่เผยแพร่แล้ว",
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
      p: "ถ้าเป็นเครื่องมือที่เสี่ยง Agent จะหยุดรอให้คนอนุมัติ",
      aria: "ตัวอย่างการ์ดรออนุมัติ",
      expires: "หมดอายุใน 14 นาที",
      approve: "อนุมัติ",
      reject: "ปฏิเสธ",
    },
    small: [
      {
        h4: "เครื่องมือจาก MCP",
        p: "เพิ่ม MCP server ขององค์กร ระบบจะหาเครื่องมือให้ แล้วเลือกเชื่อมกับ Agent ทีละตัว พร้อมระบุว่าตัวไหนอ่านอย่างเดียวหรือแก้ข้อมูลได้",
      },
      {
        h4: "รันเบื้องหลังและ callback",
        p: "ส่งงานยาวให้รันเบื้องหลัง แล้วรับผลที่ส่งกลับมาพร้อมลายเซ็น HMAC-SHA256 ดูสถานะและยกเลิก run ได้",
      },
      {
        h4: "Agent Builder",
        p: "แชตที่ AI สัมภาษณ์ความต้องการ ร่าง Agent สร้างโจทย์ทดสอบ บันทึกรุ่นใหม่ และสั่งรันชุดทดสอบ ส่วนการเผยแพร่ให้คนทำ",
      },
    ],
    eval: {
      ey: "การทดสอบและบทสนทนาจำลอง",
      h3: "วัดผลด้วยโจทย์เดิมทุกครั้งที่แก้",
      p: "ชุดทดสอบของแต่ละ Agent ใช้ได้ทั้งโจทย์คำถามเดียว และบทสนทนาจำลองที่ AI สวมบทผู้ใช้ตามบทบาทและเป้าหมาย",
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
        "สร้างโจทย์ทดสอบให้อัตโนมัติ",
      ],
    },
  },
  gateway: {
    h2: "จุดเชื่อมต่อเดียวสำหรับทุกโมเดลและทุก Agent",
    p: "ทุกคำขอผ่านการตรวจคีย์ สิทธิ์ งบ ขีดจำกัดการเรียก และกฎความปลอดภัยก่อนถึงโมเดล",
    keys: {
      ey: "ทีมและคีย์ของแอป",
      h3: "แจกคีย์ให้แต่ละแอป คุมงบได้รายทีม",
      p: "ตั้งขีดจำกัดได้สามระดับ คือองค์กร ทีม และคีย์ แต่ละระดับจำกัดโมเดลและ Agent ตั้งงบรายวัน รายเดือน หรือรวม และจำกัดจำนวนคำขอและ token ต่อนาที (RPM/TPM) ได้",
      aria: "ตัวอย่างรายการคีย์ของแอป",
      heads: ["คีย์", "ทีม", "งบเดือนนี้", "RPM"],
    },
    guard: {
      ey: "กฎความปลอดภัย",
      h3: "ปิดข้อมูลส่วนบุคคล",
      p: "ตรวจทั้งขาเข้าและขาออก ลองกับข้อความตัวอย่างก่อนใช้จริง",
      aria: "ตัวอย่างการลองกฎความปลอดภัย",
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
        p: "chat completions, embeddings และ models รองรับ streaming ทุก response บอกรหัสบันทึก โมเดลที่ใช้ และต้นทุน",
      },
      {
        h4: "ผู้ให้บริการและโมเดลสำรอง",
        p: "เพิ่มคีย์ OpenAI, Anthropic, Gemini, OpenRouter หรือบริการแบบ OpenAI ตั้งชื่อโมเดลเอง กด Test ตรวจว่าเรียกเครื่องมือได้ และตั้งโมเดลสำรอง",
      },
      {
        h4: "คีย์ปลอดภัย นับถูกต้อง",
        p: "คีย์ผู้ให้บริการเข้ารหัสก่อนเก็บ คีย์ของแอปแสดงครั้งเดียว ตัวนับงบและขีดจำกัดการเรียกใช้ร่วมกันทุกเครื่อง",
      },
    ],
  },
  observation: {
    h2: "มีบันทึกรองรับทุกคำตอบ",
    p: "รู้ว่าใครเรียก Agent รุ่นไหน ใช้โมเดลอะไร เรียกเครื่องมืออะไร และเสียเงินเท่าไร",
    trace: {
      ey: "บันทึกทีละขั้น",
      h3: "ค้นและเปิดดูทุกคำขอ",
      p: "แต่ละคำขอแยกเป็นขั้น คือ request, agent, คำตอบของโมเดล, เครื่องมือ, กฎความปลอดภัย และการทดสอบ กรองตามช่วงเวลา Agent คีย์ สถานะ และแหล่งที่มา",
      aria: "ตัวอย่างรายการบันทึกทีละขั้น",
      segAll: "ทั้งหมด",
      count: "1,284 รายการ",
      heads: ["เวลา", "Agent / โมเดล", "source", "สถานะ", "ต้นทุน"],
    },
    cost: {
      ey: "ต้นทุน",
      h3: "ดูต้นทุนได้หลายมุม",
      p: "แยกตามวัน โมเดล คีย์ ทีม Agent หรือแหล่งที่มา",
      aria: "ตัวอย่างต้นทุนแยกตามโมเดล",
      seg: ["วัน", "โมเดล", "ทีม", "Agent"],
    },
    small: [
      {
        h4: "บันทึกไม่หาย",
        p: "ถ้าที่เก็บบันทึกใช้งานไม่ได้ ระบบจะพักไว้ในฐานข้อมูล แล้วส่งซ้ำเมื่อกลับมา",
      },
      {
        h4: "รู้ตัวผู้ใช้ปลายทาง",
        p: "เมื่อแอปส่ง token ของผู้ใช้มาด้วย บันทึกจะระบุว่าคำขอนั้นมาจากใคร",
      },
      {
        h4: "Audit log",
        p: "ทุกการเปลี่ยนแปลงในองค์กร เช่น คีย์ โมเดล และการเผยแพร่มีบันทึกว่าใครทำ เมื่อไร",
      },
    ],
  },
  uses: {
    eyebrow: "การใช้งาน",
    h2: "สำหรับงานที่ต้องแสดงได้ว่า AI ทำอะไรไป",
    items: [
      { h4: "หลายแอปที่ใช้โมเดล AI", p: "ให้ทุกแอปเรียกผ่านจุดเชื่อมต่อเดียว แยกคีย์และงบรายทีม แล้วดูต้นทุนรายแอป" },
      { h4: "Agent บริการลูกค้า", p: "อ่านข้อมูลจากระบบภายในผ่าน MCP ตอบลูกค้า และขออนุมัติก่อนแก้ข้อมูลจริง" },
      { h4: "งานที่ต้องมีหลักฐาน", p: "ทุกการแก้คำสั่งหรือเปลี่ยนโมเดลต้องผ่านชุดทดสอบเดิม และมีบันทึกว่าใครปล่อย" },
      { h4: "ข้อมูลส่วนบุคคล", p: "ปิดเลขบัตรประชาชน เบอร์โทร และอีเมลก่อนส่งไปโมเดล และตรวจย้อนหลังได้จากบันทึกทีละขั้น" },
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
        "ทีม คีย์ของแอป งบ และ RPM/TPM",
        "โมเดลสำรอง",
        "กฎความปลอดภัยและปิดข้อมูลส่วนบุคคล",
        "บันทึกทีละขั้นและต้นทุน",
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
        "การทดสอบ บทสนทนาจำลอง และเกณฑ์ก่อนเผยแพร่",
      ],
    },
    dedicated: {
      big: "กรุณาติดต่อทีมขาย",
      for: "สำหรับองค์กรที่ต้องการระบบแยกของตัวเอง",
      btn: "ติดต่อทีมขาย",
      inc: "ทุกอย่างใน Agent และ",
      ticks: ["ติดตั้งแยกบน cloud project ของลูกค้าเอง", "ระยะเก็บบันทึกตามข้อกำหนด", "ทีมดูแลเฉพาะ"],
    },
    desc: {
      Gateway: "AI Gateway · กฎความปลอดภัย · Observation",
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
      { label: "ทีม, คีย์ของแอป, งบ, RPM/TPM", cells: ["y", "y", "y"] },
      { label: "โมเดลสำรอง", cells: ["y", "y", "y"] },
      { label: "กฎความปลอดภัย", cells: ["y", "y", "y"] },
      { label: "AI Agent", group: true },
      { label: "Agent ที่มีรุ่นและหน้าทดสอบ", cells: ["x", "y", "y"] },
      { label: "Agent Builder", cells: ["x", "y", "y"] },
      { label: "เครื่องมือจาก MCP และการอนุมัติ", cells: ["x", "y", "y"] },
      { label: "รันเบื้องหลังพร้อม callback", cells: ["x", "y", "y"] },
      { label: "การทดสอบ, บทสนทนาจำลอง, เกณฑ์ก่อนเผยแพร่", cells: ["x", "y", "y"] },
      { label: "Observation", group: true },
      { label: "บันทึกทีละขั้น, ต้นทุน, การใช้งาน", cells: ["y", "y", "y"] },
      { label: "Run, transcript และการอนุมัติ", cells: ["x", "y", "y"] },
      { label: "ระยะเก็บบันทึก", cells: ["มาตรฐาน", "มาตรฐาน", "ตามข้อกำหนด"] },
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
      { h4: "คีย์เข้ารหัส", p: "คีย์ผู้ให้บริการเข้ารหัสก่อนเก็บ แอปใช้เพียงคีย์ของแอป" },
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
      { dt: "กฎความปลอดภัย", dd: "ปิดข้อมูลส่วนบุคคล, บล็อกคำ, บล็อกตาม regex, จำกัดความยาว · ขาเข้าและขาออก" },
      { dt: "Agent", dd: "1 ถึง 50 รอบต่อคำขอ (ค่าเริ่มต้น 10) · draft / published / retired" },
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
        a: "แอปที่ใช้ OpenAI SDK เปลี่ยน base_url ให้ชี้มาที่ Gateway และใช้คีย์ของแอปแทน API key เดิม ถ้าจะเรียก Agent ให้ใส่ชื่อโมเดลเป็น agent:<slug>",
      },
      {
        q: "ค่าโมเดลคิดอย่างไร",
        a: "แต่ละองค์กรใส่คีย์ผู้ให้บริการโมเดลของตัวเอง ค่าโมเดลจึงจ่ายตรงกับผู้ให้บริการ AGENT8 คำนวณต้นทุนจากราคาต่อ token ที่คุณตั้งไว้ และแสดงในหน้า Observation",
      },
      {
        q: "ใช้งบหมดหรือเรียกถี่เกินจะเกิดอะไรขึ้น",
        a: "ระบบปฏิเสธคำขอทันทีพร้อมรหัส budget_exceeded หรือ rate_limit_exceeded และบอกเวลาที่ลองใหม่ได้ ตัวนับใช้ร่วมกันทุกเครื่อง จึงไม่เกินเพดานแม้เพิ่มจำนวนเครื่อง",
      },
      {
        q: "จะกัน Agent ทำสิ่งที่ไม่ควรทำได้อย่างไร",
        a: "Agent ใช้ได้เฉพาะเครื่องมือที่ผูกไว้ทีละตัว เครื่องมือที่เสี่ยงตั้งให้ต้องมีคนอนุมัติได้ กฎความปลอดภัยตรวจข้อความทั้งขาเข้าและขาออก และรุ่นใหม่ต้องผ่านชุดทดสอบก่อนเผยแพร่",
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
    h2: "ดู Agent ของคุณตั้งแต่ร่างจนถึงบันทึกทุกขั้น",
    p: "นัดเดโมกับทีมขาย เราใช้โจทย์งานของหน่วยงานคุณเป็นตัวอย่าง",
    steps: [
      "เล่าโจทย์ให้ Agent Builder ร่าง Agent",
      "รันชุดทดสอบและดูผลเทียบเกณฑ์",
      "เรียก Agent ด้วย OpenAI SDK",
      "เปิดบันทึกและต้นทุนของคำขอเดียวกัน",
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
