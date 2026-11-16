/*
  Pengaturan website.
  1. Buat Google Sheet dari file di folder sheet-template/ (lihat README.md).
  2. Share sheet: "Anyone with the link" -> Viewer.
  3. Tempel ID sheet di sheetId. ID ada di URL:
     https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit
  Kalau sheetId kosong, website memakai data contoh di data/demo-content.js.
*/
window.SITE_CONFIG = {
  sheetId: "",
  tabs: ["settings", "projects", "services", "process", "pricing", "testimonials", "faq"],
  defaultLang: "id",
  sheetTimeoutMs: 5000,
  cacheKey: "vep-sheet-cache-v1",
  timelineSeconds: 90,
  fps: 25,
  demo: {
    show: true,
    creatorName: "Surya",
    creatorUrl: "https://aryasurya.com"
  }
};
