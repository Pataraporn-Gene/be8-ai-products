import type { Locale } from "@/lib/i18n";

/* Every user-visible string on the Data8 page. English and Thai share one shape. */

type Item = { h: string; p: string };

const en = {
  meta: {
    title: "Data8 · One profile for every customer",
    description:
      "Data8 is a customer data platform. Bring in CRM, shop and email data, resolve duplicates into one profile per customer, build segments and send them to your marketing tools.",
  },
  header: { menuAria: "Main menu", menu: { flow: "How it works", modules: "Modules", trust: "Control", faq: "Help" } },
  hero: {
    eyebrow: "Data8 by Beryl8",
    h1: "One profile for every customer,",
    h1em: "ready to use in your next campaign.",
    lead:
      "Data8 is a customer data platform. Bring in CRM, online shop and email data, resolve duplicates into one profile per person, build segments with live counts, and send them to the tools your marketing team already uses.",
    cta1: "See how it works",
    cta2: "Explore the modules",
    mini: ["Thai and English customer data", "Every run has a history and an audit trail"],
  },
  mock: {
    title: "Identity Resolution",
    ruleset: "Email or phone",
    status: "Completed",
    before: "Source records",
    after: "Unified individuals",
    rate: "Consolidation",
    rows: [
      { src: "CRM contact", name: "Somchai Jaidee", key: "somchai.j@example.com" },
      { src: "Web shop customer", name: "สมชาย ใจดี", key: "somchai.j@example.com" },
      { src: "Web shop customer", name: "Somchai J.", key: "081-234-5678" },
    ],
    unified: "Unified individual · 3 records · 2 sources",
    note: "Illustrative screen with sample data",
  },
  facts: [
    { b: "5,400 → 3,400", span: "Sample records resolved into unified individuals" },
    { b: "Live segment counts", span: "See the audience size while you build the rules" },
    { b: "Runs on your Postgres", span: "Real tables, real jobs, no black box" },
    { b: "Thai-ready", span: "Sample data and search work in Thai and English" },
  ],
  flow: {
    eyebrow: "How it works",
    h2: "From raw files to an audience in seven steps",
    steps: [
      { h: "Connect a data stream", p: "Load a CSV or read from Postgres. Each stream lands in a data lake object, a real table you can query." },
      { h: "Map to the data model", p: "Map fields to standard objects such as Individual, Contact Point Email, Sales Order and Product, or define your own." },
      { h: "Resolve identities", p: "Match records with exact, normalized and fuzzy rules, then choose which source wins for each field." },
      { h: "Explore the profile", p: "Search a unified profile and see its source records, orders and email engagement in one place." },
      { h: "Calculate insights", p: "Write SQL or use the builder for lifetime value or orders in the last 90 days, and run it on a schedule." },
      { h: "Build a segment", p: "Combine attributes and insights with AND/OR rules, preview the live population, then publish." },
      { h: "Activate", p: "Send the segment to a CSV export, a webhook or Google Cloud Storage on a schedule, with a run history." },
    ] as Item[],
  },
  demo: {
    eyebrow: "A worked example",
    h2: "What the sample data produces",
    lead: "The demo seed runs the same actions and jobs as the app, so every number below comes from a real run on sample data.",
    head: { what: "Step", result: "Result" },
    rows: [
      { what: "Data streams", result: "CRM contacts 3,000 · web customers 2,400 · orders 18,000 · email events 25,000 · products 60" },
      { what: "Identity resolution", result: "5,400 records become 3,400 unified individuals; CRM values win first, web shop fills the gaps" },
      { what: "Calculated insight", result: "Customer lifetime value, order count and 90-day orders for 1,259 customers" },
      { what: "Segment", result: "Bangkok frequent buyers: 97 people, excluding anyone who opted out of email" },
      { what: "Activation", result: "97 rows written to a marketing export file, with a run recorded" },
      { what: "Data graph", result: "Customer 360 documents for all 3,400 profiles" },
      { what: "Clean room", result: "Audience overlap with a partner list: 200 shared emails" },
    ],
    note: "Numbers come from the bundled sample data. Order counts for the last 90 days change with the run date.",
  },
  modules: {
    eyebrow: "Modules",
    h2: "Everything between the file and the campaign",
    groups: [
      { h: "Ingest", p: "Data Streams and Data Lake Objects. Upload CSV or connect Postgres, with schedules and run history." },
      { h: "Model", p: "Data Model with a catalog of standard objects, field mappings that build model views, and Data Explorer for browsing them." },
      { h: "Identity", p: "Identity Resolution rulesets and Profile Explorer for searching unified profiles." },
      { h: "Insights", p: "Calculated Insights, Reports and Dashboards, plus a Semantic Layer so teams share one definition of revenue and orders." },
      { h: "Activate", p: "Segments, Activation Targets, Activations, Data Action Targets and Data Actions that call a webhook when a condition is met." },
      { h: "Share and search", p: "Data Transforms on a node canvas, Data Graphs, Secondary Indexes, Search Indexes, Data Shares, Clean Rooms, Notebook AI with SQL cells, and Process Content." },
    ] as Item[],
  },
  trust: {
    eyebrow: "Control",
    h2: "Built for the people who run the data",
    items: [
      { h: "Roles on the server", p: "Admins and marketers have different capabilities. Marketers cannot change engineer-only objects, and this is enforced on the server, not just hidden in the UI." },
      { h: "Read-only SQL", p: "The Query Editor and notebooks run as a read-only database role over the lake, model and insight schemas." },
      { h: "Run history and audit", p: "Every stream refresh, resolution, insight, segment and activation records a run, and changes are written to an audit log." },
      { h: "Safe outbound calls", p: "Webhook targets are checked against server-side request forgery before anything is sent, and actions stay off until a real target is set." },
    ] as Item[],
  },
  spec: {
    h2: "Technical summary",
    rows: [
      { dt: "App", dd: "Next.js with server actions, Radix UI components and the Beryl8 Workbench design." },
      { dt: "Database", dd: "PostgreSQL 16 with Drizzle. Separate schemas for the lake, model views and insight results." },
      { dt: "Jobs", dd: "A queue with a worker and a per-minute scheduler for streams, rulesets, insights, segments and activations." },
      { dt: "Sources", dd: "CSV upload and Postgres." },
      { dt: "Destinations", dd: "CSV export, Google Cloud Storage and webhooks." },
      { dt: "Language", dd: "English interface; Thai and English data." },
    ],
  },
  faq: {
    h2: "Questions",
    items: [
      { q: "How is a unified profile decided?", a: "Match rules decide which records belong to the same person, and reconciliation rules decide which source supplies each field. In the sample, CRM values win and the web shop fills what is missing." },
      { q: "Can marketers use it without an engineer?", a: "Yes for segments, activations and exploring profiles. Ingest, modelling and identity rules are engineer-only and the server enforces that." },
      { q: "Does Data8 copy my data elsewhere?", a: "Data lands in your own Postgres. A data share copies tables only to the target you choose." },
      { q: "Is this a live product?", a: "This page is a mockup for internal review. The screen is illustrative and uses sample data." },
    ],
  },
  footer: { copy: "© 2026 Beryl8 Public Company Limited. Internal mockup." },
};

