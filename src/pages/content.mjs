// Single bilingual source for the page body. scripts/build.mjs calls renderContent('de' | 'en').
// Every factual statement here was confirmed by Slavko in the workplace interview of 2026-09-21.
// Rule for future edits: if he has not confirmed it, it does not go in.

export function renderContent(lang) {
  const de = lang === 'de';
  const t = (a, b) => (de ? a : b);
  const root = de ? '' : '../';

  const strong = (s) => `<strong class="text-navy-500 dark:text-gold-300 font-semibold">${s}</strong>`;

  const sectionHead = (icon, label, mb = 'mb-8') => `      <div class="flex items-center gap-4 ${mb}">
        <span class="section-label"><i class="fa-solid ${icon} text-[10px]" aria-hidden="true"></i> ${label}</span>
        <div class="section-line"></div>
      </div>`;

  const bullet = (icon, label, text) => `            <li class="flex items-start gap-2.5">
              <i class="fa-solid ${icon} text-gold-500/80 dark:text-gold-400 mt-1 flex-shrink-0 w-4 text-center text-xs" aria-hidden="true"></i>
              <span>${label ? `${strong(`${label}:`)} ` : ''}${text}</span>
            </li>`;

  const entry = ({ id, current = false, title, meta, context, bullets, extra = '' }) => `        <div class="tl-entry reveal"${id ? ` id="${id}"` : ''}>
          <div class="tl-dot"></div>${current ? `
          <span class="absolute left-[-7px] top-[8px] w-4 h-4 rounded-full bg-gold-400/50 dark:bg-gold-300/40 animate-ping no-print"></span>` : ''}
          <div class="mb-1">
            <h3 class="font-display text-lg md:text-xl font-bold text-navy-500 dark:text-gold-300">${title}</h3>
            <p class="tl-job-meta">${meta}</p>
            <div class="tl-job-meta-rule" aria-hidden="true"></div>
          </div>${context ? `
          <p class="context-tag mb-4">${context}</p>` : ''}
          <ul class="space-y-2.5 text-sm text-[#2D3748] dark:text-[#E2E8F0] ${extra ? 'mb-6' : 'mb-2'}">
${bullets.join('\n')}
          </ul>${extra}
        </div>`;

  // A proof gallery only renders when its photos are in approved-photos.json (markers handled by build.mjs).
  const proof = (key, grid) => `
          <!-- gallery:${key} -->
          <div class="no-print mt-5" data-job-gallery="${key}" data-grid-class="${grid}"></div>
          <!-- /gallery:${key} -->`;

  const techCard = ({ icon, title, meta, text, gallery = '', span = false, delay = 1 }) => `        <div class="glass-card p-7 reveal reveal-d${delay}${span ? ' md:col-span-2' : ''}">
          <div class="flex items-start gap-5">
            <div class="w-14 h-14 bg-gradient-to-br from-gold-50 to-gold-100 dark:from-navy-400/20 dark:to-navy-400/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <i class="fa-solid ${icon} text-gold-500 text-xl" aria-hidden="true"></i>
            </div>
            <div class="min-w-0">
              <h3 class="font-display text-base font-bold text-navy-500 dark:text-gold-300 mb-1">${title}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">${meta}</p>
              <p class="text-sm text-[#2D3748] dark:text-[#E2E8F0] leading-relaxed">${text}</p>
            </div>
          </div>${gallery}
        </div>`;

  const itCard = (delay, icon, title, text, link) => `          <div class="it-card p-7 reveal reveal-d${delay}">
            <div class="w-14 h-14 bg-gold-500/15 rounded-2xl flex items-center justify-center mb-6">
              <i class="fa-solid ${icon} text-gold-400 text-xl" aria-hidden="true"></i>
            </div>
            <h3 class="font-display text-lg font-bold text-white mb-3">${title}</h3>
            <p class="text-sm text-slate-300/90 leading-relaxed mb-4">
              ${text}
            </p>${link ? `
            <a href="${link.href}" class="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors">
              <i class="fa-solid fa-arrow-right" aria-hidden="true"></i> ${link.text}
            </a>` : ''}
          </div>`;

  const docCard = (delay, href, title, sub) => `        <a href="${root}${href}" target="_blank" rel="noopener noreferrer" class="group glass-card p-6 flex items-center gap-5 no-underline reveal reveal-d${delay}">
          <div class="w-14 h-14 bg-red-50 dark:bg-red-950/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors duration-300">
            <i class="fa-solid fa-file-pdf text-red-500 text-2xl" aria-hidden="true"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-navy-500 dark:text-gold-300 text-sm group-hover:text-gold-500 dark:group-hover:text-gold-400 transition-colors duration-300">${title}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${sub}</p>
          </div>
          <i class="fa-solid fa-arrow-up-right-from-square text-slate-300 group-hover:text-gold-400 transition-colors duration-300 no-print" aria-hidden="true"></i>
        </a>`;

  // ───────────────────────────── PROFIL ─────────────────────────────
  const profil = `    <!-- ─── PROFIL ─── -->
    <section class="py-16 reveal" id="profil">
${sectionHead('fa-user', t('Profil', 'Profile'))}
      <div class="glass-card p-8 md:p-10 space-y-4 text-[#2D3748] dark:text-[#E2E8F0] text-[15.5px]">
        <p class="text-navy-500 dark:text-gold-300 font-display text-lg md:text-xl font-semibold leading-snug">
          ${t(
            'Ausgebildeter Elektromechaniker mit 20 Jahren Praxis in Hotellerie, Gastronomie und Event-Catering – mit <span class="text-gold-600 dark:text-gold-400">wachsendem Schwerpunkt auf Technik, Aufbau und Logistik</span>.',
            'Trained electromechanic with 20 years of hands-on experience in hotels, restaurants and event catering – with a <span class="text-gold-600 dark:text-gold-400">growing focus on technology, set-up and logistics</span>.'
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
            'Davor: Zelt- und Pavillonmontage bei Polster Catering sowie Wartung und Fahrzeugelektrik an Kettenfahrzeugen im Wehrdienst. Privat schraube ich am eigenen Auto und entwickle eine App (React Native, TypeScript).',
            'Before that: assembling tents and pavilions at Polster Catering, and maintenance and vehicle electrics on tracked vehicles during military service. In my own time I work on my car and build an app (React Native, TypeScript).'
          )}
        </p>
        <p>
          ${t(
            'Ich ziehe mit meiner Familie in den Raum Regensburg/Neutraubling und suche dort den Einstieg in den technischen Service. In meinem Ausbildungsberuf habe ich seit dem Abschluss nicht gearbeitet – deshalb ist mir eine strukturierte Einarbeitung wichtig, und ich bilde mich gern weiter, zum Beispiel zur Elektrofachkraft für festgelegte Tätigkeiten.',
            'I am moving with my family to the Regensburg/Neutraubling area and am looking for an entry into technical service there. I have not worked in my trained profession since qualifying – so structured onboarding matters to me, and I am glad to qualify further, for example as an <span lang="de">Elektrofachkraft für festgelegte Tätigkeiten</span>.'
          )}
        </p>
        <p>
          ${strong(t('Sprachen:', 'Languages:'))} ${t(
            'Kroatisch (Muttersprache), Deutsch und Englisch sehr gut, Italienisch Grundkenntnisse.',
            'Croatian (native), German and English fluent, basic Italian.'
          )}
        </p>
      </div>
    </section>`;

  // ─────────────────────── TECHNIK & QUALIFIKATION ───────────────────────
  const technik = `    <!-- ─── TECHNIK & QUALIFIKATION ─── -->
    <section class="py-16 reveal scroll-mt-24" id="technik">
${sectionHead('fa-screwdriver-wrench', t('Technik &amp; Qualifikation', 'Technical skills &amp; qualifications'), 'mb-12')}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
${techCard({
  icon: 'fa-bolt',
  delay: 1,
  title: t('Berufsausbildung: Elektromechaniker', 'Vocational training: electromechanic'),
  meta: t('Gewerbeschule Županja, Kroatien · 09/2002 – 05/2005', 'Trade school Županja, Croatia · 09/2002 – 05/2005'),
  text: t(
    'Dreijährige Ausbildung mit den Schwerpunkten Elektroinstallation, Elektromotoren und Maschinen sowie Messen und Fehlersuche. Seit dem Abschluss nicht im Beruf tätig – eine Weiterbildung, etwa zur Elektrofachkraft für festgelegte Tätigkeiten, mache ich gern.',
    'Three-year training focused on electrical installation, electric motors and machines, measuring and fault finding. I have not worked in the trade since qualifying – I am glad to take further training, for example as an <span lang="de">Elektrofachkraft für festgelegte Tätigkeiten</span>.'
  ),
})}
${techCard({
  icon: 'fa-gears',
  delay: 2,
  title: t('Wehrdienst: Mechaniker für Kettenfahrzeuge', 'Military service: mechanic for tracked vehicles'),
  meta: t('Kroatische Armee · 2005 · ca. 6 Monate', 'Croatian Army · 2005 · approx. 6 months'),
  text: t(
    'Regelmäßige Wartung und Prüfungen an Kettenfahrzeugen sowie Arbeiten an der Fahrzeugelektrik.',
    'Scheduled maintenance and inspections on tracked vehicles, and work on vehicle electrics.'
  ),
})}
${techCard({
  icon: 'fa-sliders',
  delay: 1,
  span: true,
  title: t('Tagungs- und Veranstaltungstechnik', 'Conference and event technology'),
  meta: t('Martas Hotel · seit 2017 · 11 bis 20 Veranstaltungen im Monat', 'Martas Hotel · since 2017 · 11 to 20 events a month'),
  text: t(
    'Aufbau und Bedienung in Eigenregie: Mischpult mit mehreren Kanälen, Mikrofone und Beschallung, Beamer und Leinwand, Eventlicht. Laptops der Referenten anschließen und Störungen wie „kein Bild“ oder „kein Ton“ direkt vor Ort beheben.',
    'Set up and operated on my own: multi-channel mixing desk, microphones and sound system, projector and screen, event lighting. Connecting speakers’ laptops and fixing problems such as “no picture” or “no sound” on the spot.'
  ),
  gallery: proof('tagungstechnik', 'grid grid-cols-3 gap-2 md:gap-3'),
})}
${techCard({
  icon: 'fa-hammer',
  delay: 2,
  span: true,
  title: t('Montage, Auf- und Abbau', 'Assembly, build-up and teardown'),
  meta: t('Polster Catering 2016 – 2017 · Circus Nock 2006', 'Polster Catering 2016 – 2017 · Circus Nock 2006'),
  text: t(
    'Zelt- und Pavillonkonstruktionen montiert, Mobiliar, Bars und Buffetstrecken aufgebaut – mit Akkuschrauber und Handwerkzeug, Hubwagen und Transporter. Beim Biathlon-Weltcup in Oberhof 2017 Auf- und Abbau des Hospitality-Zelts; beim Circus Nock Zeltbau an wechselnden Spielorten.',
    'Assembled tent and pavilion structures and set up furniture, bars and buffet lines – using cordless and hand tools, pallet truck and van. Build-up and teardown of the hospitality tent at the Biathlon World Cup in Oberhof 2017; tent construction at changing venues with Circus Nock.'
  ),
  gallery: proof('montage', 'grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3'),
})}
${techCard({
  icon: 'fa-mug-hot',
  delay: 1,
  title: t('Geräte und Kassensysteme im täglichen Einsatz', 'Machines and POS systems in daily use'),
  meta: t('20 Jahre Praxis als Anwender', '20 years as an operator'),
  text: t(
    'Kaffeevollautomat von WMF, Spülmaschine und Schankanlage einschließlich täglicher Reinigung. Kassensysteme: Oracle Micros, seit 2025 Gastronovi; bei Polster Catering ein mobiles Handkassengerät (S-600). Ich weiß, was ein Geräteausfall im laufenden Betrieb bedeutet.',
    'WMF fully automatic coffee machine, dishwasher and draught system, including daily cleaning. POS systems: Oracle Micros, Gastronovi since 2025; at Polster Catering a handheld POS device (S-600). I know what equipment downtime means in the middle of service.'
  ),
  gallery: proof('geraete', 'grid grid-cols-2 gap-2 md:gap-3'),
})}
${techCard({
  icon: 'fa-car-side',
  delay: 2,
  title: t('Handwerkliche Praxis: Motorwechsel', 'Hands-on practice: engine replacement'),
  meta: t('2025 · eigener Audi A4 Avant 1.8 TFSI', '2025 · my own Audi A4 Avant 1.8 TFSI'),
  text: t(
    'In der Werkstatt eines Freundes: Motor gemeinsam aus- und eingebaut. Kabelbaum und Sensorik, Kühl-, Kraftstoff- und Abgasanlage, Betriebsflüssigkeiten und Erstinbetriebnahme habe ich selbst übernommen.',
    'In a friend’s workshop: engine removed and fitted together. I did the wiring harness and sensors, the cooling, fuel and exhaust systems, the fluids and the first start myself.'
  ),
})}
${techCard({
  icon: 'fa-certificate',
  delay: 1,
  span: true,
  title: t('Weitere Qualifikationen', 'Further qualifications'),
  meta: t('Kurse und Nachweise', 'Courses and certificates'),
  text: t(
    'Brandschutzhelfer (CWS Fire Safety, 2021) · Führerschein Klasse B · DEHOGA-Seminar „Gastorientierte Kommunikation im Restaurant“ (2018) · Sommelierkurs 1. Stufe (Kroatischer Sommelier Club, 2013) · Arbeiten nach gesetzlichen und betrieblichen Hygienevorschriften.',
    'Fire safety assistant (CWS Fire Safety, 2021) · driving licence category B · DEHOGA seminar “Guest-oriented communication in the restaurant” (2018) · sommelier course level 1 (Croatian Sommelier Club, 2013) · working to statutory and in-house hygiene regulations.'
  ),
})}
      </div>
    </section>`;

  // ─────────────────────────── BERUFSERFAHRUNG ───────────────────────────
  const zeugnis = `

          <!-- Zwischenzeugnis -->
          <div class="glass-card p-6 md:p-8 my-6 border-l-4 border-gold-400 bg-gold-50/10 dark:bg-gold-500/5 relative overflow-hidden">
            <span class="absolute right-4 top-2 text-gold-200/20 dark:text-gold-200/5 font-display text-8xl pointer-events-none select-none">“</span>
            <blockquote class="relative z-10"${de ? '' : ' lang="de"'}>
              <p class="font-display italic text-[#2D3748] dark:text-[#E2E8F0] text-base md:text-lg leading-relaxed">
                &bdquo;Herr Grbic verfügt über eine sehr große Berufserfahrung. Er erledigt seine Aufgaben stets mit äußerster Sorgfalt und Genauigkeit. Sein Verhalten gegenüber Gästen, Vorgesetzten und Kollegen ist stets vorbildlich.&ldquo;
              </p>
              <cite class="block mt-4 text-xs font-semibold uppercase tracking-wider text-navy-500 dark:text-gold-300 not-italic"${de ? '' : ' lang="en"'}>
                &mdash; ${t('Auszug aus dem Zwischenzeugnis, Martas Hotel', 'Excerpt from the interim reference (Zwischenzeugnis), Martas Hotel')}
              </cite>
            </blockquote>
          </div>`;

  const erfahrung = `    <!-- ─── BERUFSERFAHRUNG ─── -->
    <section class="py-16 reveal" id="erfahrung">
${sectionHead('fa-briefcase', t('Berufserfahrung', 'Work experience'), 'mb-12')}
      <div class="relative ml-2">
        <div class="timeline-track"></div>

${entry({
  id: 'job-martas',
  current: true,
  title: 'Chef de Rang',
  meta: t('04/2017 – Heute · Martas Hotel (ehem. Luther-Hotel), Lutherstadt Wittenberg', '04/2017 – Present · Martas Hotel (formerly Luther-Hotel), Lutherstadt Wittenberg'),
  context: t('3-Sterne Superior · 158 Zimmer · 8 Veranstaltungsräume', '3-star superior · 158 rooms · 8 event rooms'),
  bullets: [
    bullet('fa-sliders', t('Technik', 'Technology'), t(
      'Tagungs- und Veranstaltungstechnik für 11 bis 20 Veranstaltungen im Monat eigenständig eingerichtet und bedient: Mischpult, Mikrofone und Beschallung, Beamer und Leinwand, Laptops der Referenten, Eventlicht – einschließlich Störungsbehebung im laufenden Betrieb.',
      'Set up and operated conference and event technology on my own for 11 to 20 events a month: mixing desk, microphones and sound system, projector and screen, speakers’ laptops, event lighting – including troubleshooting while the event is running.'
    )),
    bullet('fa-ruler-combined', t('Aufbau', 'Set-up'), t(
      'Räume eigenständig nach Funktionsplan aufgebaut – Tagungen, Bankette und Galas, in der Spitze mit über 200 Gästen.',
      'Built rooms on my own from the function sheet – conferences, banquets and galas, the largest with more than 200 guests.'
    )),
    bullet('fa-truck', t('Logistik', 'Logistics'), t(
      'Warenannahme mit Kontrolle der Lieferscheine; Transport von Technik, Getränken und Material zu externen Veranstaltungsorten.',
      'Receiving goods and checking delivery notes; transporting equipment, drinks and material to external venues.'
    )),
    bullet('fa-user-graduate', t('Einarbeitung', 'Training'), t(
      'Neue Kolleginnen und Kollegen sowie Aushilfen in Abläufe, Geräte und Standards eingearbeitet.',
      'Trained new colleagues and temporary staff in processes, equipment and standards.'
    )),
    bullet('fa-mug-hot', t('Geräte', 'Equipment'), t(
      'Täglicher Umgang mit WMF-Kaffeevollautomat, Spülmaschine und Schankanlage einschließlich täglicher Reinigung; Kassensysteme Oracle Micros und seit 2025 Gastronovi.',
      'Daily work with a WMF fully automatic coffee machine, dishwasher and draught system, including daily cleaning; POS systems Oracle Micros and, since 2025, Gastronovi.'
    )),
    bullet('fa-utensils', t('Service', 'Service'), t(
      'Gästeservice bei Seminaren, Tagungen und Banketten, im Restaurant und an der Bar; internationale Gäste auf Deutsch und Englisch.',
      'Guest service at seminars, conferences and banquets, in the restaurant and at the bar; international guests in German and English.'
    )),
  ],
  extra: zeugnis,
})}

${entry({
  id: 'job-polster',
  title: t('Chef de Rang &amp; Verkäufer', 'Chef de Rang &amp; sales'),
  meta: '04/2016 – 03/2017 · Polster Catering GmbH',
  context: t('Generalcaterer für Landes- und Bundesgartenschauen, Sportevents, Messen und Konzerte', 'General caterer for state and federal garden shows, sports events, trade fairs and concerts'),
  bullets: [
    bullet('fa-hammer', t('Montage', 'Assembly'), t(
      'Zelt- und Pavillonkonstruktionen montiert; Mobiliar, Bars und Buffetstrecken auf- und abgebaut – mit Akkuschrauber und Handwerkzeug, Hubwagen und Transporter.',
      'Assembled tent and pavilion structures; built up and took down furniture, bars and buffet lines – using cordless and hand tools, pallet truck and van.'
    )),
    bullet('fa-tent', 'Oberhof', t(
      'BMW IBU Weltcup Biathlon (Januar 2017): Auf- und Abbau des Hospitality-Zelts, während der Wettkampftage VIP-Service und Bar.',
      'BMW IBU Biathlon World Cup (January 2017): build-up and teardown of the hospitality tent, VIP service and bar during the race days.'
    )),
    bullet('fa-cash-register', 'Eutin', t(
      'Landesgartenschau: Service im À-la-carte-Restaurant; Bestellungen und Abrechnung mit mobilem Handkassengerät (S-600).',
      'State garden show: service in the à-la-carte restaurant; orders and billing with a handheld POS device (S-600).'
    )),
    bullet('fa-people-group', t('Stadien', 'Stadiums'), t(
      'Unter anderem Chemnitz und Zwickau: VIP-Betreuung sowie Verkauf von Speisen und Getränken.',
      'Including Chemnitz and Zwickau: VIP service and sales of food and drinks.'
    )),
  ],
})}

${entry({
  id: 'job-amfora',
  title: t('Chef de Rang (Saison)', 'Chef de Rang (season)'),
  meta: t('03/2015 – 10/2015 · Hotel Amfora Hvar Grand Beach Resort, Kroatien', '03/2015 – 10/2015 · Hotel Amfora Hvar Grand Beach Resort, Croatia'),
  context: t('Resorthotel mit großer Pool- und Außenanlage · Saisonbetrieb', 'Resort hotel with a large pool and outdoor area · seasonal'),
  bullets: [
    bullet('fa-water-ladder', '', t(
      'Service an Pool, Terrassen und Pavillons bei sehr hohem Gästeaufkommen, unter anderem in der Festivalwoche von Ultra Europe.',
      'Service at the pool, terraces and pavilions with very high guest numbers, including the Ultra Europe festival week.'
    )),
    bullet('fa-cash-register', '', t(
      'Bar und Kaffeemaschine; Kasse mit Bar- und Kartenzahlung; Schichten in Lobby und Restaurant.',
      'Bar and coffee machine; till with cash and card payments; shifts in the lobby and restaurant.'
    )),
    bullet('fa-language', '', t(
      'Internationale Gäste auf Englisch, Deutsch und Italienisch.',
      'International guests in English, German and Italian.'
    )),
  ],
})}

${entry({
  id: 'job-javora',
  title: 'Chef de Rang',
  meta: t('11/2012 – 02/2015 · Restaurant Kod Javora, Osijek, Kroatien', '11/2012 – 02/2015 · Restaurant Kod Javora, Osijek, Croatia'),
  context: t('Traditionelles Restaurant mit großer Terrasse an der Drau · ganzjährig', 'Traditional restaurant with a large terrace on the river Drava · all year'),
  bullets: [
    bullet('fa-wine-glass', '', t(
      'Service im Restaurant und auf der Terrasse; Weinempfehlungen (Sommelierkurs 1. Stufe, 2013).',
      'Service in the restaurant and on the terrace; wine recommendations (sommelier course level 1, 2013).'
    )),
    bullet('fa-boxes-stacked', '', t(
      'Bestandskontrolle und Bestellungen bei Lieferanten.',
      'Stock checks and ordering from suppliers.'
    )),
    bullet('fa-bullhorn', '', t(
      'Social-Media-Beiträge für das Restaurant; Vertretung des Inhabers bei dessen Abwesenheit.',
      'Social media posts for the restaurant; standing in for the owner when he was away.'
    )),
  ],
})}

${entry({
  id: 'job-orfej',
  title: t('Chef de Rang (Saison)', 'Chef de Rang (season)'),
  meta: t('04/2010 – 09/2012 · Pizzeria Orfej, Osor (Insel Cres), Kroatien', '04/2010 – 09/2012 · Pizzeria Orfej, Osor (island of Cres), Croatia'),
  context: t('Saisonbetrieb', 'Seasonal'),
  bullets: [
    bullet('fa-pizza-slice', '', t(
      'À-la-carte- und Pizzaservice auf stark frequentierten Terrassen; internationale Gäste auf Englisch, Deutsch und Italienisch.',
      'À-la-carte and pizza service on busy terraces; international guests in English, German and Italian.'
    )),
  ],
})}

${entry({
  id: 'job-vespera',
  title: t('Servicekraft (Saison)', 'Service staff (season)'),
  meta: t('05/2006 – 10/2009 · Hotel Vespera, Mali Lošinj, Kroatien', '05/2006 – 10/2009 · Hotel Vespera, Mali Lošinj, Croatia'),
  context: t('Resorthotel · Saisonbetrieb', 'Resort hotel · seasonal'),
  bullets: [
    bullet('fa-hands-bubbles', '', t(
      'Einstieg als Geschirrspüler, danach Service im Hotelrestaurant.',
      'Started as a dishwasher, then moved into service in the hotel restaurant.'
    )),
  ],
  extra: `
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-3">${t(
            'Hinweis: Hotel Vespera, Pizzeria Orfej und Hotel Amfora waren Saisonbetriebe. In den Wintermonaten dazwischen habe ich kurzfristige Tätigkeiten übernommen.',
            'Note: Hotel Vespera, Pizzeria Orfej and Hotel Amfora were seasonal businesses. In the winter months in between I took on short-term jobs.'
          )}</p>`,
})}

${entry({
  id: 'job-nock',
  title: t('Zeltbau und Logistik', 'Tent construction and logistics'),
  meta: t('bis 04/2006 · Circus Nock, Schweiz · mehrere Monate', 'until 04/2006 · Circus Nock, Switzerland · several months'),
  context: t('Schweizer Traditionszirkus (Betrieb 2019 eingestellt)', 'Traditional Swiss circus (closed in 2019)'),
  bullets: [
    bullet('fa-campground', '', t(
      'Zeltauf- und -abbau an wechselnden Spielorten, Bau von Tiergehegen, Verladen und Transport, Tierpflege.',
      'Tent build-up and teardown at changing venues, building animal enclosures, loading and transport, animal care.'
    )),
  ],
})}

${entry({
  id: 'job-wehrdienst',
  title: t('Wehrdienst: Mechaniker für Kettenfahrzeuge', 'Military service: mechanic for tracked vehicles'),
  meta: t('2005 · Kroatische Armee · ca. 6 Monate', '2005 · Croatian Army · approx. 6 months'),
  bullets: [
    bullet('fa-gears', '', t(
      'Regelmäßige Wartung und Prüfungen an Kettenfahrzeugen; Arbeiten an der Fahrzeugelektrik.',
      'Scheduled maintenance and inspections on tracked vehicles; work on vehicle electrics.'
    )),
  ],
})}

${entry({
  id: 'job-ausbildung',
  title: t('Berufsausbildung zum Elektromechaniker', 'Vocational training as an electromechanic'),
  meta: t('09/2002 – 05/2005 · Gewerbeschule Županja, Kroatien', '09/2002 – 05/2005 · Trade school Županja, Croatia'),
  bullets: [
    bullet('fa-graduation-cap', '', t(
      'Abgeschlossene dreijährige Ausbildung: Elektroinstallation, Elektromotoren und Maschinen, Messen und Fehlersuche.',
      'Completed three-year training: electrical installation, electric motors and machines, measuring and fault finding.'
    )),
  ],
})}
      </div>
    </section>`;

  // ───────────────────────────── PROJEKTE ─────────────────────────────
  const projekte = `    <!-- ─── PROJEKTE ─── -->
    <section class="py-16 reveal" id="projekte">
${sectionHead('fa-microchip', t('Software-Projekte', 'Software projects'), 'mb-12')}

      <p class="text-sm text-[#2D3748] dark:text-[#E2E8F0] leading-relaxed max-w-3xl mb-8">
        ${t(
          'Software entwickle ich in meiner Freizeit – intensiv und mit KI-Werkzeugen wie Claude, die ich gezielt als Entwicklungswerkzeug einsetze. Beide Projekte sind privat (kein öffentlicher Quellcode); Einblick gebe ich gern im Gespräch.',
          'I build software in my spare time – intensively, and with AI tools such as Claude, which I use deliberately as development tools. Both projects are private (no public source code); I am happy to walk through them in an interview.'
        )}
      </p>

      <div class="bg-gradient-to-br from-navy-500 via-navy-400 to-navy-500 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
${itCard(1, 'fa-dumbbell', t('Fit-Within – Fitness-App', 'Fit-Within – fitness app'), t(
  'Mein Hauptprojekt: mobile App mit React Native, Expo und TypeScript. Über 1.200 Commits seit März 2026 (Stand 09/2026), automatisierte Tests, End-to-End-Tests auf dem Gerät und CI-Pipeline; Datenschutz (DSGVO) berücksichtigt.',
  'My main project: a mobile app built with React Native, Expo and TypeScript. More than 1,200 commits since March 2026 (as of 09/2026), automated tests, end-to-end tests on device and a CI pipeline; built with data protection (GDPR) in mind.'
), null)}

${itCard(2, 'fa-diamond', t('Bela Štih – Kartenspiel', 'Bela Štih – card game'), t(
  'Das kroatische Kartenspiel Belot als App: Regelwerk in TypeScript, Computergegner mit Self-Play-Tests, Spielserver und Android-Build. Gestartet im August 2026.',
  'The Croatian card game Belot as an app: rules engine in TypeScript, computer opponents with self-play tests, game server and Android build. Started in August 2026.'
), null)}

${itCard(3, 'fa-atom', t('WebGL-Experiment „Gargantua“', 'WebGL experiment “Gargantua”'), t(
  'Ein schwarzes Loch in Echtzeit als WebGL-Shader, ohne Bibliotheken – bewusst auf eine eigene Seite ausgelagert.',
  'A real-time black hole as a WebGL shader, without libraries – deliberately moved to its own page.'
), { href: `${root}lab/`, text: t('Experiment öffnen', 'Open the experiment') })}
        </div>
      </div>
    </section>`;

  // ───────────────────────────── DOKUMENTE ─────────────────────────────
  const dokumente = `    <!-- ─── DOKUMENTE ─── -->
    <section class="py-16 reveal" id="dokumente">
${sectionHead('fa-folder-open', t('Zeugnisse &amp; Zertifikate', 'References &amp; certificates'), 'mb-12')}

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
${docCard(1, 'docs/Zwischenzeugnis.pdf', 'Zwischenzeugnis', t('Martas Hotel – Arbeitszeugnis (PDF)', 'Martas Hotel – employer reference, in German (PDF)'))}

${docCard(2, 'docs/Dehoga-Zertifikat.pdf', t('DEHOGA-Zertifikat', 'DEHOGA certificate'), t('Gastorientierte Kommunikation – 2018 (PDF)', 'Guest-oriented communication – 2018, in German (PDF)'))}
      </div>
      <p class="text-sm text-[#2D3748] dark:text-[#E2E8F0] leading-relaxed max-w-3xl mt-6">
        ${t(
          'Weitere Nachweise auf Anfrage: Ausbildungszeugnis Elektromechaniker, Sommelierkurs 1. Stufe (2013), Brandschutzhelfer (2021).',
          'Further certificates on request: electromechanic training certificate, sommelier course level 1 (2013), fire safety assistant (2021).'
        )}
      </p>
    </section>`;

  // ────────────────────────────── KONTAKT ──────────────────────────────
  const field = 'w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-[#2D3748] dark:text-[#E2E8F0] px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 outline-none transition-shadow';
  const label = 'block text-xs font-semibold text-navy-500 dark:text-gold-300 uppercase tracking-wider mb-1.5';

  const kontakt = `    <!-- ─── KONTAKT ─── -->
    <section class="py-16 reveal no-print" id="kontakt-bereich">
${sectionHead('fa-paper-plane', t('Kontakt', 'Contact'))}
      <div class="glass-card p-8 md:p-10 max-w-2xl scroll-mt-24">
        <p class="text-sm text-[#2D3748] dark:text-[#E2E8F0] mb-6">
          ${t(
            'Schreiben Sie mir direkt per E-Mail an {{emailLinkCard}} – oder nutzen Sie das Kontaktformular. Ich melde mich so schnell wie möglich.',
            'Email me directly at {{emailLinkCard}} – or use the contact form. I will get back to you as soon as possible.'
          )}
        </p>
        <form id="contact-form" class="space-y-4" action="#" method="post" onsubmit="return submitContactForm(event);">
          <input type="checkbox" name="botcheck" id="contact-botcheck" class="hidden" style="display:none" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <div>
            <label for="contact-name" class="${label}">Name</label>
            <input type="text" id="contact-name" name="name" required autocomplete="name" class="${field}" />
          </div>
          <div>
            <label for="contact-email" class="${label}">${t('Ihre E-Mail', 'Your email')}</label>
            <input type="email" id="contact-email" name="email" required autocomplete="email" class="${field}" />
          </div>
          <div>
            <label for="contact-message" class="${label}">${t('Nachricht', 'Message')}</label>
            <textarea id="contact-message" name="message" required rows="5" class="${field} resize-y min-h-[120px]"></textarea>
          </div>
          <button type="submit" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-navy-500 dark:bg-gold-500 text-white dark:text-navy-900 text-sm font-semibold hover:bg-navy-400 dark:hover:bg-gold-400 transition-colors">
            ${t('Nachricht senden', 'Send message')}
          </button>
          <p id="contact-status" role="status" aria-live="polite" class="text-sm min-h-[1.25rem] text-[#2D3748] dark:text-[#E2E8F0]"></p>
        </form>
      </div>
    </section>`;

  return [profil, technik, erfahrung, projekte, dokumente, kontakt].join('\n\n') + '\n';
}
