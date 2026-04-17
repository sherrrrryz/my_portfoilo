/**
 * Particle system inspired by newmixcoffee.com's grainy text effect.
 * Thousands of small dots form text on hover, scatter when not hovered.
 * Mouse repulsion pushes nearby particles away.
 */

export interface Particle {
  // Current position
  x: number;
  y: number;

  // Target: text position
  targetX: number;
  targetY: number;

  // Scattered position
  randomX: number;
  randomY: number;

  // Velocity
  vx: number;
  vy: number;

  // Mouse repulsion offset
  repelX: number;
  repelY: number;

  // Visual
  radius: number;
  alpha: number;

  // Per-particle oscillation
  phase: number;
  speed: number;
  amplitude: number;
}

// Physics constants
const STIFFNESS = 0.06;
const DAMPING = 0.82;
const REPEL_RADIUS = 100;
const REPEL_STRENGTH = 50;
const REPEL_EASE = 0.12;
const OSCILLATION_AMP = 1.5; // px drift when settled

export function createParticles(
  targets: { x: number; y: number }[],
  canvasWidth: number,
  canvasHeight: number
): Particle[] {
  return targets.map((t) => {
    const randomX = Math.random() * canvasWidth;
    const randomY = Math.random() * canvasHeight;

    return {
      x: randomX,
      y: randomY,
      targetX: t.x,
      targetY: t.y,
      randomX,
      randomY,
      vx: 0,
      vy: 0,
      repelX: 0,
      repelY: 0,
      radius: 0.6 + Math.random() * 1.0, // 0.6 - 1.6px
      alpha: 0.4 + Math.random() * 0.5, // 0.4 - 0.9
      phase: Math.random() * Math.PI * 2,
      speed: 0.0008 + Math.random() * 0.0015,
      amplitude: OSCILLATION_AMP + Math.random() * 1.5,
    };
  });
}

export function updateParticles(
  particles: Particle[],
  hovered: boolean,
  time: number,
  mouseX: number,
  mouseY: number
): void {
  for (const p of particles) {
    // Choose target based on hover state
    const tx = hovered ? p.targetX : p.randomX;
    const ty = hovered ? p.targetY : p.randomY;

    // Add gentle oscillation to target
    const osc = time * p.speed + p.phase;
    const oscX = Math.sin(osc) * p.amplitude;
    const oscY = Math.cos(osc * 0.7) * p.amplitude;

    // Spring toward target + oscillation
    const dx = tx + oscX - p.x;
    const dy = ty + oscY - p.y;

    p.vx = p.vx * DAMPING + dx * STIFFNESS;
    p.vy = p.vy * DAMPING + dy * STIFFNESS;

    p.x += p.vx;
    p.y += p.vy;

    // Mouse repulsion
    if (mouseX >= 0 && mouseY >= 0) {
      const mdx = p.x - mouseX;
      const mdy = p.y - mouseY;
      const dist = Math.sqrt(mdx * mdx + mdy * mdy);

      if (dist < REPEL_RADIUS && dist > 0) {
        const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
        const nx = mdx / dist;
        const ny = mdy / dist;
        p.repelX += (nx * force - p.repelX) * REPEL_EASE;
        p.repelY += (ny * force - p.repelY) * REPEL_EASE;
      } else {
        p.repelX *= 1 - REPEL_EASE;
        p.repelY *= 1 - REPEL_EASE;
      }
    } else {
      p.repelX *= 1 - REPEL_EASE;
      p.repelY *= 1 - REPEL_EASE;
    }
  }
}

/**
 * Draw particles as small filled circles.
 */
export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  dpr: number
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (const p of particles) {
    const px = (p.x + p.repelX) * dpr;
    const py = (p.y + p.repelY) * dpr;
    const r = p.radius * dpr;

    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
    ctx.fill();
  }
}

/**
 * Create a dust layer using ImageData for ambient atmosphere.
 * Returns a pre-rendered ImageData that can be putImageData'd each frame.
 */
export function createDustLayer(
  width: number,
  height: number,
  count: number,
  alphaMin: number,
  alphaMax: number
): ImageData {
  const imageData = new ImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const idx = (y * width + x) * 4;
    const alpha = alphaMin + Math.floor(Math.random() * (alphaMax - alphaMin));

    data[idx] = 80;     // R
    data[idx + 1] = 80; // G
    data[idx + 2] = 80; // B
    data[idx + 3] = alpha;
  }

  return imageData;
}
