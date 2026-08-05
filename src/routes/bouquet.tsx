import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import heroFlower from "@/assets/hero-flower.png";
import petalFront from "@/assets/petal-front.png";
import petalBack from "@/assets/petal-back.png";
import worldCrystal from "@/assets/world-crystal.jpg";
import worldMoonlight from "@/assets/world-moonlight.jpg";
import worldSky from "@/assets/world-sky.jpg";
import worldOcean from "@/assets/world-ocean.jpg";
import worldGolden from "@/assets/world-golden.jpg";

const TITLE = "The Bouquet — Lumina Flora";
const DESC =
  "A living bouquet: concentric rings of flowers rotating in alternating directions, an orbital meditation of the Lumina Flora garden.";

export const Route = createFileRoute("/bouquet")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroFlower },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/bouquet" }],
  }),
  component: Bouquet,
});

const FLOWERS = [
  heroFlower,
  petalFront,
  petalBack,
  worldCrystal,
  worldMoonlight,
  worldSky,
  worldOcean,
  worldGolden,
];

type RingSpec = {
  radius: number;
  count: number;
  size: number;
  duration: number;
  direction: 1 | -1;
  opacity: number;
};

const RINGS: RingSpec[] = [
  { radius: 120, count: 6, size: 62, duration: 28, direction: 1, opacity: 1 },
  { radius: 230, count: 10, size: 78, duration: 42, direction: -1, opacity: 0.98 },
  { radius: 350, count: 14, size: 70, duration: 60, direction: 1, opacity: 0.92 },
  { radius: 470, count: 18, size: 58, duration: 80, direction: -1, opacity: 0.82 },
  { radius: 590, count: 22, size: 48, duration: 110, direction: 1, opacity: 0.7 },
];

function Bouquet() {
  const stageRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Rings: alternating rotation directions
      ringsRef.current.forEach((el, i) => {
        const spec = RINGS[i];
        if (!el) return;
        gsap.set(el, { rotation: 0 });
        gsap.to(el, {
          rotation: 360 * spec.direction,
          duration: spec.duration,
          ease: "none",
          repeat: -1,
        });
        // Counter-rotate each flower so they always face upright
        const flowers = el.querySelectorAll<HTMLElement>(".bq-flower");
        flowers.forEach((f) => {
          gsap.to(f, {
            rotation: -360 * spec.direction,
            duration: spec.duration,
            ease: "none",
            repeat: -1,
          });
          gsap.to(f, {
            y: "+=10",
            duration: 2 + Math.random() * 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: Math.random(),
          });
        });
      });

      // Core bloom breathing
      if (coreRef.current) {
        gsap.to(coreRef.current, {
          scale: 1.08,
          duration: 4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // Cinematic entrance
      const tl = gsap.timeline();
      tl.from(".bq-ring", {
        scale: 0.2,
        opacity: 0,
        duration: 1.6,
        ease: "expo.out",
        stagger: 0.14,
      })
        .from(
          coreRef.current,
          { scale: 0, opacity: 0, duration: 1.4, ease: "back.out(1.7)" },
          "-=1.2",
        )
        .from(
          ".bq-title-word",
          {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.08,
          },
          "-=0.8",
        )
        .from(
          ".bq-sub",
          { y: 20, opacity: 0, duration: 0.9, ease: "expo.out" },
          "-=0.6",
        );

      // Parallax on pointer
      const onMove = (e: PointerEvent) => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const mx = (e.clientX - w / 2) / w;
        const my = (e.clientY - h / 2) / h;
        gsap.to(stageRef.current, {
          x: mx * -24,
          y: my * -24,
          rotation: mx * 2,
          duration: 1.2,
          ease: "power3.out",
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    }, stageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6ecdf] text-stone-800">
      {/* soft radial vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(255,244,224,0.9) 0%, rgba(246,236,223,0.4) 40%, rgba(60,40,20,0.35) 100%)",
        }}
      />
      {/* golden dust */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: 2 + (i % 4),
              height: 2 + (i % 4),
              background: "#e8b85c",
              opacity: 0.5,
              boxShadow: "0 0 10px #e8b85c",
              animation: `lf-dust ${14 + (i % 6) * 3}s linear ${(i * 0.4) % 8}s infinite`,
            }}
          />
        ))}
      </div>

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 px-6 md:px-10 py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-2 rounded-full bg-brand-gold" />
          <span className="text-[10px] md:text-xs tracking-[0.35em] font-semibold uppercase">
            Lumina Flora
          </span>
        </Link>
        <Link
          to="/"
          className="text-[10px] tracking-[0.3em] uppercase px-5 py-2.5 rounded-full bg-white/50 backdrop-blur-xl ring-1 ring-stone-900/10 hover:bg-white transition"
        >
          ← Garden
        </Link>
      </nav>

      {/* STAGE */}
      <div className="relative flex min-h-screen items-center justify-center">
        <div
          ref={stageRef}
          className="relative"
          style={{ width: 1280, height: 1280, maxWidth: "140vmin", maxHeight: "140vmin" }}
        >
          {/* rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            {RINGS.map((ring, ri) => (
              <div
                key={ri}
                ref={(el) => {
                  if (el) ringsRef.current[ri] = el;
                }}
                className="bq-ring absolute"
                style={{
                  width: ring.radius * 2,
                  height: ring.radius * 2,
                  opacity: ring.opacity,
                }}
              >
                {Array.from({ length: ring.count }).map((_, fi) => {
                  const angle = (fi / ring.count) * Math.PI * 2;
                  const x = Math.cos(angle) * ring.radius;
                  const y = Math.sin(angle) * ring.radius;
                  const src = FLOWERS[(ri * 3 + fi) % FLOWERS.length];
                  return (
                    <div
                      key={fi}
                      className="bq-flower absolute left-1/2 top-1/2"
                      style={{
                        width: ring.size,
                        height: ring.size,
                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                      }}
                    >
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover rounded-full shadow-[0_10px_30px_rgba(60,30,10,0.35)] ring-1 ring-white/60"
                        style={{
                          filter: `drop-shadow(0 6px 12px rgba(60,30,10,0.35))`,
                        }}
                      />
                    </div>
                  );
                })}
                {/* faint orbital line */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "1px dashed rgba(120,80,30,0.15)",
                  }}
                />
              </div>
            ))}
          </div>

          {/* CORE bloom */}
          <img
            ref={coreRef}
            src={heroFlower}
            alt="Bouquet core bloom"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: 180,
              height: 180,
              filter: "drop-shadow(0 20px 60px rgba(232,184,92,0.55))",
            }}
          />
        </div>

        {/* TITLE overlay */}
        <div
          ref={titleRef}
          className="pointer-events-none absolute inset-x-0 bottom-14 flex flex-col items-center text-center px-6"
        >
          <div className="font-display italic text-5xl md:text-7xl leading-[1.05] tracking-tight text-stone-900">
            {"The Living Bouquet".split(" ").map((w, i) => (
              <span key={i} className="bq-title-word inline-block mx-1">
                {w}
              </span>
            ))}
          </div>
          <p className="bq-sub mt-4 max-w-xl text-sm md:text-base tracking-wide text-stone-700/80">
            Five orbits, five heartbeats — each ring turns against the last, a
            slow procession of every bloom in the garden.
          </p>
        </div>
      </div>
    </div>
  );
}
