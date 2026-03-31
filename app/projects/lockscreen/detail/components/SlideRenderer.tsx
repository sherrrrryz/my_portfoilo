"use client";
import { SlideContentBlock } from "../slideData";
import { SlideImage } from "./SlideImage";
import { SlideImageDual } from "./SlideImageDual";
import { SlideVideo } from "./SlideVideo";
import { SlideBulletList } from "./SlideBulletList";
import { CollapsibleBlock } from "./CollapsibleBlock";
import { TeamChart } from "./TeamChart";
import { FlowCards } from "./FlowCards";
import { LockscreenDemo } from "./LockscreenDemo";
import { Target, FlaskConical, Users, List, Eye, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface SlideRendererProps {
  blocks: SlideContentBlock[];
  onEnlarge: (src: string, alt: string) => void;
}

type MediaBlock = Extract<SlideContentBlock, { type: "image" | "imageDual" | "video" }>;
type FullWidthBlock = Extract<SlideContentBlock, { type: "teamChart" | "flowCards" | "heroText" | "infoCard" | "lockscreenDemo" }>;

function isMedia(b: SlideContentBlock): b is MediaBlock {
  return b.type === "image" || b.type === "imageDual" || b.type === "video";
}

function isFullWidth(b: SlideContentBlock): b is FullWidthBlock {
  return b.type === "teamChart" || b.type === "flowCards" || b.type === "heroText" || b.type === "infoCard" || b.type === "lockscreenDemo";
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
              {fb.type === "lockscreenDemo" && <LockscreenDemo />}
              {fb.type === "infoCard" && (() => {
                const b = fb as Extract<SlideContentBlock, { type: "infoCard" }>;

                const iconMap: Record<string, React.ReactNode> = {
                  goal: <Target className="w-4 h-4" />,
                  method: <FlaskConical className="w-4 h-4" />,
                  participants: <Users className="w-4 h-4" />,
                  scope: <List className="w-4 h-4" />,
                  process: <Eye className="w-4 h-4" />,
                };

                const stepIconMap: Record<string, React.ReactNode> = {
                  observe: <Eye className="w-5 h-5" />,
                  guide: <ArrowRight className="w-5 h-5" />,
                  ask: <Users className="w-5 h-5" />,
                  collect: <CheckCircle2 className="w-5 h-5" />,
                };

                // Bento layout
                if (b.layout === "bento") {
                  const goalCard = b.items.find(i => i.icon === "goal");
                  const participantsCard = b.items.find(i => i.icon === "participants");
                  const methodCard = b.items.find(i => i.icon === "method");
                  const scopeCard = b.items.find(i => i.icon === "scope");
                  const processCard = b.items.find(i => i.icon === "process");

                  const renderBoldText = (text: string) => {
                    const parts = text.split(/(\*\*[^*]+\*\*|\n)/);
                    return parts.map((part, pi) => {
                      if (part === "\n") return <br key={pi} />;
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return <span key={pi} className="bg-[var(--nav-fg)] text-[var(--slide-bg,#fff)] px-1.5 py-0.5 rounded font-semibold">{part.slice(2, -2)}</span>;
                      }
                      return <span key={pi}>{part}</span>;
                    });
                  };

                  const DotGrid = () => (
                    <div className="grid grid-cols-4 gap-1.5">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="w-3 h-3 rounded bg-[var(--nav-fg)]/15" />
                      ))}
                    </div>
                  );

                  const Badge = ({ icon, label, dark }: { icon?: string; label: string; dark?: boolean }) => (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${dark ? "bg-white/20 text-white" : "bg-[var(--nav-fg)]/8 text-[var(--nav-fg)]"}`}>
                      {icon && <span className={dark ? "text-white" : "text-[var(--nav-fg)]"}>{iconMap[icon]}</span>}
                      <span>{label}</span>
                    </div>
                  );

                  return (
                    <div className="pt-16 md:pt-28">
                      {heading && (
                        <h2 className="text-lg md:text-2xl font-bold uppercase tracking-wide text-[var(--nav-fg)] mb-8">
                          {heading}
                        </h2>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[repeat(4,minmax(0,1fr))] gap-3 sm:gap-4 lg:h-[700px]">
                        {/* Research Goal - mobile: full, sm: full, lg: 7 cols 2 rows */}
                        {goalCard && (
                          <div className="sm:col-span-2 lg:col-span-7 lg:row-span-2 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 bg-[var(--slide-card-bg,#f5f5f4)] relative overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                              <Badge icon="goal" label={goalCard.label} />
                              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--nav-fg)] opacity-20" />
                            </div>
                            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--nav-fg)] leading-tight mb-4 sm:mb-6">
                              Validate Navigation<br />Before Shipping
                            </h3>
                            <div className="bg-[var(--slide-bg,#fff)] rounded-xl sm:rounded-2xl p-4 sm:p-6 mt-auto">
                              <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-[var(--nav-fg)]/80">
                                {goalCard.value && renderBoldText(goalCard.value)}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Participants - mobile: full, sm: 1 col, lg: 5 cols 1 row */}
                        {participantsCard && (
                          <div className="lg:col-span-5 lg:row-span-1 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 bg-[var(--slide-bg,#fff)] relative overflow-hidden">
                            <Badge icon="participants" label={participantsCard.label} />
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-end gap-2">
                                <span className="text-4xl sm:text-5xl font-black text-[var(--nav-fg)]">{participantsCard.bigNumber}</span>
                                <span className="text-sm sm:text-base text-[var(--nav-fg)]/50 pb-1 sm:pb-1.5">people</span>
                              </div>
                              <DotGrid />
                            </div>
                            <p className="text-xs text-[var(--nav-fg)]/50 mt-2">{participantsCard.value}</p>
                          </div>
                        )}

                        {/* Method - mobile: full, sm: 1 col, lg: 5 cols 1 row */}
                        {methodCard && (
                          <div className="lg:col-span-5 lg:row-span-1 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 bg-[var(--nav-fg)] relative overflow-hidden">
                            <Badge icon="method" label={methodCard.label} dark />
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mt-3 sm:mt-4 mb-3 sm:mb-4">
                              {methodCard.value}
                            </h3>
                            {methodCard.tags && (
                              <div className="flex flex-wrap gap-2">
                                {methodCard.tags.map((tag, ti) => (
                                  <span key={ti} className="px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            <Sparkles className="w-6 h-6 text-white/15 absolute bottom-4 right-4" />
                          </div>
                        )}

                        {/* Task Scope - mobile: full, sm: 1 col, lg: 5 cols 2 rows */}
                        {scopeCard && (
                          <div className="lg:col-span-5 lg:row-span-2 rounded-2xl sm:rounded-3xl p-6 sm:p-7 lg:p-8 bg-[var(--nav-fg)] relative overflow-hidden">
                            <Badge icon="scope" label={scopeCard.label} dark />
                            <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6">
                              {scopeCard.bullets?.map((bullet, bi) => (
                                <div key={bi} className="flex items-start gap-3 group">
                                  <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                                    {bi + 1}
                                  </span>
                                  <span className="text-sm text-white/70 pt-1.5 sm:pt-2.5">{bullet}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Session Flow - mobile: full, sm: full, lg: 7 cols 2 rows */}
                        {processCard && (
                          <div className="sm:col-span-2 lg:col-span-7 lg:row-span-2 rounded-2xl sm:rounded-3xl p-6 sm:p-7 lg:p-8 bg-[var(--slide-bg,#fff)] relative overflow-hidden flex flex-col">
                            <div className="flex items-center gap-3 mb-4 sm:mb-5">
                              <div className="bg-[var(--nav-fg)] text-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl">
                                {iconMap.process}
                              </div>
                              <div>
                                <div className="text-xs text-[var(--nav-fg)]/50 font-medium">Research Process</div>
                                <h3 className="text-base sm:text-lg lg:text-2xl font-bold text-[var(--nav-fg)]">
                                  {processCard.label}
                                </h3>
                              </div>
                            </div>
                            {processCard.steps && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                {processCard.steps.map((step, si) => (
                                  <div key={si} className="rounded-xl sm:rounded-2xl bg-[var(--slide-card-bg,#f5f5f4)] p-4 sm:p-5 flex flex-col items-start gap-1.5 sm:gap-2">
                                    <span className="text-[var(--nav-fg)]/40">{stepIconMap[step.icon]}</span>
                                    <span className="text-sm font-bold text-[var(--nav-fg)]">{step.title}</span>
                                    <span className="text-xs text-[var(--nav-fg)]/50">{step.subtitle}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {processCard.banner && (
                              <div className="mt-4 lg:mt-auto rounded-xl sm:rounded-2xl bg-[var(--nav-fg)] px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
                                <Sparkles className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white/50 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-white/80 font-medium">{processCard.banner}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                // Default layout (original 2+3 grid)
                const topRow = b.items.slice(0, 2);
                const bottomRow = b.items.slice(2);

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
