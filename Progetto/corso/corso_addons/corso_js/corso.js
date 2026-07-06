// ==========================================================
// PAGINA CORSO - integrazione dati.json
// Legge l'id del corso da ?id= nell'URL e mostra i dettagli
// ==========================================================

const JSON_PATH = '../Data/dati.json';

fetch(JSON_PATH)
  .then(res => {
    if (!res.ok) throw new Error('Impossibile caricare ' + JSON_PATH);
    return res.json();
  })
  .then(dati => {
    renderLogo(dati.azienda);
    renderCorso(dati);
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

// ---- CONTENUTO CORSO ----
function renderCorso(dati) {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);

  // se non c'è id nell'URL, mostra il primo corso della lista come default
  const corso = dati.corsi.find(c => c.id === id) || dati.corsi[0];
  if (!corso) return;

  const catInfo = dati.categorieCorsi.find(c => c.id === corso.categoria);

  const img = document.getElementById('corsoImg');
  if (corso.immagine) {
    img.src = corso.immagine;
    img.alt = corso.titolo;
    img.style.display = 'block';
  }

  document.getElementById('corsoCategoria').textContent = catInfo ? catInfo.nome : corso.categoria;
  document.getElementById('corsoTitolo').textContent = corso.titolo;
  document.getElementById('corsoSottotitolo').textContent = corso.sottotitolo || '';
  document.getElementById('corsoDescrizione').textContent = corso.descrizione || '';
  document.getElementById('corsoSede').textContent = corso.sede ? `📍 ${corso.sede}` : '';

  // livelli (es. IRATA L1/L2/L3), se presenti
  const livelliBox = document.getElementById('corsoLivelli');
  livelliBox.innerHTML = '';
  if (Array.isArray(corso.livelli)) {
    corso.livelli.forEach(l => {
      const div = document.createElement('div');
      div.className = 'livello';
      div.innerHTML = `<strong>${l.codice} — ${l.nome}</strong><span>${l.descrizione}</span>`;
      livelliBox.appendChild(div);
    });
  }

  // video, se presente
  const videoWrap = document.getElementById('corsoVideoWrap');
  const video = document.getElementById('corsoVideo');
  if (corso.video) {
    video.src = corso.video;
    videoWrap.style.display = 'block';
  }

  // link esterno alla pagina reale del corso
  const linkEsterno = document.getElementById('corsoLinkEsterno');
  if (corso.link) {
    linkEsterno.href = corso.link;
    linkEsterno.style.display = 'inline-block';
  }

  document.title = corso.titolo + ' - Formazione';
}
