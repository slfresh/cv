import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EMAIL, UPDATED } from '../site.config.mjs';
import { ICON } from '../src/icons.mjs';
import { renderContent } from '../src/pages/content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// Web3Forms access key (public by design – it only identifies the receiving mailbox)
const WEB3FORMS_ACCESS_KEY = "14c93f9a-a7fd-4b9e-b8fe-183779a348e5";

const SITE = "https://slfresh.github.io/cv/";

const badge = (text) =>
  `        <span class="tag">${text}</span>`;

const jsonld = (lang) => JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Slavko Grbic",
  "url": lang === 'de' ? SITE : `${SITE}en/`,
  "image": `${SITE}images/profil.png`,
  "description": lang === 'de'
    ? "Ausgebildeter Elektromechaniker mit 20 Jahren Praxis in Hotel und Gastronomie – auf dem Weg zurück in den technischen Service."
    : "Trained electromechanic with 20 years of hands-on experience in hotels and restaurants – on the way back into technical service.",
  // jobTitle stays the job he actually holds today; the target role belongs in the description.
  "jobTitle": "Chef de Rang",
  "worksFor": { "@type": "Organization", "name": "Martas Hotel Lutherstadt Wittenberg" },
  "address": {
    "@type": "PostalAddress",
    "postalCode": "06886",
    "addressLocality": "Lutherstadt Wittenberg",
    "addressCountry": "DE"
  },
  "nationality": { "@type": "Country", "name": "Croatia" },
  "knowsLanguage": ["hr", "de", "en", "it"],
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "name": lang === 'de' ? "Berufsausbildung zum Elektromechaniker" : "Vocational training as an electromechanic",
    "recognizedBy": { "@type": "EducationalOrganization", "name": "Gewerbeschule Županja" }
  },
  "knowsAbout": lang === 'de'
    ? ["Elektromechanik (Berufsausbildung)", "Tagungs- und Veranstaltungstechnik", "Veranstaltungsauf- und -abbau", "Zelt- und Pavillonmontage", "Kassensysteme (Anwendung)", "Kaffeevollautomaten (Anwendung)", "Warenannahme", "Brandschutzhelfer", "Hotellerie", "Gastronomie", "TypeScript", "React Native"]
    : ["Electromechanics (vocational training)", "Conference and event technology", "Event build-up and teardown", "Tent and pavilion assembly", "POS systems (operation)", "Fully automatic coffee machines (operation)", "Goods receiving", "Fire safety assistant", "Hotels", "Restaurants", "TypeScript", "React Native"]
}, null, 2);

