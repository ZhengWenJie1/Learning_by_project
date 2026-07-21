// ==========================================================
// SOCIAL.JS
// Disegna i link ai social e i video incorporati nella
// sezione "Social" della home
// ==========================================================

function mostraSocial(social) {
  social = social || {};

  const riga = document.querySelector("#socialRow");
  if (riga) {
    const reteSociali = [
      { chiave: "facebook", etichetta: "Facebook", icona: "./image/icons/facebook.png" },
      { chiave: "instagram", etichetta: "Instagram", icona: "./image/icons/instagram.png" },
      { chiave: "linkedin", etichetta: "LinkedIn", icona: "./image/icons/linkedin.png" },
      { chiave: "youtube", etichetta: "YouTube", icona: "./image/icons/youtube.png" }
    ];

    let htmlRiga = "";
    reteSociali.forEach(function (rete) {
      const url = social[rete.chiave];
      if (url) {
        htmlRiga += `
          <a href="${url}" target="_blank" rel="noopener">
            <span class="icon"><img src="${rete.icona}" alt="${rete.etichetta}" loading="lazy" decoding="async"></span> ${rete.etichetta}
          </a>
        `;
      }
    });
    riga.innerHTML = htmlRiga;
  }

  const rigaVideo = document.querySelector("#socialVideoRow");
  if (rigaVideo && DATI && DATI.video) {
    // Prima .filter() tiene solo i video di YouTube "senza cookie",
    // poi .slice(0, 2) prende solo i primi 2 dal risultato.
    // Possiamo "incatenare" più metodi array uno dopo l'altro così.
    const videoDaMostrare = DATI.video
      .filter(function (video) {
        return video.url.includes("youtube-nocookie");
      })
      .slice(0, 2);

    let htmlVideo = "";
    videoDaMostrare.forEach(function (video) {
      htmlVideo += `
        <div class="social-video">
          <iframe src="${video.url}" title="${video.titolo}" frameborder="0" allowfullscreen loading="lazy"></iframe>
        </div>
      `;
    });
    rigaVideo.innerHTML = htmlVideo;
  }
}
