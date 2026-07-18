// ==========================================================
// PAGINA CONTATTI - integrazione dvformazione_data.json
// ==========================================================

const JSON_PATH = '../data/dvformazione_data.json';

fetch(JSON_PATH)
  .then(res => {
    if (!res.ok) throw new Error('Impossibile caricare ' + JSON_PATH);
    return res.json();
  })
  .then(dati => {
    renderLogo(dati.sito);
    renderContatti(dati);
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

function renderContatti(dati) {
  const c = dati.contatti || {};

  document.getElementById('bannerSub').textContent =
    'Scrivici o chiamaci per informazioni sui corsi, le certificazioni e le prossime sessioni disponibili.';

  if (c.indirizzo) {
    document.getElementById('cIndirizzo').textContent =
      `${c.indirizzo.via}, ${c.indirizzo.cap} ${c.indirizzo.citta} (${c.indirizzo.regione}), ${c.indirizzo.paese}`;
    const mappaLink = document.getElementById('mappaLink');
    if (mappaLink && c.indirizzo.mappa) mappaLink.href = c.indirizzo.mappa;
  }

  document.getElementById('cTelefono').textContent = c.telefono || '';
  document.getElementById('cEmail').textContent = c.email || '';
  document.getElementById('cOrari').textContent = c.orari_telefono || '';

  const note = document.getElementById('cNote');
  if (Array.isArray(c.note_posizione)) {
    note.innerHTML = c.note_posizione.map(n => `<li>${n}</li>`).join('');
  }

  const ref = document.getElementById('cReferente');
  if (c.referente) {
    ref.innerHTML = `
      <img src="${c.referente.foto || ''}" alt="${c.referente.nome}">
      <div><strong>${c.referente.nome}</strong><span>${c.referente.ruolo}</span></div>
    `;
  }

  const social = c.social || {};
  const items = [
    { key: 'facebook', label: 'Facebook' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'youtube', label: 'YouTube' }
  ].filter(i => social[i.key]);
  document.getElementById('cSocial').innerHTML = items
    .map(i => `<a href="${social[i.key]}" target="_blank" rel="noopener">${i.label}</a>`)
    .join('');
}
