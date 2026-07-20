// ==========================================================
// ENTE-SIDEBAR.JS
// Riempie il box laterale "Contatti" con una foto e i pulsanti
// per scrivere al centro o vedere il sito ufficiale dell'ente
// ==========================================================

function mostraSidebarEnte(ente, dati) {
  const immagini = (dati.immagini_tutte && dati.immagini_tutte.carosello_home) || [];
  const foto = immagini.length > 1 ? immagini[1] : immagini[0];

  document.querySelector("#sidebarFoto").src = foto || "";
  document.querySelector("#sidebarFoto").alt = ente.nome;

  const linkSito = document.querySelector("#sidebarLinkSito");
  if (ente.pagina) {
    linkSito.href = ente.pagina;
  } else {
    linkSito.style.display = "none";
  }
}
