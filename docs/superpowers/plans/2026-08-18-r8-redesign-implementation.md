# R8 Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the visual redesign described in `docs/superpowers/specs/2026-08-18-r8-redesign-design.md` — typography swap, hero ignition-sequence signature animation, cursor-tracked glow micro-interactions, an illustrated beam-cone comparison diagram, smooth FAQ transitions, spacing refinement, and two copy tweaks — entirely inside `index.html`.

**Architecture:** Single static HTML file, Tailwind via CDN (`cdn.tailwindcss.com`), vanilla JS inline, no build step, no test framework. All changes are edits to `/media/uedson/storage/Projetos/r8-farois-site/index.html`.

**Tech Stack:** HTML5, Tailwind CDN (JIT), vanilla CSS (`<style>` block in `<head>`), vanilla JS (inline `<script>` blocks), Google Fonts.

## Global Constraints

- Do not change: WhatsApp number (`5511984027014`), e-mail (`novaisromeu@gmail.com`), address, social links, the 90-day warranty text, or any FAQ technical content — copied verbatim from the spec's "Fora de escopo" section.
- No new images generated — only `assets/hero-r8.png`, `assets/workshop.png`, `assets/compare-beam.png` (already in the repo) plus CSS/SVG.
- No new build tooling — stay single-file HTML + Tailwind CDN + inline vanilla JS.
- Every new animation must have a `@media (prefers-reduced-motion: reduce)` override that disables it.
- No unit test framework exists in this repo. "Test" steps below use `grep` for code-level checks and headless Chromium screenshots (`chromium --headless`) for visual checks, viewed with the Read tool. This replaces the pytest-style test cycle referenced by the writing-plans skill template — there is nothing to unit test in a static marketing page.
- Every task ends with a `git commit`, scoped to `index.html` only (plus this plan file's checkbox updates are not committed — the plan file itself was already committed as part of the spec step and does not need per-task commits).

## Verification harness (used by every task)

Before Task 1, confirm the local screenshot harness works:

- [ ] **Step 0: Verify headless Chromium can render the current page**

Run:
```bash
cd /media/uedson/storage/Projetos/r8-farois-site
python3 -m http.server 8842 >/tmp/r8-http.log 2>&1 &
sleep 1
chromium --headless --disable-gpu --no-sandbox --window-size=1440,1600 \
  --screenshot=/tmp/r8-check.png http://localhost:8842/index.html \
  --virtual-time-budget=3000
```
Expected: `/tmp/r8-check.png` exists and is a non-trivial PNG (`file /tmp/r8-check.png` reports `PNG image data, 1440 x 1600`). Read the image with the Read tool to confirm the current hero renders (Audi R8 photo, "O OLHAR QUE IMPÕE RESPEITO." headline visible).

Keep the `python3 -m http.server 8842` process running in the background for the rest of this plan (re-run it if it dies — e.g. `jobs`, or `curl -sf http://localhost:8842/index.html >/dev/null || (python3 -m http.server 8842 >/tmp/r8-http.log 2>&1 &)`).

---

### Task 1: Typography — Big Shoulders Display

**Files:**
- Modify: `index.html` (Google Fonts `<link>`, Tailwind `fontFamily.display` config)

**Interfaces:**
- Produces: the `font-display` Tailwind utility class (already used ~30× throughout the file) now resolves to `"Big Shoulders Display"` instead of `Rajdhani`. No other task depends on this beyond the visual result.

- [ ] **Step 1: Swap the Google Fonts link**

Find (near the top of `<head>`):
```html
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```
Replace with:
```html
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Point the Tailwind config at the new font**

Find (inside `tailwind.config`):
```js
        fontFamily: {
          display: ['Rajdhani', 'sans-serif'],
          body: ['Inter', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
```
Replace with:
```js
        fontFamily: {
          display: ['"Big Shoulders Display"', 'sans-serif'],
          body: ['Inter', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
```

- [ ] **Step 3: Verify with a screenshot**

Run:
```bash
chromium --headless --disable-gpu --no-sandbox --window-size=1440,1600 \
  --screenshot=/tmp/r8-task1.png http://localhost:8842/index.html \
  --virtual-time-budget=3000
```
Read `/tmp/r8-task1.png` with the Read tool. Expected: the hero headline "O OLHAR QUE IMPÕE RESPEITO." renders in a condensed industrial-looking display face (visibly different from the previous Rajdhani — narrower letterforms, taller x-height), not the browser's fallback sans-serif (if it fell back, the words would look like plain system-UI bold instead of a condensed display face).

- [ ] **Step 4: Commit**

```bash
cd /media/uedson/storage/Projetos/r8-farois-site
git add index.html
git commit -m "feat: troca tipografia display para Big Shoulders Display"
```

---

### Task 2: Signature element — hero ignition sequence

**Files:**
- Modify: `index.html` (`<style>` block, hero `<section>` markup, new inline `<script>` right after `<body>`)

**Interfaces:**
- Produces: `html.ignition-play` class (toggled once per session via `sessionStorage['r8-ignition-played']`), and the `.hero-bg` / `.hero-content` / `.hero-ignite-line` class hooks on the hero section's children. No other task depends on these.
- Consumes: nothing from prior tasks.

- [ ] **Step 1: Add the ignition CSS to the existing `<style>` block**

Add this block right before the closing `</style>` tag (after the existing `.eyebrow` rule):
```css
  /* ---- Ignition sequence: hero "acende" no primeiro load da sessão ---- */
  .hero-ignite-line{
    position:absolute; left:0; right:0; top:50%;
    height:2px; opacity:0; transform:scaleX(0) translateY(-50%);
    transform-origin:left center;
    background:#ff7a1a;
    box-shadow:0 0 24px 4px rgba(255,122,26,.9);
    z-index:5;
    pointer-events:none;
  }

  #hero .hero-bg,
  #hero .hero-content{ opacity:1; }

  html.ignition-play #hero .hero-bg,
  html.ignition-play #hero .hero-content{ opacity:0; }

  html.ignition-play #hero .hero-ignite-line{
    animation: ignite-snap .18s steps(1) .15s forwards,
               ignite-line-fade .4s ease .5s forwards;
  }
  html.ignition-play #hero .hero-bg{
    animation: ignite-bg .9s ease-out .32s forwards;
  }
  html.ignition-play #hero .hero-content{
    animation: ignite-reveal .7s cubic-bezier(.16,.9,.35,1) .38s forwards;
  }

  @keyframes ignite-snap{
    from{ transform:scaleX(0) translateY(-50%); opacity:1; }
    to{ transform:scaleX(1) translateY(-50%); opacity:1; }
  }
  @keyframes ignite-line-fade{
    to{ opacity:0; }
  }
  @keyframes ignite-bg{
    0%{ opacity:0; }
    100%{ opacity:1; }
  }
  @keyframes ignite-reveal{
    0%{ opacity:0; clip-path: inset(0 0 0 100%); }
    100%{ opacity:1; clip-path: inset(0 0 0 0%); }
  }

  @media (prefers-reduced-motion: reduce){
    html.ignition-play #hero .hero-bg,
    html.ignition-play #hero .hero-content,
    html.ignition-play #hero .hero-ignite-line{
      animation:none !important; opacity:1 !important; transform:none !important; clip-path:none !important;
    }
  }
```

- [ ] **Step 2: Mark up the hero section**

Find:
```html
<section class="relative min-h-[100svh] flex items-end pb-24 md:pb-28 pt-28 overflow-hidden bg-void beam-line">
  <div class="absolute inset-0">
    <img src="./assets/hero-r8.png" alt="Audi R8 preto com faróis R8 acesos, cidade ao fundo à noite" class="w-full h-full object-cover opacity-70">
    <div class="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/10"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-void/90 via-transparent to-void/40"></div>
  </div>

  <div class="relative max-w-7xl mx-auto px-5 md:px-8 w-full">
```
Replace with:
```html
<section id="hero" class="relative min-h-[100svh] flex items-end pb-24 md:pb-28 pt-28 overflow-hidden bg-void beam-line">
  <div class="hero-ignite-line" aria-hidden="true"></div>

  <div class="hero-bg absolute inset-0">
    <img src="./assets/hero-r8.png" alt="Audi R8 preto com faróis R8 acesos, cidade ao fundo à noite" class="w-full h-full object-cover opacity-70">
    <div class="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/10"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-void/90 via-transparent to-void/40"></div>
  </div>

  <div class="hero-content relative max-w-7xl mx-auto px-5 md:px-8 w-full">
```
(Only the opening tags of the two inner `<div>`s and the `<section>` tag change — everything else inside the hero stays untouched.)

- [ ] **Step 3: Add the session-check script as the first thing in `<body>`**

Find:
```html
<body class="bg-void text-bone font-body antialiased">

<!-- ============ NAV ============ -->
```
Replace with:
```html
<body class="bg-void text-bone font-body antialiased">
<script>
(function(){
  var KEY = 'r8-ignition-played';
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced && !sessionStorage.getItem(KEY)){
    document.documentElement.classList.add('ignition-play');
    sessionStorage.setItem(KEY, '1');
  }
})();
</script>

