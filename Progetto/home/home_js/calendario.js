// ==========================================================
// CALENDARIO.JS
// Prepara i "dati" del calendario: legge la durata dei corsi,
// trasforma le date scritte in italiano e costruisce la
// lista di eventi. Disegna anche i filtri e i pulsanti
// mese precedente/successivo
// ==========================================================

// Legge quanti giorni dura un corso a partire da un testo tipo "3 giorni".
// durata.match(...) cerca dentro il testo un numero seguito dalla
// parola "giorn" (giorno/giorni) e ce lo restituisce.
function contaGiorniDurata(durata) {
  if (!durata) return 1;
  const trovato = durata.match(/(\d+)\s*giorn/i);
  return trovato ? parseInt(trovato[1], 10) : 1;
}

// Trasforma una data scritta in formato italiano "gg/mm/aaaa" in un oggetto Date
function leggiDataItaliana(testo) {
  const parti = testo.split("/");
  const giorno = parseInt(parti[0], 10);
  const mese = parseInt(parti[1], 10);
  const anno = parseInt(parti[2], 10);
  return new Date(anno, mese - 1, giorno);
}

// Trasforma le "sessioni_prossime" di ogni corso in una lista di eventi calendario
function costruisciEventiCalendario(corsi) {
  corsi = corsi || [];
  eventiCalendario = [];

  corsi.forEach(function (corso) {
    const infoCategoria = categoriaInfo(corso.categoria);
    const giorni = contaGiorniDurata(corso.durata);
    const sessioni = corso.sessioni_prossime || [];

    sessioni.forEach(function (sessione) {
      eventiCalendario.push({
        inizio: leggiDataItaliana(sessione),
        giorni: giorni,
        categoria: infoCategoria.id,
        colore: infoCategoria.colore,
        titolo: corso.titolo,
        corsoId: corso.id
      });
    });
  });
}

// Disegna i filtri per categoria del calendario e collega i
// pulsanti mese precedente/successivo
function mostraFiltriCalendario(corsi) {
  corsi = corsi || [];
  const contenitore = document.querySelector("#calFilters");
  if (!contenitore) return;

  contenitore.innerHTML = "";

  const bottoneTutti = document.createElement("button");
  bottoneTutti.textContent = "Tutti";
  bottoneTutti.dataset.categoria = "tutti";
  bottoneTutti.classList.add("selected");
  contenitore.appendChild(bottoneTutti);

  elencoCategorie(corsi).forEach(function (categoria) {
    const bottone = document.createElement("button");
    bottone.textContent = categoria.nome;
    bottone.dataset.categoria = categoria.id;
    contenitore.appendChild(bottone);
  });

  contenitore.addEventListener("click", function (evento) {
    const bottone = evento.target.closest("button");
    if (!bottone) return;

    contenitore.querySelectorAll("button").forEach(function (b) {
      b.classList.remove("selected");
    });
    bottone.classList.add("selected");

    calCategoriaAttiva = bottone.dataset.categoria;
    mostraCalendario();
  });

  document.querySelector("#calPrev").addEventListener("click", function () {
    calMese = new Date(calMese.getFullYear(), calMese.getMonth() - 1, 1);
    mostraCalendario();
  });

  document.querySelector("#calNext").addEventListener("click", function () {
    calMese = new Date(calMese.getFullYear(), calMese.getMonth() + 1, 1);
    mostraCalendario();
  });
}
