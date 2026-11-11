// Money oracles for the calculator. Every expected value is a literal worked out by hand
// from the 2026-11-09 pricing decision, not produced by running the code under test.
// Run: node --test lib/pricing.money.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_SETTINGS, PRICING, billedUsers, choiceIndex, costItem, decode, displayGrid, encode, isPriced, vatOf, newItem, roundMoney, roundPrice, toDisplay, totals, type Item } from "./pricing.ts";

const s = DEFAULT_SETTINGS;
const YEARS_N = 5; // rate 33.5, ฿15,000 per man-day, no discount
const near = (actual: number, expected: number, what: string) =>
  assert.ok(Math.abs(actual - expected) < 1e-6, `${what}: expected ${expected}, got ${actual}`);
const insight = (patch: Partial<Item> = {}): Item => ({ ...newItem("insight8", "i"), setup: false, ...patch });

test("C1 Insight8 20 users: license $9,600, MA $2,112 from year 2, 5-year $78,142.80", () => {
  const c = costItem(insight({ size: "standard" }), s);
  near(c.license, 9600, "license");
  near(c.ma, 2112, "MA");
  assert.deepEqual(c.years.map((y) => Math.round(y.beryl8 * 1000) / 1000), [9600, 2112, 2112, 2112, 2112]);
  // direct: AI 20 x 80 x $0.30 = $480 + cloud $521.58 (Insight8 standard stack) = $1,001.58 / month
  near(c.monthlyDirect, 1001.58, "direct per month");
  near(totals([insight({ size: "standard" })], s).tco, 78142.8, "5-year total"); // 18,048 + 12 x 1,001.58 x 5
});

test("C2 20-user minimum: 0, 5, 19, 20 users pay for 20; 21 pays for 21", () => {
  for (const users of [0, 5, 19, 20]) near(costItem(insight({ users }), s).license, 9600, `${users} users`);
  near(costItem(insight({ users: 21 }), s).license, 10080, "21 users");
});

test("C3 Voice8 1,000 min: $76/month billed by Beryl8, no license and no MA", () => {
  const c = costItem({ ...newItem("voice8", "v"), inputs: { minutes: 1000, sip: 0 }, setup: false }, s);
  near(c.license, 0, "license");
  near(c.ma, 0, "MA");
  near(c.monthlyBeryl8, 76, "billed per month");
  near(c.years[0].beryl8, 912, "year 1");
  near(c.years[4].beryl8, 912, "year 5");
  near(0.076 * s.rate, 2.546, "THB per minute"); // ฿2.55 as quoted
});

test("C4 Meet8 100 h: sell $250, cost $74 (US$2.5 vs US$0.74 per hour)", () => {
  const c = costItem({ ...newItem("meet8", "m"), inputs: { hours: 100, asks: 0 }, setup: false }, s);
  near(c.monthlyBeryl8, 250, "sell");
  near(c.monthlyCost, 74, "cost");
});

test("C5 implementation: 5 man-days x ฿15,000 = ฿75,000 exactly, counted in year 1 only", () => {
  const c = costItem(insight({ setup: true }), s);
  near(c.setup * s.rate, 75000, "setup in THB");
  near(c.years[0].beryl8 * s.rate, 9600 * 33.5 + 75000, "year 1 Beryl8 THB");
  near(c.years[1].beryl8, 2112, "year 2 has no setup");
});

test("C6 discount: 10% → license $8,640, MA $1,900.80; 33% → $6,432 (float edge)", () => {
  const ten = costItem(insight(), { ...s, discount: 10 });
  near(ten.license, 8640, "license 10%");
  near(ten.ma, 1900.8, "MA 10%");
  near(costItem(insight(), { ...s, discount: 33 }).license, 6432, "license 33%");
});

test("C7 partner 30% of license + 4 years MA = $5,414.40", () => {
  const t = totals([insight()], { ...s, viaPartner: true, partner: 30 });
  near(t.internal.partnerShare, 5414.4, "partner share");
  near(totals([insight()], { ...s, viaPartner: false, partner: 30 }).internal.partnerShare, 0, "no partner");
});

