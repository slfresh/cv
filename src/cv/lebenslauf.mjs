// The printed CV (Lebenslauf): two A4 pages, German, tabular, newest first.
// scripts/build-pdf.mjs renders it to PDF with an installed Chrome/Edge.
//
// RULES
// - Every fact here must also be on the website (src/pages/content.mjs). Both come from the workplace
//   interview of 2026-09-21: if Slavko has not confirmed it, it does not go in. The build script compares
//   the dates of this file with the website and stops when they drift apart.
// - Honest framing: "ausgebildeter Elektromechaniker", never "erfahrener", never Elektrofachkraft or Meister.
//   Machines and POS systems = user. Software = spare time, built with AI tools.
// - Two variants from one source:
//     public  -> docs/Lebenslauf_Slavko_Grbic.pdf, linked on the website: NO phone number, NO street address
//     private -> written OUTSIDE this repository, with phone and address from a file that is not in git
//
// Wording is shorter than on the website on purpose (two pages). Shorten, never add.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const CV_SITE_URL = 'https://slfresh.github.io/cv/';
export const CV_SITE_LABEL = 'slfresh.github.io/cv';

// ───────────────────────────── content ─────────────────────────────

const profile = [
  'Ich ziehe mit meiner Familie in den Raum Regensburg/Neutraubling und suche dort den Einstieg in den technischen Service.',
  'Seit 2017 richte ich im Martas Hotel 11 bis 20 Veranstaltungen im Monat technisch ein und behebe Störungen im laufenden Betrieb. Davor: Zelt- und Pavillonmontage bei Polster Catering sowie Wartung und Fahrzeugelektrik an Kettenfahrzeugen im Wehrdienst.',
  'In meinem Ausbildungsberuf habe ich seit dem Abschluss nicht gearbeitet – deshalb ist mir eine strukturierte Einarbeitung wichtig, und ich bilde mich gern weiter, zum Beispiel zur Elektrofachkraft für festgelegte Tätigkeiten.',
];

