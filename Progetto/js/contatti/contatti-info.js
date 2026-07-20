// ==========================================================
// CONTATTI-INFO.JS
// Riempie il banner, la scheda con indirizzo/telefono/email
// /orari/note, il referente e il link alla mappa
// ==========================================================

function mostraContattiInfo(dati) {
  const contatti = dati.contatti || {};

  // Sottotitolo del banner in alto
  const sottotitolo = document.querySelector("#bannerSub");
  sottotitolo.textContent =
    "Scrivici o chiamaci per informazioni sui corsi, le certificazioni e le prossime sessioni disponibili.";

  // Indirizzo e link alla mappa
  if (contatti.indirizzo) {
    const indirizzo = contatti.indirizzo;
    const testoIndirizzo =
      `${indirizzo.via}, ${indirizzo.cap} ${indirizzo.citta} (${indirizzo.regione}), ${indirizzo.paese}`;

    document.querySelector("#cIndirizzo").textContent = testoIndirizzo;

    const linkMappa = document.querySelector("#mappaLink");
    if (linkMappa && indirizzo.mappa) {
      linkMappa.href = indirizzo.mappa;
    }
  }

  // Telefono, email e orari
  document.querySelector("#cTelefono").textContent = contatti.telefono || "";
  document.querySelector("#cEmail").textContent = contatti.email || "";
  document.querySelector("#cOrari").textContent = contatti.orari_telefono || "";

  // Elenco puntato con le note sulla posizione (se presente)
  // .forEach(...) esegue la funzione per OGNI elemento dell'array:
  // qui, per ogni nota da mostrare nell'elenco puntato
  const listaNote = document.querySelector("#cNote");
  if (Array.isArray(contatti.note_posizione)) {
    let htmlNote = "";
    contatti.note_posizione.forEach(function (nota) {
      htmlNote += `<li>${nota}</li>`;
    });
    listaNote.innerHTML = htmlNote;
  }

  // Scheda del referente (foto, nome e ruolo)
  const boxReferente = document.querySelector("#cReferente");
  if (contatti.referente) {
    const referente = contatti.referente;
    boxReferente.innerHTML = `
      <img src="${referente.foto || ""}" alt="${referente.nome}">
      <div>
        <strong>${referente.nome}</strong>
        <span>${referente.ruolo}</span>
      </div>
    `;
  }
}
