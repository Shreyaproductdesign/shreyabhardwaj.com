import { useEffect, useState } from "react";
import "./FramerEmbed.css";

/* Temporary shell shared by the case study routes. Each one frames the live
   Framer page with Framer's own nav clipped and a single way back, so the
   reader never leaves the portfolio's chrome.

   The coded Wise case study still lives in WiseCaseStudy.tsx. To restore it,
   point wise-main.tsx back at that component. */

/* The Framer pages have no small-screen layout — they lean on the browser
   scaling their ~1400px viewport down to fit. An iframe doesn't do that
   scaling, so the hero gets clipped with no way to scroll to the rest. Below
   this width we hand off to the real page and let the browser's back button do
   the returning, which beats framing something unreadable. */
const EMBED_MIN_WIDTH = 1000;

type FramerEmbedProps = {
  /** Full Framer URL, hash included. */
  url: string;
  /** Used for the iframe title and the loading copy, e.g. "Wise". */
  name: string;
};

export function FramerEmbed({ url, name }: FramerEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  // Read once during the first render so the frame never flashes before we
  // redirect. No SSR here, so `window` is always available.
  const [handOff] = useState(() => window.innerWidth < EMBED_MIN_WIDTH);

  useEffect(() => {
    // `replace`, not `assign`: a back-press should reach the portfolio, not
    // bounce through this shell again.
    if (handOff) window.location.replace(url);
  }, [handOff, url]);

  if (handOff) {
    return (
      <div className="embed">
        <p className="embed-status" role="status">
          Opening the {name} case study…
        </p>
      </div>
    );
  }

  return (
    <div className="embed">
      {/* The only chrome: no site nav, one way back to the portfolio. */}
      <a className="embed-back" href="/">
        <span className="embed-back-arrow" aria-hidden="true">
          ←
        </span>
        Back to portfolio
      </a>

      {/* Framing an external origin means we can't tell a slow load from a
          blocked one, so say something while it's pending. */}
      <p className="embed-status" role="status" data-hidden={loaded}>
        Loading the {name} case study…
      </p>

      <iframe
        className="embed-frame"
        src={url}
        title={`${name} case study`}
        data-loaded={loaded}
        onLoad={() => setLoaded(true)}
        allow="fullscreen"
      />
    </div>
  );
}
