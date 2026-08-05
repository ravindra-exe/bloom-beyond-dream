import { memo, useEffect, useRef } from "react";

/**
 * Elegant SVG butterflies that trail the cursor.
 * Realistic wing anatomy, iridescent gradients, soft motion blur.
 * Pure DOM + rAF — zero React re-renders, 60fps.
 */
export const CursorButterflies = memo(function CursorButterflies({
  count = 3,
}: {
  count?: number;
}) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = layerRef.current;
    if (!layer) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2, flower: false };
    const cursor = document.createElement("div");
    cursor.className = "lf-cursor";
    cursor.innerHTML = '<span class="lf-cursor__dot"></span><span class="lf-cursor__halo"></span>';
    layer.appendChild(cursor);
    const dot = cursor.querySelector<HTMLElement>(".lf-cursor__dot");
    const halo = cursor.querySelector<HTMLElement>(".lf-cursor__halo");
    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const flower = (e.target as HTMLElement | null)?.closest("[data-flower-target]");
      target.flower = Boolean(flower);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Palette tuned to the garden / gold / blush identity.
    const palettes = [
      { a: "#FCE4C8", b: "#E5A86B", c: "#8B5A2B", edge: "#3A1F0E" }, // monarch-gold
      { a: "#F5E8FF", b: "#B79CE6", c: "#5E3FA1", edge: "#1A0B3A" }, // dusk-violet
      { a: "#FFF1E8", b: "#F2A5A0", c: "#A04848", edge: "#3A0E0E" }, // blush-rose
      { a: "#E8F4FF", b: "#7FB3D4", c: "#2E5C7E", edge: "#0B2236" }, // moon-blue
      { a: "#FFF7D6", b: "#E9C46A", c: "#9A6B16", edge: "#2F1C05" }, // honey
    ];

    type B = {
      el: HTMLDivElement;
      wingL: SVGGElement;
      wingR: SVGGElement;
      x: number;
      y: number;
      lag: number;
      phase: number;
      wobble: number;
      flapBase: number;
      flapSpeed: number;
      size: number;
    };

    const items: B[] = [];

    const makeButterfly = (i: number): B => {
      const palette = palettes[i % palettes.length];
      const size = 34 + (i % 3) * 8;
      const uid = `cb-${Math.random().toString(36).slice(2, 8)}`;

      const wrap = document.createElement("div");
      wrap.className = "cb-fly";
      wrap.style.width = `${size}px`;
      wrap.style.height = `${size}px`;

      wrap.innerHTML = `
        <svg viewBox="-50 -50 100 100" width="100%" height="100%" style="overflow:visible">
          <defs>
            <radialGradient id="${uid}-wing" cx="30%" cy="40%" r="80%">
              <stop offset="0%" stop-color="${palette.a}" stop-opacity="1"/>
              <stop offset="55%" stop-color="${palette.b}" stop-opacity=".95"/>
              <stop offset="100%" stop-color="${palette.c}" stop-opacity=".9"/>
            </radialGradient>
            <radialGradient id="${uid}-spot" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".9"/>
              <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
            </radialGradient>
            <filter id="${uid}-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.4"/>
            </filter>
          </defs>

          <g class="cb-wingR" style="transform-origin: 0 0;">
            <g filter="url(#${uid}-blur)">
              <!-- forewing -->
              <path d="M0,-2 C18,-38 46,-32 44,-8 C42,6 22,4 0,2 Z"
                    fill="url(#${uid}-wing)" stroke="${palette.edge}" stroke-width="1.2" stroke-linejoin="round"/>
              <!-- hindwing -->
              <path d="M0,2 C16,14 38,18 36,30 C32,42 14,30 0,12 Z"
                    fill="url(#${uid}-wing)" stroke="${palette.edge}" stroke-width="1.2" stroke-linejoin="round" opacity=".95"/>
              <!-- vein detail -->
              <path d="M2,-1 C16,-20 32,-22 40,-12 M2,1 C14,8 28,18 32,28"
                    stroke="${palette.edge}" stroke-width=".6" fill="none" opacity=".55"/>
              <!-- highlight spots -->
              <circle cx="28" cy="-18" r="3.2" fill="url(#${uid}-spot)"/>
              <circle cx="22" cy="18" r="2.4" fill="url(#${uid}-spot)"/>
              <!-- edge dots -->
              <circle cx="40" cy="-6" r="1.4" fill="${palette.edge}" opacity=".75"/>
              <circle cx="32" cy="28" r="1.2" fill="${palette.edge}" opacity=".75"/>
            </g>
          </g>

          <g class="cb-wingL" style="transform-origin: 0 0; transform: scaleX(-1);">
            <g filter="url(#${uid}-blur)">
              <path d="M0,-2 C18,-38 46,-32 44,-8 C42,6 22,4 0,2 Z"
                    fill="url(#${uid}-wing)" stroke="${palette.edge}" stroke-width="1.2" stroke-linejoin="round"/>
              <path d="M0,2 C16,14 38,18 36,30 C32,42 14,30 0,12 Z"
                    fill="url(#${uid}-wing)" stroke="${palette.edge}" stroke-width="1.2" stroke-linejoin="round" opacity=".95"/>
              <path d="M2,-1 C16,-20 32,-22 40,-12 M2,1 C14,8 28,18 32,28"
                    stroke="${palette.edge}" stroke-width=".6" fill="none" opacity=".55"/>
              <circle cx="28" cy="-18" r="3.2" fill="url(#${uid}-spot)"/>
              <circle cx="22" cy="18" r="2.4" fill="url(#${uid}-spot)"/>
              <circle cx="40" cy="-6" r="1.4" fill="${palette.edge}" opacity=".75"/>
              <circle cx="32" cy="28" r="1.2" fill="${palette.edge}" opacity=".75"/>
            </g>
          </g>

          <!-- body -->
          <ellipse cx="0" cy="0" rx="1.8" ry="18" fill="#1a1108"/>
          <ellipse cx="0" cy="-14" rx="2.4" ry="3" fill="#0a0604"/>
          <!-- antennae -->
          <path d="M-1,-16 C-4,-22 -6,-26 -8,-30" stroke="#0a0604" stroke-width=".8" fill="none" stroke-linecap="round"/>
          <path d="M1,-16 C4,-22 6,-26 8,-30" stroke="#0a0604" stroke-width=".8" fill="none" stroke-linecap="round"/>
          <circle cx="-8" cy="-30" r=".9" fill="#0a0604"/>
          <circle cx="8" cy="-30" r=".9" fill="#0a0604"/>
        </svg>
      `;
      layer.appendChild(wrap);

      const wingL = wrap.querySelector(".cb-wingL") as SVGGElement;
      const wingR = wrap.querySelector(".cb-wingR") as SVGGElement;

      return {
        el: wrap,
        wingL,
        wingR,
        x: target.x,
        y: target.y,
        lag: 0.085 + i * 0.022,
        phase: Math.random() * Math.PI * 2,
        wobble: 22 + i * 10,
        flapBase: 14 + i * 6,
        flapSpeed: 14 + Math.random() * 4,
        size,
      };
    };

    for (let i = 0; i < count; i++) items.push(makeButterfly(i));

    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.016;
      if (dot && halo) {
        dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
        halo.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) scale(${target.flower ? 1.65 : 1})`;
        cursor.classList.toggle("is-flower", target.flower);
      }
      for (let i = 0; i < items.length; i++) {
        const b = items[i];
        const ox = Math.cos(t * 1.1 + b.phase) * b.wobble;
        const oy = Math.sin(t * 1.6 + b.phase) * b.wobble * 0.55;
        const tx = target.x + ox - i * 12;
        const ty = target.y + oy - i * 8;
        const dx = (tx - b.x) * b.lag;
        const dy = (ty - b.y) * b.lag;
        b.x += dx;
        b.y += dy;
        const speed = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        // bank/yaw — when moving faster, flap faster and tilt more
        const flap = Math.sin(t * b.flapSpeed + b.phase) * (55 + Math.min(speed * 4, 25));
        const tilt = Math.min(speed * 1.2, 18);

        b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) translate(-50%, -50%) rotate(${angle}deg)`;
        // pseudo-3D wing fold: scaleX the wings to fake perspective
        const fold = Math.cos((flap * Math.PI) / 180);
        b.wingR.setAttribute(
          "transform",
          `scale(${fold.toFixed(3)}, 1) rotate(${(tilt * 0.4).toFixed(2)})`,
        );
        b.wingL.setAttribute(
          "transform",
          `scale(${(-fold).toFixed(3)}, 1) rotate(${(-tilt * 0.4).toFixed(2)})`,
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      items.forEach((b) => b.el.remove());
      cursor.remove();
    };
  }, [count]);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    />
  );
});
