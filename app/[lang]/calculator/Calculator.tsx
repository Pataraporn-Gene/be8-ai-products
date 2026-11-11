"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown, TriangleAlert, Copy, Link2, Plus, Printer, RotateCcw, Trash2, X } from "lucide-react";
import { LangSwitch } from "@/components/LangSwitch";
import { productIcons } from "@/components/productIcons";
import type { Locale } from "@/lib/i18n";
import { products } from "@/lib/products";
import {
  DEFAULT_SETTINGS,
  MIN_USERS,
  PRICING,
  billedUsers,
  choiceIndex,
  optionIndex,
  setupDaysOf,
  decode,
  displayGrid,
  isPriced,
  licenseOf,
  values,
  vatOf,
  roundPrice,
  toDisplay,
  encode,
  newItem,
  totals,
  type Item,
  type ItemCost,
  type Line,
  type ShownItem,
  type Settings,
} from "@/lib/pricing";
import { getCalcCopy, type CalcCopy } from "./copy";

const STROKE = 1.75;
type Cur = "THB" | "USD";
const byId = Object.fromEntries(products.map((p) => [p.id, p]));
const CATALOG = products.filter((p) => isPriced(p.id));
const uid = () => Math.random().toString(36).slice(2, 10);

type Fmt = {
  /** An amount already converted and rounded (from displayGrid). */
  whole: (n: number) => string;
  /** A unit price: two decimals when it is not a whole number. */
  price: (usd: number) => string;
  /** Converted unit price, for "units × price" lines. */
  priceValue: (usd: number) => number;
  /** Small per-unit rates such as US$0.076 per minute. */
  unit: (usd: number) => string;
  num: (n: number) => string;
};

