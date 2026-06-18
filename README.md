# 🏗️ Gradbišče 1 — Beleženje delovnih ur

Enostavna spletna aplikacija za beleženje ur na gradbišču za 6 družinskih članov.

## Datoteke

| Datoteka | Opis |
|---|---|
| `index.html` | Timer stran — izbira člana, start/stop |
| `dashboard.html` | Statistike, grafi, tabela vnosov |
| `style.css` | Skupni stili |
| `app.js` | Timer logika + localStorage odpornost |
| `dashboard.js` | Grafi (Chart.js) in tabela |

---

## Kako spremeniti seznam članov

Odpri `app.js` in uredi vrstico:

```js
const ČLANI = ["Franci", "Gašper", "Mitja", "David", "Filip", "Erik"];
```

Nato isto uredi v `dashboard.js`:

```js
const ČLANI = ["Franci", "Gašper", "Mitja", "David", "Filip", "Erik"];
```

In dodaj barvo za novega člana v `dashboard.js`:

```js
const BARVE = {
  Franci: "#4285F4",
  // ... dodaj:
  NovoIme: "#FF5722",
};
```

---

## Kako zamenjati API_URL

Zamenjaj v **obeh** datotekah (`app.js` in `dashboard.js`) vrstico:

```js
const API_URL = "https://script.google.com/macros/s/...";
```

---

## Format za ročne vnose v Google Sheets

Stolpci morajo biti natanko v tem vrstnem redu:

| Ime | Datum | Začetek | Konec | Ure |
|---|---|---|---|---|
| Franci | 18.06.2026 | 07:00 | 12:30 | 5.50 |

- **Datum**: format `DD.MM.YYYY`
- **Začetek / Konec**: format `HH:MM`
- **Ure**: decimalno število (npr. `5.50` za 5 ur in 30 minut)

---

## GitHub Pages — deployment

1. Ustvari novo GitHub repozitorij (public)
2. Naloži vse datoteke (vključno z `.nojekyll`)
3. V repozitoriju pojdi na **Settings → Pages**
4. Pod *Source* izberi **Deploy from a branch** → `main` → `/ (root)`
5. Klikni **Save**
6. Čez ~1 minuto bo aplikacija dostopna na:  
   `https://<tvoj-username>.github.io/<ime-repozitorija>/`

> `.nojekyll` datoteka prepreči, da GitHub Pages ignorira datoteke z imeni, ki se začnejo s podčrtajem.
