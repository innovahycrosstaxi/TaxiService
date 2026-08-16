/* InnovaHycrossTaxi — shared site behaviour */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "919650694549"; // primary number, with country code, no + or spaces
  var CALL_NUMBER = "+919650694549";

  document.addEventListener("DOMContentLoaded", function () {
    initHeaderScroll();
    initMobileNav();
    initReveal();
    initMeterCounters();
    initTestimonialSlider();
    initFaqAccordion();
    initGalleryFilter();
    initBookingForm();
    initContactForm();
    initYear();
    initTabSwap();
  });

  /* ---------- Sticky header shadow ---------- */
  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function onScroll() {
      if (window.scrollY > 12) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile nav panel ---------- */
  function initMobileNav() {
    var openBtn = document.querySelector("[data-nav-open]");
    var closeBtn = document.querySelector("[data-nav-close]");
    var panel = document.querySelector(".mobile-panel");
    if (!openBtn || !panel) return;
    openBtn.addEventListener("click", function () {
      panel.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
    if (closeBtn) {
      closeBtn.addEventListener("click", closePanel);
    }
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closePanel);
    });
    function closePanel() {
      panel.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Meter / stat counters ---------- */
  function initMeterCounters() {
    var counters = document.querySelectorAll("[data-count-to]");
    if (!counters.length) return;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      var suffix = el.getAttribute("data-suffix") || "";
      var decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
      if (reduceMotion) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
      }
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var val = target * eased;
        el.textContent = val.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Testimonial slider ---------- */
  function initTestimonialSlider() {
    var root = document.querySelector("[data-tsl]");
    if (!root) return;
    var track = root.querySelector(".tsl-slides");
    var slides = root.querySelectorAll(".tsl-slide");
    var dotsWrap = root.querySelector(".tsl-dots");
    var prev = root.querySelector(".tsl-prev");
    var next = root.querySelector(".tsl-next");
    var index = 0;
    var timer;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "tsl-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Show review " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll(".tsl-dot");

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (d, di) { d.classList.toggle("is-active", di === index); });
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { goTo(index + 1); }, 5500);
    }
    if (prev) prev.addEventListener("click", function () { goTo(index - 1); restart(); });
    if (next) next.addEventListener("click", function () { goTo(index + 1); restart(); });
    root.addEventListener("mouseenter", function () { clearInterval(timer); });
    root.addEventListener("mouseleave", restart);
    goTo(0);
    restart();
  }

  /* ---------- FAQ accordion ---------- */
  function initFaqAccordion() {
    var items = document.querySelectorAll(".faq-item");
    if (!items.length) return;
    items.forEach(function (item) {
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      q.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        items.forEach(function (other) {
          other.classList.remove("is-open");
          other.querySelector(".faq-a").style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add("is-open");
          a.style.maxHeight = a.scrollHeight + "px";
        }
      });
    });
  }

  /* ---------- Gallery filter ---------- */
  function initGalleryFilter() {
    var filters = document.querySelectorAll("[data-gfilter]");
    if (!filters.length) return;
    var items = document.querySelectorAll("[data-gcat]");
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filters.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var cat = btn.getAttribute("data-gfilter");
        items.forEach(function (item) {
          var match = cat === "all" || item.getAttribute("data-gcat") === cat;
          item.style.display = match ? "" : "none";
        });
      });
    });
  }

  /* ---------- Helpers ---------- */
  function buildWaLink(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  function getVal(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? el.value.trim() : "";
  }

  /* ---------- Quick booking form -> WhatsApp ---------- */
  function initBookingForm() {
    var form = document.querySelector("[data-booking-form]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var pickup = getVal(form, "pickup");
      var drop = getVal(form, "drop");
      var datetime = getVal(form, "datetime");
      var carType = getVal(form, "carType");
      var mobile = getVal(form, "mobile");
      var tripType = form.getAttribute("data-trip-type") || "Outstation";

      var msg =
        "Hi InnovaHycrossTaxi, I'd like to book a cab.\n" +
        "Trip type: " + tripType + "\n" +
        "Pickup: " + pickup + "\n" +
        (drop ? "Drop: " + drop + "\n" : "") +
        "Date & Time: " + datetime + "\n" +
        "Car type: " + carType + "\n" +
        "My mobile: " + mobile;

      window.open(buildWaLink(msg), "_blank");
    });
  }

  /* ---------- Trip type tabs on booking widget ---------- */
  function initTabSwap() {
    var tabs = document.querySelectorAll("[data-trip-tab]");
    if (!tabs.length) return;
    var dropField = document.querySelector("[data-drop-field]");
    var form = document.querySelector("[data-booking-form]");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        var type = tab.getAttribute("data-trip-tab");
        if (form) form.setAttribute("data-trip-type", type);
        if (dropField) {
          if (type === "Local Rental" || type === "Airport") {
            dropField.style.display = type === "Airport" ? "" : "none";
            var dropInput = dropField.querySelector("input");
            if (dropInput) dropInput.required = type !== "Local Rental";
          } else {
            dropField.style.display = "";
            var di = dropField.querySelector("input");
            if (di) di.required = true;
          }
        }
      });
    });
  }

  /* ---------- Contact / inquiry form -> WhatsApp ---------- */
  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;
    var success = document.querySelector("[data-form-success]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var name = getVal(form, "name");
      var phone = getVal(form, "phone");
      var email = getVal(form, "email");
      var service = getVal(form, "service");
      var message = getVal(form, "message");

      var msg =
        "Hi InnovaHycrossTaxi, I have an inquiry.\n" +
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        (email ? "Email: " + email + "\n" : "") +
        (service ? "Service: " + service + "\n" : "") +
        "Message: " + message;

      window.open(buildWaLink(msg), "_blank");
      if (success) {
        success.classList.add("is-shown");
        form.reset();
        setTimeout(function () { success.classList.remove("is-shown"); }, 6000);
      }
    });
  }

  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  window.__ihtCall = CALL_NUMBER;
})();
