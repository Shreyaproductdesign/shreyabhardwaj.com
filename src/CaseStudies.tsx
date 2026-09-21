import { useMemo } from "react";
import { useActiveSection } from "./useActiveSection";

export type CaseStudy = {
  id: string;
  company: string;
  logo?: string;
  /** What the company does. A recruiter who only knows the name still gets it. */
  sector?: string;
  title: string;
  tags: string[];
  description?: string;
  /** Headline proof, so the row gives a reason to open the study. */
  stat?: { value: string; label: string };
  href?: string;
  image?: string;
  status?: "incoming" | "live";
  /** Case study still lives off-site, so links open in a new tab. */
  external?: boolean;
};

type CaseStudiesProps = {
  studies: CaseStudy[];
};

const index = (n: number) => String(n).padStart(2, "0");

/* Rows of work beside an index that reads along with you. The index sticks
   while the rows scroll, and the number of whichever row is in view lights
   up; clicking a number takes you to its row. Each row is media at full
   width with the facts split beneath: what it is on the left, what it did
   on the right. */
export function CaseStudies({ studies }: CaseStudiesProps) {
  const ids = useMemo(() => studies.map((s) => s.id), [studies]);
  const active = useActiveSection(ids);

  return (
    <section
      className="case-studies"
      id="product-design"
      aria-label="Selected work"
    >
      <div className="case-head" data-reveal="text">
        <h2 className="case-heading">Case studies</h2>
      </div>

      <div className="case-layout">
        <nav className="case-index" aria-label="Case studies on this page">
          <ol className="case-index-list">
            {studies.map((study, i) => (
              <li key={study.id}>
                <a
                  className={`case-index-item${active === study.id ? " is-active" : ""}`}
                  href={`#${study.id}`}
                  aria-current={active === study.id ? "true" : undefined}
                >
                  <span className="case-index-num">{index(i + 1)}</span>
                  <span className="case-index-title">{study.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <ol className="case-list">
          {studies.map((study, i) => (
            <CaseRow key={study.id} study={study} n={i + 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}

type CaseRowProps = {
  study: CaseStudy;
  n: number;
};

function CaseRow({ study, n }: CaseRowProps) {
  const isIncoming = study.status === "incoming";
  const canOpen = !isIncoming && Boolean(study.href);
  const linkProps = study.external ? { target: "_blank", rel: "noreferrer" } : {};

  return (
    <li
      id={study.id}
      className={`case-row${canOpen ? " is-open" : ""}`}
      data-reveal=""
    >
      {study.image ? (
        <div className="case-media">
          <img src={study.image} alt="" loading="lazy" decoding="async" />
        </div>
      ) : (
        <div className="case-media is-empty" aria-hidden="true">
          <span className="case-media-mark">{study.company.slice(0, 1)}</span>
        </div>
      )}

      <div className="case-meta">
        <div className="case-what">
          <p className="case-sub">
            <span className="case-index-num">{index(n)}</span>
            <span className="case-company">{study.company}</span>
            {study.sector ? <span className="case-sector">{study.sector}</span> : null}
          </p>
          {/* The only link in the row, stretched over the whole row by CSS,
              so the entire row opens the study without nesting links. */}
          <h3 className="case-title">
            {canOpen ? (
              <a href={study.href} {...linkProps}>
                {study.title}
              </a>
            ) : (
              study.title
            )}
          </h3>
          {study.description ? (
            <p className="case-desc">{study.description}</p>
          ) : null}
        </div>

        <div className="case-did">
          {study.stat ? (
            <p className="case-stat">
              <mark className="case-stat-value">{study.stat.value}</mark>
              <span className="case-stat-label">{study.stat.label}</span>
            </p>
          ) : null}
          <p className="case-tags">{study.tags.join(" · ")}</p>
          <p className="case-open">
            {canOpen ? (
              <>
                View case study
                <span className="case-open-arrow" aria-hidden="true">
                  {study.external ? "↗" : "→"}
                </span>
              </>
            ) : (
              "Coming soon"
            )}
          </p>
        </div>
      </div>
    </li>
  );
}
