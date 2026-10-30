import type { Locale } from "@/lib/i18n";

/* Every user-visible string on the Collab8 page. Thai and English share one shape. */

type Item = { h: string; p: string };

const en = {
  meta: {
    title: "Collab8 · Team chat with AI agents",
    description:
      "Chat rooms where people and AI agents work together. Each agent gets its own workspace, risky actions wait for approval, and admins set what agents can do and which documents they can search.",
  },
  header: {
    menuAria: "Main menu",
    menu: { how: "How it works", features: "Features", control: "Control", faq: "FAQ" },
    cta: "See how it works",
  },
  hero: {
    eyebrow: "Collab8 by Beryl8",
    h1: "Where your team and its AI agents",
    h1em: "work in the same room.",
    lead:
      "Collab8 is team chat with AI agents built in. Mention an agent in a channel like you would a colleague, and it takes the task in its own workspace. Admins set what agents can do, which documents they can search and who sees what.",
    cta1: "See how it works",
    cta2: "How it stays safe",
    mini: ["People and agents in one thread", "Each agent works in its own workspace"],
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
      deny: "Deny",
    },
    composer: "Message #hr-helpdesk, or @mention an agent",
    mock: "Illustrative screen with sample data",
  },
  facts: [
    { b: "Rooms for people and agents", span: "Channels, DMs and projects with threads and @mentions" },
    { b: "An isolated workspace per session", span: "Separate cloud containers in production, local ones in development" },
    { b: "Keys never reach the agent", span: "Workspaces hold a placeholder. A gateway adds the real key when a request leaves." },
    { b: "Tamper-evident audit log", span: "Check the log for edits from inside the product" },
  ],
  how: {
    eyebrow: "How it works",
    h2: "From a question in chat to a finished task",
    steps: [
      {
        h: "Mention an agent",
        p: "Write in a room or a DM. A message goes to the agent you @mention, the agent of a DM, or the agent already working that thread. A message that names nobody in a shared room reaches no agent.",
      },
      {
        h: "The agent works in its own workspace",
        p: "Collab8 starts a session for the thread in its own isolated container. The agent can use Claude or Gemini models, connectors, room memory and the knowledge bases an admin attached to it.",
      },
      {
        h: "Actions are checked first",
        p: "Collab8 checks what each action would really touch. It is allowed, refused, or held for a person to approve. An approval covers only what the approver was shown.",
      },
      {
        h: "The answer arrives in one piece",
        p: "The reply and any files it made arrive in the thread together, never half finished and never twice. Follow-ups in the same thread continue the same session.",
      },
    ] as Item[],
  },
  features: {
    eyebrow: "Features",
    h2: "For teams that work with agents every day",
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
        p: "Upload documents to a knowledge base. Agents search them to answer questions. A document is ready to use once it has finished processing.",
      },
      {
        h: "Memory that stays in the room",
        p: "Each room keeps a memory per agent, so the team doesn’t have to repeat itself. Anyone can open it to see what the agent remembers.",
      },
      {
        h: "Files, images and slides",
        p: "Agents return files, generated images and slide decks. Decks open as a carousel of slide previews inside the thread.",
      },
      {
        h: "Connectors",
        p: "Attach business systems to agents as connectors, with credentials kept on the server and never handed to an agent's workspace.",
      },
    ] as Item[],
  },
  control: {
    eyebrow: "Control",
    h2: "Admins decide what agents may do",
    lead: "Agents can do a lot, so the limits sit where an admin can see and change them.",
    items: [
      { h: "Approvals for risky actions", p: "Sensitive actions wait for a person. The card shows the file and destination, and an approval can be given once or for the rest of the session." },
      { h: "Room policy", p: "Owners and admins set a room's retention window, who may approve its agents' work, and the scope that caps every agent in it." },
      { h: "Private rooms stay hidden", p: "A room you’re not in, and every admin screen, simply doesn’t show up. If you try something you’re not allowed to do in a room you can see, you’re told so." },
      { h: "Audit log you can verify", p: "Agent, knowledge, member, approval and permission-check events are recorded in a tamper-evident log, with an integrity check and filters by agent, channel and event type." },
      { h: "Usage and budgets", p: "See sessions and usage per agent. If an agent is over budget it will not start, and the person who asked is told why." },
      { h: "Keys never enter an agent workspace", p: "Agent workspaces hold a placeholder. A gateway adds the real model key when a request leaves." },
    ] as Item[],
  },
  roles: {
    h2: "Four workspace roles",
    rows: [
      { dt: "Owner", dd: "Runs the workspace, including agents, knowledge, usage and the audit log." },
      { dt: "Admin", dd: "Same admin screens as an owner: agents, usage, audit log and knowledge bases." },
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
    h2: "Frequently asked questions",
    items: [
      {
        q: "Can an agent see every room?",
        a: "No. An agent works only in rooms it is a member of, and a room policy can cap its scope further. Rooms a person is not in are hidden from them as well.",
      },
      {
        q: "What stops an agent from reading files it should not?",
        a: "Every file action is checked against where it really leads, and file access stays inside the session's own folder. Anything outside it is refused or held for approval.",
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
    title: "Collab8 · แชตทีมที่มี AI Agent",
    description:
      "ห้องแชตที่คนกับ AI Agent ทำงานด้วยกัน Agent แต่ละตัวมีพื้นที่ทำงานแยก งานเสี่ยงต้องรออนุมัติ และแอดมินกำหนดได้ว่า Agent ทำอะไรได้ ค้นเอกสารชุดไหนได้",
  },
  header: {
    menuAria: "เมนูหลัก",
    menu: { how: "การทำงาน", features: "ฟีเจอร์", control: "การควบคุม", faq: "FAQ" },
    cta: "ดูการทำงาน",
  },
  hero: {
    eyebrow: "Collab8 โดย Beryl8",
    h1: "ที่ที่ทีมและ AI Agent",
    h1em: "ทำงานอยู่ในห้องเดียวกัน",
    lead:
      "Collab8 คือแชตทีมที่มี AI Agent อยู่ด้วย แท็ก Agent ในช่องเหมือนแท็กเพื่อนร่วมงาน แล้ว Agent จะรับงานไปทำในพื้นที่ทำงานของตัวเอง แอดมินกำหนดได้ว่า Agent ทำอะไรได้ ค้นเอกสารชุดไหนได้ และใครเห็นอะไร",
    cta1: "ดูการทำงาน",
    cta2: "ปลอดภัยอย่างไร",
    mini: ["คนและ Agent อยู่ในเธรดเดียวกัน", "Agent แต่ละตัวมีพื้นที่ทำงานแยก"],
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
      dest: "ปลายทาง: พื้นที่ทำงานของ session นี้เท่านั้น",
      approve: "อนุมัติ",
      session: "อนุมัติตลอด session นี้",
      deny: "ปฏิเสธ",
    },
    composer: "ส่งข้อความใน #hr-helpdesk หรือแท็ก Agent ด้วย @",
    mock: "หน้าจอตัวอย่าง ใช้ข้อมูลสมมติ",
  },
  facts: [
    { b: "ห้องสำหรับคนและ Agent", span: "ช่อง DM และโปรเจกต์ พร้อมเธรดและการแท็ก @" },
    { b: "พื้นที่ทำงานแยกต่อ session", span: "คอนเทนเนอร์แยกบนคลาวด์ในระบบจริง และคอนเทนเนอร์ในเครื่องตอนพัฒนา" },
    { b: "คีย์ไม่ถึงมือ Agent", span: "พื้นที่ทำงานถือแค่ค่าแทน ส่วนเกตเวย์จะใส่คีย์จริงตอนส่งคำขอออกไป" },
    { b: "ประวัติการใช้งานที่ตรวจการแก้ไขได้", span: "ตรวจในระบบได้เลยว่ามีการแก้ไขประวัติหรือไม่" },
  ],
  how: {
    eyebrow: "การทำงาน",
    h2: "จากคำถามในแชต สู่งานที่เสร็จ",
    steps: [
      {
        h: "แท็ก Agent",
        p: "พิมพ์ในห้องหรือ DM ข้อความจะไปถึง Agent ที่แท็กด้วย @ Agent ของ DM หรือ Agent ที่กำลังทำเธรดนั้นอยู่ ถ้าไม่แท็กใครในห้องรวม ข้อความจะไม่ถึง Agent ตัวไหน",
      },
      {
        h: "Agent ทำงานในพื้นที่ของตัวเอง",
        p: "Collab8 เริ่ม session ให้เธรดนั้นในคอนเทนเนอร์แยกของตัวเอง Agent ใช้โมเดล Claude หรือ Gemini, connector, ความจำของห้อง และคลังความรู้ที่แอดมินเชื่อมไว้ให้ได้",
      },
      {
        h: "ตรวจก่อนทำทุกครั้ง",
        p: "ระบบตรวจว่าสิ่งที่ Agent จะทำไปแตะไฟล์หรือที่ไหนจริง ๆ แล้วปล่อยผ่าน ปฏิเสธ หรือรอให้คนอนุมัติ การอนุมัติครอบคลุมเฉพาะสิ่งที่ผู้อนุมัติเห็น",
      },
      {
        h: "คำตอบมาครบในครั้งเดียว",
        p: "คำตอบและไฟล์ที่สร้างจะส่งเข้าเธรดพร้อมกัน ไม่ครึ่ง ๆ กลาง ๆ และไม่ซ้ำสอง การตอบต่อในเธรดเดิมจะใช้ session เดิม",
      },
    ],
  },
  features: {
    eyebrow: "ฟีเจอร์",
    h2: "สำหรับทีมที่ทำงานกับ Agent ทุกวัน",
    items: [
      {
        h: "ห้อง DM และเธรด",
        p: "ช่อง ข้อความส่วนตัว และห้องโปรเจกต์ พร้อมปักหมุด รีแอ็กชัน ไฟล์แนบ และพรีวิวรูป แขก (guest) คุยในห้องได้ แต่เปลี่ยนการตั้งค่าห้องไม่ได้",
      },
      {
        h: "Agent ที่คุณกำหนดเอง",
        p: "แอดมินสร้าง Agent พร้อมโมเดลและ effort เริ่มต้น เลือกว่าใครเห็น Agent ตัวไหน และเลือกคลังความรู้ที่ Agent ค้นได้",
      },
      {
        h: "คลังความรู้",
        p: "อัปโหลดเอกสารเข้าคลังความรู้ ให้ Agent ค้นเอกสารเพื่อตอบคำถาม เอกสารจะพร้อมใช้เมื่อประมวลผลเสร็จแล้ว",
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
        p: "ผูกระบบธุรกิจกับ Agent ผ่าน connector โดยเก็บ credential ไว้ที่เซิร์ฟเวอร์ และไม่ส่งเข้าพื้นที่ทำงานของ Agent",
      },
    ],
  },
  control: {
    eyebrow: "การควบคุม",
    h2: "แอดมินกำหนดว่า Agent ทำอะไรได้",
    lead: "Agent ทำได้มาก ขอบเขตจึงอยู่ในที่ที่แอดมินมองเห็นและแก้ได้",
    items: [
      { h: "อนุมัติก่อนทำสิ่งเสี่ยง", p: "การกระทำที่อ่อนไหวต้องรอคนอนุมัติ การ์ดแสดงไฟล์และปลายทาง และอนุมัติได้ครั้งเดียวหรือตลอด session" },
      { h: "นโยบายห้อง", p: "เจ้าของและแอดมินกำหนดช่วงเก็บข้อมูล คนที่อนุมัติงานของ Agent ได้ และขอบเขตที่จำกัด Agent ทุกตัวในห้อง" },
      { h: "ห้องส่วนตัวถูกซ่อนไว้", p: "ห้องที่คุณไม่ได้อยู่ และหน้าแอดมินทั้งหมด จะเหมือนไม่มีอยู่ ส่วนห้องที่คุณเห็นอยู่ ถ้าลองทำสิ่งที่ไม่มีสิทธิ์ ระบบจะบอกว่าทำไม่ได้" },
      { h: "ประวัติการใช้งานที่ตรวจสอบได้", p: "บันทึกเหตุการณ์ของ Agent ความรู้ สมาชิก การอนุมัติ และการตรวจสิทธิ์ ไว้ในรูปแบบที่ตรวจได้ว่าถูกแก้ไขหรือไม่ มีปุ่มตรวจความสมบูรณ์ และกรองตาม Agent ช่อง หรือชนิดเหตุการณ์ได้" },
      { h: "การใช้งานและงบ", p: "ดู session และปริมาณการใช้ต่อ Agent ถ้า Agent ใช้เกินงบ จะไม่เริ่มทำงาน และระบบบอกเหตุผลกับคนที่ถาม" },
      { h: "คีย์ไม่เข้าพื้นที่ทำงานของ Agent", p: "พื้นที่ทำงานของ Agent ถือแค่ค่าแทน ส่วนเกตเวย์จะใส่คีย์โมเดลจริงตอนส่งคำขอออกไป" },
    ],
  },
  roles: {
    h2: "สี่บทบาทในพื้นที่ทำงาน",
    rows: [
      { dt: "Owner", dd: "ดูแลพื้นที่ทำงานทั้งหมด รวมถึง Agent ความรู้ การใช้งาน และประวัติการใช้งาน" },
      { dt: "Admin", dd: "เข้าหน้าแอดมินได้เท่ากับ owner ได้แก่ Agent การใช้งาน ประวัติการใช้งาน และคลังความรู้" },
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
        a: "ระบบตรวจว่าทุกการเข้าถึงไฟล์ไปที่ไหนจริง และจำกัดไว้ในโฟลเดอร์ของ session การเข้าถึงนอกขอบเขตจะถูกปฏิเสธหรือรออนุมัติ",
      },
      {
        q: "รองรับเอกสารภาษาไทยไหม",
        a: "รองรับ แต่การค้นจับคู่ตามภาษาของคำถาม ถ้าจะหาเนื้อหาไทยให้ถามเป็นภาษาไทย",
      },
      {
        q: "ส่งออกข้อมูลได้ไหม",
        a: "ได้ ส่งออกพื้นที่ทำงานพร้อมข้อความและไฟล์ได้เป็นไฟล์เดียว",
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
