(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var DEMO = window.DEMO_CONTENT || {};

  // Kolom wajib per tab, dipakai untuk memastikan tab yang terbaca memang tab yang benar.
  var REQUIRED = {
    settings: ["key", "value_id"],
    projects: ["title_id", "category"],
    services: ["title_id"],
    process: ["title_id"],
    pricing: ["name_id", "price"],
    testimonials: ["name", "quote_id"],
    faq: ["q_id", "a_id"]
  };

  function parseCSV(text) {
    var rows = [];
    var row = [];
    var field = "";
    var i = 0;
    var inQuotes = false;
    var len = text.length;

    while (i < len) {
      var ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        field += ch; i++; continue;
      }
      if (ch === '"') { inQuotes = true; i++; continue; }
      if (ch === ",") { row.push(field); field = ""; i++; continue; }
      if (ch === "\r") { i++; continue; }
      if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += ch; i++;
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  function rowsToObjects(rows) {
    if (!rows.length) return [];
    var header = rows[0].map(function (h) { return String(h).trim().toLowerCase(); });
    var out = [];
    for (var r = 1; r < rows.length; r++) {
      var cells = rows[r];
      var empty = true;
      var obj = {};
      for (var c = 0; c < header.length; c++) {
        if (!header[c]) continue;
        var v = cells[c] == null ? "" : String(cells[c]).trim();
        if (v !== "") empty = false;
        obj[header[c]] = v;
      }
      if (!empty) out.push(obj);
    }
    return out;
  }

  function isValidTab(tab, rows) {
    var need = REQUIRED[tab];
    if (!need || !rows.length) return rows.length > 0;
    for (var i = 0; i < need.length; i++) {
      if (!(need[i] in rows[0])) return false;
    }
    return true;
  }

  function sheetUrl(id, tab) {
    return "https://docs.google.com/spreadsheets/d/" + encodeURIComponent(id) +
      "/gviz/tq?tqx=out:csv&headers=1&sheet=" + encodeURIComponent(tab);
  }

  function fetchTab(id, tab, signal) {
    return fetch(sheetUrl(id, tab), { signal: signal, cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status + " untuk tab " + tab);
        return res.text();
      })
      .then(function (text) {
        if (/^\s*</.test(text)) throw new Error("Tab " + tab + " tidak bisa dibaca. Pastikan sheet dibagikan sebagai 'Anyone with the link'.");
        var rows = rowsToObjects(parseCSV(text));
        if (!isValidTab(tab, rows)) throw new Error("Kolom di tab " + tab + " tidak sesuai template.");
        return rows;
      });
  }

  function fetchSheet() {
    var tabs = cfg.tabs || Object.keys(REQUIRED);
    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, cfg.sheetTimeoutMs || 5000);

    return Promise.allSettled(tabs.map(function (tab) {
      return fetchTab(cfg.sheetId, tab, controller ? controller.signal : undefined);
    })).then(function (results) {
      clearTimeout(timer);
      var raw = {};
      var ok = 0;
      results.forEach(function (res, idx) {
        var tab = tabs[idx];
        if (res.status === "fulfilled") { raw[tab] = res.value; ok++; }
        else {
          console.warn("[sheet] " + res.reason.message + " Memakai data contoh untuk tab ini.");
          raw[tab] = DEMO[tab] || [];
        }
      });
      if (!ok) throw new Error("Google Sheet tidak bisa dibaca sama sekali.");
      return raw;
    });
  }

  function readCache() {
    try {
      var s = localStorage.getItem(cfg.cacheKey);
      if (!s) return null;
      var parsed = JSON.parse(s);
      return parsed && parsed.sheetId === cfg.sheetId ? parsed.raw : null;
    } catch (e) { return null; }
  }

  function writeCache(raw) {
    try { localStorage.setItem(cfg.cacheKey, JSON.stringify({ sheetId: cfg.sheetId, t: Date.now(), raw: raw })); }
    catch (e) { /* storage penuh atau diblokir: abaikan */ }
  }

  /*
    load(onUpdate) -> Promise<{ raw, source }>
    - Tanpa sheetId: data contoh.
    - Ada cache: tampilkan cache dulu, ambil sheet di belakang, panggil onUpdate kalau isinya berubah.
    - Tanpa cache: tunggu sheet (dengan batas waktu), kalau gagal pakai data contoh.
  */
  function load(onUpdate) {
    if (!cfg.sheetId) return Promise.resolve({ raw: DEMO, source: "demo" });

    var cached = readCache();
    var fresh = fetchSheet().then(function (raw) { writeCache(raw); return raw; });

    if (cached) {
      fresh.then(function (raw) {
        if (JSON.stringify(raw) !== JSON.stringify(cached) && typeof onUpdate === "function") {
          onUpdate({ raw: raw, source: "sheet" });
        }
      }).catch(function (err) { console.warn("[sheet] " + err.message); });
      return Promise.resolve({ raw: cached, source: "cache" });
    }

    return fresh
      .then(function (raw) { return { raw: raw, source: "sheet" }; })
      .catch(function (err) {
        console.warn("[sheet] " + err.message + " Memakai data contoh.");
        return { raw: DEMO, source: "demo" };
      });
  }

  window.SiteData = { load: load, parseCSV: parseCSV, rowsToObjects: rowsToObjects };
})();
