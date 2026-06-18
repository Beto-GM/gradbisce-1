const API_URL = "https://script.google.com/macros/s/AKfycbyy4vnG0CAdWkKw8WatFk-8fwhBtngVbl5L4yzDwTuyG54LssIebHNo2WZoRgCqOmhh/exec";
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

// ── Fetch ──
async function loadData() {
  try {
    const res = await fetch(API_URL + "?action=get");
    const json = await res.json();
    // Pričakujemo polje objektov ali 2D array
    allData = normalise(json);
    render();
  } catch (err) {
    document.querySelector(".container").innerHTML = `
      <div class="card" style="text-align:center;color:var(--danger)">
        ❌ Napaka pri nalaganju podatkov: ${err.message}
      </div>`;
  }
}

// Pretvori različne formate v enoten seznam objektov
function normalise(raw) {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : (raw.data || raw.values || []);
  return list.map(r => {
    if (Array.isArray(r)) {
      return { ime: r[0], datum: r[1], zacetek: r[2], konec: r[3], ure: parseFloat(r[4]) || 0, kaj: r[5] || "" };
    }
    return {
      ime: r.ime || r.Ime || "",
      datum: r.datum || r.Datum || "",
      zacetek: r.zacetek || r.Zacetek || r.Začetek || "",
      konec: r.konec || r.Konec || "",
      ure: parseFloat(r.ure || r.Ure || 0),
      kaj: r.kaj || r.Kaj || ""
    };
  }).filter(r => r.ime && r.datum);
}

// Pretvori "DD.MM.YYYY" v Date
function parseDate(str) {
  const [d, m, y] = str.split(".");
  return new Date(+y, +m - 1, +d);
}

// ── Filter ──
function filterData(data) {
  const now = new Date();
  if (activeFilter === "all") return data;

  return data.filter(r => {
    const d = parseDate(r.datum);
    if (activeFilter === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1); // ponedeljek
      startOfWeek.setHours(0,0,0,0);
      return d >= startOfWeek;
    }
    if (activeFilter === "month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (activeFilter === "year") {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  });
}

// ── Render everything ──
function render() {
  const data = filterData(allData);

  if (data.length === 0) {
    renderEmpty();
    return;
  }

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
    <div class="empty-state">
      Še ni zabeleženih ur za ta filter.<br>
      <a href="index.html">Začni z timerjem! →</a>
    </div>`;
}

// ── Stats cards ──
function renderStats(data) {
  const skupajUr = data.reduce((s, r) => s + r.ure, 0);
  const aktivnih = new Set(data.map(r => r.ime)).size;
  const dni = new Set(data.map(r => r.datum)).size;
  const povprecje = dni > 0 ? skupajUr / dni : 0;

  function card(label, value, unit) {
    return `<div class="stat-card">
      <div class="stat-label">${label}</div>
      <div class="stat-value">${value} <span class="stat-unit">${unit}</span></div>
    </div>`;
  }

  document.getElementById("statsGrid").innerHTML =
    card("Skupno ur", skupajUr.toFixed(1), "ur") +
    card("Aktivnih članov", aktivnih, "os.") +
    card("Delovnih dni", dni, "dni") +
    card("Povprečno", povprecje.toFixed(1), "ur/dan");
}

// ── Graf 1: CSS horizontalni stolpci po članu ──
function renderChartByMember(data) {
  const byMember = {};
  ČLANI.forEach(ime => { byMember[ime] = 0; });
  data.forEach(r => {
    if (byMember[r.ime] !== undefined) byMember[r.ime] += r.ure;
    else byMember[r.ime] = r.ure;
  });

  const sorted = Object.entries(byMember)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    document.getElementById("chartByMemberWrap").innerHTML = `<div class="empty-state" style="padding:1rem">Ni podatkov</div>`;
    return;
  }

  const max = sorted[0][1];

  const rows = sorted.map(([ime, v]) => {
    const pct = max > 0 ? (v / max) * 100 : 0;
    const color = BARVE[ime] || "#A07850";
    return `<div class="bar-row">
      <span class="bar-name">${ime}</span>
      <div class="bar-track">
        <div class="bar-fill" style="width:${pct.toFixed(1)}%;background:${color}">
          <span class="bar-fill-value">${v.toFixed(1)} ur</span>
        </div>
      </div>
    </div>`;
  }).join("");

  document.getElementById("chartByMemberWrap").innerHTML = `<div class="bar-chart-member">${rows}</div>`;
}

// ── Graf 2: CSS navpični stolpci po dnevih ──
function renderChartByDay(data) {
  const byDay = {};
  data.forEach(r => {
    if (!byDay[r.datum]) byDay[r.datum] = 0;
    byDay[r.datum] += r.ure;
  });

  const sortedDays = Object.keys(byDay)
    .sort((a, b) => parseDate(a) - parseDate(b))
    .slice(-30);

  if (sortedDays.length === 0) {
    document.getElementById("chartByDayWrap").innerHTML = `<div class="empty-state" style="padding:1rem">Ni podatkov</div>`;
    return;
  }

  const maxDay = Math.max(...sortedDays.map(d => byDay[d]));

  const cols = sortedDays.map(d => {
    const pct = maxDay > 0 ? (byDay[d] / maxDay) * 100 : 0;
    const label = d.slice(0, 5); // DD.MM
    return `<div class="day-col">
      <div class="day-fill" style="height:${pct.toFixed(1)}%"></div>
      <span class="day-label">${label}</span>
    </div>`;
  }).join("");

  document.getElementById("chartByDayWrap").innerHTML =
    `<div class="bar-chart-day"><div class="day-bars-wrap">${cols}</div></div>`;
}

// ── Tabela ──
function renderTable(data) {
  const sorted = [...data].sort((a, b) => parseDate(b.datum) - parseDate(a.datum));

  const rows = sorted.map(r => {
    const deloBadge = r.kaj
      ? `<span class="delo-badge">${r.kaj}</span>`
      : `<span style="color:var(--text-hint);font-size:0.8rem">—</span>`;
    return `<tr>
      <td>${r.datum}</td>
      <td>${r.ime}</td>
      <td>${r.zacetek}</td>
      <td>${r.konec}</td>
      <td>${parseFloat(r.ure).toFixed(2)}</td>
      <td>${deloBadge}</td>
    </tr>`;
  }).join("");

  document.getElementById("tableCard").innerHTML = `
    <h2>Vsi vnosi</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Datum</th><th>Ime</th><th>Začetek</th><th>Konec</th><th>Ure</th><th>Delo</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="table-note">💡 Za ročne popravke odpri Google Sheets → stolpci: Ime | Datum (DD.MM.YYYY) | Začetek (HH:MM) | Konec (HH:MM) | Ure (decimalno)</p>
  `;
}

// ── Filter gumbi ──
document.getElementById("filterBar").addEventListener("click", e => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  activeFilter = btn.dataset.filter;
  render();
});

// ── Start ──
loadData();
