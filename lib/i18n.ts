export const locales = ["en", "th"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export type Localized = Record<Locale, string>;

const dictionaries = {
  en: {
    siteTitle: "BE8 AI Solutions",
    siteDescription: "AI solutions from Beryl8 for companies in Thailand and ASEAN.",
    eyebrow: "Beryl8 AI Lab",
    heroLead: "AI Solutions",
    heroAccent: "for enterprise.",
    heroBody:
      "Ten AI solutions for your business: meeting notes, AI agents, phone calls, analytics, system connections, a virtual office, marketing, team chat with agents, Q&A inside your pages, and customer data. Open one to see how it works.",
    productsHeading: "The solution suite",
    productCount: (n: number) => `${n} solutions`,
    openPage: "View product",
    openSite: "Visit site",
    mockup: "Mockup",
    live: "Live preview",
    footerAbout:
      "Thailand's leading AI Transformation and consulting firm. Listed on the Stock Exchange of Thailand as BE8.",
    footerNote: "Mockup pages for internal review.",
    copyright: "© 2026 Beryl8 Public Company Limited.",
  },
  th: {
    siteTitle: "โซลูชัน AI ของ BE8",
    siteDescription: "โซลูชัน AI จาก Beryl8 สำหรับองค์กรไทยและอาเซียน",
    eyebrow: "Beryl8 AI Lab",
    heroLead: "โซลูชัน AI",
    heroAccent: "สำหรับองค์กร",
    heroBody:
      "สิบโซลูชัน AI สำหรับธุรกิจ ได้แก่ บันทึกการประชุม AI Agent โทรศัพท์ วิเคราะห์ข้อมูล เชื่อมระบบ ออฟฟิศเสมือน การตลาด แชตทีมที่มี Agent ถาม-ตอบในหน้าที่ใช้อยู่ และข้อมูลลูกค้า เปิดดูแต่ละโซลูชันได้เลย",
    productsHeading: "โซลูชันทั้งหมด",
    productCount: (n: number) => `${n} โซลูชัน`,
    openPage: "ดูรายละเอียด",
    openSite: "ไปที่เว็บไซต์",
    mockup: "ตัวอย่าง",
    live: "เวอร์ชันทดลอง",
    footerAbout:
      "บริษัทที่ปรึกษาด้าน AI Transformation ชั้นนำของประเทศไทย จดทะเบียนในตลาดหลักทรัพย์แห่งประเทศไทยในชื่อ BE8",
    footerNote: "หน้าตัวอย่างสำหรับตรวจสอบภายใน",
    copyright: "© 2026 Beryl8 Public Company Limited.",
  },
};

export type Dictionary = (typeof dictionaries)["en"];

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
