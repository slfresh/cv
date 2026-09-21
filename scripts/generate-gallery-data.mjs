// Generates js/gallery-data-{de,en}.js and src/generated/galleries.json.
//
// The site no longer shows a photo gallery per employer. It shows a few PROOF photos next to
// the technical claims they support (section "Technik & Qualifikation").
//
// Two rules:
//   1. Only photos listed under "approved" in approved-photos.json are ever published
//      (Slavko's photo audit: his own photos, nobody recognisable).
//   2. A caption describes only what is visible in the photo.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// key -> list of photos; each photo has a German and an English caption (c) and a short label (l)
const PROOF = {
  tagungstechnik: [
    { src: 'images/jobs/martas-hotel/martas-15.png',
      de: { c: 'Martas Hotel: Tagung – Rednerpult mit Mikrofon, Beamer und parlamentarische Bestuhlung', l: 'Rednerpult & Beamer' },
      en: { c: 'Martas Hotel: conference – lectern with microphone, projector and classroom seating', l: 'Lectern & projector' } },
    { src: 'images/jobs/martas-hotel/martas-17.png',
      de: { c: 'Martas Hotel: Tagung in U-Form – Leinwand und Flipchart', l: 'U-Form & Leinwand' },
      en: { c: 'Martas Hotel: U-shape conference – screen and flipchart', l: 'U-shape & screen' } },
    { src: 'images/jobs/martas-hotel/martas-07.png',
      de: { c: 'Martas Hotel: Gala-Saal mit Bühne, Projektion und Eventlicht', l: 'Bühne & Eventlicht' },
      en: { c: 'Martas Hotel: gala hall with stage, projection and event lighting', l: 'Stage & lighting' } },
  ],
  montage: [
    { src: 'images/jobs/polster-catering/polster-01.png',
      de: { c: 'Polster Catering: Aufbau – Metallgerüst eines großen Zeltes auf Holzunterbau', l: 'Zelt-Gerüst' },
      en: { c: 'Polster Catering: build-up – metal frame of a large tent on a timber base', l: 'Tent frame' } },
    { src: 'images/jobs/polster-catering/polster-10.png',
      de: { c: 'Polster Catering: Aufbau eines Pavillons – Stahlrahmen, Bodenplatten, Leitern', l: 'Pavillon-Aufbau' },
      en: { c: 'Polster Catering: pavilion build-up – steel frame, floor panels, ladders', l: 'Pavilion build' } },
    { src: 'images/jobs/polster-catering/polster-oberhof-02.png',
      de: { c: 'Biathlon-Weltcup Oberhof 2017: Hospitality-Zelt mit Rundtischen, Stehtischreihen und Bildschirmen', l: 'Oberhof · Zelt' },
      en: { c: 'Biathlon World Cup Oberhof 2017: hospitality tent with round tables, rows of bar tables and screens', l: 'Oberhof · tent' } },
    { src: 'images/jobs/polster-catering/polster-oberhof-03.png',
      de: { c: 'Biathlon-Weltcup Oberhof 2017: lange Tafelreihen und Lichttechnik im VIP-Zelt', l: 'Oberhof · Lichttechnik' },
      en: { c: 'Biathlon World Cup Oberhof 2017: long table rows and lighting rig in the VIP tent', l: 'Oberhof · lighting rig' } },
  ],
  geraete: [
    { src: 'images/jobs/polster-catering/polster-04.png',
      de: { c: 'Mobiles Handkassengerät (S-600): Bestellungen und Tischabrechnung', l: 'Handkasse S-600' },
      en: { c: 'Handheld POS device (S-600): orders and table billing', l: 'Handheld POS S-600' } },
    { src: 'images/jobs/amfora-hotel/amfora-06.png',
      de: { c: 'Hotel Amfora: Servicebereich mit Getränkekühlung und Kassenstation', l: 'Servicestation' },
      en: { c: 'Hotel Amfora: service area with drinks coolers and POS station', l: 'Service station' } },
  ],
};

