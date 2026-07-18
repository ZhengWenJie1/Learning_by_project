// ==========================================================
// HOME - integrazione dvformazione_data.json
// ==========================================================

const JSON_PATH = '../data/dvformazione_data.json';

const CATEGORIA_MAP = {
  'IRATA':               { id: 'irata',       nome: 'Irata',       colore: '#d64f4f', icona: '\uD83E\uDDD7' },
  'GWO':                 { id: 'gwo',         nome: 'GWO',         colore: '#4f8fd6', icona: '\uD83C\uDF2C\uFE0F' },
  'PTI':                 { id: 'pti',         nome: 'PTI',         colore: '#7a5cd6', icona: '\u2699\uFE0F' },
  'Fune D.Lgs. 81/08':   { id: 'fune',        nome: 'Fune',        colore: '#e8935a', icona: '\uD83E\uDE22' },
  'Lavori in Quota':     { id: 'quota',       nome: 'Quota',       colore: '#3d3d3d', icona: '\uD83C\uDFD7\uFE0F' },
  'Soccorso':            { id: 'soccorso',    nome: 'Soccorso',    colore: '#2d9c6f', icona: '\u26D1\uFE0F' },
  'Corsi Accreditati':   { id: 'accreditati', nome: 'Accreditati', colore: '#c98a2c', icona: '\uD83C\uDF93' }
};

const MESI = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];

let DATI = null;
let categoriaAttiva = 'tutti';
let testoRicerca = '';
let calCategoriaAttiva = 'tutti';
let calMese = null;
let eventiCalendario = [];

fetch(JSON_PATH)
  .then(res => {
    if (!res.ok) throw new Error('Impossibile caricare ' + JSON_PATH);
    return res.json();
  })
  .then(dati => {
    DATI = dati;
    init(dati);
  })
  .catch(err => {
    console.error('Errore caricamento dati:', err);
  });

function categoriaInfo(nomeCategoria) {
  return CATEGORIA_MAP[nomeCategoria] || { id: 'altro', nome: nomeCategoria, colore: '#888', icona: '\uD83D\uDCCC' };
}

function init(dati) {
  renderLogo(dati.sito);
  renderHeroSlider(dati);
  renderPartnerLogos(dati);
  renderFiltri(dati.corsi);
  renderCoursesGrid(dati.corsi);
  renderChiSiamo(dati);
  renderNews(dati);
  renderSocial(dati.contatti ? dati.contatti.social : {});
  renderSede(dati);
  renderFooter(dati);
  buildEventiCalendario(dati.corsi);
  renderCalFiltri(dati.corsi);
  calMese = startOfMonth(new Date());
  renderCalendar();
  wireNavSearch();
  initViewTabs();
}

// ---- LOGO azienda (header + footer) ----
function renderLogo(sito) {
  if (!sito) return;
  const img = document.getElementById('logoImg');
  const testo = document.getElementById('logoTesto');
  if (sito.logo && img) {
    img.src = sito.logo;
    img.alt = sito.nome || 'Logo';
    img.style.display = 'block';
    if (testo) testo.style.display = 'none';
  }
}

