/* =========================================================
   INKBOUND — motore per librogame
   ========================================================= */

const el = id => document.getElementById(id);

/* Libro incorporato, usato come fallback quando la cartella
   libri/ non è raggiungibile via fetch (es. apertura con
   doppio click, senza server locale). */
const LIBRO_FALLBACK = {
  "titolo": "Il Cuore di Vetro",
  "sottotitolo": "Un'avventura alla Villa Aurea",
  "autore": "Inkbound — libro dimostrativo",
  "usa_statistiche": true,
  "usa_inventario": true,
  "statistiche_iniziali": { "Ingegno": 7, "Coraggio": 7, "Vita": 20 },
  "inventario_iniziale": [],
  "sezione_iniziale": "1",
  "sezioni": {
    "1": {
      "testo": [
        "Una busta color avorio, sigillata con ceralacca a forma di rosa, vi ha condotto fin qui: alla Villa Aurea, dimora di vetro e ferro battuto sospesa sul limite della città, dove ogni finestra sembra respirare come la corolla di un fiore notturno.",
        "La lettera non porta firma, solo un invito: «Venite a vedere ciò che nessuno crede più possibile». Davanti a voi due strade: il portone principale, tra vetrate istoriate che ardono di luce dorata, oppure un sentiero laterale che scompare tra le foglie di un giardino d'inverno."
      ],
      "scelte": [
        { "testo": "Entrate dal portone principale", "vai": "2" },
        { "testo": "Seguite il sentiero verso il giardino d'inverno", "vai": "3" }
      ]
    },
    "2": {
      "testo": [
        "Il salone vi accoglie con un tepore quasi vegetale: colonne di ferro si arrampicano verso l'alto per sbocciare in capitelli a forma di ninfea. Al centro, la Contessa Serpentine vi osserva da dietro un ventaglio di piume di pavone.",
        "«Un altro cercatore» sussurra, con un sorriso che non promette nulla di buono né di innocente. «Ditemi, siete venuti per la Torre?»"
      ],
      "scelte": [
        { "testo": "Chiedetele della Torre di Vetro", "vai": "4" },
        { "testo": "Ignoratela e salite la scala a chiocciola", "vai": "5" },
        { "testo": "Sfidatela apertamente a lasciarvi passare", "condizione": { "stat": "Coraggio", "op": ">=", "valore": 9 }, "vai": "5" }
      ]
    },
    "3": {
      "testo": [
        "Tra felci enormi e orchidee color della notte, qualcosa scintilla a terra: una spilla di ottone a forma di rosa, dimenticata forse da un'altra ospite o lasciata lì di proposito.",
        "La raccogliete: è fredda, ma il suo stelo sembra scaldarsi al contatto con la pelle, quasi riconoscesse una mano amica."
      ],
      "effetti": [ { "tipo": "aggiungi_oggetto", "oggetto": "Spilla a forma di rosa" } ],
      "scelte": [
        { "testo": "Tornate verso l'ingresso e raggiungete il salone", "vai": "2" },
        { "testo": "Proseguite verso una porta di ferro battuto nel muro di vetro", "vai": "5" }
      ]
    },
    "4": {
      "testo": [
        "«La Torre» dice la Contessa, socchiudendo gli occhi «è più vecchia della Villa stessa. Dicono custodisca un cuore che batte di luce propria. Molti sono saliti. Pochi sono scesi con qualcosa da raccontare.»",
        "Vi indica, con un cenno appena percettibile, una scala che si arrampica oltre una porta di ferro battuto."
      ],
      "scelte": [ { "testo": "Ringraziatela e dirigetevi verso la Torre", "vai": "5" } ]
    },
    "5": {
      "testo": [
        "Ai piedi della Torre di Vetro, un cancello a spirale di ferro battuto sbarra la strada: al centro, un incavo a forma di rosa attende qualcosa che possiate posarvi dentro.",
        "Senza l'oggetto giusto, il meccanismo resta muto come una conchiglia vuota."
      ],
      "scelte": [
        { "testo": "Posate la spilla a forma di rosa nell'incavo", "richiede_oggetto": "Spilla a forma di rosa", "vai": "6" },
        { "testo": "Cercate un'altra via, tra le ombre del giardino", "vai": "3" },
        { "testo": "Provate a convincere un maggiordomo d'automa nei pressi", "vai": "7" }
      ]
    },
    "6": {
      "testo": [
        "Il cancello si apre con un sospiro di ingranaggi, come se la Torre stessa vi avesse riconosciuti. All'interno, un ascensore di ferro e vetro pulsa di una luce ambrata.",
        "Sul pavimento, una chiave di ottone dimenticata riflette la luce in mille schegge dorate."
      ],
      "effetti": [ { "tipo": "aggiungi_oggetto", "oggetto": "Chiave di ottone" } ],
      "scelte": [ { "testo": "Salite con l'ascensore verso la sommità della Torre", "vai": "8" } ]
    },
    "7": {
      "testo": [
        "Un maggiordomo meccanico, tutto ottone e occhi di vetro smerigliato, vi blocca il passo con un inchino perfetto e irremovibile. «Il passaggio» recita con voce metallica «è concesso solo a chi sa rispondere con ingegno.»"
      ],
      "prova": {
        "descrizione": "Prova di Ingegno — il maggiordomo pone un enigma sulla natura della luce",
        "stat": "Ingegno", "dadi": 2, "soglia": 9,
        "successo": "6", "fallimento": "2"
      }
    },
    "8": {
      "testo": [
        "In cima alla Torre, una serra di vetro custodisce un giardino impossibile: fiori di cristallo che pulsano come cuori, e al centro, sospeso in una struttura di petali metallici, il Guardiano di Cristallo si anima al vostro passo, il volto una maschera liscia e senza espressione."
      ],
      "combattimento": { "nome": "Guardiano di Cristallo", "abilita": 7, "vita": 9, "vittoria": "9", "sconfitta": "fine_sconfitta" },
      "scelte": [ { "testo": "Usate la chiave di ottone per disattivare il meccanismo del Guardiano", "richiede_oggetto": "Chiave di ottone", "vai": "10" } ]
    },
    "9": {
      "testo": [ "Il Guardiano si piega su se stesso con un ultimo bagliore, i petali metallici che lo componevano si aprono come una corolla sconfitta. Al centro della serra, il Cuore di Vetro pulsa, sospeso in un fascio di luce dorata." ],
      "scelte": [
        { "testo": "Afferrate il Cuore e correte verso l'uscita", "vai": "fine_vittoria" },
        { "testo": "Avvicinatevi per ascoltarne il battito, prima di prenderlo", "vai": "11" }
      ]
    },
    "10": {
      "testo": [
        "La chiave scivola in una fessura nascosta tra i petali metallici: il Guardiano si immobilizza in un ultimo inchino silenzioso, come sollevato di essere stato liberato da un compito troppo lungo.",
        "Il Cuore di Vetro, ora scoperto, pulsa piano nella serra silenziosa."
      ],
      "scelte": [
        { "testo": "Afferrate il Cuore e correte verso l'uscita", "vai": "fine_vittoria" },
        { "testo": "Avvicinatevi per ascoltarne il battito, prima di prenderlo", "vai": "11" }
      ]
    },
    "11": {
      "testo": [
        "Appoggiando la mano al Cuore, non sentite vetro, ma qualcosa che assomiglia a un respiro. Una voce, non udita ma sentita nelle ossa, vi parla: «Ogni tanto qualcuno arriva fin qui. Alcuni prendono e fuggono. Ad altri, offro di restare, e di custodire ciò che ho custodito io, per un tempo che non si misura in anni.»",
        "Il giardino di cristallo attende, sospeso, la vostra risposta."
      ],
      "scelte": [
        { "testo": "Accettate di diventare il nuovo Guardiano", "vai": "fine_segreto" },
        { "testo": "Rifiutate, e fuggite con il Cuore stretto al petto", "vai": "fine_vittoria" }
      ]
    },
    "fine_vittoria": {
      "testo": [
        "Scendete dalla Torre con il Cuore di Vetro che scalda il palmo come un piccolo sole. La Villa Aurea, alle vostre spalle, sembra spegnersi di un poco, come una candela che ha ceduto la sua fiamma a un'altra.",
        "Nei mesi a venire, si racconterà di voi come di chi è salito su una torre impossibile ed è tornato con qualcosa da raccontare — cosa rara, alla Villa Aurea."
      ],
      "finale": true, "esito": "vittoria"
    },
    "fine_sconfitta": {
      "testo": [
        "Il Guardiano di Cristallo vi stringe in un abbraccio di petali metallici che non concede scampo. L'ultima cosa che vedete è la vostra immagine moltiplicata all'infinito nelle facce di vetro che compongono il suo volto, mentre diventate voi stessi un ornamento della serra.",
        "La Torre di Vetro, ancora una volta, ha trovato un nuovo fiore da custodire."
      ],
      "finale": true, "esito": "sconfitta"
    },
    "fine_segreto": {
      "testo": [
        "Restate. Il vostro corpo si fa leggero, poi luminoso, poi diventa parte del giardino di cristallo, un petalo tra i petali, un battito tra i battiti.",
        "Da qualche parte, tra molti anni, un'altra busta color avorio verrà scritta e sigillata con ceralacca a forma di rosa — e sarete voi, in un certo senso, a deciderne il destinatario."
      ],
      "finale": true, "esito": "segreto"
    }
  }
};