// The portraits of himself are always shown (the hero photo opens them in the lightbox).
const PROFIL = [
  { src: 'images/slavko-grbic.jpg',
    de: { c: 'Slavko Grbic – Profilfoto', a: 'Slavko Grbic im dunklen Anzug mit hellblauer Krawatte, Porträt vor hellem Hintergrund', l: 'Profil' },
    en: { c: 'Slavko Grbic – profile photo', a: 'Slavko Grbic in a dark suit with a light blue tie, portrait against a light background', l: 'Profile' } },
  { src: 'images/profil-casual.png',
    de: { c: 'Slavko Grbic – Profilfoto, lässig (Poloshirt)', a: 'Slavko Grbic im Poloshirt, sitzend, Portrait', l: 'Lässig' },
    en: { c: 'Slavko Grbic – casual profile (polo shirt)', a: 'Slavko Grbic in a polo shirt, seated, portrait', l: 'Casual' } },
  { src: 'images/profil-formal.png',
    de: { c: 'Slavko Grbic – Profilfoto, Business-Look', a: 'Slavko Grbic im Anzug mit Krawatte, professionelles Portrait', l: 'Business' },
    en: { c: 'Slavko Grbic – formal business portrait', a: 'Slavko Grbic in a suit and tie, professional portrait', l: 'Business' } },
];

function loadApproved() {
  const file = path.join(root, 'approved-photos.json');
  if (!fs.existsSync(file)) return new Set();
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  return new Set(Array.isArray(data.approved) ? data.approved : []);
}
const approved = loadApproved();

const toItem = (photo, lang, prefix) => ({
  src: prefix + photo.src,
  caption: photo[lang].c,
  alt: (photo[lang].a || photo[lang].c).slice(0, 120),
  label: photo[lang].l,
});

function buildAll(lang, prefix) {
  const out = { profil: PROFIL.map((p) => toItem(p, lang, prefix)) };
  for (const [key, photos] of Object.entries(PROOF)) {
    const usable = photos.filter((p) => approved.has(p.src) && fs.existsSync(path.join(root, p.src)));
    out[key] = usable.map((p) => toItem(p, lang, prefix));
  }
  return out;
}

function serialize(obj, varName) {
  let out = `window.${varName} = {\n`;
  for (const k of Object.keys(obj)) {
    out += `  '${k}': [\n`;
    for (const it of obj[k]) {
      out += `    { src: '${esc(it.src)}', caption: '${esc(it.caption)}', alt: '${esc(it.alt)}', label: '${esc(it.label)}' },\n`;
    }
    out += `  ],\n`;
  }
  out += '};\n';
  return out;
}

const uiDe = `window.GALLERY_UI = {
  prevLabel: 'Vorheriges Bild',
  nextLabel: 'Nächstes Bild',
  counter: function (i, n) { return 'Bild ' + i + ' von ' + n; },
  note: function (total, visible) {
    if (total <= visible) {
      return 'Eigene Aufnahmen · Klick zum Vergrößern';
    }
    return total + ' Fotos insgesamt, ' + visible + ' hier sichtbar · In der Großansicht mit Pfeiltasten oder Wischen blättern';
  },
};
`;

const uiEn = `window.GALLERY_UI = {
  prevLabel: 'Previous image',
  nextLabel: 'Next image',
  counter: function (i, n) { return 'Image ' + i + ' of ' + n; },
  note: function (total, visible) {
    if (total <= visible) {
      return 'My own photos · click to enlarge';
    }
    return total + ' photos total, ' + visible + ' shown here · browse with arrow keys or swipe in the lightbox';
  },
};
`;

const dataDe = buildAll('de', '');
const dataEn = buildAll('en', '../');

fs.mkdirSync(path.join(root, 'js'), { recursive: true });
fs.writeFileSync(path.join(root, 'js', 'gallery-data-de.js'), uiDe + serialize(dataDe, 'JOB_GALLERIES'));
fs.writeFileSync(path.join(root, 'js', 'gallery-data-en.js'), uiEn + serialize(dataEn, 'JOB_GALLERIES'));

// scripts/build.mjs reads these counts and removes every photo block that has no approved photo.
const counts = Object.fromEntries(Object.entries(dataDe).map(([key, items]) => [key, items.length]));
fs.mkdirSync(path.join(root, 'src', 'generated'), { recursive: true });
fs.writeFileSync(path.join(root, 'src', 'generated', 'galleries.json'), JSON.stringify(counts, null, 2) + '\n');

console.log('Wrote js/gallery-data-de.js and js/gallery-data-en.js');
console.log('Photos per block:', JSON.stringify(counts));
