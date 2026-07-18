// ==========================================================
// PAGINA HOME
// Carichiamo il file JSON con tutti i dati del centro corsi
// e riempiamo ogni sezione della pagina: slider, corsi,
// calendario, chi siamo, news, social, sede, footer
// ==========================================================

var JSON_PATH = "../data/dvformazione_data.json";

// Per ogni categoria di corso teniamo un id "corto", un nome da mostrare,
// un colore e un'icona (emoji)
var CATEGORIA_MAP = {
  "IRATA": { id: "irata", nome: "Irata", colore: "#d64f4f", icona: "\uD83E\uDDD7" },
  "GWO": { id: "gwo", nome: "GWO", colore: "#4f8fd6", icona: "\uD83C\uDF2C\uFE0F" },
  "PTI": { id: "pti", nome: "PTI", colore: "#7a5cd6", icona: "\u2699\uFE0F" },
  "Fune D.Lgs. 81/08": { id: "fune", nome: "Fune", colore: "#e8935a", icona: "\uD83E\uDE22" },
  "Lavori in Quota": { id: "quota", nome: "Quota", colore: "#3d3d3d", icona: "\uD83C\uDFD7\uFE0F" },
  "Soccorso": { id: "soccorso", nome: "Soccorso", colore: "#2d9c6f", icona: "\u26D1\uFE0F" },
  "Corsi Accreditati": { id: "accreditati", nome: "Accreditati", colore: "#c98a2c", icona: "\uD83C\uDF93" }
};

var MESI = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

// ---- Variabili globali (lo "stato" della pagina) ----
var DATI = null;               // tutti i dati letti dal JSON
var categoriaAttiva = "tutti"; // filtro selezionato nella lista corsi
var testoRicerca = "";         // testo scritto nella ricerca corsi
var calCategoriaAttiva = "tutti"; // filtro selezionato nel calendario
var calMese = null;            // mese mostrato nel calendario
var eventiCalendario = [];     // lista delle sessioni corso da mostrare nel calendario

// Scarichiamo il JSON e, quando è pronto, avviamo la pagina con init()
fetch(JSON_PATH)
  .then(function (risposta) {
    if (!risposta.ok) {
      throw new Error("Impossibile scaricare " + JSON_PATH);
    }
    return risposta.json();
  })
  .then(function (dati) {
    DATI = dati;
    init(dati);
  })
  .catch(function (errore) {
    console.error("Errore nel caricamento dei dati:", errore.message);
  });

// Restituisce le informazioni (id, nome, colore, icona) di una categoria.
// Se la categoria non è nella mappa, restituiamo dei valori generici.
function categoriaInfo(nomeCategoria) {
  return CATEGORIA_MAP[nomeCategoria] || { id: "altro", nome: nomeCategoria, colore: "#888", icona: "\uD83D\uDCCC" };
}

// Punto di partenza: chiama, in ordine, tutte le funzioni che riempiono la pagina
function init(dati) {
  mostraLogo(dati.sito);
  mostraHero(dati);
  mostraLoghiPartner(dati);
  mostraFiltriCorsi(dati.corsi);
  mostraGrigliaCorsi(dati.corsi);
  mostraChiSiamo(dati);
  mostraNews(dati);
  mostraSocial(dati.contatti ? dati.contatti.social : {});
  mostraSede(dati);
  mostraFooter(dati);

  costruisciEventiCalendario(dati.corsi);
  mostraFiltriCalendario(dati.corsi);
  calMese = primoGiornoDelMese(new Date());
  mostraCalendario();

  attivaRicercaNavbar();
  attivaSchedeVista();
}

// ---- LOGO azienda (header) ----
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

// ==========================================================
// HERO (l'immagine grande in cima alla home)
// ==========================================================
function mostraHero(dati) {
  var immagine = dati.immagini_tutte.carosello_home[0];

  document.querySelector("#heroSlides").innerHTML =
    '<div class="hero-slide" style="background-image:linear-gradient(180deg, rgba(20,15,10,.35) 0%, rgba(15,10,6,.9) 90%), url(\'' + immagine + '\');">' +
    '<div class="hero-content">' +
    '<h1>Formazione in quota, Dinamiche Verticali</h1>' +
    '<p class="hero-desc">' + dati.sito.descrizione_breve + '</p>' +
    '<div class="hero-actions">' +
    '<a href="#corsi" class="btn btn-primary">Scopri i corsi</a>' +
    '<a href="../contatti/contatti.html" class="btn btn-light">Contattaci</a>' +
    '</div></div></div>';
}

