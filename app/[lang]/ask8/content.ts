import type { Locale } from "@/lib/i18n";

/* Every user-visible string on the Ask8 page. English and Thai share one shape. */

export type SrcType = "policy" | "faq" | "doc" | "product" | "record" | "transcript" | "file";
type L2 = { en: string; th: string };
export type DemoKey = "hr" | "it" | "sales" | "intranet" | "meeting";
export type DemoExample = {
  h: L2;
  p: L2;
  q: L2;
  /** {1}/{2} mark citation chips. */
  a: L2;
  src: { t: SrcType; n: L2; c: number }[];
};

export const SRC_TYPE: Record<SrcType, L2> = {
  policy: { en: "Policy", th: "นโยบาย" },
  faq: { en: "FAQ", th: "คำถามที่พบบ่อย" },
  doc: { en: "Document", th: "เอกสาร" },
  product: { en: "Product data", th: "ข้อมูลสินค้า" },
  record: { en: "System record", th: "ข้อมูลในระบบ" },
  transcript: { en: "Transcript", th: "บันทึกการประชุม" },
  file: { en: "Shared file", th: "ไฟล์ที่แชร์" },
};

export const DEMO_KEYS: DemoKey[] = ["hr", "it", "sales", "intranet", "meeting"];

export const DEMO: Record<DemoKey, DemoExample> = {
  hr: {
    h: { en: "Leave, benefits and company policies", th: "วันลา สวัสดิการ และนโยบายบริษัท" },
    p: { en: "Employees ask about leave, benefits or company policies without waiting for HR.", th: "พนักงานถามเรื่องวันลา สวัสดิการ หรือนโยบายบริษัทได้เลย ไม่ต้องรอ HR" },
    q: { en: "How many days of annual leave do I get in my second year?", th: "ปีที่สองได้วันลาพักร้อนกี่วัน" },
    a: { en: "In your second year you get 12 days of annual leave {1}. Up to 5 unused days carry over to the next year {2}.", th: "ปีที่สองได้วันลาพักร้อน 12 วัน {1} และวันที่ใช้ไม่หมดยกไปปีถัดไปได้สูงสุด 5 วัน {2}" },
    src: [
      { t: "policy", n: { en: "Leave policy 2026", th: "นโยบายการลา 2026" }, c: 1 },
      { t: "faq", n: { en: "HR questions", th: "คำถามที่พบบ่อยฝ่ายบุคคล" }, c: 2 },
      { t: "doc", n: { en: "Employee handbook", th: "คู่มือพนักงาน" }, c: 0 },
    ],
  },
  it: {
    h: { en: "Fixes and how-to guides", th: "วิธีแก้ปัญหาและคู่มือการใช้งาน" },
    p: { en: "Staff troubleshoot common issues and find how-to guides on their own.", th: "พนักงานแก้ปัญหาทั่วไปและค้นคู่มือการใช้งานได้ด้วยตัวเอง" },
    q: { en: "How do I connect to the office VPN from home?", th: "ต่อ VPN ของออฟฟิศจากที่บ้านยังไง" },
    a: { en: "Install the VPN app from the company portal and sign in with your work email {1}. If the connection keeps dropping, restart the app before you open a ticket {2}.", th: "ติดตั้งแอป VPN จากพอร์ทัลของบริษัท แล้วล็อกอินด้วยอีเมลที่ทำงาน {1} ถ้าหลุดบ่อยให้รีสตาร์ตแอปก่อนเปิด ticket {2}" },
    src: [
      { t: "doc", n: { en: "VPN setup guide", th: "คู่มือตั้งค่า VPN" }, c: 1 },
      { t: "faq", n: { en: "IT helpdesk FAQ", th: "คำถามที่พบบ่อยฝ่ายไอที" }, c: 2 },
      { t: "record", n: { en: "Open tickets", th: "รายการ ticket ที่เปิดอยู่" }, c: 0 },
    ],
  },
  sales: {
    h: { en: "Specs, pricing rules and proposals", th: "สเปก กฎราคา และเอกสารเสนอขาย" },
    p: { en: "Internal teams find product specs, pricing rules and proposal materials quickly.", th: "ทีมภายในค้นสเปกสินค้า กฎการตั้งราคา และเอกสารเสนอขายได้อย่างรวดเร็ว" },
    q: { en: "What discount can I offer on a three-year contract?", th: "สัญญาสามปีให้ส่วนลดได้เท่าไหร่" },
    a: { en: "You can offer up to 15% on a three-year contract without approval {1}. Anything above that needs sign-off from the sales director {1}. This quarter's list prices are in the current price list {2}.", th: "สัญญาสามปีให้ส่วนลดได้ถึง 15% โดยไม่ต้องขออนุมัติ {1} ถ้าเกินกว่านั้นต้องให้ผู้อำนวยการฝ่ายขายอนุมัติ {1} ราคาตั้งของไตรมาสนี้ดูได้จากรายการราคาล่าสุด {2}" },
    src: [
      { t: "policy", n: { en: "Pricing rules", th: "กฎการตั้งราคา" }, c: 1 },
      { t: "product", n: { en: "Price list Q4", th: "รายการราคา Q4" }, c: 2 },
      { t: "doc", n: { en: "Proposal template", th: "เทมเพลตใบเสนอราคา" }, c: 0 },
    ],
  },
  intranet: {
    h: { en: "One box for the whole intranet", th: "ช่องเดียวสำหรับทั้งอินทราเน็ต" },
    p: { en: "One search-and-ask box across internal documents and announcements.", th: "ช่องค้นหาและถามช่องเดียว ครอบคลุมเอกสารภายในและประกาศของบริษัท" },
    q: { en: "When is the office closed for New Year?", th: "ออฟฟิศหยุดปีใหม่วันไหนบ้าง" },
    a: { en: "The office is closed from December 31 to January 2 {1}. The support line stays open for urgent issues {2}.", th: "ออฟฟิศหยุดตั้งแต่วันที่ 31 ธันวาคมถึง 2 มกราคม {1} สายด่วนสำหรับเรื่องเร่งด่วนยังเปิดตามปกติ {2}" },
    src: [
      { t: "doc", n: { en: "Holiday announcement", th: "ประกาศวันหยุด" }, c: 1 },
      { t: "faq", n: { en: "Office FAQ", th: "คำถามที่พบบ่อยเรื่องออฟฟิศ" }, c: 2 },
      { t: "record", n: { en: "Company calendar", th: "ปฏิทินบริษัท" }, c: 0 },
    ],
  },
  meeting: {
    h: { en: "Ask what was just said", th: "ถามสิ่งที่เพิ่งพูดไปได้ทันที" },
    p: { en: "During a meeting, attendees ask about what was said, what was decided or anything they missed.", th: "ระหว่างการประชุม ผู้เข้าร่วมถามได้ว่าเพิ่งพูดอะไรไป ตัดสินใจอะไรไปแล้ว หรือมีประเด็นไหนที่พลาดไป" },
    q: { en: "Why did the launch move to October 28?", th: "ทำไมการเปิดตัวเลื่อนไปวันที่ 28 ตุลาคม" },
    a: { en: "The payment gateway certification came back with two open items, and the bank needs ten working days to re-test {1}. October 28 covers that and leaves a week for the mobile app review {1}.", th: "การรับรอง payment gateway กลับมาพร้อมประเด็นค้างสองข้อ และธนาคารต้องใช้เวลาทดสอบใหม่สิบวันทำการ {1} วันที่ 28 ตุลาคมครอบคลุมช่วงนั้นและเหลือเวลาหนึ่งสัปดาห์สำหรับรีวิวแอปมือถือ {1}" },
    src: [
      { t: "transcript", n: { en: "Q3 Launch Review", th: "Q3 Launch Review" }, c: 1 },
      { t: "file", n: { en: "Launch plan.pptx", th: "Launch plan.pptx" }, c: 0 },
      { t: "doc", n: { en: "Meeting notes", th: "โน้ตการประชุม" }, c: 0 },
    ],
  },
};

