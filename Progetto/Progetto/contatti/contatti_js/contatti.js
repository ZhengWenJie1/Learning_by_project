// ==========================================================
// PAGINA CONTATTI
// Qui carichiamo il file JSON con tutti i dati dell'azienda
// e li mostriamo nella pagina contatti.html
// ==========================================================

// Percorso del file JSON con i dati (è dentro la cartella "data")
var JSON_PATH = "../data/dvformazione_data.json";

// 1) Scarichiamo il file JSON con fetch
// 2) Controlliamo che la risposta sia andata a buon fine
// 3) Trasformiamo la risposta in un oggetto JavaScript con .json()
// 4) Usiamo i dati per riempire la pagina
fetch(JSON_PATH)
  .then(function (risposta) {
    if (!risposta.ok) {
      throw new Error("Impossibile scaricare " + JSON_PATH);
    }
    return risposta.json();
  })
  .then(function (dati) {
    mostraLogo(dati.sito);
    mostraContatti(dati);
  })
  .catch(function (errore) {
    console.error("Errore nel caricamento dei dati:", errore.message);
  });

// ---- LOGO nell'header ----
// Se nel JSON è presente un logo, lo mostriamo al posto del testo
function mostraLogo(sito) {
  if (!sito) return;

  var immagineLogo = document.querySelector("#logoImg");
  var testoLogo = document.querySelector("#logoTesto");

  if (sito.logo && immagineLogo) {
    immagineLogo.src = sito.logo;
    immagineLogo.alt = sito.nome || "Logo";
    immagineLogo.style.display = "block";
    if (testoLogo) {
      testoLogo.style.display = "none";
    }
  }
}

// ---- Contenuto della pagina Contatti ----
function mostraContatti(dati) {
  // Se nel JSON non c'è la sezione "contatti", usiamo un oggetto vuoto
  var contatti = dati.contatti || {};

  // Sottotitolo del banner in alto
  var sottotitolo = document.querySelector("#bannerSub");
  sottotitolo.textContent =
    "Scrivici o chiamaci per informazioni sui corsi, le certificazioni e le prossime sessioni disponibili.";

  // Indirizzo e link alla mappa
  if (contatti.indirizzo) {
    var indirizzo = contatti.indirizzo;
    var testoIndirizzo =
      indirizzo.via + ", " + indirizzo.cap + " " + indirizzo.citta +
      " (" + indirizzo.regione + "), " + indirizzo.paese;

    document.querySelector("#cIndirizzo").textContent = testoIndirizzo;

    var linkMappa = document.querySelector("#mappaLink");
    if (linkMappa && indirizzo.mappa) {
      linkMappa.href = indirizzo.mappa;
    }
  }

  // Telefono, email e orari
  document.querySelector("#cTelefono").textContent = contatti.telefono || "";
  document.querySelector("#cEmail").textContent = contatti.email || "";
  document.querySelector("#cOrari").textContent = contatti.orari_telefono || "";

  // Elenco puntato con le note sulla posizione (se presente)
  var listaNote = document.querySelector("#cNote");
  if (Array.isArray(contatti.note_posizione)) {
    var htmlNote = "";
    contatti.note_posizione.forEach(function (nota) {
      htmlNote += "<li>" + nota + "</li>";
    });
    listaNote.innerHTML = htmlNote;
  }

  // Scheda del referente (foto, nome e ruolo)
  var boxReferente = document.querySelector("#cReferente");
  if (contatti.referente) {
    var referente = contatti.referente;
    boxReferente.innerHTML =
      '<img src="' + (referente.foto || "") + '" alt="' + referente.nome + '">' +
      "<div><strong>" + referente.nome + "</strong><span>" + referente.ruolo + "</span></div>";
  }

  // Link ai social, solo per quelli presenti nel JSON
  var social = contatti.social || {};
  var reteSociali = [
    { chiave: "facebook", etichetta: "Facebook" },
    { chiave: "instagram", etichetta: "Instagram" },
    { chiave: "linkedin", etichetta: "LinkedIn" },
    { chiave: "youtube", etichetta: "YouTube" }
  ];

  var htmlSocial = "";
  reteSociali.forEach(function (rete) {
    var url = social[rete.chiave];
    if (url) {
      htmlSocial += '<a href="' + url + '" target="_blank" rel="noopener">' + rete.etichetta + "</a>";
    }
  });
  document.querySelector("#cSocial").innerHTML = htmlSocial;
}
