import { useEffect } from "react";

/* Content arrives as the reader reaches it. Anything carrying `data-reveal`
   starts held back (see the matching CSS) and gets `is-in` once it enters the
   viewport, then is left alone — a reveal that replays on every scroll-past
   becomes noise.

   The hidden state is gated on `reveal-ready` on <html>, which main.tsx sets
   before React paints. It has to be that early: set from here it landed a
   frame late, and everything below the fold flashed and then animated out.
   Without JavaScript the flag is never set, so nothing is ever hidden.

   Reduced motion marks everything in at once: the CSS drops the transition,
   so the content is simply present. */
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!nodes.length) return;

    if (!root.classList.contains("reveal-ready")) {
      // Reduced motion, or the flag never made it: show everything as-is.
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      /* Fire once a slice is genuinely on screen, and a little before the
         element's top edge would otherwise cross in, so the settle finishes
         about where the eye lands. */
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    /* One painted frame in the hidden state before anything is marked in,
       otherwise the hero's transition has no start value and it just appears. */
    const frame = requestAnimationFrame(() => nodes.forEach((n) => io.observe(n)));

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, []);
}
