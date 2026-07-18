// ==========================================================
// PAGINA NEWS - integrazione dvformazione_data.json
// ==========================================================

const JSON_PATH = '../data/dvformazione_data.json';

fetch(JSON_PATH)
  .then(res => {
    if (!res.ok) throw new Error('Impossibile caricare ' + JSON_PATH);
    return res.json();
  })
  .then(dati => {
    renderLogo(dati.sito);
    renderNews(dati);
  })
  .catch(err => {
    console.error('Errore caricamento dati:', err);
  });

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

function renderNews(dati) {
  const sito = dati.sito || {};
  const contatti = dati.contatti || {};

  document.getElementById('newsTitolo').textContent = sito.nome || '';
  document.getElementById('newsDescrizione').textContent = sito.descrizione_breve || '';

  const linkEsterno = document.getElementById('newsLinkEsterno');
  if (contatti.news_portal) linkEsterno.href = contatti.news_portal;

  if (contatti.indirizzo) {
    document.getElementById('sidebarContatti').innerHTML = `
      ${contatti.indirizzo.via}, ${contatti.indirizzo.cap} ${contatti.indirizzo.citta} (${contatti.indirizzo.regione})<br>
      Tel: ${contatti.telefono || ''}<br>
      Email: ${contatti.email || ''}<br>
      Orari: ${contatti.orari_telefono || ''}
    `;
  }

  const social = contatti.social || {};
  const socialItems = [
    { key: 'facebook', label: 'Facebook' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'youtube', label: 'YouTube' }
  ].filter(i => social[i.key]);
  document.getElementById('sidebarSocial').innerHTML = socialItems
    .map(i => `<a href="${social[i.key]}" target="_blank" rel="noopener">${i.label}</a>`)
    .join('<br>');

  const immagini = (dati.immagini_tutte && dati.immagini_tutte.carosello_home) || [];
  const esempi = [
    { titolo: 'Nuove sessioni corsi PTI 2026', data: '10 Lug 2026' },
    { titolo: 'Aggiornamento normativa DPI anticaduta', data: '02 Lug 2026' },
    { titolo: 'IRATA: date esame Torino', data: '24 Giu 2026' },
    { titolo: 'Corso GWO BST: cosa aspettarsi', data: '15 Giu 2026' }
  ];
  document.getElementById('newsGrid').innerHTML = esempi.map((n, i) => `
    <a class="news-card" href="${contatti.news_portal || '#'}" target="_blank" rel="noopener">
      <div class="news-img" style="background-image:url('${immagini[i % immagini.length] || ''}');"></div>
      <div class="news-body">
        <div class="news-title">${n.titolo}</div>
        <div class="news-meta">${n.data}</div>
      </div>
    </a>
  `).join('');
}
