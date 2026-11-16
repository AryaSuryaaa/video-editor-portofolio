(function () {
  "use strict";

  var M = window.Motion || null;
  var root = document.documentElement;
  var body = document.body;
  var cfg = window.SITE_CONFIG || {};
  var I18N = window.I18N || {};
  var FPS = cfg.fps || 25;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canAnimate = !!M && !reduceMotion;
  var desktopMQ = window.matchMedia("(min-width: 960px)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  root.classList.add("anim-started");
  if (!canAnimate) root.classList.remove("anim-ready", "show-leader");

  var CATEGORIES = ["commercial", "music", "wedding", "social"];
  var EASE_OUT = [0.22, 1, 0.36, 1];

  var state = {
    lang: initLang(),
    raw: null,
    settings: {},
    filter: "all",
    introDone: false,
    workRevealed: false,
    statsCounted: false,
    words: [],
    litCount: -1,
    tlStops: [],
    processDist: 0,
    lastY: 0,
    tcOffset: 0
  };

  // ---------- helpers ----------
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function readStore(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safeUrl(u) { u = String(u || "").trim(); return /^(https?:|mailto:)/i.test(u) ? u : ""; }
  function safeColor(c, fallback) { c = String(c || "").trim(); return /^#[0-9a-f]{3,8}$/i.test(c) ? c : fallback; }
  function splitList(s) { return String(s || "").split("|").map(function (x) { return x.trim(); }).filter(Boolean); }
  function truthy(v) { return /^(true|ya|yes|1|x)$/i.test(String(v || "").trim()); }
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function formatTC(totalFrames) {
    totalFrames = Math.max(0, Math.floor(totalFrames));
    var f = totalFrames % FPS;
    var s = Math.floor(totalFrames / FPS);
    return pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60) + ":" + pad(f);
  }
  function debounce(fn, ms) {
    var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  function initLang() {
    var p = new URLSearchParams(location.search).get("lang");
    if (p === "id" || p === "en") return p;
    var s = readStore("vep-lang");
    if (s === "id" || s === "en") return s;
    var nav = (navigator.language || "").toLowerCase();
    if (nav && nav.indexOf("id") !== 0 && nav.indexOf("ms") !== 0) return "en";
    return cfg.defaultLang || "id";
  }

  function ui(key, vars) {
    var dict = I18N[state.lang] || {};
    var s = dict[key] != null ? dict[key] : ((I18N.id && I18N.id[key]) || key);
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  }
  function L(obj, field) {
    if (!obj) return "";
    return obj[field + "_" + state.lang] || obj[field + "_id"] || obj[field] || "";
  }
  function setting(key) {
    var row = state.settings[key];
    if (!row) return "";
    return row["value_" + state.lang] || row.value_id || row.value || "";
  }
  function catLabel(cat) {
    var k = "cat." + cat;
    var label = ui(k);
    return label === k ? cat.charAt(0).toUpperCase() + cat.slice(1) : label;
  }
  function waHref(message) {
    var num = setting("whatsapp").replace(/\D/g, "");
    if (!num) return "";
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(message);
  }

  // ---------- render ----------
  function renderAll() {
    var raw = state.raw;
    state.settings = {};
    (raw.settings || []).forEach(function (row) { if (row.key) state.settings[row.key.trim()] = row; });

    root.lang = state.lang;
    var title = setting("seo_title") || setting("name");
    if (title) document.title = title;
    var desc = setting("seo_description");
    if (desc) {
      var meta = $('meta[name="description"]');
      if (meta) meta.setAttribute("content", desc);
    }

    $$("[data-i18n]").forEach(function (el) {
      var text = ui(el.getAttribute("data-i18n"));
      if (el.classList.contains("section-title")) {
        el.innerHTML = '<span class="reveal-line"><span>' + esc(text) + "</span></span>";
      } else {
        el.textContent = text;
      }
    });
    $$("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", ui(el.getAttribute("data-i18n-aria"))); });
    $$("[data-bind]").forEach(function (el) { el.textContent = setting(el.getAttribute("data-bind")); });
    $$(".lang-switch button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang)); });

    renderHeroTitle();
    renderTools();
    renderWork();
    renderAbout();
    renderServices();
    renderProcess();
    renderPricing();
    renderQuotes();
    renderFaq();
    renderContact();
    renderFooter();
    buildTimeline();
  }

  function renderHeroTitle() {
    var lines = splitList(setting("hero_title"));
    var h1 = $("#heroTitle");
    h1.setAttribute("aria-label", lines.join(" "));
    h1.innerHTML = lines.map(function (l) { return '<span class="line" aria-hidden="true">' + esc(l) + "</span>"; }).join("");
  }

  function renderTools() {
    var tools = splitList(setting("tools"));
    var group = tools.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
    $("#toolsTrack").innerHTML =
      '<div class="tools-group">' + group + "</div>" +
      '<div class="tools-group" aria-hidden="true">' + group + "</div>";
  }

  function renderWork() {
    var projects = state.raw.projects || [];
    var cats = [];
    CATEGORIES.forEach(function (c) {
      if (projects.some(function (p) { return (p.category || "").toLowerCase() === c; })) cats.push(c);
    });
    projects.forEach(function (p) {
      var c = (p.category || "").toLowerCase();
      if (c && cats.indexOf(c) === -1) cats.push(c);
    });
    if (state.filter !== "all" && cats.indexOf(state.filter) === -1) state.filter = "all";

    $("#workFilters").innerHTML = ["all"].concat(cats).map(function (c) {
      var known = c === "all" || CATEGORIES.indexOf(c) !== -1;
      var style = known ? "" : ' style="--track: var(--dim)"';
      return '<button type="button" class="filter" data-cat="' + esc(c) + '"' + style +
        ' aria-pressed="' + (state.filter === c) + '">' + esc(c === "all" ? ui("work.all") : catLabel(c)) + "</button>";
    }).join("");
    $$("#workFilters .filter").forEach(function (b) {
      var c = b.dataset.cat;
      if (c !== "all" && CATEGORIES.indexOf(c) !== -1) b.style.setProperty("--track", "var(--c-" + c + ")");
    });

    $("#workGrid").innerHTML = projects.map(function (p, i) {
      var cat = (p.category || "").toLowerCase();
      var title = L(p, "title");
      var img = safeUrl(p.thumbnail);
      var style = "--c1:" + safeColor(p.color1, "#6E8BFF") + ";--c2:" + safeColor(p.color2, "#23252B");
      if (CATEGORIES.indexOf(cat) === -1) style += ";--track: var(--dim)";
      var sub = [p.client, p.year].filter(Boolean).join(", ");
      return '<article class="clip' + (truthy(p.featured) ? " is-featured" : "") + '" data-cat="' + esc(cat) + '" data-index="' + i + '" style="' + style + '">' +
        '<button class="clip-hit" type="button" aria-label="' + esc(ui("work.play") + ": " + title + (p.client ? " (" + p.client + ")" : "")) + '">' +
          '<span class="clip-poster' + (img ? " has-img" : "") + '">' +
            (img ? '<img src="' + esc(img) + '" alt="" loading="lazy" decoding="async">' : "") +
            '<span class="clip-word" aria-hidden="true">' + esc(title) + "</span>" +
            '<span class="clip-scrubline" aria-hidden="true"></span>' +
            (p.duration ? '<span class="clip-dur">' + esc(p.duration) + "</span>" : "") +
            '<span class="clip-track" aria-hidden="true"></span>' +
          "</span>" +
        "</button>" +
        '<div class="clip-meta"><div><h3 class="clip-title">' + esc(title) + '</h3><p class="clip-sub">' + esc(sub) + "</p></div>" +
        '<span class="clip-cat">' + esc(catLabel(cat)) + "</span></div>" +
      "</article>";
    }).join("");

    $$("#workGrid img").forEach(function (img) {
      img.addEventListener("error", function () {
        var poster = img.parentNode;
        poster.classList.remove("has-img");
        img.remove();
      }, { once: true });
    });

    applyFilter(state.filter, false);
    if (!state.workRevealed) revealWork();
  }

  function applyFilter(cat, animateIt) {
    state.filter = cat;
    var cards = $$("#workGrid .clip");
    var first = animateIt && canAnimate ? cards.map(function (c) { return c.hidden ? null : c.getBoundingClientRect(); }) : null;
    var shown = 0;
    cards.forEach(function (c) {
      var show = cat === "all" || c.dataset.cat === cat;
      c.hidden = !show;
      if (show) shown++;
    });
    $("#workEmpty").hidden = shown > 0;
    $$("#workFilters .filter").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.cat === cat)); });

    if (!first) return;
    cards.forEach(function (c, i) {
      if (c.hidden) return;
      var last = c.getBoundingClientRect();
      var f = first[i];
      if (f) {
        var dx = f.left - last.left, dy = f.top - last.top;
        if (dx || dy) M.animate(c, { x: [dx, 0], y: [dy, 0] }, { type: "spring", visualDuration: 0.45, bounce: 0.12 });
      } else {
        M.animate(c, { opacity: [0, 1], scale: [0.94, 1] }, { duration: 0.32, ease: EASE_OUT });
      }
    });
    layoutTimeline();
  }

  function revealWork() {
    if (!canAnimate) { state.workRevealed = true; return; }
    state.workRevealed = true;
    var cards = $$("#workGrid .clip");
    cards.forEach(function (card) {
      var poster = $(".clip-poster", card);
      var meta = $(".clip-meta", card);
      poster.style.clipPath = "inset(0 100% 0 0)";
      meta.style.opacity = "0";
    });
    cards.forEach(function (card, i) {
      var stop = M.inView(card, function () {
        stop();
        var poster = $(".clip-poster", card);
        var meta = $(".clip-meta", card);
        var delay = (i % 3) * 0.09;
        M.animate(poster, { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] }, { duration: 0.75, delay: delay, ease: [0.65, 0, 0.35, 1] })
          .then(function () { poster.style.clipPath = ""; });
        M.animate(meta, { opacity: [0, 1], y: [10, 0] }, { duration: 0.5, delay: delay + 0.35, ease: EASE_OUT });
      }, { amount: 0.25 });
    });
  }

  function renderAbout() {
    var text = setting("about_body");
    var words = text.split(/\s+/).filter(Boolean);
    var el = $("#aboutBody");
    el.innerHTML = words.map(function (w) { return '<span class="w">' + esc(w) + "</span>"; }).join(" ");
    state.words = $$(".w", el);
    state.litCount = -1;

    var stats = [1, 2, 3].map(function (n) {
      return { value: setting("stat" + n + "_value"), label: setting("stat" + n + "_label") };
    }).filter(function (s) { return s.value; });
    $("#stats").innerHTML = stats.map(function (s) {
      return '<li><span class="stat-value" data-value="' + esc(s.value) + '">' + esc(s.value) + '</span><span class="stat-label">' + esc(s.label) + "</span></li>";
    }).join("");
    $("#stats").hidden = !stats.length;
    if (!state.statsCounted) countStats();
  }

  function countStats() {
    if (!canAnimate) { state.statsCounted = true; return; }
    var list = $("#stats");
    var stop = M.inView(list, function () {
      stop();
      state.statsCounted = true;
      $$(".stat-value", list).forEach(function (el, i) {
        var raw = el.dataset.value;
        var m = raw.match(/^(\D*)(\d[\d.,]*)(.*)$/);
        if (!m) return;
        var target = parseInt(m[2].replace(/[.,]/g, ""), 10);
        M.animate(0, target, {
          duration: 1.4, delay: i * 0.12, ease: EASE_OUT,
          onUpdate: function (v) { el.textContent = m[1] + Math.round(v) + m[3]; }
        });
      });
    }, { amount: 0.6 });
  }

  function paintAbout(p) {
    var words = state.words;
    if (!words.length) return;
    var n = Math.round(p * words.length);
    if (n === state.litCount) return;
    var from = state.litCount < 0 ? 0 : Math.min(n, state.litCount);
    var to = state.litCount < 0 ? words.length : Math.max(n, state.litCount);
    for (var i = from; i < to; i++) words[i].classList.toggle("is-lit", i < n);
    state.litCount = n;
  }

  function renderServices() {
    $("#serviceList").innerHTML = (state.raw.services || []).map(function (s) {
      var inc = splitList(L(s, "includes")).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
      var turnaround = L(s, "turnaround");
      return '<li class="service">' +
        '<h3 class="service-title">' + esc(L(s, "title")) + "</h3>" +
        "<div><p class=\"service-desc\">" + esc(L(s, "desc")) + "</p>" + (inc ? '<ul class="service-includes">' + inc + "</ul>" : "") + "</div>" +
        '<div class="service-price">' +
          (s.price_from ? "<small>" + esc(ui("services.from")) + "</small><strong>" + esc(s.price_from) + "</strong>" : "") +
          (turnaround ? "<small>" + esc(ui("services.turnaround") + " " + turnaround) + "</small>" : "") +
        "</div></li>";
    }).join("");
  }

  function renderProcess() {
    var colors = ["var(--c-commercial)", "var(--c-music)", "var(--c-wedding)", "var(--c-social)"];
    $("#processTrack").innerHTML = (state.raw.process || []).map(function (s, i) {
      var num = s.step || String(i + 1);
      return '<li class="step" style="--step-color:' + colors[i % colors.length] + '">' +
        '<span class="step-num" aria-hidden="true">' + esc(pad(parseInt(num, 10) || i + 1)) + "</span>" +
        '<h3 class="step-title">' + esc(L(s, "title")) + "</h3>" +
        '<p class="step-desc">' + esc(L(s, "desc")) + "</p>" +
        (s.days ? '<span class="step-days">' + esc(s.days + " " + ui("process.days")) + "</span>" : "") +
        "</li>";
    }).join("");
    setupProcess();
  }

  var CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function renderPricing() {
    var name = setting("name");
    $("#priceGrid").innerHTML = (state.raw.pricing || []).map(function (p) {
      var pkg = L(p, "name");
      var hi = truthy(p.highlight);
      var href = waHref(ui("wa.package", { name: name, pkg: pkg })) || "#contact";
      var feats = splitList(L(p, "features")).map(function (f) { return "<li>" + CHECK + "<span>" + esc(f) + "</span></li>"; }).join("");
      return '<article class="price' + (hi ? " is-highlight" : "") + '">' +
        '<div class="price-top"><h3 class="price-name">' + esc(pkg) + "</h3>" + (hi ? '<span class="price-flag">' + esc(ui("pricing.popular")) + "</span>" : "") + "</div>" +
        (L(p, "desc") ? '<p class="price-desc">' + esc(L(p, "desc")) + "</p>" : "") +
        '<p class="price-amount"><strong>' + esc(p.price) + "</strong><span>" + esc(L(p, "unit")) + "</span></p>" +
        '<ul class="price-features">' + feats + "</ul>" +
        '<a class="btn ' + (hi ? "btn-primary" : "btn-ghost") + '" href="' + esc(href) + '"' + (href.indexOf("http") === 0 ? ' target="_blank" rel="noopener"' : "") + ">" + esc(ui("pricing.choose")) + "</a>" +
        "</article>";
    }).join("");
  }

  function renderQuotes() {
    $("#quotes").innerHTML = (state.raw.testimonials || []).map(function (q) {
      return '<figure class="quote"><blockquote>' + esc(L(q, "quote")) + "</blockquote>" +
        "<figcaption><strong>" + esc(q.name) + "</strong><span>" + esc(L(q, "role")) + "</span></figcaption></figure>";
    }).join("");
  }

  function renderFaq() {
    $("#faqList").innerHTML = (state.raw.faq || []).map(function (f) {
      return '<details class="faq-item"><summary>' + esc(L(f, "q")) + "</summary><p>" + esc(L(f, "a")) + "</p></details>";
    }).join("");
  }

  function renderContact() {
    var name = setting("name");
    var wa = $("#waLink");
    var href = waHref(ui("wa.general", { name: name }));
    wa.hidden = !href;
    if (href) wa.href = href;
    var email = setting("email");
    var mail = $("#emailLink");
    mail.hidden = !email;
    if (email) mail.href = "mailto:" + email;

    var socials = [["instagram", "Instagram"], ["youtube", "YouTube"]].map(function (s) {
      var url = safeUrl(setting(s[0]));
      return url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + s[1] + "</a>" : "";
    }).join("");
    $("#socialLinks").innerHTML = socials;
  }

  function renderFooter() {
    $("#footerYear").textContent = "© " + new Date().getFullYear();
    var demo = cfg.demo || {};
    var badge = $("#demoBadge");
    var credit = $("#footerCredit");
    if (demo.show && demo.creatorName) {
      var url = safeUrl(demo.creatorUrl) || "#";
      badge.hidden = false;
      badge.href = url;
      $("#demoBadgeCta").textContent = ui("badge.cta", { creator: demo.creatorName });
      credit.innerHTML = esc(ui("footer.credit", { creator: "\u0000" })).replace("\u0000",
        '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(demo.creatorName) + "</a>");
    } else {
      badge.hidden = true;
      credit.textContent = "";
      $$(".footer-demo").forEach(function (el) { el.hidden = true; });
    }
  }

  // ---------- timeline ----------
  var TL_LABELS = {
    hero: "tl.hero", work: "nav.work", about: "nav.about", services: "nav.services", process: "tl.process",
    pricing: "nav.pricing", testimonials: "tl.testimonials", faq: "tl.faq", contact: "nav.contact"
  };
  var TL_COLORS = ["var(--c-music)", "var(--c-commercial)", "var(--c-social)", "var(--c-commercial)", "var(--c-wedding)",
    "var(--c-commercial)", "var(--c-social)", "var(--c-wedding)", "var(--c-music)"];

  function buildTimeline() {
    var secs = $$("[data-tl]");
    $("#tlTrack").innerHTML = secs.map(function (sec, i) {
      var key = sec.getAttribute("data-tl");
      var label = ui(TL_LABELS[key] || key);
      return '<button type="button" class="tl-clip" data-target="' + esc(sec.id) + '" style="--clip-color:' + TL_COLORS[i % TL_COLORS.length] + '" aria-label="' + esc(label) + '"><span>' + esc(label) + "</span></button>";
    }).join("");
    layoutTimeline();
  }

  function layoutTimeline() {
    var vh = window.innerHeight;
    var max = Math.max(1, root.scrollHeight - vh);
    var clips = $$("#tlTrack .tl-clip");
    var stops = clips.map(function (clip) {
      var sec = document.getElementById(clip.dataset.target);
      var top = sec ? sec.getBoundingClientRect().top + window.scrollY : 0;
      return { el: clip, id: clip.dataset.target, start: clamp((top - vh * 0.4) / max, 0, 1) };
    });
    if (stops.length) stops[0].start = 0;
    stops.forEach(function (s, i) {
      var end = i + 1 < stops.length ? stops[i + 1].start : 1;
      s.el.style.left = (s.start * 100) + "%";
      s.el.style.width = "calc(" + Math.max(0, (end - s.start) * 100) + "% - 3px)";
    });
    state.tlStops = stops;
    update();
  }

  // ---------- process (horizontal) ----------
  function setupProcess() {
    var sec = $("#process");
    var track = $("#processTrack");
    track.style.transform = "";
    var on = canAnimate && desktopMQ.matches;
    sec.classList.toggle("is-horizontal", on);
    if (!on) { sec.style.removeProperty("--process-h"); state.processDist = 0; return; }
    var dist = Math.max(0, track.scrollWidth - root.clientWidth);
    state.processDist = dist;
    sec.style.setProperty("--process-h", (window.innerHeight + dist) + "px");
  }

  // ---------- scroll loop ----------
  var ticking = false;
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  function update() {
    ticking = false;
    var y = window.scrollY;
    var vh = window.innerHeight;
    var max = Math.max(1, root.scrollHeight - vh);
    var p = clamp(y / max, 0, 1);

    var header = $(".site-header");
    header.classList.toggle("is-scrolled", y > 12);
    var menuOpen = body.classList.contains("menu-open");
    if (!menuOpen) {
      if (y > state.lastY + 6 && y > 240) { header.classList.add("is-hidden"); root.classList.add("header-hidden"); }
      else if (y < state.lastY - 6 || y <= 240) { header.classList.remove("is-hidden"); root.classList.remove("header-hidden"); }
    }
    state.lastY = y;

    $("#tlPlayhead").style.left = (p * 100) + "%";
    $("#tlTc").textContent = formatTC(p * (cfg.timelineSeconds || 90) * FPS);
    var activeId = null;
    state.tlStops.forEach(function (s) { if (p + 0.0001 >= s.start) activeId = s.id; });
    var passed = true;
    state.tlStops.forEach(function (s) {
      var active = s.id === activeId;
      if (active) passed = false;
      s.el.classList.toggle("is-active", active);
      s.el.classList.toggle("is-past", passed && !active);
    });
    $$(".main-nav a").forEach(function (a) {
      a.classList.toggle("is-current", a.getAttribute("href") === "#" + activeId);
    });

    var about = $("#aboutBody");
    if (about && state.words.length) {
      if (!canAnimate) paintAbout(1);
      else {
        var r = about.getBoundingClientRect();
        paintAbout(clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1));
      }
    }

    if (state.processDist) {
      var sec = $("#process");
      var sr = sec.getBoundingClientRect();
      var pp = clamp(-sr.top / Math.max(1, sr.height - vh), 0, 1);
      $("#processTrack").style.transform = "translate3d(" + (-state.processDist * pp).toFixed(1) + "px,0,0)";
    }
  }

  // ---------- section title reveals ----------
  function setupTitleReveals() {
    if (!canAnimate) return;
    $$(".section-title").forEach(function (title) {
      var stop = M.inView(title, function () {
        stop();
        var span = $(".reveal-line > span", title);
        if (!span) { title.classList.add("is-revealed"); return; }
        M.animate(span, { transform: ["translateY(105%)", "translateY(0%)"] }, { duration: 0.85, ease: EASE_OUT })
          .then(function () { title.classList.add("is-revealed"); span.style.transform = ""; });
      }, { amount: 0.5 });
    });
  }

  // ---------- hero: grading compare + timecode ----------
  var screen = $("#viewerScreen");
  var range = $("#gradeRange");
  var sweepAnim = null;

  function setupViewer() {
    var graded = $(".scene-graded", screen).firstElementChild;
    if (!graded) return;
    var clone = graded.cloneNode(true);
    clone.removeAttribute("id");
    var defs = clone.querySelector("defs");
    if (defs) defs.remove();
    $(".scene-log", screen).appendChild(clone);
    range.addEventListener("input", function () {
      if (sweepAnim) sweepAnim.stop();
      sweepAnim = false;
      setSplit(range.value, true);
    });
  }
  function setSplit(v, fromInput) {
    screen.style.setProperty("--split", v + "%");
    if (!fromInput) range.value = Math.round(v);
  }

  var tcRunning = false, tcStart = 0, tcVisible = true;
  function startTimecode() {
    var el = $("#heroTc");
    tcStart = performance.now();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        tcVisible = entries[0].isIntersecting;
        if (tcVisible && !tcRunning && !reduceMotion) loop();
      }).observe(screen);
    }
    function loop() {
      if (!tcVisible || document.hidden) { tcRunning = false; return; }
      tcRunning = true;
      var frames = state.tcOffset + ((performance.now() - tcStart) / 1000) * FPS;
      el.textContent = formatTC(frames);
      requestAnimationFrame(loop);
    }
    if (reduceMotion) { el.textContent = formatTC(state.tcOffset + 12 * FPS); return; }
    document.addEventListener("visibilitychange", function () { if (!document.hidden && tcVisible && !tcRunning) loop(); });
    loop();
  }

  // ---------- leader + intro ----------
  function runLeader() {
    if (!canAnimate || !root.classList.contains("show-leader")) return Promise.resolve();
    var num = $(".leader-num");
    var ring = $(".leader-ring");
    var counts = [3, 2, 1];
    function tick(i) {
      if (i >= counts.length) return Promise.resolve();
      num.textContent = counts[i];
      return M.animate(0, 360, {
        duration: 0.42, ease: "linear",
        onUpdate: function (v) { ring.style.setProperty("--sweep", v + "deg"); }
      }).then(function () { return tick(i + 1); });
    }
    return tick(0);
  }

  function hideLeader() {
    if (!root.classList.contains("show-leader")) return Promise.resolve();
    try { sessionStorage.setItem("vep-leader", "1"); } catch (e) {}
    var leader = $(".leader");
    if (!canAnimate) { root.classList.remove("show-leader"); return Promise.resolve(); }
    return M.animate(leader, { clipPath: ["inset(0 0 0% 0)", "inset(0 0 100% 0)"] }, { duration: 0.6, ease: [0.76, 0, 0.24, 1] })
      .then(function () { root.classList.remove("show-leader"); });
  }

  function playIntro() {
    startTimecode();
    if (!canAnimate) { root.classList.add("intro-done"); state.introDone = true; return; }

    var lines = $$("#heroTitle .line");
    var cutAt = 0.12;
    M.animate($(".hero-role"), { opacity: [0, 1] }, { duration: 0.4, delay: 0.05 });
    lines.forEach(function (ln, i) {
      var at = cutAt + i * 0.34;
      // potongan keras (hard cut): muncul tanpa transisi, timecode ikut melompat
      setTimeout(function () {
        ln.style.opacity = "1";
        state.tcOffset += FPS * (3 + i * 7);
      }, at * 1000);
    });
    var afterLines = cutAt + lines.length * 0.34;
    M.animate([$(".hero-sub"), $(".hero-actions")], { opacity: [0, 1], y: [14, 0] }, { duration: 0.6, delay: M.stagger(0.1, { startDelay: afterLines }), ease: EASE_OUT });

    var viewer = $(".viewer");
    M.animate(viewer, { clipPath: ["inset(0 100% 0 0 round 22px)", "inset(0 0% 0 0 round 22px)"] }, { duration: 1, delay: 0.3, ease: [0.65, 0, 0.35, 1] })
      .then(function () {
        root.classList.add("intro-done");
        state.introDone = true;
        viewer.style.clipPath = "";
        lines.forEach(function (ln) { ln.style.opacity = ""; });
        setTimeout(gradeSweep, 250);
      })
      .catch(function () {});
  }

  // Sapuan otomatis sekali untuk menunjukkan bahwa layar bisa digeser.
  function gradeSweep() {
    if (!canAnimate || sweepAnim === false) return;
    var keys = [50, 16, 84, 50];
    var times = [0, 0.32, 0.72, 1];
    function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    sweepAnim = M.animate(0, 1, {
      duration: 2.8, ease: "linear",
      onUpdate: function (t) {
        var i = 0;
        while (i < times.length - 2 && t > times[i + 1]) i++;
        var local = clamp((t - times[i]) / (times[i + 1] - times[i]), 0, 1);
        setSplit(keys[i] + (keys[i + 1] - keys[i]) * easeInOut(local));
      }
    });
    sweepAnim.then(function () { sweepAnim = null; }).catch(function () {});
  }

  // ---------- work interactions ----------
  function setupWorkInteractions() {
    var grid = $("#workGrid");
    grid.addEventListener("click", function (e) {
      var hit = e.target.closest(".clip-hit");
      if (!hit) return;
      var card = hit.closest(".clip");
      var p = (state.raw.projects || [])[parseInt(card.dataset.index, 10)];
      if (p) openProject(p, card);
    });
    grid.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var poster = e.target.closest(".clip-poster");
      if (!poster) return;
      var r = poster.getBoundingClientRect();
      poster.style.setProperty("--scrub", clamp((e.clientX - r.left) / r.width, 0, 1).toFixed(3));
    });
    grid.addEventListener("pointerout", function (e) {
      var poster = e.target.closest && e.target.closest(".clip-poster");
      if (poster && !poster.contains(e.relatedTarget)) poster.style.setProperty("--scrub", "0");
    });
    $("#workFilters").addEventListener("click", function (e) {
      var b = e.target.closest(".filter");
      if (b && b.dataset.cat !== state.filter) applyFilter(b.dataset.cat, true);
    });

    if (!(canAnimate && finePointer.matches)) return;
    root.classList.add("has-cursor");
    var cur = $("#cursor");
    var x = 0, y = 0, tx = 0, ty = 0, s = 0.6, ts = 0.6, raf = 0;
    function frame() {
      x += (tx - x) * 0.22; y += (ty - y) * 0.22; s += (ts - s) * 0.2;
      cur.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) translate(-50%,-50%) scale(" + s.toFixed(3) + ")";
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1 || Math.abs(ts - s) > 0.002) raf = requestAnimationFrame(frame);
      else raf = 0;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX; ty = e.clientY;
      if (!cur.classList.contains("is-on")) { x = tx; y = ty; }
      kick();
    }, { passive: true });
    grid.addEventListener("pointerover", function (e) {
      if (e.target.closest(".clip-hit")) { cur.classList.add("is-on"); ts = 1; kick(); }
    });
    grid.addEventListener("pointerout", function (e) {
      var from = e.target.closest(".clip-hit");
      var to = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest(".clip-hit") : null;
      if (from && !to) { cur.classList.remove("is-on"); ts = 0.6; kick(); }
    });
  }

  // ---------- modal ----------
  var modal = $("#clipModal");
  var panel = $(".modal-panel", modal);
  var lastFocus = null;

  function embedFor(url) {
    url = safeUrl(url);
    if (!url) return null;
    var m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
    if (m) return { type: "iframe", src: "https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1&rel=0&playsinline=1" };
    m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return { type: "iframe", src: "https://player.vimeo.com/video/" + m[1] + "?autoplay=1&dnt=1" };
    m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (m) return { type: "iframe", src: "https://drive.google.com/file/d/" + m[1] + "/preview" };
    if (/\.(mp4|webm|mov)(\?|#|$)/i.test(url)) return { type: "video", src: url };
    return null;
  }

  function openModal(o) {
    $("#modalCat").textContent = o.cat || "";
    modal.style.setProperty("--modal-track", o.color || "var(--dim)");
    $("#modalTitle").textContent = o.title || "";
    $("#modalSummary").textContent = o.summary || "";
    $("#modalSummary").hidden = !o.summary;
    $("#modalFacts").innerHTML = (o.facts || []).filter(function (f) { return f[1]; }).map(function (f) {
      return "<dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd>";
    }).join("");
    $("#modalCredit").textContent = o.credit || "";
    var emb = embedFor(o.url);
    var media = $("#modalMedia");
    if (!emb) media.innerHTML = '<p class="modal-empty">' + esc(ui("modal.no_video")) + "</p>";
    else if (emb.type === "video") media.innerHTML = '<video src="' + esc(emb.src) + '" controls autoplay playsinline></video>';
    else media.innerHTML = '<iframe src="' + esc(emb.src) + '" title="' + esc(o.title || "Video") + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';

    lastFocus = document.activeElement;
    body.classList.add("modal-open");
    modal.showModal();
    if (canAnimate) {
      M.animate(panel, { opacity: [0, 1], y: [28, 0], scale: [0.97, 1] }, {
        y: { type: "spring", visualDuration: 0.42, bounce: 0.18 },
        scale: { type: "spring", visualDuration: 0.42, bounce: 0.18 },
        opacity: { duration: 0.2 }
      });
    }
  }

  function closeModal() {
    if (!modal.open) return;
    if (!canAnimate) { modal.close(); return; }
    M.animate(panel, { opacity: 0, y: 14, scale: 0.98 }, { duration: 0.18, ease: "easeIn" })
      .then(function () { modal.close(); });
  }

  function setupModal() {
    modal.addEventListener("close", function () {
      $("#modalMedia").innerHTML = "";
      body.classList.remove("modal-open");
      panel.style.opacity = ""; panel.style.transform = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });
    modal.addEventListener("cancel", function (e) { e.preventDefault(); closeModal(); });
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-action='close-modal']")) closeModal();
    });
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-action='showreel']")) {
        openModal({
          cat: setting("role"),
          title: ui("modal.showreel") + ", " + setting("name"),
          url: setting("showreel_url"),
          credit: setting("showreel_credit")
        });
      }
    });
  }

  function openProject(p) {
    var cat = (p.category || "").toLowerCase();
    openModal({
      cat: catLabel(cat),
      color: CATEGORIES.indexOf(cat) !== -1 ? "var(--c-" + cat + ")" : "var(--dim)",
      title: L(p, "title"),
      summary: L(p, "summary"),
      url: p.video_url,
      credit: p.credit,
      facts: [
        [ui("modal.client"), p.client],
        [ui("modal.year"), p.year],
        [ui("modal.length"), p.duration],
        [ui("modal.role"), L(p, "role")]
      ]
    });
  }

  // ---------- header, menu, language ----------
  function setupHeader() {
    var toggle = $(".menu-toggle");
    var nav = $("#mainNav");
    function setMenu(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", ui(open ? "nav.close" : "nav.menu"));
      nav.classList.toggle("is-open", open);
      body.classList.toggle("menu-open", open);
      if (open && canAnimate) {
        M.animate($$("li", nav), { opacity: [0, 1], y: [24, 0] }, { duration: 0.45, delay: M.stagger(0.05), ease: EASE_OUT });
      }
    }
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && body.classList.contains("menu-open")) { setMenu(false); toggle.focus(); } });
    desktopMQ.addEventListener("change", function () { setMenu(false); });

    $(".lang-switch").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-lang]");
      if (b) setLang(b.dataset.lang);
    });

    $("#tlTrack").addEventListener("click", function (e) {
      var clip = e.target.closest(".tl-clip");
      if (!clip) return;
      var sec = document.getElementById(clip.dataset.target);
      if (!sec) return;
      if (clip.dataset.target === "top") window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      else sec.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  function setLang(lang) {
    if (lang === state.lang || !I18N[lang]) return;
    state.lang = lang;
    store("vep-lang", lang);
    var targets = [$("main"), $(".site-footer")];
    if (!canAnimate) { renderAll(); return; }
    M.animate(targets, { opacity: [1, 0] }, { duration: 0.14 }).then(function () {
      renderAll();
      $$(".section-title").forEach(function (t) { t.classList.add("is-revealed"); });
      M.animate(targets, { opacity: [0, 1] }, { duration: 0.3 });
    });
  }

  // ---------- boot ----------
  function boot() {
    setupViewer();
    setupModal();
    setupHeader();
    setupWorkInteractions();

    var leaderDone = runLeader();
    var dataReady = window.SiteData.load(function (fresh) {
      state.raw = fresh.raw;
      renderAll();
      $$(".section-title").forEach(function (t) { t.classList.add("is-revealed"); });
    }).then(function (res) {
      state.raw = res.raw;
      renderAll();
      setupTitleReveals();
    });

    Promise.all([leaderDone, dataReady])
      .then(hideLeader)
      .then(playIntro)
      .catch(function (err) {
        console.error(err);
        root.classList.remove("anim-ready", "show-leader");
      });

    window.addEventListener("scroll", onScroll, { passive: true });
    var relayout = debounce(function () { setupProcess(); layoutTimeline(); }, 150);
    window.addEventListener("resize", relayout);
    if ("ResizeObserver" in window) new ResizeObserver(debounce(layoutTimeline, 120)).observe(body);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setupProcess(); layoutTimeline(); });
  }

  boot();
})();