// ---- Loghi dei partner/certificazioni sotto l'hero ----
function mostraLoghiPartner(dati) {
  var contenitore = document.querySelector("#heroPartners");
  if (!contenitore) return;

  contenitore.innerHTML = "";

  var certificazioni = dati.certificazioni || [];
  certificazioni.forEach(function (certificazione) {
    var link = document.createElement("a");
    link.href = certificazione.pagina || "#";
    link.target = "_blank";
    link.rel = "noopener";

    var immagine = document.createElement("img");
    immagine.src = (certificazione.loghi && (certificazione.loghi.footer || certificazione.loghi.home_thumb)) || "";
    immagine.alt = certificazione.nome;

    link.appendChild(immagine);
    contenitore.appendChild(link);
  });
}

// ==========================================================
// FILTRI E GRIGLIA CORSI
// ==========================================================

// Restituisce l'elenco delle categorie presenti nei corsi, senza ripetizioni
function elencoCategorie(corsi) {
  var categorieGiaViste = [];
  var elenco = [];

  corsi.forEach(function (corso) {
    if (categorieGiaViste.indexOf(corso.categoria) === -1) {
      categorieGiaViste.push(corso.categoria);
      elenco.push(categoriaInfo(corso.categoria));
    }
  });

  return elenco;
}

// Disegna i bottoni dei filtri ("Tutti i corsi", "Irata", "GWO", ...) e la ricerca
function mostraFiltriCorsi(corsi) {
  corsi = corsi || [];
  var contenitore = document.querySelector("#filters");
  if (!contenitore) return;

  contenitore.innerHTML = "";

  var bottoneTutti = document.createElement("button");
  bottoneTutti.textContent = "Tutti i corsi";
  bottoneTutti.dataset.categoria = "tutti";
  bottoneTutti.classList.add("selected");
  contenitore.appendChild(bottoneTutti);

  elencoCategorie(corsi).forEach(function (categoria) {
    var bottone = document.createElement("button");
    bottone.textContent = categoria.nome;
    bottone.dataset.categoria = categoria.id;
    contenitore.appendChild(bottone);
  });

  // Un solo "ascoltatore" sul contenitore, che capisce su quale bottone si è cliccato
  contenitore.addEventListener("click", function (evento) {
    var bottone = evento.target.closest("button");
    if (!bottone) return;

    contenitore.querySelectorAll("button").forEach(function (b) {
      b.classList.remove("selected");
    });
    bottone.classList.add("selected");

    categoriaAttiva = bottone.dataset.categoria;
    mostraGrigliaCorsi(DATI.corsi);
  });

  var campoRicerca = document.querySelector("#searchInput");
  if (campoRicerca) {
    campoRicerca.addEventListener("input", function (evento) {
      testoRicerca = evento.target.value.trim().toLowerCase();
      mostraGrigliaCorsi(DATI.corsi);
    });
  }
}

