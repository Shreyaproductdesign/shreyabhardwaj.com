import { useEffect, useRef, useState, useLayoutEffect, useCallback } from "react";
import { ScrambleText } from "./ScrambleText";

type Vec = { x: number; y: number };

const VERBS = ["vibe codes", "storytells", "ships"] as const;
const LERP = 0.12;
const IDLE_DRIFT = 10;
const ROTATE_MS = 3400;
const VERB_MS = 780;
const APPLE_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

export function HeroPlayground() {
  const stageRef = useRef<HTMLDivElement>(null);
  const flyerRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const pos = useRef<Vec>({ x: 0, y: 0 });
  const target = useRef<Vec>({ x: 0, y: 0 });
  const dragging = useRef(false);
  const pointerId = useRef<number | null>(null);
  const raf = useRef(0);
  const time = useRef(0);

  const [verbIndex, setVerbIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const [slotWidth, setSlotWidth] = useState<number | undefined>(undefined);
  const [motionReady, setMotionReady] = useState(false);
  const [staticDone, setStaticDone] = useState(false);
  const [verbDone, setVerbDone] = useState(false);
  const introDone = staticDone && verbDone;
  const lastPointer = useRef<Vec>({ x: 0, y: 0 });

  const finishStatic = useCallback(() => setStaticDone(true), []);
  const finishVerb = useCallback(() => setVerbDone(true), []);

  useEffect(() => {
    if (!introDone) return;
    const id = window.requestAnimationFrame(() => setMotionReady(true));
    return () => window.cancelAnimationFrame(id);
  }, [introDone]);

  useLayoutEffect(() => {
    if (!introDone) return;
    const el = measureRefs.current[verbIndex];
    if (!el) return;
    setSlotWidth(el.offsetWidth);
  }, [verbIndex, introDone]);

  useEffect(() => {
    if (!introDone) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      setVerbIndex((i) => {
        setLeavingIndex(i);
        return (i + 1) % VERBS.length;
      });
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [introDone]);

  useEffect(() => {
    if (leavingIndex === null) return;
    const id = window.setTimeout(() => setLeavingIndex(null), VERB_MS);
    return () => window.clearTimeout(id);
  }, [leavingIndex]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const clamp = (v: Vec): Vec => {
      const maxX = stage.clientWidth * 0.28;
      const maxY = stage.clientHeight * 0.26;
      return {
        x: Math.max(-maxX, Math.min(maxX, v.x)),
        y: Math.max(-maxY, Math.min(maxY, v.y)),
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current || pointerId.current !== e.pointerId) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      target.current = clamp({
        x: target.current.x + dx,
        y: target.current.y + dy,
      });
    };

    const endDrag = (e: PointerEvent) => {
      if (pointerId.current !== e.pointerId) return;
      dragging.current = false;
      pointerId.current = null;
    };

    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    const tick = (t: number) => {
      time.current = t / 1000;
      const bobX = Math.sin(time.current * 0.7) * IDLE_DRIFT;
      const bobY = Math.cos(time.current * 0.95) * (IDLE_DRIFT * 0.65);

      if (!dragging.current) {
        target.current = { x: bobX, y: bobY };
      }

      pos.current.x += (target.current.x - pos.current.x) * LERP;
      pos.current.y += (target.current.y - pos.current.y) * LERP;

      const xNorm = Math.max(
        -1,
        Math.min(1, pos.current.x / (stage.clientWidth * 0.28 || 1)),
      );
      const dissolve = Math.max(0, xNorm);
      const hue = xNorm * 48;
      const sat = 1 + Math.abs(xNorm) * 0.35;
      const opacity = 1 - dissolve * 0.72;
      const blur = dissolve * 10;
      const scale = 1 - dissolve * 0.18 + (dragging.current ? 0.06 : 0);

      const flyer = flyerRef.current;
      const shadow = shadowRef.current;
      if (flyer) {
        flyer.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) scale(${scale})`;
        flyer.style.opacity = String(opacity);
        flyer.style.filter = `hue-rotate(${hue}deg) saturate(${sat}) blur(${blur}px) drop-shadow(0 10px 18px rgba(110, 52, 12, 0.22))`;
        flyer.dataset.dragging = dragging.current ? "true" : "false";
      }
      if (shadow) {
        const lift = Math.max(0.25, opacity * 0.9);
        shadow.style.transform = `translate3d(${pos.current.x * 0.9}px, ${28 + pos.current.y * 0.2}px, 0) scale(${lift}, ${0.4 * lift})`;
        shadow.style.opacity = String(0.16 * lift);
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", endDrag);
      stage.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  const onFlyerPointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    lastPointer.current = { x: e.clientX, y: e.clientY };
    dragging.current = true;
    pointerId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  return (
    <div className="hero-stage" ref={stageRef}>
      <div className="hero-copy">
        <p className="hero-kicker">Hello, I’m Shreya. A —</p>

        <h1 className="hero-headline">
          <span className="hero-static">
            {!staticDone ? (
              <ScrambleText
                text="Designer who"
                className="hero-scramble"
                staggerMs={62}
                scrambleMs={980}
                startDelay={220}
                onComplete={finishStatic}
              />
            ) : (
              <>
                Designer wh
                <span className="hero-o-wrap">
                  o
                  <span className="hero-sun-anchor">
                    <span className="hero-shadow" ref={shadowRef} aria-hidden="true" />
                    <span
                      className="hero-flyer"
                      ref={flyerRef}
                      onPointerDown={onFlyerPointerDown}
                      role="img"
                      aria-label="Drag the sun"
                    >
                      <img src="/assets/icon-sun.png" alt="" draggable={false} />
                      <span className="hero-flyer-hint" aria-hidden="true">
                        drag me
                      </span>
                    </span>
                  </span>
                </span>
              </>
            )}
          </span>{" "}
          <span
            className={`hero-verb-slot${motionReady ? " is-ready" : ""}`}
            ref={slotRef}
            aria-live="polite"
            style={
              slotWidth
                ? {
                    width: slotWidth,
                    transition: motionReady
                      ? `width ${VERB_MS}ms ${APPLE_EASE}`
                      : "none",
                  }
                : undefined
            }
          >
            {!verbDone ? (
              <ScrambleText
                text={VERBS[0]}
                className="hero-scramble hero-verb is-active"
                staggerMs={70}
                scrambleMs={1100}
                startDelay={480}
                onComplete={finishVerb}
              />
            ) : (
              VERBS.map((verb, i) => {
                const isActive = i === verbIndex;
                const isLeaving = i === leavingIndex;
                return (
                  <span
                    key={verb}
                    ref={(el) => {
                      measureRefs.current[i] = el;
                    }}
                    className={[
                      "hero-verb",
                      motionReady ? "is-ready" : "",
                      isActive ? "is-active" : "",
                      isLeaving ? "is-leaving" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-hidden={!isActive}
                  >
                    {verb}
                  </span>
                );
              })
            )}
          </span>
        </h1>
      </div>
    </div>
  );
}
