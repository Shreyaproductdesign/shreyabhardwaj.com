import { useEffect, useRef, useState } from "react";

export type CaseStudy = {
  id: string;
  company: string;
  logo?: string;
  title: string;
  tags: string[];
  description?: string;
  href?: string;
  image?: string;
  status?: "incoming" | "live";
  /** Case study still lives off-site, so links open in a new tab. */
  external?: boolean;
};

type CaseStudiesProps = {
  studies: CaseStudy[];
};

function formatIndex(n: number) {
  return String(n).padStart(2, "0");
}

export function CaseStudies({ studies }: CaseStudiesProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [railVisible, setRailVisible] = useState(false);
  const total = studies.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-case-panel]"));

    const panelObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.caseIndex);
        if (!Number.isNaN(index)) setActive(index);
      },
      { root: null, threshold: [0.35, 0.55, 0.7], rootMargin: "-10% 0px -10% 0px" },
    );

    panels.forEach((panel) => panelObserver.observe(panel));

    const railObserver = new IntersectionObserver(
      ([entry]) => setRailVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.08 },
    );
    railObserver.observe(root);

    return () => {
      panelObserver.disconnect();
      railObserver.disconnect();
    };
  }, [studies]);

  return (
    <section
      className="case-studies"
      id="product-design"
      aria-label="Selected work"
      ref={rootRef}
    >
      <aside
        className={`case-rail${railVisible ? " is-visible" : ""}`}
        aria-hidden={!railVisible}
      >
        <span className="case-rail-num">{formatIndex(active + 1)}</span>
        <div className="case-rail-track" role="presentation">
          <span
            className="case-rail-marker"
            style={{
              /* Dots sit flush to both ends of the track, so their centres run
                 from 3px to (100% - 3px) — not 0% to 100%. Ride that span so the
                 ring lands on the dot at any track height. */
              top: `calc(3px + (100% - 6px) * ${
                active / Math.max(total - 1, 1)
              })`,
            }}
          />
          {studies.map((study, i) => (
            <button
              key={study.id}
              type="button"
              className={`case-rail-dot${i === active ? " is-active" : ""}`}
              aria-label={`Go to ${study.company}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => {
                document
                  .getElementById(study.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <span className="case-rail-tip" aria-hidden="true">
                {study.company}
              </span>
            </button>
          ))}
        </div>
        <span className="case-rail-num">{formatIndex(total)}</span>
      </aside>

      {studies.map((study, i) => {
        const isIncoming = study.status === "incoming";
        const linkProps = study.external
          ? { target: "_blank", rel: "noreferrer" }
          : {};

        return (
          <article
            key={study.id}
            id={study.id}
            className={`case-panel has-media${isIncoming ? " is-incoming" : ""}`}
            data-case-panel
            data-case-index={i}
          >
            <div className="case-panel-inner">
              <div className="case-copy">
                <p className="case-eyebrow">Selected work · {formatIndex(i + 1)}</p>

                <header className="case-header">
                  <div className="case-brand">
                    {study.logo ? (
                      <img className="case-logo" src={study.logo} alt="" />
                    ) : null}
                    <span className="case-company">{study.company}</span>
                    {isIncoming ? (
                      <span className="case-status">Incoming</span>
                    ) : (
                      <span className="case-status case-status-live">Live</span>
                    )}
                  </div>
                </header>

                <h2 className="case-title">{study.title}</h2>

                {study.description ? (
                  <p className="case-desc">{study.description}</p>
                ) : (
                  <p className="case-desc case-desc-soft">
                    Details landing soon. A tighter look at the craft, process, and outcome.
                  </p>
                )}

                <div className="case-tags" aria-label="Topics">
                  {study.tags.map((tag) => (
                    <span className="case-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                {!isIncoming && study.href ? (
                  <div className="case-actions">
                    <a className="case-cta" href={study.href} {...linkProps}>
                      <span>View case study</span>
                      <span className="case-cta-arrow" aria-hidden="true">
                        {study.external ? "↗" : "→"}
                      </span>
                    </a>
                  </div>
                ) : isIncoming ? (
                  <div className="case-actions">
                    <span className="case-cta case-cta-muted" aria-disabled="true">
                      <span>Case study soon</span>
                    </span>
                  </div>
                ) : null}
              </div>

              {study.image ? (
                <div className="case-media">
                  {!isIncoming && study.href ? (
                    <a
                      className="case-media-frame is-linked"
                      href={study.href}
                      aria-label={`View the ${study.company} case study`}
                      {...linkProps}
                    >
                      <img src={study.image} alt="" />
                    </a>
                  ) : (
                    <div className="case-media-frame">
                      <img src={study.image} alt="" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="case-media case-media-placeholder" aria-hidden="true">
                  <div className="case-media-frame case-media-empty">
                    <span className="case-media-mark">{study.company.slice(0, 1)}</span>
                    <span className="case-media-label">Preview incoming</span>
                  </div>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}
