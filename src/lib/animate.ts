import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Global site-wide GSAP animation layer.
 *
 * Opt-in via data attributes on any element:
 *   data-reveal            — fades + rises into view on scroll
 *   data-reveal="left"     — slides in from left
 *   data-reveal="right"    — slides in from right
 *   data-reveal="scale"    — scales up + fades in
 *   data-reveal-delay="0.2"— optional start delay in seconds
 *   data-stagger           — children stagger-reveal (fade + rise)
 *   data-parallax="0.2"    — translateY on scroll (multiplier)
 *   data-magnetic          — cursor-follow magnetic hover
 *   data-split             — heading splits into words + rises on view
 *
 * Respects prefers-reduced-motion by no-op'ing.
 */
export function useSiteAnimations() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    const ctx = gsap.context(() => {
      // Reveal on scroll
      const revealEls = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      revealEls.forEach((el) => {
        const mode = el.dataset.reveal || "up";
        const delay = parseFloat(el.dataset.revealDelay || "0");
        const from: gsap.TweenVars = { opacity: 0 };
        if (mode === "left") from.x = -60;
        else if (mode === "right") from.x = 60;
        else if (mode === "scale") from.scale = 0.9;
        else from.y = 40;

        gsap.from(el, {
          ...from,
          duration: 1.1,
          ease: "expo.out",
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        });
      });

      // Stagger children
      const staggerEls = gsap.utils.toArray<HTMLElement>("[data-stagger]");
      staggerEls.forEach((el) => {
        const kids = Array.from(el.children) as HTMLElement[];
        if (!kids.length) return;
        gsap.from(kids, {
          opacity: 0,
          y: 30,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });

      // Word-split heading reveal
      const splitEls = gsap.utils.toArray<HTMLElement>("[data-split]");
      splitEls.forEach((el) => {
        if (el.dataset.splitDone) return;
        el.dataset.splitDone = "1";
        const text = el.textContent || "";
        el.innerHTML = text
          .split(/(\s+)/)
          .map((chunk) =>
            /^\s+$/.test(chunk)
              ? chunk
              : `<span class="lf-split-word" style="display:inline-block;will-change:transform,opacity">${chunk}</span>`,
          )
          .join("");
        const words = el.querySelectorAll<HTMLElement>(".lf-split-word");
        gsap.from(words, {
          yPercent: 110,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        });
      });

      // Parallax
      const parallaxEls = gsap.utils.toArray<HTMLElement>("[data-parallax]");
      parallaxEls.forEach((el) => {
        const mult = parseFloat(el.dataset.parallax || "0.2");
        gsap.to(el, {
          yPercent: -mult * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Magnetic hover
      const magEls = gsap.utils.toArray<HTMLElement>("[data-magnetic]");
      const cleanups: Array<() => void> = [];
      magEls.forEach((el) => {
        const strength = parseFloat(el.dataset.magnetic || "0.3");
        const onMove = (e: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          gsap.to(el, {
            x: (e.clientX - cx) * strength,
            y: (e.clientY - cy) * strength,
            duration: 0.6,
            ease: "power3.out",
          });
        };
        const onLeave = () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "elastic.out(1, 0.4)",
          });
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        });
      });

      return () => cleanups.forEach((c) => c());
    });

    // Refresh after images/fonts load
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 400);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);
}

/** Page-mount fade-in overlay used for cross-route transitions. */
export function playRouteEnter() {
  if (typeof window === "undefined") return;
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReduced) return;
  gsap.fromTo(
    "main, [data-route-root]",
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" },
  );
}
