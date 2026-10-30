export const locales = ["en", "th"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export type Localized = Record<Locale, string>;

const dictionaries = {
  en: {
    siteTitle: "BE8 AI Products",
    siteDescription: "AI products by Beryl8, built for Thai and ASEAN enterprises.",
    eyebrow: "Beryl8 AI Lab",
    heroLead: "AI products",
    heroAccent: "built for Thai enterprises.",
    heroBody:
      "Seven products for AI-driven transformation, covering meetings, agents, voice, analytics, integration, workspace and marketing. Open any product to see its mockup.",
    productsHeading: "The product suite",
    productCount: (n: number) => `${n} products`,
    openMockup: "Open mockup",
    openSite: "Visit site",
    mockup: "Mockup",
    live: "Live preview",
    langLabel: "Language",
    footerAbout:
      "Thailand's leading AI Transformation and consulting firm. Listed on the Stock Exchange of Thailand as BE8.",
    footerNote: "Mockup pages for internal review.",
    copyright: "© 2026 Beryl8 Public Company Limited.",
  },
  th: {
    siteTitle: "ผลิตภัณฑ์ AI ของ BE8",
    siteDescription: "ผลิตภัณฑ์ AI จาก Beryl8 สำหรับองค์กรไทยและอาเซียน",
    eyebrow: "Beryl8 AI Lab",
    heroLead: "ผลิตภัณฑ์ AI",
    heroAccent: "สำหรับองค์กรไทย",
    heroBody:
      "เจ็ดผลิตภัณฑ์สำหรับการเปลี่ยนผ่านด้วย AI ครอบคลุมการประชุม Agent เสียง การวิเคราะห์ข้อมูล การเชื่อมระบบ ออฟฟิศเสมือน และการตลาด เลือกผลิตภัณฑ์เพื่อดูหน้าตัวอย่าง",
    productsHeading: "ผลิตภัณฑ์ทั้งหมด",
    productCount: (n: number) => `${n} ผลิตภัณฑ์`,
    openMockup: "เปิดหน้าตัวอย่าง",
    openSite: "เข้าชมเว็บไซต์",
    mockup: "ตัวอย่าง",
    live: "เวอร์ชันทดลอง",
    langLabel: "ภาษา",
    footerAbout:
      "บริษัทที่ปรึกษาด้าน AI Transformation ชั้นนำของประเทศไทย จดทะเบียนในตลาดหลักทรัพย์แห่งประเทศไทยในชื่อ BE8",
    footerNote: "หน้าตัวอย่างสำหรับตรวจสอบภายใน",
    copyright: "© 2026 Beryl8 Public Company Limited.",
  },
};

export type Dictionary = (typeof dictionaries)["en"];

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
