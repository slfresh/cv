import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcDir = path.join(root, 'src');

function runBuild() {
  console.log('\n[Watcher] Rebuilding HTML pages...');
  const child = spawn('node', [path.join(root, 'scripts', 'build.mjs')], { stdio: 'inherit' });
  child.on('close', (code) => {
    if (code === 0) {
      console.log('[Watcher] Rebuild complete.');
    } else {
      console.log(`[Watcher] Build failed with code ${code}`);
    }
  });
}

// Initial build
runBuild();

console.log(`[Watcher] Monitoring changes in: ${srcDir}`);
let timeoutId = null;
fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
  if (filename) {
    if (timeoutId) clearTimeout(timeoutId);
    // Debounce watcher triggers
    timeoutId = setTimeout(() => {
      console.log(`[Watcher] Change detected in: ${filename}`);
      runBuild();
    }, 200);
  }
});
