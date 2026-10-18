/*
  Blocking, render-before-paint script. Must load synchronously in <head>,
  before any stylesheet, so the correct theme applies with zero flash.
  Kept deliberately tiny and dependency-free.
*/
(function () {
  var STORAGE_KEY = "yz-theme";
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (e) {
    /* localStorage unavailable (privacy mode, etc.) — system preference via CSS media query still applies */
  }
})();
