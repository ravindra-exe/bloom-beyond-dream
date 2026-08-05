import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCameraRig } from "@/hooks/useCameraRig";
import { getWorld, worlds } from "@/lib/worlds";
import { LivingLayer } from "@/components/LivingLayer";

export const Route = createFileRoute("/world/$id")({
  loader: ({ params }) => {
    const world = getWorld(params.id);
    if (!world) throw notFound();
    return { world };
  },
  head: ({ loaderData, params }) => {
    const w = loaderData?.world;
    const title = w ? `${w.title} — Lumina Flora` : "World — Lumina Flora";
    const desc = w?.description ?? "An immersive flower world from Lumina Flora.";
    const url = `/world/${params.id}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: w?.image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: w?.image },
        ...(w ? [] : [{ name: "robots", content: "noindex" }]),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: w
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                name: w.title,
                headline: `${w.chapter} — ${w.title}`,
                description: desc,
                image: w.image,
                inLanguage: "en",
                isPartOf: {
                  "@type": "WebSite",
                  name: "Lumina Flora",
                },
              }),
            },
          ]
        : [],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <div className="text-center glass rounded-3xl px-10 py-12">
        <p className="font-display italic text-4xl text-stone-900">This bloom has not opened yet.</p>
        <Link to="/" className="mt-6 inline-block text-[10px] tracking-[0.4em] uppercase border-b border-stone-900 pb-1">
          Return to the Garden
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <button onClick={reset} className="text-sm underline">Try again</button>
    </div>
  ),
  component: WorldPage,
});

function WorldPage() {
  const { world } = Route.useLoaderData();
  useCameraRig();

  const isDark = world.tone === "dark" || world.tone === "ocean" || world.tone === "gold";
  const textColor = isDark ? "text-white" : "text-stone-900";
  const subtle = isDark ? "text-white/75" : "text-stone-600";
  const glassClass = isDark ? "glass-dark" : "glass";

  const idx = worlds.findIndex((w) => w.id === world.id);
  const next = worlds[(idx + 1) % worlds.length];
  const prev = worlds[(idx - 1 + worlds.length) % worlds.length];

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${textColor} lf-iris-open`}
      style={{ background: world.bgTint }}
    >
      {/* Cinematic full-bleed VIDEO backdrop — the world breathes */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 cam-layer cam-z--far lf-bloom-open">
          <video
            src={world.video}
            poster={world.image}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            className="w-full h-full object-cover"
            style={{ imageRendering: "auto", willChange: "transform" }}
          />
          <div className="absolute inset-0" style={{ background: world.bgTint, opacity: 0.28, mixBlendMode: "soft-light" }} />
          <div className="absolute inset-0 bg-stone-950/10" />
        </div>
        {/* god rays */}
        <div
          className="absolute -top-1/3 left-[15%] w-[50%] h-[160%] blur-3xl"
          style={{
            background: `linear-gradient(180deg, ${world.accent}33, transparent)`,
            animation: "lf-godray 16s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -top-1/3 right-[10%] w-[40%] h-[160%] blur-3xl"
          style={{
            background: `linear-gradient(180deg, ${world.accent}22, transparent)`,
            animation: "lf-godray 22s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Living atmosphere — clouds, birds, dust, pollen, bubbles, embers
          + cursor-reactive butterflies tinted to the world palette */}
      <LivingLayer
        layers={world.living}
        butterflyColors={world.butterflyColors}
        accent={world.accent}
      />


      {/* Glass Top nav */}
      <nav className="fixed top-5 inset-x-4 md:inset-x-10 z-50">
        <div className={`${glassClass} rounded-full px-5 md:px-7 py-3 flex justify-between items-center`}>
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-lg leading-none transition-transform group-hover:-translate-x-1">←</span>
            <span className="text-[10px] tracking-[0.35em] uppercase">Garden</span>
          </Link>
          <span
            className="hidden md:flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase"
          >
            <span
              className="inline-block size-1.5 rounded-full"
              style={{ background: world.accent, boxShadow: `0 0 8px ${world.accent}` }}
            />
            <span className="opacity-90">{world.chapter}</span>
            <span className="opacity-40">·</span>
            <span className="opacity-90">{world.subtitle}</span>
          </span>
          <Link
            to="/world/$id"
            params={{ id: next.id }}
            className="flex items-center gap-3 group"
          >
            <span className="text-[10px] tracking-[0.35em] uppercase">Next</span>
            <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 cam-stage min-h-screen flex items-center px-6 md:px-12 pt-32 pb-20">
        <div className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 cam-layer cam-z--near">
            <span
              className="inline-block text-[10px] tracking-[0.5em] uppercase opacity-90 px-3 py-1 rounded-full"
              style={{ background: `${world.accent}22`, color: world.accent, border: `1px solid ${world.accent}55` }}
            >
              {world.subtitle}
            </span>
            <h1 className="font-display italic text-6xl md:text-8xl leading-[0.95] mt-6" data-split>
              {world.title}
            </h1>
            <p className={`mt-8 max-w-xl text-base md:text-lg leading-relaxed ${subtle} lf-fadeup`} style={{ animationDelay: "0.2s" }}>
              {world.longText}
            </p>

            <div className={`mt-10 ${glassClass} rounded-3xl p-6 md:p-7 max-w-xl lf-fadeup`} style={{ animationDelay: "0.4s" }}>
              <p className="text-[10px] tracking-[0.4em] uppercase opacity-70 mb-3">Field note</p>
              <p className="font-display italic text-xl md:text-2xl leading-snug">
                {world.description}
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 lf-fadeup" style={{ animationDelay: "0.55s" }}>
              <a
                href="#deeper"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("deeper")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                data-magnetic="0.35"
                className="px-8 py-4 rounded-full text-[10px] tracking-[0.3em] uppercase font-medium transition-transform hover:scale-[1.03] cursor-pointer inline-flex items-center gap-3"
                style={{ background: world.accent, color: "#1C1A17", boxShadow: `0 18px 50px -12px ${world.accent}99` }}
              >
                Wander Deeper
                <span className="text-base leading-none">↓</span>
              </a>
              <Link
                to="/world/$id"
                params={{ id: next.id }}
                className={`${glassClass} px-7 py-4 rounded-full text-[10px] tracking-[0.3em] uppercase`}
              >
                Next: {next.title} →
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 cam-layer cam-z--front">
            <div
              className="relative aspect-[3/4] rounded-3xl overflow-hidden group"
              style={{ boxShadow: `0 40px 120px -20px ${world.accent}66` }}
            >
              <video
                src={world.video}
                poster={world.image}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover transition-transform duration-[1.6s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />
              {/* glass plaque */}
              <div className={`absolute bottom-4 left-4 right-4 ${glassClass} rounded-2xl px-5 py-4`}>
                <p className="text-[10px] tracking-[0.4em] uppercase opacity-80" style={{ color: world.accent }}>
                  {world.chapter}
                </p>
                <p className="font-display italic text-lg mt-1">{world.title}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WANDER DEEPER — 3 immersive per-world chapters */}
      <section id="deeper" className="relative z-10 px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-reveal>
            <span
              className="text-[10px] tracking-[0.5em] uppercase"
              style={{ color: world.accent }}
            >
              Wander Deeper · {world.subtitle}
            </span>
            <h2 className="font-display italic text-4xl md:text-6xl mt-4 leading-[1.05]" data-split>
              Three rooms inside the bloom.
            </h2>
          </div>

          <ol className="grid md:grid-cols-3 gap-6 md:gap-8" data-stagger>
            {world.wander.map((c: { label: string; title: string; body: string }, i: number) => (
              <li
                key={c.label}
                className={`${glassClass} relative rounded-3xl p-7 md:p-8 overflow-hidden lf-fadeup`}
                style={{
                  animationDelay: `${0.1 + i * 0.12}s`,
                  borderTop: `2px solid ${world.accent}88`,
                }}
              >
                <div
                  className="absolute -top-16 -right-12 w-44 h-44 rounded-full blur-3xl pointer-events-none"
                  style={{ background: `${world.accent}55` }}
                />
                <span
                  className="relative text-[10px] tracking-[0.4em] uppercase font-semibold"
                  style={{ color: world.accent }}
                >
                  {c.label}
                </span>
                <h3 className="relative font-display italic text-2xl md:text-[26px] leading-snug mt-4">
                  {c.title}
                </h3>
                <p className={`relative mt-4 text-sm md:text-[15px] leading-relaxed ${subtle}`}>
                  {c.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* QUOTE — per-world */}
      <section className="relative z-10 px-6 md:px-12 py-24">
        <div className={`max-w-4xl mx-auto ${glassClass} rounded-[2rem] p-10 md:p-16 text-center`}>
          <span
            className="block text-[40px] font-display leading-none mb-4"
            style={{ color: world.accent }}
            aria-hidden
          >
            “
          </span>
          <p className="font-display italic text-3xl md:text-5xl leading-[1.2]">
            {world.quote}
          </p>
          <p className={`mt-8 text-[10px] tracking-[0.4em] uppercase ${subtle}`}>
            — {world.quoteSource}
          </p>
        </div>
      </section>

      {/* WORLD NAV — fixed grid: Previous · Garden · Next */}
      <section className="relative z-10 px-6 md:px-12 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] tracking-[0.5em] uppercase opacity-70">
              Continue the journey
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Previous */}
            <Link
              to="/world/$id"
              params={{ id: prev.id }}
              className={`${glassClass} group relative rounded-3xl overflow-hidden flex items-center gap-5 p-4 transition-transform hover:-translate-y-1 md:order-1`}
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={prev.image} alt={prev.title} loading="lazy" decoding="async" width={160} height={160} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-[0.4em] uppercase opacity-70 flex items-center gap-2">
                  <span aria-hidden>←</span> Previous
                </p>
                <p className="font-display italic text-xl md:text-2xl mt-1 truncate">{prev.title}</p>
                <p className={`text-[10px] tracking-[0.3em] uppercase mt-1 ${subtle}`}>{prev.chapter}</p>
              </div>
            </Link>

            {/* Return to Garden (center) */}
            <Link
              to="/"
              className={`${glassClass} group relative rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-3 p-6 transition-transform hover:-translate-y-1 md:order-2 text-center`}
              style={{ borderTop: `2px solid ${world.accent}aa` }}
            >
              <span
                className="size-12 rounded-full flex items-center justify-center text-xl"
                style={{ background: `${world.accent}22`, border: `1px solid ${world.accent}66`, color: world.accent }}
              >
                ✦
              </span>
              <p className="text-[10px] tracking-[0.4em] uppercase opacity-80">Return to</p>
              <p className="font-display italic text-2xl md:text-3xl leading-tight">The Garden</p>
            </Link>

            {/* Next */}
            <Link
              to="/world/$id"
              params={{ id: next.id }}
              className={`${glassClass} group relative rounded-3xl overflow-hidden flex items-center gap-5 p-4 transition-transform hover:-translate-y-1 md:order-3 md:flex-row-reverse md:text-right`}
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={next.image} alt={next.title} loading="lazy" decoding="async" width={160} height={160} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-[0.4em] uppercase opacity-70 flex md:justify-end items-center gap-2">
                  Next <span aria-hidden>→</span>
                </p>
                <p className="font-display italic text-xl md:text-2xl mt-1 truncate">{next.title}</p>
                <p className={`text-[10px] tracking-[0.3em] uppercase mt-1 ${subtle}`}>{next.chapter}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
