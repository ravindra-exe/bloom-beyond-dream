import { memo, useEffect, useRef } from "react";
import type { LivingLayer as LayerKind } from "@/lib/worlds";

type Props = {
  layers: LayerKind[];
  butterflyColors: string[];
  accent: string;
};

/**
 * Living atmosphere for /world/$id — clouds, birds, dust, pollen, bubbles, embers,
 * plus cursor-reactive butterflies tinted to the world palette.
 * Butterflies use a single rAF loop with chase + flap, palette-matched.
 */
export const LivingLayer = memo(function LivingLayer({ layers, butterflyColors, accent }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const flies = Array.from(root.querySelectorAll<HTMLElement>(".lf-bfly"));
    const N = flies.length;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = flies.map((_, i) => ({
      x: window.innerWidth / 2 + Math.cos(i) * 80,
      y: window.innerHeight / 2 + Math.sin(i) * 80,
      vx: 0,
      vy: 0,
      flap: i * 0.7,
    }));

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 16.67;
      last = now;
      for (let i = 0; i < N; i++) {
        const p = pos[i];
        // each butterfly orbits target at a unique radius+phase
        const phase = now / 1000 + i * 1.7;
        const radius = 80 + (i % 4) * 40;
        const tx = target.x + Math.cos(phase * 0.6) * radius;
        const ty = target.y + Math.sin(phase * 0.8) * radius * 0.7;
        const ax = (tx - p.x) * 0.012;
        const ay = (ty - p.y) * 0.012;
        p.vx = (p.vx + ax) * 0.92;
        p.vy = (p.vy + ay) * 0.92;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.flap += dt * 0.45;
        const rot = Math.atan2(p.vy, p.vx) * 57.3;
        const wing = 0.35 + Math.abs(Math.sin(p.flap)) * 0.65;
        flies[i].style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${rot}deg)`;
        const w = flies[i].querySelector<HTMLElement>(".lf-bfly-wings");
        if (w) w.style.transform = `scaleX(${wing})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      {/* CLOUDS */}
      {layers.includes("clouds") &&
        Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`cl${i}`}
            aria-hidden
            className="absolute rounded-full"
            style={{
              top: `${10 + i * 16}%`,
              left: "-30%",
              width: 380 + i * 80,
              height: 120 + i * 30,
              background: "radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)",
              filter: "blur(8px)",
              animation: `lf-cloud ${60 + i * 12}s linear ${i * -8}s infinite`,
              opacity: 0.85,
            }}
          />
        ))}

      {/* BIRDS */}
      {layers.includes("birds") &&
        Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={`bd${i}`}
            aria-hidden
            className="absolute"
            style={{
              top: `${18 + i * 11}%`,
              left: "-8%",
              width: 22 + (i % 3) * 6,
              height: 14,
              opacity: 0.7,
              animation: `lf-bird ${40 + i * 8}s linear ${i * -6}s infinite`,
              color: "rgba(40,30,20,0.7)",
            }}
            viewBox="0 0 30 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M2 8 Q 8 1, 15 8 Q 22 1, 28 8">
              <animate
                attributeName="d"
                values="M2 8 Q 8 1, 15 8 Q 22 1, 28 8; M2 8 Q 8 6, 15 5 Q 22 6, 28 8; M2 8 Q 8 1, 15 8 Q 22 1, 28 8"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        ))}

      {/* BUBBLES (ocean) */}
      {layers.includes("bubbles") &&
        Array.from({ length: 22 }).map((_, i) => {
          const size = 4 + (i % 6) * 4;
          return (
            <span
              key={`bu${i}`}
              aria-hidden
              className="absolute rounded-full"
              style={{
                left: `${(i * 41) % 100}%`,
                bottom: "-10%",
                width: size,
                height: size,
                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), rgba(255,255,255,0.1))",
                border: `1px solid ${accent}55`,
                boxShadow: `0 0 12px ${accent}66`,
                animation: `lf-bubble ${10 + (i % 5) * 4}s linear ${(i * 0.6) % 8}s infinite`,
              }}
            />
          );
        })}

      {/* DUST */}
      {layers.includes("dust") &&
        Array.from({ length: 40 }).map((_, i) => {
          const size = 2 + (i % 4);
          return (
            <span
              key={`du${i}`}
              aria-hidden
              className="absolute rounded-full"
              style={{
                left: `${(i * 37) % 100}%`,
                bottom: "-5%",
                width: size,
                height: size,
                background: i % 3 === 0 ? accent : "#fff",
                opacity: 0.55,
                filter: "blur(0.5px)",
                boxShadow: `0 0 8px ${accent}aa`,
                animation: `lf-dust ${16 + (i % 7) * 3}s linear ${(i * 0.4) % 10}s infinite`,
              }}
            />
          );
        })}

      {/* POLLEN — slow drifting glowing motes */}
      {layers.includes("pollen") &&
        Array.from({ length: 26 }).map((_, i) => {
          const size = 3 + (i % 4) * 2;
          return (
            <span
              key={`po${i}`}
              aria-hidden
              className="absolute rounded-full"
              style={{
                left: `${(i * 53) % 100}%`,
                top: `${(i * 29) % 100}%`,
                width: size,
                height: size,
                background: accent,
                opacity: 0.7,
                boxShadow: `0 0 18px ${accent}, 0 0 4px #fff`,
                animation: `lf-pollen ${14 + (i % 6) * 3}s ease-in-out ${(i * 0.5) % 8}s infinite`,
              }}
            />
          );
        })}

      {/* EMBERS — rising warm sparks */}
      {layers.includes("embers") &&
        Array.from({ length: 30 }).map((_, i) => {
          const size = 2 + (i % 3) * 2;
          return (
            <span
              key={`em${i}`}
              aria-hidden
              className="absolute rounded-full"
              style={{
                left: `${(i * 31) % 100}%`,
                bottom: "-5%",
                width: size,
                height: size,
                background: accent,
                boxShadow: `0 0 12px ${accent}, 0 0 4px #FFF6E0`,
                animation: `lf-ember ${10 + (i % 6) * 3}s linear ${(i * 0.4) % 8}s infinite`,
              }}
            />
          );
        })}

      {/* CURSOR-REACTIVE BUTTERFLIES — palette-matched */}
      {Array.from({ length: 6 }).map((_, i) => {
        const col = butterflyColors[i % butterflyColors.length];
        return (
          <div
            key={`bf${i}`}
            aria-hidden
            className="lf-bfly absolute top-0 left-0 will-change-transform"
            style={{ filter: `drop-shadow(0 4px 10px ${col}55)` }}
          >
            <div
              className="lf-bfly-wings origin-center"
              style={{ transform: "scaleX(1)", transition: "none" }}
            >
              <svg width="34" height="22" viewBox="0 0 34 22" fill="none">
                <defs>
                  <radialGradient id={`bfg${i}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                    <stop offset="60%" stopColor={col} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={col} stopOpacity="0.3" />
                  </radialGradient>
                </defs>
                <ellipse cx="9" cy="8" rx="9" ry="7" fill={`url(#bfg${i})`} />
                <ellipse cx="9" cy="15" rx="6" ry="4.5" fill={`url(#bfg${i})`} opacity="0.85" />
                <ellipse cx="25" cy="8" rx="9" ry="7" fill={`url(#bfg${i})`} />
                <ellipse cx="25" cy="15" rx="6" ry="4.5" fill={`url(#bfg${i})`} opacity="0.85" />
                <rect x="16" y="6" width="2" height="11" rx="1" fill="#1a1208" opacity="0.7" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
});
