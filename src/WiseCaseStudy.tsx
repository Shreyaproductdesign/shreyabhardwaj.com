import "./WiseCaseStudy.css";

const META = [
  { label: "Role", value: "Product Design Intern, Business Onboarding" },
  { label: "Duration", value: "10 weeks" },
  { label: "Team", value: "Product manager, content writers, legal team" },
  { label: "Tools", value: "Figma, UserTesting.com, Miro, Notion" },
];

const DISMISSALS = [
  "Honestly, I just scroll down and click ‘Agree’. Nobody’s got time to read all that.",
  "I’m not worried. It’s their job to catch me if I break a rule.",
  "It’s just clutter in my inbox. I delete those without a second thought.",
  "I assume it’s just telling me about changes I don’t care about.",
  "I doubt there’s anything different in this one compared to the last ten I ‘agreed’ to.",
  "It’s all legal jargon. I wouldn’t understand it anyway.",
];

const BARRIERS = [
  {
    stat: "42%",
    title: "Language complexity",
    body: "Users were overwhelmed by the technical terms and dense language in the AUP. 42% of users in our testing reported finding the AUP language difficult to understand, leading to unintentional violations.",
  },
  {
    stat: "67%",
    title: "User perception",
    body: "Wise’s AUP goes beyond just illegal activities, but many users were unaware of that. 67% of users did not know the AUP extended to things like cryptocurrency and IPTV.",
  },
];

const TESTING_APPROACH = [
  "Conducted multiple rounds of moderated user testing with 20+ users",
  "Experimented with various screen versions",
  "Took an innovative, data-driven approach to design",
];

const TESTING_INSIGHTS = [
  "Users confused “Adult content” with “Audit content,” assumed IPTV always meant illegal streaming, and did not understand industry jargon.",
  "They focused only on headlines and ignored crucial subtext.",
  "They assumed their use case was acceptable without verifying it in the detailed AUP.",
];

const PERSONAS = [
  {
    name: "Sarah",
    type: "Occasional gambler",
    avatar: "/assets/wise-persona-sarah.png",
    can: [
      "International money transfers",
      "Managing everyday finances",
      "Receiving work-related payments",
    ],
    cannot: [
      "Depositing funds into online gambling sites",
      "Withdrawing winnings from betting activities",
      "Transactions directly related to gambling",
    ],
    challenge:
      "Sarah must separate her occasional gambling activities from her regular financial transactions on Wise.",
  },
  {
    name: "Alex",
    type: "Crypto enthusiast",
    avatar: "/assets/wise-persona-alex.png",
    can: [
      "International money transfers for personal use",
      "Receiving salary payments",
      "Paying for goods and services (non-crypto related)",
    ],
    cannot: [
      "Purchasing cryptocurrencies",
      "Transferring funds to crypto exchanges",
      "Receiving payments from crypto-related activities",
    ],
    challenge:
      "Alex needs to understand how to use Wise for their regular financial activities while avoiding any transactions related to their crypto interests.",
  },
  {
    name: "Mike",
    type: "IPTV user",
    avatar: "/assets/wise-persona-mike.png",
    can: [
      "Receiving international client payments",
      "Personal international transfers",
      "Managing business expenses",
    ],
    cannot: [
      "Paying for unauthorized IPTV services",
      "Receiving payments related to IPTV content distribution",
      "Transactions with known illegal streaming services",
    ],
    challenge:
      "Mike needs to ensure his use of Wise for his freelance business doesn’t intersect with his personal IPTV activities.",
  },
];

const PATTERNS = [
  "Tab approach",
  "Modal approach",
  "Bento approach",
  "Checklist approach",
  "Video approach",
  "Card approach",
];

const PRINCIPLES = [
  {
    title: "Progressive disclosure",
    body: "An expandable inline approach lets users quickly scan key points and dive deeper only if they need to.",
  },
  {
    title: "Simplified language",
    body: "Legal jargon translated into everyday language, making the AUP accessible to all users.",
  },
  {
    title: "Visual hierarchy",
    body: "Key policy points are highlighted, drawing attention to the most critical information.",
  },
  {
    title: "Interactive elements",
    body: "Expandable sections and clear calls to action encourage engagement with the policy content.",
  },
  {
    title: "Familiarity principle",
    body: "Interactive elements resemble familiar UI patterns, reducing the learning curve.",
  },
];

const REVIEW_NOTES = [
  {
    body: "The accordion treatment looks great! Super scannable and offers in depth information if needed.",
    who: "Madalina",
  },
  {
    body: "I wonder if you can integrate the alert content differently, especially the first part feels a bit redundant and takes emphasis off the “avoid deactivation” bit.",
    who: "Oliver",
  },
  {
    body: "Great visual treatments of these categories.",
    who: "My Hoa",
  },
];

