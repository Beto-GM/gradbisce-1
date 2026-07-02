import re, pathlib

path = pathlib.Path("/Users/GaUr_Mac/Library/Mobile Documents/com~apple~CloudDocs/Gradbisce 1/app.js")
text = path.read_text(encoding="utf-8")

# Predlogi dela
pattern1 = re.compile(r'\[\s*"Betonaža".*?\];', re.DOTALL)
new1 = '''[
  "Betonaža", "Opaženje", "Hidro izolacija", "Toplotna izolacija",
  "Štemanje", "Delo z ostrešjem", "Delo z lesom", "Elektrika",
  "Vodovodne inštalacije", "Priprava / razno", "Razno"
];'''

if pattern1.search(text):
    text = pattern1.sub(new1, text, count=1)
    print("✅ Predlogi dela posodobljeni")
else:
    print("⚠️  Ni najdenega bloka za PREDLOGI DELA — javi to Claudu")

# Predlogi stroškov
pattern2 = re.compile(r'\[\s*"🧱 Beton.*?\];', re.DOTALL)
new2 = '''[
  "🧱 Betonaža", "🪵 Les / opaženje", "🔧 Orodje",
  "🏠 Izolacija", "🚗 Transport", "📦 Material razno"
];'''

if pattern2.search(text):
    text = pattern2.sub(new2, text, count=1)
    print("✅ Predlogi stroškov posodobljeni")
else:
    print("⚠️  Ni najdenega bloka za PREDLOGI STROŠKOV — javi to Claudu")

path.write_text(text, encoding="utf-8")
print("Shranjeno!")
