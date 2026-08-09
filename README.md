# Varsha & Sanjay — wedding site

A single static page. No build step, no framework, no dependencies. Open
`index.html` in a browser and it works.

**Total page weight: ~770 KB** for everything (HTML + CSS + JS + all images),
before web fonts. It will stay fast as long as you compress the
photos you swap in — see below.

```
wedding-website/
├── index.html                   ← all the words live here
├── assets/
│   ├── css/style.css            ← all the styling; colours + fonts at the top
│   ├── js/main.js               ← the RSVP link + the fade-in on scroll
│   ├── img/
│   │   ├── hero-image.jpg       ← the save-the-date card
│   │   ├── backdrop-day-*.jpg   ← the photo behind each itinerary card
│   └── illustrations/           ← the 7 timeline icons
└── README.md
```

## Run it locally

```bash
python3 -m http.server 4321 --directory wedding-website
```

Then open http://localhost:4321. (You can also just double-click
`index.html` — the only reason to use a server is that it matches how it
will behave once deployed.)

**If a change doesn't show up, it's the cache.** Browsers hold on to
`style.css` very stubbornly. Two fixes:

- Right now: hard-refresh with **Cmd+Shift+R** (Safari: Cmd+Option+R).
- Before sharing the site: bump the `?v=11` on the stylesheet `<link>` in
  `index.html` to `?v=12`, `?v=13` and so on. That guarantees guests get the
  new styling rather than a stale copy sitting in their browser.

---

## What to change, and where

### 1. Names, dates, and every word on the page

All of it is in `index.html`. It's plain HTML with comment headers marking
each section — no templating language to learn. Search for `Varsha` or
`November` and you'll find everything.

### 2. Adding or removing an itinerary event

In `index.html`, each event is one `<li class="tl__item">` block. Copy one,
change the words, done. **You do not need to set which side it goes on** —
the left/right alternation is automatic, so events stay correctly staggered
however many you add or delete.

Each day sits on a single card, sized so the whole day fits on one screen
without scrolling. Day One fills about 78% of a phone screen, so there's
room for roughly one more event before it overflows.

The timeline runs down a **centre rail with events alternating left and
right at every screen size**, phones included — there's no separate stacked
mobile layout. That's why the descriptions are kept short: each one only has
about half the screen width to work with.

**Turning a phone sideways gives the wide view.** A rotated phone is about
844px across, which is over the 780px breakpoint, so it picks up the laptop
layout automatically — landscape cards, no overlap, text at full size. So
guests who want the wide composition just rotate; nobody has to pinch-zoom.
Nothing extra powers this, it falls out of the existing breakpoint.

**On phones held upright the cards are portrait postcards.** The two day
cards are both 1 : 1.7 so they read as a pair. The last card carries less, so
it gets its own shorter 1 : 1.15 — forcing it to 1.7 left a void down the
middle. Both are `min-height`, a floor and never a ceiling: add an event and
the card grows rather than clipping.

Three knobs in `style.css` if you want to retune it:

- `--art` on `.tl` — illustration size.
- `--overlap` on `.tl` — how far each event is pulled up into the previous
  one. Consecutive events sit on opposite sides of the rail, so they can
  interleave. **`1rem` is the most it will take before things collide** —
  at 1.5rem the bouquet lands on top of the Maapillai Azhaippu text. If you
  lengthen a description, re-check this.
- The `1.7` in the `min-height` on `.daycard` (and `1.15` on `.loccard`).
  The 1.7 is set by Day One's natural height at that overlap, and Day Two is
  padded up to match it. Change the overlap and you'll want to change this.

### 3. Your photos

The hero is `assets/img/hero-image.jpg` — the save-the-date card, 1280 × 1024,
184 KB.