// ---- HERO SLIDER ----
function renderHeroSlider(dati) {
  const wrap = document.getElementById('heroSlides');
  const dots = document.getElementById('heroDots');
  if (!wrap) return;

  const carosello = (dati.immagini_tutte && dati.immagini_tutte.carosello_home) || [];
  const trovaCorso = (cat) => dati.corsi.find(c => c.categoria === cat);

  const slides = [
    {
      eyebrow: 'Centro di formazione certificato IRATA & GWO',
      titolo: 'Formazione in quota,<br><span>Dinamiche Verticali</span>',
      testo: dati.sito ? dati.sito.descrizione_breve : '',
      immagine: carosello[0] || '',
      btnLabel: 'Scopri i corsi',
      btnHref: '#corsi'
    }
  ];

  const soccorso = trovaCorso('Soccorso');
  if (soccorso) {
    slides.push({
      eyebrow: 'Soccorso Tecnico',
      titolo: soccorso.titolo,
      testo: 'Metti alla prova le tue competenze e affronta con sicurezza le manovre di soccorso in quota e negli spazi confinati.',
      immagine: (soccorso.immagini && soccorso.immagini[0]) || carosello[1] || '',
      btnLabel: 'Iscriviti',
      btnHref: `../corso/corso.html?id=${soccorso.id}`
    });
  }

  const irata = trovaCorso('IRATA');
  if (irata) {
    slides.push({
      eyebrow: 'IRATA',
      titolo: irata.titolo,
      testo: irata.descrizione ? irata.descrizione.slice(0, 140) + '…' : '',
      immagine: (irata.immagini && irata.immagini[0]) || carosello[2] || '',
      btnLabel: 'Iscriviti',
      btnHref: `../corso/corso.html?id=${irata.id}`
    });
  }

  wrap.innerHTML = slides.map((s, i) => `
    <div class="hero-slide ${i === 0 ? 'active' : ''}" style="background-image:linear-gradient(180deg, rgba(20,15,10,.35) 0%, rgba(15,10,6,.9) 90%), url('${s.immagine}');">
      <div class="hero-content">
        <p class="hero-eyebrow">${s.eyebrow}</p>
        <h1>${s.titolo}</h1>
        <p class="hero-desc">${s.testo || ''}</p>
        <div class="hero-actions">
          <a href="${s.btnHref}" class="btn btn-primary">${s.btnLabel}</a>
          <a href="../contatti/contatti.html" class="btn btn-light">Contattaci</a>
        </div>
      </div>
    </div>
  `).join('');

  if (dots && slides.length > 1) {
    dots.innerHTML = slides.map((_, i) => `<button class="hero-dot ${i === 0 ? 'active' : ''}" data-i="${i}"></button>`).join('');
    dots.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      mostraSlide(parseInt(btn.dataset.i, 10));
    });
  }

  if (slides.length > 1) {
    let indice = 0;
    setInterval(() => {
      indice = (indice + 1) % slides.length;
      mostraSlide(indice);
    }, 6000);
  }
}

function mostraSlide(i) {
  const slideEls = document.querySelectorAll('.hero-slide');
  const dotEls = document.querySelectorAll('.hero-dot');
  slideEls.forEach((el, idx) => el.classList.toggle('active', idx === i));
  dotEls.forEach((el, idx) => el.classList.toggle('active', idx === i));
}

// ---- LOGHI PARTNER sotto l'hero ----
function renderPartnerLogos(dati) {
  const box = document.getElementById('heroPartners');
  if (!box) return;
  box.innerHTML = '';

  const cert = dati.certificazioni || [];
  cert.forEach(c => {
    const a = document.createElement('a');
    a.href = c.pagina || '#';
    a.target = '_blank';
    a.rel = 'noopener';
    const img = document.createElement('img');
    img.src = (c.loghi && (c.loghi.footer || c.loghi.home_thumb)) || '';
    img.alt = c.nome;
    a.appendChild(img);
    box.appendChild(a);
  });
}

// ---- FILTRI CORSI (pill) ----
function elencoCategorie(corsi) {
  const viste = new Set();
  const lista = [];
  corsi.forEach(c => {
    if (!viste.has(c.categoria)) {
      viste.add(c.categoria);
      lista.push(categoriaInfo(c.categoria));
    }
  });
  return lista;
}

function renderFiltri(corsi = []) {
  const box = document.getElementById('filters');
  if (!box) return;
  box.innerHTML = '';

  const btnTutti = document.createElement('button');
  btnTutti.textContent = 'Tutti i corsi';
  btnTutti.dataset.categoria = 'tutti';
  btnTutti.classList.add('selected');
  box.appendChild(btnTutti);

  elencoCategorie(corsi).forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.nome;
    btn.dataset.categoria = cat.id;
    box.appendChild(btn);
  });

  box.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    box.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    categoriaAttiva = btn.dataset.categoria;
    renderCoursesGrid(DATI.corsi);
  });

  const search = document.getElementById('searchInput');
  if (search) {
    search.addEventListener('input', (e) => {
      testoRicerca = e.target.value.trim().toLowerCase();
      renderCoursesGrid(DATI.corsi);
    });
  }
}

