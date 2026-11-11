import type { Locale } from "@/lib/i18n";

/* Every visitor-facing string on the Signature8 page. English and Thai share one shape. */

type Item = { h: string; p: string };

const en = {
  meta: {
    title: "Signature8 · Send PDFs for e-signature and keep the proof",
    description:
      "Send a PDF, have people sign it on any device, and keep a sealed copy with a certificate of completion. Contracts, NDAs, quotations and approvals, in Thai and English.",
  },
  header: { menuAria: "Main menu", menu: { how: "How it works", features: "Features", proof: "Proof", faq: "FAQ" } },
  hero: {
    eyebrow: "Signature8 by Beryl8",
    h1: "Send it today.",
    h1em: "Get it signed, with the proof.",
    lead:
      "Signature8 sends PDFs for electronic signature. Add the people and the boxes they need to fill, send it, and track every agreement. Signers open the link in their email. They need no account, and signing on a phone is as easy as on a laptop.",
    cta1: "See how it works",
    cta2: "What you get at the end",
    mini: ["Signing pages in Thai and English", "A sealed PDF and certificate for every agreement"],
  },
  mock: {
    file: "Service agreement.pdf",
    status: "Waiting for 1 signature",
    docTitle: "Service agreement",
    docLines: 5,
    fieldLabel: "Sign here",
    panel: "Recipients",
    people: [
      { n: "Napat S.", role: "Needs to sign", state: "Signed", tone: "ok" },
      { n: "Mali K.", role: "Needs to sign", state: "Waiting", tone: "wait" },
      { n: "Legal team", role: "Receives a copy", state: "After signing", tone: "idle" },
    ],
    order: "Order",
    note: "Illustrative screen with sample data",
  },
  facts: [
    { b: "No account to sign", span: "Recipients use a secure link from their email" },
    { b: "Works on a phone", span: "Built for people who sign on the go, in Thai or English" },
    { b: "Sealed at the end", span: "A digital seal makes any later change visible" },
    { b: "Every step recorded", span: "Who opened it, when and from where" },
  ],
  how: {
    eyebrow: "How it works",
    h2: "From PDF to signed agreement in five steps",
    steps: [
      { h: "Upload your PDF", p: "Add one or several documents. If a file is the wrong type or too large, you are told before you continue." },
      { h: "Add people and order", p: "Choose who signs, who only views and who gets a copy. Signers can go one after another or all at once." },
      { h: "Place the fields", p: "Drag signature, date, name, text, checkbox and other boxes onto the page. Preview it as the recipient first." },
      { h: "Send and track", p: "Recipients get an email with their link. Reminders and an expiry date keep things moving, and the list shows who is next." },
      { h: "Download the result", p: "When everyone has signed, all parties get the signed PDF and a certificate of completion." },
    ] as Item[],
  },
  features: {
    eyebrow: "Features",
    h2: "What you can do with it",
    items: [
      { h: "Signing on any device", p: "Guided steps take the signer from the first box to Finish. The signing page runs in Thai or English and fits a phone screen." },
      { h: "Many kinds of fields", p: "Signature, initials, date signed, name, email, company, title, text, number, checkbox, dropdown, radio, note, approve, decline and file attachment." },
      { h: "Templates", p: "Save a document with its roles and fields, then use it again and just fill in the names." },
      { h: "Bulk send", p: "Upload a CSV and send the same template to many people, each with their own name and details." },
      { h: "Public sign-up links", p: "Share one link, and each person who opens it fills in their name and email and signs their own copy." },
      { h: "Agreements and reports", p: "Search and filter every agreement, resend, void or correct one in progress, and export reports as CSV." },
    ] as Item[],
  },
  proof: {
    eyebrow: "Proof",
    h2: "Evidence you can show later",
    lead: "Every action on an agreement is written to a log that cannot be edited.",
    items: [
      { h: "Certificate of completion", p: "A PDF listing the events, times, IP addresses, document fingerprints and signatures for the agreement." },
      { h: "Sealed PDF", p: "The finished document carries a digital seal, so opening it in a PDF reader shows whether it was changed after signing." },
      { h: "Optional access code", p: "Ask a recipient to enter a code before they can open the document." },
      { h: "Recipient consent", p: "Each signer accepts the electronic records and signature disclosure before they begin." },
      { h: "Void and correct", p: "Cancel an agreement in progress with a reason, or fix the recipients, message or expiry date before it completes." },
      { h: "Webhooks", p: "Send status changes to your own system over HTTPS, signed so your server can check where they came from." },
    ] as Item[],
  },
  cases: {
    h2: "Common uses",
    rows: [
      { dt: "Contracts and NDAs", dd: "Send to a client, collect both signatures in order and keep the sealed copy." },
      { dt: "Quotations", dd: "Reuse a template, change the name and amount, and get an approval back." },
      { dt: "Internal approvals", dd: "Use the approve and decline buttons for sign-offs that need a record." },
      { dt: "High-volume paperwork", dd: "Use bulk send or a public link for forms many people need to sign." },
    ],
  },
  spec: {
    h2: "Technical summary",
    rows: [
      { dt: "Sign-in", dd: "Senders sign in with Google Workspace accounts from allowed domains. Recipients need no account." },
      { dt: "Documents", dd: "PDF only. Thai and Latin text are printed into the final PDF in one font." },
      { dt: "Seal", dd: "PAdES digital signature over the completed PDF, with the key held in Google Cloud KMS in production." },
      { dt: "Email", dd: "Signing links are sent through an outbox that retries, so a failed send does not lose a link." },
      { dt: "Database", dd: "PostgreSQL. Documents, logos and signatures are stored in the database." },
      { dt: "Languages", dd: "English and Thai for the app, the signing page and the emails." },
    ],
  },
  faq: {
    h2: "Frequently asked questions",
    items: [
      { q: "Do signers need an account?", a: "No. They open the link in their email, accept the disclosure, and sign." },
      { q: "Can people sign on a phone?", a: "Yes. The signing page is built for phones and runs in Thai or English." },
      { q: "How do I know a signed PDF was not changed?", a: "The completed PDF is digitally sealed. A PDF reader shows whether anything changed after sealing, and the certificate of completion lists the events." },
      { q: "What is not included yet?", a: "Payments, notary, ID checks by SMS, a workflow builder and importing from Box or Drive are not part of this version." },
      { q: "Is this a live product?", a: "This page is a mockup for internal review. The screen is illustrative and uses sample data." },
    ],
  },
  footer: { copy: "© 2026 Beryl8 Public Company Limited. Internal mockup." },
};

