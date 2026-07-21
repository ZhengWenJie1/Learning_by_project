// ==========================================================
// ENTE-CONTENUTO.JS
// Riempie le sezioni di testo della colonna principale:
// descrizione, destinatari e formatori
// ==========================================================

function mostraDescrizioneEnte(ente) {
  const sigla2 = ente.nome.split(" - ")[0];
  document.querySelector("#enteTitoloSezione").textContent = "Cos'è " + sigla2 + "?";
  document.querySelector("#enteDescrizione").textContent = ente.descrizione || "";
}

// Riempie l'elenco puntato dei destinatari, nascondendo la sezione
// se il campo non è presente nel JSON
function mostraDestinatariEnte(ente) {
  const blocco = document.querySelector("#enteDestinatariWrap");
  const lista = document.querySelector("#enteDestinatari");

  // Array.isArray controlla che "destinatari" sia davvero un array
  if (Array.isArray(ente.destinatari) && ente.destinatari.length > 0) {
    let html = "";
    ente.destinatari.forEach(function (destinatario) {
      html += `<li>${destinatario}</li>`;
    });
    lista.innerHTML = html;
  } else {
    blocco.style.display = "none";
  }
}

// Disegna la griglia dei formatori (foto, nome, ruolo)
function mostraFormatoriEnte(ente) {
  const blocco = document.querySelector("#formatoriWrap");
  const griglia = document.querySelector("#formatoriGriglia");

  if (Array.isArray(ente.formatori) && ente.formatori.length > 0) {
    let html = "";
    ente.formatori.forEach(function (formatore) {
      html += `
        <div class="formatore-card">
          <img src="${formatore.foto || ""}" alt="${formatore.nome}" loading="lazy" decoding="async">
          <div class="nome">${formatore.nome}</div>
          <div class="ruolo">${formatore.ruolo || ""}</div>
        </div>
      `;
    });
    griglia.innerHTML = html;
  } else {
    blocco.style.display = "none";
  }
}
