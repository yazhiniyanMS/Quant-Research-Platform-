/*
  Navigation behavior: mobile menu open/close, active-link marking,
  and a restrained sticky-header scroll response (border on scroll,
  hide when scrolling down past the fold, reappear on scroll up).
*/

function markActiveLink() {
  const path = window.location.pathname.replace(/\/index\.html$/, "/");
  const normalizedPath = path === "" ? "/" : path;

  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const linkPath = new URL(link.href).pathname.replace(/\/index\.html$/, "/");
    const isHome =
      (normalizedPath === "/" || normalizedPath.endsWith("/index.html")) &&
      (linkPath === "/" || linkPath.endsWith("/index.html"));
    const isMatch = isHome || linkPath === normalizedPath;
    if (isMatch) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function initMobileMenu() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-mobile-nav]");
  if (!toggle || !panel) return;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    panel.setAttribute("data-open", "false");
    document.body.style.overflow = "";
  };

  const open = () => {
    toggle.setAttribute("aria-expanded", "true");
    panel.setAttribute("data-open", "true");
    document.body.style.overflow = "hidden";
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? close() : open();
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  // Collapse the mobile panel if the viewport grows into the desktop layout.
  const desktopQuery = window.matchMedia("(min-width: 860px)");
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) close();
  });
}

function initScrollResponse() {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    header.setAttribute("data-scrolled", y > 8 ? "true" : "false");

    const scrollingDown = y > lastY && y > 120;
    header.setAttribute("data-hidden", scrollingDown ? "true" : "false");

    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
}

export function initNavigation() {
  markActiveLink();
  initMobileMenu();
  initScrollResponse();
}
