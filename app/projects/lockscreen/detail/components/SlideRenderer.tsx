"use client";
import { SlideContentBlock } from "../slideData";
import { SlideImage } from "./SlideImage";
import { SlideImageDual } from "./SlideImageDual";
import { SlideVideo } from "./SlideVideo";
import { SlideBulletList } from "./SlideBulletList";
import { CollapsibleBlock } from "./CollapsibleBlock";
import { TeamChart } from "./TeamChart";
import { FlowCards } from "./FlowCards";

interface SlideRendererProps {
  blocks: SlideContentBlock[];
  onEnlarge: (src: string, alt: string) => void;
}

type MediaBlock = Extract<SlideContentBlock, { type: "image" | "imageDual" | "video" }>;
type FullWidthBlock = Extract<SlideContentBlock, { type: "teamChart" | "flowCards" | "heroText" | "infoCard" }>;

function isMedia(b: SlideContentBlock): b is MediaBlock {
  return b.type === "image" || b.type === "imageDual" || b.type === "video";
}

function isFullWidth(b: SlideContentBlock): b is FullWidthBlock {
  return b.type === "teamChart" || b.type === "flowCards" || b.type === "heroText" || b.type === "infoCard";
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

  // Group into: runs of text blocks, individual media blocks, and full-width blocks
  type Group =
    | { kind: "text"; blocks: SlideContentBlock[] }
    | { kind: "media"; block: MediaBlock }
    | { kind: "fullwidth"; block: FullWidthBlock };

  const groups: Group[] = [];
  let textRun: SlideContentBlock[] = [];

  blocks.forEach((block, i) => {
    if (i === headingIdx) return;
    if (isMedia(block)) {
      if (textRun.length > 0) { groups.push({ kind: "text", blocks: textRun }); textRun = []; }
      groups.push({ kind: "media", block });
    } else if (isFullWidth(block)) {
      if (textRun.length > 0) { groups.push({ kind: "text", blocks: textRun }); textRun = []; }
      groups.push({ kind: "fullwidth", block });
    } else {
      textRun.push(block);
    }
  });
  if (textRun.length > 0) groups.push({ kind: "text", blocks: textRun });

  let headingUsed = false;

  // Check if heading will be used by a text group
  const hasTextGroup = groups.some(g => g.kind === "text");

  return (
    <div className="space-y-10">
      {/* Heading before media/fullwidth when no text groups exist */}
      {heading && !hasTextGroup && !groups.some(g => g.kind === "fullwidth" && (g.block.type === "heroText" || g.block.type === "infoCard")) && (
        <div className="pt-16 md:pt-28">
          <h2 className="text-lg md:text-2xl font-bold uppercase tracking-wide text-[var(--nav-fg)]">
            {heading}
          </h2>
        </div>
      )}
      {groups.map((group, gi) => {
        if (group.kind === "fullwidth") {
          const fb = group.block;
          return (
            <div key={gi} className="w-full">
              {fb.type === "teamChart" && <TeamChart members={(fb as Extract<SlideContentBlock, { type: "teamChart" }>).members} />}
              {fb.type === "flowCards" && (() => { const b = fb as Extract<SlideContentBlock, { type: "flowCards" }>; return <FlowCards title={b.title} cards={b.cards} />; })()}
              {fb.type === "heroText" && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                  {heading && (
                    <h2 className="text-sm md:text-base font-medium uppercase tracking-widest text-gray-400 text-center">
                      {heading}
                    </h2>
                  )}
                  <p className="text-3xl md:text-5xl font-semibold text-center text-[var(--nav-fg)] leading-snug max-w-full whitespace-pre-line">
                    {(fb as Extract<SlideContentBlock, { type: "heroText" }>).text}
                  </p>
                </div>
              )}
              {fb.type === "infoCard" && (() => {
                const b = fb as Extract<SlideContentBlock, { type: "infoCard" }>;
                const topRow = b.items.slice(0, 2);
                const bottomRow = b.items.slice(2);

                const iconMap: Record<string, React.ReactNode> = {
                  goal: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                  ),
                  method: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6l-1 7h4l-7 8 1-5H8l1-10z"/></svg>
                  ),
                  participants: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  ),
                  scope: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  ),
                  process: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  ),
                };

                const renderIcon = (iconName?: string, highlight?: boolean) => {
                  if (!iconName) return null;
                  return (
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${highlight ? "bg-[var(--nav-fg)]/10" : "bg-[var(--nav-fg)]/5"}`}>
                      <span className="text-[var(--nav-fg)]">{iconMap[iconName]}</span>
                    </div>
                  );
                };

                const renderValue = (item: typeof b.items[0], highlight?: boolean) => {
                  const textColor = "text-[var(--nav-fg)] opacity-60";
                  const boldColor = "text-[var(--nav-fg)] font-semibold";

                  if (item.bigNumber) {
                    return (
                      <>
                        <p className={`text-5xl md:text-6xl font-bold mt-2 mb-1 ${highlight ? "text-white" : "text-[var(--nav-fg)]"}`}>
                          {item.bigNumber}
                        </p>
                        <p className={`text-sm leading-relaxed ${textColor}`}>{item.value}</p>
                      </>
                    );
                  }

                  if (item.bullets) {
                    return (
                      <div className="flex flex-col gap-2 mt-1">
                        {item.bullets.map((bullet, bi) => (
                          <div key={bi} className={`flex items-center gap-2 text-sm ${textColor}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  // Render value with **bold** support and \n line breaks
                  const parts = item.value?.split(/(\*\*[^*]+\*\*|\n)/) || [];
                  return (
                    <p className={`text-sm leading-relaxed ${textColor}`}>
                      {parts.map((part, pi) => {
                        if (part === "\n") return <br key={pi} />;
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return <span key={pi} className={boldColor}>{part.slice(2, -2)}</span>;
                        }
                        return <span key={pi}>{part}</span>;
                      })}
                    </p>
                  );
                };

                return (
                  <div className="pt-16 md:pt-28">
                    {heading && (
                      <h2 className="text-lg md:text-2xl font-bold uppercase tracking-wide text-[var(--nav-fg)] mb-8">
                        {heading}
                      </h2>
                    )}
                    <div className="flex flex-col gap-3">
                      {/* Top row: 2 cards */}
                      <div className="grid grid-cols-2 gap-3">
                        {topRow.map((item, idx) => (
                          <div
                            key={idx}
                            className={`rounded-2xl p-7 min-h-[180px] relative overflow-hidden ${
                              item.highlight
                                ? "bg-[#e6e4e1]"
                                : "bg-[var(--slide-card-bg,#f0f0f0)]"
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              {renderIcon(item.icon, item.highlight)}
                              <h3 className="text-lg font-bold text-[var(--nav-fg)]">
                                {item.label}
                              </h3>
                            </div>
                            {item.value?.includes("\n") && (
                              <span className="inline-block px-3 py-1 rounded-md bg-[var(--nav-fg)]/10 text-[var(--nav-fg)] text-xs font-medium mb-3">
                                {item.value.split("\n")[0]}
                              </span>
                            )}
                            {item.value?.includes("\n")
                              ? renderValue({ ...item, value: item.value.split("\n").slice(1).join("\n").trim() })
                              : renderValue(item)
                            }
                          </div>
                        ))}
                      </div>
                      {/* Bottom row: 3 cards */}
                      <div className="grid grid-cols-3 gap-3">
                        {bottomRow.map((item, idx) => (
                          <div
                            key={idx}
                            className={`rounded-2xl p-7 min-h-[200px] ${
                              item.highlight
                                ? "bg-[#e6e4e1]"
                                : "bg-[var(--slide-card-bg,#f0f0f0)]"
                            }`}
                          >
                            {renderIcon(item.icon, item.highlight)}
                            <h3 className="text-base font-bold mb-2 text-[var(--nav-fg)]">
                              {item.label}
                            </h3>
                            {renderValue(item)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        }

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
        const isFirst = !headingUsed;
        if (!headingUsed) headingUsed = true;

        if (!isFirst) {
          const startsWithSubheading = group.blocks[0]?.type === "subheading";
          return (
            <div key={gi} className={`w-full ${startsWithSubheading ? "mt-4" : ""}`}>
              <div className="text-[var(--nav-fg)] leading-relaxed">
                {group.blocks.map((block, bi) => renderTextBlock(block, bi))}
              </div>
            </div>
          );
        }

        // Split off "section label + content" to render full-width below the two-column layout.
        // Find the first subheading that is preceded by a non-subheading block.
        let splitIdx = (() => {
          for (let i = 1; i < group.blocks.length; i++) {
            if (group.blocks[i].type === "subheading" && group.blocks[i - 1].type !== "subheading") return i;
          }
          return group.blocks.length;
        })();
        // If inlineBlocks have no paragraph (no intro text), render everything full-width
        if (!group.blocks.slice(0, splitIdx).some(b => b.type === "paragraph")) splitIdx = 0;
        const inlineBlocks = group.blocks.slice(0, splitIdx);
        const trailingSubheadings = group.blocks.slice(splitIdx);

        return (
          <div key={gi} className="w-full pt-16 md:pt-28">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <h2 className="text-lg md:text-2xl font-bold uppercase tracking-wide text-[var(--nav-fg)]">
                {title}
              </h2>
              <div className="flex-1" />
              <div className="text-[var(--nav-fg)] leading-relaxed max-w-[800px]">
                {inlineBlocks.map((block, bi) => renderTextBlock(block, bi))}
              </div>
            </div>
            {trailingSubheadings.length > 0 && (
              <div className="mt-12 space-y-4">
                {trailingSubheadings.map((block, bi) => {
                  if (block.type === "subheading") {
                    return <h2 key={bi} className={`text-lg font-semibold text-[var(--nav-fg)] ${bi > 0 ? "mt-10" : ""} mb-2`}>{block.text}</h2>;
                  }
                  return renderTextBlock(block, bi);
                })}
              </div>
            )}
          </div>
        );
      })}

    </div>
  );
}
