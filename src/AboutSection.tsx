import { useEffect, useState } from "react";
import { PhotoRow, type Photo } from "./PhotoRow";

const GREETINGS = ["Hello", "Ciao", "Hola", "Namaste", "Bonjour", "Hallo"] as const;
const ROTATE_MS = 2600;

/* Breaks up the narrative before the fun facts. The volunteering shot moved up
   to the glimpse strip, so this row is the team and city photos. */
const ABOUT_PHOTOS: Photo[] = [
  {
    id: "team-wall",
    src: "/assets/photo-team-wall.jpg",
    alt: "Shreya and four teammates posing in front of a graffiti wall",
    w: 1100,
    h: 599,
  },
  {
    id: "wise-cohort",
    src: "/assets/photo-wise-cohort.jpg",
    alt: "Shreya with the Wise intern cohort at a Becoming Wiser session",
    w: 848,
    h: 638,
  },
  {
    id: "park",
    src: "/assets/photo-park.jpg",
    alt: "Shreya in a park at sunset",
    w: 786,
    h: 1024,
  },
];

/* Volunteering used to lead this deck ("Helped out with Concern UK"), but the
   story above now says it in Shreya's own words — and names the charity
   correctly. The cards are for things the prose doesn't cover. */
const FUN_FACTS = [
  {
    title: "200+ art competitions",
    body: "Entered since I was a kid, and still painting.",
  },
  {
    title: "Volleyball",
    body: "Played at state level through school.",
  },
  {
    title: "Skating",
    body: "As a kid. Out of practice, not out of interest.",
  },
] as const;

export function AboutSection() {
  const [greetIndex, setGreetIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

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

  return (
    <section className="about" aria-label="About Shreya">
      <div className="about-shell">
        <div className="about-intro" data-reveal="text">
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
        </div>

        <div className="about-story">
          {/* The mug opens the story on its own now. No beat wrapper: with one
              child it would only add a gap the story already sets. Decorative,
              so it carries no alt text — the copy it used to illustrate
              ("let me get my coffee first") is gone. */}
          <figure className="about-coffee" data-reveal>
            <img
              className="about-coffee-img"
              src="/assets/pixel-coffee.png"
              alt=""
            />
          </figure>

          <div className="about-beat" data-reveal="text">
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

          <div className="about-beat" data-reveal="text">
            <p className="about-display">
              Okay, enough about work.{" "}
              <span className="about-display-quiet">
                Who am I outside of it?
              </span>
            </p>

            {/* Not hand-broken: the old version was four short lines forced with
                <br>, which stranded words at some widths. */}
            <p className="about-spectrum">
              I’m someone who follows my mood. Some days I’m reading a good
              thriller with coffee in hand, other days I’m painting whatever
              comes to mind, and often I’m just out exploring the city with no
              plan at all.
            </p>

            <p className="about-spectrum">
              I also enjoy volunteering whenever I can. I’ve worked with a few
              charities over the years, including{" "}
              <span className="about-spectrum-end">Concern Worldwide</span>.
            </p>
          </div>
        </div>

        <PhotoRow
          photos={ABOUT_PHOTOS}
          className="about-photo-row"
          label="More photos of Shreya"
          revealIndex={0}
        />

        {/* Three cards laid out like they were put down by hand — each a
            little off true, all readable at once. The swipe deck they replace
            showed one at a time behind dots and a 1/3 counter. */}
        <div className="about-facts-block" data-reveal="text">
          <p className="about-facts-label">Fun facts</p>
          <ul className="about-facts-spread">
            {FUN_FACTS.map((fact, i) => (
              <li
                key={fact.title}
                className="about-fact-card"
                style={{ ["--i" as string]: i }}
              >
                <h3 className="about-fact-title">{fact.title}</h3>
                <p className="about-fact-body">{fact.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
