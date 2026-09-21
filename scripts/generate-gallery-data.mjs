import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// ── Captions ────────────────────────────────────────────────────────────────────
// Rule: a caption describes only what is visible in the photo – no numbers or claims
// that the picture itself does not show. Entries for photos that are not (yet) in
// approved-photos.json are harmless: they are filtered out before publishing.
function fromMap(folder, map, lang) {
  return Object.keys(map).map((file) => {
    const m = map[file][lang];
    return { src: `images/jobs/${folder}/${file}`, caption: m.c, alt: m.c.slice(0, 120), label: m.l };
  });
}

const MARTAS = {
  'martas-01.png': { de: { c: 'Martas Hotel: Gala-Abend im großen Saal – eingedeckte Rundtische, Bühne und Eventlicht', l: 'Gala-Abend' }, en: { c: 'Martas Hotel: gala evening in the main hall – set round tables, stage and event lighting', l: 'Gala evening' } },
  'martas-02.png': { de: { c: 'Martas Hotel: Bankett mit runden Tischen und Leinwand', l: 'Bankett' }, en: { c: 'Martas Hotel: banquet with round tables and projection screen', l: 'Banquet' } },
  'martas-03.png': { de: { c: 'Martas Hotel: Sektempfang – Stehtisch mit Gläsern, Sekt auf Eis', l: 'Empfang' }, en: { c: 'Martas Hotel: sparkling-wine reception – bar table with glasses, bottles on ice', l: 'Reception' } },
  'martas-04.png': { de: { c: 'Martas Hotel: Buffet-Station mit Chafing Dishes, Geschirr und Kaffeestation', l: 'Buffet' }, en: { c: 'Martas Hotel: buffet station with chafing dishes, crockery and coffee station', l: 'Buffet' } },
  'martas-05.png': { de: { c: 'Martas Hotel: lange Tafel im Tagungsraum', l: 'Tafel' }, en: { c: 'Martas Hotel: long table in a meeting room', l: 'Long table' } },
  'martas-06.png': { de: { c: 'Martas Hotel: Abendveranstaltung mit Eventlicht – Rundtische, Stehtische, Garderobe', l: 'Eventlicht' }, en: { c: 'Martas Hotel: evening event with event lighting – round tables, bar tables, cloakroom', l: 'Event lighting' } },
  'martas-07.png': { de: { c: 'Martas Hotel: Gala-Saal mit Bühne, Projektion und eingedeckten Tischen', l: 'Gala & Bühne' }, en: { c: 'Martas Hotel: gala hall with stage, projection and set tables', l: 'Gala & stage' } },
  'martas-08.png': { de: { c: 'Martas Hotel: Grundaufbau mit runden Tischen im Saal', l: 'Grundaufbau' }, en: { c: 'Martas Hotel: basic set-up with round tables in the hall', l: 'Basic set-up' } },
  'martas-15.png': { de: { c: 'Martas Hotel: Tagung – Rednerpult mit Mikrofon, Beamer und parlamentarische Bestuhlung', l: 'Tagungstechnik' }, en: { c: 'Martas Hotel: conference – lectern with microphone, projector and classroom seating', l: 'Conference AV' } },
  'martas-16.png': { de: { c: 'Martas Hotel: Tagung mit Podium und parlamentarischer Bestuhlung', l: 'Podium' }, en: { c: 'Martas Hotel: conference with panel table and classroom seating', l: 'Panel' } },
  'martas-17.png': { de: { c: 'Martas Hotel: Tagung in U-Form – Leinwand und Flipchart', l: 'U-Form' }, en: { c: 'Martas Hotel: U-shape conference – screen and flipchart', l: 'U-shape' } },
  'martas-18.png': { de: { c: 'Martas Hotel: Glühwein-Stand im Außenbereich zur Weihnachtszeit', l: 'Winter-Event' }, en: { c: 'Martas Hotel: mulled-wine stand outdoors at Christmas time', l: 'Winter event' } },
  'martas-19.png': { de: { c: 'Martas Hotel: Dekor-Element – Raumteiler aus Birkenstämmen auf rollbarer Palette', l: 'Dekor' }, en: { c: 'Martas Hotel: décor element – room divider made of birch trunks on a wheeled pallet', l: 'Décor' } },
  'martas-20.png': { de: { c: 'Martas Hotel: Empfang im Innenhof – Gläser, Getränkekühlung, Stehtische', l: 'Innenhof' }, en: { c: 'Martas Hotel: reception in the courtyard – glasses, drinks cooler, bar tables', l: 'Courtyard' } },
  'martas-21.png': { de: { c: 'Martas Hotel: Raumteiler aus Birkenstämmen im Restaurantbereich', l: 'Raumteiler' }, en: { c: 'Martas Hotel: birch-trunk room divider in the restaurant area', l: 'Room divider' } },
  'martas-22.png': { de: { c: 'Stadthalle Lutherstadt Wittenberg: Wittenberger Sportlerball – lange Tafeln und Bühne', l: 'Sportlerball' }, en: { c: "Stadthalle Lutherstadt Wittenberg: Athletes' Ball – long tables and stage", l: "Athletes' ball" } },
};

