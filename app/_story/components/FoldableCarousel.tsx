'use client';

import {
  Children,
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  A11y,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Swiper doesn't know about votes, so we pipe a single callback through
// context to let ABVote fade the onboarding hint after the first vote.
// Everything else (active slide, scroll-to-clicked) uses Swiper's built-ins.
const ReportVotedContext = createContext<() => void>(() => {});
export const useReportVoted = () => useContext(ReportVotedContext);

export default function FoldableCarousel({ children }: { children: ReactNode }) {
  const [hasVoted, setHasVoted] = useState(false);
  const reportVoted = useCallback(() => setHasVoted(true), []);

  return (
    <div className="foldable-wrap">
      <div
        className="foldable-hint"
        style={{ opacity: hasVoted ? 0 : 1 }}
        aria-hidden={hasVoted}
      >
        Click a card to vote. Swipe, use arrows, or tap the dots to switch groups.
      </div>

      <ReportVotedContext.Provider value={reportVoted}>
        <Swiper
          modules={[A11y, Keyboard, Mousewheel, Navigation, Pagination]}
          slidesPerView="auto"
          centeredSlides
          grabCursor
          slideToClickedSlide
          keyboard={{ onlyInViewport: true }}
          mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
          navigation
          pagination={{ clickable: true }}
          className="foldable-swiper"
        >
          {Children.map(children, (child, i) => (
            <SwiperSlide key={i} className="foldable-slide">
              {child}
            </SwiperSlide>
          ))}
        </Swiper>
      </ReportVotedContext.Provider>
    </div>
  );
}
