import { chromium } from "playwright";
import assert from "node:assert/strict";
import { CONFIG, campaign } from "../src/config.js";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
const base = process.env.TEST_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH ||
    (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
  headless: true,
  args: ["--no-sandbox"],
});
const errors = [];
let checks = 0;
const check = (value, message) => {
  assert.ok(value, message);
  checks++;
};
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
page.on("pageerror", (error) => errors.push(error.message));
await page.goto(base);
await page.evaluate(() => document.fonts.ready);
const ids = await page
  .locator("main>section")
  .evaluateAll((es) => es.map((e) => e.id));
assert.deepEqual(ids, [
  "course",
  "intro",
  "reviews",
  "work",
  "fit",
  "instructor",
  "difference",
  "results",
  "program",
  "tools",
  "access",
  "price",
  "faq",
  "",
]);
checks++;
for (const lang of ["ar", "en"]) {
  await page.locator(`.nav [data-lang=${lang}]`).click();
  check(
    (await page.locator("html").getAttribute("dir")) ===
      (lang === "ar" ? "rtl" : "ltr"),
    `${lang} direction`,
  );
  check(
    (await page.locator("html").getAttribute("lang")) === lang,
    `${lang} language`,
  );
  check(
    (await page.locator("meta[name=description]").getAttribute("content"))
      .length > 40,
    `${lang} metadata`,
  );
  check((await page.locator("#faq details").count()) === 9, `${lang} full FAQ`);
  for (const width of [1440, 1024, 768, 390, 360]) {
    await page.setViewportSize({ width, height: width > 800 ? 1000 : 844 });
    await page.evaluate(() => scrollTo(0, 0));
    check(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${lang} no overflow at ${width}`,
    );
    check(
      await page
        .locator("img")
        .evaluateAll((es) => es.every((e) => e.complete && e.naturalWidth > 0)),
      `${lang} valid images at ${width}`,
    );
    if (width === 1440 || width === 390) {
      await page.screenshot({
        path: `screenshots/${lang}-${width === 1440 ? "desktop" : "mobile"}.png`,
        fullPage: true,
      });
      await page.screenshot({
        path: `screenshots/${lang}-${width === 1440 ? "desktop" : "mobile"}-hero.png`,
      });
    }
  }
  await page.locator("[data-menu]").click();
  check(
    await page
      .locator("#mobile-nav")
      .evaluate((e) => e.classList.contains("open")),
    `${lang} mobile menu opens`,
  );
  await page.locator('#mobile-nav a[href="#program"]').click();
  check(
    (await page.locator("[data-menu]").getAttribute("aria-expanded")) ===
      "false",
    `${lang} mobile menu closes`,
  );
  const module = page.locator(".module").nth(1);
  await module.locator("summary").click();
  check(
    (await module.getAttribute("open")) !== null,
    `${lang} curriculum expands`,
  );
  await module.locator("summary").click();
  check(
    (await module.getAttribute("open")) === null,
    `${lang} curriculum collapses`,
  );
  const faq = page.locator(".faq").nth(2);
  await faq.locator("summary").focus();
  await page.keyboard.press("Enter");
  check((await faq.getAttribute("open")) !== null, `${lang} FAQ keyboard`);
  await page.locator("[data-currency=USD]").click();
  check(
    (await page.locator(".current-price b").textContent()) === "13",
    `${lang} USD price`,
  );
  check(
    (await page.locator(".sticky-buy strong").textContent()).includes("13"),
    `${lang} sticky price`,
  );
  await page.locator("[data-currency=EGP]").click();
  check(
    (await page.locator(".current-price b").textContent()) === "700",
    `${lang} EGP price`,
  );
  // Every enrollment CTA must open the explicit unconfigured checkout state.
  for (let i = 0; i < (await page.locator("[data-checkout]").count()); i++) {
    const cta = page.locator("[data-checkout]").nth(i);
    if (!(await cta.isVisible())) continue;
    await cta.click();
    check(
      await page
        .locator("#checkout-modal")
        .evaluate((e) => e.classList.contains("open")),
      `${lang} checkout ${i}`,
    );
    await page.keyboard.press("Escape");
  }
  await page.locator(".help-float").click();
  check(
    await page
      .locator("#lead-name")
      .evaluate((e) => e === document.activeElement),
    `${lang} initial modal focus`,
  );
  await page.locator("#help-modal [data-close-modal]").focus();
  await page.keyboard.press("Shift+Tab");
  check(
    await page
      .locator("#help-modal [type=submit]")
      .evaluate((e) => e === document.activeElement),
    `${lang} focus wraps backward`,
  );
  await page.keyboard.press("Tab");
  check(
    await page
      .locator("#help-modal [data-close-modal]")
      .evaluate((e) => e === document.activeElement),
    `${lang} focus wraps forward`,
  );
  await page.locator("#lead-form [type=submit]").click();
  check(
    (await page.locator("#form-status").textContent()).length > 0,
    `${lang} required name`,
  );
  await page
    .locator("#lead-name")
    .fill(lang === "ar" ? "محمود علي" : "Alex Editor");
  await page.locator("#lead-phone").fill("123");
  await page.locator("#lead-form [type=submit]").click();
  check(
    await page
      .locator("#lead-phone")
      .evaluate((e) => e === document.activeElement),
    `${lang} invalid phone focus`,
  );
  await page.locator("#lead-phone").fill("+201012345678");
  await page.locator("#lead-website").fill("nonsense");
  await page.locator("#lead-form [type=submit]").click();
  check(
    await page
      .locator("#lead-website")
      .evaluate((e) => e === document.activeElement),
    `${lang} invalid optional URL`,
  );
  await page.locator("#lead-website").fill("");
  await page.locator("#lead-form [type=submit]").click();
  check(
    (await page.locator("#form-status").textContent()).includes(
      lang === "ar" ? "مش هيتبعت" : "not been sent",
    ),
    `${lang} no fake submission`,
  );
  await page.screenshot({ path: `screenshots/${lang}-mobile-popup.png` });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: `screenshots/${lang}-desktop-popup.png` });
  await page.keyboard.press("Escape");
  check(
    await page
      .locator(".help-float")
      .evaluate((e) => e === document.activeElement),
    `${lang} restored focus`,
  );
  await page.locator(".help-float").click();
  await page.mouse.click(4, 4);
  check(
    !(await page
      .locator("#help-modal")
      .evaluate((e) => e.classList.contains("open"))),
    `${lang} backdrop close`,
  );
  check(
    await page
      .locator("[data-audio]")
      .evaluateAll((es) => es.every((e) => e.disabled)),
    `${lang} missing audio not playable`,
  );
}
await page.reload();
check(
  (await page.locator("html").getAttribute("lang")) === "en",
  "language persisted",
);
// Configured integrations are exercised with intercepted test responses, never real leads or payments.
const integration = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
});
await integration.route("**/src/config.js*", async (route) => {
  const r = await route.fetch();
  await route.fulfill({
    response: r,
    body:
      (await r.text()) +
      `\nObject.assign(CONFIG, {leadEndpoint:'https://leads.example.test/callback',checkoutEGP:'https://checkout.example.test/egp',checkoutUSD:'https://checkout.example.test/usd',introVideo:'/assets/test.mp4',beforeAudio:'/assets/before.wav',afterAudio:'/assets/after.wav'});`,
  });
});
let body;
let mode = "success";
await integration.route(
  "https://leads.example.test/callback",
  async (route) => {
    body = route.request().postDataJSON();
    await new Promise((r) => setTimeout(r, 150));
    await route.fulfill({
      status: mode === "success" ? 201 : 500,
      contentType: "application/json",
      body: "{}",
    });
  },
);
await integration.goto(base);
await integration.locator(".help-float").click();
await integration.locator("#lead-name").fill("Test Editor");
await integration.locator("#lead-phone").fill("+201012345678");
await integration.locator("#lead-form [type=submit]").click();
check(
  await integration.locator("#lead-form [type=submit]").isDisabled(),
  "loading state",
);
await integration.waitForFunction(() =>
  document.querySelector("#form-status").textContent.includes("بنجاح"),
);
check(
  body.name === "Test Editor" && body.locale === "ar",
  "configured JSON payload",
);
mode = "error";
await integration.locator("#lead-name").fill("Test Editor");
await integration.locator("#lead-phone").fill("+201012345678");
await integration.locator("#lead-form [type=submit]").click();
await integration.waitForFunction(() =>
  document.querySelector("#form-status").textContent.includes("مشكلة"),
);
check(
  !(await integration.locator("#lead-form [type=submit]").isDisabled()),
  "server error allows retry",
);
await integration.keyboard.press("Escape");
check(
  (await integration.locator(".video-box video").count()) === 1,
  "configured intro video",
);
check(
  (await integration.locator("#comparison-audio").count()) === 1,
  "configured real-audio control",
);
check(
  !(await integration.locator("[data-audio=after]").isDisabled()),
  "configured audio switching",
);
await integration.locator("[data-audio=after]").click();
check(
  (await integration.locator("#comparison-audio").getAttribute("src")).endsWith(
    "after.wav",
  ),
  "audio source switches",
);
await integration.route("https://checkout.example.test/**", (route) =>
  route.fulfill({
    contentType: "text/html",
    body: "<h1>Test checkout destination</h1>",
  }),
);
await integration.locator(".nav [data-checkout]").click();
await integration.waitForURL("https://checkout.example.test/egp");
check(integration.url().endsWith("/egp"), "configured EGP checkout navigation");
await integration.goto(base);
await integration.locator("[data-currency=USD]").click();
await integration.locator(".nav [data-checkout]").click();
await integration.waitForURL("https://checkout.example.test/usd");
check(integration.url().endsWith("/usd"), "configured USD checkout navigation");
for (const [status, start, expected] of [
  ["active", Date.now() - 86400000, "700"],
  ["expired", Date.now() - 6 * 86400000, "3500"],
  ["scheduled", Date.now() + 86400000, "3500"],
]) {
  const scenario = await browser.newPage();
  await scenario.route("**/src/config.js*", async (route) => {
    const r = await route.fetch();
    await route.fulfill({
      response: r,
      body:
        (await r.text()) +
        `\nCONFIG.campaignStart='${new Date(start).toISOString()}';`,
    });
  });
  await scenario.goto(base);
  check(
    (await scenario.locator(".current-price b").textContent()) === expected,
    `${status} campaign displayed price`,
  );
  await scenario.close();
}
// Campaign boundary checks are deterministic and use no invented public campaign dates.
check(campaign().status === "unconfigured", "no invented campaign date");
CONFIG.campaignStart = "2030-01-01T00:00:00Z";
const start = Date.parse(CONFIG.campaignStart);
check(campaign(start - 1).status === "scheduled", "before campaign");
check(campaign(start).active, "campaign start inclusive");
check(campaign(start + 5 * 86400000 - 1).active, "five-day offer duration");
check(
  campaign(start + 5 * 86400000).status === "expired",
  "campaign end exclusive",
);
check(errors.length === 0, `no runtime exceptions: ${errors.join(", ")}`);
await fs.writeFile(
  "screenshots/test-results.json",
  JSON.stringify(
    {
      checks,
      errors,
      viewports: [1440, 1024, 768, 390, 360],
      languages: ["ar", "en"],
      integrationMode: "intercepted test responses; no real submissions",
    },
    null,
    2,
  ),
);
console.log(
  `PASS: ${checks} assertions; screenshots captured; no runtime exceptions.`,
);
await browser.close();
