/**
 * Image carousels from images/manifest.json — no setTimeout/setInterval (CSP-safe timers).
 */
window.FamilyCarousel = (function () {
  var INTERVAL_MS = 5000;
  var SWIPE_THRESHOLD = 40;
  var timers = new Map();
  var bindings = new Map();
  var resizeRafId = null;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getSlides(manifest, albumId) {
    if (!manifest || !manifest.albums) return [];
    return manifest.albums[albumId] || [];
  }

  function navButton(className, label, flipped) {
    var path = flipped
      ? '<path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    return (
      '<button type="button" class="carousel__btn ' +
      className +
      '" aria-label="' +
      escapeHtml(label) +
      '">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      path +
      "</svg></button>"
    );
  }

  function render(albumId, altText, options) {
    var opts = options || {};
    var variant = opts.variant || "member";
    var slides = getSlides(window.FAMILY_IMAGE_MANIFEST, albumId);
    var emptyLabel = opts.emptyLabel || "";
    var prevLabel = opts.prevLabel || "Previous photo";
    var nextLabel = opts.nextLabel || "Next photo";

    if (!slides.length) {
      return (
        '<div class="carousel carousel--empty carousel--' +
        escapeHtml(variant) +
        '" data-carousel="' +
        escapeHtml(albumId) +
        '">' +
        '<p class="carousel__empty">' +
        escapeHtml(emptyLabel) +
        "</p></div>"
      );
    }

    var slidesHtml = slides
      .map(function (src, index) {
        var loading = index === 0 && opts.priority ? "eager" : "lazy";
        var fetchPriority =
          index === 0 && opts.priority ? ' fetchpriority="high"' : "";
        return (
          '<img class="carousel__slide' +
          (index === 0 ? " is-active" : "") +
          '" src="' +
          escapeHtml(src) +
          '" alt="' +
          escapeHtml(altText) +
          '" width="640" height="800" loading="' +
          loading +
          '" decoding="async"' +
          fetchPriority +
          " />"
        );
      })
      .join("");

    var controlsHtml = "";
    if (slides.length > 1) {
      controlsHtml =
        navButton("carousel__btn--prev", prevLabel, false) +
        navButton("carousel__btn--next", nextLabel, true);
    }

    var dotsHtml = "";
    if (slides.length > 1) {
      dotsHtml =
        '<div class="carousel__dots" role="tablist" aria-label="' +
        escapeHtml(opts.dotsLabel || "Photos") +
        '">' +
        slides
          .map(function (_, index) {
            return (
              '<button type="button" class="carousel__dot' +
              (index === 0 ? " is-active" : "") +
              '" role="tab" aria-selected="' +
              (index === 0 ? "true" : "false") +
              '" aria-label="' +
              escapeHtml((opts.slideLabel || "Photo") + " " + (index + 1)) +
              '" data-index="' +
              index +
              '"></button>'
            );
          })
          .join("") +
        "</div>";
    }

    return (
      '<div class="carousel carousel--' +
      escapeHtml(variant) +
      '" data-carousel="' +
      escapeHtml(albumId) +
      '" data-interval="' +
      INTERVAL_MS +
      '">' +
      '<div class="carousel__viewport" tabindex="0">' +
      controlsHtml +
      slidesHtml +
      "</div>" +
      dotsHtml +
      "</div>"
    );
  }

  function fitViewportToActiveSlide(viewport) {
    var active = viewport.querySelector(".carousel__slide.is-active");
    if (!active || !active.naturalWidth) return;
    viewport.style.setProperty(
      "--slide-ar",
      active.naturalWidth + " / " + active.naturalHeight
    );
  }

  function refitAllViewports() {
    document.querySelectorAll(".carousel__viewport").forEach(fitViewportToActiveSlide);
  }

  function scheduleRefitAll() {
    if (resizeRafId !== null) return;
    resizeRafId = requestAnimationFrame(function () {
      resizeRafId = null;
      refitAllViewports();
    });
  }

  function destroyAll() {
    timers.forEach(function (entry) {
      entry.stop();
    });
    timers.clear();

    bindings.forEach(function (entry) {
      entry.cleanup();
    });
    bindings.clear();

    if (resizeRafId !== null) {
      cancelAnimationFrame(resizeRafId);
      resizeRafId = null;
    }
  }

  function bindCarousel(el) {
    var viewport = el.querySelector(".carousel__viewport");
    var slides = el.querySelectorAll(".carousel__slide");
    if (!viewport || !slides.length) return;

    var index = 0;
    var interval = parseInt(el.getAttribute("data-interval"), 10) || INTERVAL_MS;
    var dots = el.querySelectorAll(".carousel__dot");
    var prevBtn = el.querySelector(".carousel__btn--prev");
    var nextBtn = el.querySelector(".carousel__btn--next");
    var autoplayRafId = null;
    var autoplayLastTick = 0;
    var touchStartX = null;

    slides.forEach(function (slide) {
      slide.addEventListener("load", function () {
        if (slide.classList.contains("is-active")) {
          fitViewportToActiveSlide(viewport);
        }
      });
    });

    function goTo(nextIndex) {
      slides[index].classList.remove("is-active");
      if (dots.length) {
        dots[index].setAttribute("aria-selected", "false");
        dots[index].classList.remove("is-active");
      }
      index = (nextIndex + slides.length) % slides.length;
      slides[index].classList.add("is-active");
      if (dots.length) {
        dots[index].setAttribute("aria-selected", "true");
        dots[index].classList.add("is-active");
      }
      fitViewportToActiveSlide(viewport);
    }

    fitViewportToActiveSlide(viewport);

    function stopAutoplay() {
      if (autoplayRafId !== null) {
        cancelAnimationFrame(autoplayRafId);
        autoplayRafId = null;
      }
    }

    function autoplayFrame(now) {
      if (now - autoplayLastTick >= interval) {
        autoplayLastTick = now;
        goTo(index + 1);
      }
      autoplayRafId = requestAnimationFrame(autoplayFrame);
    }

    function startAutoplay() {
      stopAutoplay();
      if (prefersReducedMotion() || slides.length <= 1) return;
      autoplayLastTick = performance.now();
      autoplayRafId = requestAnimationFrame(autoplayFrame);
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    function cleanup() {
      stopAutoplay();
    }

    if (slides.length <= 1) {
      bindings.set(el, { cleanup: cleanup });
      return;
    }

    function step(delta) {
      goTo(index + delta);
      restartAutoplay();
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        goTo(parseInt(dot.getAttribute("data-index"), 10));
        restartAutoplay();
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        step(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        step(1);
      });
    }

    viewport.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
    });

    viewport.addEventListener(
      "wheel",
      function (e) {
        var horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        if (!horizontal && !e.shiftKey) return;

        var delta = horizontal ? e.deltaX : e.deltaY;
        if (Math.abs(delta) < 8) return;

        e.preventDefault();
        step(delta > 0 ? 1 : -1);
      },
      { passive: false }
    );

    viewport.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].clientX;
        stopAutoplay();
      },
      { passive: true }
    );

    viewport.addEventListener(
      "touchend",
      function (e) {
        if (touchStartX === null) return;
        var touchEndX = e.changedTouches[0].clientX;
        var diff = touchEndX - touchStartX;
        touchStartX = null;

        if (Math.abs(diff) >= SWIPE_THRESHOLD) {
          step(diff < 0 ? 1 : -1);
        } else {
          startAutoplay();
        }
      },
      { passive: true }
    );

    el.addEventListener("mouseenter", stopAutoplay);
    el.addEventListener("mouseleave", startAutoplay);
    el.addEventListener("focusin", stopAutoplay);
    el.addEventListener("focusout", startAutoplay);

    startAutoplay();
    timers.set(el, { stop: stopAutoplay });
    bindings.set(el, { cleanup: cleanup });
  }

  var resizeListenerBound = false;

  function initAll(root) {
    destroyAll();
    var scope = root || document;
    scope.querySelectorAll(".carousel[data-carousel]").forEach(bindCarousel);

    if (!resizeListenerBound) {
      window.addEventListener("resize", scheduleRefitAll);
      resizeListenerBound = true;
    }
    scheduleRefitAll();
  }

  return {
    render: render,
    initAll: initAll,
    destroyAll: destroyAll,
  };
})();