const experience = [
  {
    dates: '04/2017 – heute',
    title: 'Chef de Rang',
    org: 'Martas Hotel (ehem. Luther-Hotel), Lutherstadt Wittenberg',
    context: '3-Sterne Superior · 158 Zimmer · 8 Veranstaltungsräume',
    points: [
      ['Technik', 'Tagungs- und Veranstaltungstechnik für 11 bis 20 Veranstaltungen im Monat eigenständig eingerichtet und bedient: Mischpult, Mikrofone und Beschallung, Beamer und Leinwand, Laptops der Referenten, Eventlicht – einschließlich Störungsbehebung im laufenden Betrieb.'],
      ['Aufbau', 'Räume eigenständig nach Funktionsplan aufgebaut – Tagungen, Bankette und Galas, in der Spitze mit über 200 Gästen.'],
      ['Logistik', 'Warenannahme mit Kontrolle der Lieferscheine; Transport von Technik, Getränken und Material zu externen Veranstaltungsorten.'],
      ['Einarbeitung', 'Neue Kolleginnen und Kollegen sowie Aushilfen in Abläufe, Geräte und Standards eingearbeitet.'],
      ['Geräte', 'Täglicher Umgang mit WMF-Kaffeevollautomat, Spülmaschine und Schankanlage einschließlich täglicher Reinigung; Kassen: Oracle Micros, seit 2025 Gastronovi.'],
      ['Service', 'Gästeservice bei Seminaren, Tagungen und Banketten, im Restaurant und an der Bar; internationale Gäste auf Deutsch und Englisch.'],
    ],
    quote: {
      text: 'Herr Grbic verfügt über eine sehr große Berufserfahrung. Er erledigt seine Aufgaben stets mit äußerster Sorgfalt und Genauigkeit. Sein Verhalten gegenüber Gästen, Vorgesetzten und Kollegen ist stets vorbildlich.',
      source: 'Auszug aus dem Zwischenzeugnis · Martas Hotel',
    },
  },
  {
    dates: '04/2016 – 03/2017',
    title: 'Chef de Rang & Verkäufer',
    org: 'Polster Catering GmbH',
    context: 'Generalcaterer für Landes- und Bundesgartenschauen, Sportevents, Messen und Konzerte',
    points: [
      ['Montage', 'Zelt- und Pavillonkonstruktionen montiert; Mobiliar, Bars und Buffetstrecken auf- und abgebaut – mit Akkuschrauber und Handwerkzeug, Hubwagen und Transporter.'],
      ['Oberhof', 'BMW IBU Weltcup Biathlon (Januar 2017): Auf- und Abbau des Hospitality-Zelts, während der Wettkampftage VIP-Service und Bar.'],
      ['Service', 'Landesgartenschau Eutin: À-la-carte-Restaurant, Bestellungen und Abrechnung mit mobilem Handkassengerät (S-600). Stadien, unter anderem Chemnitz und Zwickau: VIP-Betreuung sowie Verkauf von Speisen und Getränken.'],
    ],
  },
  {
    dates: '03/2015 – 10/2015',
    tag: 'Saison',
    title: 'Chef de Rang',
    org: 'Hotel Amfora Hvar Grand Beach Resort, Kroatien',
    text: 'Service an Pool, Terrassen und Pavillons bei sehr hohem Gästeaufkommen, unter anderem in der Festivalwoche von Ultra Europe; Bar und Kaffeemaschine; Kasse mit Bar- und Kartenzahlung.',
  },
  {
    dates: '11/2012 – 02/2015',
    title: 'Chef de Rang',
    org: 'Restaurant Kod Javora, Osijek, Kroatien · ganzjährig',
    text: 'Service im Restaurant und auf der Terrasse; Weinempfehlungen (Sommelierkurs 1. Stufe, 2013); Bestandskontrolle und Bestellungen bei Lieferanten; Social-Media-Beiträge für das Restaurant; Vertretung des Inhabers bei dessen Abwesenheit.',
  },
  {
    dates: '04/2010 – 09/2012',
    tag: 'Saison',
    title: 'Chef de Rang',
    org: 'Pizzeria Orfej, Osor (Insel Cres), Kroatien',
    text: 'À-la-carte- und Pizzaservice auf stark frequentierten Terrassen; internationale Gäste auf Englisch, Deutsch und Italienisch.',
  },
  {
    dates: '05/2006 – 10/2009',
    tag: 'Saison',
    title: 'Servicekraft',
    org: 'Hotel Vespera, Mali Lošinj, Kroatien',
    text: 'Einstieg als Geschirrspüler, danach Service im Hotelrestaurant.',
    note: 'Hotel Vespera, Pizzeria Orfej und Hotel Amfora waren Saisonbetriebe; in den Wintermonaten dazwischen habe ich kurzfristige Tätigkeiten übernommen.',
  },
  {
    dates: 'bis 04/2006',
    title: 'Zeltbau und Logistik',
    org: 'Circus Nock, Schweiz · mehrere Monate',
    text: 'Zeltauf- und -abbau an wechselnden Spielorten, Bau von Tiergehegen, Verladen und Transport, Tierpflege.',
  },
  {
    dates: '2005',
    title: 'Mechaniker für Kettenfahrzeuge',
    org: 'Wehrdienst, Kroatische Armee · ca. 6 Monate',
    text: 'Regelmäßige Wartung und Prüfungen an Kettenfahrzeugen; Arbeiten an der Fahrzeugelektrik.',
  },
];

const education = [
  {
    dates: '09/2002 – 05/2005',
    title: 'Berufsausbildung zum Elektromechaniker',
    org: 'Gewerbeschule Županja, Kroatien',
    text: 'Abgeschlossene dreijährige Ausbildung mit den Schwerpunkten Elektroinstallation, Elektromotoren und Maschinen sowie Messen und Fehlersuche.',
  },
];

const training = [
  ['2021', 'Brandschutzhelfer', 'CWS Fire Safety'],
  ['2018', 'DEHOGA-Seminar „Gastorientierte Kommunikation im Restaurant“', ''],
  ['2013', 'Sommelierkurs 1. Stufe', 'Kroatischer Sommelier Club'],
];

const skills = [
  ['Tagungstechnik', 'Mischpult mit mehreren Kanälen, Mikrofone und Beschallung, Beamer und Leinwand, Eventlicht – Aufbau, Bedienung und Störungsbehebung vor Ort.'],
  ['Geräte & Kassen', 'Als Anwender: WMF-Kaffeevollautomat, Spülmaschine und Schankanlage; Kassensysteme Oracle Micros, Gastronovi und mobiles Handkassengerät (S-600).'],
  ['Montage & Handwerk', 'Zelt- und Pavillonmontage, Akkuschrauber und Handwerkzeug, Hubwagen, Transporter. 2025 Motorwechsel am eigenen Audi A4 Avant 1.8 TFSI in der Werkstatt eines Freundes: Motor gemeinsam aus- und eingebaut; Kabelbaum und Sensorik, Kühl-, Kraftstoff- und Abgasanlage selbst übernommen.'],
  ['Software', 'In der Freizeit, mit KI-Werkzeugen wie Claude: Fitness-App Fit-Within (React Native, Expo, TypeScript; über 1.200 Commits seit März 2026) und Kartenspiel Bela Štih.'],
];

