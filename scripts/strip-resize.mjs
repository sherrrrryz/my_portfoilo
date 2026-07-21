/* Regenerates /public/strips — the art for the homepage "It means" marquee
   strips — from the full-res originals.
 *
 * The originals (/public/lockscreen-web, /public/section1-2 .. section1-5)
 * are 139.7 MB of PNG/JPG at up to 3240x7020. The strips display each image
 * at a pinned height of clamp(220px, 30vh, 380px) with width:auto, so at
 * most 760 device px tall on a DPR-2 screen: 19x to 74x fewer pixels than
 * the sources carry. Serving the originals cost ~180 ms of main-thread
 * decode per image and made the scroll stutter on the way into the section.
 *
 * Output is 800px-tall WebP (~1.7 MB for all 65 files). Run this after
 * changing any strip art, then commit /public/strips:
 *
 *   npm i --no-save sharp && node scripts/strip-resize.mjs
 *
 * sharp is intentionally not a project dependency — this is a one-off
 * authoring tool, not part of the build.
 */
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PUB = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const OUT = path.join(PUB, 'strips');

/* 800 covers the 380 CSS px cap at DPR 2 (=760) with headroom, and also
   covers DPR 3 phones, where 30vh of a phone viewport is much smaller.
   Resizing by height is exact because height is what the layout pins. */
const H = 800;
const Q = 82;

const SETS = [
  { dir: 'lockscreen-web', match: /^ls-\d+\.jpg$/ },
  { dir: 'section1-2', match: /^ds-\d+\.png$/ },
  { dir: 'section1-3', match: /\.png$/ },
  { dir: 'section1-4', match: /^touch-\d+\.png$/ },
  { dir: 'section1-5', match: /^s5-\d+\.png$/ },
];

await mkdir(OUT, { recursive: true });

let srcTotal = 0;
let outTotal = 0;
let count = 0;

for (const set of SETS) {
  const files = (await readdir(path.join(PUB, set.dir)))
    .filter((f) => set.match.test(f))
    .sort();
  for (const f of files) {
    const src = path.join(PUB, set.dir, f);
    const dst = path.join(OUT, f.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
    const before = (await stat(src)).size;
    await sharp(src).resize({ height: H, withoutEnlargement: true }).webp({ quality: Q }).toFile(dst);
    const after = (await stat(dst)).size;
    srcTotal += before;
    outTotal += after;
    count += 1;
    console.log(
      `${set.dir}/${f}  ${(before / 1048576).toFixed(2)}MB -> ${(after / 1024).toFixed(0)}KB`,
    );
  }
}

console.log(
  `\nTOTAL  ${(srcTotal / 1048576).toFixed(1)} MB -> ${(outTotal / 1048576).toFixed(2)} MB ` +
    `(${(srcTotal / outTotal).toFixed(0)}x smaller, ${count} files)`,
);
