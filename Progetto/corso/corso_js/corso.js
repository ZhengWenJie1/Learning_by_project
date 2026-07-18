// ==========================================================
// PAGINA CORSO - integrazione dvformazione_data.json
// Legge l'id del corso da ?id= nell'URL e mostra i dettagli
// ==========================================================

const JSON_PATH = '../data/dvformazione_data.json';

const CATEGORIA_COLORI = {
  'IRATA': '#d64f4f',
  'GWO': '#4f8fd6',
  'PTI': '#7a5cd6',
  'Fune D.Lgs. 81/08': '#e8935a',
  'Lavori in Quota': '#3d3d3d',
  'Soccorso': '#2d9c6f',
  'Corsi Accreditati': '#c98a2c'
};

fetch(JSON_PATH)
  .then(res => {
    if (!res.ok) throw new Error('Impossibile caricare ' + JSON_PATH);
    return res.json();
  })
  .then(dati => {
    renderLogo(dati.sito);
    renderCorso(dati);
  })
  .catch(err => {
    console.error('Errore caricamento dati:', err);
  });

// ---- LOGO azienda (header) ----
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

// ---- CONTENUTO CORSO ----
function renderCorso(dati) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const corso = dati.corsi.find(c => c.id === id) || dati.corsi[0];
  if (!corso) return;

  const colore = CATEGORIA_COLORI[corso.categoria] || '#888';

  const img = document.getElementById('corsoImg');
  if (corso.immagini && corso.immagini[0]) {
    img.src = corso.immagini[0];
    img.alt = corso.titolo;
    img.style.display = 'block';
  }

  const catEl = document.getElementById('corsoCategoria');
  catEl.textContent = corso.categoria;
  catEl.style.background = colore;

  document.getElementById('corsoTitolo').textContent = corso.titolo;
  document.getElementById('corsoDescrizione').textContent = corso.descrizione || '';

  // griglia info (durata, orario, quota, validità, prerequisiti)
  const infoGrid = document.getElementById('corsoInfoGrid');
  const infoItems = [
    { label: 'Durata', valore: corso.durata },
    { label: 'Orario', valore: corso.orario },
    { label: 'Quota di iscrizione', valore: corso.quota_iscrizione },
    { label: 'Validità attestato', valore: corso.validita_attestato },
    { label: 'Prerequisiti', valore: corso.prerequisiti },
    { label: 'Sede', valore: 'Torino - Via G. Battista Feroggio, 54' }
  ].filter(i => i.valore);
  infoGrid.innerHTML = infoItems.map(i => `
    <div class="info-item"><span class="info-label">${i.label}</span><span class="info-valore">${i.valore}</span></div>
  `).join('');

  // obiettivi
  const obWrap = document.getElementById('corsoObiettiviWrap');
  const obList = document.getElementById('corsoObiettivi');
  if (Array.isArray(corso.obiettivi) && corso.obiettivi.length) {
    obList.innerHTML = corso.obiettivi.map(o => `<li>${o}</li>`).join('');
  } else {
    obWrap.style.display = 'none';
  }

  // destinatari
  const destWrap = document.getElementById('corsoDestinatariWrap');
  const destList = document.getElementById('corsoDestinatari');
  if (Array.isArray(corso.destinatari) && corso.destinatari.length) {
    destList.innerHTML = corso.destinatari.map(d => `<li>${d}</li>`).join('');
  } else {
    destWrap.style.display = 'none';
  }

  // sessioni prossime
  const sessWrap = document.getElementById('corsoSessioniWrap');
  const sessBox = document.getElementById('corsoSessioni');
  if (Array.isArray(corso.sessioni_prossime) && corso.sessioni_prossime.length) {
    sessBox.innerHTML = corso.sessioni_prossime.map(s => `<span class="chip" style="border-color:${colore};color:${colore};">${s}</span>`).join('');
  } else {
    sessWrap.style.display = 'none';
  }

  const linkEsterno = document.getElementById('corsoLinkEsterno');
  linkEsterno.href = corso.url || '#';

  document.title = corso.titolo + ' - Dinamiche Verticali Formazione';
}