const POLSTER = {
  'polster-01.png': { de: { c: 'Polster Catering: Aufbau – Metallgerüst eines großen Zeltes auf Holzunterbau', l: 'Zelt-Gerüst' }, en: { c: 'Polster Catering: build-up – metal frame of a large tent on a timber base', l: 'Tent frame' } },
  'polster-03.png': { de: { c: 'Polster Catering: Biergarten-Betrieb am Festzelt', l: 'Biergarten' }, en: { c: 'Polster Catering: beer-garden service next to the marquee', l: 'Beer garden' } },
  'polster-04.png': { de: { c: 'Mobiles Kassengerät (S-600 Handy): Bestellungen und Tischabrechnung', l: 'Mobiles POS' }, en: { c: 'Handheld POS device (S-600): orders and table billing', l: 'Handheld POS' } },
  'polster-05.png': { de: { c: 'Polster Catering: Außenbestuhlung am See vor Betriebsbeginn', l: 'Außenbereich' }, en: { c: 'Polster Catering: outdoor seating by the lake before opening', l: 'Outdoor area' } },
  'polster-06.png': { de: { c: 'Polster Catering: Buffet-Aufbau im Pavillon', l: 'Buffet-Aufbau' }, en: { c: 'Polster Catering: buffet set-up in the pavilion', l: 'Buffet set-up' } },
  'polster-07.png': { de: { c: 'Polster Catering: Blick aus dem Pavillon auf die Außengastronomie', l: 'Pavillon' }, en: { c: 'Polster Catering: view from the pavilion to the outdoor seating', l: 'Pavilion' } },
  'polster-08.png': { de: { c: 'Polster Catering: À-la-carte-Restaurant im Pavillon – eingedeckte Tische', l: 'Restaurant' }, en: { c: 'Polster Catering: à-la-carte restaurant in the pavilion – set tables', l: 'Restaurant' } },
  'polster-09.png': { de: { c: 'Stadion Chemnitz – Einsatzort für VIP-Betreuung und Verkauf', l: 'Stadion Chemnitz' }, en: { c: 'Chemnitz stadium – venue for VIP service and sales', l: 'Chemnitz stadium' } },
  'polster-10.png': { de: { c: 'Polster Catering: Aufbau eines Pavillons – Stahlrahmen, Bodenplatten, Leitern', l: 'Pavillon-Aufbau' }, en: { c: 'Polster Catering: pavilion build-up – steel frame, floor panels, ladders', l: 'Pavilion build' } },
  'polster-11.png': { de: { c: 'Polster Catering: Buffet mit kalten Platten', l: 'Buffet' }, en: { c: 'Polster Catering: buffet with cold platters', l: 'Buffet' } },
  'polster-12.png': { de: { c: 'Polster Catering: Blick von der Terrasse auf die Open-Air-Bühne mit Tontechnik am See', l: 'Open-Air' }, en: { c: 'Polster Catering: view from the terrace to the open-air stage with sound equipment by the lake', l: 'Open air' } },
  'polster-13.png': { de: { c: 'Polster Catering: lange Buffetstrecke im Pavillon vor Veranstaltungsbeginn', l: 'Buffetstrecke' }, en: { c: 'Polster Catering: long buffet line in the pavilion before the event', l: 'Buffet line' } },
  'polster-14.png': { de: { c: 'Stadion – Blick von der Tribüne vor Spielbeginn', l: 'Stadion' }, en: { c: 'Stadium – view from the stand before kick-off', l: 'Stadium' } },
  'polster-oberhof-01.png': { de: { c: 'BMW IBU Weltcup Biathlon Oberhof (Jan. 2017): Hospitality-Zelt mit gedeckten Rundtischen', l: 'Oberhof · VIP-Zelt' }, en: { c: 'BMW IBU Biathlon World Cup Oberhof (Jan 2017): hospitality tent with set round tables', l: 'Oberhof · VIP tent' } },
  'polster-oberhof-02.png': { de: { c: 'Oberhof: Hospitality-Zelt mit Rundtischen, Stehtischreihen und Bildschirmen', l: 'Oberhof · Zelt' }, en: { c: 'Oberhof: hospitality tent with round tables, rows of bar tables and screens', l: 'Oberhof · tent' } },
  'polster-oberhof-03.png': { de: { c: 'Oberhof: lange Tafelreihen und Lichttechnik im VIP-Zelt', l: 'Oberhof · Tafeln' }, en: { c: 'Oberhof: long table rows and lighting rig in the VIP tent', l: 'Oberhof · tables' } },
  'polster-oberhof-04.png': { de: { c: 'Oberhof: eingedeckte Rundtische und Buffetstrecke', l: 'Oberhof · Buffet' }, en: { c: 'Oberhof: set round tables and buffet line', l: 'Oberhof · buffet' } },
  'polster-oberhof-05.png': { de: { c: 'Oberhof: Buffetstrecke vor Beginn', l: 'Oberhof · Vorbereitung' }, en: { c: 'Oberhof: buffet line before service', l: 'Oberhof · preparation' } },
};

