// Builds photo-audit.html – a LOCAL review page (never published, git-ignored).
// Slavko ticks every photo he took himself; the page exports approved-photos.json.
// Rule: a photo is only published if it is ticked. Everything else gets removed.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import exifr from 'exifr';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const jobsDir = path.join(root, 'images', 'jobs');

const TITLES = {
  'martas-hotel': 'Martas Hotel, Lutherstadt Wittenberg (2017 – today)',
  'polster-catering': 'Polster Catering (2016 – 2017)',
  'amfora-hotel': 'Hotel Amfora, Hvar (2015)',
  'kod-javora': 'Restaurant Kod Javora, Osijek (2012 – 2015)',
  'pizzeria-orfej': 'Pizzeria Orfej, Osor (2010 – 2012)',
  'hotel-vespera': 'Hotel Vespera, Mali Lošinj (2006 – 2009)',
};

function sniff(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'JPEG';
  if (buf.slice(0, 8).toString('hex') === '89504e470d0a1a0a') return 'PNG';
  if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') return 'WebP';
  return 'unknown';
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const previouslyApproved = (() => {
  const f = path.join(root, 'approved-photos.json');
  if (!fs.existsSync(f)) return new Set();
  try { return new Set(JSON.parse(fs.readFileSync(f, 'utf8')).approved || []); } catch { return new Set(); }
})();

const folders = fs.readdirSync(jobsDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
const galleries = [];
let total = 0;

for (const folder of folders) {
  const files = fs.readdirSync(path.join(jobsDir, folder)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
  const items = [];
  for (const file of files) {
    const abs = path.join(jobsDir, folder, file);
    const buf = fs.readFileSync(abs);
    let meta = null;
    try { meta = await exifr.parse(buf, true); } catch { meta = null; }
    const camera = meta && (meta.Make || meta.Model) ? [meta.Make, meta.Model].filter(Boolean).join(' ') : '';
    const taken = meta && (meta.DateTimeOriginal || meta.CreateDate);
    const takenText = taken instanceof Date && !isNaN(taken) ? taken.toISOString().slice(0, 10) : '';
    const hasGps = !!(meta && typeof meta.latitude === 'number');
    const profile = meta && typeof meta.ProfileCopyright === 'string' ? meta.ProfileCopyright : '';
    const hints = [];
    if (profile === 'FB') hints.push('colour profile says: saved from Facebook');
    if (meta && meta.Software) hints.push('edited/exported with ' + meta.Software);
    items.push({
      src: `images/jobs/${folder}/${file}`,
      file,
      kb: Math.round(buf.length / 1024),
      format: sniff(buf),
      camera,
      taken: takenText,
      hasGps,
      hints,
      preApproved: previouslyApproved.has(`images/jobs/${folder}/${file}`),
    });
    total++;
  }
  galleries.push({ folder, title: TITLES[folder] || folder, items });
}

const cards = (g) => g.items.map((it) => {
  const facts = [];
  if (it.camera) facts.push(`<span class="ok">camera: ${esc(it.camera)}</span>`);
  if (it.taken) facts.push(`<span class="ok">taken: ${esc(it.taken)}</span>`);
  if (it.hasGps) facts.push('<span class="warn">has GPS location (will be stripped)</span>');
  if (!it.camera && !it.taken) facts.push('<span class="muted">no camera data</span>');
  it.hints.forEach((h) => facts.push(`<span class="warn">${esc(h)}</span>`));
  return `
      <label class="card">
        <img loading="lazy" src="${esc(it.src)}" alt="" />
        <span class="row"><input type="checkbox" data-src="${esc(it.src)}"${it.preApproved ? ' checked' : ''} /> <strong>I took this photo myself</strong></span>
        <span class="meta">${esc(it.file)} · ${it.format} · ${it.kb} KB</span>
        <span class="meta">${facts.join(' · ')}</span>
      </label>`;
}).join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Photo audit – which photos are really mine?</title>
<style>
  body { font-family: system-ui, 'Segoe UI', sans-serif; margin: 0; background: #f6f5f1; color: #1f2937; line-height: 1.5; }
  header, main { max-width: 1200px; margin: 0 auto; padding: 1.25rem; }
  h1 { margin: 0 0 .25rem; font-size: 1.6rem; }
  h2 { margin: 2.5rem 0 .25rem; font-size: 1.2rem; }
  .rule { background: #fff7e6; border: 1px solid #f0c36d; border-radius: 10px; padding: 1rem 1.25rem; margin: 1rem 0; }
  .bar { position: sticky; top: 0; z-index: 5; background: #0f1a2e; color: #fff; padding: .75rem 1.25rem; display: flex; flex-wrap: wrap; gap: .75rem 1.5rem; align-items: center; }
  .bar strong { color: #e8c27a; }
  button { font: inherit; font-weight: 600; border: 0; border-radius: 999px; padding: .55rem 1.1rem; cursor: pointer; background: #c9944a; color: #0f1a2e; }
  button.ghost { background: transparent; color: inherit; border: 1px solid currentColor; font-weight: 500; padding: .3rem .8rem; }
  .tools { display: flex; gap: .5rem; margin: .5rem 0 1rem; color: #4b5563; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 1rem; }
  .card { display: flex; flex-direction: column; gap: .35rem; background: #fff; border: 2px solid #e5e7eb; border-radius: 12px; padding: .6rem; cursor: pointer; }
  .card:has(input:checked) { border-color: #16a34a; background: #f0fdf4; }
  .card img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 8px; background: #e5e7eb; }
  .row { display: flex; align-items: center; gap: .5rem; }
  .row input { width: 1.2rem; height: 1.2rem; }
  .meta { font-size: .78rem; color: #6b7280; }
  .ok { color: #166534; } .warn { color: #b45309; } .muted { color: #9ca3af; }
</style>
</head>
<body>
<div class="bar">
  <span><strong id="count">0</strong> of ${total} photos ticked as mine</span>
  <button type="button" id="download">Download approved-photos.json</button>
  <span id="saved" style="opacity:.75"></span>
</div>
<header>
  <h1>Photo audit – which photos are really mine?</h1>
  <div class="rule">
    <p><strong>The rule:</strong> tick a photo only if <strong>you took it yourself</strong> (or a colleague took it for you at work and gave it to you).</p>
    <p>Do <strong>not</strong> tick photos from a hotel or restaurant website, Facebook, Instagram, Google, booking sites or press material – even if they show the place where you worked. Those belong to someone else. Publishing them can bring a paid warning letter (Abmahnung), and calling them "my photos" is not true.</p>
    <p><strong>Everything you leave unticked is removed from the website.</strong> A gallery with no ticked photo disappears completely – the job entry itself stays.</p>
    <p><strong>Note:</strong> none of these files contains camera data (they were exported, edited or downloaded at some point), so the files cannot tell us who took them. Only you know.</p>
    <p>When you are done: press <em>Download approved-photos.json</em> and tell Claude. Your ticks are also remembered in this browser, so you can stop and continue later.</p>
  </div>
</header>
<main>
${galleries.map((g) => `
  <section data-folder="${esc(g.folder)}">
    <h2>${esc(g.title)} <small style="font-weight:400;color:#6b7280">– ${g.items.length} photos</small></h2>
    <div class="tools">
      <button type="button" class="ghost" data-all="1">tick all in this gallery</button>
      <button type="button" class="ghost" data-all="0">untick all</button>
    </div>
    <div class="grid">${cards(g)}
    </div>
  </section>`).join('')}
</main>
<script>
  var KEY = 'photo-audit-v1';
  var boxes = Array.prototype.slice.call(document.querySelectorAll('input[type=checkbox][data-src]'));
  try {
    var stored = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (stored) boxes.forEach(function (b) { b.checked = stored.indexOf(b.getAttribute('data-src')) !== -1; });
  } catch (e) {}
  function approved() { return boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.getAttribute('data-src'); }); }
  function refresh() {
    var list = approved();
    document.getElementById('count').textContent = list.length;
    try { localStorage.setItem(KEY, JSON.stringify(list)); document.getElementById('saved').textContent = 'saved in this browser'; } catch (e) {}
  }
  boxes.forEach(function (b) { b.addEventListener('change', refresh); });
  document.querySelectorAll('button[data-all]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('data-all') === '1';
      btn.closest('section').querySelectorAll('input[type=checkbox]').forEach(function (b) { b.checked = on; });
      refresh();
    });
  });
  document.getElementById('download').addEventListener('click', function () {
    var list = approved();
    var all = boxes.map(function (b) { return b.getAttribute('data-src'); });
    var data = { note: 'Photos Slavko confirmed as his own. Only these may be published.', reviewedAt: new Date().toISOString().slice(0, 10), approved: list, notApproved: all.filter(function (s) { return list.indexOf(s) === -1; }) };
    var blob = new Blob([JSON.stringify(data, null, 2) + '\\n'], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'approved-photos.json';
    document.body.appendChild(a); a.click(); a.remove();
  });
  refresh();
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, 'photo-audit.html'), html, 'utf8');
console.log(`Wrote photo-audit.html – ${total} photos in ${galleries.length} galleries.`);
for (const g of galleries) {
  const withCam = g.items.filter((i) => i.camera || i.taken).length;
  const gps = g.items.filter((i) => i.hasGps).length;
  console.log(`  ${g.folder.padEnd(18)} ${String(g.items.length).padStart(2)} photos · ${withCam} with camera data · ${gps} with GPS`);
}
