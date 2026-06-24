/* ==========================================================
   NoteLab — interactions
   ========================================================== */

(function () {
  "use strict";

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  revealEls.forEach(function (el) {
    const delay = el.getAttribute("data-delay");
    if (delay) el.style.setProperty("--d", delay);
  });

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- logo fallback ----------
     shows the "NL" mark until logo.png is dropped into
     assets/images, so nothing looks broken during setup */
  document.querySelectorAll(".brand-mark, .logo-ring, .final-logo").forEach(function (holder) {
    const img = holder.querySelector("img");
    if (!img) return;
    img.addEventListener("error", function () {
      img.style.display = "none";
    });
  });

  /* ---------- download counter ----------
     This page runs as a plain static file on your own hosting,
     so a real shared count needs a small backend endpoint.
     See assets/README.txt for two simple ways to set that up.
     Until then, it falls back to a counter stored on each
     visitor's own device. */
  const COUNT_KEY = "notelab_download_count";
  const COUNTER_ENDPOINT = ""; // e.g. "https://yourdomain.com/api/count"

  async function getCount() {
    if (COUNTER_ENDPOINT) {
      try {
        const res = await fetch(COUNTER_ENDPOINT);
        const data = await res.json();
        return data.count || 0;
      } catch (e) {
        /* endpoint not reachable yet, fall through to local value */
      }
    }
    return parseInt(localStorage.getItem(COUNT_KEY) || "0", 10);
  }

  async function bumpCount() {
    if (COUNTER_ENDPOINT) {
      try {
        const res = await fetch(COUNTER_ENDPOINT, { method: "POST" });
        const data = await res.json();
        return data.count;
      } catch (e) {
        /* endpoint not reachable yet, fall through to local value */
      }
    }
    const next = parseInt(localStorage.getItem(COUNT_KEY) || "0", 10) + 1;
    localStorage.setItem(COUNT_KEY, String(next));
    return next;
  }

  function formatNum(n) {
    return n.toLocaleString("en-IN");
  }

  function animateCountUp(el, to) {
    const duration = 1000;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatNum(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function refreshDisplay() {
    const el = document.getElementById("downloadCount");
    if (el) el.textContent = "100+";
  }

  async function handleDownloadClick() {
    const newCount = await bumpCount();
    if (newCount === null) return;
    const el = document.getElementById("downloadCount");
    if (el) el.textContent = formatNum(newCount);
  }

  const heroBtn = document.getElementById("heroDownloadBtn");
  const finalBtn = document.getElementById("finalDownloadBtn");
  if (heroBtn) heroBtn.addEventListener("click", handleDownloadClick);
  if (finalBtn) finalBtn.addEventListener("click", handleDownloadClick);

  // counter only starts ticking once it's actually on screen
  const statusSection = document.getElementById("status");
  if (statusSection) {
    const counterObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            refreshDisplay();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    counterObserver.observe(statusSection);
  } else {
    refreshDisplay();
  }
})();
