import { Bot, Brain, ChartColumn, Database, Map, Megaphone, MessageCircleQuestion, MessagesSquare, PenLine, Phone, Workflow, type LucideIcon } from "lucide-react";
import type { ProductIcon } from "@/lib/products";

export const productIcons: Record<ProductIcon, LucideIcon> = {
  brain: Brain,
  bot: Bot,
  phone: Phone,
  chart: ChartColumn,
  workflow: Workflow,
  map: Map,
  megaphone: Megaphone,
  chat: MessagesSquare,
  ask: MessageCircleQuestion,
  database: Database,
  signature: PenLine,
};
