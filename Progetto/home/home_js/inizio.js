// ==========================================================
// INIZIO.JS
// Disegna la sezione di apertura della pagina (inizio) e la
// riga con i loghi dei partner/certificazioni sotto di essa
// ==========================================================

// Disegna la sezione di apertura con titolo, descrizione e pulsanti
function mostraInizio(dati) {
  const immagine = dati.immagini_tutte.carosello_home[0];

  document.querySelector("#inizioSlides").innerHTML = `
    <div class="inizio-slide" style="background-image:linear-gradient(180deg, rgba(20,15,10,.35) 0%, rgba(15,10,6,.9) 90%), url('${immagine}');">
      <div class="inizio-content">
        <h1>Formazione in quota, Dinamiche Verticali</h1>
        <p class="inizio-desc">${dati.sito.descrizione_breve}</p>
        <div class="inizio-actions">
          <a href="#corsi" class="btn btn-primary">Scopri i corsi</a>
          <a href="../contatti/contatti.html" class="btn btn-light">Contattaci</a>
        </div>
      </div>
    </div>
  `;
}

// Disegna i loghi dei partner/certificazioni sotto la sezione di apertura
function mostraLoghiPartner(dati) {
  const contenitore = document.querySelector("#inizioPartners");
  if (!contenitore) return;

  contenitore.innerHTML = "";

  const certificazioni = dati.certificazioni || [];
  certificazioni.forEach(function (certificazione) {
    const link = document.createElement("a");
    link.href = certificazione.pagina || "#";
    link.target = "_blank";
    link.rel = "noopener";

    const immagine = document.createElement("img");
    immagine.src = (certificazione.loghi && (certificazione.loghi.footer || certificazione.loghi.home_thumb)) || "";
    immagine.alt = certificazione.nome;

    link.appendChild(immagine);
    contenitore.appendChild(link);
  });
}
