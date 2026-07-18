// ==========================================================
// MAIN.JS
// Ultimo file caricato: scarica il JSON con i dati e chiama
// le funzioni che riempiono navbar, contenuto principale e
// sidebar
// ==========================================================

const JSON_PATH = "../data/dvformazione_data.json";

fetch(JSON_PATH)
  .then(function (risposta) {
    if (!risposta.ok) {
      throw new Error("Impossibile scaricare " + JSON_PATH);
    }
    return risposta.json();
  })
  .then(function (dati) {
    mostraLogo(dati.sito);
    mostraNewsPrincipale(dati);
    mostraSidebar(dati);
  })
  .catch(function (errore) {
    console.error("Errore nel caricamento dei dati:", errore.message);
  });
