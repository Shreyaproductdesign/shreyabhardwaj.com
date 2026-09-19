import { useEffect, useRef, useState } from "react";
import { PhotoRow, type Photo } from "./PhotoRow";

/* A short personal beat between the hero and the case studies. Readers were
   reaching the long About only after five viewports of work and calling it
   too long, so the photos and the drives moved up here as a teaser and the
   narrative, fun facts and experience stayed below. Nothing is duplicated. */

/* Ordered portrait, landscape, portrait… so the strip has a rhythm rather
   than three tall frames in a row. */
const PHOTOS: Photo[] = [
  {
    id: "graduation",
    src: "/assets/photo-graduation.jpg",
    alt: "Shreya in cap and gown on graduation day",
    w: 768,
    h: 1024,
  },
  {
    id: "workshop",
    src: "/assets/photo-workshop.jpg",
    alt: "Shreya presenting to colleagues in front of a wall of sticky notes",
    w: 1024,
    h: 768,
  },
  {
    id: "athens",
    src: "/assets/photo-athens.jpg",
    alt: "Shreya smiling in front of the Acropolis in Athens",
    w: 768,
    h: 1024,
  },
  {
    id: "team-social",
    src: "/assets/photo-team-social.jpg",
    alt: "Shreya and friends at a celebration with yellow balloons",
    w: 1024,
    h: 768,
  },
  {
    id: "park",
    src: "/assets/photo-park.jpg",
    alt: "Shreya in a park at sunset",
    w: 786,
    h: 1024,
  },
  {
    id: "team-studio",
    src: "/assets/photo-team-studio.jpg",
    alt: "Shreya with her team in the studio",
    w: 1024,
    h: 691,
  },
];

const DRIVES = [
  "Data",
  "Asking why",
  "Old-school design + AI",
] as const;

export function AboutGlimpse() {
  const [drivesIn, setDrivesIn] = useState(false);
  const drivesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = drivesRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
  }, []);

  return (
    <section className="glimpse" aria-label="A little about Shreya">
      <div className="glimpse-head">
        <div className="glimpse-intro">
          <p className="glimpse-eyebrow">Off the clock</p>
          <p className="glimpse-line">
            200+ art competitions, volleyball at state level, and still
            happiest mid-brainstorm.
          </p>
          <a className="glimpse-more" href="#about-me">
            More about me
            <span className="glimpse-more-arrow" aria-hidden="true">
              ↓
            </span>
          </a>
        </div>

        <div
          className={`about-drives glimpse-drives${drivesIn ? " is-in" : ""}`}
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
      </div>

      <PhotoRow
        photos={PHOTOS}
        className="glimpse-strip"
        label="Photos of Shreya"
      />

    </section>
  );
}
