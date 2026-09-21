export type ExperienceItem = {
  company: string;
  /** Square company mark. Falls back to a monogram where there isn't one. */
  logo?: string;
  role: string;
  /** City only — the countries add width without telling the reader more. */
  location: string;
  dates: string;
  current?: boolean;
};

type ExperienceSectionProps = {
  items: ExperienceItem[];
  yearsLabel?: string;
};

export function ExperienceSection({
  items,
  yearsLabel = "+4 years exp.",
}: ExperienceSectionProps) {
  return (
    <section
      className="experience"
      id="experience"
      aria-label="Professional experiences"
    >
      <div className="pixel-field" aria-hidden="true" />

      <div className="exp-card">
        <header className="exp-card-header" data-reveal="text">
          <div className="exp-card-meta">
            <span className="exp-card-years">
              <span className="exp-card-dot" aria-hidden="true" />
              {yearsLabel}
            </span>
            <span className="exp-card-count">({items.length})</span>
          </div>
          {/* Not hand-broken: at the card's width this sits on one line, and
              balance handles the narrow viewports. */}
          <h2 className="exp-card-title">Professional experiences</h2>
        </header>

        <ul className="exp-list">
          {items.map((job, i) => (
            <li
              className="exp-row"
              key={`${job.company}-${job.dates}`}
              data-reveal="text"
              style={{ ["--reveal-i" as string]: 1 + i }}
            >
              <span className="exp-dates">{job.dates}</span>
              <div className="exp-detail">
                <div className="exp-company-line">
                  {job.current ? (
                    <span className="exp-current">
                      Current
                    </span>
                  ) : null}
                  <h3 className="exp-company">{job.company}</h3>
                </div>
                <p className="exp-role">
                  {job.role}
                  <span className="exp-place">{job.location}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
