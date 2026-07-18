// ==========================================================
// NEWS-PRINCIPALE.JS
// Riempie il titolo, la descrizione, il link al portale
// esterno e la griglia di news di esempio
// ==========================================================

function mostraNewsPrincipale(dati) {
  const sito = dati.sito || {};
  const contatti = dati.contatti || {};

  // Titolo e descrizione principali
  document.querySelector("#newsTitolo").textContent = sito.nome || "";
  document.querySelector("#newsDescrizione").textContent = sito.descrizione_breve || "";

  // Link al portale news esterno (se presente)
  const linkEsterno = document.querySelector("#newsLinkEsterno");
  if (contatti.news_portal) {
    linkEsterno.href = contatti.news_portal;
  }

  // Griglia di news di esempio, con le immagini prese dal carosello della home
  const immagini = (dati.immagini_tutte && dati.immagini_tutte.carosello_home) || [];
  const portale = contatti.news_portal || "#";

  const newsDiEsempio = [
    { titolo: "Nuove sessioni corsi PTI 2026", data: "10 Lug 2026" },
    { titolo: "Aggiornamento normativa DPI anticaduta", data: "02 Lug 2026" },
    { titolo: "IRATA: date esame Torino", data: "24 Giu 2026" },
    { titolo: "Corso GWO BST: cosa aspettarsi", data: "15 Giu 2026" }
  ];

  let htmlGriglia = "";
  newsDiEsempio.forEach(function (news, indice) {
    const immagine = immagini.length ? immagini[indice % immagini.length] : "";

    htmlGriglia += `
      <a class="news-card" href="${portale}" target="_blank" rel="noopener">
        <div class="news-img" style="background-image:url('${immagine}');"></div>
        <div class="news-body">
          <div class="news-title">${news.titolo}</div>
          <div class="news-meta">${news.data}</div>
        </div>
      </a>
    `;
  });
  document.querySelector("#newsGrid").innerHTML = htmlGriglia;
}
