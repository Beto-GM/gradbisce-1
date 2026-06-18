const API_URL = "https://script.google.com/macros/s/AKfycbxzvKCqFkyeebsByJH2o_yr7jHApv923P3cpnJ9v26WbHUduOuymVh1PF35A2heMe9v/exec";
const ČLANI = ["Franci", "Gašper", "Mitja", "David", "Filip", "Erik"];
const BARVE = {
  Franci: "#C4581A",
  Gašper: "#8B4513",
  Mitja:  "#A07850",
  David:  "#B8864E",
  Filip:  "#C49A6C",
  Erik:   "#D4B48A"
};

let allData = [];
let activeFilter = "all";

let strosekData = [];
let strosekFilter = "all";
let strosekLoaded = false;

// ── Očisti datum — odstrani GMT timezone napis ──
function cleanDatum(str) {
  if (!str) return '';
  const s = String(str);
  // Že v formatu DD.MM.YYYY
  const match = s.match(/\d{1,2}\.\d{1,2}\.\d{4}/);
  if (match) return match[0];
  // Pretvori iz polnega Date stringa (npr. "Thu Jun 18 2026 GMT+0100...")
  const d = new Date(s);
  if (!isNaN(d)) {
    return String(d.getDate()).padStart(2, '0') + '.' +
           String(d.getMonth() + 1).padStart(2, '0') + '.' +
           d.getFullYear();
  }
  return s;
}

// ── Tab switching ──
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.dataset.tab;
    document.getElementById("tabUre").hidden = tab !== "ure";
    document.getElementById("tabStroski").hidden = tab !== "stroski";
    if (tab === "stroski" && !strosekLoaded) loadStrosekData();
  });
});

// ── Ure: Fetch ──
async function loadData() {
  try {
    const res = await fetch(API_URL + "?action=get");
    const json = await res.json();
    allData = normalise(json);
    render();
  } catch (err) {
    document.getElementById("tabUre").innerHTML = `
      <div class="card" style="text-align:center;color:var(--accent);margin-top:1rem">
        ❌ Napaka pri nalaganju: ${err.message}
      </div>`;
  }
}

function normalise(raw) {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : (raw.rows || raw.data || raw.values || []);
  return list.map(r => {
    if (Array.isArray(r)) {
      return { ime: r[0], datum: cleanDatum(r[1]), zacetek: r[2], konec: r[3], ure: parseFloat(r[4]) || 0, kaj: r[5] || "" };
    }
    return {
      ime: r.ime || r.Ime || "",
      datum: cleanDatum(r.datum || r.Datum || ""),
      zacetek: r.zacetek || r.Zacetek || r.Začetek || "",
      konec: r.konec || r.Konec || "",
      ure: parseFloat(r.ure || r.Ure || 0),
      kaj: r.kaj || r.Kaj || ""
    };
  }).filter(r => r.ime && r.datum);
}

function parseDate(str) {
  const [d, m, y] = str.split(".");
  return new Date(+y, +m - 1, +d);
}

