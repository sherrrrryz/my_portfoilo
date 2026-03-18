"use client";

interface DualImage {
  src: string;
  alt: string;
  caption?: string;
}

interface SlideImageDualProps {
  images: [DualImage, DualImage];
  onEnlarge: (src: string, alt: string) => void;
}

export function SlideImageDual({ images, onEnlarge }: SlideImageDualProps) {
  return (
    <div className="flex flex-col gap-4 my-2">
      {images.map((img, i) => (
        <figure key={i}>
          <img
            src={img.src}
            alt={img.alt}
            onClick={() => onEnlarge(img.src, img.alt)}
            className="w-full cursor-zoom-in object-cover"
          />
          {img.caption && (
            <figcaption className="text-center text-sm text-[var(--nav-dim)] mt-2">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
