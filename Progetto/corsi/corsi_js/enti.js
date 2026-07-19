// ==========================================================
// ENTI.JS
// Disegna la lista degli enti certificati (Dinamiche Verticali
// stessa, più le certificazioni presenti nel file JSON: PTI,
// IRATA, GWO). Ogni card porta alla pagina di dettaglio del
// singolo ente, tranne quella di Dinamiche Verticali che porta
// alla lista corsi sulla home
// ==========================================================

// Crea l'HTML di UNA card ente, a partire da logo, nome,
// descrizione e link del pulsante
function creaCardEnte(logo, nome, descrizione, link) {
  return `
    <div class="ente-card">
      <div class="ente-logo">
        <img src="${logo}" alt="${nome}">
      </div>
      <div class="ente-testo">
        <h2>${nome}</h2>
        <p>${descrizione}</p>
      </div>
      <a href="${link}" class="ente-btn">Maggiori informazioni</a>
    </div>
  `;
}

function mostraEnti(dati) {
  const contenitore = document.querySelector("#entiLista");
  if (!contenitore) return;

  let htmlLista = "";

  // Prima card: Dinamiche Verticali Formazione stessa, con link
  // alla pagina dei corsi sulla home
  const sito = dati.sito || {};
  htmlLista += creaCardEnte(
    sito.logo || "",
    sito.nome || "",
    sito.descrizione_breve || "",
    "../home/home.html#corsi"
  );

  // Una card per ogni ente presente in "certificazioni" nel JSON.
  // Il link porta alla pagina di dettaglio interna al sito, con la
  // sigla dell'ente scritta nell'indirizzo (es. ente.html?sigla=IRATA)
  const certificazioni = dati.certificazioni || [];
  certificazioni.forEach(function (certificazione) {
    const logo = (certificazione.loghi && certificazione.loghi.home_thumb) || "";
    const sigla = certificazione.nome.split(" - ")[0];

    htmlLista += creaCardEnte(
      logo,
      certificazione.nome,
      certificazione.descrizione || "",
      `../ente/ente.html?sigla=${sigla}`
    );
  });

  contenitore.innerHTML = htmlLista;
}
