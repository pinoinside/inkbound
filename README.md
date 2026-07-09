# Inkbound — motore per librogame

## Struttura del progetto
```
inkbound/
├── index.html          → pagina principale
├── css/style.css        → stile Liberty/Art Nouveau
├── js/engine.js          → logica del motore
└── libri/
    ├── manifest.json               → elenco dei libri disponibili
    ├── il-cuore-di-vetro.json      → libro con statistiche, oggetti, prove, combattimento
    └── il-bivio-nel-bosco.json     → libro puramente narrativo (nessuna statistica/oggetto)
```

## Come avviarlo

**Opzione consigliata — con un server locale** (serve per vedere la libreria con l'elenco dei libri):
```
cd inkbound
python3 -m http.server 8000
```
poi apri `http://localhost:8000` nel browser.

**Opzione rapida — doppio click su `index.html`:**
funziona subito, ma il browser blocca la lettura automatica della cartella `libri/`
(limite di sicurezza dei file aperti con `file://`). Il motore avvia comunque una
demo incorporata ("Il Cuore di Vetro"), e puoi caricare qualsiasi libro a mano con
il pulsante "Carica un libro" nella scheda del personaggio.

## Aggiungere un nuovo libro
1. Crea un file `.json` dentro `libri/` seguendo lo schema descritto nella guida
   in-app (pulsante "Come scrivo un libro?" / "Guida al formato").
2. Aggiungilo all'elenco in `libri/manifest.json`.
3. Ricarica la pagina (con il server locale attivo) per vederlo nella libreria.

Se non vuoi toccare il manifest, puoi comunque provarlo da subito con
"Carica un libro (JSON)", senza bisogno di un server.

## Flag statistiche/inventario
Ogni libro può impostare, a livello di file JSON:
- `"usa_statistiche": true|false`
- `"usa_inventario": true|false`

Se assenti, valgono `true` di default. Se un libro imposta entrambi a `false`
(come `il-bivio-nel-bosco.json`), l'intera scheda del personaggio si nasconde
automaticamente.
