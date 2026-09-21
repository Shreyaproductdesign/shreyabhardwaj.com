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

/** How many of the leading studies run full width before the list pairs up. */
const WIDE_COUNT = 3;

const index = (n: number) => String(n).padStart(2, "0");

/* Editorial rows rather than boxed cards: media at full width with its
   metadata set as a small grid beneath — index, title and company, result,
   topics, the way in — and a hairline between rows. Cards drew a box, a
   shadow, a radius and four pills around each study; the row lets the work
   and the facts carry it. */
export function CaseStudies({ studies }: CaseStudiesProps) {
  const wide = studies.slice(0, WIDE_COUNT);
  const paired = studies.slice(WIDE_COUNT);

  return (
    <section
      className="case-studies"
      id="product-design"
      aria-label="Selected work"
    >
      <div className="case-head" data-reveal="text">
        <h2 className="case-heading">Case studies</h2>
      </div>

      <ol className="case-list">
        {wide.map((study, i) => (
          <CaseRow key={study.id} study={study} n={i + 1} />
        ))}

        {paired.length ? (
          <li className="case-pair" data-reveal>
            <ol className="case-pair-list">
              {paired.map((study, i) => (
                <CaseRow
                  key={study.id}
                  study={study}
                  n={WIDE_COUNT + i + 1}
                  compact
                />
              ))}
            </ol>
          </li>
        ) : null}
      </ol>
    </section>
  );
}

type CaseRowProps = {
  study: CaseStudy;
  n: number;
  /** Stacked metadata for the two-up row, where a five-column grid won't fit. */
  compact?: boolean;
};

function CaseRow({ study, n, compact = false }: CaseRowProps) {
  const isIncoming = study.status === "incoming";
  const canOpen = !isIncoming && Boolean(study.href);
  const linkProps = study.external ? { target: "_blank", rel: "noreferrer" } : {};

  return (
    <li
      id={study.id}
      className={`case-row${compact ? " is-compact" : ""}${canOpen ? " is-open" : ""}`}
      data-reveal={compact ? undefined : ""}
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
        <span className="case-index">{index(n)}</span>

        <div className="case-ident">
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
          <p className="case-sub">
            <span className="case-company">{study.company}</span>
            {study.sector ? <span className="case-sector">{study.sector}</span> : null}
          </p>
        </div>

        {study.stat ? (
          <p className="case-stat">
            <span className="case-stat-value">{study.stat.value}</span>
            <span className="case-stat-label">{study.stat.label}</span>
          </p>
        ) : (
          <span className="case-stat is-blank" aria-hidden="true" />
        )}

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
    </li>
  );
}