// Disegna le card dei corsi, tenendo conto del filtro categoria e del testo cercato
function mostraGrigliaCorsi(corsi) {
  corsi = corsi || [];
  var griglia = document.querySelector("#coursesGrid");
  if (!griglia) return;

  // 1) Filtriamo per categoria
  var corsiFiltrati = corsi;
  if (categoriaAttiva !== "tutti") {
    corsiFiltrati = corsiFiltrati.filter(function (corso) {
      return categoriaInfo(corso.categoria).id === categoriaAttiva;
    });
  }

  // 2) Filtriamo per testo cercato (titolo o descrizione)
  if (testoRicerca) {
    corsiFiltrati = corsiFiltrati.filter(function (corso) {
      var titolo = corso.titolo.toLowerCase();
      var descrizione = (corso.descrizione || "").toLowerCase();
      return titolo.includes(testoRicerca) || descrizione.includes(testoRicerca);
    });
  }

  if (corsiFiltrati.length === 0) {
    griglia.innerHTML = '<p style="grid-column:1/-1;text-align:center;font-size:13px;color:#999;">Nessun corso trovato.</p>';
    return;
  }

  var htmlGriglia = "";
  corsiFiltrati.forEach(function (corso, indice) {
    var infoCategoria = categoriaInfo(corso.categoria);
    var immagine = (corso.immagini && corso.immagini[0]) || "";
    var prossimaSessione = (corso.sessioni_prossime && corso.sessioni_prossime[0]) || null;
    var etichettaNuovo = indice < 3 ? '<span class="badge-nuovo">Nuovo</span>' : "";
    var testoData = prossimaSessione
      ? "\uD83D\uDCC5 Prossima sessione: " + prossimaSessione
      : "\uD83D\uDCCD Torino \u2013 su richiesta";

    htmlGriglia +=
      '<a href="../corso/corso.html?id=' + corso.id + '" class="course-card">' +
      '<div class="img" style="background-image:url(\'' + immagine + '\');">' +
      etichettaNuovo +
      '<span class="badge" style="background:' + infoCategoria.colore + ';">' + infoCategoria.nome + "</span>" +
      "</div>" +
      '<div class="info">' +
      '<div class="title">' + corso.titolo + "</div>" +
      '<div class="date">' + testoData + "</div>" +
      '<div class="powered">' + (corso.durata || "") + "</div>" +
      "</div></a>";
  });

  griglia.innerHTML = htmlGriglia;
}

// ==========================================================
// CHI SIAMO
// ==========================================================
function mostraChiSiamo(dati) {
  var testo = document.querySelector("#chiSiamoTesto");
  if (testo && dati.sito) {
    testo.innerHTML =
      "<strong>" + dati.sito.nome + "</strong> è l'unico ed esclusivo Petzl Technical Institute in Italia, " +
      "centro di formazione certificato anche IRATA e GWO per il lavoro in quota, l'accesso su fune, il soccorso e i DPI anticaduta.";
  }

  var boxStatistiche = document.querySelector("#statsBox");
  if (boxStatistiche) {
    var numeroCorsi = dati.corsi ? dati.corsi.length : 0;
    var statistiche = [
      { numero: "+18", etichetta: "Anni di esperienza" },
      { numero: numeroCorsi, etichetta: "Corsi disponibili" },
      { numero: "3.500+", etichetta: "Corsisti formati" },
      { numero: "1", etichetta: "Unico PTI in Italia" }
    ];

    var htmlStatistiche = "";
    statistiche.forEach(function (statistica) {
      htmlStatistiche +=
        '<div class="stat"><div class="num">' + statistica.numero + '</div>' +
        '<div class="label">' + statistica.etichetta + "</div></div>";
    });
    boxStatistiche.innerHTML = htmlStatistiche;
  }

  var boxCaratteristiche = document.querySelector("#featuresBox");
  if (boxCaratteristiche) {
    // Conta quanti corsi appartengono a una certa categoria
    function contaCorsiPerCategoria(nomeCategoria) {
      return dati.corsi.filter(function (corso) {
        return corso.categoria === nomeCategoria;
      }).length;
    }

    var caratteristiche = [
      { icona: "\uD83D\uDCC8", titolo: "Sede iscritta a Petzl Solution", descrizione: contaCorsiPerCategoria("PTI") + " corsi PTI disponibili" },
      { icona: "\uD83D\uDD04", titolo: "Corsi per rivenditori e revisioni", descrizione: "Moduli dedicati a rivenditori e centri di revisione DPI" },
      { icona: "\u2705", titolo: "Centro certificato IRATA e GWO", descrizione: (contaCorsiPerCategoria("IRATA") + contaCorsiPerCategoria("GWO")) + " corsi tra IRATA e GWO" },
      { icona: "\uD83D\uDCD8", titolo: "Formazione per addestratori finali", descrizione: contaCorsiPerCategoria("Corsi Accreditati") + " corsi accreditati per formatori" }
    ];

    var htmlCaratteristiche = "";
    caratteristiche.forEach(function (voce) {
      htmlCaratteristiche +=
        '<div class="feature-card"><div class="icon">' + voce.icona + "</div>" +
        "<div><div class=\"ftitle\">" + voce.titolo + "</div>" +
        '<div class="fdesc">' + voce.descrizione + "</div></div></div>";
    });
    boxCaratteristiche.innerHTML = htmlCaratteristiche;
  }
}