export type Signature8Content = typeof en;

const th: Signature8Content = {
  meta: {
    title: "Signature8 · ส่ง PDF ให้เซ็นออนไลน์ พร้อมหลักฐานครบ",
    description:
      "ส่ง PDF ให้คนเซ็นได้จากทุกอุปกรณ์ แล้วเก็บไฟล์ที่ผนึกแล้วพร้อมใบรับรองการเซ็นครบ ใช้กับสัญญา NDA ใบเสนอราคา และเอกสารขออนุมัติ ทั้งไทยและอังกฤษ",
  },
  header: { menuAria: "เมนูหลัก", menu: { how: "การทำงาน", features: "ฟีเจอร์", proof: "หลักฐาน", faq: "คำถามที่พบบ่อย" } },
  hero: {
    eyebrow: "Signature8 โดย Beryl8",
    h1: "ส่งวันนี้",
    h1em: "ได้เอกสารเซ็นกลับมา พร้อมหลักฐาน",
    lead:
      "Signature8 ส่ง PDF ให้เซ็นออนไลน์ เพิ่มผู้รับและช่องที่ต้องกรอก กดส่ง แล้วติดตามได้ทุกฉบับ ผู้เซ็นเปิดลิงก์จากอีเมลได้เลยโดยไม่ต้องมีบัญชี และเซ็นบนมือถือได้สะดวกเท่าบนคอมพิวเตอร์",
    cta1: "ดูวิธีการทำงาน",
    cta2: "สิ่งที่ได้เมื่อเซ็นครบ",
    mini: ["หน้าเซ็นมีทั้งไทยและอังกฤษ", "ทุกฉบับได้ PDF ที่ผนึกแล้วและใบรับรอง"],
  },
  mock: {
    file: "สัญญาบริการ.pdf",
    status: "รอเซ็นอีก 1 คน",
    docTitle: "สัญญาบริการ",
    docLines: 5,
    fieldLabel: "เซ็นตรงนี้",
    panel: "ผู้รับเอกสาร",
    people: [
      { n: "ณภัทร ส.", role: "ต้องเซ็น", state: "เซ็นแล้ว", tone: "ok" },
      { n: "มะลิ ก.", role: "ต้องเซ็น", state: "รอเซ็น", tone: "wait" },
      { n: "ทีมกฎหมาย", role: "รับสำเนา", state: "หลังเซ็นครบ", tone: "idle" },
    ],
    order: "ลำดับ",
    note: "หน้าจอตัวอย่าง ใช้ข้อมูลสมมติ",
  },
  facts: [
    { b: "เซ็นโดยไม่ต้องมีบัญชี", span: "ผู้รับเปิดลิงก์ที่ปลอดภัยจากอีเมล" },
    { b: "เซ็นบนมือถือได้", span: "ออกแบบให้เซ็นได้ทุกที่ ทั้งไทยและอังกฤษ" },
    { b: "ผนึกเมื่อเซ็นครบ", span: "ตราผนึกดิจิทัลทำให้เห็นทันทีถ้าไฟล์ถูกแก้ภายหลัง" },
    { b: "บันทึกทุกขั้นตอน", span: "ใครเปิด เมื่อไหร่ และจากที่ไหน" },
  ],
  how: {
    eyebrow: "การทำงาน",
    h2: "จาก PDF ถึงเอกสารที่เซ็นแล้วใน 5 ขั้นตอน",
    steps: [
      { h: "อัปโหลด PDF", p: "เพิ่มได้หลายไฟล์ ถ้าไฟล์ผิดชนิดหรือใหญ่เกินไป ระบบแจ้งก่อนไปขั้นต่อไป" },
      { h: "เพิ่มผู้รับและลำดับ", p: "เลือกว่าใครเซ็น ใครแค่ดู และใครรับสำเนา ให้เซ็นทีละคนหรือพร้อมกันก็ได้" },
      { h: "วางช่องกรอก", p: "ลากช่องลายเซ็น วันที่ ชื่อ ข้อความ ช่องติ๊ก และช่องอื่น ๆ ลงบนหน้าเอกสาร และดูตัวอย่างในมุมผู้รับได้ก่อนส่ง" },
      { h: "ส่งและติดตาม", p: "ผู้รับได้อีเมลพร้อมลิงก์ มีการเตือนและวันหมดอายุช่วยเร่ง และรายการบอกว่าถึงคิวใคร" },
      { h: "ดาวน์โหลดผลลัพธ์", p: "เมื่อทุกคนเซ็นครบ ทุกฝ่ายได้ PDF ที่เซ็นแล้วพร้อมใบรับรองการเซ็น" },
    ],
  },
  features: {
    eyebrow: "ฟีเจอร์",
    h2: "ทำอะไรได้บ้าง",
    items: [
      { h: "เซ็นได้ทุกอุปกรณ์", p: "มีขั้นตอนนำทางตั้งแต่ช่องแรกจนกด Finish หน้าเซ็นใช้ได้ทั้งไทยและอังกฤษ และพอดีกับหน้าจอมือถือ" },
      { h: "ช่องกรอกหลายแบบ", p: "ลายเซ็น ตัวย่อชื่อ วันที่เซ็น ชื่อ อีเมล บริษัท ตำแหน่ง ข้อความ ตัวเลข ช่องติ๊ก ตัวเลือก หมายเหตุ ปุ่มอนุมัติ ปุ่มปฏิเสธ และแนบไฟล์" },
      { h: "เทมเพลต", p: "บันทึกเอกสารพร้อมบทบาทและช่องกรอกไว้ แล้วหยิบมาใช้ซ้ำโดยเปลี่ยนแค่ชื่อ" },
      { h: "ส่งเป็นชุด", p: "อัปโหลดไฟล์ CSV แล้วส่งเทมเพลตเดียวให้หลายคน โดยแต่ละคนมีชื่อและข้อมูลของตัวเอง" },
      { h: "ลิงก์ให้กรอกเอง", p: "แชร์ลิงก์เดียว แล้วแต่ละคนที่เปิดจะกรอกชื่อกับอีเมล และเซ็นเอกสารของตัวเอง" },
      { h: "รายการเอกสารและรายงาน", p: "ค้นหาและกรองได้ทุกฉบับ ส่งซ้ำ ยกเลิก หรือแก้ฉบับที่ยังไม่เสร็จ และส่งออกรายงานเป็น CSV" },
    ],
  },
  proof: {
    eyebrow: "หลักฐาน",
    h2: "หลักฐานที่เอามาอ้างอิงได้ภายหลัง",
    lead: "ทุกการกระทำกับเอกสารถูกบันทึกลงประวัติที่แก้ไม่ได้",
    items: [
      { h: "ใบรับรองการเซ็น", p: "PDF ที่รวมเหตุการณ์ เวลา ที่อยู่ IP รหัสตรวจสอบเอกสาร และลายเซ็นของเอกสารฉบับนั้น" },
      { h: "PDF ที่ผนึกแล้ว", p: "ไฟล์สุดท้ายมีตราผนึกดิจิทัล เปิดด้วยโปรแกรมอ่าน PDF แล้วเห็นว่ามีการแก้ไขหลังเซ็นหรือไม่" },
      { h: "รหัสเข้าถึง (ไม่บังคับ)", p: "ให้ผู้รับกรอกรหัสก่อนเปิดเอกสารได้" },
      { h: "ผู้รับยอมรับก่อนเซ็น", p: "ผู้เซ็นทุกคนยอมรับเงื่อนไขการใช้เอกสารและลายเซ็นอิเล็กทรอนิกส์ก่อนเริ่ม" },
      { h: "ยกเลิกและแก้ไข", p: "ยกเลิกฉบับที่ยังไม่เสร็จพร้อมระบุเหตุผล หรือแก้ผู้รับ ข้อความ และวันหมดอายุก่อนที่จะเซ็นครบ" },
      { h: "Webhook", p: "ส่งการเปลี่ยนสถานะไปยังระบบของคุณผ่าน HTTPS พร้อมลายเซ็นให้เซิร์ฟเวอร์ตรวจได้ว่ามาจากเรา" },
    ],
  },
  cases: {
    h2: "ใช้กับงานอะไรบ้าง",
    rows: [
      { dt: "สัญญาและ NDA", dd: "ส่งให้ลูกค้า เก็บลายเซ็นทั้งสองฝ่ายตามลำดับ และเก็บไฟล์ที่ผนึกแล้ว" },
      { dt: "ใบเสนอราคา", dd: "ใช้เทมเพลตซ้ำ เปลี่ยนชื่อและจำนวนเงิน แล้วรับการอนุมัติกลับมา" },
      { dt: "เอกสารขออนุมัติภายใน", dd: "ใช้ปุ่มอนุมัติและปฏิเสธกับงานที่ต้องมีหลักฐาน" },
      { dt: "เอกสารจำนวนมาก", dd: "ใช้ส่งเป็นชุดหรือลิงก์สาธารณะกับแบบฟอร์มที่หลายคนต้องเซ็น" },
    ],
  },
  spec: {
    h2: "สรุปทางเทคนิค",
    rows: [
      { dt: "เข้าสู่ระบบ", dd: "ผู้ส่งใช้บัญชี Google Workspace จากโดเมนที่อนุญาต ผู้รับไม่ต้องมีบัญชี" },
      { dt: "เอกสาร", dd: "รองรับ PDF เท่านั้น ข้อความไทยและอังกฤษพิมพ์ลงใน PDF ฉบับสุดท้ายด้วยฟอนต์เดียว" },
      { dt: "ตราผนึก", dd: "ลายเซ็นดิจิทัลแบบ PAdES บน PDF ที่เซ็นครบ โดยคีย์อยู่ใน Google Cloud KMS ตอน production" },
      { dt: "อีเมล", dd: "ส่งลิงก์เซ็นผ่านคิวที่ลองส่งซ้ำได้ ถ้าส่งไม่สำเร็จลิงก์จะไม่หาย" },
      { dt: "ฐานข้อมูล", dd: "PostgreSQL เก็บเอกสาร โลโก้ และลายเซ็นไว้ในฐานข้อมูล" },
      { dt: "ภาษา", dd: "ไทยและอังกฤษทั้งในแอป หน้าเซ็น และอีเมล" },
    ],
  },
  faq: {
    h2: "คำถามที่พบบ่อย",
    items: [
      { q: "ผู้เซ็นต้องมีบัญชีไหม", a: "ไม่ต้อง เปิดลิงก์ในอีเมล ยอมรับเงื่อนไข แล้วเซ็นได้เลย" },
      { q: "เซ็นบนมือถือได้ไหม", a: "ได้ หน้าเซ็นออกแบบมาให้ใช้บนมือถือ และมีทั้งไทยและอังกฤษ" },
      { q: "รู้ได้อย่างไรว่า PDF ที่เซ็นแล้วไม่ถูกแก้", a: "PDF ที่เซ็นครบถูกผนึกด้วยตราดิจิทัล โปรแกรมอ่าน PDF จะแสดงว่ามีการแก้ไขหลังผนึกหรือไม่ และใบรับรองการเซ็นบันทึกเหตุการณ์ทั้งหมด" },
      { q: "อะไรที่ยังไม่มีในเวอร์ชันนี้", a: "การชำระเงิน การรับรองโดยโนตารี การยืนยันตัวตนด้วย SMS ตัวสร้าง workflow และการนำเข้าจาก Box หรือ Drive ยังไม่อยู่ในเวอร์ชันนี้" },
      { q: "นี่คือผลิตภัณฑ์จริงแล้วหรือยัง", a: "หน้านี้เป็นตัวอย่างสำหรับตรวจสอบภายใน หน้าจอเป็นภาพประกอบและใช้ข้อมูลสมมติ" },
    ],
  },
  footer: { copy: "© 2026 Beryl8 Public Company Limited. ตัวอย่างภายใน" },
};

export const content: Record<Locale, Signature8Content> = { en, th };
