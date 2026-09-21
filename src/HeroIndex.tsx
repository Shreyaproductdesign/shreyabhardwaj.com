import { useEffect, useState } from "react";
import type { ExperienceItem } from "./ExperienceSection";
import { HeroTraits } from "./HeroTraits";
import type { EatEvent } from "./HeroTraits";
import { PixelSnake } from "./PixelSnake";

type HeroIndexProps = {
  experience: ExperienceItem[];
};



/* The time in Amsterdam, to the minute, ticking on the minute. Rendered
   empty on the first paint so a visitor's own timezone never flashes. */
function useAmsterdamTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Amsterdam",
    });
    let timer = 0;
    const tick = () => {
      setTime(fmt.format(new Date()));
      timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 20);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);
  return time;
}

export function HeroIndex({ experience }: HeroIndexProps) {
  const [earned, setEarned] = useState<EatEvent | null>(null);
  const time = useAmsterdamTime();

  return (
    <section className="hero" id="home" aria-label="Introduction">
      {/* One statement, then one line of facts — the rhythm the reference
          opens with: small, then a sentence, then the band. */}
      <div className="hero-index">
        <h1 className="hero-statement" data-reveal="text" style={{ ["--reveal-i" as string]: 0 }}>
          AI-native product designer based in{" "}
          <mark className="hero-index-place">Amsterdam</mark>, currently
          designing how teams think together on Miro’s canvas.
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


      {/* The hero's last line: where, and what time it is there; a mark; and
          the way onward. */}
      <div className="hero-foot" data-reveal="text" style={{ ["--reveal-i" as string]: 4 }}>
        <p className="hero-foot-place">
          Amsterdam
          <time className="hero-foot-time" dateTime={time} aria-live="off">
            {time}
          </time>
        </p>
        <img
          className="hero-foot-mark"
          src="/assets/icon-sun.png"
          alt=""
          width={20}
          height={20}
        />
        <a className="hero-foot-next" href="#product-design">
          Selected work
          <span className="hero-foot-arrow" aria-hidden="true">
            ↓
          </span>
        </a>
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
