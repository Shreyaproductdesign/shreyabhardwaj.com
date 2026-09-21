import { useState } from "react";
import type { ExperienceItem } from "./ExperienceSection";
import { HeroTraits } from "./HeroTraits";
import type { EatEvent } from "./HeroTraits";
import { PixelSnake } from "./PixelSnake";

type HeroIndexProps = {
  experience: ExperienceItem[];
};



export function HeroIndex({ experience }: HeroIndexProps) {
  const [earned, setEarned] = useState<EatEvent | null>(null);

  return (
    <section className="hero" id="home" aria-label="Introduction">
      {/* One statement, then one line of facts — the rhythm the reference
          opens with: small, then a sentence, then the band. */}
      <div className="hero-index">
        <h1 className="hero-statement" data-reveal="text" style={{ ["--reveal-i" as string]: 0 }}>
          AI-native product designer at Miro, working on a canvas 100 million
          people share. Based in{" "}
          <mark className="hero-index-place">Amsterdam</mark>.
        </h1>

        <div className="hero-facts" data-reveal="text" style={{ ["--reveal-i" as string]: 1 }}>
          {/* Where she's worked, current first. No "now / before" labels: the
              tag on Miro says it, and the order does the rest. */}
          <ul className="hero-fact-list">
            {[...experience]
              .sort((a, b) => Number(b.current ?? false) - Number(a.current ?? false))
              .map((job) => (
                <li className="hero-index-item" key={`${job.company}-${job.dates}`}>
                  <Logo job={job} />
                  {job.company}
                  {job.current ? <span className="hero-index-current">Current</span> : null}
                </li>
              ))}
          </ul>

        </div>
      </div>

      <div className="hero-world" data-reveal style={{ ["--reveal-i" as string]: 3 }}>
        <HeroTraits earned={earned} />
        <PixelSnake
          onEat={(score, at) => setEarned({ score, at, id: Date.now() })}
        />
      </div>

    </section>
  );
}

/* Company mark, or its initial when there's no logo. */
function Logo({ job }: { job: ExperienceItem }) {
  return job.logo ? (
    <img className="hero-index-logo" src={job.logo} alt="" width={20} height={20} />
  ) : (
    <span className="hero-index-logo is-monogram">{job.company.slice(0, 1)}</span>
  );
}
