"use client";
import { useEffect, useState, RefObject } from "react";

export function useActiveSection(
  sectionRefs: RefObject<HTMLElement | null>[],
  scrollContainerRef: RefObject<HTMLElement | null>
): number {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const containerMid = containerTop + containerHeight / 2;

      let bestIndex = 0;
      let bestDistance = Infinity;

      sectionRefs.forEach((ref, index) => {
        if (!ref.current) return;
        const sectionTop = ref.current.offsetTop;
        const sectionHeight = ref.current.offsetHeight;
        const sectionMid = sectionTop + sectionHeight / 2;
        const distance = Math.abs(sectionMid - containerMid);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      setActiveIndex(bestIndex);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [sectionRefs, scrollContainerRef]);

  return activeIndex;
}
