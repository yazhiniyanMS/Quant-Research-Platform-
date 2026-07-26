/*
  Category filtering for the Work archive and the Writing index.
  Purely presentational — hides non-matching [data-category] items within
  the nearest [data-filter-scope] ancestor (falls back to the whole document).
*/

function initFilterGroup(group) {
  const scope = group.closest("[data-filter-scope]") || document;
  const tabs = Array.from(group.querySelectorAll("[data-filter]"));
  const items = Array.from(scope.querySelectorAll("[data-category]"));
  if (!tabs.length || !items.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const value = tab.dataset.filter;
      tabs.forEach((t) => t.setAttribute("aria-pressed", String(t === tab)));
      items.forEach((item) => {
        const categories = (item.dataset.category || "").split(/\s+/);
        const match = value === "all" || categories.includes(value);
        item.hidden = !match;
      });
    });
  });
}

export function initFilters() {
  document.querySelectorAll("[data-filter-group]").forEach(initFilterGroup);
}