const AMFORA = {
  'amfora-01.png': { de: { c: 'Hotel Amfora Hvar: Außen-Terrasse mit gedeckten Tischen und Blick auf die Adria', l: 'Terrasse · Meerblick' }, en: { c: 'Hotel Amfora Hvar: outdoor terrace with set tables and a view of the Adriatic', l: 'Terrace · sea view' } },
  'amfora-02.png': { de: { c: 'Hotel Amfora Hvar: Pool- und Außenbereich', l: 'Pool' }, en: { c: 'Hotel Amfora Hvar: pool and outdoor area', l: 'Pool' } },
  'amfora-03.png': { de: { c: 'Hotel Amfora: Poolbereich mit Sponsoren-Schirmen in der Ultra-Europe-Saison auf Hvar', l: 'Pool · Festivalzeit' }, en: { c: 'Hotel Amfora: pool area with sponsor parasols during the Ultra Europe season on Hvar', l: 'Pool · festival week' } },
  'amfora-04.png': { de: { c: 'Hotel Amfora Hvar: Poollandschaft von oben – Arbeitsbereich Pool-Service', l: 'Poollandschaft' }, en: { c: 'Hotel Amfora Hvar: the pool landscape from above – the pool-service working area', l: 'Pool landscape' } },
  'amfora-05.png': { de: { c: 'Hotel Amfora: Bar mit Kaffee-Station, Spirituosen, Zapfanlage und Kasse; offener Übergang zur Küche', l: 'Bar · Kaffee & Kasse' }, en: { c: 'Hotel Amfora: bar with coffee station, spirits, draught system and POS; open pass to the kitchen', l: 'Bar · coffee & POS' } },
  'amfora-06.png': { de: { c: 'Hotel Amfora: Servicebereich mit Getränkekühlung und Kassenstation', l: 'Servicestation' }, en: { c: 'Hotel Amfora: service area with drinks coolers and POS station', l: 'Service station' } },
  'amfora-07.png': { de: { c: 'Hotel Amfora: Lounge mit Sitzecke, Eistruhe und Getränkekühlung', l: 'Lounge' }, en: { c: 'Hotel Amfora: lounge with seating, ice-cream freezer and drinks coolers', l: 'Lounge' } },
};

function buildMartas(lang) { return fromMap('martas-hotel', MARTAS, lang); }
function buildPolster(lang) { return fromMap('polster-catering', POLSTER, lang); }
function buildAmfora(lang) { return fromMap('amfora-hotel', AMFORA, lang); }

function buildProfil(lang) {
  if (lang === 'de') {
    return [
      {
        src: 'images/profil.png',
        caption: 'Slavko Grbic – Profilfoto (Hauptmotiv)',
        alt: 'Slavko Grbic – Profilfoto, freundlicher Blick zur Kamera',
        label: 'Profil',
      },
      {
        src: 'images/profil-casual.png',
        caption: 'Slavko Grbic – Profilfoto, lässig (Poloshirt)',
        alt: 'Slavko Grbic im Poloshirt, sitzend, Portrait',
        label: 'Lässig',
      },
      {
        src: 'images/profil-formal.png',
        caption: 'Slavko Grbic – Profilfoto, Business-Look',
        alt: 'Slavko Grbic im Anzug mit Krawatte, professionelles Portrait',
        label: 'Business',
      },
    ];
  }
  return [
    {
      src: 'images/profil.png',
      caption: 'Slavko Grbic – profile photo (main)',
      alt: 'Slavko Grbic – profile photo, looking at the camera',
      label: 'Profile',
    },
    {
      src: 'images/profil-casual.png',
      caption: 'Slavko Grbic – casual profile (polo shirt)',
      alt: 'Slavko Grbic in a polo shirt, seated, portrait',
      label: 'Casual',
    },
    {
      src: 'images/profil-formal.png',
      caption: 'Slavko Grbic – formal business portrait',
      alt: 'Slavko Grbic in a suit and tie, professional portrait',
      label: 'Business',
    },
  ];
}

