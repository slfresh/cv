// Single bilingual source for the page body. scripts/build.mjs calls renderContent('de' | 'en').
// Every factual statement here was confirmed by Slavko in the workplace interview of 2026-09-21.
// Rule for future edits: if he has not confirmed it, it does not go in.
//
// Styling lives in src/css/input.css (design "Space": black and white frames in a 3D canvas).
// Structure: group (a chapter: 01 Profil, 02 Technik …) > frame (one sheet of content).
// On large screens js/space.js lays the frames out sideways in 3D; everywhere else (phones, print,
// reduced motion, no JavaScript) the same markup is a normal vertical document.
// The helpers below are the only places that carry markup, so a visual change never
// needs to touch the texts.

import { ICON } from '../icons.mjs';

export function renderContent(lang) {
  const de = lang === 'de';
  const t = (a, b) => (de ? a : b);
  const root = de ? '' : '../';

  const pad = (n) => String(n).padStart(2, '0');
  let groupNo = 0;
  let frameNo = 0;

  // A chapter. "build" is a function so the chapter number is known before its frames are numbered.
  const group = (id, title, build, { desc = '', cls = '' } = {}) => {
    groupNo += 1;
    frameNo = 0;
    const num = pad(groupNo);
    const frames = build();
    return `    <section class="group${cls}" id="${id}" aria-labelledby="${id}-title">
      <header class="group-head js-frame" data-kind="marker" data-title="${num} · ${title}">
        <span class="group-no" aria-hidden="true">${num}</span>
        <div class="group-text">
          <h2 class="group-title" id="${id}-title">${title}</h2>${desc ? `
          <p class="group-desc">${desc}</p>` : ''}
          <p class="group-count label" aria-hidden="true">${pad(frames.length)} ${frames.length === 1 ? t('Blatt', 'sheet') : t('Blätter', 'sheets')}</p>
        </div>
      </header>
${frames.join('\n')}
    </section>`;
  };

  // One sheet. "flow" sheets grow sideways in newspaper columns on the canvas (js/space.js sets the width).
  const frame = ({ id = '', label, body, cls = '', flow = true }) => {
    frameNo += 1;
    const no = `${pad(groupNo)}.${frameNo}`;
    return `      <article class="frame js-frame${flow ? ' frame--flow' : ''}${cls ? ` ${cls}` : ''}"${id ? ` id="${id}"` : ''} data-title="${label}">
        <p class="frame-label" aria-hidden="true"><span>${no}</span> ${label}</p>
        <div class="frame-body">${body}
        </div>
      </article>`;
  };

  // one row of a work-experience entry: "KEY   text". Without a key it is a plain dash row.
  const row = (key, text) => (key
    ? `            <li><span class="k">${key}</span><span class="v">${text}</span></li>`
    : `            <li class="plain"><span class="v">${text}</span></li>`);

  const entry = ({ id, dates, tag = '', title, org, context = '', rows, extra = '' }) => frame({
    id,
    label: `${org.split(',')[0]} · ${dates}`,
    cls: 'frame--xp',
    body: `
          <p class="xp-date">${dates}${tag ? ` <span class="tag">${tag}</span>` : ''}</p>
          <h3 class="frame-title">${title}</h3>
          <p class="frame-org">${org}</p>${context ? `
          <p class="frame-context">${context}</p>` : ''}
          <ul class="rows">
${rows.join('\n')}
          </ul>${extra}`,
  });

  // A photo block only renders when its photos are in approved-photos.json (markers handled by build.mjs).
  const proof = (key, grid) => `
          <!-- gallery:${key} -->
          <div class="no-print frame-gallery" data-job-gallery="${key}" data-grid-class="${grid}"></div>
          <!-- /gallery:${key} -->`;

  const tech = ({ meta, title, text, gallery = '' }) => frame({
    label: title,
    cls: 'frame--tech',
    body: `
          <p class="label">${meta}</p>
          <h3 class="frame-title">${title}</h3>
          <p>${text}</p>${gallery}`,
  });

  const project = (no, title, text, link) => frame({
    label: `${t('Projekt', 'Project')} ${no}`,
    cls: 'frame--blue frame--project',
    body: `
          <p class="label">${t('Projekt', 'Project')} ${no}</p>
          <h3 class="frame-title">${title}</h3>
          <p>${text}</p>${link ? `
          <p><a class="more" href="${link.href}">${link.text} ${ICON.right}</a></p>` : ''}`,
  });

  const doc = (href, title, sub) => `          <a class="doc" href="${root}${href}" target="_blank" rel="noopener noreferrer">
            <span class="label">PDF</span>
            <span><span class="doc-title block">${title}</span><span class="doc-sub block">${sub}</span></span>
            <span class="doc-arrow no-print">${ICON.upRight}</span>
          </a>`;

  // ───────────────────────────── 01 PROFIL ─────────────────────────────
  const profil = group('profil', t('Profil', 'Profile'), () => [frame({
    label: t('Kurzprofil', 'Summary'),
    cls: 'frame--prose',
    body: `
        <p class="lead-xl">
          ${t(
            'Ausgebildeter Elektromechaniker mit 20 Jahren Praxis in Hotellerie, Gastronomie und Event-Catering – mit wachsendem Schwerpunkt auf Technik, Aufbau und Logistik.',
            'Trained electromechanic with 20 years of hands-on experience in hotels, restaurants and event catering – with a growing focus on technology, set-up and logistics.'
          )}
        </p>
        <p>
          ${t(
            'Seit 2017 im Martas Hotel Lutherstadt Wittenberg: Ich richte 11 bis 20 Veranstaltungen im Monat technisch ein – Mischpult und Mikrofone, Beamer, Laptops der Referenten, Eventlicht – und baue Räume eigenständig nach Funktionsplan auf.',
            'At Martas Hotel Lutherstadt Wittenberg since 2017: I set up the technology for 11 to 20 events a month – mixing desk and microphones, projector, speakers’ laptops, event lighting – and build rooms on my own from the function sheet.'
          )}
        </p>
        <p>
          ${t(
            'Davor: Zelt- und Pavillonmontage bei Polster Catering sowie Wartung und Fahrzeugelektrik an Kettenfahrzeugen im Wehrdienst. Privat schraube ich am eigenen Auto und entwickle eine Fitness-App (React Native, TypeScript).',
            'Before that: assembling tents and pavilions at Polster Catering, and maintenance and vehicle electrics on tracked vehicles during military service. In my own time I work on my car and build a fitness app (React Native, TypeScript).'
          )}
        </p>
        <p>
          ${t(
            'Ich ziehe mit meiner Familie in den Raum Regensburg/Neutraubling und suche dort den Einstieg in den technischen Service. In meinem Ausbildungsberuf habe ich seit dem Abschluss nicht gearbeitet – deshalb ist mir eine strukturierte Einarbeitung wichtig, und ich bilde mich gern weiter, zum Beispiel zur Elektrofachkraft für festgelegte Tätigkeiten.',
            'I am moving with my family to the Regensburg/Neutraubling area and am looking for an entry into technical service there. I have not worked in my trained profession since qualifying – so structured onboarding matters to me, and I am glad to qualify further, for example as an <span lang="de">Elektrofachkraft für festgelegte Tätigkeiten</span>.'
          )}
        </p>
        <dl class="spec">
          <div><dt>${t('Sprachen', 'Languages')}</dt><dd>${t(
            'Kroatisch (Muttersprache) · Deutsch sehr gut · Englisch sehr gut · Italienisch Grundkenntnisse',
            'Croatian (native) · German fluent · English fluent · basic Italian'
          )}</dd></div>
          <div><dt>${t('Persönliches', 'Personal')}</dt><dd>${t(
            'Regelmäßiges Krafttraining · Nichtraucher',
            'Regular strength training · non-smoker'
          )}</dd></div>
        </dl>`,
  })]);

  // ─────────────────────── 02 TECHNIK & QUALIFIKATION ───────────────────────
  const technik = group('technik', t('Technik &amp; Qualifikation', 'Technical skills &amp; qualifications'), () => [
tech({
  meta: t('Berufsausbildung · Gewerbeschule Županja, Kroatien · 09/2002 – 05/2005', 'Vocational training · Trade school Županja, Croatia · 09/2002 – 05/2005'),
  title: t('Elektromechaniker', 'Electromechanic'),
  text: t(
    'Dreijährige Ausbildung mit den Schwerpunkten Elektroinstallation, Elektromotoren und Maschinen sowie Messen und Fehlersuche. Seit dem Abschluss nicht im Beruf tätig – eine Weiterbildung, etwa zur Elektrofachkraft für festgelegte Tätigkeiten, mache ich gern.',
    'Three-year training focused on electrical installation, electric motors and machines, measuring and fault finding. I have not worked in the trade since qualifying – I am glad to take further training, for example as an <span lang="de">Elektrofachkraft für festgelegte Tätigkeiten</span>.'
  ),
}),
tech({
  meta: t('Wehrdienst · Kroatische Armee · 2005 · ca. 6 Monate', 'Military service · Croatian Army · 2005 · approx. 6 months'),
  title: t('Mechaniker für Kettenfahrzeuge', 'Mechanic for tracked vehicles'),
  text: t(
    'Regelmäßige Wartung und Prüfungen an Kettenfahrzeugen sowie Arbeiten an der Fahrzeugelektrik.',
    'Scheduled maintenance and inspections on tracked vehicles, and work on vehicle electrics.'
  ),
}),
tech({
  meta: t('Martas Hotel · seit 2017 · 11 bis 20 Veranstaltungen im Monat', 'Martas Hotel · since 2017 · 11 to 20 events a month'),
  title: t('Tagungs- und Veranstaltungstechnik', 'Conference and event technology'),
  text: t(
    'Aufbau und Bedienung in Eigenregie: Mischpult mit mehreren Kanälen, Mikrofone und Beschallung, Beamer und Leinwand, Eventlicht. Laptops der Referenten anschließen und Störungen wie „kein Bild“ oder „kein Ton“ direkt vor Ort beheben.',
    'Set up and operated on my own: multi-channel mixing desk, microphones and sound system, projector and screen, event lighting. Connecting speakers’ laptops and fixing problems such as “no picture” or “no sound” on the spot.'
  ),
  gallery: proof('tagungstechnik', 'grid grid-cols-2 gap-2'),
}),
tech({
  meta: t('Polster Catering 2016 – 2017 · Circus Nock 2006', 'Polster Catering 2016 – 2017 · Circus Nock 2006'),
  title: t('Montage, Auf- und Abbau', 'Assembly, build-up and teardown'),
  text: t(
    'Zelt- und Pavillonkonstruktionen montiert, Mobiliar, Bars und Buffetstrecken aufgebaut – mit Akkuschrauber und Handwerkzeug, Hubwagen und Transporter. Beim Biathlon-Weltcup in Oberhof 2017 Auf- und Abbau des Hospitality-Zelts; beim Circus Nock Zeltbau an wechselnden Spielorten.',
    'Assembled tent and pavilion structures and set up furniture, bars and buffet lines – using cordless and hand tools, pallet truck and van. Build-up and teardown of the hospitality tent at the Biathlon World Cup in Oberhof 2017; tent construction at changing venues with Circus Nock.'
  ),
  gallery: proof('montage', 'grid grid-cols-2 gap-2'),
}),
tech({
  meta: t('20 Jahre Praxis als Anwender', '20 years as an operator'),
  title: t('Geräte und Kassensysteme', 'Machines and POS systems'),
  text: t(
    'Kaffeevollautomat von WMF, Spülmaschine und Schankanlage einschließlich täglicher Reinigung. Kassensysteme: Oracle Micros, seit 2025 Gastronovi; bei Polster Catering ein mobiles Handkassengerät <span class="whitespace-nowrap">(S-600)</span>. Ich weiß, was ein Geräteausfall im laufenden Betrieb bedeutet.',
    'WMF fully automatic coffee machine, dishwasher and draught system, including daily cleaning. POS systems: Oracle Micros, Gastronovi since 2025; at Polster Catering a handheld POS device <span class="whitespace-nowrap">(S-600)</span>. I know what equipment downtime means in the middle of service.'
  ),
  gallery: proof('geraete', 'grid grid-cols-2 gap-2'),
}),
tech({
  meta: t('2025 · eigener Audi A4 Avant 1.8 TFSI', '2025 · my own Audi A4 Avant 1.8 TFSI'),
  title: t('Handwerkliche Praxis: Motorwechsel', 'Hands-on practice: engine replacement'),
  text: t(
    'In der Werkstatt eines Freundes: Motor gemeinsam aus- und eingebaut. Kabelbaum und Sensorik, Kühl-, Kraftstoff- und Abgasanlage, Betriebsflüssigkeiten und Erstinbetriebnahme habe ich selbst übernommen.',
    'In a friend’s workshop: engine removed and fitted together. I did the wiring harness and sensors, the cooling, fuel and exhaust systems, the fluids and the first start myself.'
  ),
}),
tech({
  meta: t('Kurse und Nachweise', 'Courses and certificates'),
  title: t('Weitere Qualifikationen', 'Further qualifications'),
  text: t(
    'Brandschutzhelfer (CWS Fire Safety, 2021) · Führerschein Klasse B · DEHOGA-Seminar „Gastorientierte Kommunikation im Restaurant“ (2018) · Sommelierkurs 1. Stufe (Kroatischer Sommelier Club, 2013) · Arbeiten nach gesetzlichen und betrieblichen Hygienevorschriften.',
    'Fire safety assistant (CWS Fire Safety, 2021) · driving licence category B · DEHOGA seminar “Guest-oriented communication in the restaurant” (2018) · sommelier course level 1 (Croatian Sommelier Club, 2013) · working to statutory and in-house hygiene regulations.'
  ),
}),
  ]);

  // ─────────────────────────── 03 BERUFSERFAHRUNG ───────────────────────────
  // the quote from the interim reference is a sheet of its own, right after the Martas entry
  const zeugnis = () => frame({
    label: t('Zwischenzeugnis', 'Employer reference'),
    cls: 'frame--blue frame--quote',
    body: `
          <figure class="quote">
            <blockquote${de ? '' : ' lang="de"'}>
            <p><span class="qm qm--open">&bdquo;</span>Herr Grbic verfügt über eine sehr große Berufserfahrung. Er erledigt seine Aufgaben stets mit äußerster Sorgfalt und Genauigkeit. Sein Verhalten gegenüber Gästen, Vorgesetzten und Kollegen ist stets vorbildlich.<span class="qm qm--close">&ldquo;</span></p>
            </blockquote>
            <figcaption class="label">${t('Auszug aus dem Zwischenzeugnis · Martas Hotel', 'Excerpt from the interim reference (Zwischenzeugnis) · Martas Hotel')}</figcaption>
          </figure>`,
  });

  const season = t('Saison', 'seasonal');

  const erfahrung = group('erfahrung', t('Berufserfahrung', 'Work experience'), () => [
entry({
  id: 'job-martas',
  dates: t('04/2017 – heute', '04/2017 – present'),
  tag: t('aktuell', 'current'),
  title: 'Chef de Rang',
  org: t('Martas Hotel (ehem. Luther-Hotel), Lutherstadt Wittenberg', 'Martas Hotel (formerly Luther-Hotel), Lutherstadt Wittenberg'),
  context: t('3-Sterne Superior · 158 Zimmer · 8 Veranstaltungsräume', '3-star superior · 158 rooms · 8 event rooms'),
  rows: [
    row(t('Technik', 'Technology'), t(
      'Tagungs- und Veranstaltungstechnik für 11 bis 20 Veranstaltungen im Monat eigenständig eingerichtet und bedient: Mischpult, Mikrofone und Beschallung, Beamer und Leinwand, Laptops der Referenten, Eventlicht – einschließlich Störungsbehebung im laufenden Betrieb.',
      'Set up and operated conference and event technology on my own for 11 to 20 events a month: mixing desk, microphones and sound system, projector and screen, speakers’ laptops, event lighting – including troubleshooting while the event is running.'
    )),
    row(t('Aufbau', 'Set-up'), t(
      'Räume eigenständig nach Funktionsplan aufgebaut – Tagungen, Bankette und Galas, in der Spitze mit über 200 Gästen.',
      'Built rooms on my own from the function sheet – conferences, banquets and galas, the largest with more than 200 guests.'
    )),
    row(t('Logistik', 'Logistics'), t(
      'Warenannahme mit Kontrolle der Lieferscheine; Transport von Technik, Getränken und Material zu externen Veranstaltungsorten.',
      'Receiving goods and checking delivery notes; transporting equipment, drinks and material to external venues.'
    )),
    row(t('Einarbeitung', 'Training'), t(
      'Neue Kolleginnen und Kollegen sowie Aushilfen in Abläufe, Geräte und Standards eingearbeitet.',
      'Trained new colleagues and temporary staff in processes, equipment and standards.'
    )),
    row(t('Geräte', 'Equipment'), t(
      'Täglicher Umgang mit WMF-Kaffeevollautomat, Spülmaschine und Schankanlage einschließlich täglicher Reinigung; Kassensysteme Oracle Micros und seit 2025 Gastronovi.',
      'Daily work with a WMF fully automatic coffee machine, dishwasher and draught system, including daily cleaning; POS systems Oracle Micros and, since 2025, Gastronovi.'
    )),
    row(t('Service', 'Service'), t(
      'Gästeservice bei Seminaren, Tagungen und Banketten, im Restaurant und an der Bar; internationale Gäste auf Deutsch und Englisch.',
      'Guest service at seminars, conferences and banquets, in the restaurant and at the bar; international guests in German and English.'
    )),
  ],
}),

zeugnis(),

entry({
  id: 'job-polster',
  dates: '04/2016 – 03/2017',
  title: t('Chef de Rang &amp; Verkäufer', 'Chef de Rang &amp; sales'),
  org: 'Polster Catering GmbH',
  context: t('Generalcaterer für Landes- und Bundesgartenschauen, Sportevents, Messen und Konzerte', 'General caterer for state and federal garden shows, sports events, trade fairs and concerts'),
  rows: [
    row(t('Montage', 'Assembly'), t(
      'Zelt- und Pavillonkonstruktionen montiert; Mobiliar, Bars und Buffetstrecken auf- und abgebaut – mit Akkuschrauber und Handwerkzeug, Hubwagen und Transporter.',
      'Assembled tent and pavilion structures; built up and took down furniture, bars and buffet lines – using cordless and hand tools, pallet truck and van.'
    )),
    row('Oberhof', t(
      'BMW IBU Weltcup Biathlon (Januar 2017): Auf- und Abbau des Hospitality-Zelts, während der Wettkampftage VIP-Service und Bar.',
      'BMW IBU Biathlon World Cup (January 2017): build-up and teardown of the hospitality tent, VIP service and bar during the race days.'
    )),
    row('Eutin', t(
      'Landesgartenschau: Service im À-la-carte-Restaurant; Bestellungen und Abrechnung mit mobilem Handkassengerät <span class="whitespace-nowrap">(S-600)</span>.',
      'State garden show: service in the à-la-carte restaurant; orders and billing with a handheld POS device <span class="whitespace-nowrap">(S-600)</span>.'
    )),
    row(t('Stadien', 'Stadiums'), t(
      'Unter anderem Chemnitz und Zwickau: VIP-Betreuung sowie Verkauf von Speisen und Getränken.',
      'Including Chemnitz and Zwickau: VIP service and sales of food and drinks.'
    )),
  ],
}),

entry({
  id: 'job-amfora',
  dates: '03/2015 – 10/2015',
  tag: season,
  title: 'Chef de Rang',
  org: t('Hotel Amfora Hvar Grand Beach Resort, Kroatien', 'Hotel Amfora Hvar Grand Beach Resort, Croatia'),
  context: t('Resorthotel mit großer Pool- und Außenanlage', 'Resort hotel with a large pool and outdoor area'),
  rows: [
    row('', t(
      'Service an Pool, Terrassen und Pavillons bei sehr hohem Gästeaufkommen, unter anderem in der Festivalwoche von Ultra Europe.',
      'Service at the pool, terraces and pavilions with very high guest numbers, including the Ultra Europe festival week.'
    )),
    row('', t(
      'Bar und Kaffeemaschine; Kasse mit Bar- und Kartenzahlung; Schichten in Lobby und Restaurant.',
      'Bar and coffee machine; till with cash and card payments; shifts in the lobby and restaurant.'
    )),
    row('', t(
      'Internationale Gäste auf Englisch, Deutsch und Italienisch.',
      'International guests in English, German and Italian.'
    )),
  ],
}),

entry({
  id: 'job-javora',
  dates: '11/2012 – 02/2015',
  title: 'Chef de Rang',
  org: t('Restaurant Kod Javora, Osijek, Kroatien', 'Restaurant Kod Javora, Osijek, Croatia'),
  context: t('Traditionelles Restaurant mit großer Terrasse an der Drau · ganzjährig', 'Traditional restaurant with a large terrace on the river Drava · all year'),
  rows: [
    row('', t(
      'Service im Restaurant und auf der Terrasse; Weinempfehlungen (Sommelierkurs 1. Stufe, 2013).',
      'Service in the restaurant and on the terrace; wine recommendations (sommelier course level 1, 2013).'
    )),
    row('', t(
      'Bestandskontrolle und Bestellungen bei Lieferanten.',
      'Stock checks and ordering from suppliers.'
    )),
    row('', t(
      'Social-Media-Beiträge für das Restaurant; Vertretung des Inhabers bei dessen Abwesenheit.',
      'Social media posts for the restaurant; standing in for the owner when he was away.'
    )),
  ],
}),

entry({
  id: 'job-orfej',
  dates: '04/2010 – 09/2012',
  tag: season,
  title: 'Chef de Rang',
  org: t('Pizzeria Orfej, Osor (Insel Cres), Kroatien', 'Pizzeria Orfej, Osor (island of Cres), Croatia'),
  rows: [
    row('', t(
      'À-la-carte- und Pizzaservice auf stark frequentierten Terrassen; internationale Gäste auf Englisch, Deutsch und Italienisch.',
      'À-la-carte and pizza service on busy terraces; international guests in English, German and Italian.'
    )),
  ],
}),

entry({
  id: 'job-vespera',
  dates: '05/2006 – 10/2009',
  tag: season,
  title: t('Servicekraft', 'Service staff'),
  org: t('Hotel Vespera, Mali Lošinj, Kroatien', 'Hotel Vespera, Mali Lošinj, Croatia'),
  context: t('Resorthotel', 'Resort hotel'),
  rows: [
    row('', t(
      'Einstieg als Geschirrspüler, danach Service im Hotelrestaurant.',
      'Started as a dishwasher, then moved into service in the hotel restaurant.'
    )),
  ],
  extra: `
            <p class="frame-note">${t(
              'Hinweis: Hotel Vespera, Pizzeria Orfej und Hotel Amfora waren Saisonbetriebe. In den Wintermonaten dazwischen habe ich kurzfristige Tätigkeiten übernommen.',
              'Note: Hotel Vespera, Pizzeria Orfej and Hotel Amfora were seasonal businesses. In the winter months in between I took on short-term jobs.'
            )}</p>`,
}),

entry({
  id: 'job-nock',
  dates: t('bis 04/2006', 'until 04/2006'),
  title: t('Zeltbau und Logistik', 'Tent construction and logistics'),
  org: t('Circus Nock, Schweiz', 'Circus Nock, Switzerland'),
  context: t('Schweizer Traditionszirkus (Betrieb 2019 eingestellt) · mehrere Monate', 'Traditional Swiss circus (closed in 2019) · several months'),
  rows: [
    row('', t(
      'Zeltauf- und -abbau an wechselnden Spielorten, Bau von Tiergehegen, Verladen und Transport, Tierpflege.',
      'Tent build-up and teardown at changing venues, building animal enclosures, loading and transport, animal care.'
    )),
  ],
}),

entry({
  id: 'job-wehrdienst',
  dates: '2005',
  title: t('Mechaniker für Kettenfahrzeuge', 'Mechanic for tracked vehicles'),
  org: t('Wehrdienst, Kroatische Armee', 'Military service, Croatian Army'),
  context: t('ca. 6 Monate', 'approx. 6 months'),
  rows: [
    row('', t(
      'Regelmäßige Wartung und Prüfungen an Kettenfahrzeugen; Arbeiten an der Fahrzeugelektrik.',
      'Scheduled maintenance and inspections on tracked vehicles; work on vehicle electrics.'
    )),
  ],
}),

entry({
  id: 'job-ausbildung',
  dates: '09/2002 – 05/2005',
  title: t('Berufsausbildung zum Elektromechaniker', 'Vocational training as an electromechanic'),
  org: t('Gewerbeschule Županja, Kroatien', 'Trade school Županja, Croatia'),
  rows: [
    row('', t(
      'Abgeschlossene dreijährige Ausbildung: Elektroinstallation, Elektromotoren und Maschinen, Messen und Fehlersuche.',
      'Completed three-year training: electrical installation, electric motors and machines, measuring and fault finding.'
    )),
  ],
}),
  ]);

  // ───────────────────────────── 04 PROJEKTE ─────────────────────────────
  const projekteIntro = t(
    'Software entwickle ich in meiner Freizeit – intensiv und mit KI-Werkzeugen wie Claude, die ich gezielt als Entwicklungswerkzeug einsetze. Beide Projekte sind privat (kein öffentlicher Quellcode); Einblick gebe ich gern im Gespräch.',
    'I build software in my spare time – intensively, and with AI tools such as Claude, which I use deliberately as development tools. Both projects are private (no public source code); I am happy to walk through them in an interview.'
  );

  const projekte = group('projekte', t('Software-Projekte', 'Software projects'), () => [
project('01', t('Fit-Within – Fitness-App', 'Fit-Within – fitness app'), t(
  'Mein Hauptprojekt: mobile App mit React Native, Expo und TypeScript. Über 1.200 Commits seit März 2026 (Stand 09/2026), automatisierte Tests, End-to-End-Tests auf dem Gerät und CI-Pipeline; Datenschutz (DSGVO) berücksichtigt.',
  'My main project: a mobile app built with React Native, Expo and TypeScript. More than 1,200 commits since March 2026 (as of 09/2026), automated tests, end-to-end tests on device and a CI pipeline; built with data protection (GDPR) in mind.'
), null),
project('02', t('Bela Štih – Kartenspiel', 'Bela Štih – card game'), t(
  'Das kroatische Kartenspiel Belot als App: Regelwerk in TypeScript, Computergegner mit Self-Play-Tests, Spielserver und Android-Build. Gestartet im August 2026.',
  'The Croatian card game Belot as an app: rules engine in TypeScript, computer opponents with self-play tests, game server and Android build. Started in August 2026.'
), null),
project('03', t('WebGL-Experiment „Gargantua“', 'WebGL experiment “Gargantua”'), t(
  'Ein schwarzes Loch in Echtzeit als WebGL-Shader, ohne Bibliotheken – bewusst auf eine eigene Seite ausgelagert.',
  'A real-time black hole as a WebGL shader, without libraries – deliberately moved to its own page.'
), { href: `${root}lab/`, text: t('Experiment öffnen', 'Open the experiment') }),
  ], { desc: projekteIntro });

  // ───────────────────────────── 05 DOKUMENTE ─────────────────────────────
  const dokumente = group('dokumente', t('Zeugnisse &amp; Zertifikate', 'References &amp; certificates'), () => [frame({
    label: t('Nachweise', 'Documents'),
    cls: 'frame--docs',
    body: `
${doc('docs/Zwischenzeugnis.pdf', 'Zwischenzeugnis', t('Martas Hotel – Arbeitszeugnis', 'Martas Hotel – employer reference (in German)'))}
${doc('docs/Dehoga-Zertifikat.pdf', t('DEHOGA-Zertifikat', 'DEHOGA certificate'), t('Gastorientierte Kommunikation im Restaurant – 2018', 'Guest-oriented communication in the restaurant – 2018 (in German)'))}
        <p class="frame-note">
          ${t(
            'Weitere Nachweise auf Anfrage: Ausbildungszeugnis Elektromechaniker, Sommelierkurs 1. Stufe (2013), Brandschutzhelfer (2021).',
            'Further certificates on request: electromechanic training certificate, sommelier course level 1 (2013), fire safety assistant (2021).'
          )}
        </p>`,
  })]);

  // ────────────────────────────── 06 KONTAKT ──────────────────────────────
  const kontakt = group('kontakt-bereich', t('Kontakt', 'Contact'), () => [frame({
    label: t('Nachricht schreiben', 'Write a message'),
    cls: 'frame--contact',
    flow: false,
    body: `
        <div class="contact-grid">
        <p class="contact-intro">
          ${t(
            'Schreiben Sie mir direkt per E-Mail an {{emailLinkCard}} – oder nutzen Sie das Kontaktformular. Ich melde mich so schnell wie möglich.',
            'Email me directly at {{emailLinkCard}} – or use the contact form. I will get back to you as soon as possible.'
          )}
        </p>
        <form id="contact-form" class="contact-form" action="#" method="post" onsubmit="return submitContactForm(event);">
          <input type="checkbox" name="botcheck" id="contact-botcheck" class="hidden" style="display:none" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <div>
            <label for="contact-name" class="field-label">Name</label>
            <input type="text" id="contact-name" name="name" required autocomplete="name" class="field" />
          </div>
          <div>
            <label for="contact-email" class="field-label">${t('Ihre E-Mail', 'Your email')}</label>
            <input type="email" id="contact-email" name="email" required autocomplete="email" class="field" />
          </div>
          <div>
            <label for="contact-message" class="field-label">${t('Nachricht', 'Message')}</label>
            <textarea id="contact-message" name="message" required rows="5" class="field"></textarea>
          </div>
          <button type="submit" class="btn w-full sm:w-auto">
            ${t('Nachricht senden', 'Send message')} ${ICON.right}
          </button>
          <p id="contact-status" role="status" aria-live="polite" class="text-[0.9rem] min-h-[1.25rem]"></p>
        </form>
        </div>`,
  })], { cls: ' no-print' });

  return [profil, technik, erfahrung, projekte, dokumente, kontakt].join('\n\n') + '\n';
}
