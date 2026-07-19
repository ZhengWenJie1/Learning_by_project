// ==========================================================
// ENTE-BANNER.JS
// Legge la sigla dell'ente scritta nell'indirizzo della pagina
// (es. ente.html?sigla=IRATA) e disegna il banner in cima
// ==========================================================

// I nomi nel JSON sono scritti come "SIGLA - Nome esteso"
// (es. "IRATA - Industrial Rope Access Trade Association").
// Questa funzione prende solo la sigla, cioè la parte prima del "-".
function sigla(nomeCompleto) {
  return nomeCompleto.split(" - ")[0];
}

// Cerca l'ente giusto nell'elenco "certificazioni", in base alla
// sigla scritta nell'indirizzo della pagina
function trovaEnteCorrente(dati) {
  const parametri = new URLSearchParams(window.location.search);
  const siglaCercata = parametri.get("sigla");

  const certificazioni = dati.certificazioni || [];
  const ente = certificazioni.find(function (c) {
    return sigla(c.nome) === siglaCercata;
  });

  return ente || certificazioni[0];
}

// Disegna il banner in cima alla pagina, con foto di sfondo
function mostraBannerEnte(ente, dati) {
  const banner = document.querySelector("#banner");
  const immagini = (dati.immagini_tutte && dati.immagini_tutte.carosello_home) || [];
  if (immagini.length > 0) {
    banner.style.backgroundImage = `url('${immagini[0]}')`;
  }

  const parti = ente.nome.split(" - ");

  document.querySelector("#bannerBriciole").textContent = "Enti certificati";
  document.querySelector("#bannerTitolo").textContent = "Certificazione " + parti[0];
  document.querySelector("#bannerSottotitolo").textContent = parti[1] || "";

  document.title = ente.nome + " - Dinamiche Verticali Formazione";
}
