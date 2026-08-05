import { useEffect } from "react";

/**
 * Global camera rig.
 *
 * Tracks scroll + mouse + touch as raw inputs, smoothly lerps them every
 * animation frame, and exposes them as CSS custom properties on
 * `documentElement`:
 *   --cam-mx / --cam-my : -1..1, smoothed pointer offset from center
 *   --cam-sy            : 0..N, smoothed scroll progress in viewport heights
 *   --cam-tilt          : pointer-driven tilt in degrees (-6..6)
 *
 * Components can then use these in transforms without re-rendering React,
 * keeping the experience pinned at 60fps.
 */
export function useCameraRig() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const state = { mx: 0, my: 0, sy: 0 };
    const target = { mx: 0, my: 0, sy: 0 };

    const onPointer = (x: number, y: number) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      target.mx = (x - w / 2) / (w / 2);
      target.my = (y - h / 2) / (h / 2);
    };
    const onMouse = (e: MouseEvent) => onPointer(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onPointer(t.clientX, t.clientY);
    };
    const onScroll = () => {
      target.sy = window.scrollY / Math.max(window.innerHeight, 1);
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Throttle to display refresh — 90fps friendly, never busier than vsync.
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      // hard cap minimum frame budget so we don't burn CPU on >120hz panels
      if (t - last < 8) return;
      last = t;
      // idle when the tab is hidden — no work, no battery drain
      if (document.hidden) return;
      // critically-damped style lerp
      state.mx += (target.mx - state.mx) * 0.12;
      state.my += (target.my - state.my) * 0.12;
      state.sy += (target.sy - state.sy) * 0.16;

      root.style.setProperty("--cam-mx", state.mx.toFixed(4));
      root.style.setProperty("--cam-my", state.my.toFixed(4));
      root.style.setProperty("--cam-sy", state.sy.toFixed(4));
      root.style.setProperty("--cam-tilt", (state.mx * 4).toFixed(3));
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}

