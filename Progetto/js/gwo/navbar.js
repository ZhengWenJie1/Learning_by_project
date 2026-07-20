// ==========================================================
// NAVBAR.JS
// Mostra il logo dell'azienda nell'intestazione, se presente
// nel JSON (uguale in tutte le pagine del sito)
// ==========================================================

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
