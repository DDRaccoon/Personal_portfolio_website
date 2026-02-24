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
    <div className="space-y-4">
      <div className={`grid ${gridClasses[columns]} gap-4`}>
        {images.map((image, index) => {
          const imageSrc = typeof image === "string" ? image : image?.src;
          const imageAlt = typeof image === "string" ? `Gallery image ${index + 1}` : image?.alt || `Gallery image ${index + 1}`;
          const imageCaption = typeof image === "string" ? "" : image?.caption;

          if (!imageSrc) {
            return null;
          }

          return (
          <div key={index} className="group cursor-pointer">
            <img 
              src={imageSrc}
              alt={imageAlt}
              className="h-48 w-full rounded-lg border border-white/10 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {imageCaption && (
              <p className="mt-2 text-center text-sm text-white/60">
                {imageCaption}
              </p>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}