const locales = {
  de: {
    lang: "de",
    title: "Slavko Grbic – Technischer Service &amp; Kundendienst | Raum Regensburg",
    description: "Ausgebildeter Elektromechaniker mit 20 Jahren Praxis in Hotel und Gastronomie: Tagungstechnik, Auf- und Abbau, Logistik. Wiedereinstieg in den technischen Service im Raum Regensburg/Neutraubling. EU-Bürger, Führerschein B.",
    canonical: SITE,
    alternateDe: SITE,
    alternateEn: `${SITE}en/`,
    alternateDefault: SITE,
    photoPath: "images/profil.png",
    ogTitle: "Slavko Grbic – Technischer Service &amp; Kundendienst",
    ogDescription: "Ausgebildeter Elektromechaniker · 20 Jahre Hotel- und Gastronomie-Praxis · Tagungstechnik, Montage, Logistik · Umzug in den Raum Regensburg/Neutraubling · Deutsch und Englisch sehr gut.",
    ogUrl: SITE,
    ogLocale: "de_DE",
    ogImage: `${SITE}images/profil.png`,
    ogImageAlt: "Slavko Grbic – Profilfoto",
    twitterTitle: "Slavko Grbic – Technischer Service &amp; Kundendienst",
    twitterDescription: "Ausgebildeter Elektromechaniker · 20 Jahre Hotel- und Gastronomie-Praxis · Tagungstechnik, Montage, Logistik · Raum Regensburg/Neutraubling.",
    stylesheetPath: "css/output.css",
    fontPath: "fonts/",
    skipToContent: "Zum Inhalt springen",
    navAriaLabel: "Hauptnavigation",
    navProfile: "Profil",
    navTech: "Technik",
    navExperience: "Erfahrung",
    navProjects: "Projekte",
    navDocuments: "Dokumente",
    navContact: "Kontakt",
    langToggleHref: "en/",
    langToggleLang: "en",
    langToggleTitle: "English version",
    langToggleAria: "Zur englischsprachigen Version wechseln",
    langToggleLabel: "EN",
    themeToggleTitle: "Design-Modus wechseln",
    pdfButtonTitle: "Als PDF herunterladen",
    pdfButtonText: "PDF herunterladen",
    lightboxTitle: "Vergrößerte Ansicht",
    lightboxCloseAria: "Schließen",
    lightboxPrevAria: "Vorheriges Bild",
    lightboxNextAria: "Nächstes Bild",
    heroProfilePhotoAria: "Profilfotos anzeigen (3 Bilder, mit Pfeiltasten blättern)",
    heroProfilePhotoTitle: "Klicken: alle Profilfotos in der Großansicht",
    heroImageAlt: "Slavko Grbic – Profilfoto",
    heroBarLabel: `Lebenslauf · Stand ${UPDATED}`,
    heroSubtitle: "Technischer Service · Kundendienst · Gastronomie-Praxis",
    heroLead: "Ausgebildeter Elektromechaniker mit 20 Jahren Praxis in Hotel und Gastronomie – auf dem Weg zurück in den technischen Service.",
    heroDetail: "Kassensysteme, Kaffeevollautomaten und Tagungstechnik kenne ich aus täglicher Anwendung – und ich weiß, was ein Ausfall im laufenden Betrieb bedeutet. Aktuell: Chef de Rang im Martas Hotel, Lutherstadt Wittenberg. Details unter <a href=\"#technik\" class=\"hero-link\">Technik &amp; Qualifikation</a> und <a href=\"#erfahrung\" class=\"hero-link\">Berufserfahrung</a>.",
    heroContactButtonText: "Direkt kontaktieren",
    heroLocationText: "Lutherstadt Wittenberg · Umzug in den Raum Regensburg/Neutraubling geplant",
    heroBirthYearText: "1988",
    specEmailLabel: "E-Mail",
    specLocationLabel: "Standort",
    specStatusLabel: "Status",
    specBornLabel: "Jahrgang",
    specLicenceLabel: "Führerschein",
    heroNationalityText: "Kroatische Staatsangehörigkeit – <span class=\"whitespace-nowrap\">EU-Bürger</span>, keine Arbeitserlaubnis erforderlich",
    heroDriverLicenseText: "Klasse B",
    heroBadges: "\n" + [
      badge("Ausbildung: Elektromechaniker"),
      badge("20 Jahre Hotel &amp; Gastronomie"),
      badge("Tagungstechnik · Montage · Logistik"),
      badge("Deutsch &amp; Englisch sehr gut"),
    ].join("\n") + "\n    ",
    footerSubtitle: "Technischer Service · Gastronomie-Praxis · Raum Regensburg",
    footerEmailLabel: "E-Mail",
    footerFormLinkText: "Zum Kontaktformular",
    footerFocusLabel: "Schwerpunkt",
    footerTopText: "Nach oben",
    printContactLabel: "Kontakt",
    formSubjectPrefix: "Kontakt über Portfolio",
    footerCopyright: "&copy; 2026 Slavko Grbic. Alle Rechte vorbehalten.",
    galleryDataScript: "js/gallery-data-de.js",
    galleryUiScript: "js/gallery-ui.js",
    validationErrorText: "Bitte füllen Sie alle erforderlichen Felder aus (Name, E-Mail und Nachricht).",
    formSendingText: "Wird gesendet...",
    formSuccessText: "Nachricht erfolgreich gesendet!",
    formErrorText: "Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal oder schreiben Sie mir direkt per E-Mail.",
    web3FormsKey: WEB3FORMS_ACCESS_KEY,
    jsonld: jsonld('de'),
  },
  en: {
    lang: "en",
    title: "Slavko Grbic – Technical Service &amp; Field Service | Regensburg area, Germany",
    description: "Trained electromechanic with 20 years of hands-on hotel and restaurant experience: conference technology, build-up and teardown, logistics. Returning to technical service in the Regensburg/Neutraubling area. EU citizen, driving licence B.",
    canonical: `${SITE}en/`,
    alternateDe: SITE,
    alternateEn: `${SITE}en/`,
    alternateDefault: SITE,
    photoPath: "../images/profil.png",
    ogTitle: "Slavko Grbic – Technical Service &amp; Field Service",
    ogDescription: "Trained electromechanic · 20 years in hotels and restaurants · conference technology, assembly, logistics · relocating to the Regensburg/Neutraubling area · fluent German and English.",
    ogUrl: `${SITE}en/`,
    ogLocale: "en_GB",
    ogImage: `${SITE}images/profil.png`,
    ogImageAlt: "Slavko Grbic – profile photo",
    twitterTitle: "Slavko Grbic – Technical Service &amp; Field Service",
    twitterDescription: "Trained electromechanic · 20 years in hotels and restaurants · conference technology, assembly, logistics · Regensburg/Neutraubling area.",
    stylesheetPath: "../css/output.css",
    fontPath: "../fonts/",
    skipToContent: "Skip to content",
    navAriaLabel: "Main navigation",
    navProfile: "Profile",
    navTech: "Technical",
    navExperience: "Experience",
    navProjects: "Projects",
    navDocuments: "Documents",
    navContact: "Contact",
    langToggleHref: "../",
    langToggleLang: "de",
    langToggleTitle: "Deutsche Version",
    langToggleAria: "Switch to German version",
    langToggleLabel: "DE",
    themeToggleTitle: "Toggle theme",
    pdfButtonTitle: "Download as PDF",
    pdfButtonText: "Download PDF",
    lightboxTitle: "Enlarged image",
    lightboxCloseAria: "Close",
    lightboxPrevAria: "Previous image",
    lightboxNextAria: "Next image",
    heroProfilePhotoAria: "View profile photos (3 images, use arrow keys to browse)",
    heroProfilePhotoTitle: "Click: all profile photos in the lightbox",
    heroImageAlt: "Slavko Grbic – profile photo",
    heroBarLabel: `CV · Updated ${UPDATED}`,
    heroSubtitle: "Technical service · Field service · Hospitality experience",
    heroLead: "Trained electromechanic with 20 years of hands-on experience in hotels and restaurants – on the way back into technical service.",
    heroDetail: "I know POS systems, fully automatic coffee machines and conference technology from daily use – and I know what downtime means in the middle of service. Currently Chef de Rang at Martas Hotel, Lutherstadt Wittenberg. Details under <a href=\"#technik\" class=\"hero-link\">Technical skills &amp; qualifications</a> and <a href=\"#erfahrung\" class=\"hero-link\">Work experience</a>.",
    heroContactButtonText: "Contact directly",
    heroLocationText: "Lutherstadt Wittenberg · relocating to the Regensburg/Neutraubling area",
    heroBirthYearText: "1988",
    specEmailLabel: "Email",
    specLocationLabel: "Location",
    specStatusLabel: "Status",
    specBornLabel: "Born",
    specLicenceLabel: "Driving licence",
    heroNationalityText: "Croatian citizen (EU) – no work permit required",
    heroDriverLicenseText: "Category B",
    heroBadges: "\n" + [
      badge("Apprenticeship: electromechanic"),
      badge("20 years in hotels &amp; restaurants"),
      badge("Conference tech · assembly · logistics"),
      badge("Fluent German &amp; English"),
    ].join("\n") + "\n    ",
    footerSubtitle: "Technical service · Hospitality experience · Regensburg area",
    footerEmailLabel: "Email",
    footerFormLinkText: "Go to the contact form",
    footerFocusLabel: "Focus",
    footerTopText: "Back to top",
    printContactLabel: "Contact",
    formSubjectPrefix: "Contact via portfolio",
    footerCopyright: "&copy; 2026 Slavko Grbic. All rights reserved.",
    galleryDataScript: "../js/gallery-data-en.js",
    galleryUiScript: "../js/gallery-ui.js",
    validationErrorText: "Please fill in all required fields (name, email, and message).",
    formSendingText: "Sending...",
    formSuccessText: "Message sent successfully!",
    formErrorText: "An error occurred while sending your message. Please try again later or email me directly.",
    web3FormsKey: WEB3FORMS_ACCESS_KEY,
    jsonld: jsonld('en'),
  }
};

