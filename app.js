const API_URL = "https://script.google.com/macros/s/AKfycbxiNKjWojP_0vvT6po0cosyFceSjlEEnb_d9Nql9kQjl2pyPoVOJnXW6D7wgvO8xpItSw/exec";
const ČLANI = ["Franci", "Zvonka", "Gašper", "Mitja", "David", "Filip", "Erik", "Saša", "Urška Š.", "Urška M."];
const CROWNS = ["Franci", "Zvonka"];
const LS_KEY = "aktivna_seja";

// ── SVG icon constants (Lucide-style, stroke-based, currentColor) ──
const ICON_PLAY    = `<svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
const ICON_PAUSE   = `<svg class="icon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
const ICON_STOP    = `<svg class="icon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/></svg>`;
const ICON_WALLET  = `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>`;
const ICON_HARDHAT = `<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a8 8 0 0 1 16 0v3"/></svg>`;
const ICON_CHECK   = `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
const ICON_X       = `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;

const ICON_CAMERA  = `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`;
const ICON_UPLOAD  = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`;
const ICON_GALLERY = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
const ICON_ST_SPIN = `<span class="thumb-spinner"></span>`;
const ICON_ST_OK   = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const ICON_ST_ERR  = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

// SVG icons for kategorije chips (14px, parallel to KATEGORIJE array)
const KAT_SVG = [
  `<svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  `<svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  `<svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  `<svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  `<svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  `<svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
];

let selectedMember  = null;
let timerInterval   = null;
let sessionStart    = null;
let pausedDuration  = 0;     // accumulated ms of all pauses
let pauseStart      = null;  // Date.now() when current pause began
let isPaused        = false;

// ── Build member grid ──
const grid = document.getElementById("memberGrid");
ČLANI.forEach(ime => {
  const btn = document.createElement("button");
  btn.className = "member-btn";
  btn.dataset.ime = ime;
  btn.innerHTML = `
    <div class="member-avatar">${ime[0]}</div>
    <div class="member-info">
      <span class="member-name">${CROWNS.includes(ime) ? ime + " 👑" : ime}</span>
      <span class="member-status">Prosto</span>
    </div>
  `;
  btn.addEventListener("click", () => selectMember(ime));
  grid.appendChild(btn);
});

// ── Restore active session from localStorage ──
const saved = localStorage.getItem(LS_KEY);
if (saved) {
  try {
    const { ime, zacetek_timestamp, pausedDuration: pd, pauseStart: ps, isPaused: ip } = JSON.parse(saved);
    selectedMember = ime;
    sessionStart   = new Date(zacetek_timestamp);
    pausedDuration = pd || 0;
    pauseStart     = ps || null;
    isPaused       = !!ip;
    highlightMember(ime);
    renderTimerRunning();
  } catch {
    localStorage.removeItem(LS_KEY);
  }
}

function selectMember(ime) {
  if (sessionStart) return;  // running or paused
  selectedMember = ime;
  highlightMember(ime);
  renderSelected();
}

function highlightMember(ime) {
  document.querySelectorAll(".member-btn").forEach(b => {
    const active = b.dataset.ime === ime;
    b.classList.toggle("active", active);
    const statusEl = b.querySelector(".member-status");
    if (statusEl) {
      statusEl.textContent = active && (timerInterval || isPaused)
        ? (isPaused ? "⏸ Pavza" : "● Dela...")
        : "Prosto";
    }
  });
}

// ── Stanje 2: član izbran, nobena akcija ni aktivna ──
function renderSelected() {
  const area = document.getElementById("actionArea");
  area.innerHTML = `
    <span class="session-label">Izberi akcijo — ${selectedMember}</span>
    <div class="action-buttons">
      <button class="btn btn-filled btn-large" id="btnStart">${ICON_PLAY} Začni beleženje ur</button>
      <button class="btn btn-outlined btn-large" id="btnStrosek">${ICON_WALLET} Dodaj strošek</button>
      <button class="btn btn-outlined btn-large" id="btnFoto">${ICON_CAMERA} Dodaj foto / račun</button>
    </div>
    <button class="btn btn-text" id="btnCancel">Prekliči izbiro</button>
  `;
  document.getElementById("btnStart").addEventListener("click", startTimer);
  document.getElementById("btnStrosek").addEventListener("click", showStrosekModal);
  document.getElementById("btnFoto").addEventListener("click", showFotoModal);
  document.getElementById("btnCancel").addEventListener("click", cancel);
}

function cancel() {
  selectedMember = null;
  highlightMember(null);
  document.getElementById("actionArea").innerHTML = `<p class="placeholder">Izberi svoje ime za začetek</p>`;
}

// ── Stanje 3 / 4: timer teče / pavza ──
function saveLsState() {
  localStorage.setItem(LS_KEY, JSON.stringify({
    ime: selectedMember,
    zacetek_timestamp: sessionStart.toISOString(),
    pausedDuration,
    pauseStart,
    isPaused
  }));
}

function startTimer() {
  sessionStart   = new Date();
  pausedDuration = 0;
  pauseStart     = null;
  isPaused       = false;
  saveLsState();
  renderTimerRunning();
}

function renderTimerRunning() {
  const area = document.getElementById("actionArea");
  const zacetekStr = formatTime(sessionStart);
  const datumStr   = formatDate(sessionStart);

  area.innerHTML = `
    <span class="session-label">Aktivna seja</span>
    <div class="selected-name">${selectedMember}</div>
    <div class="timer-box" style="width:100%">
      <div class="timer-display" id="timerDisplay">00:00:00</div>
      <div class="start-info">Začetek ob ${zacetekStr} · ${datumStr}</div>
    </div>
    <div id="recordingIndicator" class="recording-indicator">
      <span class="pulse-dot"></span> SNEMAM
    </div>
    <div class="timer-top-btns">
      <button class="btn btn-outlined btn-large" id="btnPause">${ICON_PAUSE} Pavza</button>
      <button class="btn btn-danger btn-large" id="btnStop">${ICON_STOP} Zaključi</button>
    </div>
    <div class="timer-secondary-btns">
      <button class="btn-timer-secondary" id="btnTimerStrosek">${ICON_WALLET} Strošek med delom</button>
      <button class="btn-timer-secondary" id="btnTimerFoto">${ICON_CAMERA} Foto med delom</button>
    </div>
    <p class="warning-text">⚠️ Ne zapri okna med delom!</p>
  `;

  document.getElementById("btnPause").addEventListener("click", () => isPaused ? resumeTimer() : pauseTimer());
  document.getElementById("btnStop").addEventListener("click", stopTimer);
  document.getElementById("btnTimerStrosek").addEventListener("click", () => showStrosekModal(true));
  document.getElementById("btnTimerFoto").addEventListener("click", showFotoModal);

  if (isPaused) {
    applyPausedVisuals();
    tickTimer();  // show frozen elapsed time once
  } else {
    clearInterval(timerInterval);
    timerInterval = setInterval(tickTimer, 1000);
    tickTimer();
  }
  highlightMember(selectedMember);
}

function applyPausedVisuals() {
  const display = document.getElementById("timerDisplay");
  if (display) {
    display.style.background  = "#E8DDD0";
    display.style.color       = "var(--text-muted)";
  }
  const indicator = document.getElementById("recordingIndicator");
  if (indicator) indicator.innerHTML = `<span style="color:#B8864E">${ICON_PAUSE} PAVZA</span>`;
  const btnPause = document.getElementById("btnPause");
  if (btnPause) btnPause.innerHTML = `${ICON_PLAY} Nadaljuj delo`;
}

function applyRunningVisuals() {
  const display = document.getElementById("timerDisplay");
  if (display) {
    display.style.background = "";
    display.style.color      = "";
  }
  const indicator = document.getElementById("recordingIndicator");
  if (indicator) indicator.innerHTML = `<span class="pulse-dot"></span> SNEMAM`;
  const btnPause = document.getElementById("btnPause");
  if (btnPause) btnPause.innerHTML = `${ICON_PAUSE} Pavza`;
}

function pauseTimer() {
  if (isPaused) return;
  isPaused   = true;
  pauseStart = Date.now();
  clearInterval(timerInterval);
  timerInterval = null;
  saveLsState();
  applyPausedVisuals();
  highlightMember(selectedMember);
}

function resumeTimer() {
  if (!isPaused) return;
  pausedDuration += Date.now() - pauseStart;
  pauseStart     = null;
  isPaused       = false;
  saveLsState();
  applyRunningVisuals();
  clearInterval(timerInterval);
  timerInterval = setInterval(tickTimer, 1000);
  tickTimer();
  highlightMember(selectedMember);
}

function tickTimer() {
  const currentPauseMs = (isPaused && pauseStart) ? (Date.now() - pauseStart) : 0;
  const elapsed = Math.floor((Date.now() - sessionStart.getTime() - pausedDuration - currentPauseMs) / 1000);
  const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  const el = document.getElementById("timerDisplay");
  if (el) el.textContent = `${h}:${m}:${s}`;
}

// ── Stop: ustavi timer, prikaži modal za opis dela ──
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;

  const konec = new Date();
  const totalPausedMs = pausedDuration + (isPaused && pauseStart ? Date.now() - pauseStart : 0);
  const diffMs  = (konec - sessionStart) - totalPausedMs;
  const ure     = Math.round((diffMs / 3600000) * 100) / 100;
  const totalMin = Math.floor(diffMs / 60000);
  const prikazH  = Math.floor(totalMin / 60);
  const prikazMin = totalMin % 60;

  const basePayload = {
    ime: selectedMember,
    datum: formatDate(sessionStart),
    zacetek: formatTime(sessionStart),
    konec: formatTime(konec),
    ure
  };

  showDeloModal(basePayload, prikazH, prikazMin);
}

// ── Modal: opis dela (po zaključku timerja) ──
const DELA = [
  "Betonaža", "Opaženje", "Hidro izolacija", "Toplotna izolacija",
  "Štemanje", "Delo z ostrešjem", "Delo z lesom", "Elektrika",
  "Vodovodne inštalacije", "Priprava / razno", "Razno"
];

function showDeloModal(payload, prikazH, prikazMin) {
  const modal = document.createElement("div");
  modal.id = "kajModal";
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-card">
      <h2 class="modal-title">Kaj si delal? ${ICON_HARDHAT}</h2>
      <p class="modal-subtitle">Izberi ali napiši kratek opis dela</p>
      <div class="chip-grid">
        ${DELA.map(d => `<button class="chip" data-dela="${d}">${d}</button>`).join("")}
      </div>
      <input class="modal-input" id="modalInput" type="text" placeholder="Ali napiši svoje…" maxlength="60">
      <button class="btn btn-primary btn-large" id="btnConfirm">${ICON_CHECK} Potrdi in shrani</button>
      <button class="btn btn-secondary modal-skip" id="btnSkip">Preskoči</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("selected");
      const selected = [...modal.querySelectorAll(".chip.selected")].map(c => c.dataset.dela);
      document.getElementById("modalInput").value = selected.join(", ");
    });
  });

  document.getElementById("btnConfirm").addEventListener("click", () => {
    const kaj = document.getElementById("modalInput").value.trim();
    closeModal("kajModal");
    sendUrePayload({ ...payload, kaj }, prikazH, prikazMin);
  });

  document.getElementById("btnSkip").addEventListener("click", () => {
    closeModal("kajModal");
    sendUrePayload({ ...payload, kaj: "" }, prikazH, prikazMin);
  });
}

// ── Modal: strošek ──
const KATEGORIJE = [
  "🧱 Betonaža", "🪵 Les / opaženje", "🔧 Orodje",
  "🏠 Izolacija", "🚗 Transport", "📦 Material razno"
];

function showStrosekModal(duringTimer = false) {
  const modal = document.createElement("div");
  modal.id = "strosekModal";
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-card">
      <h2 class="modal-title">${ICON_WALLET} Dodaj strošek</h2>
      <p class="modal-subtitle">Izberi kategorijo in vnesi znesek</p>
      <div class="chip-grid">
        ${KATEGORIJE.map((k, i) => `<button class="chip" data-kat="${k}">${KAT_SVG[i]} ${k.split(' ').slice(1).join(' ')}</button>`).join("")}
      </div>
      <input class="modal-input" id="strosekOpis" type="text" placeholder="Natančnejši opis (neobvezno)" maxlength="80">
      <div class="znesek-row">
        <label class="modal-label" for="strosekZnesek">Znesek (€)</label>
        <input class="modal-input znesek-input" id="strosekZnesek" type="number" placeholder="0.00" min="0" step="0.01">
      </div>
      <button class="btn btn-filled btn-large" id="btnStrosekSave" disabled>${ICON_CHECK} Shrani strošek</button>
      <button class="btn btn-secondary modal-skip" id="btnStrosekCancel">Prekliči</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("selected");
      const selected = [...modal.querySelectorAll(".chip.selected")].map(c => c.dataset.kat);
      document.getElementById("strosekOpis").value = selected.join(", ");
    });
  });

  const znesekInput = document.getElementById("strosekZnesek");
  const btnSave = document.getElementById("btnStrosekSave");
  znesekInput.addEventListener("input", () => {
    btnSave.disabled = !znesekInput.value || parseFloat(znesekInput.value) <= 0;
  });

  btnSave.addEventListener("click", () => {
    const predmet = document.getElementById("strosekOpis").value.trim();
    const vrednost = parseFloat(znesekInput.value);
    closeModal("strosekModal");
    sendStrosekPayload(predmet, vrednost, duringTimer);
  });

  document.getElementById("btnStrosekCancel").addEventListener("click", () => {
    closeModal("strosekModal");
    if (!duringTimer) renderSelected();
  });
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.remove();
}

// ── Pošlji ure na API ──
async function sendUrePayload(payload, prikazH, prikazMin) {
  const area = document.getElementById("actionArea");
  area.innerHTML = `
    <div class="selected-name">${payload.ime}</div>
    <div style="display:flex;align-items:center;gap:.75rem;color:var(--text-muted)">
      <span class="spinner"></span> Pošiljam…
    </div>
  `;

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
        ${ICON_CHECK} Zabeleženo!<br>${payload.ime}: ${prikazH}h ${prikazMin}min (${payload.ure.toFixed(2)} ur)
        ${payload.kaj ? `<br><span style="font-size:.9rem;opacity:.8">${payload.kaj}</span>` : ""}
      </div>
    `;
    setTimeout(resetAll, 3000);
  } catch (err) {
    area.innerHTML = `
      <div class="result-card error">
        ${ICON_X} Napaka pri pošiljanju:<br>${err.message}
      </div>
      <button class="btn btn-danger" id="btnRetry">Poskusi znova</button>
    `;
    document.getElementById("btnRetry").addEventListener("click", () => renderTimerRunning());
  }
}

