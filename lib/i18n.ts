export const locales = ["en", "th"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export type Localized = Record<Locale, string>;

const dictionaries = {
  en: {
    siteTitle: "BE8 AI Solutions",
    siteDescription: "AI solutions by Beryl8, built for Thai and ASEAN enterprises.",
    eyebrow: "Beryl8 AI Lab",
    heroLead: "AI Solutions",
    heroAccent: "built for enterprise.",
    heroBody:
      "Ten AI solutions for enterprise transformation, covering meetings, agents, voice, analytics, integration, workspace, marketing, agent collaboration, embedded Q&A and customer data. Open any solution to see how it works.",
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
      "สิบโซลูชัน AI สำหรับการเปลี่ยนผ่านในองค์กร ครอบคลุมการประชุม Agent เสียง การวิเคราะห์ข้อมูล การเชื่อมระบบ ออฟฟิศเสมือน การตลาด การทำงานร่วมกับ Agent ถาม-ตอบในหน้าที่ใช้อยู่ และข้อมูลลูกค้า เลือกโซลูชันเพื่อดูรายละเอียด",
    productsHeading: "โซลูชันทั้งหมด",
    productCount: (n: number) => `${n} โซลูชัน`,
    openPage: "ดูรายละเอียด",
    openSite: "เข้าชมเว็บไซต์",
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
