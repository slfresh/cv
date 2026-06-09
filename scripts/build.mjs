import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
    heroDetail: "Aktuell Chef de Rang bei Martas Hotel (ehem. Luther-Hotel), Lutherstadt Wittenberg. Foto-Nachweise und Details zu allen Stationen unter <a href=\"#erfahrung\" class=\"text-gold-400/90 hover:text-gold-300 underline underline-offset-2\">Berufserfahrung</a> und <a href=\"#foto-nachweise\" class=\"text-gold-400/90 hover:text-gold-300 underline underline-offset-2\">Fotos</a>.",
    heroContactButtonText: "Direkt kontaktieren",
    heroBirthYearText: "Jahrgang 1988 · Brcko (BIH)",
    heroNationalityText: "Kroatisch",
    heroDriverLicenseText: "Führerschein Kategorie B",
    heroBadges: `
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 border border-white/20 rounded-full px-3 py-1.5 bg-white/5">Bankett &amp; Events bis 320 Gäste</span>
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 border border-white/20 rounded-full px-3 py-1.5 bg-white/5">POS, AV &amp; Logistik im Hotel</span>
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 border border-white/20 rounded-full px-3 py-1.5 bg-white/5">React · TypeScript · Next.js</span>
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 border border-white/20 rounded-full px-3 py-1.5 bg-white/5">DE/EN · Elektromechanik</span>
    `,
    footerSubtitle: "Service · Organisation · Technik · Internationale Berufserfahrung",
    footerCodeLinkText: "Quellcode",
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
      "knowsAbout": ["Gastronomie", "Eventmanagement", "Bankett", "Gästeservice", "Logistik", "Softwareentwicklung", "React", "TypeScript", "Next.js"],
      "sameAs": ["https://github.com/slfresh/cv"]
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
    heroDetail: "Currently Chef de Rang at Martas Hotel (formerly Luther-Hotel), Lutherstadt Wittenberg. Photo evidence and details for all stages under <a href=\"#erfahrung\" class=\"text-gold-400/90 hover:text-gold-300 underline underline-offset-2\">Work experience</a> and <a href=\"#foto-nachweise\" class=\"text-gold-400/90 hover:text-gold-300 underline underline-offset-2\">Photos</a>.",
    heroContactButtonText: "Contact directly",
    heroBirthYearText: "Born 1988 · Brcko (BIH)",
    heroNationalityText: "Croatian",
    heroDriverLicenseText: "Driver's license category B",
    heroBadges: `
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 border border-white/20 rounded-full px-3 py-1.5 bg-white/5">Banquets &amp; events up to 320 guests</span>
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 border border-white/20 rounded-full px-3 py-1.5 bg-white/5">POS, AV &amp; logistics in the hotel</span>
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 border border-white/20 rounded-full px-3 py-1.5 bg-white/5">React · TypeScript · Next.js</span>
      <span class="text-[11px] sm:text-xs uppercase tracking-wider text-gold-200/95 border border-white/20 rounded-full px-3 py-1.5 bg-white/5">DE/EN · Electromechanics</span>
    `,
    footerSubtitle: "Service · Organisation · Technology · International experience",
    footerCodeLinkText: "Source",
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
      "knowsAbout": ["Hospitality", "Event management", "Banqueting", "Guest service", "Logistics", "Software development", "React", "TypeScript", "Next.js"],
      "sameAs": ["https://github.com/slfresh/cv"]
    }, null, 2)
  }
};

function buildPage(langCode, pageContentFile, outputFile) {
  const layout = fs.readFileSync(path.join(root, 'src', 'layout.html'), 'utf8');
  const content = fs.readFileSync(path.join(root, 'src', 'pages', pageContentFile), 'utf8');
  const vars = locales[langCode];

  let outputHtml = layout.replace('{{content}}', content);

  // Replace placeholders
  for (const [key, value] of Object.entries(vars)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    outputHtml = outputHtml.replace(placeholder, value);
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
} catch (e) {
  console.error("Failed to build HTML pages:", e);
  process.exit(1);
}
