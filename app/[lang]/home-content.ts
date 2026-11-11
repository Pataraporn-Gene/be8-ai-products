import type { Locale } from "@/lib/i18n";

/* Strings for the AI Solutions landing page that mirror the beryl8.com page layout. */

const SITE = "https://www.beryl8.com";

type Link = { label: string; href: string };

const en = {
  nav: [
    { label: "Services", path: "/services" },
    { label: "Technology", path: "/technology/partners" },
    { label: "News and Insights", path: "/newsroom/insights" },
    { label: "Company", path: "/about/overview" },
    { label: "Investors", path: "/investor-relations/home" },
    { label: "Careers", path: "/careers/working-with-us" },
  ],
  contactNav: "Contact Us",
  breadcrumbAria: "Breadcrumb",
  crumbs: { home: "Home", technology: "Technology", current: "AI Solutions" },
  title: "AI Solutions",
  introHeading: () => `One AI suite for every part of your business`,
  introLead: "Ready-made AI solutions for Thai and ASEAN businesses",
  cta: {
    heading: "Contact our sales team",
    body: "Tell us what you need. We'll answer your questions and show how Beryl8's AI solutions fit your business.",
    points: ["Walk through each solution", "Find the right fit for your team", "See use cases for your industry"],
    button: "Contact sales",
  },
  footer: {
    home: "Home",
    contact: "Contact Us",
    newsHeading: "News Subscription",
    newsBody: "Get updates and announcements from Beryl8.",
    subscribe: "Subscribe",
    legal: "Cookie Policy",
  },
};

export type HomeContent = typeof en;

const th: HomeContent = {
  nav: [
    { label: "บริการ", path: "/services" },
    { label: "เทคโนโลยี", path: "/technology/partners" },
    { label: "ข่าวสารและบทความ", path: "/newsroom/insights" },
    { label: "เกี่ยวกับบริษัท", path: "/about/overview" },
    { label: "นักลงทุน", path: "/investor-relations/home" },
    { label: "ร่วมงานกับเรา", path: "/careers/working-with-us" },
  ],
  contactNav: "ติดต่อเรา",
  breadcrumbAria: "เส้นทางนำทาง",
  crumbs: { home: "หน้าแรก", technology: "เทคโนโลยี", current: "โซลูชัน AI" },
  title: "โซลูชัน AI",
  introHeading: () => `โซลูชัน AI สำหรับทุกส่วนของธุรกิจ`,
  introLead: "โซลูชัน AI สำเร็จรูปสำหรับธุรกิจไทยและอาเซียน",
  cta: {
    heading: "ติดต่อทีมขายของเรา",
    body: "บอกเราว่าคุณต้องการอะไร ทีมงานยินดีตอบคำถาม และแสดงให้เห็นว่าโซลูชัน AI ของ Beryl8 เข้ากับธุรกิจของคุณอย่างไร",
    points: ["ดูรายละเอียดแต่ละโซลูชัน", "หาโซลูชันที่เหมาะกับทีมของคุณ", "ดูตัวอย่างการใช้งานในอุตสาหกรรมของคุณ"],
    button: "ติดต่อทีมขาย",
  },
  footer: {
    home: "หน้าแรก",
    contact: "ติดต่อเรา",
    newsHeading: "รับข่าวสารจากเรา",
    newsBody: "รับข่าวและประกาศล่าสุดจาก Beryl8",
    subscribe: "สมัครรับข่าวสาร",
    legal: "นโยบายคุกกี้",
  },
};

export const homeContent: Record<Locale, HomeContent> = { en, th };

export const siteUrl = (lang: Locale, path: string) => `${SITE}/${lang}${path}`;
export type { Link };