/* ======================= STATO GLOBALE ======================= */
let libro = null;
let manifestCache = null; // elenco libri disponibile (se il manifest è stato letto con successo)
let stato = {
  sezioneCorrente: null,
  statistiche: {},
  inventario: [],
  visitate: new Set(),
  nemicoCorrente: null,
  logCombattimento: []
};

/* ======================= AVVIO: manifest o fallback ======================= */
async function avvia(){
  try{
    const resp = await fetch('libri/manifest.json');
    if(!resp.ok) throw new Error('manifest non raggiungibile');
    const manifest = await resp.json();
    if(!manifest.libri || !manifest.libri.length) throw new Error('manifest vuoto');
    manifestCache = manifest.libri;
    mostraLibreria(manifestCache);
  }catch(err){
    manifestCache = null;
    el('fallback-note').hidden = false;
    el('fallback-note').textContent = 'Impossibile leggere automaticamente la cartella dei libri (serve un server locale per usare la libreria). Avvio la demo incorporata — puoi comunque caricare qualunque libro a mano con "Carica un libro".';
    iniziaLibro(LIBRO_FALLBACK);
  }
}

/* ======================= LIBRERIA DEI LIBRI ======================= */
function mostraLibreria(elenco){
  libro = null;
  el('engine-title').classList.remove('compact');
  el('engine-tagline').classList.remove('compact');
  el('book-header').hidden = true;
  impostaSchedaMenu();

  const page = el('page');
  page.innerHTML = '';
  const label = document.createElement('div');
  label.className = 'section-label';
  label.textContent = '~ Scegli un libro ~';
  page.appendChild(label);

  const intro = document.createElement('p');
  intro.className = 'library-intro';
  intro.textContent = 'Ogni copertina custodisce un bivio diverso.';
  page.appendChild(intro);

  const list = document.createElement('div');
  list.className = 'library-list';
  elenco.forEach(voce => {
    const card = document.createElement('div');
    card.className = 'library-card';
    card.innerHTML = `<h3>${voce.titolo || voce.file}</h3>
      <div class="meta">${[voce.autore, voce.genere].filter(Boolean).join(' — ')}</div>`;
    card.onclick = () => caricaLibroDaLibreria(voce.file);
    list.appendChild(card);
  });
  page.appendChild(list);
}