function filterData(data, filter) {
  const now = new Date();
  if (filter === "all") return data;
  return data.filter(r => {
    const d = parseDate(r.datum);
    if (filter === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1);
      startOfWeek.setHours(0, 0, 0, 0);
      return d >= startOfWeek;
    }
    if (filter === "month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (filter === "year") {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  });
}

// ── Ure: Render ──
function render() {
  const data = filterData(allData, activeFilter);
  if (data.length === 0) { renderEmpty(); return; }
  renderStats(data);
  renderChartByMember(data);
  renderChartByDay(data);
  renderTable(data);
}

function renderEmpty() {
  document.getElementById("statsGrid").innerHTML = "";
  document.getElementById("chartByMemberWrap").innerHTML = "";
  document.getElementById("chartByDayWrap").innerHTML = "";
  document.getElementById("tableCard").innerHTML = `
    <h2>Vsi vnosi</h2>
    <div class="empty-state">Še ni zabeleženih ur za ta filter.<br><a href="index.html">Začni z timerjem! →</a></div>`;
}

function renderStats(data) {
  const skupajUr = data.reduce((s, r) => s + r.ure, 0);
  const aktivnih = new Set(data.map(r => r.ime)).size;
  const dni = new Set(data.map(r => r.datum)).size;
  const povprecje = dni > 0 ? skupajUr / dni : 0;

  function card(label, value, unit) {
    return `<div class="stat-card"><div class="stat-label">${label}</div><div class="stat-value">${value} <span class="stat-unit">${unit}</span></div></div>`;
  }
  document.getElementById("statsGrid").innerHTML =
    card("Skupno ur", skupajUr.toFixed(1), "ur") +
    card("Aktivnih članov", aktivnih, "os.") +
    card("Delovnih dni", dni, "dni") +
    card("Povprečno", povprecje.toFixed(1), "ur/dan");
}

function renderChartByMember(data) {
  const byMember = {};
  ČLANI.forEach(ime => { byMember[ime] = 0; });
  data.forEach(r => { byMember[r.ime] = (byMember[r.ime] || 0) + r.ure; });
  const sorted = Object.entries(byMember).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  if (!sorted.length) { document.getElementById("chartByMemberWrap").innerHTML = `<div class="empty-state" style="padding:1rem">Ni podatkov</div>`; return; }
  const max = sorted[0][1];
  const rows = sorted.map(([ime, v]) => {
    const pct = max > 0 ? (v / max) * 100 : 0;
    return `<div class="bar-row">
      <span class="bar-name">${ime}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%;background:${BARVE[ime] || "#A07850"}">
        <span class="bar-fill-value">${v.toFixed(1)} ur</span>
      </div></div>
    </div>`;
  }).join("");
  document.getElementById("chartByMemberWrap").innerHTML = `<div class="bar-chart-member">${rows}</div>`;
}

function renderChartByDay(data) {
  const byDay = {};
  data.forEach(r => { byDay[r.datum] = (byDay[r.datum] || 0) + r.ure; });
  const sortedDays = Object.keys(byDay).sort((a, b) => parseDate(a) - parseDate(b)).slice(-30);
  if (!sortedDays.length) { document.getElementById("chartByDayWrap").innerHTML = `<div class="empty-state" style="padding:1rem">Ni podatkov</div>`; return; }
  const maxDay = Math.max(...sortedDays.map(d => byDay[d]));
  const cols = sortedDays.map(d => {
    const pct = maxDay > 0 ? (byDay[d] / maxDay) * 100 : 0;
    return `<div class="day-col"><div class="day-fill" style="height:${pct.toFixed(1)}%"></div><span class="day-label">${d.slice(0, 5)}</span></div>`;
  }).join("");
  document.getElementById("chartByDayWrap").innerHTML = `<div class="bar-chart-day"><div class="day-bars-wrap">${cols}</div></div>`;
}

function renderTable(data) {
  const sorted = [...data].sort((a, b) => parseDate(b.datum) - parseDate(a.datum));
  const rows = sorted.map(r => {
    const deloBadge = r.kaj
      ? `<span class="delo-badge">${r.kaj}</span>`
      : `<span style="color:var(--text-hint);font-size:0.8rem">—</span>`;
    return `<tr><td>${r.datum}</td><td>${r.ime}</td><td>${r.zacetek}</td><td>${r.konec}</td><td>${parseFloat(r.ure).toFixed(2)}</td><td>${deloBadge}</td></tr>`;
  }).join("");
  document.getElementById("tableCard").innerHTML = `
    <h2>Vsi vnosi</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Datum</th><th>Ime</th><th>Začetek</th><th>Konec</th><th>Ure</th><th>Delo</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <p class="table-note">💡 Za ročne popravke odpri Google Sheets → Ime | Datum (DD.MM.YYYY) | Začetek | Konec | Ure | Delo</p>`;
}

// ── Ure: filter bar ──
document.getElementById("filterBar").addEventListener("click", e => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll("#filterBar .filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  activeFilter = btn.dataset.filter;
  render();
});

// ══════════════════════════════════════
// ── STROŠKI ──
// ══════════════════════════════════════

async function loadStrosekData() {
  strosekLoaded = true;
  try {
    const res = await fetch(API_URL + "?type=strosek");
    const json = await res.json();
    strosekData = normaliseStrosek(json);
    renderStroski();
  } catch (err) {
    document.getElementById("tabStroski").innerHTML = `
      <div class="card" style="text-align:center;color:var(--accent);margin-top:1rem">
        ❌ Napaka pri nalaganju stroškov: ${err.message}
      </div>`;
  }
}

function normaliseStrosek(raw) {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : (raw.rows || raw.data || raw.values || []);
  return list.map(r => {
    if (Array.isArray(r)) {
      return { ime: r[0], datum: cleanDatum(r[1]), predmet: r[2] || "", vrednost: parseFloat(r[3]) || 0 };
    }
    return {
      ime: r.ime || r.Ime || "",
      datum: cleanDatum(r.datum || r.Datum || ""),
      predmet: r.predmet || r.Predmet || "",
      vrednost: parseFloat(r.vrednost || r.Vrednost || 0)
    };
  }).filter(r => r.ime && r.datum);
}

function renderStroski() {
  const data = filterData(strosekData, strosekFilter);
  if (data.length === 0) { renderStrosekEmpty(); return; }
  renderStrosekStats(data);
  renderChartByKat(data);
  renderChartByOseba(data);
  renderStrosekTable(data);
}

function renderStrosekEmpty() {
  document.getElementById("statsGridStroski").innerHTML = "";
  document.getElementById("chartByKatWrap").innerHTML = "";
  document.getElementById("chartByOsebaWrap").innerHTML = "";
  document.getElementById("tableCardStroski").innerHTML = `
    <h2>Vsi stroški</h2>
    <div class="empty-state">Še ni zabeleženih stroškov za ta filter.<br><a href="index.html">Dodaj strošek →</a></div>`;
}

function renderStrosekStats(data) {
  const skupaj = data.reduce((s, r) => s + r.vrednost, 0);
  const vnosov = data.length;
  const najvecji = Math.max(...data.map(r => r.vrednost));
  const povprecje = vnosov > 0 ? skupaj / vnosov : 0;

  function card(label, value, unit) {
    return `<div class="stat-card"><div class="stat-label">${label}</div><div class="stat-value">${value} <span class="stat-unit">${unit}</span></div></div>`;
  }
  document.getElementById("statsGridStroski").innerHTML =
    card("Skupaj", skupaj.toFixed(2), "€") +
    card("Vnosov", vnosov, "kosov") +
    card("Največji", najvecji.toFixed(2), "€") +
    card("Povprečno", povprecje.toFixed(2), "€/vnos");
}

function renderChartByKat(data) {
  const byKat = {};
  data.forEach(r => {
    const kat = r.predmet || "Ostalo";
    byKat[kat] = (byKat[kat] || 0) + r.vrednost;
  });
  const sorted = Object.entries(byKat).sort((a, b) => b[1] - a[1]);
  if (!sorted.length) { document.getElementById("chartByKatWrap").innerHTML = ""; return; }
  const max = sorted[0][1];
  const katBarve = ["#C4581A","#8B4513","#A07850","#B8864E","#C49A6C","#D4B48A","#6B3A2A","#9B6E4A"];
  const rows = sorted.map(([kat, v], i) => {
    const pct = max > 0 ? (v / max) * 100 : 0;
    const color = katBarve[i % katBarve.length];
    return `<div class="bar-row">
      <span class="bar-name" style="width:90px;font-size:0.75rem">${kat}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%;background:${color}">
        <span class="bar-fill-value">${v.toFixed(2)} €</span>
      </div></div>
    </div>`;
  }).join("");
  document.getElementById("chartByKatWrap").innerHTML = `<div class="bar-chart-member">${rows}</div>`;
}

function renderChartByOseba(data) {
  const byOseba = {};
  ČLANI.forEach(ime => { byOseba[ime] = 0; });
  data.forEach(r => { byOseba[r.ime] = (byOseba[r.ime] || 0) + r.vrednost; });
  const sorted = Object.entries(byOseba).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  if (!sorted.length) { document.getElementById("chartByOsebaWrap").innerHTML = `<div class="empty-state" style="padding:1rem">Ni podatkov</div>`; return; }
  const max = sorted[0][1];
  const rows = sorted.map(([ime, v]) => {
    const pct = max > 0 ? (v / max) * 100 : 0;
    return `<div class="bar-row">
      <span class="bar-name">${ime}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%;background:${BARVE[ime] || "#A07850"}">
        <span class="bar-fill-value">${v.toFixed(2)} €</span>
      </div></div>
    </div>`;
  }).join("");
  document.getElementById("chartByOsebaWrap").innerHTML = `<div class="bar-chart-member">${rows}</div>`;
}

function renderStrosekTable(data) {
  const sorted = [...data].sort((a, b) => parseDate(b.datum) - parseDate(a.datum));
  const rows = sorted.map(r => {
    const badge = r.predmet
      ? `<span class="delo-badge">${r.predmet}</span>`
      : `<span style="color:var(--text-hint);font-size:0.8rem">—</span>`;
    return `<tr><td>${r.datum}</td><td>${r.ime}</td><td>${badge}</td><td><strong>${parseFloat(r.vrednost).toFixed(2)} €</strong></td></tr>`;
  }).join("");
  document.getElementById("tableCardStroski").innerHTML = `
    <h2>Vsi stroški</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Datum</th><th>Ime</th><th>Predmet</th><th>Znesek</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    <p class="table-note">💡 Za ročne popravke odpri Google Sheets (list Stroški) → Ime | Datum (DD.MM.YYYY) | Predmet | Vrednost (€)</p>`;
}

// ── Stroški: filter bar ──
document.getElementById("filterBarStroski").addEventListener("click", e => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll("#filterBarStroski .filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  strosekFilter = btn.dataset.filter;
  renderStroski();
});

// ── Start ──
loadData();