// ==========================================================
// NEWS E AGGIORNAMENTI (in home)
// ==========================================================
function mostraNews(dati) {
  var griglia = document.querySelector("#newsGrid");
  if (!griglia) return;

  var portale = (dati.contatti && dati.contatti.news_portal) || "#";
  var immagini = (dati.immagini_tutte && dati.immagini_tutte.carosello_home) || [];

  var newsDiEsempio = [
    { titolo: "Nuove sessioni corsi PTI 2026", data: "10 Lug 2026", tempoLettura: "3 min" },
    { titolo: "Aggiornamento normativa DPI anticaduta", data: "02 Lug 2026", tempoLettura: "4 min" },
    { titolo: "IRATA: date esame Torino", data: "24 Giu 2026", tempoLettura: "2 min" },
    { titolo: "Corso GWO BST: cosa aspettarsi", data: "15 Giu 2026", tempoLettura: "5 min" }
  ];

  var htmlGriglia = "";
  newsDiEsempio.forEach(function (news, indice) {
    var immagine = immagini.length ? immagini[indice % immagini.length] : "";
    htmlGriglia +=
      '<a class="news-card" href="' + portale + '" target="_blank" rel="noopener">' +
      '<div class="news-img" style="background-image:url(\'' + immagine + '\');">' +
      '<span class="badge-nuovo">News</span></div>' +
      '<div class="news-body">' +
      '<div class="news-title">' + news.titolo + "</div>" +
      '<div class="news-meta"><span>\uD83D\uDCC5 ' + news.data + '</span><span>\u23F1 ' + news.tempoLettura + "</span></div>" +
      '<span class="news-link">Leggi &rarr;</span>' +
      "</div></a>";
  });
  griglia.innerHTML = htmlGriglia;
}

// ==========================================================
// SOCIAL
// ==========================================================
function mostraSocial(social) {
  social = social || {};
  var riga = document.querySelector("#socialRow");
  if (riga) {
    var reteSociali = [
      { chiave: "facebook", etichetta: "Facebook", icona: "\uD83D\uDCD8" },
      { chiave: "instagram", etichetta: "Instagram", icona: "\uD83D\uDCF7" },
      { chiave: "linkedin", etichetta: "LinkedIn", icona: "\uD83D\uDCBC" },
      { chiave: "youtube", etichetta: "YouTube", icona: "\u25B6\uFE0F" }
    ];

    var htmlRiga = "";
    reteSociali.forEach(function (rete) {
      var url = social[rete.chiave];
      if (url) {
        htmlRiga +=
          '<a href="' + url + '" target="_blank" rel="noopener">' +
          '<span class="icon">' + rete.icona + "</span> " + rete.etichetta + "</a>";
      }
    });
    riga.innerHTML = htmlRiga;
  }

  var rigaVideo = document.querySelector("#socialVideoRow");
  if (rigaVideo && DATI && DATI.video) {
    var videoDaMostrare = DATI.video
      .filter(function (video) {
        return video.url.includes("youtube-nocookie");
      })
      .slice(0, 2);

    var htmlVideo = "";
    videoDaMostrare.forEach(function (video) {
      htmlVideo +=
        '<div class="social-video"><iframe src="' + video.url + '" title="' + video.titolo +
        '" frameborder="0" allowfullscreen loading="lazy"></iframe></div>';
    });
    rigaVideo.innerHTML = htmlVideo;
  }
}

