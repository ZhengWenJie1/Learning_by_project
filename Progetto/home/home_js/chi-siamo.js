// ==========================================================
// CHI-SIAMO.JS
// Disegna il testo, i numeri statistici e le card con le
// caratteristiche del centro nella sezione "Chi siamo"
// ==========================================================

function mostraChiSiamo(dati) {
  const testo = document.querySelector("#chiSiamoTesto");
  if (testo && dati.sito) {
    testo.innerHTML = `<strong>${dati.sito.nome}</strong> è l'unico ed esclusivo Petzl Technical Institute in Italia, centro di formazione certificato anche IRATA e GWO per il lavoro in quota, l'accesso su fune, il soccorso e i DPI anticaduta.`;
  }

  const boxStatistiche = document.querySelector("#statsBox");
  if (boxStatistiche) {
    const numeroCorsi = dati.corsi ? dati.corsi.length : 0;
    const statistiche = [
      { numero: "+18", etichetta: "Anni di esperienza" },
      { numero: numeroCorsi, etichetta: "Corsi disponibili" },
      { numero: "3.500+", etichetta: "Corsisti formati" },
      { numero: "1", etichetta: "Unico PTI in Italia" }
    ];

    let htmlStatistiche = "";
    statistiche.forEach(function (statistica) {
      htmlStatistiche += `
        <div class="stat">
          <div class="num">${statistica.numero}</div>
          <div class="label">${statistica.etichetta}</div>
        </div>
      `;
    });
    boxStatistiche.innerHTML = htmlStatistiche;
  }

  const boxCaratteristiche = document.querySelector("#featuresBox");
  if (boxCaratteristiche) {
    // Conta quanti corsi appartengono a una certa categoria.
    // .filter(...) tiene solo i corsi di quella categoria, poi
    // .length ci dice quanti sono rimasti.
    function contaCorsiPerCategoria(nomeCategoria) {
      return dati.corsi.filter(function (corso) {
        return corso.categoria === nomeCategoria;
      }).length;
    }

    const caratteristiche = [
      { icona: "📈", titolo: "Sede iscritta a Petzl Solution", descrizione: `${contaCorsiPerCategoria("PTI")} corsi PTI disponibili` },
      { icona: "🔄", titolo: "Corsi per rivenditori e revisioni", descrizione: "Moduli dedicati a rivenditori e centri di revisione DPI" },
      { icona: "✅", titolo: "Centro certificato IRATA e GWO", descrizione: `${contaCorsiPerCategoria("IRATA") + contaCorsiPerCategoria("GWO")} corsi tra IRATA e GWO` },
      { icona: "📘", titolo: "Formazione per addestratori finali", descrizione: `${contaCorsiPerCategoria("Corsi Accreditati")} corsi accreditati per formatori` }
    ];

    let htmlCaratteristiche = "";
    caratteristiche.forEach(function (voce) {
      htmlCaratteristiche += `
        <div class="feature-card">
          <div class="icon">${voce.icona}</div>
          <div>
            <div class="ftitle">${voce.titolo}</div>
            <div class="fdesc">${voce.descrizione}</div>
          </div>
        </div>
      `;
    });
    boxCaratteristiche.innerHTML = htmlCaratteristiche;
  }
}
