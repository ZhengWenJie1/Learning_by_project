// ==========================================================
// FOOTER.JS
// Disegna il piè di pagina: logo, indirizzo, enti certificatori,
// social, copyright/P.IVA e box contatti
// ==========================================================

function mostraFooter(dati) {
  const contatti = dati.contatti || {};

  // Indirizzo sotto al logo
  const boxIndirizzo = document.querySelector("#footerIndirizzo");
  if (boxIndirizzo && contatti.indirizzo) {
    boxIndirizzo.textContent =
      `${contatti.indirizzo.via}, ${contatti.indirizzo.cap} ${contatti.indirizzo.citta}`;
  }

  // Colonna "Enti certificatori e formativi": lista fissa di link
  const boxEnti = document.querySelector("#footerEnti");
  if (boxEnti) {
    const enti = ["IRATA", "GWO", "PETZL", "ITRA"];
    let htmlEnti = "";
    enti.forEach(function (ente) {
      htmlEnti += `<a href="#">${ente}</a>`;
    });
    boxEnti.innerHTML = htmlEnti;
  }

  // Icone social, colorate come i loghi originali
  const footerSocial = document.querySelector("#footerSocial");
  if (footerSocial && contatti.social) {
    const social = contatti.social;
    const voci = [
      { url: social.linkedin, icona: "../image/icons/linkedin.png", etichetta: "LinkedIn" },
      { url: social.instagram, icona: "../image/icons/instagram.png", etichetta: "Instagram" },
      { url: social.facebook, icona: "../image/icons/facebook.png", etichetta: "Facebook" },
      { url: social.youtube, icona: "../image/icons/youtube.png", etichetta: "YouTube" }
    ];

    let htmlSocial = "";
    voci.forEach(function (voce) {
      if (voce.url) {
        htmlSocial += `<a href="${voce.url}" target="_blank" rel="noopener"><img src="${voce.icona}" alt="${voce.etichetta}"></a>`;
      }
    });
    footerSocial.innerHTML = htmlSocial;
  }

  // Copyright e P.IVA (testo fisso, come nel resto del footer)
  document.querySelector("#footerCopy").textContent = "© 2026 © Dinamiche Verticali srl";
  document.querySelector("#footerPiva").textContent = "P. IVA 09686830010";

  // Box "Contatti" con telefono, orari ed email
  const boxContatti = document.querySelector("#footerContatti");
  if (boxContatti) {
    boxContatti.innerHTML = `
      <h4>Contatti:</h4>
      <p>${contatti.telefono || ""}</p>
      <p>${contatti.orari_telefono || ""}</p>
      <p>${contatti.email || ""}</p>
    `;
  }
}