test("C8 float: 3 Voice minutes = $0.228, many small lines still add up", () => {
  const c = costItem({ ...newItem("voice8", "v"), inputs: { minutes: 3, sip: 0.1 }, setup: false }, s);
  near(c.monthlyBeryl8, 0.228, "3 minutes");
  // 0.1 x 3 minutes of phone line = 0.3 (the classic 0.1*3 case)
  near(c.lines.find((l) => l.id === "sip")!.sell, 0.3, "sip");
});

/* ---- display rounding (added after the UI oracle found totals that did not add up) ---- */
test("C9 half-up rounding ignores float noise: 1.005 × 100 → 101, 4.35 × 100 → 435, 2.5 → 3, 855,362.28 → 855,362", () => {
  assert.equal(roundMoney(1.15 * 10), 12);
  assert.equal(roundMoney(1.005 * 100), 101); // 100.49999999999999 in float
  assert.equal(roundMoney(4.35 * 100), 435); // 434.99999999999994 in float
  assert.equal(roundMoney(2.5), 3);
  assert.equal(roundMoney(799404 * 1.07), 855362);
  assert.equal(roundPrice(480 * 33.33), 15998.4);
  assert.equal(roundPrice(1.005 * 100), 100.5);
});

test("C10 VAT and currency: ฿799,404 + 7% = ฿855,362; $23,862.81 stays USD", () => {
  assert.equal(roundMoney(toDisplay(21624 + 75000 / 33.5, { cur: "THB", rate: 33.5, vat: true })), 855362);
  assert.equal(roundMoney(toDisplay(21624 + 75000 / 33.5, { cur: "USD", rate: 33.5, vat: false })), 23863);
});

test("C11 property: every displayed total equals the sum of the displayed rows (2,000 random estimates)", () => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  const ids = Object.keys(PRICING);
  for (let n = 0; n < 2000; n++) {
    const items: Item[] = Array.from({ length: 1 + Math.floor(rnd() * 5) }, (_, k) => {
      const it = newItem(ids[Math.floor(rnd() * ids.length)], `r${k}`);
      it.users = Math.floor(rnd() * 400);
      for (const key of Object.keys(it.inputs)) it.inputs[key] = Math.round(it.inputs[key] * rnd() * 3 * 100) / 100;
      it.setup = rnd() > 0.5;
      it.size = rnd() > 0.5 ? "lean" : "standard";
      if (it.pid === "meet8") Object.assign(it.inputs, { host: Math.floor(rnd() * 3), pkg: Math.floor(rnd() * 3), extra: rnd() > 0.5 ? Math.round(rnd() * 200) : 0 });
      return it;
    });
    const st = { ...s, rate: 30 + Math.round(rnd() * 600) / 100, discount: Math.floor(rnd() * 40), viaPartner: rnd() > 0.5, partner: Math.floor(rnd() * 50), cud: rnd() > 0.5 };
    const d = { cur: rnd() > 0.5 ? ("THB" as const) : ("USD" as const), rate: st.rate, vat: rnd() > 0.5 };
    const g = displayGrid(totals(items, st), d, st);
    const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
    assert.equal(sum(g.items.map((i) => i.year1)), g.year1, `year 1, case ${n}`);
    assert.equal(sum(g.items.map((i) => i.total)), g.tco, `5-year by product, case ${n}`);
    assert.equal(sum(g.years.map((y) => y.total)), g.tco, `5-year by year, case ${n}`);
    for (const y of g.years) assert.equal(y.beryl8 + y.direct, y.total, `year row, case ${n}`);
    assert.equal(g.foot.beryl8 + g.foot.direct, g.foot.total, `footer, case ${n}`);
    assert.equal(g.internal.revenue - g.internal.partnerShare - g.internal.usageCost, g.internal.net, `internal, case ${n}`);
    assert.ok([g.year1, g.tco, ...g.years.map((y) => y.total)].every(Number.isInteger), `whole units, case ${n}`);
    // card level (added after the independent review, findings B2/B4): header = its own rows
    for (const [k, it] of g.items.entries()) {
      const rows = sum(it.lines.map((l) => l.sell));
      assert.equal(it.monthlyBeryl8 + it.monthlyDirect, rows, `card monthly, case ${n}`);
      assert.equal(it.year1, it.license + it.setup + 12 * rows, `card year 1 = rows, case ${n}`);
      assert.equal(it.total, it.year1 + 4 * (it.ma + 12 * rows), `card 5-year = rows, case ${n}`);
      assert.equal(it.license, roundMoney(billedUsers(items[k]) * it.unitPrice * (1 - st.discount / 100)), `license row multiplies out, case ${n}`);
      assert.equal(it.ma, Math.round((it.license * 22) / 100), `MA row = 22% of the license row, case ${n}`);
    }
    assert.equal(g.monthly, sum(g.items.map((i) => sum(i.lines.map((l) => l.sell)))), `running cost, case ${n}`);
    // hosting split: every customer-paid row lands in exactly one column, and columns add up
    for (const [k, r] of g.hosting.rows.entries()) {
      assert.equal(r.cloud + r.ai + r.other, r.total, `hosting row, case ${n}`);
      assert.equal(r.total, g.items[k].monthlyDirect, `hosting row = card's direct rows, case ${n}`);
    }
    const ht = g.hosting.total;
    assert.equal(ht.total, sum(g.hosting.rows.map((r) => r.total)), `hosting total, case ${n}`);
    assert.equal(ht.cloud + ht.ai + ht.other, ht.total, `hosting columns, case ${n}`);
    assert.equal(ht.total * 12, g.foot.direct / YEARS_N, `hosting per year = providers column per year, case ${n}`);
  }
});

