/* ============================================================
   THE EMPIRE PROPERTIES — shared data layer
   Properties live in localStorage so the Admin dashboard and
   the public site stay in sync on the same browser.
   ============================================================ */
window.EMPIRE = (function () {
  const KEY = 'empire_properties_v1';
  const THEME_KEY = 'empire_theme_v1';
  const WHATSAPP = '919012909797';          // business WhatsApp (country code + number)
  const INSTAGRAM = 'the_empireproperties';

  // ---- luxury royal themes (selectable from Admin) ----------
  // sw = [background, mid, accent] swatch preview colours
  const THEMES = [
    { id: 'emerald',  name: 'Emerald Royale',          note: 'Emerald ink & antique gold', sw: ['#0c1512', '#123127', '#c9a24b'] },
    { id: 'sapphire', name: 'Sapphire Majesty',        note: 'Royal navy & gold',          sw: ['#0a0f1c', '#16224a', '#d4af37'] },
    { id: 'burgundy', name: 'Burgundy Imperial',       note: 'Deep wine & champagne',      sw: ['#15090c', '#3d1420', '#d9b36b'] },
    { id: 'rosegold', name: 'Onyx & Rose Gold',        note: 'Charcoal & blush copper',    sw: ['#0e0d0d', '#2a201d', '#cf9277'] },
    { id: 'amethyst', name: 'Royal Amethyst',          note: 'Deep plum & gold',           sw: ['#0f0a17', '#2a1a42', '#cda84b'] },
    { id: 'bronze',   name: 'Midnight Teal & Bronze',  note: 'Peacock teal & bronze',      sw: ['#061311', '#0c3330', '#c08a4e'] }
  ];

  function getTheme() {
    try { return localStorage.getItem(THEME_KEY) || 'emerald'; } catch (e) { return 'emerald'; }
  }
  function applyTheme(id) {
    document.documentElement.setAttribute('data-theme', id || 'emerald');
  }
  function setTheme(id) {
    try { localStorage.setItem(THEME_KEY, id); } catch (e) {}
    applyTheme(id);
  }
  // apply saved theme as early as possible
  applyTheme(getTheme());
  // keep public site & admin in sync across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === THEME_KEY) applyTheme(e.newValue || 'emerald');
  });

  // ---- seed listings (used the first time only) -------------
  const SEED = [
    {
      id: 'p1',
      title: 'Imperial Corner Plot',
      type: 'Plot',
      deal: 'For Sale',
      location: 'Shatabdi Nagar, Meerut',
      price: '₹62 Lakh',
      area: '200 sq. yd',
      beds: '—',
      baths: '—',
      facing: 'East',
      sold: false,
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
      desc: 'A premium corner plot in one of Meerut\'s fastest-appreciating sectors. Wide road frontage, gated colony, and ready for immediate registry. Ideal for a private villa or a high-yield investment hold.'
    },
    {
      id: 'p2',
      title: 'The Regalia Apartment',
      type: 'Apartment',
      deal: 'For Sale',
      location: 'Ganga Nagar, Meerut',
      price: '₹48 Lakh',
      area: '1180 sq. ft',
      beds: '3 BHK',
      baths: '2 Bath',
      facing: 'North-East',
      sold: false,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      desc: 'A light-filled 3 BHK in a managed tower with lift, power backup and covered parking. Modular kitchen, premium fittings and a balcony that opens to the morning sun.'
    },
    {
      id: 'p3',
      title: 'Maharaja Duplex',
      type: 'Duplex',
      deal: 'For Sale',
      location: 'Pallavpuram, Meerut',
      price: '₹1.35 Cr',
      area: '2400 sq. ft',
      beds: '4 BHK',
      baths: '4 Bath',
      facing: 'West',
      sold: false,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
      desc: 'A statement duplex with double-height living, private terrace and imported finishes. Built for a family that wants its home to feel like an heirloom.'
    },
    {
      id: 'p4',
      title: 'Crown Residency Flat',
      type: 'Apartment',
      deal: 'For Rent',
      location: 'Jagriti Vihar, Meerut',
      price: '₹18,000 / mo',
      area: '950 sq. ft',
      beds: '2 BHK',
      baths: '2 Bath',
      facing: 'South',
      sold: false,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      desc: 'A semi-furnished 2 BHK in a quiet, family-first society. Walking distance to schools and markets, with secure parking and 24x7 security.'
    },
    {
      id: 'p5',
      title: 'Heritage Investment Plot',
      type: 'Plot',
      deal: 'Investment',
      location: 'Modipuram, Meerut',
      price: '₹40 Lakh',
      area: '150 sq. yd',
      beds: '—',
      baths: '—',
      facing: 'North',
      sold: true,
      image: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1000&q=80',
      desc: 'Located on the upcoming expressway corridor — a textbook appreciation play. Clear title, approved layout, and strong resale demand.'
    },
    {
      id: 'p6',
      title: 'Royal Garden Duplex',
      type: 'Duplex',
      deal: 'For Sale',
      location: 'Saket, Meerut',
      price: '₹98 Lakh',
      area: '1900 sq. ft',
      beds: '4 BHK',
      baths: '3 Bath',
      facing: 'East',
      sold: false,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80',
      desc: 'A landscaped duplex with private garden, pooja room and a sun-drenched first-floor lounge. Vastu-compliant and move-in ready.'
    },
    {
      id: 'p7',
      title: 'Empire Skyline 3 BHK',
      type: 'Apartment',
      deal: 'Investment',
      location: 'Abu Lane, Meerut',
      price: '₹55 Lakh',
      area: '1320 sq. ft',
      beds: '3 BHK',
      baths: '3 Bath',
      facing: 'North-West',
      sold: false,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      desc: 'A central-location apartment with strong rental demand and clubhouse access. A clean buy-to-let with healthy yield in the heart of the city.'
    },
    {
      id: 'p8',
      title: 'Premium Residential Plot',
      type: 'Plot',
      deal: 'For Sale',
      location: 'Ganga Nagar, Meerut',
      price: '₹78 Lakh',
      area: '250 sq. yd',
      beds: '—',
      baths: '—',
      facing: 'South-East',
      sold: false,
      image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1000&q=80',
      desc: 'A generous residential plot in a sought-after gated layout with underground wiring, parks and wide internal roads. Build your forever home.'
    }
  ];

  // ---- reels (Instagram placeholders) -----------------------
  const REELS = [
    { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', cap: 'Duplex walkthrough · Pallavpuram' },
    { img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80', cap: 'Inside The Regalia · 3 BHK' },
    { img: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=600&q=80', cap: 'Plot tour · Shatabdi Nagar' },
    { img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80', cap: 'Possession day with the Sharmas' }
  ];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    save(SEED);
    return SEED.slice();
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  return { KEY, THEME_KEY, WHATSAPP, INSTAGRAM, SEED, REELS, THEMES, load, save, getTheme, setTheme, applyTheme };
})();
