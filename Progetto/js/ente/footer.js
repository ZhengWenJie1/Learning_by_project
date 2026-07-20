// ==========================================================
// FOOTER.JS
// Disegna il piè di pagina: logo, P.IVA, colonna contatti e
// icone social
// ==========================================================

function mostraFooter(dati) {
  const azienda = dati.sito || {};
  const contatti = dati.contatti || {};

  const logoImmagine = document.querySelector("#footerLogoImg");
  const logoTesto = document.querySelector("#footerLogoTesto");
  if (azienda.logo && logoImmagine) {
    logoImmagine.src = azienda.logo;
    logoImmagine.alt = azienda.nome || "Logo";
    logoImmagine.style.display = "block";
    if (logoTesto) {
      logoTesto.style.display = "none";
    }
  }

  const partitaIva = document.querySelector("#footerPiva");
  if (partitaIva && azienda.piva) {
    partitaIva.textContent = `P.IVA ${azienda.piva}`;
  }

  const boxContatti = document.querySelector("#footerContatti");
  if (boxContatti) {
    let indirizzoTesto = "";
    if (contatti.indirizzo) {
      indirizzoTesto = `${contatti.indirizzo.via}, ${contatti.indirizzo.cap} ${contatti.indirizzo.citta} (${contatti.indirizzo.regione})`;
    }
    boxContatti.innerHTML = `
      <h4>Contatti</h4>
      <p>${indirizzoTesto}</p>
      <p>${contatti.telefono || ""}</p>
      <p>${contatti.email || ""}</p>
      <p>${contatti.orari_telefono || ""}</p>
    `;
  }

  const footerSocial = document.querySelector("#footerSocial");
  if (footerSocial && contatti.social) {
    const social = contatti.social;
    const voci = [
      { url: social.facebook, icona: "../image/icons/facebook.png", etichetta: "Facebook" },
      { url: social.instagram, icona: "../image/icons/instagram.png", etichetta: "Instagram" },
      { url: social.linkedin, icona: "../image/icons/linkedin.png", etichetta: "LinkedIn" },
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
}
