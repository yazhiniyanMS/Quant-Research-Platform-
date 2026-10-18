/*
  Theme toggle: cycles light/dark, persists explicit choice to localStorage,
  and keeps the toggle icon + aria-label in sync. The initial (pre-paint)
  theme value is set by js/theme-init.js; this module owns interaction.
*/

const STORAGE_KEY = "yz-theme";
const root = document.documentElement;

function currentTheme() {
  const explicit = root.getAttribute("data-theme");
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme, persist) {
  root.setAttribute("data-theme", theme);
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* ignore write failures */
    }
  }
  syncToggleLabel(theme);
}

function syncToggleLabel(theme) {
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    const next = theme === "dark" ? "light" : "dark";
    btn.setAttribute("aria-label", `Switch to ${next} mode`);
  });
}

export function initTheme() {
  syncToggleLabel(currentTheme());

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next, true);
    });
  });

  // If the user hasn't made an explicit choice, keep following the OS setting live.
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      let hasExplicitChoice = false;
      try {
        hasExplicitChoice = Boolean(localStorage.getItem(STORAGE_KEY));
      } catch (e) {
        hasExplicitChoice = false;
      }
      if (!hasExplicitChoice) {
        applyTheme(event.matches ? "dark" : "light", false);
      }
    });
}
