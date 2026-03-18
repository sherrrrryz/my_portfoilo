"use client";

interface SlideVideoProps {
  provider: "youtube" | "screenpal";
  videoId: string;
  caption?: string;
}

export function SlideVideo({ provider, videoId, caption }: SlideVideoProps) {
  const src =
    provider === "youtube"
      ? `https://www.youtube.com/embed/${videoId}`
      : `https://screenpal.com/player/${videoId}?width=100%&height=100%&ff=1&title=0`;

  return (
    <figure className="my-2">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={src}
          title={caption || "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-xl shadow-sm"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-[var(--nav-dim)] mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
