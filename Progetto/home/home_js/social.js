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
      { chiave: "facebook", etichetta: "Facebook", icona: "📘" },
      { chiave: "instagram", etichetta: "Instagram", icona: "📷" },
      { chiave: "linkedin", etichetta: "LinkedIn", icona: "💼" },
      { chiave: "youtube", etichetta: "YouTube", icona: "▶️" }
    ];

    let htmlRiga = "";
    reteSociali.forEach(function (rete) {
      const url = social[rete.chiave];
      if (url) {
        htmlRiga += `
          <a href="${url}" target="_blank" rel="noopener">
            <span class="icon">${rete.icona}</span> ${rete.etichetta}
          </a>
        `;
      }
    });
    riga.innerHTML = htmlRiga;
  }

  const rigaVideo = document.querySelector("#socialVideoRow");
  if (rigaVideo && DATI && DATI.video) {
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