// ==========================================================
// LA NOSTRA SEDE (galleria foto + recensioni)
// ==========================================================
function mostraSede(dati) {
  var sottotitolo = document.querySelector("#sedeSub");
  if (sottotitolo) {
    var citta = (dati.contatti && dati.contatti.indirizzo) ? dati.contatti.indirizzo.citta : "Torino";
    sottotitolo.textContent =
      "Un centro di formazione attrezzato a " + citta +
      ", con strutture dedicate all'addestramento pratico su fune, in quota e negli spazi confinati.";
  }

  var galleria = document.querySelector("#sedeGallery");
  if (galleria) {
    var immaginiSede = ((dati.immagini_tutte && dati.immagini_tutte.carosello_home) || []).slice(0, 3);
    var htmlGalleria = "";
    immaginiSede.forEach(function (immagine) {
      htmlGalleria += '<div class="g-item"><img src="' + immagine + '" alt="Sede Dinamiche Verticali"></div>';
    });
    galleria.innerHTML = htmlGalleria;
  }

  var boxRecensioni = document.querySelector("#recensioniGrid2");
  if (boxRecensioni) {
    var recensioni = dati.recensioni_home || [];
    var htmlRecensioni = "";
    recensioni.forEach(function (recensione) {
      htmlRecensioni +=
        '<div class="recensione-card"><img src="' + (recensione.immagine || "") + '" alt="' + recensione.autore + '">' +
        "<div><p>&ldquo;" + recensione.testo + "&rdquo;</p>" +
        '<div class="autore">' + recensione.autore + "</div></div></div>";
    });
    boxRecensioni.innerHTML = htmlRecensioni;
  }
}

// ==========================================================
// FOOTER
// ==========================================================
function mostraFooter(dati) {
  var azienda = dati.sito || {};
  var contatti = dati.contatti || {};

  var logoImmagine = document.querySelector("#footerLogoImg");
  var logoTesto = document.querySelector("#footerLogoTesto");
  if (azienda.logo && logoImmagine) {
    logoImmagine.src = azienda.logo;
    logoImmagine.alt = azienda.nome || "Logo";
    logoImmagine.style.display = "block";
    if (logoTesto) {
      logoTesto.style.display = "none";
    }
  }

  var partitaIva = document.querySelector("#footerPiva");
  if (partitaIva && azienda.piva) {
    partitaIva.textContent = "P.IVA " + azienda.piva;
  }

  var boxContatti = document.querySelector("#footerContatti");
  if (boxContatti) {
    var indirizzoTesto = "";
    if (contatti.indirizzo) {
      indirizzoTesto = contatti.indirizzo.via + ", " + contatti.indirizzo.cap + " " +
        contatti.indirizzo.citta + " (" + contatti.indirizzo.regione + ")";
    }
    boxContatti.innerHTML =
      "<h4>Contatti</h4>" +
      "<p>" + indirizzoTesto + "</p>" +
      "<p>" + (contatti.telefono || "") + "</p>" +
      "<p>" + (contatti.email || "") + "</p>" +
      "<p>" + (contatti.orari_telefono || "") + "</p>";
  }

  var footerSocial = document.querySelector("#footerSocial");
  if (footerSocial && contatti.social) {
    var social = contatti.social;
    var voci = [
      { url: social.facebook, icona: "\uD83D\uDCD8" },
      { url: social.instagram, icona: "\uD83D\uDCF7" },
      { url: social.linkedin, icona: "\uD83D\uDCBC" },
      { url: social.youtube, icona: "\u25B6\uFE0F" }
    ];

    var htmlSocial = "";
    voci.forEach(function (voce) {
      if (voce.url) {
        htmlSocial += '<a href="' + voce.url + '" target="_blank" rel="noopener">' + voce.icona + "</a>";
      }
    });
    footerSocial.innerHTML = htmlSocial;
  }
}

// ==========================================================
// CALENDARIO
// ==========================================================

// Legge quanti giorni dura un corso a partire da un testo tipo "3 giorni"
function contaGiorniDurata(durata) {
  if (!durata) return 1;
  var trovato = durata.match(/(\d+)\s*giorn/i);
  return trovato ? parseInt(trovato[1], 10) : 1;
}

// Trasforma una data scritta in formato italiano "gg/mm/aaaa" in un oggetto Date
function leggiDataItaliana(testo) {
  var parti = testo.split("/");
  var giorno = parseInt(parti[0], 10);
  var mese = parseInt(parti[1], 10);
  var anno = parseInt(parti[2], 10);
  return new Date(anno, mese - 1, giorno);
}

