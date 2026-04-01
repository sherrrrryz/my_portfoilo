"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

const TEMPLATE_BASE = "/lockscreen/templates";

const SERIES = [
  {
    id: "my-lockscreens",
    name: "My Lockscreens",
    subtitle: "",
    templates: ["classic04.jpg"],
  },
  {
    id: "classic",
    name: "Classic",
    subtitle: "What's classic never goes out of style.",
    templates: Array.from({ length: 7 }, (_, i) => `classic0${i + 1}.jpg`),
  },
  {
    id: "rhombus",
    name: "Rhombus",
    subtitle: "Time is important. Make it count.",
    templates: Array.from({ length: 7 }, (_, i) => `Rhombus0${i + 1}.jpg`),
  },
  {
    id: "magazine",
    name: "Magazine",
    subtitle: "Turn your Lock screen into a magazine cover",
    templates: Array.from({ length: 7 }, (_, i) => `Magazine0${i + 1}.jpg`),
  },
];

/* ── Sizing ── */
const PHONE_W = 280;
const PHONE_H = 606;
const THUMB_W = 100;
const THUMB_H = 214;
const SELECTED_W = 152;
const SELECTED_H = 326;
const SCALE_X = SELECTED_W / THUMB_W; // 1.9
const SCALE_Y = SELECTED_H / THUMB_H; // ~1.906
const FRAME_PAD = 3;
const FRAME_BORDER = 2.5;
const THUMB_GAP = 45;
const BUTTONS_H = 46;
const TITLE_H = 44;
const FRAME_OUTER_H = SELECTED_H + (FRAME_PAD + FRAME_BORDER) * 2;
const CAROUSEL_H = FRAME_OUTER_H; // tall enough for white frame
const ROW_GAP = 30;
const SERIES_ROW_H = CAROUSEL_H + TITLE_H;
const NEXT_PEEK = 60;

const hideScrollbarCSS = `
  .ls-no-scrollbar::-webkit-scrollbar { display: none; }
`;

