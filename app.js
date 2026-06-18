const API_URL = "https://script.google.com/macros/s/AKfycbwIXW--hiEXbZ3-JnO6cYDK_8rRtF-PTl7-GHS3j-6wlXZQAL_Iwdc3WFUxm0bOG_6r/exec";
const ČLANI = ["Franci", "Gašper", "Mitja", "David", "Filip", "Erik"];
const CROWN = "Franci";
const LS_KEY = "aktivna_seja";

let selectedMember = null;
let timerInterval = null;
let sessionStart = null; // Date object

// ── Build member grid ──
const grid = document.getElementById("memberGrid");
ČLANI.forEach(ime => {
  const btn = document.createElement("button");
  btn.className = "member-btn";
  btn.dataset.ime = ime;
  btn.textContent = ime === CROWN ? `${ime} 👑` : ime;
  btn.addEventListener("click", () => selectMember(ime));
  grid.appendChild(btn);
});

// ── Restore active session from localStorage ──
const saved = localStorage.getItem(LS_KEY);
if (saved) {
  try {
    const { ime, zacetek_timestamp } = JSON.parse(saved);
    selectedMember = ime;
    sessionStart = new Date(zacetek_timestamp);
    highlightMember(ime);
    renderTimerRunning();
  } catch {
    localStorage.removeItem(LS_KEY);
  }
}

function selectMember(ime) {
  if (timerInterval) return; // ignore clicks while timer runs
  selectedMember = ime;
  highlightMember(ime);
  renderSelected();
}

function highlightMember(ime) {
  document.querySelectorAll(".member-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.ime === ime);
  });
}

// ── Stanje 2: član izbran, timer ne teče ──
function renderSelected() {
  const area = document.getElementById("actionArea");
  area.innerHTML = `
    <div class="selected-name">${selectedMember}</div>
    <button class="btn btn-primary btn-large" id="btnStart">▶ ZAČNI DELO</button>
    <button class="btn btn-secondary" id="btnCancel">Prekliči</button>
  `;
  document.getElementById("btnStart").addEventListener("click", startTimer);
  document.getElementById("btnCancel").addEventListener("click", cancel);
}

function cancel() {
  selectedMember = null;
  highlightMember(null);
  document.getElementById("actionArea").innerHTML = `<p class="placeholder">Izberi svoje ime za začetek</p>`;
}

// ── Stanje 3: timer teče ──
function startTimer() {
  sessionStart = new Date();
  localStorage.setItem(LS_KEY, JSON.stringify({ ime: selectedMember, zacetek_timestamp: sessionStart.toISOString() }));
  renderTimerRunning();
}

function renderTimerRunning() {
  const area = document.getElementById("actionArea");
  const zacetekStr = formatTime(sessionStart);
  const datumStr = formatDate(sessionStart);

  area.innerHTML = `
    <div class="selected-name">${selectedMember}</div>
    <div class="start-info">Začetek: ${datumStr} ob ${zacetekStr}</div>
    <div class="recording-indicator">
      <span class="pulse-dot"></span> SNEMAM
    </div>
    <div class="timer-display" id="timerDisplay">00:00:00</div>
    <button class="btn btn-danger btn-large" id="btnStop">⏹ ZAKLJUČI DELO</button>
    <p class="warning-text">⚠️ Ne zapri okna med delom!</p>
  `;

  document.getElementById("btnStop").addEventListener("click", stopTimer);

  clearInterval(timerInterval);
  timerInterval = setInterval(tickTimer, 1000);
  tickTimer();
}

function tickTimer() {
  const elapsed = Math.floor((Date.now() - sessionStart.getTime()) / 1000);
  const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  const el = document.getElementById("timerDisplay");
  if (el) el.textContent = `${h}:${m}:${s}`;
}

// ── Stop & send ──
async function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;

  const konec = new Date();
  const diffMs = konec - sessionStart;
  const ure = Math.round((diffMs / 3600000) * 100) / 100;
  const totalMin = Math.floor(diffMs / 60000);
  const prikazH = Math.floor(totalMin / 60);
  const prikazMin = totalMin % 60;

  const payload = {
    ime: selectedMember,
    datum: formatDate(sessionStart),
    zacetek: formatTime(sessionStart),
    konec: formatTime(konec),
    ure: ure
  };

  const area = document.getElementById("actionArea");
  const btnStop = document.getElementById("btnStop");
  if (btnStop) {
    btnStop.disabled = true;
    btnStop.innerHTML = `<span class="spinner"></span> Pošiljam…`;
  }

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "no-cors"
    });

    localStorage.removeItem(LS_KEY);
    area.innerHTML = `
      <div class="result-card success">
        ✅ Zabeleženo!<br>${selectedMember}: ${prikazH}h ${prikazMin}min (${ure.toFixed(2)} ur)
      </div>
    `;
    setTimeout(resetAll, 3000);
  } catch (err) {
    area.innerHTML = `
      <div class="result-card error">
        ❌ Napaka pri pošiljanju:<br>${err.message}
      </div>
      <button class="btn btn-danger" id="btnRetry">Poskusi znova</button>
    `;
    document.getElementById("btnRetry").addEventListener("click", () => {
      renderTimerRunning();
    });
    // restore sessionStart so retry works
    sessionStart = new Date(sessionStart);
  }
}

function resetAll() {
  selectedMember = null;
  sessionStart = null;
  highlightMember(null);
  document.getElementById("actionArea").innerHTML = `<p class="placeholder">Izberi svoje ime za začetek</p>`;
}

// ── Helpers ──
function formatDate(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function formatTime(d) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
