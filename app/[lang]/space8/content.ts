import type { Locale } from "@/lib/i18n";

/** Actor / person ids used by the map scenes, meeting grid, chat and cast. */
export type PersonId = "me" | "mind" | "boss" | "prae" | "guy" | "fon" | "tee" | "nam" | "ploy" | "ton" | "bot";
export type StatusId = "free" | "busy" | "meet" | "away";
export type MapSrc = "courtyard" | "shophouse" | "garden" | "transit" | "atlas";

/** Strings the map scenes need (name tags, status labels, zone banner, speech bubbles). */
export type SceneStrings = {
  st: Record<StatusId, string>;
  n: Record<PersonId, string>;
  zone: string;
  wave: string;
  near: string;
  duo: string;
};

const en = {
  meta: {
    title: "Space8 · 2D virtual office for teams in Thailand",
    description:
      "Space8 is a 2D virtual office for teams in Thailand. Walk up to a teammate, talk to whoever is nearby, join a meeting room and share your screen, all on one map.",
  },
  nav: {
    homeLabel: "Back to BE8 AI Solutions",
    news: "New: record meetings to Meet8",
    menuLabel: "Main menu",
    links: { office: "Features", templates: "Maps", pricing: "Pricing", faq: "FAQ" },
    login: "Log in",
    cta: "Get started",
  },
  scene: {
    st: { free: "Available", busy: "Busy", meet: "In a meeting", away: "Away" },
    n: {
      me: "You",
      mind: "Mind",
      boss: "Boss",
      prae: "Prae",
      guy: "Guy",
      fon: "Fon",
      tee: "Tee",
      nam: "Nam",
      ploy: "Ploy",
      ton: "Ton",
      bot: "Recap assistant",
    },
    zone: "Meeting room · Recording to Meet8",
    wave: "On my way, what do you need?",
    near: "Anyone free to look at this page?",
    duo: "Got a minute? Just came over to chat",
  } satisfies SceneStrings as SceneStrings,
  hero: {
    h1a: "Walk over to your team, ",
    h1accent: "wherever they work",
    h1b: "",
    lede: "Space8 is a 2D virtual office for teams in Thailand. Walk up to a teammate, talk to whoever is nearby, join a meeting room and share your screen, all on one map. No scheduling or links for a quick question.",
    ctaPrimary: "Create your team's Space",
    ctaTour: "Take a tour",
    facts: ["Thai-language app", "Runs in the browser, nothing to install", "Syncs with Google Calendar"],
  },
  stage: {
    sceneLabel: "Courtyard office map with teammates walking around",
    tops: {
      officeMap: "Courtyard · Space8 Studio",
      online: "9 online",
      meetTitle: "Design review",
      roomLocked: "Room locked",
      recording: "Recording to Meet8",
      chat: "Chat",
      rooms: "3 rooms",
    },
    chatSide: {
      rooms: "Chat rooms",
      room1: "Ton, Mind, Boss",
      room2: "Prae",
      room3: "Guy, Fon",
      agents: "AI agents",
      bot: "Recap assistant",
    },
    chatHead: "Ton, Mind, Boss",
    chatHeadSub: "· started in the Courtyard",
    composer: "Message this room",
    msgs: [
      "We just talked by the tree. The deadline moves to Friday.",
      "OK, I'll finish the checkout page fixes before this afternoon.",
      "I'll pin the file link in this room so it doesn't get lost.",
      "Summary of this room: deadline moved to Friday, Mind owns the checkout page, Boss attached the latest file.",
    ],
    dock: { mic: "Mic", camera: "Camera", share: "Share", react: "React", chat: "Chat", leave: "Leave" },
    tabsLabel: "Explore Space8",
    tabs: { office: "Office", meet: "Meeting", chat: "Chat" },
  },
  strip: { title: "Connects with" },
  office: {
    eyebrow: "Virtual office",
    h2: "Talk to anyone, like they sit at the next desk",
    lede: "Everyone has a character on the team map. Walk up to someone and you can hear each other. Step into a meeting room and only the people in that room can hear you. Walk out and the audio fades on its own.",
    sceneLabel: "Full Courtyard office map with work area, meeting room and coffee corner",
    features: [
      { title: "See who's available", body: "Name tags show who's free, busy or in a meeting before you walk over." },
      {
        title: "Wave someone over",
        body: "Send a reaction that floats above your head, or follow a teammate and your character walks to them.",
      },
      {
        title: "Hear the people nearby",
        body: "In open areas you only hear people within range. Walk away and their voices fade out.",
      },
      {
        title: "Drop into a meeting room",
        body: "Walk in and everyone inside hears each other while people outside can't. Record straight to Meet8.",
      },
    ],
    cta: "Create your team's Space",
  },
  compare: {
    h2: "Remote work that feels like an office",
    lede: "Your team works from different places but still sees and hears each other during the day.",
    oldTitle: "The usual tools",
    oldItems: [
      "Yet another meeting link",
      "Waiting hours for a chat reply",
      "Being on camera all day",
      "No idea if teammates are free or busy",
      "A five-minute question needs a calendar slot",
    ],
    events: ["Daily Standup", "15-min sync with Mind", "Check-in with Boss"],
    newTitle: "Your office on Space8",
    newItems: [
      ["Walk over and talk, no link needed"],
      ["See who's free ", "right now", ""],
      ["Be together without turning on your camera"],
      ["See how busy the team is from the map"],
      ["When you're done, walk back to your desk"],
    ] as string[][],
    sceneLabel: "Two people chatting in the courtyard",
  },
  focus: {
    eyebrow: "Available now",
    h2: "Decide when people can reach you",
    lede: "Choose who you talk to privately, and tell the team when you need quiet time to work.",
    ghostChip: "Ghost",
    press: "Press",
    ghostTitle: "Walk past people in your way",
    ghostBody:
      "Characters normally can't walk through each other, just like real people. Press G for Ghost mode to pass through people, while walls and furniture still block you.",
    talkLine: "Mind, Boss and Fon started a Private Talk",
    talkPrivate: "Private",
    talkPeople: "3 / 8 people",
    talkTitle: "Private Talk for small-group chats",
    talkBody:
      "Start a voice and video huddle with up to 8 people nearby. Nobody outside can hear, and the talk ends as soon as someone leaves, so nobody stays in a call by accident.",
    statuses: ["Available", "Busy", "Away"],
    notes: ["Feel free to say hi", "Focusing until 12:30", "Back at 2 pm"],
    statusTitle: "Let the team know if now is a good time",
    statusBody:
      "Set yourself to Available, Busy or Away. The dot on your name tag and in the member list updates, so teammates know when to reach out.",
  },
  templates: {
    eyebrow: "Maps",
    h2: "Pick an office that fits your team",
    lede: "Start from one of five ready-made maps, then adjust it in Studio. Place desks, meeting rooms and break areas exactly the way your team works.",
    maps: {
      courtyard: { name: "Courtyard", size: "40×32 tiles" },
      shophouse: { name: "Shophouse", size: "40×28 tiles" },
      garden: { name: "Garden Office", size: "40×28 tiles" },
      transit: { name: "Station", size: "40×28 tiles" },
      atlas: { name: "Atlas", size: "40×28 tiles" },
    } as Record<MapSrc, { name: string; size: string }>,
    alt: {
      courtyard:
        "Courtyard map: work area on the left, meeting room at the top, coffee corner on the right and a tree in the middle",
      shophouse: "Shophouse map",
      garden: "Garden Office map: desks on both sides, a meeting room and a fountain in the middle",
      transit: "Station map",
      atlas: "Atlas map",
    } as Record<MapSrc, string>,
    aiNote:
      "Want something different? Describe your team size and the rooms you need, and AI drafts a map for you when you create your Space.",
  },
  avatars: {
    eyebrow: "Characters",
    h2: "Make a character that looks like you",
    body: "Start from six ready-made characters, then customize each part. Your look carries across the map, your name tag and the member list in every Space you join. Save up to three favorite outfits to switch between.",
    slots: [
      "Skin tone",
      "Eye color",
      "Hairstyle",
      "Hair color",
      "Facial hair",
      "Top",
      "Top color",
      "Bottoms",
      "Bottoms color",
      "Shoes",
      "Accessories",
    ],
  },
  brain: {
    eyebrow: "New",
    h2: "Meeting notes written for you",
    lede: "Space8 works with other BE8 products. Record a meeting and Meet8 summarizes it. Put an AI agent on the map and the team can walk up and ask it questions.",
    recPill: "Available",
    recTitle: "Record meeting rooms to Meet8",
    recBody:
      "Press record in the bottom bar while you're in a meeting room. The whole room's audio becomes a new meeting in the Meet8 account of whoever started it, which transcribes it and summarizes what was agreed.",
    flow: [
      { title: "Enter a room", body: "Record only appears inside rooms" },
      { title: "Press record", body: "Everyone sees the red dot" },
      { title: "Get a summary", body: "Transcript and recap in Meet8" },
    ],
    recFine:
      "Connect your account once under Settings > General > Meet8. Each room runs one recording at a time, and recording stops on its own when the room empties.",
    agentPill: "Partly available",
    agentTitle: "AI agents on the map",
    agentBody:
      "Create a personal assistant or a Space-wide assistant that stands on the map. Click the character to chat, and each person sees only their own conversation. Agents can answer questions today, but can't act on anyone's behalf yet.",
    vis: {
      private: "Only the owner knows this agent exists",
      visible: "Everyone sees its name and status, only the owner can chat",
      shared: "Members can chat, or only people you choose",
    },
  },
  start: {
    eyebrow: "Get started",
    h2: "Set up your first office in minutes",
    lede: "Sign in with your Google account, pick a map and send your team an invite link. Nothing to install.",
    cta: "Create your team's Space",
    steps: [
      { tag: "2 min", title: "Pick a map", body: "Use a ready-made map, or have AI draft one from a description." },
      {
        tag: "1 link",
        title: "Invite your team",
        body: "Send the link from the People button. Teammates click it and land right on the map.",
      },
      { tag: "Instantly", title: "Start working together", body: "Choose a character, walk to your desk and say hi." },
    ],
    seePlans: "See plans",
  },
  pricing: {
    eyebrow: "Pricing",
    h2: "Pay per person, per month",
    lede: "Priced per member in your Space. Every plan includes maps, characters, voice and video.",
    recommended: "Recommended",
    perPerson: "per person / month",
    standard: {
      name: "Standard",
      for: "For teams that meet in one shared office every day",
      price: "฿199",
      items: [
        "Five ready-made maps",
        "Proximity voice and video, meeting rooms and screen sharing",
        "Private Talk for up to 8 people",
        "Chat, chat rooms and nearby chat",
        "Six characters with 11 customizable parts",
        "Two-way Google Calendar sync",
      ],
      cta: "Choose Standard",
    },
    premium: {
      name: "Premium",
      for: "For teams that meet often and want AI help",
      price: "฿349",
      items: [
        "Everything in Standard",
        "Edit maps yourself in Studio",
        "AI-drafted map when you create a Space",
        "AI agents on the map",
        "Record meeting rooms to Meet8",
      ],
      cta: "Choose Premium",
    },
    custom: {
      name: "Customize",
      for: "For organizations that need custom maps and setup",
      price: "Talk to us",
      items: [
        "Everything in Premium",
        "Maps designed from your real office layout",
        "Network setup for corporate firewalls",
        "Onboarding and team training",
      ],
      cta: "Contact sales",
    },
    noteBold: "Sample prices",
    noteRest: " for page layout only. These are not final prices and do not include 7% VAT.",
  },
  faq: {
    eyebrow: "Frequently asked",
    h2: "Common questions",
    items: [
      {
        q: "What is a virtual office?",
        a: [
          "A virtual office is an online map for your team. Everyone has a character they can walk around with. Walk close to someone and you can talk, just like stopping by a teammate's desk. Walk into a meeting room and everyone in the room can hear each other.",
        ],
      },
      {
        q: "Who can I hear?",
        a: [
          "In open areas you only hear people close to you. In a meeting room everyone inside hears each other, and people outside can't.",
          "For a small-group conversation in the open, start a Private Talk with up to 8 people. It ends as soon as someone leaves.",
        ],
      },
      {
        q: "Do I need to install anything?",
        a: [
          "No. Space8 runs in your browser. The first time you use your microphone or camera, the browser asks for permission, and if something doesn't work the app tells you the actual reason, such as the device being used by another program.",
        ],
      },
      {
        q: "Can I record meetings, and who can see that?",
        a: [
          "You can record inside a meeting room once you've connected Meet8. Everyone in the room sees a “Recording to Meet8” banner and the name of who started it the whole time. The recording goes to the Meet8 account of the person who started it.",
        ],
      },
      {
        q: "How does Google Calendar sync work?",
        a: [
          "Each person chooses whether to turn on sync. Once it's on, meetings in Space8 and Google Calendar stay matched in both directions.",
        ],
      },
      {
        q: "What data can an AI agent see?",
        a: [
          "An agent sees only its own settings and the conversation with the person it's talking to. Others see only a general status, such as idle or working, never who asked what. Don't put passwords or confidential information in an agent's instructions.",
        ],
      },
    ],
    help: "Still have questions?",
    helpCta: "Talk to the BE8 team",
  },
  closing: {
    h2: "Put your whole team under one roof",
    lede: "A virtual office for teams in Thailand and Southeast Asia",
    cta: "Create your team's Space",
    byline: "A product by Beryl8",
    product: "Product",
    productLinks: { office: "Features", templates: "Maps", pricing: "Pricing", brain: "Meet8" },
    helpTitle: "Help",
    helpLinks: { faq: "FAQ", start: "Getting started" },
    copyright: "© 2026 Beryl8",
    sample: "Prices on this page are samples",
  },
};

