import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
  args: ['--no-sandbox'],
});
const page = await browser.newPage({viewport:{width:390,height:844}});
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('response', r => {if(r.status()>=400) errors.push(`${r.status()}: ${r.url()}`)});
page.on('requestfailed', r => errors.push(r.url()));
await page.goto(process.env.STATIC_URL || 'http://127.0.0.1:4180/jmal-ali-/');
await page.evaluate(() => document.fonts.ready);
assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
assert.equal(await page.locator('main>section').count(),14);
assert.ok(await page.locator('h1').innerText());
assert.ok(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth>0)));
await page.locator('.nav [data-lang=en]').click();
assert.equal(await page.locator('html').getAttribute('dir'),'ltr');
await page.locator('.help-float').click();
assert.ok(await page.locator('#help-modal').evaluate(e=>e.classList.contains('open')));
await page.keyboard.press('Escape');
await page.locator('[data-currency=USD]').click();
assert.equal(await page.locator('.current-price b').innerText(),'13');
await page.locator('.module').nth(1).locator('summary').click();
assert.notEqual(await page.locator('.module').nth(1).getAttribute('open'),null);
assert.deepEqual(errors,[]);
console.log('PASS: built GitHub Pages subpath loads 14 sections, fonts and images, AR/EN, callback, currency and accordion; zero HTTP/resource/runtime errors.');
await browser.close();
