/* ============================================================
   THE EMPIRE PROPERTIES — front-end behaviour
   ============================================================ */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- preloader ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => $('#preloader')?.classList.add('done'), 500);
  });

  /* ---------- year ---------- */
  $('#yr').textContent = new Date().getFullYear();

  /* ---------- nav: scrolled state + mobile ---------- */
  const nav = $('#nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
  const burger = $('#burger'), links = $('#navLinks');
  burger.addEventListener('click', () => {
    links.classList.toggle('open');
    burger.classList.toggle('x');
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open'); burger.classList.remove('x');
  }));

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.14 });
  const observeReveals = () => $$('.reveal:not(.in)').forEach(el => io.observe(el));
  observeReveals();

  /* ---------- counters ---------- */
  const counted = new WeakSet();
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting || counted.has(e.target)) return;
      counted.add(e.target);
      const el = e.target, to = +el.dataset.to, suf = el.dataset.suffix || '';
      const dur = 1600, t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * to).toLocaleString('en-IN') + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  $$('.count__n').forEach(el => cio.observe(el));

  /* ---------- parallax ---------- */
  const pls = $$('.parallax');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    pls.forEach(p => {
      const speed = +p.dataset.speed || 0.15;
      p.style.transform = `translateY(${y * speed}px)`;
    });
  }, { passive: true });

  /* ============================================================
     PROPERTIES
     ============================================================ */
  const grid = $('#propGrid'), emptyMsg = $('#gridEmpty');
  let DATA = window.EMPIRE.load();
  let activeFilter = 'all';

  function cardHTML(p) {
    return `
    <article class="card reveal ${p.sold ? 'is-sold' : ''}" data-type="${p.type}">
      <span class="card__ribbon">Sold Out</span>
      <div class="card__media">
        <img src="${p.image}" alt="${p.title} — ${p.type} in ${p.location}" loading="lazy" />
        <span class="card__tag">${p.deal}</span>
        <span class="card__type">${p.type}</span>
      </div>
      <div class="card__body">
        <span class="card__loc">${p.location}</span>
        <h3 class="card__title">${p.title}</h3>
        <div class="card__meta">
          <span><b>${p.area}</b></span>
          ${p.beds && p.beds !== '—' ? `<span><b>${p.beds}</b></span>` : ''}
          ${p.baths && p.baths !== '—' ? `<span><b>${p.baths}</b></span>` : ''}
          <span>Facing <b>${p.facing}</b></span>
        </div>
        <div class="card__foot">
          <div class="card__price"><small>Price</small>${p.price}</div>
          <button class="card__btn" data-view="${p.id}">View</button>
        </div>
      </div>
    </article>`;
  }

  function render() {
    const list = DATA.filter(p => activeFilter === 'all' || p.type === activeFilter);
    grid.innerHTML = list.map(cardHTML).join('');
    emptyMsg.hidden = list.length > 0;
    observeReveals();
    // make freshly-rendered cards visible quickly
    requestAnimationFrame(() => $$('#propGrid .reveal').forEach(el => el.classList.add('in')));
  }

  /* filters */
  $('#filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip'); if (!btn) return;
    $$('#filters .chip').forEach(c => c.classList.remove('is-active'));
    btn.classList.add('is-active');
    activeFilter = btn.dataset.filter;
    window.trackEvent && trackEvent('filter_properties', { filter: activeFilter });
    render();
  });

  /* ---------- property modal ---------- */
  const modal = $('#propModal'), modalBody = $('#modalBody');
  function openModal(p) {
    const waText = encodeURIComponent(
      `Hello The Empire Properties, I'm interested in "${p.title}" (${p.type}, ${p.location}) listed at ${p.price}. Please share details.`
    );
    modalBody.innerHTML = `
      <div class="modal__hero"><img src="${p.image}" alt="${p.title}" /></div>
      <div class="modal__inner">
        <span class="card__loc">${p.location} · ${p.deal}</span>
        <h3>${p.title}</h3>
        <div class="modal__price">${p.price} ${p.sold ? '<span style="font-size:1rem;color:#c98">· Sold</span>' : ''}</div>
        <div class="modal__facts">
          <div><span>Type</span><b>${p.type}</b></div>
          <div><span>Area</span><b>${p.area}</b></div>
          <div><span>Facing</span><b>${p.facing}</b></div>
          ${p.beds && p.beds !== '—' ? `<div><span>Config</span><b>${p.beds}</b></div>` : ''}
          ${p.baths && p.baths !== '—' ? `<div><span>Baths</span><b>${p.baths}</b></div>` : ''}
          <div><span>Status</span><b>${p.sold ? 'Sold Out' : 'Available'}</b></div>
        </div>
        <p class="modal__desc">${p.desc}</p>
        <div class="modal__actions">
          <a class="btn btn--gold" target="_blank" rel="noopener"
             href="https://wa.me/${window.EMPIRE.WHATSAPP}?text=${waText}"
             data-track="property_whatsapp">Enquire on WhatsApp</a>
          <button class="btn btn--ghost" data-prefill="${p.id}">Enquiry Form</button>
        </div>
      </div>`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    window.trackEvent && trackEvent('view_property', { id: p.id, title: p.title });
  }
  function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }

  grid.addEventListener('click', (e) => {
    const v = e.target.closest('[data-view]'); if (!v) return;
    const p = DATA.find(x => x.id === v.dataset.view); if (p) openModal(p);
  });
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeModal();
    const pre = e.target.closest('[data-prefill]');
    if (pre) {
      const p = DATA.find(x => x.id === pre.dataset.prefill);
      closeModal();
      $('#enqProperty').value = p ? `${p.title} (${p.location})` : '';
      $('#enquiry').scrollIntoView({ behavior: 'smooth' });
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ============================================================
     REELS
     ============================================================ */
  const reelsRow = $('#reelsRow');
  reelsRow.innerHTML = window.EMPIRE.REELS.map(r => `
    <a class="reel" href="https://instagram.com/${window.EMPIRE.INSTAGRAM}" target="_blank" rel="noopener" data-track="reel_open">
      <img src="${r.img}" alt="${r.cap}" loading="lazy" />
      <span class="reel__play"><b>▶</b></span>
      <span class="reel__cap">${r.cap}</span>
    </a>`).join('');

  /* ============================================================
     ENQUIRY FORM  →  WhatsApp
     ============================================================ */
  const form = $('#enquiryForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const name = (f.get('name') || '').trim();
    const phone = (f.get('phone') || '').trim();
    if (!name || phone.replace(/\D/g, '').length < 10) {
      showToast('Please add your name and a valid 10-digit phone.');
      return;
    }
    const lines = [
      '*New Enquiry — The Empire Properties*',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Looking to: ${f.get('intent')}`,
      `Property type: ${f.get('type')}`,
      f.get('area') ? `Area / Budget: ${f.get('area')}` : '',
      f.get('property') ? `Interested in: ${f.get('property')}` : '',
      f.get('message') ? `Message: ${f.get('message')}` : ''
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${window.EMPIRE.WHATSAPP}?text=${text}`;

    window.trackEvent && trackEvent('enquiry_sent', { intent: f.get('intent'), type: f.get('type') });
    // Meta standard lead event
    try { if (window.fbq) fbq('track', 'Lead'); } catch (e) {}

    showToast('Opening WhatsApp to deliver your enquiry…');
    window.open(url, '_blank');
    form.reset();
    $('#enqProperty').value = '';
  });

  /* ---------- toast ---------- */
  let toastT;
  function showToast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('show'), 4200);
  }

  /* ---------- track outbound CTA clicks ---------- */
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-track]');
    if (el && window.trackEvent) trackEvent(el.dataset.track, { label: el.textContent.trim().slice(0, 40) });
  });

  /* ---------- re-sync if admin updates in another tab ---------- */
  window.addEventListener('storage', (e) => {
    if (e.key === window.EMPIRE.KEY) { DATA = window.EMPIRE.load(); render(); }
  });

  render();
})();