Because that image **already has the names and dates printed on it**, the
`<header>` carries a `hero--plate` class. That hides the site's own overlaid
names (they'd otherwise appear twice) while keeping them in the markup for
screen readers and Google. If you ever swap in a plain photo with no
lettering, delete `hero--plate` from the `<header>` tag and the overlaid
typography comes back.

Plate mode adapts to the screen shape, because a landscape card can't be
cropped to a portrait phone without losing the names off both edges:

- **Portrait / phones** — the hero is exactly as tall as the picture, with no
  filler above or below. The whole card is visible and the first day card
  starts immediately underneath.
- **Landscape / laptops** — the photo's proportions are close enough to the
  window that it simply fills the frame.
- **A phone held sideways** — landscape but only ~390px tall, where filling
  the frame would slice the top and bottom off the card and take "Varsha"
  with it. There the card is shown whole on paper instead. That's the
  `(min-aspect-ratio: 1/1) and (max-height: 600px)` rule in `style.css`.

If you replace it, keep the same filename and update `width`/`height` on the
`<img>` to the real dimensions — that's what stops the page jumping about as
it loads.

One caveat on the current file: at 1280 px wide it's about right for a
laptop, but slightly soft on a high-resolution display. If you have the
original at 2000 px or more, use that — just run it through
[Squoosh](https://squoosh.app) first and keep it **under 300 KB**.

### 3b. The itinerary backdrops

Each day section is a full-width photograph with the card sitting on it, so
it reads as a postcard lying on a surface — the same idea as the hero.

| Section | File |
|---|---|
| Day One | `backdrop-day-one.jpg` (marigold arch) |
| Day Two | `backdrop-day-two.jpg` (carved window) |

Swap either by replacing the file, or point `--backdrop` at something else in
the `.day--one` / `.day--two` rules in `style.css`. The photos run at full
strength with no tint over them — the card itself is opaque, so nothing
behind it affects how readable the text is. If you ever use a photo busy
enough to fight the card, add a veil back on `.day::before` with a
`linear-gradient` over the `background-image`.

**These two files are ~285 KB of the page's weight.** If you want that back,
run them through [Squoosh](https://squoosh.app) and export as **WebP** —
usually about half the size at the same quality. Then update the two
`--backdrop` URLs to `.webp`.

### 4. Your illustrations

All seven are your pencil sketches — no placeholders left. Drop a
replacement in using the same filename and it appears automatically, with no
code change needed:

| Event | File |
|---|---|
| Engagement | `engagement.png` |
| Maapillai Azhaippu | `groom-welcome.png` |
| Reception & Dinner | `reception.png` |
| Sangeet | `sangeet.png` |
| Kaasi Yatra | `kasi-yatra.png` |
| Oonjal | `oonjal.png` |
| Muhurtham | `muhurtham.png` |

If a replacement has a different extension from the file above, update the
`src` on the matching `<li>` in `index.html` and set `width`/`height` to the
real pixel dimensions.

**Export them square.** The icon sits in a square box and is scaled to fit
inside it, so a wide drawing ends up visually smaller than a square one.
Yours are all 1640 × 1640, which is why they sit consistently — keep any
replacement on a square canvas too.

**Keep them small.** Your sketches arrive at 1640 × 1640 and 1.1–2.1 MB
each — around 11 MB for the set, which would have made the page roughly
eighty times heavier. They're now 480 × 480 at 256 colours: **11 MB →
228 KB**, with no visible difference at the size they display. Keep your
full-resolution originals somewhere outside this folder — everything in here
gets published.

Run this on any new icon before adding it:

```bash
python3 -c "from PIL import Image; f='assets/img/illustrations/YOURFILE.png'; im=Image.open(f).convert('RGBA').resize((480,480), Image.LANCZOS); im.quantize(colors=256, method=Image.FASTOCTREE, dither=Image.NONE).save(f, optimize=True)"
```

**Use lowercase filenames.** Yours came in as `.PNG`. macOS doesn't care, but
Netlify and GitHub Pages are case-sensitive, so an uppercase extension would
have worked locally and broken every icon once deployed. They're renamed to
lowercase now — keep it that way.

One thing to know: these load as `<img>`, which means they **can't inherit
the `--accent` colour** — whatever colour is baked into the file is what
shows. So if you switch the palette to gold, recolour the icons too.

### 5. Colours and fonts

Top of `assets/css/style.css`, in the `:root` block. Change `--accent` and
the whole page shifts — every event title, link, and the button follow it.

Two faces are in use:

- **Montserrat** for all running text, dates and small-caps labels. Set at
  weight 300 and a couple of steps smaller than you'd size a serif, because
  Montserrat's x-height is much larger.
- **Tangerine** for event names, the venue name and the couple's name —
  `--script`. Used at weight **700**: Tangerine's regular weight is too thin
  to hold at these sizes, and its small x-height means the sizes are scaled
  up roughly 35% compared with a normal face.

Both are free Google Fonts, loaded in a single request. Nothing to install.

**Andasia has been removed** — Tangerine replaced it, and its files were the "Personal Use Only" cut, which generally can't be embedded on a public site anyway.

---

## The last card — RSVP, venue, accommodation

**Layout.** On a laptop it's two halves: address and directions on the left,
accommodation with the RSVP beneath it on the right. **On phones it drops to
a single column** — the halves are too narrow to split a street address and a
form across — reading straight down: address, accommodation, RSVP.

The venue name sits under the "Address" label at the same size as the
itinerary event headers, so the two share a type scale.

**RSVP** has a text box and a button that opens WhatsApp with a message
already written. The number is **+1 604 360 6514**. To change it,
edit it in **two places** in `index.html` — the `data-whatsapp` attribute and
the `href` on the same link — as `16043606514`, country code first, with no
`+`, spaces or dashes.

The button is a plain link carrying a generic message, so it works with
JavaScript off. With JS on, `main.js` folds whatever the guest typed into the
message:

> Hi! I'd like to RSVP for Varsha & Sanjay's wedding — Priya and Arun will be coming.

Pressing Enter in the box sends too. To reword the message, edit the two
strings in `main.js`.

**Address and accommodation** are on the right, under the venue name.
"Open in Google Maps" sits below the address. The map link is a search for
the full address — **scan or tap it once yourself before this goes to
guests**; that's the only way to be sure it lands where you expect. If you
get an exact pin (Maps → Share → Copy link), swap the URL on that button.

The QR code has been removed, along with `assets/qr/`. If you ever want it
back for a printed invite:

```bash
npx --yes qrcode -o wedding-website/assets/qr/peacock-grove.svg -t svg "PASTE_THE_MAPS_LINK"
```

---

## Deploying

It's a folder of static files, so anything will host it. Drag the folder
onto [Netlify Drop](https://app.netlify.com/drop) and it's live in about ten
seconds, or push to GitHub and turn on Pages.

## Notes on the details

- **Responsive** down to 320px wide, verified with no horizontal scroll.
  The timeline keeps its centre rail and left/right alternation at every
  width, phones included.
- **Fonts** load from Google Fonts without blocking the first paint, so text
  appears immediately in a fallback serif and swaps over. If you want to
  remove that last external request, self-host the two font files and point
  `@font-face` at them.
- **Works without JavaScript** — if the script fails, every section is
  visible rather than stuck invisible mid-fade.
- **Respects reduced-motion** settings and prints cleanly, in case a guest
  wants the itinerary on paper.
