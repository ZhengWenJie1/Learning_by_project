// ==========================================================
// CORSO-CONTENUTO.JS
// Riempie le sezioni di testo della colonna principale:
// descrizione, obiettivi, destinatari e prossime sessioni
// ==========================================================

// Riempie un elenco puntato (<ul>), nascondendo la sezione se è vuota
function mostraElenco(idBlocco, idLista, elementi) {
  const blocco = document.querySelector(idBlocco);
  const lista = document.querySelector(idLista);

  // Array.isArray controlla che "elementi" sia davvero un array
  // (nel JSON quel campo potrebbe anche mancare del tutto)
  if (Array.isArray(elementi) && elementi.length > 0) {
    let html = "";
    elementi.forEach(function (elemento) {
      html += `<li>${elemento}</li>`;
    });
    lista.innerHTML = html;
  } else {
    blocco.style.display = "none";
  }
}

// Riempie la descrizione del corso e la sua immagine
function mostraDescrizioneCorso(corso) {
  document.querySelector("#corsoTitoloSezione").textContent = "Cos'è il corso " + corso.titolo + "?";
  document.querySelector("#corsoDescrizione").textContent = corso.descrizione || "";

  const immagine = document.querySelector("#corsoImg");
  const seconda = ((corso.immagini && corso.immagini[1]) || (corso.immagini && corso.immagini[0]) || "").replace(/^image\//, "../image/");
  if (seconda) {
    immagine.src = seconda;
    immagine.alt = corso.titolo;
  } else {
    document.querySelector("#corsoImgWrap").style.display = "none";
  }
}

// Riempie le "chip" con le prossime sessioni e il pulsante di iscrizione
function mostraCorsoSessioni(corso) {
  const blocco = document.querySelector("#corsoSessioniWrap");
  const contenitore = document.querySelector("#corsoSessioni");

  if (Array.isArray(corso.sessioni_prossime) && corso.sessioni_prossime.length > 0) {
    let html = "";
    corso.sessioni_prossime.forEach(function (sessione) {
      html += `<span class="chip">${sessione}</span>`;
    });
    contenitore.innerHTML = html;
  } else {
    blocco.style.display = "none";
  }

  document.querySelector("#corsoLinkEsterno").href = corso.url || "#";
}