async function caricaLibroDaLibreria(nomeFile){
  try{
    const resp = await fetch('libri/' + nomeFile);
    if(!resp.ok) throw new Error('file non trovato: ' + nomeFile);
    const dati = await resp.json();
    iniziaLibro(dati);
  }catch(err){
    alert('Impossibile caricare il libro: ' + err.message);
  }
}

function tornaAllaLibreria(){
  if(manifestCache){
    mostraLibreria(manifestCache);
  }
}

/* ======================= STATO DELLA SCHEDA (#sheet) =======================
   Il div #sheet resta sempre visibile. Cambia solo il contenuto:
   - in modalità "menù" (nessun libro caricato): titolo "Menù", solo i
     pulsanti che hanno senso senza una partita in corso.
   - in modalità "gioco": titolo abituale, statistiche/inventario mostrati
     o nascosti in base ai flag del libro, e tutti i pulsanti disponibili. */
function impostaSchedaMenu(){
  el('sheet-title').textContent = 'Menù';
  el('stats-section').classList.add('hidden');
  el('inventory-section').classList.add('hidden');
  el('btn-libreria').hidden = true;
  el('btn-esporta').hidden = true;
  el('btn-importa').hidden = true;
  el('btn-ricomincia').hidden = true;
  el('btn-carica-libro').hidden = false;
  el('btn-guida').hidden = false;
}

