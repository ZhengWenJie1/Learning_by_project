// ==========================================================
// ENTE-SEO.JS
// Aggiorna meta description, canonical, Open Graph, Twitter
// Card e i dati strutturati (JSON-LD) in base all'ente
// mostrato (letto da ente.html?sigla=...)
// ==========================================================

const SITE_URL_ENTE = "https://www.dvformazione.it";
const OG_IMAGE_DEFAULT_ENTE = "https://dvformazione.it/img/certificazione-petzl-dinamiche-verticali-formazione.jpg";

function impostaMetaEnte(attributo, valore, contenuto) {
  let tag = document.querySelector(`meta[${attributo}="${valore}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attributo, valore);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", contenuto);
}

function impostaCanonicalEnte(url) {
  let tag = document.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", url);
}

function impostaJsonLdEnte(oggetto) {
  let tag = document.querySelector('script[type="application/ld+json"]#enteJsonLd');
  if (!tag) {
    tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.id = "enteJsonLd";
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(oggetto, null, 2);
}

// Funzione principale: riceve l'ente trovato e aggiorna tutta la SEO della pagina
function mostraSeoEnte(ente) {
  if (!ente) return;

  const parametri = new URLSearchParams(window.location.search);
  const siglaEnte = parametri.get("sigla") || sigla(ente.nome);
  const urlPagina = SITE_URL_ENTE + "/page/ente.html?sigla=" + encodeURIComponent(siglaEnte);
  const titolo = ente.nome + " - Dinamiche Verticali Formazione";
  const descrizione = (ente.descrizione || "").slice(0, 155).trim();
  const immagine = (ente.loghi && (ente.loghi.pagina_dedicata || ente.loghi.home_thumb)) || OG_IMAGE_DEFAULT_ENTE;

  document.title = titolo;
  impostaMetaEnte("name", "description", descrizione);
  impostaCanonicalEnte(urlPagina);

  impostaMetaEnte("property", "og:type", "website");
  impostaMetaEnte("property", "og:title", titolo);
  impostaMetaEnte("property", "og:description", descrizione);
  impostaMetaEnte("property", "og:image", immagine);
  impostaMetaEnte("property", "og:url", urlPagina);

  impostaMetaEnte("name", "twitter:card", "summary_large_image");
  impostaMetaEnte("name", "twitter:title", titolo);
  impostaMetaEnte("name", "twitter:description", descrizione);
  impostaMetaEnte("name", "twitter:image", immagine);

  impostaJsonLdEnte({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Formazione", "item": SITE_URL_ENTE + "/" },
      { "@type": "ListItem", "position": 2, "name": "Corsi", "item": SITE_URL_ENTE + "/page/corsi.html" },
      { "@type": "ListItem", "position": 3, "name": ente.nome, "item": urlPagina }
    ]
  });
}