test("C12 prototype keys are not products (review finding B1)", () => {
  for (const k of ["constructor", "toString", "__proto__", "hasOwnProperty"]) assert.equal(isPriced(k), false, k);
  assert.equal(isPriced("insight8"), true);
  const link = btoa(JSON.stringify({ v: 1, i: [["insight8", 20, {}, 0], ["toString", 1, {}, 1]], s: {} }));
  assert.equal(decode(link)?.items.length, 1);
});

test("C13 customer links carry no partner settings (review finding B3)", () => {
  const saved = { v: 1 as const, items: [insight()], s: { ...s, viaPartner: true, partner: 35, discount: 5 }, cur: "THB" as const, vat: false };
  const raw = (h: string) => atob(h.replace(/-/g, "+").replace(/_/g, "/"));
  assert.doesNotMatch(raw(encode(saved, { internal: false })), /partner/i);
  assert.match(raw(encode(saved)), /"partner":35/);
  assert.equal(decode(encode(saved, { internal: false }))?.s.discount, 5);
});

test("C14 Insight8 standard size at default rate on screen: ฿799,212 year 1 with implementation", () => {
  const g = displayGrid(totals([insight({ setup: true, size: "standard" })], s), { cur: "THB", rate: 33.5, vat: false }, s);
  assert.equal(g.items[0].license, 321600); // 20 × ฿16,080
  assert.equal(g.items[0].ma, 70752); // 22% of ฿321,600
  // 321,600 + 75,000 + 12 x (AI 16,080 + GCP 17,471)
  assert.equal(g.year1, 799212);
  assert.equal(g.tco, 2692668); // + 4 x (70,752 + 402,612)
});

test("C15 VAT once on the total: ฿799,212 → VAT ฿55,945 → ฿855,157", () => {
  const g = displayGrid(totals([insight({ setup: true, size: "standard" })], s), { cur: "THB", rate: 33.5, vat: false }, s);
  assert.equal(vatOf(g.year1), 55945); // 55,944.84
  assert.equal(g.year1 + vatOf(g.year1), 855157);
});

test("C16 hosting estimate, Insight8 20 users at ฿33.5: GCP ฿17,471 + AI ฿16,080 = ฿33,551 / month, ฿402,612 / year", () => {
  const g = displayGrid(totals([insight({ size: "standard" })], s), { cur: "THB", rate: 33.5, vat: false }, s);
  // GCP rows: 4,648 + 5,020 + 1,528 + 531 + 4,744 + 253 + 543 + 204 = 17,471
  assert.deepEqual(g.hosting.total, { cloud: 17471, ai: 16080, other: 0, total: 33551 });
  assert.equal(g.hosting.total.total * 12, 402612);
});

