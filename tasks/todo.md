# About section redesign — better-layout + better-typography

Audited the rendered section at 390 / 768 / 1024 / 1440 / 1920, under
pseudo-localization and in the RTL mirror. Findings and fixes below.

## Typography

- [x] Add a role-based type scale to `index.css` (size + line-height + weight travel
      together) and map every About role onto it — replaces 9 ad-hoc sizes with
      near-duplicate pairs (20/19.2, 15/14, 11/11/12)
- [x] Kill the two visible widows ("see." and "it?") — drop the hard `<br>` from the
      display statements and let `text-wrap: balance` set the lines
- [x] `text-wrap: pretty` on the descriptions
- [x] Body line-height 1.45 → ~1.55 (skill floor for body copy is 1.5)
- [x] One uppercase label role at 12px, one tracking — currently three treatments
      at 11/11/12px
- [x] Add `-moz-osx-font-smoothing: grayscale` to the root (only `-webkit-` was set)

## Layout

- [x] One content measure and one leading edge — currently 640 / 448 / 480 with three
      trailing edges (0 / 192 / 160)
- [x] Spacing scale, with inter-group gaps ≥ 2× intra-group; story gaps are currently
      a near-uniform 18–38 so the narrative beats do not group
- [x] Remove the `.about-soft-follow { margin-top: -8px }` negative-margin hack
- [x] Logical properties: `text-align: left` → `start`, `left: 0` →
      `inset-inline-start` (the fact card does not mirror in RTL today)
- [x] `.about-facts-deck { height: 220px }` → grid stacking, so the deck is sized by
      its tallest card and translated copy cannot clip it (3px headroom today)
- [x] Fun-fact dots: 8px targets with 7px gaps → expanded hit area + clearance
- [x] Stacked cards peek 10px → 16–32px so the stack reads as swipeable

- [x] Align the Experience card to the same measure — it scrolls in the same panel,
      so 720px against 576px read as a stray edge. Date ranges went to two lines at
      the narrower width, so the date column is now `minmax(max-content, …)` with
      `white-space: nowrap`.

## Open

- [ ] Four dashed "Photo 1–4" placeholders still ship in production. Shreya is
      sending real photos; drop them into `PHOTO_SLOTS` when they arrive.

## Review

Rendered-page audit at 390 / 480 / 640 / 768 / 1024 / 1280 / 1440 / 1920, plus
pseudo-localization, the RTL mirror and `prefers-reduced-motion`.

Typography — 9 ad-hoc sizes with three near-duplicate pairs (20/19.2, 15/14,
11/11/12) are now 7 roles from one scale. Every line-height is an explicit
unitless ratio; five elements were previously on `normal`. The two visible
widows are gone at all 8 widths, fixed by deleting the hand-broken lines from
the display statements and letting `text-wrap: balance` set them.

Layout — three content widths (640 / 448 / 480) and three trailing edges
(0 / 192 / 160) are now one 576px measure with a single leading and trailing
edge. Grouping went from a near-uniform 18–38px to 12px inside a beat, 48px
between beats, 96px between sections: 4x and 2x, so the ratio does the work.
The fact deck is grid-stacked instead of `height: 220px`, so it grows with its
tallest card rather than clipping (it had 3px of headroom under translation).
The fact card now mirrors correctly in RTL, where it used to sit 80px off its
own container's leading edge. Fun-fact dots went from 8px targets at 7px gaps
to 24px targets that no longer overlap, with the active scale moved onto a
pseudo-element so it can't inflate the hit area.

Section is 2023px tall, down from 2230px, despite the larger gaps — the wider
measure buys back more lines than the spacing spends.

Not verified: real assistive-technology output, and any locale beyond the
pseudo-localized run.

---

# Font consolidation

The home panel only ever used Manrope and Figtree; Playfair Display appeared in
23 rules everywhere else, which is why Playground and the case studies read as a
different site.

- [x] Two families, both already on the home page: Figtree for every display
      voice (wordmark, headings, italic asides), Manrope for text and UI
- [x] Weight tokens (`--weight-display: 700`, `--weight-title: 600`) — Figtree has
      no stroke contrast, so display hierarchy comes from weight where Playfair's
      400 carried it
- [x] Drop Playfair from both HTML entry points; load Figtree's real italic axis
      so the asides aren't browser-synthesized (Manrope has no italic at all)

Verified: exactly 2 families render, every weight/style combo in use resolves to
a real loaded face (no synthesis), 0 widows across 390–1920, and no overflow.

## Section-header IA consistency

Four sections had four different text hierarchies. Unified into one pattern.

| | Before | After |
|---|---|---|
| Text leading edge | Home 58px, Cases 104px, Playground 104px, **About 432px** | Cases / Playground / About all **104px** |
| Eyebrow | 11px/700/0.16em (Cases, Wise), 12px/700/0.16em (Playground), none (About) | `--text-label` 12px / 600 / `--track-label` everywhere |
| Eyebrow → title gap | 18px / 12px / 14px | `--space-4` everywhere |
| Section title | 56px lh1.12, 80px lh0.98, 112px lh1.06, 76px lh1.02 | `--text-section` 80px / `--lh-section` / `--track-section` |
| Lede | Playground: **italic Figtree 25.6px lh1.35**; others Manrope 17–20px | Manrope `--text-lead` / `--lh-lede` everywhere |

