export type CaseStudy = {
  id: string;
  company: string;
  logo?: string;
  /** What the company does. A recruiter who only knows the name still gets it. */
  sector?: string;
  title: string;
  tags: string[];
  description?: string;
  /** Headline proof, so the card gives a reason to open the study. */
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

/* A card grid rather than one full-viewport panel per study. The panels read
   well but cost five viewports before a reader reached anything else, and they
   only ever showed one study at a time — so nothing was comparable at a
   glance. Cards put the company, what it does, and the result side by side. */
export function CaseStudies({ studies }: CaseStudiesProps) {
  return (
    <section
      className="case-studies"
      id="product-design"
      aria-label="Selected work"
    >
      <div className="case-head">
        <p className="case-eyebrow">Selected work</p>
        <h2 className="case-heading">Case studies</h2>
        <p className="case-lede">
          Enterprise canvases, a policy nobody was reading, and a couple of
          projects that started as my own idea.
        </p>
      </div>

      <div className="case-grid">
        {studies.map((study, i) => {
          const isIncoming = study.status === "incoming";
          const canOpen = !isIncoming && Boolean(study.href);
          const linkProps = study.external
            ? { target: "_blank", rel: "noreferrer" }
            : {};

          return (
            <article
              key={study.id}
              id={study.id}
              /* The first card leads, so it spans the grid and runs wide. */
              className={`case-card${i === 0 ? " is-featured" : ""}${
                canOpen ? " is-open" : ""
              }`}
            >
              {/* Every card keeps a media block, even without artwork. Without
                  one the card stretches to its neighbour and leaves a hole. */}
              {study.image ? (
                <div className="case-card-media">
                  <img
                    src={study.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className="case-card-media is-empty" aria-hidden="true">
                  <span className="case-media-mark">
                    {study.company.slice(0, 1)}
                  </span>
                  <span className="case-media-label">Preview incoming</span>
                </div>
              )}

              <div className="case-card-body">
                <div className="case-brand">
                  {study.logo ? (
                    <img className="case-logo" src={study.logo} alt="" />
                  ) : null}
                  <span className="case-company">{study.company}</span>
                  {study.sector ? (
                    <span className="case-sector">{study.sector}</span>
                  ) : null}
                  <span
                    className={`case-status${
                      isIncoming ? "" : " case-status-live"
                    }`}
                  >
                    {isIncoming ? "Incoming" : "Live"}
                  </span>
                </div>

                {/* The only link in the card, stretched over the whole card by
                    CSS. That keeps the full card clickable without nesting a
                    link inside a link. */}
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

                {study.stat ? (
                  <p className="case-stat">
                    <span className="case-stat-value">{study.stat.value}</span>
                    <span className="case-stat-label">{study.stat.label}</span>
                  </p>
                ) : null}

                <div className="case-card-foot">
                  <div className="case-tags" aria-label="Topics">
                    {study.tags.map((tag) => (
                      <span className="case-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="case-open">
                    {canOpen ? "View case study" : "Case study soon"}
                    {canOpen ? (
                      <span className="case-open-arrow" aria-hidden="true">
                        {study.external ? "↗" : "→"}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
