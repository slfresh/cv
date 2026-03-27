import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function buildMartas(lang) {
  const deCap = {
    1: 'Martas Hotel: Gala-Event – Großveranstaltung bis 320 Personen',
    5: 'Martas Hotel: Konferenz – Tagungsraum-Setup',
    9: 'Martas Hotel: Großer Bankett- bzw. Gala-Saal mit Eventlicht (Lutherstadt Wittenberg)',
    12: 'Restaurant Von Bora: Menükarte und formelles Gedeck',
    17: 'Martas Hotel: Tagung in U-Form – Leinwand, Flipchart, AV-Vorbereitung',
    22: 'Stadthalle Lutherstadt Wittenberg: Wittenberger Sportlerball – Bankett und Bühne (jährliche Sportlergala)',
  };
  const enCap = {
    1: 'Martas Hotel: gala event – large-scale function for up to 320 guests',
    5: 'Martas Hotel: conference – meeting room setup',
    9: 'Martas Hotel: large banquet and gala hall with event lighting (Lutherstadt Wittenberg)',
    12: 'Restaurant Von Bora: menu card and formal place setting',
    17: 'Martas Hotel: U-shape conference – screen, flipchart, AV preparation',
    22: 'Stadthalle Lutherstadt Wittenberg: Athletes\' Ball – banquet and stage (annual sports gala)',
  };
  const deLab = { 1: 'Gala bis 320 Gäste', 5: 'Tagung & Setup', 9: 'Bankett / Gala', 12: 'Von Bora', 17: 'AV & U-Tagung', 22: 'Sportlerball' };
  const enLab = { 1: 'Gala up to 320 guests', 5: 'Conference & setup', 9: 'Banquet / gala', 12: 'Von Bora', 17: 'AV & U-shape meeting', 22: 'Athletes\' ball' };
  const cap = lang === 'de' ? deCap : enCap;
  const lab = lang === 'de' ? deLab : enLab;
  const genDe = (i) => `Martas Hotel, Lutherstadt Wittenberg – Betriebsimpression (Foto ${i}/22)`;
  const genEn = (i) => `Martas Hotel, Lutherstadt Wittenberg – on-the-job impression (photo ${i}/22)`;
  const items = [];
  for (let i = 1; i <= 22; i++) {
    const key = String(i).padStart(2, '0');
    const caption = cap[i] || (lang === 'de' ? genDe(i) : genEn(i));
    const alt = caption.replace(/:/g, ' –').slice(0, 120);
    items.push({ src: `images/jobs/martas-hotel/martas-${key}.png`, caption, alt, label: lab[i] || (lang === 'de' ? 'Martas Hotel' : 'Martas Hotel') });
  }
  return items;
}