test("C17 hosting puts Voice8 phone charges under Other, not AI (Voice8 AI is billed by Beryl8)", () => {
  const v = { ...newItem("voice8", "v"), inputs: { minutes: 10000, sip: 0.02 }, setup: false };
  const g = displayGrid(totals([v], s), { cur: "THB", rate: 33.5, vat: false }, s);
  // SIP 10,000 × $0.02 × 33.5 = ฿6,700; cloud $250 × 33.5 = ฿8,375
  assert.deepEqual(g.hosting.total, { cloud: 8375, ai: 0, other: 6700, total: 15075 });
});

test("C19 Insight8 lean size is the default: GCP ฿9,771 / month for 20 users", () => {
  assert.equal(newItem("insight8", "x").size, "lean");
  const g = displayGrid(totals([insight()], s), { cur: "THB", rate: 33.5, vat: false }, s);
  // 70.10, 60.31, 45.6, 15.86, 69.98, 7.56, 16.22, 6.1 US$ × 33.5 → 2,348 + 2,020 + 1,528 + 531 + 2,344 + 253 + 543 + 204
  assert.deepEqual(g.items[0].lines.filter((l) => l.kind === "cloud").map((l) => l.sell), [2348, 2020, 1528, 531, 2344, 253, 543, 204]);
  assert.deepEqual(g.hosting.total, { cloud: 9771, ai: 16080, other: 0, total: 25851 });
});

test("C20 committed-use discount: Cloud Run −17%, Cloud SQL −25%, other rows unchanged → ฿8,183", () => {
  const g = displayGrid(totals([insight()], { ...s, cud: true }), { cur: "THB", rate: 33.5, vat: false }, { ...s, cud: true });
  // Studio 70.10×0.83, sandbox 60.31×0.83, tools 45.6×0.83, SQL 69.98×0.75; jobs, storage, network, other as before
  assert.deepEqual(g.items[0].lines.filter((l) => l.kind === "cloud").map((l) => l.sell), [1949, 1677, 1268, 531, 1758, 253, 543, 204]);
  assert.equal(g.hosting.total.cloud, 8183);
  // the discount reaches neither the AI row nor what Beryl8 bills
  assert.equal(g.hosting.total.ai, 16080);
  assert.equal(g.items[0].license, 321600);
});

test("C21 AI cost per question is editable: 20 users × 80 × US$0.12 = US$192 = ฿6,432", () => {
  const g = displayGrid(totals([insight({ inputs: { asks: 80, aiQ: 0.12 } })], s), { cur: "THB", rate: 33.5, vat: false }, s);
  assert.equal(g.hosting.total.ai, 6432);
});

test("C22 size and CUD survive a share link", () => {
  const saved = { v: 1 as const, items: [insight({ size: "standard" })], s: { ...s, cud: true }, cur: "THB" as const, vat: false };
  const back = decode(encode(saved, { internal: false }));
  assert.equal(back?.items[0].size, "standard");
  assert.equal(back?.s.cud, true);
  assert.equal(decode(encode({ ...saved, items: [insight()] }))?.items[0].size, "lean");
});

/* ---- Ask 8: credits per answered question. Expected values worked out by hand. ---- */
const ask8 = (inputs: Record<string, number> = {}): Item => {
  const base = newItem("ask8", "a");
  return { ...base, setup: false, inputs: { ...base.inputs, ...inputs } };
};
const aiLine = (item: Item) => costItem(item, s).lines.find((l) => l.id === "ai")!;

test("A1 AI Pack default: 20 x 40 x 1.6 = 1,280 credits = ฿5,120 billed by Beryl8, cost $54.52", () => {
  const c = costItem(ask8(), s);
  const ai = aiLine(ask8());
  assert.equal(ai.payer, "beryl8");
  assert.equal(ai.kind, "usage");
  assert.equal(ai.draft, true);
  near(c.monthlyBeryl8 * 33.5, 5120, "billed in THB");
  near(c.monthlyCost, 54.52, "800 x (0.0389 x .6 + 0.0792 x .3 + 0.1805 x .1 + 0.003)");
});

