import { cp, copyFile, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
// GitHub Pages can serve main / (root) without needing Node or the GitHub API.
// Keep the editable HTML in app/index.html; root index/assets are build outputs.
const root = process.cwd();
const manifestPath = path.join(root, '.static-assets.json');
let oldAssets = [];
try { oldAssets = JSON.parse(await readFile(manifestPath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
for (const file of oldAssets) {
  if (file.startsWith('assets/') && !file.includes('..')) await rm(path.join(root, file), {force:true});
}
await mkdir(path.join(root, 'assets'), {recursive:true});
await cp(path.join(root, 'dist/assets'), path.join(root, 'assets'), {recursive:true});
await copyFile(path.join(root, 'dist/index.html'), path.join(root, 'index.html'));
const { readdir } = await import('node:fs/promises');
const names = (await readdir(path.join(root, 'dist/assets'))).map(name => `assets/${name}`);
await writeFile(manifestPath, JSON.stringify(names, null, 2)+'\n');
await writeFile(path.join(root, '.nojekyll'), '');
console.log('Prepared static root index.html and assets/ for GitHub Pages.');