function impostaSchedaGioco(){
  el('sheet-title').textContent = 'Taccuino del Viaggiatore';
  el('btn-esporta').hidden = false;
  el('btn-importa').hidden = false;
  el('btn-ricomincia').hidden = false;
  el('btn-carica-libro').hidden = false;
  el('btn-guida').hidden = false;
  el('btn-libreria').hidden = !manifestCache;
}

/* ======================= CICLO DI GIOCO ======================= */
function iniziaLibro(datiLibro){
  libro = datiLibro;
  stato = {
    sezioneCorrente: libro.sezione_iniziale,
    statistiche: { ...(libro.statistiche_iniziali || {}) },
    inventario: [ ...(libro.inventario_iniziale || []) ],
    visitate: new Set(),
    nemicoCorrente: null,
    logCombattimento: []
  };

  el('engine-title').classList.add('compact');
  el('engine-tagline').classList.add('compact');
  el('book-header').hidden = false;
  el('book-title').textContent = libro.titolo || 'Librogame';
  el('book-sub').textContent = libro.sottotitolo || libro.autore || '';
  impostaSchedaGioco();

  renderScheda();
  vaiASezione(stato.sezioneCorrente);
}

function usaStatistiche(){ return libro.usa_statistiche !== false; }
function usaInventario(){ return libro.usa_inventario !== false; }

function renderScheda(){
  const mostraStat = usaStatistiche();
  const mostraInv = usaInventario();

  el('stats-section').classList.toggle('hidden', !mostraStat);
  el('inventory-section').classList.toggle('hidden', !mostraInv);

  if(mostraStat){
    const statsBox = el('stats-container');
    statsBox.innerHTML = '';
    Object.entries(stato.statistiche).forEach(([nome, val]) => {
      const row = document.createElement('div');
      row.className = 'stat-row';
      row.innerHTML = `<span>${nome}</span><span class="val">${val}</span>`;
      statsBox.appendChild(row);
    });
  }

  if(mostraInv){
    const invBox = el('inventory-container');
    invBox.innerHTML = '';
    if(stato.inventario.length === 0){
      invBox.innerHTML = '<li class="empty">Nessun oggetto</li>';
    } else {
      stato.inventario.forEach(ogg => {
        const li = document.createElement('li');
        li.textContent = ogg;
        invBox.appendChild(li);
      });
    }
  }
}

