// ==========================================================
// SCHEDE.JS
// Fa funzionare le due schede "Corsi" e "Calendario": mostra
// il pannello giusto e tiene aggiornati i link della navbar
// e del footer che puntano a #corsi o #calendario
// ==========================================================

function attivaSchedeVista() {
  const schede = document.querySelector("#viewTabs");
  const pannelloCorsi = document.querySelector("#viewCorsi");
  const pannelloCalendario = document.querySelector("#viewCalendario");
  if (!schede || !pannelloCorsi || !pannelloCalendario) return;

  // Mostra un pannello e nasconde l'altro, in base alla vista scelta
  function mostraVista(vista) {
    const isCalendario = vista === "calendario";
    pannelloCorsi.style.display = isCalendario ? "none" : "block";
    pannelloCalendario.style.display = isCalendario ? "block" : "none";

    schede.querySelectorAll(".view-tab").forEach(function (scheda) {
      scheda.classList.toggle("selected", scheda.dataset.view === vista);
    });
  }

  schede.addEventListener("click", function (evento) {
    const scheda = evento.target.closest(".view-tab");
    if (!scheda) return;
    mostraVista(scheda.dataset.view);
  });

  // I link della navbar/footer che puntano a #corsi o #calendario devono
  // selezionare la scheda giusta, invece di limitarsi a scorrere la pagina
  document.querySelectorAll('a[href$="#corsi"], a[href$="#calendario"]').forEach(function (link) {
    link.addEventListener("click", function (evento) {
      const href = link.getAttribute("href") || "";
      const vista = href.endsWith("#calendario") ? "calendario" : "corsi";
      const bersaglio = document.querySelector("#corsi");
      if (!bersaglio) return;

      evento.preventDefault();
      mostraVista(vista);
      bersaglio.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Se la pagina si apre direttamente su #calendario, mostriamo subito quella scheda
  const hashIniziale = window.location.hash.replace("#", "");
  mostraVista(hashIniziale === "calendario" ? "calendario" : "corsi");
}
