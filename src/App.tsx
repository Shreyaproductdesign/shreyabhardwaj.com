import { useEffect, useRef } from "react";
import "./App.css";
import { AboutSection } from "./AboutSection";
import { CaseStudies, type CaseStudy } from "./CaseStudies";
import { ExperienceSection, type ExperienceItem } from "./ExperienceSection";
import { HeroIndex } from "./HeroIndex";

const RESUME_URL = "/shreya-bhardwaj-resume.pdf";
const LINKEDIN_URL = "https://www.linkedin.com/in/shreya-bhardwaj19/";
const EMAIL = "mailto:shreyabhardwaj117@gmail.com";

const caseStudies: CaseStudy[] = [
  {
    id: "miro-case-1",
    company: "Miro",
    logo: "/assets/logo-miro-icon.png",
    title: "Exploring the UI & UX of Miro’s AI Sidekicks",
    tags: ["Product design", "AI", "Sidekicks"],
    description:
      "Presence, intent, and collaboration, without getting in the way.",
    image: "/assets/miro-sidekicks-cursor.gif",
    status: "incoming",
  },
  {
    id: "miro-case-2",
    company: "Miro",
    logo: "/assets/logo-miro-icon.png",
    title: "Making collaboration feel inevitable",
    tags: ["Product design", "Systems", "Enterprise"],
    description:
      "Systems that help teams move from idea to shared understanding with less friction.",
    status: "incoming",
  },
  {
    id: "wise-case-study",
    company: "Wise",
    logo: "/assets/logo-wise.png",
    title: "Increasing transparency for legalese",
    tags: ["Mobile", "Website", "Fintech"],
    description:
      "Helping Wise communicate its Acceptable Use Policy clearly during onboarding, without slowing people down.",
    // Trailing slash matters on all three: these are directory indexes, and
    // both the Vite dev server and static hosts 404 on the bare path.
    href: "/wise-case-study/",
    image: "/assets/project-wise.png",
    status: "live",
  },
  {
    id: "quickfix-case-study",
    company: "QuickFix",
    title: "A design system built with Airbnb's DLS method",
    tags: ["Mobile App", "Website", "Design system"],
    description:
      "A design system for an emergency application that is simple, scalable, and understandable by both designers and developers.",
    href: "/quickfix-case-study/",
    image: "/assets/project-quickfix.png",
    status: "live",
  },
  {
    id: "dadvice-case-study",
    company: "Dadvice",
    title: "A pregnancy guide for dads-to-be",
    tags: ["Mobile App", "Healthcare", "Product Strategy"],
    description:
      "An app that empowers fathers with knowledge, tools, and support to navigate pregnancy and strengthen their relationships.",
    href: "/dadvice-case-study/",
    image: "/assets/project-dadvice.png",
    status: "live",
  },
];

type MarqueeItem = {
  src: string;
  alt: string;
  href?: string;
};

const playgroundMarquee: MarqueeItem[] = [
  {
    src: "/assets/project-quickfix.png",
    alt: "QuickFix design system preview",
    href: "/quickfix-case-study/",
  },
  {
    src: "/assets/project-dadvice.png",
    alt: "Dadvice app preview",
    href: "/dadvice-case-study/",
  },
  ...Array.from({ length: 9 }, (_, i) => ({
    src: `/assets/visual-${i + 1}.png`,
    alt: "",
  })),
];

const experience: ExperienceItem[] = [
  {
    company: "Miro",
    role: "Product Designer",
    location: "Amsterdam",
    dates: "Aug 2025 – Present",
    current: true,
  },
  {
    company: "Tails.com",
    role: "Associate Product Designer",
    location: "London",
    dates: "Mar 2025 – Jul 2025",
  },
  {
    company: "Wise",
    role: "Product Design Intern",
    location: "London",
    dates: "Jun 2024 – Aug 2024",
  },
  {
    company: "Wolffkraft Design Studio",
    role: "UX/Product Designer",
    location: "Bangalore",
    dates: "Dec 2022 – Jun 2023",
  },
  {
    company: "Userfacet",
    role: "UX/Product Designer",
    location: "Bangalore",
    dates: "Jun 2022 – Nov 2022",
  },
];