const NEXT_STEPS = [
  {
    title: "A/B testing",
    body: "The new presentation was tested against the existing approach across the UK and Europe.",
  },
  {
    title: "Metric tracking",
    body: "Drop-off at each stage of onboarding, time spent on the AUP, and comprehension levels were tracked throughout.",
  },
  {
    title: "Continuous refinement",
    body: "The design kept being tuned against test results and incoming user feedback.",
  },
];

const LEARNINGS = [
  {
    title: "Balancing simplicity and comprehensiveness",
    body: "I learned to distill complex legal information into user-friendly content without losing its essence. That skill applies to making any complex information more accessible.",
  },
  {
    title: "Cross-functional collaboration",
    body: "Working closely with legal teams, content writers, and product managers taught me the value of diverse perspectives on a complex problem, and made me a more effective communicator.",
  },
  {
    title: "Data-driven design decisions",
    body: "Using metrics like account deactivation rates and comprehension levels to guide iterations sharpened my analytical skills and reinforced the importance of measurable outcomes.",
  },
];

export function WiseCaseStudy() {
  return (
    <div className="cs">
      <header className="cs-bar">
        <a className="cs-back" href="/">
          <span aria-hidden="true">←</span> Shreya Bhardwaj
        </a>
        <img className="cs-bar-logo" src="/assets/logo-wise.png"
              width={225}
              height={225} alt="Wise" />
      </header>

      <main className="cs-main">
        {/* ——— Opening ——— */}
        <section className="cs-hero">
          <p className="cs-eyebrow">Showing legalese upfront</p>
          <h1 className="cs-title">From fine print to front and center</h1>
          <p className="cs-lede">
            Wise, a company committed to transparency, needed to communicate its
            Acceptable Use Policy to users without disrupting onboarding. I led
            the redesign of how that policy is presented.
          </p>

          <div className="cs-frame cs-frame-flush">
            <img
              src="/assets/wise-banner.png"
              width={1800}
              height={1311}
              alt="Minimum cognitive load, maximum ease and transparency"
            />
          </div>

          <dl className="cs-meta">
            {META.map((row) => (
              <div className="cs-meta-row" key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          <p className="cs-note">
            Due to a non-disclosure agreement, specific designs and certain
            details have been omitted. This case study focuses on the process,
            challenges, and outcomes of the project.
          </p>
        </section>

        {/* ——— Context ——— */}
        <section className="cs-section">
          <p className="cs-kicker">Context</p>
          <h2 className="cs-h2">What is an Acceptable Use Policy?</h2>
          <div className="cs-prose">
            <p>
              An Acceptable Use Policy (AUP) outlines the acceptable and
              unacceptable uses of resources provided by a company. It sets the
              rules of the road for anyone accessing their network, systems,
              devices, or online platforms.
            </p>
            <p className="cs-prose-aside">Think of it as a digital code of conduct.</p>
          </div>

          <blockquote className="cs-pull">
            You’re excited to try a new app. You click through the signup,
            eager to get started — but without realising it, you’re agreeing to
            a whole bunch of rules you never saw. That was the exact problem
            with our AUP. It was a secret handshake: important, but hidden away
            where no one could find it.
          </blockquote>

          <div className="cs-frame">
            <img
              src="/assets/wise-problem-hidden.png"
              width={1800}
              height={1375}
              alt="Wise’s initial AUP was hidden away, rarely read, and frequently violated"
            />
          </div>

          <div className="cs-stat">
            <span className="cs-stat-figure">63%</span>
            <p className="cs-stat-body">
              of AUP-related deactivations occurred within the first two months
              of account creation. Users were unknowingly violating policies,
              leading to account deactivations and frustration.
            </p>
          </div>
        </section>

        {/* ——— Data ——— */}
        <section className="cs-section">
          <p className="cs-kicker">Research</p>
          <h2 className="cs-h2">Data-driven decision making</h2>
          <div className="cs-prose">
            <p>
              A significant number of account deactivations were directly
              attributed to AUP violations, across diverse geographical regions.
              That highlighted how widespread the non-compliance was.
            </p>
            <p>
              To tackle it, I analysed user data to identify the most common
              violations so we could prioritise and highlight those areas in the
              design — with separate analyses for business and individual
              accounts, so the presentation could be tailored to each.
            </p>
          </div>

          <figure className="cs-figure">
            <div className="cs-frame">
              <img
                src="/assets/wise-usecase-charts.png"
              width={1800}
              height={2025}
                alt="Charts breaking down restricted use cases for business and individual accounts"
              />
            </div>
            <figcaption>
              Fig 1 — Account deactivations due to AUP violations, by entity
              (monthly)
            </figcaption>
          </figure>

          <div className="cs-frame">
            <img
              src="/assets/wise-aup-original.png"
              width={1800}
              height={809}
              alt="The original Acceptable Use Policy as a dense web page of legal text"
            />
          </div>
        </section>

        {/* ——— Barriers ——— */}
        <section className="cs-section">
          <p className="cs-kicker">The problem</p>
          <h2 className="cs-h2">Lost in translation, and tunnel vision</h2>
          <ul className="cs-barriers">
            {BARRIERS.map((b) => (
              <li className="cs-barrier" key={b.title}>
                <span className="cs-barrier-stat">{b.stat}</span>
                <h3 className="cs-h3">{b.title}</h3>
                <p>{b.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ——— Testing ——— */}
        <section className="cs-section">
          <p className="cs-kicker">User testing</p>
          <h2 className="cs-h2">
            People skimmed, misread, or skipped it entirely
          </h2>
          <div className="cs-prose">
            <p>
              Testing revealed a fascinating — and sometimes frustrating —
              truth: users skimmed, misinterpreted, or entirely skipped the AUP,
              even when it directly impacted them.
            </p>
          </div>

          <div className="cs-split">
            <div>
              <h3 className="cs-h3">My approach</h3>
              <ul className="cs-list">
                {TESTING_APPROACH.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="cs-h3">What we found</h3>
              <ul className="cs-list">
                {TESTING_INSIGHTS.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="cs-h3 cs-h3-standalone">
            How people talk about terms and conditions
          </h3>
          <ul className="cs-quotes">
            {DISMISSALS.map((q) => (
              <li className="cs-quote" key={q}>
                {q}
              </li>
            ))}
          </ul>

          <div className="cs-frame">
            <img
              src="/assets/wise-user-quotes.png"
              width={1800}
              height={1014}
              alt="Affinity map of user quotes gathered during testing"
            />
          </div>

          <ul className="cs-quotes cs-quotes-accent">
            <li className="cs-quote">
              It felt like I needed a law degree to understand it! I don’t know
              what IPTV or other such words mean.
            </li>
            <li className="cs-quote">
              I didn’t realise there were other use cases, like you can’t use
              your Wise account to trade in cryptocurrency.
            </li>
          </ul>

          <figure className="cs-figure">
            <div className="cs-frame cs-frame-tall">
              <img
                src="/assets/wise-testing-notes.png"
              width={1372}
              height={2113}
                alt="Session notes recording how each participant interpreted the policy"
              />
            </div>
            <figcaption>
              Session notes per participant — the same confusions kept
              resurfacing across IPTV, crypto, and “adult” versus “audit”
              content.
            </figcaption>
          </figure>
        </section>

        {/* ——— Personas ——— */}
        <section className="cs-section">
          <p className="cs-kicker">Synthesis</p>
          <h2 className="cs-h2">Three users in the grey area</h2>
          <div className="cs-prose">
            <p>
              I translated the data into actionable insights by building personas
              that represented the needs and pain points of our target audience
              — specifically the people whose activity sits close to the line.
            </p>
          </div>

          <ul className="cs-personas">
            {PERSONAS.map((p) => (
              <li className="cs-persona" key={p.name}>
                <div className="cs-persona-head">
                  <img src={p.avatar} alt="" width={480} height={480} />
                  <div>
                    <h3 className="cs-h3">{p.name}</h3>
                    <p className="cs-persona-type">{p.type}</p>
                  </div>
                </div>

                <p className="cs-persona-label">Can use Wise for</p>
                <ul className="cs-persona-list is-can">
                  {p.can.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>

                <p className="cs-persona-label">Cannot use Wise for</p>
                <ul className="cs-persona-list is-cannot">
                  {p.cannot.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>

                <p className="cs-persona-challenge">
                  <strong>Key challenge.</strong> {p.challenge}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ——— HMW ——— */}
        <section className="cs-section cs-hmw">
          <p className="cs-kicker">The opportunity</p>
          <p className="cs-hmw-text">
            How might we design an AUP experience that clearly distinguishes
            acceptable Wise use cases from unacceptable ones — even for users
            whose activities fall into a grey area, like occasional gambling,
            crypto, or IPTV?
          </p>
        </section>

        {/* ——— Exploration ——— */}
        <section className="cs-section">
          <p className="cs-kicker">Exploration</p>
          <h2 className="cs-h2">Six patterns, then a seventh</h2>
          <div className="cs-prose">
            <p>
              I explored a range of design patterns to find the most effective
              way to present the AUP.
            </p>
          </div>

          <ol className="cs-patterns">
            {PATTERNS.map((p, i) => (
              <li className="cs-pattern" key={p}>
                <span className="cs-pattern-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {p}
              </li>
            ))}
          </ol>

          <div className="cs-prose">
            <p>
              After careful consideration I landed on an{" "}
              <strong>inline expandable approach</strong> that combines the best
              elements of these patterns. The focus was on surfacing key points
              and encouraging people to read the essential details — a versatile
              design that serves both quick scanners and deep readers.
            </p>
            <p>
              Users tend to scan content in an <strong>F-pattern</strong>, so we
              structured the presentation to match that natural reading
              behaviour, placing key information along the left side and top of
              the content area.
            </p>
          </div>
        </section>

        {/* ——— Solution ——— */}
        <section className="cs-section">
          <p className="cs-kicker">The redesign</p>
          <h2 className="cs-h2">Before you continue</h2>

          <div className="cs-frame cs-frame-flush">
            <img
              src="/assets/wise-guidelines-card.png"
              width={1800}
              height={628}
              alt="Redesigned guidelines card shown during onboarding"
            />
          </div>

          <div className="cs-shots">
            <div className="cs-frame">
              <img
                src="/assets/wise-screens-compare.png"
              width={1800}
              height={1012}
                alt="Redesigned onboarding screens showing the expandable policy sections"
              />
            </div>
            <div className="cs-frame">
              <img
                src="/assets/wise-mockup-mobile.png"
              width={1112}
              height={1214}
                alt="Simplified mobile mockup of the Acceptable Use Policy step"
              />
            </div>
          </div>

          <ul className="cs-principles">
            {PRINCIPLES.map((p) => (
              <li className="cs-principle" key={p.title}>
                <h3 className="cs-h3">{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>

          <p className="cs-note">
            For privacy reasons these are simplified mockups. To see the actual
            design and a detailed breakdown of its implementation, reach out at{" "}
            <a href="mailto:shreyabhardwaj117@gmail.com">
              shreyabhardwaj117@gmail.com
            </a>
            .
          </p>
        </section>

        {/* ——— Collaboration ——— */}
        <section className="cs-section">
          <p className="cs-kicker">Collaboration</p>
          <h2 className="cs-h2">Legal language, written by humans</h2>
          <div className="cs-prose">
            <p>
              I worked closely with designers, incorporating diverse
              perspectives to create a user-friendly and visually engaging
              presentation of the AUP.
            </p>
            <p>
              Recognising the complexity of legal language, I partnered with
              content writers to translate jargon-heavy terms into clear,
              everyday language. I advocated for simple, direct wording that
              mirrored how users actually speak, which made the policy feel
              familiar enough to engage with.
            </p>
          </div>

          <ul className="cs-reviews">
            {REVIEW_NOTES.map((r) => (
              <li className="cs-review" key={r.who}>
                <p>{r.body}</p>
                <span className="cs-review-who">{r.who}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ——— Hardest part ——— */}
        <section className="cs-section">
          <p className="cs-kicker">Breaking old habits</p>
          <blockquote className="cs-pull">
            The biggest hurdle? Changing user behaviour. Getting people to
            engage with the AUP was like convincing someone to read IKEA
            instructions — a challenge we all know too well. Users expect these
            agreements to be long, boring, and instantly forgettable. We needed
            to shatter those expectations and make our AUP stand out in a way
            that was engaging and even, dare I say, enjoyable.
          </blockquote>
        </section>

        {/* ——— Impact ——— */}
        <section className="cs-section">
          <p className="cs-kicker">Impact</p>
          <h2 className="cs-h2">People started reading it</h2>

          <div className="cs-prose">
            <p>
              The goal was to reduce account deactivations and improve
              understanding of Wise’s policies. Engagement was the first
              measure to come back, and it moved sharply.
            </p>
          </div>

          <div className="cs-stat">
            <span className="cs-stat-figure">65%</span>
            <p className="cs-stat-body">
              increase in engagement with the Acceptable Use Policy after the
              redesign shipped — the document people used to scroll straight
              past was now being read.
            </p>
          </div>

          <ul className="cs-steps">
            {NEXT_STEPS.map((s) => (
              <li className="cs-step" key={s.title}>
                <h3 className="cs-h3">{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ——— Learnings ——— */}
        <section className="cs-section">
          <p className="cs-kicker">My learnings</p>
          <h2 className="cs-h2">What I took away</h2>
          <ol className="cs-learnings">
            {LEARNINGS.map((l, i) => (
              <li className="cs-learning" key={l.title}>
                <span className="cs-learning-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="cs-h3">{l.title}</h3>
                  <p>{l.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="cs-footer">
          <a className="cs-footer-back" href="/">
            <span aria-hidden="true">←</span> Back to portfolio
          </a>
          <a
            className="cs-footer-mail"
            href="mailto:shreyabhardwaj117@gmail.com"
          >
            shreyabhardwaj117@gmail.com
          </a>
        </footer>
      </main>
    </div>
  );
}