// ── Pošlji strošek na API ──
async function sendStrosekPayload(predmet, vrednost, duringTimer = false) {
  const area = document.getElementById("actionArea");
  area.innerHTML = `
    <div class="selected-name">${selectedMember}</div>
    <div style="display:flex;align-items:center;gap:.75rem;color:var(--text-muted)">
      <span class="spinner"></span> Shranjujem…
    </div>
  `;

  const payload = {
    type: "strosek",
    ime: selectedMember,
    datum: formatDate(new Date()),
    predmet,
    vrednost
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "no-cors"
    });

    const prikazPredmet = predmet || "—";
    area.innerHTML = `
      <div class="result-card success">
        ${ICON_CHECK} Strošek shranjen!<br>${selectedMember}: ${prikazPredmet} — ${vrednost.toFixed(2)} €
      </div>
    `;
    setTimeout(duringTimer ? renderTimerRunning : resetAll, duringTimer ? 2000 : 3000);
  } catch (err) {
    area.innerHTML = `
      <div class="result-card error">
        ${ICON_X} Napaka pri pošiljanju:<br>${err.message}
      </div>
      <button class="btn btn-danger" id="btnRetryS">Poskusi znova</button>
    `;
    document.getElementById("btnRetryS").addEventListener("click",
      () => duringTimer ? renderTimerRunning() : renderSelected()
    );
  }
}

