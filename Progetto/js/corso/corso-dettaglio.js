// ==========================================================
// CORSO-DETTAGLIO.JS
// Legge l'id del corso scritto nell'indirizzo della pagina
// (es. corso.html?id=xxx) e riempie immagine, categoria,
// titolo, descrizione e griglia informazioni
// ==========================================================

// Colore associato a ogni categoria di corso
const COLORE_CATEGORIA = {
  "IRATA": "#d64f4f",
  "GWO": "#4f8fd6",
  "PTI": "#7a5cd6",
  "Fune D.Lgs. 81/08": "#e8935a",
  "Lavori in Quota": "#3d3d3d",
  "Soccorso": "#2d9c6f",
  "Corsi Accreditati": "#c98a2c"
};

// Cerca il corso giusto nell'elenco, in base all'id nell'indirizzo.
//
// window.location.search è la parte dell'indirizzo dopo il "?"
// (es. "?id=abc"). URLSearchParams la trasforma in un oggetto comodo
// da leggere con .get("id").
//
// dati.corsi.find(...) restituisce il PRIMO elemento dell'array per
// cui la funzione dà true (qui: il corso con quell'id). Se nessun
// corso corrisponde, find restituisce undefined.
function trovaCorsoCorrente(dati) {
  const parametri = new URLSearchParams(window.location.search);
  const idCorso = parametri.get("id");

  const corso = dati.corsi.find(function (c) {
    return c.id === idCorso;
  });

  return corso || dati.corsi[0];
}

// Riempie immagine, categoria, titolo e descrizione del corso
function mostraCorsoTesta(corso, colore) {
  const immagineCorso = document.querySelector("#corsoImg");
  if (corso.immagini && corso.immagini[0]) {
    immagineCorso.src = corso.immagini[0].replace(/^image\//, "../image/");
    immagineCorso.alt = corso.titolo;
    immagineCorso.style.display = "block";
  }

  const etichettaCategoria = document.querySelector("#corsoCategoria");
  etichettaCategoria.textContent = corso.categoria;
  etichettaCategoria.style.background = colore;

  document.querySelector("#corsoTitolo").textContent = corso.titolo;
  document.querySelector("#corsoDescrizione").textContent = corso.descrizione || "";

  document.title = corso.titolo + " - Dinamiche Verticali Formazione";
}

// Riempie la griglia con durata, orario, quota, ecc.
function mostraCorsoInfoGrid(corso) {
  const infoDaMostrare = [
    { etichetta: "Durata", valore: corso.durata },
    { etichetta: "Orario", valore: corso.orario },
    { etichetta: "Quota di iscrizione", valore: corso.quota_iscrizione },
    { etichetta: "Validità attestato", valore: corso.validita_attestato },
    { etichetta: "Prerequisiti", valore: corso.prerequisiti },
    { etichetta: "Sede", valore: "Torino - Via G. Battista Feroggio, 54" }
  ];

  // .forEach(...) esegue la funzione per OGNI elemento dell'array:
  // qui, per ogni riga di informazione da mostrare
  let htmlInfo = "";
  infoDaMostrare.forEach(function (info) {
    if (info.valore) {
      htmlInfo += `
        <div class="info-item">
          <span class="info-label">${info.etichetta}</span>
          <span class="info-valore">${info.valore}</span>
        </div>
      `;
    }
  });
  document.querySelector("#corsoInfoGrid").innerHTML = htmlInfo;
}