test("A2 pay your provider: $52.12 direct at cost, no infra, nothing billed by Beryl8", () => {
  const c = costItem(ask8({ pack: 0 }), s);
  const ai = aiLine(ask8({ pack: 0 }));
  assert.equal(ai.payer, "direct");
  assert.equal(ai.kind, "ai");
  near(ai.sell, 52.12, "sell");
  near(ai.cost, 52.12, "cost");
  near(c.monthlyBeryl8, 0, "billed by Beryl8");
  near(c.monthlyDirect, 52.12 + 155, "AI + cloud 150 + 10 GB x 0.5");
});

test("A3 mix over 100% gives data what is left after actions, never a negative share", () => {
  near(aiLine(ask8({ action: 50, data: 80 })).sell * 33.5, 800 * 3 * 4, "50/50/0 = 3 credits");
  near(aiLine(ask8({ action: 100, data: 100 })).sell * 33.5, 800 * 4 * 4, "all actions = 4 credits");
  near(aiLine(ask8({ action: 0, data: 0 })).sell * 33.5, 800 * 1 * 4, "all plain answers = 1 credit");
  assert.ok(!aiLine(ask8({ action: 0.1, data: 100 })).detail!.en.includes("-0"), "float noise must not print -0");
});

test("A4 no questions, no AI charge", () => {
  const ai = aiLine(ask8({ asks: 0 }));
  near(ai.sell, 0, "sell");
  near(ai.cost, 0, "cost");
});

test("A5 credits leave the license, MA and cloud alone", () => {
  const c = costItem(ask8(), s);
  near(c.license, 2400, "20 x $120");
  near(c.ma, 528, "22%");
  near(c.monthlyDirect, 155, "cloud only when AI Pack bills the AI");
});

test("A6 share link keeps pack and mix, old links get defaults, bad pack values land on one side", () => {
  const items = [ask8({ pack: 0, data: 15, action: 5 })];
  const back = decode(encode({ v: 1, items, s, cur: "THB", vat: false }));
  assert.deepEqual(
    { pack: back!.items[0].inputs.pack, data: back!.items[0].inputs.data, action: back!.items[0].inputs.action },
    { pack: 0, data: 15, action: 5 },
  );
  const old = decode(btoa(JSON.stringify({ v: 1, i: [["ask8", 20, { asks: 40, gb: 10 }, 1]], s: {} })));
  assert.deepEqual(
    { pack: old!.items[0].inputs.pack, data: old!.items[0].inputs.data, action: old!.items[0].inputs.action },
    { pack: 1, data: 30, action: 10 },
  );
  const viaLink = (pack: number) => {
    const d = decode(btoa(JSON.stringify({ v: 1, i: [["ask8", 20, { pack }, 1]], s: {} })));
    return [choiceIndex(d!.items[0].inputs.pack), aiLine(d!.items[0]).payer];
  };
  assert.deepEqual([0.49, 0.5, 2.5, -1].map(viaLink), [[0, "direct"], [1, "beryl8"], [1, "beryl8"], [0, "direct"]]);
});

test("A7 satang and rounding: 21 x 3 questions = 100.8 credits = ฿403.20 shows ฿403; VAT and other rates round once", () => {
  const small = { ...ask8({ asks: 3 }), users: 21 };
  near(aiLine(small).sell * 33.5, 403.2, "100.8 credits x ฿4");
  const row = (it: Item, st: typeof s, d: { cur: "THB" | "USD"; rate: number; vat: boolean }) =>
    displayGrid(totals([it], st), d, st).items[0].lines.find((l) => l.id === "ai")!.sell;
  assert.equal(row(small, s, { cur: "THB", rate: 33.5, vat: false }), 403);
  assert.equal(row(ask8(), s, { cur: "THB", rate: 33.5, vat: true }), 5478); // 5,120 x 1.07 = 5,478.40
  assert.equal(row(ask8(), { ...s, rate: 40 }, { cur: "THB", rate: 40, vat: false }), 6113); // ฿5,120 / 33.5 x 40 = 6,113.43, priced in USD
});

