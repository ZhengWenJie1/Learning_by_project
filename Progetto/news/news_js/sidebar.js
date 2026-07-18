// ==========================================================
// SIDEBAR.JS
// Riempie la barra laterale con l'indirizzo/contatti e i
// link ai social
// ==========================================================

function mostraSidebar(dati) {
  const contatti = dati.contatti || {};

  // Contatti nella barra laterale
  if (contatti.indirizzo) {
    const indirizzo = contatti.indirizzo;
    const htmlContatti =
      `${indirizzo.via}, ${indirizzo.cap} ${indirizzo.citta} (${indirizzo.regione})<br>` +
      `Tel: ${contatti.telefono || ""}<br>` +
      `Email: ${contatti.email || ""}<br>` +
      `Orari: ${contatti.orari_telefono || ""}`;

    document.querySelector("#sidebarContatti").innerHTML = htmlContatti;
  }

  // Link social nella barra laterale
  const social = contatti.social || {};
  const reteSociali = [
    { chiave: "facebook", etichetta: "Facebook" },
    { chiave: "instagram", etichetta: "Instagram" },
    { chiave: "linkedin", etichetta: "LinkedIn" },
    { chiave: "youtube", etichetta: "YouTube" }
  ];

  const linkSocial = [];
  reteSociali.forEach(function (rete) {
    const url = social[rete.chiave];
    if (url) {
      linkSocial.push(`<a href="${url}" target="_blank" rel="noopener">${rete.etichetta}</a>`);
    }
  });
  document.querySelector("#sidebarSocial").innerHTML = linkSocial.join("<br>");
}