// ---- GRIGLIA CORSI ----
function renderCoursesGrid(corsi = []) {
  const grid = document.getElementById('coursesGrid');
  if (!grid) return;

  let corsiFiltrati = categoriaAttiva === 'tutti'
    ? corsi
    : corsi.filter(c => categoriaInfo(c.categoria).id === categoriaAttiva);

  if (testoRicerca) {
    corsiFiltrati = corsiFiltrati.filter(c =>
      c.titolo.toLowerCase().includes(testoRicerca) ||
      (c.descrizione || '').toLowerCase().includes(testoRicerca)
    );
  }

  if (corsiFiltrati.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;font-size:13px;color:#999;">Nessun corso trovato.</p>';
    return;
  }

  grid.innerHTML = corsiFiltrati.map((corso, idx) => {
    const catInfo = categoriaInfo(corso.categoria);
    const immagine = (corso.immagini && corso.immagini[0]) || '';
    const prossima = (corso.sessioni_prossime && corso.sessioni_prossime[0]) || null;
    const isNuovo = idx < 3;
    return `
      <a href="../corso/corso.html?id=${corso.id}" class="course-card">
        <div class="img" style="background-image:url('${immagine}');">
          ${isNuovo ? '<span class="badge-nuovo">Nuovo</span>' : ''}
          <span class="badge" style="background:${catInfo.colore};">${catInfo.nome}</span>
        </div>
        <div class="info">
          <div class="title">${corso.titolo}</div>
          <div class="date">${prossima ? '\uD83D\uDCC5 Prossima sessione: ' + prossima : '\uD83D\uDCCD Torino \u2013 su richiesta'}</div>
          <div class="powered">${corso.durata || ''}</div>
        </div>
      </a>
    `;
  }).join('');
}

// ---- CHI SIAMO ----
function renderChiSiamo(dati) {
  const testo = document.getElementById('chiSiamoTesto');
  if (testo && dati.sito) {
    testo.innerHTML = `<strong>${dati.sito.nome}</strong> \u00e8 l'unico ed esclusivo Petzl Technical Institute in Italia, centro di formazione certificato anche IRATA e GWO per il lavoro in quota, l'accesso su fune, il soccorso e i DPI anticaduta.`;
  }

  const stats = document.getElementById('statsBox');
  if (stats) {
    const totCorsi = dati.corsi ? dati.corsi.length : 0;
    const datiStat = [
      { num: '+18', label: 'Anni di esperienza' },
      { num: totCorsi, label: 'Corsi disponibili' },
      { num: '3.500+', label: 'Corsisti formati' },
      { num: '1', label: 'Unico PTI in Italia' }
    ];
    stats.innerHTML = datiStat.map(s => `
      <div class="stat">
        <div class="num">${s.num}</div>
        <div class="label">${s.label}</div>
      </div>
    `).join('');
  }

  const features = document.getElementById('featuresBox');
  if (features) {
    const contaCategoria = (nome) => dati.corsi.filter(c => c.categoria === nome).length;
    const items = [
      { icona: '\uD83D\uDCC8', titolo: 'Sede iscritta a Petzl Solution', desc: `${contaCategoria('PTI')} corsi PTI disponibili` },
      { icona: '\uD83D\uDD04', titolo: 'Corsi per rivenditori e revisioni', desc: 'Moduli dedicati a rivenditori e centri di revisione DPI' },
      { icona: '\u2705', titolo: 'Centro certificato IRATA e GWO', desc: `${contaCategoria('IRATA') + contaCategoria('GWO')} corsi tra IRATA e GWO` },
      { icona: '\uD83D\uDCD8', titolo: 'Formazione per addestratori finali', desc: `${contaCategoria('Corsi Accreditati')} corsi accreditati per formatori` }
    ];
    features.innerHTML = items.map(it => `
      <div class="feature-card">
        <div class="icon">${it.icona}</div>
        <div>
          <div class="ftitle">${it.titolo}</div>
          <div class="fdesc">${it.desc}</div>
        </div>
      </div>
    `).join('');
  }
}

