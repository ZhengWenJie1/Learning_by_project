// ==========================================================
// SOCIAL.JS
// Disegna i link ai social, solo per quelli presenti nel JSON
// ==========================================================

function mostraSocialContatti(dati) {
  const contatti = dati.contatti || {};
  const social = contatti.social || {};

  const reteSociali = [
    { chiave: "facebook", etichetta: "Facebook" },
    { chiave: "instagram", etichetta: "Instagram" },
    { chiave: "linkedin", etichetta: "LinkedIn" },
    { chiave: "youtube", etichetta: "YouTube" }
  ];

  let htmlSocial = "";
  reteSociali.forEach(function (rete) {
    const url = social[rete.chiave];
    if (url) {
      htmlSocial += `<a href="${url}" target="_blank" rel="noopener">${rete.etichetta}</a>`;
    }
  });
  document.querySelector("#cSocial").innerHTML = htmlSocial;
}