/** Rows are always shown before VAT; VAT is added once, on the totals. */
function makeFmt(cur: Cur, rate: number, lang: Locale): Fmt {
  const d = { cur, rate, vat: false };
  const loc = lang === "th" ? "th-TH" : "en-US";
  const nf = new Intl.NumberFormat(loc, { maximumFractionDigits: 0 });
  const nf2 = new Intl.NumberFormat(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const nfUnit = new Intl.NumberFormat(loc, { minimumFractionDigits: 2, maximumFractionDigits: cur === "USD" ? 3 : 2 });
  const sign = cur === "THB" ? "฿" : "$";
  const whole = (n: number) => sign + nf.format(n);
  const priceValue = (usd: number) => roundPrice(toDisplay(usd, d));
  return {
    whole,
    priceValue,
    price: (usd) => {
      const v = priceValue(usd);
      return sign + (Number.isInteger(v) ? nf : nf2).format(v);
    },
    unit: (usd) => sign + nfUnit.format(toDisplay(usd, d)),
    num: (n) => nf.format(n),
  };
}

export function Calculator({ lang }: { lang: Locale }) {
  const c = getCalcCopy(lang);
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [s, setS] = useState<Settings>(DEFAULT_SETTINGS);
  const [cur, setCur] = useState<Cur>("THB");
  const [vat, setVat] = useState(false);
  const [showHost, setShowHost] = useState(false);
  // Printing shows everything the screen folds away: Google Cloud rows, pricing rules and per-service hosting.
  useEffect(() => {
    let reopen: HTMLDetailsElement[] = [];
    let hostWas = false;
    const before = () => {
      reopen = [...document.querySelectorAll<HTMLDetailsElement>(".calc details:not([open]):not(.calc-settings)")];
      reopen.forEach((d) => (d.open = true));
      setShowHost((was) => ((hostWas = was), true));
    };
    const after = () => {
      reopen.forEach((d) => (d.open = false));
      setShowHost(hostWas);
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);
  const [internal, setInternal] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [removed, setRemoved] = useState<{ item: Item; at: number } | null>(null);
  const [toast, setToast] = useState("");
  const [here, setHere] = useState("/calculator");
  const [today, setToday] = useState("");

  // Load from the share link (#...) or ?add=<product> once, on the client.
  useEffect(() => {
    const url = new URL(window.location.href);
    const apply = (hash: string) => {
      const saved = hash.length > 1 ? decode(hash.slice(1)) : null;
      if (!saved) return false;
      setItems(saved.items.map((i) => ({ ...i, uid: uid() })));
      setS(saved.s);
      setCur(saved.cur);
      setVat(saved.vat);
      return true;
    };
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from the URL */
    if (!apply(url.hash)) {
      const add = url.searchParams.get("add");
      if (isPriced(add)) setItems([newItem(add, uid())]);
    }
    setInternal(url.searchParams.get("internal") === "1");
    setToday(new Date().toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "long", year: "numeric" }));
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    // A shared link pasted into this same tab only changes the #hash, which does not reload the page.
    const onHash = () => apply(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [lang]);

  // Keep the URL in sync so reload, back and "copy link" all carry the estimate.
  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("add");
    url.hash = items.length ? encode({ v: 1, items, s, cur, vat }, { internal }) : "";
    window.history.replaceState(null, "", url);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mirrors the URL for the language links
    setHere(`/calculator${url.search}${url.hash}`);
  }, [ready, items, s, cur, vat, internal]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!removed) return;
    const t = setTimeout(() => setRemoved(null), 6000);
    return () => clearTimeout(t);
  }, [removed]);

  const t = useMemo(() => totals(items, s), [items, s]);
  const f = useMemo(() => makeFmt(cur, s.rate, lang), [cur, s.rate, lang]);
  const g = useMemo(() => displayGrid(t, { cur, rate: s.rate, vat: false }, s), [t, cur, s]);
  const withVat = (n: number) => (vat ? n + vatOf(n) : n);
  /** Hosting table cells: the currency is in the column header, so plain numbers keep it narrow. */
  const n0 = (n: number) => f.num(n);
  const cell = (id: string) => g.items.find((i) => i.uid === id);
  /** Per-user price makes sense for one product only; the one-time sum adds every license and setup. */
  const single = g.items.length === 1 ? g.items[0] : undefined;
  const oneTime = g.items.reduce((a, i) => a + i.license + i.setup, 0);
  /** The same item bought another way, rounded exactly as the card would show it (for the comparison table). */
  const preview = (it: Item) => displayGrid(totals([it], s), { cur, rate: s.rate, vat: false }, s).items[0];
  const counts = items.reduce<Record<string, number>>((a, i) => ({ ...a, [i.pid]: (a[i.pid] ?? 0) + 1 }), {});

  const add = (pid: string) => {
    const item = newItem(pid, uid());
    setItems((xs) => [...xs, item]);
    requestAnimationFrame(() => document.getElementById(`item-${item.uid}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };
  const update = (id: string, patch: Partial<Item>) => setItems((xs) => xs.map((x) => (x.uid === id ? { ...x, ...patch } : x)));
  const remove = (id: string) => {
    const at = items.findIndex((x) => x.uid === id);
    if (at < 0) return;
    setRemoved({ item: items[at], at });
    setItems((xs) => xs.filter((x) => x.uid !== id));
  };
  const undo = () => {
    if (!removed) return;
    setItems((xs) => [...xs.slice(0, removed.at), removed.item, ...xs.slice(removed.at)]);
    setRemoved(null);
  };
  const duplicate = (id: string) =>
    setItems((xs) => {
      const at = xs.findIndex((x) => x.uid === id);
      return at < 0 ? xs : [...xs.slice(0, at + 1), { ...xs[at], uid: uid(), inputs: { ...xs[at].inputs } }, ...xs.slice(at + 1)];
    });
  const toggle = (id: string) =>
    setCollapsed((cs) => {
      const n = new Set(cs);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const copyLink = async () => {
    try {
      // Always a customer link: no internal view, no partner settings.
      const url = new URL(window.location.href);
      url.searchParams.delete("internal");
      url.hash = encode({ v: 1, items, s, cur, vat }, { internal: false });
      await navigator.clipboard.writeText(url.toString());
      setToast(c.copied);
    } catch {
      setToast(c.copyFail);
    }
  };
  const reset = () => {
    if (window.confirm(c.resetConfirm)) setItems([]);
  };

  return (
    <div className="calc">
      <header className="calc-top">
        <div className="calc-wrap calc-top-in">
          <div className="calc-crumbs">
            <Link href={`/${lang}`} className="calc-brand">
              <Image src="/beryl8-logo.svg" alt="Beryl8" width={36} height={28} priority />
              <span>{c.brand}</span>
            </Link>
            <span className="calc-sep" aria-hidden>/</span>
            <span className="calc-crumb">{c.crumb}</span>
          </div>
          <LangSwitch lang={lang} path={here} />
        </div>
      </header>

      <main className="calc-wrap calc-main">
        <div className="calc-intro">
          <h1>{c.h1}</h1>
          <p>{c.lede}</p>
          <details className="calc-how">
            <summary>{c.howH}</summary>
            <ul>
              {c.how.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </details>
          <p className="calc-printdate">{c.printedOn(today)}</p>
          {internal && (
            <p className="calc-internal" role="note">
              <strong>{c.internalBadge}</strong> {c.internalHint}
            </p>
          )}
        </div>

        <div className="calc-grid" data-has-items={items.length > 0 || undefined}>
          <div className="calc-left">
            <section className="calc-add" aria-labelledby="add-h">
              <div className="calc-sechead">
                <h2 id="add-h">{c.addH}</h2>
                <span>{c.addCount(items.length)}</span>
              </div>
              <ul className="calc-catalog" data-compact={items.length > 0 || undefined}>
                {CATALOG.map((p) => {
                  const pr = PRICING[p.id];
                  const Icon = productIcons[p.icon];
                  const n = counts[p.id] ?? 0;
                  return (
                    <li key={p.id}>
                      <button type="button" className="calc-pick" onClick={() => add(p.id)} aria-label={`${n ? c.addAnother : c.add} ${p.name}`}>
                        <span className="calc-ico" aria-hidden>
                          <Icon size={18} strokeWidth={STROKE} />
                        </span>
                        <span className="calc-pick-body">
                          <span className="calc-pick-name">
                            {p.name}
                            {n > 0 && <span className="calc-count">×{n}</span>}
                          </span>
                          <span className="calc-pick-cat">{p.category[lang]}</span>
                          <span className="calc-pick-price">
                            {pr.license !== null ? (
                              <>
                                {f.price(pr.license)} <small>{c.perUser}</small>
                              </>
                            ) : pr.perMinute !== undefined ? (
                              <>
                                {f.unit(pr.perMinute)} <small>{c.perMinute}</small>
                              </>
                            ) : null}
                            {pr.licenseDraft && <span className="calc-tag" title={c.draftHint}>{c.draft}</span>}
                          </span>
                          {pr.fromMonthly !== undefined && <span className="calc-pick-alt">{c.fromMonthly(cur === "USD" ? f.price(pr.fromMonthly) : f.whole(Math.round(f.priceValue(pr.fromMonthly))))}</span>}
                        </span>
                        <Plus className="calc-pick-plus" size={18} strokeWidth={STROKE} aria-hidden />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="calc-items" aria-labelledby="items-h">
              <div className="calc-sechead">
                <h2 id="items-h">{c.itemsH}</h2>
              </div>
              {ready && items.length === 0 && (
                <div className="calc-empty">
                  <p className="calc-empty-h">{c.emptyH}</p>
                  <p>{c.emptyP}</p>
                </div>
              )}
              {t.items.map(({ item, cost }) => (
                <ItemCard
                  key={item.uid}
                  item={item}
                  cost={cost}
                  shown={cell(item.uid)}
                  preview={preview}
                  c={c}
                  f={f}
                  lang={lang}
                  internal={internal}
                  discount={s.discount}
                  open={!collapsed.has(item.uid)}
                  onToggle={() => toggle(item.uid)}
                  onChange={(patch) => update(item.uid, patch)}
                  onRemove={() => remove(item.uid)}
                  onDuplicate={() => duplicate(item.uid)}
                />
              ))}
            </section>
          </div>

          <aside className="calc-summary" id="summary" aria-labelledby="sum-h">
            <div className="calc-sum-in calc-sum-top">
              <div className="calc-sum-head">
                <h2 id="sum-h">{c.summaryH}</h2>
                <div className="calc-seg" role="group" aria-label={c.currency}>
                  {(["THB", "USD"] as Cur[]).map((k) => (
                    <button key={k} type="button" aria-pressed={cur === k} onClick={() => setCur(k)}>
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <p className="calc-run calc-run-main">
                <span>
                  {c.running}
                  {vat && <small className="calc-run-tag">{c.exVat}</small>}
                </span>
                <strong>{f.whole(g.monthly)}</strong>
              </p>
              {(single?.perUser || oneTime > 0) && (
                <p className="calc-run-sub">
                  {single?.perUser && <span>{c.sayPerUser(f.whole(single.perUser.monthly))}</span>}
                  {oneTime > 0 && <span>{c.sayOnce} <strong>{f.whole(oneTime)}</strong></span>}
                </p>
              )}
              {g.monthly > 0 && (
                <dl className="calc-month">
                  {[
                    [c.monthInfra, g.month.cloud],
                    [c.monthAi, g.month.ai],
                    ...(g.month.other > 0 ? [[c.monthOther, g.month.other]] : []),
                  ].map(([label, n]) => (
                    <div key={label as string}>
                      <dt>{label}</dt>
                      <dd>{f.whole(n as number)}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <dl className="calc-big">
                {[
                  [c.firstYear, g.year1],
                  [c.fiveYear, g.tco],
                ].map(([label, ex]) => (
                  <div key={label as string}>
                    <dt>{label}</dt>
                    <dd>{f.whole(withVat(ex as number))}</dd>
                    {vat && (
                      <dd className="calc-vatline" data-ex={ex} data-vat={vatOf(ex as number)}>
                        {c.exVat} {f.whole(ex as number)} + VAT {f.whole(vatOf(ex as number))}
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
              {!vat && <p className="calc-hint calc-big-note">{c.exVatTotal}</p>}
              {g.hosting.total.total > 0 && (
                <p className="calc-run calc-run-host">
                  <span>{c.hostingLine}</span>
                  <strong>{f.whole(g.hosting.total.total)}</strong>
                </p>
              )}

              <label className="calc-check">
                <input type="checkbox" checked={vat} onChange={(e) => setVat(e.target.checked)} />
                {c.vat}
              </label>

              <div className="calc-actions">
                <button type="button" className="calc-btn calc-btn-primary" onClick={copyLink} disabled={!items.length}>
                  <Link2 size={16} strokeWidth={STROKE} aria-hidden />
                  {internal ? c.copyCustomer : c.copy}
                </button>
                <button type="button" className="calc-btn" onClick={() => window.print()} disabled={!items.length}>
                  <Printer size={16} strokeWidth={STROKE} aria-hidden />
                  {c.print}
                </button>
                <button type="button" className="calc-btn calc-btn-quiet" onClick={reset} disabled={!items.length}>
                  <RotateCcw size={16} strokeWidth={STROKE} aria-hidden />
                  {c.reset}
                </button>
              </div>
            </div>
          </aside>
          <section className="calc-sum-in calc-sum-rest" aria-label={c.summaryH}>
            <details className="calc-more">
              <summary>{c.moreShow}</summary>

              {t.items.length > 0 && (
                <>
                  <h3 className="calc-sub">{c.perProduct}</h3>
                  <table className="calc-table">
                    <thead>
                      <tr>
                        <th scope="col"><span className="sr-only">Product</span></th>
                        <th scope="col">{c.firstYear}</th>
                        <th scope="col">{c.fiveYear}</th>
                      </tr>
                    </thead>
                    {vat && <caption className="calc-cap">{c.exVatNote}</caption>}
                    <tbody>
                      {t.items.map(({ item }) => (
                        <tr key={item.uid}>
                          <th scope="row">{byId[item.pid].name}</th>
                          <td>{f.whole(cell(item.uid)?.year1 ?? 0)}</td>
                          <td>{f.whole(cell(item.uid)?.total ?? 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h3 className="calc-sub" id="hosting-h">{c.hostingH}</h3>
                  <p className="calc-hint calc-hint-tight">{c.hostingP}</p>
                  <table className="calc-table calc-host" aria-labelledby="hosting-h">
                    <thead>
                      <tr>
                        <th scope="col">{cur === "THB" ? c.baht : "US$"}</th>
                        <th scope="col">{c.perMonthShort}</th>
                        <th scope="col">{c.perYearShort}</th>
                      </tr>
                    </thead>
                    {g.hosting.rows.map((r, i) => {
                      const { item, cost } = t.items[i];
                      const direct = (g.items[i]?.lines ?? []).filter((l) => l.payer === "direct");
                      // Everything billed by Beryl8 (Meet8 subscription or Google Cloud through Beryl8): nothing paid to providers. Skip here, not in g.hosting.rows (paired by index).
                      if (direct.length === 0) return null;
                      return (
                        <tbody key={r.uid} className="calc-host-group">
                          <tr className="calc-host-prod">
                            <th scope="rowgroup">{byId[item.pid].name}</th>
                            <td>{n0(r.total)}</td>
                            <td>{n0(r.total * 12)}</td>
                          </tr>
                          {showHost && direct.map((l) => {
                            const src = cost.lines.find((x) => x.id === l.id);
                            const label = (src?.label[lang] ?? l.id).replace(/^Google Cloud · /, "");
                            return (
                              <tr key={l.id} className="calc-host-line">
                                <th scope="row">
                                  <span className="calc-kind" data-kind={l.kind === "cloud" ? "gcp" : l.kind === "ai" ? "ai" : "other"}>
                                    {l.kind === "cloud" ? "GCP" : l.kind === "ai" ? "AI" : c.hostOther}
                                  </span>
                                  {label}
                                  {src?.detail && <small>{src.detail[lang]}</small>}
                                </th>
                                <td>{n0(l.sell)}</td>
                                <td>{n0(l.sell * 12)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      );
                    })}
                    <tfoot>
                      {(
                        [
                          [c.gcpName, g.hosting.total.cloud],
                          [c.aiName, g.hosting.total.ai],
                          [c.hostOther, g.hosting.total.other],
                        ] as const
                      ).map(([label, v]) => (
                        <tr key={label} className="calc-vatrow">
                          <th scope="row">{c.sumOf(label)}</th>
                          <td>{n0(v)}</td>
                          <td>{n0(v * 12)}</td>
                        </tr>
                      ))}
                      <tr className="calc-host-total">
                        <th scope="row">{c.colTotal}</th>
                        <td>{n0(g.hosting.total.total)}</td>
                        <td>{n0(g.hosting.total.total * 12)}</td>
                      </tr>
                    </tfoot>
                  </table>
                  {g.hosting.total.total > 0 && (
                    <button type="button" className="calc-btn calc-btn-quiet calc-host-toggle" aria-expanded={showHost} onClick={() => setShowHost(!showHost)}>
                      {showHost ? c.hostHide : c.hostShow}
                    </button>
                  )}
                  <label className="calc-check">
                    <input type="checkbox" checked={s.cud} onChange={(e) => setS({ ...s, cud: e.target.checked })} />
                    <span>
                      {c.cud}
                      <small>{c.cudHint}</small>
                    </span>
                  </label>
                  <ul className="calc-host-notes">
                    {c.hostingNotes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>

                  <h3 className="calc-sub">{c.byYear}</h3>
                  <table className="calc-table calc-years">
                    <thead>
                      <tr>
                        <th scope="col"><span className="sr-only">{c.byYear}</span></th>
                        <th scope="col">{c.colBeryl8}</th>
                        <th scope="col">{c.colDirect}</th>
                        <th scope="col">{c.colTotal}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.years.map((y, i) => (
                        <tr key={i}>
                          <th scope="row">{c.year(i + 1)}</th>
                          <td>{f.whole(y.beryl8)}</td>
                          <td>{f.whole(y.direct)}</td>
                          <td>{f.whole(y.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th scope="row">{c.fiveYear}</th>
                        <td>{f.whole(g.foot.beryl8)}</td>
                        <td>{f.whole(g.foot.direct)}</td>
                        <td>{f.whole(g.foot.total)}</td>
                      </tr>
                      {vat && (
                        <>
                          <tr className="calc-vatrow">
                            <th scope="row">VAT 7%</th>
                            <td />
                            <td />
                            <td>{f.whole(vatOf(g.foot.total))}</td>
                          </tr>
                          <tr className="calc-vatrow">
                            <th scope="row">{c.inclVat}</th>
                            <td />
                            <td />
                            <td>{f.whole(withVat(g.foot.total))}</td>
                          </tr>
                        </>
                      )}
                    </tfoot>
                  </table>
                </>
              )}

              <details className="calc-settings">
                <summary>
                  {c.settings}
                  <ChevronDown size={16} strokeWidth={STROKE} aria-hidden />
                </summary>
                <div className="calc-fields">
                  <NumField label={c.rate} value={s.rate} min={1} max={1000} step={0.5} invalid={c.invalid} keep={(v) => c.keep(String(v))} overMax={(v) => c.overMax(String(v))} onChange={(v) => setS({ ...s, rate: v })} />
                  <NumField label={c.dayRate} value={s.dayRate} step={1000} invalid={c.invalid} keep={(v) => c.keep(f.num(v))} onChange={(v) => setS({ ...s, dayRate: v })} />
                  {internal && (
                    <>
                      <NumField label={c.discountIn} value={s.discount} max={100} step={1} invalid={c.invalid} keep={(v) => c.keep(`${v}%`)} overMax={(v) => c.overMax(`${v}%`)} onChange={(v) => setS({ ...s, discount: v })} />
                      <label className="calc-check">
                        <input type="checkbox" checked={s.viaPartner} onChange={(e) => setS({ ...s, viaPartner: e.target.checked })} />
                        {c.viaPartner}
                      </label>
                      {s.viaPartner && (
                        <NumField label={c.partner} value={s.partner} max={100} step={5} invalid={c.invalid} keep={(v) => c.keep(`${v}%`)} overMax={(v) => c.overMax(`${v}%`)} onChange={(v) => setS({ ...s, partner: v })} />
                      )}
                    </>
                  )}
                </div>
              </details>

              {internal && t.items.length > 0 && (
                <div className="calc-int">
                  <h3 className="calc-sub">{c.internalH}</h3>
                  <dl>
                    <div><dt>{c.revenue}</dt><dd>{f.whole(g.internal.revenue)}</dd></div>
                    {s.viaPartner && <div><dt>{c.partnerShare}</dt><dd>−{f.whole(g.internal.partnerShare)}</dd></div>}
                    <div><dt>{c.usageCost}</dt><dd>−{f.whole(g.internal.usageCost)}</dd></div>
                    <div className="calc-int-net"><dt>{c.net}</dt><dd>{f.whole(g.internal.net)}</dd></div>
                    {t.internal.usageCost > 0 && (
                      <div><dt>{c.usageMargin}</dt><dd>{Math.round(t.internal.usageMargin * 100)}%</dd></div>
                    )}
                  </dl>
                </div>
              )}

            </details>
              <p className="calc-fine">
                {vat ? c.vatOn : c.vatOff} · {c.fine}
              </p>
          </section>
        </div>
      </main>

      {items.length > 0 && (
        <div className="calc-bar">
          <div>
            <span>{c.perMonth}{vat ? ` · ${c.exVat}` : ""}</span>
            <strong>{f.whole(g.monthly)}</strong>
          </div>
          <div>
            <span>{c.firstYear}</span>
            <strong>{f.whole(withVat(g.year1))}</strong>
          </div>
          <a href="#summary" className="calc-btn calc-btn-primary">{c.viewSummary}</a>
        </div>
      )}

      <div className="calc-toasts" aria-live="polite">
        {removed && (
          <div className="calc-toast">
            {c.removed(byId[removed.item.pid].name)}
            <button type="button" onClick={undo}>{c.undo}</button>
            <button type="button" className="calc-toast-x" onClick={() => setRemoved(null)} aria-label="Dismiss">
              <X size={16} strokeWidth={STROKE} aria-hidden />
            </button>
          </div>
        )}
        {toast && <div className="calc-toast">{toast}</div>}
      </div>
    </div>
  );
}

function ItemCard(props: {
  item: Item;
  cost: ItemCost;
  shown?: ShownItem;
  preview: (it: Item) => ShownItem | undefined;
  c: CalcCopy;
  f: Fmt;
  lang: Locale;
  internal: boolean;
  discount: number;
  open: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<Item>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  const { item, cost, c, f, lang, internal, discount, open } = props;
  const p = byId[item.pid];
  const pr = PRICING[item.pid];
  const Icon = productIcons[p.icon];
  const bodyId = `body-${item.uid}`;
  const billed = billedUsers(item);
  const lic = licenseOf(item);
  const vals = values(item);
  const visible = pr.inputs.filter((inp) => !inp.when || inp.when(vals));
  const compareInput = pr.inputs.find((inp) => inp.compare);
  /** Usage every comparison row is priced at: what this card uses now. */
  const usage = pr.monthlyHours?.(vals, billed);
  /** Changing how the product is bought keeps the same usage; any other choice just sets its value. */
  const switchInputs = (id: string, k: number) =>
    id === compareInput?.id && pr.switchTo ? pr.switchTo(vals, billed, k) : { ...item.inputs, [id]: k };
  const sh = props.shown;
  const shownLine = (id: string) => sh?.lines.find((l) => l.id === id);
  const beryl8Lines = cost.lines.filter((l) => l.payer === "beryl8");
  const directLines = cost.lines.filter((l) => l.payer === "direct");

  return (
    <article className="calc-item" id={`item-${item.uid}`} aria-label={p.name}>
      <header className="calc-item-head">
        <button type="button" className="calc-item-toggle" aria-expanded={open} aria-controls={bodyId} onClick={props.onToggle}>
          <span className="calc-ico" aria-hidden>
            <Icon size={18} strokeWidth={STROKE} />
          </span>
          <span className="calc-item-title">
            <span className="calc-item-name">
              {p.name}
              {pr.licenseDraft && <span className="calc-tag" title={c.draftHint}>{c.draft}</span>}
            </span>
            <span className="calc-item-meta">
              {lic !== null ? `${f.num(billed)} ${pr.unitLabel[lang]}` : p.category[lang]}
            </span>
          </span>
          <span className="calc-item-tot">
            <span className="calc-item-month">
              {c.perMonth} <strong>{f.whole(sh ? sh.monthlyBeryl8 + sh.monthlyDirect : 0)}</strong>
              {!open && sh?.perUser && <small>{f.whole(sh.perUser.monthly)} {c.perUserShort}</small>}
            </span>
            {/* Open cards say the rest in their price sentence; a closed card keeps its totals in view. */}
            {!open && <span>{c.firstYear} <strong>{f.whole(sh?.year1 ?? 0)}</strong></span>}
            {!open && <span>{c.fiveYear} <strong>{f.whole(sh?.total ?? 0)}</strong></span>}
          </span>
          <ChevronDown className="calc-chev" size={18} strokeWidth={STROKE} aria-hidden />
          <span className="sr-only">{open ? c.collapse : c.expand}</span>
        </button>
        <div className="calc-item-tools">
          <button type="button" className="calc-icon-btn" onClick={props.onDuplicate} aria-label={c.duplicate(p.name)} title={c.duplicate(p.name)}>
            <Copy size={16} strokeWidth={STROKE} aria-hidden />
          </button>
          <button type="button" className="calc-icon-btn" onClick={props.onRemove} aria-label={c.remove(p.name)} title={c.remove(p.name)}>
            <Trash2 size={16} strokeWidth={STROKE} aria-hidden />
          </button>
        </div>
      </header>

      <div className="calc-item-body" id={bodyId} hidden={!open}>
        {sh && (
          <p className="calc-say">
            {lic !== null && <>{c.sayUsers(f.num(billed))} </>}
            {c.sayPay} <strong>{f.whole(sh.monthlyBeryl8 + sh.monthlyDirect)}</strong> {c.sayMonth}
            {sh.perUser && <> ({c.sayPerUser(f.whole(sh.perUser.monthly))})</>}
            {sh.license + sh.setup > 0 && (
              <>
                {" "}{c.sayOnce} <strong>{f.whole(sh.license + sh.setup)}</strong> ({sh.license > 0 && sh.setup > 0 ? c.sayLicenseSetup : sh.license > 0 ? c.license : c.impl})
              </>
            )}
            {sh.ma > 0 && <> {c.sayMa(f.whole(sh.ma))}</>}
          </p>
        )}
        {visible.map(({ id, label, choices, compare, dropdown }) => choices && !compare && !dropdown && (
          <fieldset key={id} className="calc-size">
            <legend>{label[lang]}</legend>
            <div className="calc-size-opts">
              {choices.map((choice, k) => {
                const on = choiceIndex(vals[id], choices.length) === k;
                return (
                  <label key={k} className="calc-size-opt" data-on={on || undefined}>
                    <input type="radio" name={`${id}-${item.uid}`} checked={on} onChange={() => props.onChange({ inputs: switchInputs(id, k) })} />
                    <span>{choice[lang]}</span>
                  </label>
                );
              }).reverse()}
            </div>
          </fieldset>
        ))}

        {compareInput?.choices && (() => {
          const rows = compareInput.choices.map((choice, k) => {
            const it = { ...item, inputs: switchInputs(compareInput.id, k) };
            const v = props.preview(it);
            return { k, choice, monthly: v ? v.monthlyBeryl8 + v.monthlyDirect : 0, year1: v?.year1 ?? 0, total: v?.total ?? 0, perUser: v?.perUser?.monthly };
          });
          const cheapest = (key: "monthly" | "total") => rows.reduce((a, r) => (r[key] < a[key] ? r : a)).k;
          const cheapMonth = cheapest("monthly");
          const cheap5 = cheapest("total");
          return (
            <div className="calc-compare-wrap" role="group" aria-labelledby={`cmp-${item.uid}`}>
              <h4 className="calc-compare-h" id={`cmp-${item.uid}`}>
                {compareInput.label[lang]}
                {usage !== undefined && <small>{c.compareAt(f.num(usage))}</small>}
              </h4>
              <div className="calc-scroll">
                <table className="calc-table calc-compare">
                  <thead>
                    <tr>{c.compareCols.map((h, k) => <th key={k} scope="col">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {[...rows].reverse().map((r) => {
                      const on = choiceIndex(vals[compareInput.id], rows.length) === r.k;
                      return (
                        <tr key={r.k} data-on={on || undefined}>
                          <th scope="row">
                            <button type="button" className="calc-compare-pick" aria-pressed={on} onClick={() => props.onChange({ inputs: switchInputs(compareInput.id, r.k) })}>
                              <span className="calc-compare-radio" aria-hidden />
                              <span>
                                {r.choice[lang]}
                                {compareInput.hints?.[r.k] && <small className="calc-compare-hint">{compareInput.hints[r.k][lang]}</small>}
                                {(r.k === cheapMonth || r.k === cheap5) && (
                                  <span className="calc-badges">
                                    {r.k === cheapMonth && <span className="calc-badge">{c.cheapMonth}</span>}
                                    {r.k === cheap5 && <span className="calc-badge">{c.cheap5}</span>}
                                  </span>
                                )}
                              </span>
                            </button>
                          </th>
                          <td data-label={c.compareCols[1]}>{f.whole(r.monthly)}</td>
                          <td data-label={c.compareCols[2]}>{f.whole(r.year1)}</td>
                          <td data-label={c.compareCols[3]}>{f.whole(r.total)}</td>
                          <td data-label={c.compareCols[4]}>{r.perUser !== undefined ? f.whole(r.perUser) : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

        {pr.inputs.some((inp) => inp.dropdown) && (
          <div className="calc-fields calc-fields-grid calc-fields-pick">
          {pr.inputs.filter((inp) => inp.dropdown && inp.choices).map((inp) => (
            <SelectField
              key={inp.id}
              label={inp.label[lang]}
              options={inp.choices!.map((ch) => ch[lang])}
              value={optionIndex(item.inputs[inp.id] ?? inp.def, inp.choices!.length)}
              onChange={(k) => props.onChange({ inputs: { ...item.inputs, [inp.id]: k } })}
            />
          ))}
          </div>
        )}
        <div className="calc-fields calc-fields-grid">
          {lic !== null && (
            <NumField
              label={`${c.users}`}
              value={item.users}
              max={1000000}
              step={5}
              suffix={pr.unitLabel[lang]}
              hint={item.users < MIN_USERS ? c.billedAs(f.num(billed)) : c.minUsers}
              warn={item.users < MIN_USERS}
              invalid={c.invalid}
              keep={(v) => c.keep(`${f.num(Math.max(MIN_USERS, Math.round(v)))} ${pr.unitLabel[lang]}`)}
              overMax={(v) => c.overMax(f.num(v))}
              onChange={(v) => props.onChange({ users: v })}
            />
          )}
          {visible.filter((inp) => !inp.choices).map((inp) => (
            <NumField
              key={inp.id}
              label={inp.label[lang]}
              value={item.inputs[inp.id] ?? inp.def}
              max={inp.max}
              step={inp.step ?? 1}
              suffix={inp.unit[lang]}
              hint={inp.help?.[lang]}
              invalid={c.invalid}
              keep={(v) => c.keep(`${f.num(v)} ${inp.unit[lang]}`.trim())}
              overMax={(v) => c.overMax(`${f.num(v)} ${inp.unit[lang]}`.trim())}
              onChange={(v) => props.onChange({ inputs: { ...item.inputs, [inp.id]: v } })}
            />
          ))}
        </div>

        {(() => {
          const w = pr.warning?.(values(item));
          return w && (
            <p className="calc-warn" role="alert">
              <TriangleAlert size={16} strokeWidth={STROKE} aria-hidden />
              <span>{w[lang]}</span>
            </p>
          );
        })()}

        {pr.sizes && (
          <fieldset className="calc-size">
            <legend>{c.sizeLabel}</legend>
            <div className="calc-size-opts">
              {(["lean", "standard"] as const).map((k) => (
                <label key={k} className="calc-size-opt" data-on={item.size === k || undefined}>
                  <input type="radio" name={`size-${item.uid}`} checked={item.size === k} onChange={() => props.onChange({ size: k })} />
                  <span>{pr.sizes![k][lang]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {!pr.noSetup?.(vals) && (
        <label className="calc-check">
          <input type="checkbox" checked={item.setup} onChange={(e) => props.onChange({ setup: e.target.checked })} />
          <span>
            {c.setup(setupDaysOf(item))}
            <small>{c.setupHint}</small>
          </span>
        </label>
        )}

        <details className="calc-break-wrap">
          <summary>{c.breakdownShow}</summary>
        <div className="calc-break">
          <BreakGroup title={c.oneTime}>
            {lic !== null && lic > 0 && (
              <Row
                label={c.license}
                detail={`${f.num(billed)} × ${f.price(lic)}${discount > 0 ? ` · ${c.discount(discount)}` : ""}`}
                value={f.whole(sh?.license ?? 0)}
              />
            )}
            {sh && sh.setup > 0 && <Row label={c.impl} detail={c.days(setupDaysOf(item))} value={f.whole(sh?.setup ?? 0)} />}
            {!(lic !== null && lic > 0) && !(sh && sh.setup > 0) && <Row label={c.none} value="—" />}
          </BreakGroup>

          {lic !== null && lic > 0 && (
            <BreakGroup title={c.yearly}>
              <Row label={c.ma} value={f.whole(sh?.ma ?? 0)} />
            </BreakGroup>
          )}

          <BreakGroup title={`${c.monthly} · ${c.byBeryl8}`}>
            {beryl8Lines.length === 0 && <Row label={c.none} value="—" />}
            <Lines lines={beryl8Lines} shownLine={shownLine} f={f} c={c} lang={lang} internal={internal} />
          </BreakGroup>

          <BreakGroup title={`${c.monthly} · ${c.direct}`}>
            {directLines.length === 0 && <Row label={c.none} value="—" />}
            <Lines lines={directLines} shownLine={shownLine} f={f} c={c} lang={lang} internal={false} />
          </BreakGroup>

          {sh?.perUser && (
            <BreakGroup title={c.perUserH}>
              <Row label={c.perUserMonthly} detail={c.perUserMonthlyHint} value={f.whole(sh.perUser.monthly)} />
              <Row label={c.perUserAvg} detail={c.perUserAvgHint} value={f.whole(sh.perUser.avgMonthly)} />
            </BreakGroup>
          )}
        </div>
        </details>

        {pr.notes.length > 0 && (
          <ul className="calc-notes" aria-label={c.notes}>
            {pr.notes.map((n) => (
              <li key={n.en}>{n[lang]}</li>
            ))}
          </ul>
        )}
        {pr.asOf && <p className="calc-asof">{pr.asOf}</p>}
      </div>
    </article>
  );
}

function BreakGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="calc-bgroup">
      <h4>{title}</h4>
      <dl>{children}</dl>
    </div>
  );
}

function Row({ label, detail, value, extra }: { label: ReactNode; detail?: string; value: string; extra?: ReactNode }) {
  return (
    <div className="calc-row">
      <dt>
        {label}
        {detail && <small>{detail}</small>}
        {extra}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}

/** Rows of one payer. Three or more Google Cloud services fold into one subtotal row that opens on request. */
function Lines({ lines, shownLine, f, c, lang, internal }: { lines: Line[]; shownLine: (id: string) => { sell: number; cost: number } | undefined; f: Fmt; c: CalcCopy; lang: Locale; internal: boolean }) {
  const cloud = lines.filter((l) => l.kind === "cloud");
  const fold = cloud.length >= 3;
  const rest = fold ? lines.filter((l) => l.kind !== "cloud") : lines;
  const sum = (k: "sell" | "cost") => cloud.reduce((a, l) => a + (shownLine(l.id)?.[k] ?? 0), 0);
  return (
    <>
      {rest.map((l) => (
        <LineRow key={l.id} l={l} shown={shownLine(l.id)} f={f} c={c} lang={lang} internal={internal} />
      ))}
      {fold && (
        <div className="calc-row calc-row-group">
          <details>
            <summary>
              <span className="calc-group-label">
                {c.cloudGroup(cloud.length)}
                {cloud.some((l) => l.draft) && <span className="calc-tag" title={c.draftHint}>{c.draft}</span>}
                <small>{c.cloudShow}</small>
                {internal && <small className="calc-cost">{c.cost} {f.whole(sum("cost"))} · {c.margin} {sum("sell") > 0 ? Math.round(((sum("sell") - sum("cost")) / sum("sell")) * 100) : 0}%</small>}
              </span>
              <span className="calc-group-value">{f.whole(sum("sell"))}</span>
            </summary>
            <dl>
              {cloud.map((l) => (
                <LineRow key={l.id} l={l} shown={shownLine(l.id)} f={f} c={c} lang={lang} internal={internal} />
              ))}
            </dl>
          </details>
        </div>
      )}
    </>
  );
}

function LineRow({ l, shown, f, c, lang, internal }: { l: Line; shown?: { sell: number; cost: number }; f: Fmt; c: CalcCopy; lang: Locale; internal: boolean }) {
  const sell = shown?.sell ?? 0;
  const cost = shown?.cost ?? 0;
  const margin = sell > 0 ? Math.round(((sell - cost) / sell) * 100) : 0;
  return (
    <Row
      label={
        <>
          {l.label[lang]}
          {l.draft && <span className="calc-tag" title={c.draftHint}>{c.draft}</span>}
        </>
      }
      detail={l.detail?.[lang]}
      value={f.whole(sell)}
      extra={internal && <small className="calc-cost">{c.cost} {f.whole(cost)} · {c.margin} {margin}%</small>}
    />
  );
}

/** Number input that lets people clear and retype; only valid numbers reach the estimate. */
/** Drop-down with a styled list (a native <select> list cannot be styled). Keyboard: arrows, Home/End, Enter/Space, Escape. */
function SelectField(props: { label: string; options: string[]; value: number; onChange: (k: number) => void }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(props.value);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const last = props.options.length - 1;

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const show = () => { setActive(props.value); setOpen(true); };
  const pick = (k: number) => { props.onChange(k); setOpen(false); button.current?.focus(); };
  const onKey = (e: React.KeyboardEvent) => {
    const move: Record<string, number> = { ArrowDown: Math.min(last, active + 1), ArrowUp: Math.max(0, active - 1), Home: 0, End: last };
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); show(); }
      return;
    }
    if (e.key in move) { e.preventDefault(); setActive(move[e.key]); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(active); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    else if (e.key === "Tab") setOpen(false);
  };

  return (
    <div className="calc-field calc-dd" ref={root} data-open={open || undefined}>
      <span className="calc-dd-label" id={`${id}-l`}>{props.label}</span>
      <button
        ref={button}
        type="button"
        role="combobox"
        className="calc-input calc-dd-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-l ${id}-v`}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKey}
      >
        <span id={`${id}-v`}>{props.options[props.value]}</span>
        <ChevronDown className="calc-dd-chev" size={16} strokeWidth={STROKE} aria-hidden />
      </button>
      {open && (
        <ul className="calc-dd-list" role="listbox" id={`${id}-list`} aria-labelledby={`${id}-l`}>
          {props.options.map((o, k) => (
            <li
              key={k}
              id={`${id}-${k}`}
              role="option"
              aria-selected={k === props.value}
              data-active={k === active || undefined}
              onPointerEnter={() => setActive(k)}
              onClick={() => pick(k)}
            >
              <span>{o}</span>
              {k === props.value && <Check size={16} strokeWidth={STROKE} aria-hidden />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NumField(props: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  hint?: string;
  warn?: boolean;
  invalid: string;
  /** Says which value the estimate still uses while the field holds something it cannot use. */
  keep?: (v: number) => string;
  /** Says the limit used when the typed value is above `max`. */
  overMax?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  const { value, min = 0, max = Number.MAX_SAFE_INTEGER } = props;
  const [text, setText] = useState(String(value));
  const [lastValue, setLastValue] = useState(value);
  // Follow outside changes (duplicate, share link) without clobbering what is being typed.
  if (value !== lastValue) {
    setLastValue(value);
    if (Number(text) !== value) setText(String(value));
  }
  const n = text.trim() === "" ? NaN : Number(text);
  const bad = !Number.isFinite(n) || n < min;
  const over = !bad && n > max;
  const msg = bad ? [props.invalid, props.keep?.(value)].filter(Boolean).join(" · ") : over && props.overMax ? props.overMax(max) : props.hint;

  return (
    <div className="calc-field" data-bad={bad || undefined}>
      <label htmlFor={id}>{props.label}</label>
      <div className="calc-input">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={props.step}
          value={text}
          aria-invalid={bad || undefined}
          aria-describedby={msg ? `${id}-m` : undefined}
          onChange={(e) => {
            setText(e.target.value);
            const v = Number(e.target.value);
            if (e.target.value.trim() !== "" && Number.isFinite(v) && v >= min) {
              const clamped = Math.min(max, v);
              setLastValue(clamped);
              props.onChange(clamped);
            }
          }}
          onBlur={() => {
            if (bad) setText(String(value));
            else if (n > max) setText(String(max));
          }}
        />
        {props.suffix && <span className="calc-suffix">{props.suffix}</span>}
      </div>
      {msg && (
        <p id={`${id}-m`} className="calc-fhint" data-warn={((props.warn || over) && !bad) || undefined}>
          {msg}
        </p>
      )}
    </div>
  );
}

