/*
  Reveal-on-scroll for elements marked [data-reveal]. Pure CSS handles the
  actual transition (see css/animations.css); this just flips an attribute
  once an element crosses into the viewport, and disconnects afterward.
*/

export function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.setAttribute("data-revealed", "true"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-revealed", "true");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el, index) => {
    el.style.setProperty("--reveal-index", index % 6);
    observer.observe(el);
  });
}