function valutaCondizione(cond){
  if(!cond) return true;
  if(cond.stat){
    const v = stato.statistiche[cond.stat];
    const t = cond.valore;
    switch(cond.op){
      case '>': return v > t;
      case '>=': return v >= t;
      case '<': return v < t;
      case '<=': return v <= t;
      case '==': return v == t;
      case '!=': return v != t;
      default: return true;
    }
  }
  return true;
}

function applicaEffetti(effetti){
  (effetti || []).forEach(eff => {
    if(eff.tipo === 'aggiungi_oggetto'){
      if(!stato.inventario.includes(eff.oggetto)) stato.inventario.push(eff.oggetto);
    } else if(eff.tipo === 'rimuovi_oggetto'){
      stato.inventario = stato.inventario.filter(o => o !== eff.oggetto);
    } else if(eff.tipo === 'modifica_stat'){
      stato.statistiche[eff.stat] = (stato.statistiche[eff.stat] || 0) + eff.valore;
    } else if(eff.tipo === 'imposta_stat'){
      stato.statistiche[eff.stat] = eff.valore;
    }
  });
}

function tiraDadi(numDadi){
  let tot = 0;
  for(let i=0;i<numDadi;i++) tot += 1 + Math.floor(Math.random()*6);
  return tot;
}

function vaiASezione(id){
  const sezione = libro.sezioni[id];
  if(!sezione){
    el('page').innerHTML = `<p>⚠️ Sezione "${id}" non trovata nel libro.</p>`;
    return;
  }
  stato.sezioneCorrente = id;
  const primaVisita = !stato.visitate.has(id);
  stato.visitate.add(id);
  if(primaVisita){
    applicaEffetti(sezione.effetti);
  }
  renderScheda();
  renderPagina(sezione, id);
}

function renderPagina(sezione, id){
  const page = el('page');
  page.innerHTML = '';
  page.classList.remove('page');
  void page.offsetWidth;
  page.classList.add('page');

  const label = document.createElement('div');
  label.className = 'section-label';
  label.textContent = sezione.finale ? '~ Epilogo ~' : `§ ${id}`;
  page.appendChild(label);

  if(sezione.illustrazione){
    const img = document.createElement('img');
    img.className = 'section-illustration';
    img.src = sezione.illustrazione;
    img.alt = '';
    page.appendChild(img);
  }

  const testo = document.createElement('div');
  testo.className = 'testo';
  (sezione.testo || []).forEach(p => {
    const par = document.createElement('p');
    par.textContent = p;
    testo.appendChild(par);
  });
  page.appendChild(testo);

  if(sezione.finale){
    const esito = sezione.esito || 'neutro';
    const box = document.createElement('div');
    box.className = `ending ${esito}`;
    const titoli = {
      vittoria: '❧ Fine — Vittoria ❧',
      sconfitta: '❧ Fine — Sconfitta ❧',
      segreto: '❧ Fine — Il Segreto ❧',
      neutro: '❧ Fine ❧'
    };
    box.innerHTML = `<div class="titolo-esito">${titoli[esito] || titoli.neutro}</div>`;
    const btn = document.createElement('button');
    btn.className = 'btn-wax';
    btn.textContent = 'Ricomincia il racconto';
    btn.onclick = () => iniziaLibro(libro);
    box.appendChild(btn);
    if(manifestCache){
      const btnLib = document.createElement('button');
      btnLib.className = 'btn-wax';
      btnLib.style.marginLeft = '10px';
      btnLib.textContent = 'Torna alla libreria';
      btnLib.onclick = tornaAllaLibreria;
      box.appendChild(btnLib);
    }
    page.appendChild(box);
    return;
  }

  if(sezione.prova){
    renderProva(page, sezione.prova);
    return;
  }

  if(sezione.combattimento){
    renderCombattimento(page, sezione, id);
  }

  renderScelte(page, sezione);
}

