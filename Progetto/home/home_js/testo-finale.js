// ==========================================================
// TESTO-FINALE.JS
// Riempie il testo di benvenuto scritto dal Direttore Tecnico,
// alla fine della home. Il testo è fisso (il sito non lo tiene
// ancora nel JSON): l'unica parte "dinamica" è la firma, che
// prendiamo da dati.direttore_tecnico
// ==========================================================

function mostraTestoFinale(dati) {
  const direttore = dati.direttore_tecnico || {};

  document.querySelector("#testoFinaleTitolo").textContent =
    "Dinamiche Verticali Formazione PTI Italy";

  document.querySelector("#testoFinale1").textContent =
    "L'unico ed esclusivo Petzl Technical Institute (PTI). " +
    "Attivo sul territorio nazionale, è abilitato e certificato per la distribuzione dei moduli " +
    "\"Petzl Solution\", il centro partecipa attivamente allo sviluppo dei moduli ed è responsabile, " +
    "per la propria area di competenza, dello sviluppo, gestione e supporto della rete di partner " +
    "tecnici definiti \"Petzl Technical Partners\".";

  document.querySelector("#testoFinale2").textContent =
    "La formazione teorico-pratica della nostra rete vendita nazionale è il core-business del PTI Italia. " +
    "L'obiettivo finale è rendere la nostra rete vendita un interlocutore qualificato, che fornisca " +
    "risposte pertinenti e consulenze tecniche funzionali per soddisfare i differenti esigenze dei " +
    "nostri utilizzatori finali.";

  document.querySelector("#testoFinale3").textContent = "Mettiamo a disposizione dei nostri Rivenditori:";

  // Prima lista: i corsi per i rivenditori
  const corsiRivenditori = [
    "corsi di approfondimento per la conoscenza di normative, tecniche di lavoro in quota e conoscenza della gamma anticaduta professionale Petzl.",
    "corsi specifici per utilizzatori finali, erogati in funzione dell'acquisto di prodotti quali: Exo, Lezard, Jag Rescue kit, etc...",
    "formazione teorico pratica all'ispezione periodica dei DPI di III categoria, unitamente ai relativi aggiornamenti."
  ];
  let htmlLista1 = "";
  corsiRivenditori.forEach(function (voce) {
    htmlLista1 += `<li>${voce}</li>`;
  });
  document.querySelector("#testoFinaleLista1").innerHTML = htmlLista1;

  document.querySelector("#testoFinale4").textContent =
    "Ma Dinamiche Verticali Formazione srl è anche un centro di formazione certificato IRATA, GWO, " +
    "che vanta la collaborazione con docenti altamente qualificati e formati per erogare le " +
    "formazioni specifiche per:";

  // Seconda lista: le specializzazioni del centro
  const specializzazioni = ["Lavori in altezza", "Spazi confinati", "Soccorso", "Formazione IRATA", "Formazione GWO"];
  let htmlLista2 = "";
  specializzazioni.forEach(function (voce) {
    htmlLista2 += `<li>${voce}</li>`;
  });
  document.querySelector("#testoFinaleLista2").innerHTML = htmlLista2;

  document.querySelector("#testoFinale5").textContent =
    "Vi aspettiamo nel nostro centro per condividere la nostra passione per il lavoro in quota e la formazione.";

  // Firma: nome e ruolo del direttore tecnico, presi dal JSON
  document.querySelector("#firmaNome").textContent = direttore.nome || "";
  document.querySelector("#firmaRuolo").textContent = direttore.ruolo || "";
}
