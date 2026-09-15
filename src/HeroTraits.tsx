import { useEffect, useRef, useState } from "react";
import type { EatPoint } from "./PixelSnake";

type Trait = {
  label: string;
  /** Apples the snake must collect before this one is earned. */
  at: number;
  accent?: boolean;
};

const TRAITS: Trait[] = [
  { label: "I vibe code", at: 1, accent: true },
  { label: "curious", at: 3 },
  { label: "systems brain", at: 6 },
  { label: "storyteller", at: 10 },
];

const LINGER_MS = 2600;
/** Keeps a pill from hanging off the edge of the band it spawns in. */
const EDGE_PAD = 76;

export type EatEvent = { score: number; at: EatPoint; id: number };

type Pill = Trait & { key: number; left: number; top: number };

export function HeroTraits({ earned }: { earned: EatEvent | null }) {
  const rootRef = useRef<HTMLUListElement>(null);
  const [pills, setPills] = useState<Pill[]>([]);
  const claimed = useRef(new Set<string>());
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
    if (earned.score <= lastScore.current) claimed.current.clear();
    lastScore.current = earned.score;

    const trait = TRAITS.find(
      (t) => earned.score >= t.at && !claimed.current.has(t.label),
    );
    if (!trait) return;
    claimed.current.add(trait.label);

    const box = root.getBoundingClientRect();
    const clamp = (v: number, max: number) =>
      Math.min(Math.max(v, EDGE_PAD), Math.max(EDGE_PAD, max - EDGE_PAD));

    const pill: Pill = {
      ...trait,
      key: earned.id,
      left: clamp(earned.at.x - box.left, box.width),
      top: clamp(earned.at.y - box.top, box.height),
    };

    setPills((current) => [...current, pill]);
    timers.current.push(
      window.setTimeout(() => {
        setPills((current) => current.filter((p) => p.key !== pill.key));
      }, LINGER_MS),
    );
  }, [earned]);

  return (
    <ul className="hero-traits" ref={rootRef} aria-live="polite">
      {pills.map((pill) => (
        <li
          className="hero-trait"
          key={pill.key}
          data-accent={pill.accent ? "true" : undefined}
          style={{ left: `${pill.left}px`, top: `${pill.top}px` }}
        >
          {pill.label}
        </li>
      ))}
    </ul>
  );
}
