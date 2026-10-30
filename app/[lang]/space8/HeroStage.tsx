"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { PersonId, SceneStrings, Space8Content } from "./content";
import { Icon, type IconName } from "./icons";
import { MapScene } from "./MapScene";

type Tab = "office" | "meet" | "chat";
const TABS: { id: Tab; icon: IconName }[] = [
  { id: "office", icon: "building" },
  { id: "meet", icon: "users" },
  { id: "chat", icon: "message" },
];

// meeting tiles: person, sprite row, tile colour
const PEOPLE: [PersonId, number, string][] = [
  ["guy", 4, "#c9d6f5"],
  ["fon", 5, "#f2d9cf"],
  ["tee", 2, "#d3ecd9"],
  ["mind", 1, "#efe2c4"],
  ["me", 0, "#d9d4f3"],
  ["prae", 3, "#cfe6ec"],
];
// chat thread: person, sprite row (-1 = AI agent), time
const MSGS: [PersonId, number, string][] = [
  ["ton", 0, "09:41"],
  ["mind", 1, "09:42"],
  ["boss", 2, "09:42"],
  ["bot", -1, "09:43"],
];

const onlineDot: CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#30db72",
  display: "inline-block",
};

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function HeroStage({ t, scene }: { t: Space8Content["stage"]; scene: SceneStrings }) {
  const [tab, setTab] = useState<Tab>("office");
  const [speaking, setSpeaking] = useState(0);
  const [shown, setShown] = useState(0);
  const played = useRef(false);
  const chatTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const tabEls = useRef<(HTMLButtonElement | null)[]>([]);

  // meeting tiles: rotate who is speaking
  useEffect(() => {
    if (prefersReduced()) return;
    let sp = 0;
    const id = setInterval(() => {
      sp = [0, 1, 3, 0, 4][++sp % 5];
      setSpeaking(sp);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const timers = chatTimers.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const playChat = () => {
    if (played.current) return;
    played.current = true;
    if (prefersReduced()) {
      setShown(MSGS.length);
      return;
    }
    MSGS.forEach((_, i) => chatTimers.current.push(setTimeout(() => setShown(i + 1), i * 650)));
  };

  const showTab = (next: Tab, focus?: boolean) => {
    setTab(next);
    if (next === "chat") playChat();
    if (focus) tabEls.current[TABS.findIndex((x) => x.id === next)]?.focus();
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
    showTab(n.id, true);
  };

  return (
    <div className="stage">
      <div className="mock">
        <div className="mock-top">
          {tab === "office" && (
            <>
              <span className="chip">
                <Icon name="map" />
                {t.tops.officeMap}
              </span>
              <span className="grow" />
              <span className="chip">
                <span style={onlineDot} />
                {t.tops.online}
              </span>
            </>
          )}
          {tab === "meet" && (
            <>
              <span className="chip">
                <Icon name="calendar" />
                {t.tops.meetTitle}
              </span>
              <span className="chip" title={t.tops.roomLocked}>
                <Icon name="lock" />
              </span>
              <span className="grow" />
              <span className="chip rec">{t.tops.recording}</span>
            </>
          )}
          {tab === "chat" && (
            <>
              <span className="chip">
                <Icon name="message" />
                {t.tops.chat}
              </span>
              <span className="grow" />
              <span className="chip">{t.tops.rooms}</span>
            </>
          )}
        </div>
        <div className="panes">
          <div className="pane" id="pane-office" role="tabpanel" aria-labelledby="tab-office" hidden={tab !== "office"}>
            <MapScene view={[240, 180, 800, 560]} strings={scene} ariaLabel={t.sceneLabel} />
          </div>
          <div className="pane" id="pane-meet" role="tabpanel" aria-labelledby="tab-meet" hidden={tab !== "meet"}>
            <div className="vgrid">
              {PEOPLE.map(([n, r, c], i) => (
                <div
                  key={n}
                  className={"vtile" + (i === speaking ? " speaking" : "")}
                  style={{ "--bgc": c } as CSSProperties}
                >
                  <div className="portrait" style={{ backgroundPosition: `0% ${r * 20}%` }} />
                  <span className="vname">
                    {i === 2 || i === 5 ? <Icon name="micoff" /> : null}
                    {scene.n[n]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="pane" id="pane-chat" role="tabpanel" aria-labelledby="tab-chat" hidden={tab !== "chat"}>
            <div className="chat">
              <div className="chat-side">
                <div className="lbl">{t.chatSide.rooms}</div>
                <div className="ch on">
                  <span className="av" style={{ backgroundPosition: "0% 0%" }} />
                  {t.chatSide.room1}
                </div>
                <div className="ch">
                  <span className="av" style={{ backgroundPosition: "0% 60%" }} />
                  {t.chatSide.room2}
                </div>
                <div className="ch">
                  <span className="av" style={{ backgroundPosition: "0% 80%" }} />
                  {t.chatSide.room3}
                </div>
                <div className="lbl">{t.chatSide.agents}</div>
                <div className="ch">
                  <span className="ai">
                    <Icon name="bot" />
                  </span>
                  {t.chatSide.bot}
                </div>
              </div>
              <div className="chat-main">
                <div className="chat-head">
                  {t.chatHead} <small>{t.chatHeadSub}</small>
                </div>
                <div className="msgs">
                  {MSGS.slice(0, shown).map(([n, r, tm], i) => (
                    <div className="msg" key={i}>
                      {r < 0 ? (
                        <span className="ai">
                          <Icon name="bot" />
                        </span>
                      ) : (
                        <span className="av" style={{ backgroundPosition: `0% ${r * 20}%` }} />
                      )}
                      <div>
                        <b>{scene.n[n]}</b>
                        <time>{tm}</time>
                        <p>{t.msgs[i]}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="composer">
                  {t.composer} <Icon name="send" />
                </div>
              </div>
            </div>
          </div>
          <div className="dock" hidden={tab === "chat"}>
            <span className="dk off">
              <Icon name="micoff" />
              {t.dock.mic}
            </span>
            <span className="dk">
              <Icon name="video" />
              {t.dock.camera}
            </span>
            <span className="dk">
              <Icon name="monitor" />
              {t.dock.share}
            </span>
            <span className="dk">
              <Icon name="smile" />
              {t.dock.react}
            </span>
            <span className="dk">
              <Icon name="message" />
              {t.dock.chat}
            </span>
            <span className="dk-sep" />
            <span className="dk leave">
              <Icon name="logout" />
              {t.dock.leave}
            </span>
          </div>
        </div>
      </div>
      <div className="tabs" role="tablist" aria-label={t.tabsLabel}>
        {TABS.map((x, i) => {
          const on = tab === x.id;
          return (
            <button
              key={x.id}
              ref={(node) => {
                tabEls.current[i] = node;
              }}
              className="tab"
              role="tab"
              type="button"
              id={`tab-${x.id}`}
              aria-controls={`pane-${x.id}`}
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => showTab(x.id)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <Icon name={x.icon} />
              {t.tabs[x.id]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
