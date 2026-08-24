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
    initFloatStackCollision();
    initLocationAutocomplete();
    initTripDistanceEstimate();
  });

  /* ---------- Avoid floating WhatsApp button covering the hero's own CTAs ---------- */
  function initFloatStackCollision() {
    var floatStack = document.querySelector(".float-stack");
    var heroCtas = document.querySelector(".hero-ctas");
    if (!floatStack || !heroCtas) return;
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          floatStack.classList.toggle("is-collision-hidden", entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );
    io.observe(heroCtas);
  }

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
      var estimateLine = "";
      var estimateBox = form.querySelector("[data-trip-estimate]");
      if (estimateBox && estimateBox.classList.contains("is-visible") && !estimateBox.classList.contains("is-loading")) {
        var distText = estimateBox.querySelector("[data-estimate-distance]").textContent;
        var durText = estimateBox.querySelector("[data-estimate-duration]").textContent;
        if (distText !== "—" && durText !== "—") {
          estimateLine = "Est. Distance/Time: " + distText + ", " + durText + "\n";
        }
      }

      var msg =
        "Hi InnovaHycrossTaxi, I'd like to book a cab.\n" +
        "Trip type: " + tripType + "\n" +
        "Pickup: " + pickup + "\n" +
        (drop ? "Drop: " + drop + "\n" : "") +
        estimateLine +
        "Date & Time: " + datetime + "\n" +
        "Car type: " + carType + "\n" +
        "My mobile: " + mobile;

      var waLink = buildWaLink(msg);
      var waWindow = window.open(waLink, "_blank");

      var successBox = form.querySelector("[data-booking-success]");
      if (successBox) {
        var textEl = successBox.querySelector("[data-booking-success-text]");
        clearTimeout(successBox._hideTimer);
        if (waWindow) {
          textEl.textContent = "Opening WhatsApp with your trip details…";
          successBox.classList.remove("is-fallback");
          successBox.classList.add("is-shown");
          successBox._hideTimer = setTimeout(function () { successBox.classList.remove("is-shown"); }, 6000);
        } else {
          textEl.innerHTML =
            'Your browser blocked the pop-up — <a href="' + waLink + '" target="_blank" rel="noopener">tap here to continue on WhatsApp</a>, ' +
            'or call <a href="tel:+919650694549">96506-94549</a>.';
          successBox.classList.add("is-fallback", "is-shown"); // stays visible until the user acts
        }
      }
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

  /* =====================================================================
     Location search for Pickup/Drop fields, powered by the Google Places
     "Autocomplete Data API" (the current, non-deprecated API as of 2026 —
     Google retired the older google.maps.places.Autocomplete widget for
     new API keys in March 2025). This renders our own dropdown so it can
     be styled to match the site instead of using Google's default widget.

     SETUP REQUIRED — this feature stays OFF until you complete this:
       1. Create/open a project at https://console.cloud.google.com
       2. Enable billing on that project (Google requires a card on file
          for the Maps Platform, though a monthly free usage credit is
          included — check current pricing at
          https://mapsplatform.google.com/pricing before enabling).
       3. Enable the "Places API (New)" for that project.
       4. Create an API key, then RESTRICT it (Application restrictions ->
          Websites) to innovahycrosstaxi.com and www.innovahycrosstaxi.com
          so it can't be copied and used by someone else on your bill.
       5. Paste that key below, replacing YOUR_GOOGLE_MAPS_API_KEY.
     Until a real key is pasted in, these fields simply work as plain
     text inputs — nothing breaks, no errors, no wasted network calls.
     ===================================================================== */
  var GOOGLE_MAPS_API_KEY = "AIzaSyA71VypwrG3FRTtz768nrLM15dSM-KRzSs";

  function initLocationAutocomplete() {
    var inputs = document.querySelectorAll("[data-location-input]");
    if (!inputs.length) return;
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
      return; // dormant until a real, restricted key is configured above
    }

    var DELHI_CENTER = { lat: 28.6139, lng: 77.209 };
    var mapsLoadPromise = null;
    var AutocompleteSuggestion, AutocompleteSessionToken;
    var sessionToken = null;

    function loadGoogleMaps() {
      if (mapsLoadPromise) return mapsLoadPromise;
      mapsLoadPromise = new Promise(function (resolve, reject) {
        if (window.google && window.google.maps && window.google.maps.importLibrary) {
          resolve();
          return;
        }
        window.__ihtGoogleMapsLoaded = resolve;
        var script = document.createElement("script");
        script.src =
          "https://maps.googleapis.com/maps/api/js?key=" +
          encodeURIComponent(GOOGLE_MAPS_API_KEY) +
          "&libraries=places&loading=async&callback=__ihtGoogleMapsLoaded";
        script.async = true;
        script.onerror = function () { reject(new Error("Google Maps script failed to load")); };
        document.head.appendChild(script);
      });
      return mapsLoadPromise;
    }

    function ensureLibrary() {
      return loadGoogleMaps()
        .then(function () { return google.maps.importLibrary("places"); })
        .then(function (lib) {
          AutocompleteSuggestion = lib.AutocompleteSuggestion;
          AutocompleteSessionToken = lib.AutocompleteSessionToken;
          if (!sessionToken) sessionToken = new AutocompleteSessionToken();
        });
    }

    var debounceTimers = {};

    inputs.forEach(function (input, inputIndex) {
      var wrap = input.closest(".input-wrap");
      var dropdown = wrap ? wrap.querySelector(".location-suggestions") : null;
      if (!dropdown) return;

      var currentSuggestions = [];
      var activeIndex = -1;
      var dropdownId = "location-suggestions-" + inputIndex;
      dropdown.id = dropdownId;
      input.setAttribute("role", "combobox");
      input.setAttribute("aria-autocomplete", "list");
      input.setAttribute("aria-expanded", "false");
      input.setAttribute("aria-controls", dropdownId);

      function closeDropdown() {
        dropdown.classList.remove("is-open");
        dropdown.innerHTML = "";
        currentSuggestions = [];
        activeIndex = -1;
        input.setAttribute("aria-expanded", "false");
      }

      function selectSuggestion(prediction) {
        input.value = prediction.text.text;
        closeDropdown();
        sessionToken = new AutocompleteSessionToken(); // new session per completed search (Google billing boundary)
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }

      function updateActiveState(items) {
        items.forEach(function (it, i) { it.classList.toggle("is-active", i === activeIndex); });
        if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: "nearest" });
      }

      function renderSuggestions(suggestions) {
        currentSuggestions = suggestions;
        activeIndex = -1;
        dropdown.innerHTML = "";
        if (!suggestions.length) {
          var empty = document.createElement("div");
          empty.className = "location-suggestion-empty";
          empty.textContent = "No matching places";
          dropdown.appendChild(empty);
          dropdown.classList.add("is-open");
          input.setAttribute("aria-expanded", "true");
          return;
        }
        suggestions.forEach(function (s, i) {
          var pred = s.placePrediction;
          var item = document.createElement("div");
          item.className = "location-suggestion";
          item.setAttribute("role", "option");
          item.dataset.index = String(i);
          var icon =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
          item.innerHTML = icon + "<span></span>";
          item.querySelector("span").textContent = pred.text.text;
          item.addEventListener("mousedown", function (e) {
            e.preventDefault(); // keep focus on input so blur doesn't close before click registers
            selectSuggestion(pred);
          });
          dropdown.appendChild(item);
        });
        dropdown.classList.add("is-open");
        input.setAttribute("aria-expanded", "true");
      }

      function fetchSuggestions(query) {
        ensureLibrary()
          .then(function () {
            return AutocompleteSuggestion.fetchAutocompleteSuggestions({
              input: query,
              includedRegionCodes: ["in"],
              locationBias: { radius: 500000, center: DELHI_CENTER },
              sessionToken: sessionToken,
            });
          })
          .then(function (result) {
            if (input.value.trim() === query) renderSuggestions(result.suggestions || []);
          })
          .catch(function () {
            closeDropdown(); // fail quiet — field still works as plain text
          });
      }

      input.addEventListener("input", function () {
        var query = input.value.trim();
        clearTimeout(debounceTimers[inputIndex]);
        if (query.length < 3) {
          closeDropdown();
          return;
        }
        debounceTimers[inputIndex] = setTimeout(function () { fetchSuggestions(query); }, 300);
      });

      input.addEventListener("keydown", function (e) {
        if (!dropdown.classList.contains("is-open") || !currentSuggestions.length) return;
        var items = dropdown.querySelectorAll(".location-suggestion");
        if (e.key === "ArrowDown") {
          e.preventDefault();
          activeIndex = Math.min(activeIndex + 1, items.length - 1);
          updateActiveState(items);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          activeIndex = Math.max(activeIndex - 1, 0);
          updateActiveState(items);
        } else if (e.key === "Enter") {
          if (activeIndex >= 0 && currentSuggestions[activeIndex]) {
            e.preventDefault();
            selectSuggestion(currentSuggestions[activeIndex].placePrediction);
          }
        } else if (e.key === "Escape") {
          closeDropdown();
        }
      });

      document.addEventListener("click", function (e) {
        if (wrap && !wrap.contains(e.target)) closeDropdown();
      });
    });
  }

  /* =====================================================================
     Distance + travel time estimate for Pickup -> Drop, powered by the
     Google Routes API (routes.googleapis.com "Compute Routes"). This is
     Google's current API for this — it replaced the older Distance
     Matrix API/Directions API for new projects. It's called directly
     from the browser (no backend needed), same as the location search
     above, and shares the SAME API key — just make sure "Routes API" is
     also enabled alongside "Places API (New)" in Google Cloud Console
     for the key you already configured above.
     Stays dormant (no requests, no errors) until that key is set.
     ===================================================================== */
  function formatEstimateDistance(meters) {
    var km = meters / 1000;
    return (km < 10 ? km.toFixed(1) : Math.round(km)) + " km";
  }

  function formatEstimateDuration(totalSeconds) {
    var totalMin = Math.round(totalSeconds / 60);
    var h = Math.floor(totalMin / 60);
    var m = totalMin % 60;
    if (h <= 0) return m + " min";
    return h + "h" + (m ? " " + m + "m" : "");
  }

  function initTripDistanceEstimate() {
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") return;

    document.querySelectorAll("[data-booking-form]").forEach(function (form) {
      var pickupInput = form.querySelector('[name="pickup"]');
      var dropInput = form.querySelector('[name="drop"]');
      var estimateBox = form.querySelector("[data-trip-estimate]");
      if (!pickupInput || !dropInput || !estimateBox) return;

      var distanceEl = estimateBox.querySelector("[data-estimate-distance]");
      var durationEl = estimateBox.querySelector("[data-estimate-duration]");
      var lastComputedKey = "";
      var requestSeq = 0;

      function tryCompute() {
        var pickup = pickupInput.value.trim();
        var drop = dropInput.value.trim();
        if (!pickup || !drop || dropInput.closest(".field").style.display === "none") {
          estimateBox.classList.remove("is-visible");
          return;
        }
        var key = pickup + "|" + drop;
        if (key === lastComputedKey) return;
        lastComputedKey = key;

        var seq = ++requestSeq;
        estimateBox.classList.add("is-visible", "is-loading");

        fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
          },
          body: JSON.stringify({
            origin: { address: pickup },
            destination: { address: drop },
            travelMode: "DRIVE",
            routingPreference: "TRAFFIC_AWARE",
            units: "METRIC",
          }),
        })
          .then(function (res) {
            if (!res.ok) throw new Error("Routes API error " + res.status);
            return res.json();
          })
          .then(function (data) {
            if (seq !== requestSeq) return; // superseded by a newer request
            var route = data.routes && data.routes[0];
            var seconds = route ? parseInt(route.duration, 10) : NaN;
            var hasUsableData = route && typeof route.distanceMeters === "number" && !isNaN(route.distanceMeters) && !isNaN(seconds);
            if (!hasUsableData) throw new Error("Route data missing or incomplete");
            distanceEl.textContent = formatEstimateDistance(route.distanceMeters);
            durationEl.textContent = formatEstimateDuration(seconds);
            estimateBox.classList.remove("is-loading");
          })
          .catch(function () {
            if (seq !== requestSeq) return;
            estimateBox.classList.remove("is-visible", "is-loading");
            lastComputedKey = ""; // allow a retry once the user changes something
          });
      }

      pickupInput.addEventListener("change", tryCompute);
      dropInput.addEventListener("change", tryCompute);
      pickupInput.addEventListener("blur", tryCompute);
      dropInput.addEventListener("blur", tryCompute);
    });
  }

  window.__ihtCall = CALL_NUMBER;
})();