// ---- NEWS E AGGIORNAMENTI ----
function renderNews(dati) {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;

  const portale = (dati.contatti && dati.contatti.news_portal) || '#';
  const immagini = (dati.immagini_tutte && dati.immagini_tutte.carosello_home) || [];
  const esempi = [
    { titolo: 'Nuove sessioni corsi PTI 2026', data: '10 Lug 2026', tempo: '3 min' },
    { titolo: 'Aggiornamento normativa DPI anticaduta', data: '02 Lug 2026', tempo: '4 min' },
    { titolo: 'IRATA: date esame Torino', data: '24 Giu 2026', tempo: '2 min' },
    { titolo: 'Corso GWO BST: cosa aspettarsi', data: '15 Giu 2026', tempo: '5 min' }
  ];

  grid.innerHTML = esempi.map((n, i) => `
    <a class="news-card" href="${portale}" target="_blank" rel="noopener">
      <div class="news-img" style="background-image:url('${immagini[i % immagini.length] || ''}');">
        <span class="badge-nuovo">News</span>
      </div>
      <div class="news-body">
        <div class="news-title">${n.titolo}</div>
        <div class="news-meta"><span>\uD83D\uDCC5 ${n.data}</span><span>\u23F1 ${n.tempo}</span></div>
        <span class="news-link">Leggi &rarr;</span>
      </div>
    </a>
  `).join('');
}

// ---- SOCIAL ----
function renderSocial(social = {}) {
  const row = document.getElementById('socialRow');
  if (row) {
    const items = [
      { key: 'facebook', label: 'Facebook', icon: '\uD83D\uDCD8' },
      { key: 'instagram', label: 'Instagram', icon: '\uD83D\uDCF7' },
      { key: 'linkedin', label: 'LinkedIn', icon: '\uD83D\uDCBC' },
      { key: 'youtube', label: 'YouTube', icon: '\u25B6\uFE0F' }
    ];
    row.innerHTML = items
      .filter(i => social[i.key])
      .map(i => `
        <a href="${social[i.key]}" target="_blank" rel="noopener">
          <span class="icon">${i.icon}</span>
          ${i.label}
        </a>
      `).join('');
  }

  const videoRow = document.getElementById('socialVideoRow');
  if (videoRow && DATI && DATI.video) {
    const videos = DATI.video.filter(v => v.url.includes('youtube-nocookie')).slice(0, 2);
    videoRow.innerHTML = videos.map(v => `
      <div class="social-video">
        <iframe src="${v.url}" title="${v.titolo}" frameborder="0" allowfullscreen loading="lazy"></iframe>
      </div>
    `).join('');
  }
}

// ---- LA NOSTRA SEDE (galleria + feedback) ----
function renderSede(dati) {
  const sub = document.getElementById('sedeSub');
  if (sub) {
    sub.textContent = `Un centro di formazione attrezzato a ${dati.contatti && dati.contatti.indirizzo ? dati.contatti.indirizzo.citta : 'Torino'}, con strutture dedicate all'addestramento pratico su fune, in quota e negli spazi confinati.`;
  }

  const box = document.getElementById('sedeGallery');
  if (box) {
    const galleria = (dati.immagini_tutte && dati.immagini_tutte.carosello_home) || [];
    box.innerHTML = galleria.slice(0, 3).map(img => `
      <div class="g-item"><img src="${img}" alt="Sede Dinamiche Verticali"></div>
    `).join('');
  }

  const rec2 = document.getElementById('recensioniGrid2');
  if (rec2) {
    rec2.innerHTML = (dati.recensioni_home || []).map(r => `
      <div class="recensione-card">
        <img src="${r.immagine || ''}" alt="${r.autore}">
        <div>
          <p>&ldquo;${r.testo}&rdquo;</p>
          <div class="autore">${r.autore}</div>
        </div>
      </div>
    `).join('');
  }
}