function buildPolster(lang) {
  const files = [];
  for (let i = 1; i <= 14; i++) files.push(`polster-${String(i).padStart(2, '0')}.png`);
  for (let i = 1; i <= 5; i++) files.push(`polster-oberhof-${String(i).padStart(2, '0')}.png`);

  const de = {
    'polster-01.png': { c: 'Polster Catering: Aufbau – Metallgerüst eines großen Zeltes / Pavillons auf Holzunterbau', l: 'Zelt-Gerüst' },
    'polster-02.png': { c: 'Polster Catering: Team an der Bar – Uniform, professionelles Service-Setup', l: 'Team & Bar' },
    'polster-04.png': { c: 'Mobiles POS (S-600 Handy): Bestellungen und Tischabrechnung', l: 'Mobiles POS' },
    'polster-08.png': { c: 'Großraum-Bestuhlung: Tagung oder Gala im Pavillon', l: 'Großraum-Setup' },
    'polster-09.png': { c: 'Stadion Chemnitz: Catering-Logistik bei Großveranstaltung', l: 'Stadion Chemnitz' },
    'polster-oberhof-01.png': {
      c: 'Polster Catering · BMW IBU Weltcup Biathlon Oberhof (Jan. 2017): Hospitality-Zelt mit gedeckten Rundtischen, Eventbranding, Blick zur Außenlage',
      l: 'Oberhof · VIP-Zelt',
    },
  };
  const en = {
    'polster-01.png': { c: 'Polster Catering: build-up – metal frame of a large tent / pavilion on timber base', l: 'Tent frame' },
    'polster-02.png': { c: 'Polster Catering: team at the bar – uniform, professional service setup', l: 'Team & bar' },
    'polster-04.png': { c: 'Mobile POS (S-600 handheld): orders and table billing', l: 'Mobile POS' },
    'polster-08.png': { c: 'Large-room seating: conference or gala in the pavilion', l: 'Large-room setup' },
    'polster-09.png': { c: 'Chemnitz stadium: catering logistics at a major event', l: 'Chemnitz stadium' },
    'polster-oberhof-01.png': {
      c: 'Polster Catering · BMW IBU Biathlon World Cup Oberhof (Jan 2017): hospitality tent with set round tables, event branding, view towards the outdoor area',
      l: 'Oberhof · VIP tent',
    },
  };
  const map = lang === 'de' ? de : en;
  let n = 0;
  return files.map((f) => {
    n++;
    const m = map[f];
    const caption =
      m?.c ||
      (lang === 'de'
        ? `Polster Catering – Großveranstaltung und Logistik (Motiv ${n}/19)`
        : `Polster Catering – large events and logistics (image ${n}/19)`);
    const label = m?.l || (lang === 'de' ? 'Polster' : 'Polster');
    return {
      src: `images/jobs/polster-catering/${f}`,
      caption,
      alt: caption.slice(0, 100),
      label,
    };
  });
}

function buildAmfora(lang) {
  const de = [
    { c: 'Hotel Amfora Hvar: Außen-Terrasse mit gedeckten Tischen, Lavendel-Dekor, Blick auf Adria und Pakleni-Inseln', l: 'Terrasse · Meerblick' },
    { c: 'Hotel Amfora Hvar – Pool- und Außenbereich (Impression)', l: 'Resort' },
    { c: 'Hotel Amfora: Pool- und Terrassenbereich mit Event-/Sponsor-Branding während der Ultra-Europe-Saison auf Hvar (hohes Gästeaufkommen)', l: 'Pool · Festivalzeit' },
    { c: 'Hotel Amfora Hvar – Lobby- und Barbereich (Impression)', l: 'Hotel' },
    { c: 'Hotel Amfora: Bar mit Espresso-/Kaffee-Station, Spirituosen, Zapfanlage und POS; offener Übergang zur Küche (FOH/BOH)', l: 'Bar · Kaffee & POS' },
    { c: 'Hotel Amfora Hvar – Außenanlage (Impression)', l: 'Außenbereich' },
    {
      c: 'Hotel Amfora: Lobby- bzw. Loungebereich mit Sitzlandschaft, Eis-Theke und Getränkekühlung – familienfreundlicher Resort-Betrieb',
      l: 'Lobby · Lounge',
    },
  ];
  const en = [
    { c: 'Hotel Amfora Hvar: outdoor terrace with set tables, lavender décor, view of the Adriatic and Pakleni Islands', l: 'Terrace · sea view' },
    { c: 'Hotel Amfora Hvar – pool and outdoor area (impression)', l: 'Resort' },
    { c: 'Hotel Amfora: pool and terrace area with event/sponsor branding during the Ultra Europe season on Hvar (high guest volume)', l: 'Pool · festival week' },
    { c: 'Hotel Amfora Hvar – lobby and bar area (impression)', l: 'Hotel' },
    { c: 'Hotel Amfora: bar with espresso/coffee station, spirits, draught system and POS; open pass to kitchen (FOH/BOH)', l: 'Bar · coffee & POS' },
    { c: 'Hotel Amfora Hvar – outdoor grounds (impression)', l: 'Outdoor' },
    {
      c: 'Hotel Amfora: lobby and lounge area with seating, ice-cream counter and drink coolers – family-friendly resort operation',
      l: 'Lobby · lounge',
    },
  ];
  const arr = lang === 'de' ? de : en;
  return arr.map((x, i) => ({
    src: `images/jobs/amfora-hotel/amfora-${String(i + 1).padStart(2, '0')}.png`,
    caption: x.c,
    alt: x.c.slice(0, 90),
    label: x.l,
  }));
}

