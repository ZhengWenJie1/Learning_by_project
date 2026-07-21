// ==========================================================
// NEWS.JS
// Disegna la griglia "News e aggiornamenti" nella home.
//
// Il sito non ha un vero elenco di articoli nel file JSON,
// quindi "trasformiamo" in news i corsi in arrivo: prendiamo
// i 4 corsi con la sessione più vicina e li mostriamo come se
// fossero degli articoli (titolo, immagine, categoria, data).
// ==========================================================

// Legge la prima data dentro "sessioni_prossime" (es. "31/08/2026")
// e la trasforma in un vero oggetto Date, così possiamo confrontare
// le date tra loro e capire qual è la più vicina.
// Se il corso non ha sessioni in programma, restituiamo null.
function primaSessioneComeData(corso) {
  const sessioni = corso.sessioni_prossime;
  if (!sessioni || sessioni.length === 0) return null;

  // "31/08/2026".split("/") diventa l'array ["31", "08", "2026"]
  const parti = sessioni[0].split("/");
  const giorno = Number(parti[0]);
  const mese = Number(parti[1]);
  const anno = Number(parti[2]);

  // Attenzione: in JavaScript i mesi di Date vanno da 0 (Gennaio)
  // a 11 (Dicembre), quindi togliamo 1 al mese
  return new Date(anno, mese - 1, giorno);
}

// Trasforma la stessa data (es. "31/08/2026") in un testo leggibile,
// tipo "31 Agosto 2026". Usa l'array MESI definito in stato.js.
function formattaData(dataTesto) {
  const parti = dataTesto.split("/");
  const giorno = Number(parti[0]);
  const mese = Number(parti[1]);
  const anno = parti[2];
  return `${giorno} ${MESI[mese - 1]} ${anno}`;
}

// Accorcia una descrizione troppo lunga, aggiungendo "..." alla fine.
// Cerchiamo l'ultimo spazio prima del limite, così non tagliamo una
// parola a metà.
function accorciaTesto(testo, lunghezzaMassima) {
  if (testo.length <= lunghezzaMassima) return testo;

  const troncato = testo.slice(0, lunghezzaMassima);
  const ultimoSpazio = troncato.lastIndexOf(" ");
  return troncato.slice(0, ultimoSpazio) + "...";
}

// Stima quanti minuti serve per leggere una descrizione, contando
// le parole e dividendole per una velocità media di lettura
// (circa 200 parole al minuto). Math.ceil arrotonda sempre per
// eccesso, così anche un testo breve segna almeno 1 minuto.
function minutiDiLettura(testo) {
  const numeroParole = testo.split(" ").length;
  return Math.max(1, Math.ceil(numeroParole / 200));
}

function mostraNews(dati) {
  const griglia = document.querySelector("#newsGrid");
  if (!griglia) return;

  const corsi = dati.corsi || [];

  // Prendiamo solo i corsi che hanno almeno una sessione in
  // programma, poi li ordiniamo dal più vicino al più lontano nel
  // tempo. .sort() confronta due corsi alla volta: se il numero
  // restituito è negativo il primo va prima, se è positivo va dopo.
  const corsiConSessione = corsi.filter(function (corso) {
    return primaSessioneComeData(corso) !== null;
  });

  corsiConSessione.sort(function (corsoA, corsoB) {
    return primaSessioneComeData(corsoA) - primaSessioneComeData(corsoB);
  });

  // Come "news" mostriamo solo i primi 4 corsi in arrivo
  const corsiInEvidenza = corsiConSessione.slice(0, 4);

  let htmlGriglia = "";
  corsiInEvidenza.forEach(function (corso) {
    const infoCategoria = categoriaInfo(corso.categoria);
    const immagine = (corso.immagini && corso.immagini[0]) || "";
    const descrizione = accorciaTesto(corso.descrizione || "", 140);
    const dataSessione = formattaData(corso.sessioni_prossime[0]);
    const minuti = minutiDiLettura(corso.descrizione || "");

    // Sopra l'immagine del corso mettiamo una sfumatura scura,
    // così il titolo scritto in bianco resta sempre leggibile
    const stileImmagine =
      `background-image: linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,.75) 100%), url('${immagine}');` +
      "background-size: cover; background-position: center;";

    htmlGriglia += `
      <a class="news-card" href="page/corso.html?id=${corso.id}">
        <div class="news-img" style="${stileImmagine}">
          <span class="news-badge" style="background:${infoCategoria.colore};">${infoCategoria.nome}</span>
          <h3 class="news-title">${corso.titolo}</h3>
        </div>
        <div class="news-body">
          <p class="news-desc">${descrizione}</p>
          <div class="news-meta">
            <span><img src="./image/icons/calendar.png" class="icon-inline" alt="" loading="lazy" decoding="async">${dataSessione}</span>
            <span><img src="./image/icons/clock.png" class="icon-inline" alt="" loading="lazy" decoding="async">${minuti} minuti</span>
          </div>
          <span class="news-btn">Leggi</span>
        </div>
      </a>
    `;
  });

  griglia.innerHTML = htmlGriglia;
}