/* ── Horizontal swipe carousel ── */
function TemplateRow({
  series,
  centeredIdx,
  onCenterChange,
  isActive,
}: {
  series: (typeof SERIES)[number];
  centeredIdx: number;
  onCenterChange: (idx: number) => void;
  isActive: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInitial = useRef(true);
  const programmaticScroll = useRef(false);
  const rafId = useRef(0);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  /* Scroll to keep centered item in center */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[centeredIdx] as HTMLElement | undefined;
    if (!child) return;
    const scrollLeft =
      child.offsetLeft - el.clientWidth / 2 + child.offsetWidth / 2;
    programmaticScroll.current = true;
    el.scrollTo({
      left: scrollLeft,
      behavior: isInitial.current ? "instant" : "smooth",
    });
    isInitial.current = false;
    // Clear programmatic flag after scroll animation completes
    setTimeout(() => {
      programmaticScroll.current = false;
    }, 400);
  }, [centeredIdx, isActive]);

  /* Detect which item is centered after user-initiated scroll */
  const detectCenter = useCallback(() => {
    if (programmaticScroll.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(center - childCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }
    if (closest !== centeredIdx) {
      onCenterChange(closest);
    }
  }, [centeredIdx, onCenterChange]);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(detectCenter);
  }, [detectCenter]);

  /* Mouse drag-to-scroll for desktop */
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = { isDragging: true, startX: e.pageX, scrollLeft: el.scrollLeft };
    el.style.scrollSnapType = "none";
    el.style.cursor = "grabbing";
  }, []);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.current.isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const dx = e.pageX - dragState.current.startX;
    el.scrollLeft = dragState.current.scrollLeft - dx;
  }, []);
  const onMouseUp = useCallback(() => {
    if (!dragState.current.isDragging) return;
    dragState.current.isDragging = false;
    const el = scrollRef.current;
    if (!el) return;
    el.style.scrollSnapType = "x mandatory";
    el.style.cursor = "";
    detectCenter();
  }, [detectCenter]);

  const isSingle = series.templates.length === 1;

  return (
    <div
      className="flex flex-col items-center w-full"
      style={{ height: SERIES_ROW_H }}
    >
      {/* Carousel area */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{ height: CAROUSEL_H }}
      >
        {isSingle ? (
          /* Single template — render directly at selected size, no scroll */
          <div
            className="relative overflow-hidden"
            style={{ width: SELECTED_W, height: SELECTED_H, borderRadius: 18 }}
          >
            <Image
              src={`${TEMPLATE_BASE}/${series.templates[0]}`}
              alt={`${series.name} template`}
              fill
              className="object-cover"
              sizes={`${SELECTED_W}px`}
            />
            {isActive && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
                <span
                  className="text-white text-[11px] font-medium px-4 py-1.5 rounded-full whitespace-nowrap"
                  style={{
                    background: "rgba(66,66,66,0.3)",
                    backdropFilter: "blur(18px)",
                  }}
                >
                  Customize
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Multi-template scrollable carousel */
          <div
            ref={scrollRef}
            onScroll={onScroll}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            className="ls-no-scrollbar flex items-center w-full overflow-x-auto cursor-grab select-none"
            style={{
              height: CAROUSEL_H,
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              gap: THUMB_GAP,
              paddingLeft: `calc(50% - ${THUMB_W / 2}px)`,
              paddingRight: `calc(50% - ${THUMB_W / 2}px)`,
            }}
          >
            {series.templates.map((file, i) => {
              const isCentered = i === centeredIdx;

              return (
                <div
                  key={file}
                  className="flex-shrink-0 relative"
                  style={{
                    width: THUMB_W,
                    height: THUMB_H,
                    scrollSnapAlign: "center",
                    transform: isCentered ? `scale(${SCALE_X}, ${SCALE_Y})` : "scale(1)",
                    transformOrigin: "center center",
                    zIndex: isCentered ? 10 : 1,
                    transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <div
                    className="relative overflow-hidden w-full h-full"
                    style={{ borderRadius: isCentered ? 18 / SCALE_X : 14 }}
                  >
                    <Image
                      src={`${TEMPLATE_BASE}/${file}`}
                      alt={`${series.name} template ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes={`${SELECTED_W}px`}
                    />
                    {isCentered && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
                        <span
                          className="text-white font-medium whitespace-nowrap rounded-full"
                          style={{
                            fontSize: 11 / SCALE_X,
                            padding: `${5 / SCALE_Y}px ${14 / SCALE_X}px`,
                            background: "rgba(66,66,66,0.3)",
                            backdropFilter: "blur(18px)",
                          }}
                        >
                          Customize
                        </span>
                      </div>
                    )}
                  </div>
                </div>
            );
          })}
          </div>
        )}
      </div>

      {/* Series title & subtitle */}
      <div className="text-center" style={{ height: TITLE_H, paddingTop: 6 }}>
        <p className="text-white text-[17px] font-normal leading-tight">
          {series.name}
        </p>
        <p className="text-white/60 text-[7px] leading-tight mt-0.5">
          {series.subtitle}
        </p>
      </div>
    </div>
  );
}

/* ── Main ── */
export function LockscreenDemo() {
  const [activeSeries, setActiveSeries] = useState(0);
  const activeSeriesRef = useRef(0);
  const [centered, setCentered] = useState<Record<string, number>>({
    "my-lockscreens": 0,
    classic: 0,
    rhombus: 0,
    magazine: 0,
  });
  const swipeLockV = useRef(false);
  const swipeLockH = useRef(false);
  const touchStartY = useRef(0);
  const screenRef = useRef<HTMLDivElement>(null);

  const handleCenterChange = useCallback((seriesId: string, idx: number) => {
    setCentered((prev) => ({ ...prev, [seriesId]: idx }));
  }, []);

  const goSeries = useCallback((dir: 1 | -1) => {
    if (swipeLockV.current) return;
    setActiveSeries((prev) => {
      const next = prev + dir;
      if (next < 0 || next >= SERIES.length) return prev;
      activeSeriesRef.current = next;
      return next;
    });
    swipeLockV.current = true;
    setTimeout(() => {
      swipeLockV.current = false;
    }, 500);
  }, []);

  const goTemplate = useCallback((dir: 1 | -1) => {
    if (swipeLockH.current) return;
    const si = activeSeriesRef.current;
    const seriesId = SERIES[si].id;
    const maxIdx = SERIES[si].templates.length - 1;
    setCentered((prev) => {
      const cur = prev[seriesId] ?? 0;
      const next = cur + dir;
      if (next < 0 || next > maxIdx) return prev;
      return { ...prev, [seriesId]: next };
    });
    swipeLockH.current = true;
    setTimeout(() => {
      swipeLockH.current = false;
    }, 400);
  }, []);

  /* Native wheel listener on phone container — controlled one-at-a-time navigation */
  const phoneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = phoneRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Horizontal → switch one template
        if (Math.abs(e.deltaX) >= 10) {
          goTemplate(e.deltaX > 0 ? 1 : -1);
        }
      } else {
        // Vertical → switch series
        if (Math.abs(e.deltaY) >= 15) {
          goSeries(e.deltaY > 0 ? 1 : -1);
        }
      }
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [goSeries, goTemplate]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 30) return;
      goSeries(dy > 0 ? 1 : -1);
    },
    [goSeries],
  );

  const contentH = PHONE_H - 12 - BUTTONS_H;

  /* White frame: vertically centered in the content viewport, shifted up 20px */
  const frameH = SELECTED_H + (FRAME_PAD + FRAME_BORDER) * 2;
  const frameCenterY = contentH / 2 - 30;
  const frameTop = frameCenterY - frameH / 2;

  /* Align the active series' carousel center with the frame center */
  const carouselCenterInRow = CAROUSEL_H / 2;
  const seriesOffset = frameCenterY - carouselCenterInRow;
  const translateY = activeSeries * (SERIES_ROW_H + ROW_GAP) - seriesOffset;

  return (
    <div className="flex flex-col items-center py-8 w-full">
      <style dangerouslySetInnerHTML={{ __html: hideScrollbarCSS }} />

      {/* Phone frame */}
      <div
        ref={phoneRef}
        className="relative flex-shrink-0"
        style={{
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 36,
          border: "6px solid #2a2a2a",
          background: "#000",
          boxShadow:
            "0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Notch */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-30"
          style={{
            top: 8,
            width: 64,
            height: 18,
            borderRadius: 14,
            background: "#000",
          }}
        />

        {/* Screen */}
        <div
          ref={screenRef}
          className="absolute inset-0 overflow-hidden"
          style={{ borderRadius: 30, background: "#1f1f1f" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Top buttons */}
          <div
            className="relative z-20 flex justify-between items-center px-4"
            style={{ height: BUTTONS_H, paddingTop: 26 }}
          >
            <GlassButton label="Cancel" />
            <GlassButton label="Apply" primary />
          </div>

          {/* Vertical paging viewport */}
          <div
            className="relative"
            style={{ height: contentH, overflow: "hidden" }}
          >
            {/* Single white frame overlay — fixed at center */}
            <div
              className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none"
              style={{
                top: frameTop,
                width: SELECTED_W + (FRAME_PAD + FRAME_BORDER) * 2,
                height: frameH,
                border: `${FRAME_BORDER}px solid rgba(255,255,255,0.9)`,
                borderRadius: 24,
                transition: "opacity 0.3s ease",
              }}
            />

            {/* Series stack */}
            <div
              className="absolute left-0 right-0 top-0"
              style={{
                transform: `translateY(${-translateY}px)`,
                transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {SERIES.map((series, si) => {
                const isAbove = si < activeSeries;
                const isActive = si === activeSeries;

                return (
                  <div
                    key={series.id}
                    style={{
                      marginBottom: si < SERIES.length - 1 ? ROW_GAP : 0,
                      opacity: isAbove ? 0 : isActive ? 1 : 0.5,
                      transition: "opacity 0.4s ease",
                    }}
                  >
                    <TemplateRow
                      series={series}
                      centeredIdx={centered[series.id] ?? 0}
                      onCenterChange={(idx) =>
                        handleCenterChange(series.id, idx)
                      }
                      isActive={isActive}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function GlassButton({
  label,
  primary,
}: {
  label: string;
  primary?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-center px-4 py-1.5 rounded-full text-[11px] font-medium text-white"
      style={{
        background: primary ? "#3482ff" : "rgba(255,255,255,0.1)",
        backdropFilter: "blur(17px)",
        minWidth: 58,
      }}
    >
      {label}
    </div>
  );
}