// The e-mail address is written in reversed parts and assembled in the browser
// (see the inline script in src/layout.html) – light protection against harvesters.
const reverse = (s) => s.split('').reverse().join('');
function emailHtml(tag, classes) {
  const fallback = `${EMAIL.user} [at] ${EMAIL.domain.split('.').join(' [dot] ')}`;
  const href = tag === 'a' ? ' href="#kontakt-bereich"' : '';
  return `<${tag}${href} class="js-email ${classes}" data-u="${reverse(EMAIL.user)}" data-d="${reverse(EMAIL.domain)}">${fallback}</${tag}>`;
}
const sharedVars = {
  emailLinkHero: emailHtml('a', ''),
  emailLinkCard: emailHtml('a', 'link'),
  emailLinkFooter: emailHtml('a', ''),
  emailPrint: emailHtml('span', ''),
  icoRight: ICON.right,
  icoLeft: ICON.left,
  icoDown: ICON.down,
  icoUp: ICON.up,
  icoClose: ICON.close,
  icoTheme: ICON.theme,
};

// A photo block only appears when it contains photos Slavko approved as his own:
// approved-photos.json -> scripts/generate-gallery-data.mjs -> src/generated/galleries.json
function loadGalleryCounts() {
  const file = path.join(root, 'src', 'generated', 'galleries.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

const GALLERY_BLOCK = new RegExp('[ \\t]*<!-- gallery:([a-z-]+) -->([\\s\\S]*?)<!-- /gallery:\\1 -->[ \\t]*\\r?\\n?', 'g');
const LEADING_NEWLINE = new RegExp('^\\r?\\n');

function applyGalleryMarkers(html, counts) {
  return html.replace(GALLERY_BLOCK, (_, key, inner) => ((counts[key] || 0) > 0 ? inner.replace(LEADING_NEWLINE, '') : ''));
}

function buildPage(langCode, outputFile) {
  const layout = fs.readFileSync(path.join(root, 'src', 'layout.html'), 'utf8');
  const content = renderContent(langCode);
  const vars = { ...locales[langCode], ...sharedVars };

  let outputHtml = layout.replace('{{content}}', () => content);

  // Replace placeholders (function replacer: a "$" in the copy must never be read as a pattern)
  for (const [key, value] of Object.entries(vars)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    outputHtml = outputHtml.replace(placeholder, () => value);
  }

  outputHtml = applyGalleryMarkers(outputHtml, loadGalleryCounts());

  const leftover = outputHtml.match(/{{[a-zA-Z0-9_]+}}|<!-- \/?gallery[^>]*-->|\[\[TODO[^\]]*\]\]/g);
  if (leftover) {
    throw new Error(`${langCode}: unresolved placeholders, markers or TODOs: ${[...new Set(leftover)].join(', ')}`);
  }

  // Ensure output directory exists
  const dir = path.dirname(outputFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputFile, outputHtml, 'utf8');
  console.log(`Successfully built page: ${outputFile}`);
}

try {
  buildPage('de', path.join(root, 'index.html'));
  buildPage('en', path.join(root, 'en', 'index.html'));

  // Stand-alone page that does not use the CV layout
  fs.mkdirSync(path.join(root, 'lab'), { recursive: true });
  fs.copyFileSync(path.join(root, 'src', 'lab', 'index.html'), path.join(root, 'lab', 'index.html'));
  console.log(`Copied stand-alone page: ${path.join(root, 'lab', 'index.html')}`);
} catch (e) {
  console.error("Failed to build HTML pages:", e);
  process.exit(1);
}
