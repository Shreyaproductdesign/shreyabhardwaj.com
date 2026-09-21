import "./App.css";
import { AboutGlimpse } from "./AboutGlimpse";
import { AboutSection } from "./AboutSection";
import { CaseStudies, type CaseStudy } from "./CaseStudies";
import { ExperienceSection, type ExperienceItem } from "./ExperienceSection";
import { HeroIndex } from "./HeroIndex";
import { useActiveSection } from "./useActiveSection";
import { useReveal } from "./useReveal";

const RESUME_URL = "/shreya-bhardwaj-resume.pdf";
const LINKEDIN_URL = "https://www.linkedin.com/in/shreya-bhardwaj19/";
const EMAIL = "mailto:shreyabhardwaj117@gmail.com";

const caseStudies: CaseStudy[] = [
  {
    id: "miro-case-1",
    company: "Miro",
    logo: "/assets/logo-miro-icon.png",
    sector: "Visual collaboration SaaS, 100M+ users",
    title: "Exploring the UI & UX of Miro AI Presence",
    tags: ["Product design", "AI", "Multiplayer"],
    description:
      "Intent, awareness, and collaboration, without getting in the way.",
    // Placeholder until Shreya has the numbers for this one.
    stat: { value: "Canvas 2025", label: "launched on stage" },
    image: "/assets/miro-ai-presence-cursor.gif",
    status: "incoming",
  },
  {
    id: "miro-case-2",
    company: "Miro",
    logo: "/assets/logo-miro-icon.png",
    sector: "Visual collaboration SaaS, 100M+ users",
    title: "An Obeya room, rebuilt in Miro",
    tags: ["Product design", "Enterprise", "Client work"],
    description:
      "Lean planning lives on the walls of one physical room. For a major US aviation client, that room became a canvas.",
    stat: {
      value: "433K MAU",
      label: "up 40% YoY · 87% retained at 6 months",
    },
    status: "incoming",
  },
  {
    id: "wise-case-study",
    company: "Wise",
    logo: "/assets/logo-wise.png",
    sector: "Cross-border payments fintech",
    title: "Increasing transparency for legalese",
    tags: ["Mobile", "Website", "Fintech"],
    description:
      "Helping Wise communicate its Acceptable Use Policy clearly during onboarding, without slowing people down.",
    // Trailing slash matters on all three: these are directory indexes, and
    // both the Vite dev server and static hosts 404 on the bare path.
    stat: { value: "+65%", label: "engagement with the policy" },
    href: "/wise-case-study/",
    image: "/assets/project-wise.png",
    status: "live",
  },
  {
    id: "quickfix-case-study",
    company: "QuickFix",
    sector: "Emergency services app, self-initiated",
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
    sector: "Pregnancy support app, self-initiated",
    title: "A pregnancy guide for dads-to-be",
    tags: ["Mobile App", "Healthcare", "Product Strategy"],
    description:
      "An app that empowers fathers with knowledge, tools, and support to navigate pregnancy and strengthen their relationships.",
    stat: {
      value: "Investor-backed",
      label: "picked up to launch as a startup",
    },
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
    logo: "/assets/logo-miro-icon.png",
    role: "Product Designer",
    location: "Amsterdam",
    dates: "Aug 2025 – Present",
    current: true,
  },
  {
    company: "Tails.com",
    logo: "/assets/company-tails.png",
    role: "Associate Product Designer",
    location: "London",
    dates: "Mar 2025 – Jul 2025",
  },
  {
    company: "Wise",
    logo: "/assets/logo-wise.png",
    role: "Product Design Intern",
    location: "London",
    dates: "Jun 2024 – Aug 2024",
  },
  {
    company: "Wolffkraft Design Studio",
    logo: "/assets/company-wolffkraft.png",
    role: "UX/Product Designer",
    location: "Bangalore",
    dates: "Dec 2022 – Jun 2023",
  },
  {
    company: "Userfacet",
    logo: "/assets/company-userfacet.png",
    role: "UX/Product Designer",
    location: "Bangalore",
    dates: "Jun 2022 – Nov 2022",
  },
];

/* The in-page links, in page order. Resume opens a file and isn't a section. */
const NAV_SECTIONS = [
  { id: "home", label: "Home" },
  { id: "product-design", label: "Work" },
  { id: "about-me", label: "About" },
  { id: "visual-design", label: "Playground" },
];
const NAV_IDS = NAV_SECTIONS.map((s) => s.id);

function App() {
  useReveal();
  const active = useActiveSection(NAV_IDS);

  return (
    <div className="page">
      {/* Three zones at 14px, the way the reference does it: who, what, where
          to. No pill — the chrome was drawing more attention than the words. */}
      <header className="nav">
        <a className="nav-name" href="#home">
          Shreya Bhardwaj
        </a>
        <p className="nav-role">Product designer, Amsterdam</p>
        <nav className="nav-links" aria-label="Primary">
          {NAV_SECTIONS.map((section) => (
            <a
              key={section.id}
              className={`nav-link${active === section.id ? " is-active" : ""}`}
              href={`#${section.id}`}
              aria-current={active === section.id ? "location" : undefined}
            >
              {section.label}
            </a>
          ))}
          <a className="nav-link" href={RESUME_URL} target="_blank" rel="noreferrer">
            Resume
          </a>
        </nav>
      </header>

      <main className="deck">
        <HeroIndex caseStudies={caseStudies} experience={experience} />

        <AboutGlimpse />

        <CaseStudies studies={caseStudies} />

        <div className="deck-panel" id="about-me">
          <AboutSection />
          <ExperienceSection items={experience} />
        </div>

        <section className="visuals" id="visual-design" aria-label="Playground">
          <div className="pixel-field pixel-field-soft" aria-hidden="true" />
          <div className="playground-projects" data-reveal="text">
            <h2 className="playground-heading">Playground</h2>
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
          <h2 className="cta-title" data-reveal="text">
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

          <div className="cta-bar" data-reveal="text" style={{ ["--reveal-i" as string]: 1 }}>
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
