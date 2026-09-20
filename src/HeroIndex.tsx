import { useLayoutEffect, useRef, useState } from "react";
import type { CaseStudy } from "./CaseStudies";
import type { ExperienceItem } from "./ExperienceSection";
import { HeroTraits } from "./HeroTraits";
import type { EatEvent } from "./HeroTraits";
import { PixelSnake } from "./PixelSnake";

type HeroIndexProps = {
  caseStudies: CaseStudy[];
  experience: ExperienceItem[];
};

const DISPLAY_NAME = "Shreya Bhardwaj";

function shortCaseLabel(study: CaseStudy) {
  if (study.id === "miro-case-1") return "Miro AI Presence";
  if (study.id === "miro-case-2") return "Miro Obeya room";
  if (study.company === "Wise") return "Wise legalese";
  return study.title;
}

export function HeroIndex({ caseStudies, experience }: HeroIndexProps) {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const nameInnerRef = useRef<HTMLSpanElement>(null);
  const [earned, setEarned] = useState<EatEvent | null>(null);

  useLayoutEffect(() => {
    const el = nameRef.current;
    const inner = nameInnerRef.current;
    if (!el || !inner) return;

    const REFERENCE = 200;
    let lastWidth = 0;

    let lastCap = 0;

    /** Resolved px ceiling for the wordmark's box, set as `max-height` in CSS. */
    const capOf = (styles: CSSStyleDeclaration) => parseFloat(styles.maxHeight);

    const fit = () => {
      const available = el.clientWidth;
      if (!available) return;
      const styles = getComputedStyle(el);
      const fill = parseFloat(styles.getPropertyValue("--wordmark-fill")) || 1;

      el.style.fontSize = `${REFERENCE}px`;
      const measured = inner.offsetWidth;
      if (!measured) return;
      const byWidth = (REFERENCE * available * fill) / measured;

      /* Width alone made the wordmark tall enough to push the snake band and
         the index out of the viewport on a short window. The cap and the
         line-height ratio both come from CSS, measured at the reference size,
         so neither value is duplicated here. */
      const cap = capOf(styles);
      const ratio = inner.offsetHeight / REFERENCE;
      const byHeight = cap > 0 && ratio > 0 ? cap / ratio : Infinity;

      el.style.fontSize = `${Math.min(byWidth, byHeight)}px`;
    };

    fit();
    void document.fonts.ready.then(fit);

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      // The cap is viewport-relative, so a height-only resize has to re-fit too.
      const cap = capOf(getComputedStyle(el));
      if (width === lastWidth && cap === lastCap) return;
      lastWidth = width;
      lastCap = cap;
      fit();
    });
    observer.observe(el.parentElement ?? el);
    // ResizeObserver on the parent misses a viewport that only changed height.
    window.addEventListener("resize", fit);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <section className="hero" id="home" aria-label="Introduction">
      <nav className="hero-index" aria-label="On this page">
        <div className="hero-index-grid">
          <div className="hero-index-col">
            <a className="hero-index-label" href="#about-me">
              Who I am
            </a>
            <p className="hero-index-lede">
              {/* Readers kept missing the location in running text, so it gets
                  the accent swipe rather than another line of copy. */}
              <mark className="hero-index-place">Amsterdam</mark>-based
              designer. Currently working as a product designer at Miro, shaping
              how teams collaborate in a multiplayer world with AI.
            </p>
          </div>

          <div className="hero-index-col">
            <a className="hero-index-label" href="#about-me">
              Experience
            </a>
            {/* Companies only. The roles and dates live in the Experience
                card, and spelling them out here ran each entry to two lines. */}
            <ul className="hero-index-list">
              {experience.map((job) => (
                <li
                  className="hero-index-item"
                  key={`${job.company}-${job.dates}`}
                >
                  {job.logo ? (
                    <img className="hero-index-logo" src={job.logo} alt="" />
                  ) : (
                    <span className="hero-index-logo is-monogram">
                      {job.company.slice(0, 1)}
                    </span>
                  )}
                  {job.company}
                  {job.current ? (
                    <span className="hero-index-current">
                      <span className="exp-current-dot" aria-hidden="true" />
                      Current
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-index-col">
            <a className="hero-index-label" href="#product-design">
              Case studies
            </a>
            <ul className="hero-index-list">
              {caseStudies.map((study) => (
                <li key={study.id}>
                  <a
                    className="hero-index-link"
                    href={study.href ?? `#${study.id}`}
                  >
                    {shortCaseLabel(study)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </nav>

      <div className="hero-world">
        <HeroTraits earned={earned} />
        <PixelSnake
          onEat={(score, at) => setEarned({ score, at, id: Date.now() })}
        />
      </div>

      <h1 className="hero-giant-name" ref={nameRef}>
        <span className="hero-giant-inner" ref={nameInnerRef}>
          {DISPLAY_NAME.split(" ").map((word, i) => (
            <span key={word}>
              {i > 0 ? <span className="hero-giant-space" /> : null}
              {word}
            </span>
          ))}
        </span>
      </h1>
    </section>
  );
}
