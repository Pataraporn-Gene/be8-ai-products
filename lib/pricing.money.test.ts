// Money oracles for the calculator. Every expected value is a literal worked out by hand
// from the 2026-11-09 pricing decision, not produced by running the code under test.
// Run: node --test lib/pricing.money.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CUD, DEFAULT_SETTINGS, HOST_MARKUP, MA_RATE, PRICING, badgesOf, billedUsers, choiceIndex, costItem, decode, displayGrid, encode, isPriced, vatOf, newItem, roundMoney, roundPrice, toDisplay, totals, values, type Item } from "./pricing.ts";

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

test("C3 Voice8 1,000 min × $0.0218 AI: $21.8/month billed by Beryl8, no license and no MA", () => {
  const c = costItem({ ...newItem("voice8", "v"), inputs: { calls: 1000, callMin: 1, days: 1 }, setup: false }, s);
  near(c.license, 0, "license");
  near(c.ma, 0, "MA");
  near(c.monthlyBeryl8, 21.8, "billed per month");
  near(c.years[0].beryl8, 261.6, "year 1");
  near(c.years[4].beryl8, 261.6, "year 5");
});

test("C4 Meet8 100 h on your own cloud: transcription at measured cost US$0.53/h = $53, paid to providers, nothing billed by Beryl8", () => {
  const c = costItem({ ...newItem("meet8", "m"), inputs: { hours: 100, asks: 0 }, setup: false }, s);
  const stt = c.lines.find((l) => l.id === "stt")!;
  near(stt.sell, 53, "sell");
  near(stt.cost, 53, "cost");
  assert.equal(stt.payer, "direct");
  near(c.monthlyBeryl8, 0, "Beryl8");
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

test("C8 float: 3 Voice minutes = $0.0654, many small lines still add up", () => {
  const c = costItem({ ...newItem("voice8", "v"), inputs: { calls: 1, callMin: 3, days: 1 }, setup: false }, s);
  near(c.monthlyBeryl8, 0.0654, "3 minutes");
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

test("C17 Voice8 hosting is Google Cloud only: no AI (billed by Beryl8), no phone charges", () => {
  const v = { ...newItem("voice8", "v"), setup: false }; // defaults: 10 concurrent, 1,000 calls × 3 min, 8 h, 30 days
  const g = displayGrid(totals([v], s), { cur: "THB", rate: 33.5, vat: false }, s);
  // cloud: fixed 207.9 + voice min 1 (0.1728 × 730 = 126.144), 131.5, 117.5, 55.3, 50.3, 12 + voice (3 + 1 spare − 1 always on) 3 × 0.1728 × 8.5 h (8 h + 15 min, rounded up) × 30 = 132.192
  // + egress 90,000 min × 0.5 MB = 4.5e10 B / 2^30 = 41.9095 GiB × 0.12 = 5.0291 (was 45 GB × 0.12 = 5.4, GB billed at a per-GiB price), each × 33.5 half up
  assert.deepEqual(g.items[0].lines.filter((l) => l.kind === "cloud").map((l) => l.sell), [6965, 4226, 4405, 3936, 1853, 1685, 402, 4428, 168]);
  assert.deepEqual(g.hosting.total, { cloud: 28068, ai: 0, other: 0, total: 28068 });
});

test("C17b Voice8 matches the cost calculator: AI cost 90,000 min × $0.0218 = ฿65,845 at ฿33.56", () => {
  const c = costItem({ ...newItem("voice8", "v"), setup: false }, s);
  near(c.monthlyCost, 1962, "AI cost");
  near(Math.round(c.monthlyCost * 33.56), 65845, "THB");
  near(c.monthlyBeryl8, 90000 * 0.0218, "billed at the AI cost per minute");
  const g = displayGrid(totals([{ ...newItem("voice8", "v"), setup: false }], s), { cur: "THB", rate: 33.5, vat: false }, s);
  assert.equal(g.month.ai, g.items[0].lines.find((l) => l.id === "min")!.sell); // summary "AI per month" = minutes × input
  assert.equal(g.month.cloud + g.month.ai + g.month.other, g.monthly);
  const more = costItem({ ...newItem("voice8", "v"), inputs: { aiMin: 0.03 }, setup: false }, s);
  near(more.lines.find((l) => l.id === "min")!.sell, 90000 * 0.03, "AI follows the input");
});

test("C17c Voice8 100 concurrent adds a call-runtime/system pair and an Asterisk VM; setup = flows × man-days", () => {
  const c = costItem({ ...newItem("voice8", "v"), inputs: { concurrent: 100, flows: 3, flowDays: 4 } }, s);
  const row = (id: string) => c.lines.find((l) => l.id === id)!.sell;
  near(row("gcp-voice"), 25 * 0.1728 * 8.5 * 30, "voice 25 + 1 spare − 1 always on");
  near(row("gcp-runtime"), 1 * 2 * 0.0864 * 8.5 * 30, "runtime");
  near(row("gcp-asterisk"), 67.3, "asterisk");
  near(c.setup * s.rate, 12 * 15000, "12 man-days");
  assert.equal(costItem({ ...newItem("voice8", "v") }, s).lines.some((l) => l.id === "gcp-asterisk"), false);
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
   GCP from the measured S/M/L/XL sizes; through Beryl8 = Google × 1.2; subscription = (3.74 + hours × 0.72) / 0.5.
   S/M sql and vm re-priced from the Cloud Billing Catalog 2026-11-18 (see M11). */
const meet8 = (host: number, inputs: Record<string, number> = {}): Item =>
  ({ ...newItem("meet8", "m"), inputs: { hours: 200, asks: 30, conc: 30, host, ...inputs }, setup: false });
const thb = { cur: "THB" as const, rate: 33.5, vat: false };
const shown = (it: Item, st = s) => displayGrid(totals([it], st), thb, st).items[0];
const gcpSells = (lines: { id: string; sell: number }[]) => lines.filter((l) => l.id.startsWith("gcp-")).map((l) => l.sell);
const cloudRunBase = "gcp-cloud-run-app-and-api-";

test("M1 perpetual, own Google Cloud is the default: license $360 × 20, nothing monthly by Beryl8, $522.27 direct, ฿17,498 / month", () => {
  assert.equal(newItem("meet8", "m").inputs.host, 0);
  const it = meet8(0);
  const c = costItem(it, s);
  near(c.listLicense, 7200, "license");
  near(c.ma, 1584, "MA 22%");
  near(c.monthlyBeryl8, 0, "Beryl8");
  near(c.monthlyDirect, 522.27, "transcription 106 + AI 28.8 + GCP 387.47");
  const gcpLines = c.lines.filter((l) => l.id.startsWith("gcp-"));
  assert.equal(gcpLines.length, 9);
  assert.ok(gcpLines.every((l) => l.payer === "direct"));
  const g = shown(it);
  assert.equal(g.monthlyBeryl8 + g.monthlyDirect, 17498); // 3,551 + 965 + 12,982
});

test("M2 GCP for 20 users at 30% = 6 meetings at once → size S: US$387.47, ฿12,982 on screen", () => {
  const c = costItem(meet8(0), s);
  const usd = c.lines.filter((l) => l.id.startsWith("gcp-")).map((l) => l.sell);
  // Cloud Run base 61 + 1 warm × 18, Cloud Run 200 h × 0.148, SQL, Redis, VM, LB, Armor, NAT/build, storage 200 h × 0.04
  [79, 29.6, 73.78, 95, 26.09, 20, 16, 40, 8].forEach((x, k) => near(usd[k], x, `row ${k}`));
  const g = displayGrid(totals([meet8(0)], s), thb, s);
  assert.deepEqual(gcpSells(g.items[0].lines), [2647, 992, 2472, 3183, 874, 670, 536, 1340, 268]);
  assert.equal(g.hosting.total.cloud, 12982);
});

test("M3 perpetual, Google Cloud through Beryl8: transcription, GCP and AI billed by Beryl8 at × 1.2, ฿20,996 / month", () => {
  const c = costItem(meet8(1), s);
  near(c.monthlyBeryl8, 626.724, "sell"); // 127.2 + 34.56 + 464.964
  near(c.monthlyCost, 522.27, "cost"); // 106 + 28.8 + 387.47
  near(c.monthlyDirect, 0, "direct");
  const moved = c.lines;
  assert.equal(moved.length, 11);
  for (const l of moved) {
    assert.equal(l.payer, "beryl8", l.id);
    assert.equal(l.draft, true, l.id);
    near(l.sell, l.cost * 1.2, l.id);
  }
  const g = displayGrid(totals([meet8(1)], s), thb, s);
  const it = g.items[0];
  assert.deepEqual(gcpSells(it.lines), [3176, 1190, 2966, 3819, 1049, 804, 643, 1608, 322]);
  assert.equal(it.lines.find((l) => l.id === "ai")!.sell, 1158); // 34.56 × 33.5 = 1,157.76
  assert.equal(it.lines.find((l) => l.id === "stt")!.sell, 4261); // 127.2 × 33.5 = 4,261.2
  assert.equal(it.monthlyBeryl8, 20996);
  assert.deepEqual(g.hosting.total, { cloud: 0, ai: 0, other: 0, total: 0 });
  for (const l of it.lines) assert.equal(Math.round(((l.sell - l.cost) / l.sell) * 100), 17, `${l.id} margin`);
});

test("M3b committed use cuts Cloud Run base and Cloud SQL, not the hourly Cloud Run row", () => {
  const st = { ...s, cud: true };
  const pick = (host: number) => {
    const it = shown(meet8(host), st);
    const by = (id: string) => it.lines.find((l) => l.id === id)!.sell;
    return [by(cloudRunBase), by("gcp-cloud-sql-database-size-s-"), by("gcp-run-hours")];
  };
  assert.deepEqual(pick(0), [2197, 1854, 992]); // SQL 73.78 × 0.75 × 33.5 = 1,853.72
  assert.deepEqual(pick(1), [2636, 2224, 1190]); // × 1.2 = 2,224.47
});

test("M4 server size follows meetings at once: 30 → M, 300 → XL (capped), 0% → 1 meeting, S", () => {
  const base = (users: number, conc: number) => costItem({ ...meet8(0, { conc }), users }, s).lines.find((l) => l.id === cloudRunBase)!.sell;
  const sql = (users: number, conc: number) => costItem({ ...meet8(0, { conc }), users }, s).lines.find((l) => l.id.startsWith("gcp-cloud-sql"))!;
  near(base(100, 30), 187, "M: 61 + 7 × 18");
  assert.equal(sql(100, 30).id, "gcp-cloud-sql-database-size-m-");
  near(sql(100, 30).sell, 149.94, "M SQL");
  near(base(1000, 30), 1393, "XL: 61 + 74 × 18");
  near(sql(1000, 30).sell, 599.77, "XL SQL");
  near(base(20, 0), 61, "one meeting, no warm instance");
  near(sql(20, 0).sell, 73.78, "S SQL");
});

test("M5 subscription, 10 hours a user: no license or MA, one line ฿14,660 / month, ฿879,600 over 5 years, ฿733 a user", () => {
  const it = meet8(2);
  const c = costItem(it, s);
  near(c.license, 0, "license");
  near(c.ma, 0, "MA");
  assert.deepEqual(c.lines.map((l) => [l.id, l.payer, l.draft]), [["sub", "beryl8", true]]);
  near(c.monthlyBeryl8, 437.6, "20 × 21.88");
  near(c.monthlyCost, 218.8, "20 × 10.94");
  const g = displayGrid(totals([it], s), thb, s);
  const row = g.items[0];
  assert.equal(row.monthlyBeryl8, 14660);
  assert.equal(row.monthlyCost, 7330);
  assert.equal(row.year1, 175920);
  assert.equal(row.total, 879600);
  assert.deepEqual(row.perUser, { monthly: 733, avgMonthly: 733 });
  assert.deepEqual(g.hosting.total, { cloud: 0, ai: 0, other: 0, total: 0 });
});

test("M6 subscription packages and extra hours: 5 h ฿9,836, 20 h ฿24,308, 50 extra hours ฿2,412 (cost ฿1,206), 5 users billed as 20", () => {
  assert.equal(shown(meet8(2, { pkg: 2 })).monthlyBeryl8, 9836); // 20 × (3.74 + 3.6) / 0.5 × 33.5 = 9,835.6
  assert.equal(shown(meet8(2, { pkg: 0 })).monthlyBeryl8, 24308); // 20 × (3.74 + 14.4) / 0.5 × 33.5 = 24,307.6
  const extra = shown(meet8(2, { extra: 50 })).lines.find((l) => l.id === "extra")!;
  assert.deepEqual([extra.sell, extra.cost], [2412, 1206]);
  assert.equal(shown({ ...meet8(2), users: 5 }).monthlyBeryl8, 14660);
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
  assert.equal(lines.find((l) => l.id === "gcp-cloud-sql-database-size-s-")!.detail!.en, "US$88.54 / month"); // 73.78 × 1.2 = 88.536
  assert.equal(lines.find((l) => l.id === "ai")!.detail!.en, "20 users × 30 questions × US$0.0576");
  assert.ok(!/0\.048\b/.test(lines.find((l) => l.id === "ai")!.detail!.en), "AI row hides its US$0.048 cost");
  for (const l of lines) assert.ok(!/20%|US\$79\b|US\$73\.78\b|0\.148|US\$0\.04\b/.test(l.detail?.en ?? ""), `${l.id}: ${l.detail?.en}`);
});

test("P1 per user, Meet8 through Beryl8 at ฿33.5: ฿20,996 / 20 = ฿1,050 a month; 5-year ฿1,713,216 / 20 / 60 = ฿1,428", () => {
  const it = shown(meet8(1));
  // license ฿241,200 + 12 × 20,996 = 493,152; years 2–5: MA 53,064 + 251,952 = 305,016
  assert.equal(it.year1, 493152);
  assert.equal(it.total, 493152 + 4 * 305016);
  assert.deepEqual(it.perUser, { monthly: 1050, avgMonthly: 1428 });
});

test("P2 per user uses billed seats (20-user minimum) and is null for Voice8 with no per-user license", () => {
  assert.equal(shown({ ...meet8(1), users: 5 }).perUser!.monthly, 1050);
  const v = { ...newItem("voice8", "v"), setup: false };
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

test("M11 size S and M server rows are Cloud Billing Catalog list prices (asia-southeast1, 730 h, 2026-11-18)", () => {
  const row = (users: number, prefix: string) => costItem({ ...meet8(0), users }, s).lines.find((l) => l.id.startsWith(prefix))!.cost;
  const h = 730;
  // Cloud SQL Zonal vCPU 0.0578/h, RAM 0.0098/GiB-h, SSD 0.238/GiB-mo: S db-custom-1-3840 + 20 GB, M db-custom-2-7680 + 50 GB
  assert.equal(row(20, "gcp-cloud-sql-database-size-s-"), 73.78); // 42.194 + 26.8275 + 4.76 = 73.7815
  assert.equal(row(100, "gcp-cloud-sql-database-size-m-"), 149.94); // 84.388 + 53.655 + 11.9 = 149.943
  near(1 * 0.0578 * h + 3.75 * 0.0098 * h + 20 * 0.238, 73.7815, "S SQL from SKUs");
  // e2-small = 0.5 core × 0.02690931 + 2 GiB × 0.00360594 per hour, + 100 GB pd-balanced × 0.11
  for (const users of [20, 100]) assert.equal(row(users, "gcp-compute-engine-chat-runner-"), 26.09);
  near((0.5 * 0.02690931 + 2 * 0.00360594) * h + 100 * 0.11, 26.0865706, "runner from SKUs");
  // 2 × Redis Basic M1 1 GiB × 0.065/GiB-h = 94.9, kept at 95
  for (const users of [20, 100]) assert.equal(row(users, "gcp-memorystore-2-redis-"), 95);
  // Subscription fixed per user: (M sql 149.94 + redis 95 + vm 26.09 + NAT/build 40 + Cloud Run 97 + chat 7.5) / 111 = 3.7435
  assert.equal(Math.round(((149.94 + 95 + 26.09 + 40 + 97 + 7.5) / 111) * 100) / 100, 3.74);
  near(PRICING.meet8.fromMonthly!, 14.68, "from price, 5 h package: (3.74 + 5 × 0.72) / 0.5");
});

test("M10 Meet8 subscription has no setup fee even when setup is ticked", () => {
  const it = { ...meet8(2), setup: true };
  const c = costItem(it, s);
  near(c.setup, 0, "setup");
  const g = shown(it);
  assert.equal(g.setup, 0);
  assert.equal(g.year1, 175920); // 12 × ฿14,660, no ฿45,000 setup
  // buying once still charges setup when ticked: 3 days × ฿15,000
  assert.equal(shown({ ...meet8(0), setup: true }).setup, 45000);
});

test("C17d Voice8 Jakarta uses Jakarta list prices for VMs, Valkey and other; Cloud Run and LB unchanged", () => {
  const cloud = (region: number) => costItem({ ...newItem("voice8", "v"), inputs: { region }, setup: false }, s).lines
    .filter((l) => l.kind === "cloud" && !l.id.startsWith("gcp-voice") && l.id !== "gcp-egress").map((l) => l.sell);
  assert.deepEqual(cloud(0), [207.9, 0.1728 * 730, 131.5, 117.5, 55.3, 50.3, 12]);
  assert.deepEqual(cloud(1), [207.9, 0.1728 * 730, 143.5, 128.7, 60.3, 50.3, 12.5]);
  const big = costItem({ ...newItem("voice8", "v"), inputs: { region: 1, concurrent: 100 }, setup: false }, s);
  near(big.lines.find((l) => l.id === "gcp-asterisk")!.sell, 73.3, "extra Asterisk in Jakarta");
});

test("C17e Voice8 call type: inbound and both keep 1 voice instance all month; outbound is min 0 and pre-warms every instance", () => {
  const at = (direction: number) => costItem({ ...newItem("voice8", "v"), inputs: { direction, concurrent: 25, hours: 5, days: 30 }, setup: false }, s).lines;
  const sum = (ls: { id: string; sell: number }[]) => ls.filter((l) => l.id.includes("voice")).reduce((a, l) => a + l.sell, 0);
  near(sum(at(0)), 0.1728 * 730 + 7 * 0.1728 * 5.5 * 30, "inbound: min 1 + 7 extra (7 + 1 spare)");
  near(sum(at(2)), sum(at(0)), "both = inbound");
  near(sum(at(1)), 8 * 0.1728 * 5.5 * 30, "outbound: 8 instances × 5.5 h (5 h 25 min rounded up) = spec US$228.1");
  assert.equal(at(1).some((l) => l.id === "gcp-cloud-run-voice-1-instance-always-on-"), false);
});

test("C17f Voice8 warns only when call minutes per day exceed concurrent × hours", () => {
  const w = (inputs: Record<string, number>) => PRICING.voice8.warning!(values({ ...newItem("voice8", "v"), inputs: { ...newItem("voice8", "v").inputs, ...inputs } }));
  assert.equal(w({ concurrent: 25, calls: 1500, callMin: 5, hours: 5 }), null); // 7,500 = 7,500 exactly
  assert.match(w({ concurrent: 25, calls: 1501, callMin: 5, hours: 5 })!.th, /เกิน/);
});

test("M12 size L and XL Cloud SQL from the same SKUs; L/XL stay draft; LB/Armor kept for perpetual with a bilingual note", () => {
  const lines = (users: number, host = 0) => costItem({ ...meet8(0, { host }), users }, s).lines;
  const h = 730;
  // L db-custom-4-15360 + 100 GB SSD, XL db-custom-8-30720 + 200 GB SSD (storage GB = maxRooms, as S 20 / M 50)
  const l = lines(300).find((x) => x.id.startsWith("gcp-cloud-sql"))!; // 300 × 30% = 90 meetings → L
  assert.equal(l.id, "gcp-cloud-sql-database-size-l-");
  assert.equal(l.cost, 299.89); // 168.776 + 107.31 + 23.8 = 299.886
  near(4 * 0.0578 * h + 15 * 0.0098 * h + 100 * 0.238, 299.886, "L SQL from SKUs");
  const xl = lines(600).find((x) => x.id.startsWith("gcp-cloud-sql"))!; // 180 meetings → XL
  assert.equal(xl.id, "gcp-cloud-sql-database-size-xl-");
  assert.equal(xl.cost, 599.77); // 337.552 + 214.62 + 47.6 = 599.772
  near(8 * 0.0578 * h + 30 * 0.0098 * h + 200 * 0.238, 599.772, "XL SQL from SKUs");
  // L/XL fixed rows are draft even on the customer's own cloud; S is not
  for (const users of [300, 600]) for (const x of lines(users).filter((x) => x.id.startsWith("gcp-") && x.id !== "gcp-run-hours" && x.id !== "gcp-storage-hours")) assert.equal(x.draft, true, `${users} ${x.id}`);
  assert.equal(lines(20).find((x) => x.id.startsWith("gcp-cloud-sql"))!.draft, false);
  // 300 users, 3,000 h: own cloud ฿121,338 → ฿120,664 (SQL 320 → 299.89, −20.11 × 33.5); through Beryl8 ฿145,604 → ฿144,796
  const total = (host: number) => { const g = shown({ ...meet8(host, { hours: 3000 }), users: 300 }); return g.monthlyBeryl8 + g.monthlyDirect; };
  assert.equal(total(0), 120664);
  assert.equal(total(1), 144796);
  // LB 20 + Armor 16 stay on both buy-once ways; the subscription has none
  for (const host of [0, 1]) {
    const by = (id: string) => lines(20, host).find((x) => x.id === id)!.cost;
    assert.equal(by("gcp-load-balancer"), 20);
    assert.equal(by("gcp-cloud-armor"), 16);
  }
  assert.ok(lines(20, 2).every((x) => !x.id.startsWith("gcp-")));
  const note = PRICING.meet8.notes.find((x) => x.en.includes("Load Balancer"))!;
  assert.match(note.en, /recommended for enterprise production \(WAF, custom domain\)/);
  assert.match(note.en, /Meet8's own production runs without them/);
  assert.match(note.th, /Load Balancer และ Cloud Armor/);
  assert.match(note.th, /production ของ Meet8 เองไม่ได้ใช้/);
});

// O1–O3, O5: rows re-priced 2026-11-21 from the Cloud Billing Catalog (asia-southeast1/2, on-demand, 730 h) for specs read
// from each product's prod with gcloud; O4 guards the published Voice8 per-minute price (conversational-ai docs/cost.md:
// ฿0.731 ÷ 33.56 ≈ US$0.0218). Monthly totals also include rows that keep their earlier draft values (e.g. Data8 Logging and other).
// Expected values are worked out by hand from the SKU prices in the comments.
const dbRow = (pid: string, id: string) => {
  const l = costItem({ ...newItem(pid, "o"), setup: false }, s).lines.find((x) => x.id === id);
  assert.ok(l, `${pid}: expected a row ${id}`);
  return l;
};
const onScreen = (pid: string, inputs: Record<string, number> = {}) =>
  displayGrid(totals([{ ...newItem(pid, "o"), inputs: { ...newItem(pid, "o").inputs, ...inputs }, setup: false }], s), { cur: "THB", rate: 33.5, vat: false }, s);
const monthRow = (pid: string, id: string, usd: number) => {
  const l = dbRow(pid, id);
  assert.equal(l.cost, usd, `${pid} ${id} cost`);
  assert.equal(l.sell, usd, `${pid} ${id} sell (paid direct)`);
  assert.equal(l.payer, "direct");
  assert.equal(l.draft, true);
  assert.deepEqual(l.detail, { en: `US$${usd} / month`, th: `US$${usd} ต่อเดือน` });
};

test("O1 Pulse8 Cloud SQL 38.15 and Memorystore 47.45 at list prices (prod db-g1-small + 10 GB SSD, Redis Basic 1 GB)", () => {
  near(0.049 * 730 + 10 * 0.238, 38.15, "SQL: g1-small 0.049/h × 730 = 35.77 + 10 GiB × 0.238/GiB-mo = 2.38 (was 110)");
  near(1 * 0.065 * 730, 47.45, "Redis Basic M1 1 GiB × 0.065/h × 730 (was 40)");
  monthRow("pulse8", "gcp-cloud-sql-database-", 38.15);
  monthRow("pulse8", "gcp-memorystore-queues-", 47.45);
  // db-g1-small is shared-core: no Cloud SQL committed-use discount, so the row stays 38.15 with CUD on
  assert.equal(dbRow("pulse8", "gcp-cloud-sql-database-").cud, undefined);
  near(costItem({ ...newItem("pulse8", "p"), setup: false }, { ...s, cud: true }).lines.find((l) => l.id === "gcp-cloud-sql-database-")!.sell, 38.15, "SQL with CUD on");
  // defaults 50,000 contacts, 100,000 emails, 10,000 SMS credits, 20,000 LINE, direct per month:
  // email 10 + SMS 10,000 × ฿0.32 = ฿3,200 ÷ 33.5 (95.5223…, see S1) + LINE ฿1,780 ÷ 33.5 (53.1343…, the Pro plan, see L1)
  // + Cloud Run 120 + SQL 38.15 + Redis 47.45 + storage 30 + contacts 100 = 345.60 + 4,980 ÷ 33.5 = 494.2567…
  // (was 420.60 + 1,780 ÷ 33.5 with SMS 10,000 × US$0.0075 = 75)
  near(costItem({ ...newItem("pulse8", "p"), setup: false }, s).monthlyDirect, 345.6 + (3200 + 1780) / 33.5, "direct per month");
  // ฿33.5 each row half up: 335 + 3,200 + 1,780 + 4,020 + 1,278 (1,278.025) + 1,590 (1,589.575) + 1,005 + 3,350 = ฿16,558
  // (was ฿15,871 with SMS ฿2,513)
  const g = onScreen("pulse8");
  assert.deepEqual(g.items[0].lines.map((l) => l.sell), [335, 3200, 1780, 4020, 1278, 1590, 1005, 3350]);
  assert.equal(g.monthly, 16558);
});

test("O2 Data8 Cloud Run 63.07 and Cloud SQL 38.15 at list prices (prod 1 vCPU / 1 GiB always on, db-g1-small + 10 GB SSD)", () => {
  near(730 * 3600 * (0.0000216 + 0.0000024), 63.072, "Cloud Run instance-based 2,628,000 s × (CPU + 1 GiB) = 56.7648 + 6.3072 (was 60)");
  monthRow("data8", "gcp-cloud-run-app-and-pipelines-", 63.07);
  // Cloud SQL 38.15 is now two rows (Q4): server 35.77 + 10 GiB SSD 2.38
  near(dbRow("data8", "gcp-cloud-sql-database-server-").cost + dbRow("data8", "gcp-sql-storage").cost, 38.15, "SQL server + storage");
  assert.equal(dbRow("data8", "gcp-cloud-sql-database-server-").cud, undefined); // shared-core db-g1-small: no CUD
  const cudOn = costItem({ ...newItem("data8", "d"), setup: false }, { ...s, cud: true }).lines;
  near(cudOn.find((l) => l.id === "gcp-cloud-sql-database-server-")!.sell, 35.77, "SQL with CUD on");
  // defaults: 63.07 + 35.77 + 2.38 + logging 50 = 151.22 (was 246.22 with BigQuery 80 + 15, removed in Q4)
  near(costItem({ ...newItem("data8", "d"), setup: false }, s).monthlyDirect, 151.22, "direct per month");
});

test("O3 Voice8 egress per GiB follows the region: Singapore US$0.12, Jakarta US$0.19", () => {
  const egress = (region: number) => costItem({ ...newItem("voice8", "v"), inputs: { region }, setup: false }, s).lines.find((l) => l.id === "gcp-egress")!;
  // defaults 1,000 calls × 3 min × 30 days = 90,000 min × 0.5 MB = 4.5e10 bytes / 2^30 = 41.909515857696533 GiB
  const gib = 41.909515857696533;
  const sg = egress(0), jkt = egress(1);
  near(sg.sell, gib * 0.12, "Singapore 5.0291 (was 5.4: 45 GB at a per-GiB price)");
  near(sg.cost, 5.029141902923584, "Singapore cost");
  near(jkt.sell, gib * 0.19, "Jakarta 7.9628 (was 5.4)");
  near(jkt.cost, 7.962808012962341, "Jakarta cost");
  assert.deepEqual(sg.detail, { en: "90,000 min × 0.5 MB ≈ 41.91 GiB × US$0.12/GiB", th: "90,000 นาที × 0.5 MB ≈ 41.91 GiB × US$0.12/GiB" });
  assert.deepEqual(jkt.detail, { en: "90,000 min × 0.5 MB ≈ 41.91 GiB × US$0.19/GiB", th: "90,000 นาที × 0.5 MB ≈ 41.91 GiB × US$0.19/GiB" });
  // on screen at ฿33.5: Jakarta 7.9628 × 33.5 = 266.754 → ฿267; Singapore 5.0291 × 33.5 = 168.476 → ฿168
  assert.equal(onScreen("voice8", { region: 1 }).items[0].lines.find((l) => l.id === "gcp-egress")!.sell, 267);
  assert.equal(onScreen("voice8", { region: 0 }).items[0].lines.find((l) => l.id === "gcp-egress")!.sell, 168);
});

test("O4 Voice8 per-minute price at defaults is unchanged: US$0.0218 a minute, 90,000 min = US$1,962 billed by Beryl8", () => {
  assert.equal(PRICING.voice8.perMinute, 0.0218);
  assert.equal(PRICING.voice8.inputs.find((i) => i.id === "aiMin")!.def, 0.0218);
  for (const region of [0, 1]) {
    const m = costItem({ ...newItem("voice8", "v"), inputs: { region }, setup: false }, s).lines.find((l) => l.id === "min")!;
    near(m.sell, 1962, "sell 90,000 × 0.0218");
    near(m.cost, 1962, "cost");
    assert.equal(m.payer, "beryl8");
  }
});

test("O5 Space8 Cloud SQL 73.78 at list prices (prod db-custom-1-3840 + 20 GB SSD)", () => {
  near(1 * 0.0578 * 730 + 3.75 * 0.0098 * 730 + 20 * 0.238, 73.7815, "42.194 + 26.8275 + 4.76 (was 50)");
  monthRow("space8", "gcp-cloud-sql-database-", 73.78);
  // the Space8 monthly total follows the VM and GKE rows of Q5
});

/* ---- 2026-11-21 cost follow-up (audit questions 1, 4, 5, 9). Expected values worked out by hand from the sources in lib/pricing.ts. ---- */

test("Q1 Voice8 extra Asterisk VM every 60 concurrent calls (load test 2026-11-10); the call-runtime/system pair stays at 80", () => {
  // defaults: 8 h + 15 min rounded up = 8.5 h × 30 days = 255 billed hours; Singapore Asterisk VM US$67.3 (e2-standard-2 + 30 GB + IP)
  const rows = (concurrent: number) => costItem({ ...newItem("voice8", "v"), inputs: { concurrent }, setup: false }, s).lines;
  const row = (concurrent: number, id: string) => rows(concurrent).find((l) => l.id === id);
  const asterisk = (concurrent: number, vms: number) => {
    const l = row(concurrent, "gcp-asterisk");
    assert.ok(l, `${concurrent} calls: expected ${vms} extra Asterisk VM row`);
    near(l.cost, vms * 67.3, `${concurrent} calls: ${vms} extra Asterisk VM cost`);
    near(l.sell, vms * 67.3, `${concurrent} calls: sell = cost (paid direct)`);
    assert.equal(l.payer, "direct");
    assert.equal(l.draft, true);
    assert.deepEqual(l.detail, { en: `${vms} × US$67.3 · 60 calls per VM`, th: `${vms} × US$67.3 · 60 สายต่อ VM` });
  };
  // 60 calls: ceil(60/60) − 1 = 0 extra VMs, ceil(60/80) − 1 = 0 extra runtime pairs
  assert.equal(row(60, "gcp-asterisk"), undefined);
  assert.equal(row(60, "gcp-runtime"), undefined);
  // 61 calls: ceil(61/60) − 1 = 1 extra VM (was 0 at 80 per VM); runtime ceil(61/80) − 1 = 0
  asterisk(61, 1);
  assert.equal(row(61, "gcp-runtime"), undefined);
  // 80 calls: VM ceil(80/60) − 1 = 1; runtime ceil(80/80) − 1 = 0
  asterisk(80, 1);
  assert.equal(row(80, "gcp-runtime"), undefined);
  // 81 calls: VM ceil(81/60) − 1 = 1; runtime ceil(81/80) − 1 = 1 pair = 1 × 2 × US$0.0864 × 255 h = US$44.064
  asterisk(81, 1);
  const rt = row(81, "gcp-runtime")!;
  near(rt.cost, 44.064, "81 calls: runtime cost");
  near(rt.sell, 44.064, "81 calls: runtime sell");
  assert.deepEqual(rt.detail, { en: "1 × 2 × US$0.0864/h × 255 h", th: "1 × 2 × US$0.0864/ชม. × 255 ชม." });
  // 121 calls: VM ceil(121/60) − 1 = 2 = US$134.6 (80 per VM gave 1); runtime ceil(121/80) − 1 = 1, still US$44.064
  asterisk(121, 2);
  near(row(121, "gcp-runtime")!.cost, 44.064, "121 calls: runtime");
  // the published per-minute price does not move with the VM count
  near(rows(121).find((l) => l.id === "min")!.sell, 1962, "AI minutes 90,000 × 0.0218");
});

test("Q4 Data8: no BigQuery rows; Cloud SQL server 35.77 + SSD storage GiB × 0.238 (an editable assumption, default prod 10 GiB)", () => {
  const item = (inputs: Record<string, number> = {}): Item => ({ ...newItem("data8", "d"), inputs: { ...newItem("data8", "d").inputs, ...inputs }, setup: false });
  const lines = costItem(item(), s).lines;
  assert.deepEqual(lines.map((l) => l.id), ["gcp-cloud-run-app-and-pipelines-", "gcp-cloud-sql-database-server-", "gcp-sql-storage", "gcp-logging-and-other"]);
  assert.equal(lines.some((l) => /bq|bigquery/i.test(l.id + l.label.en)), false);
  assert.deepEqual(PRICING.data8.inputs.map((i) => [i.id, i.def]), [["sqlGiB", 10]]);
  // server: db-g1-small 0.049/h × 730 = 35.77; storage: 10 GiB × 0.238/GiB-month = 2.38; together the earlier 38.15
  monthRow("data8", "gcp-cloud-sql-database-server-", 35.77);
  const st = lines.find((l) => l.id === "gcp-sql-storage")!;
  near(st.cost, 2.38, "10 GiB storage cost");
  near(st.sell, 2.38, "10 GiB storage sell (paid direct)");
  assert.equal(st.payer, "direct");
  assert.equal(st.draft, true);
  assert.equal(st.cud, undefined); // storage gets no committed-use discount
  assert.deepEqual(st.detail, {
    en: "10 GiB × US$0.238 per GiB-month · growth per profile not measured",
    th: "10 GiB × US$0.238 ต่อ GiB ต่อเดือน · ยังไม่ได้วัดการโตต่อโปรไฟล์",
  });
  near(st.cost + lines.find((l) => l.id === "gcp-cloud-sql-database-server-")!.cost, 38.15, "server + storage = 38.15");
  // ฿33.5 half up: Cloud Run 2,113 (2,112.845) + server 1,198 (1,198.295) + storage 80 (79.73) + logging 1,675 = ฿5,066 (was ฿8,249)
  let g = onScreen("data8");
  assert.deepEqual(g.items[0].lines.map((l) => l.sell), [2113, 1198, 80, 1675]);
  assert.equal(g.monthly, 5066);
  // 250 GiB: 250 × 0.238 = 59.5 → ฿1,993 (1,993.25); total 63.07 + 35.77 + 59.5 + 50 = 208.34 → ฿6,979
  const big = costItem(item({ sqlGiB: 250 }), s);
  near(big.lines.find((l) => l.id === "gcp-sql-storage")!.sell, 59.5, "250 GiB");
  near(big.monthlyDirect, 208.34, "250 GiB direct per month");
  assert.equal(big.lines.find((l) => l.id === "gcp-sql-storage")!.detail!.en, "250 GiB × US$0.238 per GiB-month · growth per profile not measured");
  g = onScreen("data8", { sqlGiB: 250 });
  assert.deepEqual(g.items[0].lines.map((l) => l.sell), [2113, 1198, 1993, 1675]);
  assert.equal(g.monthly, 6979);
  // an old share link with profiles / events: those inputs are dropped, storage starts at 10 GiB
  const old = decode(btoa(JSON.stringify({ v: 1, i: [["data8", 20, { profiles: 5000000, events: 90000000 }, 0]] })))!;
  assert.deepEqual(old.items[0].inputs, { sqlGiB: 10 });
  near(costItem(old.items[0], s).monthlyDirect, 151.22, "old link total");
});

test("Q5 Space8 as prod runs it: VM 64.88 + Cloud SQL 73.78 + GKE Autopilot 122.32 + NAT/storage 3, no per-user media charge", () => {
  // VM: 2 × 0.02690931 × 730 + 8 × 0.00360594 × 730 + 20 × 0.044 + 0.005 × 730 = 39.2876 + 21.0587 + 0.88 + 3.65 = 64.8763 → 64.88
  near(2 * 0.02690931 * 730 + 8 * 0.00360594 * 730 + 20 * 0.044 + 0.005 * 730, 64.8762822, "VM formula");
  // GKE pods: (1,050 mCPU × 0.0000549 + 1.5625 GiB × 0.0060729 + 6.25 GiB × 0.0000676) × 730 = 49.3162 → 49.32; + cluster fee 0.10 × 730 = 73
  near((1050 * 0.0000549 + 1.5625 * 0.0060729 + 6.25 * 0.0000676) * 730, 49.3161765625, "GKE pod formula");
  const lines = costItem({ ...newItem("space8", "o"), setup: false }, s).lines;
  assert.deepEqual(lines.map((l) => l.id), ["gcp-compute-engine-vm-app-realtime-and-livekit-", "gcp-cloud-sql-database-", "gcp-gke-agents", "gcp-cloud-nat-storage-and-other"]);
  monthRow("space8", "gcp-compute-engine-vm-app-realtime-and-livekit-", 64.88);
  monthRow("space8", "gcp-cloud-nat-storage-and-other", 3);
  const gke = lines.find((l) => l.id === "gcp-gke-agents")!;
  assert.equal(gke.cost, 122.32);
  assert.equal(gke.sell, 122.32);
  assert.equal(gke.payer, "direct");
  assert.equal(gke.draft, true);
  assert.deepEqual(gke.label, { en: "Google Cloud · GKE Autopilot (agent runtime)", th: "Google Cloud · GKE Autopilot (ระบบรัน agent)" });
  assert.deepEqual(gke.detail, { en: "cluster fee US$73 + always-on runner and egress pods US$49.32 / month", th: "ค่า cluster US$73 + pod runner และ egress ที่เปิดตลอด US$49.32 ต่อเดือน" });
  assert.equal(lines.find((l) => l.id === "gcp-compute-engine-vm-app-realtime-and-livekit-")!.label.th, "Google Cloud · Compute Engine (VM: แอป, realtime และ LiveKit)");
  assert.equal(lines.some((l) => l.id === "gcp-media" || l.label.en.includes("Cloud Run")), false);
  assert.deepEqual(PRICING.space8.inputs, []);
  // 64.88 + 73.78 + 122.32 + 3 = 263.98 a month (was 185.78: Cloud Run 60 + SQL 73.78 + other 40 + media 20 × 40% × 1.50 = 12)
  near(costItem({ ...newItem("space8", "o"), setup: false }, s).monthlyDirect, 263.98, "direct per month");
  // ฿33.5 half up: 2,173 (2,173.48) + 2,472 (2,471.63) + 4,098 (4,097.72) + 101 (100.5) = ฿8,844 (was ฿6,224)
  const g = onScreen("space8");
  assert.deepEqual(g.items[0].lines.map((l) => l.sell), [2173, 2472, 4098, 101]);
  assert.equal(g.monthly, 8844);
  // more users or an old link's "online" share changes no cloud row: 100 users with online 100% → same ฿8,844
  const many = displayGrid(totals([{ ...newItem("space8", "o"), users: 100, inputs: { online: 100 }, setup: false }], s), { cur: "THB", rate: 33.5, vat: false }, s);
  assert.deepEqual(many.items[0].lines.map((l) => l.sell), [2173, 2472, 4098, 101]);
  assert.equal(decode(btoa(JSON.stringify({ v: 1, i: [["space8", 50, { online: 80 }, 0]] })))!.items[0].inputs.online, undefined);
  // CUD on: only Cloud SQL −25% on the whole row, as every Cloud SQL row does today (storage is not CUD-eligible; not changed here)
  // = 55.335 → ฿1,854 (1,853.72); VM, GKE and NAT rows carry none
  const cud = displayGrid(totals([{ ...newItem("space8", "o"), setup: false }], { ...s, cud: true }), { cur: "THB", rate: 33.5, vat: false }, { ...s, cud: true });
  assert.deepEqual(cud.items[0].lines.map((l) => l.sell), [2173, 1854, 4098, 101]);
  assert.equal(cud.monthly, 8226);
});

test("Q9 Cloud Run CUD 28% only on rows that are all instance-based Cloud Run (Data8, Voice8 voice + extra runtime); mixed rows keep 17%", () => {
  const on = { ...s, cud: true };
  // Data8 Cloud Run (1 instance, CPU always allocated): 63.07 × (1 − 0.28) = 45.4104; SQL server and storage carry no CUD
  const d8 = costItem({ ...newItem("data8", "d"), setup: false }, on).lines;
  const run = d8.find((l) => l.id === "gcp-cloud-run-app-and-pipelines-")!;
  assert.equal(run.cud, 0.28);
  near(run.sell, 45.4104, "Data8 Cloud Run with CUD");
  near(run.cost, 45.4104, "Data8 Cloud Run cost = sell (paid direct)");
  assert.deepEqual(run.detail, { en: "US$63.07 / month − 28% committed use", th: "US$63.07 ต่อเดือน − ส่วนลดผูกสัญญา 28%" });
  // ฿33.5: CUD off 2,113 + 1,198 + 80 + 1,675 = ฿5,066; on 1,521 (1,521.25) + 1,198 + 80 + 1,675 = ฿4,474 (17% gave 1,754 → ฿4,707)
  assert.equal(onScreen("data8").monthly, 5066);
  const d8on = displayGrid(totals([{ ...newItem("data8", "d"), setup: false }], on), thb, on);
  assert.deepEqual(d8on.items[0].lines.map((l) => l.sell), [1521, 1198, 80, 1675]);
  assert.equal(d8on.monthly, 4474);

  // Voice8 defaults (10 concurrent): the 207.9 row mixes instance-based and request-based services → 17%;
  // voice min 1 (126.144) and the extra voice row (132.192) are instance-based only → 28%
  const v8 = { ...newItem("voice8", "v"), setup: false };
  const cud = (id: string) => costItem(v8, on).lines.find((l) => l.id === id)!;
  assert.equal(cud("gcp-cloud-run-call-runtime-business-system-engine-studio-").cud, 0.17);
  assert.equal(cud("gcp-cloud-run-voice-1-instance-always-on-").cud, 0.28);
  assert.equal(cud("gcp-voice").cud, 0.28);
  near(cud("gcp-cloud-run-call-runtime-business-system-engine-studio-").sell, 207.9 * 0.83, "fixed 207.9 × 0.83 = 172.557");
  near(cud("gcp-cloud-run-voice-1-instance-always-on-").sell, 126.144 * 0.72, "voice min 1 × 0.72 = 90.82368");
  near(cud("gcp-voice").sell, 132.192 * 0.72, "extra voice × 0.72 = 95.17824");
  assert.equal(cud("gcp-voice").detail!.th.endsWith(" − ส่วนลดผูกสัญญา 28%"), true);
  // ฿33.5 cloud rows, CUD on: 5,781 (5,780.66) + 3,043 (3,042.59) + 4,405 + 3,936 + 1,853 + 1,685 + 402 + 3,188 (3,188.47) + 168 = ฿24,461
  // (17% on the voice rows gave 3,507 and 3,676 → ฿25,413); CUD off stays ฿28,068 (C17)
  const g = displayGrid(totals([v8], on), thb, on);
  assert.deepEqual(g.items[0].lines.filter((l) => l.kind === "cloud").map((l) => l.sell), [5781, 3043, 4405, 3936, 1853, 1685, 402, 3188, 168]);
  assert.equal(g.hosting.total.cloud, 24461);
  // 81 concurrent: extra runtime pair 44.064 × 0.72 = 31.72608; the extra Asterisk VM is Compute Engine, no CUD
  const big = costItem({ ...newItem("voice8", "v"), inputs: { concurrent: 81 }, setup: false }, on).lines;
  assert.equal(big.find((l) => l.id === "gcp-runtime")!.cud, 0.28);
  near(big.find((l) => l.id === "gcp-runtime")!.sell, 31.72608, "runtime with CUD");
  near(big.find((l) => l.id === "gcp-asterisk")!.sell, 67.3, "Asterisk VM without CUD");

  // mixed or untouched rows stay at 17%: Pulse8 (request-based web + worker pool), Agent8, Connect8, Collab8, Ask8
  for (const [pid, id] of [["pulse8", "gcp-cloud-run-app-and-sending-"], ["agent8", "gcp-cloud-run-gateway-and-agents-"], ["connect8", "gcp-cloud-run-workflow-engine-"],
    ["collab8", "gcp-cloud-run-chat-and-api-"], ["ask8", "gcp-cloud-run-widget-and-api-"]] as const) {
    assert.equal(costItem({ ...newItem(pid, "x"), setup: false }, on).lines.find((l) => l.id === id)?.cud, 0.17, `${pid} ${id}`);
  }
});

test("guard: Meet8/Insight8 totals, license, MA, markup, setup days, package prices and the Voice8 AI rate match origin/main (2026-11-21)", () => {
  // [monthly, year 1, 5-year TCO] in THB at ฿33.5, CUD off then on, taken from origin/main before this change
  const was: Record<string, [Item, number[], number[]]> = {
    "meet8 own cloud": [{ ...newItem("meet8", "m"), inputs: { host: 0 } }, [17498, 496176, 1548336], [16430, 483360, 1484256]],
    "meet8 via Beryl8": [{ ...newItem("meet8", "m"), inputs: { host: 1 } }, [20996, 538152, 1758216], [19714, 522768, 1681296]],
    "meet8 subscription": [{ ...newItem("meet8", "m"), inputs: { host: 2 } }, [14660, 175920, 879600], [14660, 175920, 879600]],
    "insight8 lean": [{ ...newItem("insight8", "i") }, [25851, 706812, 2230668], [24263, 687756, 2135388]],
    "insight8 standard": [{ ...newItem("insight8", "i"), size: "standard" }, [33551, 799212, 2692668], [30462, 762144, 2507328]],
  };
  for (const [k, [it, off, on]] of Object.entries(was)) {
    for (const [st, exp] of [[s, off], [{ ...s, cud: true }, on]] as const) {
      const g = displayGrid(totals([{ ...it, inputs: { ...newItem(it.pid, "x").inputs, ...it.inputs } }], st), thb, st);
      assert.deepEqual([g.monthly, g.year1, g.tco], exp, `${k} cud ${st.cud}`);
    }
  }
  assert.deepEqual(Object.fromEntries(Object.entries(PRICING).map(([k, p]) => [k, p.license])),
    { meet8: 360, agent8: 480, voice8: null, insight8: 480, connect8: 240, space8: 144, pulse8: 360, collab8: 216, ask8: 120, data8: 480 });
  assert.deepEqual(Object.fromEntries(Object.entries(PRICING).map(([k, p]) => [k, p.setupDays])),
    { meet8: 3, agent8: 10, voice8: 10, insight8: 5, connect8: 5, space8: 2, pulse8: 8, collab8: 5, ask8: 3, data8: 8 });
  assert.equal(MA_RATE, 0.22);
  assert.equal(HOST_MARKUP, 0.2);
  assert.equal(PRICING.meet8.fromMonthly, 14.68);
  assert.equal(PRICING.voice8.perMinute, 0.0218);
  assert.equal(PRICING.voice8.inputs.find((i) => i.id === "aiMin")!.def, 0.0218);
  // Meet8 subscription packages 20 / 10 / 5 h per user: US$725.60, 437.60, 293.60 a month at defaults
  [725.6, 437.6, 293.6].forEach((usd, pkg) => near(costItem({ ...newItem("meet8", "m"), inputs: { ...newItem("meet8", "m").inputs, host: 2, pkg } }, s).lines[0].sell, usd, `Meet8 package ${pkg}`));
  near(aiLine({ ...newItem("ask8", "a"), setup: false }).sell, 152.83582089552237, "Ask 8 credit pack at defaults");
});

test("Q4 Data8 storage stays inside Cloud SQL limits for db-g1-small: 10 GiB minimum, 3,054 GiB maximum", () => {
  const st = (sqlGiB: number) => {
    const l = costItem({ ...newItem("data8", "d"), inputs: { sqlGiB }, setup: false }, s).lines.find((x) => x.id === "gcp-sql-storage");
    assert.ok(l, `${sqlGiB} GiB: expected a Cloud SQL storage row`);
    return l;
  };
  // 0 GiB is billed as the 10 GiB minimum: 10 × 0.238 = 2.38
  near(st(0).sell, 2.38, "0 GiB → 10 GiB");
  assert.equal(st(0).detail!.en, "10 GiB × US$0.238 per GiB-month · growth per profile not measured");
  // 5,000 GiB is held at the shared-core cap 3,054: 3,054 × 0.238 = 726.852
  near(st(5000).sell, 726.852, "5,000 GiB → 3,054 GiB");
  assert.equal(st(5000).detail!.th, "3,054 GiB × US$0.238 ต่อ GiB ต่อเดือน · ยังไม่ได้วัดการโตต่อโปรไฟล์");
  assert.equal(PRICING.data8.inputs[0].max, 3054);
  // disks are whole GB: 10.5 GiB is billed as 11 = 11 × 0.238 = 2.618
  near(st(10.5).sell, 2.618, "10.5 GiB → 11 GiB");
  assert.equal(st(10.5).detail!.en.startsWith("11 GiB × "), true);
  // a share link asking for more is clamped the same way
  assert.equal(decode(btoa(JSON.stringify({ v: 1, i: [["data8", 20, { sqlGiB: 99999 }, 0]] })))!.items[0].inputs.sqlGiB, 3054);
});

test("Q5 Space8 note names the usage costs it leaves out, in EN and TH", () => {
  assert.deepEqual(PRICING.space8.notes, [{
    en: "Voice and video run on the VM. Not included, as they grow with use: internet egress for calls (US$0.12/GiB from Singapore to Asia-Pacific for the first TiB), agent session pods (about US$0.011 per 10-minute session; Collab8's agent workspaces row prices them per session, so with both products they are counted once) and AI model tokens.",
    th: "เสียงและวิดีโอรันบน VM ไม่รวมค่าที่เพิ่มตามการใช้งาน: egress ออก internet ของการโทร (US$0.12/GiB จาก Singapore ไปเอเชียแปซิฟิกใน 1 TiB แรก), pod ของ session agent (ราว US$0.011 ต่อ session 10 นาที แถวพื้นที่ทำงานของ Agent ใน Collab8 คิดส่วนนี้ต่อ session จึงนับครั้งเดียวเมื่อเลือกทั้งสอง product) และค่า token ของโมเดล AI",
  }]);
});

/* ---- 2026-11-21 Pulse8 LINE OA: Pro plan ฿1,780 with 35,000 messages, then ฿0.06 per message (sources in lib/pricing.ts at
   LINE_OA: lineforbusiness.com broadcast-message pricing table, read 2026-11-21). Expected values worked out by hand. ---- */

const pulse8At = (line: number, rate: number) => {
  const st = { ...s, rate };
  const item = { ...newItem("pulse8", "p"), inputs: { ...newItem("pulse8", "p").inputs, line }, setup: false };
  const row = costItem(item, st).lines.find((l) => l.id === "line");
  assert.ok(row, `${line} messages: expected a LINE row`);
  const screen = (cur: "THB" | "USD") => displayGrid(totals([item], st), { cur, rate, vat: false }, st).items[0];
  return { row, thb: screen("THB"), usd: screen("USD") };
};

test("L1 Pulse8 LINE OA Pro plan in baht at any rate: 20,000 and 35,000 messages ฿1,780, 36,000 ฿1,840, at ฿33.5 and ฿40", () => {
  // [messages, rate, THB = 1,780 + max(0, messages − 35,000) × 0.06, internal US$ = THB ÷ rate, US$ row on screen (half up),
  //  Pulse8 THB a month at defaults otherwise, extra messages in the text]
  const cases: [number, number, number, number, number, number, string][] = [
    [20000, 33.5, 1780, 53.13432836, 53, 16558, "0"], // 1,780 ÷ 33.5 = 53.1343…; month ฿16,558 (O1)
    [35000, 33.5, 1780, 53.13432836, 53, 16558, "0"], // exactly the quota: no extra
    [36000, 33.5, 1840, 54.92537313, 55, 16618, "1,000"], // 1,780 + 1,000 × 0.06 = 1,840; ÷ 33.5 = 54.925…; month 16,558 − 1,780 + 1,840
    // ฿40: email 10 × 40 = 400, SMS 10,000 × ฿0.32 = 3,200 (fixed in baht), Cloud Run 120 × 40 = 4,800, SQL 38.15 × 40 = 1,526,
    // Redis 47.45 × 40 = 1,898, storage 30 × 40 = 1,200, contacts 100 × 40 = 4,000 → 17,024 + LINE (was 16,824 with SMS 75 × 40 = 3,000)
    [20000, 40, 1780, 44.5, 45, 18804, "0"], // 1,780 ÷ 40 = 44.5 → US$45 half up; 17,024 + 1,780
    [35000, 40, 1780, 44.5, 45, 18804, "0"],
    [36000, 40, 1840, 46, 46, 18864, "1,000"], // 1,840 ÷ 40 = 46; 17,024 + 1,840
  ];
  for (const [line, rate, baht, usd, usdShown, month, extra] of cases) {
    const at = `${line} messages at ฿${rate}`;
    const { row, thb, usd: inUsd } = pulse8At(line, rate);
    near(row.cost * rate, baht, `${at}: THB`);
    near(row.cost, usd, `${at}: cost US$`);
    assert.equal(row.sell, row.cost, `${at}: sell = cost (paid direct)`);
    assert.equal(row.payer, "direct");
    assert.equal(row.kind, "telco");
    assert.equal(row.draft, true, `${at}: draft badge`);
    assert.equal(row.cud, undefined);
    assert.equal(thb.lines.find((l) => l.id === "line")!.sell, baht, `${at}: row on screen in THB`);
    assert.equal(inUsd.lines.find((l) => l.id === "line")!.sell, usdShown, `${at}: row on screen in US$`);
    assert.equal(thb.monthlyDirect, month, `${at}: Pulse8 a month`);
    assert.deepEqual(row.detail, {
      en: `Pro plan ฿1,780 (35,000 messages included) + ${extra} extra × ฿0.06 · excl. 7% VAT`,
      th: `แพ็กเกจ Pro ฿1,780 (รวม 35,000 ข้อความ) + ส่วนเกิน ${extra} ข้อความ × ฿0.06 · ไม่รวม VAT 7%`,
    }, `${at}: text`);
  }
  // overage starts at message 35,001 (1,780 + 1 × 0.06 = 1,780.06); a typed 35,000.5 counts as a whole message too
  near(pulse8At(35001, 33.5).row.cost * 33.5, 1780.06, "35,001 messages");
  near(pulse8At(35000.5, 33.5).row.cost * 33.5, 1780.06, "35,000.5 messages");
  near(pulse8At(0, 33.5).row.cost * 33.5, 1780, "no messages still pays the plan");
  // the input's cap, 100,000,000 messages: 1,780 + 99,965,000 × 0.06 = 1,780 + 5,997,900 = ฿5,999,680
  near(pulse8At(100000000, 33.5).row.cost * 33.5, 5999680, "100,000,000 messages");
  // the rate field's limits, ฿1 and ฿1,000 per US$: the row on screen stays ฿1,780 / ฿1,840
  for (const rate of [1, 1000]) {
    assert.equal(pulse8At(20000, rate).thb.lines.find((l) => l.id === "line")!.sell, 1780, `20,000 messages at ฿${rate}`);
    assert.equal(pulse8At(36000, rate).thb.lines.find((l) => l.id === "line")!.sell, 1840, `36,000 messages at ฿${rate}`);
  }
  // rows stay before VAT and the page adds VAT 7% once, on the total (Calculator `withVat` = n + vatOf(n)). Pulse8 defaults with
  // setup, year 1: license 20 × 360 × 33.5 = 241,200 + setup 8 × 15,000 = 120,000 + 12 × 16,558 = 198,696 → ฿559,896;
  // VAT 559,896 × 0.07 = 39,192.72 → 39,193, ฿599,089 with VAT (was ฿551,652 / ฿590,268 with SMS ฿2,513)
  const y1 = displayGrid(totals([newItem("pulse8", "p")], s), thb, s).year1;
  assert.equal(y1, 559896);
  assert.equal(y1 + vatOf(y1), 599089);
});

test("L1 Pulse8 LINE OA text in EN and TH: both plans and overages in the note, per-recipient input, no ฿0.10 on the Pro row", () => {
  // note figures: SMS ฿0.32 a credit (ThaiBulkSMS Standard ฿30,000 package), LINE Basic ฿1,280 / 15,000 / ฿0.1 and Pro ฿1,780 /
  // 35,000 / ฿0.06 (lineforbusiness.com broadcast-message pricing table, read 2026-11-21), all before VAT
  assert.deepEqual(PRICING.pulse8.notes, [{
    en: "Assumed fees: SMS ฿0.32 a credit unless you change it (ThaiBulkSMS Standard), email US$0.10 per 1,000. LINE OA Basic ฿1,280 a month with 15,000 messages, then ฿0.1 per extra message; Pro ฿1,780 with 35,000, then ฿0.06. SMS and LINE prices exclude 7% VAT.",
    th: "สมมติค่าส่ง: SMS เครดิตละ ฿0.32 ถ้าไม่ได้แก้ (ThaiBulkSMS Standard) อีเมล US$0.10 ต่อ 1,000 ฉบับ · LINE OA แพ็กเกจ Basic ฿1,280 ต่อเดือน รวม 15,000 ข้อความ ส่วนเกินข้อความละ ฿0.1 · Pro ฿1,780 รวม 35,000 ข้อความ ส่วนเกินข้อความละ ฿0.06 · ราคา SMS และ LINE ไม่รวม VAT 7%",
  }]);
  const input = PRICING.pulse8.inputs.find((i) => i.id === "line")!;
  assert.deepEqual(input.label, { en: "LINE OA messages per month (per recipient)", th: "ข้อความ LINE OA ต่อเดือน (นับต่อผู้รับ)" });
  assert.deepEqual(input.help, {
    en: "As LINE counts the plan's quota: one broadcast to 1,000 followers = 1,000 messages. Chats and auto-replies are not counted.",
    th: "ตามที่ LINE นับโควตาแพ็กเกจ: broadcast 1 ครั้งถึงเพื่อน 1,000 คน = 1,000 ข้อความ ข้อความแชทและตอบกลับอัตโนมัติไม่นับ",
  });
  assert.equal(input.def, 20000);
  // Basic's ฿0.1 overage must never reach the Pro row (the default); the old US$0.003 LINE price and SMS ฿0.25 are gone everywhere
  const row = pulse8At(20000, 33.5).row;
  for (const text of [row.detail!.en, row.detail!.th]) assert.doesNotMatch(text, /฿0\.10?\b|0\.003/, text);
  const sms = costItem({ ...newItem("pulse8", "p"), setup: false }, s).lines.find((l) => l.id === "sms")!;
  for (const text of [sms.detail!.en, sms.detail!.th, ...PRICING.pulse8.notes.flatMap((x) => [x.en, x.th]), ...PRICING.pulse8.inputs.flatMap((i) => [i.label.en, i.label.th, i.help?.en ?? "", i.help?.th ?? ""])]) {
    assert.doesNotMatch(text, /0\.003|฿0\.25|0\.0075/, text);
  }
});

test("guard: every product's defaults total matches origin/main 6f1eabb except the Pulse8 SMS row (2026-11-21)", () => {
  // [monthly, year 1, 5-year TCO] in THB at ฿33.5 with setup, CUD off then on, taken from origin/main 6f1eabb before this change
  const was: Record<string, [number[], number[]]> = {
    meet8: [[17498, 496176, 1548336], [16430, 483360, 1484256]],
    agent8: [[14070, 640440, 1598808], [12466, 621192, 1502568]],
    voice8: [[93795, 1275540, 5777700], [90188, 1232256, 5561280]],
    insight8: [[25851, 706812, 2230668], [24263, 687756, 2135388]],
    connect8: [[7638, 327456, 835584], [6539, 314268, 769644]],
    space8: [[8844, 232608, 742024], [8226, 225192, 704944]],
    // Pulse8 without its SMS row (฿2,513 a month on 6f1eabb): 15,871 − 2,513, 551,652 − 12 × 2,513, 1,525,716 − 60 × 2,513;
    // CUD on 15,188 − 2,513, 543,456 − 30,156, 1,484,736 − 150,780
    pulse8: [[13358, 521496, 1374936], [12675, 513300, 1333956]],
    collab8: [[14003, 387756, 1187252], [12342, 367824, 1087592]],
    ask8: [[10313, 249156, 814932], [9385, 238020, 759252]],
    data8: [[5066, 502392, 1028568], [4474, 495288, 993048]],
  };
  assert.deepEqual(Object.keys(was).sort(), Object.keys(PRICING).sort());
  for (const [pid, [off, on]] of Object.entries(was)) {
    for (const [st, exp] of [[s, off], [{ ...s, cud: true }, on]] as const) {
      const g = displayGrid(totals([newItem(pid, "x")], st), thb, st);
      const sms = pid === "pulse8" ? g.items[0].lines.find((l) => l.id === "sms")!.sell : 0;
      assert.deepEqual([g.monthly - sms, g.year1 - 12 * sms, g.tco - 60 * sms], exp, `${pid} cud ${st.cud}`);
    }
  }
  // Pulse8's other rows one by one, as on origin/main: email, LINE Pro, Cloud Run (−17% with CUD), SQL, Redis, storage, contacts
  const rows = (st: typeof s) => displayGrid(totals([newItem("pulse8", "x")], st), thb, st).items[0].lines.filter((l) => l.id !== "sms").map((l) => l.sell);
  assert.deepEqual(rows(s), [335, 1780, 4020, 1278, 1590, 1005, 3350]);
  assert.deepEqual(rows({ ...s, cud: true }), [335, 1780, 3337, 1278, 1590, 1005, 3350]);
});

/* ---- 2026-11-21 cost decisions, the rest: LINE OA Basic/Pro, SMS per credit, "Estimate" badge, Collab8/Space8 runtime once.
   Sources (also in lib/pricing.ts): LINE https://lineforbusiness.com/th/service/line-oa-features/broadcast-message (read 2026-11-21):
   Basic ฿1,280 a month with 15,000 messages, then ฿0.1; Pro ฿1,780 with 35,000, then ฿0.06; before 7% VAT. ThaiBulkSMS
   https://www.thaibulksms.com/pricing/sms/?lang=th (read 2026-11-21): Standard ฿30,000 package = ฿0.32 a credit, before VAT;
   https://www.thaibulksms.com/credit-calculation/ (read 2026-11-21): Thai 70 characters = 1 credit, 134 = 2.
   Expected values worked out by hand. ---- */

const pulse8With = (inputs: Record<string, number>, rate: number) => {
  const st = { ...s, rate };
  const item = { ...newItem("pulse8", "p"), inputs: { ...newItem("pulse8", "p").inputs, ...inputs }, setup: false };
  const lines = costItem(item, st).lines;
  const screen = (cur: "THB" | "USD") => displayGrid(totals([item], st), { cur, rate, vat: false }, st).items[0];
  return { lines, row: (id: string) => lines.find((l) => l.id === id)!, thb: screen("THB"), usd: screen("USD") };
};

test("L2 Pulse8 LINE OA Basic: ฿1,280 with 15,000 messages, ฿0.1 each after; Pro stays the default, at ฿33.5 and ฿40", () => {
  const BASIC = 0, PRO = 1;
  // [plan, messages, rate, THB = fee + max(0, messages − included) × extra, US$ row on screen (half up), Pulse8 THB a month, text]
  // month at ฿33.5 = 16,558 (O1) − 1,780 + LINE; at ฿40 = 17,024 (L1) + LINE
  const cases: [number, number, number, number, number, number, string, string][] = [
    [BASIC, 15000, 33.5, 1280, 38, 16058, "Basic plan ฿1,280 (15,000 messages included) + 0 extra × ฿0.1 · excl. 7% VAT",
      "แพ็กเกจ Basic ฿1,280 (รวม 15,000 ข้อความ) + ส่วนเกิน 0 ข้อความ × ฿0.1 · ไม่รวม VAT 7%"], // 1,280 ÷ 33.5 = 38.208… → 38; 16,558 − 1,780 + 1,280
    [BASIC, 16000, 33.5, 1380, 41, 16158, "Basic plan ฿1,280 (15,000 messages included) + 1,000 extra × ฿0.1 · excl. 7% VAT",
      "แพ็กเกจ Basic ฿1,280 (รวม 15,000 ข้อความ) + ส่วนเกิน 1,000 ข้อความ × ฿0.1 · ไม่รวม VAT 7%"], // 1,280 + 1,000 × 0.1 = 1,380; ÷ 33.5 = 41.19… → 41
    [BASIC, 15000, 40, 1280, 32, 18304, "Basic plan ฿1,280 (15,000 messages included) + 0 extra × ฿0.1 · excl. 7% VAT",
      "แพ็กเกจ Basic ฿1,280 (รวม 15,000 ข้อความ) + ส่วนเกิน 0 ข้อความ × ฿0.1 · ไม่รวม VAT 7%"], // 1,280 ÷ 40 = 32; 17,024 + 1,280
    [BASIC, 16000, 40, 1380, 35, 18404, "Basic plan ฿1,280 (15,000 messages included) + 1,000 extra × ฿0.1 · excl. 7% VAT",
      "แพ็กเกจ Basic ฿1,280 (รวม 15,000 ข้อความ) + ส่วนเกิน 1,000 ข้อความ × ฿0.1 · ไม่รวม VAT 7%"], // 1,380 ÷ 40 = 34.5 → 35 half up; 17,024 + 1,380
    [PRO, 20000, 33.5, 1780, 53, 16558, "Pro plan ฿1,780 (35,000 messages included) + 0 extra × ฿0.06 · excl. 7% VAT",
      "แพ็กเกจ Pro ฿1,780 (รวม 35,000 ข้อความ) + ส่วนเกิน 0 ข้อความ × ฿0.06 · ไม่รวม VAT 7%"],
    [PRO, 20000, 40, 1780, 45, 18804, "Pro plan ฿1,780 (35,000 messages included) + 0 extra × ฿0.06 · excl. 7% VAT",
      "แพ็กเกจ Pro ฿1,780 (รวม 35,000 ข้อความ) + ส่วนเกิน 0 ข้อความ × ฿0.06 · ไม่รวม VAT 7%"],
  ];
  for (const [linePlan, line, rate, baht, usdShown, month, en, th] of cases) {
    const at = `plan ${linePlan}, ${line} messages at ฿${rate}`;
    const p = pulse8With({ linePlan, line }, rate);
    const row = p.row("line");
    near(row.cost * rate, baht, `${at}: THB`);
    assert.equal(row.sell, row.cost, `${at}: sell = cost (paid direct)`);
    assert.equal(row.payer, "direct");
    assert.equal(row.draft, true);
    assert.equal(row.estimate, undefined, `${at}: sourced, so not an estimate`);
    assert.equal(p.thb.lines.find((l) => l.id === "line")!.sell, baht, `${at}: row on screen in THB`);
    assert.equal(p.usd.lines.find((l) => l.id === "line")!.sell, usdShown, `${at}: row on screen in US$`);
    assert.equal(p.thb.monthlyDirect, month, `${at}: Pulse8 a month`);
    assert.deepEqual(row.detail, { en, th }, `${at}: text`);
  }
  // Basic overage starts at message 15,001: 1,280 + 1 × 0.1 = 1,280.1; a typed 15,000.5 is a whole message too
  near(pulse8With({ linePlan: BASIC, line: 15001 }, 33.5).row("line").cost * 33.5, 1280.1, "Basic 15,001");
  near(pulse8With({ linePlan: BASIC, line: 15000.5 }, 33.5).row("line").cost * 33.5, 1280.1, "Basic 15,000.5");
  // the input: default Pro, two choices in plan order, radio (not a dropdown)
  const input = PRICING.pulse8.inputs.find((i) => i.id === "linePlan")!;
  assert.equal(input.def, PRO);
  assert.equal(input.max, 1);
  assert.equal(input.dropdown, undefined);
  assert.deepEqual(input.label, { en: "LINE OA plan", th: "แพ็กเกจ LINE OA" });
  assert.deepEqual(input.choices, [
    { en: "Basic: ฿1,280 a month, 15,000 messages included", th: "Basic: ฿1,280 ต่อเดือน รวม 15,000 ข้อความ" },
    { en: "Pro: ฿1,780 a month, 35,000 messages included", th: "Pro: ฿1,780 ต่อเดือน รวม 35,000 ข้อความ" },
  ]);
  assert.equal(newItem("pulse8", "p").inputs.linePlan, PRO);
  // a link saved before the plan choice (no linePlan) opens as Pro at ฿1,780; out-of-range values clamp like every choice (M7):
  // above the last plan → Pro, below 0 → Basic; Basic survives a link
  const old = decode(btoa(JSON.stringify({ v: 1, i: [["pulse8", 20, { contacts: 50000, email: 100000, sms: 10000, line: 20000 }, 0]] })))!;
  assert.equal(old.items[0].inputs.linePlan, PRO);
  near(costItem(old.items[0], s).lines.find((l) => l.id === "line")!.cost * 33.5, 1780, "old link LINE row");
  assert.equal(decode(btoa(JSON.stringify({ v: 1, i: [["pulse8", 20, { linePlan: 7 }, 0]] })))!.items[0].inputs.linePlan, PRO);
  assert.equal(decode(btoa(JSON.stringify({ v: 1, i: [["pulse8", 20, { linePlan: -1 }, 0]] })))!.items[0].inputs.linePlan, BASIC);
  const basic = { ...newItem("pulse8", "p"), inputs: { ...newItem("pulse8", "p").inputs, linePlan: BASIC } };
  const back = decode(encode({ v: 1, items: [basic], s, cur: "THB", vat: false }))!;
  assert.equal(back.items[0].inputs.linePlan, BASIC);
  // at the default 20,000 messages Basic costs the same as Pro: 1,280 + 5,000 × 0.1 = ฿1,780
  near(costItem(basic, s).lines.find((l) => l.id === "line")!.cost * 33.5, 1780, "Basic at 20,000 messages");
  // VAT once on the total, as in L1: Basic at 16,000 messages with setup, year 1 = license 241,200 + setup 120,000 + 12 × 16,158
  // (193,896) = ฿555,096; VAT 555,096 × 0.07 = 38,856.72 → 38,857, ฿593,953 with VAT
  const y1 = displayGrid(totals([{ ...basic, inputs: { ...basic.inputs, line: 16000 } }], s), thb, s).year1;
  assert.equal(y1, 555096);
  assert.equal(y1 + vatOf(y1), 593953);
});

test("S1 Pulse8 SMS per credit in baht at any rate: 10,000 credits × ฿0.32 = ฿3,200, 0 = ฿0, 2 credits = ฿0.64, edited ฿0.41", () => {
  // [credits, THB per credit, rate, THB before VAT, US$ row on screen (half up), credits in the text, price in the text]
  const cases: [number, number, number, number, number, string, string][] = [
    [10000, 0.32, 33.5, 3200, 96, "10,000", "0.32"], // 3,200 ÷ 33.5 = 95.52… → US$96
    [10000, 0.32, 40, 3200, 80, "10,000", "0.32"], // 3,200 ÷ 40 = 80
    [0, 0.32, 33.5, 0, 0, "0", "0.32"],
    [0, 0.32, 40, 0, 0, "0", "0.32"],
    [2, 0.32, 33.5, 0.64, 0, "2", "0.32"], // 2 × 0.32 = 0.64 (shows ฿1 rounded half up; US$0.019 → 0)
    [2, 0.32, 40, 0.64, 0, "2", "0.32"],
    [10000, 0.41, 33.5, 4100, 122, "10,000", "0.41"], // ThaiBulkSMS ฿3,500 package ฿0.41: 4,100 ÷ 33.5 = 122.39 → 122
    [10000, 0.41, 40, 4100, 103, "10,000", "0.41"], // 4,100 ÷ 40 = 102.5 → 103 half up
  ];
  for (const [sms, smsPrice, rate, baht, usdShown, credits, price] of cases) {
    const at = `${sms} credits × ฿${smsPrice} at ฿${rate}`;
    const p = pulse8With({ sms, smsPrice }, rate);
    const row = p.row("sms");
    near(row.cost * rate, baht, `${at}: THB`);
    assert.equal(row.sell, row.cost, `${at}: sell = cost (paid direct)`);
    assert.equal(row.payer, "direct");
    assert.equal(row.kind, "telco");
    assert.equal(row.draft, true, `${at}: draft badge kept`);
    assert.equal(row.estimate, undefined);
    assert.equal(row.cud, undefined);
    assert.equal(p.thb.lines.find((l) => l.id === "sms")!.sell, Math.round(baht), `${at}: row on screen in THB`);
    assert.equal(p.usd.lines.find((l) => l.id === "sms")!.sell, usdShown, `${at}: row on screen in US$`);
    assert.deepEqual(row.detail, { en: `${credits} credits × ฿${price} · excl. 7% VAT`, th: `${credits} เครดิต × ฿${price} · ไม่รวม VAT 7%` }, `${at}: text`);
  }
  // a typed price with more decimals than the money format shows as typed, so the formula multiplies out to the row:
  // 1,000,000 × 1.02175 = ฿1,021,750 (rounding the price to 1.0218 would read as ฿1,021,800)
  const fine = pulse8With({ sms: 1000000, smsPrice: 1.02175 }, 33.5).row("sms");
  near(fine.cost * 33.5, 1021750, "1,000,000 credits × ฿1.02175");
  assert.deepEqual(fine.detail, { en: "1,000,000 credits × ฿1.02175 · excl. 7% VAT", th: "1,000,000 เครดิต × ฿1.02175 · ไม่รวม VAT 7%" });
  // a long typed price at a high volume: 31,208,637 × 0.32135 = ฿10,028,895.49995, rounded to the satang = ฿10,028,895.50, so the
  // row shows ฿10,028,896 (half up) at every rate instead of 896 at ฿33.5 and 895 at ฿36 (Astra round 2)
  for (const rate of [33.5, 36, 40]) {
    const p = pulse8With({ sms: 31208637, smsPrice: 0.32135 }, rate);
    near(p.row("sms").cost * rate, 10028895.5, `long price at ฿${rate}: THB`);
    assert.equal(p.thb.lines.find((l) => l.id === "sms")!.sell, 10028896, `long price at ฿${rate}: row on screen`);
  }
  // the rate field's limits: still ฿3,200 on screen
  for (const rate of [1, 1000]) assert.equal(pulse8With({}, rate).thb.lines.find((l) => l.id === "sms")!.sell, 3200, `defaults at ฿${rate}`);
  // credits are whole: 10,000.5 bills 10,001 × 0.32 = 3,200.32
  near(pulse8With({ sms: 10000.5 }, 33.5).row("sms").cost * 33.5, 3200.32, "10,000.5 credits");
  // 20,000 credits at ฿33.5: 6,400; Pulse8 month 16,558 − 3,200 + 6,400 = 19,758
  assert.equal(pulse8With({ sms: 20000 }, 33.5).thb.monthlyDirect, 19758);
  // inputs: credits (id kept as "sms" so old links read messages as 1 credit each) and an editable baht price per credit
  const credits = PRICING.pulse8.inputs.find((i) => i.id === "sms")!;
  assert.deepEqual(credits.label, { en: "SMS credits per month", th: "เครดิต SMS ต่อเดือน" });
  assert.deepEqual(credits.unit, { en: "credits", th: "เครดิต" });
  assert.equal(credits.def, 10000);
  assert.deepEqual(credits.help, {
    en: "A Thai message over 70 characters uses more than one credit (up to 134 characters = 2). Links saved earlier count each message as 1 credit.",
    th: "ข้อความภาษาไทยเกิน 70 ตัวอักษรใช้มากกว่า 1 เครดิต (ไม่เกิน 134 ตัวอักษร = 2 เครดิต) ลิงก์ที่บันทึกไว้ก่อนหน้านี้นับข้อความละ 1 เครดิต",
  });
  const price = PRICING.pulse8.inputs.find((i) => i.id === "smsPrice")!;
  assert.deepEqual(price.label, { en: "SMS price per credit", th: "ราคา SMS ต่อเครดิต" });
  assert.deepEqual(price.unit, { en: "THB", th: "บาท" });
  assert.equal(price.def, 0.32);
  assert.equal(price.step, 0.01);
  assert.equal(price.max, 10);
  assert.deepEqual(price.help, {
    en: "Default: ThaiBulkSMS Standard, ฿30,000 package, ฿0.32 a credit before VAT. Enter your provider's price.",
    th: "ค่าเริ่มต้น: ThaiBulkSMS Standard แพ็กเกจ ฿30,000 เครดิตละ ฿0.32 ก่อน VAT ใส่ราคาของผู้ให้บริการที่ใช้จริงได้",
  });
  // an old link with 10,000 SMS messages and no price: 10,000 credits × ฿0.32 = ฿3,200; an edited price survives a link
  const old = decode(btoa(JSON.stringify({ v: 1, i: [["pulse8", 20, { sms: 10000 }, 0]] })))!;
  assert.equal(old.items[0].inputs.smsPrice, 0.32);
  near(costItem(old.items[0], s).lines.find((l) => l.id === "sms")!.cost * 33.5, 3200, "old link SMS row");
  const edited = { ...newItem("pulse8", "p"), inputs: { ...newItem("pulse8", "p").inputs, smsPrice: 0.41 } };
  assert.equal(decode(encode({ v: 1, items: [edited], s, cur: "THB", vat: false }))!.items[0].inputs.smsPrice, 0.41);
  assert.equal(decode(btoa(JSON.stringify({ v: 1, i: [["pulse8", 20, { smsPrice: 99 }, 0]] })))!.items[0].inputs.smsPrice, 10);
});

/* Badge table (also in the report): product / row id / condition / expected badge. "estimate" rows are UNSOURCEABLE or an open
   SPEC-QUESTION in the 2026-11-21 cost audit; every other row keeps the draft flag it had on origin/main 6f1eabb. */
const BADGES: [string, string, Record<string, number>, string, "estimate" | "draft" | "none"][] = [
  ["collab8", "ai", {}, "always", "estimate"],
  ["collab8", "gcp-cloud-run-chat-and-api-", {}, "always", "estimate"],
  ["collab8", "gcp-cloud-sql-database-", {}, "always", "estimate"],
  ["collab8", "gcp-memorystore-realtime-", {}, "always", "estimate"],
  ["collab8", "gcp-cloud-storage-files-", {}, "always", "estimate"],
  ["collab8", "gcp-logging-and-other", {}, "always", "estimate"],
  ["collab8", "gcp-sandbox", {}, "always", "estimate"],
  ["ask8", "ai", { pack: 1 }, "AI Pack (default)", "estimate"],
  ["ask8", "ai", { pack: 0 }, "own provider", "estimate"],
  ["ask8", "gcp-cloud-run-widget-and-api-", {}, "always", "estimate"],
  ["ask8", "gcp-cloud-sql-with-pgvector", {}, "always", "estimate"],
  ["ask8", "gcp-logging-and-other", {}, "always", "estimate"],
  ["ask8", "gcp-docs", {}, "always", "estimate"],
  ["agent8", "ai", {}, "always", "estimate"],
  ["agent8", "gcp-cloud-run-gateway-and-agents-", {}, "always", "estimate"],
  ["agent8", "gcp-cloud-sql-database-and-logs-", {}, "always", "estimate"],
  ["agent8", "gcp-memorystore-rate-limits-cache-", {}, "always", "estimate"],
  ["agent8", "gcp-load-balancer", {}, "always", "estimate"],
  ["agent8", "gcp-storage-logging-and-other", {}, "always", "estimate"],
  ["connect8", "ai", {}, "always", "estimate"],
  ["connect8", "gcp-cloud-run-workflow-engine-", {}, "always", "estimate"],
  ["connect8", "gcp-cloud-sql-database-", {}, "always", "estimate"],
  ["connect8", "gcp-pub-sub-and-cloud-tasks", {}, "always", "estimate"],
  ["connect8", "gcp-storage-logging-and-other", {}, "always", "estimate"],
  ["connect8", "gcp-users", {}, "always", "estimate"],
  ["voice8", "gcp-nat-build-storage-and-other", { region: 1 }, "Jakarta", "estimate"],
  ["voice8", "gcp-nat-build-storage-and-other", { region: 0 }, "Singapore (default)", "draft"],
  ["voice8", "min", { region: 1 }, "Jakarta", "none"],
  ["voice8", "min", { region: 0 }, "Singapore", "none"],
  ["voice8", "gcp-cloud-run-call-runtime-business-system-engine-studio-", { region: 1 }, "Jakarta", "draft"],
  ["voice8", "gcp-cloud-run-voice-1-instance-always-on-", { region: 1 }, "Jakarta", "draft"],
  ["voice8", "gcp-compute-engine-asterisk-active-standby-e2-standard-2-2-", { region: 1 }, "Jakarta", "draft"],
  ["voice8", "gcp-compute-engine-qdrant-cluster-3-vms-internal-lb-", { region: 1 }, "Jakarta", "draft"],
  ["voice8", "gcp-memorystore-valkey-ha-", { region: 1 }, "Jakarta", "draft"],
  ["voice8", "gcp-load-balancer-and-cloud-armor", { region: 1 }, "Jakarta", "draft"],
  ["voice8", "gcp-voice", { region: 1 }, "Jakarta", "draft"],
  ["voice8", "gcp-egress", { region: 1 }, "Jakarta", "draft"],
  ["voice8", "gcp-asterisk", { region: 1, concurrent: 81 }, "Jakarta, 81 concurrent", "draft"],
  ["voice8", "gcp-runtime", { region: 1, concurrent: 81 }, "Jakarta, 81 concurrent", "draft"],
  ["voice8", "gcp-asterisk", { region: 0, concurrent: 81 }, "Singapore, 81 concurrent", "draft"],
  ["voice8", "gcp-runtime", { region: 0, concurrent: 81 }, "Singapore, 81 concurrent", "draft"],
  ["voice8", "gcp-nat-build-storage-and-other", { region: 0, concurrent: 81 }, "Singapore, 81 concurrent", "draft"],
  ["voice8", "gcp-nat-build-storage-and-other", { region: 1, concurrent: 81 }, "Jakarta, 81 concurrent", "estimate"],
  ["pulse8", "gcp-cloud-run-app-and-sending-", {}, "always", "estimate"],
  ["pulse8", "gcp-storage-logging-and-other", {}, "always", "estimate"],
  ["pulse8", "gcp-contacts", {}, "always", "estimate"],
  ["pulse8", "gcp-cloud-sql-database-", {}, "always", "draft"],
  ["pulse8", "gcp-memorystore-queues-", {}, "always", "draft"],
  ["pulse8", "email", {}, "always", "draft"],
  ["pulse8", "sms", {}, "always", "draft"],
  ["pulse8", "line", { linePlan: 0 }, "Basic", "draft"],
  ["pulse8", "line", { linePlan: 1 }, "Pro (default)", "draft"],
  ["data8", "gcp-logging-and-other", {}, "always", "estimate"],
  ["data8", "gcp-cloud-run-app-and-pipelines-", {}, "always", "draft"],
  ["data8", "gcp-cloud-sql-database-server-", {}, "always", "draft"],
  ["data8", "gcp-sql-storage", {}, "always", "draft"],
  ["space8", "gcp-compute-engine-vm-app-realtime-and-livekit-", {}, "always", "draft"],
  ["space8", "gcp-cloud-sql-database-", {}, "always", "draft"],
  ["space8", "gcp-gke-agents", {}, "always", "draft"],
  ["space8", "gcp-cloud-nat-storage-and-other", {}, "always", "draft"],
];
const linesOf = (pid: string, inputs: Record<string, number> = {}, size: "lean" | "standard" = "lean") =>
  costItem({ ...newItem(pid, "b"), inputs: { ...newItem(pid, "b").inputs, ...inputs }, size, setup: false }, s).lines;

test("B1 badge table: estimate rows, draft rows and no badge, per row and for the folded Google Cloud group, SG and JKT", () => {
  for (const [pid, id, inputs, when, exp] of BADGES) {
    const row = linesOf(pid, inputs).find((l) => l.id === id);
    assert.ok(row, `${pid} ${id} (${when}): expected the row`);
    assert.deepEqual(badgesOf([row]), exp === "none" ? [] : [exp], `${pid} ${id} (${when})`);
    if (row.estimate) assert.equal(row.draft, true, `${pid} ${id}: an estimate row stays a draft`);
  }
  // the table lists every row of the products it covers (Meet8 and Insight8 are not touched: B2 guards them)
  for (const [pid, inputs] of [["collab8", {}], ["ask8", { pack: 0 }], ["ask8", { pack: 1 }], ["agent8", {}], ["connect8", {}], ["voice8", { region: 1, concurrent: 81 }], ["voice8", { region: 0, concurrent: 81 }],
    ["pulse8", {}], ["data8", {}], ["space8", {}]] as const) {
    const listed = new Set(BADGES.filter((b) => b[0] === pid).map((b) => b[1]));
    for (const l of linesOf(pid, inputs)) assert.ok(listed.has(l.id), `${pid} ${l.id} is missing from the badge table`);
  }
  // no Meet8 or Insight8 row is an estimate, in any hosting or size
  for (const host of [0, 1, 2]) assert.equal(linesOf("meet8", { host }).some((l) => l.estimate), false, `meet8 host ${host}`);
  for (const size of ["lean", "standard"] as const) assert.equal(linesOf("insight8", {}, size).some((l) => l.estimate), false, `insight8 ${size}`);
  // the folded group (≥ 3 Google Cloud rows, Calculator `Lines`, one group per payer) shows a tag for each kind among its rows,
  // collapsed in the summary and expanded on each row
  const group = (pid: string, inputs: Record<string, number> = {}, size: "lean" | "standard" = "lean") => {
    const cloud = linesOf(pid, inputs, size).filter((l) => l.kind === "cloud");
    assert.ok(cloud.length >= 3, `${pid}: folded group`);
    return badgesOf(cloud);
  };
  assert.deepEqual(group("pulse8"), ["estimate", "draft"]); // Cloud Run, storage, contacts estimate; SQL, Redis draft
  assert.deepEqual(group("data8"), ["estimate", "draft"]); // logging estimate; Cloud Run, SQL draft
  assert.deepEqual(group("voice8", { region: 1 }), ["estimate", "draft"]); // Jakarta ops estimate; the rest draft
  assert.deepEqual(group("voice8", { region: 0 }), ["draft"]); // Singapore: no estimate
  for (const pid of ["collab8", "ask8", "agent8", "connect8"]) assert.deepEqual(group(pid), ["estimate"], pid);
  assert.deepEqual(group("space8"), ["draft"]); // Space8 NAT 3 keeps "Draft price"
  assert.deepEqual(group("meet8", { host: 0 }), ["draft"]);
  assert.deepEqual(group("insight8", {}, "standard"), []);
  assert.deepEqual(badgesOf([]), []);
});

test("B2 guard: draft flags outside the estimate rows, and Meet8/Insight8 rows, match origin/main 6f1eabb", () => {
  // rows WITHOUT the draft flag on origin/main 6f1eabb (every other row of these products is a draft), and THB rows at ฿33.5
  const nonDraft: [string, Record<string, number>, "lean" | "standard", string[]][] = [
    ["meet8", { host: 0 }, "lean", ["gcp-cloud-run-app-and-api-", "gcp-cloud-sql-database-size-s-", "gcp-memorystore-2-redis-", "gcp-compute-engine-chat-runner-",
      "gcp-load-balancer", "gcp-cloud-armor", "gcp-nat-build-and-other"]],
    ["meet8", { host: 1 }, "lean", []],
    ["meet8", { host: 2 }, "lean", []],
    ["insight8", {}, "lean", []],
    ["insight8", {}, "standard", ["gcp-cloud-run-studio-2-vcpu-2-gib-", "gcp-cloud-run-gvisor-sandbox-2-vcpu-4-gib-always-on-", "gcp-cloud-run-agent-tools-",
      "gcp-cloud-run-jobs-refresh-pulse-", "gcp-cloud-sql-2-vcpu-8-gb-", "gcp-cloud-sql-storage", "gcp-networking", "gcp-other"]],
    ["voice8", { region: 0, concurrent: 81 }, "lean", ["min"]],
    ["voice8", { region: 1, concurrent: 81 }, "lean", ["min"]],
    ["agent8", {}, "lean", []], ["connect8", {}, "lean", []], ["space8", {}, "lean", []], ["pulse8", {}, "lean", []],
    ["collab8", {}, "lean", []], ["ask8", { pack: 0 }, "lean", []], ["ask8", { pack: 1 }, "lean", []], ["data8", {}, "lean", []],
  ];
  for (const [pid, inputs, size, exp] of nonDraft) {
    assert.deepEqual(linesOf(pid, inputs, size).filter((l) => !l.draft).map((l) => l.id), exp, `${pid} ${JSON.stringify(inputs)} ${size}`);
  }
  // Meet8 and Insight8 rows one by one in THB at ฿33.5, as on origin/main 6f1eabb
  const rows = (pid: string, inputs: Record<string, number>, size: "lean" | "standard", st = s) =>
    displayGrid(totals([{ ...newItem(pid, "g"), inputs: { ...newItem(pid, "g").inputs, ...inputs }, size, setup: false }], st), thb, st).items[0].lines.map((l) => l.sell);
  assert.deepEqual(rows("meet8", { host: 0 }, "lean"), [3551, 965, 2647, 992, 2472, 3183, 874, 670, 536, 1340, 268]);
  assert.deepEqual(rows("meet8", { host: 0 }, "lean", { ...s, cud: true }), [3551, 965, 2197, 992, 1854, 3183, 874, 670, 536, 1340, 268]);
  assert.deepEqual(rows("meet8", { host: 1 }, "lean"), [4261, 1158, 3176, 1190, 2966, 3819, 1049, 804, 643, 1608, 322]);
  assert.deepEqual(rows("meet8", { host: 2 }, "lean"), [14660]);
  assert.deepEqual(rows("insight8", {}, "lean"), [16080, 2348, 2020, 1528, 531, 2344, 253, 543, 204]);
  assert.deepEqual(rows("insight8", {}, "lean", { ...s, cud: true }), [16080, 1949, 1677, 1268, 531, 1758, 253, 543, 204]);
  assert.deepEqual(rows("insight8", {}, "standard"), [16080, 4648, 5020, 1528, 531, 4744, 253, 543, 204]);
  assert.deepEqual(rows("insight8", {}, "standard", { ...s, cud: true }), [16080, 3858, 4167, 1268, 531, 3558, 253, 543, 204]);
  // Voice8 rows SG and JKT at 81 concurrent (amounts unchanged by the badge work)
  assert.deepEqual(rows("voice8", { region: 0, concurrent: 81 }, "lean"), [65727, 6965, 4226, 4405, 3936, 1853, 1685, 402, 30999, 1476, 2255, 168]);
  assert.deepEqual(rows("voice8", { region: 1, concurrent: 81 }, "lean"), [65727, 6965, 4226, 4807, 4311, 2020, 1685, 419, 30999, 1476, 2456, 267]);
  // committed-use discounts and the Voice8 plan prices on its product page (EN and TH), unchanged
  assert.deepEqual(CUD, { run: 0.17, runInstance: 0.28, sql: 0.25 });
  // every baht amount on the Voice8 page in order, EN then TH (the same 30 each), as on origin/main 6f1eabb: plan cards, the
  // comparison table (monthly, extra minute, implementation) and the FAQ
  const page = readFileSync(new URL("../app/[lang]/voice8/content.ts", import.meta.url), "utf8");
  const perLang = ["฿5,000", "฿2.5", "฿50,000", "฿125,000", "฿350,000", "฿5,000", "฿2.5", "฿2.5", "฿50,000", "฿125,000", "฿350,000", "฿5,000", "฿2.5",
    "฿82,500", "฿162,500", "฿435,000", "฿82,500", "฿162,500", "฿435,000", "฿37,500", "฿112,500", "฿375,000", "฿50,000", "฿2.5", "฿37,500", "฿112,500",
    "฿375,000", "฿50,000", "฿50,000", "฿50,000"];
  assert.deepEqual(page.match(/฿[0-9][0-9,]*(\.[0-9]+)?/g), [...perLang, ...perLang]);
});

test("R1 Collab8 + Space8: agent runtime counted once; more sessions add only Collab8's per-session rows", () => {
  const est = (sessions: number) => {
    const items = [{ ...newItem("collab8", "c"), inputs: { ...newItem("collab8", "c").inputs, sessions }, setup: false }, { ...newItem("space8", "s"), setup: false }];
    return { g: displayGrid(totals(items, s), thb, s), c: items.map((it) => costItem(it, s).lines) };
  };
  const [a, b] = [est(20), est(40)];
  // Space8 rows are the same either way: ฿2,173 + 2,472 + 4,098 + 101 = ฿8,844 (Q5)
  assert.deepEqual(a.g.items[1].lines.map((l) => l.sell), [2173, 2472, 4098, 101]);
  assert.deepEqual(b.g.items[1].lines.map((l) => l.sell), [2173, 2472, 4098, 101]);
  // Collab8 20 users: sessions 20 → 40. Agent workspaces 20 × 20 × 0.02 = 8 → 16 (฿268 → ฿536); AI 20 × 20 × 0.15 = 60 → 120
  // (฿2,010 → ฿4,020); every other row the same
  const changed = a.c[0].filter((l, k) => l.sell !== b.c[0][k].sell).map((l) => l.id);
  assert.deepEqual(changed, ["ai", "gcp-sandbox"]);
  assert.equal(a.g.items[0].lines.find((l) => l.id === "gcp-sandbox")!.sell, 268);
  assert.equal(b.g.items[0].lines.find((l) => l.id === "gcp-sandbox")!.sell, 536);
  // Google Cloud rises only by the agent workspaces row: +฿268; the whole month by +268 + 2,010 = +฿2,278
  assert.equal(b.g.hosting.total.cloud - a.g.hosting.total.cloud, 268);
  assert.equal(b.g.monthly - a.g.monthly, 2278);
  // the agent runtime splits cleanly: Collab8's workspaces row has no fixed part (0 sessions → US$0), Space8's GKE row is the
  // fixed part only (cluster 73 + always-on pods 49.32 = 122.32 at any session count)
  const at0 = est(0);
  assert.equal(at0.c[0].find((l) => l.id === "gcp-sandbox")!.cost, 0);
  for (const e of [at0, a, b]) assert.equal(e.c[1].find((l) => l.id === "gcp-gke-agents")!.cost, 122.32);
  // the texts say which side holds what; the workspaces row is GKE Autopilot pods, not Cloud Run
  const sandbox = a.c[0].find((l) => l.id === "gcp-sandbox")!;
  assert.deepEqual(sandbox.label, { en: "Google Cloud · GKE Autopilot (agent workspaces)", th: "Google Cloud · GKE Autopilot (พื้นที่ทำงานของ Agent)" });
  assert.deepEqual(sandbox.detail, {
    en: "20 users × 20 sessions × US$0.02 · per-session pods; the always-on runtime is in Space8",
    th: "20 คน × 20 session × US$0.02 · pod ต่อ session ส่วนระบบที่เปิดตลอดอยู่ใน Space8",
  });
  assert.deepEqual(PRICING.collab8.notes[1], {
    en: "Agent runtime is counted once: the always-on part (GKE cluster, runner and egress pods) is priced in Space8; the agent workspaces row here covers only the pods each session starts, which Space8 leaves out.",
    th: "ค่าระบบรัน agent นับครั้งเดียว: ส่วนที่เปิดตลอด (GKE cluster, pod runner และ egress) คิดใน Space8 ส่วนแถวพื้นที่ทำงานของ Agent ที่นี่คิดเฉพาะ pod ที่แต่ละ session เปิด ซึ่ง Space8 ไม่ได้รวม",
  });
  // Collab8 alone keeps its defaults total (guard above) and the Slack note
  assert.deepEqual(PRICING.collab8.notes[0], { en: "Compare: Slack about US$9 per user per month.", th: "เทียบ: Slack ราว US$9 ต่อผู้ใช้ต่อเดือน" });
});
