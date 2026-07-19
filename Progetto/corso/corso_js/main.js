// ==========================================================
// MAIN.JS
// Ultimo file caricato: scarica il JSON con i dati e chiama
// in ordine tutte le funzioni che riempiono la pagina
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
    const corso = trovaCorsoCorrente(dati);

    mostraLogo(dati.sito);
    mostraBannerCorso(corso);
    mostraDescrizioneCorso(corso);
    mostraElenco("#corsoObiettiviWrap", "#corsoObiettivi", corso.obiettivi);
    mostraElenco("#corsoDestinatariWrap", "#corsoDestinatari", corso.destinatari);
    mostraCorsoSessioni(corso);
    mostraSidebarCorso(corso);
    mostraFooter(dati);
  })
  .catch(function (errore) {
    console.error("Errore nel caricamento dei dati:", errore.message);
  });
