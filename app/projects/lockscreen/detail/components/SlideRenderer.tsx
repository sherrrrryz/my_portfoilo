"use client";
import { SlideContentBlock } from "../slideData";
import { SlideImage } from "./SlideImage";
import { SlideImageDual } from "./SlideImageDual";
import { SlideVideo } from "./SlideVideo";
import { SlideBulletList } from "./SlideBulletList";
import { CollapsibleBlock } from "./CollapsibleBlock";

interface SlideRendererProps {
  blocks: SlideContentBlock[];
  onEnlarge: (src: string, alt: string) => void;
}

type MediaBlock = Extract<SlideContentBlock, { type: "image" | "imageDual" | "video" }>;

function isMedia(b: SlideContentBlock): b is MediaBlock {
  return b.type === "image" || b.type === "imageDual" || b.type === "video";
}

function renderTextBlock(block: SlideContentBlock, i: number) {
  switch (block.type) {
    case "subheading":
      return <h2 key={i} className={`text-lg font-semibold text-[var(--nav-fg)] mb-3 ${i > 0 ? "mt-6" : ""}`}>{block.text}</h2>;
    case "paragraph":
      return <p key={i} className="text-[var(--nav-fg)] leading-relaxed mb-4">{block.text}</p>;
    case "bullets":
      return <SlideBulletList key={i} items={block.items} />;
    case "collapsible":
      return <CollapsibleBlock key={i} title={block.title} content={block.content} />;
    default:
      return null;
  }
}

export function SlideRenderer({ blocks, onEnlarge }: SlideRendererProps) {
  const headingIdx = blocks.findIndex(b => b.type === "heading");
  const heading = headingIdx >= 0
    ? (blocks[headingIdx] as Extract<SlideContentBlock, { type: "heading" }>).text
    : "";

  // Group into: runs of text blocks, and individual media blocks
  type Group =
    | { kind: "text"; blocks: SlideContentBlock[] }
    | { kind: "media"; block: MediaBlock };

  const groups: Group[] = [];
  let textRun: SlideContentBlock[] = [];

  blocks.forEach((block, i) => {
    if (i === headingIdx) return;
    if (isMedia(block)) {
      if (textRun.length > 0) { groups.push({ kind: "text", blocks: textRun }); textRun = []; }
      groups.push({ kind: "media", block });
    } else {
      textRun.push(block);
    }
  });
  if (textRun.length > 0) groups.push({ kind: "text", blocks: textRun });

  let headingUsed = false;

  return (
    <div>
      {groups.map((group, gi) => {
        if (group.kind === "media") {
          const b = group.block;
          return (
            <div key={gi}>
              {b.type === "image" && (
                <SlideImage src={b.src} alt={b.alt} caption={b.caption} onEnlarge={onEnlarge} />
              )}
              {b.type === "imageDual" && (
                <SlideImageDual images={b.images} onEnlarge={onEnlarge} />
              )}
              {b.type === "video" && (
                <SlideVideo provider={b.provider} videoId={b.videoId} caption={b.caption} />
              )}
            </div>
          );
        }

        const title = !headingUsed ? heading : "";
        if (!headingUsed) headingUsed = true;

        return (
          <div key={gi} className="w-full pt-16 md:pt-28 pb-4">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <h2 className="text-lg md:text-2xl font-bold uppercase tracking-wide text-[var(--nav-fg)]">
                {title}
              </h2>
              <div className="flex-1" />
              <div className="text-[var(--nav-fg)] leading-relaxed max-w-[800px]">
                {group.blocks.map((block, bi) => renderTextBlock(block, bi))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Edge case: heading only, no text groups */}
      {heading && !headingUsed && (
        <div className="py-12 md:py-20">
          <h2 className="text-lg md:text-2xl font-bold uppercase tracking-wide text-[var(--nav-fg)]">
            {heading}
          </h2>
        </div>
      )}
    </div>
  );
}
