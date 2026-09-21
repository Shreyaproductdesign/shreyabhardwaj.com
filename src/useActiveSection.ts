import { useEffect, useState } from "react";

/* Which of the given sections the reader is in, so the nav can say so. The
   winner is whichever section covers the most of the viewport — a plain
   "is intersecting" check flips too early, when the next section has barely
   crossed the bottom edge. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const ratios = new Map<Element, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target, e.intersectionRatio);
        let best: Element | null = null;
        let bestRatio = 0;
        for (const [el, r] of ratios) {
          if (r > bestRatio) {
            best = el;
            bestRatio = r;
          }
        }
        if (best) setActive((best as HTMLElement).id);
      },
      // Fine-grained thresholds so the comparison tracks as you scroll, not
      // just at entry and exit.
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids]);

  return active;
}