<!-- ============ NAV ============ -->
```

- [ ] **Step 4: Verify — first load animates, second load in same session doesn't**

Run:
```bash
rm -f /tmp/r8-ignition-1.png /tmp/r8-ignition-2.png
chromium --headless --disable-gpu --no-sandbox --window-size=1440,900 \
  --screenshot=/tmp/r8-ignition-1.png http://localhost:8842/index.html \
  --virtual-time-budget=200
chromium --headless --disable-gpu --no-sandbox --window-size=1440,900 \
  --screenshot=/tmp/r8-ignition-2.png http://localhost:8842/index.html \
  --virtual-time-budget=3000
```
Read both images. Expected: `/tmp/r8-ignition-1.png` (captured at 200ms virtual time, mid-sequence) shows the hero mostly dark/black with at most the thin amber ignite line visible, not the full photo+headline. `/tmp/r8-ignition-2.png` (captured at 3000ms, sequence finished) shows the hero fully visible (photo + headline), matching Task 1's screenshot. This confirms the animation actually delays the reveal instead of no-op'ing.

Also run a grep sanity check that the reduced-motion override exists:
```bash
grep -n "prefers-reduced-motion: reduce" index.html | wc -l
```
Expected: `2` (the pre-existing `.beam-line::after` override plus the new ignition override).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: adiciona sequência de ignição do farol no hero (elemento-assinatura)"
```

