"use client";

export default function GalleryBlock({ block }) {
  const columns = block.columns || 3;
  const images = Array.isArray(block.images) ? block.images : [];
  
  const gridClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-4`}>
      {images.map((image, index) => {
        const imageSrc = typeof image === "string" ? image : image?.src;
        const imageAlt = typeof image === "string" ? `Gallery image ${index + 1}` : image?.alt || `Gallery image ${index + 1}`;
        const imageCaption = typeof image === "string" ? "" : image?.caption;

        if (!imageSrc) {
          return null;
        }

        return (
        <figure key={index} className="group">
          <div className="overflow-hidden rounded-xl border border-white/10">
            <img 
              src={imageSrc}
              alt={imageAlt}
              className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          {imageCaption && (
            <figcaption className="mt-2 text-center text-[13px] tracking-wide text-white/45">
              {imageCaption}
            </figcaption>
          )}
        </figure>
        );
      })}
    </div>
  );
}