function useHorizontalDeck() {
  const deckRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    /* How far a gesture must push past a panel's edge before the deck moves on. */
    const OVERSCROLL = 180;
    /* A gap this long in the wheel stream counts as letting go of the trackpad. */
    const GESTURE_GAP = 260;
    /* Long enough to cover the smooth scroll between two panels. */
    const SETTLE = 560;

    let intent = 0;
    let lastWheel = 0;
    let settleUntil = 0;
    /* True once the current gesture has done something that disqualifies it from
       changing panels — either it scrolled a panel's content, or it already
       caused a change. Cleared only by letting go. */
    let spent = false;

    const panelAt = (node: EventTarget | null) =>
      node instanceof Element
        ? (node.closest(".deck > *") as HTMLElement | null)
        : null;

    const goTo = (direction: 1 | -1) => {
      const last = deck.children.length - 1;
      const current = Math.round(deck.scrollLeft / deck.clientWidth);
      const next = Math.min(last, Math.max(0, current + direction));
      if (next === current) return;
      deck.scrollTo({ left: next * deck.clientWidth, behavior: "smooth" });
      settleUntil = performance.now() + SETTLE;
      intent = 0;
      spent = true;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const now = performance.now();
      const fresh = now - lastWheel > GESTURE_GAP;
      lastWheel = now;

      /* Letting go starts a clean slate, so nothing a previous gesture banked can
         surface later as a jump that came out of nowhere. */
      if (fresh) {
        intent = 0;
        spent = false;
      }

      /* Sit still while the deck animates, and absorb the tail of the flick that
         moved it, so one gesture can never skip two panels. */
      if (now < settleUntil) {
        e.preventDefault();
        return;
      }

      const panel = panelAt(e.target);
      if (panel) {
        const room =
          e.deltaY > 0
            ? panel.scrollHeight - panel.clientHeight - panel.scrollTop
            : panel.scrollTop;
        if (room > 1) {
          /* The panel can still absorb this, so let it scroll. Reading a panel is
             what makes a gesture spent: arriving at the end of the case studies
             should park there, not carry straight on into the next panel. */
          intent = 0;
          spent = true;
          return;
        }
      }

      e.preventDefault();
      if (spent) return;

      if (intent !== 0 && Math.sign(intent) !== Math.sign(e.deltaY)) intent = 0;
      intent += e.deltaY;
      if (Math.abs(intent) < OVERSCROLL) return;
      goTo(intent > 0 ? 1 : -1);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (performance.now() < settleUntil) return;
      if (e.key === "ArrowRight") goTo(1);
      if (e.key === "ArrowLeft") goTo(-1);
    };

    deck.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      deck.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return deckRef;
}

function App() {
  const deckRef = useHorizontalDeck();

  return (
    <div className="page">
      <header className="nav">
        <nav className="nav-pill" aria-label="Primary">
          <a className="nav-pill-link" href="#home">
            Home
          </a>
          <a className="nav-pill-link" href="#product-design">
            Work
          </a>
          <a className="nav-pill-link" href="#about-me">
            About
          </a>
          <a className="nav-pill-link" href="#visual-design">
            Playground
          </a>
          <a
            className="nav-pill-link"
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
          >
            Resume
          </a>
        </nav>
      </header>

      <main className="deck" ref={deckRef}>
        <HeroIndex caseStudies={caseStudies} experience={experience} />

        <CaseStudies studies={caseStudies} />

        <div className="deck-panel" id="about-me">
          <AboutSection />
          <ExperienceSection items={experience} />
        </div>

        <section className="visuals" id="visual-design" aria-label="Playground">
          <div className="pixel-field pixel-field-soft" aria-hidden="true" />
          <div className="playground-projects">
            <p className="playground-eyebrow">Outside the case studies</p>
            <h2 className="playground-heading">Playground</h2>
            <p className="playground-lede">
              Sketches, side projects, and visual experiments in motion.
            </p>
          </div>

          <div className="marquee">
            <div className="marquee-track">
              {[...playgroundMarquee, ...playgroundMarquee].map((item, i) => {
                const media = <img src={item.src} alt={item.alt} />;
                return (
                  <div className="marquee-item" key={`${item.src}-${i}`}>
                    {item.href ? (
                      <a
                        className="marquee-link"
                        href={item.href}
                        {...(item.href.startsWith("http")
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        {media}
                      </a>
                    ) : (
                      media
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="cta" aria-label="Contact">
          <h2 className="cta-title">
            <span>Let’s create</span>
            <span className="cta-title-mid">
              <span className="cta-orb" aria-hidden="true" />
              A remarkable
              <img
                className="cta-accent"
                src="/assets/icon-sun.png"
                alt=""
                aria-hidden="true"
              />
            </span>
            <span>Journey</span>
          </h2>

          <div className="cta-bar">
            <a className="cta-bar-side" href="#about-me">
              Credits
            </a>
            <nav className="cta-bar-links" aria-label="Contact">
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <span aria-hidden="true">•</span>
              <a href={EMAIL}>shreyabhardwaj117@gmail.com</a>
              <span aria-hidden="true">•</span>
              <a href={RESUME_URL} target="_blank" rel="noreferrer">
                Resume
              </a>
            </nav>
            <p className="cta-bar-side">© 2026</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
