import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import heroFlower from "@/assets/hero-flower.png";
import petalFront from "@/assets/petal-front.png";
import petalBack from "@/assets/petal-back.png";
import worldOcean from "@/assets/world-ocean.jpg";
import worldMoonlight from "@/assets/world-moonlight.jpg";
import worldCrystal from "@/assets/world-crystal.jpg";
import { WebGLAura } from "@/components/WebGLAura";
import { useCameraRig } from "@/hooks/useCameraRig";
import { worlds, type World } from "@/lib/worlds";

const SEO_TITLE = "Lumina Flora — An Enchanted Garden of Worlds";
const SEO_DESC =
  "An immersive, cinematic flower garden where every bloom opens a hidden world.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESC },
      { name: "theme-color", content: "#FCF8F3" },
      { property: "og:title", content: SEO_TITLE },
      { property: "og:description", content: SEO_DESC },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroFlower },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroFlower },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroFlower, fetchpriority: "high" } as unknown as Record<string, string>,
    ],
  }),
  component: Index,
});

const cardWorlds = worlds.filter((w) => w.id !== "abyss");

// Three "starting" portals — all open the Marine (Abyss) world
const portalImages = [worldOcean, worldMoonlight, worldCrystal];

function Index() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [transition, setTransition] = useState<null | { world: World; origin: { x: number; y: number } }>(null);
  const navigate = useNavigate();
  useCameraRig();

  const onNav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const enterWorld = useCallback(
    (w: World, e?: { clientX: number; clientY: number } | React.MouseEvent) => {
      if (transition) return;
      const origin = e
        ? { x: (e as { clientX: number }).clientX, y: (e as { clientY: number }).clientY }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      setTransition({ world: w, origin });
      window.setTimeout(() => {
        navigate({ to: "/world/$id", params: { id: w.id } });
      }, 1750);
    },
    [navigate, transition],
  );

  // While the ink-bloom portal is on screen, neutralize the identity
  // transform GSAP places on <body>. That transform turns <body> into the
  // containing block for our fixed overlay and stretches it to full page
  // height. Clearing it restores true viewport-anchored positioning.
  useEffect(() => {
    if (!transition) return;
    const prev = document.body.style.transform;
    document.body.style.transform = "none";
    return () => {
      document.body.style.transform = prev;
    };
  }, [transition]);



  return (
    <div className="bg-brand-cream font-sans text-stone-800 selection:bg-brand-gold/20 overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 px-6 md:px-10 py-5 flex justify-between items-center">
        <a href="#garden" onClick={(e) => onNav(e, "garden")} className="flex items-center gap-3">
          <div className="size-2 rounded-full bg-brand-gold lf-shimmer" />
          <span className="text-[10px] md:text-xs tracking-[0.35em] font-semibold uppercase text-stone-800">
            Lumina Flora
          </span>
        </a>
        <div className="hidden md:flex gap-8 text-[10px] tracking-[0.25em] font-medium uppercase px-6 py-3 rounded-full bg-white/40 backdrop-blur-xl ring-1 ring-stone-900/5">
          <a href="#garden" onClick={(e) => onNav(e, "garden")} className="hover:text-brand-gold transition-colors">Garden</a>
          <a href="#portals" onClick={(e) => onNav(e, "portals")} className="hover:text-brand-gold transition-colors">Portals</a>
          <a href="#worlds" onClick={(e) => onNav(e, "worlds")} className="hover:text-brand-gold transition-colors">Worlds</a>
          <a href="#abyss" onClick={(e) => onNav(e, "abyss")} className="hover:text-brand-gold transition-colors">Abyss</a>
          <Link to="/bouquet" className="hover:text-brand-gold transition-colors">Bouquet</Link>
          <a href="#studio" onClick={(e) => onNav(e, "studio")} className="hover:text-brand-gold transition-colors">Studio</a>
        </div>
        <button
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="size-10 rounded-full border border-stone-300/60 bg-white/60 backdrop-blur-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-white transition-all"
        >
          <span className={`w-4 h-px bg-stone-800 transition-transform ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`} />
          <span className={`w-4 h-px bg-stone-800 transition-transform ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* DRAWER */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-500 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" />
        <aside
          className={`absolute top-0 right-0 h-full w-full sm:w-[420px] bg-brand-cream/95 backdrop-blur-2xl shadow-2xl p-10 pt-24 flex flex-col gap-2 transition-transform duration-500 ease-[cubic-bezier(.19,1,.22,1)] ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-brand-gold mb-4">Navigate</span>
          {[
            { id: "garden", label: "The Garden" },
            { id: "portals", label: "Portals" },
            { id: "worlds", label: "Worlds" },
            { id: "abyss", label: "Abyss" },
            { id: "studio", label: "Studio" },
          ].map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => onNav(e, l.id)}
              className="font-display italic text-4xl text-stone-900 hover:text-brand-gold transition-colors py-1"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-8 pt-8 border-t border-stone-200">
            <span className="text-[10px] tracking-[0.4em] uppercase text-stone-400 mb-4 block">Worlds</span>
            <div className="flex flex-col gap-2">
              {worlds.map((w) => (
                <button
                  key={w.id}
                  onClick={(e) => { setMenuOpen(false); enterWorld(w, e); }}
                  className="text-left text-sm tracking-wide text-stone-700 hover:text-brand-gold transition-colors py-1"
                >
                  {w.chapter} · {w.title}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* HERO — cinematic editorial depth */}
      <section
        ref={heroRef}
        id="garden"
        className="relative h-[100svh] overflow-hidden flex items-center justify-center cam-stage"
      >
        <WebGLAura className="absolute inset-0 w-full h-full -z-20" />

        {/* warm radial atmosphere */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 35%, rgba(255,247,235,0.65) 0%, rgba(252,239,227,0.4) 45%, rgba(232,226,247,0.55) 100%)",
          }}
        />

        {/* far ghost word — drifts back as you scroll, creating dolly-through depth */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none cam-dolly-back">
          <h1 className="text-[28vw] md:text-[22vw] font-display italic text-brand-blush/55 leading-none select-none tracking-tight">
            Aether
          </h1>
        </div>

        {/* foreground blurred petals — strong pointer parallax, slight scroll lift */}
        <img
          src={petalBack}
          alt=""
          aria-hidden
          className="absolute top-[8%] left-[-6%] w-[34vw] max-w-[280px] opacity-60 rotate-12 pointer-events-none cam-dolly-front"
          style={{ filter: "blur(6px)" }}
        />
        <img
          src={petalFront}
          alt=""
          aria-hidden
          className="absolute bottom-[10%] right-[-8%] w-[40vw] max-w-[340px] opacity-55 -rotate-45 pointer-events-none cam-dolly-front"
          style={{ filter: "blur(8px)" }}
        />

        {/* drifting bloom-petals — fewer than before for 90fps headroom */}
        {Array.from({ length: 10 }).map((_, i) => {
          const left = (i * 73) % 100;
          const delay = (i * 1.3) % 12;
          const dur = 12 + (i % 6) * 2;
          const size = 10 + (i % 5) * 6;
          const hue = i % 3;
          const bg =
            hue === 0 ? "var(--color-brand-blush)" : hue === 1 ? "var(--color-brand-lavender)" : "var(--color-brand-peach)";
          return (
            <span
              key={i}
              aria-hidden
              className="lf-hero-petal absolute top-[-10%] rounded-[80%_0_55%_50%_/_55%_0_80%_50%] pointer-events-none"
              style={{
                left: `${left}%`,
                width: size,
                height: size * 1.3,
                background: bg,
                opacity: 0.65,
                animation: `lf-drift ${dur}s linear ${delay}s infinite`,
                ["--petal-drift" as string]: `${(i % 3) * 9 - 9}px`,
                ["--petal-tilt" as string]: `${(i % 2 ? -1 : 1) * (12 + i * 3)}deg`,
              }}
            />
          );
        })}

        {/* central bloom — dollies forward on scroll for cinematic descent */}
        <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center cam-scene cam-dolly-hero">
          <FlowerRotor />
        </div>

        {/* editorial typography column — fades up over the bloom on scroll */}
        <div className="absolute inset-x-0 bottom-[8svh] z-20 flex flex-col items-center text-center px-6 cam-dolly-text">
          <span className="text-[10px] tracking-[0.4em] uppercase text-brand-gold font-semibold lf-fadeup" style={{ animationDelay: ".4s" }}>
            An Enchanted Garden of Worlds
          </span>
          <h2 className="font-display text-3xl md:text-5xl mt-4 leading-[1.1] text-stone-900 lf-fadeup" style={{ animationDelay: ".6s" }}>
            <span className="italic font-light">Stepping into the</span>
            <br />
            <span className="not-italic font-normal">dream of nature.</span>
          </h2>
          <div className="lf-divider-gold mt-8 lf-fadeup" style={{ animationDelay: ".9s" }} />
          <a
            href="#portals"
            onClick={(e) => onNav(e, "portals")}
            data-magnetic="0.4"
            className="mt-4 group inline-flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase text-stone-700 hover:text-brand-gold transition-colors lf-fadeup"
            style={{ animationDelay: "1.1s" }}
          >
            <span className="size-1.5 rounded-full bg-brand-gold transition-transform group-hover:scale-150" />
            Descend
          </a>
        </div>

        {/* soft god-ray sheet (static — costs nothing per frame) */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{ background: "linear-gradient(to top right, transparent, rgba(255,249,242,.35), transparent)" }}
        />
      </section>



      {/* PORTALS — staggered cinematic stack */}
      <section id="portals" className="relative py-32 px-6 md:px-12 bg-brand-cream overflow-hidden cv-auto">
        {/* god rays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-1/3 left-[10%] w-[60%] h-[160%] bg-gradient-to-b from-brand-gold/15 via-transparent to-transparent blur-3xl" style={{ animation: "lf-godray 14s ease-in-out infinite" }} />
          <div className="absolute -top-1/3 right-[5%] w-[40%] h-[160%] bg-gradient-to-b from-brand-lavender/30 via-transparent to-transparent blur-3xl" style={{ animation: "lf-godray 18s ease-in-out infinite reverse" }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20" data-reveal>
            <span className="text-[10px] tracking-[0.4em] uppercase text-brand-gold">Three Doors · One Tide</span>
            <h2 className="font-display italic text-5xl md:text-6xl mt-4 text-stone-900" data-split>Choose a portal.</h2>
            <p className="mt-4 text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              Each opens onto the same impossible sea — the Marine flower kingdom of the Abyssal Rose.
            </p>
          </div>

          {/* staggered stack on mobile, refined row on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-20 md:gap-y-0 md:gap-x-10 items-start max-w-md md:max-w-none mx-auto">
            {portalImages.map((img, i) => {
              const titles = ["The Coral Vault", "Eternal Lotus", "The Ice Bloom"];
              // alternating self-alignment for the staggered editorial rhythm
              const offsetY = i === 0 ? "" : i === 1 ? "md:translate-y-12" : "md:-translate-y-4";
              const lateral = i === 0 ? "self-start" : i === 1 ? "self-center md:self-end" : "self-end md:self-start";
              return (
                <div
                  key={i}
                  className={`relative ${offsetY} ${lateral} w-full max-w-[320px]`}
                >
                  <span className={`lf-portal-index absolute -top-2 ${i % 2 === 0 ? "-left-6" : "-right-6"} z-10`}>
                    Portal {String(i + 1).padStart(2, "0")}
                  </span>
                  <Portal
                    img={img}
                    index={i}
                    title={titles[i]}
                    onEnter={(e) => enterWorld(worlds.find((w) => w.id === "abyss")!, e)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* PROLOGUE — cinematic editorial spread */}
      <section id="prologue" className="relative py-32 md:py-40 px-6 md:px-8 overflow-hidden">
        {/* layered backdrop */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-brand-ivory to-brand-cream" />
          <div className="absolute -top-40 -left-32 size-[520px] rounded-full bg-brand-blush/50 blur-[140px]" />
          <div className="absolute -bottom-40 -right-32 size-[520px] rounded-full bg-brand-lavender/45 blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[720px] rounded-full bg-brand-peach/30 blur-[160px]" />
          {/* soft god ray */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-full opacity-60"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,236,210,0.55) 0%, rgba(255,236,210,0) 70%)",
              filter: "blur(30px)",
              animation: "lf-godray 18s ease-in-out infinite",
            }}
          />
          {/* floating petal artwork */}
          <img
            src={petalBack}
            alt=""
            className="hidden md:block absolute top-[6%] -left-10 w-40 md:w-52 opacity-40 -rotate-12 cam-layer cam-z--far lf-float pointer-events-none"
            style={{ animationDuration: "13s" }}
          />
          <img
            src={petalFront}
            alt=""
            className="hidden md:block absolute -bottom-16 -right-16 w-52 lg:w-64 opacity-40 rotate-12 cam-layer cam-z--near lf-float pointer-events-none"
            style={{ animationDuration: "16s" }}
          />
          <img
            src={petalBack}
            alt=""
            className="hidden md:block absolute top-[42%] -right-10 w-24 md:w-28 opacity-35 rotate-45 cam-layer cam-z--mid lf-float pointer-events-none"
            style={{ animationDuration: "11s" }}
          />
          {/* drifting motes */}
          {Array.from({ length: 22 }).map((_, i) => {
            const size = 3 + (i % 4) * 2;
            const pal = ["#E9C39B", "#F3D5D5", "#DCD0F5", "#FFF1DC"];
            return (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${(i * 43) % 100}%`,
                  top: `${(i * 29) % 100}%`,
                  width: size,
                  height: size,
                  background: pal[i % pal.length],
                  opacity: 0.55,
                  boxShadow: `0 0 12px ${pal[i % pal.length]}`,
                  animation: `lf-pollen ${14 + (i % 6) * 3}s ease-in-out ${(i * 0.5) % 8}s infinite`,
                }}
              />
            );
          })}
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Ornamental crest */}
          <div className="flex flex-col items-center gap-4 mb-14">
            <svg width="72" height="72" viewBox="0 0 72 72" className="text-brand-gold" fill="none">
              <g stroke="currentColor" strokeWidth="1.2" opacity="0.9">
                <circle cx="36" cy="36" r="6" fill="currentColor" fillOpacity="0.15" />
                {Array.from({ length: 8 }).map((_, i) => {
                  const a = (i * Math.PI) / 4;
                  const x = 36 + Math.cos(a) * 22;
                  const y = 36 + Math.sin(a) * 22;
                  return (
                    <ellipse
                      key={i}
                      cx={x}
                      cy={y}
                      rx="8"
                      ry="3.5"
                      transform={`rotate(${(i * 45)} ${x} ${y})`}
                      fill="currentColor"
                      fillOpacity="0.08"
                    />
                  );
                })}
                <circle cx="36" cy="36" r="2.5" fill="currentColor" />
              </g>
            </svg>
            <div className="flex items-center gap-4">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-brand-gold/70" />
              <span className="text-[10px] tracking-[0.5em] uppercase text-brand-gold">Prologue · No. I</span>
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-brand-gold/70" />
            </div>
          </div>

          {/* Editorial spread */}
          <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-start">
            {/* Left column — headline with drop cap */}
            <div className="md:col-span-8 relative">
              <p className="font-display text-3xl md:text-6xl leading-[1.05] text-stone-900">
                <span
                  className="float-left font-display text-[5.5rem] md:text-[8rem] leading-[0.8] mr-3 mt-1 italic bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #C89A5B 0%, #E9C39B 45%, #8B6A3C 100%)",
                  }}
                >
                  E
                </span>
                <span className="italic">very flower is a door.</span>{" "}
                <span className="text-stone-500">
                  Every petal, a chapter of a world that has been waiting for you.
                </span>
              </p>

              <div className="mt-10 flex items-center gap-4">
                <span className="h-px flex-1 bg-stone-300/60" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-stone-400">
                  An invitation
                </span>
                <span className="h-px flex-1 bg-stone-300/60" />
              </div>
            </div>

            {/* Right column — glass field-note */}
            <aside className="md:col-span-4 md:mt-10">
              <div className="relative rounded-3xl border border-white/60 bg-white/50 backdrop-blur-xl p-7 shadow-[0_30px_80px_-30px_rgba(139,106,60,0.35)]">
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-brand-gold/90 text-white text-[9px] tracking-[0.35em] uppercase">
                  Field Note
                </div>
                <p className="font-display italic text-lg text-stone-800 leading-snug">
                  "The garden does not perform. It breathes back — but only for those who slow down."
                </p>
                <p className="mt-4 text-xs text-stone-500 leading-relaxed">
                  Use your cursor, your patience, and your imagination. Every petal responds. Every
                  chamber remembers.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="size-8 rounded-full bg-gradient-to-br from-brand-gold to-brand-peach" />
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-stone-500">Curator</p>
                    <p className="text-sm font-display italic text-stone-700">Lumina Flora</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Three invitation cards */}
          <div className="mt-20 grid md:grid-cols-3 gap-6" data-stagger>
            {[
              {
                n: "01",
                title: "Wander slowly",
                body: "Each bloom hides a room. Rooms hide chapters. Chapters hide the sky.",
              },
              {
                n: "02",
                title: "Follow the light",
                body: "Pollen, embers, moon-dust — the garden guides those who trust the glow.",
              },
              {
                n: "03",
                title: "Leave a footprint",
                body: "The flowers remember whoever paused, and bloom differently for their return.",
              },
            ].map((c, i) => (
              <div
                key={c.n}
                className="group relative rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl p-7 overflow-hidden transition-transform duration-500 hover:-translate-y-1"
                style={{ boxShadow: "0 20px 60px -25px rgba(139,106,60,0.35)" }}
              >
                <div
                  className="absolute -top-14 -right-14 size-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: `radial-gradient(circle, ${["#F3D5D5", "#DCD0F5", "#E9C39B"][i]}88, transparent 70%)`,
                    filter: "blur(20px)",
                  }}
                />
                <div className="relative">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display italic text-4xl text-brand-gold/80">{c.n}</span>
                    <span className="text-[9px] tracking-[0.4em] uppercase text-stone-400">
                      Chapter · {c.n}
                    </span>
                  </div>
                  <div className="mt-4 h-px w-10 bg-brand-gold/60" />
                  <h3 className="mt-4 font-display italic text-2xl text-stone-900">{c.title}</h3>
                  <p className="mt-3 text-sm text-stone-500 leading-relaxed">{c.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Closing ornamental line */}
          <div className="mt-16 flex items-center justify-center gap-4">
            <span className="h-px w-20 bg-gradient-to-r from-transparent to-brand-gold/60" />
            <svg width="16" height="16" viewBox="0 0 16 16" className="text-brand-gold" fill="currentColor">
              <circle cx="8" cy="8" r="2" />
              <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            </svg>
            <span className="text-[10px] tracking-[0.5em] uppercase text-stone-400">
              Turn the page
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" className="text-brand-gold" fill="currentColor">
              <circle cx="8" cy="8" r="2" />
              <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            </svg>
            <span className="h-px w-20 bg-gradient-to-l from-transparent to-brand-gold/60" />
          </div>
        </div>
      </section>

      {/* WORLDS */}
      <section id="worlds" className="relative py-24 px-6 md:px-12 overflow-hidden">
        {/* Background atmosphere */}
        <div className="absolute inset-0 pointer-events-none -z-0">
          <div className="absolute top-0 left-1/4 w-[55%] h-full bg-gradient-to-b from-brand-blush/40 via-transparent to-transparent blur-3xl" style={{ animation: "lf-godray 16s ease-in-out infinite" }} />
          <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-b from-brand-lavender/40 via-transparent to-transparent blur-3xl" style={{ animation: "lf-godray 22s ease-in-out infinite reverse" }} />
          <img src={petalBack} alt="" aria-hidden className="absolute top-[8%] left-[3%] w-44 opacity-40 rotate-12 cam-layer cam-z--far lf-float" style={{ animationDuration: "12s" }} />
          <img src={petalFront} alt="" aria-hidden className="absolute top-[40%] right-[2%] w-36 opacity-50 -rotate-12 cam-layer cam-z--near lf-float" style={{ animationDuration: "14s" }} />
          <img src={petalBack} alt="" aria-hidden className="absolute bottom-[8%] left-[40%] w-32 opacity-40 rotate-45 cam-layer cam-z--mid lf-float" style={{ animationDuration: "11s" }} />
          {Array.from({ length: 26 }).map((_, i) => {
            const left = (i * 41) % 100;
            const size = 6 + (i % 5) * 4;
            const dur = 12 + (i % 6) * 3;
            const pal = ["var(--color-brand-blush)", "var(--color-brand-lavender)", "var(--color-brand-peach)", "var(--color-brand-gold)"];
            return (
              <span
                key={i}
                aria-hidden
                className="absolute top-[-8%] rounded-[80%_0_55%_50%_/_55%_0_80%_50%]"
                style={{
                  left: `${left}%`,
                  width: size,
                  height: size * 1.4,
                  background: pal[i % pal.length],
                  opacity: 0.35,
                  filter: "blur(1.5px)",
                  animation: `lf-drift ${dur}s linear ${(i * 0.6) % 10}s infinite`,
                }}
              />
            );
          })}
          {/* drifting butterflies — distant ambient life */}
          {Array.from({ length: 4 }).map((_, i) => {
            const top = 15 + i * 18;
            const dur = 28 + i * 6;
            const delay = i * 5;
            const col = ["#C6A8FF", "#FEECE9", "#F8D5C2", "#B38B5D"][i];
            return (
              <span
                key={`bf${i}`}
                aria-hidden
                className="absolute left-[-10%] pointer-events-none cam-layer cam-z--mid"
                style={{
                  top: `${top}%`,
                  animation: `lf-butterfly ${dur}s linear ${delay}s infinite`,
                }}
              >
                <span className="relative inline-flex">
                  <span
                    className="block"
                    style={{
                      width: 14, height: 10, background: col, opacity: .8,
                      borderRadius: "60% 0 60% 0",
                      filter: "blur(.3px)",
                      transformOrigin: "100% 50%",
                      animation: "lf-wing .25s ease-in-out infinite",
                      boxShadow: `0 0 12px ${col}88`,
                    }}
                  />
                  <span
                    className="block"
                    style={{
                      width: 14, height: 10, background: col, opacity: .8,
                      borderRadius: "0 60% 0 60%",
                      filter: "blur(.3px)",
                      transformOrigin: "0% 50%",
                      animation: "lf-wing .25s ease-in-out infinite",
                      boxShadow: `0 0 12px ${col}88`,
                    }}
                  />
                </span>
              </span>
            );
          })}
        </div>

        <div className="relative max-w-7xl mx-auto cam-stage">
          <div className="mb-16 text-center" data-reveal>
            <span className="text-[10px] tracking-[0.4em] uppercase text-brand-gold">The Garden</span>
            <h2 className="font-display italic text-5xl md:text-7xl mt-4 text-stone-900" data-split>Choose a bloom.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 md:gap-y-24" data-stagger>
            {cardWorlds.map((w, i) => (
              <WorldCard key={w.id} world={w} index={i} onEnter={enterWorld} />
            ))}
          </div>
        </div>
      </section>

      {/* ABYSS */}
      <section id="abyss" className="relative h-[100svh] w-full flex items-center justify-center bg-stone-950 overflow-hidden cam-stage">
        <div className="absolute inset-0 opacity-90 cam-layer cam-z--far">
          <img
            src={worldOcean}
            alt="Underwater floral kingdom"
            className="w-full h-full object-cover scale-125"
            loading="lazy" decoding="async"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950/70" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl" data-reveal>
          <span className="text-white/70 text-[10px] tracking-[0.5em] uppercase block mb-6">
            Chapter IV — Deep Sea Flora
          </span>
          <h2 className="text-white font-display text-5xl md:text-8xl italic leading-none" data-split>
            The Abyssal Rose
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed mt-8 max-w-lg mx-auto">
            A floral kingdom that breathes saltwater, where coral and orchid become one.
          </p>
          <button
            onClick={(e) => enterWorld(worlds.find((w) => w.id === "abyss")!, e)}
            data-magnetic="0.35"
            className="mt-12 group inline-flex items-center gap-4 cursor-pointer"
          >
            <span className="size-16 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
              <span className="size-2 bg-white group-hover:bg-stone-900 rounded-full transition-colors" />
            </span>
            <span className="text-white text-[10px] tracking-[0.4em] uppercase">Dive In</span>
          </button>
        </div>
      </section>

      {/* OUTRO — luxurious magical */}
      <section className="relative py-44 px-6 overflow-hidden" style={{
        background: "radial-gradient(120% 80% at 30% 20%, var(--color-brand-blush) 0%, var(--color-brand-cream) 45%, var(--color-brand-lavender) 100%)",
      }}>
        {/* god rays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-1/3 left-[20%] w-[40%] h-[160%] bg-gradient-to-b from-brand-gold/25 via-transparent to-transparent blur-3xl" style={{ animation: "lf-godray 15s ease-in-out infinite" }} />
          <div className="absolute -top-1/3 right-[15%] w-[35%] h-[160%] bg-gradient-to-b from-white/40 via-transparent to-transparent blur-3xl" style={{ animation: "lf-godray 19s ease-in-out infinite reverse" }} />
        </div>
        {/* dust + petals */}
        {Array.from({ length: 30 }).map((_, i) => {
          const left = (i * 53) % 100;
          const size = 3 + (i % 5) * 2;
          const dur = 16 + (i % 7) * 3;
          return (
            <span
              key={`d${i}`}
              aria-hidden
              className="absolute bottom-0 rounded-full pointer-events-none"
              style={{
                left: `${left}%`,
                width: size,
                height: size,
                background: i % 3 === 0 ? "var(--color-brand-gold)" : "#fff",
                opacity: 0.5,
                filter: "blur(0.5px)",
                boxShadow: i % 3 === 0 ? "0 0 12px var(--color-brand-gold)" : "0 0 8px #fff",
                animation: `lf-dust ${dur}s linear ${(i * 0.4) % 10}s infinite`,
              }}
            />
          );
        })}
        {Array.from({ length: 16 }).map((_, i) => {
          const left = (i * 67) % 100;
          const size = 12 + (i % 4) * 8;
          const dur = 10 + (i % 5) * 3;
          const pal = ["var(--color-brand-blush)", "var(--color-brand-lavender)", "var(--color-brand-peach)", "var(--color-brand-gold)"];
          return (
            <span
              key={`p${i}`}
              aria-hidden
              className="absolute top-[-10%] rounded-[80%_0_55%_50%_/_55%_0_80%_50%]"
              style={{
                left: `${left}%`,
                width: size,
                height: size * 1.4,
                background: pal[i % pal.length],
                opacity: 0.5,
                filter: "blur(1px)",
                animation: `lf-drift ${dur}s linear ${(i * 0.8) % 9}s infinite`,
              }}
            />
          );
        })}
        <img src={petalBack} alt="" aria-hidden className="absolute top-10 left-[6%] w-40 opacity-60 rotate-12 pointer-events-none lf-float" style={{ animationDuration: "11s" }} />
        <img src={petalFront} alt="" aria-hidden className="absolute bottom-10 right-[6%] w-44 opacity-60 -rotate-12 pointer-events-none lf-float" style={{ animationDuration: "13s" }} />

        <div className="relative max-w-5xl mx-auto text-center z-10" data-reveal>
          <span className="text-[10px] tracking-[0.4em] uppercase text-brand-gold">Epilogue</span>
          <h2 className="font-display italic text-5xl md:text-7xl mt-6 leading-[1.05] text-stone-900" data-split>
            The garden remembers everyone who visits.
          </h2>
          <p className="text-stone-600 mt-8 max-w-xl mx-auto leading-relaxed">
            Return often. The flowers bloom differently each time, depending on the season of the soul that opens them.
          </p>
          <div className="mt-12 inline-flex items-center gap-6">
            <a
              href="#worlds"
              onClick={(e) => onNav(e, "worlds")}
              data-magnetic="0.35"
              className="px-8 py-4 rounded-full bg-stone-900 text-brand-cream text-[10px] tracking-[0.3em] uppercase hover:bg-brand-gold transition-colors"
            >
              Wander Again
            </a>
            <a href="#garden" onClick={(e) => onNav(e, "garden")} className="text-[10px] tracking-[0.3em] uppercase border-b border-stone-900 pb-1 hover:text-brand-gold hover:border-brand-gold transition-colors">
              Begin Again
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="studio" className="py-20 px-8 bg-white border-t border-stone-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <div className="text-xs tracking-[0.35em] font-semibold uppercase mb-6">Lumina Flora</div>
            <p className="text-stone-500 text-sm leading-relaxed">
              An experimental digital garden exploring the intersection of organic beauty and cinematic interaction.
            </p>
          </div>
          <div className="flex gap-16 md:gap-24">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Follow</span>
              <a href="#" className="text-sm hover:text-brand-gold transition-colors">Instagram</a>
              <a href="#" className="text-sm hover:text-brand-gold transition-colors">Behance</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Studio</span>
              <a href="#" className="text-sm hover:text-brand-gold transition-colors">Archive</a>
              <a href="#" className="text-sm hover:text-brand-gold transition-colors">Contact</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-stone-100 flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-stone-400">
          <span>© 2026 Lumina Flora</span>
          <span>Site of the Season</span>
        </div>
      </footer>

      {/* ============================================================
          INK BLOOM PORTAL — origin-anchored cinematic world entry.
          A hand-drawn flower blooms from the exact pixel the visitor
          clicked, particles spiral inward like a gravity well, the
          world's name splits into being, and its first line of poetry
          types itself before the world reveals through a petal iris.
         ============================================================ */}
      {transition && (() => {
        const w = transition.world;
        const { x: ox, y: oy } = transition.origin;
        const firstLine = w.quote.split(/[.,—]/)[0].trim();
        return createPortal(
          <div
            className="z-[100] pointer-events-none overflow-hidden"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              ["--ox" as string]: `${ox}px`,
              ["--oy" as string]: `${oy}px`,
              ["--accent" as string]: w.accent,
              ["--accent-soft" as string]: w.accentSoft,
            }}
          >
            {/* 1 — page-suck backdrop: dark base + world tint radiating from origin */}
            <div
              className="absolute inset-0 bg-stone-950"
              style={{ animation: "lf-inkbloom-veil 1.75s cubic-bezier(.7,0,.2,1) both" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at var(--ox) var(--oy), ${w.accent}cc 0%, ${w.accent}55 18%, transparent 55%)`,
                animation: "lf-inkbloom-veil 1.75s cubic-bezier(.7,0,.2,1) both",
                mixBlendMode: "screen",
              }}
            />

            {/* 2 — INK BLOOM SVG: 12 petals unfold from origin */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width="100%"
              height="100%"
              style={{ overflow: "visible" }}
              aria-hidden
            >
              <defs>
                <radialGradient id={`ink-halo-${w.id}`}>
                  <stop offset="0%" stopColor={w.accent} stopOpacity="1" />
                  <stop offset="60%" stopColor={w.accent} stopOpacity=".25" />
                  <stop offset="100%" stopColor={w.accent} stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`ink-petal-${w.id}`} cx="50%" cy="90%" r="60%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="55%" stopColor={w.accent} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={w.accent} stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* halo behind bloom */}
              <circle
                cx={ox}
                cy={oy}
                r="260"
                fill={`url(#ink-halo-${w.id})`}
                style={{ animation: "lf-inkbloom-halo 1.5s ease-out both", transformOrigin: `${ox}px ${oy}px` }}
              />

              {/* 12 petals — inline transforms so the animation always paints */}
              <g style={{ transformOrigin: `${ox}px ${oy}px`, animation: "lf-inkbloom-spin 1.75s cubic-bezier(.7,0,.2,1) both" }}>
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i / 12) * 360;
                  return (
                    <ellipse
                      key={i}
                      cx={ox}
                      cy={oy - 170}
                      rx="80"
                      ry="200"
                      fill={`url(#ink-petal-${w.id})`}
                      style={{
                        transformOrigin: `${ox}px ${oy}px`,
                        transformBox: "fill-box",
                        transform: `rotate(${a}deg) scale(0)`,
                        animation: `lf-inkbloom-petal 1.45s cubic-bezier(.19,1,.22,1) ${i * 45}ms both`,
                        ["--rot" as string]: `${a}deg`,
                        mixBlendMode: "screen" as const,
                      }}
                    />
                  );
                })}
                {/* central pistil */}
                <circle
                  cx={ox}
                  cy={oy}
                  r="40"
                  fill="#fff"
                  style={{
                    transformOrigin: `${ox}px ${oy}px`,
                    animation: "lf-inkbloom-core 1.4s cubic-bezier(.19,1,.22,1) 220ms both",
                  }}
                />
              </g>
            </svg>


            {/* 4 — spiral gravity motes (DOM for perf, per-particle CSS vars) */}
            {Array.from({ length: 32 }).map((_, i) => {
              const ang = (i / 32) * Math.PI * 2;
              const r = 320 + (i % 5) * 60;
              return (
                <span
                  key={i}
                  aria-hidden
                  className="absolute size-1.5 rounded-full"
                  style={{
                    left: `calc(var(--ox) + ${Math.cos(ang) * r}px)`,
                    top: `calc(var(--oy) + ${Math.sin(ang) * r}px)`,
                    background: w.accent,
                    boxShadow: `0 0 12px ${w.accent}, 0 0 4px #fff`,
                    ["--tx" as string]: `${-Math.cos(ang) * r}px`,
                    ["--ty" as string]: `${-Math.sin(ang) * r}px`,
                    animation: `lf-inkbloom-spiral 1.6s cubic-bezier(.6,.02,.4,1) ${(i % 8) * 30}ms both`,
                  }}
                />
              );
            })}

            {/* 5 — world reveal iris: circular clip grows from origin, showing world.image */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: `circle(0px at ${ox}px ${oy}px)`,
                animation: "lf-inkbloom-iris 900ms cubic-bezier(.7,0,.2,1) 900ms forwards",
              }}
            >
              <img src={w.image} alt="" className="w-full h-full object-cover" />
              <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at ${ox}px ${oy}px, transparent 0%, #05040399 80%)` }}
              />
            </div>

            {/* 6 — typographic incantation: chapter · title · first line of the world's poem */}
            <div className="absolute inset-x-0 bottom-[14%] flex flex-col items-center gap-3 px-6 text-center">
              <span
                className="text-[10px] tracking-[0.6em] uppercase text-white/70"
                style={{ animation: "lf-inkbloom-fade 500ms ease-out 300ms both" }}
              >
                {w.chapter} · Opening
              </span>
              <h2
                className="font-display italic text-white text-3xl md:text-5xl leading-none"
                style={{ animation: "lf-inkbloom-fade 800ms cubic-bezier(.19,1,.22,1) 500ms both" }}
              >
                {w.title}
              </h2>
              <p
                className="lf-inkbloom-type text-[11px] md:text-xs tracking-[0.35em] uppercase text-white/60 max-w-lg overflow-hidden whitespace-nowrap border-r border-white/40"
                style={{
                  ["--chars" as string]: `${firstLine.length}ch`,
                  animation: "lf-inkbloom-type 1s steps(40, end) 800ms both, lf-inkbloom-caret .5s step-end 1.8s forwards",
                }}
              >
                {firstLine}
              </p>
              {/* rune ring */}
              <svg width="56" height="56" viewBox="0 0 56 56" className="mt-2 opacity-70" style={{ animation: "lf-inkbloom-fade 500ms ease-out 400ms both" }}>
                <g style={{ transformOrigin: "28px 28px", animation: "lf-inkbloom-rune 3s linear infinite" }}>
                  {Array.from({ length: 8 }).map((_, i) => {
                    const a = (i * Math.PI) / 4;
                    const x = 28 + Math.cos(a) * 20;
                    const y = 28 + Math.sin(a) * 20;
                    return <circle key={i} cx={x} cy={y} r="1.5" fill={w.accent} />;
                  })}
                </g>
                <circle cx="28" cy="28" r="2.5" fill="#fff" />
              </svg>
            </div>
          </div>,
          document.documentElement,
        );
      })()}
    </div>

  );
}

