// ==========================================================
// MAIN.JS
// Ultimo file caricato: scarica il JSON con i dati e chiama
// le funzioni che riempiono navbar, banner ed elenco enti
// ==========================================================

const JSON_PATH = "../data/dvformazione_data.json";

// fetch scarica il file JSON. Restituisce una "promessa" (Promise):
// il risultato non è pronto subito, quindi con .then(...) diciamo
// cosa fare QUANDO arriva, e con .catch(...) cosa fare in caso di errore.
fetch(JSON_PATH)
  .then(function (risposta) {
    if (!risposta.ok) {
      throw new Error("Impossibile scaricare " + JSON_PATH);
    }
    return risposta.json();
  })
  .then(function (dati) {
    mostraLogo(dati.sito);
    mostraBannerSfondo(dati);
    mostraEnti(dati);
    mostraFooter(dati);
  })
  .catch(function (errore) {
    console.error("Errore nel caricamento dei dati:", errore.message);
  });

// Mette una foto del carosello come sfondo del banner in cima alla pagina
function mostraBannerSfondo(dati) {
  const banner = document.querySelector("#banner");
  const immagini = (dati.immagini_tutte && dati.immagini_tutte.carosello_home) || [];
  if (banner && immagini.length > 0) {
    banner.style.backgroundImage = `url('${immagini[0]}')`;
  }
}
