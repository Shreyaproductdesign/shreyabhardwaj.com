import { useEffect, useRef, useState } from "react";

const GREETINGS = ["Hello", "Ciao", "Hola", "Namaste", "Bonjour", "Hallo"] as const;
const ROTATE_MS = 2600;

/* Spans are ordered to tile the 6x2 grid exactly: 4 + 3 + 1 + 2 + 1 + 1 = 12. */
const PHOTO_SLOTS = [
  { id: "p1", label: "Photo 1", span: "tall" },
  { id: "p2", label: "Photo 2", span: "wide" },
  { id: "p3", label: "Photo 3", span: "sq" },
  { id: "p4", label: "Photo 4", span: "duo" },
  { id: "p5", label: "Photo 5", span: "sq" },
  { id: "p6", label: "Photo 6", span: "sq" },
] as const;

const DRIVES = [
  "Deep thinking",
  "Creating without boundaries",
  "Being curious",
  "Mixing depth + personality",
] as const;

const FUN_FACTS = [
  {
    title: "Volunteer",
    body: "Helped out with Concern UK. Small acts, big heart.",
  },
  {
    title: "200+ wins",
    body: "Art competitions since I was a kid. Walls were never safe.",
  },
  {
    title: "Volleyball",
    body: "Played at state level. Still chase that competitive spark.",
  },
  {
    title: "Skating",
    body: "Loved it as a kid. Haven’t skated in a while. Rusty but willing.",
  },
] as const;

export function AboutSection() {
  const [greetIndex, setGreetIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [drivesIn, setDrivesIn] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drivesRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const activeX = useRef(0);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setGreetIndex((i) => {
        setLeaving(i);
        return (i + 1) % GREETINGS.length;
      });
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  useEffect(() => {
    if (leaving === null) return;
    const id = window.setTimeout(() => setLeaving(null), 650);
    return () => window.clearTimeout(id);
  }, [leaving]);

  useEffect(() => {
    const node = drivesRef.current;
    if (!node) return;
    if (reducedMotion) {
      setDrivesIn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setDrivesIn(true);
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [reducedMotion]);

  const goFact = (next: number) => {
    const n = FUN_FACTS.length;
    setFactIndex(((next % n) + n) % n);
    setDragX(0);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    startX.current = e.clientX;
    activeX.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    activeX.current = dx;
    setDragX(dx);
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    const dx = activeX.current;
    if (dx < -56) goFact(factIndex + 1);
    else if (dx > 56) goFact(factIndex - 1);
    else setDragX(0);
  };

  return (
    <section className="about" aria-label="About Shreya">
      <div className="about-shell">
        <div className="about-intro">
          <p className="about-eyebrow">The person behind the work</p>
          <h2 className="about-greeting" aria-live="polite">
            <span className="about-greeting-slot">
              {GREETINGS.map((word, i) => {
                const isActive = i === greetIndex;
                const isLeaving = i === leaving;
                if (!isActive && !isLeaving) return null;
                return (
                  <span
                    key={`${word}-${i}`}
                    className={[
                      "about-greeting-word",
                      ready ? "is-ready" : "",
                      isActive ? "is-active" : "",
                      isLeaving ? "is-leaving" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-hidden={!isActive}
                  >
                    {word}!
                  </span>
                );
              })}
            </span>
          </h2>
          <p className="about-lede">
            How I got here, what I care about, and a few things that keep me
            curious.
          </p>
        </div>

        <div className="about-photos" aria-label="Photo placeholders">
          {PHOTO_SLOTS.map((slot) => (
            <div
              key={slot.id}
              className={`about-photo-slot about-photo-${slot.span}`}
            >
              <span className="about-photo-label">{slot.label}</span>
            </div>
          ))}
        </div>

        <div className="about-story">
          <div className="about-beat">
            <p className="about-soft">
              Hey, nice to meet you.
              <br />
              Wait, let me just get my coffee first.
            </p>

            <figure className="about-coffee">
              <img
                className="about-coffee-img"
                src="/assets/pixel-coffee.png"
                alt="Pixel art coffee mug"
              />
            </figure>

            <p className="about-soft">
              Okay, I think I’m good now.
              <br />
              So yeah, let me tell you about myself.
            </p>
          </div>

          <div className="about-beat">
            {/* Lines are balanced rather than hand-broken, so no viewport
                leaves a single word stranded on the last line. */}
            <p className="about-display">
              I was a kid who painted walls, and literally every other thing I
              could see.
            </p>

            <p className="about-soft">
              That curiosity led me into the design world.
            </p>
          </div>

          <div
            className={`about-drives${drivesIn ? " is-in" : ""}`}
            ref={drivesRef}
          >
            <p className="about-drives-label">What drives me</p>
            <ul className="about-drive-list">
              {DRIVES.map((label, i) => (
                <li
                  key={label}
                  className="about-drive-pill"
                  style={{ ["--i" as string]: i }}
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="about-beat">
            <p className="about-display">
              Okay, enough about work.{" "}
              <span className="about-display-quiet">
                Who am I outside of it?
              </span>
            </p>

            <p className="about-spectrum">
              It’s a spectrum.
              <br />
              Either coffee and a book on the couch all day…
              <br />
              or six places planned to the minute.
              <br />
              <span className="about-spectrum-end">Almost no in-between.</span>
            </p>
          </div>
        </div>

        <div className="about-facts-block">
          <p className="about-facts-label">Fun facts · swipe</p>
          <div
            className="about-facts-deck"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {FUN_FACTS.map((fact, i) => {
              const offset = i - factIndex;
              const isActive = i === factIndex;
            const style = isActive
              ? {
                  transform: `translateX(${dragX}px) rotate(${dragX * 0.04}deg)`,
                  zIndex: 3,
                }
              : {
                  /* The card behind peeks far enough past the edge to read as
                     a stack you can move. */
                  transform: `translateY(${Math.abs(offset) * 16}px) scale(${
                    1 - Math.abs(offset) * 0.04
                  })`,
                  zIndex: 2 - Math.abs(offset),
                  opacity: Math.abs(offset) > 1 ? 0 : 0.55,
                  pointerEvents: "none" as const,
                };

              return (
                <article
                  key={fact.title}
                  className={`about-fact-card${isActive ? " is-active" : ""}${
                    dragging && isActive ? " is-dragging" : ""
                  }`}
                  style={style}
                  aria-hidden={!isActive}
                >
                  <header className="about-fact-header">
                    <span className="about-fact-meta">
                      <span className="about-fact-dot" aria-hidden="true" />
                      Fun fact
                    </span>
                    <span className="about-fact-count">
                      {i + 1}/{FUN_FACTS.length}
                    </span>
                  </header>
                  <h3 className="about-fact-title">{fact.title}</h3>
                  <p className="about-fact-body">{fact.body}</p>
                </article>
              );
            })}
          </div>
          <div className="about-facts-nav" role="tablist" aria-label="Fun fact cards">
            {FUN_FACTS.map((fact, i) => (
              <button
                key={fact.title}
                type="button"
                className={`about-facts-dot${i === factIndex ? " is-active" : ""}`}
                aria-label={`Show fact: ${fact.title}`}
                aria-selected={i === factIndex}
                onClick={() => goFact(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
