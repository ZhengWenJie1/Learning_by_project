// ==========================================================
// HOME - integrazione dati.json
// ==========================================================

const JSON_PATH = 'Data/dati.json';

let datiApp = null;          // conterrà tutto il JSON
let categoriaAttiva = 'tutti'; // filtro corsi selezionato

// Carica il JSON e avvia il render della pagina
fetch(JSON_PATH)
  .then(res => {
    if (!res.ok) throw new Error('Impossibile caricare ' + JSON_PATH);
    return res.json();
  })
  .then(dati => {
    datiApp = dati;
    renderLogo(dati.azienda);
    renderHero(dati);
    renderNuoviCorsi(dati.corsi);
    renderFiltri(dati.categorieCorsi);
    renderCoursesGrid(dati.corsi, dati.categorieCorsi);
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

// ---- HERO: descrizione azienda + immagine ----
function renderHero(dati) {
  const desc = document.getElementById('heroDescrizione');
  if (desc && dati.azienda?.descrizioneBreve) {
    desc.textContent = dati.azienda.descrizioneBreve;
  }

  const img = document.getElementById('heroImg');
  if (img) {
    // usa la prima immagine della galleria come immagine di apertura
    const immagineHero = dati.galleria?.[0]?.immagine || dati.corsi?.[0]?.immagine || '';
    img.src = immagineHero;
    img.alt = dati.galleria?.[0]?.titolo || dati.azienda?.nome || 'Formazione';
  }
}

// ---- NUOVI CORSI: carosello ----
function renderNuoviCorsi(corsi = []) {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;
  carousel.innerHTML = '';

  corsi.forEach(corso => {
    const card = document.createElement('a');
    card.href = `corso/corso.html?id=${corso.id}`;
    card.className = 'mini-card';
    card.style.backgroundImage = `url('${corso.immagine || ''}')`;
    card.style.backgroundSize = 'cover';
    card.style.backgroundPosition = 'center';
    card.title = corso.titolo;
    carousel.appendChild(card);
  });
}

// ---- SIDEBAR FILTRI (dalle categorieCorsi del JSON) ----
function renderFiltri(categorie = []) {
  const box = document.getElementById('filters');
  if (!box) return;
  box.innerHTML = '';

  // pulsante "tutti i corsi"
  const btnTutti = document.createElement('button');
  btnTutti.textContent = 'Tutti i corsi';
  btnTutti.dataset.categoria = 'tutti';
  btnTutti.classList.add('selected');
  box.appendChild(btnTutti);

  categorie.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.nome;
    btn.dataset.categoria = cat.id;
    box.appendChild(btn);
  });

  // gestione click filtro
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    box.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    categoriaAttiva = btn.dataset.categoria;
    renderCoursesGrid(datiApp.corsi, datiApp.categorieCorsi);
  });
}

// ---- GRIGLIA "TUTTI I CORSI" ----
function renderCoursesGrid(corsi = [], categorie = []) {
  const grid = document.getElementById('coursesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const corsiFiltrati = categoriaAttiva === 'tutti'
    ? corsi
    : corsi.filter(c => c.categoria === categoriaAttiva);

  if (corsiFiltrati.length === 0) {
    grid.innerHTML = '<p style="font-size:13px;color:#999;">Nessun corso disponibile per questa categoria.</p>';
    return;
  }

  corsiFiltrati.forEach(corso => {
    const catInfo = categorie.find(c => c.id === corso.categoria);

    const card = document.createElement('a');
    card.href = `corso/corso.html?id=${corso.id}`;
    card.className = 'course-card';
    card.innerHTML = `
      <div class="img" style="background-image:url('${corso.immagine || ''}');background-size:cover;background-position:center;"></div>
      <div class="info">
        <div class="title">${corso.titolo}</div>
        <div class="date">📍 ${corso.sede || ''}</div>
        <div class="powered">
          Powered by
          <span class="badge-text">${catInfo ? catInfo.nome : corso.categoria}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ---- CAROSELLO: frecce ----
const carousel = document.getElementById('carousel');
document.getElementById('arrowLeft')?.addEventListener('click', () => {
  carousel.scrollBy({ left: -160, behavior: 'smooth' });
});
document.getElementById('arrowRight')?.addEventListener('click', () => {
  carousel.scrollBy({ left: 160, behavior: 'smooth' });
});