- New tokens in `index.css`: `--text-section`, `--lh-section`, `--track-section`.
- `App.css` now defines the eyebrow / title / lede roles **once**, as grouped
  selectors, instead of one private copy per section.
- `.about-shell` moved into the shared `--max` container and left-aligned; the
  36rem reading measure now lives on its children, so About hangs on the same
  leading edge as the case rail rather than floating centre.
- About gained the missing eyebrow and lede so it has the same three parts.
  Copy is placeholder — "The person behind the work" / "How I got here, what I
  care about, and a few things that keep me curious."

Deliberately left alone: the hero masthead (full-bleed wordmark, its own
scale) and the Wise page's narrower article measure (standalone long-form).

## About width, snake cadence, case-study 404

**Case study 404.** `href` was `/wise-case-study` but that path is a directory
index — the Vite dev server and most static hosts only serve it at
`/wise-case-study/`. Added the trailing slash; link now returns 200.

**About width.** Everything was locked to one 36rem column on the leading
edge, which left ~656px of the 1232px panel empty and squeezed both display
statements into three stub lines. Width is now assigned by role:

| Block | Width at 1440 |
|---|---|
| Header (eyebrow/title/lede) | 576px |
| Story (display statements) | 832px |
| Prose inside the story | capped at 544px |
| Photo grid | 1232px (full panel) |
| Fun facts | 576px |

All still start at 104px, so the leading edge stays shared with Playground and
the case rail. Display statements now break in 2 lines, and "What drives me"
fits on one row instead of two.

**Photo grid.** 4 slots to 6, on a 6x2 grid. Spans tile it exactly
(4+3+1+2+1+1 = 12) so there are no holes; at =640px it drops to 2 columns with
spans of 1 or 2, which also tiles cleanly and keeps DOM order (no `dense`).

**Snake cadence.** Attract mode and play mode shared `TICK_MS = 145`, so the
idle loop was busy enough to pull the eye off the hero copy. Split:

- attract 235ms/step -> measured 4.25 steps/sec
- playing 145ms/step -> measured 6.75 steps/sec
- speeds up 2.5ms per apple, floored at 95ms, so it tightens as you grow
- `prefers-reduced-motion` now holds the idle loop still (verified: two frames
  2s apart are byte-identical) while Play still runs
- a long stall no longer pays itself back as a burst of steps

## Experience + fun-facts card width

The Experience card was 36rem and centred, so once About moved to the 104px
leading edge it read as a stray edge. Both card objects now match About's
story block: 52rem wide, hung on the shared leading edge.

- `.exp-card` aligns to the `--max` container without a wrapper via
  `margin-inline: max(0px, (100% - var(--max)) / 2) auto`.
- `.about-facts-block` moved 36rem -> 52rem, since a 576px card stacked
  directly above an 832px card stepped in and out for no reason.
- `.exp-row` date column capped at 12rem (was `0.38fr`, which grew to ~277px
  at the new width and stranded the role copy).
- "Professional experiences" was hand-broken into two `<span>`s with
  `display: block`. At 832px it fits on one line, so the spans are gone and
  `text-wrap: balance` handles narrow viewports (verified: 1 line at 1440 and
  768, 2 at 390).

Widths in the About panel are now role-based, three values not five:
header 576 · story + cards 832 · photo grid 1232. All start at 104px.

## Wise case study — temporary Framer embed

"View case study" now frames the live Framer page instead of the coded one.

- New `src/WiseFramerEmbed.tsx` + `.css`. `wise-main.tsx` points at it.
- `src/WiseCaseStudy.tsx` and `.css` are untouched and still in the repo —
  restoring is a one-line import swap in `wise-main.tsx`.
- Checked first that Framer sends no `X-Frame-Options` or CSP
  `frame-ancestors`, and confirmed no JS frame-buster (top URL stays ours).
- Framer's own nav band is exactly 90px at 1440/1024/768/390 and scrolls with
  the document rather than sticking, so the frame is pulled up 90px inside an
  `overflow: hidden` wrapper with the height added back. The visible window is
  still full height, just offset past the nav, so nothing is cut mid-line.
- Chrome is one glass "Back to portfolio" pill to `/`. No site nav.

Verified: desktop click-through lands on `/wise-case-study/` with no site nav,
the Framer page rendered, back returns to `/`.

### Known limits
- **Mobile**: the Framer page has no small-screen layout; it relies on the
  browser scaling its ~1400px viewport down, which iframes don't do, so the
  hero clipped with no way to scroll to it (`scrollWidth == innerWidth`, the
  content just overflowed hidden). Below 1000px we now `location.replace` to
  the real Framer URL and let the browser's back button return.
- The "Made in Framer" badge stays — cross-origin, can't be removed, and
  masking it would cover content.
