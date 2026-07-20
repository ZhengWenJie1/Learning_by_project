// ==========================================================
// ENTI.JS
// Disegna la lista degli enti certificati. Per ogni ente c'è:
// un logo, il nome, un elenco puntato dei corsi collegati e un
// pulsante "Maggiori informazioni".
//
// L'elenco è scritto qui sotto a mano (array di oggetti), perché
// il testo mostrato sulla pagina "Corsi" è un riassunto pensato
// apposta per questa pagina e non i testi lunghi del JSON.
// ==========================================================

const listaEnti = [
  {
    logo: "https://www.dvformazione.it/img/logo-dinamiche-verticali-formazione.svg",
    nome: "Dinamiche Verticali Formazione",
    corsi: [
      "FORMAZIONE ED ADDESTRAMENTO AI SISTEMI DI ACCESSO E SALVATAGGIO IN SPAZI CONFINATI",
      "Formazione Formatori e Istruttori DPI Anticaduta",
      "Fune",
      "Aggiornamento lavoratori addetti ai sistemi di accesso e posizionamento mediante funi",
      "Preposti con funzioni di sorveglianza dei lavori temporanei in quota mediante funi"
    ],
    link: "../index.html#corsi"
  },
  {
    logo: "https://www.dvformazione.it/img/loghi/logo-irata-international.jpg",
    nome: "IRATA",
    corsi: [
      { testo: "Certificazione IRATA L1-L2-L3", link: "corso.html?id=irata-l1-l2-l3" }
    ],
    link: "irata.html"
  },
  {
    logo: "https://www.dvformazione.it/img/loghi/logo-petzl-technical-institute.jpg",
    nome: "PTI",
    corsi: [
      { testo: "Aggiornamento Revisioni Periodiche DPI Petzl", link: "corso.html?id=pti-aggiornamento-revisioni" },
      { testo: "Revisioni Periodiche DPI Petzl", link: "corso.html?id=pti-revisioni-periodiche" },
      { testo: "Modulo rivenditori PRO L1-L2-L3", link: "corso.html?id=pti-rivenditori-pro-1" }
    ],
    link: "ente.html?sigla=PTI"
  },
  {
    logo: "https://www.dvformazione.it/img/loghi/logo-global-wind-organisation.jpg",
    nome: "GWO",
    corsi: [
      { testo: "GWO BST (FA+WAH+MH+FAW)", link: "corso.html?id=gwo-bst" }
    ],
    link: "gwo.html"
  },
  {
    logo: "../image/logo-itra.svg",
    nome: "ITRA",
    corsi: [
      { testo: "ITRA - Soccorso Tecnico", link: "ente.html?sigla=ITRA" }
    ],
    link: "ente.html?sigla=ITRA"
  }
];

// Crea l'HTML dell'elenco puntato di UNA card. Se una voce è una
// semplice stringa la scrive come testo, se invece è un oggetto
// {testo, link} la scrive come link cliccabile
function creaElencoCorsi(corsi) {
  let html = "";
  corsi.forEach(function (corso) {
    if (typeof corso === "string") {
      html += `<li>${corso}</li>`;
    } else {
      html += `<li><a href="${corso.link}">${corso.testo}</a></li>`;
    }
  });
  return html;
}

// Crea l'HTML di UNA card ente, a partire da logo, nome, elenco
// corsi e link del pulsante
function creaCardEnte(ente) {
  return `
    <div class="ente-card">
      <div class="ente-logo">
        <img src="${ente.logo}" alt="${ente.nome}">
      </div>
      <div class="ente-testo">
        <h2>${ente.nome}</h2>
        <ul class="ente-corsi">
          ${creaElencoCorsi(ente.corsi)}
        </ul>
        <a href="${ente.link}" class="ente-btn">Maggiori informazioni <span class="freccia">&rarr;</span></a>
      </div>
    </div>
  `;
}

function mostraEnti() {
  const contenitore = document.querySelector("#entiLista");
  if (!contenitore) return;

  let htmlLista = "";
  listaEnti.forEach(function (ente) {
    htmlLista += creaCardEnte(ente);
  });

  contenitore.innerHTML = htmlLista;
}
