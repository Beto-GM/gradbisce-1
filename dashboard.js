const API_URL = "https://script.google.com/macros/s/AKfycbwIXW--hiEXbZ3-JnO6cYDK_8rRtF-PTl7-GHS3j-6wlXZQAL_Iwdc3WFUxm0bOG_6r/exec";
const ČLANI = ["Franci", "Gašper", "Mitja", "David", "Filip", "Erik"];
const BARVE = {
  Franci: "#4285F4",
  Gašper: "#34A853",
  Mitja:  "#FBBC04",
  David:  "#EA4335",
  Filip:  "#9C27B0",
  Erik:   "#00BCD4"
};

let allData = [];
let activeFilter = "all";
let chartMember = null;
let chartDay = null;

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
      return { ime: r[0], datum: r[1], zacetek: r[2], konec: r[3], ure: parseFloat(r[4]) || 0 };
    }
    return {
      ime: r.ime || r.Ime || "",
      datum: r.datum || r.Datum || "",
      zacetek: r.zacetek || r.Zacetek || r.Začetek || "",
      konec: r.konec || r.Konec || "",
      ure: parseFloat(r.ure || r.Ure || 0)
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

  document.getElementById("statsGrid").innerHTML = `
    <div class="stat-card"><div class="stat-value">${skupajUr.toFixed(1)}</div><div class="stat-label">Skupno ur</div></div>
    <div class="stat-card"><div class="stat-value">${aktivnih}</div><div class="stat-label">Aktivnih članov</div></div>
    <div class="stat-card"><div class="stat-value">${dni}</div><div class="stat-label">Delovnih dni</div></div>
    <div class="stat-card"><div class="stat-value">${povprecje.toFixed(1)}</div><div class="stat-label">Povprečno ur/dan</div></div>
  `;
}

// ── Graf 1: Ure po članu (horizontalni bar) ──
function renderChartByMember(data) {
  // Seštej ure po članu
  const byMember = {};
  ČLANI.forEach(ime => { byMember[ime] = 0; });
  data.forEach(r => {
    if (byMember[r.ime] !== undefined) byMember[r.ime] += r.ure;
    else byMember[r.ime] = r.ure;
  });

  const sorted = Object.entries(byMember)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  const labels = sorted.map(([ime]) => ime);
  const values = sorted.map(([, v]) => v);
  const colors = labels.map(ime => BARVE[ime] || "#999");

  const wrap = document.getElementById("chartByMemberWrap");
  wrap.innerHTML = `<canvas id="chartMember"></canvas>`;

  if (chartMember) chartMember.destroy();
  chartMember = new Chart(document.getElementById("chartMember"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => ` ${ctx.raw.toFixed(2)} ur` }
        },
        datalabels: false
      },
      scales: {
        x: { beginAtZero: true, title: { display: true, text: "Ure" } },
        y: { ticks: { font: { weight: "bold" } } }
      }
    },
    plugins: [{
      id: "endLabels",
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((ds, di) => {
          chart.getDatasetMeta(di).data.forEach((bar, i) => {
            const val = ds.data[i];
            ctx.fillStyle = "#333";
            ctx.font = "bold 12px system-ui";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(`${val.toFixed(1)} ur`, bar.x + 6, bar.y);
          });
        });
      }
    }]
  });
}

// ── Graf 2: Ure po dnevih (stacked vertical bar) ──
function renderChartByDay(data) {
  // Zberi zadnjih 30 dni ki imajo vnos
  const byDay = {};
  data.forEach(r => {
    if (!byDay[r.datum]) byDay[r.datum] = {};
    byDay[r.datum][r.ime] = (byDay[r.datum][r.ime] || 0) + r.ure;
  });

  const sortedDays = Object.keys(byDay)
    .sort((a, b) => parseDate(a) - parseDate(b))
    .slice(-30);

  const labels = sortedDays.map(d => d.slice(0, 5)); // DD.MM

  const datasets = ČLANI.map(ime => ({
    label: ime,
    data: sortedDays.map(d => byDay[d]?.[ime] || 0),
    backgroundColor: BARVE[ime] || "#999",
    borderRadius: 4,
    stack: "stack"
  })).filter(ds => ds.data.some(v => v > 0));

  const wrap = document.getElementById("chartByDayWrap");
  wrap.innerHTML = `<canvas id="chartDay"></canvas>`;

  if (chartDay) chartDay.destroy();
  chartDay = new Chart(document.getElementById("chartDay"), {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 14, font: { size: 12 } } },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.raw.toFixed(2)} ur`
          }
        }
      },
      scales: {
        x: { stacked: true, ticks: { maxRotation: 45 } },
        y: { stacked: true, beginAtZero: true, title: { display: true, text: "Ure" } }
      }
    }
  });
}

// ── Tabela ──
function renderTable(data) {
  const sorted = [...data].sort((a, b) => parseDate(b.datum) - parseDate(a.datum));

  const rows = sorted.map(r => `
    <tr>
      <td>${r.datum}</td>
      <td>${r.ime}</td>
      <td>${r.zacetek}</td>
      <td>${r.konec}</td>
      <td>${parseFloat(r.ure).toFixed(2)}</td>
    </tr>`).join("");

  document.getElementById("tableCard").innerHTML = `
    <h2>Vsi vnosi</h2>
    <table>
      <thead><tr><th>Datum</th><th>Ime</th><th>Začetek</th><th>Konec</th><th>Ure</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
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
