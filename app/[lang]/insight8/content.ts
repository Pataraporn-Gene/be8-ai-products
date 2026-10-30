import type { Locale } from "@/lib/i18n";

/*
 * Every user-visible string on the Insight8 Studio page.
 * Thai is the original copy, verbatim. English mirrors it with the same shape.
 * Templates use {name} placeholders (see `fill` in pricing-model.ts) so the objects stay
 * plain data that can be passed from the server page to client components.
 * Inside `why*` strings, **text** marks bold.
 */

/** Matrix cell: true = tick, false = dash, "q:<plan>" = quota, "extra:<plan>" = add-on price, other strings verbatim. */
export type MatrixCell = boolean | string;
export type MatrixRow =
  | { g: string }
  | { l: string; s: MatrixCell; p: MatrixCell; c?: MatrixCell; beta?: boolean };

export type ItemCopy = { name: string; note: string };
export type TourCopy = { label: string; h: string; p: string; list: string[]; alt: string };
export type ScreenCopy = { label: string; alt: string; cap: string };

const en = {
  meta: {
    title: "Insight8 Studio · Plans and pricing",
    description:
      "Anyone in your organization types what they want to know. The agent writes the queries and builds a dashboard your team can edit. Your BI team keeps control of connections and access.",
  },
  header: {
    menuAria: "Main menu",
    menu: { features: "Product", cases: "Use cases", plans: "Pricing", faq: "FAQ" },
  },
  hero: {
    eyebrow: "Insight8 Studio by Beryl8",
    h1: "Ask a plain question.",
    h1em: "Get a dashboard your team can edit.",
    lead:
      "Anyone in your organization types what they want to know. The agent reads only the data that person is allowed to see, writes the queries and builds a dashboard. Your BI team keeps control of connections and access.",
    cta1: "See what it can do",
    cta2: "View plans and pricing",
    mini: [
      "Unlimited users on every plan, priced by organization-wide agent questions",
      "By default, we do not store copies of your data",
    ],
    dashAlt:
      "Agent-built Thai Retail POS Q3 sales overview dashboard with net sales, gross profit and bill count KPIs versus last year, plus a monthly sales chart",
    floatCap: "Question typed in Studio",
    askAlt: "A user's question in Thai requesting a Q3 sales overview dashboard compared with last year",
    pill: "The agent works within the asker's permissions",
  },
  facts: [
    { b: "Unlimited users", span: "Priced per organization per year; sign in with your company Google account" },
    { b: "The agent sees only what the asker sees", span: "It works only with Insight8 tools, in an isolated workspace" },
    {
      b: "No copies of your data",
      span: "Reads from your systems. Stores data only when Extract is turned on for a connection",
    },
    { b: "Connects to databases and apps", span: "PostgreSQL, BigQuery, Salesforce and 100+ apps" },
  ],
  shotNote: "All screenshots on this page come from the live product with generated sample data, not customer data",
  marquee: [
    "Ask in Thai",
    "Edit the dashboards the agent builds",
    "Pulse metric + Inspector",
    "Subscriptions and data alerts",
    "Each person sees only their own data",
    "Explain Data",
    "Refresh every minute from live databases",
    "Built-in Thai province maps",
    "Atrium team chat with the agent",
    "Connect outside AI agents",
  ],
  tryit: {
    eyebrow: "Try it",
    h2: "The screens your team will use every day",
    tabsAria: "View screens",
    screens: {
      home: {
        label: "Home",
        alt: "Insight8 Home page with the question box, recommended prompts, Recommendations and followed Pulse metrics",
        cap: "Start from the question box on Home, with recently opened workbooks and followed metrics on one page",
      },
      studio: {
        label: "Studio",
        alt: "Studio session where the agent builds a Q3 sales overview dashboard",
        cap: "In Studio, the agent answers with a dashboard on the canvas and shows which sources and conditions it used",
      },
      author: {
        label: "Authoring",
        alt: "Authoring workspace chart of the top 10 branches by Q3 sales",
        cap: "The authoring workspace for analysts: every tile the agent builds can be opened and edited on the shelf",
      },
      pulse: {
        label: "Pulse",
        alt: "Pulse page showing followed metrics with explanations from Inspector",
        cap: "Pulse gathers the metrics you follow, and Inspector summarizes what changed and where to look next",
      },
    } as Record<string, ScreenCopy>,
  },
  sectionNav: {
    aria: "Page sections",
    features: "Features",
    cases: "Use cases",
    plans: "Plans",
    spec: "Specs",
    faq: "FAQ",
  },
  features: {
    eyebrow: "How it works",
    h2: "From a question to a dashboard you can verify",
    stepsAria: "Workflow steps",
    steps: {
      ask: {
        label: "Ask",
        h: "Ask a question, then keep following up",
        p: "Type in the question box on Home or in a conversation. The agent explores the data sources the asker can access, writes a query, checks it before running it, then answers with a chart and an explanation.",
        list: [
          "Every query the agent runs uses the asker's own access",
          "Attach files or @mention a data source in chat",
          "Enable skills so the agent knows your organization's terms and context",
        ],
        alt: "A Studio conversation where a user asks for a Q3 sales dashboard; the agent works through 6 steps, then summarizes the key figures in Thai",
      },
      dash: {
        label: "Get a dashboard",
        h: "Get a dashboard where every tile is editable",
        p: "The agent builds the dashboard as sheets on the shelf, complete with KPIs, charts and masthead filters, not a static image. Everyone who opens it sees data according to their own permissions.",
        list: [
          "Queries run fresh on every open; live databases such as PostgreSQL and BigQuery refresh every minute while the dashboard stays open",
          "See which sources a dashboard draws on",
          "Share, download or subscribe from the same page",
        ],
        alt: "Thai Retail POS Q3 sales overview dashboard versus last year, with 6 KPIs and a monthly sales chart",
      },
      author: {
        label: "Refine",
        h: "Click Open and keep editing in the authoring workspace",
        p: "Analysts drag fields onto Columns and Rows, switch chart types from Show Me, or rearrange the layout, as if they had built them from scratch.",
        list: [
          "Full Filters, Marks card and Show Me",
          "Explain Data flags values that differ from what is expected",
          "Download as an image, PDF or data",
        ],
        alt: "Authoring workspace with SUM(Revenue) on Columns and Branch on Rows, showing a bar chart of the top 10 branches by sales",
      },
      govern: {
        label: "Govern",
        h: "BI teams and admins manage it all in one place",
        p: "Turn AI capabilities on or off one by one, choose which data sources the agent can use, manage access with projects and permissions, and check Impact to see which workbooks and metrics use each field.",
        list: [
          "Passwords and keys encrypted with Cloud KMS",
          "Fixed outgoing IP addresses you can allow through your firewall",
          "Agent activity shows who asked what and how many tokens were used",
        ],
        alt: "AI settings page with toggles for Analytics agent, Pulse Inspector summaries, Explain Data narratives and more",
      },
    } as Record<string, TourCopy>,
  },
  more: {
    eyebrow: "Beyond dashboards",
    h2: "The same data, useful to the whole team",
    chat: {
      k: "Atrium",
      h: "Team chat where you can call the agent into the room",
      p: "Teams talk in rooms and @mention the agent to answer from data the asker is allowed to read. Every answer links back to the full analysis in Insight8.",
      alt: "The sales-team room in Atrium: a user asks @insight8 for Q3 sales and the agent replies 1,206,441,380 THB with a link to the analysis",
    },
    pulse: {
      k: "Pulse",
      h: "Track key numbers, with explanations",
      p: "Set the metrics you check every day. Inspector explains why a number moved, and you get a weekly digest or a data alert when a value crosses a threshold.",
      alt: "Pulse card for Closed Won ARR at $7.4M, up 6.7%, with an Inspector explanation and an E-commerce sales card below",
    },
    conn: {
      k: "Connections",
      h: "Connect once, and the whole team can use it",
      p: "Admins set up site connections for selected groups. Passwords are encrypted and never shown to anyone. Databases on a private network connect through an SSH tunnel (Beta), and fixed outgoing IP addresses are ready for your firewall allowlist.",
      alt: "Connections page showing the Retail Data Warehouse site connection with Extract enabled, plus Test, Network and Audience and schemas buttons",
    },
  },
  cases: {
    h2: "For any team that needs answers from data",
    items: [
      {
        h: "Sales leadership",
        p: "Ask for regional sales versus last year from Salesforce and take the dashboard straight into the meeting, without waiting on BI.",
      },
      {
        h: "Operations",
        p: "Set data alerts for when numbers fall outside thresholds, and receive dashboard subscriptions by email every morning.",
      },
      {
        h: "BI and data teams",
        p: "Connect the warehouse once, limit each person to their own branch's data (Premium), then let everyone ask their own questions safely.",
      },
      {
        h: "Frontline teams",
        p: "Ask the agent in Atrium what the manual says about a procedure and get an answer with page references.",
      },
    ],
  },
  plans: {
    eyebrow: "Plans",
    h2: "Choose a plan",
    p: "Every plan includes unlimited users, priced by total agent questions across the organization per month",
    perYear: "/ year",
    monthly: "Avg. {x} per month",
    setup: "+ {x} one-time setup fee",
    recTag: "Recommended · better value per question",
    contact: "Contact sales",
    standard: {
      for: "For organizations whose data lives in databases, BigQuery or CSV/Excel files",
      btn: "Choose Standard",
      lbl: "Included",
      list: [
        "Unlimited users",
        "{q} agent questions per month",
        "Studio agent, authoring workspace and Show Me",
        "Pulse, subscriptions and data alerts",
        "PostgreSQL, MySQL, SQL Server, BigQuery, CSV",
        "Projects, permissions and Atrium chat",
      ],
    },
    premium: {
      for: "For organizations that pull data from Salesforce or SaaS apps, need per-user data separation, or connect Insight8 to other systems",
      btn: "Choose Premium",
      lbl: "Everything in Standard, plus",
      list: [
        "{q} agent questions per month",
        "Salesforce and Insight8 Connect for 100+ apps",
        "Extract per connection (optional copy of the data)",
        "Per-person data access: row-level security, groups and user attributes",
        "Public API, MCP server (for outside AI agents), embedding and Slack app",
        "Atrium Knowledge: the agent reads PDF documents for you",
        "High-availability database and 2 agent workspaces",
      ],
    },
    customize: {
      for: "For organizations that need custom connectors or agents and contract-based system sizing",
      btn: "Contact sales",
      lbl: "Everything in Premium, plus",
      list: [
        "Question quota per contract",
        "Beryl8 builds agents and imports documents for you",
        "Custom connectors for the customer's systems",
        "Larger-than-Premium system sizing per contract",
        "Support per contract",
      ],
    },
    note: {
      thb: "Prices in THB per organization per year",
      usd: "Prices in USD per organization per year (1 USD = ฿{r})",
      vat: ", excluding 7% VAT · ",
      serverIncl: "server included at cost",
      serverExcl: "excludes server cost paid by the customer",
      setup: " · {x} one-time setup fee",
      draft: " · Draft figures, pending confirmation",
    },
  },
  compare: {
    h2: "Compare plans",
    hint: "On mobile, scroll the table right to see other plans",
    featureSr: "Feature",
    select: "Select",
    contact: "Contact sales",
    head: "{y} / year · {m} / month",
    has: "Included",
    hasNot: "Not included",
    q: "{n} questions",
    extra: "{x} / question",
    rows: [
      { g: "Usage" },
      { l: "Users", s: "Unlimited", p: "Unlimited", c: "Unlimited" },
      { l: "Agent questions per month (organization-wide)", s: "q:standard", p: "q:premium", c: "Per contract" },
      { l: "Additional questions", s: "extra:standard", p: "extra:premium", c: "Per contract" },
      { g: "AI agent" },
      { l: "Studio agent: ask and get a dashboard", s: true, p: true },
      { l: "Skills: give the agent business context", s: true, p: true },
      { l: "AI settings: choose which sources the agent can use", s: true, p: true },
      { g: "Authoring and Pulse" },
      { l: "Authoring workspace + Show Me", s: true, p: true },
      { l: "Agent dashboards + live refresh every minute", s: true, p: true },
      { l: "Explain Data", s: true, p: true },
      { l: "Pulse metric + Inspector", s: true, p: true },
      { l: "Subscriptions and data alerts", s: true, p: true },
      { g: "Connectors" },
      { l: "CSV/Excel, PostgreSQL, MySQL, SQL Server, BigQuery", s: true, p: true },
      { l: "SSH tunnel to databases on a private network", s: true, p: true, c: true, beta: true },
      { l: "Salesforce", s: false, p: true },
      { l: "Insight8 Connect: 100+ apps + custom apps", s: false, p: true },
      { l: "Oracle, Snowflake, Redshift, Databricks", s: false, p: true, c: true, beta: true },
      { l: "Insight8 Bridge", s: false, p: true, c: true, beta: true },
      { l: "Extract per connection", s: false, p: true },
      { l: "Custom connectors for the customer's systems", s: false, p: false, c: true },
      { g: "Governance and security" },
      { l: "Sign-in with your organization's Google account", s: true, p: true },
      { l: "Projects, permissions, site roles", s: true, p: true },
      { l: "Encrypted passwords, fixed outgoing IP addresses", s: true, p: true },
      { l: "Agent activity (who asked what, tokens used)", s: true, p: true },
      { l: "Row-level security, groups and user attributes", s: false, p: true },
      { g: "Integrations" },
      { l: "Public API + MCP server", s: false, p: true },
      { l: "Embedding and Slack app", s: false, p: true },
      { g: "Atrium" },
      { l: "Team chat and in-room agent", s: true, p: true },
      { l: "Knowledge: the agent reads PDF documents + FAQ", s: false, p: true },
      { l: "Beryl8 builds agents and imports documents for you", s: false, p: false, c: true },
      { g: "Deployment" },
      { l: "Separate environment per organization on Google Cloud", s: true, p: true },
      { l: "High-availability database and 2 agent workspaces", s: false, p: true },
      { l: "Larger-than-Premium system sizing per contract", s: false, p: false, c: true },
    ] as MatrixRow[],
  },
  trust: {
    eyebrow: "Security and privacy",
    h2: "Answers to the questions IT will ask",
    items: [
      {
        b: "The agent sees only what the asker sees",
        span: "Every query the agent writes is checked and runs with the asker's access. Per-person data limits apply to the agent too",
      },
      {
        b: "No data stored without permission",
        span: "By default every read goes to your own system. Copies exist only when the connection owner turns on Extract",
      },
      {
        b: "Encrypted passwords, fixed IP addresses",
        span: "Connection passwords are encrypted and never shown again. Outgoing traffic uses reserved IP addresses",
      },
      {
        b: "The agent cannot write data on its own",
        span: "Any action that changes data needs the person who asked to click Approve first, and every run is logged",
      },
    ],
  },
  spec: {
    h2: "Specifications",
    rows: [
      {
        dt: "Hosting",
        dd: "Google Cloud: Cloud Run behind IAP and Cloud SQL Postgres, a separate environment per organization in region asia-southeast1",
      },
      { dt: "AI model", dd: "Gemini 4 Argon on Vertex AI by default; switchable to Claude Haiku 5.5 per organization" },
      {
        dt: "Agent runtime",
        dd: "gVisor sandbox on Cloud Run, limited to Insight8 tools, 4 concurrent questions per instance",
      },
      { dt: "Sign-in", dd: "IAP with your organization's Google accounts, restricted by domain or allowlist" },
      {
        dt: "Data connectors",
        dd: "CSV/Excel, PostgreSQL, MySQL, SQL Server, BigQuery, Salesforce, Insight8 Connect, plus Oracle, Snowflake, Redshift and Databricks (all four in Beta)",
      },
      { dt: "Visualization", dd: "Vega-Lite, sandboxed React components and Show Me, including Radial and Sankey" },
      {
        dt: "Language and locale",
        dd: "Ask in and display Thai, with THB and Thai province maps supported (interface in English)",
      },
      { dt: "Devices", dd: "Built for desktop; below 1024px the authoring workspace is view-only" },
    ],
  },
  faq: {
    h2: "Frequently asked questions",
    items: [
      {
        q: "What counts as one question?",
        a: "One question is one agent response: one turn in Studio, one agent reply in Atrium, one /insight8 ask command in Slack, or one Q&A calibration item. Viewing dashboards, live refresh, Pulse, subscriptions and data alerts do not count.",
      },
      {
        q: "What happens when we reach the question quota?",
        a: "(Draft; metering is not built yet.) We propose alerting admins at 80% usage, with additional questions available at the plan's per-question price. Dashboards, Pulse and alerts keep working as normal in the meantime.",
      },
      {
        q: "Is our data stored in Insight8?",
        a: "Data from your source systems is not stored by default. Every query reads from your systems. What the platform does store: uploaded files, data from connections where the owner enabled Extract, Pulse metric history, subscription thumbnails and snapshots, and agent response text, which may contain figures from your data. Query results are sent to the model to answer the question.",
      },
      {
        q: "Can the agent see data the user is not allowed to see?",
        a: "No. The agent uses the asker's permissions on every query, including data source permissions and any limits on which rows they can see, so it sees only what that person sees.",
      },
      {
        q: "Can it connect to databases on an internal network?",
        a: "Yes (Beta). Connect over SSH tunnel through a bastion you already have (all plans), or install Insight8 Bridge in that network (Premium). If the database is behind a firewall, add Insight8's egress IPs to the allowlist.",
      },
      {
        q: "Is the interface in Thai?",
        a: "The interface is currently in English, but you can ask questions in Thai, and Thai data, baht values and province maps display correctly.",
      },
    ],
  },
  footer: {
    copy: "© 2026 Beryl8 · Insight8 Studio",
    curThb: "Prices shown in THB, excluding VAT",
    curUsd: "Prices shown in USD, excluding VAT",
  },
  bar: {
    aria: "Selected plan summary",
    customMeta: "Unlimited users · quota and agents per contract",
    meta: "Unlimited users · {q} questions per month",
    priceLbl: "Price:",
    perYear: "{x} /year",
    avg: "Avg. {x} /month",
    setup: "+ {x} one-time setup",
    contact: "Contact sales",
    copy: "Copy price summary",
    copied: "Copied",
    copyFail: "Couldn't copy, try again",
  },
  summary: {
    custom: "Insight8 Studio · Customize: agent quota and system size per contract. Please contact sales.",
    main: "Insight8 Studio · {name}: {y} per year (avg. {m} per month) · Unlimited users · {q} agent questions per month · Additional questions {x} each{setup} · {server} · Excludes VAT · Draft pricing, pending confirmation",
    setup: " · {x} one-time setup",
    serverIncl: "Server included",
    serverExcl: "Server not included",
  },
};

