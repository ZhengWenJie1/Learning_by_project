// ==========================================================
// CALENDARIO-GRIGLIA.JS
// Disegna la griglia del mese corrente, con le barre delle
// sessioni corso (usa le funzioni e i dati preparati in
// calendario.js e stato.js)
// ==========================================================

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

  // Per ogni giorno del mese (1, 2, 3... fino all'ultimo) controlliamo
  // quali sessioni corso cadono proprio in quel giorno
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
