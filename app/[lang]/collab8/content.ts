import type { Locale } from "@/lib/i18n";

/* Every user-visible string on the Collab8 page. Thai and English share one shape. */

type Item = { h: string; p: string };

const en = {
  meta: {
    title: "Collab8 · A chat workspace for your team and its AI agents",
    description:
      "Rooms where people and AI agents work together. Each agent session runs in its own sandbox, risky actions wait for approval, and admins decide what agents may do and which knowledge they can search.",
  },
  header: {
    menuAria: "Main menu",
    menu: { how: "How it works", features: "Features", control: "Control", faq: "Help" },
    cta: "See how it works",
  },
  hero: {
    eyebrow: "Collab8 by Beryl8",
    h1: "Where your team and its AI agents",
    h1em: "work in the same room.",
    lead:
      "Collab8 is a chat workspace. Mention an agent in a channel the way you would mention a colleague, and it picks up the task in its own sandbox. Admins decide what agents may do, which knowledge they can search, and who can see what.",
    cta1: "See how it works",
    cta2: "How it stays safe",
    mini: ["People and agents in one thread", "Every agent session runs in its own sandbox"],
  },
  chat: {
    org: "Beryl8",
    rooms: "Rooms",
    agents: "Agents",
    room: "# hr-helpdesk",
    topic: "Staff questions on leave and benefits",
    messages: [
      { who: "Napat", role: "person", text: "@benefits-agent how many days is the waiting period for cancer cover?" },
      {
        who: "benefits-agent",
        role: "agent",
        text: "The policy sets a 90-day waiting period for critical illness cover. Source: Employee Benefits Guide 2026, section 4.2.",
        chip: "Searched knowledge: HR policies",
      },
      { who: "Mali", role: "person", text: "Thanks. @expense-agent please file my claim from the attached receipt." },
    ],
    approval: {
      tag: "Waiting for approval",
      title: "expense-agent wants to write a file",
      file: "File: claims/mali-2026-10.xlsx",
      dest: "Destination: this session's workspace only",
      approve: "Approve",
      session: "Approve for this session",
      deny: "Refuse",
    },
    composer: "Message #hr-helpdesk, or @mention an agent",
    mock: "Illustrative screen with sample data",
  },
  facts: [
    { b: "Rooms for people and agents", span: "Channels, DMs and projects with threads and @mentions" },
    { b: "A sandbox per session", span: "gVisor pods on GKE in production, containers locally" },
    { b: "Keys stay outside", span: "Sandboxes hold a placeholder; the egress proxy adds the real key" },
    { b: "Tamper-evident audit log", span: "A hash chain you can verify from the product" },
  ],
  how: {
    eyebrow: "How it works",
    h2: "From a question in chat to a finished task",
    steps: [
      {
        h: "Mention an agent",
        p: "Write in a room or a DM. A message goes to the agent you @mention, the agent of a DM, or the agent already working that thread. A message that names nobody in a shared room reaches nobody.",
      },
      {
        h: "The agent works in a sandbox",
        p: "Collab8 starts a session for the thread, with its own pod or container. The agent can use Claude or Gemini models, connectors, room memory and the knowledge bases an admin attached to it.",
      },
      {
        h: "The tool gate decides",
        p: "Every tool call is judged by where its paths really lead. It is let through, refused, or held for a person to approve, and the approval covers only the places the approver was shown.",
      },
      {
        h: "The answer lands whole",
        p: "A turn's answer and the files it made are delivered into the thread together, never half done and never twice. Follow-ups in the same thread continue the same session.",
      },
    ] as Item[],
  },
  features: {
    eyebrow: "Features",
    h2: "Built for teams that work with agents every day",
    items: [
      {
        h: "Rooms, DMs and threads",
        p: "Channels, direct messages and project rooms with pins, reactions, attachments and image previews. Guests can talk in a room without being able to reshape it.",
      },
      {
        h: "Agents you configure",
        p: "Admins create agents with a default model and effort, choose who can see each one, and pick which knowledge bases it may search.",
      },
      {
        h: "Knowledge bases",
        p: "Upload documents to a knowledge base backed by Vertex AI Search. Agents answer from them with the search_knowledge tool. A document counts as ready only once it is indexed.",
      },
      {
        h: "Memory that stays in the room",
        p: "Each room keeps a memory per agent, so a team does not repeat itself. Anyone can open it to see what the agent remembers.",
      },
      {
        h: "Files, images and slides",
        p: "Agents return files, generated images and slide decks. Decks open as a carousel of slide previews inside the thread.",
      },
      {
        h: "Connectors",
        p: "Attach business systems to agents as connectors, with credentials kept on the server side and never handed to a sandbox.",
      },
    ] as Item[],
  },
  control: {
    eyebrow: "Control",
    h2: "Admins decide what agents may do",
    lead: "Agents are powerful, so Collab8 puts the limits where an admin can see and change them.",
    items: [
      { h: "Tool gate with approvals", p: "Sensitive calls wait for a person. The card shows the file and destination, and an approval can be given once or for the rest of the session." },
      { h: "Room policy", p: "Owners and admins set a room's retention window, who may approve its agents' work, and the scope that caps every agent in it." },
      { h: "Hidden, not just forbidden", p: "A room you are not in, and every admin screen, answers as if it did not exist. A refused action on something you can see tells you that you may not." },
      { h: "Audit log you can verify", p: "Agent, knowledge, member, approval and gate events are recorded in a hash chain, with a Verify integrity check and filters by agent, channel and event type." },
      { h: "Usage and budgets", p: "See sessions and tokens per agent. A summon is refused when the agent is over budget, and a person who asked is told why." },
      { h: "Credentials never enter a sandbox", p: "Containers and pods hold a placeholder. The egress proxy adds the real model key on the way out." },
    ] as Item[],
  },
  roles: {
    h2: "Four workspace roles",
    rows: [
      { dt: "Owner", dd: "Runs the workspace, including agents, knowledge, usage and the audit log." },
      { dt: "Admin", dd: "Same admin surfaces as an owner: agents, usage, audit log and knowledge bases." },
      { dt: "Member", dd: "Talks in rooms they belong to, mentions agents and approves where policy allows." },
      { dt: "Guest", dd: "May talk in a room they were added to, but cannot reshape it." },
    ],
  },
  spec: {
    h2: "Technical summary",
    rows: [
      { dt: "Web app", dd: "Next.js chat UI with settings for Agents, Usage, Audit log and Knowledge." },
      { dt: "Realtime", dd: "WebSocket gateway fanning out new messages over Redis." },
      { dt: "Agent runner", dd: "Queue-based worker that starts a sandbox per session and gates tool calls." },
      { dt: "Models", dd: "Claude (Opus, Sonnet, Haiku) and Gemini models, chosen per agent." },
      { dt: "Knowledge", dd: "Vertex AI Search. Thai documents need Thai queries." },
      { dt: "Hosting", dd: "Cloud Run, GKE Autopilot with GKE Sandbox (gVisor), Cloud SQL for PostgreSQL." },
      { dt: "Sign-in", dd: "Google sign-in with company email domains." },
    ],
  },
  faq: {
    h2: "Questions",
    items: [
      {
        q: "Can an agent see every room?",
        a: "No. An agent works only in rooms it is a member of, and a room policy can cap its scope further. Rooms a person is not in are hidden from them as well.",
      },
      {
        q: "What stops an agent from reading files it should not?",
        a: "The tool gate resolves where each path really leads and keeps file tools inside the session's own tree. Calls outside it are refused or held for approval.",
      },
      {
        q: "Does it understand Thai documents?",
        a: "Yes, with one caveat: search matches the language of the query, so ask in Thai to find Thai content.",
      },
      {
        q: "Can we export our data?",
        a: "Yes. A workspace can be exported with its messages and files in a single archive.",
      },
      {
        q: "Is this a live product?",
        a: "This page is a mockup for internal review. Screens are illustrative and use sample data.",
      },
    ],
  },
  footer: { copy: "© 2026 Beryl8 Public Company Limited. Internal mockup." },
};

