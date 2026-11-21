// Money oracles for the calculator. Every expected value is a literal worked out by hand
// from the 2026-11-09 pricing decision, not produced by running the code under test.
// Run: node --test lib/pricing.money.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_SETTINGS, PRICING, billedUsers, choiceIndex, costItem, decode, displayGrid, encode, isPriced, vatOf, newItem, roundMoney, roundPrice, toDisplay, totals, values, type Item } from "./pricing.ts";

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
// ฿0.731 ÷ 33.56 ≈ US$0.0218). Monthly totals also include rows that keep their earlier draft values (e.g. Data8 BigQuery).
// Expected values are worked out by hand from the SKU prices in the comments.
const dbRow = (pid: string, id: string) => costItem({ ...newItem(pid, "o"), setup: false }, s).lines.find((l) => l.id === id)!;
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
  // defaults 50,000 contacts, 100,000 emails, 10,000 SMS, 20,000 LINE, direct per month:
  // email 10 + SMS 75 + LINE 60 + Cloud Run 120 + SQL 38.15 + Redis 47.45 + storage 30 + contacts 100 = 480.60 (was 545)
  near(costItem({ ...newItem("pulse8", "p"), setup: false }, s).monthlyDirect, 480.6, "direct per month");
  // ฿33.5 each row half up: 335 + 2,513 (2,512.5) + 2,010 + 4,020 + 1,278 (1,278.025) + 1,590 (1,589.575) + 1,005 + 3,350 = ฿16,101
  const g = onScreen("pulse8");
  assert.deepEqual(g.items[0].lines.map((l) => l.sell), [335, 2513, 2010, 4020, 1278, 1590, 1005, 3350]);
  assert.equal(g.monthly, 16101);
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
    const l = row(concurrent, "gcp-asterisk")!;
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
  assert.deepEqual(gke.detail, { en: "cluster fee US$73 + runner and egress pods US$49.32 / month", th: "ค่า cluster US$73 + pod runner และ egress US$49.32 ต่อเดือน" });
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
  // CUD on: only Cloud SQL −25% = 55.335 → ฿1,854 (1,853.72); VM, GKE and NAT rows carry none
  const cud = displayGrid(totals([{ ...newItem("space8", "o"), setup: false }], { ...s, cud: true }), { cur: "THB", rate: 33.5, vat: false }, { ...s, cud: true });
  assert.deepEqual(cud.items[0].lines.map((l) => l.sell), [2173, 1854, 4098, 101]);
  assert.equal(cud.monthly, 8226);
});
