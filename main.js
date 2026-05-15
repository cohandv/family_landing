/**
 * Fade/slide in member panels when they enter the viewport.
 */
(function () {
  var panels = document.querySelectorAll("[data-member]");
  if (!panels.length || !("IntersectionObserver" in window)) {
    panels.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
  );

  panels.forEach(function (el) {
    observer.observe(el);
  });
})();