/* Meet8 three ways. Expected values worked out by hand (PLAN.md AC1–AC7), not by running this code:
   GCP from the measured S/M/L/XL sizes; through Beryl8 = Google × 1.2; subscription = (4.10 + hours × 0.72) / 0.5. */
const meet8 = (host: number, inputs: Record<string, number> = {}): Item =>
  ({ ...newItem("meet8", "m"), inputs: { hours: 200, asks: 30, conc: 30, host, ...inputs }, setup: false });
const thb = { cur: "THB" as const, rate: 33.5, vat: false };
const shown = (it: Item, st = s) => displayGrid(totals([it], st), thb, st).items[0];
const gcpSells = (lines: { id: string; sell: number }[]) => lines.filter((l) => l.id.startsWith("gcp-")).map((l) => l.sell);
const cloudRunBase = "gcp-cloud-run-app-and-api-";

test("M1 perpetual, own Google Cloud is the default: license $360 × 20, $500 by Beryl8, $399.80 direct, ฿30,145 / month", () => {
  assert.equal(newItem("meet8", "m").inputs.host, 0);
  const it = meet8(0);
  const c = costItem(it, s);
  near(c.listLicense, 7200, "license");
  near(c.ma, 1584, "MA 22%");
  near(c.monthlyBeryl8, 500, "transcription");
  near(c.monthlyDirect, 399.8, "AI 7.2 + GCP 392.6");
  const gcpLines = c.lines.filter((l) => l.id.startsWith("gcp-"));
  assert.equal(gcpLines.length, 9);
  assert.ok(gcpLines.every((l) => l.payer === "direct"));
  const g = shown(it);
  assert.equal(g.monthlyBeryl8 + g.monthlyDirect, 30145); // 16,750 + 241 + 13,154
});

test("M2 GCP for 20 users at 30% = 6 meetings at once → size S: US$392.6, ฿13,154 on screen", () => {
  const c = costItem(meet8(0), s);
  const usd = c.lines.filter((l) => l.id.startsWith("gcp-")).map((l) => l.sell);
  // Cloud Run base 61 + 1 warm × 18, Cloud Run 200 h × 0.148, SQL, Redis, VM, LB, Armor, NAT/build, storage 200 h × 0.04
  [79, 29.6, 85, 95, 20, 20, 16, 40, 8].forEach((x, k) => near(usd[k], x, `row ${k}`));
  const g = displayGrid(totals([meet8(0)], s), thb, s);
  assert.deepEqual(gcpSells(g.items[0].lines), [2647, 992, 2848, 3183, 670, 670, 536, 1340, 268]);
  assert.equal(g.hosting.total.cloud, 13154);
});

test("M3 perpetual, Google Cloud through Beryl8: all GCP and AI billed by Beryl8 at × 1.2, ฿32,822 / month", () => {
  const c = costItem(meet8(1), s);
  near(c.monthlyBeryl8, 979.76, "sell"); // 500 + 8.64 + 471.12
  near(c.monthlyCost, 547.8, "cost"); // 148 + 7.2 + 392.6
  near(c.monthlyDirect, 0, "direct");
  const moved = c.lines.filter((l) => l.id !== "stt");
  assert.equal(moved.length, 10);
  for (const l of moved) {
    assert.equal(l.payer, "beryl8", l.id);
    assert.equal(l.draft, true, l.id);
    near(l.sell, l.cost * 1.2, l.id);
  }
  const g = displayGrid(totals([meet8(1)], s), thb, s);
  const it = g.items[0];
  assert.deepEqual(gcpSells(it.lines), [3176, 1190, 3417, 3819, 804, 804, 643, 1608, 322]);
  assert.equal(it.lines.find((l) => l.id === "ai")!.sell, 289);
  assert.equal(it.lines.find((l) => l.id === "stt")!.sell, 16750);
  assert.equal(it.monthlyBeryl8, 32822);
  assert.deepEqual(g.hosting.total, { cloud: 0, ai: 0, other: 0, total: 0 });
  for (const l of it.lines.filter((x) => x.id !== "stt")) assert.equal(Math.round(((l.sell - l.cost) / l.sell) * 100), 17, `${l.id} margin`);
});

