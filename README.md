# Portfolio — Shreya Bhardwaj

Personal portfolio site. Product design work, case studies, and a playable
snake game in the hero.

Built with React, TypeScript and Vite.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview  # serve the build
```

## Structure

The site is a Vite multi-page app — one real HTML entry per route, so each
case study resolves as a directory index on any static host without rewrite
rules.

| Route | Entry | Renders |
| --- | --- | --- |
| `/` | `index.html` | `src/App.tsx` |
| `/wise-case-study/` | `wise-case-study/index.html` | `src/FramerEmbed.tsx` |
| `/quickfix-case-study/` | `quickfix-case-study/index.html` | `src/FramerEmbed.tsx` |
| `/dadvice-case-study/` | `dadvice-case-study/index.html` | `src/FramerEmbed.tsx` |

Case study routes need the trailing slash — they're directory indexes.

### Main components

| File | What it does |
| --- | --- |
| `src/App.tsx` | Panel composition and the `useHorizontalDeck` scroll hook |
| `src/HeroIndex.tsx` | Hero: wordmark, section index, snake |
| `src/PixelSnake.tsx` | Canvas snake — attract mode and playable mode |
| `src/HeroTraits.tsx` | Personality pills, spawned where each apple is eaten |
| `src/CaseStudies.tsx` | Case study rail and panels |
| `src/AboutSection.tsx` | About: greeting, photos, story, fun facts |
| `src/ExperienceSection.tsx` | Work history card |
| `src/FramerEmbed.tsx` | Shell that frames a live Framer case study page |
| `src/WiseCaseStudy.tsx` | Hand-coded Wise case study (not currently routed) |

## Notes

**Horizontal deck.** The page scrolls sideways between panels. `useHorizontalDeck`
translates wheel gestures into panel changes while letting panels that overflow
scroll vertically first, so a long panel doesn't jump to the next one mid-read.

**Snake.** Runs at two cadences: a slower ambient loop while nobody's playing,
and the classic Nokia speed once you press Play, tightening as the snake grows.
`prefers-reduced-motion` holds the idle loop still. Collecting apples reveals
personality pills at the spot each apple was eaten.

**Design tokens.** `src/index.css` holds the type scale, spacing scale,
line-heights, tracking and colour ramp. Two font families: Figtree for display,
Manrope for text. Section headers share one eyebrow / title / lede pattern
defined once in `src/App.css`.

**Resume PDF.** `public/shreya-bhardwaj-resume.pdf` is committed so deploys serve
it at `/shreya-bhardwaj-resume.pdf`. Source lives outside this repo as a LaTeX
file; rebuild it there and copy the output over this path.

**Framer embeds.** The case study routes currently frame the live Framer pages
rather than serving coded ones. Framer's own nav is clipped by offsetting the
iframe, and below 1000px the shell hands off to the real URL because those
pages have no small-screen layout. This is temporary — see `tasks/todo.md`.