function prefixPaths(items, prefix) {
  return items.map((it) => ({
    ...it,
    src: prefix + it.src,
  }));
}

function serializeJobGalleries(obj, varName) {
  const keys = Object.keys(obj);
  let out = `window.${varName} = {\n`;
  for (const k of keys) {
    out += `  '${k}': [\n`;
    for (const it of obj[k]) {
      out += `    { src: '${esc(it.src)}', caption: '${esc(it.caption)}', alt: '${esc(it.alt)}', label: '${esc(it.label)}' },\n`;
    }
    out += `  ],\n`;
  }
  out += '};\n';
  return out;
}

// ── Photo approvals ─────────────────────────────────────────────────────────────
// Only photos Slavko has confirmed as HIS OWN may be published. The list lives in
// approved-photos.json (created with `npm run photo-audit`). No file / not listed = not shown.
// The portraits of himself ("profil") are always kept.
function loadApproved() {
  const file = path.join(root, 'approved-photos.json');
  if (!fs.existsSync(file)) return new Set();
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  return new Set(Array.isArray(data.approved) ? data.approved : []);
}
const approved = loadApproved();
const onlyApproved = (items) => items.filter((it) => approved.has(it.src));

const GALLERY_BUILDERS = {
  martas: buildMartas,
  polster: buildPolster,
  amfora: buildAmfora,
};

function buildAll(lang, prefix) {
  const out = { profil: prefixPaths(buildProfil(lang), prefix) };
  for (const [key, build] of Object.entries(GALLERY_BUILDERS)) {
    out[key] = prefixPaths(onlyApproved(build(lang)), prefix);
  }
  return out;
}

const jobsDe = buildAll('de', '');
const jobsEn = buildAll('en', '../');

const uiDe = `window.GALLERY_UI = {
  prevLabel: 'Vorheriges Bild',
  nextLabel: 'Nächstes Bild',
  counter: function (i, n) { return 'Bild ' + i + ' von ' + n; },
  note: function (total, visible) {
    if (total <= visible) {
      return total + ' Foto' + (total === 1 ? '' : 's') + ' · Klick zum Vergrößern · In der Ansicht mit Pfeiltasten (←/→) oder Wischen blättern';
    }
    return total + ' Fotos insgesamt, ' + visible + ' hier sichtbar · In der Großansicht alle Bilder mit Pfeiltasten oder Wischen durchblättern';
  },
};
`;

const uiEn = `window.GALLERY_UI = {
  prevLabel: 'Previous image',
  nextLabel: 'Next image',
  counter: function (i, n) { return 'Image ' + i + ' of ' + n; },
  note: function (total, visible) {
    if (total <= visible) {
      return total + ' photo' + (total === 1 ? '' : 's') + ' · Click to enlarge · Use arrow keys (←/→) or swipe in the viewer';
    }
    return total + ' photos total, ' + visible + ' shown here · In the lightbox, browse all images with arrow keys or swipe';
  },
};
`;

fs.mkdirSync(path.join(root, 'js'), { recursive: true });
fs.writeFileSync(path.join(root, 'js', 'gallery-data-de.js'), uiDe + serializeJobGalleries(jobsDe, 'JOB_GALLERIES'));
fs.writeFileSync(path.join(root, 'js', 'gallery-data-en.js'), uiEn + serializeJobGalleries(jobsEn, 'JOB_GALLERIES'));

// scripts/build.mjs reads these counts and removes every gallery block that has no approved photo.
const counts = Object.fromEntries(Object.entries(jobsDe).map(([key, items]) => [key, items.length]));
fs.mkdirSync(path.join(root, 'src', 'generated'), { recursive: true });
fs.writeFileSync(path.join(root, 'src', 'generated', 'galleries.json'), JSON.stringify(counts, null, 2) + '\n');

console.log('Wrote js/gallery-data-de.js and js/gallery-data-en.js');
console.log('Approved photos per gallery:', JSON.stringify(counts));
