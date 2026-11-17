import { useEffect, useLayoutEffect, useRef, useState } from "react";

const EASE_MS = 450;

export const sunLifeHeadline = {
  step: 1600,
  clauses: [
    { before: "Turning", after: "" },
    { before: "into", after: " so teams" },
    { before: "can make", after: "." },
  ],
  states: [
    [
      { text: "scattered trackers", icon: "scatter" },
      { text: "connected systems", icon: "nodes" },
      { text: "better decisions", icon: "check" },
    ],
    [
      { text: "manual reporting", icon: "chart" },
      { text: "centralized tools", icon: "hub" },
      { text: "faster updates", icon: "rising" },
    ],
    [
      { text: "disconnected workflows", icon: "branches" },
      { text: "simpler processes", icon: "path" },
      { text: "work smarter", icon: "spark" },
    ],
    [
      { text: "scattered information", icon: "layers" },
      { text: "useful products", icon: "box" },
      { text: "clearer progress", icon: "rising" },
    ],
  ],
};

function stableSentence(copy) {
  const state = copy.states[0];
  return copy.clauses
    .map((clause, index) => `${clause.before} ${state[index].text}${clause.after}`.trim())
    .join(" ");
}

const tilts = {
  nodes: { rest: -8, from: -2, peak: -18 },
  branches: { rest: 10, from: 10, peak: 10 },
  spark: { rest: -11, from: -4, peak: -22 },
  hub: { rest: 7, from: 7, peak: 7 },
  chart: { rest: 9, from: 2, peak: 18 },
  rising: { rest: -7, from: -7, peak: -7 },
  box: { rest: -10, from: -3, peak: -20 },
  scatter: { rest: 8, from: 2, peak: 16 },
  path: { rest: -9, from: -9, peak: -9 },
  layers: { rest: 11, from: 11, peak: 11 },
  check: { rest: -8, from: -1, peak: -17 },
};

function Glyph({ name, pop = false }) {
  const tilt = tilts[name];
  return (
    <svg
      className={pop ? "cycle-pill-icon is-pop" : "cycle-pill-icon"}
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
      style={{
        "--sticker-rest": `${tilt.rest}deg`,
        "--sticker-from": `${tilt.from}deg`,
        "--sticker-peak": `${tilt.peak}deg`,
      }}
    >
      <g stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" paintOrder="stroke fill">
        {glyphs[name]}
      </g>
    </svg>
  );
}

