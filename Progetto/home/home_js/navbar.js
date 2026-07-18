// ==========================================================
// NAVBAR.JS
// Tutto quello che riguarda l'intestazione della pagina:
// mostrare il logo e far funzionare la ricerca a comparsa
// ==========================================================

// Mostra il logo dell'azienda al posto del testo, se nel JSON
// è presente un'immagine
function mostraLogo(sito) {
  if (!sito) return;

  const immagineLogo = document.querySelector("#logoImg");
  const testoLogo = document.querySelector("#logoTesto");

  if (sito.logo && immagineLogo) {
    immagineLogo.src = sito.logo;
    immagineLogo.alt = sito.nome || "Logo";
    immagineLogo.style.display = "block";
    if (testoLogo) {
      testoLogo.style.display = "none";
    }
  }
}

// Fa comparire/scomparire la casella di ricerca nella navbar e
// collega la ricerca al filtro della griglia corsi
function attivaRicercaNavbar() {
  const bottoneRicerca = document.querySelector("#navSearchBtn");
  const contenitoreRicerca = document.querySelector(".nav-search-wrap");
  const campoRicerca = document.querySelector("#navSearchInput");
  if (!bottoneRicerca || !contenitoreRicerca || !campoRicerca) return;

  // Clic sulla lente: apre/chiude la casella di ricerca
  bottoneRicerca.addEventListener("click", function () {
    contenitoreRicerca.classList.toggle("open");
    if (contenitoreRicerca.classList.contains("open")) {
      campoRicerca.focus();
    }
  });

  // Mentre l'utente scrive, aggiorniamo il testo di ricerca e
  // rifacciamo il disegno della griglia corsi
  campoRicerca.addEventListener("input", function (evento) {
    testoRicerca = evento.target.value.trim().toLowerCase();

    // Teniamo allineato anche il campo di ricerca dentro la sezione corsi
    const campoRicercaPrincipale = document.querySelector("#searchInput");
    if (campoRicercaPrincipale) {
      campoRicercaPrincipale.value = evento.target.value;
    }
    mostraGrigliaCorsi(DATI.corsi);
  });

  // Premendo Invio si scorre fino alla sezione corsi
  campoRicerca.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
      document.querySelector("#corsi").scrollIntoView({ behavior: "smooth" });
    }
  });
}
