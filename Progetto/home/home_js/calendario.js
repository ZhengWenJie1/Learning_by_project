// ==========================================================
// CALENDARIO.JS
// Tutto quello che riguarda la vista "Calendario": costruire
// gli eventi a partire dai corsi, i filtri, la navigazione
// tra i mesi e il disegno della griglia del mese
// ==========================================================

// Legge quanti giorni dura un corso a partire da un testo tipo "3 giorni"
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

// Restituisce il primo giorno del mese di una certa data
function primoGiornoDelMese(data) {
  return new Date(data.getFullYear(), data.getMonth(), 1);
}

// Controlla se due date cadono nello stesso giorno
function stessoGiorno(dataA, dataB) {
  return dataA.getFullYear() === dataB.getFullYear() &&
    dataA.getMonth() === dataB.getMonth() &&
    dataA.getDate() === dataB.getDate();
}

// Disegna la griglia del mese corrente, con le barre delle sessioni corso
function mostraCalendario() {
  const etichettaMese = document.querySelector("#calMeseLabel");
  const etichettaAnno = document.querySelector("#calAnno");
  const griglia = document.querySelector("#calGrid");
  const messaggioVuoto = document.querySelector("#calEmpty");
  if (!griglia) return;

  etichettaMese.textContent = MESI[calMese.getMonth()];
  etichettaAnno.textContent = calMese.getFullYear();

  const primoDelMese = new Date(calMese.getFullYear(), calMese.getMonth(), 1);
  const ultimoDelMese = new Date(calMese.getFullYear(), calMese.getMonth() + 1, 0);
  const giorniNelMese = ultimoDelMese.getDate();

  // Vogliamo che la settimana inizi di Lunedì (0) e finisca di Domenica (6)
  let casellaVuoteIniziali = primoDelMese.getDay() - 1;
  if (casellaVuoteIniziali < 0) {
    casellaVuoteIniziali = 6;
  }

  let eventiFiltrati = eventiCalendario;
  if (calCategoriaAttiva !== "tutti") {
    eventiFiltrati = eventiCalendario.filter(function (evento) {
      return evento.categoria === calCategoriaAttiva;
    });
  }

  let htmlCelle = "";
  for (let i = 0; i < casellaVuoteIniziali; i++) {
    htmlCelle += '<div class="cal-cell empty"></div>';
  }

  let giorniConEventi = 0;

  for (let giorno = 1; giorno <= giorniNelMese; giorno++) {
    const dataCorrente = new Date(calMese.getFullYear(), calMese.getMonth(), giorno);

    const eventiDelGiorno = eventiFiltrati.filter(function (evento) {
      const inizioEvento = new Date(evento.inizio.getFullYear(), evento.inizio.getMonth(), evento.inizio.getDate());
      const fineEvento = new Date(evento.inizio.getFullYear(), evento.inizio.getMonth(), evento.inizio.getDate() + evento.giorni - 1);
      return dataCorrente >= inizioEvento && dataCorrente <= fineEvento;
    });

    if (eventiDelGiorno.length > 0) {
      giorniConEventi++;
    }

    let htmlBarre = "";
    eventiDelGiorno.forEach(function (evento) {
      const isInizio = stessoGiorno(dataCorrente, evento.inizio);
      const testoBarra = isInizio ? evento.titolo : "…" + evento.titolo;
      htmlBarre += `<a class="cal-bar" href="../corso/corso.html?id=${evento.corsoId}" style="background:${evento.colore};" title="${evento.titolo}">${testoBarra}</a>`;
    });

    htmlCelle += `
      <div class="cal-cell">
        <span class="cal-daynum">${giorno}</span>
        <div class="cal-bars">${htmlBarre}</div>
      </div>
    `;
  }

  griglia.innerHTML = htmlCelle;
  messaggioVuoto.style.display = giorniConEventi === 0 ? "block" : "none";
}