export type Insight8Content = typeof en;

const th: Insight8Content = {
  meta: {
    title: "Insight8 Studio · แพ็กเกจและราคา",
    description:
      "คนในองค์กรพิมพ์สิ่งที่อยากรู้ Agent จะอ่านเฉพาะข้อมูลที่คนนั้นมีสิทธิ์เห็น เขียน SQL และสร้าง dashboard ให้ ส่วนทีม BI ยังคุม connection และสิทธิ์การเข้าถึงเหมือนเดิม",
  },
  header: {
    menuAria: "เมนูหลัก",
    menu: { features: "ผลิตภัณฑ์", cases: "การใช้งาน", plans: "ราคา", faq: "คำถามที่พบบ่อย" },
  },
  hero: {
    eyebrow: "Insight8 Studio by Beryl8",
    h1: "พิมพ์คำถามธรรมดา",
    h1em: "ได้ dashboard ที่ทีมแก้ต่อได้จริง",
    lead:
      "คนในองค์กรพิมพ์สิ่งที่อยากรู้ Agent จะอ่านเฉพาะข้อมูลที่คนนั้นมีสิทธิ์เห็น เขียน SQL และสร้าง dashboard ให้ ส่วนทีม BI ยังคุม connection และสิทธิ์การเข้าถึงเหมือนเดิม",
    cta1: "ดูว่าทำอะไรได้บ้าง",
    cta2: "ดูแพ็กเกจและราคา",
    mini: [
      "ผู้ใช้ไม่จำกัดทุกแพ็กเกจ คิดราคาตามจำนวนคำถามที่ถาม Agent รวมทั้งองค์กร",
      "โดยปกติไม่เก็บสำเนาข้อมูลจากระบบของคุณ",
    ],
    dashAlt:
      "dashboard ภาพรวมยอดขาย Thai Retail POS ไตรมาส 3 ที่ agent สร้าง มี KPI ยอดขายสุทธิ กำไรขั้นต้น จำนวนบิล เทียบปีก่อน และกราฟยอดขายรายเดือน",
    floatCap: "คำถามที่พิมพ์ใน Studio",
    askAlt: "คำถามภาษาไทยที่ผู้ใช้พิมพ์ขอ dashboard ภาพรวมยอดขายไตรมาส 3 เทียบปีก่อน",
    pill: "agent ทำงานตามสิทธิ์ของผู้ถาม",
  },
  facts: [
    { b: "ไม่จำกัดผู้ใช้", span: "ราคาต่อองค์กรต่อปี เข้าใช้ด้วยบัญชี Google ของบริษัท" },
    { b: "Agent เห็นเท่าที่ผู้ถามเห็น", span: "ใช้ได้เฉพาะเครื่องมือของ Insight8 และทำงานในพื้นที่แยกต่างหาก" },
    { b: "ไม่เก็บสำเนาข้อมูล", span: "อ่านจากระบบต้นทาง จะเก็บก็ต่อเมื่อเปิด Extract ราย connection" },
    { b: "เชื่อมได้ทั้งฐานข้อมูลและแอป", span: "PostgreSQL, BigQuery, Salesforce และแอปกว่า 100 ตัว" },
  ],
  shotNote: "ภาพหน้าจอทั้งหมดในหน้านี้มาจากระบบจริง ใช้ข้อมูลตัวอย่างที่สร้างขึ้น ไม่ใช่ข้อมูลลูกค้า",
  marquee: [
    "ถามเป็นภาษาไทยได้",
    "แก้ dashboard ที่ agent สร้างได้",
    "Pulse metric + Inspector",
    "Subscription และ data alert",
    "แต่ละคนเห็นเฉพาะข้อมูลของตัวเอง",
    "Explain Data",
    "รีเฟรชทุกนาทีจากฐานข้อมูลสด",
    "แผนที่จังหวัดไทยในตัว",
    "Atrium team chat กับ agent",
    "เชื่อมกับ agent ภายนอกได้",
  ],
  tryit: {
    eyebrow: "ลองกดดู",
    h2: "หน้าจอที่ทีมคุณจะใช้ทุกวัน",
    tabsAria: "ดูหน้าจอ",
    screens: {
      home: {
        label: "Home",
        alt: "หน้า Home ของ Insight8 มีกล่องคำถาม recommended prompts, Recommendations และ Pulse metric ที่ติดตาม",
        cap: "เริ่มจากกล่องคำถามหน้า Home เห็น workbook ที่เปิดล่าสุดและ metric ที่ติดตามในหน้าเดียว",
      },
      studio: {
        label: "Studio",
        alt: "Studio session ที่ agent สร้าง dashboard ภาพรวมยอดขายไตรมาส 3",
        cap: "ใน Studio agent ตอบเป็น dashboard บน canvas พร้อมบอกว่าใช้ข้อมูลจาก source และเงื่อนไขใด",
      },
      author: {
        label: "Authoring",
        alt: "authoring workspace กราฟ 10 สาขายอดขายสูงสุด ไตรมาส 3",
        cap: "Authoring workspace สำหรับนักวิเคราะห์ ทุก tile ที่ agent สร้างเปิดแก้บน shelf ได้",
      },
      pulse: {
        label: "Pulse",
        alt: "หน้า Pulse แสดง metric ที่ติดตามพร้อมคำอธิบายจาก Inspector",
        cap: "Pulse รวม metric ที่ติดตาม Inspector สรุปว่าอะไรเปลี่ยนและควรดูต่อตรงไหน",
      },
    },
  },
  sectionNav: {
    aria: "ส่วนของหน้า",
    features: "ฟีเจอร์",
    cases: "การใช้งาน",
    plans: "แพ็กเกจ",
    spec: "สเปก",
    faq: "คำถามที่พบบ่อย",
  },
  features: {
    eyebrow: "ทำงานอย่างไร",
    h2: "จากคำถาม ถึง dashboard ที่ตรวจสอบได้",
    stepsAria: "ขั้นตอนการทำงาน",
    steps: {
      ask: {
        label: "ถาม",
        h: "พิมพ์คำถาม แล้วถามต่อได้เรื่อยๆ",
        p: "พิมพ์ที่กล่องคำถามหน้า Home หรือในบทสนทนา agent ดู data source ที่ผู้ถามมีสิทธิ์เข้าถึง เขียนคำสั่งค้นข้อมูลและตรวจก่อนรัน แล้วตอบเป็นกราฟพร้อมคำอธิบาย",
        list: [
          "ทุกคำสั่งค้นข้อมูลของ agent ใช้สิทธิ์ของผู้ถาม",
          "แนบไฟล์หรือ @mention data source ในแชตได้",
          "เปิด skill ให้ agent รู้คำศัพท์และบริบทขององค์กร",
        ],
        alt: "บทสนทนาใน Studio ผู้ใช้พิมพ์ขอ dashboard ยอดขายไตรมาส 3 agent ใช้ 6 ขั้นตอนแล้วสรุปตัวเลขสำคัญเป็นภาษาไทย",
      },
      dash: {
        label: "ได้ dashboard",
        h: "ได้ dashboard ที่แก้ต่อได้ทุก tile",
        p: "agent สร้าง dashboard เป็น sheet บน shelf มี KPI กราฟ และ filter บน masthead ครบ ไม่ใช่ภาพนิ่ง ทุกคนที่เปิดดูเห็นข้อมูลตามสิทธิ์ของตัวเอง",
        list: [
          "query ใหม่ทุกครั้งที่เปิด ฐานข้อมูล live อย่าง PostgreSQL และ BigQuery refresh ทุก 1 นาทีระหว่างเปิดค้าง",
          "ดูได้ว่า dashboard ใช้ข้อมูลจาก source ไหน",
          "แชร์ ดาวน์โหลด หรือ subscribe ได้จากหน้าเดียวกัน",
        ],
        alt: "dashboard ภาพรวมยอดขาย Thai Retail POS ไตรมาส 3 เทียบปีก่อน มี KPI 6 ตัว และกราฟยอดขายรายเดือน",
      },
      author: {
        label: "แก้ต่อ",
        h: "กด Open แล้วแก้ต่อใน authoring workspace",
        p: "นักวิเคราะห์ลาก field ลง Columns และ Rows เปลี่ยนแบบกราฟจาก Show Me หรือจัด layout ได้เหมือนงานที่สร้างเอง",
        list: [
          "มี Filters, Marks card และ Show Me ครบ",
          "Explain Data ชี้ว่าค่าไหนต่างจากที่ควรเป็น",
          "ดาวน์โหลดเป็นภาพ PDF หรือข้อมูลได้",
        ],
        alt: "authoring workspace มี Columns เป็น SUM(Revenue) และ Rows เป็น Branch แสดงกราฟแท่ง 10 สาขายอดขายสูงสุด",
      },
      govern: {
        label: "ควบคุม",
        h: "ทีม BI และ admin ดูแลจากที่เดียว",
        p: "เปิดปิดความสามารถ AI ได้ทีละตัว เลือก data source ที่ agent ใช้ได้ จัดสิทธิ์การเข้าถึงด้วย project แล้วดู Impact ว่า field ไหนถูกใช้ใน workbook และ metric ใด",
        list: [
          "รหัสผ่านและคีย์เข้ารหัสด้วย Cloud KMS",
          "มี IP ขาออกคงที่ให้ลูกค้าอนุญาตผ่าน firewall",
          "Agent activity บอกว่าใครถามอะไร ใช้ไปกี่ token",
        ],
        alt: "หน้า AI settings มีสวิตช์ Analytics agent, Pulse Inspector summaries, Explain Data narratives และอื่นๆ",
      },
    },
  },
  more: {
    eyebrow: "มากกว่า dashboard",
    h2: "ข้อมูลเดียวกัน ใช้ต่อได้ทั้งทีม",
    chat: {
      k: "Atrium",
      h: "Team chat ที่เรียก agent มาตอบในห้องได้",
      p: "ทีมคุยกันเป็นห้อง แล้ว @mention agent ให้ตอบจากข้อมูลที่ผู้ถามมีสิทธิ์อ่าน ทุกคำตอบมีลิงก์กลับไปเปิดการวิเคราะห์ใน Insight8",
      alt: "ห้อง sales-team ใน Atrium ผู้ใช้ @insight8 ถามยอดขายไตรมาส 3 และ agent ตอบ 1,206,441,380 บาท พร้อมลิงก์ไปยังการวิเคราะห์",
    },
    pulse: {
      k: "Pulse",
      h: "ติดตามตัวเลขสำคัญ พร้อมคำอธิบาย",
      p: "ตั้ง metric ที่ต้องดูทุกวัน Inspector บอกว่าตัวเลขขยับเพราะอะไร แล้วรับ digest ทุกสัปดาห์หรือตั้ง data alert เมื่อค่าข้ามเกณฑ์",
      alt: "การ์ด Pulse Closed Won ARR $7.4M เพิ่มขึ้น 6.7% พร้อมคำอธิบายจาก Inspector และการ์ดยอดขาย E-commerce ด้านล่าง",
    },
    conn: {
      k: "Connections",
      h: "เชื่อมระบบครั้งเดียว ทั้งทีมใช้ได้",
      p: "admin ตั้ง site connection ให้กลุ่มที่เลือก ไม่มีใครเห็นรหัสผ่าน รหัสผ่านถูกเข้ารหัสและไม่แสดงให้ใครเห็น ต่อฐานข้อมูลใน network ภายในผ่าน SSH tunnel ได้ (Beta) และมี IP ขาออกคงที่ให้อนุญาตใน firewall",
      alt: "หน้า Connections แสดง site connection Retail Data Warehouse ที่เปิด Extract พร้อมปุ่ม Test, Network และ Audience and schemas",
    },
  },
  cases: {
    h2: "ใช้ได้กับทุกทีมที่ต้องการคำตอบจากข้อมูล",
    items: [
      {
        h: "ผู้บริหารฝ่ายขาย",
        p: "ถามยอดขายรายภาคเทียบปีก่อนจาก Salesforce แล้วได้ dashboard ไปเปิดในที่ประชุม ไม่ต้องรอทีม BI",
      },
      { h: "ทีม operations", p: "ตั้ง data alert ให้เตือนเมื่อตัวเลขหลุดเกณฑ์ และรับ subscription ของ dashboard ทางอีเมลทุกเช้า" },
      {
        h: "ทีม BI และ data",
        p: "เชื่อม warehouse ครั้งเดียว จำกัดให้แต่ละคนเห็นเฉพาะข้อมูลของสาขาตัวเอง (Premium) แล้วเปิดให้ทุกคนถามเองได้อย่างปลอดภัย",
      },
      { h: "ทีมหน้างาน", p: "ถาม agent ใน Atrium ว่าคู่มือกำหนดขั้นตอนไว้อย่างไร แล้วได้คำตอบที่บอกเลขหน้าอ้างอิงมาด้วย" },
    ],
  },
  plans: {
    eyebrow: "แพ็กเกจ",
    h2: "เลือกแพ็กเกจ",
    p: "ผู้ใช้ไม่จำกัดทุกแพ็กเกจ คิดราคาตามจำนวนคำถามที่ถาม Agent รวมทั้งองค์กรต่อเดือน",
    perYear: "/ ปี",
    monthly: "เฉลี่ย {x} ต่อเดือน",
    setup: "+ ค่า Setup {x} ครั้งเดียว",
    recTag: "แนะนำ · คุ้มกว่าต่อคำถาม",
    contact: "ติดต่อทีมขาย",
    standard: {
      for: "สำหรับองค์กรที่ข้อมูลอยู่ในฐานข้อมูล, BigQuery หรือไฟล์ CSV/Excel",
      btn: "เลือก Standard",
      lbl: "รวมในแพ็กเกจ",
      list: [
        "ผู้ใช้ไม่จำกัด",
        "ถาม Agent ได้ {q} คำถามต่อเดือน",
        "Studio agent, authoring workspace และ Show Me",
        "Pulse, subscription และ data alert",
        "PostgreSQL, MySQL, SQL Server, BigQuery, CSV",
        "Projects, permissions และ Atrium chat",
      ],
    },
    premium: {
      for: "สำหรับองค์กรที่ดึงข้อมูลจาก Salesforce หรือแอป SaaS ต้องแยกข้อมูลตามผู้ใช้ หรือเชื่อม Insight8 เข้ากับระบบอื่น",
      btn: "เลือก Premium",
      lbl: "ทุกอย่างใน Standard และ",
      list: [
        "ถาม Agent ได้ {q} คำถามต่อเดือน",
        "Salesforce และ Insight8 Connect แอปกว่า 100 ตัว",
        "Extract ราย connection (เลือกเก็บสำเนาข้อมูลได้)",
        "จำกัดข้อมูลรายคน: row-level security, groups และ user attributes",
        "Public API, MCP server (สำหรับ agent ภายนอก), embedding และ Slack app",
        "Atrium Knowledge: agent อ่านเอกสาร PDF ให้",
        "ฐานข้อมูลแบบ high-availability และพื้นที่ทำงานของ agent 2 ชุด",
      ],
    },
    customize: {
      for: "สำหรับองค์กรที่ต้องการ connector หรือ agent เฉพาะ และขนาดระบบตามสัญญา",
      btn: "ติดต่อทีมขาย",
      lbl: "ทุกอย่างใน Premium และ",
      list: [
        "โควตาคำถามตามสัญญา",
        "Beryl8 สร้าง agent และนำเข้าเอกสารให้",
        "พัฒนา connector เฉพาะระบบของลูกค้า",
        "ขนาดระบบใหญ่กว่า Premium ตามสัญญา",
        "Support ตามสัญญา",
      ],
    },
    note: {
      thb: "ราคาเป็นบาทต่อองค์กรต่อปี",
      usd: "ราคาเป็นดอลลาร์สหรัฐต่อองค์กรต่อปี (1 USD = ฿{r})",
      vat: " ยังไม่รวม VAT 7% · ",
      serverIncl: "รวมค่า Server แบบราคาทุนแล้ว",
      serverExcl: "ไม่รวมค่า Server ที่ลูกค้าจ่ายเอง",
      setup: " · ค่า Setup {x} จ่ายครั้งเดียว",
      draft: " · ตัวเลขเป็นร่าง รอยืนยัน",
    },
  },
  compare: {
    h2: "เปรียบเทียบแพ็กเกจ",
    hint: "บนมือถือเลื่อนตารางไปทางขวาเพื่อดูแพ็กเกจอื่น",
    featureSr: "ฟีเจอร์",
    select: "เลือก",
    contact: "ติดต่อทีมขาย",
    head: "{y} / ปี · {m} / เดือน",
    has: "มี",
    hasNot: "ไม่มี",
    q: "{n} คำถาม",
    extra: "{x} / คำถาม",
    rows: [
      { g: "การใช้งาน" },
      { l: "จำนวนผู้ใช้", s: "ไม่จำกัด", p: "ไม่จำกัด", c: "ไม่จำกัด" },
      { l: "คำถามที่ถาม Agent ต่อเดือน (ทั้งองค์กร)", s: "q:standard", p: "q:premium", c: "ตามสัญญา" },
      { l: "ซื้อคำถามเพิ่ม", s: "extra:standard", p: "extra:premium", c: "ตามสัญญา" },
      { g: "AI agent" },
      { l: "Studio agent: ถามแล้วได้ dashboard", s: true, p: true },
      { l: "Skills: ใส่บริบทธุรกิจให้ agent", s: true, p: true },
      { l: "AI settings: เลือก source ที่ agent ใช้ได้", s: true, p: true },
      { g: "Authoring และ Pulse" },
      { l: "Authoring workspace + Show Me", s: true, p: true },
      { l: "Dashboard จาก agent + live refresh ทุกนาที", s: true, p: true },
      { l: "Explain Data", s: true, p: true },
      { l: "Pulse metric + Inspector", s: true, p: true },
      { l: "Subscription และ data alert", s: true, p: true },
      { g: "Connectors" },
      { l: "CSV/Excel, PostgreSQL, MySQL, SQL Server, BigQuery", s: true, p: true },
      { l: "SSH tunnel ไปฐานข้อมูลใน private network", s: true, p: true, c: true, beta: true },
      { l: "Salesforce", s: false, p: true },
      { l: "Insight8 Connect: แอปกว่า 100 ตัว + custom app", s: false, p: true },
      { l: "Oracle, Snowflake, Redshift, Databricks", s: false, p: true, c: true, beta: true },
      { l: "Insight8 Bridge", s: false, p: true, c: true, beta: true },
      { l: "Extract per connection", s: false, p: true },
      { l: "พัฒนา connector เฉพาะระบบของลูกค้า", s: false, p: false, c: true },
      { g: "Governance และ security" },
      { l: "เข้าสู่ระบบด้วยบัญชี Google ขององค์กร", s: true, p: true },
      { l: "Projects, permissions, site roles", s: true, p: true },
      { l: "รหัสผ่านเข้ารหัส, IP ขาออกคงที่", s: true, p: true },
      { l: "Agent activity (ใครถามอะไร ใช้กี่ token)", s: true, p: true },
      { l: "Row-level security, groups และ user attributes", s: false, p: true },
      { g: "เชื่อมกับระบบอื่น" },
      { l: "Public API + MCP server", s: false, p: true },
      { l: "Embedding และ Slack app", s: false, p: true },
      { g: "Atrium" },
      { l: "Team chat และ agent ในห้อง", s: true, p: true },
      { l: "Knowledge: agent อ่านเอกสาร PDF + FAQ", s: false, p: true },
      { l: "Beryl8 สร้าง agent และนำเข้าเอกสารให้", s: false, p: false, c: true },
      { g: "การติดตั้ง" },
      { l: "ระบบแยกเฉพาะองค์กรบน Google Cloud", s: true, p: true },
      { l: "ฐานข้อมูลแบบ high-availability และพื้นที่ทำงานของ agent 2 ชุด", s: false, p: true },
      { l: "ขนาดระบบใหญ่กว่า Premium ตามสัญญา", s: false, p: false, c: true },
    ],
  },
  trust: {
    eyebrow: "ความปลอดภัยและความเป็นส่วนตัว",
    h2: "คำตอบสำหรับสิ่งที่ทีม IT มักถาม",
    items: [
      {
        b: "Agent เห็นเท่าที่ผู้ถามเห็น",
        span: "ทุกคำสั่งค้นข้อมูลของ agent ถูกตรวจและรันด้วยสิทธิ์ของผู้ถาม การจำกัดข้อมูลรายคนมีผลกับ agent ด้วย",
      },
      {
        b: "ไม่เก็บข้อมูลโดยไม่ได้รับอนุญาต",
        span: "ค่าเริ่มต้นคืออ่านจากระบบของคุณทุกครั้ง สำเนาจะมีก็ต่อเมื่อเจ้าของ connection เปิด Extract",
      },
      {
        b: "รหัสผ่านเข้ารหัส IP ขาออกคงที่",
        span: "รหัสผ่านของ connection ถูกเข้ารหัสและไม่แสดงอีก การเชื่อมต่อขาออกใช้ IP ที่จองไว้",
      },
      {
        b: "Agent เขียนข้อมูลเองไม่ได้",
        span: "การกระทำที่แก้ข้อมูลต้องให้คนที่ถามกด Approve ก่อน และทุกครั้งที่รันมีบันทึก",
      },
    ],
  },
  spec: {
    h2: "สเปก",
    rows: [
      {
        dt: "Hosting",
        dd: "Google Cloud: Cloud Run หลัง IAP และ Cloud SQL Postgres แยกระบบต่อองค์กร region asia-southeast1",
      },
      { dt: "AI model", dd: "Gemini 4 Argon บน Vertex AI เป็นค่าเริ่มต้น เปลี่ยนเป็น Claude Haiku 5.5 ได้แยกตามองค์กร" },
      {
        dt: "Agent runtime",
        dd: "sandbox gVisor บน Cloud Run ใช้ได้เฉพาะ tools ของ Insight8 รับ 4 คำถามพร้อมกันต่อ instance",
      },
      { dt: "การเข้าสู่ระบบ", dd: "IAP ด้วยบัญชี Google ขององค์กร กำหนด domain หรือรายชื่อที่เข้าได้" },
      {
        dt: "Data connectors",
        dd: "CSV/Excel, PostgreSQL, MySQL, SQL Server, BigQuery, Salesforce, Insight8 Connect และ Oracle, Snowflake, Redshift, Databricks (Beta ทั้ง 4 ตัว)",
      },
      { dt: "Visualization", dd: "Vega-Lite, React component ใน sandbox และ Show Me รวม Radial และ Sankey" },
      {
        dt: "ภาษาและพื้นที่",
        dd: "ถามและแสดงข้อมูลภาษาไทยได้ รองรับ THB และแผนที่จังหวัดไทย (หน้าจอเป็นภาษาอังกฤษ)",
      },
      { dt: "อุปกรณ์", dd: "ออกแบบสำหรับ desktop จอต่ำกว่า 1024px ใช้ authoring workspace ได้แบบดูอย่างเดียว" },
    ],
  },
  faq: {
    h2: "คำถามที่พบบ่อย",
    items: [
      {
        q: "นับ 1 คำถามอย่างไร",
        a: "1 คำถามคือ 1 ครั้งที่ agent ตอบ ได้แก่ 1 turn ใน Studio, 1 คำตอบของ agent ใน Atrium, คำสั่ง /insight8 ask ใน Slack และ 1 ข้อของ Q&A calibration ส่วนการเปิดดู dashboard, live refresh, Pulse, subscription และ data alert ไม่นับ",
      },
      {
        q: "ถ้าใช้คำถามครบโควตาแล้วจะเป็นอย่างไร",
        a: "(ร่าง ยังไม่มีระบบนับ) เสนอให้เตือน admin เมื่อใช้ถึง 80% และซื้อคำถามเพิ่มได้ในราคาต่อคำถามตามแพ็กเกจ ระหว่างนั้น dashboard, Pulse และการแจ้งเตือนยังใช้ได้ตามปกติ",
      },
      {
        q: "ข้อมูลของเราจะถูกเก็บไว้ที่ Insight8 ไหม",
        a: "ข้อมูลจากระบบต้นทางไม่ถูกเก็บโดยค่าเริ่มต้น ทุกคำสั่งค้นข้อมูลอ่านจากระบบของคุณ สิ่งที่ระบบเก็บคือไฟล์ที่อัปโหลด, ข้อมูลจาก connection ที่เจ้าของเปิด Extract, ประวัติตัวเลขของ Pulse metric, ภาพ thumbnail และ snapshot ของ subscription และข้อความคำตอบของ agent ซึ่งอาจมีตัวเลขจากข้อมูล ผลลัพธ์ของ query ถูกส่งให้ model เพื่อใช้ตอบคำถาม",
      },
      {
        q: "Agent เห็นข้อมูลที่ผู้ใช้ไม่มีสิทธิ์ดูไหม",
        a: "ไม่เห็น agent ใช้สิทธิ์ของคนที่ถามในทุก query ทั้ง permission ของ data source และการจำกัดข้อมูลรายแถว จึงเห็นได้เท่าที่คนนั้นเห็น",
      },
      {
        q: "ต่อฐานข้อมูลที่อยู่ใน network ภายในได้ไหม",
        a: "ได้ (Beta) ต่อผ่าน SSH tunnel ด้วย bastion ที่ลูกค้ามีอยู่แล้ว (ทุกแพ็กเกจ) หรือติดตั้ง Insight8 Bridge ใน network นั้น (Premium) ถ้าฐานข้อมูลมี firewall ให้เพิ่ม IP ขาออกของ Insight8 ในรายการที่อนุญาต",
      },
      {
        q: "หน้าจอเป็นภาษาไทยไหม",
        a: "ตอนนี้หน้าจอยังเป็นภาษาอังกฤษ แต่ถามเป็นภาษาไทยได้ และข้อมูลภาษาไทย ค่าเงินบาท และแผนที่จังหวัดแสดงผลได้ถูกต้อง",
      },
    ],
  },
  footer: {
    copy: "© 2026 Beryl8 · Insight8 Studio",
    curThb: "ราคาแสดงเป็นบาท ยังไม่รวมภาษีมูลค่าเพิ่ม",
    curUsd: "ราคาแสดงเป็นดอลลาร์สหรัฐ ยังไม่รวมภาษีมูลค่าเพิ่ม",
  },
  bar: {
    aria: "สรุปแพ็กเกจที่เลือก",
    customMeta: "ผู้ใช้ไม่จำกัด · โควตาและ agent ตามสัญญา",
    meta: "ผู้ใช้ไม่จำกัด · {q} คำถามต่อเดือน",
    priceLbl: "ราคา:",
    perYear: "{x} /ปี",
    avg: "เฉลี่ย {x} /เดือน",
    setup: "+ Setup {x} ครั้งเดียว",
    contact: "ติดต่อทีมขาย",
    copy: "คัดลอกสรุปราคา",
    copied: "คัดลอกแล้ว",
    copyFail: "คัดลอกไม่ได้ ลองอีกครั้ง",
  },
  summary: {
    custom: "Insight8 Studio · Customize: โควตา agent และขนาดระบบตามสัญญา ติดต่อทีมขาย",
    main: "Insight8 Studio · {name}: {y} ต่อปี (เฉลี่ย {m} ต่อเดือน) · ผู้ใช้ไม่จำกัด · ถาม Agent ได้ {q} คำถามต่อเดือน · ซื้อเพิ่ม {x} ต่อคำถาม{setup} · {server} · ยังไม่รวม VAT · ราคาร่าง รอยืนยัน",
    setup: " · Setup {x} ครั้งเดียว",
    serverIncl: "รวมค่า Server แล้ว",
    serverExcl: "ไม่รวมค่า Server",
  },
};

export const content: Record<Locale, Insight8Content> = { en, th };