const glyphs = {
  nodes: (
    <>
      <rect x="1.2" y="5.2" width="10" height="9.2" rx="2.8" fill="#5B6CFF" />
      <rect x="8.4" y="5.6" width="10.2" height="9" rx="2.8" fill="#45C8FF" />
      <rect x="3.2" y="8.4" width="4.6" height="1.7" rx="0.85" fill="#fff" />
    </>
  ),
  branches: (
    <>
      <circle cx="6.4" cy="13.4" r="4.6" fill="#FF7A45" />
      <circle cx="13.8" cy="6.2" r="4.8" fill="#FFB020" />
      <circle cx="13.4" cy="14.2" r="4" fill="#FF5D73" />
    </>
  ),
  spark: (
    <>
      <path d="M10 1.4l1.8 5.2 5.4.2-4.3 3.4 1.6 5.4L10 12.4 5.5 15.6l1.6-5.4L2.8 6.8l5.4-.2L10 1.4z" fill="#2EC4B6" />
      <circle cx="15.4" cy="15.2" r="3" fill="#F6C445" />
    </>
  ),
  hub: (
    <>
      <rect x="1.2" y="1.2" width="5.4" height="5.4" rx="1.7" fill="#C4B5FD" />
      <rect x="13.4" y="1.2" width="5.4" height="5.4" rx="1.7" fill="#A78BFA" />
      <rect x="1.2" y="13.4" width="5.4" height="5.4" rx="1.7" fill="#A78BFA" />
      <rect x="13.4" y="13.4" width="5.4" height="5.4" rx="1.7" fill="#C4B5FD" />
      <rect x="5.4" y="5.4" width="9.2" height="9.2" rx="2.8" fill="#7C5CFF" />
    </>
  ),
  chart: (
    <>
      <rect x="1.8" y="11.2" width="4.6" height="6.6" rx="1.5" fill="#FBBF24" />
      <rect x="7.6" y="6.2" width="4.6" height="11.6" rx="1.5" fill="#F59E0B" />
      <rect x="13.4" y="2.2" width="4.6" height="15.6" rx="1.5" fill="#F97316" />
    </>
  ),
  rising: (
    <>
      <path d="M3 16.2h4.4L10 6.4l2.6 9.8H17L10 2.2 3 16.2z" fill="#2563EB" />
      <circle cx="15.2" cy="5" r="3.1" fill="#38BDF8" />
    </>
  ),
  box: (
    <>
      <rect x="1.4" y="3.4" width="12" height="12" rx="3.2" fill="#FB923C" transform="rotate(-8 7.4 9.4)" />
      <rect x="6.2" y="5" width="11.4" height="11.4" rx="3.1" fill="#FDBA74" />
      <rect x="9.2" y="8" width="5.4" height="5.4" rx="1.4" fill="#fff" />
    </>
  ),
  scatter: (
    <>
      <circle cx="6.2" cy="7" r="4.6" fill="#60A5FA" />
      <circle cx="13.8" cy="6.4" r="4.8" fill="#F472B6" />
      <circle cx="10" cy="13.8" r="4.6" fill="#FBBF24" />
    </>
  ),
  path: (
    <>
      <path d="M5.2 14.6C8.4 8.2 11.2 7 15.4 6" stroke="#34D399" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="4.6" cy="14.8" r="3.8" fill="#10B981" />
      <circle cx="15.4" cy="5.6" r="4" fill="#6EE7B7" />
    </>
  ),
  layers: (
    <>
      <rect x="1.6" y="2.6" width="12.4" height="8.2" rx="2.1" fill="#E879F9" transform="rotate(-12 7.8 6.7)" />
      <rect x="4.2" y="6" width="13" height="8.2" rx="2.1" fill="#FB7185" />
      <rect x="2.8" y="10.2" width="13.2" height="7.4" rx="2.1" fill="#F9A8D4" />
    </>
  ),
  check: (
    <>
      <rect x="1.2" y="2.2" width="11.2" height="11.2" rx="3.1" fill="#DDD6FE" transform="rotate(-10 6.8 7.8)" />
      <rect x="5.8" y="5" width="12.2" height="12.2" rx="3.3" fill="#7C5CFF" />
      <path d="M9.1 11.2l2.3 2.3 4.6-4.8" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

function PillText({ item }) {
  return <span className="cycle-pill-text">{item.text}</span>;
}

function readWidth(node) {
  return Math.ceil(node.getBoundingClientRect().width) + 1;
}

function Pill({ item, reduce }) {
  const [current, setCurrent] = useState(item);
  const [outgoing, setOutgoing] = useState(null);
  const [slide, setSlide] = useState(false);
  const [instant, setInstant] = useState(false);
  const measureRef = useRef(null);
  const shown = useRef(item);
  const [width, setWidth] = useState(null);
  const [pop, setPop] = useState(false);
  const sized = useRef(false);
  const seen = useRef(false);

  useLayoutEffect(() => {
    const previous = shown.current;
    if (previous.text === item.text && previous.icon === item.icon) return;
    shown.current = item;
    if (reduce) {
      setCurrent(item);
      setOutgoing(null);
      setSlide(false);
      return;
    }
    setOutgoing(previous);
    setCurrent(item);
    setSlide(false);
  }, [item, reduce]);

  useLayoutEffect(() => {
    if (!outgoing || slide) return undefined;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        const el = measureRef.current;
        if (el) setWidth(readWidth(el));
        setSlide(true);
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [outgoing, slide]);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el || (sized.current && !reduce)) return;
    sized.current = true;
    setWidth(readWidth(el));
  }, [current.text, current.icon, reduce]);

  useEffect(() => {
    const onResize = () => {
      const el = measureRef.current;
      if (el) setWidth(readWidth(el));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!seen.current) {
      seen.current = true;
      return undefined;
    }
    if (reduce) {
      setPop(false);
      return undefined;
    }
    setPop(true);
    const timer = setTimeout(() => setPop(false), 700);
    return () => clearTimeout(timer);
  }, [item.text, item.icon, reduce]);

  useEffect(() => {
    if (!slide) return undefined;
    const timer = setTimeout(() => {
      setInstant(true);
      setOutgoing(null);
      setSlide(false);
    }, EASE_MS + 50);
    return () => clearTimeout(timer);
  }, [slide]);

  useLayoutEffect(() => {
    if (!instant) return undefined;
    const id = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(id);
  }, [instant]);

  const trackClass = [
    "cycle-pill-track",
    slide ? "is-slid" : "",
    instant ? "is-instant" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const stickerClass = [
    "cycle-pill-sticker",
    slide ? "is-swapped" : "",
    instant ? "is-instant" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className="cycle-pill" style={width == null ? undefined : { width }}>
      <span className="cycle-pill-measure" ref={measureRef}>
        <PillText item={current} />
      </span>
      <span className={stickerClass}>
        {outgoing ? <Glyph name={outgoing.icon} /> : null}
        <Glyph name={current.icon} pop={pop} />
      </span>
      <span className="cycle-pill-viewport">
        <span className={trackClass}>
          {outgoing ? (
            <span className="cycle-pill-row">
              <PillText item={outgoing} />
            </span>
          ) : null}
          <span className="cycle-pill-row">
            <PillText item={current} />
          </span>
        </span>
      </span>
    </span>
  );
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduce;
}

function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return fine;
}

export function CyclingHeadline({ copy = sunLifeHeadline }) {
  const reduce = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const [indices, setIndices] = useState(() => copy.clauses.map(() => 0));
  const [hovered, setHovered] = useState(false);
  const paused = finePointer && hovered;
  const turn = useRef(0);

  useEffect(() => {
    if (reduce || paused) return undefined;
    const timer = setInterval(() => {
      const slot = turn.current % copy.clauses.length;
      turn.current = slot + 1;
      setIndices((current) => {
        const next = current.slice();
        next[slot] = (next[slot] + 1) % copy.states.length;
        return next;
      });
    }, copy.step);
    return () => clearInterval(timer);
  }, [reduce, paused, copy.step, copy.clauses.length, copy.states.length]);

  return (
    <>
      <span className="sunlife-sr">{stableSentence(copy)}</span>
      <span
        className="sunlife-sentence"
        aria-hidden="true"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {copy.clauses.reduce((nodes, clause, clauseIndex) => {
          if (clauseIndex > 0) nodes.push(" ");
          nodes.push(
            <span className="sunlife-clause" key={clause.before}>
              {[
                clause.before,
                " ",
                <span className="sunlife-pill-wrap" key="pill">
                  <Pill item={copy.states[indices[clauseIndex]][clauseIndex]} reduce={reduce} />
                  {clause.after}
                </span>,
              ]}
            </span>
          );
          return nodes;
        }, [])}
      </span>
    </>
  );
}
