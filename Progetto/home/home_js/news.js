// ==========================================================
// NEWS.JS
// Disegna la griglia "News e aggiornamenti" nella home,
// usando alcune notizie di esempio scritte qui sotto
// ==========================================================

function mostraNews(dati) {
  const griglia = document.querySelector("#newsGrid");
  if (!griglia) return;

  const portale = (dati.contatti && dati.contatti.news_portal) || "#";
  const immagini = (dati.immagini_tutte && dati.immagini_tutte.carosello_home) || [];

  const newsDiEsempio = [
    { titolo: "Nuove sessioni corsi PTI 2026", data: "10 Lug 2026", tempoLettura: "3 min" },
    { titolo: "Aggiornamento normativa DPI anticaduta", data: "02 Lug 2026", tempoLettura: "4 min" },
    { titolo: "IRATA: date esame Torino", data: "24 Giu 2026", tempoLettura: "2 min" },
    { titolo: "Corso GWO BST: cosa aspettarsi", data: "15 Giu 2026", tempoLettura: "5 min" }
  ];

  let htmlGriglia = "";
  newsDiEsempio.forEach(function (news, indice) {
    const immagine = immagini.length ? immagini[indice % immagini.length] : "";
    htmlGriglia += `
      <a class="news-card" href="${portale}" target="_blank" rel="noopener">
        <div class="news-img" style="background-image:url('${immagine}');">
          <span class="badge-nuovo">News</span>
        </div>
        <div class="news-body">
          <div class="news-title">${news.titolo}</div>
          <div class="news-meta"><span>📅 ${news.data}</span><span>⏱ ${news.tempoLettura}</span></div>
          <span class="news-link">Leggi &rarr;</span>
        </div>
      </a>
    `;
  });
  griglia.innerHTML = htmlGriglia;
}