const languages = [
  ['Kroatisch', 'Muttersprache'],
  ['Deutsch', 'sehr gut'],
  ['Englisch', 'sehr gut'],
  ['Italienisch', 'Grundkenntnisse'],
];

const more = 'Führerschein Klasse B · Arbeiten nach gesetzlichen und betrieblichen Hygienevorschriften · regelmäßiges Krafttraining · Nichtraucher';

// Dates that must also appear on the website (checked by scripts/build-pdf.mjs).
export const CV_DATES = [...experience, ...education].map((e) => e.dates);

// ───────────────────────────── markup ─────────────────────────────

// Text for the page: escaped, and short hyphenated words ("Event-Catering", "aus- und eingebaut") are kept on one
// line. A line that ends in a hyphen is glued together by many text extractors ("EventCatering").
const NOWRAP = /[0-9A-Za-zÀ-ž]+(?:-[0-9A-Za-zÀ-ž]+)+|[0-9A-Za-zÀ-ž]+- (?:und|oder) -?[0-9A-Za-zÀ-ž-]+/g;
const txt = (t) => esc(t).replace(NOWRAP, (m) => (m.length <= 26 ? `<span class="nw">${m}</span>` : m));

const entryHtml = (e) => `        <article class="entry${e.points ? '' : ' entry--short'}">
          <p class="when">${esc(e.dates)}${e.tag ? ` <span class="tag">${esc(e.tag)}</span>` : ''}</p>
          <span class="rail" aria-hidden="true"></span>
          <div class="what">
            <h3>${txt(e.title)}</h3>
            <p class="org">${txt(e.org)}</p>${e.context ? `
            <p class="context">${txt(e.context)}</p>` : ''}${e.points ? `
            <dl class="points">
${e.points.map(([k, v]) => `              <div><dt>${esc(k)}</dt><dd>${txt(v)}</dd></div>`).join('\n')}
            </dl>` : ''}${e.text ? `
            <p class="text">${txt(e.text)}</p>` : ''}${e.quote ? `
            <figure class="quote">
              <blockquote><p><span class="qm">„</span>${txt(e.quote.text)}<span class="qm">“</span></p></blockquote>
              <figcaption>${esc(e.quote.source)}</figcaption>
            </figure>` : ''}${e.note ? `
            <p class="note">${txt(e.note)}</p>` : ''}
          </div>
        </article>`;

/**
 * @param {object} o
 * @param {'public'|'private'} o.variant
 * @param {object} [o.priv]      private data: phone, street, zipCity, birthDate, birthPlace, family
 * @param {string} o.email
 * @param {string} o.updated     "09/2026"
 * @param {string} o.today       "21.09.2026"
 * @param {string} o.css         stylesheet text
 * @param {string} o.fontsUrl    file URL of the fonts folder (with trailing slash)
 * @param {string} o.portraitUrl file URL of the portrait, '' for no photo
 * @param {string} o.qrSvg       QR code of the website as inline SVG
 */