---

### Task 3: Cursor-tracked glow on service cards and diferenciais

**Files:**
- Modify: `index.html` (`<style>` block, 3 service-card `<div>`s, 3 diferenciais `<div>`s, new `<script>` before `</body>`)

**Interfaces:**
- Produces: `.glow-card` class (applied to 6 elements total). No other task depends on it.

- [ ] **Step 1: Add the glow CSS**

Add before the closing `</style>` tag:
```css
  /* ---- Glow de cursor: reflexo de farol nos cards ---- */
  .glow-card{ position:relative; }
  .glow-card::before{
    content:"";
    position:absolute; inset:0;
    background: radial-gradient(240px circle at var(--gx,50%) var(--gy,50%), rgba(255,122,26,.16), transparent 70%);
    opacity:0; transition:opacity .25s ease;
    pointer-events:none;
  }
  .glow-card:hover::before,
  .glow-card:focus-within::before{ opacity:1; }

  @media (prefers-reduced-motion: reduce){
    .glow-card::before{ transition:none; }
  }
  @media (hover:none){
    .glow-card::before{ display:none; }
  }
```

- [ ] **Step 2: Add `glow-card` to the 3 service cards**

In the "MATRIZ DE SERVIÇOS" section, each of the 3 cards starts with:
```html
      <div class="bg-panel p-8 md:p-9 flex flex-col">
```
Change each of the three to:
```html
      <div class="glow-card bg-panel p-8 md:p-9 flex flex-col">
```

- [ ] **Step 3: Add `glow-card` to the 3 diferenciais items**

In the "DIFERENCIAIS TÉCNICOS" section, each of the 3 items starts with:
```html
        <div class="flex gap-4">
```
Change each of the three to:
```html
        <div class="glow-card flex gap-4 p-3 -m-3">
```
(The `p-3 -m-3` keeps text position identical while giving the glow a small hit area beyond the text itself — without it the glow radius has almost no card surface to appear on for this list-style layout.)

- [ ] **Step 4: Add the pointer-tracking script before `</body>`**

Find:
```html
</body>
</html>
```
Replace with:
```html
<script>
(function(){
  var cards = document.querySelectorAll('.glow-card');
  cards.forEach(function(card){
    card.addEventListener('pointermove', function(e){
      var r = card.getBoundingClientRect();
      card.style.setProperty('--gx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--gy', (e.clientY - r.top) + 'px');
    });
  });
})();
</script>
</body>
</html>
```

- [ ] **Step 5: Verify**