export type Data8Content = typeof en;

const th: Data8Content = {
  meta: {
    title: "Data8 · โปรไฟล์เดียวสำหรับลูกค้าทุกคน",
    description:
      "Data8 คือ customer data platform นำข้อมูล CRM ร้านค้าออนไลน์ และอีเมลเข้ามา รวมข้อมูลซ้ำเป็นโปรไฟล์เดียวต่อคน สร้างกลุ่มเป้าหมาย แล้วส่งต่อไปยังเครื่องมือการตลาด",
  },
  header: { menuAria: "เมนูหลัก", menu: { flow: "การทำงาน", modules: "โมดูล", trust: "การควบคุม", faq: "ช่วยเหลือ" } },
  hero: {
    eyebrow: "Data8 โดย Beryl8",
    h1: "โปรไฟล์เดียวสำหรับลูกค้าทุกคน",
    h1em: "พร้อมใช้ในแคมเปญถัดไป",
    lead:
      "Data8 คือ customer data platform นำข้อมูล CRM ร้านค้าออนไลน์ และอีเมลเข้ามา รวมข้อมูลซ้ำเป็นโปรไฟล์เดียวต่อคน สร้าง segment พร้อมจำนวนคนแบบสด แล้วส่งต่อไปยังเครื่องมือที่ทีมการตลาดใช้อยู่",
    cta1: "ดูการทำงาน",
    cta2: "ดูโมดูลทั้งหมด",
    mini: ["รองรับข้อมูลลูกค้าไทยและอังกฤษ", "ทุกการรันมีประวัติและ audit trail"],
  },
  mock: {
    title: "Identity Resolution",
    ruleset: "อีเมลหรือเบอร์โทร",
    status: "เสร็จสิ้น",
    before: "ระเบียนต้นทาง",
    after: "บุคคลที่รวมแล้ว",
    rate: "อัตราการรวม",
    rows: [
      { src: "ผู้ติดต่อใน CRM", name: "Somchai Jaidee", key: "somchai.j@example.com" },
      { src: "ลูกค้าเว็บช็อป", name: "สมชาย ใจดี", key: "somchai.j@example.com" },
      { src: "ลูกค้าเว็บช็อป", name: "Somchai J.", key: "081-234-5678" },
    ],
    unified: "บุคคลที่รวมแล้ว · 3 ระเบียน · 2 แหล่ง",
    note: "หน้าจอตัวอย่าง ใช้ข้อมูลสมมติ",
  },
  facts: [
    { b: "5,400 → 3,400", span: "ระเบียนตัวอย่างที่รวมเป็นบุคคลเดียว" },
    { b: "จำนวน segment แบบสด", span: "เห็นขนาดกลุ่มเป้าหมายระหว่างตั้งกฎ" },
    { b: "รันบน Postgres ของคุณ", span: "ตารางจริง job จริง ไม่ใช่กล่องดำ" },
    { b: "รองรับภาษาไทย", span: "ข้อมูลตัวอย่างและการค้นหาใช้ได้ทั้งไทยและอังกฤษ" },
  ],
  flow: {
    eyebrow: "การทำงาน",
    h2: "จากไฟล์ดิบสู่กลุ่มเป้าหมายใน 7 ขั้น",
    steps: [
      { h: "เชื่อม data stream", p: "โหลด CSV หรืออ่านจาก Postgres แต่ละ stream ลงใน data lake object ซึ่งเป็นตารางจริงที่ query ได้" },
      { h: "แมปเข้ากับ data model", p: "แมปฟิลด์เข้ากับอ็อบเจกต์มาตรฐาน เช่น Individual, Contact Point Email, Sales Order และ Product หรือกำหนดเอง" },
      { h: "รวมตัวตน", p: "จับคู่ระเบียนด้วยกฎแบบตรงตัว แบบ normalize และแบบ fuzzy แล้วเลือกว่าแหล่งไหนชนะในแต่ละฟิลด์" },
      { h: "สำรวจโปรไฟล์", p: "ค้นหาโปรไฟล์ที่รวมแล้ว และดูระเบียนต้นทาง คำสั่งซื้อ และการมีส่วนร่วมทางอีเมลในที่เดียว" },
      { h: "คำนวณ insight", p: "เขียน SQL หรือใช้ builder เช่น lifetime value หรือจำนวนออเดอร์ 90 วัน แล้วตั้งให้รันตามรอบ" },
      { h: "สร้าง segment", p: "รวม attribute และ insight ด้วยกฎ AND/OR ดูจำนวนคนแบบสด แล้ว publish" },
      { h: "ส่งต่อ (Activate)", p: "ส่ง segment ไปเป็นไฟล์ CSV, webhook หรือ Google Cloud Storage ตามรอบ พร้อมประวัติการรัน" },
    ],
  },
  demo: {
    eyebrow: "ตัวอย่างการใช้งานจริง",
    h2: "ข้อมูลตัวอย่างให้ผลอะไร",
    lead: "สคริปต์ demo เรียก action และ job ชุดเดียวกับตัวแอป ตัวเลขด้านล่างทุกตัวจึงมาจากการรันจริงบนข้อมูลตัวอย่าง",
    head: { what: "ขั้นตอน", result: "ผลลัพธ์" },
    rows: [
      { what: "Data streams", result: "ผู้ติดต่อ CRM 3,000 · ลูกค้าเว็บ 2,400 · ออเดอร์ 18,000 · อีเมลอีเวนต์ 25,000 · สินค้า 60" },
      { what: "Identity resolution", result: "5,400 ระเบียนรวมเป็น 3,400 บุคคล ค่าจาก CRM ชนะก่อน แล้วเว็บช็อปเติมส่วนที่ขาด" },
      { what: "Calculated insight", result: "Lifetime value จำนวนออเดอร์ และออเดอร์ 90 วัน ของลูกค้า 1,259 คน" },
      { what: "Segment", result: "ลูกค้ากรุงเทพที่ซื้อบ่อย 97 คน ไม่รวมคนที่ปิดรับอีเมล" },
      { what: "Activation", result: "เขียน 97 แถวลงไฟล์ส่งออกสำหรับการตลาด พร้อมบันทึกการรัน" },
      { what: "Data graph", result: "เอกสาร Customer 360 ครบทั้ง 3,400 โปรไฟล์" },
      { what: "Clean room", result: "กลุ่มเป้าหมายที่ซ้ำกับรายชื่อพาร์ตเนอร์ 200 อีเมล" },
    ],
    note: "ตัวเลขมาจากข้อมูลตัวอย่างที่แถมมา ออเดอร์ 90 วันเปลี่ยนไปตามวันที่รัน",
  },
  modules: {
    eyebrow: "โมดูล",
    h2: "ครบตั้งแต่ไฟล์ถึงแคมเปญ",
    groups: [
      { h: "Ingest", p: "Data Streams และ Data Lake Objects อัปโหลด CSV หรือเชื่อม Postgres พร้อมตั้งเวลาและดูประวัติการรัน" },
      { h: "Model", p: "Data Model พร้อมแคตตาล็อกอ็อบเจกต์มาตรฐาน การแมปฟิลด์ที่สร้าง model view และ Data Explorer สำหรับเปิดดู" },
      { h: "Identity", p: "ชุดกฎ Identity Resolution และ Profile Explorer สำหรับค้นโปรไฟล์ที่รวมแล้ว" },
      { h: "Insights", p: "Calculated Insights, Reports และ Dashboards พร้อม Semantic Layer ให้ทุกทีมใช้คำนิยามรายได้และออเดอร์เดียวกัน" },
      { h: "Activate", p: "Segments, Activation Targets, Activations, Data Action Targets และ Data Actions ที่เรียก webhook เมื่อเข้าเงื่อนไข" },
      { h: "Share and search", p: "Data Transforms บน node canvas, Data Graphs, Secondary Indexes, Search Indexes, Data Shares, Clean Rooms, Notebook AI แบบ SQL cell และ Process Content" },
    ],
  },
  trust: {
    eyebrow: "การควบคุม",
    h2: "สร้างมาเพื่อคนดูแลข้อมูล",
    items: [
      { h: "สิทธิ์ตรวจที่ฝั่งเซิร์ฟเวอร์", p: "แอดมินกับมาร์เก็ตเตอร์มีสิทธิ์ต่างกัน มาร์เก็ตเตอร์แก้อ็อบเจกต์เฉพาะวิศวกรไม่ได้ และตรวจที่เซิร์ฟเวอร์ ไม่ใช่แค่ซ่อนปุ่ม" },
      { h: "SQL แบบอ่านอย่างเดียว", p: "Query Editor และ notebook รันด้วย role ฐานข้อมูลแบบอ่านอย่างเดียวบน schema lake, model และ insight" },
      { h: "ประวัติการรันและ audit", p: "ทุกการรีเฟรช stream การรวมตัวตน insight segment และ activation บันทึกการรัน และการเปลี่ยนแปลงลง audit log" },
      { h: "เรียกภายนอกอย่างปลอดภัย", p: "ปลายทาง webhook ถูกตรวจ SSRF ก่อนส่ง และ action จะปิดไว้จนกว่าจะตั้งปลายทางจริง" },
    ],
  },
  spec: {
    h2: "สรุปทางเทคนิค",
    rows: [
      { dt: "แอป", dd: "Next.js พร้อม server actions คอมโพเนนต์ Radix UI และดีไซน์ Beryl8 Workbench" },
      { dt: "ฐานข้อมูล", dd: "PostgreSQL 16 กับ Drizzle แยก schema สำหรับ lake, model view และผล insight" },
      { dt: "Job", dd: "คิวพร้อม worker และ scheduler ทุกนาที สำหรับ stream, ruleset, insight, segment และ activation" },
      { dt: "แหล่งข้อมูล", dd: "อัปโหลด CSV และ Postgres" },
      { dt: "ปลายทาง", dd: "ส่งออก CSV, Google Cloud Storage และ webhook" },
      { dt: "ภาษา", dd: "หน้าจอเป็นภาษาอังกฤษ ข้อมูลเป็นไทยและอังกฤษได้" },
    ],
  },
  faq: {
    h2: "คำถามที่พบบ่อย",
    items: [
      { q: "โปรไฟล์ที่รวมแล้วตัดสินอย่างไร", a: "กฎการจับคู่ตัดสินว่าระเบียนไหนเป็นคนเดียวกัน และกฎ reconciliation ตัดสินว่าแหล่งไหนให้ค่าของแต่ละฟิลด์ ในตัวอย่าง ค่าจาก CRM ชนะ แล้วเว็บช็อปเติมส่วนที่ขาด" },
      { q: "มาร์เก็ตเตอร์ใช้เองได้ไหม ไม่ต้องพึ่งวิศวกร", a: "ได้สำหรับ segment, activation และการสำรวจโปรไฟล์ ส่วน ingest, modelling และกฎ identity เป็นของวิศวกรเท่านั้น และเซิร์ฟเวอร์บังคับให้" },
      { q: "Data8 คัดลอกข้อมูลไปที่อื่นไหม", a: "ข้อมูลอยู่ใน Postgres ของคุณเอง Data share คัดลอกตารางไปยังปลายทางที่คุณเลือกเท่านั้น" },
      { q: "นี่คือผลิตภัณฑ์จริงแล้วหรือยัง", a: "หน้านี้เป็นตัวอย่างสำหรับตรวจสอบภายใน หน้าจอเป็นภาพประกอบและใช้ข้อมูลสมมติ" },
    ],
  },
  footer: { copy: "© 2026 Beryl8 Public Company Limited. ตัวอย่างภายใน" },
};

export const content: Record<Locale, Data8Content> = { en, th };
