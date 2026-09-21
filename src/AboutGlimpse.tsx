import type { Photo } from "./PhotoRow";

/* Placement order for the collage; see SPANS. */
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
    id: "concern",
    src: "/assets/photo-concern.jpg",
    alt: "Shreya in a Concern Worldwide vest while volunteering outside UCL",
    w: 825,
    h: 1100,
  },
  {
    id: "team-studio",
    src: "/assets/photo-team-studio.jpg",
    alt: "Shreya with her team in the studio",
    w: 1024,
    h: 691,
  },
];

/* Grid spans per photo on a 12-column collage: columns × rows. Portraits get
   tall cells, landscapes wide ones; dense auto-placement packs them into a
   12 × 7 block. Every column of cells has to sum to 7 rows (3+4, 3+4, 4+3)
   or one column comes up short and leaves a hole. Order is placement order. */
const SPANS: Record<string, [number, number]> = {
  graduation: [3, 4],
  workshop: [5, 3],
  athens: [4, 4],
  "team-social": [5, 4],
  concern: [3, 3],
  "team-studio": [4, 3],
};

/* A collage of photos between the hero and the case studies — the person,
   quickly, before the work. Nothing else: the narrative, fun facts and
   experience live in About. */
export function AboutGlimpse() {
  return (
    <section className="glimpse" aria-label="Photos of Shreya">
      <ul className="collage" data-reveal>
        {PHOTOS.map((photo) => {
          const [c, r] = SPANS[photo.id] ?? [3, 3];
          return (
            <li
              key={photo.id}
              className="collage-cell"
              style={{ gridColumn: `span ${c}`, gridRow: `span ${r}` }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                width={photo.w}
                height={photo.h}
                loading="lazy"
                decoding="async"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