// ---- FOOTER ----
function renderFooter(dati) {
  const azienda = dati.sito || {};
  const contatti = dati.contatti || {};

  const logoImg = document.getElementById('footerLogoImg');
  const logoTesto = document.getElementById('footerLogoTesto');
  if (azienda.logo && logoImg) {
    logoImg.src = azienda.logo;
    logoImg.alt = azienda.nome || 'Logo';
    logoImg.style.display = 'block';
    if (logoTesto) logoTesto.style.display = 'none';
  }

  const piva = document.getElementById('footerPiva');
  if (piva && azienda.piva) piva.textContent = `P.IVA ${azienda.piva}`;

  const contattiBox = document.getElementById('footerContatti');
  if (contattiBox) {
    const ind = contatti.indirizzo
      ? `${contatti.indirizzo.via}, ${contatti.indirizzo.cap} ${contatti.indirizzo.citta} (${contatti.indirizzo.regione})`
      : '';
    contattiBox.innerHTML = `
      <h4>Contatti</h4>
      <p>${ind}</p>
      <p>${contatti.telefono || ''}</p>
      <p>${contatti.email || ''}</p>
      <p>${contatti.orari_telefono || ''}</p>
    `;
  }

  const footerSocial = document.getElementById('footerSocial');
  if (footerSocial && contatti.social) {
    const s = contatti.social;
    const items = [
      { url: s.facebook, icon: '\uD83D\uDCD8' },
      { url: s.instagram, icon: '\uD83D\uDCF7' },
      { url: s.linkedin, icon: '\uD83D\uDCBC' },
      { url: s.youtube, icon: '\u25B6\uFE0F' }
    ].filter(i => i.url);
    footerSocial.innerHTML = items.map(i => `<a href="${i.url}" target="_blank" rel="noopener">${i.icon}</a>`).join('');
  }
}

// ===========================================================
// CALENDARIO
// ===========================================================

function parseGiorniDurata(durata) {
  if (!durata) return 1;
  const match = durata.match(/(\d+)\s*giorn/i);
  return match ? parseInt(match[1], 10) : 1;
}

function parseDataItaliana(str) {
  // formato dd/mm/yyyy
  const [gg, mm, aaaa] = str.split('/').map(n => parseInt(n, 10));
  return new Date(aaaa, mm - 1, gg);
}

function buildEventiCalendario(corsi = []) {
  eventiCalendario = [];
  corsi.forEach(corso => {
    const catInfo = categoriaInfo(corso.categoria);
    const giorni = parseGiorniDurata(corso.durata);
    (corso.sessioni_prossime || []).forEach(sessione => {
      const inizio = parseDataItaliana(sessione);
      eventiCalendario.push({
        inizio,
        giorni,
        categoria: catInfo.id,
        colore: catInfo.colore,
        titolo: corso.titolo,
        corsoId: corso.id
      });
    });
  });
}

