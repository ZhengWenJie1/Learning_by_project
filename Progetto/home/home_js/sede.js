// ==========================================================
// SEDE.JS
// Disegna il sottotitolo, la galleria foto e le recensioni
// nella sezione scura "La nostra sede"
// ==========================================================

function mostraSede(dati) {
  const sottotitolo = document.querySelector("#sedeSub");
  if (sottotitolo) {
    const citta = (dati.contatti && dati.contatti.indirizzo) ? dati.contatti.indirizzo.citta : "Torino";
    sottotitolo.textContent =
      `Un centro di formazione attrezzato a ${citta}, con strutture dedicate all'addestramento pratico su fune, in quota e negli spazi confinati.`;
  }

  const galleria = document.querySelector("#sedeGallery");
  if (galleria) {
    const immaginiSede = ((dati.immagini_tutte && dati.immagini_tutte.carosello_home) || []).slice(0, 3);
    let htmlGalleria = "";
    immaginiSede.forEach(function (immagine) {
      htmlGalleria += `<div class="g-item"><img src="${immagine}" alt="Sede Dinamiche Verticali"></div>`;
    });
    galleria.innerHTML = htmlGalleria;
  }

  const boxRecensioni = document.querySelector("#recensioniGrid2");
  if (boxRecensioni) {
    const recensioni = dati.recensioni_home || [];
    let htmlRecensioni = "";
    recensioni.forEach(function (recensione) {
      htmlRecensioni += `
        <div class="recensione-card">
          <img src="${recensione.immagine || ""}" alt="${recensione.autore}">
          <div>
            <p>&ldquo;${recensione.testo}&rdquo;</p>
            <div class="autore">${recensione.autore}</div>
          </div>
        </div>
      `;
    });
    boxRecensioni.innerHTML = htmlRecensioni;
  }
}