export function renderCv(o) {
  const priv = o.variant === 'private' ? (o.priv || {}) : {};

  // in the blue header: how to reach him
  const contact = [];
  if (priv.phone) contact.push(['Telefon', `<a href="tel:${esc(priv.phone.replace(/[^\d+]/g, ''))}">${esc(priv.phone)}</a>`]);
  contact.push(['E-Mail', `<a href="mailto:${esc(o.email)}">${esc(o.email)}</a>`]);
  if (priv.street || priv.zipCity) contact.push(['Anschrift', [priv.street, priv.zipCity].filter(Boolean).map(esc).join('<br />')]);
  else contact.push(['Wohnort', 'Lutherstadt Wittenberg']);
  contact.push(['Portfolio', `<a href="${CV_SITE_URL}">${CV_SITE_LABEL}</a>`]);

  // the strip under the header: the other personal facts
  const facts = [];
  if (priv.birthDate) facts.push(['Geboren', esc(priv.birthDate) + (priv.birthPlace ? ` in ${esc(priv.birthPlace)}` : '')]);
  else facts.push(['Jahrgang', '1988']);
  if (priv.family) facts.push(['Familienstand', esc(priv.family)]);
  facts.push(['Status', 'Kroatische Staatsangehörigkeit – <span class="nw">EU-Bürger</span>, keine Arbeitserlaubnis erforderlich']);
  facts.push(['Führerschein', 'Klasse B']);
  facts.push(['Umzug', 'in den Raum Regensburg/Neutraubling geplant']);

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>Lebenslauf – Slavko Grbic</title>
  <meta name="author" content="Slavko Grbic" />
  <meta name="description" content="Lebenslauf von Slavko Grbic – ausgebildeter Elektromechaniker, technischer Service und Kundendienst, Raum Regensburg" />
  <style>
    @font-face { font-family: 'Inter'; font-style: normal; font-weight: 100 900; src: url('${o.fontsUrl}inter-latin-ext-wght-normal.woff2') format('woff2-variations'); unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF; }
    @font-face { font-family: 'Inter'; font-style: normal; font-weight: 100 900; src: url('${o.fontsUrl}inter-latin-wght-normal.woff2') format('woff2-variations'); unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD; }
    @font-face { font-family: 'JetBrains Mono'; font-style: normal; font-weight: 100 800; src: url('${o.fontsUrl}jetbrains-mono-latin-ext-wght-normal.woff2') format('woff2-variations'); unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF; }
    @font-face { font-family: 'JetBrains Mono'; font-style: normal; font-weight: 100 800; src: url('${o.fontsUrl}jetbrains-mono-latin-wght-normal.woff2') format('woff2-variations'); unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD; }
${o.css}
  </style>
</head>
<body>
  <header class="head">
    <div class="head-text">
      <p class="kicker">Lebenslauf · Technischer Service · Kundendienst</p>
      <h1>Slavko<br />Grbic</h1>
      <p class="claim">${txt('Ausgebildeter Elektromechaniker · 20 Jahre Praxis in Hotel, Gastronomie und Event-Catering')}</p>
    </div>
    <dl class="contact">
${contact.map(([k, v]) => `      <div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('\n')}
    </dl>${o.portraitUrl ? `
    <img class="portrait" src="${o.portraitUrl}" alt="Porträt von Slavko Grbic" />` : ''}
  </header>

  <dl class="facts">
${facts.map(([k, v]) => `    <div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('\n')}
  </dl>

  <section class="block profile">
    <h2>Profil</h2>
    <p class="lead">${txt(profile[0])}</p>
    <div class="cols">
${profile.slice(1).map((p) => `      <p>${txt(p)}</p>`).join('\n')}
    </div>
  </section>

  <section class="block">
    <h2>Berufserfahrung</h2>
    <div class="entries">
${experience.map(entryHtml).join('\n')}
    </div>
  </section>

  <section class="block">
    <h2>Ausbildung</h2>
    <div class="entries">
${education.map(entryHtml).join('\n')}
    </div>
  </section>

  <section class="block pair keep">
    <div>
      <h2>Weiterbildung</h2>
      <dl class="list">
${training.map(([y, t, by]) => `        <div><dt>${esc(y)}</dt><dd><strong>${txt(t)}</strong>${by ? ` · ${esc(by)}` : ''}</dd></div>`).join('\n')}
      </dl>
    </div>
    <div>
      <h2>Sprachen</h2>
      <dl class="list list--lang">
${languages.map(([k, v]) => `        <div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n')}
      </dl>
    </div>
  </section>

  <section class="block">
    <h2>Kenntnisse</h2>
    <dl class="skills">
${skills.map(([k, v]) => `      <div><dt>${esc(k)}</dt><dd>${txt(v)}</dd></div>`).join('\n')}
    </dl>
  </section>

  <footer class="end keep">
    <div class="end-text">
      <p class="more"><span>Weiteres</span> ${txt(more)}</p>
      <p class="sign">${o.variant === 'private' ? `Lutherstadt Wittenberg, ${esc(o.today)}` : `Stand ${esc(o.updated)}`} · <strong>Slavko Grbic</strong></p>
    </div>
    <a class="qr" href="${CV_SITE_URL}" aria-label="Portfolio im Internet: ${CV_SITE_LABEL}">
      ${o.qrSvg}
      <span><strong>Portfolio mit Fotos und Zeugnissen</strong><br />${CV_SITE_LABEL}</span>
    </a>
  </footer>
</body>
</html>
`;
}
