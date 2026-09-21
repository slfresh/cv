import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EMAIL } from '../site.config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// Configurable Web3Forms Access Key
const WEB3FORMS_ACCESS_KEY = "14c93f9a-a7fd-4b9e-b8fe-183779a348e5";

const locales = {
  de: {
    lang: "de",
    title: "Slavko Grbic – Profil | Service, Organisation &amp; Technik",
    description: "Slavko Grbic: internationale Berufserfahrung (Gastronomie, Events, Logistik), sehr gute Deutsch- und Englischkenntnisse, ausgebildeter Elektromechaniker. Chef de Rang Martas Hotel Wittenberg; zusätzlich Software- und Web-Projekte (React, TypeScript). Zuverlässig, teamfähig, belastbar.",
    canonical: "https://slfresh.github.io/cv/",
    alternateDe: "https://slfresh.github.io/cv/",
    alternateEn: "https://slfresh.github.io/cv/en/",
    alternateDefault: "https://slfresh.github.io/cv/",
    photoPath: "images/profil.png",
    ogTitle: "Slavko Grbic – Service, Organisation &amp; Technik",
    ogDescription: "International erprobter Service &amp; Logistik, sehr gute DE/EN, technischer Background. Aktuell Chef de Rang Martas Hotel Wittenberg; Eigenentwicklungen in Software &amp; Web.",
    ogUrl: "https://slfresh.github.io/cv/",
    ogLocale: "de_DE",
    ogImage: "https://slfresh.github.io/cv/images/profil.png",
    ogImageAlt: "Slavko Grbic – Profilfoto",
    twitterTitle: "Slavko Grbic – Service, Organisation &amp; Technik",
    twitterDescription: "Gastronomie &amp; Events, Logistik, Sprachen &amp; technisches Verständnis. Martas Hotel, Polster Catering, internationale Karriere. Software- &amp; Web-Projekte.",
    stylesheetPath: "css/output.css",
    skipToContent: "Zum Inhalt springen",
    navAriaLabel: "Hauptnavigation",
    navProfile: "Profil",
    navPhilosophy: "Philosophie",
    navExperience: "Erfahrung",
    navPhotos: "Fotos",
    navIt: "IT",
    navSkills: "Skills",
    navEducation: "Ausbildung",
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
    heroSubtitle: "Service · Organisation · Technik",
    heroLead: "Chef de Rang / Servicemitarbeiter · Software- &amp; Web-Projekte in Eigenregie · international erprobt",
    heroDetail: "Aktuell Chef de Rang bei Martas Hotel (ehem. Luther-Hotel), Lutherstadt Wittenberg. Details zu allen Stationen unter <a href=\"#erfahrung\" class=\"text-gold-400/90 hover:text-gold-300 underline underline-offset-2\">Berufserfahrung</a>.",
    heroContactButtonText: "Direkt kontaktieren",
    heroBirthYearText: "Jahrgang 1988 · Brcko (BIH)",
    heroNationalityText: "Kroatisch",
    heroDriverLicenseText: "Führerschein Kategorie B",
    heroBadges: `
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 dark:text-gold-300 border border-white/20 dark:border-white/10 rounded-full px-3 py-1.5 bg-white/5">Bankett &amp; Events bis 320 Gäste</span>
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 dark:text-gold-300 border border-white/20 dark:border-white/10 rounded-full px-3 py-1.5 bg-white/5">POS, AV &amp; Logistik im Hotel</span>
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 dark:text-gold-300 border border-white/20 dark:border-white/10 rounded-full px-3 py-1.5 bg-white/5">React Native · TypeScript</span>
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 dark:text-gold-300 border border-white/20 dark:border-white/10 rounded-full px-3 py-1.5 bg-white/5">DE/EN · Elektromechanik</span>
    `,
    footerSubtitle: "Service · Organisation · Technik · Internationale Berufserfahrung",
    footerEmailLabel: "E-Mail",
    printContactLabel: "Kontakt",
    formSubjectPrefix: "Kontakt über Portfolio",
    footerCopyright: "&copy; 2026 Slavko Grbic. Alle Rechte vorbehalten.",
    galleryDataScript: "js/gallery-data-de.js",
    galleryUiScript: "js/gallery-ui.js",
    validationErrorText: "Bitte füllen Sie alle erforderlichen Felder aus (Name, E-Mail und Nachricht).",
    formSendingText: "Wird gesendet...",
    formSuccessText: "Nachricht erfolgreich gesendet!",
    formErrorText: "Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie mich direkt.",
    web3FormsKey: WEB3FORMS_ACCESS_KEY,
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Slavko Grbic",
      "url": "https://slfresh.github.io/cv/",
      "image": "https://slfresh.github.io/cv/images/profil.png",
      "jobTitle": "Chef de Rang",
      "address": {
        "@type": "PostalAddress",
        "postalCode": "06886",
        "addressLocality": "Lutherstadt Wittenberg",
        "addressCountry": "DE"
      },
      "nationality": {
        "@type": "Country",
        "name": "Croatia"
      },
      "knowsAbout": ["Gastronomie", "Eventmanagement", "Bankett", "Gästeservice", "Logistik", "Softwareentwicklung", "React Native", "TypeScript"]
    }, null, 2)
  },
  en: {
    lang: "en",
    title: "Slavko Grbic – Profile | Service, Organisation &amp; Technology",
    description: "Slavko Grbic: international career (hospitality, events, logistics), fluent German and English, trained electromechanic. Chef de Rang at Martas Hotel Wittenberg; self-built software and web projects (React, TypeScript). Reliable, team-oriented, resilient.",
    canonical: "https://slfresh.github.io/cv/en/",
    alternateDe: "https://slfresh.github.io/cv/",
    alternateEn: "https://slfresh.github.io/cv/en/",
    alternateDefault: "https://slfresh.github.io/cv/",
    photoPath: "../images/profil.png",
    ogTitle: "Slavko Grbic – Service, Organisation &amp; Technology",
    ogDescription: "International hospitality and logistics, fluent DE/EN, technical background. Chef de Rang at Martas Hotel Wittenberg; self-directed software and web work.",
    ogUrl: "https://slfresh.github.io/cv/en/",
    ogLocale: "en_GB",
    ogImage: "https://slfresh.github.io/cv/images/profil.png",
    ogImageAlt: "Slavko Grbic – profile photo",
    twitterTitle: "Slavko Grbic – Service, Organisation &amp; Technology",
    twitterDescription: "Hospitality and events, logistics, languages and technical skills. Martas Hotel, Polster Catering, international career. Software and web projects.",
    stylesheetPath: "../css/output.css",
    skipToContent: "Skip to content",
    navAriaLabel: "Main navigation",
    navProfile: "Profile",
    navPhilosophy: "Philosophy",
    navExperience: "Experience",
    navPhotos: "Photos",
    navIt: "IT",
    navSkills: "Skills",
    navEducation: "Education",
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
    heroSubtitle: "Service · Organisation · Technology",
    heroLead: "Chef de Rang / service staff · Self-directed software &amp; web projects · internationally proven",
    heroDetail: "Currently Chef de Rang at Martas Hotel (formerly Luther-Hotel), Lutherstadt Wittenberg. Details for all stages under <a href=\"#erfahrung\" class=\"text-gold-400/90 hover:text-gold-300 underline underline-offset-2\">Work experience</a>.",
    heroContactButtonText: "Contact directly",
    heroBirthYearText: "Born 1988 · Brcko (BIH)",
    heroNationalityText: "Croatian",
    heroDriverLicenseText: "Driver's license category B",
    heroBadges: `
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 dark:text-gold-300 border border-white/20 dark:border-white/10 rounded-full px-3 py-1.5 bg-white/5">Banquets &amp; events up to 320 guests</span>
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 dark:text-gold-300 border border-white/20 dark:border-white/10 rounded-full px-3 py-1.5 bg-white/5">POS, AV &amp; logistics in the hotel</span>
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 dark:text-gold-300 border border-white/20 dark:border-white/10 rounded-full px-3 py-1.5 bg-white/5">React Native · TypeScript</span>
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 dark:text-gold-300 border border-white/20 dark:border-white/10 rounded-full px-3 py-1.5 bg-white/5">DE/EN · Electromechanics</span>
    `,
    footerSubtitle: "Service · Organisation · Technology · International experience",
    footerEmailLabel: "Email",
    printContactLabel: "Contact",
    formSubjectPrefix: "Contact via portfolio",
    footerCopyright: "&copy; 2026 Slavko Grbic. All rights reserved.",
    galleryDataScript: "../js/gallery-data-en.js",
    galleryUiScript: "../js/gallery-ui.js",
    validationErrorText: "Please fill in all required fields (name, email, and message).",
    formSendingText: "Sending...",
    formSuccessText: "Message sent successfully!",
    formErrorText: "An error occurred while sending your message. Please try again later or contact me directly.",
    web3FormsKey: WEB3FORMS_ACCESS_KEY,
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Slavko Grbic",
      "url": "https://slfresh.github.io/cv/en/",
      "image": "https://slfresh.github.io/cv/images/profil.png",
      "jobTitle": "Chef de Rang",
      "address": {
        "@type": "PostalAddress",
        "postalCode": "06886",
        "addressLocality": "Lutherstadt Wittenberg",
        "addressCountry": "DE"
      },
      "nationality": {
        "@type": "Country",
        "name": "Croatia"
      },
      "knowsAbout": ["Hospitality", "Event management", "Banqueting", "Guest service", "Logistics", "Software development", "React Native", "TypeScript"]
    }, null, 2)
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
  emailLinkHero: emailHtml('a', 'hover:text-gold-400 transition-colors duration-200'),
  emailLinkCard: emailHtml('a', 'text-navy-500 dark:text-gold-300 font-semibold hover:text-gold-600 dark:hover:text-gold-400 underline underline-offset-2'),
  emailLinkFooter: emailHtml('a', 'hover:text-gold-400 transition-colors duration-300'),
  emailPrint: emailHtml('span', ''),
};

