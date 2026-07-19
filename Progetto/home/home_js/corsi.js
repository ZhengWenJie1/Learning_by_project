// ==========================================================
// CORSI.JS
// I pulsanti filtro per categoria e la ricerca testuale
// ==========================================================

// Restituisce l'elenco delle categorie presenti nei corsi, senza ripetizioni
//
// corsi.forEach(...) vuol dire: "per ogni corso dentro l'array corsi,
// esegui questa funzione". È come un ciclo for, ma più semplice da leggere.
function elencoCategorie(corsi) {
  const categorieGiaViste = [];
  const elenco = [];

  corsi.forEach(function (corso) {
    // indexOf restituisce -1 se il valore NON è nell'array:
    // qui controlliamo "questa categoria l'ho già vista?"
    if (categorieGiaViste.indexOf(corso.categoria) === -1) {
      categorieGiaViste.push(corso.categoria);
      elenco.push(categoriaInfo(corso.categoria));
    }
  });

  return elenco;
}

// Disegna i bottoni dei filtri ("Tutti i corsi", "Irata", "GWO", ...)
// e collega anche la ricerca testuale
function mostraFiltriCorsi(corsi) {
  corsi = corsi || [];
  const contenitore = document.querySelector("#filters");
  if (!contenitore) return;

  contenitore.innerHTML = "";

  // dataset.categoria crea/legge l'attributo HTML "data-categoria"
  // sul bottone: è un modo per "attaccare" un'informazione extra
  // a un elemento della pagina, che poi possiamo rileggere dopo.
  const bottoneTutti = document.createElement("button");
  bottoneTutti.textContent = "Tutti i corsi";
  bottoneTutti.dataset.categoria = "tutti";
  bottoneTutti.classList.add("selected");
  contenitore.appendChild(bottoneTutti);

  elencoCategorie(corsi).forEach(function (categoria) {
    const bottone = document.createElement("button");
    bottone.textContent = categoria.nome;
    bottone.dataset.categoria = categoria.id;
    contenitore.appendChild(bottone);
  });

  // Invece di mettere un addEventListener su OGNI bottone, ne mettiamo
  // uno solo sul contenitore: quando l'utente clicca dentro, controlliamo
  // su cosa esattamente ha cliccato con evento.target.
  // closest("button") risale dal punto cliccato fino a trovare il
  // <button> più vicino (utile se si clicca su un'icona dentro al bottone).
  contenitore.addEventListener("click", function (evento) {
    const bottone = evento.target.closest("button");
    if (!bottone) return; // il clic non era su un bottone, non facciamo nulla

    contenitore.querySelectorAll("button").forEach(function (b) {
      b.classList.remove("selected");
    });
    bottone.classList.add("selected");

    categoriaAttiva = bottone.dataset.categoria;
    mostraGrigliaCorsi(DATI.corsi);
  });

  const campoRicerca = document.querySelector("#searchInput");
  if (campoRicerca) {
    campoRicerca.addEventListener("input", function (evento) {
      testoRicerca = evento.target.value.trim().toLowerCase();
      mostraGrigliaCorsi(DATI.corsi);
    });
  }
}
