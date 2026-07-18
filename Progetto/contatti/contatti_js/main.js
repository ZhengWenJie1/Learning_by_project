// ==========================================================
// MAIN.JS
// Ultimo file caricato: scarica il JSON con i dati e chiama
// le funzioni che riempiono navbar, scheda contatti e social
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
    mostraContattiInfo(dati);
    mostraSocialContatti(dati);
  })
  .catch(function (errore) {
    console.error("Errore nel caricamento dei dati:", errore.message);
  });