// A gallery only appears when it contains photos Slavko approved as his own:
// approved-photos.json -> scripts/generate-gallery-data.mjs -> src/generated/galleries.json
function loadGalleryCounts() {
  const file = path.join(root, 'src', 'generated', 'galleries.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

const GALLERY_BLOCK = new RegExp('[ \\t]*<!-- gallery:([a-z-]+) -->([\\s\\S]*?)<!-- /gallery:\\1 -->[ \\t]*\\r?\\n?', 'g');
const GALLERY_INDEX = new RegExp('[ \\t]*<!-- gallery-index -->([\\s\\S]*?)<!-- /gallery-index -->[ \\t]*\\r?\\n?', 'g');
const LEADING_NEWLINE = new RegExp('^\\r?\\n');

function applyGalleryMarkers(html, counts) {
  const anyJobGallery = Object.keys(counts).some((k) => k !== 'profil' && counts[k] > 0);
  html = html.replace(GALLERY_BLOCK, (_, key, inner) => ((counts[key] || 0) > 0 ? inner.replace(LEADING_NEWLINE, '') : ''));
  html = html.replace(GALLERY_INDEX, (_, inner) => (anyJobGallery ? inner.replace(LEADING_NEWLINE, '') : ''));
  return html;
}

function buildPage(langCode, pageContentFile, outputFile) {
  const layout = fs.readFileSync(path.join(root, 'src', 'layout.html'), 'utf8');
  const content = fs.readFileSync(path.join(root, 'src', 'pages', pageContentFile), 'utf8');
  const vars = { ...locales[langCode], ...sharedVars };

  let outputHtml = layout.replace('{{content}}', () => content);

  // Replace placeholders (function replacer: a "$" in the copy must never be read as a pattern)
  for (const [key, value] of Object.entries(vars)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    outputHtml = outputHtml.replace(placeholder, () => value);
  }

  outputHtml = applyGalleryMarkers(outputHtml, loadGalleryCounts());

  const leftover = outputHtml.match(/{{[a-zA-Z0-9_]+}}|<!-- \/?gallery[^>]*-->/g);
  if (leftover) {
    throw new Error(`${pageContentFile}: unresolved placeholders or markers: ${[...new Set(leftover)].join(', ')}`);
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
  buildPage('de', 'index.html', path.join(root, 'index.html'));
  buildPage('en', 'en.html', path.join(root, 'en', 'index.html'));

  // Stand-alone page that does not use the CV layout
  fs.mkdirSync(path.join(root, 'lab'), { recursive: true });
  fs.copyFileSync(path.join(root, 'src', 'lab', 'index.html'), path.join(root, 'lab', 'index.html'));
  console.log(`Copied stand-alone page: ${path.join(root, 'lab', 'index.html')}`);
} catch (e) {
  console.error("Failed to build HTML pages:", e);
  process.exit(1);
}
