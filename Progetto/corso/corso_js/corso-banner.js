// ==========================================================
// CORSO-BANNER.JS
// Legge l'id del corso scritto nell'indirizzo della pagina
// (es. corso.html?id=xxx) e disegna il banner in cima
// ==========================================================

// Cerca il corso giusto nell'elenco, in base all'id nell'indirizzo.
//
// window.location.search è la parte dell'indirizzo dopo il "?"
// (es. "?id=abc"). URLSearchParams la trasforma in un oggetto comodo
// da leggere con .get("id").
//
// dati.corsi.find(...) restituisce il PRIMO elemento dell'array per
// cui la funzione dà true (qui: il corso con quell'id).
function trovaCorsoCorrente(dati) {
  const parametri = new URLSearchParams(window.location.search);
  const idCorso = parametri.get("id");

  const corso = dati.corsi.find(function (c) {
    return c.id === idCorso;
  });

  return corso || dati.corsi[0];
}

// Disegna il banner in cima alla pagina, con foto di sfondo
function mostraBannerCorso(corso) {
  const banner = document.querySelector("#banner");
  const immagine = (corso.immagini && corso.immagini[0]) || "";
  if (immagine) {
    banner.style.backgroundImage = `url('${immagine}')`;
  }

  document.querySelector("#bannerBriciole").textContent = "Corsi / " + corso.categoria;
  document.querySelector("#bannerTitolo").textContent = corso.titolo;
  document.querySelector("#bannerSottotitolo").textContent = corso.durata || "";

  document.title = corso.titolo + " - Dinamiche Verticali Formazione";
}
