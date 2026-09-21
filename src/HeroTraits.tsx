import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { EatPoint } from "./PixelSnake";

/** The opener, so a first-time player learns the pills are worth chasing. */
const INTRO = "Learn more about Shreya";

/* One voice throughout: every line introduces her in the third person, rather
   than mixing her speaking ("I vibe code") with labels ("curious"). */
const QUALITIES = [
  "She is AI native",
  "She is curious",
  "She loves data",
  "She still designs on paper",
  "She loves a good brainstorm",
  "She vibe codes",
  "She thinks in systems",
  "She is a storyteller",
  "She asks why first",
  "She prototypes to think",
  "She sweats the details",
];

/** The opener lands on the first apple, then a quality every second one. */
const INTRO_AT = 1;
const QUALITY_EVERY = 2;
const FIRST_QUALITY_AT = INTRO_AT + QUALITY_EVERY;

const LINGER_MS = 2600;
/** Breathing room between a pill and the edge of the band it spawns in. */
const EDGE_PAD = 24;

/** How many pills this score has earned, capped at the number we have. */
function unlockedCount(score: number) {
  if (score < INTRO_AT) return 0;
  if (score < FIRST_QUALITY_AT) return 1;
  const qualities = Math.floor((score - FIRST_QUALITY_AT) / QUALITY_EVERY) + 1;
  return 1 + Math.min(qualities, QUALITIES.length);
}

/** Most players never reach the last few, so the order re-rolls each run. */
function buildOrder() {
  const shuffled = [...QUALITIES];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return [INTRO, ...shuffled];
}

export type EatEvent = { score: number; at: EatPoint; id: number };

type Pill = {
  key: number;
  label: string;
  accent: boolean;
  left: number;
  top: number;
  /** Placed on the apple until it has been measured against the band edges. */
  placed: boolean;
};

export function HeroTraits({ earned }: { earned: EatEvent | null }) {
  const rootRef = useRef<HTMLUListElement>(null);
  const [pills, setPills] = useState<Pill[]>([]);
  const order = useRef<string[]>([]);
  const shown = useRef(0);
  const lastScore = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!earned || !root) return;

    // A score that did not climb means the snake died and started over.
    if (earned.score <= lastScore.current) shown.current = 0;
    lastScore.current = earned.score;
    if (!shown.current) order.current = buildOrder();

    if (unlockedCount(earned.score) <= shown.current) return;
    const label = order.current[shown.current];
    shown.current += 1;

    const box = root.getBoundingClientRect();
    const pill: Pill = {
      key: earned.id,
      label,
      accent: label === INTRO,
      left: earned.at.x - box.left,
      top: earned.at.y - box.top,
      placed: false,
    };

    setPills((current) => [...current, pill]);
    timers.current.push(
      window.setTimeout(() => {
        setPills((current) => current.filter((p) => p.key !== pill.key));
      }, LINGER_MS),
    );
  }, [earned]);

  /* A pill is centred on the apple, so a long one can hang off the band when
     the apple lands near an edge. Its width isn't known until it renders, so
     nudge it back in before the browser paints. */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || pills.every((p) => p.placed)) return;

    setPills((current) =>
      current.map((pill) => {
        if (pill.placed) return pill;
        const el = root.querySelector<HTMLElement>(`[data-pill="${pill.key}"]`);
        if (!el) return pill;
        const gutter = el.offsetWidth / 2 + EDGE_PAD;
        const max = Math.max(gutter, root.clientWidth - gutter);
        return { ...pill, left: Math.min(Math.max(pill.left, gutter), max), placed: true };
      }),
    );
  }, [pills]);

  return (
    <ul className="hero-traits" ref={rootRef} aria-live="polite">
      {pills.map((pill) => (
        <li
          className="hero-trait"
          key={pill.key}
          data-pill={pill.key}
          data-accent={pill.accent ? "true" : undefined}
          style={{ left: `${pill.left}px`, top: `${pill.top}px` }}
        >
          {pill.label}
        </li>
      ))}
    </ul>
  );
}
