// Builds public/og-image.png, the 1200x630 share preview named by the Open Graph tags in index.html.
//   node scripts/og-image.mjs            screenshot the tracker with the mid-run seed, then compose
//   node scripts/og-image.mjs --compose  compose from the last screenshot in verification/artifacts
// The screenshot goes through the verify-nuzlocke control CLI, so VERIFY_PORT and VERIFY_CDP_PORT
// pick its ports when another session holds 3100/9333.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const CLI = '.claude/skills/verify-nuzlocke/control-nuzlocke.mjs';
const SHOT = 'og-tracker';
const OUT = 'public/og-image.png';
const shotFile = path.resolve('verification/artifacts', `${SHOT}.png`);

const cli = (...args) => {
  const result = JSON.parse(execFileSync('node', [CLI, ...args], { encoding: 'utf8' }));
  if (!result.ok) throw new Error(`control CLI ${args.join(' ')}: ${JSON.stringify(result)}`);
  return result;
};

if (!process.argv.includes('--compose')) {
  cli('launch');
  try {
    cli('seed', 'mid-run');
    cli('viewport', 'desktop');
    cli('wait-settle');
    cli('screenshot', '--name', SHOT);
  } finally {
    cli('cleanup');
  }
}

const shot = fs.readFileSync(shotFile).toString('base64');
const html = `<!doctype html>
<html>
  <head>
    <style>
      * { box-sizing: border-box; margin: 0; }
      body {
        width: 1200px; height: 630px; overflow: hidden; position: relative;
        font-family: 'Helvetica Neue', Arial, sans-serif; color: #fff;
        background: linear-gradient(135deg, #1b1c1d 0%, #2b3a55 100%);
      }
      .text { position: absolute; left: 64px; top: 0; bottom: 0; width: 380px;
        display: flex; flex-direction: column; justify-content: center; gap: 24px; }
      h1 { font-size: 64px; line-height: 1.05; font-weight: 800; }
      p { font-size: 28px; line-height: 1.3; color: #cdd6e4; }
      .url { font-size: 22px; color: #f2711c; font-weight: 700; }
      img { position: absolute; left: 480px; top: 56px; width: 960px; border-radius: 12px;
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5); }
    </style>
  </head>
  <body>
    <div class="text">
      <h1>Nuzlocke Tracker</h1>
      <p>Track every encounter, badge and level cap of your Pokémon Nuzlocke runs.</p>
      <div class="url">nuzlocke.netlify.app</div>
    </div>
    <img src="data:image/png;base64,${shot}" alt="" />
  </body>
</html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html);
  await page.screenshot({ path: OUT });
} finally {
  await browser.close();
}
console.info(`${OUT}: ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