function renderProva(page, prova){
  const box = document.createElement('div');
  box.className = 'prova-box';
  box.innerHTML = `<h4>${prova.descrizione || 'Prova di abilità'}</h4>
    <p style="font-family:'EB Garamond',serif;font-size:0.95rem;margin:0 0 10px;">
      Tirate ${prova.dadi} dad${prova.dadi>1?'i':'o'} e sommate il vostro punteggio di ${prova.stat}. Dovete raggiungere almeno ${prova.soglia}.
    </p>`;
  const btn = document.createElement('button');
  btn.className = 'btn-wax';
  btn.innerHTML = '<span class="dado">🎲</span> Tentate la prova';
  const esito = document.createElement('p');
  esito.style.fontFamily = "'EB Garamond', serif";
  esito.style.marginTop = '10px';
  btn.onclick = () => {
    btn.disabled = true;
    const dadoSpan = btn.querySelector('.dado');
    dadoSpan.classList.add('rolling');
    setTimeout(() => {
      const roll = tiraDadi(prova.dadi);
      const totale = roll + (stato.statistiche[prova.stat] || 0);
      const successo = totale >= prova.soglia;
      esito.textContent = `Tiro: ${roll} + ${prova.stat} (${stato.statistiche[prova.stat]}) = ${totale} → ${successo ? 'Successo!' : 'Fallimento.'}`;
      esito.style.color = successo ? 'var(--forest)' : 'var(--wine)';
      box.appendChild(esito);
      const btnProsegui = document.createElement('button');
      btnProsegui.className = 'btn-wax';
      btnProsegui.style.marginTop = '12px';
      btnProsegui.textContent = 'Proseguite';
      btnProsegui.onclick = () => vaiASezione(successo ? prova.successo : prova.fallimento);
      box.appendChild(btnProsegui);
    }, 450);
  };
  box.appendChild(btn);
  page.appendChild(box);
}

function renderCombattimento(page, sezione, id){
  if(!stato.nemicoCorrente || stato.nemicoCorrente.id !== id){
    stato.nemicoCorrente = { id, ...sezione.combattimento, vitaAttuale: sezione.combattimento.vita };
    stato.logCombattimento = [];
  }
  const nemico = stato.nemicoCorrente;
  const box = document.createElement('div');
  box.className = 'combat-box';
  box.innerHTML = `<h4>⚔ ${nemico.nome}</h4>
    <div class="nemico-riga">Abilità: ${nemico.abilita} — Vita: <span id="nemico-vita">${nemico.vitaAttuale}</span></div>
    <div class="nemico-riga">La vostra Vita: <span id="giocatore-vita">${stato.statistiche.Vita !== undefined ? stato.statistiche.Vita : '—'}</span></div>
    <div class="combat-log" id="combat-log"></div>`;
  const btn = document.createElement('button');
  btn.className = 'btn-wax';
  btn.textContent = 'Attaccate';
  box.appendChild(btn);
  page.appendChild(box);

  const logBox = box.querySelector('#combat-log');
  function scriviLog(msg){
    const riga = document.createElement('div');
    riga.textContent = msg;
    logBox.appendChild(riga);
    logBox.scrollTop = logBox.scrollHeight;
  }
  stato.logCombattimento.forEach(scriviLog);

  btn.onclick = () => {
    const statAttacco = Object.keys(stato.statistiche).find(k => k !== 'Vita') || 'Ingegno';
    const tuoTiro = tiraDadi(2) + (stato.statistiche[statAttacco] || 0);
    const nemicoTiro = tiraDadi(2) + nemico.abilita;
    let msg;
    if(tuoTiro >= nemicoTiro){
      nemico.vitaAttuale -= 2;
      msg = `Colpite! (voi ${tuoTiro} vs ${nemico.nome} ${nemicoTiro}) — Vita del nemico: ${Math.max(nemico.vitaAttuale,0)}`;
    } else {
      stato.statistiche.Vita = (stato.statistiche.Vita || 0) - 2;
      msg = `Siete colpiti! (voi ${tuoTiro} vs ${nemico.nome} ${nemicoTiro}) — La vostra Vita: ${stato.statistiche.Vita}`;
    }
    stato.logCombattimento.push(msg);
    scriviLog(msg);
    box.querySelector('#nemico-vita').textContent = Math.max(nemico.vitaAttuale,0);
    box.querySelector('#giocatore-vita').textContent = stato.statistiche.Vita;
    renderScheda();

    if(nemico.vitaAttuale <= 0){
      btn.disabled = true;
      stato.nemicoCorrente = null;
      setTimeout(() => vaiASezione(sezione.combattimento.vittoria), 700);
    } else if((stato.statistiche.Vita || 0) <= 0){
      btn.disabled = true;
      stato.nemicoCorrente = null;
      setTimeout(() => vaiASezione(sezione.combattimento.sconfitta), 700);
    }
  };
}

