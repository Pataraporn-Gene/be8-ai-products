// Run: node --test lib/pricing.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_SETTINGS, PRICING, costItem, decode, encode, newItem, totals, type Item } from "./pricing.ts";

const s = DEFAULT_SETTINGS;
const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-6, `${a} != ${b}`);

test("Insight8: US$480 per user, 20-user minimum, MA 22% from year 2", () => {
  const item: Item = { ...newItem("insight8", "a"), users: 5, setup: false };
  const c = costItem(item, s);
  close(c.license, 480 * 20);
  close(c.ma, 480 * 20 * 0.22);
  close(c.years[0].beryl8, 9600); // no usage billed by Beryl8
  close(c.years[1].beryl8, 2112);
});

test("Voice8: no license, AI billed by Beryl8 at the AI cost per minute (default US$0.0218)", () => {
  const item: Item = { ...newItem("voice8", "v"), inputs: { calls: 1000, callMin: 1, days: 1 }, setup: false };
  const c = costItem(item, s);
  close(c.license, 0);
  close(c.monthlyBeryl8, 21.8);
  close(c.years[0].beryl8, 21.8 * 12);
  close(c.years[4].beryl8, 21.8 * 12); // no MA without a license
  close(costItem({ ...item, inputs: { ...item.inputs, aiMin: 0.05 } }, s).monthlyBeryl8, 50); // follows the input
});

test("Meet8 transcription at measured cost US$0.53/h, paid to providers on your own cloud", () => {
  const item: Item = { ...newItem("meet8", "m"), inputs: { hours: 100, asks: 0 }, setup: false };
  const c = costItem(item, s);
  close(c.monthlyBeryl8, 0);
  close(c.lines.find((l) => l.id === "stt")!.sell, 53);
});

test("setup converts THB man-days to USD; discount applies to license and MA", () => {
  const item: Item = { ...newItem("insight8", "a"), users: 20 };
  const c = costItem(item, { ...s, discount: 10, rate: 30, dayRate: 15000 });
  close(c.setup, (PRICING.insight8.setupDays * 15000) / 30);
  close(c.license, 9600 * 0.9);
  close(c.ma, 9600 * 0.9 * 0.22);
});

test("partner share is a cut of license + MA only", () => {
  const items = [{ ...newItem("insight8", "a"), setup: false, size: "standard" as const }];
  const t = totals(items, { ...s, viaPartner: true, partner: 30 });
  close(t.internal.partnerShare, (9600 + 2112 * 4) * 0.3);
  close(t.tco, 9600 + 2112 * 4 + 12 * 1001.58 * 5); // license + 4 × MA + 5 years of AI and cloud
});

test("share link round-trips and rejects junk", () => {
  const items = [{ ...newItem("pulse8", "x"), users: 42 }, newItem("voice8", "y")];
  const back = decode(encode({ v: 1, items, s: { ...s, discount: 5 }, cur: "USD", vat: true }));
  assert.ok(back);
  assert.equal(back.items.length, 2);
  assert.equal(back.items[0].users, 42);
  assert.equal(back.s.discount, 5);
  assert.equal(back.cur, "USD");
  assert.equal(decode("not-base64!!"), null);
  assert.equal(decode(btoa('{"v":1,"i":[["nope",1,{},1]]}'))?.items.length, 0);
  // negative / huge inputs are clamped
  const evil = decode(btoa(JSON.stringify({ v: 1, i: [["meet8", -5, { hours: -100, asks: 1e99 }, 1]], s: { rate: 0 } })));
  assert.ok(evil);
  assert.equal(evil.items[0].inputs.hours, 0);
  assert.equal(evil.items[0].inputs.asks, 10000);
  assert.ok(evil.s.rate >= 1);
});
