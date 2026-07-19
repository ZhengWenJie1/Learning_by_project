// ==========================================================
// CORSI-GRIGLIA.JS
// Disegna le card dei corsi, tenendo conto del filtro
// categoria e del testo cercato (le variabili categoriaAttiva
// e testoRicerca sono definite in stato.js)
// ==========================================================

function mostraGrigliaCorsi(corsi) {
  corsi = corsi || [];
  const griglia = document.querySelector("#coursesGrid");
  if (!griglia) return;

  // 1) Filtriamo per categoria.
  // .filter(...) crea un NUOVO array con solo gli elementi per cui la
  // funzione restituisce true (qui: "il corso è della categoria attiva?").
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
    // Il punto interrogativo qui sotto è l'operatore ternario:
    // condizione ? "valore se vero" : "valore se falso".
    // È un if/else scritto in una riga sola.
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
