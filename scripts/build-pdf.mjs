// Builds the printed CV (src/cv/lebenslauf.mjs) as a PDF with an installed Chrome or Edge – no browser download.
//
//   npm run pdf            public variant  -> docs/Lebenslauf_Slavko_Grbic.pdf   (linked on the website, committed)
//   npm run pdf:private    private variant -> <Documents>/Bewerbung/Lebenslauf_Slavko_Grbic.pdf  (to attach to applications)
//
// The private variant adds phone number and address. They are read from
//   <Documents>/Bewerbung/cv-privat.json      (created as an empty form on the first run)
// or from the environment (CV_PHONE, CV_STREET, CV_ZIP_CITY, CV_BIRTHDATE, CV_BIRTHPLACE, CV_FAMILY).
// Nothing private is ever read from or written into this repository – the script refuses to do so.
//
// Runs on the developer machine only (not in CI): the public PDF is a committed file.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { chromium } from 'playwright-core';
import QRCode from 'qrcode';
import { EMAIL, UPDATED } from '../site.config.mjs';
import { renderCv, CV_DATES, CV_SITE_URL } from '../src/cv/lebenslauf.mjs';
import { renderContent } from '../src/pages/content.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const isPrivate = process.argv.includes('--private');
const noPhoto = process.argv.includes('--no-photo');
const PAGES = 2;
const FILE_NAME = 'Lebenslauf_Slavko_Grbic.pdf';

const fail = (msg) => { console.error(`\n  ✗ ${msg}\n`); process.exit(1); };
const inside = (dir, file) => { const rel = path.relative(dir, file); return !!rel && !rel.startsWith('..') && !path.isAbsolute(rel); };

// Phone numbers as they are written in Germany and Croatia: +49…, 0049…, 01xx…, +385…, 09x…
const PHONE = /(?:\+|00)\d{2,3}[\s\d/()-]{7,}|\b0\d{2,4}[\s/-]?\d{3,}[\s\d/-]{2,}/;

// ───────────── 1. the CV must not say anything the website does not say ─────────────
const site = renderContent('de');
const missing = CV_DATES.filter((d) => !site.includes(d));
if (missing.length) fail(`These dates are in the CV but not on the website (src/pages/content.mjs): ${missing.join(', ')}`);

// ───────────── 2. private data (never from inside the repository) ─────────────
const privateDir = process.env.CV_PRIVATE_DIR || path.join(os.homedir(), 'Documents', 'Bewerbung');
let priv = null;
let outFile = path.join(root, 'docs', FILE_NAME);

if (isPrivate) {
  if (inside(root, privateDir) || path.resolve(privateDir) === path.resolve(root)) {
    fail(`The private folder must be outside the repository (it is: ${privateDir}). This repository is public.`);
  }
  fs.mkdirSync(privateDir, { recursive: true });
  const dataFile = path.join(privateDir, 'cv-privat.json');
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({
      _hinweis: 'Nur diese Datei enthält deine privaten Daten. Sie liegt außerhalb des öffentlichen Projekts. Leere Felder werden weggelassen.',
      phone: '',
      street: '',
      zipCity: '',
      birthDate: '',
      birthPlace: '',
      family: '',
    }, null, 2) + '\n', 'utf8');
    console.log(`\n  Created an empty form: ${dataFile}`);
  }
  let file = {};
  try { file = JSON.parse(fs.readFileSync(dataFile, 'utf8')); } catch (e) { fail(`Cannot read ${dataFile}: ${e.message}`); }
  const pick = (env, key) => String(process.env[env] || file[key] || '').trim();
  priv = {
    phone: pick('CV_PHONE', 'phone'),
    street: pick('CV_STREET', 'street'),
    zipCity: pick('CV_ZIP_CITY', 'zipCity'),
    birthDate: pick('CV_BIRTHDATE', 'birthDate'),
    birthPlace: pick('CV_BIRTHPLACE', 'birthPlace'),
    family: pick('CV_FAMILY', 'family'),
  };
  if (!priv.phone) {
    fail(`The private CV needs at least your phone number.\n    Open this file, fill it in, and run "npm run pdf:private" again:\n    ${dataFile}`);
  }
  outFile = path.join(privateDir, FILE_NAME);
}

