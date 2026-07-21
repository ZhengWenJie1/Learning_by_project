// ==========================================================
// SEDE.JS
// Disegna il sottotitolo, la galleria foto e le recensioni
// nella sezione scura "La nostra sede"
// ==========================================================

function mostraSede(dati) {
  const sottotitolo = document.querySelector("#sedeSub");
  if (sottotitolo && dati.contatti && dati.contatti.indirizzo) {
    const via = dati.contatti.indirizzo.via;
    const citta = dati.contatti.indirizzo.citta;
    sottotitolo.textContent =
      `La nostra sede è a ${citta}, in ${via}, un centro di formazione progettato per offrire ` +
      `un'esperienza concreta, sicura e altamente professionale. Qui svolgiamo i nostri corsi in ` +
      `ambienti attrezzati e pensati per la formazione pratica, con scenari realistici dedicati ai ` +
      `lavori in quota, agli accessi dall'alto, agli spazi confinati e alle attività di soccorso.`;
  }

  // Solo 2 foto per la galleria: la struttura del centro e il ponteggio
  const galleria = document.querySelector("#sedeGallery");
  if (galleria) {
    const tutteLeImmagini = (dati.immagini_tutte && dati.immagini_tutte.carosello_home) || [];
    const immaginiSede = [tutteLeImmagini[0], tutteLeImmagini[4]];
    let htmlGalleria = "";
    immaginiSede.forEach(function (immagine) {
      if (immagine) {
        htmlGalleria += `<div class="g-item"><img src="${immagine}" alt="Sede Dinamiche Verticali" loading="lazy" decoding="async"></div>`;
      }
    });
    galleria.innerHTML = htmlGalleria;
  }

  const boxRecensioni = document.querySelector("#recensioniGrid2");
  if (boxRecensioni) {
    // Nel sito le recensioni vanno mostrate nell'ordine: Erik, Camilo, Marco
    const tutteLeRecensioni = dati.recensioni_home || [];
    const ordine = [1, 0, 2];
    let htmlRecensioni = "";
    ordine.forEach(function (indice) {
      const recensione = tutteLeRecensioni[indice];
      if (recensione) {
        htmlRecensioni += `
          <div class="recensione-card">
            <img src="${recensione.immagine || ""}" alt="${recensione.autore}" loading="lazy" decoding="async">
            <p>&ldquo;${recensione.testo}&rdquo;</p>
            <div class="autore">${recensione.autore}</div>
          </div>
        `;
      }
    });
    boxRecensioni.innerHTML = htmlRecensioni;
  }
}
