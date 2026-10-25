import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/600.css";
import "./base.css";
import "./styles.css";
import { CONFIG, campaign } from "./config.js";
import { copy } from "./content.js";
("use strict");
/* TAHREEK SOUND DESIGN — BILINGUAL COURSE PAGE V4
   Configure real integrations before going live. */

const ASSETS = {
  logo: `${import.meta.env.BASE_URL}assets/logo.png`,
  cover: `${import.meta.env.BASE_URL}assets/cover.jpg`,
};

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
function text(v) {
  return esc(v);
}
let state = { lang: "ar", currency: "EGP", audio: "before", lastFocus: null };
function secTitle(s, id, label, title, lead, extra = "") {
  return `<section id="${id}" class="section ${extra}"><div class="wrap"><div class="top"><div class="eyebrow">${text(label)}</div><h2>${text(title)}</h2><p class="lead">${text(lead)}</p></div>${s}</div></section>`;
}
function priceWords(c) {
  const p = CONFIG.prices[state.currency],
    o = campaign(),
    sale = o.active || o.status === "unconfigured",
    num = sale ? p.introductory : p.base;
  const unit = state.currency === "EGP" ? c.unitEGP : c.unitUSD;
  const format = (n) =>
    state.lang === "en"
      ? `${state.currency} ${n.toLocaleString("en-US")}`
      : `${n.toLocaleString("en-US")} ${unit}`;
  return [sale ? format(p.base) : "", format(num), String(num), unit];
}
function workBars(n) {
  return Array.from({ length: n }, (_, i) => {
    let h =
      12 + Math.round(Math.abs(Math.sin(i * 0.49) * Math.cos(i * 0.17)) * 76);
    return `<i style="--bar:${h}%"></i>`;
  }).join("");
}
function studyGraphic(i) {
  if (i === 0) return `<div class="study-wave">${workBars(55)}</div>`;
  if (i === 1)
    return `<div class="spectral">${Array.from({ length: 38 }, (_, j) => `<i style="--x:${j * 2.6}%;--opacity:${0.15 + Math.abs(Math.sin(j * 0.7)) * 0.65}"></i>`).join("")}<div class="frequency-line"></div></div>`;
  if (i === 2)
    return `<div class="layer-study">${[0, 1, 2, 3].map((n) => `<div style="--offset:${n * 15}px">${workBars(35)}</div>`).join("")}</div>`;
  if (i === 3)
    return `<div class="spatial-study"><i></i><i></i><i></i><span>L</span><span>R</span></div>`;
  return `<div class="rhythm-study">${Array.from({ length: 16 }, (_, j) => `<i style="--beat:${j % 4 === 0 ? 90 : j % 2 === 0 ? 50 : 25}%"></i>`).join("")}</div>`;
}
function studioArt(c) {
  return `<div class="sound-art" dir="ltr" role="img" aria-label="${text(c.studioAlt)}">
 <div class="studio-top"><span><i class="live-dot"></i> TAHREEK / AUDIO LAB</span><span>01—04</span></div>
 <div class="sonic-sculpture"><div class="orbital orbit-one"></div><div class="orbital orbit-two"></div><div class="sculpture-bars">${Array.from({ length: 71 }, (_, i) => `<i style="--h:${18 + Math.pow(Math.sin((i / 70) * Math.PI), 1.6) * 190 * (0.65 + 0.35 * Math.sin(i * 0.43))}px;--r:${Math.sin(i * 0.16) * 19}deg"></i>`).join("")}</div><span class="art-cross cross-one">+</span><span class="art-cross cross-two">+</span><div class="art-type">${c.artLine1}<br>${c.artLine2}<span>.</span></div></div>
 <div class="timeline"><div class="timeline-ruler"><span>00:00</span><span>00:05</span><span>00:10</span><span>00:15</span></div>${c.trackLabels.map((n, i) => `<div class="track"><span>${n}</span><div class="clip clip-${i}">${workBars(45)}</div></div>`).join("")}<div class="playhead"></div></div>
 <div class="studio-bottom"><span>${text(c.illustrative)}</span><span>48 kHz / 24 BIT</span></div></div>`;
}
function priceBadge(c) {
  const s = campaign().status;
  return s === "active"
    ? c.launch
    : s === "unconfigured"
      ? c.previewOffer
      : s === "expired"
        ? c.standardPrice
        : c.scheduledPrice;
}
function offerText(c) {
  const o = campaign();
  if (o.status === "unconfigured") return c.offerPending;
  if (o.status === "expired") return c.offerExpired;
  const date = new Intl.DateTimeFormat(
    state.lang === "ar" ? "ar-EG" : "en-GB",
    { dateStyle: "medium", timeZone: "Africa/Cairo" },
  );
  return (
    (o.active ? c.offerActive : c.offerScheduled) +
    " " +
    date.format(o.active ? o.end : o.start)
  );
}
function safeURL(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const u = new URL(value, document.baseURI);
    return ["https:", "http:"].includes(u.protocol) &&
      (u.protocol === "https:" || u.origin === location.origin)
      ? u.href
      : "";
  } catch {
    return "";
  }
}
function render() {
  const c = copy[state.lang];
  document.documentElement.lang = state.lang;
  document.documentElement.dir = c.dir;
  document.title = c.pageTitle;
  document.querySelector('meta[name="description"]').content =
    c.metaDescription;
  document.querySelector('meta[property="og:title"]').content = c.pageTitle;
  document.querySelector('meta[property="og:description"]').content =
    c.metaDescription;
  document.querySelector('meta[property="og:locale"]').content =
    state.lang === "ar" ? "ar_EG" : "en_US";
  let canonical = document.querySelector('link[rel="canonical"]');
  if (CONFIG.canonicalURL) {
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    canonical.href = safeURL(CONFIG.canonicalURL);
  }

  const [old, now, num, unit] = priceWords(c);
  const navIds = ["course", "work", "fit", "instructor", "program", "faq"];
  const navLinks = c.nav
    .map((v, i) => `<a href="#${navIds[i]}">${text(v)}</a>`)
    .join("");
  const makeStudy = (v, i) =>
    `<article class="study ${i === 0 ? "big" : ""}"><div class="graphic" aria-hidden="true">${studyGraphic(i)}</div><span class="study-placeholder">${text(c.studyPending)}</span><span class="study-no">${text(v[0])}</span><h3>${text(v[1])}</h3><p>${text(v[2])}</p></article>`;
  let html = `
 <a class="skip-link" href="#main">${text(c.skip)}</a><div class="bar"><span class="live-dot"></span>${text(offerText(c))}<span class="bar-end">TAHREEK SOUND DESIGN</span></div>
 <div class="navshell"><header class="wrap nav">
   <a class="brand" href="#course" aria-label="Tahreek Academy"><img src="${ASSETS.logo}" alt="Tahreek Academy"></a>
   <nav class="navlinks" aria-label="${text(c.navLabel)}">${navLinks}</nav>
   <div class="navright"><div class="langs" aria-label="${text(c.languageLabel)}"><button data-lang="ar" aria-pressed="${state.lang === "ar"}" lang="ar">AR</button><button data-lang="en" aria-pressed="${state.lang === "en"}" lang="en">EN</button></div><a href="#price" class="btn small primary" data-checkout>${text(c.enroll)} <span class="cta-arrow" aria-hidden="true"></span></a><button class="menu-btn" type="button" data-menu aria-expanded="false" aria-controls="mobile-nav" aria-label="${text(c.menu)}">☰</button></div>
 </header><nav class="mobile-nav" id="mobile-nav">${navLinks}</nav></div>
 <main id="main">
 <section class="hero" id="course"><div class="wrap hero-inner">
 <div class="hero-copy"><div class="eyebrow">${text(c.heroKicker)}</div><div class="hero-discipline" dir="ltr">SOUND DESIGN<span> / THE COURSE</span></div><h1>${text(c.heroLine)}<em>${text(c.heroAccent)}</em></h1>
  <p>${text(c.heroBody)}</p><div class="rating" aria-label="${text(c.countLabel)}"><span class="stars" aria-hidden="true">★★★★★</span><span dir="ltr">4.9/5</span><span>${text(CONFIG.ratingVerified ? c.ratingLabel : c.ratingPending)}</span></div>
  <div class="chips">${c.heroChips.map((x) => `<span class="chip">${text(x)}</span>`).join("")}</div>
  <div class="offerline"><span class="sale-tag">${text(priceBadge(c))}</span><s class="strike">${text(old)}</s><strong class="hero-price">${text(now)}</strong></div>
  <div class="perks">${c.perk
    .slice(0, 3)
    .map((x) => `<span>${text(x)}</span>`)
    .join("")}</div>
  <div class="actions"><a class="btn primary" href="#price" data-checkout>${text(c.enroll)} <span class="cta-arrow" aria-hidden="true"></span></a><a class="btn outline" href="#program">${text(c.ctaSecondary)} ↓</a></div><div class="hero-note">${text(c.heroBottom)}</div>
 </div><div class="art">${studioArt(c)}</div>
 </div><div class="hero-foot wrap"><span>01 / LISTEN</span><span>02 / MIX</span><span>03 / STORYTELL</span><span>04 / INNOVATE</span></div></section>`;
  html += secTitle(
    `<div class="video-box" aria-label="${text(c.introVideoLabel)}"><div class="intro-visual" aria-hidden="true">${workBars(65)}</div><span class="media-status">${text(c.mediaPending)}</span><strong>${text(c.introVideoLabel)}</strong><small>${text(c.videoPending)}</small></div><div class="metrics">${c.introStats.map((x) => `<div class="metric"><strong>${text(x[0])}</strong><span>${text(x[1])}</span></div>`).join("")}</div><p class="dim" style="margin-top:19px">${text(c.introFoot)}</p>`,
    "intro",
    c.introLabel,
    c.introTitle,
    c.introLead,
  );
  html += secTitle(
    `<div class="review-shell"><div class="scorecard"><div><span class="eyebrow">${text(c.reviewScore)}</span><div class="score" dir="ltr">4.9/5</div><span class="stars" aria-hidden="true">★★★★★</span></div><div class="tiny dim">${text(c.reviewPending)}</div></div><div class="review-placeholders">${c.reviewCards.map((x) => `<div class="review-box"><span class="icon">↗</span><div><h3>${text(x[0])}</h3><p>${text(x[1])}</p></div><span class="under-review">${text(c.reviewAwaiting)}</span></div>`).join("")}</div></div>`,
    "reviews",
    c.reviewsLabel,
    c.reviewsTitle,
    c.reviewsLead,
    "alt",
  );
  html += secTitle(
    `<div class="gallery">${c.studies.map(makeStudy).join("")}</div><div class="before-after"><div class="before-head"><div><h3>${text(c.workCompareTitle)}</h3><p class="dim tiny">${text(c.workCompareDesc)}</p></div><div class="before-actions"><button class="switch" data-audio="before" aria-pressed="${state.audio === "before"}">${text(c.before)}</button><button class="switch" data-audio="after" aria-pressed="${state.audio === "after"}">${text(c.after)}</button></div></div><div class="wave-demo" id="wave-demo" aria-hidden="true"></div><p class="helper" id="wave-caption">${text(state.audio === "before" ? c.waveBefore : c.waveAfter)}</p></div>`,
    "work",
    c.workLabel,
    c.workTitle,
    c.workLead,
  );
  html += secTitle(
    `<div class="fit-grid">${c.fit.map((x, i) => `<article class="fit-card"><span class="num">0${i + 1}</span><h3>${text(x[0])}</h3><p>${text(x[1])}</p></article>`).join("")}</div><div class="notfit"><strong>${text(c.notFitTitle)}</strong><div>${text(c.notFit)}</div></div>`,
    "fit",
    c.fitLabel,
    c.fitTitle,
    c.fitLead,
    "alt",
  );
  html += `<section id="instructor" class="section"><div class="wrap instructor-grid"><div class="portrait" role="img" aria-label="${text(c.photoPending)}"><span class="portrait-label">${text(c.photoPending)}</span><span class="monogram">GAMAL<br>ALI<span>↗</span></span></div><div class="instructor-body"><div class="eyebrow">${text(c.instructorLabel)}</div><h2>${text(c.instructorTitle)}</h2><p>${text(c.instructorBio1)}</p><p>${text(c.instructorBio2)}</p><p>${text(c.instructorBio3)}</p><p class="evidence-note">${text(CONFIG.experienceVerified ? c.experienceConfirmed : c.experiencePending)}</p><div class="stat-row"><div class="stat-box"><strong>7+</strong><span>${text(c.statYears)}</span></div><div class="stat-box"><strong>500+</strong><span>${text(c.statStudents)}</span></div></div></div></div></section>`;
  html += secTitle(
    `<div class="compare">${c.diff.map((x) => `<article class="contrast-card"><div class="from">${text(x[0])} <span class="arrow">→</span></div><strong class="to">${text(x[1])}</strong></article>`).join("")}</div>`,
    "difference",
    c.diffLabel,
    c.diffTitle,
    c.diffLead,
    "alt",
  );
  html += secTitle(
    `<div class="outcomes">${c.results.map((x, i) => `<article class="outcome"><span class="num">0${i + 1}</span><h3>${text(x[0])}</h3><p>${text(x[1])}</p></article>`).join("")}</div>`,
    "results",
    c.resultsLabel,
    c.resultsTitle,
    c.resultsLead,
  );
  html += secTitle(
    `<div class="modules">${c.modules.map((m, i) => `<details class="module" ${i === 0 ? "open" : ""}><summary><span class="number">0${i + 1}</span><span class="modtitle">${text(m[0])}<small>${text(m[1])}</small></span><span class="plus" aria-hidden="true">+</span></summary><div class="modcontent"><p>${text(m[2])}</p><ul class="lesson-grid">${m[3].map((l) => `<li>${text(l)}</li>`).join("")}</ul></div></details>`).join("")}</div>`,
    "program",
    c.programLabel,
    c.programTitle,
    c.programLead,
    "alt",
  );
  html += secTitle(
    `<div class="tools">${c.tools.map((x, i) => `<article class="tool"><span class="label">0${i + 1}</span><h3>${text(x[0])}</h3><p>${text(x[1])}</p></article>`).join("")}</div>`,
    "tools",
    c.toolsLabel,
    c.toolsTitle,
    c.toolsLead,
  );
  html += `<section id="access" class="section alt"><div class="wrap access-grid"><div><div class="eyebrow">${text(c.accessLabel)}</div><h2>${text(c.accessTitle)}</h2><p class="lead">${text(c.accessLead)}</p><div class="access-list">${c.accessList.map((x) => `<div>${text(x)}</div>`).join("")}</div></div><div class="device"><div class="screen"><span>▰</span></div><strong>${text(c.deviceTitle)}</strong><p>${text(c.deviceSub)}</p></div></div></section>`;
  html += `<section id="price" class="section"><div class="wrap pricing-grid"><div><div class="eyebrow">${text(c.priceLabel)}</div><h2>${text(c.priceTitle)}</h2><p class="lead">${text(c.priceLead)}</p><p class="dim">${text(c.priceAside)}</p></div><div class="pricing-card"><span class="tag">${text(c.priceKicker)}</span><h3>${text(c.priceCardTitle)}</h3><div class="currency"><button aria-pressed="${state.currency === "EGP"}" data-currency="EGP">${text(c.tabEGP)}</button><button aria-pressed="${state.currency === "USD"}" data-currency="USD">${text(c.tabUSD)}</button></div><s class="strike">${text(old)}</s><div class="current-price"><b>${text(num)}</b><span>${text(unit)}</span></div><span class="sale-tag">${text(priceBadge(c))}</span><p class="offer-status">${text(offerText(c))}</p><div class="price-perks">${c.priceFeatures
    .slice(0, -1)
    .map((x) => `<div>${text(x)}</div>`)
    .join(
      "",
    )}</div><button type="button" class="btn primary" data-checkout>${text(c.enroll)} <span class="cta-arrow" aria-hidden="true"></span></button><p class="warning">${text(c.checkoutNote)}</p><p class="refund-note">${text(CONFIG.refundTermsVerified ? c.refundVerified : c.refundPending)}${CONFIG.refundTermsVerified && safeURL(CONFIG.refundTermsURL) ? ` <a href="${text(safeURL(CONFIG.refundTermsURL))}">${text(c.terms)}</a>` : ""}</p></div></div></section>`;
  html += secTitle(
    `<div class="faqs">${c.faqs.map((v, i) => `<details class="faq" ${i === 0 ? "open" : ""}><summary>${text(v[0])}</summary><p>${text(v[1])}</p></details>`).join("")}</div><div class="actions" style="margin-top:25px"><button class="btn ghost" data-help>${text(c.helpFloat)} <span class="cta-arrow" aria-hidden="true"></span></button></div>`,
    "faq",
    c.faqLabel,
    c.faqTitle,
    c.faqLead,
    "alt",
  );
  html += `<section class="ending"><div class="wrap"><div class="eyebrow">${text(c.finalKicker)}</div><h2>${text(c.finalTitle)}</h2><p class="lead">${text(c.finalLead)}</p><a href="#price" class="btn primary" data-checkout>${text(c.finalCta)} <span class="cta-arrow" aria-hidden="true"></span></a></div></section>
 </main><footer class="footer"><div class="wrap footer-inner"><a href="#course" class="brand" aria-label="Tahreek Academy"><img alt="Tahreek Academy" src="${ASSETS.logo}"></a><p>${text(c.footer)}</p>${safeURL(CONFIG.privacyURL) ? `<a href="${text(safeURL(CONFIG.privacyURL))}">${text(c.privacyLink)}</a>` : ""}<div class="langs"><button data-lang="ar" aria-pressed="${state.lang === "ar"}" lang="ar">AR</button><button data-lang="en" aria-pressed="${state.lang === "en"}" lang="en">EN</button></div></div></footer>
 <button class="help-float" type="button" aria-label="${text(c.helpFloat)}" data-help>✦ ${text(c.helpFloat)}</button><div class="sticky-buy"><strong>${text(now)}</strong><a class="btn primary" href="#price" data-checkout>${text(c.enroll)} <span class="cta-arrow" aria-hidden="true"></span></a></div>
 <div class="modal-wrap" id="help-modal" role="presentation"><div class="modal" role="dialog" dir="${c.dir}" aria-modal="true" aria-labelledby="help-title"><div class="modal-head"><small>${text(c.modalMini)}</small><button data-close-modal class="close-modal" type="button" aria-label="${text(c.close)}">×</button></div><h2 id="help-title">${text(c.modalTitle)}</h2><p>${text(c.modalCopy)}</p><form class="contact-form" id="lead-form" novalidate><div class="honey" aria-hidden="true"><label>Company<input name="company" tabindex="-1" autocomplete="off"></label></div><div class="fields"><div class="field"><label for="lead-name">${text(c.name)}</label><input id="lead-name" name="name" required minlength="2" maxlength="80" aria-describedby="form-status" autocomplete="name" placeholder="${text(c.namePlaceholder)}"></div><div class="field"><label for="lead-phone">${text(c.phone)}</label><input id="lead-phone" aria-describedby="form-status" dir="ltr" name="phone" type="tel" required autocomplete="tel" inputmode="tel" placeholder="${text(c.phonePlaceholder)}"></div></div><div class="field wide"><label for="lead-website">${text(c.website)}</label><input id="lead-website" dir="ltr" name="website" type="url" autocomplete="url" placeholder="${text(c.websitePlaceholder)}"></div><button type="submit" class="modal-submit">${text(c.requestCall)} <span class="cta-arrow" aria-hidden="true"></span></button><p class="form-note">${text(c.privacy)}</p><p class="form-note">${text(CONFIG.leadEndpoint ? c.privacy : c.formDisclosure)}</p><p id="form-status" class="form-status" role="status" aria-live="polite"></p></form></div></div>
 <div class="modal-wrap" id="checkout-modal" role="presentation"><div class="modal" role="dialog" dir="${c.dir}" aria-modal="true" aria-labelledby="checkout-title"><div class="modal-head"><small>${text(c.preview)}</small><button data-close-modal class="close-modal" type="button" aria-label="${text(c.close)}">×</button></div><h2 id="checkout-title" style="font-size:clamp(33px,5vw,50px)">${text(c.checkoutDialogTitle)}</h2><p>${text(c.checkoutDialogBody)}</p><button class="modal-submit" type="button" data-close-modal>${text(c.okay)} <span class="cta-arrow" aria-hidden="true"></span></button></div></div>`;
  const focused = document.activeElement;
  const focusKey = focused?.dataset.lang
    ? `[data-lang="${focused.dataset.lang}"]`
    : focused?.dataset.currency
      ? `[data-currency="${focused.dataset.currency}"]`
      : null;
  document.getElementById("app").innerHTML = html;
  if (focusKey)
    document.querySelector(focusKey)?.focus({ preventScroll: true });
  mountMedia(c);
  drawWave();
  const refund = 7;
  const answers = document.querySelectorAll(".faq p");
  answers[refund].textContent = CONFIG.refundTermsVerified
    ? c.refundVerified
    : c.refundPending;
  answers[8].textContent = offerText(c);
  if (CONFIG.socialImage && safeURL(CONFIG.socialImage)) {
    let og = document.querySelector('meta[property="og:image"]');
    if (!og) {
      og = document.createElement("meta");
      og.setAttribute("property", "og:image");
      document.head.append(og);
    }
    og.content = safeURL(CONFIG.socialImage);
  }
}
function drawWave() {
  const el = document.getElementById("wave-demo");
  if (!el) return;
  el.innerHTML = "";
  for (let i = 0; i < 95; i++) {
    let seed = Math.abs(
      Math.sin(i * 0.63) * Math.cos(i * 0.14) + Math.sin(i * 0.24) * 0.23,
    );
    const h = state.audio === "before" ? 5 + 27 * seed : 13 + 67 * seed;
    const e = document.createElement("i");
    e.style.setProperty("--height", Math.round(h) + "px");
    el.appendChild(e);
  }
}
function setLang(lang) {
  if (!copy[lang] || lang === state.lang) return;
  const scroll = window.scrollY;
  state.lang = lang;
  render();
  window.scrollTo({ top: scroll, behavior: "instant" });
  try {
    localStorage.setItem("tahreek-lang", lang);
  } catch {}
}
function openModal(id, focusSelector) {
  const el = document.getElementById(id);
  if (!el) return;
  state.lastFocus = document.activeElement;
  document.querySelector("main").inert = true;
  document.querySelector(".navshell").inert = true;
  document.querySelector(".help-float").inert = true;
  document.querySelector(".sticky-buy").inert = true;
  el.classList.add("open");
  document.body.style.overflow = "hidden";
  const target = el.querySelector(focusSelector) || el.querySelector("button");
  if (target) target.focus();
}
function closeModal(el) {
  if (!el) return;
  el.classList.remove("open");
  if (!document.querySelector(".modal-wrap.open")) {
    document.body.style.overflow = "";
    document.querySelector("main").inert = false;
    document.querySelector(".navshell").inert = false;
    document.querySelector(".help-float").inert = false;
    document.querySelector(".sticky-buy").inert = false;
  }
  if (state.lastFocus?.isConnected) state.lastFocus.focus();
}
function phoneValid(x) {
  return (
    /^\+[1-9][0-9 ()-]{7,22}$/.test(x) &&
    x.replace(/\D/g, "").length >= 9 &&
    x.replace(/\D/g, "").length <= 15
  );
}
async function submitLead(e) {
  e.preventDefault();
  const c = copy[state.lang],
    f = e.target,
    info = f.querySelector("#form-status");
  const name = f.querySelector("#lead-name").value.trim(),
    phone = f
      .querySelector("#lead-phone")
      .value.trim()
      .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))),
    website = f.querySelector("#lead-website").value.trim();
  f.querySelectorAll("input[aria-invalid]").forEach((input) =>
    input.removeAttribute("aria-invalid"),
  );
  if (name.length < 2) {
    info.textContent = c.invalidName;
    f.querySelector("#lead-name").setAttribute("aria-invalid", "true");
    f.querySelector("#lead-name").focus();
    return;
  }
  if (website) {
    try {
      const u = new URL(website);
      if (!["http:", "https:"].includes(u.protocol)) throw 0;
    } catch {
      info.textContent = c.invalidWebsite;
      f.querySelector("#lead-website").setAttribute("aria-invalid", "true");
      f.querySelector("#lead-website").focus();
      return;
    }
  }
  if (f.elements.company.value) return;
  if (!phoneValid(phone)) {
    info.textContent = c.invalidPhone;
    f.querySelector("#lead-phone").setAttribute("aria-invalid", "true");
    f.querySelector("#lead-phone").focus();
    return;
  }
  if (!CONFIG.leadEndpoint) {
    info.textContent = c.formReady;
    return;
  }
  info.textContent = c.formSending;
  const submit = f.querySelector("[type=submit]");
  submit.disabled = true;
  submit.textContent = c.formSending;
  try {
    const url = new URL(CONFIG.leadEndpoint);
    if (url.protocol !== "https:") throw new Error("Endpoint must be HTTPS");
    const r = await fetch(url.href, {
      signal: AbortSignal.timeout(15000),
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        website,
        source: "Tahreek Sound Design Landing Page",
        locale: state.lang,
        submitted_at: new Date().toISOString(),
      }),
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    info.textContent = c.formSuccess;
    f.reset();
  } catch (err) {
    info.textContent = c.formError;
    console.error("Lead request failed:", err);
  } finally {
    submit.disabled = false;
    submit.textContent = c.requestCall;
  }
}
document.addEventListener("click", (e) => {
  const lang = e.target.closest("[data-lang]");
  if (lang) {
    setLang(lang.dataset.lang);
    return;
  }
  const cur = e.target.closest("[data-currency]");
  if (cur) {
    const y = window.scrollY;
    state.currency = cur.dataset.currency;
    render();
    window.scrollTo(0, y);
    return;
  }
  const aud = e.target.closest("[data-audio]");
  if (aud) {
    state.audio = aud.dataset.audio;
    const c = copy[state.lang];
    document
      .querySelectorAll("[data-audio]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.audio === state.audio)),
      );
    document.querySelector("#wave-caption").textContent =
      state.audio === "before" ? c.waveBefore : c.waveAfter;
    drawWave();
    return;
  }
  const help = e.target.closest("[data-help]");
  if (help) {
    openModal("help-modal", "#lead-name");
    return;
  }
  const close = e.target.closest("[data-close-modal]");
  if (close) {
    closeModal(close.closest(".modal-wrap"));
    return;
  }
  const checkout = e.target.closest("[data-checkout]");
  if (checkout) {
    e.preventDefault();
    const url =
      state.currency === "EGP" ? CONFIG.checkoutEGP : CONFIG.checkoutUSD;
    if (safeURL(url) && url.startsWith("https://")) {
      window.location.assign(url);
    } else {
      openModal("checkout-modal", "[data-close-modal]");
    }
    return;
  }
  const mobile = e.target.closest("[data-menu]");
  if (mobile) {
    const nav = document.getElementById("mobile-nav");
    let open = nav.classList.toggle("open");
    mobile.setAttribute("aria-expanded", String(open));
    return;
  }
  const internal = e.target.closest(".mobile-nav a");
  if (internal) {
    document.getElementById("mobile-nav").classList.remove("open");
    document
      .querySelector("[data-menu]")
      .setAttribute("aria-expanded", "false");
    return;
  }
  const wrapper = e.target.classList.contains("modal-wrap") ? e.target : null;
  if (wrapper) closeModal(wrapper);
});
document.addEventListener("submit", (e) => {
  if (e.target.id === "lead-form") submitLead(e);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    let active = document.querySelector(".modal-wrap.open");
    if (active) closeModal(active);
    else {
      document.getElementById("mobile-nav")?.classList.remove("open");
      document
        .querySelector("[data-menu]")
        ?.setAttribute("aria-expanded", "false");
    }
  }
  if (e.key === "Tab") {
    let active = document.querySelector(".modal-wrap.open");
    if (!active) return;
    const focus = Array.from(
      active.querySelectorAll(
        "button:not(:disabled), input:not(:disabled), a[href]",
      ),
    ).filter((x) => x.offsetParent !== null);
    if (!focus.length) return;
    const first = focus[0],
      last = focus.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
try {
  const stored = localStorage.getItem("tahreek-lang");
  if (stored === "en") state.lang = "en";
} catch {}
render();

function mountMedia(c) {
  const intro = document.querySelector(".video-box");
  if (safeURL(CONFIG.introVideo))
    intro.innerHTML = `<video controls preload="metadata" poster="${ASSETS.cover}" aria-label="${text(c.introVideoLabel)}" src="${text(safeURL(CONFIG.introVideo))}"></video>`;
  const portrait = document.querySelector(".portrait");
  if (safeURL(CONFIG.instructorPortrait))
    portrait.innerHTML = `<img loading="lazy" src="${text(safeURL(CONFIG.instructorPortrait))}" alt="${text(c.instructorTitle)}">`;
  document.querySelectorAll(".study").forEach((el, i) => {
    const src = safeURL(CONFIG.projectStills[i]);
    if (src) {
      el.querySelector(".graphic").outerHTML =
        `<img class="project-still" loading="lazy" src="${text(src)}" alt="">`;
      el.querySelector(".study-placeholder").remove();
    }
  });
  const available = safeURL(CONFIG.beforeAudio) && safeURL(CONFIG.afterAudio);
  document.querySelectorAll("[data-audio]").forEach((b) => {
    b.disabled = !available;
    b.setAttribute("aria-disabled", String(!available));
  });
  if (available) {
    document.querySelector(".before-head .tiny").textContent = c.audioReady;
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "metadata";
    audio.id = "comparison-audio";
    audio.src = safeURL(
      state.audio === "before" ? CONFIG.beforeAudio : CONFIG.afterAudio,
    );
    audio.setAttribute("aria-label", c.workCompareTitle);
    document.querySelector(".before-after").append(audio);
  }
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-audio]");
  const a = document.querySelector("#comparison-audio");
  if (b && a) {
    const t = a.currentTime;
    const playing = !a.paused;
    a.src = safeURL(
      b.dataset.audio === "before" ? CONFIG.beforeAudio : CONFIG.afterAudio,
    );
    a.addEventListener(
      "loadedmetadata",
      () => {
        a.currentTime = Math.min(
          t,
          Number.isFinite(a.duration) ? a.duration : 0,
        );
        if (playing) a.play().catch(() => {});
      },
      { once: true },
    );
  }
});
let lastCampaign = campaign().status;
setInterval(() => {
  if (campaign().status !== lastCampaign) {
    lastCampaign = campaign().status;
    render();
  }
}, 30000);