test("M3b committed use cuts Cloud Run base and Cloud SQL, not the hourly Cloud Run row", () => {
  const st = { ...s, cud: true };
  const pick = (host: number) => {
    const it = shown(meet8(host), st);
    const by = (id: string) => it.lines.find((l) => l.id === id)!.sell;
    return [by(cloudRunBase), by("gcp-cloud-sql-database-size-s-"), by("gcp-run-hours")];
  };
  assert.deepEqual(pick(0), [2197, 2136, 992]);
  assert.deepEqual(pick(1), [2636, 2563, 1190]);
});

test("M4 server size follows meetings at once: 30 → M, 300 → XL (capped), 0% → 1 meeting, S", () => {
  const base = (users: number, conc: number) => costItem({ ...meet8(0, { conc }), users }, s).lines.find((l) => l.id === cloudRunBase)!.sell;
  const sql = (users: number, conc: number) => costItem({ ...meet8(0, { conc }), users }, s).lines.find((l) => l.id.startsWith("gcp-cloud-sql"))!;
  near(base(100, 30), 187, "M: 61 + 7 × 18");
  assert.equal(sql(100, 30).id, "gcp-cloud-sql-database-size-m-");
  near(sql(100, 30).sell, 155, "M SQL");
  near(base(1000, 30), 1393, "XL: 61 + 74 × 18");
  near(sql(1000, 30).sell, 655, "XL SQL");
  near(base(20, 0), 61, "one meeting, no warm instance");
  near(sql(20, 0).sell, 85, "S SQL");
});

test("M5 subscription, 10 hours a user: no license or MA, one line ฿15,142 / month, ฿908,520 over 5 years, ฿757 a user", () => {
  const it = meet8(2);
  const c = costItem(it, s);
  near(c.license, 0, "license");
  near(c.ma, 0, "MA");
  assert.deepEqual(c.lines.map((l) => [l.id, l.payer, l.draft]), [["sub", "beryl8", true]]);
  near(c.monthlyBeryl8, 452, "20 × 22.60");
  near(c.monthlyCost, 226, "20 × 11.30");
  const g = displayGrid(totals([it], s), thb, s);
  const row = g.items[0];
  assert.equal(row.monthlyBeryl8, 15142);
  assert.equal(row.monthlyCost, 7571);
  assert.equal(row.year1, 181704);
  assert.equal(row.total, 908520);
  assert.deepEqual(row.perUser, { monthly: 757, avgMonthly: 757 });
  assert.deepEqual(g.hosting.total, { cloud: 0, ai: 0, other: 0, total: 0 });
});

test("M6 subscription packages and extra hours: 5 h ฿10,318, 20 h ฿24,790, 50 extra hours ฿2,412 (cost ฿1,206), 5 users billed as 20", () => {
  assert.equal(shown(meet8(2, { pkg: 2 })).monthlyBeryl8, 10318);
  assert.equal(shown(meet8(2, { pkg: 0 })).monthlyBeryl8, 24790);
  const extra = shown(meet8(2, { extra: 50 })).lines.find((l) => l.id === "extra")!;
  assert.deepEqual([extra.sell, extra.cost], [2412, 1206]);
  assert.equal(shown({ ...meet8(2), users: 5 }).monthlyBeryl8, 15142);
});