// Trasforma le "sessioni_prossime" di ogni corso in una lista di eventi calendario
function costruisciEventiCalendario(corsi) {
  corsi = corsi || [];
  eventiCalendario = [];

  corsi.forEach(function (corso) {
    var infoCategoria = categoriaInfo(corso.categoria);
    var giorni = contaGiorniDurata(corso.durata);
    var sessioni = corso.sessioni_prossime || [];

    sessioni.forEach(function (sessione) {
      eventiCalendario.push({
        inizio: leggiDataItaliana(sessione),
        giorni: giorni,
        categoria: infoCategoria.id,
        colore: infoCategoria.colore,
        titolo: corso.titolo,
        corsoId: corso.id
      });
    });
  });
}

// Disegna i filtri per categoria del calendario e collega i pulsanti mese prec./succ.
function mostraFiltriCalendario(corsi) {
  corsi = corsi || [];
  var contenitore = document.querySelector("#calFilters");
  if (!contenitore) return;

  contenitore.innerHTML = "";

  var bottoneTutti = document.createElement("button");
  bottoneTutti.textContent = "Tutti";
  bottoneTutti.dataset.categoria = "tutti";
  bottoneTutti.classList.add("selected");
  contenitore.appendChild(bottoneTutti);

  elencoCategorie(corsi).forEach(function (categoria) {
    var bottone = document.createElement("button");
    bottone.textContent = categoria.nome;
    bottone.dataset.categoria = categoria.id;
    contenitore.appendChild(bottone);
  });

  contenitore.addEventListener("click", function (evento) {
    var bottone = evento.target.closest("button");
    if (!bottone) return;

    contenitore.querySelectorAll("button").forEach(function (b) {
      b.classList.remove("selected");
    });
    bottone.classList.add("selected");

    calCategoriaAttiva = bottone.dataset.categoria;
    mostraCalendario();
  });

  document.querySelector("#calPrev").addEventListener("click", function () {
    calMese = new Date(calMese.getFullYear(), calMese.getMonth() - 1, 1);
    mostraCalendario();
  });

  document.querySelector("#calNext").addEventListener("click", function () {
    calMese = new Date(calMese.getFullYear(), calMese.getMonth() + 1, 1);
    mostraCalendario();
  });
}

// Restituisce il primo giorno del mese di una certa data
function primoGiornoDelMese(data) {
  return new Date(data.getFullYear(), data.getMonth(), 1);
}

// Controlla se due date cadono nello stesso giorno
function stessoGiorno(dataA, dataB) {
  return dataA.getFullYear() === dataB.getFullYear() &&
    dataA.getMonth() === dataB.getMonth() &&
    dataA.getDate() === dataB.getDate();
}

// Disegna la griglia del mese corrente, con le barre delle sessioni corso
function mostraCalendario() {
  var etichettaMese = document.querySelector("#calMeseLabel");
  var etichettaAnno = document.querySelector("#calAnno");
  var griglia = document.querySelector("#calGrid");
  var messaggioVuoto = document.querySelector("#calEmpty");
  if (!griglia) return;

  etichettaMese.textContent = MESI[calMese.getMonth()];
  etichettaAnno.textContent = calMese.getFullYear();

  var primoDelMese = new Date(calMese.getFullYear(), calMese.getMonth(), 1);
  var ultimoDelMese = new Date(calMese.getFullYear(), calMese.getMonth() + 1, 0);
  var giorniNelMese = ultimoDelMese.getDate();

  // Vogliamo che la settimana inizi di Lunedì (0) e finisca di Domenica (6)
  var casellaVuoteIniziali = primoDelMese.getDay() - 1;
  if (casellaVuoteIniziali < 0) {
    casellaVuoteIniziali = 6;
  }

  var eventiFiltrati = eventiCalendario;
  if (calCategoriaAttiva !== "tutti") {
    eventiFiltrati = eventiCalendario.filter(function (evento) {
      return evento.categoria === calCategoriaAttiva;
    });
  }

  var htmlCelle = "";
  for (var i = 0; i < casellaVuoteIniziali; i++) {
    htmlCelle += '<div class="cal-cell empty"></div>';
  }

  var giorniConEventi = 0;

  for (var giorno = 1; giorno <= giorniNelMese; giorno++) {
    var dataCorrente = new Date(calMese.getFullYear(), calMese.getMonth(), giorno);

    var eventiDelGiorno = eventiFiltrati.filter(function (evento) {
      var inizioEvento = new Date(evento.inizio.getFullYear(), evento.inizio.getMonth(), evento.inizio.getDate());
      var fineEvento = new Date(evento.inizio.getFullYear(), evento.inizio.getMonth(), evento.inizio.getDate() + evento.giorni - 1);
      return dataCorrente >= inizioEvento && dataCorrente <= fineEvento;
    });

    if (eventiDelGiorno.length > 0) {
      giorniConEventi++;
    }

    var htmlBarre = "";
    eventiDelGiorno.forEach(function (evento) {
      var isInizio = stessoGiorno(dataCorrente, evento.inizio);
      var testoBarra = isInizio ? evento.titolo : "\u2026" + evento.titolo;
      htmlBarre +=
        '<a class="cal-bar" href="../corso/corso.html?id=' + evento.corsoId + '" style="background:' + evento.colore +
        ';" title="' + evento.titolo + '">' + testoBarra + "</a>";
    });

    htmlCelle +=
      '<div class="cal-cell"><span class="cal-daynum">' + giorno + "</span>" +
      '<div class="cal-bars">' + htmlBarre + "</div></div>";
  }

  griglia.innerHTML = htmlCelle;
  messaggioVuoto.style.display = giorniConEventi === 0 ? "block" : "none";
}

