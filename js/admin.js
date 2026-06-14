/* ============================================================
   THE EMPIRE PROPERTIES — Admin console
   Simple demo auth + CRUD into the shared localStorage store.
   (For a real deployment, replace the password gate with a
    proper server-side login.)
   ============================================================ */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const PASSWORD = 'empire@2026';
  const AUTH_KEY = 'empire_admin_ok';

  /* ---------- toast ---------- */
  let tT;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(tT); tT = setTimeout(() => t.classList.remove('show'), 3200);
  }

  /* ---------- auth gate ---------- */
  const gate = $('#gate'), dash = $('#dash');
  function showDash() { gate.style.display = 'none'; dash.hidden = false; renderAll(); }
  if (sessionStorage.getItem(AUTH_KEY) === '1') showDash();

  $('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if ($('#pw').value === PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1');
      showDash();
    } else {
      toast('Incorrect password.');
      $('#pw').value = '';
    }
  });
  $('#logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem(AUTH_KEY); location.reload();
  });

  /* ---------- data ---------- */
  let DATA = window.EMPIRE.load();
  const persist = () => window.EMPIRE.save(DATA);
  const uid = () => 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1000);

  /* ---------- stats ---------- */
  function renderStats() {
    const total = DATA.length;
    const sold = DATA.filter(p => p.sold).length;
    const avail = total - sold;
    const types = new Set(DATA.map(p => p.type)).size;
    $('#stats').innerHTML = `
      <div class="stat"><b>${total}</b><span>Total Listings</span></div>
      <div class="stat"><b>${avail}</b><span>Available</span></div>
      <div class="stat"><b>${sold}</b><span>Sold Out</span></div>
      <div class="stat"><b>${types}</b><span>Categories</span></div>`;
  }

  /* ---------- list ---------- */
  function renderList() {
    const box = $('#admList');
    if (!DATA.length) { box.innerHTML = '<p style="color:var(--cream-dim);font-style:italic">No properties yet — add one on the left.</p>'; return; }
    box.innerHTML = DATA.map(p => `
      <div class="row">
        <img src="${p.image}" alt="${p.title}" />
        <div class="row__info">
          <b>${p.title} ${p.sold ? '<span class="badge-sold">Sold</span>' : ''}</b>
          <span>${p.type} · ${p.deal} · ${p.location}</span>
        </div>
        <div class="row__price">${p.price}</div>
        <div class="row__acts">
          <button class="mini" data-edit="${p.id}">Edit</button>
          <button class="mini sold ${p.sold ? 'on' : ''}" data-sold="${p.id}">${p.sold ? 'Sold ✓' : 'Mark Sold'}</button>
          <button class="mini del" data-del="${p.id}">Delete</button>
        </div>
      </div>`).join('');
  }

  /* ---------- theme picker ---------- */
  function renderThemes() {
    const grid = $('#themeGrid');
    if (!grid) return;
    const active = window.EMPIRE.getTheme();
    grid.innerHTML = window.EMPIRE.THEMES.map(t => `
      <button class="theme-card ${t.id === active ? 'active' : ''}" data-theme-id="${t.id}">
        <span class="theme-sw">
          <i style="background:${t.sw[0]}"></i><i style="background:${t.sw[1]}"></i><i style="background:${t.sw[2]}"></i>
        </span>
        <span class="theme-card__body"><b>${t.name}</b><span>${t.note}</span></span>
      </button>`).join('');
  }
  $('#themeGrid').addEventListener('click', (e) => {
    const c = e.target.closest('[data-theme-id]'); if (!c) return;
    const id = c.dataset.themeId;
    window.EMPIRE.setTheme(id);                 // saves + applies to admin instantly
    renderThemes();
    const t = window.EMPIRE.THEMES.find(x => x.id === id);
    toast(`Theme set to “${t ? t.name : id}”. Live on the website.`);
  });

  function renderAll() { renderStats(); renderList(); renderThemes(); }

  /* ---------- form (add / edit) ---------- */
  const form = $('#propForm');
  function fillForm(p) {
    $('#editId').value = p.id;
    $('#f_title').value = p.title; $('#f_type').value = p.type; $('#f_deal').value = p.deal;
    $('#f_location').value = p.location; $('#f_price').value = p.price; $('#f_area').value = p.area;
    $('#f_beds').value = p.beds; $('#f_baths').value = p.baths; $('#f_facing').value = p.facing;
    $('#f_image').value = p.image; $('#f_desc').value = p.desc; $('#f_sold').checked = !!p.sold;
    $('#formTitle').innerHTML = 'Edit <span class="cursive">Property</span>';
    $('#saveBtn').textContent = 'Save Changes';
    $('#cancelEdit').hidden = false;
    dash.scrollIntoView({ behavior: 'smooth' });
  }
  function resetForm() {
    form.reset(); $('#editId').value = '';
    $('#formTitle').innerHTML = 'Add a <span class="cursive">Property</span>';
    $('#saveBtn').textContent = 'Add Property';
    $('#cancelEdit').hidden = true;
  }
  $('#cancelEdit').addEventListener('click', resetForm);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const obj = {
      id: $('#editId').value || uid(),
      title: $('#f_title').value.trim(),
      type: $('#f_type').value,
      deal: $('#f_deal').value,
      location: $('#f_location').value.trim(),
      price: $('#f_price').value.trim(),
      area: $('#f_area').value.trim() || '—',
      beds: $('#f_beds').value.trim() || '—',
      baths: $('#f_baths').value.trim() || '—',
      facing: $('#f_facing').value.trim() || '—',
      image: $('#f_image').value.trim() ||
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
      desc: $('#f_desc').value.trim() || 'Contact The Empire Properties for full details on this listing.',
      sold: $('#f_sold').checked
    };
    if (!obj.title || !obj.location || !obj.price) { toast('Title, location and price are required.'); return; }

    const i = DATA.findIndex(p => p.id === obj.id);
    if (i > -1) { DATA[i] = obj; toast('Property updated.'); }
    else { DATA.unshift(obj); toast('Property added to portfolio.'); }
    persist(); renderAll(); resetForm();
  });

  /* ---------- list actions (edit / sold / delete) ---------- */
  $('#admList').addEventListener('click', (e) => {
    const ed = e.target.closest('[data-edit]');
    const so = e.target.closest('[data-sold]');
    const de = e.target.closest('[data-del]');
    if (ed) { const p = DATA.find(x => x.id === ed.dataset.edit); if (p) fillForm(p); }
    if (so) {
      const p = DATA.find(x => x.id === so.dataset.sold);
      if (p) { p.sold = !p.sold; persist(); renderAll(); toast(p.sold ? 'Marked as Sold Out.' : 'Marked as Available.'); }
    }
    if (de) {
      const p = DATA.find(x => x.id === de.dataset.del);
      if (p && confirm(`Delete "${p.title}"? This cannot be undone.`)) {
        DATA = DATA.filter(x => x.id !== de.dataset.del);
        persist(); renderAll(); toast('Property deleted.');
      }
    }
  });

  /* ---------- reset demo ---------- */
  $('#resetBtn').addEventListener('click', () => {
    if (confirm('Reset the portfolio back to the original demo listings?')) {
      DATA = window.EMPIRE.SEED.slice();
      persist(); renderAll(); resetForm(); toast('Demo data restored.');
    }
  });
})();