// ───────────── 3. render ─────────────
const now = new Date();
const today = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
const portrait = path.join(root, 'src', 'cv', 'portrait.jpg');
const qrSvg = (await QRCode.toString(CV_SITE_URL, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#0B0D12', light: '#FFFFFF' } }))
  .replace('<svg ', '<svg aria-hidden="true" ');

const html = renderCv({
  variant: isPrivate ? 'private' : 'public',
  priv,
  email: `${EMAIL.user}@${EMAIL.domain}`,
  updated: UPDATED,
  today,
  css: fs.readFileSync(path.join(root, 'src', 'cv', 'lebenslauf.css'), 'utf8'),
  fontsUrl: pathToFileURL(path.join(root, 'fonts')).href + '/',
  portraitUrl: !noPhoto && fs.existsSync(portrait) ? pathToFileURL(portrait).href : '',
  qrSvg,
});

// the HTML is only a step on the way; it is written next to the PDF's private data, or into a git-ignored folder
const workDir = isPrivate ? privateDir : path.join(root, '.shots', 'cv');
fs.mkdirSync(workDir, { recursive: true });
const htmlFile = path.join(workDir, 'lebenslauf.html');
fs.writeFileSync(htmlFile, html, 'utf8');

let browser = null;
for (const channel of ['chrome', 'msedge']) {
  try { browser = await chromium.launch({ channel, headless: true }); break; } catch { /* try the next one */ }
}
if (!browser) fail('No installed Chrome or Edge found.');

const page = await browser.newPage();
await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const fontsOk = await page.evaluate(() => document.fonts.check("900 20px 'Inter'") && document.fonts.check("600 10px 'JetBrains Mono'"));
const text = await page.evaluate(() => document.body.innerText);
fs.mkdirSync(path.dirname(outFile), { recursive: true });

// Exactly two pages. The layout is made for 100 %; if a variant runs a few lines over (the private one has more
// rows), everything is scaled down evenly in small steps - like "fit to page" in a print dialog, at most to 92 %.
const countPages = (file) => (fs.readFileSync(file).toString('latin1').match(/\/Type\s*\/Page\b(?!s)/g) || []).length;
let scale = 1;
for (; scale >= 0.919; scale = Math.round((scale - 0.01) * 100) / 100) {
  await page.pdf({ path: outFile, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true, scale });
  if (countPages(outFile) <= PAGES) break;
}
if (process.argv.includes('--png')) {
  await page.emulateMedia({ media: 'print' });
  await page.setViewportSize({ width: 794, height: 1123 });
  await page.screenshot({ path: path.join(workDir, 'lebenslauf.png'), fullPage: true });
}
await browser.close();
if (isPrivate) fs.rmSync(htmlFile, { force: true });

// ───────────── 4. checks ─────────────
if (!fontsOk) fail('The fonts did not load – the PDF would use a fallback font.');

const pageCount = countPages(outFile);
if (pageCount !== PAGES) fail(`The CV has ${pageCount} page(s), it must have exactly ${PAGES}. Shorten the text or adjust src/cv/lebenslauf.css. (${outFile})`);

for (const must of ['Slavko', `${EMAIL.user}@${EMAIL.domain}`, 'Elektromechaniker', 'Martas Hotel']) {
  if (!text.includes(must)) fail(`The CV text does not contain "${must}".`);
}
for (const never of [/erfahrener?\s+Elektromechaniker/i, /\bals\s+Elektrofachkraft\b/i, /\bMeister\b/]) {
  const bad = text.match(never);
  if (bad) fail(`The CV must never say "${bad[0]}".`);
}

if (!isPrivate) {
  const hit = text.match(PHONE);
  if (hit) fail(`The PUBLIC CV contains something that looks like a phone number: "${hit[0].trim()}". It will not be published.`);
  if (/stra(ß|ss)e\b|str\.\s*\d/i.test(text) || /\b\d{5}\s+[A-ZÄÖÜ]/.test(text)) fail('The PUBLIC CV contains something that looks like a street address or postcode.');
} else if (inside(root, outFile)) {
  fs.rmSync(outFile, { force: true });
  fail('Refusing to keep a private CV inside the public repository.');
}

const kb = Math.round(fs.statSync(outFile).size / 1024);
console.log(`\n  ✓ ${isPrivate ? 'PRIVATE' : 'public'} CV: ${outFile}`);
console.log(`    ${pageCount} pages · ${kb} KB · scale ${Math.round(Math.min(scale, 1) * 100)} % · dates match the website${isPrivate ? ' · with phone number – attach this one to applications' : ' · no phone number, no address'}\n`);
