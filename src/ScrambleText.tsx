import { useEffect, useRef, useState } from "react";

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*";

type ScrambleTextProps = {
  text: string;
  className?: string;
  /** Delay before scramble starts (ms) */
  startDelay?: number;
  /** Stagger between characters from center (ms) */
  staggerMs?: number;
  /** How long each character scrambles (ms) */
  scrambleMs?: number;
  onComplete?: () => void;
};

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "#";
}

/**
 * Scramble-from-center intro — same idea as Motion’s
 * ScrambleText + stagger({ from: "center" }), without Motion+.
 * Runs once when mounted.
 */
export function ScrambleText({
  text,
  className,
  startDelay = 280,
  staggerMs = 55,
  scrambleMs = 920,
  onComplete,
}: ScrambleTextProps) {
  const letters = text.split("");
  const [chars, setChars] = useState<string[]>(() =>
    letters.map((ch) => (ch === " " ? " " : "\u00A0")),
  );
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setChars(letters);
      onCompleteRef.current?.();
      return;
    }

    const n = letters.length;
    const center = (n - 1) / 2;
    const startAt = letters.map((_, i) =>
      letters[i] === " " ? 0 : Math.abs(i - center) * staggerMs,
    );
    const settleAt = startAt.map((t, i) =>
      letters[i] === " " ? 0 : t + scrambleMs,
    );

    let raf = 0;
    let startedAt = 0;
    let finished = false;

    const delayTimer = window.setTimeout(() => {
      startedAt = performance.now();

      const tick = (now: number) => {
        if (finished) return;
        const elapsed = now - startedAt;
        const next = letters.map((finalChar, i) => {
          if (finalChar === " ") return " ";
          if (elapsed < startAt[i]!) return "\u00A0";
          if (elapsed >= settleAt[i]!) return finalChar;
          return randomGlyph();
        });

        setChars(next);

        if (elapsed >= Math.max(...settleAt)) {
          finished = true;
          setChars(letters);
          onCompleteRef.current?.();
          return;
        }

        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    }, startDelay);

    return () => {
      finished = true;
      window.clearTimeout(delayTimer);
      cancelAnimationFrame(raf);
    };
    // Intentionally once per `text` mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, startDelay, staggerMs, scrambleMs]);

  return (
    <span className={className} aria-label={text}>
      {chars.map((ch, i) => (
        <span key={i} className="hero-scramble-char">
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}