function buildJavora(lang) {
  const de = [
    {
      c: 'Restaurant Kod Javora Osijek: große Holz-Terrassentafel an der Drau im Abendlicht – Glasware, Getränke, Espresso: typischer Service-Ende einer vollen Runde',
      l: 'Drau · Abendservice',
    },
    { c: 'Kod Javora: traditionelles Schmoren/Kochen in großen Kesseln über offenem Holzfeuer – regionale Hausküche', l: 'Feuer · Kessel' },
    { c: 'Kod Javora, Osijek – Terrasse und Service (Impression)', l: 'Terrasse' },
    {
      c: 'Kod Javora: volle Abend-Terrasse an der Drau mit Lichterketten und Sonnenschirmen (Markenaufdruck Getränkepartner) – hoher Gästedurchsatz',
      l: 'Abend · Hochbetrieb',
    },
    { c: 'Kod Javora, Osijek – Restaurant und Außenbereich (Impression)', l: 'Kod Javora' },
  ];
  const en = [
    {
      c: 'Restaurant Kod Javora, Osijek: large wooden terrace table on the Drava at dusk – glassware, drinks, espresso: typical end-of-service after a full round',
      l: 'Drava · evening',
    },
    { c: 'Kod Javora: traditional braising/cooking in large cauldrons over open wood fire – regional home-style cuisine', l: 'Fire · cauldron' },
    { c: 'Kod Javora, Osijek – terrace and service (impression)', l: 'Terrace' },
    {
      c: 'Kod Javora: full evening terrace on the Drava with string lights and parasols (drink-partner branding) – high guest turnover',
      l: 'Evening · peak',
    },
    { c: 'Kod Javora, Osijek – restaurant and outdoor area (impression)', l: 'Kod Javora' },
  ];
  const arr = lang === 'de' ? de : en;
  return arr.map((x, i) => ({
    src: `images/jobs/kod-javora/javora-${String(i + 1).padStart(2, '0')}.png`,
    caption: x.c,
    alt: x.c.slice(0, 90),
    label: x.l,
  }));
}

function buildOrfej(lang) {
  const de = [
    {
      c: 'Pizzeria Orfej Osor: volle Außen-Terrasse unter Weinlaub – hoher Gästedurchsatz, u.a. bei Sportübertragung am Fernseher',
      l: 'Terrasse · Hochbetrieb',
    },
    { c: 'Pizzeria Orfej: Außenbereich mit Blick auf Marina und Liegeplätze – mediterraner Gastro-Betrieb Osor, Insel Cres', l: 'Marina · Terrasse' },
    { c: 'Pizzeria Orfej: Außenaufsteller Kaffee / Julius Meinl an der Hafenpromenade – Gästeansprache und Tagesgeschäft', l: 'Promenade · Kaffee' },
    {
      c: 'Pizzeria Orfej: gedeckte Außen-Terrasse mit Tischwäsche im steinernen Innenhof – Service-Setup für À-la-carte und Pizza',
      l: 'Hof · Gedeck',
    },
  ];
  const en = [
    {
      c: 'Pizzeria Orfej, Osor: full outdoor terrace under grapevines – high guest turnover, e.g. during sports broadcasts',
      l: 'Terrace · busy',
    },
    { c: 'Pizzeria Orfej: outdoor area with view of the marina and berths – Mediterranean dining, Osor, island of Cres', l: 'Marina · Terrace' },
    { c: 'Pizzeria Orfej: coffee A-board / Julius Meinl on the harbour promenade – guest outreach and daily business', l: 'Promenade · coffee' },
    {
      c: 'Pizzeria Orfej: covered outdoor terrace with table linen in the stone courtyard – service setup for à-la-carte and pizza',
      l: 'Courtyard · setup',
    },
  ];
  const arr = lang === 'de' ? de : en;
  return arr.map((x, i) => ({
    src: `images/jobs/pizzeria-orfej/orfej-${String(i + 1).padStart(2, '0')}.png`,
    caption: x.c,
    alt: x.c.slice(0, 90),
    label: x.l,
  }));
}