- Framer's clipped nav links are still in the iframe's DOM, so a keyboard user
  tabbing into the frame can reach links they can't see. Not fixable across
  origins; goes away when the coded page returns.
- The 90px offset is hardcoded. If Framer changes that nav height, it drifts.

## QuickFix + Dadvice on the same embed shell

Generalised the Wise-only shell into `src/FramerEmbed.tsx` (props: `url`,
`name`) + `FramerEmbed.css`, and gave each case study a real route:

| Route | Frames | Was |
|---|---|---|
| `/wise-case-study/` | Framer wise page | already embedded |
| `/quickfix-case-study/` | Framer quickfix page | direct link, new tab |
| `/dadvice-case-study/` | Framer dadvice page | direct link, new tab |

- One HTML entry + `src/<stem>-main.tsx` per route, registered in
  `vite.config.ts`. Directory indexes, so they need the trailing slash.
- QuickFix and Dadvice dropped `external: true`, so they open in the same tab
  and the CTA arrow is the internal one. `CaseStudies.tsx` keeps the `external`
  capability for future genuinely-outbound links.
- Playground marquee tiles repointed to the same routes.
- Checked both new Framer URLs send no framing headers, and their nav band is
  also exactly 90px, so the shared offset holds for all three.

Verified all three: HTTP 200, no site nav, back button to `/`, frame loaded,
Framer nav clipped, and the rail links open in the same tab.

## Real photos in the About section

Six photos replaced the dashed placeholders, so the pending placeholder task is
closed.

Optimised to JPEG, 1100px long edge, q76, progressive — 778KB for all six
(largest 253KB). `loading="lazy"` and `decoding="async"`, with intrinsic
`width`/`height` on each `<img>` so they don't shift layout.

The grid was reshaped so cells match the photos rather than cropping faces. The
set is 3 portraits (0.75 / 0.75 / 0.77) and 3 landscapes (1.33 / 1.33 / 1.48),
so the row height is tuned to make a 1-column cell ~0.75 and a 2-column cell
~1.55:

| Slot | Cell at 1440 | Photo | Crop |
| --- | --- | --- | --- |
| portrait-lg | 403x530 (0.76) | graduation (0.75) | 1% |
| landscape | 403x259 (1.55) | workshop (1.33) | 14% |
| landscape | 403x259 (1.55) | team studio (1.48) | 5% |
| landscape | 403x259 (1.55) | team social (1.33) | 14% |
| portrait | 195x259 (0.75) | Athens (0.75) | 0% |
| portrait | 195x259 (0.75) | park (0.77) | 2% |

Spans still tile the 12 cells exactly in DOM order (4+2+2+2+1+1). `focus` sets
object-position per photo, nudged up where heads sit high.

At =640px it becomes two columns of squares — a uniform ~25% crop, which keeps
the section compact instead of stacking six full-height photos into a very long
scroll. Faces checked at 1440, 1024 and 390.

Dropped the now-dead `.about-photo-label` styles.

## Snake reward pills: copy and cadence

The four pills mixed voices — "I vibe code" had her speaking, "curious" and
"systems brain" were bare labels — and only the first few were ever reachable.

Now it opens with "Learn more about Shreya" on the first apple (the accent
pill), then one quality every second apple: scores 1, 3, 5, 7, 9, 11...
Fourteen qualities, all third person, so they read as one voice introducing
her.

The thresholds are derived from `INTRO_AT` and `QUALITY_EVERY` rather than
hand-written per trait, and `unlockedCount()` awards the next pill whenever the
score has run ahead, so nothing is missed if a tick is skipped.

Most players will never reach the last few, so the quality order re-shuffles
each run — a replay shows a different set.

Long copy needed a real clamp. A pill is centred on the apple, and at 190px
wide ("She mixes depth with personality") the old fixed 76px pad let it hang
off the band. It now measures its own width in a layout effect and nudges back
in before paint, so the crop is invisible.

Verified by letting attract mode feed itself: pills arrived at scores
1, 3, 5, 7, 9, 11, intro first and accented, one voice throughout, none
escaping the band. The clamp was then forced by squeezing the band to 300px —
it held on all six, including pills wider than the gutters allow.

## Location prominence and the missing Tails.com role

Readers were missing "Amsterdam-based" because it sat in running text at the
same weight as everything around it. The city now carries an accent swipe at
weight 700 — 12.22:1 against the dark ink, so it passes AA comfortably. The
swipe has no side padding on purpose: the word is followed immediately by a
hyphen, and horizontal padding there reads as a stray space.

Hero lede is now: Amsterdam-based designer. Currently working as a product
designer at Miro, shaping how teams collaborate in a multiplayer world with AI.

Tails.com was absent from the experience list entirely, not just its location.
Added from the resume as Associate Product Designer, London, Mar 2025 – Jul
2025, which also makes the count badge read (5).

Since the complaint was about a missing location, every role now shows its
city behind a dot separator. The dot is a pseudo-element so it isn't announced,
and it hangs off the place rather than sitting between the two, so it wraps away
with it on narrow rows. Cities only — the countries add width without telling
the reader anything.

