import type { Localized } from "./i18n";

export type ProductIcon = "brain" | "bot" | "phone" | "chart" | "workflow" | "map" | "megaphone" | "chat" | "ask" | "database";

export type Product = {
  id: string;
  number: number;
  name: string;
  /** "page" is a product page in this site (url is the path after the locale); "live" is an external deployment. */
  linkType: "page" | "live";
  url: string;
  icon: ProductIcon;
  category: Localized;
  tagline: Localized;
  description: Localized;
  features: Localized[];
};

export const products: Product[] = [
  {
    id: "meet8",
    number: 1,
    name: "MEET8",
    linkType: "page",
    url: "/meet8",
    icon: "brain",
    category: { en: "Meeting memory", th: "ความจำการประชุม" },
    tagline: {
      en: "A searchable record of every meeting",
      th: "บันทึกที่ค้นหาได้ของทุกการประชุม",
    },
    description: {
      en: "Live Thai and English transcription, automatic summaries of decisions and action items, and answers from past meetings that point to the exact minute something was said.",
      th: "บันทึกและถอดเสียงไทยปนอังกฤษแบบสด สรุปมติและงานที่ต้องทำ แล้วถามย้อนหลังได้ทุกการประชุม พร้อมบอกนาทีที่มีคนพูดจริง",
    },
    features: [
      { en: "Live transcription with speaker names, even when Thai and English mix", th: "ถอดเสียงสด แยกผู้พูด แม้พูดไทยปนอังกฤษ" },
      { en: "Summaries, prep briefs and PDF minutes", th: "สรุปการประชุม Prep Brief และรายงาน PDF" },
      { en: "Ask across meetings, limited to what you can access", th: "ถามข้ามทุกการประชุมตามสิทธิ์ที่เข้าถึงได้" },
    ],
  },
  {
    id: "agent8",
    number: 2,
    name: "AGENT8",
    linkType: "page",
    url: "/agent8",
    icon: "bot",
    category: { en: "AI agents", th: "AI Agent" },
    tagline: {
      en: "AI agents you test before launch and can trace at every step",
      th: "AI Agent ขององค์กร ที่ทดสอบก่อนใช้ และตรวจสอบได้ทุกขั้น",
    },
    description: {
      en: "Build agents by chatting with them. Each release must pass your test set before it goes live. Your apps then use the agents through one OpenAI-compatible gateway that controls models, spending and personal data.",
      th: "คุยเพื่อสร้าง Agent ทดสอบด้วยชุดโจทย์ก่อนปล่อย แล้วให้แอปเรียกใช้ผ่านเกตเวย์เดียวที่คุมโมเดล งบ และข้อมูลส่วนบุคคล",
    },
    features: [
      { en: "Agent Builder with numbered versions", th: "Agent Builder พร้อมเลขเวอร์ชัน" },
      { en: "Test sets and simulated conversations before publishing", th: "ทดสอบด้วยชุดโจทย์และจำลองบทสนทนาก่อนปล่อย" },
      { en: "Separate access keys, spending limits and personal-data protection", th: "คีย์เข้าใช้แยกต่างหาก คุมงบ และป้องกันข้อมูลส่วนบุคคล" },
    ],
  },
  {
    id: "voice8",
    number: 3,
    name: "VOICE8",
    linkType: "page",
    url: "/voice8",
    icon: "phone",
    category: { en: "AI phone agent", th: "AI รับและโทรออกทางโทรศัพท์" },
    tagline: {
      en: "AI that answers and makes calls, following your conversation flow",
      th: "AI ที่รับสายและโทรออก ตามขั้นตอนบทสนทนาของคุณ",
    },
    description: {
      en: "Build phone agents without code. Design each conversation as a flow in Studio, connect it to your company knowledge and systems, and attach real phone lines for incoming and outgoing calls.",
      th: "สร้าง AI รับและโทรสายโดยไม่ต้องเขียนโค้ด ออกแบบบทสนทนาเป็นผังขั้นตอนใน Studio เชื่อมความรู้และระบบขององค์กร แล้วต่อกับเบอร์โทรจริงทั้งสายเข้าและสายออก",
    },
    features: [
      { en: "Thai, English and Indonesian with brand voices", th: "รองรับไทย อังกฤษ อินโดนีเซีย พร้อมเสียงของแบรนด์" },
      { en: "Connects to your phone lines and menus, with transfer to human staff", th: "เชื่อมสายโทรศัพท์และเมนูกดเลือก พร้อมโอนสายให้เจ้าหน้าที่" },
      { en: "Scheduled batch calls with automatic retries", th: "โทรออกเป็นชุดตามช่วงเวลา พร้อมโทรซ้ำอัตโนมัติ" },
    ],
  },
  {
    id: "insight8",
    number: 4,
    name: "INSIGHT8",
    linkType: "page",
    url: "/insight8",
    icon: "chart",
    category: { en: "Data analytics", th: "วิเคราะห์ข้อมูล" },
    tagline: {
      en: "Ask in plain language, get dashboards your team can keep editing",
      th: "พิมพ์คำถามธรรมดา ได้ dashboard ที่ทีมแก้ต่อได้จริง",
    },
    description: {
      en: "Ask a question and an agent reads the data you are allowed to see, writes the query and builds the dashboard in a workbook. The BI team stays in charge of connections and access.",
      th: "ถามคำถาม แล้ว Agent จะอ่านข้อมูลตามสิทธิ์ของคุณ เขียน SQL และสร้าง dashboard ใน workbook โดยทีม BI ยังคุมการเชื่อมต่อและสิทธิ์ได้เอง",
    },
    features: [
      { en: "Every query follows the asker's data permissions", th: "ทุกคำค้นเป็นไปตามสิทธิ์ข้อมูลของผู้ถาม" },
      { en: "PostgreSQL, BigQuery, Salesforce and 100+ apps", th: "เชื่อม PostgreSQL, BigQuery, Salesforce และอีก 100+ แอป" },
      { en: "Pulse tracks key numbers, sends summaries and alerts", th: "Pulse ติดตามตัวชี้วัด สรุปรายสัปดาห์ และแจ้งเตือน" },
    ],
  },
  {
    id: "connect8",
    number: 5,
    name: "CONNECT8",
    linkType: "live",
    url: "https://connect8.np.promptserve.tech/home",
    icon: "workflow",
    category: { en: "Connections and automation", th: "เชื่อมระบบและอัตโนมัติ" },
    tagline: {
      en: "Let your systems talk to each other, then let AI take the next step",
      th: "ให้ระบบงานคุยกันเอง แล้วให้ AI ช่วยคิดต่อ",
    },
    description: {
      en: "One place for your business systems, automated workflows and AI agents. Teams build flows from templates without code. IT controls access and can review every call.",
      th: "ศูนย์กลางเชื่อมระบบงาน workflow อัตโนมัติ และ AI Agent ทีมสร้าง flow จากเทมเพลตได้โดยไม่ต้องเขียนโค้ด และ IT คุมสิทธิ์พร้อมดูประวัติการเรียกใช้ได้",
    },
    features: [
      { en: "71 connectors, including Salesforce, LINE OA and Microsoft 365", th: "71 connector เช่น Salesforce, LINE OA, Microsoft 365" },
      { en: "Connects to Agent8, Claude and Cursor through an MCP server", th: "เชื่อม Agent8, Claude และ Cursor ผ่าน MCP server" },
      { en: "Built-in Thai tools: B.E. dates and baht amounts in words", th: "ฟังก์ชันธุรกิจไทย เช่น วันที่ พ.ศ. และจำนวนเงินเป็นตัวอักษร" },
    ],
  },
  {
    id: "space8",
    number: 6,
    name: "SPACE8",
    linkType: "page",
    url: "/space8",
    icon: "map",
    category: { en: "Virtual office", th: "ออฟฟิศเสมือน" },
    tagline: {
      en: "Walk over to your team, wherever they work",
      th: "เดินไปหาทีม ไม่ว่าจะทำงานอยู่ที่ไหน",
    },
    description: {
      en: "A 2D virtual office for teams in Thailand. Walk up to a teammate, talk to whoever is nearby, join meeting rooms and share your screen, all on one map.",
      th: "ออฟฟิศเสมือนแบบ 2D สำหรับทีมในไทย เดินไปคุยกับเพื่อนร่วมทีม ได้ยินคนที่อยู่ใกล้ เข้าห้องประชุมและแชร์หน้าจอได้บนแผนที่เดียว",
    },
    features: [
      { en: "Hear people who are near you, plus private meeting rooms", th: "ได้ยินคนที่อยู่ใกล้ และมีห้องประชุมส่วนตัว" },
      { en: "Record meeting rooms straight to Meet8", th: "บันทึกห้องประชุมเข้า Meet8 ได้ทันที" },
      { en: "Runs in the browser, syncs Google Calendar", th: "ใช้บนเบราว์เซอร์ ซิงก์ Google Calendar" },
    ],
  },
  {
    id: "pulse8",
    number: 7,
    name: "PULSE8",
    linkType: "page",
    url: "/pulse8",
    icon: "megaphone",
    category: { en: "Marketing platform", th: "แพลตฟอร์มการตลาด" },
    tagline: {
      en: "Reach customers on every channel, with consent checked before every message",
      th: "ส่งถึงลูกค้าทุกช่องทาง เช็กความยินยอมก่อนทุกข้อความ",
    },
    description: {
      en: "Collect contacts, build segments, create content and send through Email, LINE OA, SMS, WhatsApp, Push and in-app from one place. Every send is checked for consent, do-not-contact lists and quotas.",
      th: "รวบรวมรายชื่อ แบ่งกลุ่ม สร้างคอนเทนต์ และส่งผ่าน Email, LINE OA, SMS, WhatsApp, Push และ in-app จากที่เดียว พร้อมตรวจความยินยอม รายชื่อที่ห้ามติดต่อ และโควตาก่อนส่งทุกครั้ง",
    },
    features: [
      { en: "Drag-and-drop customer journeys across channels, with A/B tests", th: "Journey หลายช่องทางแบบลากวาง พร้อม A/B test" },
      { en: "PDPA consent records and a page where customers set their preferences", th: "บันทึกความยินยอมตาม PDPA และหน้าให้ลูกค้าตั้งค่าการรับข่าวสาร" },
      { en: "Salesforce sync, and audience export to Meta, Google and LINE", th: "ซิงก์ Salesforce และส่ง audience ไป Meta, Google, LINE" },
    ],
  },
  {
    id: "collab8",
    number: 8,
    name: "COLLAB8",
    linkType: "page",
    url: "/collab8",
    icon: "chat",
    category: { en: "Team chat with agents", th: "แชตทีมที่มี Agent" },
    tagline: {
      en: "A chat workspace where your team and its AI agents work in the same room",
      th: "พื้นที่แชตที่ทีมและ AI Agent ทำงานอยู่ในห้องเดียวกัน",
    },
    description: {
      en: "Mention an agent in a channel and it works in its own isolated workspace. Risky actions wait for approval. Admins decide what agents can do and which documents they can search.",
      th: "แท็ก Agent ในช่องแล้วให้ทำงานในพื้นที่ทำงานแยกของตัวเอง การกระทำที่เสี่ยงต้องรออนุมัติ และแอดมินกำหนดได้ว่า Agent ทำอะไรได้และค้นเอกสารชุดไหนได้",
    },
    features: [
      { en: "Rooms, DMs and threads for people and agents", th: "ห้อง DM และเธรดสำหรับคนและ Agent" },
      { en: "An isolated workspace per session, with approvals for risky actions", th: "พื้นที่ทำงานแยกต่อ session พร้อมการอนุมัติสำหรับสิ่งที่เสี่ยง" },
      { en: "Document libraries, room rules and a tamper-evident activity log", th: "คลังเอกสาร กติกาของห้อง และบันทึกกิจกรรมที่ตรวจการแก้ไขได้" },
    ],
  },
  {
    id: "ask8",
    number: 9,
    name: "ASK8",
    linkType: "page",
    url: "/ask8",
    icon: "ask",
    category: { en: "Q&A inside your pages", th: "ถาม-ตอบในหน้าที่ใช้อยู่" },
    tagline: {
      en: "Get answers from your own documents without leaving the page you're on",
      th: "ได้คำตอบจากเอกสารของคุณเอง โดยไม่ต้องออกจากหน้าที่ใช้อยู่",
    },
    description: {
      en: "A smaller version of Collab8 you can add to any website, app or department. Every answer shows its source, respects access rights and works in Thai and English.",
      th: "Collab8 ฉบับย่อที่ติดตั้งในเว็บไซต์ แอป หรือหน่วยงานใดก็ได้ ทุกคำตอบบอกแหล่งที่มา เคารพสิทธิ์การเข้าถึง และใช้ได้ทั้งไทยและอังกฤษ",
    },
    features: [
      { en: "Sources cited on every answer", th: "อ้างอิงแหล่งที่มาทุกคำตอบ" },
      { en: "Per-page rules for what it can read and answer", th: "กำหนดต่อหน้าได้ว่าอ่านและตอบอะไรได้" },
      { en: "Ask before, during and after meetings in Meet8", th: "ถามก่อน ระหว่าง และหลังประชุมใน Meet8" },
    ],
  },
  {
    id: "data8",
    number: 10,
    name: "DATA8",
    linkType: "page",
    url: "/data8",
    icon: "database",
    category: { en: "Customer data platform", th: "แพลตฟอร์มข้อมูลลูกค้า" },
    tagline: {
      en: "One profile for every customer, ready for your next campaign",
      th: "โปรไฟล์เดียวสำหรับลูกค้าทุกคน พร้อมใช้ในแคมเปญถัดไป",
    },
    description: {
      en: "Bring in CRM, shop and email data, merge duplicates into one profile per customer, build segments with live counts and send them to your marketing tools on a schedule.",
      th: "นำข้อมูล CRM ร้านค้า และอีเมลเข้ามา รวมข้อมูลซ้ำเป็นโปรไฟล์เดียว สร้าง segment พร้อมจำนวนคนแบบสด แล้วส่งต่อไปยังเครื่องมือการตลาดตามรอบ",
    },
    features: [
      { en: "Duplicate matching, with rules for which source wins", th: "จับคู่ข้อมูลซ้ำ พร้อมกฎว่าแหล่งไหนให้ค่าก่อน" },
      { en: "Segments and calculated figures such as lifetime value", th: "Segment และตัวเลขที่คำนวณเอง เช่น lifetime value" },
      { en: "Scheduled sends to CSV, webhook and Cloud Storage, with run history", th: "ส่งตามรอบไป CSV, webhook และ Cloud Storage พร้อมประวัติการรัน" },
    ],
  },
];
