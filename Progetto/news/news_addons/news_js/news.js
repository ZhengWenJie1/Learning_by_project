// ==========================================================
// PAGINA NEWS - integrazione dati.json
// ==========================================================

const JSON_PATH = '../Data/dati.json';

fetch(JSON_PATH)
  .then(res => {
    if (!res.ok) throw new Error('Impossibile caricare ' + JSON_PATH);
    return res.json();
  })
  .then(dati => {
    renderLogo(dati.azienda);
    renderNews(dati.azienda);
  })
  .catch(err => {
    console.error('Errore caricamento dati.json:', err);
  });

// ---- LOGO azienda (header) ----
function renderLogo(azienda) {
  if (!azienda) return;
  const img = document.getElementById('logoImg');
  const testo = document.getElementById('logoTesto');
  if (azienda.logo && img) {
    img.src = azienda.logo;
    img.alt = azienda.nome || 'Logo';
    img.style.display = 'block';
    if (testo) testo.style.display = 'none';
  }
}

// ---- CONTENUTO NEWS ----
function renderNews(azienda) {
  if (!azienda) return;

  document.getElementById('newsTitolo').textContent = azienda.nome;
  document.getElementById('newsDescrizione').textContent = azienda.descrizioneBreve;

  const linkEsterno = document.getElementById('newsLinkEsterno');
  if (azienda.sitoNews) linkEsterno.href = azienda.sitoNews;

  const contatti = azienda.contatti;
  if (contatti) {
    document.getElementById('sidebarContatti').innerHTML = `
      ${contatti.indirizzo.via}, ${contatti.indirizzo.citta} (${contatti.indirizzo.regione})<br>
      Tel: ${contatti.telefono}<br>
      Email: ${contatti.email}<br>
      Orari: ${contatti.orari}
    `;
  }

  const social = azienda.social;
  if (social) {
    document.getElementById('sidebarSocial').innerHTML = `
      <a href="${social.facebook}" target="_blank" rel="noopener">Facebook</a> ·
      <a href="${social.instagram}" target="_blank" rel="noopener">Instagram</a> ·
      <a href="${social.linkedin}" target="_blank" rel="noopener">LinkedIn</a> ·
      <a href="${social.youtube}" target="_blank" rel="noopener">YouTube</a>
    `;
  }
}
