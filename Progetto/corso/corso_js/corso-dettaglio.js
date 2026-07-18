// ==========================================================
// CORSO-DETTAGLIO.JS
// Legge l'id del corso scritto nell'indirizzo della pagina
// (es. corso.html?id=xxx) e riempie tutti i dettagli
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

function mostraCorso(dati) {
  // Leggiamo il parametro "id" dall'indirizzo della pagina
  const parametri = new URLSearchParams(window.location.search);
  const idCorso = parametri.get("id");

  // Cerchiamo il corso con quell'id; se non lo troviamo, usiamo il primo della lista
  let corso = dati.corsi.find(function (c) {
    return c.id === idCorso;
  });
  if (!corso) {
    corso = dati.corsi[0];
  }
  if (!corso) return;

  const colore = COLORE_CATEGORIA[corso.categoria] || "#888";

  // Immagine principale del corso
  const immagineCorso = document.querySelector("#corsoImg");
  if (corso.immagini && corso.immagini[0]) {
    immagineCorso.src = corso.immagini[0];
    immagineCorso.alt = corso.titolo;
    immagineCorso.style.display = "block";
  }

  // Etichetta della categoria
  const etichettaCategoria = document.querySelector("#corsoCategoria");
  etichettaCategoria.textContent = corso.categoria;
  etichettaCategoria.style.background = colore;

  // Titolo e descrizione
  document.querySelector("#corsoTitolo").textContent = corso.titolo;
  document.querySelector("#corsoDescrizione").textContent = corso.descrizione || "";

  // Griglia con le informazioni principali (durata, orario, quota, ecc.)
  const infoDaMostrare = [
    { etichetta: "Durata", valore: corso.durata },
    { etichetta: "Orario", valore: corso.orario },
    { etichetta: "Quota di iscrizione", valore: corso.quota_iscrizione },
    { etichetta: "Validità attestato", valore: corso.validita_attestato },
    { etichetta: "Prerequisiti", valore: corso.prerequisiti },
    { etichetta: "Sede", valore: "Torino - Via G. Battista Feroggio, 54" }
  ];

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

  // Elenco obiettivi (se presente nel JSON)
  const boxObiettivi = document.querySelector("#corsoObiettiviWrap");
  const listaObiettivi = document.querySelector("#corsoObiettivi");
  if (Array.isArray(corso.obiettivi) && corso.obiettivi.length > 0) {
    let htmlObiettivi = "";
    corso.obiettivi.forEach(function (obiettivo) {
      htmlObiettivi += `<li>${obiettivo}</li>`;
    });
    listaObiettivi.innerHTML = htmlObiettivi;
  } else {
    boxObiettivi.style.display = "none";
  }

  // Elenco destinatari (se presente nel JSON)
  const boxDestinatari = document.querySelector("#corsoDestinatariWrap");
  const listaDestinatari = document.querySelector("#corsoDestinatari");
  if (Array.isArray(corso.destinatari) && corso.destinatari.length > 0) {
    let htmlDestinatari = "";
    corso.destinatari.forEach(function (destinatario) {
      htmlDestinatari += `<li>${destinatario}</li>`;
    });
    listaDestinatari.innerHTML = htmlDestinatari;
  } else {
    boxDestinatari.style.display = "none";
  }

  // Prossime sessioni (se presenti nel JSON)
  const boxSessioni = document.querySelector("#corsoSessioniWrap");
  const contenitoreSessioni = document.querySelector("#corsoSessioni");
  if (Array.isArray(corso.sessioni_prossime) && corso.sessioni_prossime.length > 0) {
    let htmlSessioni = "";
    corso.sessioni_prossime.forEach(function (sessione) {
      htmlSessioni += `<span class="chip" style="border-color:${colore};color:${colore};">${sessione}</span>`;
    });
    contenitoreSessioni.innerHTML = htmlSessioni;
  } else {
    boxSessioni.style.display = "none";
  }

  // Pulsante "Richiedi informazioni" con link esterno
  document.querySelector("#corsoLinkEsterno").href = corso.url || "#";

  // Titolo della scheda del browser
  document.title = corso.titolo + " - Dinamiche Verticali Formazione";
}