function renderCalFiltri(corsi = []) {
  const box = document.getElementById('calFilters');
  if (!box) return;
  box.innerHTML = '';

  const btnTutti = document.createElement('button');
  btnTutti.textContent = 'Tutti';
  btnTutti.dataset.categoria = 'tutti';
  btnTutti.classList.add('selected');
  box.appendChild(btnTutti);

  elencoCategorie(corsi).forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.nome;
    btn.dataset.categoria = cat.id;
    box.appendChild(btn);
  });

  box.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    box.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    calCategoriaAttiva = btn.dataset.categoria;
    renderCalendar();
  });

  document.getElementById('calPrev').addEventListener('click', () => {
    calMese = new Date(calMese.getFullYear(), calMese.getMonth() - 1, 1);
    renderCalendar();
  });
  document.getElementById('calNext').addEventListener('click', () => {
    calMese = new Date(calMese.getFullYear(), calMese.getMonth() + 1, 1);
    renderCalendar();
  });
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function stessoGiorno(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function renderCalendar() {
  const label = document.getElementById('calMeseLabel');
  const anno = document.getElementById('calAnno');
  const grid = document.getElementById('calGrid');
  const empty = document.getElementById('calEmpty');
  if (!grid) return;

  label.textContent = `${MESI[calMese.getMonth()]}`;
  anno.textContent = calMese.getFullYear();

  const primoDelMese = new Date(calMese.getFullYear(), calMese.getMonth(), 1);
  const ultimoDelMese = new Date(calMese.getFullYear(), calMese.getMonth() + 1, 0);
  const giorniNelMese = ultimoDelMese.getDate();

  // Lunedì = 0 ... Domenica = 6
  let offset = primoDelMese.getDay() - 1;
  if (offset < 0) offset = 6;

  const eventiFiltrati = calCategoriaAttiva === 'tutti'
    ? eventiCalendario
    : eventiCalendario.filter(ev => ev.categoria === calCategoriaAttiva);

  let celle = '';
  for (let i = 0; i < offset; i++) {
    celle += `<div class="cal-cell empty"></div>`;
  }

  let eventiVisibiliNelMese = 0;

  for (let giorno = 1; giorno <= giorniNelMese; giorno++) {
    const dataCorrente = new Date(calMese.getFullYear(), calMese.getMonth(), giorno);
    const eventiGiorno = eventiFiltrati.filter(ev => {
      const fine = new Date(ev.inizio.getFullYear(), ev.inizio.getMonth(), ev.inizio.getDate() + ev.giorni - 1);
      return dataCorrente >= new Date(ev.inizio.getFullYear(), ev.inizio.getMonth(), ev.inizio.getDate())
          && dataCorrente <= fine;
    });

    if (eventiGiorno.length) eventiVisibiliNelMese++;

    const barre = eventiGiorno.map(ev => {
      const isInizio = stessoGiorno(dataCorrente, ev.inizio);
      const testo = isInizio ? ev.titolo : '\u2026' + ev.titolo;
      return `<a class="cal-bar" href="../corso/corso.html?id=${ev.corsoId}" style="background:${ev.colore};" title="${ev.titolo}">${testo}</a>`;
    }).join('');

    celle += `
      <div class="cal-cell">
        <span class="cal-daynum">${giorno}</span>
        <div class="cal-bars">${barre}</div>
      </div>
    `;
  }

  grid.innerHTML = celle;
  empty.style.display = eventiVisibiliNelMese === 0 ? 'block' : 'none';
}

// ---- TAB "CORSI" / "CALENDARIO" ----
function initViewTabs() {
  const tabs = document.getElementById('viewTabs');
  const panelCorsi = document.getElementById('viewCorsi');
  const panelCal = document.getElementById('viewCalendario');
  if (!tabs || !panelCorsi || !panelCal) return;

  function switchView(view) {
    const isCal = view === 'calendario';
    panelCorsi.style.display = isCal ? 'none' : 'block';
    panelCal.style.display = isCal ? 'block' : 'none';
    tabs.querySelectorAll('.view-tab').forEach(b => b.classList.toggle('selected', b.dataset.view === view));
  }

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.view-tab');
    if (!btn) return;
    switchView(btn.dataset.view);
  });

  // Link della navbar/footer che puntano a #corsi o #calendario devono
  // selezionare la tab corrispondente invece di limitarsi a scorrere la pagina
  document.querySelectorAll('a[href$="#corsi"], a[href$="#calendario"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
      const view = href.endsWith('#calendario') ? 'calendario' : 'corsi';
      const target = document.getElementById('corsi');
      if (!target) return;
      e.preventDefault();
      switchView(view);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Se la pagina viene aperta direttamente su #calendario, mostra subito quella tab
  const hashIniziale = window.location.hash.replace('#', '');
  switchView(hashIniziale === 'calendario' ? 'calendario' : 'corsi');
}

// ---- RICERCA NAVBAR ----
function wireNavSearch() {
  const btn = document.getElementById('navSearchBtn');
  const wrap = document.querySelector('.nav-search-wrap');
  const input = document.getElementById('navSearchInput');
  if (!btn || !wrap || !input) return;

  btn.addEventListener('click', () => {
    wrap.classList.toggle('open');
    if (wrap.classList.contains('open')) {
      input.focus();
    }
  });

  input.addEventListener('input', (e) => {
    testoRicerca = e.target.value.trim().toLowerCase();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = e.target.value;
    renderCoursesGrid(DATI.corsi);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('corsi').scrollIntoView({ behavior: 'smooth' });
    }
  });
}