const Portal = memo(function Portal({
  img,
  index,
  title,
  onEnter,
}: {
  img: string;
  index: number;
  title: string;
  onEnter: (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  // Entrance is a pure CSS animation with an inline stagger delay below.

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--px", px.toFixed(3));
    el.style.setProperty("--py", py.toFixed(3));
  };
  const onLeave = () => {
    setHover(false);
    const el = ref.current;
    if (el) { el.style.setProperty("--px", "0"); el.style.setProperty("--py", "0"); }
  };

  const accents = ["#7BE6FF", "#C6A8FF", "#9FC7E8"];
  const accent = accents[index % accents.length];

  return (
    <div ref={wrapRef} className="lf-rise" style={{ animationDelay: `${index * 180}ms` }}>
      <button
        ref={ref}
        onClick={onEnter}
        onMouseEnter={() => setHover(true)}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="lf-portal group relative aspect-[4/5] overflow-hidden rounded-[6px] shadow-[20px_40px_60px_-15px_rgba(28,26,23,0.25)] ring-1 ring-stone-900/5 cursor-pointer w-full block"
        data-flower-target
        style={{ ["--accent" as string]: accent }}
        aria-label={`Open Portal ${index + 1} — ${title}`}
      >
        <div className="lf-portal-3d">
          {/* Layer 1 — distant environment (blur is baked into the img, never animated) */}
          <div className="lf-portal-layer lf-portal-layer--bg">
            <img
              src={img}
              alt=""
              aria-hidden
              loading="lazy" decoding="async"
              className="w-full h-full object-cover scale-110 blur-[3px] brightness-90"
            />
          </div>
          {/* Layer 2 — main flower world */}
          <div className="lf-portal-layer lf-portal-layer--mid">
            <img
              src={img}
              alt="Portal into the Marine flower world"
              loading="lazy" decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Layer 3 — foreground vignette */}
          <div className="lf-portal-layer lf-portal-layer--fg pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/15 to-transparent" />
            {Array.from({ length: 4 }).map((_, k) => (
              <span
                key={k}
                aria-hidden
                className="absolute bottom-0 rounded-full"
                style={{
                  left: `${(k * 17 + index * 11) % 100}%`,
                  width: 3 + (k % 3),
                  height: 3 + (k % 3),
                  background: accent,
                  boxShadow: `0 0 10px ${accent}`,
                  opacity: 0.7,
                  animation: `lf-dust ${10 + k * 2}s linear ${k * 1.1}s infinite`,
                }}
              />
            ))}
          </div>
          <div className="lf-portal-light" />
          <div className="lf-portal-glow rounded-[6px]" />
          <div className="lf-portal-ring" />
        </div>

        <div className="absolute inset-3 rounded-[3px] ring-1 ring-white/15 pointer-events-none z-10" />

        {/* cinematic title (always visible, like a film card) */}
        <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between gap-3 text-white">
          <span className="font-display italic text-2xl md:text-[28px] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,.55)]">
            {title}
          </span>
          <span className="text-[9px] tracking-[0.35em] uppercase opacity-70">Enter →</span>
        </div>

        {/* Enter overlay on hover */}
        <div
          className={`absolute inset-0 z-10 flex flex-col items-center justify-center bg-stone-950/45 backdrop-blur-sm transition-opacity duration-500 ${hover ? "opacity-100" : "opacity-0"}`}
        >
          <span
            className="size-20 rounded-full border flex items-center justify-center mb-5"
            style={{ borderColor: accent, boxShadow: `0 0 24px ${accent}` }}
          >
            <span className="size-2 rounded-full" style={{ background: accent }} />
          </span>
          <span className="text-white text-[10px] tracking-[0.5em] uppercase">Enter World</span>
          <span className="text-white/60 text-[9px] tracking-[0.4em] uppercase mt-2">Marine · Abyssal Rose</span>
        </div>
      </button>
    </div>
  );
});


