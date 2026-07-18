// ==========================================================
// HERO.JS
// Disegna l'immagine grande in cima alla pagina (hero) e la
// riga con i loghi dei partner/certificazioni sotto di essa
// ==========================================================

// Disegna la sezione hero con titolo, descrizione e pulsanti
function mostraHero(dati) {
  const immagine = dati.immagini_tutte.carosello_home[0];

  document.querySelector("#heroSlides").innerHTML = `
    <div class="hero-slide" style="background-image:linear-gradient(180deg, rgba(20,15,10,.35) 0%, rgba(15,10,6,.9) 90%), url('${immagine}');">
      <div class="hero-content">
        <h1>Formazione in quota, Dinamiche Verticali</h1>
        <p class="hero-desc">${dati.sito.descrizione_breve}</p>
        <div class="hero-actions">
          <a href="#corsi" class="btn btn-primary">Scopri i corsi</a>
          <a href="../contatti/contatti.html" class="btn btn-light">Contattaci</a>
        </div>
      </div>
    </div>
  `;
}

// Disegna i loghi dei partner/certificazioni sotto l'hero
function mostraLoghiPartner(dati) {
  const contenitore = document.querySelector("#heroPartners");
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
