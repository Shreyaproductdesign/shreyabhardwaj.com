export type Photo = {
  id: string;
  src: string;
  alt: string;
  /** Intrinsic size. Drives the column weight, the frame ratio and CLS. */
  w: number;
  h: number;
};

type PhotoRowProps = {
  photos: Photo[];
  /** Variant hook for the row's width and breakpoints. */
  className?: string;
  label: string;
};

/* One justified row of photos at their true aspect ratios.

   The columns are weighted by each photo's ratio and each frame carries that
   same ratio, which makes every frame exactly the same height with nothing
   cropped: if width is k × ratio then height is k for all of them. That beats
   a fixed grid, where portraits and landscapes in the same cell shape means
   one of them loses a third of the picture. */
export function PhotoRow({ photos, className, label }: PhotoRowProps) {
  const columns = photos.map((p) => `${(p.w / p.h).toFixed(3)}fr`).join(" ");

  return (
    <div
      className={`photo-row${className ? ` ${className}` : ""}`}
      style={{ gridTemplateColumns: columns }}
      aria-label={label}
    >
      {photos.map((photo) => (
        <figure
          key={photo.id}
          className="photo-frame"
          style={{ aspectRatio: `${photo.w} / ${photo.h}` }}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.w}
            height={photo.h}
            loading="lazy"
            decoding="async"
          />
        </figure>
      ))}
    </div>
  );
}
