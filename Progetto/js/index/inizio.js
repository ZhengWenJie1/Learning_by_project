// ==========================================================
// INIZIO.JS
// Gestisce il carosello della sezione di apertura: un array
// con le "slide" (immagine, testo e bottoni) e una funzione
// che disegna sullo schermo la slide corrente. Cliccando sulla
// freccia si passa alla slide successiva.
// ==========================================================

// Ogni oggetto dell'array è una slide del carosello.
// Per aggiungerne una nuova basta copiare un oggetto e
// cambiare i valori.
const inizioSlides = [
  {
    immagine: "./image/index_hero.jpg",
    eyebrowContenuto: "",
    eyebrowBottoni: "Novità - calendario 2026",
    titolo: 'Formazione in altezza.<br><span class="inizio-arancio">Certificazioni</span> riconosciute.',
    descrizione: "Corsi IRATA, GWO e DPI erogati da istruttori senior con oltre 15 anni di esperienza operativa. Preparati ai lavori su fune, spazi confinati e turbine eoliche.",
    bottoni: [
      { testo: "Vedi i corsi &rarr;", link: "page/corsi.html", classe: "btn-light" },
      { testo: "Vai al calendario &#128197;", link: "#corsi", classe: "btn-primary" }
    ]
  },
  {
    immagine: "./image/gwo_hero.webp",
    eyebrowContenuto: "Novità",
    eyebrowBottoni: "",
    titolo: '<span class="inizio-arancio">ITRA</span> - Soccorso Tecnico',
    descrizione: "Montaggio e gestione di sistemi di sollevamento, vantaggio meccanico e prestazioni.",
    bottoni: [
      { testo: "Vai al corso &rarr;", link: "page/corsi.html", classe: "btn-light" }
    ]
  },
  {
    immagine: "./image/irata_hero.webp",
    eyebrowContenuto: "Novità",
    eyebrowBottoni: "",
    titolo: '<span class="inizio-arancio">IRATA</span> - Accesso su fune',
    descrizione: "Corsi di livello 1, 2 e 3 per lavorare in sicurezza con tecniche di accesso su corda doppia.",
    bottoni: [
      { testo: "Vai al corso &rarr;", link: "page/corsi.html", classe: "btn-light" }
    ]
  }
];

// Teniamo in questa variabile l'indice della slide che stiamo
// mostrando in questo momento (si parte dalla prima, indice 0)
let inizioIndiceAttuale = 0;

// Disegna sullo schermo la slide che si trova alla posizione
// "indice" dentro l'array inizioSlides
function mostraSlideInizio(indice) {
  const slide = inizioSlides[indice];

  // Cambiamo la foto di sfondo, con sopra lo stesso sfumato scuro
  const hero = document.querySelector("#inizioHero");
  hero.style.backgroundImage =
    "linear-gradient(0deg, rgba(20,15,10,.85) 0%, rgba(20,15,10,.15) 45%, rgba(20,15,10,.35) 100%), url('" +
    slide.immagine + "')";

  // Cambiamo il testo (eyebrow sopra al titolo, titolo, descrizione
  // ed eyebrow sopra ai bottoni)
  document.querySelector("#inizioEyebrow").textContent = slide.eyebrowContenuto;
  document.querySelector("#inizioTitolo").innerHTML = slide.titolo;
  document.querySelector("#inizioDesc").textContent = slide.descrizione;
  document.querySelector("#inizioCtaEyebrow").textContent = slide.eyebrowBottoni;

  // Ricreiamo i bottoni: prima svuotiamo il contenitore, poi
  // aggiungiamo un link <a> per ogni bottone della slide
  const contenitoreBottoni = document.querySelector("#inizioCta");
  contenitoreBottoni.innerHTML = "";

  slide.bottoni.forEach(function (bottone) {
    const link = document.createElement("a");
    link.href = bottone.link;
    link.className = "btn " + bottone.classe;
    link.innerHTML = bottone.testo;
    contenitoreBottoni.appendChild(link);
  });
}

// Quando si clicca sulla freccia, passiamo alla slide successiva.
// Con l'operazione "% inizioSlides.length" torniamo automaticamente
// alla prima slide dopo l'ultima (numero resto della divisione)
document.querySelector("#inizioFreccia").addEventListener("click", function () {
  inizioIndiceAttuale = (inizioIndiceAttuale + 1) % inizioSlides.length;
  mostraSlideInizio(inizioIndiceAttuale);
});

// Appena la pagina si carica, mostriamo subito la prima slide
mostraSlideInizio(inizioIndiceAttuale);
