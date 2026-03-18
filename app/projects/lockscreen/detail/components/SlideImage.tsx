"use client";

interface SlideImageProps {
  src: string;
  alt: string;
  caption?: string;
  onEnlarge: (src: string, alt: string) => void;
}

export function SlideImage({ src, alt, caption, onEnlarge }: SlideImageProps) {
  return (
    <figure className="my-2">
      <img
        src={src}
        alt={alt}
        onClick={() => onEnlarge(src, alt)}
        className="w-full cursor-zoom-in object-cover"
      />
      {caption && (
        <figcaption className="text-center text-sm text-[var(--nav-dim)] mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