While reconciling against the resume, three other entries were off and are now
aligned: Wolffkraft was "2022 – 2023" (Dec 2022 – Jun 2023), Userfacet was
"2022" (Jun 2022 – Nov 2022), and both were titled "Product Designer" / "UX
Designer" rather than "UX/Product Designer". Normalised "June" to "Jun" on the
Wise row so the date column is consistent.

Still mismatched on purpose: the site says Product Designer at Miro, the resume
says Junior Product Designer.

## Case study renamed to Miro AI Presence

The first card said "Miro's AI Sidekicks" in four places: the card title, the
short label in the hero index, a tag, and the GIF's filename. All four now say
AI Presence, which matches the resume ("Led the visual and UX identity for Miro
AI Presence, launched at Canvas 2025"). The asset moved with `git mv` so its
history follows it.

Two copy knock-ons from the rename: the "Presence" tag and the description's
opening word both became a third echo of the product name, so the tag is now
"Multiplayer" (matching the hero lede) and the description opens "Intent,
awareness, and collaboration".

Outstanding: the GIF is a recording of the Create Sidekick modal, so the
artwork still shows the old feature. Needs a replacement clip.

## Second Miro card: Obeya room, not "collaboration"

The card was filler — "Making collaboration feel inevitable" over "Systems that
help teams move from idea to shared understanding with less friction" — and said
nothing about the actual project.

It's client work: a major US aviation company, under NDA, whose Obeya room was
rebuilt in Miro. The client can't be named, so the sector carries the weight
instead.

- Title: An Obeya room, rebuilt in Miro
- Description: Lean planning lives on the walls of one physical room. For a
  major US aviation client, that room became a canvas.
- Tags: Product design / Enterprise / Client work
- Hero index label: Miro Obeya room

"Obeya" is left unglossed in the title and explained in the description, since
most readers won't know the term but it's the thing that makes the card worth
reading. At 113 chars the description sits with its siblings (106, 121, 123).

## Vertical scrolling

The horizontal deck broke the reading model — clicking Work slid the page
sideways. The whole thing was three CSS rules and a wheel-hijacking hook, so
the fix was mostly deletion: `.page` lost its `height`/`overflow`, `.deck`
lost the flex row, x-snap and scroller, `.deck > *` lost the 100vw panel sizing
and its own nested scroller, and `useHorizontalDeck` (about 100 lines
intercepting wheel events, tracking gesture intent and animating panels) is
gone.

Everything else was already vertical-friendly: sections set `min-height:
100vh`, `scroll-behavior: smooth` was on `html`, and the case rail's
IntersectionObserver used `root: null`, so it kept working untouched.

Native scrolling now handles anchors, Page Up/Down, Home/End, space and
find-in-page, none of which the hook supported. The snake already
preventDefaults arrow keys with `capture: true`, so steering still holds the
page still — verified both directions.

Two things the change made relevant:
- `scroll-behavior: smooth` now animates jumps of up to nine viewports, so
  `prefers-reduced-motion` cuts it to `auto`.
- `.page`'s `overflow: hidden` used to absorb overflowing decorative art. Tested
  from 390 to 1920 with clipping disabled — every section already clips its own,
  so no replacement rule was needed.

## About glimpse, and a denser case grid

Feedback was "About is too long, and I want a glimpse of the person right after
home". Measuring first reframed it: About was 3.4vp but Case Studies was 5.0vp,
43% of the page, and About didn't start until viewport 6.3. It read as too long
because it was buried.

**Glimpse band** (new `AboutGlimpse.tsx`) sits between the hero and the case
studies at vp 1.3: a one-liner, the "what drives me" pills, a link down, and
the six photos as a full-width strip. The photos and pills *moved* rather than
being copied, so About dropped to 2.57vp and nothing is duplicated — asserted
in the browser (four pills on the page, not eight).

The strip weights its grid columns by each photo's aspect ratio and puts that
same ratio on the frames. If width is k × ratio then height is k for every
frame, so they all match exactly with zero cropping — measured 0% crop at 1440
with all six frames at 197px. Below 900px it becomes squares, since six
proportional columns get too short to read.

**Case grid** replaces five full-viewport panels, which cost 5vp and only ever
showed one study at a time. Cards put company, sector and result side by side:
2.53vp, and the page went 11.7vp → 9.0vp.

- Sector on each card, so a recruiter who doesn't know the name still gets it
  ("Visual collaboration SaaS, 100M+ users").
- A stat per card. All of them are Shreya's own numbers, nothing inferred:
  Obeya 433K MAU (+40% YoY, 87% retained at 6 months), Wise +65% engagement,
  Dadvice investor-backed, AI Presence "Canvas 2025" as a placeholder pending
  real figures. QuickFix has none yet and the card handles the absence.
- The whole card is the click target via a link on the title stretched with
  `::after`, so there's one link per card rather than nested links. Verified by
  clicking dead space near the tags and landing on the case study, and that
  incoming cards stay inert.
- Cards without artwork keep a placeholder media block. Without it the Obeya
  card stretched to its neighbour and left a hole in the middle.
- The rail went with the panels, along with ~9.7KB of dead CSS (rail, panels,
  media frames, pill CTA, and the legacy `.project-*` rules from before the
  deck).

Verified at 390/768/1024/1440: no horizontal overflow, no nested scrollers, no
console errors, no failed assets, and nav anchors landing with scrollX at 0.

Open question flagged to Shreya: the featured card is Miro AI Presence, which
is "Incoming" and therefore not clickable, so the lead card can't be opened.

## Three more photos, and one row implementation

Added the graffiti-wall team shot, the Becoming Wiser cohort, and the Concern
Worldwide volunteering photo. They went into the long About section rather than
the glimpse strip: nine photos in one justified row would drop it to about
120px tall, and the long About had been left with no images at all after the
photo grid moved up.

Placed just above the fun facts, so the Concern shot sits directly over the
"Volunteer — Helped out with Concern UK" card that mentions it. It also breaks
up what had become an unbroken column of text.

Sources: the Concern photo came from the 3024x4032 HEIC in Downloads via
`sips`, not the 768px attachment, and the team shot from the original JPG. The
Becoming Wiser one only existed as a screenshot, so a flat-edge detector
trimmed its border (852x640 -> 848x638). All three at 1100px long edge, q70-76,
490KB total, lazy with intrinsic dimensions.

Rather than a second copy of the proportional-column trick, it moved into a
shared `PhotoRow` component: columns weighted by each photo's ratio, frames
carrying the same ratio, so every frame lands at one height with nothing
cropped. The glimpse strip and the About row are now the same component with
different width variants. Measured 0% crop on both at 1440 and 1024.

The two rows part company on mobile, deliberately. The glimpse squares its
photos, which costs 33% — fine for solo shots. Squaring the About row cropped
46% off the widest frame, and that one has five people in it, so below 640px it
becomes one column at true ratios instead. Cropping scenery is fine; cropping
people out of a group photo is not.

## New "outside of work" copy

Shreya's own summary replaces the spectrum block, which it contradicted: the
old line was "Either coffee and a book on the couch all day… or six places
planned to the minute. Almost no in-between," and the new copy is "follows my
mood… often I'm just out exploring the city with no plan at all." Both couldn't
stand.

It reads as two paragraphs in one beat — the three moods, then volunteering —
with "Concern Worldwide" carrying the emphasis that "Almost no in-between" used
to. Punctuation normalised (her hyphen-as-dash and em dash became sentence
breaks) and the four hand-broken `<br>` lines are gone, so nothing strands a
word at odd widths. Checked at 1440 and 390: four/five lines and two/three
lines, both ending on a full word.

Dropped the Volunteer fun fact. It said "Helped out with Concern UK", which the
prose now covers in her own voice — and names correctly as Concern Worldwide,
which is what the vest in the photo says. The deck is three cards now and the
counter follows. Easy to restore with different copy if she wants four.

## Glimpse alignment

The section had three different left edges and no shared top line. Measured at
1440:

| Element | Left edge |
| --- | --- |
| Photo strip | 58px |
| `.case-head` / `.about-shell` | 104px |
| Glimpse eyebrow and headline | 162px |

Root cause: `.glimpse-head` set `max-width: var(--max)` *and*
`padding: 0 var(--page-pad)`, so the gutter was counted twice and its text
started 58px inside the site's leading edge. The strip had the opposite
problem — `padding` but no `max-width`, so it was half-bleed, ending 46px past
the content edge and lining up with nothing.

Fixed by putting the gutter on the `.glimpse` section once, and giving the head
and the strip the same `max-width: var(--max); margin-inline: auto`. All five
edges now agree, verified at 940/1024/1100/1280/1440/1920.

`align-items: flex-end` was bottom-aligning two columns of different heights,
which pushed "WHAT DRIVES ME" 64px above "OFF THE CLOCK". The head is a
two-column grid with `align-items: start`, so the labels share a line.

The pills column is capped at 27rem rather than being a fraction. As a fraction
it drifted with the viewport and broke the four pills 3+1 at 1440 and one per
row when narrow. Fixed, it holds 2+2 at every width and stays flush with the
container's right edge — the same edge the last photo frame ends on.

Strip frames went 197px → 183px, since the row now spans the content column
rather than overhanging it.

## What drives me: new copy

Replaced all four pills with Shreya's three: Data, Asking why, Old-school
design + AI. Phrased as noun fragments to match the label style, and the third
uses the `+` that "Mixing depth + personality" already established rather than
spelling out "blend of". Dropped the now-unused fourth pill colour, so the
three take yellow, green and blue.

The screenshot showing them stacked one per line was the pre-alignment layout
(the label sat above the pills rather than level with the eyebrow), so the
earlier fix already covered it. Swept 390 to 1920 plus three zoom levels: three
pills on one row everywhere, with room to spare.

The shorter copy did expose one thing. The pills column had been capped at
27rem, which the four long labels filled; three short ones left it well short
of the container's right edge while the photo strip below still ran to it. The
column is content-sized now — `minmax(min-content, max-content)` with the 1fr
beside it absorbing the slack — so the pill row ends exactly where the strip
does. Confirmed identical right edges at 920/1024/1100/1280/1440/1920, with the
`max-width: 27rem` kept on the list so a long label wraps instead of eating the
headline's column.

## Volunteering photo into the glimpse strip

Swapped the park sunset shot out of the glimpse strip for the Concern
Worldwide volunteering one, and moved the park shot down into the About row
slot it vacated. A swap rather than a straight replacement, so neither row
loses a frame and no photo appears twice — asserted in the browser.

Both are portrait at 0.750 and 0.768, so no geometry changed: the strip is
still six frames at 183px and the About row three at 307px, all at 0% crop.

Trade-off worth noting: the volunteering shot no longer sits directly above the
"including Concern Worldwide" sentence in About, which was why it was placed
there. It now leads with the person instead, higher up the page. The About row
is the team and city photos.

## Case card review (better-interface)

Scope: the five case-study cards, via better-layout, better-typography and
better-ui. better-colors and better-writing not reviewed — no evidence in this
scope. Findings, by root cause:

| Sev | Principle | Before | After |
| --- | --- | --- | --- |
| HIGH | ui / accessibility | `scale(1.04)` had lost its hover selector and applied to every card image at rest, cropping 2% off each and pushing the document 5px wide at 320px | selector restored to `.case-card.is-open:has(a:hover)`; card clipping now 0 at every width |
| HIGH | ui, focus | the focus ring was the browser default on the inline title link, boxing two wrapped lines instead of the card | ring moved to the stretched `::after`, tracing the card at its own radius, inset so the card's clip can't cut it. On the link itself, so it does not depend on `:has()` |
| MEDIUM | layout, group with space | every gap in the card body was 12px — brand/title/desc/stat/foot all equal, so nothing grouped | four semantic groups (identity, headline, proof, meta) with 24px between and 4–8px inside, i.e. 3x |
| MEDIUM | layout, space not lines | `.case-stat` had `border-top` plus 12px padding plus 4px margin, a rule doing a job the gap already did | separator deleted |
| MEDIUM | typography, type scale | five ad-hoc sizes (11/13/15/17px) bypassing the project's own tokens | 12/14/16/20/28px, all `--text-label` through `--text-title` |
| MEDIUM | typography, hierarchy | title and stat value were both 28px, so neither led | stat value one step down at `--text-lead` (20px) |
| MEDIUM | ui, shadows for depth | `border: 1px solid var(--border-subtle)` for elevation | `--shadow-border` / `--shadow-border-hover`, the skill's exact three-layer oklch values |
| MEDIUM | ui, image outlines | card images had no outline | `1px oklch(0 0 0 / 0.1)` at `outline-offset: -1px`, with the media's flush corners matched to the card radius so it hugs them |
| MEDIUM | layout, growth | the status chip shared a line with the sector and wrapped under the company name at narrow widths | chip trails the identity row, sector on its own line; brand row is 1 row at every width from 320 to 1920 |
| LOW | ui, motion restraint | 300ms on the card hover | 150ms, with the image zoom at 400ms |

Concentric radius: media is flush, so outer = inner + 0 padding and the media
takes the card's radius on its flush corners only — logical corner properties,
so the featured card's split mirrors. Verified in RTL: media moves to the
leading side and its radius follows (`20px 0 0 20px`).

Verification: widths 320/390/640/768/900/1024/1280/1440/1920 — group gaps
24/24/24, brand 1 row, no card clipping. 200% zoom at 1440 and 390 — title
fits, prompt visible. RTL mirror. Reduced motion — no transform on hover, and
the shadow still deepens so the state never rests on motion alone. Empty state
— the stat-less QuickFix card keeps its foot baseline level with Dadvice
(718px both).

Pre-existing, outside this scope and not in the verdict: the page is 5px wider
than a 320px viewport. It is the Playground marquee track (5489px), not the
cards.

## Case grid: three wide, two paired

Presence, Obeya and Wise run the full grid width with their media beside the
copy; QuickFix and Dadvice share the last row. Driven by `WIDE_COUNT` rather
than an index check, and `is-featured` became `is-wide` since it no longer
means "the one".

Going full width exposed two things that were fine at half width:

- The Obeya placeholder held 50% of a 1232px card, so a third of the section
  was blank grey. Artwork still gets 50%; a placeholder now gets 34%.
- Three titles at `--text-display` (50px at 1440) all shouted, and "Increasing
  transparency for legalese" wrapped to three lines in the narrower copy
  column. The wide cards now use `--text-title`, the same step as the paired
  ones — width and the side-by-side split carry the emphasis, which is also one
  fewer size in the scale. All five titles now fit on one or two lines.

Section is 2.54vp, about where it was before the rearrangement (2.53vp), and
the page is 9.5vp.

Verified: 320–1920 with no card clipping and the group gaps holding at
24/24/24; the status chip sits exactly on the identity row's trailing edge at
every width (the earlier "false" reading was a tolerance artifact in the check,
not a layout bug); RTL mirrors the media to the leading side with the radius
following (`20px 0 0 20px`), the placeholder keeping its 34%, and the paired row
reversing; reduced motion leaves no transform on hover while the shadow still
deepens; the focus ring is on the card overlay at 2px with the card's radius
and the native inline ring suppressed.

## Removed the coffee preamble, kept the mug

Dropped "Hey, nice to meet you / Wait, let me just get my coffee first" and
"Okay, I think I'm good now / So yeah, let me tell you about myself". The story
now opens on "I was a kid who painted walls", with the mug above it.

The mug moved out of the beat wrapper and into the story directly — with one
child left, the wrapper only added a gap the story already sets. Its leftover
4px margin went too: it had made this the one 52px gap in a column of 48s.

Its alt text went to empty. It used to illustrate the line about fetching a
coffee; with that line gone it is decoration, and "Pixel art coffee mug" would
be read out for no reason. Matches how the pixel fields are already handled.

Verified at 1440 and 390: the removed copy is gone, story gaps are even
(48px / 32px), the mug's leading edge sits on the story's, and About is 2.66vp,
down from 2.86.

## Hero: wordmark and snake both in the viewport

The hero measured 1205px against a 900px window — 305px over — so the name and
the game were never on screen at once. Two independent causes:

1. **The snake band had no definite height.** Its content is a canvas sized
   with `height: 100%`, and a percentage height cannot resolve against an
   auto-height parent, so the band fell back to its content and settled at
   699px, dictating the hero's size. It now takes `clamp(150px, 32vh, 380px)`
   and still grows into whatever the index and wordmark leave over, with a
   150px floor so the game stays playable.
2. **The wordmark was sized from width alone.** At 1440 it came out 189px
   regardless of viewport height — 188px of box on a 700px window. The fit
   script now also honours a ceiling, and reads both the cap (`max-height`) and
   the line-height ratio from CSS rather than repeating either number in JS. It
   also re-fits on a height-only resize, which the ResizeObserver on the parent
   had been ignoring.

Measured hero vs viewport, with both elements fully in view:

| Viewport | Hero | Both visible |
| --- | --- | --- |
| 1920x1080 | 1080 | yes |
| 1440x900 | 900 | yes |
| 1440x700 | 700 | yes |
| 1280x800 | 800 | yes |
| 1024x768 | 768 | yes |
| 768x1024 | 1024 | yes |
| 430x932 | 932 | yes |
| 390x844 | 844 | yes |

The tighter band applies from 820px, the width where the index collapses to one
tall column, rather than from the phone breakpoint — that is what brought the
iPad in.

Still overflowing, and not fixable by spacing: 375x812 by 25px, 375x667 by
158px, and landscape phones. On those the stacked hero index alone is 550px,
against a 667px screen. Closing it means trimming the index on small phones —
its experience and case lists repeat sections further down — which is a content
call, so it is left for Shreya.

## Hero experience list: company and logo only

Each entry was "Miro: Product Designer (Aug 2025 – Present)", which wrapped to
two lines on most of them. Now it is a 20px mark plus the company name, on one
line. The roles, dates and locations are unchanged on the Experience card
below, so nothing was lost — just not said twice.

Logos already in the assets: Miro, Wise, Wolffkraft, Userfacet. All four are
square tiles carrying their own background, so they take the same
`oklch(0 0 0 / 0.1)` hairline the photos use rather than meeting the white
page edge-to-edge.

Tails.com has no mark on file and renders a monogram. The first attempt used
`--surface-sunken`, which beside four solid marks read as an image that had
failed to load, so it now takes their visual weight.

A useful side effect: single-line rows shrank the stacked mobile index from
550px to 506px, which pulled 375x812 inside the viewport on top of the sizes
already fixed. Remaining overflow is 375x667 (114px) and landscape phones.

| Viewport | Hero | Both visible |
| --- | --- | --- |
| 1920x1080 | 1080 | yes |
| 1440x900 | 900 | yes |
| 1280x800 | 800 | yes |
| 1024x768 | 768 | yes |
| 768x1024 | 1024 | yes |
| 430x932 | 932 | yes |
| 390x844 | 844 | yes |
| 375x812 | 812 | yes |
| 375x667 | 781 | no, 114px over |

## Current chip in the hero experience list

A Current chip sits after Miro. Driven by the `current: true` flag already on
the experience data, not a hardcoded first-row check, so it moves with the role.

Reuses the Experience card's chip: same accent background and the same
`.exp-current-dot` element, so the live green stays defined in one place. Two
points smaller (10px) to sit properly beside the 20px logos.

Verified at 1440x900, 1024x768 and 390x844: exactly one chip, every row still a
single line, and the hero still fits the viewport at all three.

## Tails.com logo

Shreya sent it, so the monogram stand-in is gone. Processed to a 225px square
PNG (20KB) to match the other four marks. All five now load with no failed
requests, and every row is still a single line.

The monogram fallback stays in the component for any future role that arrives
without a logo.

Worth knowing: it is a wordmark rather than a symbol, so at 20px the lettering
is not legible — it reads as a blue tile. That is fine here because the company
name sits right beside it, but a square symbol version would render better if
one exists.

## Even hero columns, and the Current chip

The gaps between the three hero columns were already equal (64/64 at 1920) — it
was the widths that weren't. `0.95fr / 1.3fr / 0.75fr` gave 551 / 716 / 413, so
the three headings landed at uneven intervals. The middle column had the extra
room from when each entry read "Company: Role (dates)"; logo-and-name rows
don't need it, so all three are `1fr`. Headings now sit 615/614 apart at 1920
and 460/461 at 1440.

Side effect: the longest case-study link stopped wrapping at 1280 and above.

The Current chip lost the green dot and went from `2px 8px` to `5px 10px`
padding — 22px tall instead of 16px. At 2px block against 8px inline it read as
squashed, which is what felt off.

The Experience card's copy of the chip dropped its dot as well, so "Current" is
one treatment in both places rather than two. `.exp-current-dot` is gone;
`--status-live-solid` is still used by three other rules so the token stays.

Verified at 900/1024/1280/1440/1920: equal widths, even intervals, one chip,
and the hero still fits the viewport at every one.

## Snake starts paused

The board auto-played next to the hero index, which forced a choice between
reading the three columns and watching the snake. It now holds one still frame
behind a translucent "Play to learn about Shreya" button.

- The animation frame runs only while playing, so an idle board costs nothing
  and genuinely does not move — verified by hashing the canvas twice 2.5s apart
  and getting the same value.
- Attract mode's greedy auto-steer, its 235ms cadence, and the reduced-motion
  branch that existed purely to freeze it are deleted. There is no ambient
  motion left for that branch to suppress.
- The button is translucent and always visible rather than appearing on hover,
  since a hover-only control can't be found on a touch screen. It fills with
  the accent on hover and focus, carries a 0.96 press, and under reduced motion
  keeps the colour change while dropping the travel.
- The HUD renders only when playing or once a best score exists, so the idle
  board has one control instead of a Play button in two places.
- The apple keeps clear of the middle while idle. Behind the frosted button it
  read as a rendering fault; checked over twelve loads, it never lands there now.

Flow verified: idle still, click starts it and the canvas animates, arrow keys
steer without scrolling the page, Escape stops it, the overlay returns and the
board goes still again.

Side effect worth noting: the trait pills no longer appear on their own, since
they were fed by attract-mode eating. They are now strictly a reward for
playing, which is what they were designed to be.

## The snake's play control covers the field

Shreya reported the button "does not work". It did — a raw mouse click at its
centre started the game, and nothing was intercepting it. The real fault was
the target: a 215x45 pill inside a 1325x396 field, with a canvas around it that
gave no sign of being clickable. A click that landed near the snake did nothing
and read as a dead button.

The control now covers the whole field, and the cue matches the hit area:
hovering anywhere tints the entire area and fills the label. Verified with raw
mouse clicks at nine points across the field — all nine start the game.

More prominent as asked: 16px at weight 700 with a play triangle, 270x52
against the old 215x45. The triangle takes the 1px optical nudge a play glyph
needs, since its geometric centre sits left of its visual one, and it is
`aria-hidden`, so the accessible name stays "Play to learn about Shreya" —
confirmed through the accessibility tree rather than from `textContent`.

Keyboard: reachable on the 14th tab, Enter starts the game, and focus draws an
inset ring (the field clips its overflow, so an outside ring would be cut).

Under reduced motion the label keeps its colour fill and drops the lift and the
press scale.

## Attract mode and click-to-play together

Reverted the pause-on-load: the auto-steer, the 235ms ambient cadence and the
reduced-motion freeze are all back exactly as they were. The field-wide control
layers on top, so the snake ambles on its own *and* a reader can take over from
anywhere in the band.

- Starting is the field's job, so the HUD offers Stop only while playing rather
  than duplicating the invitation.
- Stopping hands control back to attract mode instead of freezing the board.
- The apple still avoids the middle while the invitation is on screen. Only a
  small central block is excluded, so the attract path barely notices.

Verified: animating on load; invitation visible while it ambles; score climbing
on its own; a click at 12%/80% of the field takes over; the invitation clears
and Stop appears; Escape brings the invitation back and the board keeps
ambling; reduced motion holds attract still yet still lets you play.

Note the trait pills are ambient again, since attract-mode eating feeds them.
That is the earlier behaviour, not a regression, but it does mean a pill and the
play invitation can sit near each other — the invitation is larger (16px/700
with a play triangle) against the pill's 13px/600.

## Hero index lists three case studies

Trimmed to Miro AI Presence, Miro Obeya room and Wise legalese. The Case
Studies section still renders all five cards, so the design system and Dadvice
studies remain reachable — the index is a table of contents, not the full set.

Set by `INDEX_CASE_COUNT` rather than a slice buried at the call site.

Side effect: the stacked mobile index dropped from 506px to 447px, so 375x667
is now 55px from fitting rather than 114px. Still the one size where the
wordmark and snake don't share the viewport.

| Viewport | Hero / viewport | Both in view |
| --- | --- | --- |
| 1440x900 | 900 / 900 | yes |
| 1024x768 | 768 / 768 | yes |
| 375x812 | 812 / 812 | yes |
| 375x667 | 722 / 667 | no |
