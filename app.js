const API_URL = "https://script.google.com/macros/s/AKfycbyy4vnG0CAdWkKw8WatFk-8fwhBtngVbl5L4yzDwTuyG54LssIebHNo2WZoRgCqOmhh/exec";
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
  btn.innerHTML = `
    <div class="member-avatar">${ime[0]}</div>
    <div class="member-info">
      <span class="member-name">${ime === CROWN ? ime + " 👑" : ime}</span>
      <span class="member-status" id="status-${ime}">Prosto</span>
    </div>
  `;
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
    const active = b.dataset.ime === ime;
    b.classList.toggle("active", active);
    const statusEl = b.querySelector(".member-status");
    if (statusEl) {
      if (active && timerInterval) {
        statusEl.textContent = "● Dela...";
      } else {
        statusEl.textContent = "Prosto";
      }
    }
  });
}

// ── Stanje 2: član izbran, timer ne teče ──
function renderSelected() {
  const area = document.getElementById("actionArea");
  area.innerHTML = `
    <span class="session-label">Aktivna seja</span>
    <div class="selected-name">${selectedMember}</div>
    <div class="timer-box" style="width:100%">
      <div class="timer-display muted">00:00:00</div>
      <div class="start-info">Pritisni ▶ za začetek</div>
    </div>
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
    <span class="session-label">Aktivna seja</span>
    <div class="selected-name">${selectedMember}</div>
    <div class="timer-box" style="width:100%">
      <div class="timer-display" id="timerDisplay">00:00:00</div>
      <div class="start-info">Začetek ob ${zacetekStr} · ${datumStr}</div>
    </div>
    <div class="recording-indicator">
      <span class="pulse-dot"></span> SNEMAM
    </div>
    <button class="btn btn-danger btn-large" id="btnStop">⏹ ZAKLJUČI DELO</button>
    <p class="warning-text">⚠️ Ne zapri okna med delom!</p>
  `;

  document.getElementById("btnStop").addEventListener("click", stopTimer);

  clearInterval(timerInterval);
  timerInterval = setInterval(tickTimer, 1000);
  tickTimer();
  // posodobi status na kartici
  highlightMember(selectedMember);
}

function tickTimer() {
  const elapsed = Math.floor((Date.now() - sessionStart.getTime()) / 1000);
  const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  const el = document.getElementById("timerDisplay");
  if (el) el.textContent = `${h}:${m}:${s}`;
}

// ── Stop: ustavi timer, prikaži modal ──
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;

  const konec = new Date();
  const diffMs = konec - sessionStart;
  const ure = Math.round((diffMs / 3600000) * 100) / 100;
  const totalMin = Math.floor(diffMs / 60000);
  const prikazH = Math.floor(totalMin / 60);
  const prikazMin = totalMin % 60;

  const basePayload = {
    ime: selectedMember,
    datum: formatDate(sessionStart),
    zacetek: formatTime(sessionStart),
    konec: formatTime(konec),
    ure: ure
  };

  showModal(basePayload, prikazH, prikazMin);
}

// ── Modal ──
const DELA = [
  "Betonaža", "Opaženje", "Hidro izolacija", "Toplotna izolacija",
  "Štemanje", "Priprava / razno", "Razno", "Delo z ostrešjem", "Delo z lesom"
];

function showModal(payload, prikazH, prikazMin) {
  const modal = document.createElement("div");
  modal.id = "kajModal";
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-card">
      <h2 class="modal-title">Kaj si delal? 👷</h2>
      <p class="modal-subtitle">Izberi ali napiši kratek opis dela</p>
      <div class="chip-grid" id="chipGrid">
        ${DELA.map(d => `<button class="chip" data-dela="${d}">${d}</button>`).join("")}
      </div>
      <input class="modal-input" id="modalInput" type="text" placeholder="Ali napiši svoje…" maxlength="60">
      <button class="btn btn-primary btn-large" id="btnConfirm">✅ Potrdi in shrani</button>
      <button class="btn btn-secondary modal-skip" id="btnSkip">Preskoči</button>
    </div>
  `;
  document.body.appendChild(modal);

  // chip klik
  modal.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      modal.querySelectorAll(".chip").forEach(c => c.classList.remove("selected"));
      chip.classList.add("selected");
      document.getElementById("modalInput").value = chip.dataset.dela;
    });
  });

  document.getElementById("btnConfirm").addEventListener("click", () => {
    const kaj = document.getElementById("modalInput").value.trim();
    closeModal();
    sendPayload({ ...payload, kaj }, prikazH, prikazMin);
  });

  document.getElementById("btnSkip").addEventListener("click", () => {
    closeModal();
    sendPayload({ ...payload, kaj: "" }, prikazH, prikazMin);
  });
}

function closeModal() {
  const m = document.getElementById("kajModal");
  if (m) m.remove();
}

// ── Pošlji na API ──
async function sendPayload(payload, prikazH, prikazMin) {
  const area = document.getElementById("actionArea");
  area.innerHTML = `
    <div class="selected-name">${payload.ime}</div>
    <div style="display:flex;align-items:center;gap:.75rem;color:var(--text-muted)">
      <span class="spinner" style="border-color:rgba(0,0,0,.2);border-top-color:#555"></span>
      Pošiljam…
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
        ✅ Zabeleženo!<br>${payload.ime}: ${prikazH}h ${prikazMin}min (${payload.ure.toFixed(2)} ur)
        ${payload.kaj ? `<br><span style="font-size:.9rem;opacity:.8">${payload.kaj}</span>` : ""}
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