test("M7 n-way choices: round then clamp; links land host 1.4 → 1, 1.6 → 2, -3 → 0, 1e9 → 2; old links get 0", () => {
  assert.deepEqual([choiceIndex(-3, 3), choiceIndex(1e9, 3), choiceIndex(0.49), choiceIndex(0.5)], [0, 2, 0, 1]);
  const viaLink = (inputs: object) => {
    const d = decode(btoa(JSON.stringify({ v: 1, i: [["meet8", 20, inputs, 0]], s: {} })));
    const first = costItem(d!.items[0], s).lines.find((l) => l.id !== "stt")!; // what is actually billed, not just the radio
    return [choiceIndex(d!.items[0].inputs.host, 3), first.id === "sub" ? "sub" : first.payer];
  };
  assert.deepEqual([viaLink({}), viaLink({ host: 1.4 }), viaLink({ host: 1.6 }), viaLink({ host: -3 }), viaLink({ host: 1e9 })],
    [[0, "direct"], [1, "beryl8"], [2, "sub"], [0, "direct"], [2, "sub"]]);
  assert.equal(choiceIndex(NaN, 3), 0);
  const back = decode(encode({ v: 1, items: [meet8(2, { pkg: 2, extra: 30 })], s, cur: "THB", vat: false }, { internal: false }));
  assert.deepEqual([back!.items[0].inputs.host, back!.items[0].inputs.pkg, back!.items[0].inputs.extra], [2, 2, 30]);
});

test("M8 Beryl8-billed row text shows sell prices only, never Google's price or the markup", () => {
  const lines = costItem(meet8(1), s).lines;
  assert.equal(lines.find((l) => l.id === cloudRunBase)!.detail!.en, "US$94.8 / month");
  assert.equal(lines.find((l) => l.id === "ai")!.detail!.en, "20 users × 30 questions × US$0.0144");
  for (const l of lines) assert.ok(!/20%|US\$79\b|US\$85\b|0\.148|US\$0\.04\b|0\.012\b/.test(l.detail?.en ?? ""), `${l.id}: ${l.detail?.en}`);
});

test("P1 per user, Meet8 through Beryl8 at ฿33.5: ฿32,822 / 20 = ฿1,641 a month; 5-year ฿2,422,776 / 20 / 60 = ฿2,019", () => {
  const it = shown(meet8(1));
  // license ฿241,200 + 12 × 32,822 = 635,064; years 2–5: MA 53,064 + 393,864 = 446,928
  assert.equal(it.year1, 635064);
  assert.equal(it.total, 635064 + 4 * 446928);
  assert.deepEqual(it.perUser, { monthly: 1641, avgMonthly: 2019 });
});

test("P2 per user uses billed seats (20-user minimum) and is null for Voice8 with no per-user license", () => {
  assert.equal(shown({ ...meet8(1), users: 5 }).perUser!.monthly, 1641);
  const v = { ...newItem("voice8", "v"), inputs: { minutes: 1000, sip: 0 }, setup: false };
  assert.equal(shown(v).perUser, null);
});

test("M9 switching how Meet8 is bought keeps the same monthly usage (review finding F2)", () => {
  const sw = PRICING.meet8.switchTo!;
  // own cloud, 1,000 h for 20 users → subscription 10 h: package 200 h, so 800 extra hours
  assert.deepEqual(sw({ hours: 1000, asks: 30, conc: 30, host: 0, pkg: 1, extra: 0 }, 20, 2), { hours: 1000, asks: 30, conc: 30, host: 2, pkg: 1, extra: 800 });
  // subscription 5 h for 20 users (100 h) + 30 extra → buy once at 130 h
  assert.deepEqual(sw({ hours: 200, asks: 30, conc: 30, host: 2, pkg: 2, extra: 30 }, 20, 0), { hours: 130, asks: 30, conc: 30, host: 0, pkg: 2, extra: 30 });
  // usage below the package: no extra hours, never negative
  assert.equal(sw({ hours: 200, asks: 30, conc: 30, host: 0, pkg: 1, extra: 0 }, 100, 2).extra, 0);
  // between the two buy-once ways the hours stay as they are
  assert.equal(sw({ hours: 640, asks: 30, conc: 30, host: 0, pkg: 1, extra: 0 }, 20, 1).hours, 640);
});

test("M10 Meet8 subscription has no setup fee even when setup is ticked", () => {
  const it = { ...meet8(2), setup: true };
  const c = costItem(it, s);
  near(c.setup, 0, "setup");
  const g = shown(it);
  assert.equal(g.setup, 0);
  assert.equal(g.year1, 181704); // 12 × ฿15,142, no ฿45,000 setup
  // buying once still charges setup when ticked: 3 days × ฿15,000
  assert.equal(shown({ ...meet8(0), setup: true }).setup, 45000);
});
