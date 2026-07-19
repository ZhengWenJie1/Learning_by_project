// ==========================================================
// MAIN.JS
// Questo file deve essere l'ULTIMO caricato: scarica il file
// JSON con i dati del centro corsi e, quando è pronto, chiama
// in ordine tutte le funzioni che riempiono la pagina
// (quelle funzioni sono definite negli altri file JS)
// ==========================================================

// fetch(JSON_PATH) chiede al browser di scaricare il file JSON.
// Il download richiede un po' di tempo, quindi fetch restituisce
// subito una "promessa" (Promise): un oggetto che dice "il risultato
// arriverà più avanti". Con .then(...) diciamo cosa fare QUANDO il
// risultato arriva; con .catch(...) cosa fare se qualcosa va storto.
fetch(JSON_PATH)
  .then(function (risposta) {
    if (!risposta.ok) {
      throw new Error("Impossibile scaricare " + JSON_PATH);
    }
    // risposta.json() legge il testo scaricato e lo trasforma in un
    // oggetto JavaScript: anche questo richiede tempo, quindi
    // restituisce a sua volta una Promise
    return risposta.json();
  })
  .then(function (dati) {
    DATI = dati;
    init(dati);
  })
  .catch(function (errore) {
    console.error("Errore nel caricamento dei dati:", errore.message);
  });

// Punto di partenza: chiama, in ordine, tutte le funzioni che
// riempiono la pagina
function init(dati) {
  mostraLogo(dati.sito);
  mostraInizio(dati);
  mostraLoghiPartner(dati);
  mostraFiltriCorsi(dati.corsi);
  mostraGrigliaCorsi(dati.corsi);
  mostraChiSiamo(dati);
  mostraNews(dati);
  mostraSocial(dati.contatti ? dati.contatti.social : {});
  mostraSede(dati);
  mostraFooter(dati);

  costruisciEventiCalendario(dati.corsi);
  mostraFiltriCalendario(dati.corsi);
  calMese = primoGiornoDelMese(new Date());
  mostraCalendario();

  attivaRicercaNavbar();
  attivaSchedeVista();
}
