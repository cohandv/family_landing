(function () {
  var STORAGE_KEY = "family-landing-lang";
  var SUPPORTED = ["en", "es"];

  var SOCIAL_ICONS = {
    linkedin:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    github:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    telegram:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
    facebook:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    instagram:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
  };

  var currentLang = detectLang();
  var memberObserver = null;

  function detectLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    } catch (e) {
      /* ignore */
    }
    var browser = (navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED.indexOf(browser) !== -1 ? browser : "en";
  }

  function t(key) {
    var parts = key.split(".");
    var node = window.FAMILY_I18N[currentLang];
    for (var i = 0; i < parts.length; i++) {
      if (!node || typeof node !== "object") return "";
      node = node[parts[i]];
    }
    return typeof node === "string" ? node : "";
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function carouselOptionsForMember(member) {
    return {
      variant: "member",
      emptyLabel: t("carousel.empty"),
      dotsLabel: t("carousel.dots").replace("{name}", member.name),
      slideLabel: t("carousel.slide"),
      prevLabel: t("carousel.prev"),
      nextLabel: t("carousel.next"),
    };
  }

  function renderFamilyCarousel() {
    var host = document.getElementById("family-carousel-root");
    if (!host || !window.FamilyCarousel) return;

    host.innerHTML = window.FamilyCarousel.render(
      window.FAMILY_CONFIG.albums.about,
      t("about.photoAlt"),
      {
        variant: "hero",
        priority: true,
        emptyLabel: t("carousel.empty"),
        dotsLabel: t("carousel.dotsFamily"),
        slideLabel: t("carousel.slide"),
        prevLabel: t("carousel.prev"),
        nextLabel: t("carousel.next"),
      }
    );
  }

  function renderMembers() {
    var root = document.getElementById("members-root");
    if (!root || !window.FamilyCarousel) return;

    if (memberObserver) {
      memberObserver.disconnect();
      memberObserver = null;
    }

    root.innerHTML = window.FAMILY_MEMBERS.map(function (member) {
      var role = t("members." + member.id + ".role");
      var eyebrow = t("members." + member.id + ".eyebrow");
      var bio = t("members." + member.id + ".bio");
      var alt = t("members." + member.id + ".alt");
      var altClass = member.alternate ? " panel--alt" : "";
      var socialsHtml = renderSocials(member);
      var carouselHtml = window.FamilyCarousel.render(
        member.album || member.id,
        alt,
        carouselOptionsForMember(member)
      );

      return (
        '<article id="' +
        member.id +
        '" class="panel panel--member' +
        altClass +
        '" data-member>' +
        '<div class="panel__inner panel__inner--member">' +
        '<figure class="member-photo">' +
        carouselHtml +
        "</figure>" +
        '<div class="member-copy">' +
        '<p class="eyebrow">' +
        escapeHtml(eyebrow) +
        "</p>" +
        '<h2 class="member-name">' +
        escapeHtml(member.name) +
        "</h2>" +
        '<p class="member-role">' +
        escapeHtml(role) +
        "</p>" +
        '<p class="body-text">' +
        escapeHtml(bio) +
        "</p>" +
        socialsHtml +
        "</div>" +
        "</div>" +
        "</article>"
      );
    }).join("");

    initMemberReveal();
  }

  function initCarousels() {
    if (window.FamilyCarousel) {
      window.FamilyCarousel.initAll(document);
    }
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang;
    document.title = t("meta.title");

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });

    var nav = document.getElementById("site-nav");
    if (nav) {
      nav.setAttribute("aria-label", t("nav.aria"));
      var links = [{ href: "#about", key: "nav.about" }];
      window.FAMILY_MEMBERS.forEach(function (m) {
        links.push({ href: "#" + m.id, label: m.name });
      });
      nav.innerHTML = links
        .map(function (item) {
          var label = item.key ? t(item.key) : item.label;
          return '<a href="' + item.href + '">' + escapeHtml(label) + "</a>";
        })
        .join("");
    }

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === currentLang;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.classList.toggle("is-active", active);
    });

    renderFamilyCarousel();
    renderMembers();
    initCarousels();
  }

  function renderSocials(member) {
    var keys = Object.keys(member.socials || {});
    if (!keys.length) return "";

    var aria = t("social.aria").replace("{name}", member.name);
    var items = keys
      .map(function (key) {
        var href = member.socials[key] || "#";
        var label = t("social." + key) + " — " + member.name;
        var icon = SOCIAL_ICONS[key] || "";
        return (
          '<li><a class="social social--' +
          key +
          '" href="' +
          escapeHtml(href) +
          '" target="_blank" rel="noopener noreferrer" aria-label="' +
          escapeHtml(label) +
          '">' +
          icon +
          "</a></li>"
        );
      })
      .join("");

    return '<ul class="socials" aria-label="' + escapeHtml(aria) + '">' + items + "</ul>";
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore */
    }
    applyTranslations();
  }

  function initLangSwitcher() {
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang"));
      });
    });
  }

  function initMemberReveal() {
    var panels = document.querySelectorAll("[data-member]");
    if (!panels.length) return;

    if (!("IntersectionObserver" in window)) {
      panels.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    memberObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    panels.forEach(function (el) {
      el.classList.remove("is-visible");
      memberObserver.observe(el);
    });
  }

  function getScrollSections() {
    var sections = [document.getElementById("about")];
    window.FAMILY_MEMBERS.forEach(function (member) {
      var el = document.getElementById(member.id);
      if (el) sections.push(el);
    });
    return sections.filter(Boolean);
  }

  function getActiveSectionIndex(sections) {
    var headerOffset =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--header-h")
      ) || 64;
    var marker = window.scrollY + headerOffset + window.innerHeight * 0.35;
    var active = 0;

    sections.forEach(function (section, index) {
      if (section.offsetTop <= marker) active = index;
    });

    return active;
  }

  function scrollToSection(sections, index) {
    var target = sections[Math.max(0, Math.min(index, sections.length - 1))];
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function shouldHandleSectionKey(event) {
    var tag = event.target && event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return false;
    if (event.target && event.target.isContentEditable) return false;
    if (event.ctrlKey || event.metaKey || event.altKey) return false;
    return true;
  }

  function initSectionNavigation() {
    document.addEventListener("keydown", function (event) {
      if (!shouldHandleSectionKey(event)) return;

      var key = event.key;
      var isNext = key === "ArrowDown" || key === "PageDown";
      var isPrev = key === "ArrowUp" || key === "PageUp";

      if (!isNext && !isPrev) return;

      var sections = getScrollSections();
      if (sections.length < 2) return;

      var current = getActiveSectionIndex(sections);
      var next = isNext ? current + 1 : current - 1;

      if (next < 0 || next >= sections.length) return;

      event.preventDefault();
      scrollToSection(sections, next);
    });
  }

  function loadManifest() {
    return fetch("images/manifest.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("manifest missing");
        return res.json();
      })
      .then(function (data) {
        window.FAMILY_IMAGE_MANIFEST = data;
      })
      .catch(function (err) {
        window.FAMILY_IMAGE_MANIFEST = { albums: {} };
        console.error(
          "[family-landing] Could not load images/manifest.json — run: npm run manifest",
          err
        );
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitcher();
    initSectionNavigation();
    loadManifest().then(function () {
      applyTranslations();
    });
  });
})();