// ==========================================================
// SCHEDE "CORSI" / "CALENDARIO"
// ==========================================================
function attivaSchedeVista() {
  var schede = document.querySelector("#viewTabs");
  var pannelloCorsi = document.querySelector("#viewCorsi");
  var pannelloCalendario = document.querySelector("#viewCalendario");
  if (!schede || !pannelloCorsi || !pannelloCalendario) return;

  function mostraVista(vista) {
    var isCalendario = vista === "calendario";
    pannelloCorsi.style.display = isCalendario ? "none" : "block";
    pannelloCalendario.style.display = isCalendario ? "block" : "none";

    schede.querySelectorAll(".view-tab").forEach(function (scheda) {
      scheda.classList.toggle("selected", scheda.dataset.view === vista);
    });
  }

  schede.addEventListener("click", function (evento) {
    var scheda = evento.target.closest(".view-tab");
    if (!scheda) return;
    mostraVista(scheda.dataset.view);
  });

  // I link della navbar/footer che puntano a #corsi o #calendario devono
  // selezionare la scheda giusta, invece di limitarsi a scorrere la pagina
  document.querySelectorAll('a[href$="#corsi"], a[href$="#calendario"]').forEach(function (link) {
    link.addEventListener("click", function (evento) {
      var href = link.getAttribute("href") || "";
      var vista = href.endsWith("#calendario") ? "calendario" : "corsi";
      var bersaglio = document.querySelector("#corsi");
      if (!bersaglio) return;

      evento.preventDefault();
      mostraVista(vista);
      bersaglio.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Se la pagina si apre direttamente su #calendario, mostriamo subito quella scheda
  var hashIniziale = window.location.hash.replace("#", "");
  mostraVista(hashIniziale === "calendario" ? "calendario" : "corsi");
}

// ==========================================================
// RICERCA NELLA NAVBAR
// ==========================================================
function attivaRicercaNavbar() {
  var bottoneRicerca = document.querySelector("#navSearchBtn");
  var contenitoreRicerca = document.querySelector(".nav-search-wrap");
  var campoRicerca = document.querySelector("#navSearchInput");
  if (!bottoneRicerca || !contenitoreRicerca || !campoRicerca) return;

  bottoneRicerca.addEventListener("click", function () {
    contenitoreRicerca.classList.toggle("open");
    if (contenitoreRicerca.classList.contains("open")) {
      campoRicerca.focus();
    }
  });

  campoRicerca.addEventListener("input", function (evento) {
    testoRicerca = evento.target.value.trim().toLowerCase();

    var campoRicercaPrincipale = document.querySelector("#searchInput");
    if (campoRicercaPrincipale) {
      campoRicercaPrincipale.value = evento.target.value;
    }
    mostraGrigliaCorsi(DATI.corsi);
  });

  campoRicerca.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
      document.querySelector("#corsi").scrollIntoView({ behavior: "smooth" });
    }
  });
}