const WorldCard = memo(function WorldCard({ world, index, onEnter }: { world: World; index: number; onEnter: (w: World, e: React.MouseEvent) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState({ x: 0, y: 0, active: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHover({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
      active: true,
    });
  };

  const offset = index % 2 === 0 ? "" : "md:mt-16";
  const cardPos = index % 2 === 0 ? "-bottom-10 -right-6 md:-right-12" : "-top-10 -left-6 md:-left-12";
  const toneCard =
    world.tone === "dark"
      ? "bg-stone-900 text-brand-cream"
      : world.tone === "gold"
        ? "bg-brand-gold text-white"
        : world.tone === "sky"
          ? "bg-brand-lavender text-stone-900"
          : "bg-white/85 text-stone-900 backdrop-blur-xl";

  return (
    <div
      ref={ref}
      className={`relative group ${offset}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(60px)",
        transition: "opacity 1.2s cubic-bezier(.19,1,.22,1), transform 1.2s cubic-bezier(.19,1,.22,1)",
        transitionDelay: `${(index % 2) * 0.15}s`,
      }}
      onMouseMove={onMove}
      onMouseLeave={() => setHover({ x: 0, y: 0, active: false })}
    >
      <button
        onClick={(e) => onEnter(world, e)}
        className="block relative z-10 aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_40px_80px_-30px_rgba(28,26,23,0.35)] w-full text-left cursor-pointer"
        style={{
          transform: `perspective(1200px) rotateY(${hover.x * 6}deg) rotateX(${-hover.y * 6}deg)`,
          transition: "transform 0.4s ease-out",
        }}
      >
        <img
          src={world.image}
          alt={world.title}
          loading="lazy" decoding="async"
          width={896}
          height={1152}
          className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
          style={{ transform: `scale(1.05) translate(${hover.x * -20}px, ${hover.y * -20}px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
        {/* glow ring on hover */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500"
          style={{
            boxShadow: `inset 0 0 80px ${world.accent}40`,
            opacity: hover.active ? 1 : 0,
          }}
        />
        <div className="absolute top-6 left-6 text-white/80 text-[10px] tracking-[0.4em] uppercase">
          {world.subtitle}
        </div>
        {/* Enter overlay */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-stone-950/45 backdrop-blur-[2px] transition-opacity duration-500 ${hover.active ? "opacity-100" : "opacity-0"}`}
        >
          <span className="size-16 rounded-full border border-white/60 flex items-center justify-center mb-4">
            <span className="size-2 rounded-full bg-white" />
          </span>
          <span className="text-white text-[10px] tracking-[0.5em] uppercase">Enter World</span>
        </div>
      </button>

      <div className={`absolute ${cardPos} z-20 p-7 md:p-9 max-w-xs ring-1 ring-black/5 shadow-2xl rounded-2xl ${toneCard}`}>
        <span className="text-[10px] tracking-[0.4em] font-medium uppercase block mb-3 opacity-80">
          {world.chapter}
        </span>
        <h3 className="font-display text-3xl md:text-4xl italic leading-tight mb-4">{world.title}</h3>
        <p className="text-sm leading-relaxed opacity-80 mb-6">{world.description}</p>
        <button
          onClick={(e) => onEnter(world, e)}
          className={`inline-block text-[10px] tracking-[0.3em] uppercase font-semibold border-b pb-1 transition-all cursor-pointer ${
            world.tone === "dark" || world.tone === "gold"
              ? "border-current hover:opacity-70"
              : "border-stone-900 hover:text-brand-gold hover:border-brand-gold"
          }`}
        >
          Enter World →
        </button>
      </div>
    </div>
  );
});

function FlowerRotor() {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startRot: 0, rot: 0, vel: 0, last: 0, lastT: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      const d = drag.current;
      if (!d.active) {
        d.rot += d.vel;
        d.vel *= 0.94;
        // gentle auto-spin when idle
        if (Math.abs(d.vel) < 0.02) d.rot += 0.05;
        el.style.setProperty("--rot", `${d.rot.toFixed(2)}deg`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current!;
    el.setPointerCapture(e.pointerId);
    drag.current = {
      ...drag.current,
      active: true,
      startX: e.clientX,
      startRot: drag.current.rot,
      vel: 0,
      last: e.clientX,
      lastT: performance.now(),
    };
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const el = ref.current!;
    const next = d.startRot + (e.clientX - d.startX) * 0.6;
    const now = performance.now();
    const dt = Math.max(now - d.lastT, 1);
    d.vel = ((e.clientX - d.last) * 0.6) / dt * 16;
    d.last = e.clientX;
    d.lastT = now;
    d.rot = next;
    el.style.setProperty("--rot", `${next.toFixed(2)}deg`);
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current!;
    try { el.releasePointerCapture(e.pointerId); } catch {}
    drag.current.active = false;
  };

  return (
    <div className="relative">
      <div
        className="absolute -top-40 -left-72 w-[420px] opacity-80 lf-float hidden md:block cam-layer cam-z--far pointer-events-none"
        style={{ animationDuration: "10s" }}
      >
        <img src={petalBack} alt="" className="w-full h-auto lf-bloom" style={{ animationDelay: "0.4s" }} />
      </div>

      <div
        ref={ref}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="lf-rotor relative z-10 w-[72vw] sm:w-[460px] md:w-[560px] aspect-square select-none cam-layer cam-z--near"
        data-flower-target
        style={{ animationDuration: "9s" }}
      >
        <div className="lf-rotor-inner">
          {/* back petal layer */}
          <img
            src={petalBack}
            alt=""
            aria-hidden
            className="lf-bloom-layer lf-bloom-layer--back absolute inset-0 w-full h-full object-contain opacity-70 lf-bloom"
            style={{ transform: "translateZ(-40px) scale(1.08)" }}
          />
          {/* main bloom */}
          <img
            src={heroFlower}
            alt="An enchanted multi-layered peony and orchid bloom dusted with gold"
            className="lf-bloom-layer lf-bloom-layer--main absolute inset-0 w-full h-full object-contain lf-bloom drop-shadow-[0_40px_60px_rgba(179,139,93,0.25)]"
            style={{ transform: "translateZ(20px)" }}
            width={1280}
            height={1280}
            draggable={false}
          />
        </div>
        <div className="absolute inset-0 -z-10 rounded-full bg-brand-gold/20 blur-[140px] lf-shimmer" aria-hidden />
      </div>

    </div>
  );
}
