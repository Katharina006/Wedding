/* =========================================
   KONFIGURASI — ubah bagian ini saja
   ========================================= */
const CONFIG = {
  weddingDate: "2026-12-30T08:00:00+07:00",   // untuk countdown
  calendar: {
    title: "Pernikahan Nadia & Raka",
    details: "Resepsi di The Grand Ballroom",
    location: "The Grand Ballroom, Kota Anda",
    start: "20261231T030000Z",                // format UTC
    end:   "20261231T070000Z",
  },
  // Nomor WhatsApp untuk menerima RSVP (format 62xxxxxxxxxx). Kosongkan jika tidak mau.
  rsvpWhatsApp: "",
};

/* ========== helpers ========== */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const safe = (t) => { const d = document.createElement("div"); d.textContent = t; return d.innerHTML; };

function toast(msg = "Tersalin!") {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); ta.remove();
  }
  toast("Tersalin ✓");
}

/* ========== nama tamu dari URL (?to=Nama+Tamu) ========== */
const to = new URLSearchParams(location.search).get("to");
if (to) $("#guestName").textContent = to;

/* ========== buka undangan ========== */
const bgm = $("#bgm");
const musicBtn = $("#musicBtn");

$("#openBtn").addEventListener("click", () => {
  $("#cover-section").classList.add("open");
  $("#main").hidden = false;
  document.body.classList.remove("locked");
  window.scrollTo(0, 0);
  setTimeout(() => ($("#cover-section").style.display = "none"), 1300);
  bgm.play().then(() => musicBtn.classList.add("playing")).catch(() => {});
  observeReveals();
});

musicBtn.addEventListener("click", () => {
  if (bgm.paused) { bgm.play().catch(() => toast("File musik belum ditambahkan")); musicBtn.classList.add("playing"); }
  else { bgm.pause(); musicBtn.classList.remove("playing"); }
});

/* ========== scroll reveal ========== */
function observeReveals() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  $$("#main .reveal").forEach((el) => io.observe(el));
}

/* ========== active dock link ========== */
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      $$(".dock a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
["hero-section", "detail-section", "gallery-section", "gift-section", "wish-section"].forEach((id) => spy.observe($("#" + id)));

/* ========== countdown ========== */
const target = new Date(CONFIG.weddingDate).getTime();
function tick() {
  let d = Math.max(0, target - Date.now());
  const days = Math.floor(d / 864e5); d %= 864e5;
  const h = Math.floor(d / 36e5); d %= 36e5;
  const m = Math.floor(d / 6e4);
  const s = Math.floor((d % 6e4) / 1e3);
  $("#cd-d").textContent = String(days).padStart(2, "0");
  $("#cd-h").textContent = String(h).padStart(2, "0");
  $("#cd-m").textContent = String(m).padStart(2, "0");
  $("#cd-s").textContent = String(s).padStart(2, "0");
}
tick(); setInterval(tick, 1000);

/* ========== simpan tanggal (Google Calendar) ========== */
const c = CONFIG.calendar;
$("#saveDate").href =
  "https://www.google.com/calendar/event?action=TEMPLATE" +
  `&text=${encodeURIComponent(c.title)}&details=${encodeURIComponent(c.details)}` +
  `&location=${encodeURIComponent(c.location)}&dates=${c.start}/${c.end}`;

/* ========== GIFT: salin rekening / alamat, QRIS ========== */
$$("[data-copy-btn]").forEach((b) =>
  b.addEventListener("click", () => copyText(b.dataset.copyBtn))
);
$$("[data-copy-btn-el]").forEach((b) =>
  b.addEventListener("click", () => copyText($("#" + b.dataset.copyBtnEl).textContent.trim()))
);
$$(".bank__no").forEach((el) =>
  el.addEventListener("click", () => copyText(el.dataset.copy))
);

const qris = $("#qrisModal");
$$("[data-qris]").forEach((b) => b.addEventListener("click", () => (qris.hidden = false)));
$("#qrisClose").addEventListener("click", () => (qris.hidden = true));
qris.addEventListener("click", (e) => { if (e.target === qris) qris.hidden = true; });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") qris.hidden = true; });

/* ========== RSVP ========== */
$("#rsvpForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#rsvpName").value.trim();
  const guests = $("#rsvpGuests").value;
  const att = $("input[name=att]:checked").value;
  const data = JSON.parse(localStorage.getItem("rsvp") || "[]");
  data.push({ name, guests, att, at: Date.now() });
  localStorage.setItem("rsvp", JSON.stringify(data));
  $("#rsvpNote").textContent = `Terima kasih, ${name}! Konfirmasi "${att}" telah tercatat.`;
  e.target.reset();

  if (CONFIG.rsvpWhatsApp) {
    const msg = `Halo, saya ${name}. Konfirmasi: ${att} (${guests} orang).`;
    window.open(`https://wa.me/${CONFIG.rsvpWhatsApp}?text=${encodeURIComponent(msg)}`, "_blank");
  }
});

/* ========== UCAPAN & DOA (disimpan di browser — lihat README untuk backend) ========== */
const SEED = [
  { name: "Melissa", msg: "Selamat ya! Semoga samawa sampai kakek nenek 🤍", at: Date.now() - 864e5 * 3 },
  { name: "Citra Kusuma", msg: "Barakallahu lakuma wa baraka alaikuma. Bahagia selalu!", at: Date.now() - 864e5 * 2 },
];
const loadWishes = () => JSON.parse(localStorage.getItem("wishes") || "null") || SEED;
const fmt = (t) => new Date(t).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });

function renderWishes() {
  $("#wishList").innerHTML = loadWishes()
    .sort((a, b) => b.at - a.at)
    .map((w) => `<div class="wish-item"><b>${safe(w.name)}</b><time>${fmt(w.at)}</time><p>${safe(w.msg)}</p></div>`)
    .join("");
}
renderWishes();

$("#wishForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const list = loadWishes();
  list.push({ name: $("#wishName").value.trim(), msg: $("#wishMsg").value.trim(), at: Date.now() });
  localStorage.setItem("wishes", JSON.stringify(list));
  e.target.reset();
  renderWishes();
  toast("Ucapan terkirim 💌");
});