export type Collab8Content = typeof en;

const th: Collab8Content = {
  meta: {
    title: "Collab8 · พื้นที่แชตสำหรับทีมและ AI Agent",
    description:
      "ห้องที่คนและ AI Agent ทำงานร่วมกัน Agent แต่ละ session รันใน sandbox ของตัวเอง การกระทำที่เสี่ยงต้องรอการอนุมัติ และแอดมินกำหนดได้ว่า Agent ทำอะไรได้และค้นความรู้ชุดไหนได้",
  },
  header: {
    menuAria: "เมนูหลัก",
    menu: { how: "การทำงาน", features: "ฟีเจอร์", control: "การควบคุม", faq: "ช่วยเหลือ" },
    cta: "ดูการทำงาน",
  },
  hero: {
    eyebrow: "Collab8 โดย Beryl8",
    h1: "ที่ที่ทีมและ AI Agent",
    h1em: "ทำงานอยู่ในห้องเดียวกัน",
    lead:
      "Collab8 คือพื้นที่แชต แท็ก Agent ในช่องเหมือนแท็กเพื่อนร่วมงาน แล้ว Agent จะรับงานต่อใน sandbox ของตัวเอง แอดมินกำหนดได้ว่า Agent ทำอะไรได้ ค้นความรู้ชุดไหนได้ และใครเห็นอะไร",
    cta1: "ดูการทำงาน",
    cta2: "ปลอดภัยอย่างไร",
    mini: ["คนและ Agent อยู่ในเธรดเดียวกัน", "ทุก session ของ Agent รันใน sandbox ของตัวเอง"],
  },
  chat: {
    org: "Beryl8",
    rooms: "ห้อง",
    agents: "Agent",
    room: "# hr-helpdesk",
    topic: "ถามเรื่องการลาและสวัสดิการ",
    messages: [
      { who: "ณภัทร", role: "person", text: "@benefits-agent ประกันมะเร็งมีระยะรอคอยกี่วัน" },
      {
        who: "benefits-agent",
        role: "agent",
        text: "กรมธรรม์กำหนดระยะรอคอย 90 วันสำหรับความคุ้มครองโรคร้ายแรง ที่มา: คู่มือสวัสดิการพนักงาน 2026 ข้อ 4.2",
        chip: "ค้นคลังความรู้: นโยบายฝ่ายบุคคล",
      },
      { who: "มะลิ", role: "person", text: "ขอบคุณค่ะ @expense-agent ช่วยยื่นใบเบิกจากใบเสร็จที่แนบให้หน่อย" },
    ],
    approval: {
      tag: "รออนุมัติ",
      title: "expense-agent ขอเขียนไฟล์",
      file: "ไฟล์: claims/mali-2026-10.xlsx",
      dest: "ปลายทาง: workspace ของ session นี้เท่านั้น",
      approve: "อนุมัติ",
      session: "อนุมัติตลอด session นี้",
      deny: "ปฏิเสธ",
    },
    composer: "ส่งข้อความใน #hr-helpdesk หรือแท็ก Agent ด้วย @",
    mock: "หน้าจอตัวอย่าง ใช้ข้อมูลสมมติ",
  },
  facts: [
    { b: "ห้องสำหรับคนและ Agent", span: "ช่อง DM และโปรเจกต์ พร้อมเธรดและการแท็ก @" },
    { b: "หนึ่ง session หนึ่ง sandbox", span: "pod แบบ gVisor บน GKE ใน production และ container ในเครื่อง" },
    { b: "คีย์อยู่ข้างนอก", span: "sandbox ถือแค่ค่าแทน ส่วน egress proxy ใส่คีย์จริงให้" },
    { b: "audit log ตรวจการแก้ไขได้", span: "เป็น hash chain ที่กดตรวจจากในระบบได้" },
  ],
  how: {
    eyebrow: "การทำงาน",
    h2: "จากคำถามในแชต สู่งานที่เสร็จ",
    steps: [
      {
        h: "แท็ก Agent",
        p: "พิมพ์ในห้องหรือ DM ข้อความจะไปถึง Agent ที่แท็กด้วย @ Agent ของ DM หรือ Agent ที่กำลังทำเธรดนั้นอยู่ ข้อความที่ไม่ระบุใครในห้องรวมจะไม่ถึง Agent ตัวไหน",
      },
      {
        h: "Agent ทำงานใน sandbox",
        p: "Collab8 เริ่ม session ให้เธรดนั้นด้วย pod หรือ container ของตัวเอง Agent ใช้โมเดล Claude หรือ Gemini, connector, ความจำของห้อง และคลังความรู้ที่แอดมินผูกไว้ได้",
      },
      {
        h: "Tool gate ตัดสิน",
        p: "ทุกการเรียกเครื่องมือถูกตัดสินจากปลายทางจริงของ path อาจผ่าน ถูกปฏิเสธ หรือรอให้คนอนุมัติ และการอนุมัติใช้ได้เฉพาะที่ผู้อนุมัติเห็นเท่านั้น",
      },
      {
        h: "คำตอบส่งมาครบในครั้งเดียว",
        p: "คำตอบของแต่ละ turn และไฟล์ที่สร้างจะส่งเข้าเธรดพร้อมกัน ไม่ครึ่งๆ กลางๆ และไม่ซ้ำสอง การตอบต่อในเธรดเดิมจะใช้ session เดิม",
      },
    ],
  },
  features: {
    eyebrow: "ฟีเจอร์",
    h2: "สร้างมาเพื่อทีมที่ทำงานกับ Agent ทุกวัน",
    items: [
      {
        h: "ห้อง DM และเธรด",
        p: "ช่อง ข้อความส่วนตัว และห้องโปรเจกต์ พร้อมปักหมุด รีแอ็กชัน ไฟล์แนบ และพรีวิวรูป แขก (guest) คุยในห้องได้แต่ปรับโครงห้องไม่ได้",
      },
      {
        h: "Agent ที่คุณกำหนดเอง",
        p: "แอดมินสร้าง Agent พร้อมโมเดลและ effort เริ่มต้น เลือกว่าใครเห็น Agent ตัวไหน และเลือกคลังความรู้ที่ Agent ค้นได้",
      },
      {
        h: "คลังความรู้",
        p: "อัปโหลดเอกสารเข้าคลังความรู้ที่ใช้ Vertex AI Search ให้ Agent ตอบจากเอกสารด้วยเครื่องมือ search_knowledge เอกสารจะนับว่าพร้อมใช้เมื่อถูกทำดัชนีแล้วเท่านั้น",
      },
      {
        h: "ความจำที่อยู่ในห้อง",
        p: "แต่ละห้องเก็บความจำแยกตาม Agent ทีมไม่ต้องพูดซ้ำ และทุกคนเปิดดูได้ว่า Agent จำอะไรไว้",
      },
      {
        h: "ไฟล์ รูป และสไลด์",
        p: "Agent ส่งคืนไฟล์ รูปที่สร้างขึ้น และชุดสไลด์ สไลด์เปิดเป็นแถบเลื่อนพรีวิวในเธรดได้เลย",
      },
      {
        h: "Connector",
        p: "ผูกระบบธุรกิจกับ Agent ผ่าน connector โดยเก็บ credential ไว้ฝั่งเซิร์ฟเวอร์ และไม่ส่งเข้า sandbox",
      },
    ],
  },
  control: {
    eyebrow: "การควบคุม",
    h2: "แอดมินกำหนดว่า Agent ทำอะไรได้",
    lead: "Agent ทำได้มาก Collab8 จึงวางขอบเขตไว้ในที่ที่แอดมินมองเห็นและแก้ได้",
    items: [
      { h: "Tool gate และการอนุมัติ", p: "การเรียกที่อ่อนไหวต้องรอคนอนุมัติ การ์ดแสดงไฟล์และปลายทาง และอนุมัติได้ครั้งเดียวหรือตลอด session" },
      { h: "นโยบายห้อง", p: "เจ้าของและแอดมินกำหนดช่วงเก็บข้อมูล คนที่อนุมัติงานของ Agent ได้ และขอบเขตที่จำกัด Agent ทุกตัวในห้อง" },
      { h: "ซ่อน ไม่ใช่แค่ห้าม", p: "ห้องที่คุณไม่ได้อยู่ และหน้าแอดมินทั้งหมด จะตอบเหมือนไม่มีอยู่ ส่วนการกระทำที่ถูกปฏิเสธบนสิ่งที่เห็นอยู่ จะบอกว่าคุณไม่มีสิทธิ์" },
      { h: "Audit log ที่ตรวจสอบได้", p: "เหตุการณ์ของ Agent ความรู้ สมาชิก การอนุมัติ และ gate บันทึกเป็น hash chain มีปุ่มตรวจความสมบูรณ์ และกรองตาม Agent ช่อง หรือชนิดเหตุการณ์ได้" },
      { h: "การใช้งานและงบ", p: "ดู session และโทเคนต่อ Agent ถ้า Agent เกินงบ ระบบจะไม่เริ่ม session และบอกเหตุผลกับคนที่ถาม" },
      { h: "Credential ไม่เข้า sandbox", p: "container และ pod ถือแค่ค่าแทน ส่วน egress proxy ใส่คีย์โมเดลจริงตอนส่งออก" },
    ],
  },
  roles: {
    h2: "สี่บทบาทใน workspace",
    rows: [
      { dt: "Owner", dd: "ดูแล workspace ทั้งหมด รวมถึง Agent ความรู้ การใช้งาน และ audit log" },
      { dt: "Admin", dd: "เข้าหน้าแอดมินได้เท่ากับ owner ได้แก่ Agent การใช้งาน audit log และคลังความรู้" },
      { dt: "Member", dd: "คุยในห้องที่เป็นสมาชิก แท็ก Agent และอนุมัติได้ตามที่นโยบายอนุญาต" },
      { dt: "Guest", dd: "คุยในห้องที่ถูกเพิ่มเข้าไปได้ แต่ปรับโครงห้องไม่ได้" },
    ],
  },
  spec: {
    h2: "สรุปทางเทคนิค",
    rows: [
      { dt: "เว็บแอป", dd: "หน้าแชต Next.js พร้อมหน้าตั้งค่า Agent, การใช้งาน, Audit log และความรู้" },
      { dt: "เรียลไทม์", dd: "WebSocket gateway กระจายข้อความใหม่ผ่าน Redis" },
      { dt: "Agent runner", dd: "worker แบบคิว เริ่ม sandbox ต่อ session และคุมการเรียกเครื่องมือ" },
      { dt: "โมเดล", dd: "Claude (Opus, Sonnet, Haiku) และ Gemini เลือกได้ต่อ Agent" },
      { dt: "ความรู้", dd: "Vertex AI Search เอกสารภาษาไทยต้องค้นด้วยคำถามภาษาไทย" },
      { dt: "โฮสต์", dd: "Cloud Run, GKE Autopilot พร้อม GKE Sandbox (gVisor), Cloud SQL for PostgreSQL" },
      { dt: "เข้าสู่ระบบ", dd: "Google sign-in ตามโดเมนอีเมลบริษัท" },
    ],
  },
  faq: {
    h2: "คำถามที่พบบ่อย",
    items: [
      {
        q: "Agent เห็นทุกห้องไหม",
        a: "ไม่ Agent ทำงานได้เฉพาะห้องที่เป็นสมาชิก และนโยบายห้องจำกัดขอบเขตเพิ่มได้ ห้องที่คนไม่ได้อยู่ก็ถูกซ่อนจากเขาเช่นกัน",
      },
      {
        q: "อะไรป้องกันไม่ให้ Agent อ่านไฟล์ที่ไม่ควรอ่าน",
        a: "Tool gate ตรวจว่า path แต่ละอันนำไปที่ไหนจริง และกักเครื่องมือไฟล์ไว้ในโฟลเดอร์ของ session การเรียกนอกขอบเขตจะถูกปฏิเสธหรือรออนุมัติ",
      },
      {
        q: "รองรับเอกสารภาษาไทยไหม",
        a: "รองรับ แต่การค้นจับคู่ตามภาษาของคำถาม ถ้าจะหาเนื้อหาไทยให้ถามเป็นภาษาไทย",
      },
      {
        q: "ส่งออกข้อมูลได้ไหม",
        a: "ได้ ส่งออก workspace พร้อมข้อความและไฟล์เป็นไฟล์เดียว",
      },
      {
        q: "นี่คือผลิตภัณฑ์จริงแล้วหรือยัง",
        a: "หน้านี้เป็นตัวอย่างสำหรับตรวจสอบภายใน หน้าจอเป็นภาพประกอบและใช้ข้อมูลสมมติ",
      },
    ],
  },
  footer: { copy: "© 2026 Beryl8 Public Company Limited. ตัวอย่างภายใน" },
};

export const content: Record<Locale, Collab8Content> = { en, th };
