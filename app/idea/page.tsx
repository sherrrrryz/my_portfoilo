"use client";

import { useRef, useEffect, useCallback } from "react";
import { sampleTextPoints } from "./lib/textSampler";
import {
  createParticles,
  updateParticles,
  drawParticles,
  createDustLayer,
  type Particle,
} from "./lib/particles";

const TEXT = "idea";
const FONT_SIZE = 160;
const NUM_PARTICLES = 4000;

export default function IdeaPage() {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const dustCanvas1Ref = useRef<HTMLCanvasElement>(null);
  const dustCanvas2Ref = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const hoveredRef = useRef(false);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const initializedRef = useRef(false);

  const init = useCallback(() => {
    const mainCanvas = mainCanvasRef.current;
    const dustCanvas1 = dustCanvas1Ref.current;
    const dustCanvas2 = dustCanvas2Ref.current;
    if (!mainCanvas || !dustCanvas1 || !dustCanvas2) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Setup all canvases
    for (const canvas of [mainCanvas, dustCanvas1, dustCanvas2]) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    // Sample text points and create particles
    const points = sampleTextPoints(TEXT, FONT_SIZE, NUM_PARTICLES, width, height);
    particlesRef.current = createParticles(points, width, height);

    // Render static dust layers (drawn once, not animated)
    const ctx1 = dustCanvas1.getContext("2d")!;
    const ctx2 = dustCanvas2.getContext("2d")!;

    const dust1 = createDustLayer(
      Math.round(width * dpr),
      Math.round(height * dpr),
      150000,
      8,
      45
    );
    const dust2 = createDustLayer(
      Math.round(width * dpr),
      Math.round(height * dpr),
      80000,
      12,
      70
    );

    ctx1.putImageData(dust1, 0, 0);
    ctx2.putImageData(dust2, 0, 0);

    initializedRef.current = true;
  }, []);

  useEffect(() => {
    init();

    const handleResize = () => init();
    window.addEventListener("resize", handleResize);

    const animate = (time: number) => {
      const canvas = mainCanvasRef.current;
      if (!canvas || !initializedRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const ctx = canvas.getContext("2d")!;
      const dpr = window.devicePixelRatio || 1;

      updateParticles(
        particlesRef.current,
        hoveredRef.current,
        time,
        mouseRef.current.x,
        mouseRef.current.y
      );
      drawParticles(ctx, particlesRef.current, dpr);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [init]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%" }}
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
        mouseRef.current = { x: -1000, y: -1000 };
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Dust layer 1 - fine, dim */}
      <canvas
        ref={dustCanvas1Ref}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      {/* Dust layer 2 - medium */}
      <canvas
        ref={dustCanvas2Ref}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      {/* Main particle layer */}
      <canvas
        ref={mainCanvasRef}
        aria-label={`Interactive animation: particles form the word "${TEXT}" on hover`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
