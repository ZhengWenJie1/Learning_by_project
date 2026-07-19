// ==========================================================
// CORSO-SIDEBAR.JS
// Riempie il box laterale con durata, orario, quota, ecc.
// ==========================================================

function mostraSidebarCorso(corso) {
  const infoDaMostrare = [
    { etichetta: "Durata", valore: corso.durata },
    { etichetta: "Orario", valore: corso.orario },
    { etichetta: "Quota di iscrizione", valore: corso.quota_iscrizione },
    { etichetta: "Validità attestato", valore: corso.validita_attestato },
    { etichetta: "Prerequisiti", valore: corso.prerequisiti },
    { etichetta: "Sede", valore: "Torino - Via G. Battista Feroggio, 54" }
  ];

  // .forEach(...) esegue la funzione per OGNI riga da mostrare
  let html = "";
  infoDaMostrare.forEach(function (info) {
    if (info.valore) {
      html += `
        <div class="info-riga">
          <span class="info-label">${info.etichetta}</span>
          <span class="info-valore">${info.valore}</span>
        </div>
      `;
    }
  });
  document.querySelector("#sidebarInfo").innerHTML = html;
}
