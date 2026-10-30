import type { Localized } from "./i18n";

export type ProductIcon = "brain" | "bot" | "phone" | "chart" | "workflow" | "map" | "megaphone" | "chat" | "ask";

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
    category: { en: "Second Brain", th: "Second Brain" },
    tagline: {
      en: "Your organization's memory for every meeting",
      th: "ความจำขององค์กร สำหรับทุกการประชุม",
    },
    description: {
      en: "Live Thai–English transcription, automatic recaps of decisions and action items, and answers across past meetings that cite the exact minute something was said.",
      th: "บันทึกและถอดเสียงไทยปนอังกฤษแบบสด สรุปมติและงานที่ต้องทำ แล้วถามย้อนหลังได้ทุกการประชุม พร้อมอ้างอิงนาทีที่มีคนพูดจริง",
    },
    features: [
      { en: "Live code-switched transcription with speakers", th: "ถอดเสียงสดไทย–อังกฤษ แยกผู้พูด" },
      { en: "Recaps, Prep Briefs and PDF minutes", th: "สรุปการประชุม Prep Brief และรายงาน PDF" },
      { en: "Permission-aware Q&A across meetings", th: "ถามข้ามทุกการประชุมตามสิทธิ์ที่เข้าถึงได้" },
    ],
  },
  {
    id: "agent8",
    number: 2,
    name: "AGENT8",
    linkType: "page",
    url: "/agent8",
    icon: "bot",
    category: { en: "Agent Platform", th: "แพลตฟอร์ม Agent" },
    tagline: {
      en: "Enterprise AI agents, tested before launch and traceable at every step",
      th: "AI Agent ขององค์กร ที่ทดสอบก่อนใช้ และตรวจสอบได้ทุกขั้น",
    },
    description: {
      en: "Build agents by chatting, gate each release on eval pass rates, and serve them through an OpenAI-compatible AI Gateway that controls models, budgets and personal data.",
      th: "คุยเพื่อสร้าง Agent ทดสอบด้วยชุดโจทย์ก่อนปล่อย แล้วให้แอปเรียกใช้ผ่าน AI Gateway ที่คุมโมเดล งบ และข้อมูลส่วนบุคคล",
    },
    features: [
      { en: "Agent Builder with versioned releases", th: "Agent Builder พร้อมระบบรุ่น" },
      { en: "Eval and simulation gates before publish", th: "Eval และ simulation ก่อน publish" },
      { en: "Virtual keys, budgets and PII guardrails", th: "Virtual key คุมงบ และ guardrail ข้อมูลส่วนบุคคล" },
    ],
  },
  {
    id: "voice8",
    number: 3,
    name: "VOICE8",
    linkType: "page",
    url: "/voice8",
    icon: "phone",
    category: { en: "AI Phone Agent", th: "AI รับ-โทรสาย" },
    tagline: {
      en: "AI that answers and makes calls, following your organization's flow",
      th: "AI ที่รับสายและโทรออก ตาม flow ขององค์กรคุณ",
    },
    description: {
      en: "No-code phone agents: design conversations as goal graphs in Studio, ground them in company knowledge and systems, and connect real phone lines for inbound and outbound calls.",
      th: "สร้าง AI รับและโทรสายโดยไม่ต้องเขียนโค้ด ออกแบบบทสนทนาเป็น goal graph ใน Studio เชื่อมความรู้และระบบขององค์กร แล้วต่อกับเบอร์โทรจริงทั้งสายเข้าและสายออก",
    },
    features: [
      { en: "Thai, English and Indonesian with brand voices", th: "รองรับไทย อังกฤษ อินโดนีเซีย พร้อมเสียงของแบรนด์" },
      { en: "SIP, IVR and handoff to human agents", th: "เชื่อม SIP, IVR และโอนสายให้เจ้าหน้าที่" },
      { en: "Outbound batch calling with retries", th: "โทรออกเป็นชุดตามช่วงเวลา พร้อมโทรซ้ำ" },
    ],
  },
  {
    id: "insight8",
    number: 4,
    name: "INSIGHT8",
    linkType: "page",
    url: "/insight8",
    icon: "chart",
    category: { en: "AI Analytics", th: "วิเคราะห์ข้อมูลด้วย AI" },
    tagline: {
      en: "Ask in plain language, get dashboards your team can keep editing",
      th: "พิมพ์คำถามธรรมดา ได้ dashboard ที่ทีมแก้ต่อได้จริง",
    },
    description: {
      en: "An agent reads the data sources each person can access, writes SQL and builds dashboards in a workbook, while the BI team keeps control of connections and access.",
      th: "Agent อ่านแหล่งข้อมูลตามสิทธิ์ของผู้ถาม เขียน SQL และสร้าง dashboard ใน workbook โดยทีม BI ยังคุมการเชื่อมต่อและสิทธิ์ได้เอง",
    },
    features: [
      { en: "Queries run with the asker's row-level security", th: "Query ตามสิทธิ์ row-level ของผู้ถาม" },
      { en: "PostgreSQL, BigQuery, Salesforce and 100+ apps", th: "เชื่อม PostgreSQL, BigQuery, Salesforce และอีก 100+ แอป" },
      { en: "Pulse metric tracking, digests and alerts", th: "Pulse ติดตามตัวชี้วัด สรุปรายสัปดาห์ และแจ้งเตือน" },
    ],
  },
  {
    id: "connect8",
    number: 5,
    name: "CONNECT8",
    linkType: "live",
    url: "https://connect8.np.promptserve.tech/home",
    icon: "workflow",
    category: { en: "Integration & Automation", th: "เชื่อมระบบและอัตโนมัติ" },
    tagline: {
      en: "Let your systems talk to each other, then let AI take the next step",
      th: "ให้ระบบงานคุยกันเอง แล้วให้ AI ช่วยคิดต่อ",
    },
    description: {
      en: "One hub for business systems, automated workflows and AI agents. Teams build flows from templates without code, while IT governs access and reviews every call.",
      th: "ศูนย์กลางเชื่อมระบบงาน workflow อัตโนมัติ และ AI Agent ทีมสร้าง flow จากเทมเพลตได้โดยไม่ต้องเขียนโค้ด และ IT คุมสิทธิ์พร้อมดูประวัติการเรียกใช้ได้",
    },
    features: [
      { en: "71 connectors incl. Salesforce, LINE OA, Microsoft 365", th: "71 connector เช่น Salesforce, LINE OA, Microsoft 365" },
      { en: "MCP server for Agent8, Claude and Cursor", th: "MCP server สำหรับ Agent8, Claude และ Cursor" },
      { en: "Thai business functions: B.E. dates, baht in words", th: "ฟังก์ชันธุรกิจไทย เช่น วันที่ พ.ศ. และจำนวนเงินเป็นตัวอักษร" },
    ],
  },
  {
    id: "space8",
    number: 6,
    name: "SPACE8",
    linkType: "page",
    url: "/space8",
    icon: "map",
    category: { en: "Virtual Office", th: "ออฟฟิศเสมือน" },
    tagline: {
      en: "Walk over to your team, wherever they work",
      th: "เดินไปหาทีม ไม่ว่าจะทำงานอยู่ที่ไหน",
    },
    description: {
      en: "A 2D virtual office for teams in Thailand. Walk up to a teammate, talk to whoever is nearby, join meeting rooms and share your screen, all on one map.",
      th: "ออฟฟิศเสมือนแบบ 2D สำหรับทีมในไทย เดินไปคุยกับเพื่อนร่วมทีม ได้ยินคนที่อยู่ใกล้ เข้าห้องประชุมและแชร์หน้าจอได้บนแผนที่เดียว",
    },
    features: [
      { en: "Proximity audio and private meeting rooms", th: "เสียงตามระยะและห้องประชุมส่วนตัว" },
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
    category: { en: "Marketing Platform", th: "แพลตฟอร์มการตลาด" },
    tagline: {
      en: "Reach customers on every channel, with consent checked before every message",
      th: "ส่งถึงลูกค้าทุกช่องทาง เช็กความยินยอมก่อนทุกข้อความ",
    },
    description: {
      en: "Collect contacts, build segments, create content and send through Email, LINE OA, SMS, WhatsApp, Push and in-app from one place, with consent, suppression and quota checks on every send.",
      th: "รวบรวมรายชื่อ แบ่งกลุ่ม สร้างคอนเทนต์ และส่งผ่าน Email, LINE OA, SMS, WhatsApp, Push และ in-app จากที่เดียว พร้อมตรวจความยินยอม รายชื่อระงับ และโควตาก่อนส่งทุกครั้ง",
    },
    features: [
      { en: "Drag-and-drop multichannel Journeys with A/B tests", th: "Journey หลายช่องทางแบบลากวาง พร้อม A/B test" },
      { en: "PDPA consent records and preference center", th: "บันทึกความยินยอมและ preference center ตาม PDPA" },
      { en: "Salesforce sync and audience export to Meta, Google, LINE", th: "ซิงก์ Salesforce และส่ง audience ไป Meta, Google, LINE" },
    ],
  },
  {
    id: "collab8",
    number: 8,
    name: "COLLAB8",
    linkType: "page",
    url: "/collab8",
    icon: "chat",
    category: { en: "Agent Workspace", th: "พื้นที่ทำงานร่วมกับ Agent" },
    tagline: {
      en: "A chat workspace where your team and its AI agents work in the same room",
      th: "พื้นที่แชตที่ทีมและ AI Agent ทำงานอยู่ในห้องเดียวกัน",
    },
    description: {
      en: "Mention an agent in a channel and it works in its own sandbox. Risky actions wait for approval, and admins decide what agents may do and which knowledge they can search.",
      th: "แท็ก Agent ในช่องแล้วให้ทำงานใน sandbox ของตัวเอง การกระทำที่เสี่ยงต้องรออนุมัติ และแอดมินกำหนดได้ว่า Agent ทำอะไรได้และค้นความรู้ชุดไหนได้",
    },
    features: [
      { en: "Rooms, DMs and threads for people and agents", th: "ห้อง DM และเธรดสำหรับคนและ Agent" },
      { en: "Sandbox per session with a tool gate and approvals", th: "sandbox ต่อ session พร้อม tool gate และการอนุมัติ" },
      { en: "Knowledge bases, room policy and a verifiable audit log", th: "คลังความรู้ นโยบายห้อง และ audit log ที่ตรวจสอบได้" },
    ],
  },
  {
    id: "ask8",
    number: 9,
    name: "ASK8",
    linkType: "page",
    url: "/ask8",
    icon: "ask",
    category: { en: "Embedded Q&A", th: "ถาม-ตอบในหน้าที่ใช้อยู่" },
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
];
