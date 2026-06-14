# The Empire Properties — Meerut Real Estate Website

A lavish, royal-themed, mobile-responsive real-estate website (demo) for
**The Empire Properties** — *Plots · Apartments · Duplexes · Sale · Purchase · Invest · Rent*.

## Quick start
No build tools needed. Just open the site:

```
the-empire-properties/
├── index.html        ← public website
├── admin.html        ← admin dashboard (add / edit / sold-out)
├── css/styles.css    ← royal theme
├── js/data.js        ← shared data layer (localStorage)
├── js/main.js        ← site behaviour
├── js/admin.js       ← dashboard logic
├── robots.txt
└── sitemap.xml
```

Open `index.html` in a browser. For best results (so localStorage stays
consistent between the site and admin), serve the folder over a tiny local server:

```bash
# from inside the-empire-properties/
python -m http.server 5500
# then visit http://localhost:5500
```

## Features
- **Royal / lavish UI** — emerald-ink + antique-gold palette, Playfair Display serif,
  Tangerine cursive accents on highlighted words, ornamental hero frame, marquee ticker.
- **Background video hero** with centered text + gradient veil + fallback poster.
- **Parallax background imagery** that shifts as you scroll.
- **Scroll-reveal animations**, animated stat counters, hover-lift property cards.
- **Property portfolio** with filter tabs (Plots / Apartments / Duplexes), detail modal,
  and **SOLD OUT** ribbons.
- **Enquiry form → WhatsApp**: on submit, a pre-filled WhatsApp message is delivered to
  the business number **+91 90129 09797**, so the team is notified instantly. Each property
  also has its own "Enquire on WhatsApp" button.
- **Floating WhatsApp button** on every screen.
- **Instagram reels strip** linking to `@the_empireproperties`.
- **Admin dashboard** (`admin.html`) — password-gated, add / edit / delete listings,
  toggle **Sold Out**, live stats. Changes sync to the public site instantly.
- **SEO**: title/description/keywords, Open Graph + Twitter cards, canonical, geo tags,
  JSON-LD `RealEstateAgent` schema, semantic HTML, `robots.txt`, `sitemap.xml`, lazy images.
- **Tracking points**: Google Analytics 4 + Meta Pixel snippets with a `trackEvent()`
  helper wired to CTAs, filters, property views, and the `Lead` event on enquiry.

## Things to replace before going live
1. **WhatsApp number** — `WHATSAPP` in `js/data.js` (currently `919012909797`).
2. **Instagram handle** — `INSTAGRAM` in `js/data.js`.
3. **Background video** — `hero__video` source in `index.html` (swap for your own MP4).
4. **Analytics IDs** — `G-XXXXXXXXXX` (GA4) and `YOUR_PIXEL_ID` (Meta) in `index.html`.
5. **Domain** — replace `https://theempireproperties.in/` in meta tags, `sitemap.xml`, `robots.txt`.
6. **Admin password** — `PASSWORD` in `js/admin.js` (demo: `empire@2026`).

## How WhatsApp notification works
This is a static demo, so enquiries use the official **`wa.me` deep link**: submitting the
form opens WhatsApp with a formatted message addressed to the business number. The team
receives it as a normal WhatsApp chat — no server required.

For **automatic** server-side notifications (e.g. send to WhatsApp even if the visitor
closes the tab), connect the form to the **WhatsApp Business Cloud API** or a service like
Twilio / Interakt / WATI and POST the form fields from `js/main.js` instead of opening `wa.me`.

## Admin login
- URL: `admin.html`
- Demo password: `empire@2026`

> The password gate is client-side for demo purposes only. Put real auth behind a server
> before deploying publicly.