function renderScelte(page, sezione){
  const cont = document.createElement('div');
  cont.className = 'choices';
  (sezione.scelte || []).forEach(scelta => {
    if(scelta.richiede_oggetto && !stato.inventario.includes(scelta.richiede_oggetto)) return;
    if(scelta.non_richiede_oggetto && stato.inventario.includes(scelta.non_richiede_oggetto)) return;
    if(scelta.condizione && !valutaCondizione(scelta.condizione)) return;
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="arrow">❧</span>${scelta.testo}`;
    btn.onclick = () => {
      applicaEffetti(scelta.effetti);
      vaiASezione(scelta.vai);
    };
    cont.appendChild(btn);
  });
  page.appendChild(cont);
}

/* ======================= CONTROLLI UI ======================= */
el('btn-ricomincia').onclick = () => {
  if(!libro) return;
  if(confirm('Ricominciare da capo? I progressi non esportati andranno persi.')) iniziaLibro(libro);
};

el('btn-libreria').onclick = tornaAllaLibreria;

el('btn-guida').onclick = () => el('modal').classList.add('open');
el('btn-guida-2').onclick = () => el('modal').classList.add('open');
el('modal-close').onclick = () => el('modal').classList.remove('open');
el('modal').addEventListener('click', e => { if(e.target === el('modal')) el('modal').classList.remove('open'); });

el('toggleSheet').onclick = () => el('sheet').classList.toggle('open');

el('btn-carica-libro').onclick = () => el('file-carica').click();
el('file-carica').addEventListener('change', e => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    try{
      const dati = JSON.parse(evt.target.result);
      if(!dati.sezioni || !dati.sezione_iniziale) throw new Error('Formato non valido');
      iniziaLibro(dati);
    }catch(err){
      alert('Impossibile leggere il libro: ' + err.message);
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

el('btn-esporta').onclick = () => {
  if(!libro) return;
  const salvataggio = {
    titoloLibro: libro.titolo,
    sezioneCorrente: stato.sezioneCorrente,
    statistiche: stato.statistiche,
    inventario: stato.inventario,
    visitate: Array.from(stato.visitate)
  };
  const blob = new Blob([JSON.stringify(salvataggio, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'partita-salvata.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

el('btn-importa').onclick = () => el('file-importa').click();
el('file-importa').addEventListener('change', e => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    try{
      if(!libro) throw new Error('nessun libro caricato su cui applicare il salvataggio');
      const salvataggio = JSON.parse(evt.target.result);
      if(!libro.sezioni[salvataggio.sezioneCorrente]) throw new Error('salvataggio incompatibile con il libro attuale');
      stato.statistiche = salvataggio.statistiche;
      stato.inventario = salvataggio.inventario;
      stato.visitate = new Set(salvataggio.visitate || []);
      vaiASezione(salvataggio.sezioneCorrente);
    }catch(err){
      alert('Impossibile importare la partita: ' + err.message);
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

/* ======================= AVVIO ======================= */
avvia();