```bash
grep -c 'glow-card' index.html
```
Expected: `7` (1 CSS selector block reference counts as multiple lines — just confirm it's greater than 0 and specifically `grep -c '"glow-card' index.html` or eyeball that all 6 elements got the class):
```bash
grep -n 'glow-card' index.html
```
Expected: CSS rules (`.glow-card`, `.glow-card::before`, etc.) plus exactly 6 element class attributes (3 cards + 3 diferenciais) plus the JS `querySelectorAll('.glow-card')` line.

Screenshot check (glow only shows on hover, so this just confirms no layout breakage):
```bash
chromium --headless --disable-gpu --no-sandbox --window-size=1440,2400 \
  --screenshot=/tmp/r8-task3.png http://localhost:8842/index.html \
  --virtual-time-budget=3000
```
Read `/tmp/r8-task3.png`. Expected: service cards and diferenciais list render with unchanged layout (no overlap, no clipped text) compared to the pre-task screenshots.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: adiciona glow de cursor nos cards de serviço e diferenciais"
```

---

### Task 4: Beam-cone comparison diagram + scroll reveal

**Files:**
- Modify: `index.html` (`<style>` block, "DIFERENCIAIS TÉCNICOS" section's right column)

**Interfaces:**
- Produces: `[data-beam-compare]` element with `.beam-compare__stage`, `.beam-compare__layer--halogen`, `.beam-compare__layer--r8`, `.beam-compare__handle` children. Task 5 consumes these exact class/attribute names to add drag interactivity.

- [ ] **Step 0: Fix swapped image src/alt (discovered during execution)**

Both existing photo assets were wired to the wrong sections: `assets/hero-r8.png` actually contains the halogen-vs-R8 comparison infographic (with baked-in captions and arrows), and `assets/compare-beam.png` actually contains the single moody Audi R8 photo — the reverse of what the hero and Diferenciais sections' `alt` text describe. Confirmed by user 2026-08-18. Fix by swapping which file each `<img>` points to (no new images, no alt-text rewrite beyond what already correctly describes the real content — the existing `alt` strings already match the *other* file, so they stay correct once swapped).

In the hero section, find:
```html
    <img src="./assets/hero-r8.png" alt="Audi R8 preto com faróis R8 acesos, cidade ao fundo à noite" class="w-full h-full object-cover opacity-70">
```
Replace with:
```html
    <img src="./assets/compare-beam.png" alt="Audi R8 preto com faróis R8 acesos, cidade ao fundo à noite" class="w-full h-full object-cover opacity-70">
```

In the Diferenciais section, find:
```html
      <img src="./assets/compare-beam.png" alt="Comparativo entre luz halógena original e iluminação R8, mostrando maior alcance com a R8" class="w-full rounded-sm border border-white/10">
```
Replace with:
```html
      <img src="./assets/hero-r8.png" alt="Comparativo entre luz halógena original e iluminação R8, mostrando maior alcance com a R8" class="w-full rounded-sm border border-white/10">
```
(Step 2 below further modifies this second `<img>` line by adding a `mt-6` class and wrapping it alongside the new SVG diagram — apply this src swap first, then Step 2's replacement.)

- [ ] **Step 1: Add the beam-compare CSS**

Add before the closing `</style>` tag:
```css
  /* ---- Comparação ilustrada: halógena vs R8 ---- */
  .beam-compare__stage{
    position:relative; aspect-ratio:400/220; overflow:hidden; border-radius:2px;
    border:1px solid rgba(255,255,255,.1);
    opacity:0; transform:translateY(16px);
    transition:opacity .6s ease, transform .6s ease;
  }
  .beam-compare.is-visible .beam-compare__stage{ opacity:1; transform:none; }

  .beam-compare__layer{ position:absolute; inset:0; }
  .beam-compare__svg{ width:100%; height:100%; display:block; }
  .beam-compare__tag{
    position:absolute; left:12px; bottom:10px; font-family:'JetBrains Mono',monospace;
    font-size:11px; text-transform:uppercase; letter-spacing:.15em; color:#94949c;
  }
  .beam-compare__tag--r8{ color:#ff7a1a; left:auto; right:12px; }

  .beam-compare__handle{
    position:absolute; top:0; bottom:0; left:50%; width:2px; background:#ff7a1a;
    box-shadow:0 0 12px 2px rgba(255,122,26,.7);
    border:none; padding:0; margin:0; cursor:ew-resize; transform:translateX(-50%);
  }
  .beam-compare__handle-grip{
    position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
    width:34px; height:34px; border-radius:50%; background:#ff7a1a;
    display:flex; align-items:center; justify-content:center;
    color:#0a0a0b; font-size:16px; font-weight:700;
  }
  .beam-compare__handle:focus-visible{ outline:2px solid #ff7a1a; outline-offset:4px; }

  @media (max-width: 767px){
    .beam-compare__handle{ display:none; }
  }
  @media (prefers-reduced-motion: reduce){
    .beam-compare__stage{ transition:none; }
  }
```

- [ ] **Step 2: Insert the diagram markup above the existing comparison photo**

Find (in the "DIFERENCIAIS TÉCNICOS" section, right column — this is the `<img>` already updated by Step 0 to point at `hero-r8.png`):
```html
    <div>
      <img src="./assets/hero-r8.png" alt="Comparativo entre luz halógena original e iluminação R8, mostrando maior alcance com a R8" class="w-full rounded-sm border border-white/10">
      <p class="mt-4 text-xs font-mono text-fog leading-relaxed">
        A fadiga ocular em viagens noturnas vem da falta de contraste e alcance da luz halógena original — luz amarela cansa o cérebro. A R8 resolve isso na raiz.
      </p>
    </div>
```
Replace with:
```html
    <div>
      <div class="beam-compare" data-beam-compare>
        <div class="beam-compare__stage">
          <div class="beam-compare__layer beam-compare__layer--halogen">
            <svg viewBox="0 0 400 220" class="beam-compare__svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect width="400" height="220" fill="#101012"/>
              <polygon points="20,140 260,110 260,170" fill="#d9a441" opacity=".5"/>
            </svg>
            <span class="beam-compare__tag">Halógena</span>
          </div>
          <div class="beam-compare__layer beam-compare__layer--r8" style="clip-path: inset(0 50% 0 0);">
            <svg viewBox="0 0 400 220" class="beam-compare__svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <linearGradient id="r8Beam" x1="0" x2="1">
                  <stop offset="0" stop-color="#ff7a1a" stop-opacity=".2"/>
                  <stop offset="1" stop-color="#f4f2ee" stop-opacity=".6"/>
                </linearGradient>
              </defs>
              <rect width="400" height="220" fill="#101012"/>
              <polygon points="20,120 380,70 380,170" fill="url(#r8Beam)"/>
              <line x1="380" y1="70" x2="380" y2="170" stroke="#ff7a1a" stroke-width="2"/>
            </svg>
            <span class="beam-compare__tag beam-compare__tag--r8">R8</span>
          </div>
          <button type="button" class="beam-compare__handle" aria-label="Arrastar para comparar alcance: halógena vs R8" style="left:50%">
            <span class="beam-compare__handle-grip" aria-hidden="true">⇔</span>
          </button>
        </div>
        <p class="mt-3 text-xs font-mono text-fog">Diagrama ilustrativo — arraste para comparar o alcance.</p>
      </div>

      <img src="./assets/hero-r8.png" alt="Comparativo entre luz halógena original e iluminação R8, mostrando maior alcance com a R8" class="w-full rounded-sm border border-white/10 mt-6">
      <p class="mt-4 text-xs font-mono text-fog leading-relaxed">
        A fadiga ocular em viagens noturnas vem da falta de contraste e alcance da luz halógena original — luz amarela cansa o cérebro. A R8 resolve isso na raiz.
      </p>
    </div>
```

- [ ] **Step 3: Add the reveal-on-scroll script before `</body>`**

Find (the script block added in Task 3, Step 4):
```html
<script>
(function(){
  var cards = document.querySelectorAll('.glow-card');
  cards.forEach(function(card){
    card.addEventListener('pointermove', function(e){
      var r = card.getBoundingClientRect();
      card.style.setProperty('--gx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--gy', (e.clientY - r.top) + 'px');
    });
  });
})();
</script>
</body>
```
Replace with:
```html
<script>
(function(){
  var cards = document.querySelectorAll('.glow-card');
  cards.forEach(function(card){
    card.addEventListener('pointermove', function(e){
      var r = card.getBoundingClientRect();
      card.style.setProperty('--gx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--gy', (e.clientY - r.top) + 'px');
    });
  });
})();
</script>
<script>
(function(){
  var beamEl = document.querySelector('[data-beam-compare]');
  if(!beamEl) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        beamEl.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .35 });
  io.observe(beamEl);
})();
</script>
</body>
```

- [ ] **Step 4: Verify**

```bash
chromium --headless --disable-gpu --no-sandbox --window-size=1440,3200 \
  --screenshot=/tmp/r8-task4.png http://localhost:8842/index.html \
  --virtual-time-budget=3000
```
Read `/tmp/r8-task4.png`, scroll visually to the "Diferenciais Técnicos" section. Expected: a dark rectangular diagram box showing two overlapping light-cone triangles (a dimmer narrow one labeled "Halógena", a brighter wider one labeled "R8" with a crisp vertical cutoff edge), with a small circular amber handle at its horizontal center, sitting above the (now correctly wired) real halogen-vs-R8 comparison photo. Because Chromium headless screenshots capture the full rendered page in one pass (no real scroll-triggered lazy paint), `.is-visible` should already be applied — if the diagram box appears fully transparent/invisible in the screenshot, the IntersectionObserver threshold or `--virtual-time-budget` needs adjusting before proceeding (re-run with `--virtual-time-budget=5000`).

```bash
grep -n "beam-compare\|IntersectionObserver" index.html | wc -l
```
Expected: greater than 10 (CSS rules + markup + script).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: adiciona diagrama comparativo halógena vs R8 com reveal on scroll"
```

---

### Task 5: Desktop drag handle for the comparison diagram

**Files:**
- Modify: `index.html` (extends the reveal-on-scroll `<script>` block added in Task 4)

**Interfaces:**
- Consumes: `[data-beam-compare]`, `.beam-compare__stage`, `.beam-compare__layer--r8`, `.beam-compare__handle` from Task 4.

- [ ] **Step 1: Extend the beam-compare script with drag + keyboard support**

Find the script block added in Task 4 Step 3:
```html
<script>
(function(){
  var beamEl = document.querySelector('[data-beam-compare]');
  if(!beamEl) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        beamEl.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .35 });
  io.observe(beamEl);
})();
</script>
```
Replace with:
```html
<script>
(function(){
  var beamEl = document.querySelector('[data-beam-compare]');
  if(!beamEl) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        beamEl.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .35 });
  io.observe(beamEl);

  var stage   = beamEl.querySelector('.beam-compare__stage');
  var layerR8 = beamEl.querySelector('.beam-compare__layer--r8');
  var handle  = beamEl.querySelector('.beam-compare__handle');
  if(!handle || !window.matchMedia('(min-width: 768px)').matches) return;

  var setPercent = function(pct){
    pct = Math.min(100, Math.max(0, pct));
    layerR8.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    handle.style.left = pct + '%';
    handle.setAttribute('aria-valuenow', Math.round(pct));
  };
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');
  handle.setAttribute('aria-valuenow', '50');

  var dragging = false;
  handle.addEventListener('pointerdown', function(e){
    dragging = true;
    handle.setPointerCapture(e.pointerId);
  });
  handle.addEventListener('pointermove', function(e){
    if(!dragging) return;
    var rect = stage.getBoundingClientRect();
    setPercent(((e.clientX - rect.left) / rect.width) * 100);
  });
  handle.addEventListener('pointerup', function(){ dragging = false; });
  handle.addEventListener('keydown', function(e){
    var current = parseFloat(handle.style.left) || 50;
    if(e.key === 'ArrowLeft'){ e.preventDefault(); setPercent(current - 5); }
    if(e.key === 'ArrowRight'){ e.preventDefault(); setPercent(current + 5); }
  });
})();
</script>
```

- [ ] **Step 2: Verify with a simulated drag via headless Chromium**

Because a single `chromium --screenshot` run can't simulate a pointer drag, verify this task with a small Node script using Chromium's DevTools Protocol via `chrome-remote-interface`-free approach — instead, verify the pure-JS math directly with Node (no DOM needed, since `setPercent`'s clamping/formatting logic is what matters):

```bash
node -e "
function setPercentMath(pct){
  pct = Math.min(100, Math.max(0, pct));
  return { clip: (100 - pct), left: pct };
}
console.log(JSON.stringify(setPercentMath(-10)));
console.log(JSON.stringify(setPercentMath(50)));
console.log(JSON.stringify(setPercentMath(140)));
"
```
Expected output:
```
{"clip":100,"left":0}
{"clip":50,"left":50}
{"clip":0,"left":100}
```
This confirms the clamping logic (0–100%) is correct before it's embedded in the page.

Then confirm the page still loads without a JS console error:
```bash
chromium --headless --disable-gpu --no-sandbox --enable-logging=stderr --v=1 \
  --window-size=1440,900 --virtual-time-budget=3000 \
  --dump-dom http://localhost:8842/index.html >/tmp/r8-task5-dom.html 2>/tmp/r8-task5-console.log
grep -i "error\|uncaught" /tmp/r8-task5-console.log || echo "no JS errors logged"
```
Expected: `no JS errors logged` (or no matches).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: adiciona drag handle desktop ao diagrama comparativo"
```

---

### Task 6: Smooth FAQ open/close transition

**Files:**
- Modify: `index.html` (`<style>` block, 5 FAQ `<details>` blocks)

**Interfaces:**
- Produces: `.faq-panel` wrapper class around each FAQ answer `<p>`. No other task depends on it.

- [ ] **Step 1: Add the accordion CSS**

Add before the closing `</style>` tag:
```css
  /* ---- FAQ: abertura/fechamento suave ---- */
  details > .faq-panel{
    display:grid !important;
    grid-template-rows:0fr;
    transition:grid-template-rows .3s ease;
  }
  details[open] > .faq-panel{ grid-template-rows:1fr; }
  .faq-panel > p{ overflow:hidden; }

  @media (prefers-reduced-motion: reduce){
    details > .faq-panel{ transition:none; }
  }
```

- [ ] **Step 2: Wrap each of the 5 FAQ answers in `.faq-panel`**

This pattern repeats 5 times (one per `<details>`). For each, find:
```html
        <p class="text-sm text-fog mt-3 leading-relaxed pr-8">TEXTO_DA_RESPOSTA</p>
      </details>
```
Replace with:
```html
        <div class="faq-panel">
          <p class="text-sm text-fog mt-3 leading-relaxed pr-8">TEXTO_DA_RESPOSTA</p>
        </div>
      </details>
```
Apply this to all 5 answers, keeping each `TEXTO_DA_RESPOSTA` exactly as it currently is (do not alter FAQ wording — global constraint):
1. "Não. Todo o processo é feito em regime plug and play, sem cortar chicote original e sem alterações estruturais no veículo. A garantia de fábrica é preservada."
2. "Não, quando feito corretamente — e é aí que está a diferença da R8. Fazemos o alinhamento técnico da linha de corte (cut-off), garantindo alcance máximo sem prejudicar quem vem no sentido contrário."
3. "Cada farol passa por teste de estanqueidade e checagem óptica antes da entrega. Garantia de 90 dias sobre mão de obra e vedação."
4. "Na maioria dos casos, sim. Fazemos o tratamento da lente, eliminamos infiltração e devolvemos a clareza original — sem o custo de uma peça nova."
5. "O prazo varia conforme o tipo de intervenção — upgrade simples, retrofit completo ou restauração. Envie o modelo do seu veículo pelo WhatsApp e receba um prazo estimado no orçamento."

- [ ] **Step 3: Verify**

```bash
grep -c 'faq-panel' index.html
```
Expected: `8` or more (2 CSS-block references + `.faq-panel > p` + 5 markup wraps, some rules span lines so exact count may vary — confirm with the next command instead):
```bash
grep -c '<div class="faq-panel">' index.html
```
Expected: exactly `5`.

```bash
python3 -c "
import re
html = open('index.html').read()
opens = html.count('<div class=\"faq-panel\">')
closes = 0
i = 0
depth = 0
# crude balance check: every faq-panel div must close before the next </details>
for m in re.finditer(r'<div class=\"faq-panel\">|</details>', html):
    pass
print('faq-panel opens:', opens)
print('details closes:', html.count('</details>'))
"
```
Expected: `faq-panel opens: 5` and `details closes: 5` (still 5 — confirms no `<details>` was accidentally duplicated or removed).

Screenshot check:
```bash
chromium --headless --disable-gpu --no-sandbox --window-size=1440,3200 \
  --screenshot=/tmp/r8-task6.png http://localhost:8842/index.html \
  --virtual-time-budget=3000
```
Read `/tmp/r8-task6.png`. Expected: FAQ section renders with all 5 questions visible and collapsed (answers not shown, since none has the `open` attribute) — same visual as before this task, confirming the `display:grid !important` override didn't force answers open by default.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: transição suave de abertura/fechamento no FAQ"
```

---

### Task 7: Spacing — more breathing room after Diferenciais Técnicos

**Files:**
- Modify: `index.html` (1 class change on the Diferenciais section)

- [ ] **Step 1: Increase bottom padding on the Diferenciais section**

Find:
```html
<section class="relative bg-panel cutoff-t -mt-16 pt-24 md:pt-36 pb-24 md:pb-32">
  <div class="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-14 items-center">
    <div>
      <p class="eyebrow font-mono text-[11px] uppercase text-amber mb-4">Diferenciais</p>
```
Replace with:
```html
<section class="relative bg-panel cutoff-t -mt-16 pt-24 md:pt-36 pb-28 md:pb-40">
  <div class="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-14 items-center">
    <div>
      <p class="eyebrow font-mono text-[11px] uppercase text-amber mb-4">Diferenciais</p>
```
(This is the section directly above the FAQ — it's the most content-dense section on the page, given the added beam-compare diagram from Task 4, so it gets extra bottom padding: `pb-24 md:pb-32` → `pb-28 md:pb-40`.)

- [ ] **Step 2: Verify**

```bash
grep -n "pb-28 md:pb-40" index.html
```
Expected: 1 match, on the Diferenciais `<section>` line.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "style: aumenta respiro entre Diferenciais Técnicos e FAQ"
```

---

### Task 8: Copy tweaks (hero subtext + footer subhead)

**Files:**
- Modify: `index.html` (2 text-only changes, no facts altered)

- [ ] **Step 1: Tighten the hero subtext**

Find:
```html
    <p class="mt-6 max-w-xl text-base md:text-lg text-fog font-body leading-relaxed">
      Sistemas ópticos de alta performance com acabamento padrão de fábrica. Mais alcance de visão, mais segurança e um farol que não se confunde com os outros.
    </p>
```
Replace with:
```html
    <p class="mt-6 max-w-xl text-base md:text-lg text-fog font-body leading-relaxed">
      Sistemas ópticos de alta performance, acabamento padrão de fábrica. Mais alcance, mais segurança — um farol que ninguém confunde com os outros.
    </p>
```

- [ ] **Step 2: Make the footer subhead more direct**

Find:
```html
      <p class="mt-5 text-fog">Fale agora com a R8 e leve o padrão OEM para o seu veículo.</p>
```
Replace with:
```html
      <p class="mt-5 text-fog">Manda o modelo do seu carro no WhatsApp — a gente já te diz o que dá pra fazer.</p>
```

- [ ] **Step 3: Verify no facts changed**

```bash
grep -n "5511984027014\|novaisromeu@gmail.com\|Rua Cantagalo\|90 dias\|instagram.com/r8farois\|facebook.com/r8farois" index.html | wc -l
```
Expected: same count as before Task 1 (run this same command against `git show f54c3ff:index.html` — the very first commit — to compare, e.g. `git show f54c3ff:index.html | grep -c "5511984027014"` vs `grep -c "5511984027014" index.html`, both should be equal for every one of these strings).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "copy: ajusta subtexto do hero e subhead do footer para tom mais direto"
```

---

### Task 9: Final verification pass

**Files:** none modified — read-only verification.

- [ ] **Step 1: Desktop full-page screenshot**

```bash
chromium --headless --disable-gpu --no-sandbox --window-size=1440,4200 \
  --screenshot=/tmp/r8-final-desktop.png http://localhost:8842/index.html \
  --virtual-time-budget=3000
```
Read `/tmp/r8-final-desktop.png`. Walk the full page top to bottom: nav, hero (headline in Big Shoulders Display, no leftover Rajdhani look), Sobre, Serviços, Diferenciais + beam-compare diagram + photo, FAQ, footer with the Oryxon credit line still present, sticky mobile CTA absent (desktop width). Confirm no overlapping text, no broken images (no gray "broken image" icons), no obviously clipped content.

- [ ] **Step 2: Mobile full-page screenshot**

```bash
chromium --headless --disable-gpu --no-sandbox --window-size=390,5200 \
  --screenshot=/tmp/r8-final-mobile.png http://localhost:8842/index.html \
  --virtual-time-budget=3000
```
Read `/tmp/r8-final-mobile.png`. Confirm: hero readable at narrow width, service cards stack to 1 column, beam-compare diagram box is present but its drag handle is hidden (mobile has no `.beam-compare__handle`, per Task 4's `@media (max-width: 767px)` rule — visually there should be no circular handle floating over the diagram), sticky "Orçamento no WhatsApp" bar visible at the bottom.

- [ ] **Step 3: Confirm every new animation has a reduced-motion override**

```bash
grep -c "prefers-reduced-motion: reduce" index.html
```
Expected: `4` (pre-existing `.beam-line::after` override + ignition override from Task 2 + `.glow-card::before` override from Task 3 + `.beam-compare__stage`/`.faq-panel` overrides from Tasks 4 and 6 — if the count is lower than 4, find which task's override is missing and add it).

- [ ] **Step 4: Confirm color contrast wasn't regressed**

No color values were changed in this plan (Task 1–8 only touch typography, motion, spacing and 2 copy strings — the palette hex values are untouched). Confirm with:
```bash
grep -n "void:\|panel:\|panel2:\|amber:\|amberd:\|silver:\|bone:\|fog:" index.html
```
Expected: identical to the values in the spec's palette table (`#0a0a0b`, `#131315`, `#1b1b1e`, `#ff7a1a`, `#c2410c`, `#c9cdd3`, `#f4f2ee`, `#94949c`) — these were already confirmed AA-compliant against the panel backgrounds during planning (fog-on-void 6.57:1, fog-on-panel 6.16:1, bone-on-void 17.7:1, amber-on-void 7.59:1, void-on-amber 7.59:1 — all pass WCAG AA for their respective text sizes).

- [ ] **Step 5: Confirm the WhatsApp CTA and phone link still work (href-level check)**

```bash
grep -c 'href="https://wa.me/5511984027014"' index.html
```
Expected: `4` (nav button, hero CTA, services CTA, footer CTA — same count as before this plan started; sticky mobile CTA uses the same href too, so confirm the actual expected count by checking `git show f54c3ff:index.html | grep -c 'href="https://wa.me/5511984027014"'` and matching it).

- [ ] **Step 6: Stop the local server**

```bash
kill %1 2>/dev/null || pkill -f "http.server 8842"
```

- [ ] **Step 7: Report findings to the user**

Summarize in the final message: what was verified visually (desktop + mobile screenshots), what was verified only at code-level and why (reduced-motion emulation isn't available via `chromium --headless` CLI flags, so those overrides were confirmed by `grep` + reading the CSS, not by a live emulated render — say this explicitly rather than implying a live reduced-motion screenshot was taken).

---

## Final commit

The task commits above (Tasks 1–8) already cover all implementation work with individually reviewable commits. Do **not** additionally squash them into one commit unless the user asks for that — the user's original request for a single commit message ("feat: reformulação visual premium da landing page R8") was given before this plan existed; surface this to the user when the plan finishes and ask whether they want the 8 task commits kept as-is (recommended — clean bisectable history) or squashed into one commit with that exact message.
