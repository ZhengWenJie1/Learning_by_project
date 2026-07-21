// ==========================================================
// CORSO-SEO.JS
// Aggiorna meta description, canonical, Open Graph, Twitter
// Card e i dati strutturati (JSON-LD) in base al corso
// mostrato (letto da corso.html?id=...)
// ==========================================================

const SITE_URL = "https://www.dvformazione.it";
const OG_IMAGE_DEFAULT = "https://dvformazione.it/img/certificazione-petzl-dinamiche-verticali-formazione.jpg";

// Scrive (o aggiorna) un tag <meta> individuato da attributo+valore
function impostaMeta(attributo, valore, contenuto) {
  let tag = document.querySelector(`meta[${attributo}="${valore}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attributo, valore);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", contenuto);
}

// Scrive (o aggiorna) il link canonical
function impostaCanonical(url) {
  let tag = document.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", url);
}

// Inserisce (o sostituisce) lo script JSON-LD della pagina
function impostaJsonLd(oggetto) {
  let tag = document.querySelector('script[type="application/ld+json"]#corsoJsonLd');
  if (!tag) {
    tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.id = "corsoJsonLd";
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(oggetto, null, 2);
}

// Funzione principale: riceve il corso trovato e aggiorna tutta la SEO della pagina
function mostraSeoCorso(corso) {
  if (!corso) return;

  const immagine = ((corso.immagini && corso.immagini[0]) || "").replace(/^image\//, SITE_URL + "/image/");
  const urlPagina = SITE_URL + "/page/corso.html?id=" + encodeURIComponent(corso.id || "");
  const titolo = corso.titolo + " - Dinamiche Verticali Formazione";
  const descrizione = (corso.descrizione || "").slice(0, 155).trim();

  document.title = titolo;
  impostaMeta("name", "description", descrizione);
  impostaCanonical(urlPagina);

  impostaMeta("property", "og:type", "article");
  impostaMeta("property", "og:title", titolo);
  impostaMeta("property", "og:description", descrizione);
  impostaMeta("property", "og:image", immagine || OG_IMAGE_DEFAULT);
  impostaMeta("property", "og:url", urlPagina);

  impostaMeta("name", "twitter:card", "summary_large_image");
  impostaMeta("name", "twitter:title", titolo);
  impostaMeta("name", "twitter:description", descrizione);
  impostaMeta("name", "twitter:image", immagine || OG_IMAGE_DEFAULT);

  // Dati strutturati Course (schema.org), utili per i rich results di Google
  impostaJsonLd({
    "@context": "https://schema.org",
    "@type": "Course",
    "name": corso.titolo,
    "description": corso.descrizione || "",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Dinamiche Verticali Formazione",
      "sameAs": SITE_URL + "/"
    },
    "url": urlPagina,
    "image": immagine || OG_IMAGE_DEFAULT
  });
}
