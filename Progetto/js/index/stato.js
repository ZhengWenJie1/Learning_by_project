// ==========================================================
// STATO.JS
// Questo file deve essere caricato PRIMA di tutti gli altri
// perché contiene le variabili e i dati "condivisi", cioè
// quelli che servono anche agli altri file JS della pagina.
// ==========================================================

// Percorso del file JSON con tutti i dati del centro corsi
const JSON_PATH = "dati/dvformazione_data.json";

// Per ogni categoria di corso teniamo un id "corto", un nome da
// mostrare, un colore e un'icona (emoji)
const CATEGORIA_MAP = {
  "IRATA": { id: "irata", nome: "Irata", colore: "#d64f4f" },
  "GWO": { id: "gwo", nome: "GWO", colore: "#4f8fd6" },
  "PTI": { id: "pti", nome: "PTI", colore: "#7a5cd6" },
  "Fune D.Lgs. 81/08": { id: "fune", nome: "Fune", colore: "#e8935a" },
  "Lavori in Quota": { id: "quota", nome: "Quota", colore: "#3d3d3d" },
  "Soccorso": { id: "soccorso", nome: "Soccorso", colore: "#2d9c6f" },
  "Corsi Accreditati": { id: "accreditati", nome: "Accreditati", colore: "#c98a2c" }
};

const MESI = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
];

// ---- Variabili globali (lo "stato" della pagina) ----
// Le usiamo con "let" perché il loro valore cambia mentre l'utente
// usa la pagina (es. quando clicca su un filtro o scrive nella ricerca)
let DATI = null;                   // tutti i dati letti dal JSON
let categoriaAttiva = "tutti";     // filtro selezionato nella lista corsi
let testoRicerca = "";             // testo scritto nella ricerca corsi
let calCategoriaAttiva = "tutti";  // filtro selezionato nel calendario
let calMese = null;                // mese mostrato nel calendario
let eventiCalendario = [];         // sessioni corso da mostrare nel calendario

// Restituisce le informazioni (id, nome, colore, icona) di una categoria.
// Se la categoria non è nella mappa, restituiamo dei valori generici.
//
// Il simbolo || (chiamato OR) qui è un trucco molto usato: se la parte
// a sinistra è "falsa" o undefined, JavaScript usa automaticamente
// la parte a destra. Quindi: "usa CATEGORIA_MAP[nomeCategoria],
// ma se non esiste usa l'oggetto generico dopo il ||".
function categoriaInfo(nomeCategoria) {
  return CATEGORIA_MAP[nomeCategoria] || { id: "altro", nome: nomeCategoria, colore: "#888" };
}
