import { useEffect, useState } from "react";
import heroFlower from "@/assets/hero-flower.png";

export function BloomLoader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }

    let exitTimer = 0;
    const dismiss = () => {
      setExiting(true);
      exitTimer = window.setTimeout(() => setVisible(false), 950);
    };

    if (document.readyState === "complete") {
      exitTimer = window.setTimeout(dismiss, 420);
    } else {
      window.addEventListener("load", dismiss, { once: true });
      exitTimer = window.setTimeout(dismiss, 2600);
    }

    return () => {
      window.removeEventListener("load", dismiss);
      window.clearTimeout(exitTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`lf-loader ${exiting ? "lf-loader--exit" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="lf-loader__wash" aria-hidden />
      <div className="lf-loader__content">
        <div className="lf-loader__bloom">
          <span className="lf-loader__halo" aria-hidden />
          <img src={heroFlower} alt="" aria-hidden />
        </div>
        <span className="lf-loader__eyebrow">Lumina Flora</span>
        <span className="lf-loader__label">Opening the garden</span>
        <span className="sr-only">Loading the enchanted garden</span>
      </div>
    </div>
  );
}
