const API_URL = "https://script.google.com/macros/s/AKfycbxzvKCqFkyeebsByJH2o_yr7jHApv923P3cpnJ9v26WbHUduOuymVh1PF35A2heMe9v/exec";
const ČLANI = ["Franci", "Gašper", "Mitja", "David", "Filip", "Erik"];
const CROWN = "Franci";
const LS_KEY = "aktivna_seja";

let selectedMember = null;
let timerInterval = null;
let sessionStart = null;

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
  if (timerInterval) return;
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
      statusEl.textContent = (active && timerInterval) ? "● Dela..." : "Prosto";
    }
  });
}

// ── Stanje 2: član izbran, nobena akcija ni aktivna ──
function renderSelected() {
  const area = document.getElementById("actionArea");
  area.innerHTML = `
    <span class="session-label">Izberi akcijo — ${selectedMember}</span>
    <div class="action-buttons">
      <button class="btn btn-filled btn-large" id="btnStart">▶ Začni beleženje ur</button>
      <button class="btn btn-outlined btn-large" id="btnStrosek">💰 Dodaj strošek</button>
    </div>
    <button class="btn btn-text" id="btnCancel">Prekliči izbiro</button>
  `;
  document.getElementById("btnStart").addEventListener("click", startTimer);
  document.getElementById("btnStrosek").addEventListener("click", showStrosekModal);
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

// ── Stop: ustavi timer, prikaži modal za opis dela ──
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
      <h2 class="modal-title">Kaj si delal? 👷</h2>
      <p class="modal-subtitle">Izberi ali napiši kratek opis dela</p>
      <div class="chip-grid">
        ${DELA.map(d => `<button class="chip" data-dela="${d}">${d}</button>`).join("")}
      </div>
      <input class="modal-input" id="modalInput" type="text" placeholder="Ali napiši svoje…" maxlength="60">
      <button class="btn btn-primary btn-large" id="btnConfirm">✅ Potrdi in shrani</button>
      <button class="btn btn-secondary modal-skip" id="btnSkip">Preskoči</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      modal.querySelectorAll(".chip").forEach(c => c.classList.remove("selected"));
      chip.classList.add("selected");
      document.getElementById("modalInput").value = chip.dataset.dela;
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

function showStrosekModal() {
  const modal = document.createElement("div");
  modal.id = "strosekModal";
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-card">
      <h2 class="modal-title">💰 Dodaj strošek</h2>
      <p class="modal-subtitle">Izberi kategorijo in vnesi znesek</p>
      <div class="chip-grid">
        ${KATEGORIJE.map(k => `<button class="chip" data-kat="${k}">${k}</button>`).join("")}
      </div>
      <input class="modal-input" id="strosekOpis" type="text" placeholder="Natančnejši opis (neobvezno)" maxlength="80">
      <div class="znesek-row">
        <label class="modal-label" for="strosekZnesek">Znesek (€)</label>
        <input class="modal-input znesek-input" id="strosekZnesek" type="number" placeholder="0.00" min="0" step="0.01">
      </div>
      <button class="btn btn-filled btn-large" id="btnStrosekSave" disabled>✅ Shrani strošek</button>
      <button class="btn btn-secondary modal-skip" id="btnStrosekCancel">Prekliči</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      modal.querySelectorAll(".chip").forEach(c => c.classList.remove("selected"));
      chip.classList.add("selected");
      document.getElementById("strosekOpis").value = chip.dataset.kat;
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
    sendStrosekPayload(predmet, vrednost);
  });

  document.getElementById("btnStrosekCancel").addEventListener("click", () => {
    closeModal("strosekModal");
    renderSelected();
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
    document.getElementById("btnRetry").addEventListener("click", () => renderTimerRunning());
  }
}

// ── Pošlji strošek na API ──
async function sendStrosekPayload(predmet, vrednost) {
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
        ✅ Strošek shranjen!<br>${selectedMember}: ${prikazPredmet} — ${vrednost.toFixed(2)} €
      </div>
    `;
    setTimeout(resetAll, 3000);
  } catch (err) {
    area.innerHTML = `
      <div class="result-card error">
        ❌ Napaka pri pošiljanju:<br>${err.message}
      </div>
      <button class="btn btn-danger" id="btnRetryS">Poskusi znova</button>
    `;
    document.getElementById("btnRetryS").addEventListener("click", () => renderSelected());
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
