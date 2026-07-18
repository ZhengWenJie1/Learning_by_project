// ==========================================================
// CORSI.JS
// Tutto quello che riguarda la lista dei corsi: i pulsanti
// filtro per categoria, la ricerca e la griglia con le card
// ==========================================================

// Restituisce l'elenco delle categorie presenti nei corsi, senza ripetizioni
function elencoCategorie(corsi) {
  const categorieGiaViste = [];
  const elenco = [];

  corsi.forEach(function (corso) {
    if (categorieGiaViste.indexOf(corso.categoria) === -1) {
      categorieGiaViste.push(corso.categoria);
      elenco.push(categoriaInfo(corso.categoria));
    }
  });

  return elenco;
}

// Disegna i bottoni dei filtri ("Tutti i corsi", "Irata", "GWO", ...)
// e collega anche la ricerca testuale
function mostraFiltriCorsi(corsi) {
  corsi = corsi || [];
  const contenitore = document.querySelector("#filters");
  if (!contenitore) return;

  contenitore.innerHTML = "";

  const bottoneTutti = document.createElement("button");
  bottoneTutti.textContent = "Tutti i corsi";
  bottoneTutti.dataset.categoria = "tutti";
  bottoneTutti.classList.add("selected");
  contenitore.appendChild(bottoneTutti);

  elencoCategorie(corsi).forEach(function (categoria) {
    const bottone = document.createElement("button");
    bottone.textContent = categoria.nome;
    bottone.dataset.categoria = categoria.id;
    contenitore.appendChild(bottone);
  });

  // Un solo "ascoltatore" sul contenitore, che capisce su quale
  // bottone si è cliccato (delega degli eventi)
  contenitore.addEventListener("click", function (evento) {
    const bottone = evento.target.closest("button");
    if (!bottone) return;

    contenitore.querySelectorAll("button").forEach(function (b) {
      b.classList.remove("selected");
    });
    bottone.classList.add("selected");

    categoriaAttiva = bottone.dataset.categoria;
    mostraGrigliaCorsi(DATI.corsi);
  });

  const campoRicerca = document.querySelector("#searchInput");
  if (campoRicerca) {
    campoRicerca.addEventListener("input", function (evento) {
      testoRicerca = evento.target.value.trim().toLowerCase();
      mostraGrigliaCorsi(DATI.corsi);
    });
  }
}

// Disegna le card dei corsi, tenendo conto del filtro categoria
// e del testo cercato
function mostraGrigliaCorsi(corsi) {
  corsi = corsi || [];
  const griglia = document.querySelector("#coursesGrid");
  if (!griglia) return;

  // 1) Filtriamo per categoria
  let corsiFiltrati = corsi;
  if (categoriaAttiva !== "tutti") {
    corsiFiltrati = corsiFiltrati.filter(function (corso) {
      return categoriaInfo(corso.categoria).id === categoriaAttiva;
    });
  }

  // 2) Filtriamo per testo cercato (titolo o descrizione)
  if (testoRicerca) {
    corsiFiltrati = corsiFiltrati.filter(function (corso) {
      const titolo = corso.titolo.toLowerCase();
      const descrizione = (corso.descrizione || "").toLowerCase();
      return titolo.includes(testoRicerca) || descrizione.includes(testoRicerca);
    });
  }

  if (corsiFiltrati.length === 0) {
    griglia.innerHTML = '<p style="grid-column:1/-1;text-align:center;font-size:13px;color:#999;">Nessun corso trovato.</p>';
    return;
  }

  let htmlGriglia = "";
  corsiFiltrati.forEach(function (corso, indice) {
    const infoCategoria = categoriaInfo(corso.categoria);
    const immagine = (corso.immagini && corso.immagini[0]) || "";
    const prossimaSessione = (corso.sessioni_prossime && corso.sessioni_prossime[0]) || null;
    const etichettaNuovo = indice < 3 ? '<span class="badge-nuovo">Nuovo</span>' : "";
    const testoData = prossimaSessione
      ? `📅 Prossima sessione: ${prossimaSessione}`
      : "📍 Torino – su richiesta";

    htmlGriglia += `
      <a href="../corso/corso.html?id=${corso.id}" class="course-card">
        <div class="img" style="background-image:url('${immagine}');">
          ${etichettaNuovo}
          <span class="badge" style="background:${infoCategoria.colore};">${infoCategoria.nome}</span>
        </div>
        <div class="info">
          <div class="title">${corso.titolo}</div>
          <div class="date">${testoData}</div>
          <div class="powered">${corso.durata || ""}</div>
        </div>
      </a>
    `;
  });

  griglia.innerHTML = htmlGriglia;
}