function buildVespera(lang) {
  const de = [
    {
      c: 'Hotel Vespera: Familien- und Kinderprogramm auf der Hotelterrasse – DJ, Bühne, Maskottchen, Animationsteam; typische Hochsaison-Atmosphäre',
      l: 'Terrasse · Animation',
    },
    { c: 'Hotel Vespera: Maskottchen und Spielplatz im Kiefernwald nahe Meer – familienfreundliches Resort-Angebot', l: 'Spielplatz · Kids' },
    { c: 'Hotel Vespera: mehrstufiges Pool-Areal mit Liegen, Wasserspielen und Hotelgebäude – zentrale Freizeitzone des Resorts', l: 'Pool · Resort' },
  ];
  const en = [
    {
      c: 'Hotel Vespera: family and kids programme on the hotel terrace – DJ, stage, mascot, animation team; typical high-season atmosphere',
      l: 'Terrace · animation',
    },
    { c: 'Hotel Vespera: mascot and playground in the pine forest near the sea – family-friendly resort offering', l: 'Playground · kids' },
    { c: 'Hotel Vespera: multi-level pool area with sun loungers, water features and hotel building – central leisure zone of the resort', l: 'Pool · Resort' },
  ];
  const arr = lang === 'de' ? de : en;
  return arr.map((x, i) => ({
    src: `images/jobs/hotel-vespera/vespera-${String(i + 1).padStart(2, '0')}.png`,
    caption: x.c,
    alt: x.c.slice(0, 90),
    label: x.l,
  }));
}

function buildNock(lang) {
  const items = [];
  for (let i = 1; i <= 10; i++) {
    const key = String(i).padStart(2, '0');
    let caption, label;
    if (i === 1) {
      caption =
        lang === 'de'
          ? 'Circus Nock: Aufbau – Eingangsbühne mit Leuchtschrift NOCK und Türmen unter Schweizerfahnen'
          : 'Circus Nock: build-up – entrance stage with illuminated NOCK sign and towers under Swiss flags';
      label = lang === 'de' ? 'Aufbau / Marke' : 'Build / brand';
    } else if (i === 6) {
      caption =
        lang === 'de'
          ? 'Circus Nock: Kassen-Trailer «KASSE» und Büro-/Presse-Trailer mit Schriftzug NOCK'
          : 'Circus Nock: box-office trailer and office/press trailer with NOCK branding';
      label = lang === 'de' ? 'Kasse & Büro' : 'Box office & office';
    } else {
      caption =
        lang === 'de'
          ? `Circus Nock, Schweiz – Aufbau und Betrieb (Impression ${i}/10)`
          : `Circus Nock, Switzerland – build and operations (impression ${i}/10)`;
      label = lang === 'de' ? 'Circus Nock' : 'Circus Nock';
    }
    items.push({
      src: `images/jobs/circus-nock/nock-${key}.png`,
      caption,
      alt: caption.slice(0, 100),
      label,
    });
  }
  return items;
}

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

const jobsDe = {
  profil: buildProfil('de'),
  martas: buildMartas('de'),
  polster: buildPolster('de'),
  amfora: buildAmfora('de'),
  javora: buildJavora('de'),
  orfej: buildOrfej('de'),
  vespera: buildVespera('de'),
  nock: buildNock('de'),
};

const jobsEn = {
  profil: prefixPaths(buildProfil('en'), '../'),
  martas: prefixPaths(buildMartas('en'), '../'),
  polster: prefixPaths(buildPolster('en'), '../'),
  amfora: prefixPaths(buildAmfora('en'), '../'),
  javora: prefixPaths(buildJavora('en'), '../'),
  orfej: prefixPaths(buildOrfej('en'), '../'),
  vespera: prefixPaths(buildVespera('en'), '../'),
  nock: prefixPaths(buildNock('en'), '../'),
};

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
console.log('Wrote js/gallery-data-de.js and js/gallery-data-en.js');