function resetAll() {
  selectedMember = null;
  sessionStart   = null;
  pausedDuration = 0;
  pauseStart     = null;
  isPaused       = false;
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

// ── Image helpers ──
function compressImage(file, maxWidth = 1200, quality = 0.82) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ratio = Math.min(maxWidth / img.width, 1);
      canvas.width  = img.width  * ratio;
      canvas.height = img.height * ratio;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => resolve(blob), "image/jpeg", quality);
    };
    img.src = URL.createObjectURL(file);
  });
}

function blobToBase64(blob) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// ── Modal: foto / račun ──
function showFotoModal() {
  let selectedFiles = [];
  let selectedTip   = null;
  let isUploading   = false;

  const modal = document.createElement("div");
  modal.id = "fotoModal";
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-card">
      <h2 class="modal-title">${ICON_CAMERA} Dodaj foto / račun</h2>
      <p class="modal-subtitle">Izberi vrsto in dodaj slike</p>

      <div class="chip-grid" style="grid-template-columns:1fr 1fr">
        <button class="chip" data-tip="racun">🧾 Račun</button>
        <button class="chip" data-tip="slike">📷 Gradbišče</button>
      </div>

      <div id="fotoUploadSection" style="display:none;width:100%">
        <div class="foto-pick-grid">
          <button class="foto-pick-btn" id="btnFotoCamera">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            <span>Fotografiraj</span><span style="font-size:10px;color:var(--text-muted);display:block;margin-top:4px;font-weight:400;">samo v G Drive</span>
          </button>
          
          <button class="foto-pick-btn" id="btnFotoGallery">
            ${ICON_GALLERY}
            <span>Iz galerije</span>
          </button>
        </div>
        <input type="file" id="fotoCameraInput" accept="image/*" capture="environment" style="display:none">
        <input type="file" id="fotoGalleryInput" accept="image/*" multiple style="display:none">
        <div class="thumb-strip" id="fotoThumbs"></div>
        <input class="modal-input" id="fotoOpis" type="text" placeholder="Kratek opis (neobvezno)" maxlength="60" style="display:none;margin-top:4px">
      </div>

      <div id="fotoBtns" style="display:flex;flex-direction:column;gap:8px;width:100%">
        <button class="btn btn-filled btn-large" id="btnFotoUpload" disabled>${ICON_CAMERA} Naloži slike</button>
        <button class="btn btn-secondary modal-skip" id="btnFotoCancel">Prekliči</button>
      </div>

      <div id="fotoProgressArea" style="display:none;width:100%">
        <div class="foto-progress-text" id="fotoProgressText">Pripravljam…</div>
        <div class="progress-track"><div class="progress-fill" id="fotoProgressFill" style="width:0%"></div></div>
      </div>

      <div id="fotoResultArea" style="display:none;width:100%">
        <div class="foto-result" id="fotoResultCard"></div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
          <button class="btn btn-outlined btn-large" id="btnFotoMore">Dodaj še</button>
          <button class="btn btn-text" id="btnFotoClose">Zapri</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // ── helpers ──
  function updateUploadBtn() {
    const btn = document.getElementById("btnFotoUpload");
    const n   = selectedFiles.length;
    btn.disabled = (n === 0 || !selectedTip);
    const label = n === 0  ? "Naloži slike"
      : n === 1            ? "Naloži 1 sliko"
      : n < 5              ? `Naloži ${n} slike`
      :                      `Naloži ${n} slik`;
    btn.innerHTML = `${ICON_CAMERA} ${label}`;
  }

  function renderThumbs() {
    const strip = document.getElementById("fotoThumbs");
    strip.innerHTML = selectedFiles.map((f, i) => `
      <div class="thumb-item">
        <img class="thumb-img" src="${URL.createObjectURL(f)}" alt="">
        <div class="thumb-status" id="fotoSt${i}">⏳</div>
      </div>
    `).join("");
  }

  function resetFotoState() {
    selectedFiles = [];
    selectedTip   = null;
    isUploading   = false;
    modal.querySelectorAll(".chip").forEach(c => c.classList.remove("selected"));
    document.getElementById("fotoUploadSection").style.display  = "none";
    document.getElementById("fotoThumbs").innerHTML             = "";
    const opisEl = document.getElementById("fotoOpis");
    opisEl.style.display = "none";
    opisEl.value         = "";
    document.getElementById("fotoCameraInput").value            = "";
    document.getElementById("fotoGalleryInput").value           = "";
    document.getElementById("fotoProgressArea").style.display   = "none";
    document.getElementById("fotoProgressFill").style.width     = "0%";
    document.getElementById("fotoResultArea").style.display     = "none";
    document.getElementById("fotoBtns").style.display           = "flex";
    updateUploadBtn();
  }

  // ── Type chip — single select ──
  modal.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      modal.querySelectorAll(".chip").forEach(c => c.classList.remove("selected"));
      chip.classList.add("selected");
      selectedTip = chip.dataset.tip;
      const sec = document.getElementById("fotoUploadSection");
      sec.style.display        = "flex";
      sec.style.flexDirection  = "column";
      sec.style.gap            = "12px";
      updateUploadBtn();
    });
  });

  // ── Pick buttons → file inputs ──
  document.getElementById("btnFotoCamera").addEventListener("click", () => {
    document.getElementById("fotoCameraInput").click();
  });
  document.getElementById("btnFotoGallery").addEventListener("click", () => {
    document.getElementById("fotoGalleryInput").click();
  });

  // ── File selection (accumulating from both inputs) ──
  function handleFileAdded(e) {
    const added = Array.from(e.target.files);
    if (!added.length) return;
    selectedFiles = [...selectedFiles, ...added];
    renderThumbs();
    document.getElementById("fotoOpis").style.display = "block";
    updateUploadBtn();
  }
  document.getElementById("fotoCameraInput").addEventListener("change", handleFileAdded);
  document.getElementById("fotoGalleryInput").addEventListener("change", handleFileAdded);

  // ── Cancel ──
  document.getElementById("btnFotoCancel").addEventListener("click", () => {
    if (!isUploading) closeModal("fotoModal");
  });

  // ── Upload ──
  document.getElementById("btnFotoUpload").addEventListener("click", async () => {
    if (!selectedFiles.length || !selectedTip || isUploading) return;
    isUploading = true;

    document.getElementById("fotoBtns").style.display = "none";
    const progressArea = document.getElementById("fotoProgressArea");
    progressArea.style.display        = "flex";
    progressArea.style.flexDirection  = "column";
    progressArea.style.gap            = "10px";

    const opis  = document.getElementById("fotoOpis").value.trim();
    const total = selectedFiles.length;
    let succeeded = 0;
    let failed    = 0;

    for (let i = 0; i < total; i++) {
      document.getElementById("fotoProgressText").textContent = `Nalagam sliko ${i + 1} od ${total}…`;
      const stEl = document.getElementById(`fotoSt${i}`);
      if (stEl) stEl.innerHTML = ICON_ST_SPIN;

      try {
        const compressed  = await compressImage(selectedFiles[i]);
        const base64data  = await blobToBase64(compressed);
        const controller  = new AbortController();
        const timer       = setTimeout(() => controller.abort(), 45000);

        await fetch(API_URL, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            type:     "foto",
            tip:      selectedTip,
            base64:   base64data.split(",")[1],
            mimeType: "image/jpeg",
            datum:    formatDate(new Date()),
            opis,
            ime:      selectedMember
          }),
          mode:   "no-cors",
          signal: controller.signal
        });

        clearTimeout(timer);
        if (stEl) stEl.innerHTML = ICON_ST_OK;
        succeeded++;
      } catch {
        if (stEl) stEl.innerHTML = ICON_ST_ERR;
        failed++;
      }

      document.getElementById("fotoProgressFill").style.width = `${((i + 1) / total) * 100}%`;
    }

    // ── Show result ──
    document.getElementById("fotoProgressArea").style.display = "none";
    const resultArea = document.getElementById("fotoResultArea");
    resultArea.style.display = "block";

    const card = document.getElementById("fotoResultCard");
    if (failed === 0) {
      card.className   = "foto-result success";
      card.innerHTML   = `${ICON_CHECK} ${succeeded}/${total} ${total === 1 ? "slika naložena" : "slik naloženih"} v Google Drive`;
    } else if (succeeded > 0) {
      card.className   = "foto-result partial";
      card.innerHTML   = `⚠️ ${succeeded}/${total} slik naloženih — ${failed} ni ${failed === 1 ? "uspela" : "uspele"}`;
    } else {
      card.className   = "foto-result error";
      card.innerHTML   = `${ICON_X} Nalaganje ni uspelo`;
    }

    isUploading = false;
  });

  // ── Dodaj še ──
  document.getElementById("btnFotoMore").addEventListener("click", resetFotoState);

  // ── Zapri ──
  document.getElementById("btnFotoClose").addEventListener("click", () => closeModal("fotoModal"));
}
