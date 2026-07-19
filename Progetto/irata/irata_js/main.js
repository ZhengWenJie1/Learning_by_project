// ==========================================================
// MAIN.JS
// In questa pagina il contenuto (testi, foto, formatori...) è
// già scritto a mano dentro irata.html, perché non cambia mai.
// Scarichiamo il JSON solo per riempire il logo e il footer,
// che sono UGUALI in tutte le pagine del sito.
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
    mostraFooter(dati);
  })
  .catch(function (errore) {
    console.error("Errore nel caricamento dei dati:", errore.message);
  });
