// ==========================================================
// PAGINA NEWS
// Carichiamo il JSON e mostriamo titolo, descrizione,
// contatti in barra laterale e una griglia di news di esempio
// ==========================================================

var JSON_PATH = "../data/dvformazione_data.json";

fetch(JSON_PATH)
  .then(function (risposta) {
    if (!risposta.ok) {
      throw new Error("Impossibile scaricare " + JSON_PATH);
    }
    return risposta.json();
  })
  .then(function (dati) {
    mostraLogo(dati.sito);
    mostraNews(dati);
  })
  .catch(function (errore) {
    console.error("Errore nel caricamento dei dati:", errore.message);
  });

// ---- LOGO nell'header ----
function mostraLogo(sito) {
  if (!sito) return;

  var immagineLogo = document.querySelector("#logoImg");
  var testoLogo = document.querySelector("#logoTesto");

  if (sito.logo && immagineLogo) {
    immagineLogo.src = sito.logo;
    immagineLogo.alt = sito.nome || "Logo";
    immagineLogo.style.display = "block";
    if (testoLogo) {
      testoLogo.style.display = "none";
    }
  }
}

// ---- Contenuto della pagina News ----
function mostraNews(dati) {
  var sito = dati.sito || {};
  var contatti = dati.contatti || {};

  // Titolo e descrizione principali
  document.querySelector("#newsTitolo").textContent = sito.nome || "";
  document.querySelector("#newsDescrizione").textContent = sito.descrizione_breve || "";

  // Link al portale news esterno (se presente)
  var linkEsterno = document.querySelector("#newsLinkEsterno");
  if (contatti.news_portal) {
    linkEsterno.href = contatti.news_portal;
  }

  // Contatti nella barra laterale
  if (contatti.indirizzo) {
    var indirizzo = contatti.indirizzo;
    var htmlContatti =
      indirizzo.via + ", " + indirizzo.cap + " " + indirizzo.citta + " (" + indirizzo.regione + ")<br>" +
      "Tel: " + (contatti.telefono || "") + "<br>" +
      "Email: " + (contatti.email || "") + "<br>" +
      "Orari: " + (contatti.orari_telefono || "");

    document.querySelector("#sidebarContatti").innerHTML = htmlContatti;
  }

  // Link social nella barra laterale
  var social = contatti.social || {};
  var reteSociali = [
    { chiave: "facebook", etichetta: "Facebook" },
    { chiave: "instagram", etichetta: "Instagram" },
    { chiave: "linkedin", etichetta: "LinkedIn" },
    { chiave: "youtube", etichetta: "YouTube" }
  ];

  var linkSocial = [];
  reteSociali.forEach(function (rete) {
    var url = social[rete.chiave];
    if (url) {
      linkSocial.push('<a href="' + url + '" target="_blank" rel="noopener">' + rete.etichetta + "</a>");
    }
  });
  document.querySelector("#sidebarSocial").innerHTML = linkSocial.join("<br>");

  // Griglia di news di esempio, con le immagini prese dal carosello della home
  var immagini = (dati.immagini_tutte && dati.immagini_tutte.carosello_home) || [];
  var portale = contatti.news_portal || "#";

  var newsDiEsempio = [
    { titolo: "Nuove sessioni corsi PTI 2026", data: "10 Lug 2026" },
    { titolo: "Aggiornamento normativa DPI anticaduta", data: "02 Lug 2026" },
    { titolo: "IRATA: date esame Torino", data: "24 Giu 2026" },
    { titolo: "Corso GWO BST: cosa aspettarsi", data: "15 Giu 2026" }
  ];

  var htmlGriglia = "";
  for (var i = 0; i < newsDiEsempio.length; i++) {
    var news = newsDiEsempio[i];
    var immagine = immagini.length ? immagini[i % immagini.length] : "";

    htmlGriglia +=
      '<a class="news-card" href="' + portale + '" target="_blank" rel="noopener">' +
      '<div class="news-img" style="background-image:url(\'' + immagine + '\');"></div>' +
      '<div class="news-body">' +
      '<div class="news-title">' + news.titolo + "</div>" +
      '<div class="news-meta">' + news.data + "</div>" +
      "</div>" +
      "</a>";
  }
  document.querySelector("#newsGrid").innerHTML = htmlGriglia;
}