export type ScreenKey = "recap" | "answer" | "prep";
export const SCREEN_URL: Record<ScreenKey, string> = {
  recap: "meet8 / meetings / Q3 Launch Review",
  answer: "meet8 / meetings / Q3 Launch Review / ask",
  prep: "meet8 / meetings / Customer Onboarding Kickoff / prep",
};

const en = {
  meta: {
    title: "Ask8 · Answers from your own documents",
    description:
      "Ask8 is a smaller version of Collab8 that you can add to any website, app or department. Your team asks questions and gets answers, with sources, from your company's own documents.",
  },
  header: { menuAria: "Main menu", menu: { tryit: "Take a look", demo: "Demo", more: "Meetings", custom: "Settings" } },
  hero: {
    eyebrow: "Ask8",
    h1: "Get answers",
    h1em: "without leaving the page you're on",
    lead:
      "Ask8 is a smaller version of Collab8 that you can add to any website, app or department. Your team asks questions and gets answers from your company's own documents, with no extra tool to open.",
    cta1: "Try the demo",
    cta2: "See it in Meet8",
    mini: ["Every answer shows its source", "Works inside the pages your team already uses"],
    shotUrl: "meet8 / meetings / Q3 Launch Review",
    heroAlt: "Meet8 recap page for the Q3 Launch Review, with the meeting summary on the left and the question box on the right",
    floatCap: "Answer · from the meeting transcript",
    floatAlt: "An answer explaining why the launch moved to October 28, with one cited source: the Q3 Launch Review",
    pill: "Answered · 1 source",
  },
  facts: [
    { b: "Sources on every answer", span: "Each answer links to where it came from" },
    { b: "Your own documents", span: "Answers from what each department already keeps" },
    { b: "Respects access rights", span: "People only get answers from what they're allowed to see" },
    { b: "Thai and English", span: "Ask and get answers in either language" },
  ],
  shotNote: "Screenshots are from Meet8, shown with sample data.",
  marquee: ["Answers with sources", "HR", "IT helpdesk", "Sales", "Company intranet", "Meeting prep", "During meetings", "Meeting recap", "Thai and English", "Connects through Connect8"],
  tryit: {
    eyebrow: "Take a look",
    h2: "Ask is already part of Meet8",
    p: "These screens come from Meet8, where people already ask questions about each meeting.",
    tabsAria: "View screens",
    tabs: { recap: "Recap", answer: "Answer", prep: "Prep" },
    alts: {
      recap: "Meet8 recap page with the question box",
      answer: "The question box with an answer, its cited source and suggested questions",
      prep: "Meet8 prep page for the Customer Onboarding Kickoff",
    },
  },
  sectionNav: { aria: "Page sections", demo: "Demo", more: "Meetings", custom: "Settings" },
  demo: {
    eyebrow: "Your information",
    h2: "Answers from your own documents and data",
    p: "Ask8 reads the documents, FAQs, policies and records each department already keeps, and answers based on the page where the question was asked.",
    tabsAria: "Departments",
    tabs: { hr: "HR", it: "IT helpdesk", sales: "Sales", intranet: "Intranet", meeting: "Meetings" },
    answer: "Answer",
    example: "Example",
    checking: "Checking…",
    source: "Source ",
    notUsed: "Not used",
    note: "The questions and answers above are examples. The meeting example uses the same meeting as the screenshots.",
  },
  more: {
    eyebrow: "In meetings",
    h2: "Ask before, during and after a meeting",
    during: {
      k: "During the meeting",
      h: "Ask what was just said",
      p: "Attendees can ask about what was just said, what was decided or anything they missed. Answers come from what was said in the meeting and the files shared in it.",
      alt: "An answer with a cited source from the meeting transcript",
    },
    after: {
      k: "After the meeting",
      h: "Go back to any decision",
      p: "The recap keeps the transcript, summary and question box on one page, with suggested questions to start from.",
      alt: "The question box on a recap page with an answer and suggested questions",
    },
    before: {
      k: "Before the meeting",
      h: "Check the details before it starts",
      p: "Ask about the meeting details and attached files before the meeting starts.",
      alt: "The question box on a prep page, scoped to the Customer Onboarding Kickoff",
    },
  },
  custom: {
    eyebrow: "Settings",
    h2: "Set it up the way each department works",
    p: "Each setup has its own sources, rules and connections.",
    items: [
      { h: "What it can read", p: "Choose which documents each page can use. A public page answers only from public content, while internal pages can also use internal documents." },
      { h: "Answer rules", p: "Set the topics it should not answer, the notices it must show, when to pass a question to a staff member and who can see what." },
      { h: "Cost and connections", p: "Choose the AI service that fits your budget, and connect to your CRM, help desk or internal systems through Connect8." },
      { h: "Easy to set up and run", p: "Each department manages its own documents, access rights and answer style. Adding Ask8 to a new page doesn't need a large development project." },
    ],
  },
  footer: { copy: "Ask8" },
};