export type Space8Content = typeof en;

const th: Space8Content = {
  meta: {
    title: "Space8 · ออฟฟิศเสมือนสองมิติสำหรับทีมไทย",
    description:
      "Space8 คือออฟฟิศเสมือนสองมิติสำหรับทีมไทย เดินไปหาเพื่อน คุยกับคนที่อยู่ใกล้ เข้าห้องประชุม และแชร์หน้าจอได้จากแผนที่เดียว",
  },
  nav: {
    homeLabel: "กลับไปที่โซลูชัน AI ของ BE8",
    news: "ใหม่: อัดประชุมเข้า Meet8",
    menuLabel: "เมนูหลัก",
    links: { office: "ฟีเจอร์", templates: "แผนที่", pricing: "ราคา", faq: "คำถามที่พบบ่อย" },
    login: "เข้าสู่ระบบ",
    cta: "เริ่มใช้งาน",
  },
  scene: {
    st: { free: "ว่าง", busy: "ติดธุระ", meet: "ในประชุม", away: "ไม่อยู่" },
    n: {
      me: "คุณ",
      mind: "มายด์",
      boss: "บอส",
      prae: "แพร",
      guy: "กาย",
      fon: "ฝน",
      tee: "ตี๋",
      nam: "น้ำ",
      ploy: "พลอย",
      ton: "ต้น",
      bot: "ผู้ช่วยสรุปงาน",
    },
    zone: "ห้องประชุม · กำลังอัดเข้า Meet8",
    wave: "มาแล้ว มีอะไรให้ช่วย",
    near: "ใครว่าง ช่วยดูหน้านี้หน่อย",
    duo: "เดินมาคุยแป๊บนึงนะ",
  },
  hero: {
    h1a: "ออฟฟิศที่ทีม",
    h1accent: "เดินไปหากัน",
    h1b: "ได้ แม้อยู่คนละที่",
    lede: "Space8 คือออฟฟิศเสมือนสองมิติสำหรับทีมไทย เดินไปหาเพื่อน คุยกับคนที่อยู่ใกล้ เข้าห้องประชุม และแชร์หน้าจอได้จากแผนที่เดียว เรื่องสั้นๆ ไม่ต้องนัดและไม่ต้องส่งลิงก์",
    ctaPrimary: "สร้าง Space ของทีม",
    ctaTour: "ดูว่าทำอะไรได้",
    facts: ["ภาษาไทยทั้งแอป", "เปิดในเบราว์เซอร์ ไม่ต้องติดตั้ง", "ซิงก์กับ Google Calendar"],
  },
  stage: {
    sceneLabel: "แผนที่ออฟฟิศลานกลาง มีเพื่อนร่วมทีมเดินอยู่",
    tops: {
      officeMap: "ลานกลาง · Space8 Studio",
      online: "ออนไลน์ 9 คน",
      meetTitle: "รีวิวงานออกแบบ",
      roomLocked: "ห้องล็อก",
      recording: "อัดเข้า Meet8",
      chat: "แชต",
      rooms: "ห้องคุย 3 ห้อง",
    },
    chatSide: {
      rooms: "ห้องคุย",
      room1: "ต้น, มายด์, บอส",
      room2: "แพร",
      room3: "กาย, ฝน",
      agents: "AI agents",
      bot: "ผู้ช่วยสรุปงาน",
    },
    chatHead: "ต้น, มายด์, บอส",
    chatHeadSub: "· สร้างจากลานกลาง",
    composer: "พิมพ์ข้อความถึงห้องนี้",
    msgs: [
      "เมื่อกี้คุยกันหน้าต้นไม้ สรุปว่าเลื่อนส่งงานไปวันศุกร์นะ",
      "โอเค เดี๋ยวแก้หน้า checkout ให้เสร็จก่อนบ่าย",
      "ขอแปะลิงก์ไฟล์ไว้ในห้องนี้เลย จะได้ไม่หาย",
      "สรุปที่คุยในห้องนี้: เลื่อนส่งเป็นวันศุกร์ มายด์รับหน้า checkout บอสแนบไฟล์ล่าสุด",
    ],
    dock: { mic: "ไมค์", camera: "กล้อง", share: "แชร์หน้าจอ", react: "รีแอ็กชัน", chat: "แชต", leave: "ออก" },
    tabsLabel: "ดูมุมต่างๆ ของ Space8",
    tabs: { office: "ออฟฟิศ", meet: "ประชุม", chat: "แชต" },
  },
  strip: { title: "ทำงานร่วมกับเครื่องมือที่ทีมใช้อยู่" },
  office: {
    eyebrow: "ออฟฟิศเสมือน",
    h2: "ทักกันได้ทันที เหมือนนั่งโต๊ะใกล้กัน",
    lede: "ทุกคนมีตัวละครบนแผนที่ของทีม เดินเข้าไปใกล้ใครก็ได้ยินเสียงกัน เข้าห้องประชุมแล้วคุยกันเฉพาะคนในห้อง เดินออกมาเสียงก็เงียบเอง",
    sceneLabel: "แผนที่ออฟฟิศลานกลางแบบเต็ม พร้อมพื้นที่ทำงาน ห้องประชุม และมุมกาแฟ",
    features: [
      { title: "เห็นว่าใครว่าง", body: "ป้ายชื่อบอกว่าใครว่าง ติดธุระ หรืออยู่ในประชุม ก่อนจะเดินไปทัก" },
      { title: "โบกมือเรียก", body: "ส่งรีแอ็กชันลอยเหนือหัว หรือกดตามเพื่อนให้ตัวละครเดินไปหาเอง" },
      { title: "ได้ยินคนที่อยู่ใกล้", body: "ในพื้นที่ส่วนกลาง ได้ยินเฉพาะคนในระยะ เดินห่างออกไปเสียงก็หายเอง" },
      {
        title: "เข้าห้องประชุมได้ทันที",
        body: "เดินเข้าห้อง ทุกคนในห้องได้ยินกันหมด คนนอกห้องไม่ได้ยิน กดอัดเข้า Meet8 ได้",
      },
    ],
    cta: "สร้าง Space ของทีม",
  },
  compare: {
    h2: "ทำงานคนละที่ แต่เหมือนอยู่ออฟฟิศเดียวกัน",
    lede: "ทีมอยู่คนละที่ แต่ยังเห็นและได้ยินกันตลอดวัน",
    oldTitle: "เครื่องมือแบบเดิม",
    oldItems: [
      "อีกหนึ่งลิงก์ประชุม",
      "รอคำตอบในแชตเป็นชั่วโมง",
      "เหนื่อยกับการเปิดกล้องตลอดวัน",
      "ไม่รู้ว่าเพื่อนว่างหรือยุ่งอยู่",
      "เรื่องห้านาทีต้องนัดเป็นวาระ",
    ],
    events: ["Daily Standup", "คุยงานกับมายด์ 15 นาที", "เช็กอินกับบอส"],
    newTitle: "ออฟฟิศบน Space8",
    newItems: [
      ["เดินไปคุยได้เลย ไม่ต้องมีลิงก์"],
      ["เห็นว่าใครว่าง", "ตอนนี้", ""],
      ["อยู่ด้วยกันได้โดยไม่ต้องเปิดกล้อง"],
      ["รู้ว่าทีมคึกคักแค่ไหนจากแผนที่"],
      ["คุยเสร็จก็เดินกลับโต๊ะ"],
    ],
    sceneLabel: "สองคนยืนคุยกันกลางลาน",
  },
  focus: {
    eyebrow: "มีให้ใช้แล้ว",
    h2: "เลือกได้ว่าจะให้ใครทักตอนไหน",
    lede: "เลือกได้ว่าจะคุยส่วนตัวกับใคร และบอกทีมเมื่อต้องการโฟกัสงาน",
    ghostChip: "Ghost",
    press: "กด",
    ghostTitle: "เดินผ่านคนที่ยืนขวางทาง",
    ghostBody:
      "ปกติตัวละครเดินทะลุกันไม่ได้ เหมือนคนจริง กด G เพื่อเปิด Ghost mode แล้วเดินผ่านคนได้ แต่ผนังและเฟอร์นิเจอร์ยังกั้นเหมือนเดิม",
    talkLine: "มายด์ บอส และฝน เริ่ม Private Talk",
    talkPrivate: "วงส่วนตัว",
    talkPeople: "3 / 8 คน",
    talkTitle: "Private Talk คุยเฉพาะกลุ่มเล็ก",
    talkBody:
      "เปิดวงคุยเสียงและภาพกับคนใกล้ตัวได้สูงสุด 8 คน คนนอกวงไม่ได้ยิน และเมื่อมีคนออก วงจะจบทันที ไม่มีใครค้างอยู่ในวงโดยไม่รู้ตัว",
    statuses: ["ว่าง", "ติดธุระ", "ไม่อยู่"],
    notes: ["ทักได้เลย", "โฟกัสงานถึง 12:30", "กลับมาบ่ายสอง"],
    statusTitle: "บอกทีมว่าตอนนี้สะดวกไหม",
    statusBody:
      "ตั้งสถานะว่าง ติดธุระ หรือไม่อยู่ จุดสีบนป้ายชื่อและในรายชื่อเปลี่ยนตาม เพื่อนรู้ว่าควรทักตอนไหน",
  },
  templates: {
    eyebrow: "แผนที่",
    h2: "เลือกออฟฟิศที่เหมือนทีมของคุณ",
    lede: "เริ่มจากแผนที่สำเร็จรูปห้าแบบ แล้วปรับต่อใน Studio โต๊ะ ห้องประชุม และมุมพักวางได้ตรงตามที่ทีมใช้จริง",
    maps: {
      courtyard: { name: "ลานกลาง", size: "40×32 ไทล์" },
      shophouse: { name: "ตึกแถว", size: "40×28 ไทล์" },
      garden: { name: "สวนกลางออฟฟิศ", size: "40×28 ไทล์" },
      transit: { name: "สถานี", size: "40×28 ไทล์" },
      atlas: { name: "แอตลาส", size: "40×28 ไทล์" },
    },
    alt: {
      courtyard: "แผนที่ลานกลาง: พื้นที่ทำงานด้านซ้าย ห้องประชุมด้านบน มุมกาแฟด้านขวา และต้นไม้กลางลาน",
      shophouse: "แผนที่ตึกแถว",
      garden: "แผนที่สวนกลางออฟฟิศ: โต๊ะทำงานสองฝั่ง ห้องประชุม และน้ำพุตรงกลาง",
      transit: "แผนที่สถานี",
      atlas: "แผนที่แอตลาส",
    },
    aiNote:
      "อยากได้แบบอื่น พิมพ์บอกว่าทีมมีกี่คน ต้องการห้องแบบไหน แล้วให้ AI ร่างแผนที่ให้ตอนสร้าง Space",
  },
  avatars: {
    eyebrow: "ตัวละคร",
    h2: "สร้างตัวละครที่เหมือนคุณ",
    body: "เลือกตัวละครสำเร็จรูปหกแบบเป็นจุดเริ่ม แล้วปรับได้ทีละส่วน รูปลักษณ์เดียวกันจะใช้ทั้งบนแผนที่ ป้ายชื่อ และรายชื่อในทุก Space ที่คุณอยู่ บันทึกชุดที่ชอบไว้สลับใช้ได้สามชุด",
    slots: [
      "สีผิว",
      "สีตา",
      "ทรงผม",
      "สีผม",
      "หนวดเครา",
      "เสื้อ",
      "สีเสื้อ",
      "ท่อนล่าง",
      "สีท่อนล่าง",
      "รองเท้า",
      "เครื่องประดับ",
    ],
  },
  brain: {
    eyebrow: "ใหม่",
    h2: "ประชุมจบ งานไม่หาย",
    lede: "Space8 เชื่อมกับผลิตภัณฑ์อื่นของ BE8 บันทึกการประชุมส่งไปให้ Meet8 สรุป และมี AI agent ยืนอยู่บนแผนที่ให้ทีมเดินไปถาม",
    recPill: "มีแล้ว",
    recTitle: "อัดห้องประชุมเข้า Meet8",
    recBody:
      "กดอัดที่แถบด้านล่างระหว่างอยู่ในห้องประชุม เสียงของทั้งห้องจะไปเป็นประชุมใหม่ใน Meet8 ของคนที่กดเริ่ม ซึ่งถอดเสียงและสรุปเรื่องที่ตกลงกันให้",
    flow: [
      { title: "เข้าห้องประชุม", body: "ปุ่มอัดขึ้นเฉพาะในห้อง" },
      { title: "กดอัด", body: "ทุกคนเห็นจุดแดงตลอด" },
      { title: "ได้สรุป", body: "ถอดเสียงและสรุปใน Meet8" },
    ],
    recFine:
      "เชื่อมบัญชีครั้งเดียวที่ Settings > General > Meet8 แต่ละห้องอัดได้ทีละรายการ และหยุดอัดเองเมื่อไม่มีใครอยู่ในห้อง",
    agentPill: "มีบางส่วน",
    agentTitle: "AI agent บนแผนที่",
    agentBody:
      "สร้างผู้ช่วยส่วนตัวหรือผู้ช่วยประจำ Space ให้ยืนบนแผนที่ คลิกที่ตัวละครเพื่อคุย แต่ละคนเห็นเฉพาะบทสนทนาของตัวเอง ตอนนี้ agent ตอบคำถามได้ แต่ยังทำงานแทนใครไม่ได้",
    vis: {
      private: "เฉพาะเจ้าของที่รู้ว่ามี agent นี้",
      visible: "ทุกคนเห็นชื่อและสถานะ แต่คุยได้เฉพาะเจ้าของ",
      shared: "สมาชิกคุยได้ หรือจำกัดเฉพาะรายชื่อที่เลือก",
    },
  },
  start: {
    eyebrow: "เริ่มต้น",
    h2: "ตั้งออฟฟิศแรกได้ในไม่กี่นาที",
    lede: "เข้าสู่ระบบด้วยบัญชี Google เลือกแผนที่ แล้วส่งลิงก์เชิญให้ทีม ไม่ต้องติดตั้งโปรแกรม",
    cta: "สร้าง Space ของทีม",
    steps: [
      { tag: "2 นาที", title: "เลือกแผนที่", body: "ใช้แผนที่สำเร็จรูป หรือให้ AI ร่างจากคำอธิบาย" },
      { tag: "1 ลิงก์", title: "เชิญทีม", body: "ส่งลิงก์จากปุ่ม People เพื่อนกดเข้ามาก็อยู่บนแผนที่เลย" },
      { tag: "ทันที", title: "เริ่มทำงานด้วยกัน", body: "เลือกตัวละคร เดินไปที่โต๊ะ แล้วทักเพื่อนได้" },
    ],
    seePlans: "ดูแพ็กเกจ",
  },
  pricing: {
    eyebrow: "ราคา",
    h2: "จ่ายต่อคน ต่อเดือน",
    lede: "คิดราคาตามจำนวนสมาชิกใน Space ทุกแพ็กเกจมีแผนที่ ตัวละคร และการคุยด้วยเสียงและวิดีโอ",
    recommended: "แนะนำ",
    perPerson: "ต่อคน ต่อเดือน",
    standard: {
      name: "Standard",
      for: "สำหรับทีมที่อยากมีออฟฟิศกลางให้เจอกันทุกวัน",
      price: "฿199",
      items: [
        "แผนที่สำเร็จรูปห้าแบบ",
        "เสียงและวิดีโอกับคนใกล้ตัว ห้องประชุม และแชร์หน้าจอ",
        "Private Talk สูงสุด 8 คนต่อวง",
        "แชต ห้องคุย และแชตใกล้ตัว",
        "ตัวละครหกแบบ ปรับได้ 11 ส่วน",
        "ซิงก์ Google Calendar สองทาง",
      ],
      cta: "เลือก Standard",
    },
    premium: {
      name: "Premium",
      for: "สำหรับทีมที่ประชุมบ่อยและอยากให้ AI ช่วย",
      price: "฿349",
      items: [
        "ทุกอย่างใน Standard",
        "แก้แผนที่เองใน Studio",
        "ให้ AI ร่างแผนที่ตอนสร้าง Space",
        "AI agent บนแผนที่",
        "อัดห้องประชุมเข้า Meet8",
      ],
      cta: "เลือก Premium",
    },
    custom: {
      name: "Customize",
      for: "สำหรับองค์กรที่ต้องการแผนที่และการตั้งค่าเฉพาะ",
      price: "คุยกับเรา",
      items: [
        "ทุกอย่างใน Premium",
        "แผนที่ออกแบบตามผังออฟฟิศจริง",
        "ตั้งค่าเครือข่ายสำหรับไฟร์วอลล์องค์กร",
        "ช่วยตั้งระบบและอบรมทีม",
      ],
      cta: "ติดต่อทีมขาย",
    },
    noteBold: "ราคาตัวอย่าง",
    noteRest: " ใช้วางโครงหน้าเท่านั้น ยังไม่ใช่ราคาขายจริง และยังไม่รวม VAT 7%",
  },
  faq: {
    eyebrow: "คำถามที่พบบ่อย",
    h2: "คำถามที่ลูกค้าถามบ่อย",
    items: [
      {
        q: "ออฟฟิศเสมือนคืออะไร",
        a: [
          "ออฟฟิศเสมือนคือแผนที่ออนไลน์ของทีม แต่ละคนมีตัวละครที่เดินไปมาได้ เมื่อเดินเข้าใกล้กันก็คุยกันได้เหมือนเดินไปที่โต๊ะเพื่อน เมื่อเดินเข้าห้องประชุม ทุกคนในห้องได้ยินกัน",
        ],
      },
      {
        q: "ได้ยินเสียงใครบ้าง",
        a: [
          "ในพื้นที่ส่วนกลาง คุณได้ยินเฉพาะคนที่อยู่ในระยะใกล้ ในห้องประชุม ทุกคนในห้องได้ยินกันหมด และคนนอกห้องไม่ได้ยิน",
          "ถ้าอยากคุยเฉพาะกลุ่มกลางลาน ให้เปิด Private Talk ได้สูงสุด 8 คน เมื่อมีคนออก วงจะจบทันที",
        ],
      },
      {
        q: "ต้องติดตั้งโปรแกรมไหม",
        a: [
          "ไม่ต้องติดตั้ง Space8 เปิดในเบราว์เซอร์ ครั้งแรกที่ใช้ไมโครโฟนหรือกล้อง เบราว์เซอร์จะขออนุญาต และถ้าใช้ไม่ได้ แอปจะบอกสาเหตุจริง เช่น อุปกรณ์ถูกโปรแกรมอื่นใช้อยู่",
        ],
      },
      {
        q: "อัดการประชุมได้ไหม ใครเห็นบ้าง",
        a: [
          "อัดได้เมื่ออยู่ในห้องประชุม หลังเชื่อมบัญชี Meet8 แล้ว ทุกคนในห้องเห็นกล่อง “กำลังอัดเข้า Meet8” และชื่อคนที่เริ่มอัดตลอดเวลา การอัดจะไปอยู่ใน Meet8 ของคนที่กดเริ่ม",
        ],
      },
      {
        q: "ใช้กับ Google Calendar อย่างไร",
        a: [
          "แต่ละคนเลือกเปิดการซิงก์เองได้ เมื่อเปิดแล้ว นัดประชุมใน Space8 กับ Google Calendar จะตรงกันทั้งสองทาง",
        ],
      },
      {
        q: "AI agent เห็นข้อมูลอะไรบ้าง",
        a: [
          "agent เห็นเฉพาะการตั้งค่าของตัวเองกับบทสนทนาของคนที่กำลังคุยด้วย คนอื่นเห็นแค่สถานะทั่วไป เช่น ว่างหรือกำลังทำงาน ไม่เห็นว่าใครถามอะไร ห้ามใส่รหัสผ่านหรือข้อมูลลับในคำสั่งของ agent",
        ],
      },
    ],
    help: "ยังมีคำถามอยู่ไหม",
    helpCta: "คุยกับทีม BE8",
  },
  closing: {
    h2: "พาทีมกลับมาอยู่ในพื้นที่เดียวกัน",
    lede: "ออฟฟิศเสมือนสำหรับทีมไทยและเอเชียตะวันออกเฉียงใต้",
    cta: "สร้าง Space ของทีม",
    byline: "ผลิตภัณฑ์จาก Beryl8",
    product: "ผลิตภัณฑ์",
    productLinks: { office: "ฟีเจอร์", templates: "แผนที่", pricing: "ราคา", brain: "Meet8" },
    helpTitle: "ช่วยเหลือ",
    helpLinks: { faq: "คำถามที่พบบ่อย", start: "เริ่มต้นใช้งาน" },
    copyright: "© 2026 Beryl8",
    sample: "ราคาในหน้านี้เป็นตัวอย่าง",
  },
};

export const content: Record<Locale, Space8Content> = { en, th };