export type Ask8Content = typeof en;

const th: Ask8Content = {
  meta: {
    title: "Ask8 · ได้คำตอบจากเอกสารของบริษัทคุณเอง",
    description:
      "Ask8 คือ Collab8 ฉบับย่อที่ติดตั้งในเว็บไซต์ แอป หรือหน่วยงานใดก็ได้ ทีมของคุณถามคำถามและได้คำตอบพร้อมแหล่งที่มาจากเอกสารของบริษัทเอง",
  },
  header: { menuAria: "เมนูหลัก", menu: { tryit: "ลองดู", demo: "เดโม", more: "การประชุม", custom: "การตั้งค่า" } },
  hero: {
    eyebrow: "Ask8",
    h1: "ได้คำตอบ",
    h1em: "โดยไม่ต้องออกจากหน้าที่ใช้อยู่",
    lead:
      "Ask8 คือ Collab8 ฉบับย่อที่ติดตั้งในเว็บไซต์ แอป หรือหน่วยงานใดก็ได้ ทีมของคุณถามคำถามและได้คำตอบจากเอกสารของบริษัทเอง โดยไม่ต้องเปิดโปรแกรมอื่นเพิ่ม",
    cta1: "ลองเดโม",
    cta2: "ดูใน Meet8",
    mini: ["ทุกคำตอบบอกแหล่งที่มา", "ใช้งานได้ในหน้าที่ทีมเปิดใช้อยู่แล้ว"],
    shotUrl: "meet8 / meetings / Q3 Launch Review",
    heroAlt: "หน้าสรุปการประชุม Q3 Launch Review ใน Meet8 ด้านซ้ายเป็นสรุปการประชุม ด้านขวาเป็นช่องถามคำถาม",
    floatCap: "คำตอบ · จากบันทึกการประชุม",
    floatAlt: "คำตอบที่อธิบายว่าทำไมการเปิดตัวเลื่อนไปวันที่ 28 ตุลาคม พร้อมอ้างอิงหนึ่งแหล่งคือการประชุม Q3 Launch Review",
    pill: "ตอบแล้ว · 1 แหล่งอ้างอิง",
  },
  facts: [
    { b: "มีแหล่งที่มาทุกคำตอบ", span: "ทุกคำตอบลิงก์ไปยังที่มาของข้อมูล" },
    { b: "ใช้เอกสารของคุณเอง", span: "ตอบจากข้อมูลที่แต่ละหน่วยงานมีอยู่แล้ว" },
    { b: "เคารพสิทธิ์การเข้าถึง", span: "แต่ละคนได้คำตอบจากข้อมูลที่ตัวเองมีสิทธิ์เห็นเท่านั้น" },
    { b: "ไทยและอังกฤษ", span: "ถามและได้คำตอบได้ทั้งสองภาษา" },
  ],
  shotNote: "ภาพหน้าจอมาจาก Meet8 ใช้ข้อมูลตัวอย่าง",
  marquee: ["คำตอบพร้อมแหล่งที่มา", "ฝ่ายบุคคล", "ฝ่ายไอที", "ฝ่ายขาย", "อินทราเน็ต", "เตรียมประชุม", "ระหว่างประชุม", "สรุปประชุม", "ไทยและอังกฤษ", "เชื่อมต่อผ่าน Connect8"],
  tryit: {
    eyebrow: "ลองดู",
    h2: "Ask เป็นส่วนหนึ่งของ Meet8 แล้ว",
    p: "ภาพเหล่านี้มาจาก Meet8 ซึ่งถามเรื่องในแต่ละการประชุมได้แล้ว",
    tabsAria: "ดูหน้าจอ",
    tabs: { recap: "สรุปประชุม", answer: "คำตอบ", prep: "เตรียมประชุม" },
    alts: {
      recap: "หน้าสรุปการประชุมใน Meet8 พร้อมช่องถาม",
      answer: "ช่องถามพร้อมคำตอบ แหล่งอ้างอิง และคำถามแนะนำ",
      prep: "หน้าเตรียมประชุม Customer Onboarding Kickoff ใน Meet8",
    },
  },
  sectionNav: { aria: "ส่วนของหน้า", demo: "เดโม", more: "การประชุม", custom: "การตั้งค่า" },
  demo: {
    eyebrow: "ข้อมูลของคุณ",
    h2: "คำตอบจากเอกสารและข้อมูลของบริษัทคุณเอง",
    p: "Ask8 อ่านเอกสาร คำถามที่พบบ่อย นโยบาย และข้อมูลที่แต่ละหน่วยงานมีอยู่แล้ว และตอบให้ตรงกับหน้าที่ผู้ใช้ถามคำถาม",
    tabsAria: "หน่วยงาน",
    tabs: { hr: "ฝ่ายบุคคล", it: "ฝ่ายไอที", sales: "ฝ่ายขาย", intranet: "อินทราเน็ต", meeting: "การประชุม" },
    answer: "คำตอบ",
    example: "ตัวอย่าง",
    checking: "กำลังตรวจ…",
    source: "แหล่งที่ ",
    notUsed: "ไม่ได้ใช้",
    note: "คำถามและคำตอบด้านบนเป็นตัวอย่าง ตัวอย่างการประชุมใช้การประชุมเดียวกับภาพหน้าจอ",
  },
  more: {
    eyebrow: "ในการประชุม",
    h2: "ถามได้ทั้งก่อน ระหว่าง และหลังประชุม",
    during: {
      k: "ระหว่างประชุม",
      h: "ถามสิ่งที่เพิ่งพูดไปได้ทันที",
      p: "ผู้เข้าร่วมถามได้ว่าเพิ่งพูดอะไรไป ตัดสินใจอะไรไปแล้ว หรือมีประเด็นไหนที่พลาดไป คำตอบมาจากสิ่งที่พูดในที่ประชุมและไฟล์ที่แชร์ในห้อง",
      alt: "คำตอบพร้อมแหล่งอ้างอิงจากบันทึกการประชุม",
    },
    after: {
      k: "หลังประชุม",
      h: "ย้อนดูการตัดสินใจได้ทุกเมื่อ",
      p: "หน้าสรุปการประชุมรวมบันทึกคำพูด สรุป และช่องถามไว้ในหน้าเดียว พร้อมคำถามแนะนำให้เริ่มถาม",
      alt: "ช่องถามในหน้าสรุปการประชุมพร้อมคำตอบและคำถามแนะนำ",
    },
    before: {
      k: "ก่อนประชุม",
      h: "เช็กรายละเอียดก่อนเริ่มประชุม",
      p: "ถามเรื่องรายละเอียดการประชุมและไฟล์ที่แนบไว้ได้ก่อนเริ่มประชุม",
      alt: "ช่องถามในหน้าเตรียมประชุม จำกัดขอบเขตอยู่ที่การประชุม Customer Onboarding Kickoff",
    },
  },
  custom: {
    eyebrow: "การตั้งค่า",
    h2: "ตั้งค่าให้ตรงกับการทำงานของแต่ละหน่วยงาน",
    p: "แต่ละจุดที่ติดตั้งมีแหล่งข้อมูล กฎ และการเชื่อมต่อของตัวเอง",
    items: [
      { h: "ข้อมูลที่ใช้ได้", p: "เลือกได้ว่าแต่ละหน้าใช้เอกสารชุดไหน หน้าสาธารณะตอบจากเนื้อหาสาธารณะเท่านั้น ส่วนหน้าภายในใช้เอกสารภายในได้ด้วย" },
      { h: "กฎการตอบ", p: "กำหนดหัวข้อที่ไม่ตอบ ข้อความที่ต้องแสดงทุกครั้ง เมื่อไหร่ต้องส่งต่อให้เจ้าหน้าที่ และใครเห็นข้อมูลอะไรได้บ้าง" },
      { h: "ค่าใช้จ่ายและการเชื่อมต่อ", p: "เลือกบริการ AI ที่เหมาะกับงบประมาณ และเชื่อมต่อกับ CRM ระบบรับเรื่อง หรือระบบภายในผ่าน Connect8" },
      { h: "ติดตั้งและดูแลง่าย", p: "แต่ละหน่วยงานดูแลเอกสาร สิทธิ์การเข้าถึง และรูปแบบการตอบของตัวเอง การเพิ่ม Ask8 ในหน้าใหม่ไม่ต้องทำโปรเจกต์พัฒนาใหญ่" },
    ],
  },
  footer: { copy: "Ask8" },
};

export const content: Record<Locale, Ask8Content> = { en, th };
